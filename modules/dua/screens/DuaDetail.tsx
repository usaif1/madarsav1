import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Components
import { Body1Title2Bold, Body2Medium, Divider } from '@/components';
import BookmarkPrimary from '@/assets/duas/bookmark-primary.svg';
import { scale, verticalScale } from '@/theme/responsive';
import {Header} from '@/components';

// Mock data for duas within a category
const mockDuasInCategory = [
  {
    id: '1',
    title: 'Everyday Duas',
    bookmarked: false,
    count: 2,
  },
  {
    id: '2',
    title: 'Strengthen your Imaan',
    bookmarked: false,
    count: 4,
  },
  {
    id: '3',
    title: 'To be a pious Muslim',
    bookmarked: true,
    count: 5,
  },
  {
    id: '4',
    title: 'To make us practising Muslims',
    bookmarked: false,
    count: 2,
  },
  {
    id: '5',
    title: 'After Waking Up',
    bookmarked: false,
    count: 3,
  },
  {
    id: '6',
    title: 'Before Eating',
    bookmarked: false,
    count: 8,
  },
];

interface DuaItemProps {
  id: string;
  title: string;
  bookmarked?: boolean;
  count: number;
}

const DuaDetail = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { title, count } = route.params as { title: string; count: number };

  const handleDuaPress = (item: DuaItemProps) => {
    navigation.navigate('DuaContent', {
      title: item.title,
      count: item.count,
      id: item.id
    });
  };

  const renderDuaItem = ({ item }: { item: DuaItemProps }) => (
    <TouchableOpacity 
      style={styles.duaItem}
      onPress={() => handleDuaPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.textContainer}>
        <Body1Title2Bold>{item.title}</Body1Title2Bold>
      </View>
      <View style={styles.rightContainer}>
        {item.bookmarked && (
          <BookmarkPrimary width={16} height={16} style={styles.bookmarkIcon} />
        )}
        <Body2Medium color="sub-heading">{item.count} Duas</Body2Medium>
      </View>
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <Header title={title}  />
      <FlatList
        data={mockDuasInCategory}
        renderItem={renderDuaItem}
        keyExtractor={(item) => item.id}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#8A57DC',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  duaItem: {
    width: scale(375),
    height: verticalScale(52),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
    height: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: scale(80),
  },
  bookmarkIcon: {
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});

export default DuaDetail;
