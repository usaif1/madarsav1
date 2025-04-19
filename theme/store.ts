import {create} from 'zustand';
import {Appearance} from 'react-native'; // or use `useColorScheme` hook in component
import {lightColors, darkColors, typography, shadows} from '@/theme';
import {Shadows} from './shadows';

type ThemeType = 'light' | 'dark';

interface ThemeState {
  theme: ThemeType;
  colors: typeof lightColors;
  typography: typeof typography;
  shadows: Shadows;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const systemTheme = Appearance.getColorScheme() ?? 'light';

export const useThemeStore = create<ThemeState>(set => ({
  theme: systemTheme,
  colors: systemTheme === 'dark' ? darkColors : lightColors,
  typography: typography,
  shadows: shadows,

  setTheme: theme =>
    set({
      theme,
      colors: theme === 'dark' ? darkColors : lightColors,
    }),

  toggleTheme: () =>
    set(state => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return {
        theme: newTheme,
        colors: newTheme === 'dark' ? darkColors : lightColors,
      };
    }),
}));
