export type Priority = 'High' | 'Medium' | 'Low';

declare global {
  interface Window {
    desktopAPI: any;
  }
}

export type ApplicationStatus =
  | 'Discovered'
  | 'Researching'
  | 'Ready to contact'
  | 'Draft prepared'
  | 'Awaiting approval'
  | 'Email sent'
  | 'Follow-up due'
  | 'Replied'
  | 'Interview'
  | 'Offer received'
  | 'Rejected'
  | 'Withdrawn'
  | 'No response'
  | 'Not suitable';

export interface FitReason {
  factor: string;
  score: number;
  max: number;
  reason: string;
}

export interface Company {
  id: string;
  name: string;
  website: string;
  careers_url: string;
  city: string;
  country: string;
  description: string;
  industry: string;
  is_gaming: number;
  technologies: string[];
  departments: string[];
  products: string[];
  priority: Priority;
  fit_score: number;
  fit_reasons: FitReason[];
  is_speculative_candidate: number;
  opt_out: number;
  created_at: string;
  updated_at: string;
  contacts?: Contact[];
  opportunities?: Opportunity[];
  applications?: Application[];
}

export interface Opportunity {
  id: string;
  company_id: string;
  company_name?: string;
  company_website?: string;
  company_is_gaming?: number;
  company_priority?: Priority;
  title: string;
  description: string;
  city: string;
  country: string;
  category: string;
  work_arrangement: 'On-site' | 'Hybrid' | 'Remote';
  is_official_vacancy: number; // 1 = Official Vacancy, 0 = Speculative
  required_technologies: string[];
  internship_start: string;
  internship_end: string;
  duration_months: number;
  salary_info?: string;
  language_requirements: string;
  application_deadline?: string;
  application_method: string;
  source_name: string;
  source_url: string;
  fit_score: number;
  fit_breakdown?: FitReason[];
  is_active: number;
  created_at: string;
}

export interface Contact {
  id: string;
  company_id: string;
  name: string;
  role: string;
  email: string;
  linkedin_url?: string;
  source_type: 'verified_website' | 'public_source' | 'unverified' | 'form_only';
  source_url?: string;
  is_verified: number;
  notes?: string;
}

export interface Application {
  id: string;
  company_id: string;
  company_name?: string;
  company_website?: string;
  company_priority?: Priority;
  opportunity_id?: string;
  contact_id?: string;
  contact_name?: string;
  contact_email?: string;
  contact_role?: string;
  status: ApplicationStatus;
  priority: Priority;
  target_role: string;
  city: string;
  date_contacted?: string;
  next_follow_up_date?: string;
  follow_up_count: number;
  interview_date?: string;
  interview_notes?: string;
  notes?: string;
  cv_document_id?: string;
  source?: string;
  last_activity_at: string;
  created_at: string;
}

export interface EmailDraft {
  id: string;
  application_id?: string;
  company_id: string;
  company_name?: string;
  company_city?: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  body_text: string;
  template_type: string;
  variant: 'concise' | 'detailed';
  cv_document_id?: string;
  is_approved: number;
  status: 'draft' | 'queued' | 'approved' | 'sent' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  university: string;
  degree: string;
  campus_city: string;
  current_year: string;
  internship_start_preferred: string;
  internship_end_preferred: string;
  preferred_duration_months: number;
  preferred_cities: string[];
  preferred_roles: string[];
  bio: string;
  portfolio_url: string;
  github_url: string;
  linkedin_url: string;
  languages_spoken: string[];
  signature: string;
}

export interface Skill {
  id: string;
  category: 'Programming' | 'Frontend' | 'Backend' | 'GameDev' | 'Design' | 'Tools' | 'Multimedia';
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  is_highlighted: number;
}

export interface Document {
  id: string;
  title: string;
  category: 'general' | 'fullstack_web' | 'game_qa' | 'ui_ux';
  file_path: string;
  file_size: number;
  mime_type: string;
  extracted_text?: string;
  is_default: number;
  created_at: string;
}

export interface FollowUp {
  id: string;
  application_id: string;
  company_name: string;
  target_role: string;
  city: string;
  contact_email?: string;
  follow_up_number: number;
  due_date: string;
  status: 'pending' | 'drafted' | 'approved' | 'sent' | 'skipped' | 'cancelled';
  rule_trigger: string;
  opt_out?: number;
}

export interface DashboardMetrics {
  totalCompanies: number;
  worthContacting: number;
  totalOpportunities: number;
  dateMatches: number;
  draftsCount: number;
  sentCount: number;
  repliesCount: number;
  interviewsCount: number;
  rejectionsCount: number;
  awaitingResponse: number;
  upcomingFollowUps: number;
  byCity: { city: string; count: number }[];
  pipeline: { status: string; count: number }[];
}

export interface AuditLog {
  id: string;
  action_type: string;
  entity_type?: string;
  entity_id?: string;
  details?: string;
  created_at: string;
}
