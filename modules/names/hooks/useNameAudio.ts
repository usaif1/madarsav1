import { useState, useEffect } from 'react';
import { Linking, Platform } from 'react-native';

// Since we're not using the external Sound library, we'll implement a simpler version
// that works with the fetch API

interface UseNameAudioReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  playAudio: (nameNumber: number) => void;
  stopAudio: () => void;
}

export const useNameAudio = (): UseNameAudioReturn => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentNameNumber, setCurrentNameNumber] = useState<number | null>(null);

  // In a real implementation, we would use a proper audio library like react-native-sound
  // or react-native-track-player. For now, we'll simulate the audio playback behavior.
  
  // Simulate audio playback with a timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      // Simulate audio duration (5 seconds)
      timer = setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isPlaying]);

  const playAudio = (nameNumber: number) => {
    // Format the number with leading zeros (e.g., 1 -> "01")
    const formattedNumber = nameNumber.toString().padStart(2, '0');
    const audioUrl = `https://99names.app/audio/${formattedNumber}.mp3`;
    
    // If already playing, stop first
    if (isPlaying) {
      stopAudio();
    }
    
    setIsLoading(true);
    setError(null);
    setCurrentNameNumber(nameNumber);
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
      
      // In a real implementation, we would play the audio here
      console.log(`Playing audio for name #${nameNumber}: ${audioUrl}`);
      
      // For development/testing, we could open the URL in the browser
      // Linking.openURL(audioUrl).catch(err => {
      //   setError(`Failed to open audio URL: ${err.message}`);
      //   setIsPlaying(false);
      // });
    }, 500);
  };

  const stopAudio = () => {
    setIsPlaying(false);
    // In a real implementation, we would stop the audio here
  };

  return {
    isPlaying,
    isLoading,
    error,
    playAudio,
    stopAudio
  };
};
