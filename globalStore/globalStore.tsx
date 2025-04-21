// dependencies
import {create} from 'zustand';

// utils
import createSelectors from '@/utils/selectors';

type GlobalStore = {
  onboarded: boolean | undefined;
};

type GlobalActions = {
  setOnboarded: (state: boolean) => void;

  // reset store
  resetGlobalStore: () => void;
};

const globalInitialState: GlobalStore = {
  onboarded: false,
};

const globalStore = create<GlobalStore & GlobalActions>(set => ({
  ...globalInitialState,

  setOnboarded: state =>
    set({
      onboarded: state,
    }),

  resetGlobalStore: () =>
    set({
      ...globalInitialState,
      onboarded: true,
    }),
}));

export default createSelectors(globalStore);
