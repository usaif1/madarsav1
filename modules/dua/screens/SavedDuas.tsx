import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Components
import { Body1Title2Bold, Body2Medium, Divider } from '@/components';
import { Header } from '@/components';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';

// Icons for categories
import DailyZikr from '@/assets/duas/daily_zikr.svg';
import MorningAzkar from '@/assets/duas/praising_allah.svg';
import EveningAzkar from '@/assets/duas/food_&_drink.svg';
import MosqueDuas from '@/assets/duas/washroom.svg';
import HomeDuas from '@/assets/duas/house.svg';
import RamadanDuas from '@/assets/duas/good_etiquette.svg';

// Mock data for saved duas
const savedDuasData = [
  {
    id: '1',
    title: 'Morning Azkar',
    description: 'Duas to read in morning',
    count: 2,
    icon: MorningAzkar,
  },
  {
    id: '2',
    title: 'Evening Azkar',
    description: 'Duas to read in evening',
    count: 6,
    icon: EveningAzkar,
  },
  {
    id: '3',
    title: 'Daily Zikr',
    description: 'Duas to read daily',
    count: 54,
    icon: DailyZikr,
  },
  {
    id: '4',
    title: 'Mosque Duas',
    description: 'Duas to read for mosque',
    count: 2,
    icon: MosqueDuas,
  },
  {
    id: '5',
    title: 'Home',
    description: 'Duas to read for home',
    count: 5,
    icon: HomeDuas,
  },
  {
    id: '6',
    title: 'Ramadan',
    description: 'Duas to read in ramadan',
    count: 23,
    icon: RamadanDuas,
  },
];

interface SavedDuaItemProps {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: React.ComponentType<any>;
}

const SavedDuas = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleDuaPress = (item: SavedDuaItemProps) => {
    navigation.navigate('DuaDetail', {
      title: item.title,
      count: item.count
    });
  };

  const renderDuaItem = ({ item }: { item: SavedDuaItemProps }) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => handleDuaPress(item)}
        activeOpacity={0.7}
      >
        <IconComponent width={38} height={38} />
        <View style={styles.textWrapper}>
          <Body1Title2Bold>{item.title}</Body1Title2Bold>
          <Divider height={4} />
          <Body2Medium color="sub-heading">{item.description}</Body2Medium>
        </View>
        
        <Body2Medium color="sub-heading">{item.count} Duas</Body2Medium>
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <Header title="Saved Duas" />
      
      {/* Ayah graphic at top */}
      <View style={styles.ayahContainer}>
        <FastImage 
          source={require('@/assets/duas/dua-ayah.png')} 
          style={styles.ayahImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      
      <FlatList
        data={savedDuasData}
        renderItem={renderDuaItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  ayahContainer: {
    width: scale(375),
    height: verticalScale(121),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF7',
  },
  ayahImage: {
    width: '100%',
    height: '100%',
  },
  listContainer: {
    paddingBottom: 24,
    paddingHorizontal: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 8,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  textWrapper: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68, // aligns with text start
  },
});

export default SavedDuas;
