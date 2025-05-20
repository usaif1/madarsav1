import { useState, useEffect } from 'react';
import Sound from 'react-native-sound';
import { Linking } from 'react-native';

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
    
    // Stop any currently playing audio
    if (sound) {
      sound.stop();
      sound.release();
      setSound(null);
    }
    
    setIsLoading(true);
    setError(null);
    
    console.log(`Loading audio for name #${nameNumber}: ${audioUrl}`);
    
    try {
      // For remote URLs, we need to specify the correct parameters
      // The second parameter should be an empty string for remote URLs
      const newSound = new Sound(audioUrl, '', (error) => {
        setIsLoading(false);
        
        if (error) {
          console.error('Failed to load the sound', error);
          setError(`Failed to load the sound: ${error.message}`);
          
          // Fallback: open in browser if loading fails in the app
          Linking.openURL(audioUrl).catch(err => {
            console.error('Failed to open URL', err);
          });
          
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
      
      // Fallback: open in browser
      Linking.openURL(audioUrl).catch(linkErr => {
        console.error('Failed to open URL', linkErr);
      });
    }
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
