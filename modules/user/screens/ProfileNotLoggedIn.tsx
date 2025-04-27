// dependencies
import { StatusBar, View } from 'react-native';
import React from 'react';

// components
import { AppVersion } from '../components/Profile';
import { Divider } from '@/components';
import ProfileNotLoggedDetails from '../components/Profile/ProfileNotLoggedDetails';
import { ActionList } from '../components/Profile';

const ProfileNotLoggedIn: React.FC = () => {
  // You can add navigation logic to the login screen in ProfileNoLoggedIn if needed
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <ProfileNotLoggedDetails />
      <Divider height={8} />
      <ActionList profileNotLoggedIn={true} />
      <Divider height={8} />
      <AppVersion />
    </View>
  );
};

export default ProfileNotLoggedIn;
