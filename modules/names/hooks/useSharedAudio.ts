import { useEffect, useCallback } from 'react';
import { AudioPro, AudioProContentType } from 'react-native-audio-pro';
import { useGlobalStore } from '@/globalStore';

interface UseSharedAudioReturn {
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

export const useSharedAudio = (): UseSharedAudioReturn => {
  // Get shared audio state from global store
  const {
    sharedAudio,
    setSharedAudioPlaying,
    setSharedAudioLoading,
    setSharedAudioError,
    setSharedAudioDuration,
    setSharedAudioPosition,
    setSharedAudioVolume,
    setSharedAudioRef,
  } = useGlobalStore();

  // Initialize audio pro and get current state
  useEffect(() => {
    console.log('🎵 Initializing SharedAudio...');
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
      console.log('🎵 Setting initial shared state - isPlaying:', isCurrentlyPlaying, 'isLoading:', isCurrentlyLoading);
      setSharedAudioPlaying(isCurrentlyPlaying);
      setSharedAudioLoading(isCurrentlyLoading);
    } catch (err: any) {
      console.log('🎵 Could not get AudioPro state:', err);
    }

    const subscription = AudioPro.addEventListener((event) => {
      switch (event.type) {
        case 'STATE_CHANGED':
          const newIsPlaying = event.payload?.state === 'PLAYING';
          const newIsLoading = event.payload?.state === 'LOADING';
          
          console.log('🎵 SharedAudio state changed:', event.payload?.state, 'isPlaying:', newIsPlaying);
          
          setSharedAudioPlaying(newIsPlaying);
          setSharedAudioLoading(newIsLoading);
          
          // Store the current position when paused or stopped
          if ((event.payload?.state === 'PAUSED' || event.payload?.state === 'STOPPED') && sharedAudio.currentAudioRef) {
            const updatedRef = {
              ...sharedAudio.currentAudioRef,
              lastPosition: sharedAudio.currentAudioRef.currentPosition,
            };
            setSharedAudioRef(updatedRef);
            console.log('🎵 Position saved on pause/stop:', updatedRef.lastPosition);
          }
          break;
        case 'PROGRESS':
          // Convert milliseconds to seconds and update global state
          const currentPos = (event.payload?.position || 0) / 1000;
          const currentDur = (event.payload?.duration || 0) / 1000;
          
          setSharedAudioPosition(currentPos);
          setSharedAudioDuration(currentDur);
          break;
        case 'PLAYBACK_ERROR':
          setSharedAudioError(event.payload?.error || 'Playback error');
          setSharedAudioLoading(false);
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
      setSharedAudioLoading(true);
      setSharedAudioError(null);

      const trackId = `shared-${Date.now()}`;
      const track = {
        id: trackId,
        url: audioUrl,
        title: '99 Names of Allah',
        artist: '',
        artwork: 'test',
      };

      // Store the current audio information in global store
      const audioRef = {
        url: audioUrl,
        id: trackId,
        lastPosition: startPosition,
        currentPosition: startPosition,
      };
      setSharedAudioRef(audioRef);

      console.log('🎵 Playing shared audio from URL:', audioUrl, 'startPosition:', startPosition);
      await AudioPro.play(track);
      
      // If we have a start position, seek to it (convert seconds to milliseconds)
      if (startPosition > 0) {
        setTimeout(() => {
          AudioPro.seekTo(startPosition * 1000);
        }, 300);
      }
    } catch (err) {
      console.error('🎵 Error playing shared audio:', err);
      setSharedAudioError('Failed to play audio');
      setSharedAudioLoading(false);
    }
  }, [setSharedAudioLoading, setSharedAudioError, setSharedAudioRef]);

  const playAudio = useCallback(async (nameNumber: number) => {
    if (nameNumber < 1 || nameNumber > 99) {
      setSharedAudioError('Invalid name number');
      return;
    }
    await playAudioFromUrl(getAudioUrl(nameNumber));
  }, [getAudioUrl, playAudioFromUrl, setSharedAudioError]);

  const pauseAudio = useCallback(() => {
    console.log('🎵 SharedAudio pauseAudio called - isPlaying:', sharedAudio.isPlaying, 'hasCurrentAudio:', !!sharedAudio.currentAudioRef);
    
    if (sharedAudio.isPlaying && sharedAudio.currentAudioRef) {
      // Store current position before pausing
      const updatedRef = {
        ...sharedAudio.currentAudioRef,
        lastPosition: sharedAudio.currentAudioRef.currentPosition,
      };
      setSharedAudioRef(updatedRef);
      console.log('🎵 Pausing shared audio at position:', updatedRef.lastPosition);
      AudioPro.pause();
      console.log('🎵 AudioPro.pause() called for shared audio');
    } else {
      console.log('🎵 Cannot pause shared audio:', { isPlaying: sharedAudio.isPlaying, hasCurrentAudio: !!sharedAudio.currentAudioRef });
    }
  }, [sharedAudio.isPlaying, sharedAudio.currentAudioRef, setSharedAudioRef]);

  const resumeAudio = useCallback(async () => {
    if (!sharedAudio.isPlaying) {
      try {
        console.log('🎵 Attempting to resume shared audio:', {
          hasCurrentAudio: !!sharedAudio.currentAudioRef,
          url: sharedAudio.currentAudioRef?.url,
          lastPosition: sharedAudio.currentAudioRef?.lastPosition,
          currentPosition: sharedAudio.currentAudioRef?.currentPosition
        });
        
        setSharedAudioLoading(true);
        setSharedAudioError(null);
        
        if (sharedAudio.currentAudioRef) {
          // Create the track object for resuming
          const track = {
            id: sharedAudio.currentAudioRef.id,
            url: sharedAudio.currentAudioRef.url,
            title: '99 Names of Allah',
            artist: '',
            artwork: 'test',
          };
          
          // Resume playing the track
          await AudioPro.play(track);
          
          // If we have a saved position, seek to it
          if (sharedAudio.currentAudioRef.lastPosition > 0) {
            console.log('🎵 Seeking to position:', sharedAudio.currentAudioRef.lastPosition);
            setTimeout(() => {
              AudioPro.seekTo(sharedAudio.currentAudioRef!.lastPosition * 1000);
            }, 200);
          }
        } else {
          console.log('🎵 No current shared audio reference, cannot resume');
          setSharedAudioLoading(false);
        }
      } catch (err) {
        console.error('🎵 Resume shared audio error:', err);
        setSharedAudioError('Failed to resume audio');
        setSharedAudioLoading(false);
      }
    } else {
      console.log('🎵 Cannot resume shared audio - audio is already playing');
    }
  }, [sharedAudio.isPlaying, sharedAudio.currentAudioRef, setSharedAudioLoading, setSharedAudioError]);

  const stopAudio = useCallback(() => {
    console.log('🎵 Stopping shared audio');
    AudioPro.stop();
    // Reset positions but preserve the URL for potential resume
    if (sharedAudio.currentAudioRef) {
      const updatedRef = {
        ...sharedAudio.currentAudioRef,
        lastPosition: 0,
        currentPosition: 0,
      };
      setSharedAudioRef(updatedRef);
    }
    setSharedAudioPosition(0);
  }, [sharedAudio.currentAudioRef, setSharedAudioRef, setSharedAudioPosition]);

  const seekTo = useCallback((newPosition: number) => {
    // Convert seconds to milliseconds for the AudioPro API
    AudioPro.seekTo(newPosition * 1000);
    
    // Update both the current position and last position immediately
    if (sharedAudio.currentAudioRef) {
      const updatedRef = {
        ...sharedAudio.currentAudioRef,
        currentPosition: newPosition,
        lastPosition: newPosition,
      };
      setSharedAudioRef(updatedRef);
    }
    
    // Update position state immediately for UI responsiveness
    setSharedAudioPosition(newPosition);
  }, [sharedAudio.currentAudioRef, setSharedAudioRef, setSharedAudioPosition]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    AudioPro.setVolume(clampedVolume);
    setSharedAudioVolume(clampedVolume);
  }, [setSharedAudioVolume]);

  const clearError = useCallback(() => {
    setSharedAudioError(null);
  }, [setSharedAudioError]);

  return {
    isPlaying: sharedAudio.isPlaying,
    isLoading: sharedAudio.isLoading,
    error: sharedAudio.error,
    duration: sharedAudio.duration,
    position: sharedAudio.position,
    volume: sharedAudio.volume,
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