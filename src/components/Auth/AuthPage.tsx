import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

// Создаем простой компонент Logo
const LogoComponent = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: ${props => props.size * 0.4}px;
`;

const Logo = ({ size = 40 }: { size?: number }) => (
  <LogoComponent size={size}>JT</LogoComponent>
);

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.gradients.primary};
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  
  @keyframes gradientAnimation {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
`;

const AuthCard = styled(motion.div)`
  width: 100%;
  max-width: 460px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 2.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem 1.5rem;
    max-width: 95%;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AppTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0.5rem 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const AppSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const FormContainer = styled(motion.div)`
  width: 100%;
`;

// Анимация для переключения между формами
const formVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Перенаправление на главную страницу, если пользователь уже авторизован
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <AuthContainer>
      <AuthCard 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LogoContainer>
          <Logo size={50} />
          <AppTitle>{t('auth.appTitle')}</AppTitle>
          <AppSubtitle>{t('auth.appDescription')}</AppSubtitle>
        </LogoContainer>

        <AnimatePresence mode="wait">
          <FormContainer
            key={isLogin ? 'login' : 'register'}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isLogin ? (
              <LoginForm onToggleAuth={toggleAuthMode} />
            ) : (
              <RegisterForm onToggleAuth={toggleAuthMode} />
            )}
          </FormContainer>
        </AnimatePresence>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage; 