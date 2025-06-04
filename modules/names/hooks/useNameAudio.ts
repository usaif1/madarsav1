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
  
  // Reference to store the current audio URL for resuming playback
  const currentAudioRef = useRef<{
    url: string;
    id: string;
    lastPosition: number;
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
          setIsPlaying(event.payload?.state === 'PLAYING');
          setIsLoading(event.payload?.state === 'LOADING');
          // Store the current position when paused
          if (event.payload?.state === 'PAUSED' && currentAudioRef.current) {
            currentAudioRef.current.lastPosition = position;
          }
          break;
        case 'PROGRESS':
          // Convert milliseconds to seconds for better time display
          setPosition((event.payload?.position || 0) / 1000);
          setDuration((event.payload?.duration || 0) / 1000);
          break;
        case 'PLAYBACK_ERROR':
          setError(event.payload?.error || 'Playback error');
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

      // Store the current audio information for potential resume later
      currentAudioRef.current = {
        url: audioUrl,
        id: trackId,
        lastPosition: startPosition,
      };

      await AudioPro.play(track);
      
      // If we have a start position, seek to it (convert seconds to milliseconds)
      if (startPosition > 0) {
        setTimeout(() => {
          AudioPro.seekTo(startPosition * 1000);
        }, 200); // Small delay to ensure track is loaded
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
      // Save current position before pausing
      if (currentAudioRef.current) {
        currentAudioRef.current.lastPosition = position;
      }
      AudioPro.pause();
    }
  }, [isPlaying, position]);

  const resumeAudio = useCallback(async () => {
    if (!isPlaying && currentAudioRef.current) {
      try {
        await AudioPro.resume();
        // If resume fails (which can happen with URL audio), fallback to replay
        if (!isPlaying) {
          await playAudioFromUrl(currentAudioRef.current.url, currentAudioRef.current.lastPosition);
        }
      } catch (err) {
        // Fallback to replay if resume fails
        await playAudioFromUrl(currentAudioRef.current.url, currentAudioRef.current.lastPosition);
      }
    }
  }, [isPlaying, playAudioFromUrl]);

  const stopAudio = useCallback(() => {
    AudioPro.stop();
    // Reset current audio reference
    if (currentAudioRef.current) {
      currentAudioRef.current.lastPosition = 0;
    }
  }, []);

  const seekTo = useCallback((newPosition: number) => {
    // Convert seconds to milliseconds for the AudioPro API
    AudioPro.seekTo(newPosition * 1000);
    if (currentAudioRef.current) {
      currentAudioRef.current.lastPosition = newPosition;
    }
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