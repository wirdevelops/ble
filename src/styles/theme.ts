export type Theme = 'light' | 'dark' | 'luxury';

export const themes = {
  light: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#000000',
    accent: '#FF9500',
    surface: '#F2F2F7',
    border: '#C7C7CC',
  },
  dark: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    text: '#FFFFFF',
    accent: '#FF9F0A',
    surface: '#1C1C1E',
    border: '#38383A',
  },
  luxury: {
    primary: '#D4AF37',  // Rich gold
    secondary: '#C5A028', // Darker gold
    background: '#0A0A0A', // Near black
    text: '#FFFFFF',
    accent: '#FFD700',  // Pure gold
    surface: '#1A1A1A', // Slightly lighter black
    border: '#D4AF37',  // Gold border
    highlight: '#FFE55C', // Bright gold for highlights
    muted: '#8B7355',   // Muted gold for subtle elements
  },
} as const;
