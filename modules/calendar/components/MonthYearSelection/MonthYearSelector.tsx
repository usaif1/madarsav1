// modules/calendar/components/MonthYearSelector/MonthYearSelector.tsx
import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Pressable, FlatList, Dimensions} from 'react-native';
import {Body1Title2Bold, Title3Bold} from '@/components';

// store
import {useThemeStore} from '@/globalStore';

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
    if (yearListRef.current && initialYearIndex >= 0) {
      yearListRef.current.scrollToIndex({
        index: Math.max(0, initialYearIndex - 1),
        animated: false,
      });
    }
    
    if (monthListRef.current && initialMonthIndex >= 0) {
      monthListRef.current.scrollToIndex({
        index: Math.max(0, initialMonthIndex - 1),
        animated: false,
      });
    }
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
        selectedYear === item && styles.selectedOption,
      ]}
      onPress={() => setSelectedYear(item)}>
      <Body1Title2Bold
        color={selectedYear === item ? 'primary' : 'heading'}>
        {item}
      </Body1Title2Bold>
    </Pressable>
  );
  
  const renderMonthItem = ({item}: {item: string}) => (
    <Pressable
      style={[
        styles.option,
        selectedMonth === item && styles.selectedOption,
      ]}
      onPress={() => setSelectedMonth(item)}>
      <Body1Title2Bold
        color={selectedMonth === item ? 'primary' : 'heading'}>
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
            snapToInterval={styles.option.height}
            decelerationRate="fast"
            onScrollToIndexFailed={handleScrollError}
            contentContainerStyle={styles.scrollContent}
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
            snapToInterval={styles.option.height}
            decelerationRate="fast"
            onScrollToIndexFailed={handleScrollError}
            contentContainerStyle={styles.scrollContent}
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

// Get screen dimensions to calculate proper sizing
const {height: screenHeight} = Dimensions.get('window');
const ITEM_HEIGHT = 50; // Height of each option
const VISIBLE_ITEMS = 3; // Number of items to show at once

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '40%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectionArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  column: {
    flex: 1,
    padding: 10,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingVertical: ITEM_HEIGHT,
  },
  option: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
  },
});