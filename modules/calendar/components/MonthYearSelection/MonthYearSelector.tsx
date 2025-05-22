// modules/calendar/components/MonthYearSelector/MonthYearSelector.tsx
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {Body1Title2Bold, Title3Bold} from '@/components';

// store
import {useThemeStore} from '@/globalStore';
import {ShadowColors} from '@/theme/shadows';

interface MonthYearSelectorProps {
  initialMonth: string;
  initialYear: string;
  onConfirm: (month: string, year: string, islamicDate: string) => void;
  onClose: () => void;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const currentYear = new Date().getFullYear();
const years = Array.from({length: 7}, (_, i) =>
  (currentYear - 3 + i).toString(),
);

const getIslamicDate = () => 'Jumada al-Awwal, 1446 AH'; // placeholder

const ITEM_HEIGHT = 50;

/* ───────────────────────────────────────────── */

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

  const monthRef = useRef<FlatList>(null);
  const yearRef = useRef<FlatList>(null);

  const initialMonthIndex = months.findIndex(m => m === initialMonth);
  const initialYearIndex = years.findIndex(y => y === initialYear);

  /* mark if user changed selection */
  useEffect(() => {
    setHasChanged(
      selectedMonth !== initialMonth || selectedYear !== initialYear,
    );
  }, [selectedMonth, selectedYear, initialMonth, initialYear]);

  /* scroll to initial */
  useEffect(() => {
    setTimeout(() => {
      yearRef.current?.scrollToOffset({
        offset: Math.max(0, initialYearIndex - 1) * ITEM_HEIGHT,
        animated: false,
      });
      monthRef.current?.scrollToOffset({
        offset: Math.max(0, initialMonthIndex - 1) * ITEM_HEIGHT,
        animated: false,
      });
    }, 60);
  }, [initialMonthIndex, initialYearIndex]);

  /* helper: centre index from scroll offset */
  const indexFromOffset = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    return Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT) + 1;
  };

  /* update selected when user scrolls */
  const onYearScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.min(Math.max(0, indexFromOffset(e)), years.length - 1);
    setSelectedYear(years[idx]);
  };

  const onMonthScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.min(Math.max(0, indexFromOffset(e)), months.length - 1);
    setSelectedMonth(months[idx]);
  };

  /* row renderers */
  const renderYear = ({item}: {item: string}) => (
    <Pressable
      style={styles.option}
      onPress={() => {
        setSelectedYear(item);
        const idx = years.findIndex(y => y === item);
        yearRef.current?.scrollToOffset({
          offset: Math.max(0, idx - 1) * ITEM_HEIGHT,
          animated: true,
        });
      }}>
      <Body1Title2Bold color={item === selectedYear ? 'heading' : 'secondary'}>
        {item}
      </Body1Title2Bold>
    </Pressable>
  );

  const renderMonth = ({item}: {item: string}) => (
    <Pressable
      style={styles.option}
      onPress={() => {
        setSelectedMonth(item);
        const idx = months.findIndex(m => m === item);
        monthRef.current?.scrollToOffset({
          offset: Math.max(0, idx - 1) * ITEM_HEIGHT,
          animated: true,
        });
      }}>
      <Body1Title2Bold color={item === selectedMonth ? 'heading' : 'secondary'}>
        {item}
      </Body1Title2Bold>
    </Pressable>
  );

  const IS_LARGE = Dimensions.get('window').width >= 600;

  const handleConfirm = () => {
    if (hasChanged) onConfirm(selectedMonth, selectedYear, getIslamicDate());
  };

  /* ─────────── UI ─────────── */
  return (
    <View style={IS_LARGE ? styles.containerLarge : styles.containerSmall}>
      {/* header */}
      <View style={styles.header}>
        <Title3Bold>Change year</Title3Bold>
        <Pressable onPress={onClose} hitSlop={10}>
          <Title3Bold>✕</Title3Bold>
        </Pressable>
      </View>

      {/* pickers */}
      <View style={styles.selectionArea}>
        {/* years */}
        <View style={styles.column}>
          <FlatList
            ref={yearRef}
            data={years}
            renderItem={renderYear}
            keyExtractor={it => it}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={onYearScrollEnd}
            getItemLayout={(_, i) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * i,
              index: i,
            })}
          />
          <View
            pointerEvents="none"
            style={[
              styles.highlightBox,
              {borderBottomRightRadius: 0, borderTopRightRadius: 0},
            ]}
          />
        </View>

        {/* months */}
        <View style={styles.column}>
          <FlatList
            ref={monthRef}
            data={months}
            renderItem={renderMonth}
            keyExtractor={it => it}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={onMonthScrollEnd}
            getItemLayout={(_, i) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * i,
              index: i,
            })}
          />
          <View
            pointerEvents="none"
            style={[
              styles.highlightBox,
              {
                borderBottomLeftRadius: 0,
                borderTopLeftRadius: 0,
              },
            ]}
          />
        </View>
      </View>

      {/* confirm */}
      <Pressable
        style={[
          styles.confirmButton,
          hasChanged
            ? {backgroundColor: colors.primary.primary600}
            : styles.disabledButton,
        ]}
        onPress={handleConfirm}
        disabled={!hasChanged}>
        <Body1Title2Bold color={hasChanged ? 'white' : 'heading'}>
          Confirm
        </Body1Title2Bold>
      </Pressable>
    </View>
  );
};

export default MonthYearSelector;

/* ───────────── styles ───────────── */
const styles = StyleSheet.create({
  containerLarge: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 20,
    width: '90%',
    maxWidth: 420,
    minWidth: 280,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  containerSmall: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '50%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  selectionArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    height: ITEM_HEIGHT * 3,
  },
  column: {
    flex: 1,
    height: ITEM_HEIGHT * 3,
    overflow: 'hidden',
    position: 'relative',
  },
  option: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightBox: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: 10,
    borderColor: ShadowColors['border-light'],
    backgroundColor: ShadowColors['border-light'],
    zIndex: -1,
  },
  confirmButton: {
    padding: 15,
    borderRadius: 60,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
  },
});
