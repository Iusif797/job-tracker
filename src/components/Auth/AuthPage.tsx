import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from 'styled-components';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(-45deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary}, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.info || '#2AC9DE'}
  );
  background-size: 400% 400%;
  animation: ${keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `} 15s ease infinite;
`;

const AuthCard = styled(motion.div)`
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  position: relative;
  overflow: hidden;
  margin-top: 2rem;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  max-width: 450px;
  margin: 0 auto;
`;

const variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Перенаправление, если пользователь уже авторизован
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Если пользователь авторизован, перенаправляем на главную
  if (isAuthenticated && user) {
    return <Navigate to="/" />;
  }
  
  return (
    <AuthContainer>
      <Logo>JobTracker</Logo>
      <Subtitle>Отслеживайте все отклики по работе в одном месте</Subtitle>
      
      <AnimatePresence mode="wait">
        {isLogin ? (
          <AuthCard
            key="login"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <LoginForm onRegisterClick={() => setIsLogin(false)} />
          </AuthCard>
        ) : (
          <AuthCard
            key="register"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <RegisterForm onLoginClick={() => setIsLogin(true)} />
          </AuthCard>
        )}
      </AnimatePresence>
    </AuthContainer>
  );
};

export default AuthPage; 