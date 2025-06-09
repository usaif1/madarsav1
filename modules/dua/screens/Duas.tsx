// dependencies
import {StatusBar, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';

// components
import {DuaSearchbar} from './components/Duas';
import DuaList from './components/Duas/DuaList';
import {Body1Title2Bold, Divider} from '@/components';

// components
import { CdnSvg } from '@/components/CdnSvg';

const Duas = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleSavedPress = () => {
    navigation.navigate('SavedDuas');
  };
  
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingTop: 10,
      }}>
      <StatusBar barStyle={'light-content'} />
      <View style={{paddingHorizontal: 18}}>
        <DuaSearchbar onSearchChange={handleSearchChange} />
      </View>
      <Divider height={10} />
      <View
        style={{
          backgroundColor: '#F9F6FF',
          paddingVertical: 5,
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
        <Body1Title2Bold color="primary">Daily Duas</Body1Title2Bold>
        <CdnSvg
          path={DUA_ASSETS.MANDALA_DUA}
          width={scale(100)}
          height={scale(100)}
          style={{
            position: 'absolute',
            left: 0,
            zIndex: 99,
            top: 0,
            transform: [{translateY: -56}],
          }}
        />
        <CdnSvg
          path={DUA_ASSETS.MANDALA_DUA}
          width={scale(100)}
          height={scale(100)}
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 99,
            top: 0,
            transform: [{scaleX: -1}, {translateY: -56}],
          }}
        />
      </View>
      <DuaList searchQuery={searchQuery} />
      <View style={styles.footerContainer}>
        <FastImage 
          source={{ uri: getCdnUrl(DUA_ASSETS.DUA_AYAH) }}
          style={styles.footerImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View
        style={{
          backgroundColor: '#F9F6FF',
          paddingVertical: 5,
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
        <Body1Title2Bold color="primary">Prayers</Body1Title2Bold>
        <CdnSvg
          path={DUA_ASSETS.MANDALA_DUA}
          width={scale(100)}
          height={scale(100)}
          style={{
            position: 'absolute',
            left: 0,
            zIndex: 99,
            top: 0,
            transform: [{translateY: -56}],
          }}
        />
        <CdnSvg
          path={DUA_ASSETS.MANDALA_DUA}
          width={scale(100)}
          height={scale(100)}
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 99,
            top: 0,
            transform: [{scaleX: -1}, {translateY: -56}],
          }}
        />
      </View>

      {/* Floating Saved Button */}
      <TouchableOpacity 
        style={styles.savedButton} 
        onPress={handleSavedPress}
        activeOpacity={0.8}
        accessibilityLabel="View saved duas"
        accessibilityRole="button"
      >
        <CdnSvg 
          path={DUA_ASSETS.BOOKMARK_WHITE}
          width={scale(16)}
          height={scale(16)}
        />
        <Body1Title2Bold color="white" style={{marginLeft: 8}}>Saved</Body1Title2Bold>
      </TouchableOpacity>
    </View>
  );
};

export default Duas;

const styles = StyleSheet.create({
    footerContainer: {
        width: scale(375),
        height: verticalScale(121),
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerImage: {
        width: '100%',
        height: '100%',
    },
    savedButton: {
        position: 'absolute',
        bottom: 40,
        right: 16,
        width: scale(89),
        height: verticalScale(40),
        borderRadius: 60,
        backgroundColor: '#000000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
});