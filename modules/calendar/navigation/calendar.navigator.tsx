// modules/calendar/navigation/calendar.navigator.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import {CalendarScreen} from '../screens';

// components
import {CalendarHeader} from '../components';

const CalendarNavigator = createNativeStackNavigator({
  screens: {
    calendar: {
      screen: CalendarScreen,
      options: {
        header: () => <CalendarHeader />,
      },
    },
  },
});

export default CalendarNavigator;