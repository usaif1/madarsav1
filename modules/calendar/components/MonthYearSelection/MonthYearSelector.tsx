// modules/calendar/components/MonthYearSelector/MonthYearSelector.tsx
import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
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

  const handleConfirm = () => {
    onConfirm(
      selectedMonth,
      selectedYear,
      getIslamicDate(selectedMonth, selectedYear)
    );
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
          {years.map(year => (
            <Pressable
              key={year}
              style={[
                styles.option,
                selectedYear === year && {
                  backgroundColor: colors.primary.primary100,
                },
              ]}
              onPress={() => setSelectedYear(year)}>
              <Body1Title2Bold
                color={selectedYear === year ? 'primary' : 'heading'}>
                {year}
              </Body1Title2Bold>
            </Pressable>
          ))}
        </View>

        {/* Month Column */}
        <View style={styles.column}>
          {months.map(month => (
            <Pressable
              key={month}
              style={[
                styles.option,
                selectedMonth === month && {
                  backgroundColor: colors.primary.primary100,
                },
              ]}
              onPress={() => setSelectedMonth(month)}>
              <Body1Title2Bold
                color={selectedMonth === month ? 'primary' : 'heading'}>
                {month}
              </Body1Title2Bold>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        style={[styles.confirmButton, {backgroundColor: colors.primary.primary600}]}
        onPress={handleConfirm}>
        <Body1Title2Bold color="white">Confirm</Body1Title2Bold>
      </Pressable>
    </View>
  );
};

export default MonthYearSelector;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
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
  },
  column: {
    flex: 1,
    padding: 10,
  },
  option: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  confirmButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});