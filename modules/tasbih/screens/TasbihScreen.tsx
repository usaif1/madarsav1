// TasbihScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, DeviceEventEmitter, ActivityIndicator, AccessibilityInfo } from 'react-native';
import { DuaCard, Beads, CounterControls } from '../components';
import ChangeDuaModal from '../components/ChangeDuaModal';
import CustomBeadModal from '../components/CustomBeadModal';
import SelectCounterModal from '../components/SelectCounterModal';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import { useAllTasbihs, useTasbihById, useDefaultTasbihCount } from '@/modules/tasbih/hooks/useTasbihs';
import { saveTasbihUserCounter } from '@/modules/tasbih/services/tasbihUserCounterService';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { TasbihData } from '@/modules/tasbih/services/tasbihService';
import { useRoute, useFocusEffect } from '@react-navigation/native';

const CIRCLE_SIZE = 40;
// Preset bead counts for the counter
const PRESET_BEADS = [11, 33, 99];

// Fallback duas in case API fails
const fallbackDuaList = [
  {
    id: 1,
    title: 'Tasbih after Prayer',
    verses: [
      {
        arabic: 'سُبْحَانَ اللّٰهِ',
        transliteration: 'Subhanallah',
        translation: 'Glory is to Allah.',
      }
    ],
    count: 33,
    category: 'Daily Dhikr',
  },
  {
    id: 2,
    title: 'Alhamdulillah',
    verses: [
      {
        arabic: 'الْحَمْدُ لِلّٰهِ',
        transliteration: 'Alhamdulillah',
        translation: 'All praise is for Allah.',
      }
    ],
    count: 33,
    category: 'Daily Dhikr',
  },
  {
    id: 3,
    title: 'Allahu Akbar',
    verses: [
      {
        arabic: 'اللّٰهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        translation: 'Allah is the Greatest.',
      }
    ],
    count: 33,
    category: 'Daily Dhikr',
  },
  {
    id: 4,
    title: 'La ilaha illallah',
    verses: [
      {
        arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
        transliteration: 'La ilaha illallah',
        translation: 'There is no deity except Allah.',
      }
    ],
    count: 100,
    category: 'Daily Dhikr',
  },
  {
    id: 5,
    title: 'Istighfar',
    verses: [
      {
        arabic: 'أَسْتَغْفِرُ اللّٰهَ',
        transliteration: 'Astaghfirullah',
        translation: 'I seek forgiveness from Allah.',
      }
    ],
    count: 100,
    category: 'Daily Dhikr',
  },
  {
    id: 6,
    title: 'Salawat',
    verses: [
      {
        arabic: 'اللّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        transliteration: 'Allahumma salli ala Muhammad wa ala aali Muhammad',
        translation: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad.',
      }
    ],
    count: 100,
    category: 'Daily Dhikr',
  },
  {
    id: 7,
    title: 'Hasbunallah',
    verses: [
      {
        arabic: 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ',
        transliteration: 'Hasbunallahu wa ni\'mal wakeel',
        translation: 'Allah is sufficient for us, and He is the best Disposer of affairs.',
      }
    ],
    count: 100,
    category: 'Daily Dhikr',
  },
  {
    id: 8,
    title: 'La hawla',
    verses: [
      {
        arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ',
        transliteration: 'La hawla wa la quwwata illa billah',
        translation: 'There is no might nor power except with Allah.',
      }
    ],
    count: 100,
    category: 'Daily Dhikr',
  },
];

// Preset bead counts for the counter

/**
 * TasbihScreen component displaying Islamic prayer beads with duas
 * Uses a single dua for the entire counting process
 */
const TasbihScreen = () => {
  const { colors } = useThemeStore();
  const route = useRoute<any>();
  const lottieRef = useRef(null);
  
  // State for the tasbih data
  const [selectedDuaIndex, setSelectedDuaIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [targetCount, setTargetCount] = useState(33); // Default target count
  const [currentRound, setCurrentRound] = useState(1); // Track the current round
  const [isWhite, setIsWhite] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date()); // Track when the user started using the tasbih
  
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

  // Current dua calculations - use fallback if API fails
  const duaList = apiTasbihs?.data && apiTasbihs.data.length > 0 
    ? apiTasbihs.data 
    : fallbackDuaList as unknown as TasbihData[];
  const currentDua = duaList[selectedDuaIndex] || duaList[0];
  
  // Get the single verse from the current dua
  const currentVerse = currentDua?.verses?.[0] || { arabic: '', transliteration: '', translation: '' };

  // Reset count and set target count when dua changes
  useEffect(() => {
    setTotalCount(0);
    setCurrentRound(1);
    // Set target count from the dua or use default
    setTargetCount(currentDua?.count || 33);
  }, [selectedDuaIndex, currentDua]);
  
  // Update round when count changes
  useEffect(() => {
    if (totalCount > 0 && targetCount > 0) {
      const newRound = Math.floor(totalCount / targetCount) + 1;
      if (newRound !== currentRound) {
        setCurrentRound(newRound);
      }
    }
  }, [totalCount, targetCount]);

  // Save tasbih counter data when user leaves the screen
  useFocusEffect(
    useCallback(() => {
      // Set start time when screen comes into focus
      setStartTime(new Date());
      
      // Return cleanup function to save data when screen loses focus
      return () => {
        if (totalCount > 0) {
          saveTasbihCounterData();
        }
      };
    }, [totalCount])
  );
  
  /**
   * Save the user's tasbih counter data to the API
   */
  const saveTasbihCounterData = async () => {
    try {
      const user = useAuthStore.getState().user;
      const userId = user?.userId || 'anonymous';
      const duaId = currentDua?.id || 0;
      
      // Calculate time spent in minutes
      const endTime = new Date();
      const timeSpentMs = endTime.getTime() - startTime.getTime();
      const timeInMinutes = Math.max(1, Math.round(timeSpentMs / (1000 * 60))); // At least 1 minute
      
      console.log('📿 Saving tasbih counter data:', {
        userId,
        duaId,
        beadsCounter: totalCount,
        completedRound: currentRound - 1, // Current round is 1-indexed, API expects 0-indexed
        timeInMinutes
      });
      
      const response = await saveTasbihUserCounter({
        userId,
        duaId,
        beadsCounter: totalCount,
        completedRound: currentRound - 1,
        timeInMinutes
      });
      
      console.log('📿 Successfully saved tasbih counter data:', response);
    } catch (error) {
      console.error('Error saving tasbih counter data:', error);
    }
  };

  // Debug logging for modal visibility
  useEffect(() => {
    if (__DEV__) {
      console.log("Modal visibility state in TasbihScreen:", duaModalVisible);
    }
  }, [duaModalVisible]);

  /**
   * Handle advancing the counter
   */
  const handleAdvanceCounter = () => {
    setTotalCount(prev => prev + 1);
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
   * Handle counter selection
   */
  const handleSelectCounter = (count: number) => {
    setTargetCount(count);
    // Reset count and round when counter changes
    setTotalCount(0);
    setCurrentRound(1);
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
      setTargetCount(parseInt(customBeadValue));
      // Reset count and round when counter changes
      setTotalCount(0);
      setCurrentRound(1);
      setCustomBeadModalVisible(false);
    }
  };

  /**
   * Handle reset - resets the counter to zero
   */
  const handleReset = () => {
    setTotalCount(0);
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
          {/* Dua card showing the single verse */}
          <DuaCard
            arabic={currentVerse.arabic}
            transliteration={currentVerse.transliteration}
            translation={currentVerse.translation}
            onPrev={() => {
              // Navigate to previous dua without changing counter
              const newIndex = selectedDuaIndex > 0 ? selectedDuaIndex - 1 : duaList.length - 1;
              setSelectedDuaIndex(newIndex);
            }}
            onNext={() => {
              // Navigate to next dua without changing counter
              const newIndex = (selectedDuaIndex + 1) % duaList.length;
              setSelectedDuaIndex(newIndex);
            }}
            onChangeDua={() => setDuaModalVisible(true)}
          />
          
          {/* Beads component with counter logic */}
          <Beads
            totalVerses={targetCount} // Use target count as total verses
            currentVerseIndex={totalCount % targetCount} // Calculate current position in the round
            onAdvance={handleAdvanceCounter}
            totalCount={totalCount}
            isWhite={isWhite}
            tasbihData={currentDua}
            currentRound={currentRound}
          />
        </>
      )}
      
      {/* Counter controls */}
      <View style={styles.counterControlsWrapper}>
        <CounterControls
          onSelectBead={() => setIsWhite(!isWhite)}
          selectedCount={targetCount} // Show target count instead of verses count
          onSelectCounter={() => setSelectCounterModalVisible(true)}
          onReset={handleReset}
          currentCount={totalCount} // Show current count
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

      {/* Counter selection modal */}
      <SelectCounterModal
        visible={selectCounterModalVisible}
        onClose={() => setSelectCounterModalVisible(false)}
        onSelectPreset={handleSelectCounter}
        onCustomBeads={handleCustomBeadOpen}
        presetBeads={PRESET_BEADS}
        selectedCount={targetCount}
        isCustomSelected={!PRESET_BEADS.includes(targetCount)}
        customValue={!PRESET_BEADS.includes(targetCount) ? targetCount : undefined}
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
    paddingBottom: verticalScale(40),
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
