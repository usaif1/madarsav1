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
  const [error, setError] = useState<string | null>(null)
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

  // Initialize audio pro and get current state
  useEffect(() => {
    console.log('🎵 Initializing AudioPro...');
    AudioPro.configure({
      contentType: AudioProContentType.SPEECH,
      showNextPrevControls: false,
    });

    // Get current audio state on mount
    try {
      const currentState = AudioPro.getState();
      console.log('🎵 Current AudioPro state on mount:', currentState);
      const isCurrentlyPlaying = currentState === 'PLAYING';
      const isCurrentlyLoading = currentState === 'LOADING';
      console.log('🎵 Setting initial state - isPlaying:', isCurrentlyPlaying, 'isLoading:', isCurrentlyLoading);
      setIsPlaying(isCurrentlyPlaying);
      setIsLoading(isCurrentlyLoading);
    } catch (err: any) {
      console.log('🎵 Could not get AudioPro state:', err);
    }

    const subscription = AudioPro.addEventListener((event) => {
      switch (event.type) {
        case 'STATE_CHANGED':
          const newIsPlaying = event.payload?.state === 'PLAYING';
          const newIsLoading = event.payload?.state === 'LOADING';
          
          console.log('🎵 Audio state changed:', event.payload?.state, 'isPlaying:', newIsPlaying);
          
          setIsPlaying(newIsPlaying);
          setIsLoading(newIsLoading);
          
          // Store the current position when paused or stopped using real-time position
          if ((event.payload?.state === 'PAUSED' || event.payload?.state === 'STOPPED') && currentAudioRef.current) {
            currentAudioRef.current.lastPosition = currentAudioRef.current.currentPosition;
            console.log('Position saved on pause/stop:', currentAudioRef.current.lastPosition);
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
      // Note: Don't call AudioPro.clear() here as it would stop audio for all components
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

      console.log('🎵 Playing audio from URL:', audioUrl, 'startPosition:', startPosition);
      await AudioPro.play(track);
      
      // If we have a start position, seek to it (convert seconds to milliseconds)
      if (startPosition > 0) {
        setTimeout(() => {
          AudioPro.seekTo(startPosition * 1000);
        }, 300); // Slightly longer delay to ensure track is fully loaded
      }
    } catch (err) {
      console.error('🎵 Error playing audio:', err);
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
    console.log('🎵 pauseAudio called - isPlaying:', isPlaying, 'hasCurrentAudio:', !!currentAudioRef.current);
    
    if (isPlaying && currentAudioRef.current) {
      // Store current position before pausing
      currentAudioRef.current.lastPosition = currentAudioRef.current.currentPosition;
      console.log('🎵 Pausing audio at position:', currentAudioRef.current.lastPosition);
      AudioPro.pause();
      console.log('🎵 AudioPro.pause() called');
      // Position will be updated in the STATE_CHANGED event handler
    } else {
      console.log('🎵 Cannot pause:', { isPlaying, hasCurrentAudio: !!currentAudioRef.current });
    }
  }, [isPlaying]);

  const resumeAudio = useCallback(async () => {
    if (!isPlaying) {
      try {
        console.log('🎵 Attempting to resume audio:', {
          hasCurrentAudio: !!currentAudioRef.current,
          url: currentAudioRef.current?.url,
          lastPosition: currentAudioRef.current?.lastPosition,
          currentPosition: currentAudioRef.current?.currentPosition
        });
        
        setIsLoading(true);
        setError(null);
        
        if (currentAudioRef.current) {
          // Create the track object for resuming
          const track = {
            id: currentAudioRef.current.id,
            url: currentAudioRef.current.url,
            title: '99 Names of Allah',
            artist: '',
            artwork: 'test',
          };
          
          // Resume playing the track
          await AudioPro.play(track);
          
          // If we have a saved position, seek to it
          if (currentAudioRef.current.lastPosition > 0) {
            console.log('🎵 Seeking to position:', currentAudioRef.current.lastPosition);
            setTimeout(() => {
              AudioPro.seekTo(currentAudioRef.current!.lastPosition * 1000);
            }, 200); // Increased delay to ensure audio is ready
          }
        } else {
          console.log('🎵 No current audio reference, cannot resume');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('🎵 Resume error:', err);
        setError('Failed to resume audio');
        setIsLoading(false);
      }
    } else {
      console.log('🎵 Cannot resume - audio is already playing');
    }
  }, [isPlaying]);

  const stopAudio = useCallback(() => {
    console.log('🎵 Stopping audio');
    AudioPro.stop();
    // Reset positions but preserve the URL for potential resume
    if (currentAudioRef.current) {
      currentAudioRef.current.lastPosition = 0;
      currentAudioRef.current.currentPosition = 0;
      // Don't clear the URL and ID so we can resume later
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