/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect, useCallback } from 'react';

interface TypingTestState {
  currentWordIndex: number;
  currentCharIndex: number;
  userInput: string;
  isTestActive: boolean;
  isTestCompleted: boolean;
  timeLeft: number;
  correctChars: number;
  correctWords: number;
  totalChars: number;
  wpm: number;
  accuracy: number;
  errors: number;
  typedText: string;
}

export function useTypingTest(sampleText: string, testDuration: number = 30) {
  const [words, setWords] = useState(() => sampleText.split(' '));
  
  useEffect(() => {
    setWords(sampleText.split(' '));
  }, [sampleText]);
  
  const [state, setState] = useState<TypingTestState>({
    currentWordIndex: 0,
    currentCharIndex: 0,
    userInput: '',
    isTestActive: false,
    isTestCompleted: false,
    timeLeft: testDuration,
    correctChars: 0,
    correctWords: 0,
    totalChars: 0,
    wpm: 0,
    accuracy: 0,
    errors: 0,
    typedText: ''
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isTestActive && state.timeLeft > 0 && !state.isTestCompleted) {
      interval = setInterval(() => {
        setState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            return {
              ...prev,
              timeLeft: 0,
              isTestActive: false,
              isTestCompleted: true
            };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isTestActive, state.timeLeft, state.isTestCompleted]);

  // Calculate WPM and accuracy
  const calculateStats = useCallback(() => {
    const timeElapsed = testDuration - state.timeLeft;
    const minutes = timeElapsed / 60;
    // Standard WPM formula: (correct characters / 5) per minute
    const wordsTyped = state.correctChars / 5;
    const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
    const accuracy = state.totalChars > 0 ? Math.round((state.correctChars / state.totalChars) * 100) : 0;
    
    return { wpm, accuracy };
  }, [state.correctChars, state.totalChars, state.timeLeft, testDuration]);

  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    if (state.isTestCompleted) return;

    // Start test on first keypress
    if (!state.isTestActive) {
      setState(prev => ({ ...prev, isTestActive: true }));
    }

    setState(prev => {
      const newState = { ...prev };
      
      if (key === 'Backspace') {
        if (prev.typedText.length > 0) {
          newState.typedText = prev.typedText.slice(0, -1);
          // Recalculate position based on typed text
          const typedLength = newState.typedText.length;
          
          // Find current word and character position
          let charCount = 0;
          let wordIndex = 0;
          let charIndex = 0;
          
          for (let i = 0; i < words.length; i++) {
            if (charCount + words[i].length >= typedLength) {
              wordIndex = i;
              charIndex = typedLength - charCount;
              break;
            }
            charCount += words[i].length + 1; // +1 for space
          }
          
          newState.currentWordIndex = wordIndex;
          newState.currentCharIndex = charIndex;
        }
        return newState;
      }

      // Add character to typed text
      newState.typedText = prev.typedText + key;
      newState.totalChars = prev.totalChars + 1;

      // Get expected character from full text
      const fullText = words.join(' ');
      const expectedChar = fullText[prev.typedText.length];

      // Check if character is correct
      if (key === expectedChar) {
        newState.correctChars = prev.correctChars + 1;
      } else {
        newState.errors = prev.errors + 1;
      }

      // Check if a complete word was just finished (space typed or last char of last word)
      if (key === ' ' && expectedChar === ' ') {
        // A space was correctly typed, check if the previous word was completely correct
        const typedWords = newState.typedText.split(' ');
        const expectedWords = fullText.split(' ');
        const lastTypedWordIndex = typedWords.length - 1;
        
        if (lastTypedWordIndex < expectedWords.length && typedWords[lastTypedWordIndex] === expectedWords[lastTypedWordIndex]) {
          newState.correctWords = prev.correctWords + 1;
        }
      }

      // Update position based on typed text length
      let charCount = 0;
      let wordIndex = 0;
      let charIndex = 0;
      
      for (let i = 0; i < words.length; i++) {
        if (charCount + words[i].length >= newState.typedText.length) {
          wordIndex = i;
          charIndex = newState.typedText.length - charCount;
          break;
        }
        charCount += words[i].length + 1; // +1 for space
      }
      
      newState.currentWordIndex = wordIndex;
      newState.currentCharIndex = charIndex;

      // Calculate current stats
      const stats = calculateStats();
      newState.wpm = stats.wpm;
      newState.accuracy = stats.accuracy;

      // Check if test should end
      if (newState.timeLeft <= 0) {
        newState.isTestCompleted = true;
        newState.isTestActive = false;
      }

      return newState;
    });
  }, [state.isTestCompleted, state.isTestActive, state.typedText, words, calculateStats]);

  // Reset test
  const resetTest = useCallback(() => {
    setState({
      currentWordIndex: 0,
      currentCharIndex: 0,
      userInput: '',
      isTestActive: false,
      isTestCompleted: false,
      timeLeft: testDuration,
      correctChars: 0,
      correctWords: 0,
      totalChars: 0,
      wpm: 0,
      accuracy: 0,
      errors: 0,
      typedText: ''
    });
  }, [testDuration]);

  // Get display text with character-level highlighting
  const getDisplayText = useCallback(() => {
    const fullText = words.join(' ');
    const typedText = state.typedText;
    
    return words.map((word, wordIndex) => {
      // Calculate the start position of this word in the full text
      let wordStartPos = 0;
      for (let i = 0; i < wordIndex; i++) {
        wordStartPos += words[i].length + 1; // +1 for space
      }
      
      // Create character-level data for this word
      const characters = word.split('').map((char, charIndex) => {
        const globalCharIndex = wordStartPos + charIndex;
        
        if (globalCharIndex < typedText.length) {
          // Character has been typed
          const isCorrect = typedText[globalCharIndex] === fullText[globalCharIndex];
          return {
            char,
            status: isCorrect ? 'correct' : 'error'
          };
        } else if (wordIndex === state.currentWordIndex && charIndex === state.currentCharIndex) {
          // Current character being typed
          return {
            char,
            status: 'current'
          };
        } else {
          // Untyped character
          return {
            char,
            status: 'untyped'
          };
        }
      });
      
      return {
        word,
        characters,
        wordIndex,
        status: wordIndex === state.currentWordIndex ? 'current' : 
                wordIndex < state.currentWordIndex ? 'completed' : 'upcoming'
      };
    });
  }, [words, state.currentWordIndex, state.currentCharIndex, state.typedText]);

  return {
    ...state,
    handleKeyPress,
    resetTest,
    getDisplayText,
    currentWord: words[state.currentWordIndex] || '',
    isTestStarted: state.isTestActive || state.isTestCompleted
  };
} 