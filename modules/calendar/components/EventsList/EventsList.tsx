// modules/calendar/components/EventsList/EventsList.tsx
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Body1Title2Bold, Body2Medium, Title3Bold} from '@/components';

interface IslamicEvent {
  id: string;
  date: string;
  title: string;
  islamicDate: string;
  daysLeft?: number;
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
  
  return (
    <FlatList
      data={events}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.eventItem}>
          <View style={styles.dateContainer}>
            <Body1Title2Bold color="primary">{item.date.split(' ')[0]}</Body1Title2Bold>
            <Body2Medium color="primary">{item.date.split(' ')[1]}</Body2Medium>
          </View>
          
          <View style={styles.eventContent}>
            <Title3Bold>{item.title}</Title3Bold>
            <Body2Medium color="sub-heading">{item.islamicDate}</Body2Medium>
          </View>
          
          {item.daysLeft !== undefined && (
            <View style={styles.daysLeft}>
              {item.isToday ? (
                <View style={styles.todayIndicator} />
              ) : (
                <Body2Medium>{item.daysLeft} days left</Body2Medium>
              )}
            </View>
          )}
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
};

export default EventsList;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
  eventItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dateContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 16,
  },
  eventContent: {
    flex: 1,
  },
  daysLeft: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  todayIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FEC84B',
  },
});