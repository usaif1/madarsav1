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
      console.log('Navigating to profile with user:', user);
      // @ts-ignore - Fix navigation type
      navigation.navigate('user', { screen: 'profile' });
    } else {
      console.log('No user, navigating to not logged in profile');
      // @ts-ignore - Fix navigation type
      navigation.navigate('user', { screen: 'profileNotLoggedIn' });
    }
  };

  // Debug user profile image
  const profileImageUri = user?.photoUrl || 'https://cdn.madrasaapp.com/assets/home/blank-profile-picture.png';
  console.log('QuranHeader - User:', user);
  console.log('QuranHeader - Profile Image URI:', profileImageUri);
  console.log('QuranHeader - Hamburger Icon Path:', DUA_ASSETS.HAMBURGER_ICON_WHITE);

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
              uri: profileImageUri,
              priority: FastImage.priority.normal,
            }}
            style={styles.userImage}
            resizeMode={FastImage.resizeMode.cover}
            onError={() => {
              console.log('FastImage error loading profile image');
            }}
            onLoad={() => {
              console.log('FastImage loaded successfully');
            }}
          />
          {/* Menu Icon positioned on the bottom right of the image */}
          <View style={styles.menuIconContainer}>
            <CdnSvg 
              path="/assets/home/nav-ptofile-menu.svg"
              width={scale(10)}
              height={scale(10)}
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
    borderRadius: scale(20),
    backgroundColor: '#E5E5E5', // Fallback background color
  },
  menuIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#F9F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuranHeader;
