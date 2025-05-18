import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {scale, verticalScale} from '@/theme/responsive';
import {Body1Title2Bold, Body1Title2Medium, Body2Medium} from '@/components/Typography/Typography';
import LinearGradient from 'react-native-linear-gradient';
import DownArrow from '@/assets/home/down-arrow.svg';
import NoEvents from '@/assets/home/no-events.svg';
import { ShadowColors } from '@/theme/shadows';

// Mock data for months
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Mock data for events
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

const EVENTS: Record<string, IslamicEvent[]> = {
  'Jun': [
    {
      id: '1',
      day: 5,
      month: 'Jun',
      title: 'Hajj 2025',
      islamicDate: 'Thursday, 9 Dhul Hijjah 1446h',
      daysLeft: 0,
      isToday: true,
    },
    {
      id: '2',
      day: 6,
      month: 'Jun',
      title: 'Eid Ul Adha 2025',
      islamicDate: 'Friday, 10 Dhul Hijjah 1446h',
      daysLeft: 1,
      isTomorrow: true,
    },
    {
      id: '3',
      day: 26,
      month: 'Jun',
      title: '1st Muharram 2025',
      islamicDate: 'Thursday, 1st Muharram 1446h',
      daysLeft: 20,
    },
  ],
  'Apr': [],
  // Add more months as needed
};

interface IslamicEventsProps {
  initialMonth?: string;
  onViewCalendarPress?: () => void;
}

const IslamicEvents: React.FC<IslamicEventsProps> = ({
  initialMonth = MONTHS[new Date().getMonth()],
  onViewCalendarPress,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  const events = EVENTS[selectedMonth] || [];
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
          <Body1Title2Medium style={styles.eventTitle}>{item.title}</Body1Title2Medium>
          {(item.daysLeft !== undefined) && (
            <View style={styles.daysLeft}>
              <View style={[styles.dotIcon, {
                backgroundColor: item.isToday ? '#6E56CF' : // primary 500
                  item.isTomorrow ? '#F79009' : // Primitives/Semantic-Warning/600
                  '#F04438' // Primitives/Semantic-Error/600
              }]} />
              {item.isToday ? (
                <Body2Medium style={styles.todayText}>Today</Body2Medium>
              ) : item.isTomorrow ? (
                <Body2Medium style={styles.tomorrowText}>Tomorrow</Body2Medium>
              ) : (
                <Body2Medium style={styles.daysLeftText}>{item.daysLeft} days left</Body2Medium>
              )}
            </View>
          )}
        </View>
        <Body2Medium style={styles.islamicDateText}>{item.islamicDate}</Body2Medium>
      </View>
    </View>
  );

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onViewCalendarPress}
      activeOpacity={0.9}
    >
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
            onPress={() => setShowMonthPicker(true)}
          >
            <Body1Title2Medium color="white">{selectedMonth}</Body1Title2Medium>
            <DownArrow width={scale(12)} height={scale(12)} fill="#FFFFFF" />
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
              scrollEnabled={events.length > 3}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noEventsContainer}>
              <NoEvents width={scale(60)} height={scale(60)} />
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
        onRequestClose={() => setShowMonthPicker(false)}
      >
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
                        selectedMonth === item && styles.selectedMonthItem
                      ]}
                      onPress={() => handleMonthSelect(item)}
                    >
                      <Text style={[
                        styles.monthItemText,
                        selectedMonth === item && styles.selectedMonthItemText
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(339),
    height: verticalScale(230),
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
  },
  eventsList: {
    paddingVertical: scale(8),
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
  },
  daysLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  dotIcon: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  eventTitle: {
    color: '#101828', // neutral-11
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(16),
  },
  noEventsText: {
    fontSize: scale(14),
    lineHeight: scale(20.3),
    textAlign: 'center',
    color: '#919091',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
});

export default IslamicEvents;
