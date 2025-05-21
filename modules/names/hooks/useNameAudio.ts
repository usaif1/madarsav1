import { useState, useEffect } from 'react';
import Sound from 'react-native-sound';
import { Platform } from 'react-native';

// Enable playback in silent mode
Sound.setCategory('Playback');

interface UseNameAudioReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  playAudio: (nameNumber: number) => void;
  stopAudio: () => void;
}

export const useNameAudio = (): UseNameAudioReturn => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('');

  // Clean up sound when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.stop();
        sound.release();
      }
    };
  }, [sound]);

  const playAudio = (nameNumber: number) => {
    // Format the number with leading zeros (e.g., 1 -> "01")
    const formattedNumber = nameNumber.toString().padStart(2, '0');
    const audioUrl = `https://99names.app/audio/${formattedNumber}.mp3`;
    setCurrentAudioUrl(audioUrl);
    
    // Stop any currently playing audio
    if (sound) {
      sound.stop();
      sound.release();
      setSound(null);
    }
    
    setIsLoading(true);
    setError(null);
    
    console.log(`Loading audio for name #${nameNumber}: ${audioUrl}`);
    
    // Configure sound for different platforms
    Sound.setCategory('Playback', true); // Allow mixing with other audio
    
    // For iOS, we need to use the streaming option for remote URLs
    const basePath = Platform.OS === 'ios' ? '' : '';
    const initPath = Platform.OS === 'ios' ? audioUrl : audioUrl;
    
    try {
      // Create a new Sound instance
      // For remote URLs on iOS, use the streaming option
      const newSound = new Sound(initPath, basePath, (error) => {
        setIsLoading(false);
        
        if (error) {
          console.error('Failed to load the sound', error);
          setError(`Failed to load the sound: ${error.message}`);
          
          // Try again with a different approach instead of opening browser
          retryLoadingWithAlternativeMethod(audioUrl, nameNumber);
          return;
        }
        
        console.log('Sound loaded successfully');
        setSound(newSound);
        setIsPlaying(true);
        
        // Play the sound
        newSound.play((success) => {
          console.log('Sound playback finished', success);
          if (!success) {
            setError('Playback failed due to audio decoding errors');
          }
          setIsPlaying(false);
        });
      });
    } catch (err) {
      console.error('Error creating Sound object', err);
      setIsLoading(false);
      setError(`Error initializing audio: ${err instanceof Error ? err.message : String(err)}`);
      
      // Try again with a different approach instead of opening browser
      retryLoadingWithAlternativeMethod(audioUrl, nameNumber);
    }
  };
  
  // Alternative method to load audio if the first attempt fails
  const retryLoadingWithAlternativeMethod = (audioUrl: string, nameNumber: number) => {
    console.log('Retrying with alternative method...');
    setIsLoading(true);
    
    // Try with a different configuration
    const newSound = new Sound(audioUrl, Sound.MAIN_BUNDLE, (error) => {
      setIsLoading(false);
      
      if (error) {
        console.error('Alternative method also failed', error);
        setError(`Could not play audio. Please check your internet connection.`);
        return;
      }
      
      console.log('Alternative method succeeded');
      setSound(newSound);
      setIsPlaying(true);
      
      newSound.play((success) => {
        if (!success) {
          setError('Playback failed');
        }
        setIsPlaying(false);
      });
    });
  
  };

  const stopAudio = () => {
    if (sound) {
      sound.stop();
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    isLoading,
    error,
    playAudio,
    stopAudio
  };
};
