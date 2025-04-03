export type Platform = 'LinkedIn' | 'Glassdoor' | 'HeadHunter' | 'Other';

export type Status = 'Applied' | 'Viewed' | 'Interview' | 'Offer' | 'Rejected';

export type CompanySize = 'Small' | 'Medium' | 'Large' | 'Enterprise';

export type Experience = 'Junior' | 'Middle' | 'Senior' | 'Lead';

export type Position = 
  | 'Frontend' 
  | 'Backend' 
  | 'Fullstack' 
  | 'DevOps' 
  | 'QA' 
  | 'UX/UI' 
  | 'Data Science' 
  | 'Other';

export interface Application {
  id: string;
  company: string;
  position: Position;
  salary?: number;
  date: string;
  platform: Platform;
  status: Status;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
  location?: string;
  remote?: boolean;
  companySize?: CompanySize;
  experienceRequired?: Experience;
  skills?: string[];
  benefits?: string[];
  interviewDate?: string;
  offerAmount?: number;
  rejectionReason?: string;
  responseTime?: number; // в днях
  favorite?: boolean;
}

export interface Stats {
  totalApplications: number;
  byPlatform: Record<Platform, number>;
  byMonth: Record<string, number>;
  byStatus: Record<Status, number>;
  byDayOfWeek: number[]; // [пн, вт, ср, чт, пт, сб, вс]
  bySalary: {
    min: number;
    max: number;
    avg: number;
    median: number;
    ranges: Record<string, number>;
  };
  byLocation: Record<string, number>;
  byCompanySize: Record<string, number>;
  byPosition: Record<string, number>;
  byExperience: Record<string, number>;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  rejectionRate: number;
  averageResponseTime: number;
  offerProbability: number;
  trendsOverTime: {
    applications: Record<string, number>;
    interviews: Record<string, number>;
    offers: Record<string, number>;
  };
  conversionRates: {
    applicationToInterview: number;
    interviewToOffer: number;
    applicationToOffer: number;
  };
} 