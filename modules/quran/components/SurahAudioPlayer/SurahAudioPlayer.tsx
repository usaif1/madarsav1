import React, { useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Medium, CaptionMedium } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import { useQuranStore } from '../../store/quranStore';
import { useSurahAudio } from '../../hooks/useSurahAudio';

interface VerseData {
  id: number;
  verseKey: string;
  arabic: string;
  translation: string;
}

interface SurahAudioPlayerProps {
  surahId: number;
  surahName: string;
  verses: VerseData[];
  onClose?: () => void;
}

const SurahAudioPlayer: React.FC<SurahAudioPlayerProps> = ({
  surahId,
  surahName,
  verses,
  onClose,
}) => {
  // Get reciter settings from store
  const { settings } = useQuranStore();
  
  // Initialize audio hook with verses and reciter
  const audioHook = useSurahAudio(verses, settings.selectedReciterId);
  
  const { 
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
    playNext,
    playPrevious,
    seekTo,
    clearError,
    cleanup
  } = audioHook;
  
  // Auto-start first verse when player opens
  useEffect(() => {
    if (verses.length > 0 && !currentVerseId && !isPlaying && !isLoading) {
      console.log('🎵 SurahAudioPlayer: Auto-starting first verse');
      playAudio(verses[0].id);
    }
  }, [verses, currentVerseId, isPlaying, isLoading, playAudio]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);
  
  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Audio Error',
        error,
        [
          { text: 'OK', onPress: clearError }
        ]
      );
    }
  }, [error, clearError]);
  
  // Format time helper function
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Get current verse info
  const currentVerse = useMemo(() => {
    if (currentVerseId) {
      return verses.find(v => v.id === currentVerseId);
    }
    return verses[0] || null;
  }, [currentVerseId, verses]);

  // Handle play/pause
  const handlePlayPause = useCallback(async () => {
    try {
      if (isPlaying) {
        pauseAudio();
      } else {
        if (currentVerseId && position > 0) {
          await resumeAudio();
        } else {
          // If no verse is selected, start with first verse
          const verseToPlay = currentVerseId || (verses[0]?.id);
          if (verseToPlay) {
            await playAudio(verseToPlay);
          }
        }
      }
    } catch (err) {
      console.error('Error in handlePlayPause:', err);
    }
  }, [isPlaying, currentVerseId, position, pauseAudio, resumeAudio, playAudio, verses]);

  // Handle seek functionality
  const handleSeek = useCallback((event: any) => {
    const { locationX } = event.nativeEvent;
    const progressBarWidth = scale(180);
    const percentage = Math.max(0, Math.min(1, locationX / progressBarWidth));
    const newPosition = percentage * duration;
    
    if (duration > 0) {
      seekTo(newPosition);
    }
  }, [duration, seekTo]);

  // Handle close
  const handleClose = useCallback(() => {
    cleanup();
    if (onClose) {
      onClose();
    }
  }, [cleanup, onClose]);

  // Handle next verse
  const handleNext = useCallback(async () => {
    try {
      await playNext();
    } catch (err) {
      console.error('Error playing next verse:', err);
    }
  }, [playNext]);

  // Handle previous verse
  const handlePrevious = useCallback(async () => {
    try {
      await playPrevious();
    } catch (err) {
      console.error('Error playing previous verse:', err);
    }
  }, [playPrevious]);

  // Check navigation availability
  const canGoNext = currentVerseIndex >= 0 && currentVerseIndex < verses.length - 1;
  const canGoPrevious = currentVerseIndex > 0;

  return (
    <View style={styles.container}>
      {/* Track Image */}
      <TouchableOpacity 
        style={styles.trackImageContainer}
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <ImageBackground
          source={{ uri: getCdnUrl(DUA_ASSETS.AL_HUSNA_TRACK_BACKGROUND) }}
          style={styles.trackImage}
          imageStyle={styles.trackImageStyle}
        >
          <View style={styles.iconContainer}>
            <CdnSvg path={DUA_ASSETS.AL_HUSNA_ICON} width={24} height={30} />
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* Middle Section - Track Info and Progress */}
      <View style={styles.middleSection}>
        {/* Track Name and Time */}
        <View style={styles.trackInfoRow}>
          <Body1Title2Medium color="white" style={styles.trackName} numberOfLines={1}>
            {surahName} - Verse {currentVerseId || 1}
          </Body1Title2Medium>
          <CaptionMedium style={styles.timeText}>
            {formatTime(position)} / {formatTime(duration)}
          </CaptionMedium>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <TouchableOpacity 
            style={styles.progressBarTouchArea}
            onPress={handleSeek}
            activeOpacity={0.7}
            disabled={duration === 0 || isLoading}
          >
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground} />
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${Math.min(100, Math.max(0, progress * 100))}%` }
                ]} 
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {/* Previous Button */}
        <TouchableOpacity 
          style={[styles.controlButton, !canGoPrevious && styles.disabledButton]} 
          onPress={handlePrevious}
          disabled={isLoading || !canGoPrevious}
          activeOpacity={0.7}
        >
          <CdnSvg 
            path={DUA_ASSETS.QURAN_PLAY_PREVIOUS_ICON} 
            width={scale(12)} 
            height={scale(12)}
          />
        </TouchableOpacity>

        {/* Play/Pause Button */}
        <TouchableOpacity 
          style={styles.playPauseButton} 
          onPress={handlePlayPause}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : isPlaying ? (
            <CdnSvg path={DUA_ASSETS.NAMES_PAUSE_WHITE} width={12} height={12} />
          ) : (
            <CdnSvg path={DUA_ASSETS.NAMES_RIGHT_TRIANGLE} width={12} height={12} />
          )}
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity 
          style={[styles.controlButton, !canGoNext && styles.disabledButton]} 
          onPress={handleNext}
          disabled={isLoading || !canGoNext}
          activeOpacity={0.7}
        >
          <CdnSvg 
            path={DUA_ASSETS.QURAN_PLAY_NEXT_ICON} 
            width={scale(14)} 
            height={scale(14)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(350),
    height: verticalScale(51),
    borderRadius: scale(45),
    paddingTop: verticalScale(6),
    paddingHorizontal: scale(8),
    paddingBottom: verticalScale(6),
    backgroundColor: '#16092A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'center',
  },
  trackImageContainer: {
    width: scale(39),
    height: scale(39),
    borderRadius: scale(32.5),
    overflow: 'hidden',
  },
  trackImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackImageStyle: {
    borderRadius: scale(32.5),
    resizeMode: 'cover',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleSection: {
    width: scale(180),
    height: verticalScale(30),
    gap: scale(6),
    justifyContent: 'center',
  },
  trackInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  trackName: {
    fontSize: scale(10),
    lineHeight: scale(16),
    color: '#FFFFFF',
    flex: 1,
    marginRight: scale(8),
  },
  timeText: {
    fontSize: scale(10),
    lineHeight: scale(14),
    color: '#FFFFFF',
  },
  progressContainer: {
    height: verticalScale(16),
    justifyContent: 'center',
  },
  progressBarTouchArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: verticalScale(3),
    borderRadius: scale(1.5),
    backgroundColor: '#737373',
    overflow: 'hidden',
  },
  progressBarBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#737373',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  controlButton: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  playPauseButton: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(21),
    backgroundColor: '#8A57DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SurahAudioPlayer;