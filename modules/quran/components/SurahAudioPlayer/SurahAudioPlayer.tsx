import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Medium, CaptionMedium } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import { useSurahAudio } from '../../hooks/useSurahAudio';

interface SurahAudioPlayerProps {
  surahId: number;
  surahName: string;
  verses: any[];
  onClose?: () => void;
}

const SurahAudioPlayer: React.FC<SurahAudioPlayerProps> = ({
  surahId,
  surahName,
  verses,
  onClose,
}) => {
  // Get audio functionality from the useSurahAudio hook
  const { 
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
    playNext,
    playPrevious,
    seekTo
  } = useSurahAudio(verses.length);
  
  // Format time helper function
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress
  const progress = useMemo(() => {
    return duration > 0 ? position / duration : 0;
  }, [position, duration]);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        pauseAudio();
      } else {
        if (position > 0) {
          await resumeAudio();
        } else {
          await playAudio(currentVerseId);
        }
      }
    } catch (error) {
      console.error('Error in handlePlayPause:', error);
    }
  };

  // Handle seek functionality with proper position calculation
  const handleSeek = (event: any) => {
    const { locationX } = event.nativeEvent;
    const progressBarWidth = scale(232); // Width of progress bar in middle section
    const percentage = Math.max(0, Math.min(1, locationX / progressBarWidth));
    const newPosition = percentage * duration;
    
    if (duration > 0) {
      seekTo(newPosition);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleNext = async () => {
    try {
      await playNext();
    } catch (error) {
      console.error('Error playing next verse:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await playPrevious();
    } catch (error) {
      console.error('Error playing previous verse:', error);
    }
  };

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
          imageStyle={styles.trackImageStyle}>
          <View style={styles.iconContainer}>
            <CdnSvg path={DUA_ASSETS.AL_HUSNA_ICON} width={24} height={30} />
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* Middle Section - Track Info and Progress */}
      <View style={styles.middleSection}>
        {/* Track Name and Time */}
        <View style={styles.trackInfoRow}>
          <Body1Title2Medium color="white" style={styles.trackName}>
            {surahName} - Verse {currentVerseId}
          </Body1Title2Medium>
          <CaptionMedium style={styles.timeText}>
            {formatTime(position)} / {formatTime(duration)}
          </CaptionMedium>
        </View>
        
        {/* Progress Bar with larger touch area */}
        <View style={styles.progressContainer}>
          <TouchableOpacity 
            style={styles.progressBarTouchArea}
            onPress={handleSeek}
            activeOpacity={0.7}>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground} />
              <View style={[styles.progressBar, {width: `${Math.min(100, Math.max(0, progress * 100))}%`}]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {/* Previous Button */}
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={handlePrevious}
          disabled={isLoading || currentVerseId <= 1}
          activeOpacity={0.7}
        >
          <CdnSvg 
            path={DUA_ASSETS.QURAN_PLAY_PREVIOUS_ICON} 
            width={16} 
            height={16} 
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
          style={styles.controlButton} 
          onPress={handleNext}
          disabled={isLoading || currentVerseId >= totalVerses}
          activeOpacity={0.7}
        >
          <CdnSvg 
            path={DUA_ASSETS.QURAN_PLAY_NEXT_ICON} 
            width={16} 
            height={16} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(350), // Reduced width to fit screen better
    height: verticalScale(51),
    borderRadius: scale(45),
    paddingTop: verticalScale(6),
    paddingHorizontal: scale(8),
    paddingBottom: verticalScale(6),
    backgroundColor: '#16092A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center content
    gap: scale(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'center', // Center the entire container
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
    width: scale(180), // Adjusted width for better balance
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
    gap: scale(6), // Reduced gap for better fit
  },
  controlButton: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
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