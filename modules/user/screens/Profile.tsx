// dependencies
import {StatusBar, View} from 'react-native';
import React from 'react';

// components
import {ActionList, AppVersion, NameAndEmail} from '../components/Profile';
import {Divider} from '@/components';

const Profile: React.FC = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle="light-content" />
      <NameAndEmail />
      <Divider height={8} />
      <ActionList />
      <Divider height={8} />
      <AppVersion />
    </View>
  );
};

export default Profile;
