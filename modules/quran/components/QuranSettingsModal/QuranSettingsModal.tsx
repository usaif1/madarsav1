import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body1Title2Medium, Body2Bold, Title3Bold, Body1Title2Bold } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import quranService from '../../services/quranService';
import { ChapterReciter } from '../../types/quranFoundationTypes'; // Updated import
import { useQuranStore } from '../../store/quranStore';

// Get screen dimensions for calculations
const { height: screenHeight } = Dimensions.get('window');

// Font preview texts for different fonts
const FONT_PREVIEWS = {
  1: '١ بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
  2: '١ بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', // Different font style
  3: '١ بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', // Different font style
};

interface QuranSettingsModalProps {
  visible: boolean;
  onApply: (settings: {
    selectedFont: number;
    selectedQari: number;
    transliterationEnabled: boolean;
  }) => void;
  onClose: () => void;
}

const QuranSettingsModal: React.FC<QuranSettingsModalProps> = ({
  visible,
  onApply,
  onClose,
}) => {
  // Get settings from store
  const { settings, updateSettings } = useQuranStore();
  
  // Initialize state with values from store
  const [selectedFont, setSelectedFont] = useState(settings.selectedFont);
  const [selectedQari, setSelectedQari] = useState(settings.selectedReciterId);
  const [transliterationEnabled, setTransliterationEnabled] = useState(settings.transliterationEnabled);
  const [reciters, setReciters] = useState<ChapterReciter[]>([]); // Updated type
  const [isLoadingReciters, setIsLoadingReciters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reciters on component mount
  useEffect(() => {
    const fetchReciters = async () => {
      setIsLoadingReciters(true);
      setError(null);
      try {
        const recitationsData = await quranService.getReciters(); // This now returns ChapterReciter[]
        console.log('📊 Fetched reciters:', recitationsData);
        setReciters(recitationsData);
      } catch (error) {
        console.error('Failed to fetch reciters:', error);
        setError('Failed to load reciters. Please try again.');
      } finally {
        setIsLoadingReciters(false);
      }
    };

    if (visible) { // Only fetch when modal is visible
      fetchReciters();
    }
  }, [visible]);

  // Handle font selection
  const handleFontSelect = (fontId: number) => {
    setSelectedFont(fontId);
  };

  // Handle qari selection
  const handleQariSelect = (qariId: number) => {
    setSelectedQari(qariId);
  };

  // Handle transliteration selection
  const handleTransliterationSelect = (enabled: boolean) => {
    setTransliterationEnabled(enabled);
  };

  // Handle apply settings
  const handleApplySettings = () => {
    // Find the selected reciter to get its name
    const selectedReciter = reciters.find(r => r.id === selectedQari);
    
    // Create new settings object
    const newSettings = {
      selectedFont,
      selectedReciterId: selectedQari,
      reciterName: selectedReciter ? selectedReciter.name : '', // Updated property name
      transliterationEnabled,
    };
    
    // Update the store
    updateSettings(newSettings);
    
    // Call the onApply callback with the new settings
    onApply({
      selectedFont,
      selectedQari,
      transliterationEnabled,
    });
    
    // Close the modal
    onClose();
  };

  // Get button style based on selection
  const getButtonStyle = (isSelected: boolean) => [
    styles.optionButton,
    isSelected ? styles.selectedOption : styles.unselectedOption
  ];

  const getButtonTextStyle = (isSelected: boolean) => [
    styles.optionText,
    isSelected ? styles.selectedOptionText : styles.unselectedOptionText
  ];

  return (
    <Modal 
      isVisible={visible} 
      onBackdropPress={onClose}
      backdropOpacity={0.5}
      style={styles.modal}
      useNativeDriverForBackdrop={true}
      avoidKeyboard={true}
    >
      <View style={styles.sheet}>
        {/* Fixed header */}
        <View style={styles.header}>
          <Title3Bold style={styles.title}>Quran settings</Title3Bold>
          <TouchableOpacity onPress={onClose} hitSlop={16}>
            <CdnSvg path={DUA_ASSETS.QURAN_CLOSE_ICON} width={scale(16)} height={scale(16)} />
          </TouchableOpacity>
        </View>
        
        {/* Settings content */}
        <View style={styles.settingsContainer}>
          {/* Font selection */}
          <View style={styles.settingSection}>
            <Body2Bold style={styles.settingTitle}>Font</Body2Bold>
            <View style={styles.optionsRow}>
              <TouchableOpacity 
                style={getButtonStyle(selectedFont === 1)}
                onPress={() => handleFontSelect(1)}
              >
                <Body1Title2Medium style={getButtonTextStyle(selectedFont === 1)}>
                  Font 1
                </Body1Title2Medium>
              </TouchableOpacity>
              <TouchableOpacity 
                style={getButtonStyle(selectedFont === 2)}
                onPress={() => handleFontSelect(2)}
              >
                <Body1Title2Medium style={getButtonTextStyle(selectedFont === 2)}>
                  Font 2
                </Body1Title2Medium>
              </TouchableOpacity>
              <TouchableOpacity 
                style={getButtonStyle(selectedFont === 3)}
                onPress={() => handleFontSelect(3)}
              >
                <Body1Title2Medium style={getButtonTextStyle(selectedFont === 3)}>
                  Font 3
                </Body1Title2Medium>
              </TouchableOpacity>
            </View>
            {/* Font preview */}
            <View style={styles.fontPreview}>
              <Body1Title2Bold style={styles.arabicPreview}>
                {FONT_PREVIEWS[selectedFont as keyof typeof FONT_PREVIEWS]}
              </Body1Title2Bold>
            </View>
          </View>
          
          {/* Reciter selection */}
          <View style={styles.settingSection}>
            <Body2Bold style={styles.settingTitle}>Reciter</Body2Bold>
            
            {isLoadingReciters ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={ColorPrimary.primary500} />
                <Body2Medium style={styles.loadingText}>Loading reciters...</Body2Medium>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Body2Medium style={styles.errorText}>{error}</Body2Medium>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={() => {
                    setError(null);
                    // Trigger re-fetch by toggling visibility state or calling fetch directly
                  }}
                >
                  <Body2Medium style={styles.retryText}>Retry</Body2Medium>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={reciters}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.recitersList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={getButtonStyle(selectedQari === item.id)}
                    onPress={() => handleQariSelect(item.id)}
                  >
                    <Body2Medium style={getButtonTextStyle(selectedQari === item.id)}>
                      {item.name} {/* Updated property name */}
                    </Body2Medium>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Body2Medium style={styles.emptyText}>No reciters available</Body2Medium>
                }
              />
            )}
          </View>
          
          {/* Transliteration selection */}
          <View style={styles.settingSection}>
            <Body2Bold style={styles.settingTitle}>Transliteration</Body2Bold>
            <View style={styles.optionsRow}>
              <TouchableOpacity 
                style={getButtonStyle(transliterationEnabled === true)}
                onPress={() => handleTransliterationSelect(true)}
              >
                <Body1Title2Medium style={getButtonTextStyle(transliterationEnabled === true)}>
                  On
                </Body1Title2Medium>
              </TouchableOpacity>
              <TouchableOpacity 
                style={getButtonStyle(transliterationEnabled === false)}
                onPress={() => handleTransliterationSelect(false)}
              >
                <Body1Title2Medium style={getButtonTextStyle(transliterationEnabled === false)}>
                  Off
                </Body1Title2Medium>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Apply button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApplySettings}
            activeOpacity={0.8}
          >
            <Body2Bold style={styles.applyButtonText}>Apply</Body2Bold>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(16),
  },
  loadingText: {
    marginLeft: scale(8),
    color: '#525252',
  },
  errorContainer: {
    padding: scale(16),
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: scale(8),
  },
  retryButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    backgroundColor: '#F0F0F0',
    borderRadius: scale(4),
  },
  retryText: {
    color: '#525252',
  },
  recitersList: {
    paddingVertical: scale(8),
    gap: scale(8),
  },
  emptyText: {
    padding: scale(16),
    color: '#737373',
    textAlign: 'center',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 8,
    paddingBottom: 0,
    paddingHorizontal: 0,
    height: Math.min(verticalScale(650), screenHeight * 0.85),
    maxHeight: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  settingsContainer: {
    flex: 1,
    padding: scale(16),
  },
  settingSection: {
    marginBottom: scale(24),
  },
  settingTitle: {
    marginBottom: scale(12),
  },
  optionsRow: {
    flexDirection: 'row',
    gap: scale(4),
    marginBottom: scale(12),
  },
  optionButton: {
    height: scale(32),
    paddingVertical: scale(6),
    paddingHorizontal: scale(16),
    borderRadius: 60,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#F9F6FF',
    borderColor: '#8A57DC',
  },
  unselectedOption: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F5F5F5',
  },
  optionText: {
    fontSize: scale(14),
  },
  selectedOptionText: {
    color: '#8A57DC',
  },
  unselectedOptionText: {
    color: '#404040',
  },
  fontPreview: {
    width: 335,
    height: 63,
    padding: scale(10),
    paddingHorizontal: scale(16),
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  arabicPreview: {
    fontSize: scale(18),
    lineHeight: scale(28),
    textAlign: 'center',
    color: '#171717',
  },
  buttonContainer: {
    padding: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  applyButton: {
    backgroundColor: ColorPrimary.primary500,
    paddingVertical: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
  },
});

export default QuranSettingsModal;