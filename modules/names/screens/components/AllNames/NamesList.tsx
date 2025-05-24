import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Pressable, Dimensions, Text, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';

// Components & Data
import { Body1Title2Bold, Body2Medium, Title3Bold } from '@/components';
import Share from '@/assets/share-light.svg';
import RightTriangle from '@/assets/right-triangle.svg';
import Close from '@/assets/close.svg';
import Pause from '@/assets/home/pause.svg';

// Custom Hook
import { useNameAudio } from '../../../hooks/useNameAudio'; // Adjust path as needed

// Local Data
import { allNames } from '../../../data/allNames';

// Store
import { useThemeStore } from '@/globalStore';
import { ColorPrimary } from '@/theme/lightColors';

/**
 * Interface for Name data structure
 */
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

/**
 * Main component for displaying list of Islamic names
 * Features: Search, Modal view, Audio playback
 */
const NamesList: React.FC<NamesListProps> = ({ searchQuery = '' }) => {
  const { colors } = useThemeStore();
  
  // Modal state
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  
  // Audio hook
  const { 
    isPlaying, 
    isLoading: isAudioLoading, 
    error: audioError, 
    playAudio, 
    pauseAudio, 
    clearError 
  } = useNameAudio();

  /**
   * Filter names based on search query with multiple criteria
   */
  const filteredNames = React.useMemo(() => {
    if (searchQuery.trim() === '') return allNames;
    
    const searchLower = searchQuery.toLowerCase().trim();
    
    return allNames.filter(name => {
      return (
        name.ipa.toLowerCase().includes(searchLower) || 
        name.translation.toLowerCase().includes(searchLower) ||
        name.classicalArabic.includes(searchLower) ||
        name.id.toString().includes(searchLower) // Allow searching by number
      );
    });
  }, [searchQuery]);

  /**
   * Handle audio playback with error handling
   */
  const handleAudioPlayback = () => {
    try {
      if (isPlaying) {
        pauseAudio();
      } else {
        // Clear any previous errors
        if (audioError) {
          clearError();
        }
        
        // Get the actual name ID from filtered results
        const currentName = filteredNames[currentItemIndex];
        if (currentName) {
          playAudio(currentName.id);
        } else {
          Alert.alert('Error', 'Unable to find the selected name.');
        }
      }
    } catch (error) {
      console.error('Error in handleAudioPlayback:', error);
      Alert.alert('Audio Error', 'Failed to play audio. Please try again.');
    }
  };

  /**
   * Handle modal close with cleanup
   */
  const handleCloseModal = () => {
    setIsVisible(false);
    // Optional: Stop audio when closing modal
    // pauseAudio();
  };

  /**
   * Show error alert for audio issues
   */
  useEffect(() => {
    if (audioError) {
      Alert.alert(
        'Audio Error',
        audioError,
        [
          { text: 'OK', onPress: clearError }
        ]
      );
    }
  }, [audioError, clearError]);

  return (
    <>
      <FlatList
        data={filteredNames}
        keyExtractor={(item) => `name-${item.id}`}
        renderItem={({ index, item }) => (
          <NameCard
            index={index}
            item={item}
            onPress={() => {
              setCurrentItemIndex(index);
              setIsVisible(true);
            }}
          />
        )}
        ListEmptyComponent={searchQuery.trim() !== '' ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No names found matching "{searchQuery}"
            </Text>
          </View>
        ) : null}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={15}
        getItemLayout={(data, index) => ({
          length: 92, // Approximate item height
          offset: 92 * index,
          index,
        })}
      />

      {/* Modal for detailed view */}
      <Modal
        isVisible={isVisible}
        backdropOpacity={0.9}
        style={stylesModal.modal}
        backdropColor="#171717"
        onBackdropPress={handleCloseModal}
        onBackButtonPress={handleCloseModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        <View style={stylesModal.card}>
          {/* Close button */}
          <Pressable
            style={stylesModal.closeButton}
            onPress={handleCloseModal}
            accessibilityLabel="Close modal"
            accessibilityRole="button"
          >
            <Close />
          </Pressable>

          {/* Counter badge */}
          <View style={[stylesModal.counterBadge, { backgroundColor: colors.secondary.neutral600 }]}>
            <Body1Title2Bold color="white">
              {currentItemIndex + 1}/99
            </Body1Title2Bold>
          </View>

          {/* Main image with text overlay */}
          <View style={stylesModal.imageContainer}>
            <FastImage
              source={require('@/assets/names/name-modal-image.jpg')}
              style={stylesModal.image}
              resizeMode={FastImage.resizeMode.cover}
            />
            
            {/* Dynamic Text Overlay */}
            <View style={stylesModal.textOverlay}>
              <Text style={stylesModal.arabicText}>
                {filteredNames[currentItemIndex]?.classicalArabic}
              </Text>
              <Text style={stylesModal.nameText}>
                {filteredNames[currentItemIndex]?.ipa}
              </Text>
              <Text style={stylesModal.meaningText}>
                {filteredNames[currentItemIndex]?.translation}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={stylesModal.actions}>
            <Pressable
              onPress={handleCloseModal}
              style={[stylesModal.btn, { backgroundColor: colors.secondary.neutral600 }]}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Close />
              <Body1Title2Bold color="white">Close</Body1Title2Bold>
            </Pressable>

            <Pressable 
              style={[
                stylesModal.btn, 
                { 
                  backgroundColor: isAudioLoading ? '#666' : '#8A57DC',
                  opacity: isAudioLoading ? 0.7 : 1
                }
              ]}
              onPress={handleAudioPlayback}
              disabled={isAudioLoading}
              accessibilityLabel={isPlaying ? "Pause audio" : "Play audio"}
              accessibilityRole="button"
            >
              {isPlaying ? <Pause /> : <RightTriangle />}
              <Body1Title2Bold color="white">
                {isAudioLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Listen'}
              </Body1Title2Bold>
            </Pressable>

            <Pressable
              style={[stylesModal.btn, { backgroundColor: colors.secondary.neutral600 }]}
              accessibilityLabel="Share"
              accessibilityRole="button"
            >
              <Share />
              <Body1Title2Bold color="white">Share</Body1Title2Bold>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

/**
 * Individual name card component
 */
interface NameCardProps {
  item: Name;
  index: number;
  onPress: () => void;
}

const NameCard: React.FC<NameCardProps> = ({ item, index, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0 }]}
      accessibilityLabel={`${item.ipa}, ${item.translation}`}
      accessibilityRole="button"
    >
      {/* Background image with text overlay */}
      <View style={styles.avatarContainer}>
        <FastImage
          source={require('@/assets/names/name-image.jpg')}
          style={styles.avatar}
          resizeMode={FastImage.resizeMode.cover}
        />
        
        {/* Text overlays */}
        <Text style={styles.avatarArabicText}>{item.classicalArabic}</Text>
        <Text style={styles.avatarEnglishText}>{item.ipa}</Text>
        <Text style={styles.avatarTranslationText} numberOfLines={2}>
          {item.translation}
        </Text>
      </View>

      {/* Name & meaning */}
      <View style={styles.textContainer}>
        <Title3Bold style={styles.nameTitle}>{item.ipa}</Title3Bold>
        <Body2Medium 
          style={styles.meaningSubtitle} 
          color="sub-heading"
          numberOfLines={2}
        >
          {item.translation}
        </Body2Medium>
      </View>

      {/* Index badge */}
      <View style={styles.indexBadge}>
        <Body1Title2Bold color="primary">{index + 1}</Body1Title2Bold>
      </View>
    </Pressable>
  );
};

export default NamesList;

// Styles
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    minHeight: 92,
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
    width: 32,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  nameTitle: {
    fontSize: 17,
    marginBottom: 4,
  },
  meaningSubtitle: {
    fontSize: 12,
    maxWidth: '90%',
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F9F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#737373',
    textAlign: 'center',
  },
});

const stylesModal = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 70,
    left: 10,
    zIndex: 1,
    padding: 8, // Larger touch area
  },
  counterBadge: {
    position: 'absolute',
    top: 70,
    paddingHorizontal: 12,
    borderRadius: 100,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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
    height: CARD_SIZE,
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
  actions: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 32,
    columnGap: 8,
    minHeight: 44, // Better touch target
  },
});