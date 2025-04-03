import { createGlobalStyle, DefaultTheme } from 'styled-components';

const GlobalStyle = createGlobalStyle<{ theme: DefaultTheme }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.primary};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: 600;
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
    font-family: ${({ theme }) => theme.fonts.primary};
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, select, textarea {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 1rem;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
      outline: none;
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .error-message {
    background-color: ${({ theme }) => theme.colors.danger}20;
    color: ${({ theme }) => theme.colors.danger};
    padding: 0.75rem;
    border-radius: ${({ theme }) => theme.borderRadius.small};
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .success-message {
    background-color: ${({ theme }) => theme.colors.success}20;
    color: ${({ theme }) => theme.colors.success};
    padding: 0.75rem;
    border-radius: ${({ theme }) => theme.borderRadius.small};
    margin-bottom: 1rem;
    font-weight: 500;
  }

  /* Scrollbar customization */
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