import { useState, useEffect, useCallback } from 'react';
import { AudioPro, AudioProContentType } from 'react-native-audio-pro';

interface UseNameAudioReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  duration: number;
  position: number;
  volume: number;
  playAudio: (nameNumber: number) => Promise<void>;
  playAudioFromUrl: (audioUrl: string) => Promise<void>;
  pauseAudio: () => void;
  stopAudio: () => void;
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
          break;
        case 'PROGRESS':
          setPosition(event.payload?.position || 0);
          setDuration(event.payload?.duration || 0);
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

  const playAudioFromUrl = useCallback(async (audioUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const track = {
        id: `name-${Date.now()}`,
        url: audioUrl,
        title: '99 Names of Allah',
        artist: '',
        artwork: 'test',
      };

      await AudioPro.play(track);
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
    AudioPro.pause();
  }, []);

  const stopAudio = useCallback(() => {
    AudioPro.stop();
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
    stopAudio,
    setVolume,
    clearError,
  };
};