import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator} from 'react-native';
import {scale, verticalScale} from '@/theme/responsive';
import {Body1Title2Medium, CaptionMedium, Title3Bold} from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import { useNameAudio } from '@/modules/names/hooks/useNameAudio';
import { useGlobalStore } from '@/globalStore';
import { useAll99Names } from '@/modules/names/hooks/use99Names';
import { useNavigation } from '@react-navigation/native';

interface AudioPlayerProps {
  trackName?: string;
  onPlayPause?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  trackName = 'Asma-ul-husna',
  onPlayPause,
}) => {
  const navigation = useNavigation();
  
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
    // Time is already in seconds from our updated hook
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
    console.log('🟢 AudioPlayer state update:', { isPlaying, isLoading, namesLoading });
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
  
  useEffect(() => {
    console.log('UI Update:', {
      isPlaying,
      progress,
      position,
      duration,
      formattedTime: `${formatTime(position)} / ${formatTime(duration)}`
    });
  }, [isPlaying, progress, position, duration]);
  
  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);
  
  const handlePlayPause = async () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      // Find the current name data to get the audio URL
      if (namesData && homeAudio.currentNameId) {
        const currentName = namesData.find(name => name.number === homeAudio.currentNameId);
        if (currentName && currentName.audioLink) {
          // If we have a position > 0, always resume from that position
          if (position > 0) {
            await resumeAudio();
          } else {
            // Start from the beginning
            await playAudioFromUrl(currentName.audioLink);
          }
        } else {
          console.error('Audio URL not found for name ID:', homeAudio.currentNameId);
        }
      }
    }
    
    if (onPlayPause) {
      onPlayPause();
    }
  };

  // Handle seek functionality with proper position calculation
  const handleSeek = (event: any) => {
    const { locationX } = event.nativeEvent;
    const progressBarWidth = scale(259); // Updated width for progress bar
    const percentage = Math.max(0, Math.min(1, locationX / progressBarWidth));
    const newPosition = percentage * duration;
    
    if (duration > 0) {
      seekTo(newPosition);
    }
  };

  // Navigate to names module
  const handleViewAllNames = () => {
    navigation.navigate('names' as never);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: getCdnUrl(DUA_ASSETS.AL_HUSNA_BACKGROUND) }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}>
        
        {/* Upper Section with Title and Icon */}
        <View style={styles.upperSection}>
          {/* Left side - Title and Link */}
          <View style={styles.titleContainer}>
            <Title3Bold color="white" style={styles.title}>
              99 Names of Allah
            </Title3Bold>
            <TouchableOpacity onPress={handleViewAllNames} style={styles.viewAllContainer}>
              <CaptionMedium style={styles.viewAllText}>
                View all names
              </CaptionMedium>
              <Text style={{color:'#E5E5E5'}}>&gt;</Text>
            </TouchableOpacity>
          </View>

          {/* Right side - Icon */}
          <ImageBackground
            source={{ uri: getCdnUrl(DUA_ASSETS.AL_HUSNA_TRACK_BACKGROUND) }}
            style={styles.trackImageContainer}
            imageStyle={styles.trackImageStyle}>
            <View style={styles.iconContainer}>
              <CdnSvg path={DUA_ASSETS.AL_HUSNA_ICON} width={45} height={56} />
            </View>
          </ImageBackground>
        </View>

        {/* Lower Section with Blurred Background */}
        <View style={styles.lowerSection}>
          {/* Track Name, Time and Play/Pause */}
          <View style={styles.trackControlsRow}>
            {/* Left Section: Track Info and Progress Bar */}
            <View style={styles.leftSection}>
              {/* Track Name and Time in same row */}
              <View style={styles.trackInfoRow}>
                <Body1Title2Medium style={styles.trackName}>
                  {trackName}
                </Body1Title2Medium>
                <CaptionMedium style={styles.timeText}>
                  {formatTime(position)} / {formatTime(duration)}
                </CaptionMedium>
              </View>

              {/* Progress Bar below track info */}
              <View style={styles.progressBarTouchContainer}>
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

            {/* Play/Pause Button - centered beside left section */}
            <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : isPlaying ? (
                <CdnSvg path={DUA_ASSETS.NAMES_PAUSE} width={14} height={14} />
              ) : (
                <CdnSvg path={DUA_ASSETS.PLAY} width={14} height={14} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(339),
    height: verticalScale(170),
    borderRadius: scale(8), // radius-md
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    alignSelf: 'center',
    marginBottom: verticalScale(16),
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  backgroundImageStyle: {
    borderRadius: scale(8),
    resizeMode: 'cover',
    transform: [{ scaleX: -1 }],
  },
  upperSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: scale(20),
    paddingTop: scale(14),
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    marginRight: scale(16),
    paddingTop: scale(20),
  },
  title: {
    fontSize: scale(17),
    fontWeight: '600',
    marginBottom: scale(4),
  },
  viewAllContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  viewAllText: {
    fontSize: scale(12),
    color: '#E5E5E5',
    opacity: 0.8,
    textDecorationLine: 'underline',
  },
  trackImageContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  trackImageStyle: {
    borderRadius: scale(8),
    resizeMode: 'cover',
    opacity: 0.9,
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowerSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: verticalScale(52),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomLeftRadius: scale(8),
    borderBottomRightRadius: scale(8),
    paddingTop: scale(8),
    paddingBottom: scale(12),
    paddingHorizontal: scale(20),
  },
  trackControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  leftSection: {
    flex: 1,
    marginRight: scale(12),
  },
  trackInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  trackInfoLeft: {
    flex: 1,
    marginRight: scale(12),
    flexDirection:'row',
    alignItems:'center',
justifyContent:'space-between',
width:'100%'
  },
  trackName: {
    fontSize: scale(14),
    fontWeight: '500',
    color: 'white',
  },
  timeText: {
    fontSize: scale(10),
    color: '#E5E5E5',
  },
  playPauseButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  progressBarTouchContainer: {
    width: '100%',
    height: verticalScale(12),
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  progressBarBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(1.5),
  },
});

export default AudioPlayer;
