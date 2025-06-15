import { useState, useEffect, useCallback, useRef } from 'react';
import { AudioPro, AudioProContentType } from 'react-native-audio-pro';

interface UseNameAudioReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  duration: number; // in seconds
  position: number; // in seconds
  volume: number;
  playAudio: (nameNumber: number) => Promise<void>;
  playAudioFromUrl: (audioUrl: string, startPosition?: number) => Promise<void>;
  pauseAudio: () => void;
  resumeAudio: () => Promise<void>;
  stopAudio: () => void;
  seekTo: (position: number) => void;
  setVolume: (volume: number) => void;
  clearError: () => void;
}

export const useNameAudio = (): UseNameAudioReturn => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(1.0);
  
  // Reference to store the current audio URL and real-time position
  const currentAudioRef = useRef<{
    url: string;
    id: string;
    lastPosition: number;
    currentPosition: number; // Real-time position tracking
  } | null>(null);

  // Initialize audio pro
  useEffect(() => {
    AudioPro.configure({
      contentType: AudioProContentType.SPEECH,
      showNextPrevControls: false,
    });

    const subscription = AudioPro.addEventListener((event) => {
      switch (event.type) {
        case 'STATE_CHANGED':
          const newIsPlaying = event.payload?.state === 'PLAYING';
          const newIsLoading = event.payload?.state === 'LOADING';
          
          setIsPlaying(newIsPlaying);
          setIsLoading(newIsLoading);
          
          // Store the current position when paused or stopped using real-time position
          if (event.payload?.state === 'PAUSED' && currentAudioRef.current) {
            currentAudioRef.current.lastPosition = currentAudioRef.current.currentPosition;
          }
          break;
        case 'PROGRESS':
          // Convert milliseconds to seconds and update both state and ref
          const currentPos = (event.payload?.position || 0) / 1000;
          const currentDur = (event.payload?.duration || 0) / 1000;
          
          setPosition(currentPos);
          setDuration(currentDur);
          
          // Update real-time position in ref
          if (currentAudioRef.current) {
            currentAudioRef.current.currentPosition = currentPos;
          }
          break;
        case 'PLAYBACK_ERROR':
          setError(event.payload?.error || 'Playback error');
          setIsLoading(false);
          break;
      }
    });

    return () => {
      subscription.remove();
      AudioPro.clear();
    };
  }, []);

  const getAudioUrl = useCallback((nameNumber: number): string => {
    return `https://99names.app/audio/${nameNumber.toString().padStart(2, '0')}.mp3`;
  }, []);

  const playAudioFromUrl = useCallback(async (audioUrl: string, startPosition: number = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      const trackId = `name-${Date.now()}`;
      const track = {
        id: trackId,
        url: audioUrl,
        title: '99 Names of Allah',
        artist: '',
        artwork: 'test',
      };

      // Store the current audio information
      currentAudioRef.current = {
        url: audioUrl,
        id: trackId,
        lastPosition: startPosition,
        currentPosition: startPosition,
      };

      await AudioPro.play(track);
      
      // If we have a start position, seek to it (convert seconds to milliseconds)
      if (startPosition > 0) {
        setTimeout(() => {
          AudioPro.seekTo(startPosition * 1000);
        }, 300); // Slightly longer delay to ensure track is fully loaded
      }
    } catch (err) {
      setError('Failed to play audio');
      setIsLoading(false);
    }
  }, []);

  const playAudio = useCallback(async (nameNumber: number) => {
    if (nameNumber < 1 || nameNumber > 99) {
      setError('Invalid name number');
      return;
    }
    await playAudioFromUrl(getAudioUrl(nameNumber));
  }, [getAudioUrl, playAudioFromUrl]);

  const pauseAudio = useCallback(() => {
    if (isPlaying) {
      AudioPro.pause();
      // Position will be updated in the STATE_CHANGED event handler
    }
  }, [isPlaying]);

  const resumeAudio = useCallback(async () => {
    if (!isPlaying && currentAudioRef.current) {
      try {
        setIsLoading(true);
        setError(null);
        
        // Always use playAudioFromUrl with the last position for consistency
        // This ensures we start from the correct position every time
        await playAudioFromUrl(
          currentAudioRef.current.url, 
          currentAudioRef.current.lastPosition
        );
      } catch (err) {
        setError('Failed to resume audio');
        setIsLoading(false);
      }
    }
  }, [isPlaying, playAudioFromUrl]);

  const stopAudio = useCallback(() => {
    AudioPro.stop();
    // Reset positions
    if (currentAudioRef.current) {
      currentAudioRef.current.lastPosition = 0;
      currentAudioRef.current.currentPosition = 0;
    }
    setPosition(0);
  }, []);

  const seekTo = useCallback((newPosition: number) => {
    // Convert seconds to milliseconds for the AudioPro API
    AudioPro.seekTo(newPosition * 1000);
    
    // Update both the current position and last position immediately
    if (currentAudioRef.current) {
      currentAudioRef.current.currentPosition = newPosition;
      currentAudioRef.current.lastPosition = newPosition;
    }
    
    // Update position state immediately for UI responsiveness
    setPosition(newPosition);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    AudioPro.setVolume(clampedVolume);
    setVolumeState(clampedVolume);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isPlaying,
    isLoading,
    error,
    duration,
    position,
    volume,
    playAudio,
    playAudioFromUrl,
    pauseAudio,
    resumeAudio,
    stopAudio,
    seekTo,
    setVolume,
    clearError,
  };
};