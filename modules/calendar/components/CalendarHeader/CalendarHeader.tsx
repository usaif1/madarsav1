// modules/calendar/components/CalendarHeader/CalendarHeader.tsx
import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { toHijri } from 'hijri-converter';

// components
import {BackButton} from '@/components';
import {Title3Bold, Body2Medium} from '@/components';
import MonthYearSelector from '../MonthYearSelection/MonthYearSelector';

// icons
import DownArrow from '@/assets/calendar/down-arrow.svg'; // You'll need to create/add this SVG

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
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({onBack, onMonthYearChange}) => {
  const insets = useSafeAreaInsets();
  const {colors, shadows} = useThemeStore();

  // Get current date values
  const now = new Date();
  const initialMonth = monthNames[now.getMonth()];
  const initialYear = now.getFullYear().toString();
  // Compute initial Islamic date
  const toInitialIslamicDate = () => {
    const hijri = toHijri(now.getFullYear(), now.getMonth() + 1, 1);
    const hijriMonthNames = [
      'Muharram', 'Safar', "Rabi' al-awwal", "Rabi' al-thani",
      'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha‘ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi‘dah', 'Dhu al-Hijjah'
    ];
    const hijriMonth = hijriMonthNames[hijri.hm - 1];
    return `${hijriMonth}, ${hijri.hy} AH`;
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [islamicDate, setIslamicDate] = useState(toInitialIslamicDate());

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleMonthYearConfirm = (month: string, year: string, _islamicDate: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    // Map month name to JS month index (0-based)
    const monthIndex = monthNames.indexOf(month);
    // Use 1st of selected month/year for conversion
    const gregorianYear = parseInt(year, 10);
    const gregorianMonth = monthIndex + 1; // toHijri expects 1-based month
    const hijri = toHijri(gregorianYear, gregorianMonth, 1);
    // Format: Month, Year AH
    const hijriMonthNames = [
      'Muharram', 'Safar', "Rabi' al-awwal", "Rabi' al-thani",
      'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha‘ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi‘dah', 'Dhu al-Hijjah'
    ];
    const hijriMonth = hijriMonthNames[hijri.hm - 1];
    const hijriYear = hijri.hy;
    setIslamicDate(`${hijriMonth}, ${hijriYear} AH`);
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
            <DownArrow width={scale(16)} height={scale(16)} fill={textColor} style={styles.arrow} />
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
        style={styles.modal}>
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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});