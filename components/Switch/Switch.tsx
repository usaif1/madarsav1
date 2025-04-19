import React, {useState, useRef} from 'react';
import {Animated, StyleSheet, TouchableWithoutFeedback} from 'react-native';

const CustomSwitch = () => {
  const [isOn, setIsOn] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleSwitch = () => {
    const toValue = isOn ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setIsOn(!isOn);
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 18], // 36 - 18 = 18 (padding accounted)
  });

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', '#4cd137'],
  });

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <Animated.View style={[styles.container, {backgroundColor}]}>
        <Animated.View style={[styles.circle, {transform: [{translateX}]}]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 20,
    borderRadius: 20,
    padding: 2,
    justifyContent: 'center',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
});

export default CustomSwitch;
