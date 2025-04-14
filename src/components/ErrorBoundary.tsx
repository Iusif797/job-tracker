import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorMessage = styled.h1`
  margin-bottom: 20px;
`;

const ErrorDetails = styled.pre`
  margin-top: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  overflow: auto;
  max-width: 800px;
  width: 100%;
`;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorMessage>Что-то пошло не так</ErrorMessage>
          <p>Приложение столкнулось с неожиданной ошибкой.</p>
          {this.state.error && (
            <ErrorDetails>
              {this.state.error.toString()}
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 