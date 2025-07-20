import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
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
import useQuranAuth from '../../hooks/useQuranAuth';
import quranService from '../../services/quranService';
import { Juz as JuzFoundation } from '../../types/quranFoundationTypes';

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

// Helper function to convert JuzFoundation to JuzzItem
const juzFoundationToJuzzItem = (juz: JuzFoundation): JuzzItem => {
  // Extract chapter numbers from verse_mapping
  const chapterNumbers = Object.keys(juz.verse_mapping);
  
  // Create surah range string
  let surahRange = '';
  if (chapterNumbers.length === 1) {
    surahRange = `Surah ${chapterNumbers[0]}`;
  } else if (chapterNumbers.length > 1) {
    surahRange = `Surah ${chapterNumbers[0]} - Surah ${chapterNumbers[chapterNumbers.length - 1]}`;
  }
  
  return {
    id: juz.juz_number,
    name: `Juz ${juz.juz_number}`,
    surahRange: surahRange,
    ayahCount: juz.verses_count,
    progress: 0, // Default progress
    totalJuzz: 30 // Total number of juzs in Quran
  };
};

type JuzzListScreenNavigationProp = NativeStackNavigationProp<JuzzStackParamList, 'juzzList'>;

const JuzzListScreen: React.FC = () => {
  const navigation = useNavigation<JuzzListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [juzs, setJuzs] = useState<JuzzItem[]>([]);
  const [filteredJuzz, setFilteredJuzz] = useState<JuzzItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const { setTabsVisibility } = useQuranNavigation();
  const { saveJuzz, removeJuzz, isJuzzSaved } = useQuranStore();
  const { isAuthenticated, isInitialized } = useQuranAuth();

  // Fetch juzs when component mounts or auth state changes
  useEffect(() => {
    console.log(`🔐 Auth state changed - initialized: ${isInitialized}, authenticated: ${isAuthenticated}`);
    
    if (isInitialized && isAuthenticated) {
      console.log('✅ Authentication ready, fetching juzs');
      fetchJuzs();
    } else if (isInitialized && !isAuthenticated) {
      console.log('⚠️ Authentication initialized but not authenticated');
      setError('Authentication failed. Please try again.');
      setIsLoading(false);
    } else {
      console.log('⏳ Waiting for authentication to initialize');
    }
  }, [isInitialized, isAuthenticated]);

  // Fetch juzs from API
  const fetchJuzs = async () => {
    console.log('🔄 Starting to fetch juzs from API');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📡 Calling quranService.getAllJuzs()');
      const startTime = Date.now();
      const juzsData = await quranService.getAllJuzs();
      const endTime = Date.now();
      
      console.log(`✅ Received ${juzsData.length} juzs in ${endTime - startTime}ms`);
      
      // Convert juzs to JuzzItem format
      console.log('🔄 Converting juzs to JuzzItem format');
      const juzzItems = juzsData.map(juzFoundationToJuzzItem);
      setJuzs(juzzItems);
      setFilteredJuzz(juzzItems);
      
      console.log('✅ Juz data processed and ready for display');
    } catch (err) {
      console.error('❌ Error fetching juzs:', err);
      if (err instanceof Error) {
        console.error(`❌ Error message: ${err.message}`);
        console.error(`❌ Error stack: ${err.stack}`);
      }
      setError('Failed to load juzs. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('🏁 Juz fetching process completed');
    }
  };

  // Show both top and bottom tabs when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('📱 JuzzListScreen focused - showing navigation tabs');
      setTabsVisibility(true, true); // Show both top and bottom tabs
      return () => {
        console.log('📱 JuzzListScreen unfocused');
        // Keep tabs shown when leaving unless going to detail screen
      };
    }, [setTabsVisibility])
  );

  // Handle search input change
  const handleSearch = (text: string) => {
    console.log(`🔍 Search query changed: "${text}"`);
    setSearchQuery(text);
    
    if (text.trim() === '') {
      console.log('🔍 Empty search query, showing all juzs');
      setFilteredJuzz(juzs);
    } else {
      console.log(`🔍 Filtering juzs by: "${text}"`);
      const filtered = juzs.filter(
        (juzz: JuzzItem) =>
          juzz.name.toLowerCase().includes(text.toLowerCase()) ||
          juzz.surahRange.toLowerCase().includes(text.toLowerCase())
      );
      console.log(`🔍 Found ${filtered.length} matching juzs`);
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

  // Render loading state
  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={ColorPrimary.primary500} />
      <Body2Medium style={{marginTop: scale(10)}}>Loading juzs...</Body2Medium>
    </View>
  );

  // Render error state
  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={fetchJuzs}
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
          placeholder="Salam, juzz khojein"
        />
      </View>
      
      {/* Content based on state */}
      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        /* Juzz list */
        <FlatList
          data={filteredJuzz}
          renderItem={renderJuzzItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
         <HadithImageFooter />
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
  juzzItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),paddingHorizontal: scale(16),
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
    fontSize: scale(6),
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
