import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale, verticalScale } from '@/theme/responsive';
    
export default function HadithImageFooter() {
    return (
        <View style={styles.footerContainer}>
            <FastImage 
                source={{ uri: 'https://cdn.madrasaapp.com/assets/hadith/BottomFooter.png' }} 
                style={styles.footerImage}
                resizeMode={FastImage.resizeMode.contain}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        width: scale(375),
        height: verticalScale(221),
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerImage: {
        width: '100%',
        height: '100%',
    },
});