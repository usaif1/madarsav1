// modules/calendar/data/eventsData.ts
export interface IslamicEvent {
    id: string;
    title: string;
    description?: string;
    hijriDate: {
      day: number;
      month: string;
      year: number;
    };
    gregorianDateRange: {
      start: Date;
      end: Date;
    };
    dua?: string;
    isHoliday?: boolean;
  }
  
  export const islamicEvents: IslamicEvent[] = [
    {
      id: 'ramadan-start',
      title: 'First day of Ramadan',
      description: 'The start of the holy month of Ramadan, a time of fasting and spiritual reflection.',
      hijriDate: {
        day: 1,
        month: 'Ramadan',
        year: 1446,
      },
      gregorianDateRange: {
        start: new Date('2025-03-01'),
        end: new Date('2025-03-01'),
      },
      isHoliday: true,
    },
    {
      id: 'laylatul-qadr',
      title: 'First day of Lailat-ul-Qadr',
      description: 'The Night of Power, commemorating the night when the first verses of the Quran were revealed to Muhammad.',
      hijriDate: {
        day: 27,
        month: 'Ramadan',
        year: 1446,
      },
      gregorianDateRange: {
        start: new Date('2025-03-27'),
        end: new Date('2025-03-27'),
      },
    },
    {
      id: 'shaban-6',
      title: '6 Shaban',
      hijriDate: {
        day: 6,
        month: 'Shaban',
        year: 1446,
      },
      gregorianDateRange: {
        start: new Date('2025-03-01'),
        end: new Date('2025-03-01'),
      },
    },
  ];
  
  /**
   * Get events for a specific date
   */
  export const getEventsForDate = (date: Date): IslamicEvent[] => {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    return islamicEvents.filter(event => {
      const startString = event.gregorianDateRange.start.toISOString().split('T')[0];
      const endString = event.gregorianDateRange.end.toISOString().split('T')[0];
      
      return dateString >= startString && dateString <= endString;
    });
  };
  
  /**
   * Get upcoming events from a specific date
   */
  export const getUpcomingEvents = (fromDate: Date, count: number = 5): IslamicEvent[] => {
    // Convert to timestamp for comparison
    const fromTimestamp = fromDate.getTime();
    
    return islamicEvents
      .filter(event => event.gregorianDateRange.start.getTime() >= fromTimestamp)
      .sort((a, b) => a.gregorianDateRange.start.getTime() - b.gregorianDateRange.start.getTime())
      .slice(0, count);
  };