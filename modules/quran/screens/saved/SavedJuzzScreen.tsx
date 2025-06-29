import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SavedStackParamList } from '../../navigation/saved.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, CaptionMedium } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import CustomHeader from '@/components/Header/Header';
import { useQuranNavigation } from '../../context/QuranNavigationContext';
import { useQuranStore, SavedJuzz } from '../../store/quranStore';

type SavedJuzzScreenNavigationProp = NativeStackNavigationProp<SavedStackParamList, 'savedJuzz'>;

const SavedJuzzScreen: React.FC = () => {
  const navigation = useNavigation<SavedJuzzScreenNavigationProp>();
  const { setTabsVisibility } = useQuranNavigation();
  const { savedJuzz, removeJuzz } = useQuranStore();

  // Hide both tabs when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setTabsVisibility(false, false); // Hide both top and bottom tabs
      return () => {
        // Tabs will be shown again when returning to list screen
      };
    }, [setTabsVisibility])
  );

  // Handle juzz press
  const handleJuzzPress = (juzz: SavedJuzz) => {
    navigation.navigate('savedJuzzDetail', {
      juzzId: juzz.id,
      juzzName: juzz.name
    });
  };

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle bookmark toggle (remove from saved)
  const handleBookmarkToggle = (juzzId: number) => {
    removeJuzz(juzzId);
  };

  // Render a saved juzz item using JuzzListScreen UI pattern
  const renderSavedJuzzItem = ({ item }: { item: SavedJuzz }) => (
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
          <Body2Bold style={styles.numberText}>{item.id}/30</Body2Bold>
        </View>
      </View>
      
      {/* Juzz details */}
      <View style={styles.juzzDetails}>
        <View style={styles.juzzNameRow}>
          <Body2Bold>{item.name}</Body2Bold>
          <TouchableOpacity onPress={() => handleBookmarkToggle(item.id)}>
            <CdnSvg path={DUA_ASSETS.BOOKMARK_PRIMARY} width={16} height={16} />
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

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Body2Bold style={styles.emptyTitle}>No saved juzz yet</Body2Bold>
      <Body2Medium style={styles.emptyText}>
        Bookmark your favorite juzz to access them quickly here.
      </Body2Medium>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <CustomHeader
        title="Saved Juzz"
        onBack={handleBackPress}
      />
      
      {/* Juzz list */}
      <FlatList
        data={savedJuzz}
        renderItem={renderSavedJuzzItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      
      {/* Footer */}
      <HadithImageFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(20),
    flexGrow: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(32),
    paddingVertical: scale(64),
  },
  emptyTitle: {
    marginBottom: scale(8),
  },
  emptyText: {
    textAlign: 'center',
    color: '#737373',
  },
});

export default SavedJuzzScreen;
