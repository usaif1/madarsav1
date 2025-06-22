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
  // Shared audio player state
  sharedAudio: {
    isPlaying: boolean;
    isLoading: boolean;
    error: string | null;
    duration: number;
    position: number;
    volume: number;
    currentAudioRef: {
      url: string;
      id: string;
      lastPosition: number;
      currentPosition: number;
    } | null;
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

  // Shared audio player actions
  setSharedAudioPlaying: (isPlaying: boolean) => void;
  setSharedAudioLoading: (isLoading: boolean) => void;
  setSharedAudioError: (error: string | null) => void;
  setSharedAudioDuration: (duration: number) => void;
  setSharedAudioPosition: (position: number) => void;
  setSharedAudioVolume: (volume: number) => void;
  setSharedAudioRef: (audioRef: {
    url: string;
    id: string;
    lastPosition: number;
    currentPosition: number;
  } | null) => void;
  resetSharedAudio: () => void;

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
  sharedAudio: {
    isPlaying: false,
    isLoading: false,
    error: null,
    duration: 0,
    position: 0,
    volume: 1.0,
    currentAudioRef: null,
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

  // Shared audio player actions
  setSharedAudioPlaying: (isPlaying) =>
    set((state) => ({
      sharedAudio: {
        ...state.sharedAudio,
        isPlaying,
      },
    })),

  setSharedAudioLoading: (isLoading) =>
    set((state) => ({
      sharedAudio: {
        ...state.sharedAudio,
        isLoading,
      },
    })),

  setSharedAudioError: (error) =>
    set((state) => ({
      sharedAudio: {
        ...state.sharedAudio,
        error,
      },
    })),

  setSharedAudioDuration: (duration) =>
    set((state) => ({
      sharedAudio: {
        ...state.sharedAudio,
        duration,
      },
    })),

  setSharedAudioPosition: (position) =>
    set((state) => ({
      sharedAudio: {
        ...state.sharedAudio,
        position,
        currentAudioRef: state.sharedAudio.currentAudioRef ? {
          ...state.sharedAudio.currentAudioRef,
          currentPosition: position,
        } : null,
      },
    })),

  setSharedAudioVolume: (volume) =>
    set((state) => ({
      sharedAudio: {
        ...state.sharedAudio,
        volume,
      },
    })),

  setSharedAudioRef: (audioRef) =>
    set((state) => ({
      sharedAudio: {
        ...state.sharedAudio,
        currentAudioRef: audioRef,
      },
    })),

  resetSharedAudio: () =>
    set({
      sharedAudio: globalInitialState.sharedAudio,
    }),

  resetGlobalStore: () =>
    set({
      ...globalInitialState,
      onboarded: true,
    }),
}));

export default createSelectors(globalStore);
