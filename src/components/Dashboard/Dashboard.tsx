import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PlatformCard from './PlatformCard';
import ApplicationList from './ApplicationList';
import { FaListUl, FaThLarge } from 'react-icons/fa';
import { Application, Platform } from '../../types';
import Button from '../shared/Button';
import { useSettings } from '../../contexts/SettingsContext';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const DashboardTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.8rem;
  font-weight: 700;
`;

const DashboardControls = styled.div`
  display: flex;
  gap: 1rem;
`;

const PlatformsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const NoApplicationsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.medium};
  margin: 2rem 0;
`;

const ViewSelector = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 0.25rem;
  width: fit-content;
`;

const ViewOption = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${({ theme, active }) => 
    active ? theme.colors.surface : 'transparent'};
  color: ${({ theme, active }) => 
    active ? theme.colors.text : theme.colors.textSecondary};
  font-weight: ${({ active }) => active ? '600' : '400'};
  border-radius: ${({ theme }) => theme.radius.small};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ theme, active }) => 
    active ? theme.shadows.small : 'none'};
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.colors.surface : theme.colors.background};
  }
`;

interface DashboardProps {
  applications: Application[];
  onUpdate: (application: Application) => void;
  onDelete: (id: string) => void;
  onSettings: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  applications, 
  onUpdate,
  onDelete,
  onSettings
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const { defaultView } = useSettings();
  const [currentView, setCurrentView] = useState<'list' | 'kanban'>(defaultView);
  
  // Вычисление количества заявок по платформам
  const platformCounts = applications.reduce((counts, app) => {
    const platform = app.platform;
    counts[platform] = (counts[platform] || 0) + 1;
    return counts;
  }, {} as Record<Platform, number>);
  
  // Фильтрация заявок по выбранной платформе
  const filteredApplications = selectedPlatform 
    ? applications.filter(app => app.platform === selectedPlatform)
    : applications;
  
  const handlePlatformClick = (platform: Platform) => {
    setSelectedPlatform(prevPlatform => 
      prevPlatform === platform ? null : platform
    );
  };
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>
          {selectedPlatform ? `Отклики на ${selectedPlatform}` : 'Все отклики'}
        </DashboardTitle>
        <DashboardControls>
          <Button 
            variant="icon"
            onClick={onSettings}
            aria-label="Настройки"
          >
            <FaListUl size={20} />
          </Button>
        </DashboardControls>
      </DashboardHeader>
      
      <PlatformsGrid>
        <PlatformCard 
          platform="LinkedIn" 
          count={platformCounts['LinkedIn'] || 0}
          onClick={handlePlatformClick}
        />
        <PlatformCard 
          platform="Glassdoor" 
          count={platformCounts['Glassdoor'] || 0}
          onClick={handlePlatformClick}
        />
        <PlatformCard 
          platform="HeadHunter" 
          count={platformCounts['HeadHunter'] || 0}
          onClick={handlePlatformClick}
        />
      </PlatformsGrid>
      
      {applications.length === 0 ? (
        <NoApplicationsMessage>
          <h3>Нет откликов</h3>
          <p>Нажмите на кнопку "+" в правом верхнем углу, чтобы добавить свой первый отклик.</p>
        </NoApplicationsMessage>
      ) : (
        <>
          <ViewSelector>
            <ViewOption 
              active={currentView === 'list'} 
              onClick={() => setCurrentView('list')}
            >
              Список
            </ViewOption>
            <ViewOption 
              active={currentView === 'kanban'} 
              onClick={() => setCurrentView('kanban')}
            >
              Канбан
            </ViewOption>
          </ViewSelector>
          
          <ApplicationList 
            applications={filteredApplications}
            onUpdate={onUpdate}
            onDelete={onDelete}
            viewMode={currentView}
          />
        </>
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 