import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import SurahListScreen from '../screens/surah/SurahListScreen';
import SurahDetailScreen from '../screens/surah/SurahDetailScreen';
import TafseerScreen from '../screens/surah/TafseerScreen';
import ChangeSurahScreen from '../screens/surah/ChangeSurahScreen';
import QuranSettingsScreen from '../screens/surah/QuranSettingsScreen';

// Define the param list for type safety
export type SurahStackParamList = {
  surahList: undefined;
  surahDetail: { surahId: number; surahName: string };
  tafseer: { surahId: number; ayahId: number; verse: string };
  changeSurah: { currentSurahId: number };
  quranSettings: undefined;
};

// Create the navigator
const Stack = createNativeStackNavigator<SurahStackParamList>();

const SurahNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="surahList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="surahList" component={SurahListScreen} />
      <Stack.Screen 
        name="surahDetail" 
        component={SurahDetailScreen}
        options={{
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="tafseer" 
        component={TafseerScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="changeSurah" 
        component={ChangeSurahScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="quranSettings" 
        component={QuranSettingsScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default SurahNavigator;
