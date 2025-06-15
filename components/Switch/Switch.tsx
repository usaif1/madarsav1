import React, {useState, useRef, useEffect} from 'react';
import {Animated, StyleSheet, TouchableWithoutFeedback, ViewStyle} from 'react-native';

interface SwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const CustomSwitch = ({
  value = false,
  onValueChange,
  disabled = false,
  style,
}: SwitchProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;
  
  // Update when value prop changes
  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
      Animated.timing(animation, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [value]);

  const toggleSwitch = () => {
    if (disabled) return;
    
    const newValue = !internalValue;
    setInternalValue(newValue);
    
    Animated.timing(animation, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (onValueChange) {
      onValueChange(newValue);
    }
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
    <TouchableWithoutFeedback onPress={toggleSwitch} disabled={disabled}>
      <Animated.View 
        style={[
          styles.container, 
          {backgroundColor}, 
          disabled && styles.disabled,
          style
        ]}
      >
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
  disabled: {
    opacity: 0.6,
  },
});

export default CustomSwitch;
