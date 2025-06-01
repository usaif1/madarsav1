import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator} from 'react-native';
import {scale, verticalScale} from '@/theme/responsive';
import {Body1Title2Medium, CaptionMedium} from '@/components/Typography/Typography';
import PauseIcon from '@/assets/home/pause.svg';
import PlayIcon from '@/assets/home/play.svg';
import AlHusnaIcon from '@/assets/home/al-husna.svg';
import { useNameAudio } from '@/modules/names/hooks/useNameAudio';
import { useGlobalStore } from '@/globalStore';
import { useAll99Names } from '@/modules/names/hooks/use99Names';

interface AudioPlayerProps {
  trackName?: string;
  onPlayPause?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  trackName = 'Asma-ul-husna',
  onPlayPause,
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
  
  // Initialize with the first name when component mounts
  useEffect(() => {
    if (namesData && namesData.length > 0 && !isPlaying && !isLoading) {
      // Set the first name as the current audio
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
          // If we were previously playing this track, resume from where we left off
          if (position > 0) {
            await resumeAudio();
          } else {
            // Otherwise start from the beginning
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

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/home/al-husna-background.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}>
        {/* Track Image and Icon */}
        <ImageBackground
          source={require('@/assets/home/al-husna-track-background.png')}
          style={styles.trackImageContainer}
          imageStyle={styles.trackImageStyle}>
          <View style={styles.iconContainer}>
            <AlHusnaIcon width={90} height={120} />
          </View>
        </ImageBackground>

        {/* Play/Pause Button */}
        <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : isPlaying ? (
            <PauseIcon width={14} height={14} />
          ) : (
            <PlayIcon width={14} height={14} />
          )}
        </TouchableOpacity>

        {/* Track Info and Progress */}
        <View style={styles.trackInfoContainer}>
          {/* Track Name and Time */}
          <View style={styles.trackNameContainer}>
            <Body1Title2Medium color="white" style={styles.trackName}>
              {trackName}
            </Body1Title2Medium>
            
            <CaptionMedium style={styles.timeText}>
              {formatTime(position)} / {formatTime(duration)}
            </CaptionMedium>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground} />
            <View style={[styles.progressBar, {width: `${Math.min(100, Math.max(0, progress * 100))}%`}]} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(339),
    height: verticalScale(240),
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
    justifyContent: 'flex-end',
  },
  backgroundImageStyle: {
    borderRadius: scale(8),
    resizeMode: 'cover',
  },
  trackImageContainer: {
    position: 'absolute',
    width: scale(137),
    height: scale(137),
    top: scale(20),
    left: scale(20),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  trackImageStyle: {
    borderRadius: scale(12),
    resizeMode: 'cover',
    opacity: 0.9,
    flex: 1,
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    position: 'absolute',
    width: scale(35),
    height: scale(35),
    top: scale(24),
    right: scale(24),
    borderRadius: scale(24.5),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfoContainer: {
    width: scale(299),
    alignSelf: 'center',
    marginBottom: scale(20),
    marginHorizontal: scale(20),
  },
  trackNameContainer: {
    width: scale(299),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  trackName: {
    fontSize: scale(17),
  },
  timeText: {
    fontSize: scale(10),
    lineHeight: scale(14),
    color: '#E5E5E5',
  },
  progressBarContainer: {
    width: scale(299),
    height: verticalScale(4),
    borderRadius: scale(2),
    backgroundColor: '#FFFFFF4D',
    overflow: 'hidden',
  },
  progressBarBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF4D',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
});

export default AudioPlayer;
