import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Body2Regular, Body2Medium } from '@/components';
import { DateData } from 'react-native-calendars';
import { useThemeStore } from '@/globalStore';
import { gregorianToHijri } from '../../utils/dateUtils';
import { scale, verticalScale } from '@/theme/responsive';

interface CalendarDayProps {
  date: DateData;
  marking?: {
    selected?: boolean;
    marked?: boolean;
    dotColor?: string;
    holidayName?: string;
    hijriDate?: {
      day: string;
      month?: string;
      year?: string;
    };
    customStyles?: {
      container?: object;
      text?: object;
    };
  };
  state?: 'disabled' | 'today' | '';
  onPress?: (date: DateData) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ date, marking, state, onPress }) => {
  const { colors } = useThemeStore();
  
  const dateObj = new Date(date.timestamp);
  
  // The actual Hijri date will be passed via props from the parent component
  // This allows us to use the API data instead of calculating it directly
  const hijriDate = marking?.hijriDate || { day: '•' };
  
  const isSelected = marking?.selected;
  const isDisabled = state === 'disabled';
  const isToday = state === 'today';
  const isMarked = marking?.marked;
  const dotColor = marking?.dotColor || colors.primary.primary600;

  const handlePress = () => {
    if (onPress && !isDisabled) {
      onPress(date);
    }
  };

  // Responsive and theme-based styles
  const containerRadius = scale(8);
  const containerSize = scale(38);
  const dayContainerWidth = scale(38);
  const dayContainerHeight = verticalScale(38);
  const dotSize = scale(5);
  const dotRadius = dotSize / 2;

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerRadius,
        },
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.dayContainer,
          {
            width: dayContainerWidth,
            height: dayContainerHeight,
            borderRadius: containerRadius,
          },
          isSelected && { 
            backgroundColor: '#8A57DC', 
          },
          !isSelected && isToday && { 
            backgroundColor: '#C5ABED', 
          }
        ]}
      >
        <Body2Medium 
          color={isSelected ? 'white' : isDisabled ? 'secondary' : !isSelected && isToday ? 'white' : 'heading'}
          style={styles.gregorianText}
        >
          {date.day}
        </Body2Medium>
        <Body2Regular 
          color={isSelected ? 'white' : !isSelected && isToday ? 'white' : 'sub-heading'}
          style={styles.hijriText}
        >
          {hijriDate.day}
        </Body2Regular>
        {isMarked && (
          <View style={[styles.dotWrapper, { top: verticalScale(8), right: 4 }]}> 
            <View 
              style={[
                styles.dot, 
                { backgroundColor: dotColor, width: dotSize, height: dotSize, borderRadius: dotRadius }
              ]} 
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: scale(1),
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gregorianText: {
    fontSize: scale(14),
    lineHeight: scale(16),
  },
  hijriText: {
    lineHeight: scale(12),
    marginTop: verticalScale(2),
  },
  dotWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    marginHorizontal: scale(1),
  },
});

export default CalendarDay;