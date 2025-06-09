// dependencies
import {Text, View, TouchableOpacity, useWindowDimensions} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserStackParamList } from '../../navigation/user.navigator';

// components
import {Divider} from '@/components';
import {Body2Medium, CaptionBold, Title3Bold} from '@/components';
import { CdnSvg } from '@/components/CdnSvg';
import { scale } from '@/theme/responsive';

// store
import {useThemeStore} from '@/globalStore';

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
            width: scale(42),
            height: scale(42),
            borderRadius: 11,
            position: 'relative',
            alignItems: 'center',
            paddingTop: 5,
          }}>
          <CdnSvg 
            path="/assets/logo_urdu_small.svg" 
            width={scale(32)} 
            height={scale(32)} 
            style={{ marginTop: -8}}
          />
          <View
            style={{
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
          <View style={{flexDirection: 'row', columnGap: 6, alignItems: 'center'}}>
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
          <Body2Medium style={{fontSize: 12}} color="secondary">
            2025-2026 Madrasa. All Right Registered
          </Body2Medium>
        </View>
      </View>
      <Divider height={10} />
      {isWide ? (
        <View
          style={{
            flexDirection: 'row',
            columnGap: 12,
            width: '100%',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={navigateToTerms} activeOpacity={0.7}>
            <CdnSvg 
              path="/assets/profile/TnCGraphicWide.svg" 
              width={164} 
              height={80} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToPrivacy} activeOpacity={0.7}>
            <CdnSvg 
              path="/assets/profile/PrivacyPolicyGraphicWide.svg" 
              width={164} 
              height={80} 
            />
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
            <CdnSvg 
              path="/assets/profile/TnCGraphic.svg" 
              width={164} 
              height={80} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToPrivacy} activeOpacity={0.7}>
            <CdnSvg 
              path="/assets/profile/PrivacyPolicyGraphic.svg" 
              width={164} 
              height={80} 
            />
          </TouchableOpacity>
        </View>
      )}
      <Divider height={2} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: 6,
        }}>
        <Body2Medium style={{fontSize: 12}} color="sub-heading">Powered by</Body2Medium>
        <CdnSvg 
          path="/assets/logo_urdu_small_purple.svg" 
          width={scale(36)} 
          height={scale(36)} 
        />
      </View>
    </View>
  );
};

export default AppVersion;