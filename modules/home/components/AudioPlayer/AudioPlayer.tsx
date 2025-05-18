import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import {scale, verticalScale} from '@/theme/responsive';
import {Body1Title2Medium, CaptionMedium} from '@/components/Typography/Typography';
import PauseIcon from '@/assets/home/pause.svg';
import AlHusnaIcon from '@/assets/home/al-husna.svg';

interface AudioPlayerProps {
  trackName?: string;
  currentTime?: string;
  totalTime?: string;
  progress?: number;
  onPlayPause?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  trackName = 'Asma-ul-husna',
  currentTime = '0:20',
  totalTime = '3:12',
  progress = 0.1, // 0 to 1
  onPlayPause,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
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
          source={require('@/assets/home/al-husna-background.png')}
          style={styles.trackImageContainer}
          imageStyle={styles.trackImageStyle}>
          <View style={styles.iconContainer}>
            <AlHusnaIcon width={90} height={120} />
          </View>
        </ImageBackground>

        {/* Play/Pause Button */}
        <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
          <PauseIcon width={14} height={14} />
        </TouchableOpacity>

        {/* Track Info and Progress */}
        <View style={styles.trackInfoContainer}>
          {/* Track Name and Time */}
          <View style={styles.trackNameContainer}>
            <Body1Title2Medium color="white" style={styles.trackName}>
              {trackName}
            </Body1Title2Medium>
            
            <CaptionMedium style={styles.timeText}>
              {currentTime} / -{totalTime}
            </CaptionMedium>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground} />
            <View style={[styles.progressBar, {width: `${progress * 100}%`}]} />
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
