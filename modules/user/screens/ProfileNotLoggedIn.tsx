// dependencies
import { StatusBar, View } from 'react-native';
import React from 'react';

// components
import { AppVersion } from '../components/Profile';
import { Divider } from '@/components';
import ProfileNotLoggedDetails from '../components/Profile/ProfileNotLoggedDetails';
import { ActionList } from '../components/Profile';
import authService from '@/modules/auth/services/authService';

const ProfileNotLoggedIn: React.FC = () => {
  const { logOutByDeletingTokens } = authService;
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <ProfileNotLoggedDetails onLoginPress={logOutByDeletingTokens} />
      <Divider color='secondary' height={8} />
      <ActionList profileNotLoggedIn={true} />
      <Divider color='secondary' height={8} />
      <AppVersion />
    </View>
  );
};

export default ProfileNotLoggedIn;
