import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FormContainer, FormTitle, FormGroup, Input, Button, ErrorMessage, LinkText } from './AuthStyles';

interface LoginFormProps {
  onToggleAuth: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleAuth }) => {
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>Sign In</FormTitle>
      
      <FormGroup>
        <FiMail />
        <Input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </FormGroup>

      <FormGroup>
        <FiLock />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
      </FormGroup>

      {(error || authError) && (
        <ErrorMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error || authError}
        </ErrorMessage>
      )}

      <Button 
        type="submit" 
        disabled={loading}
        className="mt-4"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <LinkText onClick={onToggleAuth}>
        Don't have an account? Sign up
      </LinkText>
    </FormContainer>
  );
}; 