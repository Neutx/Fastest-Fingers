"use client"

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Calendar, Clock, Save, AlertCircle, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContestSettings } from "@/types/contest";

export function AdminSettings() {
  const [settings, setSettings] = useState<ContestSettings>({
    startDate: '',
    startTime: '',
    duration: 24,
    isActive: false,
    hive65Link: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsRef = doc(db, 'admin', 'contestSettings');
        const settingsSnap = await getDoc(settingsRef);
        
        if (settingsSnap.exists()) {
          const data = settingsSnap.data() as ContestSettings;
          setSettings(data);
        } else {
          // Set default values if no settings exist
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + 1); // Tomorrow
          setSettings({
            startDate: defaultDate.toISOString().split('T')[0],
            startTime: '10:00',
            duration: 24,
            isActive: false,
            hive65Link: ''
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const settingsRef = doc(db, 'admin', 'contestSettings');
      await setDoc(settingsRef, settings);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const getContestEndDate = () => {
    if (!settings.startDate || !settings.startTime) return '';
    
    const startDateTime = new Date(`${settings.startDate}T${settings.startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + (settings.duration * 60 * 60 * 1000));
    
    return endDateTime.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getFormattedStartDate = () => {
    if (!settings.startDate || !settings.startTime) return '';
    
    const startDateTime = new Date(`${settings.startDate}T${settings.startTime}`);
    
    return startDateTime.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-jost font-semibold text-white">
          Contest Settings
        </h2>
        <p className="text-gray-400 mt-1">
          Configure contest timing and duration
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Start Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Start Date
            </label>
            <input
              type="date"
              value={settings.startDate}
              onChange={(e) => setSettings(prev => ({ ...prev, startDate: e.target.value }))}
              title="Select contest start date"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#A578FD] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Clock className="inline w-4 h-4 mr-2" />
              Start Time
            </label>
            <input
              type="time"
              value={settings.startTime}
              onChange={(e) => setSettings(prev => ({ ...prev, startTime: e.target.value }))}
              title="Select contest start time"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#A578FD] focus:border-transparent"
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contest Duration (hours)
          </label>
          <input
            type="number"
            min="1"
            max="168" // 1 week max
            value={settings.duration}
            onChange={(e) => setSettings(prev => ({ ...prev, duration: parseInt(e.target.value) || 24 }))}
            title="Enter contest duration in hours (1-168)"
            className="w-full md:w-1/3 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#A578FD] focus:border-transparent"
          />
          <p className="text-gray-400 text-sm mt-1">
            Contest will run for {settings.duration} hours
          </p>
        </div>

        {/* Hive 65 Link */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Link className="inline w-4 h-4 mr-2" />
            Hive 65 Product Link
          </label>
          <input
            type="url"
            value={settings.hive65Link || ''}
            onChange={(e) => setSettings(prev => ({ ...prev, hive65Link: e.target.value }))}
            placeholder="https://example.com/hive-65"
            title="Enter the product page URL for Hive 65"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#A578FD] focus:border-transparent"
          />
          <p className="text-gray-400 text-sm mt-1">
            This link will be used when users click on &quot;Hive 65&quot; text in the prizes section
          </p>
        </div>

        {/* Contest Status Toggle */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.isActive}
              onChange={(e) => setSettings(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-[#A578FD] bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-[#A578FD] focus:ring-2"
            />
            <span className="text-gray-300">Contest is Active</span>
          </label>
          <p className="text-gray-400 text-sm mt-1">
            Enable this when the contest should be live and accessible to users
          </p>
        </div>

        {/* Preview */}
        {settings.startDate && settings.startTime && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-[#A578FD]" />
              Contest Preview
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <strong>Start:</strong> {getFormattedStartDate()}
              </p>
              <p className="text-gray-300">
                <strong>End:</strong> {getContestEndDate()}
              </p>
              <p className="text-gray-300">
                <strong>Duration:</strong> {settings.duration} hours
              </p>
              <p className="text-gray-300">
                <strong>Status:</strong> 
                <span className={settings.isActive ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                  {settings.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleSave}
            disabled={isSaving || !settings.startDate || !settings.startTime}
            className="bg-[#A578FD] hover:bg-[#A578FD]/90 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>

          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {saveMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 