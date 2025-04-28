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
        start: new Date('2025-02-28'), // 1 Ramadan 1446 (approximate)
        end: new Date('2025-02-28'),
      },
      isHoliday: true,
    },
    {
      id: 'eid-al-fitr',
      title: 'Eid al-Fitr',
      description: 'Festival of Breaking the Fast, celebrated at the end of Ramadan.',
      hijriDate: {
        day: 1,
        month: 'Shawwal',
        year: 1446,
      },
      gregorianDateRange: {
        start: new Date('2025-03-30'), // 1 Shawwal 1446 (approximate)
        end: new Date('2025-03-30'),
      },
      isHoliday: true,
    },
    {
      id: 'eid-al-adha',
      title: 'Eid al-Adha',
      description: 'Festival of Sacrifice, commemorating the willingness of Ibrahim to sacrifice his son.',
      hijriDate: {
        day: 10,
        month: 'Dhul Hijjah',
        year: 1446,
      },
      gregorianDateRange: {
        start: new Date('2025-06-07'), // 10 Dhul Hijjah 1446 (approximate)
        end: new Date('2025-06-07'),
      },
      isHoliday: true,
    },
    {
      id: 'islamic-new-year',
      title: 'Islamic New Year',
      description: 'The beginning of the new Islamic year (1 Muharram).',
      hijriDate: {
        day: 1,
        month: 'Muharram',
        year: 1447,
      },
      gregorianDateRange: {
        start: new Date('2025-07-27'), // 1 Muharram 1447 (approximate)
        end: new Date('2025-07-27'),
      },
      isHoliday: true,
    },
    {
      id: 'laylatul-qadr',
      title: 'Lailat-ul-Qadr',
      description: 'The Night of Power, commemorating the night when the first verses of the Quran were revealed to Muhammad.',
      hijriDate: {
        day: 27,
        month: 'Ramadan',
        year: 1446,
      },
      gregorianDateRange: {
        start: new Date('2025-03-26'), // 27 Ramadan 1446 (approximate)
        end: new Date('2025-03-26'),
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