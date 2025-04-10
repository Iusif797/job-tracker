import React from 'react';
import styled from 'styled-components';
import { Application, Status } from '../../types';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaStar, FaRegStar, FaFolder, FaFolderOpen } from 'react-icons/fa';
import { formatDate } from '../../utils/formatters';

interface ApplicationCardProps {
  application: Application;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (application: Application) => void;
  onToggleFolder: (application: Application, folderId: string) => void;
  inResponses: boolean;
}

const CardContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border-left: 4px solid ${({ color }) => color || '#6C5CE7'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const PositionText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const StatusTag = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  background-color: ${({ color }) => `${color}30` || '#6C5CE7'};
  color: ${({ color }) => color || '#6C5CE7'};
  margin-right: 8px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FolderButton = styled(IconButton)<{ active: boolean }>`
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textSecondary};
  background: ${({ active, theme }) => active ? `${theme.colors.primary}10` : 'transparent'};
`;

const FavoriteButton = styled(IconButton)<{ favorite: boolean }>`
  color: ${({ favorite }) => favorite ? '#F1C40F' : 'inherit'};
  
  &:hover {
    color: #F1C40F;
  }
`;

// Цвета для статусов заявок
const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'Applied':
      return '#3498DB';
    case 'Viewed':
      return '#9B59B6';
    case 'Interview':
      return '#F1C40F';
    case 'Offer':
      return '#2ECC71';
    case 'Rejected':
      return '#E74C3C';
    default:
      return '#95A5A6';
  }
};

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleFolder,
  inResponses
}) => {
  const statusColor = getStatusColor(application.status);
  const isFavorite = Boolean(application.favorite);
  
  // Переводим статусы на русский
  const getStatusText = (status: Status): string => {
    switch (status) {
      case 'Applied':
        return 'Отправлено';
      case 'Viewed':
        return 'Просмотрено';
      case 'Interview':
        return 'Интервью';
      case 'Offer':
        return 'Оффер';
      case 'Rejected':
        return 'Отказ';
      default:
        return status;
    }
  };
  
  return (
    <CardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      color={statusColor}
    >
      <CardHeader>
        <CompanyInfo>
          <CompanyName>{application.company || 'Без названия'}</CompanyName>
          <PositionText>{application.position}</PositionText>
          <StatusTag color={statusColor}>
            {getStatusText(application.status)}
          </StatusTag>
          {application.platform && (
            <StatusTag color="#95A5A6">
              {application.platform}
            </StatusTag>
          )}
        </CompanyInfo>
        
        <ActionButtons>
          <FavoriteButton
            favorite={isFavorite}
            onClick={() => onToggleFavorite(application)}
            aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            {isFavorite ? <FaStar size={18} /> : <FaRegStar size={18} />}
          </FavoriteButton>
          
          <FolderButton
            active={inResponses}
            onClick={() => onToggleFolder(application, 'responses')}
            aria-label={inResponses ? 'Убрать из откликов' : 'Добавить в отклики'}
          >
            {inResponses ? <FaFolderOpen size={18} /> : <FaFolder size={18} />}
          </FolderButton>
          
          <IconButton
            onClick={() => onEdit(application.id)}
            aria-label="Редактировать"
          >
            <FaEdit size={18} />
          </IconButton>
          
          <IconButton
            onClick={() => onDelete(application.id)}
            aria-label="Удалить"
          >
            <FaTrash size={18} />
          </IconButton>
        </ActionButtons>
      </CardHeader>
      
      <CardFooter>
        <MetaInfo>
          <MetaItem>
            Дата: {formatDate(application.date)}
          </MetaItem>
          {application.salary && (
            <MetaItem>
              Зарплата: {application.salary.toLocaleString()} ₽
            </MetaItem>
          )}
        </MetaInfo>
      </CardFooter>
    </CardContainer>
  );
};

export default ApplicationCard; 