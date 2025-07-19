import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SurahStackParamList } from '../../navigation/surah.navigator';
import { scale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, CaptionMedium } from '@/components/Typography/Typography';
import SearchInput from '@/modules/hadith/components/SearchInput';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import QuranSettingsModal from '../../components/QuranSettingsModal/QuranSettingsModal';
import { useQuranNavigation } from '../../context/QuranNavigationContext';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';
import { useQuranStore } from '../../store/quranStore';
import useQuranAuth from '../../hooks/useQuranAuth';
import quranService from '../../services/quranService';
import { Chapter } from '../../types/quranFoundationTypes';

// Define the type for a Surah item
type SurahItem = {
  id: number;
  name: string;
  arabicName: string;
  translation: string;
  type: 'makkah' | 'madinah';
  ayahCount: number;
};

// Helper function to convert Chapter to SurahItem
const chapterToSurahItem = (chapter: Chapter): SurahItem => {
  return {
    id: chapter.id,
    name: chapter.name_simple,
    arabicName: chapter.name_arabic,
    translation: chapter.translated_name.name,
    type: chapter.revelation_place === 'makkah' ? 'meccan' : 'medinan',
    ayahCount: chapter.verses_count,
  };
};

type SurahListScreenNavigationProp = NativeStackNavigationProp<SurahStackParamList, 'surahList'>;

const SurahListScreen: React.FC = () => {
  const navigation = useNavigation<SurahListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [_chapters, setChapters] = useState<Chapter[]>([]);
  const [surahs, setSurahs] = useState<SurahItem[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<SurahItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const { setTabsVisibility } = useQuranNavigation();
  const { saveSurah, removeSurah, isSurahSaved } = useQuranStore();
  const { isAuthenticated, isInitialized } = useQuranAuth();

  // Show both top and bottom tabs when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('📱 SurahListScreen focused - showing navigation tabs');
      setTabsVisibility(true, true); // Show both top and bottom tabs
      return () => {
        console.log('📱 SurahListScreen unfocused');
        // Keep tabs shown when leaving unless going to detail screen
      };
    }, [setTabsVisibility])
  );

  // Fetch chapters when component mounts or auth state changes
  useEffect(() => {
    console.log(`🔐 Auth state changed - initialized: ${isInitialized}, authenticated: ${isAuthenticated}`);
    
    if (isInitialized && isAuthenticated) {
      console.log('✅ Authentication ready, fetching chapters');
      fetchChapters();
    } else if (isInitialized && !isAuthenticated) {
      console.log('⚠️ Authentication initialized but not authenticated');
      setError('Authentication failed. Please try again.');
      setIsLoading(false);
    } else {
      console.log('⏳ Waiting for authentication to initialize');
    }
  }, [isInitialized, isAuthenticated]);

  // Fetch chapters from API
  const fetchChapters = async () => {
    console.log('🔄 Starting to fetch chapters from API');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📡 Calling quranService.getAllChapters()');
      const startTime = Date.now();
      const chaptersData = await quranService.getAllChapters();
      const endTime = Date.now();
      
      console.log(`✅ Received ${chaptersData.length} chapters in ${endTime - startTime}ms`);
      setChapters(chaptersData);
      
      // Convert chapters to SurahItem format
      console.log('🔄 Converting chapters to SurahItem format');
      const surahItems = chaptersData.map(chapterToSurahItem);
      setSurahs(surahItems);
      setFilteredSurahs(surahItems);
      
      console.log('✅ Chapter data processed and ready for display');
    } catch (err) {
      console.error('❌ Error fetching chapters:', err);
      if (err instanceof Error) {
        console.error(`❌ Error message: ${err.message}`);
        console.error(`❌ Error stack: ${err.stack}`);
      }
      setError('Failed to load chapters. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('🏁 Chapter fetching process completed');
    }
  };

  // Handle search input change
  const handleSearch = (text: string) => {
    console.log(`🔍 Search query changed: "${text}"`);
    setSearchQuery(text);
    
    if (text.trim() === '') {
      console.log('🔍 Empty search query, showing all surahs');
      setFilteredSurahs(surahs);
    } else {
      console.log(`🔍 Filtering surahs by: "${text}"`);
      const filtered = surahs.filter(
        surah =>
          surah.name.toLowerCase().includes(text.toLowerCase()) ||
          surah.translation.toLowerCase().includes(text.toLowerCase())
      );
      console.log(`🔍 Found ${filtered.length} matching surahs`);
      setFilteredSurahs(filtered);
    }
  };

  // Navigate to surah detail screen
  const handleSurahPress = (surah: SurahItem) => {
    console.log(`👆 Surah selected: ${surah.id} - ${surah.name}`);
    console.log(`🧭 Navigating to surah detail screen for surah ${surah.id}`);
    
    navigation.navigate('surahDetail', {
      surahId: surah.id,
      surahName: surah.name
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
  const handleBookmarkToggle = (surah: SurahItem) => {
    const isCurrentlySaved = isSurahSaved(surah.id);
    console.log(`🔖 Bookmark toggle for surah ${surah.id} - ${surah.name}, currently saved: ${isCurrentlySaved}`);
    
    if (isCurrentlySaved) {
      console.log(`🗑️ Removing surah ${surah.id} from bookmarks`);
      removeSurah(surah.id);
    } else {
      console.log(`📌 Adding surah ${surah.id} to bookmarks`);
      saveSurah({
        id: surah.id,
        name: surah.name,
        arabicName: surah.arabicName,
        translation: surah.translation,
        type: surah.type,
        ayahCount: surah.ayahCount,
        progress: 0,
      });
    }
    
    console.log(`✅ Bookmark operation completed for surah ${surah.id}`);
  };

  // Render a surah item
  const renderSurahItem = ({ item, index }: { item: SurahItem; index: number }) => (
    <TouchableOpacity 
      style={styles.surahItem}
      onPress={() => handleSurahPress(item)}
      activeOpacity={0.7}
    >
      {/* Surah number with star SVG */}
      <View style={styles.numberContainer}>
        <CdnSvg 
          path={DUA_ASSETS.QURAN_SURAH_INDEX_STAR} 
          width={scale(30)} 
          height={scale(30)} 
        />
        <View style={styles.numberTextContainer}>
          <Body2Bold style={styles.numberText}>{index + 1}</Body2Bold>
        </View>
      </View>
      
      {/* Surah details */}
      <View style={styles.surahDetails}>
        <View style={styles.surahNameRow}>
          <Body2Bold>{item.name}</Body2Bold>
          <View style={{flexDirection:'row', alignItems:'center', gap:scale(10)}}>
            <Body2Bold style={styles.arabicName}>{item.arabicName}</Body2Bold>
            <TouchableOpacity onPress={() => handleBookmarkToggle(item)}>
             {isSurahSaved(item.id) ? <CdnSvg 
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
        </View>
        <View style={styles.surahInfoRow}>
          <CaptionMedium style={styles.surahInfo}>
            {item.type === 'meccan' ? 'Meccan' : 'Medinan'} • {item.ayahCount} Ayyahs
          </CaptionMedium>
          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFilled} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render loading state
  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={ColorPrimary.primary500} />
      <Body2Medium style={{marginTop: scale(10)}}>Loading chapters...</Body2Medium>
    </View>
  );

  // Render error state
  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={fetchChapters}
      >
        <Body2Bold style={styles.retryButtonText}>Retry</Body2Bold>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search input */}
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Salam, surah khojein"
        />
      </View>
      
      {/* Content based on state */}
      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        /* Surah list */
        <FlatList
          data={filteredSurahs}
          renderItem={renderSurahItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={()=><HadithImageFooter />}
        />
      )}

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

      
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  errorText: {
    fontSize: scale(16),
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: scale(16),
  },
  retryButton: {
    backgroundColor: ColorPrimary.primary500,
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    borderRadius: scale(8),
  },
  retryButtonText: {
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },

  listContainer: {
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
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
    fontSize: scale(12),
  },
  surahDetails: {
    flex: 1,
  },
  surahNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  arabicName: {
    textAlign: 'right',
    color: '#8A57DC',
    fontSize: scale(16),
  },
  surahInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surahInfo: {
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
    width: '30%', // This would be dynamic based on reading progress
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

export default SurahListScreen;
