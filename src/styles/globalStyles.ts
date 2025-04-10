import { createGlobalStyle, keyframes } from 'styled-components';

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
    // Градиенты для фона
    gradients: {
      primary: 'linear-gradient(135deg, #5856D6 0%, #2AC9DE 100%)',
      secondary: 'linear-gradient(135deg, #FF2D55 0%, #FFBD2E 100%)',
      dark: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    },
  },
  fonts: {
    main: "'Poppins', 'Manrope', sans-serif",
    heading: "'Poppins', 'Manrope', sans-serif",
    primary: "'Poppins', 'Manrope', sans-serif",
    secondary: "'Manrope', 'Poppins', sans-serif"
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

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
    scroll-behavior: smooth;
    height: 100%;
  }
  
  body {
    font-family: ${({ theme }) => theme.fonts.primary};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    background: linear-gradient(-45deg, #5856D6, #2AC9DE, #FF2D55, #FFBD2E);
    background-size: 400% 400%;
    animation: ${gradientAnimation} 15s ease infinite;
    
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(100px);
      z-index: -1;
    }
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.secondary};
    line-height: 1.2;
    letter-spacing: -0.02em;
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
    background-color: ${({ theme }) => theme.colors.danger};
    color: white;
    padding: 1rem;
    margin: 1rem;
    border-radius: ${({ theme }) => theme.radius.medium};
    text-align: center;
  }
  
  /* Стили для карточек откликов */
  .application-card {
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.radius.medium};
    padding: 1.5rem;
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transition: all ${({ theme }) => theme.transitions.default};
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: ${({ theme }) => theme.shadows.large};
    }
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      padding: 1rem;
    }
  }
  
  .application-title {
    font-weight: 600;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.text};
  }
  
  .application-company {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
  }
  
  .application-status {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 1rem;
    
    &.sent {
      background-color: ${({ theme }) => theme.colors.primary}20;
      color: ${({ theme }) => theme.colors.primary};
    }
    
    &.interview {
      background-color: ${({ theme }) => theme.colors.warning}20;
      color: ${({ theme }) => theme.colors.warning};
    }
    
    &.offer {
      background-color: ${({ theme }) => theme.colors.success}20;
      color: ${({ theme }) => theme.colors.success};
    }
    
    &.rejected {
      background-color: ${({ theme }) => theme.colors.danger}20;
      color: ${({ theme }) => theme.colors.danger};
    }
  }
  
  .application-date {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export default GlobalStyle; 