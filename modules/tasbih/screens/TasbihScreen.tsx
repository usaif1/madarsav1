import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  FlatList,
  UIManager,
  Platform,
  Animated,
  LayoutAnimation,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const CIRCLE_SIZE = 30;
const INITIAL_LIST1 = ['A', 'B', 'C', 'D'];
const INITIAL_LIST2 = ['E', 'F', 'G'];
const MAX_LIST2_LENGTH = 3;

const ShiftingCircles: React.FC = () => {
  const [list1, setList1] = useState(INITIAL_LIST1);
  const [list2, setList2] = useState(INITIAL_LIST2);
  const [counter, setCounter] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [movingItem, setMovingItem] = useState<string | null>(null);

  const animatedX = useRef(new Animated.Value(0)).current;
  const rightListTranslate = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (list1.length === 0 || isAnimating) return;

    const movedItem = list1[list1.length - 1];
    setMovingItem(movedItem);
    setIsAnimating(true);

    animatedX.setValue(0);
    rightListTranslate.setValue(0);

    Animated.parallel([
      Animated.timing(animatedX, {
        toValue: 120,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rightListTranslate, {
        toValue: 40,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      const newList1 = [
        String.fromCharCode(88 + (counter % 26)),
        ...list1.slice(0, -1),
      ];
      let newList2 = [movedItem, ...list2];
      if (newList2.length > MAX_LIST2_LENGTH) {
        newList2 = newList2.slice(0, MAX_LIST2_LENGTH);
      }

      setList1(newList1);
      setList2(newList2);
      setCounter(counter + 1);
      setMovingItem(null);
      animatedX.setValue(0);
      rightListTranslate.setValue(0);
      setIsAnimating(false);
    });
  };

  const renderCircle = (item: string, index: number) => (
    <View key={item + index} style={styles.circle}>
      <Text style={styles.label}>{item}</Text>
    </View>
  );

  const getDisplayList2 = () => {
    if (isAnimating) {
      return list2.slice(0, MAX_LIST2_LENGTH - 1);
    }
    return list2.slice(0, MAX_LIST2_LENGTH);
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.rowContainer}>
        <FlatList
          horizontal
          data={list1.filter(item => item !== movingItem)}
          renderItem={({item, index}) => renderCircle(item, index)}
          keyExtractor={(item, index) => 'L1-' + index + item}
          contentContainerStyle={styles.list}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.verticalSeparator} />
        <Animated.View style={{transform: [{translateX: rightListTranslate}]}}>
          <FlatList
            horizontal
            data={getDisplayList2()}
            renderItem={({item, index}) => renderCircle(item, index)}
            keyExtractor={(item, index) => 'L2-' + index + item}
            contentContainerStyle={styles.list}
            showsHorizontalScrollIndicator={false}
          />
        </Animated.View>
      </View>

      {movingItem && (
        <Animated.View
          style={[
            styles.circle,
            styles.movingCircle,
            {
              transform: [{translateX: animatedX}],
            },
          ]}>
          <Text style={styles.label}>{movingItem}</Text>
        </Animated.View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  list: {
    gap: 12,
    paddingHorizontal: 10,
  },
  verticalSeparator: {
    width: 32,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#8A57DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  movingCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -CIRCLE_SIZE / 2,
    marginLeft: -CIRCLE_SIZE / 2,
    zIndex: 2,
  },
  label: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ShiftingCircles;
