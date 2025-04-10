import React from 'react';
import styled from 'styled-components';
import { FaFolder, FaStar, FaArchive, FaInbox } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface FolderProps {
  id: string;
  name: string;
  count: number;
  color?: string;
  icon?: string;
  active: boolean;
  onClick: () => void;
}

const StyledFolder = styled(motion.div)<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  background: ${({ $active, theme, $color }) => 
    $active ? `${$color}30` : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme, $active }) => 
    $active ? theme.shadows.medium : theme.shadows.small};
  border-left: 4px solid ${({ $active, $color }) => 
    $active ? $color : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ $active, theme, $color }) => 
      $active ? `${$color}40` : theme.colors.backgroundHover};
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => `${$color}30`};
  color: ${({ $color }) => $color};
  font-size: 18px;
`;

const FolderInfo = styled.div`
  flex: 1;
`;

const FolderName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const FolderCount = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FolderItem: React.FC<FolderProps> = ({ 
  id, 
  name, 
  count, 
  color = '#5856D6', 
  icon = 'folder',
  active,
  onClick
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'star':
        return <FaStar />;
      case 'archive':
        return <FaArchive />;
      case 'responses':
        return <FaInbox />;
      default:
        return <FaFolder />;
    }
  };
  
  return (
    <StyledFolder 
      $active={active} 
      $color={color}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <IconWrapper $color={color}>
        {getIcon()}
      </IconWrapper>
      <FolderInfo>
        <FolderName>{name}</FolderName>
        <FolderCount>{count} {count === 1 ? 'отклик' : count > 1 && count < 5 ? 'отклика' : 'откликов'}</FolderCount>
      </FolderInfo>
    </StyledFolder>
  );
};

export default FolderItem; 