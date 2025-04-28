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
import Thread from '@/assets/tasbih/thread.svg';
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

  // Calculate bead positions along the SVG thread curve
  // For demonstration, let's assume the thread SVG is a simple quadratic Bezier curve from (x1,y1) to (x2,y2) with control point (cx,cy)
  // You can adjust these values to match your actual SVG
  const x1 = 32, y1 = 80;
  const x2 = threadWidth - 32, y2 = 80;
  const cx = threadWidth / 2, cy = 10; // Control point for curve
  function getQuadraticBezierXY(t: number, sx: number, sy: number, cx: number, cy: number, ex: number, ey: number) {
    return {
      x: Math.pow(1 - t, 2) * sx + 2 * (1 - t) * t * cx + Math.pow(t, 2) * ex,
      y: Math.pow(1 - t, 2) * sy + 2 * (1 - t) * t * cy + Math.pow(t, 2) * ey,
    };
  }
  const beadPositions = Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const pos = getQuadraticBezierXY(t, x1, y1, cx, cy, x2, y2);
    return {
      left: pos.x - 24,
      top: pos.y - 24,
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
    <View style={[styles.container, { paddingTop: 16 }]} {...panResponder.panHandlers}>
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
      <View style={[styles.threadWrap, { width: threadWidth, height: 120 }]} > 
        {/* SVG thread curve */}
        <Thread width={threadWidth} height={120} style={styles.threadSvg} />
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
                { left: pos.left, top: pos.top },
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
    paddingHorizontal: 16,
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
  threadSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  top: 50,
Radius: 20,
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