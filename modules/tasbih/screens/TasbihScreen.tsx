import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DuaCard, Beads, CounterControls } from '../components';
import ChangeDuaModal from '../components/ChangeDuaModal';
import { useThemeStore } from '@/globalStore';

const duaList = [
  {
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الْغَفُورُ',
    transliteration: 'Rabbighfirli watub alayya innaka antat-Tawwabul-Ghafur',
    translation: 'O my Rabb, forgive me, and accept my repentance. Verily, You are the Oft-Returning, the Most Forgiving.',
  },
  {
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallah, wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa huwa ‘ala kulli shay’in qadir.',
    translation: 'There is no god but Allah. He is Alone and He has no partner whatsoever. To Him Alone belongs all sovereignty and all praise. He is over all things competent.',
  },
  {
    arabic: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ، سُبْحَانَ اللّٰهِ الْعَظِيمِ',
    transliteration: 'Subhanallahi wa bihamdihi, subhanallahil-azim.',
    translation: 'Glory is to Allah and praise is to Him, glory is to Allah the Supreme.',
  },
  {
    arabic: 'اللّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliteration: 'Allahumma salli ‘ala Muhammadin wa ‘ala aali Muhammad.',
    translation: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad.',
  },
  {
    arabic: 'أَسْتَغْفِرُ اللّٰهَ',
    transliteration: 'Astaghfirullah.',
    translation: 'I seek forgiveness from Allah.',
  },
  {
    arabic: 'سُبْحَانَ اللّٰهِ',
    transliteration: 'Subhanallah.',
    translation: 'Glory is to Allah.',
  },
  {
    arabic: 'الْحَمْدُ لِلّٰهِ',
    transliteration: 'Alhamdulillah.',
    translation: 'All praise is for Allah.',
  },
  {
    arabic: 'اللّٰهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar.',
    translation: 'Allah is the Greatest.',
  },
];

const TasbihScreen: React.FC = () => {
  const [duaIndex, setDuaIndex] = useState(0);
  const [beadCount, setBeadCount] = useState(11); // Default to 11
  const [activeBead, setActiveBead] = useState(0);
  const [duaModalVisible, setDuaModalVisible] = useState(false);
  const { colors } = useThemeStore();

  const handlePrev = () => {
    setDuaIndex(i => (i > 0 ? i - 1 : duaList.length - 1));
    setActiveBead(0);
  };
  const handleNext = () => {
    setDuaIndex(i => (i < duaList.length - 1 ? i + 1 : 0));
    setActiveBead(0);
  };

  const handleSelectCounter = (count: number) => {
    setBeadCount(count);
    setActiveBead(0);
  };

  const handleReset = () => {
    setActiveBead(0);
  };

  const handleAdvanceBead = () => {
    if (activeBead < beadCount - 1) {
      setActiveBead(activeBead + 1);
    } else {
      handleNext(); // Change dua and reset bead
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}> 
      <DuaCard
        arabic={duaList[duaIndex].arabic}
        transliteration={duaList[duaIndex].transliteration}
        translation={duaList[duaIndex].translation}
        onPrev={handlePrev}
        onNext={handleNext}
        onChangeDua={() => setDuaModalVisible(true)}
      />
      <Beads
        count={beadCount}
        activeIndex={activeBead}
        onAdvance={handleAdvanceBead}
      />
      <CounterControls
        selectedCount={beadCount}
        onSelectCounter={handleSelectCounter}
        onReset={handleReset}
      />
      <ChangeDuaModal
        visible={duaModalVisible}
        duaList={duaList}
        selectedIndex={duaIndex}
        onSelect={idx => {
          setDuaIndex(idx);
          setDuaModalVisible(false);
          setActiveBead(0);
        }}
        onClose={() => setDuaModalVisible(false)}
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
