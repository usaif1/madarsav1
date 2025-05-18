import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Bold } from '@/components/Typography/Typography';
import { ShadowColors } from '@/theme/shadows';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');
const CARD_WIDTH = scale(163.5); // Width of each card
const CARD_HEIGHT = scale(184); // Height of each card
const CARD_GAP = scale(12); // Gap between cards in the same row

interface ModuleItem {
  id: string;
  image: any;
  route: string;
}

const modules: ModuleItem[] = [
  {
    id: 'quran',
    image: require('@/assets/home/quran-card.png'),
    route: 'quran',
  },
  {
    id: 'maktab',
    image: require('@/assets/home/maktab-card.png'),
    route: 'maktab',
  },
  {
    id: 'qiblah',
    image: require('@/assets/home/qiblah-card.png'),
    route: 'compass',
  },
  {
    id: 'tasbih',
    image: require('@/assets/home/tasbih-card.png'),
    route: 'tasbih',
  },
  {
    id: 'hadith',
    image: require('@/assets/home/hadith-card.png'),
    route: 'hadith',
  },
  {
    id: 'zakat',
    image: require('@/assets/home/zakat-card.png'),
    route: 'zakat',
  },
];



type RootStackParamList = {
  hadith: undefined;
  names: undefined;
  tasbih: undefined;
  compass: undefined;
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
        // Redirect maktab to 99names
        navigation.navigate('names');
        break;
      case 'tasbih':
        navigation.navigate('tasbih');
        break;
      case 'compass':
        navigation.navigate('compass');
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
            <Image 
              source={module.image} 
              style={styles.cardImage} 
              resizeMode="cover"
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
