import React, { createContext, useContext, useState } from 'react';

export type MediaType = 'image' | 'reel';
export type ToneType = 'Casual' | 'Thoughtful' | 'Promotional' | 'Educational';
export type PlatformId = 'linkedin' | 'instagram' | 'x' | 'reddit';

export interface CreatorContextType {
  mediaType: MediaType;
  setMediaType: (type: MediaType) => void;
  mediaUri: string;
  setMediaUri: (uri: string) => void;
  mediaName: string;
  setMediaName: (name: string) => void;
  mediaMeta: string;
  setMediaMeta: (meta: string) => void;
  smartCrop: boolean;
  setSmartCrop: (val: boolean | ((prev: boolean) => boolean)) => void;
  description: string;
  setDescription: (desc: string) => void;
  tone: ToneType;
  setTone: (tone: ToneType) => void;
  selectedPlatforms: Record<PlatformId, boolean>;
  togglePlatform: (id: PlatformId) => void;
  selectAllPlatforms: () => void;
  clearPlatforms: () => void;
  resetAll: () => void;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80';

const CreatorContext = createContext<CreatorContextType | undefined>(undefined);

export function CreatorProvider({ children }: { children: React.ReactNode }) {
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [mediaUri, setMediaUri] = useState<string>(DEFAULT_IMAGE);
  const [mediaName, setMediaName] = useState<string>('workspace_v2.jpg');
  const [mediaMeta, setMediaMeta] = useState<string>('4.2 MB • 1:1 Square');
  const [smartCrop, setSmartCrop] = useState<boolean>(true);
  const [description, setDescription] = useState<string>(
    'Sharing my minimal studio setup and design workflow tips. Want the tone to be thoughtful, practical, and engaging for design engineers.'
  );
  const [tone, setTone] = useState<ToneType>('Thoughtful');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<PlatformId, boolean>>({
    linkedin: true,
    instagram: true,
    x: true,
    reddit: true,
  });

  const togglePlatform = (id: PlatformId) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectAllPlatforms = () => {
    setSelectedPlatforms({
      linkedin: true,
      instagram: true,
      x: true,
      reddit: true,
    });
  };

  const clearPlatforms = () => {
    setSelectedPlatforms({
      linkedin: false,
      instagram: false,
      x: false,
      reddit: false,
    });
  };

  const resetAll = () => {
    setMediaType('image');
    setMediaUri(DEFAULT_IMAGE);
    setMediaName('workspace_v2.jpg');
    setMediaMeta('4.2 MB • 1:1 Square');
    setSmartCrop(true);
    setDescription(
      'Sharing my minimal studio setup and design workflow tips. Want the tone to be thoughtful, practical, and engaging for design engineers.'
    );
    setTone('Thoughtful');
    selectAllPlatforms();
  };

  return (
    <CreatorContext.Provider
      value={{
        mediaType,
        setMediaType,
        mediaUri,
        setMediaUri,
        mediaName,
        setMediaName,
        mediaMeta,
        setMediaMeta,
        smartCrop,
        setSmartCrop,
        description,
        setDescription,
        tone,
        setTone,
        selectedPlatforms,
        togglePlatform,
        selectAllPlatforms,
        clearPlatforms,
        resetAll,
      }}>
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const context = useContext(CreatorContext);
  if (!context) {
    throw new Error('useCreator must be used within a CreatorProvider');
  }
  return context;
}
