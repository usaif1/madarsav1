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
  Dimensions,
} from 'react-native';
import CompassHeading from 'react-native-compass-heading';
import geomagnetism from 'geomagnetism';
import Geolocation from '@react-native-community/geolocation';

// components
import {FindMosqueButton, NextSalah} from './components/compass';
import {Divider} from '@/components';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import GeographicDetails from './components/compass/GeographicDetails';
import QiblaIndicator from './components/compass/QiblaIndicator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Body1Title2Bold, Body2Medium} from '@/components/Typography/Typography';

// ─────────── CONSTANTS ───────────
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

// Function to normalize heading based on device orientation
function normalizeHeading(heading: number, orientation: string): number {
  // Default orientation (portrait, home button down)
  let normalizedHeading = heading;

  // Adjust heading based on device orientation
  switch (orientation) {
    case 'LANDSCAPE-LEFT': // USB port towards right
      normalizedHeading = (heading + 90) % 360;
      break;
    case 'LANDSCAPE-RIGHT': // USB port towards left
      normalizedHeading = (heading - 90 + 360) % 360;
      break;
    case 'PORTRAIT-UPSIDEDOWN': // USB port up
      normalizedHeading = (heading + 180) % 360;
      break;
    default: // PORTRAIT (USB port down)
      normalizedHeading = heading;
  }

  return normalizedHeading;
}

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
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  /* state */
  const [coords, setCoords] = useState<{lat: number; lon: number} | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [magHeading, setMagHeading] = useState(0); // magnetic °
  const [decl, setDecl] = useState(0); // local declination °
  const [trueHeading, setTrueHeading] = useState(0);
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [orientation, setOrientation] = useState('PORTRAIT');

  // Update orientation when dimensions change
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
      const isLandscape = window.width > window.height;
      setOrientation(isLandscape ? 'LANDSCAPE-LEFT' : 'PORTRAIT');
    });

    return () => subscription.remove();
  }, []);

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
    const DELTA_DEG = 0.1;
    let lastHeading = 0;
    const filterCoefficient = 0.1;
    let lastFilteredHeading = 0;
    
    CompassHeading.start(DELTA_DEG, ({heading}: {heading: number}) => {
      // Normalize heading based on device orientation
      const normalizedHeading = normalizeHeading(heading, orientation);
      
      // Apply low-pass filter
      let filteredHeading = normalizedHeading;
      
      if (lastHeading !== 0) {
        if (Math.abs(normalizedHeading - lastFilteredHeading) > 180) {
          if (normalizedHeading > lastFilteredHeading) {
            lastFilteredHeading += 360;
          } else {
            filteredHeading += 360;
          }
        }
        
        filteredHeading = lastFilteredHeading + filterCoefficient * (filteredHeading - lastFilteredHeading);
        filteredHeading = filteredHeading % 360;
      }
      
      lastHeading = normalizedHeading;
      lastFilteredHeading = filteredHeading;
      
      setMagHeading(filteredHeading);
      const trueH = (filteredHeading + decl + 360) % 360;
      setTrueHeading(trueH);

      // Update rotation animation
      Animated.spring(rotateAnim, {
        toValue: -trueH,
        friction: 12,
        tension: 8,
        useNativeDriver: true,
        restSpeedThreshold: 0.01,
        restDisplacementThreshold: 0.01
      }).start();
    });
    return () => CompassHeading.stop();
  }, [decl, rotateAnim, orientation]);

  /* rotations */
  const rotate = rotateAnim.interpolate({
    inputRange: [-360, 0],
    outputRange: ['-360deg', '0deg'],
  });
  
  // Calculate qibla angle using normalized heading
  const qiblaAngle = qiblaBearing != null ? (qiblaBearing - magHeading + 360) % 360 : 0;

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
            <CdnSvg 
              path={DUA_ASSETS.COMPASS_BACKGROUND} 
              width={300} 
              height={300} 
              style={styles.compass} 
            />
            {/* <CdnSvg 
              path={DUA_ASSETS.COMPASS_CENTER} 
              width={100} 
              height={100} 
              style={styles.compassCenter} 
            /> */}
          </Animated.View>

          {qiblaBearing !== null && (
            <QiblaIndicator angle={qiblaAngle} compassRadius={150} />
          )}
          
          {/* Debug info - uncomment for testing */}
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
