import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

// components
import { BackButton } from '@/components';
import { Title3Bold, Body2Medium } from '@/components/Typography/Typography';
import ChangeSurahModal from '../ChangeSurahModal/ChangeSurahModal';
import QuranSettingsModal from '../QuranSettingsModal/QuranSettingsModal';

// icons
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

// theme
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';

interface SurahHeaderProps {
  onBack?: () => void;
  surahName: string;
  surahInfo: string; // e.g., "Meccan • 7 Ayyahs"
  currentSurahId: number;
  onSurahChange?: (surahId: number, surahName: string) => void;
  onSettingsChange?: (settings: any) => void;
}

const SurahHeader: React.FC<SurahHeaderProps> = ({
  onBack,
  surahName,
  surahInfo,
  currentSurahId,
  onSurahChange,
  onSettingsChange,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, shadows } = useThemeStore();

  const [isChangeSurahModalVisible, setChangeSurahModalVisible] = useState(false);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);

  const toggleChangeSurahModal = () => setChangeSurahModalVisible(!isChangeSurahModalVisible);
  const toggleSettingsModal = () => setSettingsModalVisible(!isSettingsModalVisible);

  const handleSurahChange = (surahId: number, surahName: string) => {
    setChangeSurahModalVisible(false);
    if (onSurahChange) {
      onSurahChange(surahId, surahName);
    }
  };

  const handleSettingsApply = (settings: any) => {
    setSettingsModalVisible(false);
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
  };

  // Use semantic color token for typography components
  const textColor = 'white';

  return (
    <View style={[
      styles.headerContainer, 
      { 
        backgroundColor: colors.primary.primary800, 
        paddingTop: insets.top, 
        paddingBottom: verticalScale(12) 
      }, 
      shadows.md1
    ]}>
      <View style={styles.headerContent}>
        {/* Left: Back button */}
        <Pressable
          onPress={onBack}
          hitSlop={10}
          style={styles.backButton}>
          <BackButton />
        </Pressable>

        {/* Center: Title with dropdown */}
        <Pressable onPress={toggleChangeSurahModal} style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Title3Bold color={textColor}>
              {surahName}
            </Title3Bold>
            <CdnSvg 
              path={DUA_ASSETS.CALENDAR_DOWN_ARROW} 
              width={scale(16)} 
              height={scale(16)} 
              fill={textColor} 
              style={styles.arrow} 
            />
          </View>
          <Body2Medium color={textColor} style={styles.subtitle}>
            {surahInfo}
          </Body2Medium>
        </Pressable>

        {/* Right: Settings button */}
        <Pressable
          onPress={toggleSettingsModal}
          hitSlop={10}
          style={styles.settingsButton}>
          <CdnSvg path={DUA_ASSETS.QURAN_SETTINGS_ICON} width={24} height={24} fill={textColor} />
        </Pressable>
      </View>

      {/* Change Surah Modal */}
      <ChangeSurahModal
        visible={isChangeSurahModalVisible}
        currentSurahId={currentSurahId}
        onSelect={handleSurahChange}
        onClose={toggleChangeSurahModal}
      />

      {/* Quran Settings Modal */}
      <QuranSettingsModal
        visible={isSettingsModalVisible}
        onApply={handleSettingsApply}
        onClose={toggleSettingsModal}
      />
    </View>
  );
};

export default SurahHeader;

const styles = StyleSheet.create({
  headerContainer: {
    // backgroundColor and paddingTop/paddingBottom are set inline for theme and responsive
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(12),
  },
  backButton: {
    width: scale(40),
    paddingLeft: scale(18),
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginLeft: scale(4),
  },
  subtitle: {
    marginTop: verticalScale(2),
  },
  settingsButton: {
    width: scale(40),
    alignItems: 'center',
    paddingRight: scale(18),
  },
}); 