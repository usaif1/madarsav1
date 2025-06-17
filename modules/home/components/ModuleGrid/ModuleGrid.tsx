import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { scale, verticalScale } from '@/theme/responsive';
import { ShadowColors } from '@/theme/shadows';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');
const CARD_WIDTH = scale(163.5); // Width of each card
const CARD_HEIGHT = scale(184); // Height of each card
const CARD_GAP = scale(12); // Gap between cards in the same row
const BASE_CDN_URL = 'https://cdn.madrasaapp.com/assets/home/';

interface ModuleItem {
  id: string;
  image: string;
  route: string;
}

const modules: ModuleItem[] = [
  {
    id: 'quran',
    image: `${BASE_CDN_URL}quran-card.png`,
    route: 'quran',
  },
  {
    id: 'dua',
    image: `${BASE_CDN_URL}dua-card.png`,
    // image:require('@/assets/DuaHome.png'),
    route: 'dua',
  },
  // {
  //   id: 'maktab',
  //   image: `${BASE_CDN_URL}maktab-card.png`,
  //   route: 'maktab',
  // },
  {
    id: 'qiblah',
    image: `${BASE_CDN_URL}qiblah-card.png`,
    route: 'compass',
  },
  {
    id: 'tasbih',
    image: `${BASE_CDN_URL}tasbih-card.png`,
    route: 'tasbih',
  },
  {
    id: 'hadith',
    image: `${BASE_CDN_URL}hadith-card.png`,
    route: 'hadith',
  },
  {
    id: 'zakat',
    image: `${BASE_CDN_URL}zakat-card.png`,
    route: 'zakat',
  },
];



type RootStackParamList = {
  hadith: undefined;
  names: undefined;
  tasbih: undefined;
  compass: undefined;
  dua: undefined;
  maktab: undefined;
  // Add other routes as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ModuleGrid: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleModulePress = (route: string) => {
    // Only navigate to implemented modules
    switch (route) {
      case 'hadith':
        navigation.navigate('hadith');
        break;
      case 'maktab':
        // Redirect maktab to its own module
        navigation.navigate('maktab');
        break;
      case 'quran':
        // Redirect Quran to 99names for now
        // navigation.navigate('names');
        break;
      case 'tasbih':
        navigation.navigate('tasbih');
        break;
      case 'compass':
        navigation.navigate('compass');
        break;
      case 'dua':
        navigation.navigate('dua');
        break;
      default:
        // Do nothing for modules not yet created
        console.log(`Module ${route} not yet implemented`);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {modules.map((module) => (
          <TouchableOpacity
            key={module.id}
            onPress={() => handleModulePress(module.route)}
            activeOpacity={0.8}
            style={styles.cardContainer}
          >
            <FastImage 
              source={{ uri: module.image }} 
              style={styles.cardImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: scale(18),
    marginBottom: verticalScale(16),
    color: '#000000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    marginBottom: verticalScale(16),
    borderRadius: scale(8), // radius-lg
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: ShadowColors['border-light'],
  },
  cardImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: scale(8), // radius-lg
  },
});

export default ModuleGrid;
