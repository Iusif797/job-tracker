import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#5856D6', // Яркий фиолетовый
    secondary: '#2AC9DE', // Яркий голубой
    accent: '#FF2D55', // Яркий розовый
    success: '#34C759', // Зеленый
    warning: '#FF9500', // Оранжевый
    danger: '#FF3B30', // Красный
    background: '#F8F9FA',
    backgroundDark: '#F1F2F3',
    cardBackground: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6C757D',
    border: '#E1E4E8',
    // Удаляем 'error', так как он дублирует 'danger'
  },
  fonts: {
    main: "'Montserrat', 'Roboto', sans-serif",
    heading: "'Montserrat', 'Roboto', sans-serif",
    primary: "'Montserrat', 'Roboto', sans-serif",
    secondary: "'Montserrat', 'Roboto', sans-serif"
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    largeDesktop: '1200px'
  },
  shadows: {
    small: '0 2px 5px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 10px rgba(0, 0, 0, 0.1)',
    large: '0 8px 30px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    default: '0.3s ease'
  },
  radius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%'
  }
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }
  
  body {
    font-family: ${({ theme }) => theme.fonts.primary};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.secondary};
    line-height: 1.2;
  }
  
  button, input, select, textarea {
    font-family: inherit;
  }
  
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    transition: color ${({ theme }) => theme.transitions.default};
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button {
    cursor: pointer;
    border: none;
    background: none;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .error-message {
    background-color: ${({ theme }) => theme.colors.danger}; // Исправлено на 'danger'
    color: white;
    padding: 1rem;
    margin: 1rem;
    border-radius: ${({ theme }) => theme.radius.medium};
    text-align: center;
  }
`;

export default GlobalStyle; 