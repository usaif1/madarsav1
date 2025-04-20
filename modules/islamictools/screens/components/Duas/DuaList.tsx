import {FlatList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

// assets
import DailyZikr from '@/assets/duas/daily_zikr.svg';
import FoodAndDrink from '@/assets/duas/food_&_drink.svg';
import GoodEtiquette from '@/assets/duas/good_etiquette.svg';
import PraisingAllah from '@/assets/duas/praising_allah.svg';
import Washroom from '@/assets/duas/washroom.svg';
import House from '@/assets/duas/house.svg';

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
      renderItem={DuaCard}
      contentContainerStyle={{paddingBottom: 24}}
      ItemSeparatorComponent={Separator}
    />
  );
};

export default DuaList;

const DuaCard = ({item}: {item: any}) => {
  const IconComponent = item.icon;

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconWrapper}>
        <IconComponent width={28} height={28} />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      <Text style={styles.count}>{item.count} Duas</Text>
    </TouchableOpacity>
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
