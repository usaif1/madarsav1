// TasbihScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, DeviceEventEmitter } from 'react-native';
import { DuaCard, Beads, CounterControls } from '../components';
import ChangeDuaModal from '../components/ChangeDuaModal';
import { useThemeStore } from '@/globalStore';

// --- Dua data structure now supports multiple verses ---
const duaList = [
  {
    id: '1',
    verses: [
      {
        arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الْغَفُورُ',
        transliteration: 'Rabbighfirli watub alayya innaka antat-Tawwabul-Ghafur',
        translation: 'O my Rabb, forgive me, and accept my repentance. Verily, You are the Oft-Returning, the Most Forgiving.',
      },
      // Add more verses if needed
    ],
  },
  {
    id: '2',
    verses: [
      {
        arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: `La ilaha illallah, wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir.`,
        translation: 'There is no god but Allah. He is Alone and He has no partner whatsoever. To Him Alone belongs all sovereignty and all praise. He is over all things competent.',
      },
      // Add more verses if needed
    ],
  },
  {
    id: '3',
    verses: [
      {
        arabic: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ، سُبْحَانَ اللّٰهِ الْعَظِيمِ',
        transliteration: 'Subhanallahi wa bihamdihi, subhanallahil-azim.',
        translation: 'Glory is to Allah and praise is to Him, glory is to Allah the Supreme.',
      },
      // Add more verses if needed
    ],
  },
  {
    id: '4',
    verses: [
      {
        arabic: 'اللّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        transliteration: `Allahumma salli 'ala Muhammadin wa 'ala aali Muhammad`,
        translation: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad.',
      },
      // Add more verses if needed
    ],
  },
  {
    id: '5',
    verses: [
      {
        arabic: 'أَسْتَغْفِرُ اللّٰهَ',
        transliteration: 'Astaghfirullah.',
        translation: 'I seek forgiveness from Allah.',
      },
      // Add more verses if needed
    ],
  },
  {
    id: '6',
    verses: [
      {
        arabic: 'سُبْحَانَ اللّٰهِ',
        transliteration: 'Subhanallah.',
        translation: 'Glory is to Allah.',
      },
      // Add more verses if needed
    ],
  },
  {
    id: '7',
    verses: [
      {
        arabic: 'الْحَمْدُ لِلّٰهِ',
        transliteration: 'Alhamdulillah.',
        translation: 'All praise is for Allah.',
      },
      // Add more verses if needed
    ],
  },
  {
    id: '8',
    verses: [
      {
        arabic: 'اللّٰهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar.',
        translation: 'Allah is the Greatest.',
      },
      // Add more verses if needed
    ],
  },
];

const TasbihScreen: React.FC = () => {
  const [selectedDuaIndex, setSelectedDuaIndex] = useState(0);
  const [beadIndex, setBeadIndex] = useState(0);
  const [beadCount, setBeadCount] = useState(duaList[selectedDuaIndex].verses.length); // Verses per dua
  const [duaModalVisible, setDuaModalVisible] = useState(false);
  const { colors } = useThemeStore();

  useEffect(() => {
    // Update bead count when dua changes
    setBeadCount(duaList[selectedDuaIndex].verses.length);
    setBeadIndex(0);
  }, [selectedDuaIndex]);

  useEffect(() => {
    console.log("Modal visibility state in TasbihScreen:", duaModalVisible);
  }, [duaModalVisible]);

  const handlePrev = () => {
    setBeadIndex(i => (i > 0 ? i - 1 : beadCount - 1));
  };
  
  const handleNext = () => {
    setBeadIndex(i => (i < beadCount - 1 ? i + 1 : 0));
  };

  const handleSelectDua = (idx: number) => {
    setSelectedDuaIndex(idx);
    setBeadIndex(0);
    setDuaModalVisible(false);
  };

  const handleSelectCounter = (count: number) => {
    setBeadCount(count);
    setBeadIndex(0);
  };

  const handleReset = () => {
    setBeadIndex(0);
  };

  const handleAdvanceBead = () => {
    if (beadIndex < beadCount - 1) {
      setBeadIndex(beadIndex + 1);
    } else {
      handleNext(); // Change dua and reset bead
    }
  };

  // Enhanced modal toggle function
  const toggleDuaModal = () => {
    console.log("Toggling dua modal from:", duaModalVisible, "to:", !duaModalVisible);
    setDuaModalVisible(prevState => !prevState);
    
    // Emit an event for debugging in dev tools
    if (__DEV__) {
      DeviceEventEmitter.emit('MODAL_TOGGLE', { visible: !duaModalVisible });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}> 
      <DuaCard
        arabic={duaList[selectedDuaIndex].verses[beadIndex].arabic}
        transliteration={duaList[selectedDuaIndex].verses[beadIndex].transliteration}
        translation={duaList[selectedDuaIndex].verses[beadIndex].translation}
        onPrev={handlePrev}
        onNext={handleNext}
        onChangeDua={() => setDuaModalVisible(true)}
      />
      <Beads
        count={beadCount}
        activeIndex={beadIndex}
        onAdvance={handleNext}
      />
      <CounterControls
        selectedCount={beadCount}
        onSelectCounter={handleSelectCounter}
        onReset={handleReset}
      />
      
      {/* The modal component - properly passing visible prop */}
      <ChangeDuaModal
        visible={duaModalVisible}
        duaList={duaList}
        selectedIndex={selectedDuaIndex}
        onSelect={handleSelectDua}
        onClose={() => {
          console.log("Closing modal");
          setDuaModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default TasbihScreen;