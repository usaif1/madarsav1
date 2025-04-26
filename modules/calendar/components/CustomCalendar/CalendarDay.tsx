import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Body2Regular, Body2Medium } from '@/components';
import { DateData } from 'react-native-calendars';
import { useThemeStore } from '@/globalStore';
import { gregorianToHijri } from '../../utils/dateUtils';

interface CalendarDayProps {
  date: DateData;
  marking?: {
    selected?: boolean;
    marked?: boolean;
    dotColor?: string;
    holidayName?: string;
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
  const hijriDate = gregorianToHijri(dateObj);
  
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
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.dayContainer,
          isSelected && { 
            backgroundColor: colors.primary.primary600, 
            borderRadius: 8 
          },
          !isSelected && isToday && { 
            backgroundColor: colors.primary.primary300, 
            borderRadius: 8 
          }
        ]}
      >
        <Body2Medium 
          color={isSelected ? 'white' : isDisabled ? 'secondary' : 'heading'}
          style={styles.gregorianText}
        >
          {date.day}
        </Body2Medium>
        <Body2Regular 
          color={isSelected ? 'white' : 'sub-heading'}
          style={styles.hijriText}
        >
          {hijriDate.day}
        </Body2Regular>
        {isMarked && (
          <View style={styles.dotWrapper}> 
            <View 
              style={[
                styles.dot, 
                { backgroundColor: dotColor }
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
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
  },
  dayContainer: {
    width: 36,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  gregorianText: {
    fontSize: 14,
    lineHeight: 16,
  },
  hijriText: {
    lineHeight: 12,
    marginTop: 2,
  },
  dotWrapper: {
    position: 'absolute',
    right: 0,
    top: 12, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginHorizontal: 1,
  },
});

export default CalendarDay;