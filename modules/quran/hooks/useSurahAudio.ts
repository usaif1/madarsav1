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
  const isPlayingRef = useRef(false); // Track playing state in ref for interval
  
  // Event subscription refs for proper cleanup
  const finishedPlayingSubscription = useRef<any>(null);
  const finishedLoadingURLSubscription = useRef<any>(null);

  /* ---- keep refs fresh ---- */
  useEffect(() => { versesRef.current = verses; }, [verses]);
  useEffect(() => { recitationIdRef.current = recitationId; }, [recitationId]);
  
  // Keep playing state in sync with ref for interval access
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  /* ---- helpers ---- */
  const totalVerses = verses.length;
  const currentVerseIndex = currentVerseId
    ? verses.findIndex(v => v.id === currentVerseId)
    : -1;
  const progress = duration > 0 ? position / duration : 0;

  /* ---- position polling with better error handling ---- */
  const startPolling = useCallback(() => {
    console.log('🔄 Starting position polling');
    
    if (positionInterval.current) {
      clearInterval(positionInterval.current);
    }
    
    positionInterval.current = setInterval(async () => {
      try {
        // Check if we should continue polling
        if (!isLoadedRef.current || !isPlayingRef.current) {
          console.log('⏸️ Stopping polling - not loaded or not playing');
          return;
        }
        
        const info = await SoundPlayer.getInfo();
        console.log(`📍 Position update: ${info.currentTime.toFixed(1)}s / ${info.duration.toFixed(1)}s`);
        
        // Update position state
        setPosition(info.currentTime);
        
        // Update duration if it changed (sometimes duration isn't available immediately)
        if (info.duration > 0 && Math.abs(info.duration - duration) > 0.1) {
          console.log(`⏱️ Duration updated: ${info.duration}s`);
          setDuration(info.duration);
        }
        
        // Auto-detect completion with more precise threshold
        const isNearEnd = info.duration > 0 && info.currentTime >= (info.duration - 0.5);
        if (isNearEnd) {
          console.log('🏁 Audio completion detected via polling');
          handleAudioCompletion();
        }
      } catch (err) {
        // Only log errors if we expect audio to be loaded
        if (isLoadedRef.current && isPlayingRef.current) {
          console.warn('⚠️ Position polling error:', err);
        }
      }
    }, 250); // Reduced interval for smoother updates
  }, [duration, handleAudioCompletion]);

  const stopPolling = useCallback(() => {
    console.log('⏹️ Stopping position polling');
    if (positionInterval.current) {
      clearInterval(positionInterval.current);
      positionInterval.current = null;
    }
  }, []);

  /* ---- handle audio completion ---- */
  const handleAudioCompletion = useCallback(() => {
    console.log('🎵 Handling audio completion');
    setIsPlaying(false);
    stopPolling();
    
    // Auto-play next verse
    const currentIdx = versesRef.current.findIndex(v => v.id === currentVerseId);
    if (currentIdx >= 0 && currentIdx < versesRef.current.length - 1) {
      const nextVerse = versesRef.current[currentIdx + 1];
      console.log(`⏭️ Auto-playing next verse: ${nextVerse.verseKey}`);
      setTimeout(() => {
        playAudio(nextVerse.id);
      }, 500);
    } else {
      console.log('📝 Reached end of playlist');
      setCurrentVerseId(null);
      setPosition(0);
      isLoadedRef.current = false;
    }
  }, [currentVerseId, stopPolling, playAudio]);

  /* ---- setup event listeners ---- */
  useEffect(() => {
    console.log('🎧 Setting up SoundPlayer event listeners');
    
    // Cleanup existing subscriptions
    if (finishedPlayingSubscription.current) {
      finishedPlayingSubscription.current.remove();
    }
    if (finishedLoadingURLSubscription.current) {
      finishedLoadingURLSubscription.current.remove();
    }

    // Subscribe to FinishedPlaying event
    finishedPlayingSubscription.current = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
      console.log('🎵 FinishedPlaying event:', success);
      
      if (!success) {
        console.error('❌ Playback failed');
        setError('Audio playback failed');
        setIsPlaying(false);
        stopPolling();
        return;
      }
      
      handleAudioCompletion();
    });

    // Subscribe to FinishedLoadingURL event
    finishedLoadingURLSubscription.current = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
      console.log('📥 FinishedLoadingURL event:', success, url);
      
      if (!success) {
        console.error('❌ Failed to load URL:', url);
        setError('Failed to load audio from URL');
        setIsLoading(false);
        isLoadedRef.current = false;
        return;
      }
      
      console.log('✅ URL loaded successfully, getting audio info...');
      isLoadedRef.current = true;
      
      // Get duration after successful load
      SoundPlayer.getInfo()
        .then(info => {
          console.log('📊 Audio info after load:', info);
          setDuration(info.duration);
          setPosition(0);
          // Start playback immediately after load
          startPlayback();
        })
        .catch(err => {
          console.error('❌ Error getting audio info after load:', err);
          setError('Failed to get audio information');
          setIsLoading(false);
        });
    });

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up event listeners');
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

  /* ---- improved URL construction ---- */
  const constructAudioUrl = useCallback((rawUrl: string): string => {
    console.log("🔗 Raw URL:", rawUrl);
    
    // Check if URL is already complete (has protocol and domain)
    const isCompleteUrl = /^https?:\/\//i.test(rawUrl) || /^\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(rawUrl);
    
    if (isCompleteUrl) {
      // If URL starts with //, add https:
      if (rawUrl.startsWith('//')) {
        const completeUrl = `https:${rawUrl}`;
        console.log("🔗 Complete URL (added https):", completeUrl);
        return completeUrl;
      }
      // If URL already has protocol, use as is
      console.log("🔗 Complete URL (as is):", rawUrl);
      return rawUrl;
    } else {
      // Construct full URL with base URL
      const baseUrl = API_ENDPOINTS.QURAN_FOUNDATION.AUDIO_BASE_URL;
      // Ensure proper URL joining (avoid double slashes)
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const cleanRawUrl = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
      const fullUrl = `${cleanBaseUrl}${cleanRawUrl}`;
      console.log("🔗 Constructed URL:", fullUrl);
      return fullUrl;
    }
  }, []);

  /* ---- audio url fetch with improved URL handling ---- */
  const fetchAudioUrl = useCallback(async (verseKey: string): Promise<string> => {
    try {
      const res = await quranService.getAyahRecitation(recitationIdRef.current || 7, verseKey);
      console.log("📡 API Response:", res);
      
      if (!res?.audio_files?.[0]?.url) {
        throw new Error('No audio URL in response');
      }
      
      const rawUrl = res.audio_files[0].url;
      const finalUrl = constructAudioUrl(rawUrl);
      
      // Validate final URL
      try {
        new URL(finalUrl);
        console.log("✅ Valid URL constructed:", finalUrl);
        return finalUrl;
      } catch (urlError) {
        throw new Error(`Invalid URL constructed: ${finalUrl}`);
      }
    } catch (err) {
      console.error('❌ Error fetching audio URL:', err);
      throw new Error(`Failed to fetch audio URL: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [constructAudioUrl]);

  /* ---- play audio ---- */
  const playAudio = useCallback(async (verseId: number): Promise<void> => {
    // Prevent multiple simultaneous requests
    if (isLoading) {
      console.log('⏳ Already loading, ignoring play request');
      return;
    }
    
    console.log('▶️ Starting playAudio for verseId:', verseId);
    setIsLoading(true);
    setError(null);
    stopPolling();

    try {
      // Find verse
      const verse = versesRef.current.find(v => v.id === verseId);
      if (!verse) {
        throw new Error(`Verse with ID ${verseId} not found`);
      }

      console.log('🎵 Playing verse:', verse.verseKey);
      
      // Stop any currently playing audio
      try {
        SoundPlayer.stop();
        console.log('⏹️ Stopped previous audio');
      } catch (stopErr) {
        console.warn('⚠️ No audio to stop:', stopErr);
      }

      // Reset state
      setPosition(0);
      setDuration(0);
      setIsPlaying(false);
      isLoadedRef.current = false;

      // Fetch audio URL
      const url = await fetchAudioUrl(verse.verseKey);
      currentUrl.current = url;

      console.log('📥 Loading audio from URL:', url);
      
      // Load URL (this will trigger FinishedLoadingURL event)
      SoundPlayer.loadUrl(url);
      
      // Set current verse immediately since we're starting to load
      setCurrentVerseId(verseId);
      
    } catch (error) {
      console.error('❌ Error in playAudio:', error);
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
      console.log('▶️ Starting playback after successful load');
      SoundPlayer.play();
      setIsPlaying(true);
      setIsLoading(false);
      startPolling(); // Start polling when playback begins
      console.log('✅ Playback started successfully');
    } catch (err) {
      console.error('❌ Error starting playback:', err);
      setError('Failed to start playback');
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [startPolling]);

  /* ---- control functions ---- */
  const pauseAudio = useCallback(() => {
    try {
      console.log('⏸️ Pausing audio');
      SoundPlayer.pause();
      setIsPlaying(false);
      stopPolling();
    } catch (err) {
      console.error('❌ Error pausing audio:', err);
      setError('Failed to pause audio');
    }
  }, [stopPolling]);

  const resumeAudio = useCallback(() => {
    try {
      if (!isLoadedRef.current) {
        console.warn('⚠️ No audio loaded to resume');
        return;
      }
      console.log('▶️ Resuming audio');
      SoundPlayer.resume();
      setIsPlaying(true);
      startPolling(); // Restart polling when resuming
    } catch (err) {
      console.error('❌ Error resuming audio:', err);
      setError('Failed to resume audio');
    }
  }, [startPolling]);

  const stopAudio = useCallback(() => {
    try {
      console.log('⏹️ Stopping audio');
      SoundPlayer.stop();
      setIsPlaying(false);
      setPosition(0);
      setCurrentVerseId(null);
      isLoadedRef.current = false;
      stopPolling();
    } catch (err) {
      console.error('❌ Error stopping audio:', err);
    }
  }, [stopPolling]);

  const seekTo = useCallback((seconds: number) => {
    try {
      if (!isLoadedRef.current) {
        console.warn('⚠️ No audio loaded to seek');
        return;
      }
      if (seconds < 0 || seconds > duration) {
        console.warn('⚠️ Invalid seek position:', seconds);
        return;
      }
      console.log('⏩ Seeking to:', seconds);
      SoundPlayer.seek(seconds);
      setPosition(seconds);
      
      // If audio was playing, restart polling after seek
      if (isPlayingRef.current) {
        startPolling();
      }
    } catch (err) {
      console.error('❌ Error seeking:', err);
      setError('Failed to seek');
    }
  }, [duration, startPolling]);

  const playNext = useCallback(async () => {
    const currentIdx = versesRef.current.findIndex(v => v.id === currentVerseId);
    if (currentIdx >= 0 && currentIdx < versesRef.current.length - 1) {
      const nextVerse = versesRef.current[currentIdx + 1];
      await playAudio(nextVerse.id);
    } else {
      console.log('⚠️ No next verse available');
    }
  }, [currentVerseId, playAudio]);

  const playPrevious = useCallback(async () => {
    const currentIdx = versesRef.current.findIndex(v => v.id === currentVerseId);
    if (currentIdx > 0) {
      const prevVerse = versesRef.current[currentIdx - 1];
      await playAudio(prevVerse.id);
    } else {
      console.log('⚠️ No previous verse available');
    }
  }, [currentVerseId, playAudio]);

  const setVolume = useCallback((volume: number) => {
    try {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      SoundPlayer.setVolume(clampedVolume);
      console.log('🔊 Volume set to:', clampedVolume);
    } catch (err) {
      console.error('❌ Error setting volume:', err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const cleanup = useCallback(() => {
    try {
      console.log('🧹 Cleaning up audio hook');
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
      
      console.log('✅ Audio hook cleanup completed');
    } catch (err) {
      console.error('❌ Error during cleanup:', err);
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