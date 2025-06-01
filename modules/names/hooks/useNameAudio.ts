import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  AudioContext, 
  AudioBufferSourceNode, 
  GainNode,
  AudioBuffer 
} from 'react-native-audio-api';

/**
 * Custom hook using React Native Audio API
 * High-performance audio engine based on Web Audio API specification
 * Provides better control over audio processing and effects
 */

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

interface AudioCache {
  [key: number]: AudioBuffer;
}

export const useNameAudio = (): UseNameAudioReturn => {
  // State management
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(1.0);
  
  // Refs for audio context and nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const isMountedRef = useRef<boolean>(true);
  
  // Audio cache for better performance
  const audioCacheRef = useRef<AudioCache>({});
  
  /**
   * Initialize AudioContext when hook mounts
   */
  useEffect(() => {
    const initializeAudioContext = async (): Promise<void> => {
      try {
        // Create audio context
        const context = new AudioContext();
        audioContextRef.current = context;
        
        // Create gain node for volume control
        const gainNode = context.createGain();
        gainNode.connect(context.destination);
        gainNodeRef.current = gainNode;
        
        console.log('🎵 AudioContext initialized successfully');
        
      } catch (initError) {
        console.error('❌ Failed to initialize AudioContext:', initError);
        if (isMountedRef.current) {
          setError('Failed to initialize audio system');
        }
      }
    };

    initializeAudioContext();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Stop and disconnect audio nodes
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
          sourceNodeRef.current.disconnect();
        } catch (stopError) {
          console.warn('Warning during cleanup:', stopError);
        }
      }
      
      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  /**
   * Generate audio URL for specific name number
   * @param nameNumber - The number of the Islamic name (1-99)
   */
  const getAudioUrl = useCallback((nameNumber: number): string => {
    const formattedNumber = nameNumber.toString().padStart(2, '0');
    return `https://99names.app/audio/${formattedNumber}.mp3`;
  }, []);

  /**
   * Fetch and decode audio buffer
   * @param nameNumber - The number of the Islamic name
   */
  const fetchAudioBuffer = useCallback(async (nameNumber: number): Promise<AudioBuffer> => {
    // Check cache first
    if (audioCacheRef.current[nameNumber]) {
      console.log(`🎵 Using cached audio for name #${nameNumber}`);
      return audioCacheRef.current[nameNumber];
    }

    const audioUrl = getAudioUrl(nameNumber);
    console.log(`🎵 Fetching audio from: ${audioUrl}`);

    try {
      // Fetch audio file
      const response = await fetch(audioUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Get array buffer
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode audio data
      if (!audioContextRef.current) {
        throw new Error('AudioContext not initialized');
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      // Cache the buffer for future use
      audioCacheRef.current[nameNumber] = audioBuffer;
      
      console.log(`✅ Audio buffer loaded and cached for name #${nameNumber}`);
      return audioBuffer;
      
    } catch (fetchError) {
      console.error(`❌ Error fetching audio for name #${nameNumber}:`, fetchError);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to load audio';
      
      if (fetchError instanceof Error) {
        const errorMsg = fetchError.message.toLowerCase();
        
        if (errorMsg.includes('network') || errorMsg.includes('failed to fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (errorMsg.includes('404') || errorMsg.includes('not found')) {
          errorMessage = 'Audio file not found on server.';
        } else if (errorMsg.includes('decode')) {
          errorMessage = 'Failed to decode audio file. Format may not be supported.';
        } else {
          errorMessage = `Audio loading error: ${fetchError.message}`;
        }
      }
      
      throw new Error(errorMessage);
    }
  }, [getAudioUrl]);

  /**
   * Update position counter during playback
   */
  const updatePosition = useCallback((): void => {
    if (!isPlaying || !audioContextRef.current || !isMountedRef.current) {
      return;
    }

    const currentTime = audioContextRef.current.currentTime;
    const elapsed = currentTime - startTimeRef.current + pauseTimeRef.current;
    
    const newPosition = Math.min(elapsed, duration);
    setPosition(newPosition);
    
    console.log('🎵 Position update:', { 
      currentTime,
      startTime: startTimeRef.current,
      pauseTime: pauseTimeRef.current,
      calculatedPosition: newPosition
    });

    if (elapsed < duration) {
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    } else {
      setIsPlaying(false);
      setPosition(duration);
      console.log('🎵 Playback completed naturally');
    }
  }, [isPlaying, duration, setPosition, setIsPlaying]);

  /**
   * Start position tracking
   */
  const startPositionTracking = useCallback((): void => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updatePosition);
  }, [updatePosition]);

  /**
   * Play audio for a specific name number
   * @param nameNumber - The number of the Islamic name (1-99)
   */
  const playAudio = async (nameNumber: number): Promise<void> => {
    // Validate input
    if (nameNumber < 1 || nameNumber > 99) {
      setError('Invalid name number. Must be between 1 and 99.');
      return;
    }

    if (!audioContextRef.current || !gainNodeRef.current) {
      setError('Audio system not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Stop current playback if any
      stopAudio();
      
      console.log(`🎵 Loading audio for name #${nameNumber}`);
      
      // Fetch and decode audio buffer
      const audioBuffer = await fetchAudioBuffer(nameNumber);
      
      // Create buffer source node
      const sourceNode = audioContextRef.current.createBufferSource();
      sourceNode.buffer = audioBuffer;
      
      // Connect audio graph: source -> gain -> destination
      sourceNode.connect(gainNodeRef.current);
      
      // Set up playback completion handler
      sourceNode.onended = () => {
        if (isMountedRef.current) {
          setIsPlaying(false);
          setPosition(duration);
          console.log('🎵 Playback completed');
        }
      };
      
      // Store references
      sourceNodeRef.current = sourceNode;
      
      // Set duration and reset position
      setDuration(audioBuffer.duration);
      setPosition(0);
      pauseTimeRef.current = 0;
      
      // Start playback
      const currentTime = audioContextRef.current.currentTime;
      sourceNode.start(0);
      startTimeRef.current = currentTime;
      
      setIsPlaying(true);
      setIsLoading(false);
      
      // Start position tracking
      startPositionTracking();
      
      console.log(`🎵 Playback started - Duration: ${audioBuffer.duration}s`);
      console.log('🎵 Current audio state:', { 
        isPlaying, 
        position, 
        duration,
        volume
      });
      
      console.log('✅ Audio playback started');
      
    } catch (audioError) {
      console.error('❌ Error playing audio:', audioError);
      
      if (!isMountedRef.current) return;
      
      setIsLoading(false);
      setIsPlaying(false);
      
      if (audioError instanceof Error) {
        setError(audioError.message);
      } else {
        setError('Unknown error occurred while playing audio');
      }
    }
  };
  
  /**
   * Pause currently playing audio
   * Note: Web Audio API doesn't have native pause, so we implement it by stopping and tracking position
   */
  const pauseAudio = (): void => {
    if (!isPlaying || !audioContextRef.current || !sourceNodeRef.current) {
      return;
    }

    try {
      // Stop the current source
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
      
      // Update pause time
      const currentTime = audioContextRef.current.currentTime;
      pauseTimeRef.current = currentTime - startTimeRef.current + pauseTimeRef.current;
      
      setIsPlaying(false);
      
      // Cancel position tracking
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      console.log('⏸️ Audio paused at position:', pauseTimeRef.current);
      
    } catch (pauseError) {
      console.error('❌ Error pausing audio:', pauseError);
      setError('Failed to pause audio');
    }
  };

  /**
   * Stop audio playback completely
   */
  const stopAudio = (): void => {
    try {
      // Cancel position tracking
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Stop and disconnect source node
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      
      // Reset state
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
      pauseTimeRef.current = 0;
      startTimeRef.current = 0;
      
      console.log('⏹️ Audio stopped');
      
    } catch (stopError) {
      console.error('❌ Error stopping audio:', stopError);
      setError('Failed to stop audio');
    }
  };

  /**
   * Set volume level
   * @param newVolume - Volume level between 0.0 and 1.0
   */
  const setVolume = (newVolume: number): void => {
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = clampedVolume;
      setVolumeState(clampedVolume);
      console.log(`🔊 Volume set to: ${Math.round(clampedVolume * 100)}%`);
    }
  };

  /**
   * Clear current error state
   */
  const clearError = (): void => {
    setError(null);
  };

  /**
   * Play audio from a direct URL
   * @param audioUrl - The URL of the audio file to play
   */
  const playAudioFromUrl = async (audioUrl: string): Promise<void> => {
    if (!audioContextRef.current || !gainNodeRef.current) {
      setError('Audio system not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Stop current playback if any
      stopAudio();
      
      console.log(`🎵 Loading audio from URL: ${audioUrl}`);
      
      // Fetch audio file
      const response = await fetch(audioUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Get array buffer
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode audio data
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      // Create buffer source node
      const sourceNode = audioContextRef.current.createBufferSource();
      sourceNode.buffer = audioBuffer;
      
      // Connect audio graph: source -> gain -> destination
      sourceNode.connect(gainNodeRef.current);
      
      // Set up playback completion handler
      sourceNode.onended = () => {
        if (isMountedRef.current) {
          setIsPlaying(false);
          setPosition(duration);
          console.log('🎵 Playback completed');
        }
      };
      
      // Store references
      sourceNodeRef.current = sourceNode;
      
      // Set duration and reset position
      setDuration(audioBuffer.duration);
      setPosition(0);
      pauseTimeRef.current = 0;
      
      // Start playback
      const currentTime = audioContextRef.current.currentTime;
      sourceNode.start(0);
      startTimeRef.current = currentTime;
      
      setIsPlaying(true);
      setIsLoading(false);
      
      // Start position tracking
      startPositionTracking();
      
      console.log('✅ Audio playback started');
      
    } catch (audioError) {
      console.error('❌ Error playing audio from URL:', audioError);
      
      if (!isMountedRef.current) return;
      
      setIsLoading(false);
      setIsPlaying(false);
      
      if (audioError instanceof Error) {
        setError(audioError.message);
      } else {
        setError('Unknown error occurred while playing audio');
      }
    }
  };

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