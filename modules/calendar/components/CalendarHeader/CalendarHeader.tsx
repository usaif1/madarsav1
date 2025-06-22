// modules/calendar/components/CalendarHeader/CalendarHeader.tsx
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { toHijri } from 'hijri-converter';

// components
import {BackButton} from '@/components';
import {Title3Bold, Body2Medium} from '@/components';
import MonthYearSelector from '../MonthYearSelection/MonthYearSelector';

// icons
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

// theme
import {useThemeStore} from '@/globalStore';
import {scale, verticalScale} from '@/theme/responsive';

// Month names for mapping
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarHeaderProps {
  onBack?: () => void;
  onMonthYearChange?: (month: string, year: string) => void;
  currentMonth?: string;
  currentYear?: string;
  selectedDate?: Date; // Add selected date to get accurate Hijri date
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({onBack, onMonthYearChange, currentMonth, currentYear, selectedDate}) => {
  const insets = useSafeAreaInsets();
  const {colors, shadows} = useThemeStore();

  // Get current date values
  const now = new Date();
  const initialMonth = currentMonth || monthNames[now.getMonth()];
  const initialYear = currentYear || now.getFullYear().toString();
  // Compute Islamic date based on the actual selected date, not just the Gregorian month
  const toSelectedDateIslamicDate = (dateToUse?: Date) => {
    const targetDate = dateToUse || selectedDate || now;
    
    const hijri = toHijri(
      targetDate.getFullYear(), 
      targetDate.getMonth() + 1, // toHijri expects 1-based month
      targetDate.getDate()
    );
    
    const hijriMonthNames = [
      'Muharram', 'Safar', "Rabi' al-awwal", "Rabi' al-thani",
      'Jumada al-awwal', 'Jumada al-thani', 'Rajab', "Sha'ban",
      'Ramadan', 'Shawwal', "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ];
    const hijriMonth = hijriMonthNames[hijri.hm - 1];
    return `${hijriMonth}, ${hijri.hy} AH`;
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [islamicDate, setIslamicDate] = useState(toSelectedDateIslamicDate());
  
  // Update Islamic date based on priority: current month first, then selected date if in same month
  useEffect(() => {
    if (currentMonth && currentYear) {
      // Always update the Gregorian month/year display first
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear);
      
      const currentMonthIndex = monthNames.indexOf(currentMonth);
      const currentYearNum = parseInt(currentYear, 10);
      const firstDayOfCurrentMonth = new Date(currentYearNum, currentMonthIndex, 1);
      
      // Check if selectedDate is in the same month as the currently displayed month
      const isSelectedDateInCurrentMonth = selectedDate && 
        selectedDate.getMonth() === currentMonthIndex && 
        selectedDate.getFullYear() === currentYearNum;
      
      if (isSelectedDateInCurrentMonth) {
        // Selected date is in current month - show Islamic date for selected date
        const newIslamicDate = toSelectedDateIslamicDate(selectedDate);
        console.log('📅 CalendarHeader: Selected date', selectedDate.toDateString(), 'is in current month', currentMonth, '→ Islamic:', newIslamicDate);
        setIslamicDate(newIslamicDate);
      } else {
        // Selected date is NOT in current month OR no date selected - show Islamic date for 1st of current month
        const newIslamicDate = toSelectedDateIslamicDate(firstDayOfCurrentMonth);
        console.log('📅 CalendarHeader: Using first day of', currentMonth, currentYear, '→ Islamic:', newIslamicDate);
        if (selectedDate && !isSelectedDateInCurrentMonth) {
          console.log('   → Selected date', selectedDate.toDateString(), 'is in different month, using current month instead');
        }
        setIslamicDate(newIslamicDate);
      }
    } else if (selectedDate) {
      // Fallback: when no currentMonth/currentYear but selectedDate available
      const newIslamicDate = toSelectedDateIslamicDate(selectedDate);
      console.log('📅 CalendarHeader: No current month, using selected date', selectedDate.toDateString(), '→ Islamic:', newIslamicDate);
      setIslamicDate(newIslamicDate);
    }
  }, [selectedDate, currentMonth, currentYear]);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleMonthYearConfirm = (month: string, year: string, _islamicDate: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    
    // When month/year changes from selector, we'll update the Islamic date
    // based on the first day of the selected month, but it will be overridden
    // when a specific date is selected within that month
    const monthIndex = monthNames.indexOf(month);
    const firstDayOfMonth = new Date(parseInt(year, 10), monthIndex, 1);
    setIslamicDate(toSelectedDateIslamicDate(firstDayOfMonth));
    
    setModalVisible(false);
    if (onMonthYearChange) onMonthYearChange(month, year);
  };

  // Use semantic color token for typography components
  const textColor = 'white';

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.primary.primary800, paddingTop: insets.top, paddingBottom: verticalScale(12) }, shadows.md1]}>
      <View style={styles.headerContent}>
        {/* Left: Back button */}
        <Pressable
          onPress={onBack}
          hitSlop={10}
          style={styles.backButton}>
          <BackButton />
        </Pressable>

        {/* Center: Title with dropdown */}
        <Pressable onPress={toggleModal} style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Title3Bold color={textColor}>
              {selectedMonth} {selectedYear}
            </Title3Bold>
            <CdnSvg 
              path={DUA_ASSETS.CALENDAR_DOWN_ARROW} 
              width={scale(16)} 
              height={scale(16)} 
              fill={textColor} 
              style={styles.arrow} 
            />
          </View>
          <Body2Medium color={textColor} style={styles.subtitle}>
            {islamicDate}
          </Body2Medium>
        </Pressable>
        {/* Empty view for balance */}
        <View style={styles.backButton} />
      </View>

      {/* Month/Year Selector Modal */}
      <Modal
        isVisible={isModalVisible}
        backdropOpacity={0.5}
        onBackdropPress={toggleModal}
        style={styles.centeredModal}>
        <MonthYearSelector
          initialMonth={selectedMonth}
          initialYear={selectedYear}
          onConfirm={handleMonthYearConfirm}
          onClose={toggleModal}
        />
      </Modal>
    </View>
  );
};

export default CalendarHeader;

const styles = StyleSheet.create({
  headerContainer: {
    // backgroundColor and paddingTop/paddingBottom are set inline for theme and responsive
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(12),
  },
  backButton: {
    width: scale(40),
    paddingLeft: scale(18),
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginLeft: scale(4),
  },
  subtitle: {
    marginTop: verticalScale(2),
  },
  centeredModal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
});