import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
// components
import {Divider} from '@/components';
import {Body1Title2Bold, Body1Title2Medium, H2Bold, H5Bold} from '@/components';
import {useThemeStore} from '@/globalStore';
import {useNavigation} from '@react-navigation/native';
import { useAuthStore } from '@/modules/auth/store/authStore';

const NameAndEmail = () => {
  const {shadows} = useThemeStore();
  const {user} = useAuthStore();

  return (
    <View
      style={[
        {
          width: '100%',
          alignItems: 'center',
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: 'white', // Required for shadows to work properly
        },
        shadows.sm1,
      ]}>
      <Avatar />
      <Divider />
      <NameEmail />
      <Divider height={16} />
      <ViewProfileButton />
    </View>
  );
};

export default NameAndEmail;

const Avatar = () => {
  const {user} = useAuthStore();

  return (
    <LinearGradient colors={['#FFFFFF', '#F2DEFF']} style={{borderRadius: 100}}>
      <View style={styles.avatar}>
        {user?.photoUrl || user?.photo ? <FastImage source={{uri: user?.photoUrl || user?.photo}} style={{width: 100, height: 100, borderRadius: 100}} /> : <H2Bold color="primary">{user?.name?.split(' ').map((name: string) => name[0]).join('')}</H2Bold>}
      </View>
    </LinearGradient>
  );
};

const NameEmail = () => {
  const {user} = useAuthStore();

  return (
    <View style={{alignItems: 'center'}}>
      <H5Bold>{user?.name}</H5Bold>
      <Divider height={2} />
      <Body1Title2Medium color="sub-heading">
        {user?.email}
      </Body1Title2Medium>
    </View>
  );
};

const ViewProfileButton = () => {
  const {colors} = useThemeStore();

  const navigation = useNavigation();

  const onPress = () => {
    // @ts-ignore
    navigation.navigate('profileDetails');
  };

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.primary.primary100,
        width: 114,
        borderRadius: 100,
        paddingVertical: 4,
        alignItems: 'center',
      }}>
      <Body1Title2Bold color="primary">View Profile</Body1Title2Bold>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
