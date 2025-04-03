import { Application, Platform, Status, Stats } from '../types';

export const calculateStats = (applications: Application[]): Stats => {
  const totalApplications = applications.length;
  
  // Инициализация статистики
  const byPlatform: Record<string, number> = {
    LinkedIn: 0,
    Glassdoor: 0,
    HeadHunter: 0,
    Other: 0
  };
  
  const byMonth: Record<string, number> = {};
  const byStatus: Record<string, number> = {
    Applied: 0,
    Viewed: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0
  };
  
  const byLocation: Record<string, number> = {};
  const byCompanySize: Record<string, number> = {};
  const byPosition: Record<string, number> = {};
  const byExperience: Record<string, number> = {};
  
  // Для статистики по дням недели (0 - воскресенье, 1 - понедельник, ... 6 - суббота)
  const byDayOfWeek: number[] = [0, 0, 0, 0, 0, 0, 0];
  
  const salaries: number[] = [];
  const responseTimes: number[] = [];
  
  const trendsOverTime = {
    applications: {} as Record<string, number>,
    interviews: {} as Record<string, number>,
    offers: {} as Record<string, number>
  };
  
  // Обработка каждого отклика
  applications.forEach((app) => {
    // По платформам
    if (app.platform in byPlatform) {
      byPlatform[app.platform]++;
    } else {
      byPlatform.Other++;
    }
    
    // По месяцам
    const date = new Date(app.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
    
    // По дням недели (перемещаем воскресенье в конец массива)
    const dayOfWeek = date.getDay();
    const adjustedDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 -> 6, 1 -> 0, 2 -> 1, и т.д.
    byDayOfWeek[adjustedDayIndex]++;
    
    // По статусам
    if (app.status in byStatus) {
      byStatus[app.status]++;
    }
    
    // По локациям
    if (app.location) {
      byLocation[app.location] = (byLocation[app.location] || 0) + 1;
    }
    
    // По размеру компании
    if (app.companySize) {
      byCompanySize[app.companySize] = (byCompanySize[app.companySize] || 0) + 1;
    }
    
    // По позиции
    if (app.position) {
      byPosition[app.position] = (byPosition[app.position] || 0) + 1;
    }
    
    // По опыту
    if (app.experienceRequired) {
      byExperience[app.experienceRequired] = (byExperience[app.experienceRequired] || 0) + 1;
    }
    
    // Зарплаты
    if (app.salary && app.salary > 0) {
      salaries.push(app.salary);
    }
    
    // Время отклика
    if (app.responseTime && app.responseTime > 0) {
      responseTimes.push(app.responseTime);
    }
    
    // Тренды во времени
    if (monthKey) {
      trendsOverTime.applications[monthKey] = (trendsOverTime.applications[monthKey] || 0) + 1;
      
      if (app.status === 'Interview') {
        trendsOverTime.interviews[monthKey] = (trendsOverTime.interviews[monthKey] || 0) + 1;
      }
      
      if (app.status === 'Offer') {
        trendsOverTime.offers[monthKey] = (trendsOverTime.offers[monthKey] || 0) + 1;
      }
    }
  });
  
  // Рассчитываем коэффициенты конверсии
  const interviewCount = byStatus.Interview || 0;
  const offerCount = byStatus.Offer || 0;
  const rejectionCount = byStatus.Rejected || 0;
  
  const interviewRate = totalApplications > 0 ? interviewCount / totalApplications : 0;
  const offerRate = totalApplications > 0 ? offerCount / totalApplications : 0;
  const rejectionRate = totalApplications > 0 ? rejectionCount / totalApplications : 0;
  const responseRate = totalApplications > 0 ? 
    (interviewCount + offerCount + rejectionCount + (byStatus.Viewed || 0)) / totalApplications : 0;
  
  // Конверсия по этапам
  const applicationToInterview = totalApplications > 0 ? interviewCount / totalApplications : 0;
  const interviewToOffer = interviewCount > 0 ? offerCount / interviewCount : 0;
  const applicationToOffer = totalApplications > 0 ? offerCount / totalApplications : 0;
  
  // Статистика по зарплатам
  let minSalary = 0;
  let maxSalary = 0;
  let avgSalary = 0;
  let medianSalary = 0;
  const salaryRanges: Record<string, number> = {};
  
  if (salaries.length > 0) {
    minSalary = Math.min(...salaries);
    maxSalary = Math.max(...salaries);
    avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;
    
    // Медиана
    const sortedSalaries = [...salaries].sort((a, b) => a - b);
    const mid = Math.floor(sortedSalaries.length / 2);
    medianSalary = sortedSalaries.length % 2 !== 0
      ? sortedSalaries[mid]
      : (sortedSalaries[mid - 1] + sortedSalaries[mid]) / 2;
    
    // Диапазоны зарплат
    const step = (maxSalary - minSalary) / 5;
    for (let i = 0; i < 5; i++) {
      const rangeMin = Math.round(minSalary + i * step);
      const rangeMax = Math.round(minSalary + (i + 1) * step);
      const rangeKey = `${rangeMin}-${rangeMax}`;
      salaryRanges[rangeKey] = salaries.filter(s => s >= rangeMin && s < rangeMax).length;
    }
  }
  
  // Среднее время отклика
  const averageResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;
  
  // Вероятность получения оффера на основе статистики
  // Используем простую модель: средний процент офферов + бонус за активность
  const baseOfferRate = 0.05; // Базовый шанс получения оффера
  const activityBonus = Math.min(0.15, totalApplications / 100); // Бонус за количество откликов
  const offerProbability = Math.min(0.95, baseOfferRate + applicationToOffer + activityBonus);
  
  return {
    totalApplications,
    byPlatform,
    byMonth,
    byStatus,
    byDayOfWeek,
    bySalary: {
      min: minSalary,
      max: maxSalary,
      avg: avgSalary,
      median: medianSalary,
      ranges: salaryRanges
    },
    byLocation,
    byCompanySize,
    byPosition,
    byExperience,
    responseRate,
    interviewRate,
    offerRate,
    rejectionRate,
    averageResponseTime,
    offerProbability,
    trendsOverTime,
    conversionRates: {
      applicationToInterview,
      interviewToOffer,
      applicationToOffer
    }
  };
};

// Расчет прогресса к цели (40 заявок в день)
export const calculateDailyGoalProgress = (applications: Application[]): number => {
  const today = new Date().toISOString().substring(0, 10); // формат YYYY-MM-DD
  const todayApps = applications.filter(app => app.date.startsWith(today)).length;
  
  return Math.min(1, todayApps / 40);
};

// Расчет прогресса к месячной цели (около 40 * 22 рабочих дня)
export const calculateMonthlyGoalProgress = (applications: Application[]): number => {
  const currentMonth = new Date().toISOString().substring(0, 7); // формат YYYY-MM
  const monthlyApps = applications.filter(app => app.date.startsWith(currentMonth)).length;
  
  const monthlyGoal = 40 * 22; // примерно 22 рабочих дня в месяц
  return Math.min(1, monthlyApps / monthlyGoal);
}; 