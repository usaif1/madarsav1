import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Pressable, Dimensions, ActivityIndicator, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';

// components & data
import { Body1Title2Bold, Body2Medium, Title3Bold } from '@/components';
import Share from '@/assets/share-light.svg';
import RightTriangle from '@/assets/right-triangle.svg';
import Close from '@/assets/close.svg';
import Pause from '@/assets/home/pause.svg';
// Audio playback
import Sound from 'react-native-sound';

// Enable playback in silent mode
Sound.setCategory('Playback');

// local data
import {allNames} from '../../../data/allNames';

// store
import { useThemeStore } from '@/globalStore';
import { ColorPrimary } from '@/theme/lightColors';

// Define the Name interface based on our local data
interface Name {
  id: number;
  classicalArabic: string;
  ipa: string;
  translation: string;
  reference: string;
  gTypeb: string;
}

const width = Dimensions.get('screen').width;
const CARD_SIZE = Math.min(width, 375);

interface NamesListProps {
  searchQuery?: string;
}

const NamesList: React.FC<NamesListProps> = ({ searchQuery = '' }) => {
  const { colors } = useThemeStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<Sound | null>(null);
  
  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.stop();
        audioPlayer.release();
      }
    };
  }, [audioPlayer]);
  
  // Handle audio playback
  const handleAudioPlayback = () => {
    if (isPlaying && audioPlayer) {
      // Stop audio if playing
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      // Play audio for the selected name
      playAudio(allNames[currentItemIndex].id);
    }
  };
  
  // Play audio function
  const playAudio = (nameNumber: number) => {
    // Format the number with leading zeros (e.g., 1 -> "01")
    const formattedNumber = nameNumber.toString().padStart(2, '0');
    const audioUrl = `https://99names.app/audio/${formattedNumber}.mp3`;
    
    console.log(`Loading audio for name #${nameNumber}: ${audioUrl}`);
    
    // Stop any currently playing audio
    if (audioPlayer) {
      audioPlayer.stop();
      audioPlayer.release();
    }
    
    setIsAudioLoading(true);
    setAudioError(null);
    
    try {
      // Create a new Sound instance
      // For remote URLs, the second parameter should be empty string
      const newSound = new Sound(audioUrl, '', (error) => {
        setIsAudioLoading(false);
        
        if (error) {
          console.error('Failed to load the sound', error);
          setAudioError(`Failed to load the sound: ${error.message}`);
          return;
        }
        
        console.log('Sound loaded successfully');
        setAudioPlayer(newSound);
        setIsPlaying(true);
        
        // Play the sound
        newSound.play((success) => {
          console.log('Sound playback finished', success);
          if (!success) {
            setAudioError('Playback failed due to audio decoding errors');
          }
          setIsPlaying(false);
        });
      });
    } catch (err) {
      console.error('Error creating Sound object', err);
      setIsAudioLoading(false);
      setAudioError(`Error initializing audio: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Filter names based on search query
  const filteredNames = searchQuery.trim() === '' 
    ? allNames 
    : allNames.filter(name => {
        const searchLower = searchQuery.toLowerCase();
        return (
          name.ipa.toLowerCase().includes(searchLower) || 
          name.translation.toLowerCase().includes(searchLower) ||
          name.classicalArabic.includes(searchLower)
        );
      });

  return (
    <>
      <FlatList
        data={filteredNames}
        keyExtractor={item => item.id.toString()}
        renderItem={({ index, item }) => (
          <NameCard
            index={index}
            item={item}
            setIsVisible={setIsVisible}
            setCurrentItemIndex={setCurrentItemIndex}
          />
        )}
        ListEmptyComponent={searchQuery.trim() !== '' ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No names found matching "{searchQuery}"</Text>
          </View>
        ) : null}
      />
      <Modal
        isVisible={isVisible}
        backdropOpacity={0.9}
        style={stylesModal.modal}
        backdropColor="#171717">
        <View style={stylesModal.card}>
          <Pressable
            style={{ position: 'absolute', top: 70, left: 10 }}
            onPress={() => setIsVisible(false)}>
            <Close />
          </Pressable>

          <View
            style={{
              position: 'absolute',
              top: 70,
              backgroundColor: colors.secondary.neutral600,
              paddingHorizontal: 12,
              borderRadius: 100,
              paddingVertical: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Body1Title2Bold color="white">
              {currentItemIndex + 1}/99
            </Body1Title2Bold>
          </View>

          <View style={stylesModal.imageContainer}>
            <FastImage
              source={require('@/assets/names/name-modal-image.jpg')}
              style={stylesModal.image}
              resizeMode={FastImage.resizeMode.cover}
            />
            
            {/* Dynamic Text Overlay */}
            <View style={stylesModal.textOverlay}>
              <Text style={stylesModal.arabicText}>
                {filteredNames[currentItemIndex].classicalArabic}
              </Text>
              <Text style={stylesModal.nameText}>
                {filteredNames[currentItemIndex].ipa}
              </Text>
              <Text style={stylesModal.meaningText}>
                {filteredNames[currentItemIndex].translation}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={stylesModal.actions}>
            <Pressable
              onPress={() => setIsVisible(false)}
              style={[
                stylesModal.btn,
                { backgroundColor: colors.secondary.neutral600 },
              ]}>
              <Close />
              <Body1Title2Bold color="white">Close</Body1Title2Bold>
            </Pressable>

            <Pressable 
              style={[stylesModal.btn, { backgroundColor: '#8A57DC' }]}
              onPress={handleAudioPlayback}
            >
              {isPlaying ? <Pause /> : <RightTriangle />}
              <Body1Title2Bold color="white">
                {isAudioLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Listen'}
              </Body1Title2Bold>
              {audioError && <Text style={styles.audioErrorText}>Error playing audio</Text>}
            </Pressable>

            <Pressable
              style={[
                stylesModal.btn,
                { backgroundColor: colors.secondary.neutral600 },
              ]}>
              <Share />
              <Body1Title2Bold color="white">Share</Body1Title2Bold>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

interface NameCardProps {
  item: Name;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  setCurrentItemIndex: React.Dispatch<React.SetStateAction<number>>;
}

const NameCard: React.FC<NameCardProps> = ({
  item,
  index,
  setIsVisible,
  setCurrentItemIndex,
}) => {
  return (
    <Pressable
      onPress={() => {
        setCurrentItemIndex(index);
        setIsVisible(true);
      }}
      style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0 }]}>
      {/* Background image with text overlay */}
      <View style={styles.avatarContainer}>
        <FastImage
          source={require('@/assets/names/name-image.jpg')}
          style={styles.avatar}
          resizeMode={FastImage.resizeMode.cover}
        />
        
        {/* Arabic text overlay */}
        <Text style={styles.avatarArabicText}>{item.classicalArabic}</Text>
        <Text style={styles.avatarEnglishText}>{item.ipa}</Text>
        <Text style={styles.avatarTranslationText}>{item.translation}</Text>
      </View>

      {/* Name & meaning */}
      <View style={styles.textContainer}>
        <Title3Bold style={{fontSize: 17}}>{item.ipa}</Title3Bold>
        <Body2Medium style={{fontSize: 12,maxWidth: '80%'}} color="sub-heading">{item.translation}</Body2Medium>
      </View>

      {/* Index badge */}
      <View style={styles.indexBadge}>
        <Body1Title2Bold color="primary">{index + 1}</Body1Title2Bold>
      </View>
    </Pressable>
  );
};

export default NamesList;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  avatarArabicText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -14 }, { translateY: -10 }],
    color: ColorPrimary.primary900,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avatarEnglishText: {
    position: 'absolute',
    top: '80%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    color: ColorPrimary.primary900,
    fontSize: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avatarTranslationText: {
    position: 'absolute',
    top: '90%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -10 }],
    color: ColorPrimary.primary900,
    fontSize: 2,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '60%',
  },
  textContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#737373',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#8A57DC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F9F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  meaning: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#737373',
    textAlign: 'center',
  },
  audioErrorText: {
    color: '#FF4D4F', 
    fontSize: 10, 
    marginTop: 2,
  },
});

const stylesModal = StyleSheet.create({
  modal: {
    margin: 0, // use the whole screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: CARD_SIZE,
    height: CARD_SIZE, // square
    borderRadius: 12,
  },
  textOverlay: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  arabicText: {
    color: ColorPrimary.primary800,
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  nameText: {
    color: ColorPrimary.primary500,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  meaningText: {
    color: ColorPrimary.primary700,
    fontSize: 10,
    textAlign: 'center',
    width: '60%',
    marginTop: 4,
    lineHeight: 14,
  },
  /* ---------- actions row ---------- */
  actions: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 12, // RN ‑‑gap support 0.72+
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 32,
    columnGap: 2,
  },
});
