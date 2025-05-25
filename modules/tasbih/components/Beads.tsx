import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  FlatList,
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

interface BeadPosition {
  left: number;
  top: number;
}

interface BeadData {
  id: string;
  verseNumber: number;
  index: number;
}

// Constants for bead display and animation
const BEAD_SIZE = 40;
const DISPLAY_BEADS_COUNT = 8; // Always show 8 beads like original component
const MAX_COMPLETED_BEADS = 3; // Maximum beads shown on completed side
const ANIMATION_DURATION = 300;
const THREAD_PADDING = 32;
const MAX_THREAD_WIDTH = 380;

/**
 * Beads component with shifting animation logic
 * Displays prayer beads that move from left to right as verses are completed
 * 
 * Features:
 * - Responsive design with proper accessibility
 * - Smooth animations with proper cleanup
 * - Error handling and edge case management
 * - Performance optimized with memoization
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
  
  // State for animation logic
  const [activeBead, setActiveBead] = useState<number | null>(null);
  const [completedBeads, setCompletedBeads] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation values with proper cleanup
  const animatedX = useRef(new Animated.Value(0)).current;
  const completedListTranslate = useRef(new Animated.Value(0)).current;
  
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
   * Generate active beads list with proper error handling
   */
  const generateActiveBeadsList = useCallback((): BeadData[] => {
    const beads: BeadData[] = [];
    const displayCount = Math.min(DISPLAY_BEADS_COUNT, sanitizedTotalVerses);
    
    for (let i = 0; i < displayCount; i++) {
      const verseNumber = ((sanitizedCurrentIndex + i) % sanitizedTotalVerses) + 1;
      beads.push({
        id: `active-${verseNumber}-${i}`,
        verseNumber,
        index: i,
      });
    }
    
    return beads;
  }, [sanitizedCurrentIndex, sanitizedTotalVerses]);
  
  const [activeBeadsList, setActiveBeadsList] = useState<BeadData[]>(generateActiveBeadsList);
  
  // Update active beads when verse changes
  useEffect(() => {
    if (!isAnimating) {
      setActiveBeadsList(generateActiveBeadsList());
    }
  }, [generateActiveBeadsList, isAnimating]);
  
  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      animatedX.stopAnimation();
      completedListTranslate.stopAnimation();
    };
  }, [animatedX, completedListTranslate]);
  
  /**
   * Calculate bead positions along curved path with proper validation
   */
  const calculateBeadPositions = useCallback((count: number): BeadPosition[] => {
    if (count <= 0) return [];
    
    const positions: BeadPosition[] = [];
    const availableWidth = threadWidth - 100;
    const spacing = count > 1 ? Math.min(45, availableWidth / (count - 1)) : 0;
    
    for (let i = 0; i < count; i++) {
      const progress = count > 1 ? i / (count - 1) : 0;
      const x = 50 + (i * spacing);
      const y = 60 + Math.sin(progress * Math.PI) * 20; // Curved path
      
      positions.push({
        left: Math.max(0, x - BEAD_SIZE / 2),
        top: Math.max(0, y - BEAD_SIZE / 2),
      });
    }
    
    return positions;
  }, [threadWidth]);
  
  // Memoized bead positions
  const activeBeadPositions = useMemo(() => 
    calculateBeadPositions(activeBeadsList.length),
    [calculateBeadPositions, activeBeadsList.length]
  );
  
  const completedBeadPositions = useMemo(() => 
    calculateBeadPositions(Math.min(completedBeads.length, MAX_COMPLETED_BEADS)),
    [calculateBeadPositions, completedBeads.length]
  );
  
  /**
   * Handle bead advancement with animation and proper error handling
   */
  const handleBeadAdvance = useCallback(() => {
    if (activeBeadsList.length === 0 || isAnimating || disabled) return;
    
    try {
      // Get the last bead to move
      const lastBead = activeBeadsList[activeBeadsList.length - 1];
      if (!lastBead) return;
      
      const movingBeadValue = lastBead.verseNumber;
      setActiveBead(movingBeadValue);
      setIsAnimating(true);
      
      // Reset animation values
      animatedX.setValue(0);
      completedListTranslate.setValue(0);
      
      // Start parallel animations
      Animated.parallel([
        Animated.timing(animatedX, {
          toValue: 120,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(completedListTranslate, {
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
          
          // Update lists after animation
          const nextVerseNum = ((sanitizedCurrentIndex + DISPLAY_BEADS_COUNT) % sanitizedTotalVerses) + 1;
          const newActiveBeads = generateActiveBeadsList();
          
          // Update completed beads
          let newCompletedBeads = [movingBeadValue, ...completedBeads];
          if (newCompletedBeads.length > MAX_COMPLETED_BEADS) {
            newCompletedBeads = newCompletedBeads.slice(0, MAX_COMPLETED_BEADS);
          }
          
          setActiveBeadsList(newActiveBeads);
          setCompletedBeads(newCompletedBeads);
          setActiveBead(null);
          
          // Reset animation values
          animatedX.setValue(0);
          completedListTranslate.setValue(0);
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
          setActiveBead(null);
        }
      });
    } catch (error) {
      console.error('Error handling bead advance:', error);
      setIsAnimating(false);
    }
  }, [
    activeBeadsList,
    isAnimating,
    disabled,
    animatedX,
    completedListTranslate,
    sanitizedCurrentIndex,
    sanitizedTotalVerses,
    completedBeads,
    generateActiveBeadsList,
    onAdvance,
  ]);
  
  /**
   * Render individual bead component with proper accessibility
   */
  const renderBead = useCallback((
    beadData: BeadData,
    position: BeadPosition,
    isCompleted: boolean = false
  ) => (
    <View 
      key={beadData.id}
      style={[
        styles.beadWrapper,
        {
          left: position.left,
          top: position.top,
        }
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Verse ${beadData.verseNumber}${isCompleted ? ' completed' : ''}`}
    >
      <View style={[styles.beadContainer]}>
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
            {beadData.verseNumber}
          </Text>
        </View>
      </View>
    </View>
  ), [isWhite, rosaryBead, rosaryBeadWhite]);
  
  /**
   * Render active beads list
   */
  const renderActiveBeads = useMemo(() => {
    const visibleBeads = activeBeadsList.filter(bead => bead.verseNumber !== activeBead);
    
    return visibleBeads.map((bead, index) => {
      const position = activeBeadPositions[index];
      return position ? renderBead(bead, position, false) : null;
    }).filter(Boolean);
  }, [activeBeadsList, activeBead, activeBeadPositions, renderBead]);
  
  /**
   * Render completed beads list
   */
  const renderCompletedBeads = useMemo(() => {
    return completedBeads.slice(0, MAX_COMPLETED_BEADS).map((verseNumber, index) => {
      const position = completedBeadPositions[index];
      const beadData: BeadData = {
        id: `completed-${verseNumber}-${index}`,
        verseNumber,
        index,
      };
      
      return position ? renderBead(beadData, position, true) : null;
    }).filter(Boolean);
  }, [completedBeads, completedBeadPositions, renderBead]);
  
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
          `Prayer beads. Currently on verse ${sanitizedCurrentIndex + 1} of ${sanitizedTotalVerses}. Tap to advance to next verse.`
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
          
          <View style={styles.rowContainer}>
            {/* Active beads (left side) */}
            <View style={styles.activeBeadsContainer}>
              {renderActiveBeads}
            </View>
            
            {/* Separator */}
            <View style={styles.separator} />
            
            {/* Completed beads (right side) */}
            <Animated.View 
              style={[
                styles.completedBeadsContainer,
                { transform: [{ translateX: completedListTranslate }] }
              ]}
            >
              {renderCompletedBeads}
            </Animated.View>
          </View>
          
          {/* Moving bead animation */}
          {activeBead && (
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
                  {activeBead}
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
  },
  activeBeadsContainer: {
    flex: 1,
    position: 'relative',
  },
  completedBeadsContainer: {
    flex: 1,
    position: 'relative',
  },
  separator: {
    width: 32,
  },
  beadWrapper: {
    position: 'absolute',
    width: BEAD_SIZE + 8,
    height: BEAD_SIZE + 8,
    zIndex: 1,
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
    opacity: 0.7,
    transform: [{ scale: 0.9 }],
  },
  beadImg: {
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    position: 'absolute',
  },
  completedBeadImg: {
    opacity: 0.8,
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
    fontSize: 10,
    opacity: 0.9,
  },
  movingBeadContainer: {
    position: 'absolute',
    top: '50%',
    left: '30%',
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