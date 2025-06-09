import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SurahStackParamList } from '../../navigation/surah.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, H5Bold } from '@/components/Typography/Typography';
import CloseIcon from '@/assets/close.svg';

type QuranSettingsScreenNavigationProp = NativeStackNavigationProp<SurahStackParamList, 'quranSettings'>;

const QuranSettingsScreen: React.FC = () => {
  const navigation = useNavigation<QuranSettingsScreenNavigationProp>();
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
    // Apply settings logic here
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <H5Bold>Quran settings</H5Bold>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CloseIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Settings content */}
      <View style={styles.settingsContainer}>
        {/* Font selection */}
        <View style={styles.settingSection}>
          <Body1Bold style={styles.settingTitle}>Font</Body1Bold>
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
            <Body1Bold style={styles.arabicPreview}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Body1Bold>
          </View>
        </View>
        
        {/* Reciter selection */}
        <View style={styles.settingSection}>
          <Body1Bold style={styles.settingTitle}>Reciter</Body1Bold>
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
            <Body1Bold style={styles.settingTitle}>Transliteration</Body1Bold>
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
          <Body1Bold style={styles.applyButtonText}>Apply</Body1Bold>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default QuranSettingsScreen;
