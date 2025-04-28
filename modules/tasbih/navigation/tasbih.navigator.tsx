import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TasbihScreen from '../screens/TasbihScreen';
import { Header } from '@/components';

const TasbihNavigator = createNativeStackNavigator({
  screens: {
    tasbih: {
      screen: TasbihScreen,
      options: {
        header: () => <Header title="Tasbih" />,
      },
    },
  },
});

export default TasbihNavigator;
