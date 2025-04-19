import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

// components
import {Divider} from '@/components';
import {
  Body1Title2Medium,
  H2Bold,
  H5Bold,
} from '@/components/Typography/Typography';
import {useThemeStore} from '@/theme/store';

const NameAndEmail = () => {
  return (
    <View
      style={[
        {
          width: '100%',
          alignItems: 'center',
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: 'white', // Required for shadows to work properly
          // // iOS Shadow
          // shadowColor: '#000',
          // shadowOffset: {
          //   width: 0,
          //   height: 2,
          // },
          // shadowOpacity: 0.25,
          // shadowRadius: 3.84,
          // // Android Shadow
          // elevation: 5,
        },
        shadows.shadowSm2,
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
  return (
    <Pressable
      style={{
        backgroundColor: colors.primary.primary100,
        width: 114,
        borderRadius: 100,
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: '#8A57DC',
          lineHeight: 20,
          paddingVertical: 4,
        }}>
        View Profile
      </Text>
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

const shadows = StyleSheet.create({
  // First shadow variant (Blur 2)
  shadowSm1: {
    shadowColor: '#E5E5E5',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2 / 2, // Divide by 2 to match CSS blur to RN's shadowRadius
    elevation: 2, // Android equivalent
  },

  // Second shadow variant (Blur 3)
  shadowSm2: {
    shadowColor: '#E5E5E5',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 3 / 2, // Divide by 2 to match CSS blur to RN's shadowRadius
    elevation: 3, // Android equivalent
  },
});
