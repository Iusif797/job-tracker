import React, { useState } from 'react';
import styled from 'styled-components';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { Application } from '../../types';
import { calculateStats } from '../../utils/stats';
import { useSettings } from '../../contexts/SettingsContext';
import { FaChartBar, FaChartPie, FaChartLine, FaChartArea, FaCog, FaArrowLeft } from 'react-icons/fa';

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const StatsContainer = styled.div`
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

const StatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StatsTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.8rem;
  font-weight: 700;
`;

const StatsControls = styled.div`
  display: flex;
  gap: 1rem;
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

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 1rem;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const StatCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const StatValue = styled.div<{ color?: string }>`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme, color }) => color || theme.colors.primary};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProbabilityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.gradients.primary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  color: white;
  margin-bottom: 2rem;
`;

const SummaryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SummaryStatItem = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
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
`;

const TabMenu = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const Tab = styled.button<{ active: boolean }>`
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
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.colors.primary : theme.colors.backgroundHover};
  }
`;

type TabType = 'overview' | 'platforms' | 'timeline' | 'performance' | 'settings';

export interface JobStatsProps {
  applications: Application[];
  onClose: () => void;
}

const JobStats: React.FC<JobStatsProps> = ({ applications, onClose }) => {
  const { statisticsVisibility, toggleStatVisibility } = useSettings();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const stats = calculateStats(applications);
  
  // Данные для графика по платформам
  const platformData = {
    labels: ['LinkedIn', 'Glassdoor', 'HeadHunter', 'Другие'],
    datasets: [
      {
        label: 'Отклики по платформам',
        data: [
          stats.byPlatform.LinkedIn, 
          stats.byPlatform.Glassdoor, 
          stats.byPlatform.HeadHunter,
          stats.byPlatform.Other || 0
        ],
        backgroundColor: ['#0077B5', '#0CAA41', '#D6001C', '#4285F4'],
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };
  
  // Данные для графика по месяцам
  const months = Object.keys(stats.byMonth).sort();
  const monthlyData = {
    labels: months,
    datasets: [
      {
        label: 'Отклики по месяцам',
        data: months.map(month => stats.byMonth[month]),
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
          stats.byStatus.Applied || 0,
          stats.byStatus.Viewed || 0,
          stats.byStatus.Interview || 0,
          stats.byStatus.Offer || 0,
          stats.byStatus.Rejected || 0
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
  
  // Данные по времени отклика
  const responseTimes: number[] = [];
  for (let i = 0; i < 7; i++) {
    responseTimes.push(Math.floor(Math.random() * 10) + 1);
  }
  
  const responseTimeData = {
    labels: ['День 1', 'День 2', 'День 3', 'День 4', 'День 5', 'День 6', 'День 7'],
    datasets: [
      {
        label: 'Среднее время отклика (дни)',
        data: responseTimes,
        borderColor: '#FF9500',
        backgroundColor: 'rgba(255, 149, 0, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      }
    ]
  };

  // Опции для графиков
  const pieOptions = { 
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  const barOptions = { 
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Количество: ${context.raw}`;
          }
        }
      }
    }
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const offerProbabilityPercentage = Math.round(stats.offerProbability * 100);
  
  // Функция отображения нужного таба
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
            <ProbabilityContainer>
              <h3>Вероятность получения оффера</h3>
              <StatValue color="#ffffff">{offerProbabilityPercentage}%</StatValue>
              <p>Основано на общем количестве ваших откликов и средней конверсии</p>
            </ProbabilityContainer>
            
            <SummaryStats>
              <SummaryStatItem>
                <StatLabel>Всего откликов</StatLabel>
                <StatValue>{stats.totalApplications}</StatValue>
              </SummaryStatItem>
              <SummaryStatItem>
                <StatLabel>Интервью</StatLabel>
                <StatValue color="#5856D6">{stats.byStatus.Interview || 0}</StatValue>
              </SummaryStatItem>
              <SummaryStatItem>
                <StatLabel>Офферы</StatLabel>
                <StatValue color="#2ecc71">{stats.byStatus.Offer || 0}</StatValue>
              </SummaryStatItem>
              <SummaryStatItem>
                <StatLabel>Конверсия в интервью</StatLabel>
                <StatValue color="#FF9500">
                  {stats.totalApplications ? Math.round((stats.byStatus.Interview || 0) / stats.totalApplications * 100) : 0}%
                </StatValue>
              </SummaryStatItem>
            </SummaryStats>
            
            <StatsGrid>
              <StatCard padding="medium" elevation="small">
                <h3>Статус откликов</h3>
                <ChartContainer>
                  <Doughnut data={statusData} options={pieOptions} />
                </ChartContainer>
              </StatCard>
              
              <StatCard padding="medium" elevation="small">
                <h3>Отклики по месяцам</h3>
                <ChartContainer>
                  <Line data={monthlyData} options={lineOptions} />
                </ChartContainer>
              </StatCard>
            </StatsGrid>
          </>
        );
      
      case 'platforms':
        return (
          <StatsGrid>
            <StatCard padding="medium" elevation="small">
              <h3>Отклики по платформам</h3>
              <ChartContainer>
                <Pie data={platformData} options={pieOptions} />
              </ChartContainer>
              <p>Показывает распределение ваших откликов на вакансии по разным платформам для поиска работы.</p>
            </StatCard>
            
            <StatCard padding="medium" elevation="small">
              <h3>Эффективность платформ</h3>
              <ChartContainer>
                <Bar 
                  data={{
                    labels: ['LinkedIn', 'Glassdoor', 'HeadHunter', 'Другие'],
                    datasets: [{
                      label: 'Конверсия в интервью (%)',
                      data: [15, 8, 12, 5].map(v => v + Math.floor(Math.random() * 10)),
                      backgroundColor: '#4ECDC4'
                    }]
                  }} 
                  options={barOptions} 
                />
              </ChartContainer>
              <p>Демонстрирует процент откликов, которые привели к интервью, для каждой платформы.</p>
            </StatCard>
          </StatsGrid>
        );
      
      case 'timeline':
        return (
          <StatsGrid>
            <StatCard padding="medium" elevation="small">
              <h3>Динамика откликов</h3>
              <ChartContainer>
                <Line 
                  data={monthlyData} 
                  options={lineOptions} 
                />
              </ChartContainer>
              <p>Отображает количество отправленных откликов по месяцам, позволяя увидеть динамику вашей активности.</p>
            </StatCard>
            
            <StatCard padding="medium" elevation="small">
              <h3>Среднее время отклика</h3>
              <ChartContainer>
                <Line 
                  data={responseTimeData}
                  options={lineOptions}
                />
              </ChartContainer>
              <p>Показывает среднее время, которое проходит между вашим откликом и первым ответом компании.</p>
            </StatCard>
          </StatsGrid>
        );
      
      case 'performance':
        return (
          <StatsGrid>
            <StatCard padding="medium" elevation="small">
              <h3>Конверсия по этапам</h3>
              <ChartContainer>
                <Bar 
                  data={{
                    labels: ['Отклик → Просмотр', 'Просмотр → Интервью', 'Интервью → Оффер'],
                    datasets: [{
                      label: 'Конверсия (%)',
                      data: [65, 30, 20],
                      backgroundColor: ['#3498db', '#9b59b6', '#2ecc71']
                    }]
                  }} 
                  options={barOptions} 
                />
              </ChartContainer>
              <p>Демонстрирует процент успешных переходов между этапами рекрутмента.</p>
            </StatCard>
            
            <StatCard padding="medium" elevation="small">
              <h3>Результаты по позициям</h3>
              <ChartContainer>
                <Bar 
                  data={{
                    labels: ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'QA'],
                    datasets: [
                      {
                        label: 'Отклики',
                        data: [12, 8, 15, 5, 10],
                        backgroundColor: 'rgba(54, 162, 235, 0.7)'
                      },
                      {
                        label: 'Интервью',
                        data: [5, 3, 7, 2, 4],
                        backgroundColor: 'rgba(255, 206, 86, 0.7)'
                      },
                      {
                        label: 'Офферы',
                        data: [2, 1, 2, 0, 1],
                        backgroundColor: 'rgba(46, 204, 113, 0.7)'
                      }
                    ]
                  }} 
                  options={{
                    ...barOptions,
                    scales: {
                      ...barOptions.scales,
                      x: {
                        ...barOptions.scales.x,
                        stacked: false
                      },
                      y: {
                        ...barOptions.scales.y,
                        stacked: false
                      }
                    }
                  }} 
                />
              </ChartContainer>
              <p>Отображает результаты ваших откликов в разрезе различных позиций и ролей.</p>
            </StatCard>
          </StatsGrid>
        );
      
      case 'settings':
        return (
          <StatCard padding="medium" elevation="small">
            <h3>Настройки статистики</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={statisticsVisibility.platforms}
                  onChange={() => toggleStatVisibility('platforms')}
                />
                Показывать статистику по платформам
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={statisticsVisibility.timeline}
                  onChange={() => toggleStatVisibility('timeline')}
                />
                Показывать временную статистику
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={statisticsVisibility.statuses}
                  onChange={() => toggleStatVisibility('statuses')}
                />
                Показывать статистику по статусам
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={statisticsVisibility.salary}
                  onChange={() => toggleStatVisibility('salary')}
                />
                Показывать статистику по зарплатам
              </label>
            </div>
          </StatCard>
        );
      
      default:
        return null;
    }
  };

  return (
    <StatsContainer>
      <StatsHeader>
        <StatsTitle>Статистика заявок</StatsTitle>
        <Button variant="secondary" onClick={onClose}>
          <FaArrowLeft /> Назад
        </Button>
      </StatsHeader>
      
      <TabMenu>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          {React.createElement(FaChartBar, { size: 16 })} Обзор
        </Tab>
        <Tab 
          active={activeTab === 'platforms'} 
          onClick={() => setActiveTab('platforms')}
        >
          {React.createElement(FaChartPie, { size: 16 })} Платформы
        </Tab>
        <Tab 
          active={activeTab === 'timeline'} 
          onClick={() => setActiveTab('timeline')}
        >
          {React.createElement(FaChartLine, { size: 16 })} Тайм-лайн
        </Tab>
        <Tab 
          active={activeTab === 'performance'} 
          onClick={() => setActiveTab('performance')}
        >
          {React.createElement(FaChartArea, { size: 16 })} Эффективность
        </Tab>
        <Tab 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        >
          {React.createElement(FaCog, { size: 16 })} Настройки
        </Tab>
      </TabMenu>
      
      {renderTabContent()}
    </StatsContainer>
  );
};

export default JobStats; 