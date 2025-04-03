export type Platform = 'LinkedIn' | 'Glassdoor' | 'HeadHunter';

export interface Application {
  id: string;
  platform: Platform;
  date: string;
  position: string;
  company: string;
  status: 'applied' | 'response' | 'interview' | 'offer' | 'rejected';
  notes?: string;
}

export interface Stats {
  totalApplications: number;
  byPlatform: Record<Platform, number>;
  byMonth: Record<string, number>;
  offerProbability: number;
} 