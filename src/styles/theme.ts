export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    backgroundDark: string;
    cardBackground: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    largeDesktop: string;
  };
  radius: {
    small: string;
    medium: string;
    large: string;
  };
  transitions: {
    default: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#5856D6',
    secondary: '#34C759',
    background: '#FFFFFF',
    backgroundDark: '#F2F2F7',
    cardBackground: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C7C7CC',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    info: '#007AFF'
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1024px',
    largeDesktop: '1200px'
  },
  radius: {
    small: '4px',
    medium: '8px',
    large: '12px'
  },
  transitions: {
    default: '0.3s ease'
  },
  fonts: {
    primary: 'system-ui, -apple-system, sans-serif',
    secondary: 'system-ui, -apple-system, sans-serif'
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)'
  }
};

export const darkTheme: Theme = {
  colors: {
    primary: '#7D7DFF',
    secondary: '#4CD964',
    background: '#000000',
    backgroundDark: '#1C1C1E',
    cardBackground: '#1C1C1E',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
    info: '#0A84FF'
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1024px',
    largeDesktop: '1200px'
  },
  radius: {
    small: '4px',
    medium: '8px',
    large: '12px'
  },
  transitions: {
    default: '0.3s ease'
  },
  fonts: {
    primary: 'system-ui, -apple-system, sans-serif',
    secondary: 'system-ui, -apple-system, sans-serif'
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.3)',
    medium: '0 4px 8px rgba(0,0,0,0.3)',
    large: '0 8px 16px rgba(0,0,0,0.3)'
  }
}; 