import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Bold } from '@/components/Typography/Typography';

// Import SVG cards
import QuranCard from '@/assets/home/quran.svg';
import MaktabCard from '@/assets/home/maktab-card.svg';
import QiblahCard from '@/assets/home/qiblah.svg';
import TasbihCard from '@/assets/home/tasbih.svg';
import HadithCard from '@/assets/home/hadith.svg';
import ZakatCard from '@/assets/home/zakat.svg';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - scale(48)) / 2; // 2 cards per row with margins

interface ModuleItem {
  id: string;
  card: React.FC<any>;
  route: string;
}

const modules: ModuleItem[] = [
  {
    id: 'quran',
    card: QuranCard,
    route: 'quran',
  },
  {
    id: 'maktab',
    card: MaktabCard,
    route: 'maktab',
  },
  {
    id: 'qiblah',
    card: QiblahCard,
    route: 'compass',
  },
  {
    id: 'tasbih',
    card: TasbihCard,
    route: 'tasbih',
  },
  {
    id: 'hadith',
    card: HadithCard,
    route: 'hadith',
  },
  {
    id: 'zakat',
    card: ZakatCard,
    route: 'zakat',
  },
];

interface ModuleGridProps {
  title?: string;
}

const ModuleGrid: React.FC<ModuleGridProps> = ({ title = 'Islamic Modules' }) => {
  const navigation = useNavigation<any>();

  const handleModulePress = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      {title && <Body1Title2Bold style={styles.title}>{title}</Body1Title2Bold>}
      
      <View style={styles.grid}>
        {modules.map((module) => (
          <TouchableOpacity
            key={module.id}
            onPress={() => handleModulePress(module.route)}
            activeOpacity={0.8}
            style={styles.cardContainer}
          >
            <module.card width={CARD_WIDTH} height={verticalScale(160)} />
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
  },
});

export default ModuleGrid;
