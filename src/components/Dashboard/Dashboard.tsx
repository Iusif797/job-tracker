import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PlatformCard from './PlatformCard';
import ApplicationList from './ApplicationList';
import { FaListUl, FaThLarge, FaFolder, FaChartBar, FaPlus } from 'react-icons/fa';
import { Application, Platform, Status } from '../../types';
import Button from '../shared/Button';
import { useSettings } from '../../contexts/SettingsContext';
import QuickAddMenu from './QuickAddMenu';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

const DashboardContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
`;

const DashboardTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.8rem;
  font-weight: 700;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const DashboardControls = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: space-between;
  }
`;

const PlatformsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const NoApplicationsMessage = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.radius.medium};
  margin: 2rem 0;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ViewSelector = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 0.25rem;
  width: fit-content;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const ViewOption = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${({ theme, active }) => 
    active ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
  color: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ active }) => active ? '600' : '400'};
  border-radius: ${({ theme }) => theme.radius.small};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ theme, active }) => 
    active ? theme.shadows.small : 'none'};
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

// Локальное определение интерфейса Folder
interface Folder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  count?: number;
}

// Предопределенные папки
const DEFAULT_FOLDERS: Folder[] = [
  { id: 'responses', name: 'Отклики', color: '#6C5CE7', icon: 'responses' },
  { id: 'favorites', name: 'Избранное', color: '#F1C40F', icon: 'star' },
  { id: 'archived', name: 'Архив', color: '#95A5A6', icon: 'archive' },
  { id: 'all', name: 'Все заявки', color: '#3498DB', icon: 'folder' }
];

interface DashboardProps {
  applications: Application[];
  onUpdate: (application: Application) => void;
  onDelete: (id: string) => void;
  onSettings: () => void;
  onAddApplication: (application: Application) => void;
  onEditApplication: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  applications, 
  onUpdate,
  onDelete,
  onSettings,
  onAddApplication,
  onEditApplication
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const { defaultView } = useSettings();
  const [currentView, setCurrentView] = useState<'list' | 'kanban'>(defaultView);
  const { t } = useTranslation();
  const [folders, setFolders] = useState<Folder[]>(DEFAULT_FOLDERS);
  
  // Вычисление количества заявок по платформам
  const platformCounts = applications.reduce((counts, app) => {
    const platform = app.platform;
    counts[platform] = (counts[platform] || 0) + 1;
    return counts;
  }, {} as Record<Platform, number>);
  
  // Обновляем счетчики для папок
  useEffect(() => {
    const updatedFolders = folders.map(folder => {
      const count = applications.filter(app => {
        if (folder.id === 'favorites') return !!app.favorite;
        return app.folder === folder.id;
      }).length;
      
      return { ...folder, count };
    });
    
    setFolders(updatedFolders);
  }, [applications]);
  
  // Фильтрация заявок по выбранной платформе
  const filteredApplications = selectedPlatform 
    ? applications.filter(app => app.platform === selectedPlatform)
    : applications;
  
  const handlePlatformClick = (platform: Platform) => {
    setSelectedPlatform(prevPlatform => 
      prevPlatform === platform ? null : platform
    );
  };

  const handleQuickAdd = (platform: Platform) => {
    const newApplication: Application = {
      id: uuidv4(),
      company: '',
      position: 'Frontend',
      date: new Date().toISOString().substring(0, 10),
      platform,
      status: 'Applied' as Status,
      notes: '',
      folder: 'responses',
      favorite: false
    };
    
    onAddApplication(newApplication);
  };
  
  // Поддерживаемые платформы
  const platforms = useMemo(() => [
    'LinkedIn', 
    'Glassdoor', 
    'HeadHunter', 
    'Indeed', 
    'Прямой контакт'
  ] as Platform[], []);
  
  return (
    <DashboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <DashboardHeader>
        <DashboardTitle>{t('dashboard.title')}</DashboardTitle>
        <DashboardControls>
          <Button 
            onClick={onSettings}
            variant="secondary"
          >
            <FaChartBar />
            {t('dashboard.statistics')}
          </Button>
        </DashboardControls>
      </DashboardHeader>

      <PlatformsGrid>
        {Object.entries(platformCounts).map(([platform, count]) => (
          <PlatformCard
            key={platform}
            platform={platform as Platform}
            count={count}
            onClick={handlePlatformClick}
            active={selectedPlatform === platform}
            onQuickAdd={handleQuickAdd}
          />
        ))}
      </PlatformsGrid>

      <ViewSelector>
        <ViewOption
          active={currentView === 'list'}
          onClick={() => setCurrentView('list')}
        >
          <FaListUl /> {t('dashboard.listView')}
        </ViewOption>
        <ViewOption
          active={currentView === 'kanban'}
          onClick={() => setCurrentView('kanban')}
        >
          <FaThLarge /> {t('dashboard.kanbanView')}
        </ViewOption>
      </ViewSelector>

      {applications.length === 0 ? (
        <NoApplicationsMessage
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('dashboard.noApplications')}
        </NoApplicationsMessage>
      ) : (
        <ApplicationList
          applications={filteredApplications}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEdit={onEditApplication}
          viewMode={currentView}
          folders={folders}
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 