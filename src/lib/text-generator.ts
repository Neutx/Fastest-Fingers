// Word pool for typing test
const WORD_POOL = [

    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "man", "new", "now", "old", "see", "two", "way", "who", "boy", "did", "its", "let", "put", "say", "she", "too", "use",
  
  "about", "after", "again", "back", "been", "before", "being", "below", "between", "both", "came", "come", "could", "down", "each", "even", "first", "from", "give", "good", "great", "hand", "have", "here", "into", "just", "know", "last", "left", "life", "like", "line", "look", "made", "make", "many", "more", "most", "move", "much", "must", "name", "need", "next", "only", "open", "over", "part", "place", "right", "said", "same", "seem", "show", "small", "such", "take", "than", "that", "them", "they", "this", "time", "turn", "very", "want", "water", "well", "went", "were", "what", "when", "where", "which", "while", "will", "with", "work", "year", "your",
  
  "another", "around", "because", "before", "between", "change", "different", "every", "example", "follow", "found", "general", "government", "group", "important", "large", "little", "local", "long", "never", "number", "order", "other", "people", "person", "place", "point", "problem", "program", "public", "right", "school", "second", "several", "small", "social", "special", "state", "still", "system", "those", "though", "three", "through", "under", "until", "water", "where", "while", "world", "would", "write", "young",
  
  "keyboard", "typing", "speed", "accuracy", "practice", "finger", "letter", "word", "sentence", "paragraph", "document", "computer", "screen", "monitor", "mouse", "click", "press", "button", "space", "enter", "shift", "control", "delete", "backspace", "home", "page", "file", "save", "open", "close", "edit", "copy", "paste", "cut", "undo", "redo", "find", "replace", "format", "font", "size", "color", "bold", "italic", "underline"
];

/**
 * Generates a random text string with the specified number of words
 * @param wordCount - Number of words to generate (default: 30)
 * @returns A string of random words separated by spaces
 */
export function generateRandomText(wordCount: number = 30): string {
  const selectedWords: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * WORD_POOL.length);
    selectedWords.push(WORD_POOL[randomIndex]);
  }
  
  return selectedWords.join(' ');
}

/**
 * Generates a new random text for typing practice
 * Ensures no consecutive duplicate words
 * @param wordCount - Number of words to generate (default: 30)
 * @returns A string of random words with no consecutive duplicates
 */
export function generateTypingText(wordCount: number = 30): string {
  const selectedWords: string[] = [];
  let lastWord = '';
  
  for (let i = 0; i < wordCount; i++) {
    let randomWord: string;
    let attempts = 0;
    
    // Avoid consecutive duplicate words
    do {
      const randomIndex = Math.floor(Math.random() * WORD_POOL.length);
      randomWord = WORD_POOL[randomIndex];
      attempts++;
    } while (randomWord === lastWord && attempts < 10); // Max 10 attempts to avoid infinite loop
    
    selectedWords.push(randomWord);
    lastWord = randomWord;
  }
  
  return selectedWords.join(' ');
} 