import React, { useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Pressable, 
  useWindowDimensions, 
  Text, 
  PanResponder
} from 'react-native';
import FastImage from 'react-native-fast-image';
import rosaryBead from '@/assets/tasbih/rosaryBead.png';
import { Body1Title2Bold, Body1Title2Regular, H3Bold } from '@/components';

interface BeadsProps {
  count?: number;
  activeIndex?: number;
  onAdvance?: () => void;
  totalCount?: number;
  currentCount?: number;
}

const DEFAULT_BEAD_COUNT = 8;

const Beads: React.FC<BeadsProps> = ({
  count = DEFAULT_BEAD_COUNT,
  activeIndex = 0,
  onAdvance,
  totalCount = 33,
  currentCount = 0
}) => {
  const { width } = useWindowDimensions();

  // Responsive scaling for the thread
  const threadWidth = Math.min(width - 32, 380);

  // Animation values for each bead
  const beadAnims = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;

  // Calculate bead positions along the thread
  const beadPositions = Array.from({ length: count }, (_, i) => {
    const progress = i / (count - 1);
    const angle = Math.PI / 4 + (progress * Math.PI / 2);
    return {
      left: 32 + progress * (threadWidth - 64),
      top: 40 + Math.sin(angle) * 30,
    };
  });

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          if (onAdvance) onAdvance();
        }
      },
    })
  ).current;

  // Animate bead on advance
  useEffect(() => {
    beadAnims.forEach((anim, i) => {
      if (i !== activeIndex) {
        anim.setValue(0);
      }
    });
    // Animate active bead
    Animated.sequence([
      Animated.timing(beadAnims[activeIndex], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(beadAnims[activeIndex], {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Counter header: index/total, then round */}
      <View style={styles.counterHeader}>
        <View style={styles.counterIndexRow}>
          <H3Bold style={styles.currentIndex}>{activeIndex + 1}</H3Bold>
          <Body1Title2Bold style={styles.slash}>/</Body1Title2Bold>
          <Body1Title2Bold style={styles.totalCount}>{totalCount}</Body1Title2Bold>
        </View>
        <Body1Title2Regular style={styles.roundText}>Round {Math.floor(activeIndex / count) + 1}</Body1Title2Regular>
      </View>

      {/* Thread and beads */}
      <View style={[styles.threadWrap, { width: threadWidth }]}> 
        <View style={[styles.threadLine, { width: threadWidth }]} />
        {beadPositions.map((pos, idx) => {
          const isActive = idx === activeIndex;
          const translateX = beadAnims[idx].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20],
          });
          return (
            <Pressable
              key={`bead-${idx}`}
              onPress={() => isActive && onAdvance && onAdvance()}
              style={[
                styles.beadWrap,
                { left: pos.left - 24, top: pos.top - 24 },
              ]}
            >
              <Animated.View
                style={[
                  styles.bead,
                  isActive && styles.activeBead,
                  { transform: [{ translateX }] },
                ]}
              >
                <FastImage
                  source={rosaryBead}
                  style={styles.beadImg}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </Animated.View>
            </Pressable>
          );
        })}
      </View>

      <Body1Title2Regular color="sub-heading" style={styles.swipeHint}>Click or swipe to count</Body1Title2Regular>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  counterHeader: {
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: 8,
  },
  counterIndexRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currentIndex: {
    fontSize: 38,
    color: '#8A57DC',
    fontWeight: '700',
    marginRight: 2,
  },
  slash: {
    fontSize: 32,
    color: '#888',
    fontWeight: '700',
    marginRight: 2,
  },
  totalCount: {
    fontSize: 32,
    color: '#888',
    fontWeight: '700',
  },
  roundText: {
    fontSize: 18,
    color: '#222',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 0,
    marginLeft: 2,
  },
  threadWrap: {
    height: 120,
    position: 'relative',
    marginVertical: 16,
  },
  threadLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#aaa',
    top: 50,
  },
  beadWrap: {
    position: 'absolute',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  bead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beadImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  activeBead: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  swipeHint: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default Beads;