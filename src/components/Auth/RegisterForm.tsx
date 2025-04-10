import React, { useState } from 'react';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { FormContainer, FormTitle, FormGroup, Input, Button, ErrorMessage, LinkText } from './AuthStyles';

interface RegisterFormProps {
  onToggleAuth: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleAuth }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      await register(formData.email, formData.password, formData.name);
    } catch (err) {
      console.error('Registration error:', err);
      if (!navigator.onLine) {
        setError('Please check your internet connection');
      } else if (err instanceof Error && 'response' in err) {
        const apiError = err as any;
        if (apiError.code === 'ERR_NETWORK') {
          setError('Unable to connect to the server. Please check if the server is running.');
        } else {
          setError(apiError.response?.data?.message || 'Registration failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>Create Account</FormTitle>
      
      <FormGroup>
        <FiUser />
        <Input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <FiMail />
        <Input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
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
          autoComplete="new-password"
        />
      </FormGroup>

      <FormGroup>
        <FiLock />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />
      </FormGroup>

      {error && (
        <ErrorMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </ErrorMessage>
      )}

      <Button 
        type="submit" 
        disabled={loading}
        className="mt-4"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>

      <LinkText onClick={onToggleAuth}>
        Already have an account? Sign in
      </LinkText>
    </FormContainer>
  );
}; 