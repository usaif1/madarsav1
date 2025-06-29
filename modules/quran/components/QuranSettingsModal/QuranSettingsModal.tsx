import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, Title3Bold } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

// Get screen dimensions for calculations
const { height: screenHeight } = Dimensions.get('window');

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
  const [selectedFont, setSelectedFont] = useState(1);
  const [selectedQari, setSelectedQari] = useState(1);
  const [transliterationEnabled, setTransliterationEnabled] = useState(true);

  // Handle font selection
  const handleFontSelect = (fontId: number) => {
    setSelectedFont(fontId);
  };

  // Handle qari selection
  const handleQariSelect = (qariId: number) => {
    setSelectedQari(qariId);
  };

  // Toggle transliteration
  const toggleTransliteration = () => {
    setTransliterationEnabled(!transliterationEnabled);
  };

  // Handle apply settings
  const handleApplySettings = () => {
    const settings = {
      selectedFont,
      selectedQari,
      transliterationEnabled,
    };
    onApply(settings);
  };

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
            <CdnSvg path={DUA_ASSETS.CLOSE_ICON} width={scale(16)} height={scale(16)} />
          </TouchableOpacity>
        </View>
        
        {/* Settings content */}
        <View style={styles.settingsContainer}>
          {/* Font selection */}
          <View style={styles.settingSection}>
            <Body2Bold style={styles.settingTitle}>Font</Body2Bold>
            <View style={styles.optionsRow}>
              <TouchableOpacity 
                style={[styles.optionButton, selectedFont === 1 && styles.selectedOption]}
                onPress={() => handleFontSelect(1)}
              >
                <Body2Medium style={[styles.optionText, selectedFont === 1 && styles.selectedOptionText]}>
                  Font 1
                </Body2Medium>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optionButton, selectedFont === 2 && styles.selectedOption]}
                onPress={() => handleFontSelect(2)}
              >
                <Body2Medium style={[styles.optionText, selectedFont === 2 && styles.selectedOptionText]}>
                  Font 2
                </Body2Medium>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optionButton, selectedFont === 3 && styles.selectedOption]}
                onPress={() => handleFontSelect(3)}
              >
                <Body2Medium style={[styles.optionText, selectedFont === 3 && styles.selectedOptionText]}>
                  Font 3
                </Body2Medium>
              </TouchableOpacity>
            </View>
            <View style={styles.fontPreview}>
              <Body2Bold style={styles.arabicPreview}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Body2Bold>
            </View>
          </View>
          
          {/* Reciter selection */}
          <View style={styles.settingSection}>
            <Body2Bold style={styles.settingTitle}>Reciter</Body2Bold>
            <View style={styles.optionsRow}>
              <TouchableOpacity 
                style={[styles.optionButton, selectedQari === 1 && styles.selectedOption]}
                onPress={() => handleQariSelect(1)}
              >
                <Body2Medium style={[styles.optionText, selectedQari === 1 && styles.selectedOptionText]}>
                  Qari name 1
                </Body2Medium>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optionButton, selectedQari === 2 && styles.selectedOption]}
                onPress={() => handleQariSelect(2)}
              >
                <Body2Medium style={[styles.optionText, selectedQari === 2 && styles.selectedOptionText]}>
                  Qari name 2
                </Body2Medium>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Transliteration toggle */}
          <View style={styles.settingSection}>
            <View style={styles.toggleRow}>
              <Body2Bold style={styles.settingTitle}>Transliteration</Body2Bold>
              <Switch
                trackColor={{ false: '#E0E0E0', true: ColorPrimary.primary200 }}
                thumbColor={transliterationEnabled ? ColorPrimary.primary500 : '#FFFFFF'}
                ios_backgroundColor="#E0E0E0"
                onValueChange={toggleTransliteration}
                value={transliterationEnabled}
              />
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
    gap: scale(8),
    marginBottom: scale(12),
  },
  optionButton: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    backgroundColor: ColorPrimary.primary500,
    borderColor: ColorPrimary.primary500,
  },
  optionText: {
    color: '#404040',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  fontPreview: {
    padding: scale(16),
    backgroundColor: '#FAFAFA',
    borderRadius: scale(8),
    alignItems: 'center',
  },
  arabicPreview: {
    fontSize: scale(20),
    lineHeight: scale(32),
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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