import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

// components
import {Divider} from '@/components';
import {Body1Title2Bold, Body1Title2Medium, H2Bold, H5Bold} from '@/components';
import {useThemeStore} from '@/globalStore';
import {useNavigation} from '@react-navigation/native';

const NameAndEmail = () => {
  const {shadows} = useThemeStore();

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
  return (
    <LinearGradient colors={['#FFFFFF', '#F2DEFF']} style={{borderRadius: 100}}>
      <View style={styles.avatar}>
        <H2Bold color="primary">MA</H2Bold>
      </View>
    </LinearGradient>
  );
};

const NameEmail = () => {
  return (
    <View style={{alignItems: 'center'}}>
      <H5Bold>Mohammad Arbaz</H5Bold>
      <Divider height={2} />
      <Body1Title2Medium color="sub-heading">
        arbazkhan78@gmail.com
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
