import React from 'react';
import styled from 'styled-components';
import { FaLinkedinIn, FaGlobe } from 'react-icons/fa';
import { SiGlassdoor } from 'react-icons/si';
import { BsBriefcaseFill } from 'react-icons/bs';
import Card from '../shared/Card';
import { Platform } from '../../types';

interface PlatformCardProps {
  platform: Platform;
  count: number;
  onClick: (platform: Platform) => void;
}

interface StyledCardProps {
  color?: string;
}

const StyledCard = styled(Card)<StyledCardProps & { onClick?: () => void }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.default};
  min-height: 180px;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    background-color: ${({ theme, color }) => color || theme.colors.primary + '08'};
  }
`;

const IconContainer = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${({ theme, color }) => color || theme.colors.primary};
  margin-bottom: 1rem;
  color: white;
  font-size: 2rem;
`;

const PlatformName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.text};
`;

const Count = styled.div<{ color?: string }>`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme, color }) => color || theme.colors.primary};
`;

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, count, onClick }) => {
  let icon: React.ReactElement;
  let color: string;
  
  switch (platform) {
    case 'LinkedIn':
      icon = <FaLinkedinIn size={24} />;
      color = '#0077B5';
      break;
    case 'Glassdoor':
      icon = <SiGlassdoor size={24} />;
      color = '#0CAA41';
      break;
    case 'HeadHunter':
      icon = <BsBriefcaseFill size={24} />;
      color = '#D6001C';
      break;
    default:
      icon = <FaGlobe size={24} />;
      color = '#8E8E93';
      break;
  }
  
  return (
    <StyledCard padding="medium" elevation="medium" color={color + '08'} onClick={() => onClick(platform)}>
      <IconContainer color={color}>{icon}</IconContainer>
      <PlatformName>{platform}</PlatformName>
      <Count color={color}>{count}</Count>
    </StyledCard>
  );
};

export default PlatformCard; 