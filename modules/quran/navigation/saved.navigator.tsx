import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import SavedListScreen from '../screens/saved/SavedListScreen';
import SavedSurahsScreen from '../screens/saved/SavedSurahsScreen';
import SavedJuzzScreen from '../screens/saved/SavedJuzzScreen';
import SavedAyahsScreen from '../screens/saved/SavedAyahsScreen';
import SurahDetailScreen from '../screens/surah/SurahDetailScreen';
import JuzzDetailScreen from '../screens/juzz/JuzzDetailScreen';
import AyahDetailScreen from '../screens/saved/AyahDetailScreen';

// Define the param list for type safety
export type SavedStackParamList = {
  savedList: undefined;
  savedSurahs: undefined;
  savedJuzz: undefined;
  savedAyahs: undefined;
  savedSurahDetail: { surahId: number; surahName: string };
  savedJuzzDetail: { juzzId: number; juzzName: string };
  savedAyahDetail: { ayahId: number; surahName: string; verseNumber: number };
};

// Create the navigator
const Stack = createNativeStackNavigator<SavedStackParamList>();

const SavedNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="savedList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="savedList" component={SavedListScreen} />
      <Stack.Screen name="savedSurahs" component={SavedSurahsScreen} />
      <Stack.Screen name="savedJuzz" component={SavedJuzzScreen} />
      <Stack.Screen name="savedAyahs" component={SavedAyahsScreen} />
      <Stack.Screen name="savedSurahDetail" component={SurahDetailScreen} />
      <Stack.Screen name="savedJuzzDetail" component={JuzzDetailScreen} />
      <Stack.Screen name="savedAyahDetail" component={AyahDetailScreen} />
    </Stack.Navigator>
  );
};

export default SavedNavigator;
