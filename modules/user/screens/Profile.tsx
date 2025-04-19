import {StatusBar, View} from 'react-native';
import React from 'react';
import {ActionList, AppVersion, NameAndEmail} from '../components/Profile';

const Profile: React.FC = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle="light-content" />
      <NameAndEmail />
      {/* <View style={{height: 8, backgroundColor: '#E5E5E5'}} /> */}
      <ActionList />
      {/* <View style={{height: 8, backgroundColor: '#E5E5E5'}} /> */}
      <AppVersion />
    </View>
  );
};

export default Profile;
