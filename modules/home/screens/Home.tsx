import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
  ScrollView,
} from 'react-native';
import HomeHeader from '../components/HomeHeader';
import Gallery from '../components/Gallery';
import AudioPlayer from '../components/AudioPlayer';
import IslamicEvents from '../components/IslamicEvents';
import ModuleGrid from '../components/ModuleGrid';
import FeelingToday from '../components/FeelingToday';
import DayPrayerTime from '../components/DayPrayerTime';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';
import { scale } from '@/theme/responsive';
import { useAll99Names } from '@/modules/names/hooks/use99Names';
import { useGlobalStore } from '@/globalStore';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width / 4; // 4 items per row



type RootStackParamList = {
  home: undefined;
  hadith: undefined;
  names: undefined;
  tasbih: undefined;
  compass: undefined;
  dua: undefined;
  user: undefined;
  calendar: undefined;
  // Add other routes as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const IslamicTools: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // Fetch 99 names data
  const { data: namesData, isLoading: namesLoading } = useAll99Names();
  
  // Get global state for audio
  const { setHomeAudioNameId } = useGlobalStore();
  
  // Initialize with the first name when data is loaded
  useEffect(() => {
    if (namesData && namesData.length > 0) {
      // Set the first name as the current audio
      setHomeAudioNameId(namesData[0].number);
    }
  }, [namesData]);
  
  const handleViewAllGallery = () => {
    console.log('View all gallery pressed');
    // Navigate to gallery view if needed
  };
  
  const handlePlayPause = () => {
    console.log('Play/pause audio pressed');
    // Audio playback is now handled by the AudioPlayer component
  };
  
  const handleExploreDuas = () => {
    console.log('Explore Duas pressed');
    navigation.navigate('dua');
  };
  
  const handleEmojiPress = (day: string) => {
    console.log(`Emoji for ${day} pressed`);
    // Handle emoji selection - no navigation needed
  };
  
  const handleUserProfilePress = () => {
    console.log('User profile pressed');
    navigation.navigate('user');
  };
  
  const handleViewCalendar = () => {
    console.log('Islamic events pressed');
    navigation.navigate('calendar');
  };



  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      
      {/* Custom Header - Handled in ParentNavigator */}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Prayer Times Section */}
        <DayPrayerTime/>

        {/* Feeling Today Section */}
        <FeelingToday 
          onExploreDuasPress={handleExploreDuas}
          onEmojiPress={handleEmojiPress}
        />
        
        {/* Islamic Modules Grid */}
        <ModuleGrid />
      
        {/* Islamic Events Section */}
        <IslamicEvents 
          initialMonth={new Date().toLocaleString('en-US', { month: 'short' })} 
          onViewCalendarPress={handleViewCalendar}
        />
        
        {/* Audio Player Section */}
        <AudioPlayer 
          trackName="Asma-ul-husna"
          onPlayPause={handlePlayPause}
        />
        
        {/* Gallery Section */}
        <Gallery onViewAllPress={handleViewAllGallery} />
        
        <View style={styles.emptySpace} />

        {/* Footer */}
        <HadithImageFooter />
      </ScrollView>
    </View>
  );
};

export default IslamicTools;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingTop: scale(16),
  },
  emptySpace: {
    height: scale(250),
  },
});
