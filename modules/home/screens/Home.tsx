import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
} from 'react-native';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width / 4; // 4 items per row

type ToolItem = {
  title: string;
  key: string;
  to?: string;
};

const TOOLS: ToolItem[] = [
  {key: 'duas', title: "Dua's", to: 'dua'},
  // {key: 'hadith', title: 'Hadith'},
  {key: 'user', title: 'User', to: 'user'},
  {key: 'tasbih', title: 'Tasbih', to: 'tasbih'},
  {key: 'names', title: '99 Names', to: 'names'},
  {key: 'calendar', title: 'Calendar', to: 'calendar'},
  {key: 'qiblah', title: 'Qiblah', to: 'compass'},
  // {key: 'gallery', title: 'Gallery'},
];

const IslamicTools: React.FC = () => {
  const navigation = useNavigation();

  const renderItem = ({item}: {item: ToolItem}) => (
    <Pressable
      onPress={() => {
        if (item.to) {
          navigation.navigate(item.to);
        }
      }}
      style={styles.item}>
      <View style={styles.iconPlaceholder} />
      <Text style={styles.title}>{item.title}</Text>
    </Pressable>
  );

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle={'dark-content'} />
      <Text style={styles.heading}>Islamic Tools</Text>
      <FlatList
        data={TOOLS}
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

export default IslamicTools;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    margin: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  grid: {
    justifyContent: 'center',
  },
  item: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    marginBottom: 24,
  },
  iconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0D7F7', // light purple background
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
  },
});
