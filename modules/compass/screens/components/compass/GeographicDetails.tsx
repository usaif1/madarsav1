import {StyleSheet, View, ActivityIndicator, Text} from 'react-native';
import React from 'react';

// components
import {Body2Medium, Divider, Title3Bold} from '@/components';

// store
import {useThemeStore} from '@/globalStore';
import FastImage from 'react-native-fast-image';

// hooks
import {useQiblaDirection} from '@/api/hooks/useQibla';
import {useLocation} from '@/api/hooks/useLocation';

// Calculate distance between two coordinates in KM
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d);
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

const GeographicDetails: React.FC = () => {
  const {colors} = useThemeStore();
  const {latitude, longitude, loading: locationLoading, error: locationError} = useLocation();
  
  const {
    data: qiblaData,
    isLoading: qiblaLoading,
    error: qiblaError,
  } = useQiblaDirection(latitude || undefined, longitude || undefined);

  const isLoading = locationLoading || qiblaLoading;
  const error = locationError || (qiblaError ? qiblaError.message : null);

  // Calculate distance to Kaaba
  const distance = qiblaData && latitude && longitude
    ? calculateDistance(
        latitude,
        longitude,
        qiblaData.coordinates.kaaba.latitude,
        qiblaData.coordinates.kaaba.longitude,
      )
    : null;

  // Get qibla direction
  const qiblaDirection = qiblaData ? Math.round(qiblaData.degrees) : null;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6D2DD3" />
        <Text style={styles.loadingText}>Getting qibla direction...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.metric, {backgroundColor: colors.accent.accent100}]}>
        <FastImage
          source={require('@/assets/compass/Kaaba.png')}
          resizeMode={FastImage.resizeMode.cover}
          style={{width: 34, height: 28}}
        />
        <Divider height={8} />
        <Title3Bold>{distance ? `${distance} KM` : 'Calculating...'}</Title3Bold>
        <Divider height={4} />
        <Body2Medium color="yellow-800">Distance to Kaaba</Body2Medium>
      </View>

      <View style={[styles.metric, {backgroundColor: colors.accent.accent100}]}>
        <FastImage
          source={require('@/assets/compass/compass_3d.png')}
          resizeMode={FastImage.resizeMode.cover}
          style={{width: 34, height: 28}}
        />
        <Divider height={8} />
        <Title3Bold>{qiblaDirection ? `${qiblaDirection}°` : 'Calculating...'}</Title3Bold>
        <Divider height={4} />
        <Body2Medium color="yellow-800">Device angle to Qibla</Body2Medium>
      </View>
    </View>
  );
};

export default GeographicDetails;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 12,
  },
  metric: {
    paddingHorizontal: 12,
    paddingVertical: 13,
    flex: 1,
    borderRadius: 10,
  },
  loadingContainer: {
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  loadingText: {
    marginTop: 8,
    color: '#6D2DD3',
    fontSize: 14,
  },
  errorContainer: {
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    fontSize: 14,
  },
});
