import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation, CompositeNavigationProp, CommonActions} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {ParentStackParamList} from '@/navigator/ParentNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ColorPrimary} from '@/theme/lightColors';
import {scale, verticalScale} from '@/theme/responsive';
import {Title3Bold, Body2Medium} from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { useAuthStore } from '@/modules/auth/store/authStore';
import tokenService from '@/modules/auth/services/tokenService';
import { mmkvStorage } from '@/modules/auth/storage/mmkvStorage';
import { User } from '@/modules/auth/store/authStore';
import { useLocationData } from '@/modules/location/hooks/useLocationData';

interface HomeHeaderProps {
  locationText?: string;
  notificationCount?: number;
  onLocationPress?: () => void;
}

// Define local navigation param list for the home tab navigator
type HomeTabParamList = {
  profile: { screen: string };
  profileNotLoggedIn: { screen: string };
  auth: undefined;
  user: { screen: string };
  
  home: undefined;
  maktab: undefined;
  'al-quran': undefined;
};

// Create a composite navigation prop that can navigate in both navigators
type NavigationProp = NativeStackNavigationProp<ParentStackParamList>;

const HomeHeader: React.FC<HomeHeaderProps> = ({
  locationText: propLocationText,
  notificationCount = 1,
  onLocationPress,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const resetAuthStore = useAuthStore((state) => state.resetAuthStore);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setIsSkippedLogin = useAuthStore((state) => state.setIsSkippedLogin);
  const user = useAuthStore((state) => state.user);
  
  // Get location data
  const { 
    loading: locationLoading, 
    usingFallback,
    fallbackSource,
    latitude,
    longitude,
    requestPreciseLocation,
    getDisplayLocation,
  } = useLocationData();
  
  // Determine location text to display
  const [locationText, setLocationText] = useState<string>(propLocationText || 'Get accurate namaz time');
  
  // Update location text when location changes
  useEffect(() => {
    const displayLocation = getDisplayLocation();
    console.log('📍 HomeHeader location data:', { 
      displayLocation, 
      loading: locationLoading, 
      usingFallback, 
      fallbackSource, 
      latitude, 
      longitude 
    });
    
    if (propLocationText) {
      console.log('📍 Setting location text to prop:', propLocationText);
      setLocationText(propLocationText);
    } else if (displayLocation && displayLocation !== 'Location not available') {
      console.log('📍 Setting location text to display location:', displayLocation);
      setLocationText(displayLocation);
    } else {
      console.log('📍 Setting default location text');
      setLocationText('Get accurate namaz time');
    }
  }, [getDisplayLocation, propLocationText, latitude, longitude, usingFallback, fallbackSource]);
  
  // Handle location press
  const handleLocationPress = async () => {
    if (onLocationPress) {
      onLocationPress();
      return;
    }
    
    // If we're using fallback location or don't have a location yet,
    // request precise location permission
    if (usingFallback || !latitude || !longitude) {
      try {
        const granted = await requestPreciseLocation();
        if (!granted) {
          Alert.alert(
            'Location Permission',
            'Please enable location services to get accurate prayer times for your area.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error requesting location permission:', error);
      }
    }
  };
  // Handle user profile press - navigate to profile then logout
  const handleUserProfilePress = async () => {
    console.log('User profile pressed - navigating to profile');
    
    try {
      // First navigate to the user profile screen
      // This needs to be done before logout since we're using a protected navigator
      // The 'user' screen is defined in ParentStackParamList
      if (user) {
        navigation.navigate('user', { screen: 'profile' });
      } else {
        navigation.navigate('user', { screen: 'profileNotLoggedIn' });
      }
      
      // Navigate to the auth flow by resetting navigation stack
      // This ensures we don't have any previous screens in the history
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [{ name: 'auth' }],
      //   })
      // );
    } catch (error) {
      console.error('Navigation failed:', error);
      Alert.alert('Navigation Failed', 'Could not navigate to profile. Please try again.');
    }
  };

  return (
    <View style={[styles.header, {paddingTop: insets.top}]}>
      <View style={styles.headerContent}>
        {/* User Info Section */}
        <View style={styles.userInfo}>
          <TouchableOpacity 
            style={styles.userImageContainer}
            onPress={handleUserProfilePress}
            activeOpacity={0.8}
          >
            <FastImage
              source={user?.photoUrl ? 
                { uri: user.photoUrl, priority: FastImage.priority.high } : 
                { uri: 'https://cdn.madrasaapp.com/assets/home/blank-profile-picture.png' }
              }
              style={styles.userImage}
              resizeMode={FastImage.resizeMode.cover}
            />
            {/* Menu Icon positioned on the bottom right of the image */}
            <View style={styles.menuIconContainer}>
              <CdnSvg path="/assets/home/nav-ptofile-menu.svg" width={12} height={12} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.userTextContainer}>
            <Title3Bold color="white">{user?.name || 'User'}</Title3Bold>
            <TouchableOpacity 
              style={styles.locationContainer}
              onPress={handleLocationPress}
              activeOpacity={0.7}
            >
              <CdnSvg path="/assets/home/map-pin-fill.svg" width={14} height={14} />
              {locationLoading ? (
                <ActivityIndicator size="small" color="#F9F6FF" style={styles.locationLoader} />
              ) : (
                <Body2Medium 
                  style={[styles.locationText, usingFallback && styles.locationTextEstimated]}
                  numberOfLines={1}
                >
                  {locationText}
                </Body2Medium>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Notification Bell */}
        <View style={styles.bellContainer}>
          <CdnSvg path="/assets/home/Bell-fill.svg" width={24} height={24} />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCount}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#411B7F',
    paddingBottom: scale(12),
  },
  headerContent: {
    height: verticalScale(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    gap: scale(12),
  },
  userInfo: {
    height: verticalScale(40),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  userImageContainer: {
    position: 'relative',
    width: scale(40),
    height: scale(40),
    borderRadius: scale(24),
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
  userTextContainer: {
    justifyContent: 'center',
    width: scale(243),
    height: verticalScale(24),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(14),
  },
  locationText: {
    marginLeft: scale(4),
    fontSize: scale(12),
    lineHeight: scale(14.4),
    fontFamily: 'Geist-Medium',
    fontWeight: '500',
    color: ColorPrimary.primary200,
    textAlign: 'center',
    maxWidth: scale(220), // Limit width to prevent overflow
  },
  locationTextEstimated: {
    // Slightly different style for estimated locations
    fontStyle: 'italic',
    color: '#F9F6FF',
  },
  locationLoader: {
    marginLeft: scale(4),
  },
  bellContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -4,
    width: scale(16),
    height: scale(16),
    borderRadius: scale(20),
    backgroundColor: '#D92D20', // Error main color
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    width: scale(16),
    height: scale(16),
    fontSize: scale(11.43),
    lineHeight: scale(16),
    fontFamily: 'Geist-Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default HomeHeader;
