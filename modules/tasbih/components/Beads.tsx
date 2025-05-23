import React, {useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import svgPathProperties from 'svg-path-properties';
import rosaryBead from '@/assets/tasbih/rosaryBead.png';
import {Body1Title2Regular, H3Bold} from '@/components';

interface BeadsProps {
  totalCount?: number; // 33 by default
  currentCount?: number; // current index (0-based)
  onAdvance?: () => void; // callback when bead moves
}

const ITEM = 64; // bead img size

const Beads: React.FC<BeadsProps> = ({
  totalCount = 33,
  currentCount = 0,
  onAdvance,
}) => {
  /* 1️⃣ build a curved path */
  const {width} = useWindowDimensions();
  const threadW = Math.min(width - 32, 380);
  const pathD = `M0 90 Q ${threadW * 0.5} 0 ${threadW} 90`;
  const path = svgPathProperties(pathD); // function → helper object
  const LEN = path.getTotalLength();

  /* 2️⃣ shared progress 0-1 */
  const progress = useSharedValue((currentCount % totalCount) / totalCount);

  /* 3️⃣ map progress → (x,y) */
  const beadStyle = useAnimatedStyle(() => {
    const {x, y} = path.getPointAtLength(progress.value * LEN);
    return {
      transform: [{translateX: x - ITEM / 2}, {translateY: y - ITEM / 2}],
    };
  });

  /* 4️⃣ advance handler */
  const moveNext = useCallback(() => {
    progress.value = withTiming((progress.value + 1 / totalCount) % 1, {
      duration: 120,
      easing: Easing.out(Easing.quad),
    });
    onAdvance?.();
  }, [progress, totalCount, onAdvance]);

  /* 5️⃣ swipe gesture */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, g) => {
        if (g.dx > 40) moveNext();
      },
    }),
  ).current;

  return (
    <View style={styles.root} {...panResponder.panHandlers}>
      {/* counter header */}
      <View style={styles.counter}>
        <H3Bold style={styles.curIdx}>{(currentCount % totalCount) + 1}</H3Bold>
        <Body1Title2Regular style={styles.slash}>/</Body1Title2Regular>
        <Body1Title2Regular style={styles.total}>
          {totalCount}
        </Body1Title2Regular>
      </View>

      {/* thread curve */}
      <Svg width={threadW} height={120}>
        <Path d={pathD} stroke="#D0D0D0" strokeWidth={2} fill="none" />
      </Svg>

      {/* bead */}
      <Pressable onPress={moveNext} style={StyleSheet.absoluteFill}>
        <Animated.Image
          source={rosaryBead}
          resizeMode={FastImage.resizeMode.contain}
          style={[styles.bead, beadStyle]}
        />
      </Pressable>

      <Body1Title2Regular style={styles.hint}>
        Tap or swipe to count
      </Body1Title2Regular>
    </View>
  );
};

export default Beads;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  root: {width: '100%', alignItems: 'center', paddingTop: 16},
  bead: {
    position: 'absolute',
    width: ITEM,
    height: ITEM,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-start',
    marginLeft: 24,
  },
  curIdx: {fontSize: 36, color: '#8A57DC', fontWeight: '700'},
  slash: {fontSize: 26, color: '#888', marginHorizontal: 2},
  total: {fontSize: 26, color: '#888'},
  hint: {marginTop: 20, color: '#666', fontSize: 16, textAlign: 'center'},
});
