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
  totalVerses: number;
  playAudio: (verseId: number) => Promise<void>;
  pauseAudio: () => void;
  resumeAudio: () => Promise<void>;
  stopAudio: () => void;
  seekTo: (position: number) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  cleanup: () => void;
}

export const useSurahAudio = (
  verses: VerseData[] = [],
  recitationId: number = 7
): SurahAudioHook => {
  // Simple local state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentVerseId, setCurrentVerseId] = useState<number | null>(null);
  
  // Stable refs
  const eventListenerRef = useRef<any>(null);
  const currentTrackRef = useRef<string | null>(null);
  const versesRef = useRef(verses);
  const isInitializedRef = useRef(false);

  // Update verses ref when verses change
  useEffect(() => {
    versesRef.current = verses;
  }, [verses]);

  const totalVerses = verses.length;

  // Initialize AudioPro once
  useEffect(() => {
    if (!isInitializedRef.current) {
      console.log('🎵 [SurahAudio] Initializing...');
      
      AudioPro.configure({
        contentType: AudioProContentType.SPEECH,
        showNextPrevControls: false,
      });

      eventListenerRef.current = AudioPro.addEventListener((event) => {
        console.log('🎵 [SurahAudio] Event:', event.type);
        
        switch (event.type) {
          case 'STATE_CHANGED':
            const state = event.payload?.state;
            setIsPlaying(state === 'PLAYING');
            setIsLoading(state === 'LOADING');
            
            // Handle auto-next on completion
            if (state === 'STOPPED') {
              console.log('🎵 [SurahAudio] Track stopped');
              setPosition(0);
              // Auto-next logic will be handled by the audio player component
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
            setError('Audio playback failed');
            setIsLoading(false);
            break;
        }
      });

      isInitializedRef.current = true;
    }

    // Cleanup on unmount only
    return () => {
      if (eventListenerRef.current) {
        eventListenerRef.current.remove();
        eventListenerRef.current = null;
      }
      AudioPro.stop();
      isInitializedRef.current = false;
    };
  }, []); // Empty deps - run once

  // Fetch audio URL from API
  const fetchAudioUrl = useCallback(async (verseKey: string): Promise<string> => {
    const response = await quranService.getAyahRecitation(recitationId, verseKey);
    
    if (!response.audio_files || response.audio_files.length === 0) {
      throw new Error('No audio files found');
    }
    
    let audioUrl = response.audio_files[0].url;
    if (!audioUrl.startsWith('http')) {
      audioUrl = `${API_ENDPOINTS.QURAN_FOUNDATION.AUDIO_BASE_URL}${audioUrl}`;
    }
    
    return audioUrl;
  }, [recitationId]);

  // Play audio function
  const playAudio = useCallback(async (verseId: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const verse = versesRef.current.find(v => v.id === verseId);
      if (!verse) {
        throw new Error('Verse not found');
      }
      
      const audioUrl = await fetchAudioUrl(verse.verseKey);
      const trackId = `verse-${verseId}-${Date.now()}`;
      
      const track = {
        id: trackId,
        url: audioUrl,
        title: `Verse ${verseId}`,
        artist: 'Quran',
        artwork: '',
      };
      
      currentTrackRef.current = trackId;
      setCurrentVerseId(verseId);
      
      await AudioPro.play(track);
      
    } catch (err) {
      console.error('🎵 [SurahAudio] Play error:', err);
      setError('Failed to play audio');
      setIsLoading(false);
    }
  }, [fetchAudioUrl]);

  // Simple control functions
  const pauseAudio = useCallback(() => {
    if (isPlaying) {
      AudioPro.pause();
    }
  }, [isPlaying]);

  const resumeAudio = useCallback(async (): Promise<void> => {
    if (!isPlaying && currentTrackRef.current) {
      await AudioPro.resume();
    }
  }, [isPlaying]);

  const stopAudio = useCallback(() => {
    AudioPro.stop();
    currentTrackRef.current = null;
    setCurrentVerseId(null);
    setPosition(0);
  }, []);

  const seekTo = useCallback((newPosition: number) => {
    if (duration > 0) {
      AudioPro.seekTo(newPosition * 1000);
      setPosition(newPosition);
    }
  }, [duration]);

  const playNext = useCallback(async (): Promise<void> => {
    if (currentVerseId !== null) {
      const currentIndex = versesRef.current.findIndex(v => v.id === currentVerseId);
      if (currentIndex >= 0 && currentIndex < versesRef.current.length - 1) {
        const nextVerse = versesRef.current[currentIndex + 1];
        await playAudio(nextVerse.id);
      }
    }
  }, [currentVerseId, playAudio]);

  const playPrevious = useCallback(async (): Promise<void> => {
    if (currentVerseId !== null) {
      const currentIndex = versesRef.current.findIndex(v => v.id === currentVerseId);
      if (currentIndex > 0) {
        const previousVerse = versesRef.current[currentIndex - 1];
        await playAudio(previousVerse.id);
      }
    }
  }, [currentVerseId, playAudio]);

  const cleanup = useCallback(() => {
    stopAudio();
  }, [stopAudio]);

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
    cleanup,
  };
};