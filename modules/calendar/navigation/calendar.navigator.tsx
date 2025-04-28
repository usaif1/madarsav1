// modules/calendar/navigation/calendar.navigator.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import {CalendarScreen} from '../screens';

const CalendarNavigator = createNativeStackNavigator({
  screens: {
    calendar: {
      screen: CalendarScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

export default CalendarNavigator;