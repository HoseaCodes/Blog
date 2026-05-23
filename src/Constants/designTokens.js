/**
 * Design System Tokens
 * Centralized design tokens for the Blog Portfolio application
 * Use these tokens consistently across all components
 */

export const colors = {
  // Primary Colors
  primary: {
    green: '#204740',
    greenDark: '#1a3a36',
    greenLight: '#2d6355',
    gold: 'rgb(235, 183, 65)',
    white: '#fff',
    black: '#000',
  },

  // Secondary Colors
  secondary: {
    gray: 'dimgray',
    grayLight: '#e8e8e8',
    grayDark: '#333',
    green: 'green',
    red: 'red',
  },

  // Status Colors
  status: {
    success: 'green',
    error: 'red',
    warning: 'orange',
    info: '#0066cc',
  },

  // Utility Colors
  utility: {
    transparent: 'transparent',
    white: '#fff',
    black: '#000',
  },
};

export const typography = {
  fontSizes: {
    // Heading sizes
    h1: '6rem',      // 96px
    h2: '6rem',      // 96px
    h3: '2.5rem',    // 40px
    h4: '2rem',      // 32px
    h5: '1.8rem',    // 28.8px
    h6: '1.5rem',    // 24px

    // Body sizes
    bodyLarge: '2rem',     // 32px
    body: '1.8rem',        // 28.8px
    bodySmall: '1rem',     // 16px
    label: '1rem',         // 16px
    caption: '0.875rem',   // 14px
  },

  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    tight: 1,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  fontFamilies: {
    base: 'system-ui, -apple-system, sans-serif',
    mono: 'Menlo, Monaco, Courier New, monospace',
  },
};

export const spacing = {
  // Spacing scale in rem
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '2rem',       // 32px
  xl: '4rem',       // 64px
  xxl: '5rem',      // 80px

  // Common patterns
  padding: {
    section: '5rem',
    sectionMobile: '2rem',
    component: '2rem',
    small: '0.5rem',
  },

  margin: {
    section: '2rem',
    component: '2rem',
    text: '0',
  },

  gap: {
    tight: '0.5rem',
    normal: '1rem',
    relaxed: '2rem',
  },
};

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  pill: '3em',
  circle: '50%',
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 8px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 12px rgba(0, 0, 0, 0.15)',
  xl: '0 10px 25px rgba(0, 0, 0, 0.2)',
};

export const transitions = {
  fast: '0.15s ease-in-out',
  base: '0.3s ease-in-out',
  slow: '0.5s ease-in-out',

  property: {
    color: 'color 0.3s ease-in-out',
    background: 'background-color 0.3s ease-in-out',
    border: 'border-color 0.3s ease-in-out',
    all: 'all 0.3s ease-in-out',
  },
};

export const breakpoints = {
  mobile: '375px',
  mobileLarge: '425px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
  ultrawide: '1920px',
};

export const mediaQueries = {
  mobile: `@media only screen and (min-device-width: 375px) and (max-device-width: 768px)`,
  tablet: `@media only screen and (min-device-width: 768px) and (max-device-width: 1024px)`,
  desktop: `@media only screen and (min-device-width: 1024px)`,
  widescreen: `@media only screen and (min-device-width: 1440px)`,
};

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 400,
  tooltip: 500,
  notification: 600,
};

export const aspectRatios = {
  square: '1/1',
  golden: '1.618/1',
  video: '16/9',
  widescreen: '21/9',
  portrait: '3/4',
  landscape: '4/3',
};

// Button Styles
export const buttonStyles = {
  primary: {
    background: colors.primary.green,
    color: colors.primary.white,
    border: `2px solid ${colors.primary.green}`,
    borderRadius: borderRadius.pill,
    fontWeight: typography.fontWeights.bold,
    padding: '10px 20px',
    cursor: 'pointer',
    transition: transitions.property.background,

    '&:hover': {
      background: colors.primary.greenDark,
      borderColor: colors.primary.greenDark,
    },

    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${colors.primary.gold}`,
    },
  },

  secondary: {
    background: colors.utility.transparent,
    color: colors.primary.white,
    border: `2px solid ${colors.primary.white}`,
    borderRadius: borderRadius.pill,
    fontWeight: typography.fontWeights.bold,
    padding: '10px 20px',
    cursor: 'pointer',
    transition: transitions.property.all,

    '&:hover': {
      background: colors.primary.green,
      borderColor: colors.primary.green,
    },

    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${colors.primary.gold}`,
    },
  },
};

// Form Styles
export const formStyles = {
  input: {
    padding: '10px 15px',
    border: '1px solid #ccc',
    borderRadius: borderRadius.md,
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.base,
    transition: transitions.property.border,

    '&:focus': {
      outline: 'none',
      borderColor: colors.primary.green,
      boxShadow: `0 0 0 3px rgba(32, 71, 64, 0.1)`,
    },

    '&::placeholder': {
      color: colors.secondary.gray,
    },
  },

  label: {
    fontSize: typography.fontSizes.label,
    fontWeight: typography.fontWeights.medium,
    color: colors.secondary.grayDark,
    marginBottom: spacing.sm,
    display: 'block',
  },
};

// Card Styles
export const cardStyles = {
  default: {
    background: colors.primary.white,
    border: 'none',
    borderRadius: borderRadius.md,
    boxShadow: shadows.md,
    padding: spacing.lg,
    transition: transitions.property.all,

    '&:hover': {
      boxShadow: shadows.lg,
    },
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  mediaQueries,
  zIndex,
  aspectRatios,
  buttonStyles,
  formStyles,
  cardStyles,
};
