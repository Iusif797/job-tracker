import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import { useAuth } from '../../contexts/AuthContext';

const FormContainer = styled(motion.div)`
  max-width: 400px;
  width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: 1rem auto;
    padding: 1.5rem;
    max-width: 90%;
  }
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 0.75rem;
  font-size: 0.9rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 1rem;
    font-size: 0.85rem;
  }
`;

interface RegisterFormProps {
  onLoginClick: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { register, error, loading, clearError } = useAuth();
  const { t } = useTranslation();
  
  const validateForm = () => {
    setPasswordError('');
    
    if (password !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Пароль должен быть не менее 6 символов');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    clearError();
    await register(name, email, password);
  };
  
  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FormTitle>{t('auth.register')}</FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">{t('auth.name')}</Label>
          <Input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
          <Input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>
        
        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={loading || !name || !email || !password || !confirmPassword}
        >
          {loading ? '...' : t('auth.register')}
        </Button>
      </form>
      
      <LinkText>
        {t('auth.alreadyHaveAccount')} <a href="#" onClick={onLoginClick}>{t('auth.login')}</a>
      </LinkText>
    </FormContainer>
  );
};

export default RegisterForm; 