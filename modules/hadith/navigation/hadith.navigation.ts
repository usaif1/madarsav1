//dependencies
import {createStaticNavigation} from '@react-navigation/native';

import HadithNavigator from './hadith.navigator';

const HadithNavigation = createStaticNavigation(HadithNavigator);

export default HadithNavigation;
