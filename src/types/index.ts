export type Platform = 'LinkedIn' | 'Glassdoor' | 'HeadHunter' | 'Indeed' | 'Прямой контакт' | 'Другое';
export type Status = 'Applied' | 'Viewed' | 'Interview' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  platform: Platform;
  date: string;
  position: string;
  company: string;
  status: Status;
  favorite?: boolean;
  location?: string;
  remote?: boolean;
  salary?: number;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  responseDate?: string;
  interviewDate?: string;
  notes?: string;
  folder?: string;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  count?: number;
}

export interface Stats {
  totalApplications: number;
  byPlatform: Record<Platform, number>;
  byMonth: Record<string, number>;
  offerProbability: number;
  byStatus: Record<Status, number>;
  byFolder: Record<string, number>;
} 