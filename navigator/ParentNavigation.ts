import {createStaticNavigation} from '@react-navigation/native';

// navigator
import ParentNavigator from './ParentNavigator';

const ParentNavigation = createStaticNavigation(ParentNavigator);

export default ParentNavigation;
