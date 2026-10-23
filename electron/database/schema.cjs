// Normalized SQLite schema definitions with foreign keys, indexes, and constraints
const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  website TEXT,
  careers_url TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Poland',
  description TEXT,
  industry TEXT,
  is_gaming INTEGER NOT NULL DEFAULT 0,
  technologies TEXT, -- JSON array of strings
  departments TEXT, -- JSON array of strings
  products TEXT, -- JSON array of strings
  priority TEXT NOT NULL DEFAULT 'Medium', -- High, Medium, Low
  fit_score INTEGER DEFAULT 0,
  fit_reasons TEXT, -- JSON array of reason objects
  is_speculative_candidate INTEGER NOT NULL DEFAULT 1,
  opt_out INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Opportunities / Vacancies Table
CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Poland',
  category TEXT NOT NULL,
  work_arrangement TEXT DEFAULT 'Hybrid', -- On-site, Hybrid, Remote
  is_official_vacancy INTEGER NOT NULL DEFAULT 1, -- 1=Official Vacancy, 0=Speculative Opportunity
  required_technologies TEXT, -- JSON array
  internship_start TEXT, -- e.g. '2027-03-01'
  internship_end TEXT, -- e.g. '2027-07-01'
  duration_months INTEGER DEFAULT 4,
  salary_info TEXT,
  language_requirements TEXT DEFAULT 'English',
  eligibility_notes TEXT,
  application_deadline TEXT,
  application_method TEXT DEFAULT 'Email', -- Email, Website, Portal
  source_name TEXT NOT NULL, -- Greenhouse, Lever, Ashby, Official Careers, Portal
  source_url TEXT NOT NULL,
  verified_at TEXT NOT NULL DEFAULT (datetime('now')),
  fit_score INTEGER DEFAULT 0,
  fit_breakdown TEXT, -- JSON object
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  name TEXT,
  role TEXT,
  email TEXT,
  linkedin_url TEXT,
  source_type TEXT NOT NULL DEFAULT 'verified_website', -- verified_website, public_source, unverified, form_only
  source_url TEXT,
  is_verified INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- User Profile Table
CREATE TABLE IF NOT EXISTS user_profile (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  university TEXT NOT NULL,
  degree TEXT NOT NULL,
  campus_city TEXT,
  current_year TEXT,
  internship_start_preferred TEXT NOT NULL,
  internship_end_preferred TEXT NOT NULL,
  preferred_duration_months INTEGER NOT NULL DEFAULT 4,
  preferred_cities TEXT NOT NULL, -- JSON array
  preferred_roles TEXT NOT NULL, -- JSON array
  bio TEXT,
  portfolio_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  languages_spoken TEXT, -- JSON array
  signature TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL, -- Programming, Frontend, Backend, GameDev, Design, Tools
  name TEXT NOT NULL,
  proficiency TEXT DEFAULT 'Advanced', -- Beginner, Intermediate, Advanced
  is_highlighted INTEGER DEFAULT 1
);

-- Documents / CVs Table
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- general, fullstack_web, game_qa, ui_ux
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT DEFAULT 'application/pdf',
  extracted_text TEXT,
  is_default INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Email Accounts Table
CREATE TABLE IF NOT EXISTS email_accounts (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL, -- gmail, outlook, smtp
  email_address TEXT NOT NULL UNIQUE,
  account_name TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  daily_send_limit INTEGER NOT NULL DEFAULT 20,
  sent_today_count INTEGER NOT NULL DEFAULT 0,
  last_sent_date TEXT,
  is_connected INTEGER NOT NULL DEFAULT 0,
  oauth_tokens_encrypted TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Applications CRM Table
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  opportunity_id TEXT,
  contact_id TEXT,
  status TEXT NOT NULL DEFAULT 'Discovered', 
  -- Statuses: Discovered, Researching, Ready to contact, Draft prepared, Awaiting approval, 
  -- Email sent, Follow-up due, Replied, Interview, Offer received, Rejected, Withdrawn, No response, Not suitable
  priority TEXT NOT NULL DEFAULT 'Medium',
  target_role TEXT NOT NULL,
  city TEXT NOT NULL,
  date_contacted TEXT,
  next_follow_up_date TEXT,
  follow_up_count INTEGER NOT NULL DEFAULT 0,
  interview_date TEXT,
  interview_notes TEXT,
  notes TEXT,
  cv_document_id TEXT,
  source TEXT,
  last_activity_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE SET NULL,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
  FOREIGN KEY (cv_document_id) REFERENCES documents(id) ON DELETE SET NULL
);

-- Email Drafts Table
CREATE TABLE IF NOT EXISTS email_drafts (
  id TEXT PRIMARY KEY,
  application_id TEXT,
  company_id TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  template_type TEXT NOT NULL,
  variant TEXT NOT NULL DEFAULT 'concise', -- concise, detailed
  cv_document_id TEXT,
  is_approved INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, queued, approved, sent, cancelled
  scheduled_at TEXT,
  sent_at TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (cv_document_id) REFERENCES documents(id) ON DELETE SET NULL
);

-- Email Messages (Sent & Received History)
CREATE TABLE IF NOT EXISTS email_messages (
  id TEXT PRIMARY KEY,
  application_id TEXT,
  company_id TEXT NOT NULL,
  message_id_header TEXT,
  direction TEXT NOT NULL, -- outgoing, incoming
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_snippet TEXT,
  full_body TEXT,
  sent_at TEXT NOT NULL DEFAULT (datetime('now')),
  delivery_status TEXT DEFAULT 'delivered', -- delivered, bounced, failed
  classification TEXT, -- interview_request, rejection, info_request, acknowledgment, general
  extracted_dates TEXT, -- JSON array
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Follow-Ups Table
CREATE TABLE IF NOT EXISTS follow_ups (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL,
  follow_up_number INTEGER NOT NULL,
  due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, drafted, approved, sent, skipped, cancelled
  rule_trigger TEXT,
  draft_id TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (draft_id) REFERENCES email_drafts(id) ON DELETE SET NULL
);

-- Search Runs Table
CREATE TABLE IF NOT EXISTS search_runs (
  id TEXT PRIMARY KEY,
  provider_name TEXT NOT NULL,
  query_params TEXT NOT NULL, -- JSON
  opportunities_found INTEGER NOT NULL DEFAULT 0,
  new_companies_found INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL, -- running, completed, failed
  error_message TEXT,
  executed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Search Sources Configuration
CREATE TABLE IF NOT EXISTS search_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider_type TEXT NOT NULL, -- greenhouse, lever, ashby, polish_job_board, careers_direct, custom_api
  base_url TEXT,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  api_key_required INTEGER NOT NULL DEFAULT 0,
  is_configured INTEGER NOT NULL DEFAULT 1,
  last_sync TEXT
);

-- Application Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  is_encrypted INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  action_type TEXT NOT NULL, -- search, draft_create, draft_edit, approval, send, status_change, export, error
  entity_type TEXT,
  entity_id TEXT,
  details TEXT, -- JSON or text
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for lightning fast lookups & deduplication
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);
CREATE INDEX IF NOT EXISTS idx_companies_fit ON companies(fit_score DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_company ON opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_city ON opportunities(city);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_fit ON opportunities(fit_score DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_company ON applications(company_id);
CREATE INDEX IF NOT EXISTS idx_email_drafts_status ON email_drafts(status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due ON follow_ups(due_date, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
`;

module.exports = { SCHEMA_SQL };
