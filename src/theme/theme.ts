import { DefaultTheme } from 'styled-components';
import { useSettings } from '../contexts/SettingsContext';

const baseTheme = {
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    largeDesktop: '1440px'
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)'
  },
  fonts: {
    primary: "'Montserrat', 'Roboto', 'Segoe UI', sans-serif",
    secondary: "'Playfair Display', 'Georgia', serif"
  },
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease'
  },
  spacing: {
    xxs: '0.25rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    circle: '50%'
  },
  radius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    circle: '50%'
  }
};

export const createTheme = (primaryColor: string): { light: DefaultTheme; dark: DefaultTheme } => ({
  light: {
    ...baseTheme,
    colors: {
      primary: primaryColor,
      secondary: '#FF9500',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      surfaceVariant: '#F1F3F5',
      text: '#212529',
      textSecondary: '#6C757D',
      border: '#DEE2E6',
      borderLight: '#E9ECEF',
      success: '#28A745',
      danger: '#DC3545',
      warning: '#FFC107',
      info: '#17A2B8',
      backgroundHover: '#E9ECEF',
      gradients: {
        primary: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}DD)`,
        secondary: 'linear-gradient(120deg, #FF9F0A 0%, #FFBF40 100%)',
        success: 'linear-gradient(120deg, #30DB5B 0%, #34D65C 100%)',
        info: 'linear-gradient(120deg, #00B9FF 0%, #64D3FF 100%)',
        dark: 'linear-gradient(135deg, #F8F8F8 0%, #E8E8E8 100%)',
        surface: 'linear-gradient(135deg, #F8F9FA, #E9ECEF)'
      }
    }
  },
  dark: {
    ...baseTheme,
    colors: {
      primary: primaryColor,
      secondary: '#8A7EFA',
      background: '#212529',
      surface: '#343A40',
      surfaceVariant: '#495057',
      text: '#F8F9FA',
      textSecondary: '#ADB5BD',
      border: '#495057',
      borderLight: '#343A40',
      success: '#28A745',
      danger: '#DC3545',
      warning: '#FFC107',
      info: '#17A2B8',
      backgroundHover: '#495057',
      gradients: {
        primary: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}DD)`,
        secondary: 'linear-gradient(135deg, #8A7EFA 0%, #A5AFFB 100%)',
        success: 'linear-gradient(120deg, #25BD60 0%, #2ECC71 100%)',
        info: 'linear-gradient(120deg, #2980B9 0%, #3498DB 100%)',
        dark: 'linear-gradient(135deg, #050505 0%, #151515 100%)',
        surface: 'linear-gradient(135deg, #343A40, #212529)'
      }
    }
  }
});

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
        surface: string;
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
  ...baseTheme,
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
      surface: 'linear-gradient(135deg, #F8F9FA, #E9ECEF)'
    }
  }
};

export const darkTheme: DefaultTheme = {
  ...baseTheme,
  colors: {
    primary: '#6C5CE7',
    secondary: '#8A7EFA',
    success: '#2ECC71',
    warning: '#F1C40F',
    danger: '#E74C3C',
    info: '#3498DB',
    text: '#F5F5F5',
    textSecondary: '#A0A0A0',
    background: '#0A0A0A',
    backgroundHover: '#151515',
    surface: '#121212',
    surfaceVariant: '#1A1A1A',
    border: '#2D2D2D',
    borderLight: '#363636',
    gradients: {
      primary: 'linear-gradient(135deg, #6C5CE7 0%, #8A7EFA 100%)',
      secondary: 'linear-gradient(135deg, #8A7EFA 0%, #A5AFFB 100%)',
      success: 'linear-gradient(120deg, #25BD60 0%, #2ECC71 100%)',
      info: 'linear-gradient(120deg, #2980B9 0%, #3498DB 100%)',
      dark: 'linear-gradient(135deg, #050505 0%, #151515 100%)',
      surface: 'linear-gradient(135deg, #343A40, #212529)'
    }
  }
}; 