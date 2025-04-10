import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSettings } from '../../contexts/SettingsContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { exportData, importData, clearAllData } from '../../utils/storage';
import { 
  FaSave, FaUpload, FaCog, FaTrash, FaChartBar, FaPalette, 
  FaBell, FaArrowLeft, FaMoon, FaSun, FaListUl, 
  FaThLarge, FaGlobe, FaExchangeAlt, FaFingerprint, FaShieldAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  animation: ${fadeIn} 0.5s ease-in-out;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem;
  }
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.background};
  padding: 1rem 0;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const SettingsTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${slideIn} 0.3s ease-in-out;
  border-radius: 50px;
  padding: 0.5rem 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;

const SettingsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SettingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-weight: 600;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.surfaceVariant};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
    transform: translateX(4px);
  }
`;

const SettingLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const SettingDescription = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.25rem;
  margin-left: 1.75rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 56px;
  height: 28px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.backgroundHover};
    transition: 0.4s;
    border-radius: 28px;
    
    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
  }
  
  input:checked + span {
    background: ${({ theme }) => theme.colors.gradients.primary};
  }
  
  input:checked + span:before {
    transform: translateX(28px);
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.backgroundHover};
  padding: 4px;
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${({ active, theme }) => active ? theme.colors.surface : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textSecondary};
  border-radius: 8px;
  cursor: pointer;
  font-weight: ${({ active }) => active ? '600' : '400'};
  transition: all 0.3s ease;
  box-shadow: ${({ active }) => active ? '0 4px 8px rgba(0, 0, 0, 0.08)' : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.surface : theme.colors.backgroundHover};
  }
`;

const ColorOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-top: 0.5rem;
`;

const ColorOption = styled.div<{ color: string; selected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? props.color : 'transparent'};
  box-shadow: ${props => props.selected ? '0 0 0 2px white, 0 0 0 4px ' + props.color : 'none'};
  
  &:hover {
    transform: scale(1.15);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236C6C70' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 20px;
  padding-right: 2.5rem;
  
  &:hover, &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}20`};
    outline: none;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  width: 100%;
`;

const SuccessMessage = styled(motion.div)`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => `${theme.colors.success}20`};
  color: ${({ theme }) => theme.colors.success};
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DangerMessage = styled(motion.div)`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => `${theme.colors.danger}20`};
  color: ${({ theme }) => theme.colors.danger};
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ButtonWithMargin = styled(Button)`
  margin-left: 0.5rem;
`;

const Settings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { 
    theme,
    language,
    defaultView, 
    notificationsEnabled, 
    autoSaveInterval,
    statisticsVisibility,
    primaryColor,
    toggleTheme,
    changeLanguage,
    setDefaultView,
    toggleNotifications,
    setAutoSaveInterval,
    toggleStatVisibility,
    resetSettings,
    setPrimaryColor
  } = useSettings();
  
  const { t } = useTranslation();
  
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'statistics' | 'data'>('appearance');
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const colors = {
    purple: '#5856D6',
    orange: '#FF9500',
    green: '#4CD964',
    blue: '#5AC8FA',
    red: '#FF2D55',
    indigo: '#007AFF'
  };

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-applications-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export error:', error);
      // Показать сообщение об ошибке
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (content) {
          const success = importData(content);
          setImportSuccess(success);
          setTimeout(() => setImportSuccess(false), 3000);
          
          if (success) {
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Import error:', error);
        // Показать сообщение об ошибке
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (showConfirmReset) {
      try {
        clearAllData();
        resetSettings();
        setShowConfirmReset(false);
        window.location.reload();
      } catch (error) {
        console.error('Clear data error:', error);
        // Показать сообщение об ошибке
      }
    } else {
      setShowConfirmReset(true);
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showConfirmReset) {
      timer = setTimeout(() => {
        setShowConfirmReset(false);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showConfirmReset]);

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>
          <BackButton variant="secondary" onClick={onBack}>
            <FaArrowLeft /> {t('stats.back')}
          </BackButton>
          {t('common.settings')}
        </SettingsTitle>
      </SettingsHeader>

      <TabContainer>
        <Tab 
          active={activeTab === 'appearance'} 
          onClick={() => setActiveTab('appearance')}
        >
          <FaPalette /> {t('settings.tabs.appearance')}
        </Tab>
        <Tab 
          active={activeTab === 'notifications'} 
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell /> {t('settings.tabs.notifications')}
        </Tab>
        <Tab 
          active={activeTab === 'statistics'} 
          onClick={() => setActiveTab('statistics')}
        >
          <FaChartBar /> {t('settings.tabs.statistics')}
        </Tab>
        <Tab 
          active={activeTab === 'data'} 
          onClick={() => setActiveTab('data')}
        >
          <FaCog /> {t('settings.tabs.data')}
        </Tab>
      </TabContainer>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'appearance' && (
            <SettingsGrid>
              <SettingsCard padding="medium" elevation="small">
                <SectionTitle>
                  <FaPalette size={20} /> {t('settings.appearance.title')}
                </SectionTitle>
                
                <SettingSection>
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        {theme === 'dark' ? <FaMoon size={18} /> : <FaSun size={18} />} 
                        {t('settings.appearance.theme')}
                      </SettingLabel>
                      <SettingDescription>
                        {t('settings.appearance.themeDescription')}
                      </SettingDescription>
                    </div>
                    <Switch>
                      <input 
                        type="checkbox" 
                        checked={theme === 'dark'} 
                        onChange={toggleTheme}
                      />
                      <span></span>
                    </Switch>
                  </SettingItem>
                  
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        <FaGlobe size={18} /> {t('settings.appearance.language')}
                      </SettingLabel>
                      <SettingDescription>
                        {t('settings.appearance.languageDescription')}
                      </SettingDescription>
                    </div>
                    <Select 
                      value={language} 
                      onChange={(e) => changeLanguage(e.target.value as 'ru' | 'en')}
                    >
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </Select>
                  </SettingItem>
                  
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        {defaultView === 'list' ? <FaListUl size={18} /> : <FaThLarge size={18} />} 
                        {t('settings.appearance.defaultView')}
                      </SettingLabel>
                      <SettingDescription>
                        {t('settings.appearance.defaultViewDescription')}
                      </SettingDescription>
                    </div>
                    <div>
                      <Button 
                        variant={defaultView === 'list' ? 'primary' : 'secondary'} 
                        onClick={() => setDefaultView('list')}
                        size="small"
                      >
                        <FaListUl /> {t('common.list')}
                      </Button>
                      <ButtonWithMargin 
                        variant={defaultView === 'kanban' ? 'primary' : 'secondary'} 
                        onClick={() => setDefaultView('kanban')}
                        size="small"
                      >
                        <FaThLarge /> {t('common.kanban')}
                      </ButtonWithMargin>
                    </div>
                  </SettingItem>
                </SettingSection>
              </SettingsCard>
              
              <SettingsCard padding="medium" elevation="small">
                <SectionTitle>
                  <FaFingerprint size={20} /> {t('settings.appearance.personalization')}
                </SectionTitle>
                
                <SettingSection>
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        <FaPalette size={18} /> {t('settings.appearance.primaryColor')}
                      </SettingLabel>
                      <SettingDescription>
                        {t('settings.appearance.primaryColorDescription')}
                      </SettingDescription>
                      
                      <ColorOptionsContainer>
                        {Object.entries(colors).map(([name, color]) => (
                          <ColorOption 
                            key={color}
                            color={color} 
                            selected={primaryColor === color}
                            onClick={() => setPrimaryColor(color)}
                          />
                        ))}
                      </ColorOptionsContainer>
                    </div>
                  </SettingItem>
                </SettingSection>
              </SettingsCard>
            </SettingsGrid>
          )}
          
          {activeTab === 'notifications' && (
            <SettingsGrid>
              <SettingsCard padding="medium" elevation="small">
                <SectionTitle>
                  <FaBell size={20} /> {t('settings.notifications.title')}
                </SectionTitle>
                
                <SettingSection>
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        <FaBell size={18} /> {t('settings.notifications.enable')}
                      </SettingLabel>
                      <SettingDescription>
                        {t('settings.notifications.enableDescription')}
                      </SettingDescription>
                    </div>
                    <Switch>
                      <input 
                        type="checkbox" 
                        checked={notificationsEnabled} 
                        onChange={toggleNotifications}
                      />
                      <span></span>
                    </Switch>
                  </SettingItem>
                </SettingSection>
              </SettingsCard>
              
              <SettingsCard padding="medium" elevation="small">
                <SectionTitle>
                  <FaExchangeAlt size={20} /> {t('settings.notifications.autoSave')}
                </SectionTitle>
                
                <SettingSection>
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        <FaExchangeAlt size={18} /> {t('settings.notifications.autoSaveDescription')}
                      </SettingLabel>
                      <SettingDescription>
                        {t('settings.notifications.autoSaveDescription')}
                      </SettingDescription>
                    </div>
                    <Select 
                      value={autoSaveInterval} 
                      onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                    >
                      <option value={1}>1 {t('common.minute')}</option>
                      <option value={5}>5 {t('common.minutes')}</option>
                      <option value={10}>10 {t('common.minutes')}</option>
                      <option value={15}>15 {t('common.minutes')}</option>
                      <option value={30}>30 {t('common.minutes')}</option>
                    </Select>
                  </SettingItem>
                </SettingSection>
              </SettingsCard>
            </SettingsGrid>
          )}
          
          {activeTab === 'statistics' && (
            <SettingsGrid>
              <SettingsCard padding="medium" elevation="small">
                <SectionTitle>
                  <FaChartBar size={20} /> {t('settings.statistics.title')}
                </SectionTitle>
                
                <SettingSection>
                  {Object.entries(statisticsVisibility).map(([key, value]) => (
                    <SettingItem key={key}>
                      <div>
                        <SettingLabel>
                          <FaChartBar size={18} /> {t(`settings.statistics.${key}`)}
                        </SettingLabel>
                        <SettingDescription>
                          {t(`settings.statistics.${key}Description`)}
                        </SettingDescription>
                      </div>
                      <Switch>
                        <input 
                          type="checkbox" 
                          checked={value} 
                          onChange={() => toggleStatVisibility(key as keyof typeof statisticsVisibility)}
                        />
                        <span></span>
                      </Switch>
                    </SettingItem>
                  ))}
                </SettingSection>
              </SettingsCard>
            </SettingsGrid>
          )}
          
          {activeTab === 'data' && (
            <SettingsGrid>
              <SettingsCard padding="medium" elevation="small">
                <SectionTitle>
                  <FaShieldAlt size={20} /> {t('settings.data.title')}
                </SectionTitle>
                
                <SettingSection>
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        <FaSave size={18} /> {t('settings.data.export')}
                      </SettingLabel>
                      <SettingDescription>
                        {t('settings.data.exportDescription')}
                      </SettingDescription>
                    </div>
                    <Button 
                      variant="primary" 
                      onClick={handleExport}
                    >
                      <FaSave /> {t('common.export')}
                    </Button>
                  </SettingItem>
                  
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        <FaUpload size={18} /> {t('settings.data.import')}
                      </SettingLabel>
                      <SettingDescription>
                        {t('settings.data.importDescription')}
                      </SettingDescription>
                    </div>
                    <FileInputLabel>
                      <FileInput 
                        type="file" 
                        accept=".json" 
                        onChange={handleImport} 
                      />
                      <Button 
                        as="span" 
                        variant="secondary"
                      >
                        <FaUpload /> {t('common.import')}
                      </Button>
                    </FileInputLabel>
                  </SettingItem>
                  
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        <FaTrash size={18} /> {t('settings.data.reset')}
                      </SettingLabel>
                      <SettingDescription>
                        {t('settings.data.resetDescription')}
                      </SettingDescription>
                    </div>
                    <Button 
                      variant="danger"
                      onClick={handleClearData}
                    >
                      <FaTrash /> {showConfirmReset ? t('common.confirm') : t('common.reset')}
                    </Button>
                  </SettingItem>
                </SettingSection>

                <AnimatePresence>
                  {exportSuccess && (
                    <SuccessMessage
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {t('settings.data.exportSuccess')}
                    </SuccessMessage>
                  )}
                  {importSuccess && (
                    <SuccessMessage
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {t('settings.data.importSuccess')}
                    </SuccessMessage>
                  )}
                </AnimatePresence>
              </SettingsCard>
            </SettingsGrid>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {(exportSuccess || importSuccess || showConfirmReset) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
          >
            {exportSuccess && (
              <SuccessMessage>
                {t('settings.data.exportSuccess')}
              </SuccessMessage>
            )}
            {importSuccess && (
              <SuccessMessage>
                {t('settings.data.importSuccess')}
              </SuccessMessage>
            )}
            {showConfirmReset && (
              <DangerMessage>
                {t('settings.data.resetConfirmation')}
              </DangerMessage>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </SettingsContainer>
  );
};

export default Settings; 