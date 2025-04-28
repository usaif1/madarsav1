// modules/calendar/components/EventsList/EventsList.tsx
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Body1Title2Bold, Body2Medium, Title3Bold} from '@/components';
import {useThemeStore} from '@/globalStore';
import { DotIcon } from '@/assets/calendar';
import { scale, verticalScale } from '@/theme/responsive';

interface IslamicEvent {
  id: string;
  date: string;
  title: string;
  islamicDate: string;
  daysLeft?: number | string;
  isToday?: boolean;
}

interface EventsListProps {
  selectedDate: Date;
}

// Mock data - would be fetched from API or calculated
const getIslamicEvents = (): IslamicEvent[] => {
  return [
    {
      id: '1',
      date: '1 Mar',
      title: '6 Shaban',
      islamicDate: 'Jumada al-Awwal, 1446 AH',
      daysLeft: 0,
      isToday: true,
    },
    {
      id: '2',
      date: '1 Mar',
      title: 'First day of Ramadan',
      islamicDate: 'Jumada al-Awwal, 1446 AH',
      daysLeft: 24,
    },
    {
      id: '3',
      date: '1 Mar',
      title: 'First day of Lailat-ul-Qadr',
      islamicDate: 'Jumada al-Awwal, 1446 AH',
      daysLeft: 24,
    },
  ];
};

const EventsList: React.FC<EventsListProps> = () => {
  const events = getIslamicEvents();
  const {colors} = useThemeStore();

  const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    list: {
      paddingHorizontal: scale(8),
    },
    eventItem: {
      flexDirection: 'row',
      height: verticalScale(70),
      alignItems: 'center',
      gap: scale(20), 
      borderBottomWidth: 1,
      borderBottomColor: colors.primary.primary100,
      padding: scale(16), 
    },
    dateContainer: {
      width: scale(38),
      height: scale(38),
      borderRadius: scale(8),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary.primary50,
    },
    eventContent: {
      flex: 1,
    },
    daysLeft: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: scale(8),
      flexDirection: 'row',
      gap: scale(4),
    },
  });
  
  return (
    <FlatList
      data={events}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.eventItem}>
          <View style={styles.dateContainer}>
            <Body1Title2Bold style={{fontSize: scale(14)}} color="primary">{item.date.split(' ')[0]}</Body1Title2Bold>
            <Body2Medium style={{fontSize: scale(10)}} color="primary">{item.date.split(' ')[1]}</Body2Medium>
          </View>
          
          <View style={styles.eventContent}>
            <View style={styles.titleContainer}><Body1Title2Bold>{item.title}</Body1Title2Bold> {item.daysLeft !== undefined && (
            <View style={styles.daysLeft}>
              <DotIcon width={scale(10)} height={scale(10)} />
              {item.isToday ? (
                <Body2Medium style={{fontSize: scale(12)}} color="warning">Today</Body2Medium>
              ) : (
                <Body2Medium style={{fontSize: scale(12)}} color="warning">{item.daysLeft} days left</Body2Medium>
              )}
            </View>
          )}</View>
            <Body2Medium style={{fontSize: scale(12)}} color="sub-heading">{item.islamicDate}</Body2Medium>
          </View>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
};

export default EventsList;
