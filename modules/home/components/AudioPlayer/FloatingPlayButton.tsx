import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {scale, verticalScale} from '@/theme/responsive';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { useNameAudio } from '@/modules/names/hooks/useNameAudio';
import { useGlobalStore } from '@/globalStore';
import { useAll99Names } from '@/modules/names/hooks/use99Names';
import Modal from 'react-native-modal';
import NameAudioPlayer from './NameAudioPlayer';

interface FloatingPlayButtonProps {
  onPress?: () => void;
}

const FloatingPlayButton: React.FC<FloatingPlayButtonProps> = ({
  onPress,
}) => {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  
  // Get audio functionality from the hook
  const { 
    isPlaying, 
    isLoading, 
    playAudioFromUrl,
    pauseAudio, 
    resumeAudio,
    position
  } = useNameAudio();
  
  // Get global state
  const { 
    homeAudio, 
    setHomeAudioNameId 
  } = useGlobalStore();
  
  // Get names data to access the first name's audio
  const { data: namesData, isLoading: namesLoading } = useAll99Names();
  
  // Debug logging for button state
  useEffect(() => {
    console.log('🔵 FloatingPlayButton state update:', { isPlaying, isLoading, namesLoading });
  }, [isPlaying, isLoading, namesLoading]);
  
  // Initialize with the first name when component mounts
  useEffect(() => {
    if (namesData && namesData.length > 0) {
      // Set the first name as the current audio (don't depend on isPlaying state)
      setHomeAudioNameId(namesData[0].number);
    }
  }, [namesData]);

  // Auto-show player if audio is already playing when component mounts
  useEffect(() => {
    if (isPlaying && !isLoading) {
      console.log('🔵 Audio is already playing on mount, showing player...');
      setShowPlayer(true);
    }
  }, [isPlaying, isLoading]);

  // Show/hide player based on audio state changes
  useEffect(() => {
    if (isPlaying && !isLoading) {
      console.log('🔵 Audio started playing, showing player...');
      setShowPlayer(true);
    } else if (!isPlaying && !isLoading) {
      console.log('🔵 Audio stopped playing, hiding player...');
      setShowPlayer(false);
    }
  }, [isPlaying, isLoading]);

  const handlePress = async () => {
    if (onPress) {
      onPress();
    }
    
    // Always show the player when pressed
    setShowPlayer(true);
    
    // If not playing, start/resume audio
    if (!isPlaying && namesData && namesData.length > 0) {
      const firstName = namesData[0];
      if (firstName && firstName.audioLink) {
        if (position > 0) {
          await resumeAudio();
        } else {
          await playAudioFromUrl(firstName.audioLink);
        }
      }
    }
  };

  const handleClosePlayer = () => {
    // Only allow closing if audio is not playing, or pause audio when closing
    if (isPlaying) {
      // Pause the audio when closing the player
      pauseAudio();
    }
    setShowPlayer(false);
  };

  const handlePlayerPlayPause = () => {
    // Player handles its own play/pause logic
  };

  return (
    <>
      {/* Floating Button - Show only when audio is not playing and player is not open */}
      {!showPlayer && !isPlaying && (
        <TouchableOpacity 
          style={styles.floatingButton} 
          onPress={handlePress}
          disabled={isLoading || namesLoading}
          activeOpacity={0.8}
        >
          {(isLoading || namesLoading) ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <CdnSvg path={DUA_ASSETS.NAMES_RIGHT_TRIANGLE} width={18} height={18} />
          )}
        </TouchableOpacity>
      )}

      {/* Modal for NameAudioPlayer - Show when audio is playing or when manually opened */}
      <Modal
        isVisible={showPlayer}
        backdropOpacity={0}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={handleClosePlayer}
        onBackButtonPress={handleClosePlayer}
      >
        <View style={styles.playerContainer}>
          <NameAudioPlayer 
            trackName="Asma-ul-husna"
            onPlayPause={handlePlayerPlayPause}
            onClose={handleClosePlayer}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    width: scale(50),
    height: scale(50),
    bottom: verticalScale(24),
    left: scale(313),
    borderRadius: scale(32),
    backgroundColor: '#8A57DC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  playerContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingBottom: verticalScale(30),
    paddingHorizontal: scale(16),
  },
});

export default FloatingPlayButton; 