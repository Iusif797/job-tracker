import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { lightTheme } from './theme/theme';
import GlobalStyle from './theme/globalStyle';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppContent from './components/AppContent';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <SettingsProvider>
          <ThemeProvider theme={lightTheme}>
            <GlobalStyle />
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </SettingsProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
