import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Platform,
  UIManager,
  AccessibilityInfo,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { Body1Title2Bold, Body1Title2Regular, H3Bold } from '@/components';
import { TasbihData } from '@/modules/dua/services/duaService';

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
  /** Tasbih data from API */
  tasbihData?: TasbihData;
}

/**
 * Beads component that uses Lottie animation instead of the traditional beads UI
 * 
 * Features:
 * - Lottie animation for tasbih
 * - Preserves counting logic
 * - Plays animation when tapped
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
  tasbihData,
}) => {
  // Input validation
  const sanitizedTotalVerses = Math.max(1, totalVerses);
  const sanitizedCurrentIndex = Math.max(0, Math.min(currentVerseIndex, sanitizedTotalVerses - 1));
  const sanitizedTotalCount = Math.max(0, totalCount);
  
  // Animation ref
  const lottieRef = useRef<LottieView>(null);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Set up animation event listener
  useEffect(() => {
    // We'll rely on the timeout approach instead of trying to access private properties
    // This is more reliable across different versions of lottie-react-native
    return () => {
      // Cleanup any pending timeouts when component unmounts
      setIsAnimating(false);
    };
  }, []);
  
  // Calculate current round
  const currentRound = Math.floor(sanitizedTotalCount / sanitizedTotalVerses) + 1;
  
  // Announce current tasbih name for accessibility when it changes
  useEffect(() => {
    if (tasbihData) {
      AccessibilityInfo.announceForAccessibility(
        `Selected tasbih: ${tasbihData.title}`
      );
    }
  }, [tasbihData?.id]);
  
  /**
   * Handle animation when bead is advanced
   */
  const handleBeadAdvance = () => {
    if (isAnimating || disabled) return;
    
    try {
      setIsAnimating(true);
      
      // Play the Lottie animation - ensure it plays from beginning to end
      if (lottieRef.current) {
        // Reset to beginning first
        lottieRef.current.reset();
        // Play the full animation
        lottieRef.current.play();
      }
      
      // Announce the current verse for accessibility
      const currentVerse = tasbihData?.verses[sanitizedCurrentIndex];
      AccessibilityInfo.announceForAccessibility(
        currentVerse
          ? `Advanced to verse ${sanitizedCurrentIndex + 2} of ${sanitizedTotalVerses}: ${currentVerse.transliteration}`
          : `Advanced to verse ${sanitizedCurrentIndex + 2} of ${sanitizedTotalVerses}`
      );
      
      // Call parent callback
      onAdvance();
      
      // Reset animation state after animation completes - use longer duration
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000); // Increased animation duration to ensure it completes
    } catch (error) {
      console.error('Error handling bead advance:', error);
      setIsAnimating(false);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Counter header - styled like the image */}
      <View style={styles.counterHeader}>
        <Text style={styles.counterText}>
          <Text style={styles.currentIndex}>{sanitizedCurrentIndex}</Text>
          <Text style={styles.counterSeparator}>/</Text>
          <Text style={styles.totalVerses}>{sanitizedTotalVerses}</Text>
        </Text>
        <Text style={styles.roundText}>Round {currentRound}</Text>
      </View>
      
      {/* Lottie animation container */}
      <Pressable 
        style={[styles.lottieContainer, disabled && styles.disabledContainer]}
        onPress={handleBeadAdvance}
        disabled={disabled || isAnimating}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel || 
          (tasbihData
            ? `Tasbih counter for ${tasbihData.title}. Currently on verse ${sanitizedCurrentIndex + 1} of ${sanitizedTotalVerses}. Tap to advance to next verse.`
            : `Tasbih counter. Currently on verse ${sanitizedCurrentIndex + 1} of ${sanitizedTotalVerses}. Tap to advance to next verse.`)
        }
        accessibilityHint="Double tap to advance to the next verse"
        accessibilityState={{
          disabled: disabled || isAnimating,
          busy: isAnimating,
        }}
      >
        <LottieView
          ref={lottieRef}
          // Use JSON format instead of .lottie
          source={isWhite ? require('@/assets/tasbih/animations/tasbih-white.json') : require('@/assets/tasbih/animations/tasbih-black.json')}
          style={styles.lottieAnimation}
          loop={false}
          autoPlay={false}
          speed={0.7} // Slow down the animation slightly
          resizeMode="cover"
        />
      </Pressable>
      
      {/* Bottom instruction text - like in the image */}
      <Text style={styles.instructionText}>
        {disabled ? 'Tasbih is disabled' : 'Click or swipe to count'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginVertical: 16,
  },
  counterHeader: {
    width: '100%',
    alignItems: 'flex-start',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  currentIndex: {
    color: '#8A57DC', // Purple color
    fontSize: 24,
  },
  counterSeparator: {
    color: '#6B7280',
    fontSize: 24,
  },
  totalVerses: {
    color: '#6B7280',
    fontSize: 24,
  },
  roundText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  lottieContainer: {
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  disabledContainer: {
    opacity: 0.6,
  },
  instructionText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Beads;