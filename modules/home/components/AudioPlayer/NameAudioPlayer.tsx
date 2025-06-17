import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator} from 'react-native';
import {scale, verticalScale} from '@/theme/responsive';
import {Body1Title2Medium, CaptionMedium} from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import { useNameAudio } from '@/modules/names/hooks/useNameAudio';
import { useGlobalStore } from '@/globalStore';
import { useAll99Names } from '@/modules/names/hooks/use99Names';

interface NameAudioPlayerProps {
  trackName?: string;
  onPlayPause?: () => void;
  onClose?: () => void;
}

const NameAudioPlayer: React.FC<NameAudioPlayerProps> = ({
  trackName = 'Asma-ul-husna',
  onPlayPause,
  onClose,
}) => {
  // Get audio functionality from the hook
  const { 
    isPlaying, 
    isLoading, 
    error, 
    duration, 
    position, 
    playAudio, 
    playAudioFromUrl,
    pauseAudio, 
    resumeAudio,
    stopAudio,
    seekTo
  } = useNameAudio();
  
  // Get and set global state
  const { 
    homeAudio, 
    setHomeAudioPlaying, 
    setHomeAudioProgress, 
    setHomeAudioTime,
    setHomeAudioNameId 
  } = useGlobalStore();
  
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

  // Get current name data to access the audio URL
  const { data: namesData, isLoading: namesLoading } = useAll99Names();
  
  // Debug logging for button state
  useEffect(() => {
    console.log('🟡 NameAudioPlayer state update:', { isPlaying, isLoading, namesLoading });
  }, [isPlaying, isLoading, namesLoading]);
  
  // Initialize with the first name when component mounts
  useEffect(() => {
    if (namesData && namesData.length > 0) {
      // Set the first name as the current audio (don't depend on isPlaying state)
      setHomeAudioNameId(namesData[0].number);
    }
  }, [namesData]);
  
  // Update global state when local state changes
  useEffect(() => {
    setHomeAudioPlaying(isPlaying);
    setHomeAudioProgress(progress);
    setHomeAudioTime(position, duration);
  }, [isPlaying, progress, position, duration]);
  
  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Don't stop audio when component unmounts - let it continue playing
      // Only stop if explicitly closed
    };
  }, []);
  
  const handlePlayPause = async () => {
    try {
      console.log('🟡 NameAudioPlayer handlePlayPause called - isPlaying:', isPlaying);
      
      if (isPlaying) {
        console.log('🟡 Pausing audio from NameAudioPlayer');
        pauseAudio();
      } else {
        // Find the current name data to get the audio URL
        if (namesData && namesData.length > 0) {
          // Always use the first name (Asma-ul-husna) for this player
          const firstName = namesData[0];
          if (firstName && firstName.audioLink) {
            // If we have a position > 0, always resume from that position
            if (position > 0) {
              console.log('🟡 Resuming audio from NameAudioPlayer at position:', position);
              await resumeAudio();
            } else {
              console.log('🟡 Starting fresh audio from NameAudioPlayer');
              await playAudioFromUrl(firstName.audioLink);
            }
          } else {
            console.error('Audio URL not found for first name');
          }
        }
      }
      
      if (onPlayPause) {
        onPlayPause();
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
    // Don't stop audio when closing - let it continue in background
    if (onClose) {
      onClose();
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
            {trackName}
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

      {/* Play/Pause Button */}
      <TouchableOpacity 
        style={[styles.playPauseButton, { zIndex: 1000 }]} 
        onPress={() => {
          console.log('🟡 TouchableOpacity pressed in NameAudioPlayer');
          handlePlayPause();
        }} 
        disabled={isLoading}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : isPlaying ? (
          <View style={styles.iconContainer}>
            <CdnSvg path={DUA_ASSETS.NAMES_PAUSE_WHITE} width={12} height={12} />
            {/* Fallback text if icon doesn't load */}
            <Text style={styles.fallbackIcon}>⏸️</Text>
          </View>
        ) : (
          <View style={styles.iconContainer}>
            <CdnSvg path={DUA_ASSETS.NAMES_RIGHT_TRIANGLE} width={12} height={12} />
            {/* Fallback text if icon doesn't load */}
            <Text style={styles.fallbackIcon}>▶️</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(343),
    height: verticalScale(51),
    borderRadius: scale(45),
    paddingTop: verticalScale(6),
    paddingRight: scale(12),
    paddingBottom: verticalScale(6),
    paddingLeft: scale(6),
    backgroundColor: '#16092A',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    width: scale(232),
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
    fontSize: scale(14),
    lineHeight: scale(16),
    color: '#FFFFFF',
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
  playPauseButton: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(21),
    backgroundColor: '#8A57DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackIcon: {
    color: '#FFFFFF',
    fontSize: 8,
    position: 'absolute',
    textAlign: 'center',
  },
});

export default NameAudioPlayer; 