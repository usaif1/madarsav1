// modules/calendar/components/CalendarHeader/CalendarHeader.tsx
import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

// components
import {BackButton} from '@/components';
import {Title3Bold, Body2Medium} from '@/components';
import MonthYearSelector from '../MonthYearSelection/MonthYearSelector';

// icons
import DownArrow from '@/assets/calendar/down-arrow.svg'; // You'll need to create/add this SVG

interface CalendarHeaderProps {
  onBack?: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({onBack}) => {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('February');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [islamicDate, setIslamicDate] = useState('Jumada al-Awwal, 1446 AH');

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleMonthYearConfirm = (month: string, year: string, islamicDate: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setIslamicDate(islamicDate);
    setModalVisible(false);
  };

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
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
          <Title3Bold color="white">
            {selectedMonth} {selectedYear}
          </Title3Bold>
          <DownArrow width={16} height={16} fill="#FFFFFF" style={styles.arrow} />
        </View>
        <Body2Medium color="white" style={styles.subtitle}>
          {islamicDate}
        </Body2Medium>
      </Pressable>

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
    backgroundColor: '#411B7F',
    paddingBottom: 12,
  },
  backButton: {
    position: 'absolute',
    left: 18,
    zIndex: 1,
    top: 12,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginLeft: 4,
  },
  subtitle: {
    marginTop: 2,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});