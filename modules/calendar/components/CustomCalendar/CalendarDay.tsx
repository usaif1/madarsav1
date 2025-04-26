import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Body2Regular, Body2Medium} from '@/components';

// store
import {useThemeStore} from '@/globalStore';

// utils
import {gregorianToHijri} from '../../utils/dateUtils';

interface CalendarDayProps {
  date: {
    day: number;
    month: number;
    year: number;
    timestamp: number;
  };
  marking?: {
    selected?: boolean;
    marked?: boolean;
    dotColor?: string;
    selectedColor?: string;
  };
  state?: 'disabled' | 'today' | '';
}

const CalendarDay: React.FC<CalendarDayProps> = ({date, marking, state}) => {
  const {colors} = useThemeStore();
  
  // Convert to Hijri date to get the Islamic calendar day
  const dateObj = new Date(date.timestamp);
  const hijriDate = gregorianToHijri(dateObj);
  
  const isSelected = marking?.selected;
  const isDisabled = state === 'disabled';
  const isToday = state === 'today';
  const isMarked = marking?.marked;
  
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dayContainer,
          isSelected && {backgroundColor: colors.primary.primary500, borderRadius: 8},
          !isSelected && isToday && {backgroundColor: colors.primary.primary300, borderRadius: 8}
        ]}>
        <Body2Medium color={isSelected ? 'white' : isDisabled ? 'secondary' : 'heading'}>
          {date.day}
        </Body2Medium>
        <Body2Regular color={isSelected ? 'white' : 'sub-heading'}>
          {hijriDate.day}
        </Body2Regular>
        
        {isMarked && !isSelected && (
          <View 
            style={[
              styles.dot, 
              {backgroundColor: marking?.dotColor || colors.primary.primary600}
            ]} 
          />
        )}
      </View>
    </View>
  );
};

export default CalendarDay;

const styles = StyleSheet.create({
  container: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContainer: {
    width: 36,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dot: {
    width: 5,
  height: 5,
    borderRadius: 2,
    position: 'absolute',
    bottom: 2,
  },
});
