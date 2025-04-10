import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChartBar, FaGlobe, FaCalendarAlt, FaChartPie, FaCog } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { Application } from '../../types';
import { calculateStats } from '../../utils/stats';
import { useSettings } from '../../contexts/SettingsContext';


ChartJS.register(ArcElement, LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const StatsContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background};
  overflow-y: auto;
  z-index: 1000;
  padding: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem;
  }
`;

const StatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 1rem 0;
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const StatsTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface StatsGridProps {
  columns?: number;
}

const StatsGrid = styled.div<StatsGridProps>`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(${props => props.columns || 2}, 1fr);
  }
`;

const ChartContainer = styled(motion.div)`
  height: 300px;
  position: relative;
  transition: all 0.3s ease;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-5px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 250px;
  }
`;

const StatCard = styled(motion(Card))`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const StatCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const StatCardTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatValue = styled.div<{ color?: string }>`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme, color }) => color || theme.colors.primary};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  small {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: normal;
  }
`;

const ProbabilityContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.gradients.primary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  color: white;
  margin-bottom: 2rem;
  
  h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
  }
  
  .probability-value {
    font-size: 3.5rem;
    font-weight: 700;
    margin: 1rem 0;
  }
  
  p {
    opacity: 0.9;
    margin: 0;
  }
`;

const SummaryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SummaryStatItem = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TabMenu = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
  
  &::-webkit-scrollbar {
    height: 5px;
  }
`;

const Tab = styled(motion.button)<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 30px;
  background-color: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.surfaceVariant};
  color: ${({ theme, active }) => 
    active ? 'white' : theme.colors.text};
  font-weight: ${({ active }) => active ? '600' : '400'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: ${({ theme, active }) => 
    active ? theme.shadows.small : 'none'};
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.colors.primary : theme.colors.backgroundHover};
    transform: translateY(-2px);
  }
`;

// Анимации
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

type TabType = 'overview' | 'platforms' | 'timeline' | 'performance' | 'settings';

export interface JobStatsProps {
  applications: Application[];
  onClose: () => void;
}

const JobStats: React.FC<JobStatsProps> = ({ applications, onClose }) => {
  const { statisticsVisibility, toggleStatVisibility } = useSettings();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useSettings().theme;
  
  const stats = calculateStats(applications);
  
  // При изменении вкладки, прокручиваем наверх
  useEffect(() => {
    containerRef.current?.scrollTo(0, 0);
  }, [activeTab]);
  
  // Вычисление вероятности трудоустройства
  const calculateHiringProbability = (): number => {
    const totalApplications = applications.length;
    if (totalApplications === 0) return 0;
    
    const interviewCount = stats.byStatus?.Interview || 0;
    const offerCount = stats.byStatus?.Offer || 0;
    
    // Простая формула: (интервью + офферы) / все заявки
    return Math.min(100, Math.round(((interviewCount + offerCount) / totalApplications) * 100));
  };
  
  // Данные для графика по платформам
  const platformData = {
    labels: ['LinkedIn', 'Glassdoor', 'HeadHunter', 'Другие'],
    datasets: [
      {
        label: 'Отклики по платформам',
        data: [
          stats.byPlatform?.LinkedIn || 0, 
          stats.byPlatform?.Glassdoor || 0, 
          stats.byPlatform?.HeadHunter || 0,
          stats.byPlatform?.Other || 0
        ],
        backgroundColor: ['#0077B5', '#0CAA41', '#D6001C', '#4285F4'],
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };
  
  // Данные для графика по месяцам
  const months = Object.keys(stats.byMonth || {}).sort((a, b) => {
    const aDate = new Date(a);
    const bDate = new Date(b);
    return aDate.getTime() - bDate.getTime();
  });
  
  const monthlyData = {
    labels: months.map(month => {
      const date = new Date(month);
      return date.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Отклики по месяцам',
        data: months.map(month => stats.byMonth?.[month] || 0),
        backgroundColor: 'rgba(88, 86, 214, 0.6)',
        borderColor: '#5856D6',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  // Данные по статусам
  const statusData = {
    labels: ['Отправлено', 'Просмотрено', 'Интервью', 'Оффер', 'Отказ'],
    datasets: [
      {
        label: 'По статусам',
        data: [
          stats.byStatus?.Applied || 0,
          stats.byStatus?.Viewed || 0,
          stats.byStatus?.Interview || 0,
          stats.byStatus?.Offer || 0,
          stats.byStatus?.Rejected || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(46, 204, 113, 0.7)',
          'rgba(231, 76, 60, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Данные по дням недели
  const dayOfWeekData = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    datasets: [{
      label: 'Количество заявок',
      data: stats.byDayOfWeek || [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(88, 86, 214, 0.6)',
      borderColor: '#5856D6',
      borderWidth: 1
    }]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      }
    }
  };
  
  return (
    <StatsContainer
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <StatsHeader>
        <StatsTitle>
          <FaChartBar size={24} />
          Статистика ({applications.length} заявок)
        </StatsTitle>
        <Button
          variant="icon"
          onClick={onClose}
          aria-label="Закрыть статистику"
        >
          <FaTimes size={24} />
        </Button>
      </StatsHeader>
      
      <TabMenu>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
          variants={itemVariants}
        >
          <FaChartPie size={16} /> Обзор
        </Tab>
        <Tab 
          active={activeTab === 'platforms'} 
          onClick={() => setActiveTab('platforms')}
          variants={itemVariants}
        >
          <FaGlobe size={16} /> По платформам
        </Tab>
        <Tab 
          active={activeTab === 'timeline'} 
          onClick={() => setActiveTab('timeline')}
          variants={itemVariants}
        >
          <FaCalendarAlt size={16} /> Временная шкала
        </Tab>
        <Tab 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
          variants={itemVariants}
        >
          <FaCog size={16} /> Настройки
        </Tab>
      </TabMenu>
      
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {applications.length > 0 && (
              <ProbabilityContainer
                variants={itemVariants}
              >
                <h3>Вероятность трудоустройства</h3>
                <div className="probability-value">{calculateHiringProbability()}%</div>
                <p>Основано на количестве интервью и офферов</p>
              </ProbabilityContainer>
            )}
            
            <SummaryStats>
              <SummaryStatItem variants={itemVariants}>
                <StatLabel>
                  <FaGlobe size={16} /> Всего откликов
                </StatLabel>
                <StatValue>{applications.length}</StatValue>
              </SummaryStatItem>
              
              <SummaryStatItem variants={itemVariants}>
                <StatLabel>Интервью</StatLabel>
                <StatValue color="#5AC8FA">{stats.byStatus?.Interview || 0}</StatValue>
              </SummaryStatItem>
              
              <SummaryStatItem variants={itemVariants}>
                <StatLabel>Офферы</StatLabel>
                <StatValue color="#34C759">{stats.byStatus?.Offer || 0}</StatValue>
              </SummaryStatItem>
              
              <SummaryStatItem variants={itemVariants}>
                <StatLabel>Отказы</StatLabel>
                <StatValue color="#FF3B30">{stats.byStatus?.Rejected || 0}</StatValue>
              </SummaryStatItem>
            </SummaryStats>
            
            <StatsGrid>
              {statisticsVisibility.platforms && (
                <StatCard variants={itemVariants} padding="medium" elevation="small">
                  <StatCardHeader>
                    <StatCardTitle>
                      <FaGlobe size={18} /> Платформы
                    </StatCardTitle>
                  </StatCardHeader>
                  <ChartContainer>
                    <Pie data={platformData} options={chartOptions} />
                  </ChartContainer>
                </StatCard>
              )}
              
              {statisticsVisibility.statuses && (
                <StatCard variants={itemVariants} padding="medium" elevation="small">
                  <StatCardHeader>
                    <StatCardTitle>
                      <FaChartPie size={18} /> Статусы
                    </StatCardTitle>
                  </StatCardHeader>
                  <ChartContainer>
                    <Doughnut data={statusData} options={chartOptions} />
                  </ChartContainer>
                </StatCard>
              )}
              
              {statisticsVisibility.timeline && (
                <StatCard variants={itemVariants} padding="medium" elevation="small" style={{ gridColumn: '1 / -1' }}>
                  <StatCardHeader>
                    <StatCardTitle>
                      <FaCalendarAlt size={18} /> Активность по месяцам
                    </StatCardTitle>
                  </StatCardHeader>
                  <ChartContainer>
                    <Line data={monthlyData} options={chartOptions} />
                  </ChartContainer>
                </StatCard>
              )}
            </StatsGrid>
          </motion.div>
        )}
        
        {activeTab === 'platforms' && (
          <motion.div
            key="platforms"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <StatCard variants={itemVariants} padding="medium" elevation="small">
              <StatCardHeader>
                <StatCardTitle>
                  <FaGlobe size={18} /> Распределение по платформам
                </StatCardTitle>
              </StatCardHeader>
              <ChartContainer style={{ height: '400px' }}>
                <Pie data={platformData} options={chartOptions} />
              </ChartContainer>
            </StatCard>
            
            <StatsGrid columns={3} style={{ marginTop: '2rem' }}>
              <SummaryStatItem variants={itemVariants}>
                <StatLabel>
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="16" />
                  LinkedIn
                </StatLabel>
                <StatValue color="#0077B5">{stats.byPlatform?.LinkedIn || 0}</StatValue>
              </SummaryStatItem>
              
              <SummaryStatItem variants={itemVariants}>
                <StatLabel>
                  <img src="https://cdn-icons-png.flaticon.com/512/5968/5968903.png" alt="Glassdoor" width="16" />
                  Glassdoor
                </StatLabel>
                <StatValue color="#0CAA41">{stats.byPlatform?.Glassdoor || 0}</StatValue>
              </SummaryStatItem>
              
              <SummaryStatItem variants={itemVariants}>
                <StatLabel>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/79/HeadHunter_logo.png" alt="HeadHunter" width="16" />
                  HeadHunter
                </StatLabel>
                <StatValue color="#D6001C">{stats.byPlatform?.HeadHunter || 0}</StatValue>
              </SummaryStatItem>
              
              <SummaryStatItem variants={itemVariants}>
                <StatLabel>
                  <FaGlobe size={16} /> Другие
                </StatLabel>
                <StatValue color="#4285F4">{stats.byPlatform?.Other || 0}</StatValue>
              </SummaryStatItem>
            </StatsGrid>
          </motion.div>
        )}
        
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <StatCard variants={itemVariants} padding="medium" elevation="small">
              <StatCardHeader>
                <StatCardTitle>
                  <FaCalendarAlt size={18} /> Активность по месяцам
                </StatCardTitle>
              </StatCardHeader>
              <ChartContainer style={{ height: '400px' }}>
                <Line 
                  data={monthlyData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }} 
                />
              </ChartContainer>
            </StatCard>
            
            <StatsGrid style={{ marginTop: '2rem' }}>
              <StatCard variants={itemVariants} padding="medium" elevation="small">
                <StatCardHeader>
                  <StatCardTitle>
                    <FaCalendarAlt size={18} /> Активность по дням недели
                  </StatCardTitle>
                </StatCardHeader>
                <ChartContainer>
                  <Bar 
                    data={dayOfWeekData}
                    options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }} 
                  />
                </ChartContainer>
              </StatCard>
            </StatsGrid>
          </motion.div>
        )}
        
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <StatCard variants={itemVariants} padding="medium" elevation="small">
              <StatCardHeader>
                <StatCardTitle>
                  <FaCog size={18} /> Настройки статистики
                </StatCardTitle>
              </StatCardHeader>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '1rem', borderBottom: `1px solid ${theme === 'dark' ? '#3A3A3C' : '#E5E5EA'}` }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Показывать платформы</h4>
                    <p style={{ margin: '0.5rem 0 0 0', color: theme === 'dark' ? '#AEAEB2' : '#6C6C70' }}>Статистика по используемым платформам поиска работы</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={statisticsVisibility.platforms} 
                      onChange={() => toggleStatVisibility('platforms')} 
                      id="platforms-toggle"
                      style={{ marginRight: '8px' }}
                    />
                    <label htmlFor="platforms-toggle">
                      {statisticsVisibility.platforms ? 'Включено' : 'Выключено'}
                    </label>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '1rem', borderBottom: `1px solid ${theme === 'dark' ? '#3A3A3C' : '#E5E5EA'}` }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Показывать временную шкалу</h4>
                    <p style={{ margin: '0.5rem 0 0 0', color: theme === 'dark' ? '#AEAEB2' : '#6C6C70' }}>График активности заявок по времени</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={statisticsVisibility.timeline} 
                      onChange={() => toggleStatVisibility('timeline')} 
                      id="timeline-toggle"
                      style={{ marginRight: '8px' }}
                    />
                    <label htmlFor="timeline-toggle">
                      {statisticsVisibility.timeline ? 'Включено' : 'Выключено'}
                    </label>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '1rem', borderBottom: `1px solid ${theme === 'dark' ? '#3A3A3C' : '#E5E5EA'}` }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Показывать статусы</h4>
                    <p style={{ margin: '0.5rem 0 0 0', color: theme === 'dark' ? '#AEAEB2' : '#6C6C70' }}>Распределение заявок по текущим статусам</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={statisticsVisibility.statuses} 
                      onChange={() => toggleStatVisibility('statuses')} 
                      id="statuses-toggle"
                      style={{ marginRight: '8px' }}
                    />
                    <label htmlFor="statuses-toggle">
                      {statisticsVisibility.statuses ? 'Включено' : 'Выключено'}
                    </label>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Показывать зарплаты</h4>
                    <p style={{ margin: '0.5rem 0 0 0', color: theme === 'dark' ? '#AEAEB2' : '#6C6C70' }}>Анализ уровня зарплат в заявках</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={statisticsVisibility.salary} 
                      onChange={() => toggleStatVisibility('salary')} 
                      id="salary-toggle"
                      style={{ marginRight: '8px' }}
                    />
                    <label htmlFor="salary-toggle">
                      {statisticsVisibility.salary ? 'Включено' : 'Выключено'}
                    </label>
                  </div>
                </div>
              </div>
            </StatCard>
          </motion.div>
        )}
      </AnimatePresence>
    </StatsContainer>
  );
};

export default JobStats; 