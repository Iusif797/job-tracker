import styled from 'styled-components';
import { motion } from 'framer-motion';

export const FormContainer = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
`;

export const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.75rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

export const FormGroup = styled.div`
  position: relative;
  margin-bottom: 1.25rem;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.1rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.medium};
  background-color: ${({ theme }) => theme.colors.background}80;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

export const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.medium};
  background-color: ${({ theme, disabled }) => 
    disabled ? theme.colors.textSecondary : theme.colors.primary};
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  
  &.mt-4 {
    margin-top: 1rem;
  }
`;

export const ErrorMessage = styled(motion.div)`
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 0.5rem;
  font-size: 0.85rem;
  text-align: center;
`;

export const LinkText = styled.p`
  text-align: center;
  margin-top: 1.25rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`; 