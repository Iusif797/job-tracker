import React, { forwardRef, ElementType, ComponentPropsWithRef } from 'react';
import styled from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'icon' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  as?: ElementType;
  className?: string;
  'aria-label'?: string;
}

const StyledButton = styled.button<{ 
  variant: ButtonVariant; 
  size: ButtonSize;
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  border: none;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  
  /* Size styles */
  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border-radius: 6px;
        `;
      case 'large':
        return `
          padding: 0.875rem 1.75rem;
          font-size: 1.125rem;
          border-radius: 10px;
        `;
      default: // medium
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: 8px;
        `;
    }
  }}
  
  /* Mobile adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    ${({ size }) => {
      switch (size) {
        case 'small':
          return `
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
          `;
        case 'large':
          return `
            padding: 0.7rem 1.4rem;
            font-size: 1rem;
          `;
        default: // medium
          return `
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          `;
      }
    }}
  }
  
  /* Special case for icon buttons */
  ${({ variant, size }) => 
    variant === 'icon' && `
      padding: ${size === 'small' ? '0.4rem' : size === 'large' ? '0.6rem' : '0.5rem'};
      border-radius: 50%;
      
      @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
        padding: ${size === 'small' ? '0.35rem' : size === 'large' ? '0.55rem' : '0.45rem'};
      }
    `
  }
  
  /* Variant styles */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.gradients?.primary || theme.colors.primary};
          color: white;
          box-shadow: 0 2px 8px ${theme.colors.primary}40;
          &:hover {
            box-shadow: 0 4px 12px ${theme.colors.primary}60;
            transform: translateY(-2px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.gradients?.secondary || theme.colors.secondary};
          color: white;
          box-shadow: 0 2px 8px ${theme.colors.secondary}40;
          &:hover {
            box-shadow: 0 4px 12px ${theme.colors.secondary}60;
            transform: translateY(-2px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(120deg, ${theme.colors.danger} 0%, ${theme.colors.danger}DD 100%);
          color: white;
          box-shadow: 0 2px 8px ${theme.colors.danger}40;
          &:hover {
            box-shadow: 0 4px 12px ${theme.colors.danger}60;
            transform: translateY(-2px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'success':
        return `
          background: linear-gradient(120deg, ${theme.colors.success} 0%, ${theme.colors.success}DD 100%);
          color: white;
          box-shadow: 0 2px 8px ${theme.colors.success}40;
          &:hover {
            box-shadow: 0 4px 12px ${theme.colors.success}60;
            transform: translateY(-2px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'warning':
        return `
          background: linear-gradient(120deg, ${theme.colors.warning} 0%, ${theme.colors.warning}DD 100%);
          color: white;
          box-shadow: 0 2px 8px ${theme.colors.warning}40;
          &:hover {
            box-shadow: 0 4px 12px ${theme.colors.warning}60;
            transform: translateY(-2px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          border: 1px solid ${theme.colors.border};
          color: ${theme.colors.text};
          &:hover {
            background-color: ${theme.colors.backgroundHover || 'rgba(0,0,0,0.05)'};
            transform: translateY(-2px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'icon':
        return `
          background-color: transparent;
          color: ${theme.colors.text};
          &:hover {
            background-color: ${theme.colors.backgroundHover || 'rgba(0,0,0,0.05)'};
            transform: translateY(-2px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      default:
        return '';
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  /* Touch improvements for mobile */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', 
  size = 'medium',
  onClick, 
  children, 
  type = 'button',
  disabled = false,
  fullWidth = false,
  as,
  className,
  'aria-label': ariaLabel
}, ref) => {
  return (
    <StyledButton
      as={as}
      ref={ref}
      variant={variant}
      size={size}
      onClick={onClick}
      type={type}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button; 