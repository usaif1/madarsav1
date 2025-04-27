import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TasbihScreen from '../screens/TasbihScreen';

const TasbihNavigator = createNativeStackNavigator({
  screens: {
    tasbih: {
      screen: TasbihScreen,
      options: {
        title: 'Tasbih',
        headerTitleAlign: 'center',
      },
    },
  },
});

export default TasbihNavigator;
