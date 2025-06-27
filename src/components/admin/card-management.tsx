"use client"

import { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { CardTier, CardSettings } from "@/types/contest";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {  
  Save, 
  Edit2, 
  Trash2, 
  Plus, 
  Eye,
  ImageIcon
} from "lucide-react";

interface CardPreviewProps {
  tier: CardTier;
  userName: string;
  score: string;
}

function CardPreview({ tier, userName, score }: CardPreviewProps) {
  return (
    <div className="w-60 h-96 relative bg-violet-400 rounded-2xl overflow-hidden" style={{ background: tier.bgGradient }}>
      {/* Card Container */}
      <div className="w-60 h-96 left-0 top-0 absolute rounded-2xl" style={{ background: tier.bgGradient }}>
        {/* Card Image */}
        <div className="w-52 h-36 left-4 top-10 absolute rounded-lg overflow-hidden">
          <Image 
            src={tier.imageUrl} 
            alt={`${tier.name} card`}
            width={208}
            height={144}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Badge */}
        <div className="w-20 h-5 left-4 top-3 absolute bg-gradient-to-b from-yellow-400 to-yellow-400 rounded-[40px] flex items-center justify-center">
          <div className="text-center justify-start text-stone-900 text-xs font-bold font-['Inter']">{tier.name}</div>
        </div>

        {/* Kreo Logo */}
        <div className="w-12 h-5 left-[170px] top-3 absolute flex items-center justify-center">
          <Image 
            src="/kreo.svg" 
            alt="Kreo Logo"
            width={48}
            height={20}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Card Content Bottom Section */}
        <div className="w-52 h-40 left-4 top-[182px] absolute bg-violet-600">
          {/* Username */}
          <div className="w-full top-[16px] absolute text-center text-white text-lg font-semibold font-['Jost']">
            {userName}
          </div>

          {/* Score */}
          <div className="w-full top-[50px] right-[6px] absolute text-center text-white text-3xl font-normal font-['Dela_Gothic_One']">
            {score}
          </div>

          {/* Description */}
          <div className="w-full px-2 top-[100px] right-[2px] absolute text-center text-white text-xs font-normal font-['Jost'] leading-none whitespace-pre-line">
            {tier.description}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardManagement() {
  const [cardSettings, setCardSettings] = useState<CardSettings>({
    tiers: [],
    lastUpdated: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [previewTier, setPreviewTier] = useState<CardTier | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadTargetTierId, setUploadTargetTierId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing card settings
  useEffect(() => {
    const loadCardSettings = async () => {
      try {
        const cardRef = doc(db, 'admin', 'cardSettings');
        const cardSnap = await getDoc(cardRef);
        
        if (cardSnap.exists()) {
          const data = cardSnap.data() as CardSettings;
          setCardSettings(data);
        } else {
          // Set default card tiers if none exist
          const defaultTiers: CardTier[] = [
            {
              id: 'beginner',
              name: 'Beginner',
              wpmRange: '< 2.5K',
              description: 'You are probably\nstill using dial up connection',
              bgGradient: 'bg-violet-400',
              imageUrl: '/cards/beginner-card.png',
              minWpm: 0,
              maxWpm: 2499,
              order: 1
            },
            {
              id: 'casual',
              name: 'Casual',
              wpmRange: '2.5K - 5K',
              description: 'Are you the sum of all numbers divided by how many there are? Because you\'re average.',
              bgGradient: 'bg-violet-400',
              imageUrl: '/cards/casual-card.png',
              minWpm: 2500,
              maxWpm: 4999,
              order: 2
            },
            {
              id: 'pro',
              name: 'Pro',
              wpmRange: '5K - 8K',
              description: 'You\'re the fastest!\n(in your friend circle)',
              bgGradient: 'bg-violet-400',
              imageUrl: '/cards/pro-card.png',
              minWpm: 5000,
              maxWpm: 7999,
              order: 3
            },
            {
              id: 'elite',
              name: 'Elite',
              wpmRange: '8K - 10K',
              description: 'It\'s not your fault. Repeat\nafter us. It\'s not your fault',
              bgGradient: 'bg-violet-400',
              imageUrl: '/cards/elite-card.png',
              minWpm: 8000,
              maxWpm: 9999,
              order: 4
            },
            {
              id: 'godlike',
              name: 'Godlike',
              wpmRange: '10K+',
              description: 'O Dear Lord! Please\nBless us all',
              bgGradient: 'bg-violet-400',
              imageUrl: '/cards/godlike-card.png',
              minWpm: 10000,
              maxWpm: Infinity,
              order: 5
            }
          ];
          
          setCardSettings({
            tiers: defaultTiers,
            lastUpdated: new Date().toISOString()
          });
        }
      } catch {
        // Error loading card settings
      } finally {
        setIsLoading(false);
      }
    };

    loadCardSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const cardRef = doc(db, 'admin', 'cardSettings');
      const updatedSettings = {
        ...cardSettings,
        lastUpdated: new Date().toISOString()
      };
      
      await setDoc(cardRef, updatedSettings);
      setCardSettings(updatedSettings);
      setSaveMessage('Card settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Error saving card settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (tierId: string, file: File) => {
    setUploading(tierId);
    try {
      // Create a unique filename
      const filename = `cards/${tierId}-${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, filename);
      
      // Upload file
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update the tier with new image URL
      setCardSettings(prev => ({
        ...prev,
        tiers: prev.tiers.map(tier => 
          tier.id === tierId 
            ? { ...tier, imageUrl: downloadURL }
            : tier
        )
      }));
      
      setSaveMessage('Image uploaded successfully! Don\'t forget to save.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Error uploading image. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setUploading(null);
    }
  };

  const handleTierUpdate = (tierId: string, updates: Partial<CardTier>) => {
    setCardSettings(prev => ({
      ...prev,
      tiers: prev.tiers.map(tier =>
        tier.id === tierId
          ? { ...tier, ...updates }
          : tier
      )
    }));
  };

  const addNewTier = () => {
    const newTier: CardTier = {
      id: `tier-${Date.now()}`,
      name: 'New Tier',
      wpmRange: '0 - 1K',
      description: 'New tier description',
      bgGradient: 'bg-violet-400',
      imageUrl: '/cards/beginner-card.png',
      minWpm: 0,
      maxWpm: 1000,
      order: cardSettings.tiers.length + 1
    };
    
    setCardSettings(prev => ({
      ...prev,
      tiers: [...prev.tiers, newTier]
    }));
    setEditingTier(newTier.id);
  };

  const deleteTier = (tierId: string) => {
    if (cardSettings.tiers.length <= 1) {
      setSaveMessage('Cannot delete the last tier.');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }
    
    setCardSettings(prev => ({
      ...prev,
      tiers: prev.tiers.filter(tier => tier.id !== tierId)
    }));
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

  const sortedTiers = [...cardSettings.tiers].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-jost font-semibold text-white">
              Card Management
            </h2>
            <p className="text-gray-400 mt-1">
              Manage card tiers, upload new images, and preview cards
            </p>
          </div>
          <Button
            onClick={addNewTier}
            variant="purple"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Tier
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Hidden File Input - Moved outside the loop */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && uploadTargetTierId) {
              handleImageUpload(uploadTargetTierId, file);
              setUploadTargetTierId(null); // Reset after upload
            }
          }}
          className="hidden"
          title="Image Upload"
        />

        {/* Card Tiers List */}
        <div className="space-y-4">
          {sortedTiers.map((tier) => (
            <div key={tier.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  {editingTier === tier.id ? (
                    // Edit Mode
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Tier Name
                        </label>
                        <input
                          title="Tier Name"
                          type="text"
                          value={tier.name}
                          onChange={(e) => handleTierUpdate(tier.id, { name: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          WPM Range
                        </label>
                        <input
                          title="WPM Range"
                          type="text"
                          value={tier.wpmRange}
                          onChange={(e) => handleTierUpdate(tier.id, { wpmRange: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          title="Description"
                          value={tier.description}
                          onChange={(e) => handleTierUpdate(tier.id, { description: e.target.value })}
                          rows={3}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Min WPM
                        </label>
                        <input
                          title="Min WPM"
                          type="number"
                          value={tier.minWpm}
                          onChange={(e) => handleTierUpdate(tier.id, { minWpm: parseInt(e.target.value) || 0 })}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Max WPM
                        </label>
                        <input
                          type="number"
                          value={tier.maxWpm === Infinity ? '' : tier.maxWpm}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleTierUpdate(tier.id, { 
                              maxWpm: value === '' ? Infinity : parseInt(value) || 0 
                            });
                          }}
                          placeholder="Leave empty for infinity"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded overflow-hidden">
                        <Image
                          src={tier.imageUrl}
                          alt={tier.name}
                          width={64}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{tier.name}</h3>
                        <p className="text-gray-400 text-sm">{tier.wpmRange}</p>
                        <p className="text-gray-500 text-xs">{tier.minWpm} - {tier.maxWpm === Infinity ? '∞' : tier.maxWpm}</p>
                      </div>
                    </div>
                  )}

                  {/* Image Upload */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        setUploadTargetTierId(tier.id);
                        fileInputRef.current?.click();
                      }}
                      disabled={uploading === tier.id}
                      variant="purple"
                      size="sm"
                      className=""
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {uploading === tier.id ? 'Uploading...' : 'Change Image'}
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setPreviewTier(tier)}
                    variant="purple"
                    size="sm"
                    className=""
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setEditingTier(editingTier === tier.id ? null : tier.id)}
                    variant="purple"
                    size="sm"
                    className=""
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deleteTier(tier.id)}
                    variant="destructive"
                    size="sm"
                    className=""
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="purple"
            className="px-6 py-2 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </Button>

          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {saveMessage}
            </span>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Card Preview - {previewTier.name}</h3>
              <Button
                onClick={() => setPreviewTier(null)}
                variant="purple"
                size="sm"
                className=""
              >
                Close
              </Button>
            </div>
            <div className="flex justify-center">
              <CardPreview
                tier={previewTier}
                userName="John Doe"
                score="5.8K"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 