import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

// Browser fallback mock if accessed outside of Electron desktop shell
if (typeof window !== 'undefined' && !(window as any).desktopAPI) {
  console.log('[Dev] Running in browser mode: initializing mock desktopAPI adapter');
  
  const mockStorage: Record<string, any> = {
    settings: {
      daily_send_limit: '20',
      first_follow_up_days: '7',
      second_follow_up_days: '7',
      max_follow_ups: '2',
      ai_provider: 'builtin',
    },
    profile: {
      id: 'student-primary',
      full_name: 'Fábio Júnior Fernandes Silva',
      email: 'fabioz262006@gmail.com',
      phone: '+351 930 534 067',
      university: 'IPCA - Instituto Politécnico do Cávado e do Ave',
      degree: 'Desenvolvimento Web Multimédia',
      campus_city: 'Vila Verde / Barcelos, Portugal',
      current_year: '3rd Year Undergraduate',
      internship_start_preferred: '2027-02-01',
      internship_end_preferred: '2027-06-30',
      preferred_duration_months: 4,
      preferred_cities: ['Kraków', 'Warsaw', 'Gdańsk', 'Wrocław'],
      preferred_roles: ['Software Development', 'Web & Frontend', 'UI/UX Design', 'Game QA & Testing'],
      bio: 'Web Multimedia Development student at IPCA, Portugal. Seeking 4-month university internship in Poland for Spring 2027 (Feb-Jun).',
      portfolio_url: 'https://cinelog-phi.vercel.app',
      github_url: 'https://github.com/FabioSilva32',
      linkedin_url: 'https://linkedin.com/in/candidate-ipca',
      languages_spoken: ['English (Fluent - C1)', 'Portuguese (Native)'],
      signature: 'Kind regards,\nFábio Júnior Fernandes Silva\nWeb Multimedia Development | IPCA\nEmail: fabioz262006@gmail.com | Phone: +351 930 534 067\nLive Projects:\n• CineLog (PWA): https://cinelog-phi.vercel.app\n• Poland Internship Hunter (Desktop App): https://github.com/FabioSilva32/poland-internship-hunter\n• Retiro Interior: https://retirointerior.netlify.app\n• StocksVault: https://stocksvault.netlify.app\n• ACRIALBI: https://acrialbi.netlify.app\nGitHub: https://github.com/FabioSilva32'
    },
    companies: [
      {
        id: 'comp-bloober',
        name: 'Bloober Team',
        website: 'https://www.blooberteam.com',
        careers_url: 'https://www.blooberteam.com/careers',
        city: 'Kraków',
        country: 'Poland',
        description: 'Premier psychological horror game developer in Kraków (Silent Hill 2 Remake, The Medium, Layers of Fear).',
        industry: 'Video Games',
        is_gaming: 1,
        technologies: ['Unreal Engine 5', 'C++', 'C#', 'Motion Capture', 'Sound Design', 'QA Testing'],
        departments: ['Programming', 'Quality Assurance', 'Art & Multimedia', 'Level Design'],
        products: ['Silent Hill 2 Remake', 'The Medium', 'Layers of Fear'],
        priority: 'High',
        fit_score: 98,
        fit_reasons: [
          { factor: 'Degree Alignment', score: 25, max: 25, text: 'Multimedia & 3D tech directly map to Unreal Engine 5' },
          { factor: 'Location Match', score: 20, max: 20, text: 'Headquarters right in Kraków (Top #1 preferred city)' },
          { factor: 'Gaming Preference', score: 25, max: 25, text: 'Major game dev studio with strong intern appetite' },
          { factor: 'Dates & Duration', score: 14, max: 15, text: 'Spring semester fits regular European university placements' },
          { factor: 'Language Compatibility', score: 14, max: 15, text: 'English standard for documentation and code' }
        ],
        is_speculative_candidate: 1,
        opt_out: 0,
        contacts: [
          { id: 'ct-bloober', name: 'HR & Internship Office', role: 'HR Manager', email: 'biuro@blooberteam.com', source_type: 'verified_website', is_verified: 1 }
        ],
        opportunities: [
          {
            id: 'opp-bloober-qa',
            company_id: 'comp-bloober',
            title: 'Game QA & Functionality Testing Intern',
            description: 'Testing Unreal Engine 5 builds, executing bug reproduction steps, writing detailed Jira bug reports.',
            city: 'Kraków',
            country: 'Poland',
            category: 'Game QA & Game Testing',
            work_arrangement: 'On-site',
            is_official_vacancy: 1,
            required_technologies: ['Jira', 'Unreal Engine 5 Editor', 'TestRail', 'Bug Reporting'],
            internship_start: '2027-02-15',
            internship_end: '2027-06-30',
            duration_months: 4,
            salary_info: 'Paid Internship (~4,800 - 6,000 PLN/mo)',
            language_requirements: 'English',
            source_name: 'Official Careers Page',
            source_url: 'https://www.blooberteam.com/careers',
            fit_score: 97,
            is_active: 1
          }
        ]
      },
      {
        id: 'comp-brainly',
        name: 'Brainly',
        website: 'https://brainly.com',
        careers_url: 'https://careers.brainly.com',
        city: 'Kraków',
        country: 'Poland',
        description: 'Global learning platform used by over 300 million students worldwide. Global HQ in Kraków.',
        industry: 'EdTech & Consumer Web',
        is_gaming: 0,
        technologies: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Figma', 'Python'],
        departments: ['Frontend Engineering', 'UI/UX Product Design', 'Fullstack Engineering'],
        products: ['Brainly Web App', 'Brainly Tutor', 'Brainly Math Solver'],
        priority: 'High',
        fit_score: 97,
        fit_reasons: [
          { factor: 'Degree Alignment', score: 25, max: 25, text: 'Direct synergy for Web Development & UI/UX Multimedia' },
          { factor: 'Location Match', score: 20, max: 20, text: 'Global HQ in Kraków (Zabłocie tech cluster)' },
          { factor: 'Technology Fit', score: 25, max: 25, text: 'React + TypeScript + Design systems match student skillset' },
          { factor: 'Dates & Duration', score: 14, max: 15, text: 'Accommodates university credit placements' },
          { factor: 'Language Compatibility', score: 13, max: 15, text: '100% English-first multinational workplace' }
        ],
        is_speculative_candidate: 1,
        opt_out: 0,
        contacts: [
          { id: 'ct-brainly', name: 'People Team Kraków', role: 'Talent Partner', email: 'contact@brainly.com', source_type: 'verified_website', is_verified: 1 }
        ],
        opportunities: [
          {
            id: 'opp-brainly-fe',
            company_id: 'comp-brainly',
            title: 'Frontend / Web Engineering University Intern',
            description: 'Join Brainly engineering team in Kraków working with React, TypeScript, and modern component architecture.',
            city: 'Kraków',
            country: 'Poland',
            category: 'Web & Frontend Development',
            work_arrangement: 'Hybrid',
            is_official_vacancy: 1,
            required_technologies: ['React', 'TypeScript', 'Next.js', 'CSS Modules / Tailwind'],
            internship_start: '2027-03-01',
            internship_end: '2027-06-30',
            duration_months: 4,
            salary_info: 'Paid Internship (~5,500 - 7,000 PLN/mo)',
            language_requirements: 'English (Fluent)',
            source_name: 'Ashby / Official Careers',
            source_url: 'https://careers.brainly.com',
            fit_score: 98,
            is_active: 1
          }
        ]
      },
      {
        id: 'comp-cdpr',
        name: 'CD Projekt RED',
        website: 'https://www.cdprojektred.com',
        careers_url: 'https://www.cdprojektred.com/en/careers',
        city: 'Warsaw',
        country: 'Poland',
        description: 'World-renowned video game studio behind The Witcher trilogy, Cyberpunk 2077, and upcoming Unreal Engine 5 titles.',
        industry: 'Video Games & Entertainment',
        is_gaming: 1,
        technologies: ['C++', 'Unreal Engine 5', 'Python', 'C#', 'QA Tools', 'Web Tech'],
        departments: ['Engineering', 'Game QA & Testing', 'Web & Tools', 'Design'],
        products: ['Cyberpunk 2077', 'The Witcher 3', 'Project Polaris'],
        priority: 'High',
        fit_score: 96,
        fit_reasons: [
          { factor: 'Degree Alignment', score: 25, max: 25, text: 'Web Multimedia covers programming and game tech' },
          { factor: 'Location Match', score: 20, max: 20, text: 'Hubs in Warsaw and Kraków' },
          { factor: 'Gaming Preference', score: 25, max: 25, text: 'Tier-1 studio with dedicated QA & junior engineering' },
          { factor: 'Dates & Duration', score: 15, max: 15, text: 'Fits 4-month university internship timeline' },
          { factor: 'Language Compatibility', score: 11, max: 15, text: 'English working language' }
        ],
        is_speculative_candidate: 1,
        opt_out: 0,
        contacts: [
          { id: 'ct-cdpr', name: 'CD PROJEKT RED Recruitment', role: 'Job Offers & Talent Acquisition', email: 'jobs@cdprojektred.com', source_type: 'verified_website', is_verified: 1 }
        ]
      }
    ],
    opportunities: [
      {
        id: 'opp-bloober-qa',
        company_id: 'comp-bloober',
        company_name: 'Bloober Team',
        title: 'Game QA & Functionality Testing Intern',
        description: 'Testing Unreal Engine 5 builds, executing bug reproduction steps, writing detailed Jira bug reports.',
        city: 'Kraków',
        country: 'Poland',
        category: 'Game QA & Game Testing',
        work_arrangement: 'On-site',
        is_official_vacancy: 1,
        required_technologies: ['Jira', 'Unreal Engine 5 Editor', 'TestRail', 'Bug Reporting'],
        internship_start: '2027-02-15',
        internship_end: '2027-06-30',
        duration_months: 4,
        salary_info: 'Paid (~4,800 - 6,000 PLN/mo)',
        language_requirements: 'English',
        source_name: 'Official Careers Page',
        source_url: 'https://www.blooberteam.com/careers',
        fit_score: 97,
        is_active: 1
      },
      {
        id: 'opp-brainly-fe',
        company_id: 'comp-brainly',
        company_name: 'Brainly',
        title: 'Frontend / Web Engineering University Intern',
        description: 'Join Brainly engineering team in Kraków working with React, TypeScript, and modern component architecture.',
        city: 'Kraków',
        country: 'Poland',
        category: 'Web & Frontend Development',
        work_arrangement: 'Hybrid',
        is_official_vacancy: 1,
        required_technologies: ['React', 'TypeScript', 'Next.js', 'CSS Modules / Tailwind'],
        internship_start: '2027-03-01',
        internship_end: '2027-06-30',
        duration_months: 4,
        salary_info: 'Paid (~5,500 - 7,000 PLN/mo)',
        language_requirements: 'English (Fluent)',
        source_name: 'Ashby / Official Careers',
        source_url: 'https://careers.brainly.com',
        fit_score: 98,
        is_active: 1
      },
      {
        id: 'opp-cdpr-spec',
        company_id: 'comp-cdpr',
        company_name: 'CD Projekt RED',
        title: 'Speculative University Placement: Junior Game Dev / Tech Art / QA',
        description: 'Speculative application for university curricular internship for Spring 2027.',
        city: 'Warsaw',
        country: 'Poland',
        category: 'Game Development',
        work_arrangement: 'Hybrid',
        is_official_vacancy: 0,
        required_technologies: ['C++', 'C# / Unity', 'Unreal Engine', 'Git', 'Multimedia'],
        internship_start: '2027-03-01',
        internship_end: '2027-06-30',
        duration_months: 4,
        salary_info: 'Subject to agreement',
        language_requirements: 'English',
        source_name: 'Official Direct Outreach',
        source_url: 'https://www.cdprojektred.com/en/careers',
        fit_score: 94,
        is_active: 1
      }
    ],
    applications: [
      {
        id: 'app-bloober-1',
        company_id: 'comp-bloober',
        company_name: 'Bloober Team',
        target_role: 'Game QA & Functionality Testing Intern',
        city: 'Kraków',
        status: 'Ready to contact',
        priority: 'High',
        notes: 'Bloober Team QA position aligns with Feb-Jun 2027 dates. CV ready.',
        last_activity_at: '2026-10-23',
      },
      {
        id: 'app-brainly-1',
        company_id: 'comp-brainly',
        company_name: 'Brainly',
        target_role: 'Frontend / Web Engineering University Intern',
        city: 'Kraków',
        status: 'Draft prepared',
        priority: 'High',
        notes: 'Identified Brainly as top priority in Kraków. Draft prepared and waiting for review.',
        last_activity_at: '2026-10-23',
      }
    ],
    drafts: [
      {
        id: 'draft-1',
        company_id: 'comp-brainly',
        company_name: 'Brainly',
        company_city: 'Kraków',
        recipient_email: 'recruitment@brainly.com',
        recipient_name: 'Brainly Recruitment Desk',
        subject: 'University Internship Inquiry (Spring 2027) – Web Multimedia Development – Candidato Universitário IPCA',
        body_text: 'Dear Brainly Recruitment Desk,\n\nI am an undergraduate student studying Desenvolvimento Web Multimédia at IPCA in Portugal, seeking a 4-month university curricular internship in Kraków from February through June 2027.\n\nMy academic training is centered on modern web technologies (TypeScript, React, Node.js) and UI/UX design in Figma.\n\nThank you for your time.',
        template_type: 'speculative_inquiry',
        variant: 'concise',
        status: 'draft',
      }
    ],
    followUps: [
      {
        id: 'fu-1',
        application_id: 'app-brainly-1',
        company_name: 'Brainly',
        target_role: 'Frontend / Web Engineering University Intern',
        city: 'Kraków',
        follow_up_number: 1,
        due_date: '2026-11-02',
        status: 'pending',
        rule_trigger: '7_business_days_initial'
      }
    ]
  };

  (window as any).desktopAPI = {
    getDashboardMetrics: async () => ({
      totalCompanies: mockStorage.companies.length,
      worthContacting: mockStorage.companies.length,
      totalOpportunities: mockStorage.opportunities.length,
      dateMatches: 3,
      draftsCount: mockStorage.drafts.length,
      sentCount: 2,
      repliesCount: 1,
      interviewsCount: 1,
      rejectionsCount: 0,
      awaitingResponse: 1,
      upcomingFollowUps: mockStorage.followUps.length,
      byCity: [
        { city: 'Kraków', count: 2 },
        { city: 'Warsaw', count: 1 },
      ],
      pipeline: [
        { status: 'Ready to contact', count: 1 },
        { status: 'Draft prepared', count: 1 },
      ]
    }),
    getCompanies: async (filters: any) => mockStorage.companies,
    getCompanyDetails: async (id: string) => mockStorage.companies.find((c: any) => c.id === id) || mockStorage.companies[0],
    updateCompanyPriority: async (id: string, priority: string) => {
      const c = mockStorage.companies.find((co: any) => co.id === id);
      if (c) c.priority = priority;
      return { success: true };
    },
    getOpportunities: async (filters: any) => mockStorage.opportunities,
    getApplications: async (filters: any) => mockStorage.applications,
    updateApplicationStatus: async (id: string, status: string) => {
      const a = mockStorage.applications.find((ap: any) => ap.id === id);
      if (a) a.status = status;
      return { success: true };
    },
    createApplication: async (data: any) => {
      const newApp = { ...data, id: 'app-' + Date.now(), last_activity_at: new Date().toISOString() };
      mockStorage.applications.push(newApp);
      return { success: true, id: newApp.id };
    },
    getUserProfile: async () => mockStorage.profile,
    updateUserProfile: async (p: any) => {
      mockStorage.profile = p;
      return { success: true };
    },
    getSkills: async () => [
      { id: 'sk-1', category: 'Programming', name: 'TypeScript', proficiency: 'Advanced', is_highlighted: 1 },
      { id: 'sk-2', category: 'Frontend', name: 'React', proficiency: 'Advanced', is_highlighted: 1 },
      { id: 'sk-3', category: 'Design', name: 'Figma', proficiency: 'Advanced', is_highlighted: 1 },
      { id: 'sk-4', category: 'GameDev', name: 'Unity 3D & C#', proficiency: 'Intermediate', is_highlighted: 1 },
      { id: 'sk-5', category: 'Backend', name: 'Node.js & SQLite', proficiency: 'Intermediate', is_highlighted: 1 },
    ],
    addSkill: async (s: any) => ({ success: true, id: 'sk-' + Date.now() }),
    deleteSkill: async (id: string) => ({ success: true }),
    getDrafts: async (status: string) => mockStorage.drafts,
    saveDraft: async (draft: any) => {
      const id = draft.id || 'draft-' + Date.now();
      mockStorage.drafts.push({ ...draft, id });
      return { success: true, id };
    },
    generateEmail: async (params: any) => ({
      subject: `University Internship Inquiry (Spring 2027) – Web Multimedia Development – ${mockStorage.profile.full_name}`,
      body: `Dear ${params.company?.recipientName || 'Hiring Team'},\n\nI am an undergraduate student studying Desenvolvimento Web Multimédia at IPCA in Portugal.\n\nI am seeking a 4-month curricular university internship in Poland from February through June 2027.\n\nI look forward to discussing any potential placement.\n\n${mockStorage.profile.signature}`,
      provider: 'builtin-template'
    }),
    sendEmail: async (draftId: string) => ({ success: true, message: 'Email marked as sent. Next follow-up scheduled.' }),
    batchSend: async (draftIds: string[]) => draftIds.map(id => ({ draftId: id, success: true, message: 'Dispatched.' })),
    exportEml: async (draftId: string) => ({ success: true, filePath: 'draft_export.eml' }),
    setGlobalPause: async (paused: boolean) => ({ isPaused: paused }),
    getGlobalPause: async () => ({ isPaused: false }),
    runSearch: async (params: any) => ({ success: true, newOpportunities: 2, newCompanies: 0 }),
    getLastSearchRun: async () => ({ lastRun: null, autoSyncEnabled: true, intervalHours: 12 }),
    onAutoUpdateCompleted: (cb: any) => () => {},
    getFollowUps: async () => mockStorage.followUps,
    updateFollowUpStatus: async (id: string, status: string) => ({ success: true }),
    getSettings: async () => mockStorage.settings,
    updateSetting: async (k: string, v: string) => { mockStorage.settings[k] = v; return { success: true }; },
    getAuditLogs: async () => [
      { id: 'a-1', action_type: 'system_init', details: 'Database initialized', entity_id: 'db', created_at: '2026-10-23 14:00' },
      { id: 'a-2', action_type: 'search', details: 'Poland Job Board sync', entity_id: 'search', created_at: '2026-10-23 14:05' },
    ],
    getDocuments: async () => [
      { id: 'doc-1', title: 'CV_WebFrontend_2027.pdf', category: 'fullstack_web', file_path: 'C:/Users/itzfa/Documents/CV_Web.pdf', file_size: 142000, mime_type: 'application/pdf', is_default: 1, created_at: '2026-10-23' }
    ],
    uploadCv: async (d: any) => ({ success: true, id: 'doc-' + Date.now(), filePath: 'C:/path/CV.pdf' }),
    exportCsv: async (table: string) => ({ success: true, filePath: `${table}_export.csv` }),
    openExternal: (url: string) => window.open(url, '_blank'),
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
