import {Text, View} from 'react-native';
import React from 'react';

// assets
import LogoUrduSm from '@/assets/logo_urdu_small.svg';
import {Divider} from '@/components';

const AppVersion = () => {
  return (
    <View style={{padding: 20}}>
      <View style={{flexDirection: 'row', columnGap: 12, alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: '#421984',
            width: 52,
            height: 52,
            borderRadius: 11,
            position: 'relative',
            alignItems: 'center',
            paddingTop: 5,
          }}>
          <LogoUrduSm />
          <View
            style={{
              //   height: 13,
              backgroundColor: '#824FD4',
              borderBottomLeftRadius: 11,
              borderBottomRightRadius: 11,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 15,
            }}>
            <Text style={{fontSize: 8, color: '#FFFFFF', fontWeight: '700'}}>
              madrasa
            </Text>
          </View>
        </View>

        <View>
          <View
            style={{flexDirection: 'row', columnGap: 6, alignItems: 'center'}}>
            {/* Title 3-bold */}
            <Text style={{fontSize: 17, fontWeight: '700'}}>Madrasa App</Text>
            <View
              style={{
                backgroundColor: '#F0EAFB',
                width: 28,
                height: 17,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 10, fontWeight: '700', color: '#6D2DD3'}}>
                V1
              </Text>
            </View>
          </View>
          <Divider height={4} />
          <Text style={{color: '#808080', fontWeight: '500'}}>
            2025-2026 Madrasa. All Right Registered
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AppVersion;
