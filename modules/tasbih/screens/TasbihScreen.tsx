// TasbihScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, DeviceEventEmitter, ActivityIndicator, AccessibilityInfo } from 'react-native';
import { DuaCard, Beads, CounterControls } from '../components';
import ChangeDuaModal from '../components/ChangeDuaModal';
import CustomBeadModal from '../components/CustomBeadModal';
import SelectCounterModal from '../components/SelectCounterModal';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import { useAllTasbihs, useTasbihById } from '@/modules/tasbih/hooks/useTasbihs';
import { TasbihData } from '@/modules/tasbih/services/tasbihService';
import { useRoute } from '@react-navigation/native';

const CIRCLE_SIZE = 40;
// Preset bead counts for the counter
const PRESET_BEADS = [11, 33, 99];

// Fallback duas in case API fails
const fallbackDuaList = [
  {
    id: '1',
    verses: [
      {
        arabic: 'اللّهُـمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ',
        transliteration: 'Allahumma antas-salaamu wa minkas-salaam',
        translation: 'O Allah, You are Peace and from You is peace.',
      },
      {
        arabic: 'تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
        transliteration: 'Tabaarakta yaa Dhal-Jalaali wal-Ikraam',
        translation: 'Blessed are You, O Possessor of majesty and honor.',
      },
    ],
  },
  {
    id: '2',
    verses: [
      {
        arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ',
        transliteration: 'Rabbi ighfir li wa tub alayya',
        translation: 'My Lord, forgive me and turn to me in mercy.',
      },
      {
        arabic: 'إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
        transliteration: 'Innaka anta at-Tawwaabur-Raheem',
        translation: 'Indeed, You are the Accepting of repentance, the Merciful.',
      },
      {
        arabic: 'اللّهُمَّ اغْفِرْ لِي وَارْحَمْنِي',
        transliteration: 'Allahumma ighfir li warhamni',
        translation: 'O Allah, forgive me and have mercy on me.',
      },
    ],
  },
  {
    id: '3',
    verses: [
      {
        arabic: 'سُبْحَانَ اللّٰهِ',
        transliteration: 'Subhanallah',
        translation: 'Glory is to Allah.',
      },
      {
        arabic: 'الْحَمْدُ لِلّٰهِ',
        transliteration: 'Alhamdulillah',
        translation: 'All praise is for Allah.',
      },
      {
        arabic: 'اللّٰهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        translation: 'Allah is the Greatest.',
      },
    ],
  },
  {
    id: '4',
    verses: [
      {
        arabic: 'اللّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
        transliteration: 'Allahumma salli ala Muhammad',
        translation: 'O Allah, send prayers upon Muhammad.',
      },
      {
        arabic: 'وَعَلَى آلِ مُحَمَّدٍ',
        transliteration: 'wa ala aali Muhammad',
        translation: 'and upon the family of Muhammad.',
      },
    ],
  },
  {
    id: '5',
    verses: [
      {
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً',
        transliteration: 'Rabbana atina fid-dunya hasanah',
        translation: 'Our Lord, give us in this world [that which is] good',
      },
      {
        arabic: 'وَفِي الْآخِرَةِ حَسَنَةً',
        transliteration: 'wa fil-akhirati hasanah',
        translation: 'and in the Hereafter [that which is] good',
      },
      {
        arabic: 'وَقِنَا عَذَابَ النَّارِ',
        transliteration: 'wa qina adhaban-nar',
        translation: 'and protect us from the punishment of the Fire.',
      },
    ],
  },
  {
    id: '6',
    verses: [
      {
        arabic: 'اللّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ',
        transliteration: `Allahumma inni as'aluka al-'afwa wal-'afiyah`,
        translation: 'O Allah, I ask You for pardon and well-being.',
      },
      {
        arabic: 'فِي الدُّنْيَا وَالآخِرَةِ',
        transliteration: 'fid-dunya wal-akhirah',
        translation: 'in this world and the Hereafter.',
      },
    ],
  },
  {
    id: '7',
    verses: [
      {
        arabic: 'اللّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ',
        transliteration: 'Allahumma ihdini fiman hadayt',
        translation: 'O Allah, guide me among those You have guided.',
      },
      {
        arabic: 'وَعَافِنِي فِيمَنْ عَافَيْتَ',
        transliteration: 'wa aafini fiman aafayt',
        translation: 'and grant me well-being among those You have granted well-being.',
      },
    ],
  },
  {
    id: '8',
    verses: [
      {
        arabic: 'اللّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ',
        transliteration: `Allahumma inni a'udhu bika min zawali ni'matik`,
        translation: 'O Allah, I seek refuge in You from the decline of Your favor.',
      },
      {
        arabic: 'وَتَحَوُّلِ عَافِيَتِكَ',
        transliteration: `wa tahawwuli 'afiyatika`,
        translation: 'and the loss of Your well-being.',
      },
      {
        arabic: 'وَفُجَاءَةِ نِقْمَتِكَ',
        transliteration: `wa fuja'ati niqmatik`,
        translation: 'and the suddenness of Your punishment.',
      },
      {
        arabic: 'وَجَمِيعِ سَخَطِكَ',
        transliteration: `wa jami'i sakhatik`,
        translation: 'and all forms of Your displeasure.',
      },
    ],
  },
];

// Preset bead counts for the counter

/**
 * TasbihScreen component displaying Islamic prayer beads with duas
 * Integrates the shifting bead animation logic with verse-based counting
 */
const TasbihScreen = () => {
  const { colors } = useThemeStore();
  const route = useRoute<any>();
  const lottieRef = useRef(null);
  
  // State for the tasbih data
  const [selectedDuaIndex, setSelectedDuaIndex] = useState(0);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [totalPrayerCount, setTotalPrayerCount] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isWhite, setIsWhite] = useState(false);
  
  // Modal visibility states
  const [duaModalVisible, setDuaModalVisible] = useState(false);
  const [selectCounterModalVisible, setSelectCounterModalVisible] = useState(false);
  const [customBeadModalVisible, setCustomBeadModalVisible] = useState(false);
  const [customBeadValue, setCustomBeadValue] = useState('33');
  const [inputTouched, setInputTouched] = useState(false);
  
  // Fetch tasbih data from API using React Query hooks from tasbih service
  const { data: apiTasbihs, isLoading: isLoadingAllTasbihs, error: allTasbihsError } = useAllTasbihs();
  const { data: specificTasbih, isLoading: isLoadingSpecificTasbih, error: specificTasbihError } = useTasbihById(
    route.params?.id ? Number(route.params.id) : 0
  );

  // Log errors in development mode
  useEffect(() => {
    if (__DEV__) {
      if (allTasbihsError) {
        console.error('Error fetching all tasbihs:', allTasbihsError);
      }
      if (specificTasbihError) {
        console.error('Error fetching specific tasbih:', specificTasbihError);
      }
    }
  }, [allTasbihsError, specificTasbihError]);

  // Current dua and verse calculations - use fallback if API fails
  const duaList = apiTasbihs?.data && apiTasbihs.data.length > 0 
    ? apiTasbihs.data 
    : fallbackDuaList as unknown as TasbihData[];
  const currentDua = duaList[selectedDuaIndex] || duaList[0];
  const totalVerses = currentDua?.verses?.length || 1;
  const currentVerse = currentDua?.verses?.[currentVerseIndex] || (currentDua?.verses?.[0] || { arabic: '', transliteration: '', translation: '' });

  // Reset verse index when dua changes
  useEffect(() => {
    setCurrentVerseIndex(0);
    setTotalPrayerCount(0);
    setCompletedCycles(0);
  }, [selectedDuaIndex]);

  useEffect(() => {
    if (__DEV__) {
      console.log("Modal visibility state in TasbihScreen:", duaModalVisible);
    }
  }, [duaModalVisible]);

  /**
   * Handle advancing to next verse with counter logic
   */
  const handleAdvanceVerse = () => {
    setCurrentVerseIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % totalVerses;
      
      // If we completed a full cycle (back to verse 0), increment cycle counter
      if (nextIndex === 0) {
        setCompletedCycles(prev => prev + 1);
      }
      
      // Always increment total prayer count
      setTotalPrayerCount(prev => prev + 1);
      
      return nextIndex;
    });
  };

  /**
   * Handle manual verse navigation (prev/next buttons on DuaCard)
   */
  const handlePrevVerse = () => {
    setCurrentVerseIndex(prevIndex => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : totalVerses - 1;
      return newIndex;
    });
  };
  
  const handleNextVerse = () => {
    setCurrentVerseIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % totalVerses;
      return newIndex;
    });
  };

  /**
   * Handle dua selection
   */
  const handleSelectDua = (idx: number) => {
    const validIdx = Math.max(0, Math.min(idx, duaList.length - 1));
    setSelectedDuaIndex(validIdx);
    setDuaModalVisible(false);
  };

  /**
   * Handle counter selection (kept for UI compatibility)
   */
  const handleSelectCounter = (count: number) => {
    // This could be used for setting prayer goals or cycles
    setSelectCounterModalVisible(false);
  };

  /**
   * Handle custom bead modal
   */
  const handleCustomBeadOpen = () => {
    setCustomBeadValue('');
    setInputTouched(false);
    setCustomBeadModalVisible(true);
    setSelectCounterModalVisible(false);
  };

  const handleCustomBeadSave = () => {
    if (customBeadValue && parseInt(customBeadValue) > 0) {
      // Custom logic for prayer goals could be implemented here
      setCustomBeadModalVisible(false);
    }
  };

  /**
   * Handle reset - resets to beginning of current dua
   */
  const handleReset = () => {
    setCurrentVerseIndex(0);
    setTotalPrayerCount(0);
    setCompletedCycles(0);
  };

  /**
   * Toggle dua modal with enhanced debugging
   */
  const toggleDuaModal = () => {
    if (__DEV__) {
      console.log("Toggling dua modal from:", duaModalVisible, "to:", !duaModalVisible);
    }
    setDuaModalVisible(prevState => !prevState);
    
    // Emit event for debugging
    if (__DEV__) {
      DeviceEventEmitter.emit('MODAL_TOGGLE', { visible: !duaModalVisible });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}> 
      {isLoadingAllTasbihs || isLoadingSpecificTasbih ? (
        <ActivityIndicator size="large" color={colors.primary.primary500} style={styles.loader} />
      ) : (
        // Show the UI with data (fallback data will be used if API had errors)
        <>
          {/* Dua card showing current verse */}
          <DuaCard
            arabic={currentVerse.arabic}
            transliteration={currentVerse.transliteration}
            translation={currentVerse.translation}
            onPrev={handlePrevVerse}
            onNext={handleNextVerse}
            onChangeDua={() => setDuaModalVisible(true)}
          />
          
          {/* Beads component with shifting animation logic */}
          <Beads
            totalVerses={totalVerses}
            currentVerseIndex={currentVerseIndex}
            onAdvance={handleAdvanceVerse}
            totalCount={totalPrayerCount}
            isWhite={isWhite}
            tasbihData={currentDua}
          />
        </>
      )}
      
      {/* Counter controls */}
      <View style={styles.counterControlsWrapper}>
        <CounterControls
        onSelectBead={() => setIsWhite(!isWhite)}
          selectedCount={totalVerses} // Show verses count instead of bead count
          onSelectCounter={() => setSelectCounterModalVisible(true)}
          onReset={handleReset}
          currentCount={totalPrayerCount} // Show total prayers completed
        />
      </View>
      
      {/* Dua selection modal */}
      <ChangeDuaModal
        visible={duaModalVisible}
        duaList={duaList as any}
        selectedIndex={selectedDuaIndex}
        onSelect={handleSelectDua}
        onClose={() => {
          if (__DEV__) {
            console.log("Closing modal");
          }
          setDuaModalVisible(false);
        }}
      />

      {/* Counter selection modal (kept for compatibility) */}
      <SelectCounterModal
        visible={selectCounterModalVisible}
        onClose={() => setSelectCounterModalVisible(false)}
        onSelectPreset={handleSelectCounter}
        onCustomBeads={handleCustomBeadOpen}
        presetBeads={PRESET_BEADS}
        selectedCount={totalVerses}
        isCustomSelected={false}
      />
      
      {/* Custom bead count modal */}
      <CustomBeadModal
        visible={customBeadModalVisible}
        value={customBeadValue}
        onChangeValue={setCustomBeadValue}
        onSave={handleCustomBeadSave}
        onClose={() => setCustomBeadModalVisible(false)}
        inputTouched={inputTouched}
        setInputTouched={setInputTouched}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    rowGap: verticalScale(52),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterControlsWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  list: {
    gap: 12,
    paddingHorizontal: 10,
  },
  verticalSeparator: {
    width: 32,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#8A57DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  movingCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -CIRCLE_SIZE / 2,
    marginLeft: -CIRCLE_SIZE / 2,
    zIndex: 2,
  },
  label: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default TasbihScreen;
