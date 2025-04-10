import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Application, Status } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import FolderItem from '../shared/FolderItem';
import ApplicationCard from './ApplicationCard';
import { useTranslation } from 'react-i18next';

// Локальное определение интерфейса Folder
interface Folder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  count?: number;
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`;

const KanbanContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
`;

const KanbanColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ColumnHeader = styled.div<{ color: string }>`
  background: ${({ color }) => `${color}20`};
  color: ${({ color }) => color};
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusCount = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
`;

const FoldersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const NoApplicationsMessage = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

// Предопределенные папки
const DEFAULT_FOLDERS: Folder[] = [
  { id: 'all', name: 'Все заявки', color: '#3498DB', icon: 'folder' },
  { id: 'responses', name: 'Отклики', color: '#6C5CE7', icon: 'responses' },
  { id: 'favorites', name: 'Избранное', color: '#F1C40F', icon: 'star' }
];

// Цвета для статусов
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

// Перевод статусов на русский
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

interface ApplicationListProps {
  applications: Application[];
  onUpdate: (application: Application) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  viewMode?: 'list' | 'kanban';
  folders?: Folder[];
}

const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  onUpdate,
  onDelete,
  onEdit,
  viewMode = 'list',
  folders = []
}) => {
  const [activeFolder, setActiveFolder] = useState<string | null>('all');
  const { t } = useTranslation();
  
  // Объединяем стандартные папки и пользовательские
  const allFolders = useMemo(() => {
    return [...DEFAULT_FOLDERS, ...folders.filter(f => 
      !DEFAULT_FOLDERS.some(df => df.id === f.id)
    )];
  }, [folders]);
  
  // Фильтруем заявки по активной папке
  const filteredApplications = useMemo(() => {
    if (!activeFolder || activeFolder === 'all') {
      return applications;
    } else if (activeFolder === 'favorites') {
      return applications.filter(app => app.favorite);
    }
    return applications.filter(app => app.folder === activeFolder);
  }, [applications, activeFolder]);
  
  // Сортировка по дате (новые сначала)
  const sortedApplications = useMemo(() => {
    return [...filteredApplications].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredApplications]);
  
  const toggleFavorite = (application: Application) => {
    onUpdate({
      ...application,
      favorite: !application.favorite
    });
  };
  
  const toggleFolder = (application: Application, folderId: string) => {
    onUpdate({
      ...application,
      folder: application.folder === folderId ? undefined : folderId
    });
  };
  
  // Рендер списка заявок
  const renderApplicationItems = () => {
    if (filteredApplications.length === 0) {
      return (
        <NoApplicationsMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>{t('applications.noApplicationsInFolder') || 'Нет заявок в этой папке'}</p>
        </NoApplicationsMessage>
      );
    }
    
    return (
      <AnimatePresence>
        {sortedApplications.map(application => (
          <ApplicationCard
            key={application.id}
            application={application}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={toggleFavorite}
            onToggleFolder={toggleFolder}
            inResponses={application.folder === 'responses'}
          />
        ))}
      </AnimatePresence>
    );
  };
  
  // Рендер папок
  const renderFolders = () => (
    <FoldersContainer>
      {allFolders.map(folder => {
        const folderCount = folder.id === 'all' 
          ? applications.length 
          : folder.id === 'favorites'
            ? applications.filter(app => app.favorite).length
            : applications.filter(app => app.folder === folder.id).length;
        
        return (
          <FolderItem
            key={folder.id}
            id={folder.id}
            name={folder.name}
            count={folderCount}
            color={folder.color}
            icon={folder.id === 'responses' ? 'responses' : folder.icon}
            active={activeFolder === folder.id}
            onClick={() => setActiveFolder(folder.id)}
          />
        );
      })}
    </FoldersContainer>
  );
  
  // Группировка заявок по статусу для Kanban
  const groupedByStatus = useMemo(() => {
    const result: Record<Status, Application[]> = {
      'Applied': [],
      'Viewed': [],
      'Interview': [],
      'Offer': [],
      'Rejected': []
    };
    
    sortedApplications.forEach(app => {
      if (result[app.status]) {
        result[app.status].push(app);
      }
    });
    
    return result;
  }, [sortedApplications]);
  
  // Порядок колонок в Kanban
  const statusOrder: Status[] = ['Applied', 'Viewed', 'Interview', 'Offer', 'Rejected'];
  
  // Отрисовка в режиме Kanban
  const renderKanbanView = () => (
    <KanbanContainer>
      {statusOrder.map(status => (
        <KanbanColumn key={status}>
          <ColumnHeader color={getStatusColor(status)}>
            <div>{getStatusText(status)}</div>
            <StatusCount>
              {groupedByStatus[status]?.length || 0}
            </StatusCount>
          </ColumnHeader>
          <AnimatePresence>
            {groupedByStatus[status]?.map(application => (
              <ApplicationCard
                key={application.id}
                application={application}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={toggleFavorite}
                onToggleFolder={toggleFolder}
                inResponses={application.folder === 'responses'}
              />
            ))}
          </AnimatePresence>
        </KanbanColumn>
      ))}
    </KanbanContainer>
  );
  
  return (
    <>
      {renderFolders()}
      {viewMode === 'list' ? (
        <ListContainer>
          {renderApplicationItems()}
        </ListContainer>
      ) : (
        renderKanbanView()
      )}
    </>
  );
};

export default ApplicationList; 