export enum ShadowColors {
  'border-dark' = '#E5E5E5',
  'border-light' = '#F5F5F5',
  'border-darker' = '#D4D4D4',
}

export const shadows = {
  sm1: {
    shadowColor: ShadowColors['border-dark'], // Using your existing color token
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 1, // Blur 2 in design = 2/2 = 1
    elevation: 2,
  },
  sm2: {
    shadowColor: ShadowColors['border-dark'],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 1.5, // Blur 3 in design = 3/2 = 1.5
    elevation: 3,
  },
  md1: {
    shadowColor: ShadowColors['border-dark'],
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 2, // Blur 4 => 2
    elevation: 4,
  },
  md2: {
    shadowColor: ShadowColors['border-dark'],
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 4, // Blur 8 => 4
    elevation: 6,
  },
  lg1: {
    shadowColor: ShadowColors['border-light'],
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 1,
    shadowRadius: 3, // Blur 6 => 3
    elevation: 4,
  },
  lg2: {
    shadowColor: ShadowColors['border-dark'],
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 1,
    shadowRadius: 8, // Blur 16 => 8
    elevation: 8,
  },
  xl1: {
    shadowColor: ShadowColors['border-dark'],
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 1,
    shadowRadius: 4, // Blur 8 => 4
    elevation: 6,
  },
  xl2: {
    shadowColor: ShadowColors['border-light'],
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 1,
    shadowRadius: 7.3, // Blur 14.6 => 7.3
    elevation: 10,
  },
  '2xl': {
    shadowColor: ShadowColors['border-dark'],
    shadowOffset: {width: 0, height: 24},
    shadowOpacity: 1,
    shadowRadius: 24, // Blur 48 => 24
    elevation: 12,
  },
  '3xl': {
    shadowColor: ShadowColors['border-darker'],
    shadowOffset: {width: 0, height: 32},
    shadowOpacity: 1,
    shadowRadius: 32, // Blur 64 => 32
    elevation: 16,
  },
};

export type Shadows = typeof shadows;
