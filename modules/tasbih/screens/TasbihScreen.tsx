// TasbihScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, DeviceEventEmitter } from 'react-native';
import { DuaCard, Beads, CounterControls } from '../components';
import ChangeDuaModal from '../components/ChangeDuaModal';
import { useThemeStore } from '@/globalStore';
import { verticalScale } from '@/theme/responsive';

// --- Famous multi-verse duas ---
const duaList = [
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
        transliteration: 'Allahumma inni as’aluka al-‘afwa wal-‘afiyah',
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
        transliteration: 'Allahumma inni a’udhu bika min zawali ni’matik',
        translation: 'O Allah, I seek refuge in You from the decline of Your favor.',
      },
      {
        arabic: 'وَتَحَوُّلِ عَافِيَتِكَ',
        transliteration: 'wa tahawwuli ‘afiyatika',
        translation: 'and the loss of Your well-being.',
      },
      {
        arabic: 'وَفُجَاءَةِ نِقْمَتِكَ',
        transliteration: 'wa fuja’ati niqmatik',
        translation: 'and the suddenness of Your punishment.',
      },
      {
        arabic: 'وَجَمِيعِ سَخَطِكَ',
        transliteration: 'wa jami’i sakhatik',
        translation: 'and all forms of Your displeasure.',
      },
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
        totalCount={beadCount}
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
    rowGap: verticalScale(52),
  },
});

export default TasbihScreen;