// dependencies
import {Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserStackParamList } from '../../navigation/user.navigator';

// assets
import LogoUrduSm from '@/assets/logo_urdu_small.svg';
import LogoUrduSmPurple from '@/assets/logo_urdu_small_purple.svg';
import TnCGraphic from '@/assets/profile/TnCGraphic.svg';
import PrivacyPolicyGraphic from '@/assets/profile/PrivacyPolicyGraphic.svg';
import TnCGraphicWide from '@/assets/profile/TnCGraphicWide.svg';
import PrivacyPolicyGraphicWide from '@/assets/profile/PrivacyPolicyGraphicWide.svg';

// store
import {useThemeStore} from '@/globalStore';

// components
import {Divider} from '@/components';
import {Body2Medium, CaptionBold, Title3Bold} from '@/components';

import {useWindowDimensions} from 'react-native';

const AppVersion = () => {
  const {shadows} = useThemeStore();
  const {width} = useWindowDimensions();
  const isWide = width >= 700; // iPad and larger screens
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  
  const navigateToTerms = () => {
    navigation.navigate('termsAndConditions');
  };
  
  const navigateToPrivacy = () => {
    navigation.navigate('privacyPolicy');
  };

  return (
    <View style={[{padding: 20, backgroundColor: '#FFFFFF'}, shadows.sm1]}>
      <View style={{flexDirection: 'row', columnGap: 12, alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: '#421984',
            width: 52,
            height: 52,
            borderRadius: 11,
            position: 'relative',
            alignItems: 'center',
            paddingTop: 5,
          }}>
          <LogoUrduSm />
          <View
            style={{
              //   height: 13,
              backgroundColor: '#824FD4',
              borderBottomLeftRadius: 11,
              borderBottomRightRadius: 11,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 15,
            }}>
            <Text style={{fontSize: 8, color: '#FFFFFF', fontWeight: '700'}}>
              madrasa
            </Text>
          </View>
        </View>

        <View>
          <View
            style={{flexDirection: 'row', columnGap: 6, alignItems: 'center'}}>
            {/* Title 3-bold */}
            <Title3Bold>Madrasa App</Title3Bold>
            <View
              style={{
                backgroundColor: '#F0EAFB',
                width: 28,
                height: 17,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
              }}>
              <CaptionBold color="primary">V1</CaptionBold>
            </View>
          </View>
          <Divider height={4} />
          <Body2Medium color="secondary">
            2025-2026 Madrasa. All Right Registered
          </Body2Medium>
        </View>
      </View>
      <Divider height={14} />
      {isWide ? (
        <View
          style={{
            flexDirection: 'row',
            columnGap: 12,
            width: '100%',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={navigateToTerms} activeOpacity={0.7}>
            <TnCGraphicWide />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToPrivacy} activeOpacity={0.7}>
            <PrivacyPolicyGraphicWide />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            columnGap: 12,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={navigateToTerms} activeOpacity={0.7}>
            <TnCGraphic />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToPrivacy} activeOpacity={0.7}>
            <PrivacyPolicyGraphic />
          </TouchableOpacity>
        </View>
      )}
      <Divider height={24} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: 6,
        }}>
        <Body2Medium color="sub-heading">Powered by</Body2Medium>
        <LogoUrduSmPurple />
      </View>
    </View>
  );
};

export default AppVersion;
