import { useState, useEffect, useCallback, useRef } from 'react';
import { AudioPro, AudioProContentType } from 'react-native-audio-pro';
import quranService from '../services/quranService';
import { API_ENDPOINTS } from '@/api/config/apiConfig';

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
  resumeAudio: () => Promise<void>;
  stopAudio: () => void;
  seekTo: (position: number) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  setVolume: (volume: number) => void;
  clearError: () => void;
  cleanup: () => void;
}

export const useSurahAudio = (
  verses: VerseData[] = [],
  recitationId?: number
): SurahAudioHook => {
  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentVerseId, setCurrentVerseId] = useState<number | null>(null);
  
  // Refs for stable references
  const eventListenerRef = useRef<any>(null);
  const currentTrackRef = useRef<{
    id: string;
    verseId: number;
    audioUrl: string;
  } | null>(null);
  const versesRef = useRef(verses);
  const recitationIdRef = useRef(recitationId);
  const isInitializedRef = useRef(false);

  // Update refs when props change
  useEffect(() => {
    versesRef.current = verses;
  }, [verses]);

  useEffect(() => {
    recitationIdRef.current = recitationId;
  }, [recitationId]);

  const totalVerses = verses.length;
  
  // Get current verse index
  const currentVerseIndex = currentVerseId 
    ? verses.findIndex(v => v.id === currentVerseId)
    : -1;

  // Calculate progress
  const progress = duration > 0 ? position / duration : 0;

  // Initialize AudioPro once
  useEffect(() => {
    if (!isInitializedRef.current) {
      console.log('🎵 [SurahAudio] Initializing...');
      
      try {
        AudioPro.configure({
          contentType: AudioProContentType.SPEECH,
          showNextPrevControls: false,
        });

        eventListenerRef.current = AudioPro.addEventListener((event) => {
          console.log('🎵 [SurahAudio] Event:', event.type);
          
          switch (event.type) {
            case 'STATE_CHANGED':
              const state = event.payload?.state;
              const newIsPlaying = state === 'PLAYING';
              const newIsLoading = state === 'LOADING';
              
              setIsPlaying(newIsPlaying);
              setIsLoading(newIsLoading);
              
              // Handle completion
              if (state === 'STOPPED' && currentTrackRef.current) {
                console.log('🎵 [SurahAudio] Track completed');
                setPosition(0);
                // Auto-play next verse if available
                const currentIndex = versesRef.current.findIndex(
                  v => v.id === currentTrackRef.current?.verseId
                );
                if (currentIndex >= 0 && currentIndex < versesRef.current.length - 1) {
                  // Auto-play next verse after a short delay
                  setTimeout(() => {
                    const nextVerse = versesRef.current[currentIndex + 1];
                    if (nextVerse) {
                      playAudio(nextVerse.id);
                    }
                  }, 500);
                }
              }
              break;
              
            case 'PROGRESS':
              const pos = (event.payload?.position || 0) / 1000;
              const dur = (event.payload?.duration || 0) / 1000;
              setPosition(pos);
              setDuration(dur);
              break;
              
            case 'PLAYBACK_ERROR':
              console.error('🎵 [SurahAudio] Error:', event.payload?.error);
              setError(event.payload?.error || 'Audio playback failed');
              setIsLoading(false);
              setIsPlaying(false);
              break;
          }
        });

        isInitializedRef.current = true;
        console.log('🎵 [SurahAudio] Initialized successfully');
      } catch (err) {
        console.error('🎵 [SurahAudio] Initialization error:', err);
        setError('Failed to initialize audio');
      }
    }

    // Cleanup on unmount
    return () => {
      if (eventListenerRef.current) {
        eventListenerRef.current.remove();
        eventListenerRef.current = null;
      }
      if (isInitializedRef.current) {
        AudioPro.stop();
      }
      isInitializedRef.current = false;
    };
  }, []); // Empty deps - run once

  // Fetch audio URL from API
  const fetchAudioUrl = useCallback(async (verseKey: string): Promise<string> => {
    try {
      console.log(`🎵 [SurahAudio] Fetching audio for verse: ${verseKey}, reciter: ${recitationIdRef.current}`);
      
      const response = await quranService.getAyahRecitation(
        recitationIdRef.current || 7, // Default reciter if not provided
        verseKey
      );
      
      if (!response.audio_files || response.audio_files.length === 0) {
        throw new Error('No audio files found for this verse');
      }
      
      let audioUrl = response.audio_files[0].url;
      
      // Ensure full URL
      if (!audioUrl.startsWith('http')) {
        audioUrl = `${API_ENDPOINTS.QURAN_FOUNDATION.AUDIO_BASE_URL}${audioUrl}`;
      }
      
      console.log(`🎵 [SurahAudio] Audio URL retrieved: ${audioUrl}`);
      return audioUrl;
    } catch (err) {
      console.error(`🎵 [SurahAudio] Error fetching audio URL:`, err);
      throw new Error('Failed to fetch audio URL');
    }
  }, []);

  // Play audio function
  const playAudio = useCallback(async (verseId: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🎵 [SurahAudio] Starting playAudio for verse: ${verseId}`);
      
      const verse = versesRef.current.find(v => v.id === verseId);
      if (!verse) {
        throw new Error(`Verse ${verseId} not found in current verses`);
      }
      
      console.log(`🎵 [SurahAudio] Found verse: ${verse.verseKey}`);
      
      const audioUrl = await fetchAudioUrl(verse.verseKey);
      const trackId = `verse-${verseId}-${Date.now()}`;
      
      const track = {
        id: trackId,
        url: audioUrl,
        title: `Verse ${verseId}`,
        artist: 'Quran Recitation',
        artwork: '',
      };
      
      // Store current track info
      currentTrackRef.current = {
        id: trackId,
        verseId,
        audioUrl,
      };
      
      setCurrentVerseId(verseId);
      
      console.log(`🎵 [SurahAudio] Playing track:`, track);
      await AudioPro.play(track);
      
    } catch (err) {
      console.error('🎵 [SurahAudio] Play error:', err);
      setError(err instanceof Error ? err.message : 'Failed to play audio');
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [fetchAudioUrl]);

  // Control functions
  const pauseAudio = useCallback(() => {
    if (isPlaying && currentTrackRef.current) {
      console.log('🎵 [SurahAudio] Pausing audio');
      AudioPro.pause();
    }
  }, [isPlaying]);

  const resumeAudio = useCallback(async (): Promise<void> => {
    try {
      if (!isPlaying && currentTrackRef.current) {
        console.log('🎵 [SurahAudio] Resuming audio');
        await AudioPro.resume();
      }
    } catch (err) {
      console.error('🎵 [SurahAudio] Resume error:', err);
      setError('Failed to resume audio');
    }
  }, [isPlaying]);

  const stopAudio = useCallback(() => {
    console.log('🎵 [SurahAudio] Stopping audio');
    AudioPro.stop();
    currentTrackRef.current = null;
    setCurrentVerseId(null);
    setPosition(0);
    setDuration(0);
    setIsPlaying(false);
  }, []);

  const seekTo = useCallback((newPosition: number) => {
    if (duration > 0 && currentTrackRef.current) {
      console.log(`🎵 [SurahAudio] Seeking to: ${newPosition}s`);
      AudioPro.seekTo(newPosition * 1000); // Convert to milliseconds
      setPosition(newPosition);
    }
  }, [duration]);

  const playNext = useCallback(async (): Promise<void> => {
    if (currentVerseId !== null) {
      const currentIndex = versesRef.current.findIndex(v => v.id === currentVerseId);
      if (currentIndex >= 0 && currentIndex < versesRef.current.length - 1) {
        const nextVerse = versesRef.current[currentIndex + 1];
        console.log(`🎵 [SurahAudio] Playing next verse: ${nextVerse.id}`);
        await playAudio(nextVerse.id);
      } else {
        console.log('🎵 [SurahAudio] No next verse available');
      }
    }
  }, [currentVerseId, playAudio]);

  const playPrevious = useCallback(async (): Promise<void> => {
    if (currentVerseId !== null) {
      const currentIndex = versesRef.current.findIndex(v => v.id === currentVerseId);
      if (currentIndex > 0) {
        const previousVerse = versesRef.current[currentIndex - 1];
        console.log(`🎵 [SurahAudio] Playing previous verse: ${previousVerse.id}`);
        await playAudio(previousVerse.id);
      } else {
        console.log('🎵 [SurahAudio] No previous verse available');
      }
    }
  }, [currentVerseId, playAudio]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    AudioPro.setVolume(clampedVolume);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const cleanup = useCallback(() => {
    console.log('🎵 [SurahAudio] Cleaning up');
    stopAudio();
  }, [stopAudio]);

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