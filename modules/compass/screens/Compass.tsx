// dependencies
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, StatusBar, Animated, Easing, Text, ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import {
  magnetometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {map} from 'rxjs/operators';

// components
import {FindMosqueButton, NextSalah} from './components/compass';
import CompassSvg from '@/assets/compass/compass.svg';
import {Divider} from '@/components';
import GeographicDetails from './components/compass/GeographicDetails';
import QiblaIndicator from './components/compass/QiblaIndicator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Body1Title2Bold, Body2Medium} from '@/components/Typography/Typography';

// hooks
import {useQiblaDirection} from '../hooks/useQibla';

const Compass: React.FC = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const {bottom} = useSafeAreaInsets();
  const [currentHeading, setCurrentHeading] = useState<number>(0);
  
  // Get Qibla direction from API with built-in location handling
  const {
    data: qiblaData,
    isLoading: qiblaLoading,
    error: qiblaError,
    usingFallback,
    fallbackSource,
    refetch
  } = useQiblaDirection();

  // Log Qibla data for debugging
  useEffect(() => {
    console.log('Qibla data:', { 
      qiblaData, 
      qiblaLoading, 
      qiblaError,
      usingFallback,
      fallbackSource 
    });
  }, [qiblaData, qiblaLoading, qiblaError, usingFallback, fallbackSource]);

  const isLoading = qiblaLoading;
  const error = qiblaError ? (qiblaError instanceof Error ? qiblaError.message : String(qiblaError)) : null;

  // Get qibla direction angle
  const qiblaDirection = qiblaData ? qiblaData.degrees : null;

  // Calculate the angle to rotate the compass to point to Qibla
  const qiblaAngle = qiblaDirection ? (360 - currentHeading + qiblaDirection) % 360 : 0;

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 100);

    const subscription = magnetometer
      .pipe(
        map(({x, y}) => {
          // Calculate compass heading
          let heading = Math.atan2(y, x) * (180 / Math.PI);
          // Convert negative angles to positive
          if (heading < 0) {
            heading += 360;
          }
          // Reverse rotation for proper compass display
          return 360 - heading;
        }),
      )
      .subscribe(heading => {
        setCurrentHeading(heading);
        Animated.timing(rotateAnim, {
          toValue: heading,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      });

    return () => subscription.unsubscribe();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  if (isLoading) {
    return (
      <View style={[styles.topContainer, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#6D2DD3" />
        <Text style={styles.loadingText}>Getting your location and qibla direction...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.topContainer, styles.errorContainer]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.topContainer}>
      <StatusBar barStyle="light-content" />
      <NextSalah />

      {/* Fallback location notice */}
      {usingFallback && (
        <View style={styles.fallbackNotice}>
          <Body1Title2Bold color="warning">Using estimated location</Body1Title2Bold>
          <Body2Medium color="sub-heading" style={styles.fallbackText}>
            {fallbackSource?.includes('custom_') 
              ? `Using ${fallbackSource.replace('custom_', '')} as reference location` 
              : 'Using default location (Mecca)'}
          </Body2Medium>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Centered compass with rotation */}
      <View style={styles.compassContainer}>
        <View style={styles.compassWrapper}>
          <Animated.View style={[styles.compass, {transform: [{rotate}]}]}>
            <CompassSvg width={300} height={300} />
          </Animated.View>
          
          {/* Qibla direction indicator - outside the rotating view */}
          {qiblaDirection && (
            <QiblaIndicator 
              angle={qiblaAngle} 
              compassRadius={150} // Half of the compass width/height (300/2)
            />
          )}
        </View>
      </View>

      <Divider height={82} />
      <GeographicDetails />
      <View
        style={{
          position: 'absolute',
          bottom: bottom ? bottom : 10,
          width: '100%',
        }}>
        <FindMosqueButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  compassContainer: {
    paddingTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compassWrapper: {
    width: 300,
    height: 300,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compass: {
    width: 300,
    height: 300,
    position: 'relative',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: '#6D2DD3',
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  fallbackNotice: {
    backgroundColor: '#FEF9C3',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  fallbackText: {
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#8A57DC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Compass;
