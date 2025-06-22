import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SurahStackParamList } from '../../navigation/surah.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, H5Bold, CaptionMedium } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

type TafseerScreenRouteProp = RouteProp<SurahStackParamList, 'tafseer'>;
type TafseerScreenNavigationProp = NativeStackNavigationProp<SurahStackParamList, 'tafseer'>;

const TafseerScreen: React.FC = () => {
  const route = useRoute<TafseerScreenRouteProp>();
  const navigation = useNavigation<TafseerScreenNavigationProp>();
  const { surahId, ayahId, verse } = route.params;

  // Sample tafseer content
  const tafseerContent = `
Bismillah (بِسْمِ اللَّهِ) is a phrase in Arabic meaning "in the name of Allah." It is the first verse of the first chapter of the Quran, Al-Fatiha, and is often used by Muslims at the beginning of every action.

The full phrase is "Bismillah ir-Rahman ir-Rahim" (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ) which translates to "In the name of Allah, the Most Gracious, the Most Merciful."

The phrase has deep significance in Islamic tradition:

1. It is a reminder to begin all actions with the remembrance of Allah.
2. It acknowledges that all actions should be done for the sake of Allah.
3. It recognizes Allah's attributes of mercy and compassion.
4. It serves as a form of seeking blessing and guidance from Allah before undertaking any task.

Muslims recite Bismillah before meals, before entering their homes, before beginning a journey, and before starting any significant action. It is also traditionally written at the beginning of letters, books, and documents.

The phrase appears at the beginning of every chapter (Surah) of the Quran except for Surah At-Tawbah (the 9th chapter).
  `;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <H5Bold>Tafseer</H5Bold>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CdnSvg path={DUA_ASSETS.QURAN_CLOSE_ICON} width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Body2Medium style={styles.activeTabText}>English</Body2Medium>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Body2Medium style={styles.tabText}>Author name</Body2Medium>
        </TouchableOpacity>
      </View>
      
      {/* Verse */}
      <View style={styles.verseContainer}>
        <Body2Bold style={styles.verseText}>{verse}</Body2Bold>
        <CaptionMedium style={styles.verseTranslation}>
          In the Name of Allah—the Most Compassionate, Most Merciful.
        </CaptionMedium>
      </View>
      
      {/* Tafseer content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Body2Medium style={styles.tafseerText}>{tafseerContent}</Body2Medium>
      </ScrollView>
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    marginRight: scale(8),
  },
  activeTab: {
    backgroundColor: ColorPrimary.primary100,
  },
  tabText: {
    color: '#737373',
  },
  activeTabText: {
    color: ColorPrimary.primary500,
  },
  verseContainer: {
    padding: scale(16),
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  verseText: {
    fontSize: scale(18),
    lineHeight: scale(32),
    textAlign: 'right',
    color: '#171717',
    marginBottom: scale(8),
  },
  verseTranslation: {
    color: '#737373',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(16),
  },
  tafseerText: {
    color: '#404040',
    lineHeight: scale(24),
  },
});

export default TafseerScreen;
