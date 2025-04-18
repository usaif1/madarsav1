import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

// components
import {Divider} from '@/components';

const NameAndEmail = () => {
  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 20,
        boxShadow: '1',
      }}>
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
        <Text style={{fontSize: 35, fontWeight: '700', color: '#A781E5'}}>
          {/* H2-Bold */}
          MA
        </Text>
      </View>
    </LinearGradient>
  );
};

const NameEmail = () => {
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: '#171717',
          lineHeight: 28,
        }}>
        {/* H5-Bold */}
        Mohammad Arbaz
      </Text>
      <Divider height={2} />
      {/* Body-1 & Title-2-medium */}
      <Text
        style={{
          color: '#737373',
          fontWeight: '500',
          fontSize: 14,
          lineHeight: 20,
        }}>
        arbazkhan78@gmail.com
      </Text>
    </View>
  );
};

const ViewProfileButton = () => {
  return (
    <Pressable
      style={{
        backgroundColor: '#F0EAFB',
        width: 114,
        borderRadius: 100,
        alignItems: 'center',
      }}>
      {/* Body-1 & Title-2-bold */}
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
