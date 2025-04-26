// modules/calendar/components/MonthYearSelector/MonthYearSelector.tsx
import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Pressable, FlatList} from 'react-native';
import {Body1Title2Bold, Title3Bold} from '@/components';

// store
import {useThemeStore} from '@/globalStore';
import { ShadowColors } from '@/theme/shadows';

interface MonthYearSelectorProps {
  initialMonth: string;
  initialYear: string;
  onConfirm: (month: string, year: string, islamicDate: string) => void;
  onClose: () => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Get current year and add/subtract some years
const currentYear = new Date().getFullYear();
const years = Array.from({length: 7}, (_, i) => (currentYear - 3 + i).toString());

// Sample mapping function for Islamic months (simplified)
const getIslamicDate = (month: string, year: string) => {
  // This would be replaced with a proper conversion library
  return 'Jumada al-Awwal, 1446 AH';
};

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  initialMonth,
  initialYear,
  onConfirm,
  onClose,
}) => {
  const {colors} = useThemeStore();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [hasChanged, setHasChanged] = useState(false);
  
  const yearListRef = useRef<FlatList>(null);
  const monthListRef = useRef<FlatList>(null);
  
  // Calculate initial indices for scrolling
  const initialYearIndex = years.findIndex(year => year === initialYear);
  const initialMonthIndex = months.findIndex(month => month === initialMonth);
  
  // Monitor changes to selection
  useEffect(() => {
    setHasChanged(selectedMonth !== initialMonth || selectedYear !== initialYear);
  }, [selectedMonth, selectedYear, initialMonth, initialYear]);
  
  // Initial scroll to position
  useEffect(() => {
    // Use setTimeout to ensure the FlatList has rendered before scrolling
    setTimeout(() => {
      if (yearListRef.current && initialYearIndex >= 0) {
        yearListRef.current.scrollToOffset({
          offset: (initialYearIndex - 1) * ITEM_HEIGHT,
          animated: false,
        });
      }
      
      if (monthListRef.current && initialMonthIndex >= 0) {
        monthListRef.current.scrollToOffset({
          offset: (initialMonthIndex - 1) * ITEM_HEIGHT,
          animated: false,
        });
      }
    }, 100);
  }, [initialYearIndex, initialMonthIndex]);

  const handleConfirm = () => {
    if (hasChanged) {
      onConfirm(
        selectedMonth,
        selectedYear,
        getIslamicDate(selectedMonth, selectedYear)
      );
    }
  };
  
  const renderYearItem = ({item}: {item: string}) => (
    <Pressable
      style={[
        styles.option,
        selectedYear === item && {backgroundColor: ShadowColors['border-light']},
      ]}
      onPress={() => {
        setSelectedYear(item);
        if (yearListRef.current) {
          const index = years.findIndex(year => year === item);
          yearListRef.current.scrollToOffset({
            offset: (index - 1) * ITEM_HEIGHT,
            animated: true,
          });
        }
      }}>
      <Body1Title2Bold
        color={selectedYear === item ? 'heading' : 'secondary'}>
        {item}
      </Body1Title2Bold>
    </Pressable>
  );
  
  const renderMonthItem = ({item}: {item: string}) => (
    <Pressable
      style={[
        styles.option,
        selectedMonth === item && {backgroundColor: ShadowColors['border-light']},
      ]}
      onPress={() => {
        setSelectedMonth(item);
        if (monthListRef.current) {
          const index = months.findIndex(month => month === item);
          monthListRef.current.scrollToOffset({
            offset: (index - 1) * ITEM_HEIGHT,
            animated: true,
          });
        }
      }}>
      <Body1Title2Bold
        color={selectedMonth === item ? 'heading' : 'secondary'}>
        {item}
      </Body1Title2Bold>
    </Pressable>
  );
  
  const handleScrollError = (error: any) => {
    console.log('Scroll to index failed:', error);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title3Bold>Change year</Title3Bold>
        <Pressable onPress={onClose} hitSlop={10}>
          <Title3Bold>✕</Title3Bold>
        </Pressable>
      </View>

      <View style={styles.selectionArea}>
        {/* Year Column */}
        <View style={styles.column}>
          <FlatList
            ref={yearListRef}
            data={years}
            renderItem={renderYearItem}
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onScrollToIndexFailed={handleScrollError}
            contentContainerStyle={styles.scrollContent}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
          />
        </View>

        {/* Month Column */}
        <View style={styles.column}>
          <FlatList
            ref={monthListRef}
            data={months}
            renderItem={renderMonthItem}
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onScrollToIndexFailed={handleScrollError}
            contentContainerStyle={styles.scrollContent}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
          />
        </View>
      </View>

      <Pressable
        style={[
          styles.confirmButton, 
          hasChanged 
            ? {backgroundColor: colors.primary.primary600}
            : styles.disabledButton
        ]}
        onPress={handleConfirm}
        disabled={!hasChanged}>
        <Body1Title2Bold color={hasChanged ? "white" : "heading"}>Confirm</Body1Title2Bold>
      </Pressable>
    </View>
  );
};

export default MonthYearSelector;

const ITEM_HEIGHT = 50; // Height of each option

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%', // Increased from 40% to 50%
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingRight: 20, 
    paddingLeft: 20,  
    marginBottom: 20,
    borderBottomWidth: 1, 
    borderBottomColor: '#F5F5F5',
    borderTopLeftRadius: 8, 
    borderTopRightRadius: 8, 
  },
  selectionArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    height: ITEM_HEIGHT * 3,
  },
  column: {
    flex: 1,
    padding: 0,
    height: ITEM_HEIGHT * 3,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  option: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 0, 
  },
  confirmButton: {
    padding: 15,
    borderRadius: 60,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
  },
});