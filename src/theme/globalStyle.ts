import { createGlobalStyle, DefaultTheme } from 'styled-components';

interface GlobalStyleProps {
  theme: DefaultTheme;
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 14px;
    }
  }
  
  body {
    font-family: ${({ theme }) => theme.fonts.primary};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  h1 {
    font-size: 2.25rem;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 1.8rem;
    }
  }
  
  h2 {
    font-size: 1.8rem;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 1.5rem;
    }
  }
  
  h3 {
    font-size: 1.5rem;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 1.3rem;
    }
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
  
  button {
    cursor: pointer;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 1rem;
    
    &:focus {
      outline: none;
    }
  }
  
  input, select, textarea {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 1rem;
    padding: 0.75rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}25`};
    }
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      width: 100%;
      padding: 0.6rem 0.8rem;
    }
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      padding: 0 0.5rem;
    }
  }
  
  .error-message {
    background-color: ${({ theme }) => `${theme.colors.danger}15`};
    color: ${({ theme }) => theme.colors.danger};
    padding: 0.75rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    margin-bottom: 1rem;
  }
  
  .success-message {
    background-color: ${({ theme }) => `${theme.colors.success}15`};
    color: ${({ theme }) => theme.colors.success};
    padding: 0.75rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    margin-bottom: 1rem;
  }
  
  /* Стили для мобильных устройств */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    .hide-on-mobile {
      display: none;
    }
    
    .mobile-full-width {
      width: 100%;
      max-width: 100%;
    }
    
    .mobile-text-center {
      text-align: center;
    }
    
    .mobile-stack {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .mobile-small-padding {
      padding: 0.5rem !important;
    }
  }

  /* Улучшенный скроллбар */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.borderLight};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

export default GlobalStyle; 