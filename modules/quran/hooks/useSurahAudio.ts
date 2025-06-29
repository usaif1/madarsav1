import { useState, useEffect, useCallback } from 'react';

interface SurahAudioHook {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  duration: number;
  position: number;
  currentVerseId: number;
  totalVerses: number;
  playAudio: (verseId: number) => Promise<void>;
  pauseAudio: () => void;
  resumeAudio: () => Promise<void>;
  stopAudio: () => void;
  seekTo: (position: number) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  playVerseFromUrl: (url: string, verseId: number) => Promise<void>;
}

export const useSurahAudio = (totalVerses: number = 5): SurahAudioHook => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentVerseId, setCurrentVerseId] = useState(1);

  // Simulate audio progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setPosition(prev => {
          if (prev >= duration && duration > 0) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  const playVerseFromUrl = useCallback(async (url: string, verseId: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentVerseId(verseId);
      setDuration(180); // 3 minutes simulation
      setPosition(0);
      setIsPlaying(true);
    } catch (e) {
      console.error('Error playing verse:', e);
      setError('Failed to play verse');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const playAudio = useCallback(async (verseId: number): Promise<void> => {
    // This would typically fetch the audio URL for the verse
    const audioUrl = `https://example.com/quran/verse-${verseId}.mp3`;
    await playVerseFromUrl(audioUrl, verseId);
  }, [playVerseFromUrl]);

  const pauseAudio = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeAudio = useCallback(async (): Promise<void> => {
    setIsPlaying(true);
  }, []);

  const stopAudio = useCallback(() => {
    setIsPlaying(false);
    setPosition(0);
  }, []);

  const seekTo = useCallback((newPosition: number) => {
    setPosition(Math.max(0, Math.min(newPosition, duration)));
  }, [duration]);

  const playNext = useCallback(async (): Promise<void> => {
    if (currentVerseId < totalVerses) {
      const nextVerseId = currentVerseId + 1;
      await playAudio(nextVerseId);
    }
  }, [currentVerseId, totalVerses, playAudio]);

  const playPrevious = useCallback(async (): Promise<void> => {
    if (currentVerseId > 1) {
      const previousVerseId = currentVerseId - 1;
      await playAudio(previousVerseId);
    }
  }, [currentVerseId, playAudio]);

  return {
    isPlaying,
    isLoading,
    error,
    duration,
    position,
    currentVerseId,
    totalVerses,
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio,
    seekTo,
    playNext,
    playPrevious,
    playVerseFromUrl,
  };
}; 