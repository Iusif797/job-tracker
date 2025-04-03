import React from 'react';
import styled from 'styled-components';

export interface CardProps {
  padding?: 'none' | 'small' | 'medium' | 'large';
  elevation?: 'none' | 'small' | 'medium' | 'high';
  color?: string;
  $isFavorite?: boolean;
  className?: string;
  children: React.ReactNode;
}

const CardWrapper = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  
  padding: ${({ theme, padding }) => {
    switch (padding) {
      case 'small': return theme.spacing.xs;
      case 'medium': return theme.spacing.md;
      case 'large': return theme.spacing.lg;
      case 'none':
      default: return '0';
    }
  }};
  
  box-shadow: ${({ theme, elevation }) => {
    switch (elevation) {
      case 'small': return theme.shadows.small;
      case 'medium': return theme.shadows.medium;
      case 'high': return theme.shadows.large;
      case 'none':
      default: return 'none';
    }
  }};
  
  transition: box-shadow ${({ theme }) => theme.transitions.default};
  
  ${({ $isFavorite }) => $isFavorite && `
    background-color: rgba(255, 193, 7, 0.05);
  `}
`;

const Card: React.FC<CardProps> = ({ 
  children, 
  padding = 'medium',
  elevation = 'small',
  color,
  $isFavorite,
  className 
}) => {
  return (
    <CardWrapper 
      padding={padding} 
      elevation={elevation}
      color={color}
      $isFavorite={$isFavorite}
      className={className}
    >
      {children}
    </CardWrapper>
  );
};

export default Card; 