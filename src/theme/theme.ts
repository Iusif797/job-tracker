import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      danger: string;
      info: string;
      text: string;
      textSecondary: string;
      background: string;
      backgroundHover: string;
      surface: string;
      surfaceVariant: string;
      border: string;
      borderLight: string;
      gradients: {
        primary: string;
        secondary: string;
        success: string;
        info: string;
        dark: string;
      };
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
    fonts: {
      primary: string;
      secondary: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
      largeDesktop: string;
    };
    transitions: {
      default: string;
      fast: string;
      slow: string;
    };
    spacing: {
      xxs: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    borderRadius: {
      small: string;
      medium: string;
      large: string;
      circle: string;
    };
    radius: {
      small: string;
      medium: string;
      large: string;
      circle: string;
    };
  }
}

export const lightTheme: DefaultTheme = {
  colors: {
    primary: '#5856D6',
    secondary: '#FF9500',
    success: '#34C759',
    warning: '#FFCC00',
    danger: '#FF3B30',
    info: '#5AC8FA',
    text: '#1C1C1E',
    textSecondary: '#6C6C70',
    background: '#F2F2F7',
    backgroundHover: '#E5E5EA',
    surface: '#FFFFFF',
    surfaceVariant: '#F9F9FB',
    border: '#CECED2',
    borderLight: '#E5E5EA',
    gradients: {
      primary: 'linear-gradient(120deg, #5267DF 0%, #748BFF 100%)',
      secondary: 'linear-gradient(120deg, #FF9F0A 0%, #FFBF40 100%)',
      success: 'linear-gradient(120deg, #30DB5B 0%, #34D65C 100%)',
      info: 'linear-gradient(120deg, #00B9FF 0%, #64D3FF 100%)',
      dark: 'linear-gradient(135deg, #F8F8F8 0%, #E8E8E8 100%)',
    },
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
    large: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
  fonts: {
    primary: "'Montserrat', 'Roboto', 'Segoe UI', sans-serif",
    secondary: "'Playfair Display', 'Georgia', serif",
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    largeDesktop: '1440px',
  },
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
  },
  spacing: {
    xxs: '0.25rem', // 4px
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    xxl: '3rem',    // 48px
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    circle: '50%',
  },
  radius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    circle: '50%',
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    primary: '#6C5CE7',
    secondary: '#8A7EFA',
    success: '#2ECC71',
    warning: '#F1C40F',
    danger: '#E74C3C',
    info: '#3498DB',
    text: '#F0F0F0',
    textSecondary: '#B0B0B0',
    background: '#121212',
    backgroundHover: '#1E1E1E',
    surface: '#1A1A1A',
    surfaceVariant: '#252525',
    border: '#2D2D2D',
    borderLight: '#363636',
    gradients: {
      primary: 'linear-gradient(135deg, #6C5CE7 0%, #8A7EFA 100%)',
      secondary: 'linear-gradient(135deg, #8A7EFA 0%, #A5AFFB 100%)',
      success: 'linear-gradient(120deg, #25BD60 0%, #2ECC71 100%)',
      info: 'linear-gradient(120deg, #2980B9 0%, #3498DB 100%)',
      dark: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
    },
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.2)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.25)',
    large: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  fonts: {
    primary: "'Montserrat', 'Roboto', 'Segoe UI', sans-serif",
    secondary: "'Playfair Display', 'Georgia', serif",
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    largeDesktop: '1440px',
  },
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
  },
  spacing: {
    xxs: '0.25rem', // 4px
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    xxl: '3rem',    // 48px
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    circle: '50%',
  },
  radius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    circle: '50%',
  },
}; 