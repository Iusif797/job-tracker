import React from 'react';
import styled from 'styled-components';
import { FaLinkedinIn, FaGlobe, FaUserTie, FaPlus } from 'react-icons/fa';
import { SiGlassdoor, SiIndeed } from 'react-icons/si';
import { BsBriefcaseFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { Platform } from '../../types';

interface PlatformCardProps {
  platform: Platform;
  count: number;
  onClick: (platform: Platform) => void;
  active?: boolean;
  onQuickAdd?: (platform: Platform) => void;
}

const StyledCard = styled(motion.div)<{ color?: string; active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.default};
  min-height: 180px;
  cursor: pointer;
  padding: 1.5rem;
  background-color: ${({ active, color }) => 
    active ? `${color}15` : 'rgba(255, 255, 255, 0.8)'};
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme, active }) => 
    active ? theme.shadows.medium : theme.shadows.small};
  backdrop-filter: blur(10px);
  border-left: ${({ active, color }) => 
    active ? `4px solid ${color}` : '4px solid transparent'};
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    background-color: ${({ color, active }) => 
      active ? `${color}15` : 'rgba(255, 255, 255, 0.9)'};
  }
`;

const QuickAddButton = styled.button<{ color?: string }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ color }) => color || '#5856D6'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  opacity: 0.8;
  
  &:hover {
    transform: scale(1.1);
    opacity: 1;
  }
`;

const IconContainer = styled.div<{ color?: string; active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${({ color, active }) => 
    active 
      ? `linear-gradient(135deg, ${color} 0%, ${color}99 100%)` 
      : `linear-gradient(135deg, ${color}80 0%, ${color}40 100%)`};
  margin-bottom: 1.5rem;
  color: white;
  font-size: 2rem;
  box-shadow: ${({ active, theme, color }) => 
    active ? `0 8px 20px ${color}40` : theme.shadows.small};
  transition: all 0.3s ease;
`;

const PlatformName = styled.h3<{ active?: boolean }>`
  margin: 0 0 0.75rem 0;
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ active }) => active ? '600' : '500'};
  font-size: 1.2rem;
`;

const Count = styled.div<{ color?: string; active?: boolean }>`
  font-size: 2.2rem;
  font-weight: bold;
  color: ${({ color, active }) => active ? color : `${color}99`};
  text-shadow: ${({ active }) => active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'};
`;

const Badge = styled.span`
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  margin-top: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PlatformCard: React.FC<PlatformCardProps> = ({ 
  platform, 
  count, 
  onClick, 
  onQuickAdd,
  active = false 
}) => {
  let icon: React.ReactElement;
  let color: string;
  let badge: string = '';
  
  const platformName = platform as string;
  
  switch (platformName) {
    case 'LinkedIn':
      icon = <FaLinkedinIn size={32} />;
      color = '#0077B5';
      badge = 'Социальная сеть';
      break;
    case 'Glassdoor':
      icon = <SiGlassdoor size={32} />;
      color = '#0CAA41';
      badge = 'Отзывы о компаниях';
      break;
    case 'HeadHunter':
      icon = <BsBriefcaseFill size={32} />;
      color = '#D6001C';
      badge = 'HH.ru';
      break;
    case 'Indeed':
      icon = <SiIndeed size={32} />;
      color = '#003A9B';
      badge = 'Международная биржа';
      break;
    case 'Прямой контакт':
      icon = <FaUserTie size={32} />;
      color = '#FF9500';
      badge = 'Личный контакт';
      break;
    default:
      icon = <FaGlobe size={32} />;
      color = '#8E8E93';
      badge = 'Другая платформа';
      break;
  }
  
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(platform);
    }
  };

  return (
    <StyledCard 
      color={color} 
      active={active}
      onClick={() => onClick(platform)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {onQuickAdd && (
        <QuickAddButton color={color} onClick={handleQuickAdd}>
          <FaPlus size={14} />
        </QuickAddButton>
      )}
      
      <IconContainer color={color} active={active}>{icon}</IconContainer>
      <PlatformName active={active}>{platform}</PlatformName>
      <Count color={color} active={active}>{count}</Count>
      <Badge>{badge}</Badge>
    </StyledCard>
  );
};

export default PlatformCard; 