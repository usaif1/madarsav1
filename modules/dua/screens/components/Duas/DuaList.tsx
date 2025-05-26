import {FlatList, StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// assets
import DailyZikr from '@/assets/duas/daily_zikr.svg';
import FoodAndDrink from '@/assets/duas/food_&_drink.svg';
import GoodEtiquette from '@/assets/duas/good_etiquette.svg';
import PraisingAllah from '@/assets/duas/praising_allah.svg';
import Washroom from '@/assets/duas/washroom.svg';
import House from '@/assets/duas/house.svg';
import BookmarkPrimary from '@/assets/duas/bookmark-primary.svg';
import {Body1Title2Bold, Body2Medium, Divider} from '@/components';

const dailyDuasData = [
  {
    id: '1',
    title: 'Daily Zikr',
    description: 'Duas to read in morning',
    count: 2,
    icon: DailyZikr, // use your icon system name or asset ref
  },
  {
    id: '2',
    title: 'Praising Allah',
    description: 'Duas to read in evening',
    count: 6,
    icon: PraisingAllah,
  },
  {
    id: '3',
    title: 'Food and Drinks',
    description: 'Duas to read daily',
    count: 54,
    icon: FoodAndDrink,
  },
  {
    id: '4',
    title: 'House',
    description: 'Duas to read for home',
    count: 5,
    icon: House,
  },
  {
    id: '5',
    title: 'Washroom',
    description: 'Duas to read for mosque',
    count: 2,
    icon: Washroom,
    bookmarked: true, // optional if you use this
  },
  {
    id: '6',
    title: 'Good Etiquettes',
    description: 'Duas to read in ramadan',
    count: 23,
    icon: GoodEtiquette,
  },
];

const DuaList = () => {
  return (
    <FlatList
      data={dailyDuasData}
      keyExtractor={item => item.id}
      renderItem={({item}) => <DuaCard item={item} />}
      contentContainerStyle={{paddingBottom: 24, paddingHorizontal: 18}}
      ItemSeparatorComponent={Separator}
    />
  );
};

export default DuaList;

interface DuaItemProps {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: React.ComponentType<any>;
  bookmarked?: boolean;
}

const DuaCard = ({item}: {item: DuaItemProps}) => {
  const IconComponent = item.icon;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handlePress = () => {
    navigation.navigate('DuaDetail', {
      title: item.title,
      count: item.count
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <IconComponent width={38} height={38} />
      <View style={styles.textWrapper}>
        <Body1Title2Bold>{item.title}</Body1Title2Bold>
        <Divider height={4} />
        <Body2Medium color="sub-heading">{item.description}</Body2Medium>
      </View>
      
      <View style={styles.rightContainer}>
        {item.bookmarked && <BookmarkPrimary width={16} height={16} style={styles.bookmark} />}
        <Body2Medium color="sub-heading">{item.count} Duas</Body2Medium>
      </View>
    </TouchableOpacity>
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 8,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE', // light purple background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bookmark: {
    marginRight: 4,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
    color: '#111827',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  count: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68, // aligns with text start
  },
});
