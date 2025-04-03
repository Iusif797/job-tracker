import React from 'react';
import styled from 'styled-components';
import { Application, Status } from '../../types';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import Card from '../shared/Card';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const KanbanContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const KanbanColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ColumnHeader = styled.div<{ color: string }>`
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ color }) => color};
  color: white;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  border-left: 4px solid ${({ theme, color }) => color || theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  ${({ $isFavorite }) => $isFavorite && `
    background-color: rgba(255, 193, 7, 0.05);
  `}
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CompanyName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Position = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Details = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span<{ color?: string }>`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, color }) => color || theme.colors.surfaceVariant};
  color: ${({ theme, color }) => color ? 'white' : theme.colors.text};
  font-size: 0.8rem;
  font-weight: 500;
`;

const DateDisplay = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;

const ActionButton = styled.button<{ color?: string }>`
  background-color: transparent;
  color: ${({ theme, color }) => color || theme.colors.textSecondary};
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
    color: ${({ theme, color }) => color || theme.colors.text};
  }
`;

const FavoriteButton = styled(ActionButton)<{ $isFavorite: boolean }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: ${({ $isFavorite }) => $isFavorite ? '#FFC107' : 'inherit'};
`;

const NoApplicationsMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface ApplicationListProps {
  applications: Application[];
  onUpdate: (application: Application) => void;
  onDelete: (id: string) => void;
  viewMode: 'list' | 'kanban';
}

const ApplicationList: React.FC<ApplicationListProps> = ({ 
  applications, 
  onUpdate, 
  onDelete,
  viewMode 
}) => {
  const toggleFavorite = (application: Application) => {
    onUpdate({
      ...application,
      favorite: !application.favorite
    });
  };
  
  const getStatusColor = (status: Status): string => {
    switch (status) {
      case 'Applied': return '#5AC8FA';
      case 'Viewed': return '#FFCC00';
      case 'Interview': return '#FF9500';
      case 'Offer': return '#34C759';
      case 'Rejected': return '#FF3B30';
      default: return '#8E8E93';
    }
  };
  
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };
  
  const sortApplications = (a: Application, b: Application): number => {
    try {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    } catch (error) {
      return 0;
    }
  };
  
  const renderApplicationItem = (application: Application) => {
    const statusColor = getStatusColor(application.status);
    const isFavorite = Boolean(application.favorite);
    
    return (
      <StyledCard 
        key={application.id}
        padding="medium"
        elevation="small"
        color={statusColor}
        $isFavorite={isFavorite}
      >
        <ApplicationHeader>
          <div>
            <CompanyName>{application.company}</CompanyName>
            <Position>{application.position}</Position>
          </div>
          <Tag color={statusColor}>
            {application.status}
          </Tag>
        </ApplicationHeader>
        
        <Details>
          <Tag>{application.platform}</Tag>
          {application.location && <Tag>{application.location}</Tag>}
          {application.remote && <Tag color="#5856D6">Удаленная</Tag>}
          {application.salary && <Tag color="#34C759">{application.salary.toLocaleString()} ₽</Tag>}
        </Details>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DateDisplay>{formatDate(application.date)}</DateDisplay>
          <ActionButtons>
            <ActionButton 
              onClick={() => console.log(`Edit application ${application.id}`)}
              color={getStatusColor('Applied')}
            >
              <FaEdit size={16} />
            </ActionButton>
            <ActionButton 
              onClick={() => onDelete(application.id)}
              color={getStatusColor('Rejected')}
            >
              <FaTrash size={16} />
            </ActionButton>
          </ActionButtons>
        </div>
        
        <FavoriteButton 
          $isFavorite={isFavorite}
          onClick={() => toggleFavorite(application)}
        >
          <FaStar size={16} />
        </FavoriteButton>
      </StyledCard>
    );
  };
  
  if (applications.length === 0) {
    return <NoApplicationsMessage>Нет заявок для отображения</NoApplicationsMessage>;
  }
  
  if (viewMode === 'list') {
    return (
      <ListContainer>
        {applications
          .sort(sortApplications)
          .map(renderApplicationItem)}
      </ListContainer>
    );
  }
  
  // Канбан режим
  const statusColumns: Status[] = ['Applied', 'Viewed', 'Interview', 'Offer', 'Rejected'];
  
  return (
    <KanbanContainer>
      {statusColumns.map(status => {
        const filteredApps = applications.filter(app => app.status === status);
        return (
          <KanbanColumn key={status}>
            <ColumnHeader color={getStatusColor(status)}>
              {status} ({filteredApps.length})
            </ColumnHeader>
            {filteredApps.length > 0 ? (
              filteredApps
                .sort(sortApplications)
                .map(renderApplicationItem)
            ) : (
              <NoApplicationsMessage>Нет заявок</NoApplicationsMessage>
            )}
          </KanbanColumn>
        );
      })}
    </KanbanContainer>
  );
};

export default ApplicationList; 