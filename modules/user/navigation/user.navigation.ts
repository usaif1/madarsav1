//dependencies
import {createStaticNavigation} from '@react-navigation/native';

import UserNavigator from './user.navigator';

const UserNavigation = createStaticNavigation(UserNavigator);

export default UserNavigation;
