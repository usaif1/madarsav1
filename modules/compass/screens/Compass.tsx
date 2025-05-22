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
} from 'react-native';
import CompassHeading from 'react-native-compass-heading';
import geomagnetism from 'geomagnetism';
import Geolocation from '@react-native-community/geolocation';

// components
import {FindMosqueButton, NextSalah} from './components/compass';
import CompassSvg from '@/assets/compass/compass.svg';
import {Divider} from '@/components';
import GeographicDetails from './components/compass/GeographicDetails';
import QiblaIndicator from './components/compass/QiblaIndicator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
    const DELTA_DEG = 3;
    CompassHeading.start(DELTA_DEG, ({heading}) => {
      setMagHeading(heading);
      const trueH = (heading + decl + 360) % 360;
      setTrueHeading(trueH);

      Animated.timing(rotateAnim, {
        toValue: trueH,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    });
    return () => CompassHeading.stop();
  }, [decl, rotateAnim]);

  /* rotations */
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
  const qiblaAngle =
    qiblaBearing != null ? (360 - trueHeading + qiblaBearing) % 360 : 0;

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

          {qiblaBearing !== null && (
            <QiblaIndicator angle={qiblaAngle} compassRadius={150} />
          )}
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
});

export default Compass;
