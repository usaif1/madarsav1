import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import ChevronRight from '@/assets/chevron-right.svg';

import {scale, verticalScale} from '@/theme/responsive';
import {
  Body1Title2Bold,
  Body1Title2Medium,
  Body2Medium,
} from '@/components/Typography/Typography';
import LinearGradient from 'react-native-linear-gradient';
import {CdnSvg} from '@/components/CdnSvg';
import {ShadowColors} from '@/theme/shadows';
import {useThemeStore} from '@/globalStore';

// Import Hijri Calendar API hooks
import {
  useNextHijriHoliday,
  useSpecialDays,
  useHijriHolidaysByYear,
  useCurrentIslamicYear,
  useHijriCalendar,
} from '@/modules/calendar/hooks/useHijriCalendar';

// Month data
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Interface for Islamic events
interface IslamicEvent {
  id: string;
  day: number;
  month: string;
  title: string;
  islamicDate: string;
  daysLeft?: number;
  isToday?: boolean;
  isTomorrow?: boolean;
}

interface IslamicEventsProps {
  initialMonth?: string;
  onViewCalendarPress?: () => void;
}

const IslamicEvents: React.FC<IslamicEventsProps> = ({
  initialMonth = MONTHS[new Date().getMonth()],
  onViewCalendarPress,
}) => {
  const {colors} = useThemeStore();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Get current date
  const today = new Date();
  const currentMonth =
    selectedMonth === MONTHS[today.getMonth()]
      ? today.getMonth() + 1
      : MONTHS.indexOf(selectedMonth) + 1;
  const currentYear = today.getFullYear();

  // Get current Islamic year
  const {data: currentIslamicYearData, isLoading: isYearLoading} =
    useCurrentIslamicYear();

  // Get next Hijri holiday
  const {data: nextHolidayData, isLoading: isNextHolidayLoading} =
    useNextHijriHoliday();

  // Get special days
  const {data: specialDaysData, isLoading: isSpecialDaysLoading} =
    useSpecialDays();

  // Get current Islamic year for holidays
  const currentIslamicYear = currentIslamicYearData?.data
    ? typeof currentIslamicYearData.data === 'number'
      ? currentIslamicYearData.data
      : parseInt(String(currentIslamicYearData.data) || '1445')
    : 1445;

  // Get Hijri holidays for the current Islamic year
  const {data: holidaysData, isLoading: isHolidaysLoading} =
    useHijriHolidaysByYear(currentIslamicYear);

  // Get the Hijri calendar for the current display month
  const {data: hijriCalendarData, isLoading: isHijriCalendarLoading} =
    useHijriCalendar(currentMonth, currentYear);

  // Show loading state
  const isLoading =
    isYearLoading ||
    isNextHolidayLoading ||
    isSpecialDaysLoading ||
    isHolidaysLoading ||
    isHijriCalendarLoading;

  // Process the events data from the API
  const events = useMemo(() => {
    if (isLoading || !hijriCalendarData) return [];

    const eventsArray: IslamicEvent[] = [];
    const todayDate = new Date();

    // Process the hijri calendar data to find events for the selected month
    if (hijriCalendarData?.data && Array.isArray(hijriCalendarData.data)) {
      // Process each day in the calendar
      hijriCalendarData.data.forEach((dayData: any, index) => {
        if (!dayData || !dayData.gregorian || !dayData.hijri) return;

        // Get the gregorian date
        const gregorianDate = dayData.gregorian;
        const hijriDate = dayData.hijri;

        // Check if this day has any holidays
        if (hijriDate.holidays && hijriDate.holidays.length > 0) {
          // Create a date object for this day
          const holidayDate = new Date(
            parseInt(gregorianDate.year),
            gregorianDate.month.number - 1,
            parseInt(gregorianDate.day),
          );

          // Only include events for the selected month
          const eventMonth = MONTHS[holidayDate.getMonth()];
          if (eventMonth !== selectedMonth) return;

          // Calculate days left
          const daysLeft = Math.ceil(
            (holidayDate.getTime() - todayDate.getTime()) /
              (1000 * 60 * 60 * 24),
          );

          // Check if this is today or tomorrow
          const isHolidayToday =
            holidayDate.getDate() === todayDate.getDate() &&
            holidayDate.getMonth() === todayDate.getMonth() &&
            holidayDate.getFullYear() === todayDate.getFullYear();

          const isHolidayTomorrow =
            holidayDate.getDate() === todayDate.getDate() + 1 &&
            holidayDate.getMonth() === todayDate.getMonth() &&
            holidayDate.getFullYear() === todayDate.getFullYear();

          // Add each holiday for this day
          hijriDate.holidays.forEach(
            (holiday: string, holidayIndex: number) => {
              const eventItem: IslamicEvent = {
                id: `calendar-holiday-${index}-${holidayIndex}`,
                day: parseInt(gregorianDate.day),
                month: eventMonth,
                title: holiday,
                islamicDate: `${hijriDate.day} ${hijriDate.month.en}, ${hijriDate.year} AH`,
                // Only include daysLeft if it's a future event
                daysLeft: daysLeft > 0 ? daysLeft : undefined,
                isToday: isHolidayToday,
                isTomorrow: isHolidayTomorrow,
              };

              eventsArray.push(eventItem);
            },
          );
        }
      });
    }

    // Sort events by date
    eventsArray.sort((a, b) => {
      if (a.isToday && !b.isToday) return -1;
      if (!a.isToday && b.isToday) return 1;
      if (a.isTomorrow && !b.isTomorrow) return -1;
      if (!a.isTomorrow && b.isTomorrow) return 1;
      return a.day - b.day;
    });

    return eventsArray;
  }, [isLoading, hijriCalendarData, selectedMonth]);

  const hasEvents = events.length > 0;

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setShowMonthPicker(false);
  };

  const renderEventItem = ({item}: {item: IslamicEvent}) => (
    <View style={styles.eventItem}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{item.day}</Text>
        <Text style={styles.monthText}>{item.month}</Text>
      </View>

      <View style={styles.eventContent}>
        <View style={styles.titleContainer}>
          <Body1Title2Medium
            style={styles.eventTitle}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.title}
          </Body1Title2Medium>
          {item.daysLeft !== undefined && (
            <View style={styles.daysLeft}>
              <View
                style={[
                  styles.dotIcon,
                  {
                    backgroundColor: item.isToday
                      ? '#6E56CF' // primary 500
                      : item.isTomorrow
                      ? '#F79009' // Primitives/Semantic-Warning/600
                      : '#F04438', // Primitives/Semantic-Error/600
                  },
                ]}
              />
              {item.isToday ? (
                <Body2Medium style={styles.todayText}>Today</Body2Medium>
              ) : item.isTomorrow ? (
                <Body2Medium style={styles.tomorrowText}>Tomorrow</Body2Medium>
              ) : (
                <Body2Medium style={styles.daysLeftText}>
                  {item.daysLeft} days left
                </Body2Medium>
              )}
            </View>
          )}
        </View>
        <Body2Medium style={styles.islamicDateText}>
          {item.islamicDate}
        </Body2Medium>
      </View>
    </View>
  );

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FDA29B', '#8A57DC']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradientContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Body1Title2Bold color="white">Islamic events</Body1Title2Bold>

            <TouchableOpacity
              style={styles.monthPill}
              onPress={() => setShowMonthPicker(true)}>
              <Body1Title2Medium color="white">
                {selectedMonth}
              </Body1Title2Medium>
              <CdnSvg
                path="/assets/home/down-arrow.svg"
                width={scale(12)}
                height={scale(12)}
                fill="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={colors.primary.primary500}
              />
            </View>
          </View>
        </LinearGradient>

        {/* Month Picker Modal */}
        <Modal
          visible={showMonthPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowMonthPicker(false)}>
          <TouchableWithoutFeedback onPress={() => setShowMonthPicker(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.monthPickerContainer}>
                  <FlatList
                    data={MONTHS}
                    keyExtractor={item => item}
                    numColumns={4}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={[
                          styles.monthItem,
                          selectedMonth === item && styles.selectedMonthItem,
                        ]}
                        onPress={() => handleMonthSelect(item)}>
                        <Text
                          style={[
                            styles.monthItemText,
                            selectedMonth === item &&
                              styles.selectedMonthItemText,
                          ]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.monthsList}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Footer - View Calendar */}
        <TouchableOpacity
          style={styles.viewCalendarContainer}
          onPress={onViewCalendarPress}
          activeOpacity={0.8}>
          <Body1Title2Bold color="primary">View Calendar</Body1Title2Bold>
          <View style={styles.arrowContainer}>
            <ChevronRight width={scale(7)} height={scale(7)} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FDA29B', '#8A57DC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradientContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Body1Title2Bold color="white">Islamic events</Body1Title2Bold>

          <TouchableOpacity
            style={styles.monthPill}
            onPress={() => setShowMonthPicker(true)}>
            <Body1Title2Medium color="white">{selectedMonth}</Body1Title2Medium>
            <CdnSvg
              path="/assets/home/down-arrow.svg"
              width={scale(12)}
              height={scale(12)}
              fill="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {hasEvents ? (
            <FlatList
              data={events}
              keyExtractor={item => item.id}
              renderItem={renderEventItem}
              contentContainerStyle={styles.eventsList}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={styles.scrollableList}
            />
          ) : (
            <View style={styles.noEventsContainer}>
              <CdnSvg
                path="/assets/home/no-events.svg"
                width={scale(60)}
                height={scale(60)}
              />
              <Body1Title2Medium style={styles.noEventsText}>
                Zero islamic events{'\n'}this month
              </Body1Title2Medium>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}>
        <TouchableWithoutFeedback onPress={() => setShowMonthPicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.monthPickerContainer}>
                <FlatList
                  data={MONTHS}
                  keyExtractor={item => item}
                  numColumns={4}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.monthItem,
                        selectedMonth === item && styles.selectedMonthItem,
                      ]}
                      onPress={() => handleMonthSelect(item)}>
                      <Text
                        style={[
                          styles.monthItemText,
                          selectedMonth === item &&
                            styles.selectedMonthItemText,
                        ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.monthsList}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Footer - View Calendar */}
      <TouchableOpacity
        style={styles.viewCalendarContainer}
        onPress={onViewCalendarPress}
        activeOpacity={0.8}>
        <Body1Title2Bold color="primary">View Calendar</Body1Title2Bold>
        <View style={styles.arrowContainer}>
          <ChevronRight width={scale(7)} height={scale(7)} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(339),
    height: verticalScale(268), // Increased height to accommodate footer (230 + 38)
    borderRadius: scale(8),
    alignSelf: 'center',
    marginBottom: verticalScale(16),
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: ShadowColors['border-light'],
  },
  gradientContainer: {
    flex: 1,
    borderRadius: scale(8),
  },
  header: {
    width: scale(339),
    height: verticalScale(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: scale(10),
    paddingHorizontal: scale(16),
    paddingBottom: scale(6),
  },
  monthPill: {
    width: scale(63),
    height: verticalScale(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(2),
    paddingHorizontal: scale(10),
    borderRadius: scale(33),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    gap: scale(4),
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8),
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5E5',
    height: verticalScale(190), // Fixed height for content (footer will be outside this)
  },
  eventsList: {
    paddingVertical: scale(8),
    flexGrow: 1,
  },
  eventItem: {
    flexDirection: 'row',
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  dateContainer: {
    width: scale(34),
    height: scale(34),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(16),
    backgroundColor: '#F5F4FB', // primary 50
    borderRadius: scale(4), // radius-sm
  },
  dayText: {
    fontFamily: 'Geist',
    fontWeight: '700',
    fontSize: scale(14),
    lineHeight: scale(14 * 1.45),
    letterSpacing: 0,
    textAlign: 'center',
    color: '#8A57DC',
  },
  monthText: {
    fontFamily: 'Geist',
    fontWeight: '500',
    fontSize: scale(10),
    lineHeight: scale(10 * 1.4),
    letterSpacing: 0,
    textAlign: 'center',
    color: '#8A57DC',
  },
  eventContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
    width: '100%',
  },
  daysLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    flexShrink: 0,
  },
  dotIcon: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  eventTitle: {
    color: '#101828', // neutral-11
    flex: 1,
    marginRight: scale(8),
  },
  todayText: {
    fontFamily: 'Geist',
    fontWeight: '500',
    fontSize: scale(12),
    lineHeight: scale(12 * 1.4),
    letterSpacing: 0,
    color: '#6E56CF', // primary 500
  },
  tomorrowText: {
    fontFamily: 'Geist',
    fontWeight: '500',
    fontSize: scale(12),
    lineHeight: scale(12 * 1.4),
    letterSpacing: 0,
    color: '#F79009', // Primitives/Semantic-Warning/600
  },
  daysLeftText: {
    fontFamily: 'Geist',
    fontWeight: '500',
    fontSize: scale(12),
    lineHeight: scale(12 * 1.4),
    letterSpacing: 0,
    color: '#F04438', // Primitives/Semantic-Error/600
  },
  islamicDateText: {
    fontFamily: 'Geist',
    fontWeight: '500',
    fontSize: scale(12),
    lineHeight: scale(12 * 1.4),
    letterSpacing: 0,
    color: '#737373', // Tokens-Sub-heading
  },
  noEventsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(16),
    paddingHorizontal: scale(16),
  },
  noEventsText: {
    fontSize: scale(14),
    lineHeight: scale(20.3),
    textAlign: 'center',
    color: '#919091',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,10,10,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthPickerContainer: {
    width: scale(300),
    backgroundColor: 'white',
    borderRadius: scale(8),
    padding: scale(16),
  },
  monthsList: {
    paddingVertical: scale(8),
  },
  monthItem: {
    width: scale(64),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    margin: scale(2),
    borderRadius: scale(4),
  },
  selectedMonthItem: {
    backgroundColor: '#F5F4FB',
  },
  monthItemText: {
    fontFamily: 'Geist-Medium',
    fontSize: scale(14),
    color: '#171717',
  },
  selectedMonthItemText: {
    color: '#8A57DC',
    fontFamily: 'Geist-Bold',
  },
  scrollableList: {
    flex: 1,
  },
  viewCalendarContainer: {
    width: scale(339),
    height: verticalScale(38),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    gap: scale(4),
    backgroundColor: '#F9F6FF', // Primitives-Primary-50
    borderTopWidth: 1, // Primitives/Regular
    borderTopColor: '#E5E5E5',
  },
  arrowContainer: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    backgroundColor: '#8A57DC', // Primitives-Primary-500
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: scale(14),
    lineHeight: scale(14),
    textAlign: 'center',
  },
});

export default IslamicEvents;
