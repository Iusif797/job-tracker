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
      primary: 'linear-gradient(120deg, #5856D6 0%, #7A79E3 100%)',
      secondary: 'linear-gradient(120deg, #FF9500 0%, #FFBD3C 100%)',
      success: 'linear-gradient(120deg, #34C759 0%, #30D158 100%)',
      info: 'linear-gradient(120deg, #5AC8FA 0%, #64D2FF 100%)',
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
    primary: '#7A79E3',
    secondary: '#FFBD3C',
    success: '#30D158',
    warning: '#FFD60A',
    danger: '#FF453A',
    info: '#64D2FF',
    text: '#F2F2F7',
    textSecondary: '#AEAEB2',
    background: '#1C1C1E',
    backgroundHover: '#2C2C2E',
    surface: '#2C2C2E',
    surfaceVariant: '#3A3A3C',
    border: '#48484A',
    borderLight: '#3A3A3C',
    gradients: {
      primary: 'linear-gradient(120deg, #5F5DC5 0%, #8D8CE3 100%)',
      secondary: 'linear-gradient(120deg, #FF9F0A 0%, #FFBF40 100%)',
      success: 'linear-gradient(120deg, #30DB5B 0%, #34D65C 100%)',
      info: 'linear-gradient(120deg, #70D7FF 0%, #84DBFF 100%)',
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