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
    defaultView, 
    notificationsEnabled, 
    autoSaveInterval,
    statisticsVisibility,
    toggleTheme,
    setDefaultView,
    toggleNotifications,
    setAutoSaveInterval,
    toggleStatVisibility,
    resetSettings
  } = useSettings();
  
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'statistics' | 'data'>('appearance');
  
  const handleExport = () => {
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
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const success = importData(content);
        setImportSuccess(success);
        setTimeout(() => setImportSuccess(false), 3000);
        
        if (success) {
          // Перезагрузка страницы для применения импортированных данных
          window.location.reload();
        }
      }
    };
    reader.readAsText(file);
  };
  
  const handleClearData = () => {
    if (showConfirmReset) {
      clearAllData();
      setShowConfirmReset(false);
      // Перезагрузка страницы для очистки данных
      window.location.reload();
    } else {
      setShowConfirmReset(true);
    }
  };

  // Автоматически убираем состояние подтверждения через 5 секунд
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
            <FaArrowLeft /> Назад
          </BackButton>
          Настройки
        </SettingsTitle>
      </SettingsHeader>

      <TabContainer>
        <Tab 
          active={activeTab === 'appearance'} 
          onClick={() => setActiveTab('appearance')}
        >
          <FaPalette /> Внешний вид
        </Tab>
        <Tab 
          active={activeTab === 'notifications'} 
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell /> Уведомления
        </Tab>
        <Tab 
          active={activeTab === 'statistics'} 
          onClick={() => setActiveTab('statistics')}
        >
          <FaChartBar /> Статистика
        </Tab>
        <Tab 
          active={activeTab === 'data'} 
          onClick={() => setActiveTab('data')}
        >
          <FaCog /> Данные
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
                  <FaPalette size={20} /> Основные настройки
                </SectionTitle>
                
                <SettingSection>
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        {theme === 'dark' ? <FaMoon size={18} /> : <FaSun size={18} />} Тёмная тема
                      </SettingLabel>
                      <SettingDescription>
                        Изменить цветовую схему интерфейса
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
                        {defaultView === 'list' ? <FaListUl size={18} /> : <FaThLarge size={18} />} Вид по умолчанию
                      </SettingLabel>
                      <SettingDescription>
                        Выберите предпочтительный способ отображения заявок
                      </SettingDescription>
                    </div>
                    <div>
                      <Button 
                        variant={defaultView === 'list' ? 'primary' : 'secondary'} 
                        onClick={() => setDefaultView('list')}
                        size="small"
                      >
                        <FaListUl /> Список
                      </Button>
                      <ButtonWithMargin 
                        variant={defaultView === 'kanban' ? 'primary' : 'secondary'} 
                        onClick={() => setDefaultView('kanban')}
                        size="small"
                      >
                        <FaThLarge /> Канбан
                      </ButtonWithMargin>
                    </div>
                  </SettingItem>
                </SettingSection>
              </SettingsCard>
              
              <SettingsCard padding="medium" elevation="small">
                <SectionTitle>
                  <FaFingerprint size={20} /> Персонализация
                </SectionTitle>
                
                <SettingSection>
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        <FaGlobe size={18} /> Язык приложения
                      </SettingLabel>
                      <SettingDescription>
                        Выберите предпочтительный язык интерфейса
                      </SettingDescription>
                    </div>
                    <Select defaultValue="ru">
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                    </Select>
                  </SettingItem>
                  
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        <FaPalette size={18} /> Основной цвет
                      </SettingLabel>
                      <SettingDescription>
                        Выберите основной цвет интерфейса
                      </SettingDescription>
                      
                      <ColorOptionsContainer>
                        <ColorOption color="#5856D6" selected={true} />
                        <ColorOption color="#FF9500" selected={false} />
                        <ColorOption color="#4CD964" selected={false} />
                        <ColorOption color="#5AC8FA" selected={false} />
                        <ColorOption color="#FF2D55" selected={false} />
                        <ColorOption color="#007AFF" selected={false} />
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
                  <FaBell size={20} /> Уведомления
                </SectionTitle>
                
                <SettingSection>
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        <FaBell size={18} /> Включить уведомления
                      </SettingLabel>
                      <SettingDescription>
                        Получать уведомления о важных событиях
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
                  <FaExchangeAlt size={20} /> Автосохранение
                </SectionTitle>
                
                <SettingSection>
                  <SettingItem>
                    <div>
                      <SettingLabel>
                        <FaExchangeAlt size={18} /> Интервал автосохранения
                      </SettingLabel>
                      <SettingDescription>
                        Как часто автоматически сохранять изменения (в минутах)
                      </SettingDescription>
                    </div>
                    <Select 
                      value={autoSaveInterval} 
                      onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                    >
                      <option value={1}>1 минута</option>
                      <option value={5}>5 минут</option>
                      <option value={10}>10 минут</option>
                      <option value={15}>15 минут</option>
                      <option value={30}>30 минут</option>
                    </Select>
                  </SettingItem>
                </SettingSection>
              </SettingsCard>
            </SettingsGrid>
          )}
          
          {activeTab === 'statistics' && (
            <SettingsCard padding="medium" elevation="small">
              <SectionTitle>
                <FaChartBar size={20} /> Настройки статистики
              </SectionTitle>
              
              <SettingSection>
                <SettingItem>
                  <div>
                    <SettingLabel>
                      <FaGlobe size={18} /> Показывать платформы
                    </SettingLabel>
                    <SettingDescription>
                      Статистика по используемым платформам поиска работы
                    </SettingDescription>
                  </div>
                  <Switch>
                    <input 
                      type="checkbox" 
                      checked={statisticsVisibility.platforms} 
                      onChange={() => toggleStatVisibility('platforms')}
                    />
                    <span></span>
                  </Switch>
                </SettingItem>
                
                <SettingItem>
                  <div>
                    <SettingLabel>
                      <FaChartBar size={18} /> Показывать временную шкалу
                    </SettingLabel>
                    <SettingDescription>
                      График активности заявок по времени
                    </SettingDescription>
                  </div>
                  <Switch>
                    <input 
                      type="checkbox" 
                      checked={statisticsVisibility.timeline} 
                      onChange={() => toggleStatVisibility('timeline')}
                    />
                    <span></span>
                  </Switch>
                </SettingItem>
                
                <SettingItem>
                  <div>
                    <SettingLabel>
                      <FaChartBar size={18} /> Показывать статусы
                    </SettingLabel>
                    <SettingDescription>
                      Распределение заявок по текущим статусам
                    </SettingDescription>
                  </div>
                  <Switch>
                    <input 
                      type="checkbox" 
                      checked={statisticsVisibility.statuses} 
                      onChange={() => toggleStatVisibility('statuses')}
                    />
                    <span></span>
                  </Switch>
                </SettingItem>
                
                <SettingItem>
                  <div>
                    <SettingLabel>
                      <FaChartBar size={18} /> Показывать зарплаты
                    </SettingLabel>
                    <SettingDescription>
                      Анализ уровня зарплат в заявках
                    </SettingDescription>
                  </div>
                  <Switch>
                    <input 
                      type="checkbox" 
                      checked={statisticsVisibility.salary} 
                      onChange={() => toggleStatVisibility('salary')}
                    />
                    <span></span>
                  </Switch>
                </SettingItem>
              </SettingSection>
            </SettingsCard>
          )}
          
          {activeTab === 'data' && (
            <SettingsCard padding="medium" elevation="small">
              <SectionTitle>
                <FaShieldAlt size={20} /> Управление данными
              </SectionTitle>
              
              <SettingSection>
                <SettingItem>
                  <div>
                    <SettingLabel>
                      <FaSave size={18} /> Экспорт данных
                    </SettingLabel>
                    <SettingDescription>
                      Сохранить текущие данные в JSON-файл
                    </SettingDescription>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={handleExport}
                  >
                    <FaSave /> Экспорт
                  </Button>
                </SettingItem>
                
                <SettingItem>
                  <div>
                    <SettingLabel>
                      <FaUpload size={18} /> Импорт данных
                    </SettingLabel>
                    <SettingDescription>
                      Загрузить данные из ранее сохраненного файла
                    </SettingDescription>
                  </div>
                  <FileInputLabel>
                    <FileInput 
                      type="file" 
                      accept=".json" 
                      onChange={handleImport} 
                      id="import-file"
                    />
                    <Button 
                      as="span" 
                      variant="secondary"
                    >
                      <FaUpload /> Импорт
                    </Button>
                  </FileInputLabel>
                </SettingItem>
                
                <SettingItem>
                  <div>
                    <SettingLabel>
                      <FaTrash size={18} /> Очистить все данные
                    </SettingLabel>
                    <SettingDescription>
                      Безвозвратно удалить все заявки и настройки
                    </SettingDescription>
                  </div>
                  <Button 
                    variant="danger" 
                    onClick={handleClearData}
                  >
                    <FaTrash /> {showConfirmReset ? 'Подтвердить' : 'Очистить'}
                  </Button>
                </SettingItem>
                
                <AnimatePresence>
                  {exportSuccess && (
                    <SuccessMessage
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      Данные успешно экспортированы!
                    </SuccessMessage>
                  )}
                  
                  {importSuccess && (
                    <SuccessMessage
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      Данные успешно импортированы!
                    </SuccessMessage>
                  )}
                  
                  {showConfirmReset && (
                    <DangerMessage
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      Вы уверены? Это действие нельзя отменить. Нажмите кнопку еще раз для подтверждения.
                    </DangerMessage>
                  )}
                </AnimatePresence>
              </SettingSection>
            </SettingsCard>
          )}
        </motion.div>
      </AnimatePresence>
    </SettingsContainer>
  );
};

export default Settings; 