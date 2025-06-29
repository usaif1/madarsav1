import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPrimary } from '@/theme/lightColors';
import { scale, verticalScale } from '@/theme/responsive';
import { Title3Bold } from '@/components/Typography/Typography';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';

const QuranHeader: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);

  // Handle user profile press - navigate to profile
  const handleUserProfilePress = () => {
    if (user) {
      // @ts-ignore - Fix navigation type
      navigation.navigate('user', { screen: 'profile' });
    } else {
      // @ts-ignore - Fix navigation type
      navigation.navigate('user', { screen: 'profileNotLoggedIn' });
    }
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        {/* Title */}
        <Title3Bold color="white">Al-Quran</Title3Bold>
        
        {/* User Profile */}
        <TouchableOpacity 
          style={styles.userImageContainer}
          onPress={handleUserProfilePress}
          activeOpacity={0.8}
        >
          <FastImage
            source={{ 
              uri: user?.photoUrl || user?.photo || getCdnUrl(DUA_ASSETS.DEFAULT_PROFILE_IMAGE),
              priority: FastImage.priority.normal,
            }}
            style={styles.userImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          {/* Menu Icon positioned on the bottom right of the image */}
          <View style={styles.menuIconContainer}>
            <CdnSvg 
              path={DUA_ASSETS.HAMBURGER_ICON}
              width={scale(12)}
              height={scale(12)}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: ColorPrimary.primary800,
    paddingBottom: scale(12),
  },
  headerContent: {
    height: verticalScale(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  userImageContainer: {
    position: 'relative',
    width: scale(40),
    height: scale(40),
  },
  userImage: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(24),
  },
  menuIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    borderWidth: 1,
    borderColor: ColorPrimary.primary200,
    backgroundColor: '#F9F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuranHeader;
