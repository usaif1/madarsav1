import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Pressable, Dimensions, Text, Alert, ActivityIndicator } from 'react-native';
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
import { useAll99Names, Name99Data } from '../../../hooks/use99Names';

// Store
import { useThemeStore } from '@/globalStore';
import { ColorPrimary } from '@/theme/lightColors';

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
  
  // Fetch names from API
  const { data: namesData, isLoading, error: namesError } = useAll99Names();
  
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
    clearError,
    playAudioFromUrl
  } = useNameAudio();

  /**
   * Filter names based on search query with multiple criteria
   */
  const filteredNames = React.useMemo(() => {
    if (!namesData || !Array.isArray(namesData)) return [];
    
    if (searchQuery.trim() === '') return namesData;
    
    const searchLower = searchQuery.toLowerCase().trim();
    
    return namesData.filter(name => {
      return (
        name.englishName.toLowerCase().includes(searchLower) || 
        name.englishTranslation.toLowerCase().includes(searchLower) ||
        name.arabicName.includes(searchLower) ||
        name.number.toString().includes(searchLower) // Allow searching by number
      );
    });
  }, [searchQuery, namesData]);

  // Debug modal visibility and data
  useEffect(() => {
    console.log('🔍 Modal visibility changed:', isVisible);
    console.log('🔍 Current item index:', currentItemIndex);
    console.log('🔍 Filtered names length:', filteredNames.length);
    if (isVisible && filteredNames.length > 0) {
      console.log('🔍 Current item data:', JSON.stringify(filteredNames[currentItemIndex], null, 2));
    }
  }, [isVisible, currentItemIndex, filteredNames]);

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
        
        // Get the current name from filtered results
        const currentName = filteredNames[currentItemIndex];
        if (currentName && currentName.audioLink) {
          // Use the direct audio URL from the API
          playAudioFromUrl(currentName.audioLink);
        } else {
          Alert.alert('Error', 'Unable to find audio for the selected name.');
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
    // Stop audio when closing modal
    if (isPlaying) {
      pauseAudio();
    }
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

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ColorPrimary.primary500} />
        <Text style={styles.loadingText}>Loading 99 Names...</Text>
      </View>
    );
  }

  // Show error state
  if (namesError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading names</Text>
        <Text style={styles.errorSubtext}>{namesError.message}</Text>
      </View>
    );
  }

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
              console.log('🔍 Opening modal for item:', index, item.englishName);
              setCurrentItemIndex(index);
              setIsVisible(true);
              console.log('🔍 Modal should now be visible');
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No names found matching your search.' : 'No names available.'}
            </Text>
          </View>
        }
      />

      {/* Modal view for detailed name */}
      <Modal
        isVisible={isVisible}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropOpacity={0.9}
        style={stylesModal.modal}
        backdropColor="#171717"
        onBackdropPress={handleCloseModal}
        onBackButtonPress={handleCloseModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        {/* {filteredNames.length > 0 && currentItemIndex < filteredNames.length && ( */}
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
              {/* Use the image from API instead of local asset */}
              <FastImage
                source={{ uri: filteredNames[currentItemIndex].imageLink }}
                style={stylesModal.image}
                resizeMode={FastImage.resizeMode.cover}
              />
              
              {/* Dynamic Text Overlay */}
              {/* <View style={stylesModal.textOverlay}>
                <Text style={stylesModal.arabicText}>
                  {filteredNames[currentItemIndex].arabicName}
                </Text>
                <Text style={stylesModal.nameText}>
                  {filteredNames[currentItemIndex].englishName}
                </Text>
                <Text style={stylesModal.meaningText}>
                  {filteredNames[currentItemIndex].englishTranslation}
                </Text>
              </View> */}
            </View>
            
            {/* Description */}
            {/* <View style={stylesModal.descriptionContainer}>
              <Text style={stylesModal.descriptionText}>
                {filteredNames[currentItemIndex].description}
              </Text>
            </View> */}

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
        {/* )} */}
      </Modal>
    </>
  );
};

/**
 * Individual name card component
 */
interface NameCardProps {
  item: Name99Data;
  index: number;
  onPress: () => void;
}

const NameCard: React.FC<NameCardProps> = ({ item, index, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0 }]}
      accessibilityLabel={`${item.englishName}, ${item.englishTranslation}`}
      accessibilityRole="button"
    >
      {/* Background image with text overlay */}
      <View style={styles.avatarContainer}>
        <FastImage
          source={{ uri: item.imageLink }}
          style={styles.avatar}
          resizeMode={FastImage.resizeMode.cover}
        />
        
        {/* Text overlays */}
        {/* <Text style={styles.avatarArabicText}>{item.arabicName}</Text>
        <Text style={styles.avatarEnglishText}>{item.englishName}</Text>
        <Text style={styles.avatarTranslationText} numberOfLines={2}>
          {item.englishTranslation}
        </Text> */}
      </View>

      {/* Name & meaning */}
      <View style={styles.textContainer}>
        <Title3Bold style={styles.nameTitle}>{item.englishName}</Title3Bold>
        <Body2Medium 
          style={styles.meaningSubtitle} 
          color="sub-heading"
          numberOfLines={2}
        >
          {item.englishTranslation}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: ColorPrimary.primary700,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
    backgroundColor: '#FFF8F8',
  },
  errorText: {
    fontSize: 18,
    color: '#E53935',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    maxWidth: '80%',
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
  descriptionContainer: {
    width: CARD_SIZE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 70, // Space for action buttons
  },
  descriptionText: {
    color: ColorPrimary.primary700,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
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