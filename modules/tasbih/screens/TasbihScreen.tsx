import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const CIRCLE_SIZE = 50;
const INITIAL_LIST1 = ['A', 'B', 'C', 'D'];
const INITIAL_LIST2 = ['E', 'F', 'G'];

const ShiftingCircles: React.FC = () => {
  const [list1, setList1] = useState(INITIAL_LIST1);
  const [list2, setList2] = useState(INITIAL_LIST2);
  const [counter, setCounter] = useState(0); // for new items

  const handlePress = () => {
    if (list1.length === 0) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const movedItem = list1[list1.length - 1];
    const newList1 = [
      String.fromCharCode(88 + (counter % 26)),
      ...list1.slice(0, -1),
    ];
    const newList2 = [movedItem, ...list2.slice(0, -1)];

    setList1(newList1);
    setList2(newList2);
    setCounter(counter + 1);
  };

  const renderCircle = (item: string, index: number) => (
    <View key={item + index} style={styles.circle}>
      <Text style={styles.label}>{item}</Text>
    </View>
  );

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <FlatList
        horizontal
        data={list1}
        renderItem={({item, index}) => renderCircle(item, index)}
        keyExtractor={(item, index) => 'L1-' + index + item}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.separator} />
      <FlatList
        horizontal
        data={list2}
        renderItem={({item, index}) => renderCircle(item, index)}
        keyExtractor={(item, index) => 'L2-' + index + item}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    gap: 12,
    paddingHorizontal: 20,
  },
  separator: {
    height: 32,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#8A57DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default ShiftingCircles;
