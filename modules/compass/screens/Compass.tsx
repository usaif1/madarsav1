// dependencies
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import CompassHeading from 'react-native-compass-heading';
import geomagnetism from 'geomagnetism';
import Geolocation from '@react-native-community/geolocation';

// components
import {FindMosqueButton, NextSalah} from './components/compass';
import CompassSvg from '@/assets/compass/compass.svg';
import CompassCenterSvg from '@/assets/compass/compass_center.svg';
import {Divider} from '@/components';
import GeographicDetails from './components/compass/GeographicDetails';
import QiblaIndicator from './components/compass/QiblaIndicator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Body1Title2Bold, Body2Medium} from '@/components/Typography/Typography';

// ─────────── CONSTANTS ───────────
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

// great-circle bearing to Kaaba (true north)
function getQiblaBearing(lat: number, lon: number) {
  const φ1 = (lat * Math.PI) / 180;
  const φ2 = (KAABA_LAT * Math.PI) / 180;
  const Δλ = ((KAABA_LON - lon) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = (Math.atan2(y, x) * 180) / Math.PI;
  return (θ + 360) % 360;
}

// ─────────── COMPONENT ───────────
const Compass: React.FC = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const {bottom} = useSafeAreaInsets();

  /* state */
  const [coords, setCoords] = useState<{lat: number; lon: number} | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [magHeading, setMagHeading] = useState(0); // magnetic °
  const [decl, setDecl] = useState(0); // local declination °
  const [trueHeading, setTrueHeading] = useState(0);
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);

  /* ---- one-shot location request ---- */
  useEffect(() => {
    Geolocation.getCurrentPosition(
      ({coords}) => {
        const {latitude, longitude} = coords;
        setCoords({lat: latitude, lon: longitude});
        setQiblaBearing(getQiblaBearing(latitude, longitude));
        setDecl(geomagnetism.model().point([latitude, longitude]).decl);
      },
      err => setLocError(err.message),
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000,
      },
    );
  }, []);

  /* ---- start compass sensor ---- */
  useEffect(() => {
    // Use an even smaller delta for smoother updates
    const DELTA_DEG = 0.1;
    
    // Improved low-pass filter configuration
    let lastHeading = 0;
    const filterCoefficient = 0.1; // Lower value for even smoother response
    let lastFilteredHeading = 0;
    
    CompassHeading.start(DELTA_DEG, ({heading}) => {
      // Apply enhanced low-pass filter for smoother heading
      let filteredHeading = heading;
      
      if (lastHeading !== 0) {
        // Enhanced 0/360 boundary handling
        if (Math.abs(heading - lastFilteredHeading) > 180) {
          if (heading > lastFilteredHeading) {
            lastFilteredHeading += 360;
          } else {
            filteredHeading += 360;
          }
        }
        
        // Double filtering for extra smoothness
        filteredHeading = lastFilteredHeading + filterCoefficient * (filteredHeading - lastFilteredHeading);
        filteredHeading = filteredHeading % 360;
      }
      
      lastHeading = heading;
      lastFilteredHeading = filteredHeading;
      
      setMagHeading(filteredHeading);
      // Calculate true heading by adding magnetic declination
      const trueH = (filteredHeading + decl + 360) % 360;
      setTrueHeading(trueH);

      // Enhanced spring animation for ultra-smooth movement
      Animated.spring(rotateAnim, {
        toValue: trueH,
        friction: 12, // Higher friction for more stability
        tension: 8, // Lower tension for smoother movement
        useNativeDriver: true,
        restSpeedThreshold: 0.01, // Lower threshold for smoother stops
        restDisplacementThreshold: 0.01
      }).start();
    });
    return () => CompassHeading.stop();
  }, [decl, rotateAnim]);

  /* rotations */
  // Fix the compass rotation to be correct (we need to invert it since we want the compass to rotate opposite to our movement)
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['360deg', '0deg'], // Inverted to make compass rotate correctly
  });
  
  // Calculate the qibla angle correctly
  // The qibla bearing is fixed relative to true north, while our heading changes as we rotate
  const qiblaAngle = qiblaBearing != null ? (qiblaBearing - trueHeading + 360) % 360 : 0;

  // ───── loading / error UI ─────
  if (!coords && !locError) {
    return (
      <View style={[styles.topContainer, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#6D2DD3" />
        <Text style={styles.loadingText}>Getting your location…</Text>
      </View>
    );
  }
  if (locError) {
    return (
      <View style={[styles.topContainer, styles.errorContainer]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>{locError}</Text>
      </View>
    );
  }

  // ───── main render ─────
  return (
    <View style={styles.topContainer}>
      <StatusBar barStyle="light-content" />
      <NextSalah />

      <View style={styles.compassContainer}>
        <View style={styles.compassWrapper}>
          <Animated.View style={[styles.compass, {transform: [{rotate}]}]}>
            <CompassSvg width={300} height={300} />
          </Animated.View>
          <View style={styles.compassCenter}>
            <CompassCenterSvg width={100} height={100} />
          </View>

          {qiblaBearing !== null && (
            <QiblaIndicator angle={qiblaAngle} compassRadius={150} />
          )}
          
          {/* Debug info - comment out in production */}
          {/* {__DEV__ && (
            <View style={styles.debugInfo}>
              <Text style={styles.debugText}>Mag: {magHeading.toFixed(1)}°</Text>
              <Text style={styles.debugText}>True: {trueHeading.toFixed(1)}°</Text>
              <Text style={styles.debugText}>Qibla: {qiblaBearing?.toFixed(1)}°</Text>
              <Text style={styles.debugText}>Angle: {qiblaAngle.toFixed(1)}°</Text>
            </View>
          )} */}
        </View>
      </View>

      <Divider height={82} />
      <GeographicDetails />

      <View
        style={{
          position: 'absolute',
          bottom: bottom || 10,
          width: '100%',
        }}>
        <FindMosqueButton />
      </View>
    </View>
  );
};

// ─────────── styles ───────────
const styles = StyleSheet.create({
  compassCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -55}, {translateY: -45}],
    zIndex: 2,
  },
  topContainer: {flex: 1, backgroundColor: '#FFFFFF'},
  compassContainer: {
    paddingTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassWrapper: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compass: {width: 300, height: 300},
  loadingContainer: {justifyContent: 'center', alignItems: 'center'},
  loadingText: {
    marginTop: 20,
    color: '#6D2DD3',
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {justifyContent: 'center', alignItems: 'center', padding: 20},
  errorText: {color: '#EF4444', fontSize: 16, textAlign: 'center'},
  debugInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
  },
});

export default Compass;
