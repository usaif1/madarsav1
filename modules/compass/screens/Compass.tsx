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
import FastImage from 'react-native-fast-image';
import CompassHeading from 'react-native-compass-heading';
import geomagnetism from 'geomagnetism';
import { useLocationData } from '@/modules/location/hooks/useLocationData';

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

// ─────────── CUSTOM COMPASS COMPONENT ───────────
interface CustomCompassProps {
  rotate: Animated.AnimatedInterpolation<string>;
}

const CustomCompass: React.FC<CustomCompassProps> = ({ rotate }) => {
  return (
    <View style={styles.compassWrapper}>
      {/*  Rotating Frame */}
      <Animated.View style={[styles.compassFrame, {transform: [{rotate}]}]}>
        <FastImage 
          source={require('@/assets/compass-frame.png')} 
          style={styles.compassFrameImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      </Animated.View>
      
      {/* Fixed Center */}
      <View style={styles.compassCenter}>
        <FastImage 
          source={require('@/assets/compass-center.png')} 
          style={styles.compassCenterImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    </View>
  );
};

// ─────────── COMPONENT ───────────
const Compass: React.FC = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const {bottom} = useSafeAreaInsets();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  // Get location from store
  const { latitude, longitude, loading: locationLoading, error: locationError } = useLocationData();

  /* state */
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

  /* ---- calculate qibla bearing when location changes ---- */
  useEffect(() => {
    if (latitude && longitude) {
      setQiblaBearing(getQiblaBearing(latitude, longitude));
      setDecl(geomagnetism.model().point([latitude, longitude]).decl);
    }
  }, [latitude, longitude]);

  /* ---- start compass sensor ---- */
  useEffect(() => {
    const DELTA_DEG = 0.05; // Reduced for smoother updates
    let lastHeading = 0;
    const filterCoefficient = 0.15; // Reduced for smoother filtering
    let lastFilteredHeading = 0;
    
    CompassHeading.start(DELTA_DEG, ({heading}: {heading: number}) => {
      // Normalize heading based on device orientation
      const normalizedHeading = normalizeHeading(heading, orientation);
      
      // Apply enhanced low-pass filter for smoother transitions
      let filteredHeading = normalizedHeading;
      
      if (lastHeading !== 0) {
        // Handle angle wrapping more smoothly
        let diff = normalizedHeading - lastFilteredHeading;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        
        filteredHeading = lastFilteredHeading + filterCoefficient * diff;
        filteredHeading = (filteredHeading + 360) % 360;
      }
      
      lastHeading = normalizedHeading;
      lastFilteredHeading = filteredHeading;
      
      setMagHeading(filteredHeading);
      const trueH = (filteredHeading + decl + 360) % 360;
      setTrueHeading(trueH);

      // Update rotation animation with enhanced spring configuration for smoothness
      Animated.spring(rotateAnim, {
        toValue: -trueH,
        friction: 12, // Increased for smoother motion
        tension: 8, // Reduced for less aggressive animation
        useNativeDriver: true,
        restSpeedThreshold: 0.0005, // Reduced for finer precision
        restDisplacementThreshold: 0.0005, // Reduced for finer precision
        velocity: 0.3, // Reduced for smoother start
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
  if (locationLoading) {
    return (
      <View style={[styles.topContainer, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#6D2DD3" />
        <Text style={styles.loadingText}>Getting your location…</Text>
      </View>
    );
  }
  if (locationError) {
    return (
      <View style={[styles.topContainer, styles.errorContainer]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>{locationError}</Text>
      </View>
    );
  }

  // ───── main render ─────
  return (
    <View style={styles.topContainer}>
      <StatusBar barStyle="light-content" />
      <NextSalah />

      <View style={styles.compassContainer}>
        <CustomCompass rotate={rotate} />

        {qiblaBearing !== null && (
          <QiblaIndicator angle={qiblaAngle} compassRadius={190} />
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
  compassFrame: {
    width: 280,
    height: 280,
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 373.33,
    borderWidth: 6,
    backgroundColor: '#F9F6FF',
    borderColor: '#E2D5F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassFrameImage: {
    width: 268,
    height: 268,
  },
  compassCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -75}, {translateY: -75}], // Adjusted for larger center
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassCenterImage: {
    width: 150, // Increased from 100
    height: 150, // Increased from 100
  },
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
