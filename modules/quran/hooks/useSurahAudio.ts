import { useState, useEffect, useCallback, useRef } from 'react';
import SoundPlayer from 'react-native-sound-player';
import quranService from '../services/quranService';
import { API_ENDPOINTS } from '@/api/config/apiConfig';

/* ---------- interfaces ---------- */
interface VerseData { 
  id: number; 
  verseKey: string; 
  audioUrl?: string; 
}

interface SurahAudioHook {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  duration: number;
  position: number;
  currentVerseId: number | null;
  currentVerseIndex: number;
  totalVerses: number;
  progress: number;
  playAudio: (verseId: number) => Promise<void>;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  seekTo: (position: number) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  setVolume: (volume: number) => void;
  clearError: () => void;
  cleanup: () => void;
}

/* ---------- hook ---------- */
export const useSurahAudio = (
  verses: VerseData[] = [],
  recitationId?: number
): SurahAudioHook => {
  /* ---- state ---- */
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentVerseId, setCurrentVerseId] = useState<number | null>(null);

  /* ---- refs ---- */
  const versesRef = useRef(verses);
  const recitationIdRef = useRef(recitationId);
  const positionInterval = useRef<NodeJS.Timeout | null>(null);
  const currentUrl = useRef<string | null>(null);
  const isLoadedRef = useRef(false);
  
  // Event subscription refs for proper cleanup
  const finishedPlayingSubscription = useRef<any>(null);
  const finishedLoadingURLSubscription = useRef<any>(null);

  /* ---- keep refs fresh ---- */
  useEffect(() => { versesRef.current = verses; }, [verses]);
  useEffect(() => { recitationIdRef.current = recitationId; }, [recitationId]);

  /* ---- helpers ---- */
  const totalVerses = verses.length;
  const currentVerseIndex = currentVerseId
    ? verses.findIndex(v => v.id === currentVerseId)
    : -1;
  const progress = duration > 0 ? position / duration : 0;

  /* ---- position polling ---- */
  const startPolling = useCallback(() => {
    if (positionInterval.current) {
      clearInterval(positionInterval.current);
    }
    
    positionInterval.current = setInterval(async () => {
      try {
        if (!isLoadedRef.current || !isPlaying) return;
        
        const info = await SoundPlayer.getInfo();
        setPosition(info.currentTime);
        
        // Auto-detect completion (fallback if event doesn't fire)
        if (info.currentTime >= info.duration - 0.1 && info.duration > 0) {
          console.log('Audio completed via polling detection');
          handleAudioCompletion();
        }
      } catch (err) {
        // Ignore polling errors - audio might not be loaded
        console.warn('Position polling error (expected if no audio loaded):', err);
      }
    }, 500);
  }, [isPlaying]);

  const stopPolling = useCallback(() => {
    if (positionInterval.current) {
      clearInterval(positionInterval.current);
      positionInterval.current = null;
    }
  }, []);

  /* ---- handle audio completion ---- */
  const handleAudioCompletion = useCallback(() => {
    console.log('Handling audio completion');
    setIsPlaying(false);
    stopPolling();
    
    // Auto-play next verse
    const currentIdx = versesRef.current.findIndex(v => v.id === currentVerseId);
    if (currentIdx >= 0 && currentIdx < versesRef.current.length - 1) {
      const nextVerse = versesRef.current[currentIdx + 1];
      console.log('Auto-playing next verse:', nextVerse.verseKey);
      setTimeout(() => {
        playAudio(nextVerse.id);
      }, 500);
    } else {
      console.log('Reached end of playlist');
      setCurrentVerseId(null);
      isLoadedRef.current = false;
    }
  }, [currentVerseId, stopPolling]);

  /* ---- setup event listeners ---- */
  useEffect(() => {
    console.log('Setting up SoundPlayer event listeners');
    
    // Cleanup existing subscriptions
    if (finishedPlayingSubscription.current) {
      finishedPlayingSubscription.current.remove();
    }
    if (finishedLoadingURLSubscription.current) {
      finishedLoadingURLSubscription.current.remove();
    }

    // Subscribe to FinishedPlaying event
    finishedPlayingSubscription.current = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
      console.log('FinishedPlaying event:', success);
      
      if (!success) {
        console.error('Playback failed');
        setError('Audio playback failed');
        setIsPlaying(false);
        stopPolling();
        return;
      }
      
      handleAudioCompletion();
    });

    // Subscribe to FinishedLoadingURL event
    finishedLoadingURLSubscription.current = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
      console.log('FinishedLoadingURL event:', success, url);
      
      if (!success) {
        console.error('Failed to load URL:', url);
        setError('Failed to load audio from URL');
        setIsLoading(false);
        isLoadedRef.current = false;
        return;
      }
      
      console.log('URL loaded successfully, getting audio info...');
      isLoadedRef.current = true;
      
      // Get duration after successful load
      SoundPlayer.getInfo()
        .then(info => {
          console.log('Audio info after load:', info);
          setDuration(info.duration);
          setPosition(0);
        })
        .catch(err => {
          console.error('Error getting audio info after load:', err);
          setError('Failed to get audio information');
          setIsLoading(false);
        });
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up event listeners');
      if (finishedPlayingSubscription.current) {
        finishedPlayingSubscription.current.remove();
        finishedPlayingSubscription.current = null;
      }
      if (finishedLoadingURLSubscription.current) {
        finishedLoadingURLSubscription.current.remove();
        finishedLoadingURLSubscription.current = null;
      }
    };
  }, [handleAudioCompletion, stopPolling]);

  /* ---- audio url fetch ---- */
  const fetchAudioUrl = useCallback(async (verseKey: string): Promise<string> => {
    try {
      const res = await quranService.getAyahRecitation(recitationIdRef.current || 7, verseKey);
      console.log("API Response:", res);
      
      if (!res?.audio_files?.[0]?.url) {
        throw new Error('No audio URL in response');
      }
      
      let url = res.audio_files[0].url;
      console.log("Raw URL:", url);
      
      // Construct full URL
      url = `${API_ENDPOINTS.QURAN_FOUNDATION.AUDIO_BASE_URL}${url}`;
      console.log("Full URL:", url);
      
      // Validate URL format
      new URL(url);
      
      return url;
    } catch (err) {
      console.error('Error fetching audio URL:', err);
      throw new Error(`Failed to fetch audio URL: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  /* ---- play audio ---- */
  const playAudio = useCallback(async (verseId: number): Promise<void> => {
    // Prevent multiple simultaneous requests
    if (isLoading) {
      console.log('Already loading, ignoring play request');
      return;
    }
    
    console.log('Starting playAudio for verseId:', verseId);
    setIsLoading(true);
    setError(null);
    stopPolling();

    try {
      // Find verse
      const verse = versesRef.current.find(v => v.id === verseId);
      if (!verse) {
        throw new Error(`Verse with ID ${verseId} not found`);
      }

      console.log('Playing verse:', verse.verseKey);
      
      // Stop any currently playing audio
      try {
        SoundPlayer.stop();
        console.log('Stopped previous audio');
      } catch (stopErr) {
        console.warn('No audio to stop:', stopErr);
      }

      // Reset state
      setPosition(0);
      setDuration(0);
      setIsPlaying(false);
      isLoadedRef.current = false;

      // Fetch audio URL
      const url = await fetchAudioUrl(verse.verseKey);
      currentUrl.current = url;

      console.log('Loading audio from URL:', url);
      
      // Load URL (this will trigger FinishedLoadingURL event)
      SoundPlayer.loadUrl(url);
      
      // Set current verse immediately since we're starting to load
      setCurrentVerseId(verseId);
      
      // Wait for the loading to complete via event listener
      // The actual play will happen after FinishedLoadingURL event
      
    } catch (error) {
      console.error('Error in playAudio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown playback error';
      setError(errorMessage);
      setIsLoading(false);
      setIsPlaying(false);
      setCurrentVerseId(null);
      isLoadedRef.current = false;
    }
  }, [fetchAudioUrl, stopPolling, isLoading]);

  /* ---- play after load completes ---- */
  const startPlayback = useCallback(async () => {
    try {
      console.log('Starting playback after successful load');
      SoundPlayer.play();
      setIsPlaying(true);
      setIsLoading(false);
      startPolling();
      console.log('Playback started successfully');
    } catch (err) {
      console.error('Error starting playback:', err);
      setError('Failed to start playback');
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [startPolling]);

  /* ---- trigger playback when audio is loaded ---- */
  useEffect(() => {
    if (isLoadedRef.current && isLoading && currentVerseId && !isPlaying) {
      console.log('Audio loaded, starting playback...');
      startPlayback();
    }
  }, [isLoadedRef.current, isLoading, currentVerseId, isPlaying, startPlayback]);

  /* ---- control functions ---- */
  const pauseAudio = useCallback(() => {
    try {
      console.log('Pausing audio');
      SoundPlayer.pause();
      setIsPlaying(false);
      stopPolling();
    } catch (err) {
      console.error('Error pausing audio:', err);
      setError('Failed to pause audio');
    }
  }, [stopPolling]);

  const resumeAudio = useCallback(() => {
    try {
      if (!isLoadedRef.current) {
        console.warn('No audio loaded to resume');
        return;
      }
      console.log('Resuming audio');
      SoundPlayer.resume();
      setIsPlaying(true);
      startPolling();
    } catch (err) {
      console.error('Error resuming audio:', err);
      setError('Failed to resume audio');
    }
  }, [startPolling]);

  const stopAudio = useCallback(() => {
    try {
      console.log('Stopping audio');
      SoundPlayer.stop();
      setIsPlaying(false);
      setPosition(0);
      setCurrentVerseId(null);
      isLoadedRef.current = false;
      stopPolling();
    } catch (err) {
      console.error('Error stopping audio:', err);
    }
  }, [stopPolling]);

  const seekTo = useCallback((seconds: number) => {
    try {
      if (!isLoadedRef.current) {
        console.warn('No audio loaded to seek');
        return;
      }
      if (seconds < 0 || seconds > duration) {
        console.warn('Invalid seek position:', seconds);
        return;
      }
      console.log('Seeking to:', seconds);
      SoundPlayer.seek(seconds);
      setPosition(seconds);
    } catch (err) {
      console.error('Error seeking:', err);
      setError('Failed to seek');
    }
  }, [duration]);

  const playNext = useCallback(async () => {
    const currentIdx = versesRef.current.findIndex(v => v.id === currentVerseId);
    if (currentIdx >= 0 && currentIdx < versesRef.current.length - 1) {
      const nextVerse = versesRef.current[currentIdx + 1];
      await playAudio(nextVerse.id);
    } else {
      console.log('No next verse available');
    }
  }, [currentVerseId, playAudio]);

  const playPrevious = useCallback(async () => {
    const currentIdx = versesRef.current.findIndex(v => v.id === currentVerseId);
    if (currentIdx > 0) {
      const prevVerse = versesRef.current[currentIdx - 1];
      await playAudio(prevVerse.id);
    } else {
      console.log('No previous verse available');
    }
  }, [currentVerseId, playAudio]);

  const setVolume = useCallback((volume: number) => {
    try {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      SoundPlayer.setVolume(clampedVolume);
      console.log('Volume set to:', clampedVolume);
    } catch (err) {
      console.error('Error setting volume:', err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const cleanup = useCallback(() => {
    try {
      console.log('Cleaning up audio hook');
      stopPolling();
      SoundPlayer.stop();
      
      // Remove event listeners
      if (finishedPlayingSubscription.current) {
        finishedPlayingSubscription.current.remove();
        finishedPlayingSubscription.current = null;
      }
      if (finishedLoadingURLSubscription.current) {
        finishedLoadingURLSubscription.current.remove();
        finishedLoadingURLSubscription.current = null;
      }
      
      // Reset state
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
      setCurrentVerseId(null);
      setError(null);
      isLoadedRef.current = false;
      
      console.log('Audio hook cleanup completed');
    } catch (err) {
      console.error('Error during cleanup:', err);
    }
  }, [stopPolling]);

  /* ---- cleanup on unmount ---- */
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isPlaying,
    isLoading,
    error,
    duration,
    position,
    currentVerseId,
    currentVerseIndex,
    totalVerses,
    progress,
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio,
    seekTo,
    playNext,
    playPrevious,
    setVolume,
    clearError,
    cleanup,
  };
};