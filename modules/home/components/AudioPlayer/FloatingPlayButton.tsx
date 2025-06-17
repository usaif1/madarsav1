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
  const [manuallyClosedRef, setManuallyClosedRef] = useState<boolean>(false);
  
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
    console.log('🔵 FloatingPlayButton state update:', { isPlaying, isLoading, namesLoading, showPlayer });
  }, [isPlaying, isLoading, namesLoading, showPlayer]);
  
  // Initialize with the first name when component mounts
  useEffect(() => {
    if (namesData && namesData.length > 0) {
      // Set the first name as the current audio (don't depend on isPlaying state)
      setHomeAudioNameId(namesData[0].number);
    }
  }, [namesData]);

  // Auto-show NameAudioPlayer when audio is playing (only if not manually closed)
  useEffect(() => {
    if (isPlaying && !showPlayer && !manuallyClosedRef) {
      console.log('🔵 Audio is playing, auto-showing NameAudioPlayer');
      setShowPlayer(true);
    }
  }, [isPlaying, manuallyClosedRef]); // Respect manual close flag

  // Auto-hide NameAudioPlayer when audio stops playing
  useEffect(() => {
    if (!isPlaying && showPlayer && !isLoading) {
      console.log('🔵 Audio stopped, auto-hiding NameAudioPlayer');
      setShowPlayer(false);
      setManuallyClosedRef(false); // Reset manual close flag when audio stops
    }
  }, [isPlaying, isLoading]); // Removed showPlayer dependency

  const handlePress = async () => {
    if (onPress) {
      onPress();
    }
    
    // Always show the player when pressed and clear manual close flag
    setShowPlayer(true);
    setManuallyClosedRef(false);
    
    // If not playing, start/resume audio
    if (!isPlaying && namesData && namesData.length > 0) {
      const firstName = namesData[0];
      if (firstName && firstName.audioLink) {
        if (position > 0) {
          console.log('🔵 Resuming audio from position:', position);
          await resumeAudio();
        } else {
          console.log('🔵 Starting fresh audio');
          await playAudioFromUrl(firstName.audioLink);
        }
      }
    }
  };

  const handleClosePlayer = () => {
    console.log('🔵 Manually closing NameAudioPlayer');
    setShowPlayer(false);
    setManuallyClosedRef(true); // Mark as manually closed
  };

  const handlePlayerPlayPause = () => {
    // The NameAudioPlayer handles its own play/pause logic
    // No need to duplicate logic here
  };

  return (
    <>
      {/* Floating Button - Hide when player is open */}
      {!showPlayer && (
        <TouchableOpacity 
          style={styles.floatingButton} 
          onPress={handlePress}
          disabled={isLoading || namesLoading}
          activeOpacity={0.8}
        >
          {(isLoading || namesLoading) ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : isPlaying ? (
            <CdnSvg path={DUA_ASSETS.NAMES_PAUSE_WHITE} width={18} height={18} />
          ) : (
            <CdnSvg path={DUA_ASSETS.NAMES_RIGHT_TRIANGLE} width={18} height={18} />
          )}
        </TouchableOpacity>
      )}

      {/* Modal for NameAudioPlayer */}
      <Modal
        isVisible={showPlayer}
        backdropOpacity={0.3}
        backdropColor="#000000"
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={handleClosePlayer}
        onBackButtonPress={handleClosePlayer}
        swipeDirection={['down']}
        onSwipeComplete={handleClosePlayer}
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