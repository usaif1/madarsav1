import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import CompassHeading from 'react-native-compass-heading';
import Geolocation from '@react-native-community/geolocation';
import Svg, {Circle, Line} from 'react-native-svg';
import geomagnetism from 'geomagnetism';
import QiblaIndicator from './components/compass/QiblaIndicator';

/* --- Kaaba coordinates --- */
const MAKKAH_LAT = 21.4225;
const MAKKAH_LON = 39.8262;

/* --- Bearing from (lat,lon) to Kaaba (true-north) --- */
function qiblaBearing(lat: number, lon: number): number {
  const φ1 = (lat * Math.PI) / 180;
  const φ2 = (MAKKAH_LAT * Math.PI) / 180;
  const Δλ = ((MAKKAH_LON - lon) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = (Math.atan2(y, x) * 180) / Math.PI;
  return (θ + 360) % 360;
}

/* --- Android runtime permission helper --- */
async function requestLocation(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location permission',
      message: 'We need your location to calculate accurate Qibla direction.',
      buttonPositive: 'OK',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

const QiblaCompass: React.FC = () => {
  const [magHeading, setMagHeading] = useState(0); // magnetic heading °
  const [declination, setDeclination] = useState(0); // local declination °
  const [qibla, setQibla] = useState<number | null>(null);

  /* ---- acquire location once & compute declination + bearing ---- */
  useEffect(() => {
    (async () => {
      if (!(await requestLocation())) return;

      Geolocation.getCurrentPosition(
        ({coords}) => {
          const {latitude, longitude} = coords;

          // 1) Qibla bearing (true)
          setQibla(qiblaBearing(latitude, longitude));

          // 2) Magnetic declination at that point
          const modelPoint = geomagnetism.model().point([latitude, longitude]);
          setDeclination(modelPoint.decl); // `decl` already in degrees
        },
        err => console.warn('Location error', err),
        {enableHighAccuracy: true, timeout: 15000},
      );
    })();
  }, []);

  /* ---- start compass sensor (tilt-compensated) ---- */
  useEffect(() => {
    const DEGREE_DELTA = 3; // callback threshold
    CompassHeading.start(DEGREE_DELTA, ({heading}: {heading: any}) => {
      setMagHeading(heading); // magnetic heading °
    });
    return () => CompassHeading.stop();
  }, []);

  /* ---- convert magnetic heading → true heading ---- */
  const trueHeading = (magHeading + declination + 360) % 360;

  /* ---- rotation needed for Qibla arrow ---- */
  const rotation = qibla !== null ? (qibla - trueHeading + 360) % 360 : 0;
  const transformStr = `rotate(${rotation}, 150, 150)`;

  // return <QiblaIndicator angle={qibla} compassRadius={150} />;

  return (
    <View style={styles.root}>
      <Svg height="300" width="300">
        {/* fixed compass face */}
        <Circle
          cx="150"
          cy="150"
          r="140"
          stroke="#000"
          strokeWidth="2"
          fill="#fafafa"
        />
        <Line
          x1="150"
          y1="150"
          x2="150"
          y2="10"
          stroke="#888"
          strokeWidth="2"
        />
        <Text style={styles.nLabel}>N</Text>

        {/* Qibla arrow */}
        {qibla !== null && (
          <Line
            x1="150"
            y1="150"
            x2="150"
            y2="40"
            stroke="green"
            strokeWidth="4"
            transform={transformStr}
          />
        )}
      </Svg>

      {qibla !== null && (
        <Text style={styles.subtitle}>
          Qibla&nbsp;{Math.round(qibla)}° | Decl&nbsp;
          {declination.toFixed(1)}°
        </Text>
      )}
    </View>
  );
};

export default QiblaCompass;

/* ---- styles ---- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  nLabel: {position: 'absolute', top: 6, left: 143, fontWeight: '700'},
  subtitle: {marginTop: 18, fontSize: 15, fontWeight: '600'},
});
