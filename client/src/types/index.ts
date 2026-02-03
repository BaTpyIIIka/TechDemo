export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  first_name?: string;
  last_name?: string;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position?: string;
  company_id?: number;
  company_name?: string;
  created_at: string;
  updated_at: string;
}

export type OpportunityStage = 'screening' | 'deep_dive' | 'due_diligence' | 'signing' | 'closed';
export type OpportunityStatus = 'open' | 'won' | 'lost';

export interface Opportunity {
  id: number;
  name: string;
  company_id?: number;
  company_name?: string;
  stage: OpportunityStage;
  amount?: number;
  expected_close_date?: string;
  lead_source?: string;
  status?: OpportunityStatus;
  created_by?: number;
  created_by_email?: string;
  created_at: string;
  updated_at: string;
  contacts?: Contact[];
  tags?: Tag[];
  comments?: Comment[];
  reminders?: Reminder[];
}

export interface Comment {
  id: number;
  opportunity_id: number;
  user_id?: number;
  user_email?: string;
  first_name?: string;
  last_name?: string;
  content: string;
  created_at: string;
}

export interface Reminder {
  id: number;
  opportunity_id: number;
  user_id: number;
  reminder_date: string;
  message?: string;
  sent: boolean;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface DashboardOverview {
  total_opportunities: number;
  open_opportunities: number;
  won_opportunities: number;
  lost_opportunities: number;
  total_value_won: number;
}

export interface FunnelData {
  stage: string;
  count: number;
  total_amount: number;
}

export interface ConversionData {
  from: string;
  to: string;
  conversion_rate: string;
  from_count: number;
  to_count: number;
}
