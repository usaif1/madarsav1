// dependencies
import {create} from 'zustand';

// utils
import createSelectors from '@/utils/selectors';

type GlobalStore = {
  onboarded: boolean | undefined;
  homeAudio: {
    isPlaying: boolean;
    currentNameId: number | null;
    progress: number;
    currentTime: number;
    duration: number;
  };
};

type GlobalActions = {
  setOnboarded: (state: boolean) => void;
  
  // Home audio actions
  setHomeAudioPlaying: (isPlaying: boolean) => void;
  setHomeAudioNameId: (nameId: number | null) => void;
  setHomeAudioProgress: (progress: number) => void;
  setHomeAudioTime: (currentTime: number, duration: number) => void;
  resetHomeAudio: () => void;

  // reset store
  resetGlobalStore: () => void;
};

const globalInitialState: GlobalStore = {
  onboarded: false,
  homeAudio: {
    isPlaying: false,
    currentNameId: 1, // Default to first name
    progress: 0,
    currentTime: 0,
    duration: 0,
  },
};

const globalStore = create<GlobalStore & GlobalActions>(set => ({
  ...globalInitialState,

  setOnboarded: state =>
    set({
      onboarded: state,
    }),
    
  // Home audio actions
  setHomeAudioPlaying: (isPlaying) =>
    set((state) => ({
      homeAudio: {
        ...state.homeAudio,
        isPlaying,
      },
    })),
    
  setHomeAudioNameId: (currentNameId) =>
    set((state) => ({
      homeAudio: {
        ...state.homeAudio,
        currentNameId,
        // Reset progress and time when changing tracks
        progress: 0,
        currentTime: 0,
      },
    })),
    
  setHomeAudioProgress: (progress) =>
    set((state) => ({
      homeAudio: {
        ...state.homeAudio,
        progress,
      },
    })),
    
  setHomeAudioTime: (currentTime, duration) =>
    set((state) => ({
      homeAudio: {
        ...state.homeAudio,
        currentTime,
        duration,
      },
    })),
    
  resetHomeAudio: () =>
    set({
      homeAudio: globalInitialState.homeAudio,
    }),

  resetGlobalStore: () =>
    set({
      ...globalInitialState,
      onboarded: true,
    }),
}));

export default createSelectors(globalStore);
