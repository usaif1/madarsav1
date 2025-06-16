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
  
  // Initialize with the first name when component mounts
  useEffect(() => {
    if (namesData && namesData.length > 0) {
      setHomeAudioNameId(namesData[0].number);
    }
  }, [namesData]);

  const handlePress = async () => {
    if (onPress) {
      onPress();
    }
    
    if (isPlaying) {
      // If playing, show the player
      setShowPlayer(true);
    } else {
      // If not playing, start playing and show player
      if (namesData && namesData.length > 0) {
        const firstName = namesData[0];
        if (firstName && firstName.audioLink) {
          if (position > 0) {
            await resumeAudio();
          } else {
            await playAudioFromUrl(firstName.audioLink);
          }
          setShowPlayer(true);
        }
      }
    }
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
  };

  const handlePlayerPlayPause = () => {
    // Player handles its own play/pause logic
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
            <CdnSvg path={DUA_ASSETS.NAMES_PAUSE} width={18} height={18} />
          ) : (
            <CdnSvg path={DUA_ASSETS.NAMES_RIGHT_TRIANGLE} width={18} height={18} />
          )}
        </TouchableOpacity>
      )}

      {/* Modal for NameAudioPlayer */}
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