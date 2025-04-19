import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';

// assets
import {Avatar} from './components/ProfileDetails';
import CustomTextInput from './components/ProfileDetails/CustomTextInput';
import {Divider} from '@/components';
import {Body1Title2Bold} from '@/components/Typography/Typography';

const ProfileDetails: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: 32,
      }}>
      <Avatar />
      <Divider height={24} />
      <View style={styles.form}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            columnGap: 20,
            justifyContent: 'space-between',
            overflow: 'scroll',
          }}>
          <View style={{flex: 1}}>
            <CustomTextInput label="First Name" value="Mohammad" disabled />
          </View>
          <View style={{flex: 1}}>
            <CustomTextInput label="Last Name" value="Arbaz" disabled />
          </View>
        </View>
        <View>
          <CustomTextInput label="Email" value="arbz@gmail.com" disabled />
        </View>
        <View>
          <CustomTextInput label="Phone number" value="" />
        </View>
        <View>
          <CustomTextInput label="Gender" value="" />
        </View>
        <View>
          <CustomTextInput label="Date of Birth" value="" />
        </View>

        <Pressable style={styles.submitBtn}>
          <Body1Title2Bold color="sub-heading">Save Changes</Body1Title2Bold>
        </Pressable>
      </View>
    </View>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 18,
    rowGap: 12,
    flex: 1,
  },

  submitBtn: {
    position: 'absolute',
    bottom: 31,
    height: 40,
    backgroundColor: '#F5F5F5',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});
