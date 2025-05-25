import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  UIManager,
  Platform,
  Animated,
  LayoutAnimation,
  useWindowDimensions,
  AccessibilityInfo,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import rosaryBead from '@/assets/tasbih/rosaryBead.png';
import rosaryBeadWhite from '@/assets/tasbih/rosaryBeadWhite.png';
import Thread from '@/assets/tasbih/thread.svg';
import { Body1Title2Bold, Body1Title2Regular, H3Bold } from '@/components';

// Enable LayoutAnimation for Android with proper error handling
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  try {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  } catch (error) {
    console.warn('Failed to enable LayoutAnimation on Android:', error);
  }
}

interface BeadsProps {
  /** Total number of verses in current dua */
  totalVerses: number;
  /** Current verse index (0-based) */
  currentVerseIndex: number;
  /** Callback when bead is advanced */
  onAdvance: () => void;
  /** Current total counter across all cycles */
  totalCount?: number;
  /** Optional accessibility label for the component */
  accessibilityLabel?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether the bead is white */
  isWhite?: boolean;
}

interface BeadData {
  id: string;
  verseNumber: number;
  index: number;
}

// Constants for bead display and animation
const BEAD_SIZE = 40;
const ANIMATION_DURATION = 300;
const THREAD_PADDING = 32;
const MAX_THREAD_WIDTH = 380;
const MAX_RIGHT_BEADS = 3; // Maximum beads shown on right (completed) side

/**
 * Get the distribution of beads for left and right sides based on total verses
 * Logic: 
 * - 2 verses: 1 left, 1 right
 * - 3-6 verses: split evenly (3 left, 3 right for 6 verses)
 * - 7+ verses: always 4 left, 3 right (carousel behavior)
 */
const getBeadDistribution = (totalVerses: number): { leftCount: number; rightCount: number } => {
  if (totalVerses === 2) {
    return { leftCount: 1, rightCount: 1 };
  } else if (totalVerses <= 6) {
    const leftCount = Math.ceil(totalVerses / 2);
    const rightCount = totalVerses - leftCount;
    return { leftCount, rightCount };
  } else {
    return { leftCount: 4, rightCount: 3 };
  }
};

/**
 * Beads component with proper left/right separation and carousel logic
 * Displays prayer beads that move from left to right as verses are completed
 * 
 * Features:
 * - Proper left/right separation based on total verses
 * - Carousel behavior for 7+ verses
 * - Smooth animations with proper cleanup
 * - Error handling and edge case management
 * - Performance optimized with memoization
 * - Full accessibility support
 */
const Beads: React.FC<BeadsProps> = ({
  totalVerses,
  currentVerseIndex,
  onAdvance,
  totalCount = 0,
  accessibilityLabel,
  disabled = false,
  isWhite = false,
}) => {
  const { width } = useWindowDimensions();
  
  // Input validation
  const sanitizedTotalVerses = Math.max(1, totalVerses);
  const sanitizedCurrentIndex = Math.max(0, Math.min(currentVerseIndex, sanitizedTotalVerses - 1));
  const sanitizedTotalCount = Math.max(0, totalCount);
  
  // Get bead distribution
  const { leftCount, rightCount } = useMemo(() => 
    getBeadDistribution(sanitizedTotalVerses), 
    [sanitizedTotalVerses]
  );
  
  // State for animation and bead management
  const [leftBeads, setLeftBeads] = useState<number[]>([]);
  const [rightBeads, setRightBeads] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [movingBead, setMovingBead] = useState<number | null>(null);
  
  // Animation values with proper cleanup
  const animatedX = useRef(new Animated.Value(0)).current;
  const rightListTranslate = useRef(new Animated.Value(0)).current;
  
  // Memoized responsive sizing
  const threadWidth = useMemo(() => 
    Math.min(width - THREAD_PADDING, MAX_THREAD_WIDTH), 
    [width]
  );
  
  // Memoized current round calculation
  const currentRound = useMemo(() => 
    Math.floor(sanitizedTotalCount / sanitizedTotalVerses) + 1,
    [sanitizedTotalCount, sanitizedTotalVerses]
  );
  
  /**
   * Initialize bead lists based on current verse index and distribution
   */
  const initializeBeads = useCallback(() => {
    const left: number[] = [];
    const right: number[] = [];
    
    // Generate verse numbers starting from current verse
    for (let i = 0; i < leftCount; i++) {
      const verseNum = ((sanitizedCurrentIndex + i) % sanitizedTotalVerses) + 1;
      left.push(verseNum);
    }
    
    // Right side starts with some initial completed verses (can be empty initially)
    // This will be populated as user advances through verses
    
    setLeftBeads(left);
    setRightBeads(right);
  }, [sanitizedCurrentIndex, sanitizedTotalVerses, leftCount]);
  
  // Initialize beads on mount and when verse changes (but not during animation)
  useEffect(() => {
    if (!isAnimating) {
      initializeBeads();
    }
  }, [initializeBeads, isAnimating]);
  
  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      animatedX.stopAnimation();
      rightListTranslate.stopAnimation();
    };
  }, [animatedX, rightListTranslate]);
  
  /**
   * Calculate horizontal positions for beads in each section
   */
  const calculateBeadPositions = useCallback((
    count: number, 
    isRightSide: boolean = false
  ): { left: number; top: number }[] => {
    if (count <= 0) return [];
    
    const positions: { left: number; top: number }[] = [];
    const sectionWidth = (threadWidth - 60) / 2; // Split width, account for separator
    const spacing = count > 1 ? Math.min(50, sectionWidth / count) : 0;
    
    for (let i = 0; i < count; i++) {
      const progress = count > 1 ? i / (count - 1) : 0.5;
      
      let x: number;
      if (isRightSide) {
        // Right side: start from center-right
        x = (threadWidth / 2) + 30 + (i * spacing);
      } else {
        // Left side: end at center-left
        x = (threadWidth / 2) - 30 - ((count - 1 - i) * spacing);
      }
      
      // Curved path for visual appeal
      const y = 60 + Math.sin(progress * Math.PI) * 15;
      
      positions.push({
        left: Math.max(0, Math.min(x - BEAD_SIZE / 2, threadWidth - BEAD_SIZE)),
        top: Math.max(0, y - BEAD_SIZE / 2),
      });
    }
    
    return positions;
  }, [threadWidth]);
  
  // Memoized bead positions
  const leftBeadPositions = useMemo(() => 
    calculateBeadPositions(leftBeads.length, false),
    [calculateBeadPositions, leftBeads.length]
  );
  
  const rightBeadPositions = useMemo(() => 
    calculateBeadPositions(rightBeads.length, true),
    [calculateBeadPositions, rightBeads.length]
  );
  
  /**
   * Handle bead advancement with proper carousel logic
   */
  const handleBeadAdvance = useCallback(() => {
    if (leftBeads.length === 0 || isAnimating || disabled) return;
    
    try {
      // Get the rightmost bead from left side to move
      const movingBeadValue = leftBeads[leftBeads.length - 1];
      setMovingBead(movingBeadValue);
      setIsAnimating(true);
      
      // Reset animation values
      animatedX.setValue(0);
      rightListTranslate.setValue(0);
      
      // Start parallel animations
      Animated.parallel([
        Animated.timing(animatedX, {
          toValue: 120,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(rightListTranslate, {
          toValue: 40,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return; // Animation was interrupted
        
        try {
          // Configure layout animation for smooth list updates
          LayoutAnimation.configureNext({
            ...LayoutAnimation.Presets.easeInEaseOut,
            duration: 200,
          });
          
          // Update left beads: remove last bead and add new one at the beginning
          const nextVerseInSequence = leftBeads[leftBeads.length - 1] % sanitizedTotalVerses + 1;
          const newLeftBeads = [nextVerseInSequence, ...leftBeads.slice(0, -1)];
          
          // Update right beads: add moved bead to the beginning
          let newRightBeads = [movingBeadValue, ...rightBeads];
          if (newRightBeads.length > MAX_RIGHT_BEADS) {
            newRightBeads = newRightBeads.slice(0, MAX_RIGHT_BEADS);
          }
          
          setLeftBeads(newLeftBeads);
          setRightBeads(newRightBeads);
          setMovingBead(null);
          
          // Reset animation values
          animatedX.setValue(0);
          rightListTranslate.setValue(0);
          setIsAnimating(false);
          
          // Announce to screen reader
          AccessibilityInfo.announceForAccessibility(
            `Advanced to verse ${sanitizedCurrentIndex + 2} of ${sanitizedTotalVerses}`
          );
          
          // Call parent callback
          onAdvance();
        } catch (error) {
          console.error('Error updating bead state:', error);
          setIsAnimating(false);
          setMovingBead(null);
        }
      });
    } catch (error) {
      console.error('Error handling bead advance:', error);
      setIsAnimating(false);
    }
  }, [
    leftBeads,
    rightBeads,
    isAnimating,
    disabled,
    animatedX,
    rightListTranslate,
    sanitizedCurrentIndex,
    sanitizedTotalVerses,
    onAdvance,
  ]);
  
  /**
   * Render individual bead component with proper accessibility
   */
  const renderBead = useCallback((
    verseNumber: number,
    position: { left: number; top: number },
    isCompleted: boolean = false,
    key: string
  ) => (
    <View 
      key={key}
      style={[
        styles.beadWrapper,
        {
          left: position.left,
          top: position.top,
        }
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Verse ${verseNumber}${isCompleted ? ' completed' : ''}`}
    >
      <View style={styles.beadContainer}>
        <View style={[styles.bead, isCompleted && styles.completedBead]}>
          <FastImage
            source={isWhite ? rosaryBeadWhite : rosaryBead}
            style={[styles.beadImg, isCompleted && styles.completedBeadImg]}
            resizeMode={FastImage.resizeMode.contain}
            accessible={false}
          />
          <Text 
            style={[styles.beadNumber, isCompleted && styles.completedBeadNumber]}
            accessible={false}
          >
            {verseNumber}
          </Text>
        </View>
      </View>
    </View>
  ), [isWhite]);
  
  /**
   * Render left side beads (active/upcoming)
   */
  const renderLeftBeads = useMemo(() => {
    const visibleBeads = leftBeads.filter(bead => bead !== movingBead);
    
    return visibleBeads.map((verseNumber, index) => {
      const position = leftBeadPositions[index];
      return position ? renderBead(
        verseNumber, 
        position, 
        false, 
        `left-${verseNumber}-${index}`
      ) : null;
    }).filter(Boolean);
  }, [leftBeads, movingBead, leftBeadPositions, renderBead]);
  
  /**
   * Render right side beads (completed)
   */
  const renderRightBeads = useMemo(() => {
    const displayBeads = isAnimating ? 
      rightBeads.slice(0, MAX_RIGHT_BEADS - 1) : 
      rightBeads.slice(0, MAX_RIGHT_BEADS);
    
    return displayBeads.map((verseNumber, index) => {
      const position = rightBeadPositions[index];
      return position ? renderBead(
        verseNumber, 
        position, 
        true, 
        `right-${verseNumber}-${index}`
      ) : null;
    }).filter(Boolean);
  }, [rightBeads, rightBeadPositions, renderBead, isAnimating]);
  
  return (
    <View style={styles.container}>
      {/* Counter header */}
      <View style={styles.counterHeader}>
        <View 
          style={styles.counterIndexRow}
          accessible={true}
          accessibilityLabel={`Verse ${sanitizedCurrentIndex + 1} of ${sanitizedTotalVerses}`}
          accessibilityRole="text"
        >
          <H3Bold style={styles.currentIndex}>{sanitizedCurrentIndex + 1}</H3Bold>
          <Body1Title2Bold style={styles.slash} accessible={false}>/</Body1Title2Bold>
          <Body1Title2Bold style={styles.totalCount} accessible={false}>
            {sanitizedTotalVerses}
          </Body1Title2Bold>
        </View>
        <Body1Title2Regular 
          style={styles.roundText}
          accessible={true}
          accessibilityLabel={`Round ${currentRound}`}
          accessibilityRole="text"
        >
          Round {currentRound}
        </Body1Title2Regular>
      </View>
      
      {/* Main beads container */}
      <Pressable 
        style={[styles.beadsContainer, disabled && styles.disabledContainer]}
        onPress={handleBeadAdvance}
        disabled={disabled || isAnimating}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel || 
          `Prayer beads. Currently on verse ${sanitizedCurrentIndex + 1} of ${sanitizedTotalVerses}. ${leftCount} beads on left, ${rightBeads.length} completed beads on right. Tap to advance to next verse.`
        }
        accessibilityHint="Double tap to advance to the next verse"
        accessibilityState={{
          disabled: disabled || isAnimating,
          busy: isAnimating,
        }}
      >
        <View style={[styles.threadContainer, { width: threadWidth }]}>
          {/* Background thread */}
          <Thread 
            width={threadWidth} 
            height={120} 
            style={styles.threadSvg}
            accessible={false}
          />
          
          {/* Left side beads container */}
          <View style={styles.leftBeadsContainer}>
            {renderLeftBeads}
          </View>
          
          {/* Right side beads container */}
          <Animated.View 
            style={[
              styles.rightBeadsContainer,
              { transform: [{ translateX: rightListTranslate }] }
            ]}
          >
            {renderRightBeads}
          </Animated.View>
          
          {/* Moving bead animation */}
          {movingBead && (
            <Animated.View
              style={[
                styles.movingBeadContainer,
                {
                  transform: [{ translateX: animatedX }],
                },
              ]}
              accessible={false}
            >
              <View style={styles.bead}>
                <FastImage
                  source={isWhite ? rosaryBeadWhite : rosaryBead}
                  style={styles.beadImg}
                  resizeMode={FastImage.resizeMode.contain}
                  accessible={false}
                />
                <Text style={styles.beadNumber} accessible={false}>
                  {movingBead}
                </Text>
              </View>
            </Animated.View>
          )}
        </View>
      </Pressable>
      
      <Body1Title2Regular 
        color="sub-heading" 
        style={[styles.swipeHint, disabled && styles.disabledText]}
        accessible={false}
      >
        {disabled ? 'Beads are disabled' : 'Tap to advance to next verse'}
      </Body1Title2Regular>
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
    marginBottom: 16,
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
    marginLeft: 2,
  },
  beadsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  disabledContainer: {
    opacity: 0.6,
  },
  threadContainer: {
    height: 120,
    position: 'relative',
    marginVertical: 16,
  },
  threadSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  leftBeadsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  rightBeadsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  beadWrapper: {
    position: 'absolute',
    width: BEAD_SIZE + 8,
    height: BEAD_SIZE + 8,
    zIndex: 2,
  },
  beadContainer: {
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bead: {
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  completedBead: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  beadImg: {
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    position: 'absolute',
  },
  completedBeadImg: {
    opacity: 0.9,
  },
  beadNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  completedBeadNumber: {
    fontSize: 11,
    opacity: 0.95,
  },
  movingBeadContainer: {
    position: 'absolute',
    top: '50%',
    left: '25%',
    marginTop: -BEAD_SIZE / 2,
    marginLeft: -BEAD_SIZE / 2,
    zIndex: 10,
  },
  swipeHint: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  disabledText: {
    color: '#999',
  },
});

export default Beads;