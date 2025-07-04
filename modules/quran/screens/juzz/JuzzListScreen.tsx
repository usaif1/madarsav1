import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JuzzStackParamList } from '../../navigation/juzz.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, CaptionMedium } from '@/components/Typography/Typography';
import SearchInput from '@/modules/hadith/components/SearchInput';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import QuranSettingsModal from '../../components/QuranSettingsModal/QuranSettingsModal';
import { useQuranNavigation } from '../../context/QuranNavigationContext';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';
import { useQuranStore } from '../../store/quranStore';

// Define the type for a Juzz item
type JuzzItem = {
  id: number;
  name: string;
  surahRange: string;
  ayahCount: number;
  progress?: number; // 0-100 percentage of completion
  bookmarked?: boolean;
  totalJuzz?: number; // Total number of juzz (30)
};

// Sample data for Juzz
const JUZZ_LIST: JuzzItem[] = [
  { id: 1, name: 'Juzz 1', surahRange: 'Al-Fatihah - Al-Baqarah', ayahCount: 141, progress: 75, bookmarked: true, totalJuzz: 30 },
  { id: 2, name: 'Juzz 2', surahRange: 'Al-Baqarah', ayahCount: 111, progress: 50, bookmarked: false, totalJuzz: 30 },
  { id: 3, name: 'Juzz 3', surahRange: 'Al-Baqarah - Al-Imran', ayahCount: 127, progress: 25, bookmarked: false, totalJuzz: 30 },
  { id: 4, name: 'Juzz 4', surahRange: 'Al-Imran - An-Nisa', ayahCount: 137, progress: 10, bookmarked: true, totalJuzz: 30 },
  { id: 5, name: 'Juzz 5', surahRange: 'An-Nisa', ayahCount: 124, progress: 0, bookmarked: false, totalJuzz: 30 },
  { id: 6, name: 'Juzz 6', surahRange: 'An-Nisa - Al-Ma\'idah', ayahCount: 111, progress: 0, bookmarked: false, totalJuzz: 30 },
  { id: 7, name: 'Juzz 7', surahRange: 'Al-Ma\'idah - Al-An\'am', ayahCount: 121, progress: 0, bookmarked: false, totalJuzz: 30 },
  { id: 8, name: 'Juzz 8', surahRange: 'Al-An\'am - Al-A\'raf', ayahCount: 111, progress: 0, bookmarked: false, totalJuzz: 30 },
  { id: 9, name: 'Juzz 9', surahRange: 'Al-A\'raf - Al-Anfal', ayahCount: 127, progress: 0, bookmarked: false, totalJuzz: 30 },
  { id: 10, name: 'Juzz 10', surahRange: 'Al-Anfal - At-Tawbah', ayahCount: 109, progress: 0, bookmarked: false, totalJuzz: 30 },
  { id: 11, name: 'Juzz 11', surahRange: 'At-Tawbah - Hud', ayahCount: 123, progress: 0, bookmarked: false, totalJuzz: 30 },
  { id: 12, name: 'Juzz 12', surahRange: 'Hud - Yusuf', ayahCount: 111, progress: 0, bookmarked: false, totalJuzz: 30 },
  { id: 13, name: 'Juzz 13', surahRange: 'Yusuf - Ibrahim', ayahCount: 115, progress: 0, bookmarked: false, totalJuzz: 30 },
  { id: 14, name: 'Juzz 14', surahRange: 'Ibrahim - Al-Hijr', ayahCount: 107, progress: 0, bookmarked: false, totalJuzz: 30 },
  { id: 15, name: 'Juzz 15', surahRange: 'Al-Hijr - An-Nahl', ayahCount: 128, progress: 0, bookmarked: false, totalJuzz: 30 },
];

type JuzzListScreenNavigationProp = NativeStackNavigationProp<JuzzStackParamList, 'juzzList'>;

const JuzzListScreen: React.FC = () => {
  const navigation = useNavigation<JuzzListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJuzz, setFilteredJuzz] = useState(JUZZ_LIST);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const { setTabsVisibility } = useQuranNavigation();
  const { saveJuzz, removeJuzz, isJuzzSaved } = useQuranStore();

  // Show both top and bottom tabs when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setTabsVisibility(true, true); // Show both top and bottom tabs
      return () => {
        // Keep tabs shown when leaving unless going to detail screen
      };
    }, [setTabsVisibility])
  );

  // Handle search input change
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredJuzz(JUZZ_LIST);
    } else {
      const filtered = JUZZ_LIST.filter(
        juzz => 
          juzz.name.toLowerCase().includes(text.toLowerCase()) ||
          juzz.surahRange.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredJuzz(filtered);
    }
  };

  // Handle juzz press
  const handleJuzzPress = (juzz: JuzzItem) => {
    navigation.navigate('juzzDetail', {
      juzzId: juzz.id,
      juzzName: juzz.name
    });
  };

  // Open Quran settings modal
  const handleSettingsPress = () => {
    setSettingsModalVisible(true);
  };

  // Handle settings modal apply
  const handleSettingsApply = (settings: {
    selectedFont: number;
    selectedQari: number;
    transliterationEnabled: boolean;
  }) => {
    // Apply settings logic here
    console.log('Settings applied:', settings);
    setSettingsModalVisible(false);
  };

  // Handle settings modal close
  const handleSettingsClose = () => {
    setSettingsModalVisible(false);
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (juzz: JuzzItem) => {
    if (isJuzzSaved(juzz.id)) {
      removeJuzz(juzz.id);
    } else {
      saveJuzz({
        id: juzz.id,
        name: juzz.name,
        surahRange: juzz.surahRange,
        ayahCount: juzz.ayahCount,
        progress: juzz.progress || 0,
      });
    }
  };

  // Render a juzz item
  const renderJuzzItem = ({ item }: { item: JuzzItem }) => (
    <TouchableOpacity 
      style={styles.juzzItem}
      onPress={() => handleJuzzPress(item)}
      activeOpacity={0.7}
    >
      {/* Juzz number with star SVG */}
      <View style={styles.numberContainer}>
        <CdnSvg 
          path={DUA_ASSETS.QURAN_SURAH_INDEX_STAR} 
          width={scale(30)} 
          height={scale(30)} 
        />
        <View style={styles.numberTextContainer}>
          <Body2Bold style={styles.numberText}>{item.id}/{item.totalJuzz}</Body2Bold>
        </View>
      </View>
      
      {/* Juzz details */}
      <View style={styles.juzzDetails}>
        <View style={styles.juzzNameRow}>
          <Body2Bold>{item.name}</Body2Bold>
          <TouchableOpacity onPress={() => handleBookmarkToggle(item)}>
            {isJuzzSaved(item.id) ? <CdnSvg 
                path={DUA_ASSETS.BOOKMARK_PRIMARY} 
                width={18} 
                height={18} 
              /> : <CdnSvg 
                path={DUA_ASSETS.QURAN_BOOKMARK_ICON} 
                width={16} 
                height={16} 
              />}
          </TouchableOpacity>
        </View>
        <View style={styles.juzzInfoRow}>
          <CaptionMedium style={styles.juzzInfo}>
            {item.surahRange} • {item.ayahCount} Ayyahs
          </CaptionMedium>
          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <View 
              style={[styles.progressBarFilled, { width: `${item.progress || 0}%` }]} 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search input */}
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Salam, juzz khojein"
        />
      </View>
      
      {/* Juzz list */}
      <FlatList
        data={filteredJuzz}
        renderItem={renderJuzzItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Settings Button */}
      <TouchableOpacity 
        style={styles.floatingSettingsButton}
        onPress={handleSettingsPress}
        activeOpacity={0.8}
      >
        <CdnSvg path={DUA_ASSETS.QURAN_SETTINGS_FILL_ICON} width={16} height={16} fill="#FFFFFF" />
        <Body2Bold style={styles.settingsButtonText}>Settings</Body2Bold>
      </TouchableOpacity>

      {/* Quran Settings Modal */}
      <QuranSettingsModal
        visible={isSettingsModalVisible}
        onApply={handleSettingsApply}
        onClose={handleSettingsClose}
      />

      <HadithImageFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(20),
  },
  juzzItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  numberContainer: {
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
    position: 'relative',
  },
  numberTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: ColorPrimary.primary500,
    fontSize: scale(10),
  },
  juzzDetails: {
    flex: 1,
  },
  juzzNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  juzzInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  juzzInfo: {
    color: '#737373',
  },
  progressBarContainer: {
    width: 60,
    height: 6,
    backgroundColor: '#F0EAFB',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFilled: {
    height: '100%',
    backgroundColor: '#8A57DC',
    borderRadius: 10,
  },
  floatingSettingsButton: {
    position: 'absolute',
    bottom: scale(30),
    right: scale(16),
    width: 105,
    height: 40,
    backgroundColor: '#171717',
    borderRadius: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    gap: scale(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14 * 1.45,
    fontFamily: 'Geist-Bold',
  },
});

export default JuzzListScreen;
