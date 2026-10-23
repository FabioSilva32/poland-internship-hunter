const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');
const { SCHEMA_SQL } = require('./schema.cjs');

let dbInstance = null;

class SQLiteWrapper {
  constructor(sqlDb, filePath) {
    this.sqlDb = sqlDb;
    this.filePath = filePath;
  }

  save() {
    if (this.filePath) {
      try {
        const data = this.sqlDb.export();
        fs.writeFileSync(this.filePath, Buffer.from(data));
      } catch (err) {
        console.error('[DB] Error saving to disk:', err);
      }
    }
  }

  exec(sql) {
    this.sqlDb.exec(sql);
    this.save();
  }

  prepare(sql) {
    const self = this;
    return {
      run(...params) {
        const flat = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        self.sqlDb.run(sql, flat);
        self.save();
        return { changes: 1 };
      },
      get(...params) {
        const flat = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        const stmt = self.sqlDb.prepare(sql);
        if (flat.length > 0) stmt.bind(flat);
        let res = undefined;
        if (stmt.step()) {
          res = stmt.getAsObject();
        }
        stmt.free();
        return res;
      },
      all(...params) {
        const flat = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        const stmt = self.sqlDb.prepare(sql);
        if (flat.length > 0) stmt.bind(flat);
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows;
      }
    };
  }
}

function getDbPath() {
  let dir;
  try {
    const { app } = require('electron');
    if (app && app.getPath) {
      dir = path.join(app.getPath('userData'), 'database');
    } else {
      dir = path.join(process.cwd(), 'data');
    }
  } catch {
    dir = path.join(process.cwd(), 'data');
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'internship_hunter.sqlite');
}

async function initializeDatabase() {
  if (dbInstance) return dbInstance;

  const dbPath = getDbPath();
  console.log('[DB] Initializing SQLite via sql.js at:', dbPath);

  const SQL = await initSqlJs();
  let sqlDb;

  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath);
    sqlDb = new SQL.Database(filebuffer);
    console.log('[DB] Loaded existing SQLite database from disk.');
  } else {
    sqlDb = new SQL.Database();
    console.log('[DB] Created new SQLite database.');
  }

  dbInstance = new SQLiteWrapper(sqlDb, dbPath);

  // Execute schema definitions
  dbInstance.exec(SCHEMA_SQL);

  // Seed default data if needed
  seedInitialData(dbInstance);

  return dbInstance;
}

function seedInitialData(db) {
  // Check if profile exists
  const existingProfile = db.prepare('SELECT id FROM user_profile LIMIT 1').get();
  if (!existingProfile) {
    console.log('[DB] Seeding default student profile (IPCA Web Multimedia Development)...');
    db.prepare(`
      INSERT INTO user_profile (
        id, full_name, email, phone, university, degree, campus_city, current_year,
        internship_start_preferred, internship_end_preferred, preferred_duration_months,
        preferred_cities, preferred_roles, bio, portfolio_url, github_url, linkedin_url,
        languages_spoken, signature
      ) VALUES (
        'student-primary',
        'Fábio Júnior Fernandes Silva',
        'fabioz262006@gmail.com',
        '+351 930 534 067',
        'IPCA - Instituto Politécnico do Cávado e do Ave',
        'Desenvolvimento Web Multimédia',
        'Vila Verde / Barcelos, Portugal',
        '3rd Year Undergraduate',
        '2027-02-01',
        '2027-06-30',
        4,
        ?,
        ?,
        'Undergraduate student in Web Multimedia Development at IPCA, Portugal. Passionate about software engineering, interactive frontend development, UI/UX design systems, and multimedia/game technologies. Seeking a 4-month university internship in Poland for Spring/Summer 2027 (Feb-Jun).',
        'https://cinelog-phi.vercel.app/?tab=explore',
        'https://github.com/FabioSilva32',
        'https://linkedin.com/in/candidate-ipca',
        ?,
        'Kind regards,\nFábio Júnior Fernandes Silva\nWeb Multimedia Development Student | IPCA\nEmail: fabioz262006@gmail.com | Phone: +351 930 534 067\nProject: https://cinelog-phi.vercel.app/?tab=explore\nGitHub: https://github.com/FabioSilva32'
      )
    `).run([
      JSON.stringify(['Kraków', 'Warsaw', 'Gdańsk', 'Wrocław', 'Poznań']),
      JSON.stringify([
        'Software Development & Programming',
        'Web & Frontend Development',
        'UI/UX Design & Web Design',
        'Multimedia & Game QA / Testing'
      ]),
      JSON.stringify(['English (Fluent - C1)', 'Portuguese (Native)', 'Polish (Beginner - Learning)'])
    ]);

    // Seed default skills
    const skills = [
      { id: 'sk-1', cat: 'Programming', name: 'TypeScript', prof: 'Advanced' },
      { id: 'sk-2', cat: 'Programming', name: 'JavaScript (ESNext)', prof: 'Advanced' },
      { id: 'sk-3', cat: 'Frontend', name: 'React & React Hooks', prof: 'Advanced' },
      { id: 'sk-4', cat: 'Frontend', name: 'HTML5 & CSS3 / Tailwind', prof: 'Advanced' },
      { id: 'sk-5', cat: 'Frontend', name: 'Next.js & Vite', prof: 'Intermediate' },
      { id: 'sk-6', cat: 'Backend', name: 'Node.js & Express / REST APIs', prof: 'Intermediate' },
      { id: 'sk-7', cat: 'Backend', name: 'SQLite & PostgreSQL', prof: 'Intermediate' },
      { id: 'sk-8', cat: 'Design', name: 'Figma & UI Prototyping', prof: 'Advanced' },
      { id: 'sk-9', cat: 'Design', name: 'UI/UX Design Systems', prof: 'Advanced' },
      { id: 'sk-10', cat: 'GameDev', name: 'Unity 3D / 2D & C#', prof: 'Intermediate' },
      { id: 'sk-11', cat: 'GameDev', name: 'Game QA & Manual Testing', prof: 'Intermediate' },
      { id: 'sk-12', cat: 'Tools', name: 'Git & GitHub Version Control', prof: 'Advanced' },
      { id: 'sk-13', cat: 'Multimedia', name: 'Adobe Creative Suite & Blender', prof: 'Intermediate' },
    ];

    const insertSkill = db.prepare('INSERT INTO skills (id, category, name, proficiency, is_highlighted) VALUES (?, ?, ?, ?, 1)');
    for (const sk of skills) {
      insertSkill.run([sk.id, sk.cat, sk.name, sk.prof]);
    }
  }

  // Check if companies exist
  const existingCompanies = db.prepare('SELECT count(*) as count FROM companies').get();
  if (!existingCompanies || existingCompanies.count === 0) {
    console.log('[DB] Seeding verified Polish tech & gaming hubs...');
    const companiesSeed = [
      {
        id: 'comp-cdpr',
        name: 'CD Projekt RED',
        website: 'https://www.cdprojektred.com',
        careers_url: 'https://www.cdprojektred.com/en/careers',
        city: 'Warsaw',
        country: 'Poland',
        description: 'World-renowned video game development studio behind The Witcher trilogy, Cyberpunk 2077, and upcoming Unreal Engine 5 titles. Has major development studios in Warsaw and Kraków.',
        industry: 'Video Games & Entertainment',
        is_gaming: 1,
        technologies: JSON.stringify(['C++', 'Unreal Engine 5', 'Python', 'C#', 'QA Tools', 'Web Tech', 'DirectX']),
        departments: JSON.stringify(['Engineering', 'Game QA & Testing', 'Web & Tools', 'Design', 'Art']),
        products: JSON.stringify(['Cyberpunk 2077', 'The Witcher 3', 'Project Polaris', 'Project Orion']),
        priority: 'High',
        fit_score: 96,
        fit_reasons: JSON.stringify([
          { factor: 'Degree Alignment', score: 25, max: 25, text: 'Web Multimedia covers programming, interactive media, and game tech' },
          { factor: 'Location Match', score: 20, max: 20, text: 'Hubs in Warsaw and Kraków match primary preferred cities' },
          { factor: 'Gaming Preference', score: 25, max: 25, text: 'Tier-1 game studio with dedicated QA & junior engineering programs' },
          { factor: 'Dates & Duration', score: 15, max: 15, text: 'Spring/Summer 2027 fits 4-month university internship timeline' },
          { factor: 'Language Compatibility', score: 11, max: 15, text: 'International working language is English' }
        ]),
        is_speculative: 1
      },
      {
        id: 'comp-11bit',
        name: '11 bit studios',
        website: 'https://11bitstudios.com',
        careers_url: 'https://11bitstudios.com/jobs/',
        city: 'Warsaw',
        country: 'Poland',
        description: 'Creators of acclaimed emotional and thought-provoking games including Frostpunk, Frostpunk 2, This War of Mine, and publishers of The Alters and Indika.',
        industry: 'Video Games',
        is_gaming: 1,
        technologies: JSON.stringify(['C++', 'Unreal Engine', 'Unity', 'QA Test Automation', 'UI/UX Design']),
        departments: JSON.stringify(['Game Development', 'QA & Testing', 'Design', 'Marketing & Web']),
        products: JSON.stringify(['Frostpunk 2', 'This War of Mine', 'The Alters']),
        priority: 'High',
        fit_score: 94,
        fit_reasons: JSON.stringify([
          { factor: 'Degree Alignment', score: 24, max: 25, text: 'Strong overlap with game UI/UX, QA testing, and multimedia' },
          { factor: 'Location Match', score: 20, max: 20, text: 'Located in Warsaw, Poland' },
          { factor: 'Gaming Preference', score: 25, max: 25, text: 'Direct fit for game testing and development' },
          { factor: 'Dates & Duration', score: 15, max: 15, text: 'Accommodates university curricular internships' },
          { factor: 'Language Compatibility', score: 10, max: 15, text: 'English widely used across production teams' }
        ]),
        is_speculative: 1
      },
      {
        id: 'comp-bloober',
        name: 'Bloober Team',
        website: 'https://www.blooberteam.com',
        careers_url: 'https://www.blooberteam.com/careers',
        city: 'Kraków',
        country: 'Poland',
        description: 'Premier psychological horror game developer based in Kraków. Developed the acclaimed Silent Hill 2 Remake, The Medium, Layers of Fear, and Blair Witch.',
        industry: 'Video Games',
        is_gaming: 1,
        technologies: JSON.stringify(['Unreal Engine 5', 'C++', 'C#', 'Motion Capture', 'Sound Design', 'QA Testing']),
        departments: JSON.stringify(['Programming', 'Quality Assurance', 'Art & Multimedia', 'Level Design']),
        products: JSON.stringify(['Silent Hill 2 Remake', 'The Medium', 'Layers of Fear']),
        priority: 'High',
        fit_score: 98,
        fit_reasons: JSON.stringify([
          { factor: 'Degree Alignment', score: 25, max: 25, text: 'Multimedia & 3D tech directly map to their specialized engine pipelines' },
          { factor: 'Location Match', score: 20, max: 20, text: 'Headquarters right in Kraków (Top #1 preferred city)' },
          { factor: 'Gaming Preference', score: 25, max: 25, text: 'Major game dev studio with strong intern appetite' },
          { factor: 'Dates & Duration', score: 14, max: 15, text: 'Spring semester fits regular European university placements' },
          { factor: 'Language Compatibility', score: 14, max: 15, text: 'English standard for documentation and code' }
        ]),
        is_speculative: 1
      },
      {
        id: 'comp-allegro',
        name: 'Allegro',
        website: 'https://allegro.tech',
        careers_url: 'https://allegro.pl/praca',
        city: 'Warsaw',
        country: 'Poland',
        description: 'Largest e-commerce platform and tech ecosystem in Poland with thousands of engineers. Outstanding internship programs (Allegro Summer e-Xperience & year-round internships) across Warsaw, Kraków, and Gdańsk.',
        industry: 'E-Commerce & High-Scale Web Tech',
        is_gaming: 0,
        technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Kotlin', 'Java', 'UI/UX Design Systems', 'Figma', 'GraphQL']),
        departments: JSON.stringify(['Frontend Engineering', 'Backend Engineering', 'Product Design (UX/UI)', 'Mobile Apps']),
        products: JSON.stringify(['Allegro Marketplace', 'Allegro Pay', 'Allegro Delivery']),
        priority: 'High',
        fit_score: 95,
        fit_reasons: JSON.stringify([
          { factor: 'Degree Alignment', score: 25, max: 25, text: 'Direct hit for Web Development & UI/UX Design from IPCA' },
          { factor: 'Location Match', score: 20, max: 20, text: 'Offices in Kraków, Warsaw, and Gdańsk' },
          { factor: 'Technology Fit', score: 25, max: 25, text: 'Core stack is React, TypeScript, and modern design systems' },
          { factor: 'Dates & Duration', score: 13, max: 15, text: 'Structured mentorship and paid internship pathways' },
          { factor: 'Language Compatibility', score: 12, max: 15, text: 'English tech culture and documentation' }
        ]),
        is_speculative: 0
      },
      {
        id: 'comp-brainly',
        name: 'Brainly',
        website: 'https://brainly.com',
        careers_url: 'https://careers.brainly.com',
        city: 'Kraków',
        country: 'Poland',
        description: 'Global knowledge-sharing and AI-powered education platform used by over 300 million students worldwide. Global headquarters located right in Kraków with a massive engineering and product design team.',
        industry: 'EdTech & Consumer Web',
        is_gaming: 0,
        technologies: JSON.stringify(['React', 'TypeScript', 'Next.js', 'GraphQL', 'Figma', 'Python', 'AI Tools']),
        departments: JSON.stringify(['Frontend Engineering', 'UI/UX Product Design', 'Fullstack Engineering', 'Product QA']),
        products: JSON.stringify(['Brainly Web App', 'Brainly Tutor', 'Brainly Math Solver']),
        priority: 'High',
        fit_score: 97,
        fit_reasons: JSON.stringify([
          { factor: 'Degree Alignment', score: 25, max: 25, text: 'Perfect synergy for Web Development & UI/UX Multimedia' },
          { factor: 'Location Match', score: 20, max: 20, text: 'Global HQ in Kraków (Zabłocie tech cluster)' },
          { factor: 'Technology Fit', score: 25, max: 25, text: 'React + TypeScript + Design systems match student skillset' },
          { factor: 'Dates & Duration', score: 14, max: 15, text: 'Accommodates university credit placements' },
          { factor: 'Language Compatibility', score: 13, max: 15, text: '100% English-first multinational workplace' }
        ]),
        is_speculative: 1
      },
      {
        id: 'comp-netguru',
        name: 'Netguru',
        website: 'https://www.netguru.com',
        careers_url: 'https://www.netguru.com/career',
        city: 'Gdańsk',
        country: 'Poland',
        description: 'One of the most decorated digital product consultancies in Europe, creating world-class web applications, mobile platforms, and award-winning UI/UX design systems. Has strong presence in Gdańsk, Warsaw, and Poznań.',
        industry: 'Digital Product Agency & Software Consultancy',
        is_gaming: 0,
        technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Figma', 'UI/UX Design', 'Next.js', 'React Native']),
        departments: JSON.stringify(['Frontend Team', 'Product Design (UX/UI)', 'Full-Stack', 'Quality Assurance']),
        products: JSON.stringify(['FinTech apps', 'E-commerce solutions', 'Healthcare platforms']),
        priority: 'High',
        fit_score: 93,
        fit_reasons: JSON.stringify([
          { factor: 'Degree Alignment', score: 25, max: 25, text: 'Web Multimedia covers the exact duo: Frontend + UI/UX Design' },
          { factor: 'Location Match', score: 19, max: 20, text: 'Active teams in Gdańsk and Warsaw' },
          { factor: 'Technology Fit', score: 25, max: 25, text: 'Figma, React, TypeScript are their primary daily tools' },
          { factor: 'Dates & Duration', score: 12, max: 15, text: 'Consultancy runs trainee academies regularly' },
          { factor: 'Language Compatibility', score: 12, max: 15, text: 'All client delivery and code done in English' }
        ]),
        is_speculative: 1
      },
      {
        id: 'comp-flyingwildhog',
        name: 'Flying Wild Hog',
        website: 'https://flyingwildhog.com',
        careers_url: 'https://flyingwildhog.com/careers/',
        city: 'Kraków',
        country: 'Poland',
        description: 'Game development studio creators of Shadow Warrior, Evil West, and Trek to Yomi. Operates studios in Kraków, Warsaw, and Rzeszów with strong Unreal Engine expertise.',
        industry: 'Video Games',
        is_gaming: 1,
        technologies: JSON.stringify(['Unreal Engine', 'C++', 'C#', 'QA Testing Tools', 'Level Design', '3D Animation']),
        departments: JSON.stringify(['QA & Functionality Testing', 'Gameplay Programming', 'Tech Art', 'UI Art']),
        products: JSON.stringify(['Shadow Warrior 3', 'Evil West', 'Trek to Yomi']),
        priority: 'High',
        fit_score: 92,
        fit_reasons: JSON.stringify([
          { factor: 'Degree Alignment', score: 23, max: 25, text: 'Ideal for game QA, manual testing, and technical multimedia' },
          { factor: 'Location Match', score: 20, max: 20, text: 'Major studio located in Kraków' },
          { factor: 'Gaming Preference', score: 25, max: 25, text: 'High demand for junior QA and testing interns' },
          { factor: 'Dates & Duration', score: 12, max: 15, text: 'Flexible for student internship agreements' },
          { factor: 'Language Compatibility', score: 12, max: 15, text: 'English documentation & bug reporting' }
        ]),
        is_speculative: 1
      }
    ];

    const insertComp = db.prepare(`
      INSERT INTO companies (
        id, name, website, careers_url, city, country, description, industry,
        is_gaming, technologies, departments, products, priority, fit_score,
        fit_reasons, is_speculative_candidate, opt_out
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    for (const c of companiesSeed) {
      insertComp.run([
        c.id, c.name, c.website, c.careers_url, c.city, c.country, c.description, c.industry,
        c.is_gaming, c.technologies, c.departments, c.products, c.priority, c.fit_score,
        c.fit_reasons, c.is_speculative
      ]);
    }

    // Seed contacts
    const contactsSeed = [
      { id: 'ct-cdpr', compId: 'comp-cdpr', name: 'Talent Acquisition Team', role: 'Early Careers & Internships', email: 'careers@cdprojektred.com', type: 'verified_website', url: 'https://www.cdprojektred.com/en/careers' },
      { id: 'ct-11bit', compId: 'comp-11bit', name: 'Recruitment Desk', role: 'Talent Acquisition', email: 'jobs@11bitstudios.com', type: 'verified_website', url: 'https://11bitstudios.com/jobs/' },
      { id: 'ct-bloober', compId: 'comp-bloober', name: 'HR & Internship Office', role: 'HR Manager', email: 'jobs@blooberteam.com', type: 'verified_website', url: 'https://www.blooberteam.com/careers' },
      { id: 'ct-allegro', compId: 'comp-allegro', name: 'Campus Recruiting', role: 'Early Careers Lead', email: 'talent@allegro.pl', type: 'verified_website', url: 'https://allegro.pl/praca' },
      { id: 'ct-brainly', compId: 'comp-brainly', name: 'People Team Kraków', role: 'Talent Partner', email: 'recruitment@brainly.com', type: 'verified_website', url: 'https://careers.brainly.com' },
      { id: 'ct-netguru', compId: 'comp-netguru', name: 'Talent Team', role: 'Internship Coordinator', email: 'jobs@netguru.com', type: 'verified_website', url: 'https://www.netguru.com/career' },
      { id: 'ct-fwh', compId: 'comp-flyingwildhog', name: 'Kraków Studio HR', role: 'HR Specialist', email: 'recruitment@flyingwildhog.com', type: 'verified_website', url: 'https://flyingwildhog.com/careers/' }
    ];

    const insertContact = db.prepare(`
      INSERT INTO contacts (id, company_id, name, role, email, source_type, source_url, is_verified, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'Official careers contact point verified from company website')
    `);
    for (const ct of contactsSeed) {
      insertContact.run([ct.id, ct.compId, ct.name, ct.role, ct.email, ct.type, ct.url]);
    }

    // Seed Opportunities
    const oppsSeed = [
      {
        id: 'opp-brainly-fe',
        compId: 'comp-brainly',
        title: 'Frontend / Web Engineering University Intern',
        desc: 'Join Brainly engineering team in Kraków working with React, TypeScript, and modern component architecture. Ideal for university students seeking 4-6 months curricular practical training.',
        city: 'Kraków',
        cat: 'Web & Frontend Development',
        work_arr: 'Hybrid',
        is_official: 1,
        tech: JSON.stringify(['React', 'TypeScript', 'Next.js', 'CSS Modules / Tailwind', 'Git']),
        start: '2027-03-01',
        end: '2027-06-30',
        duration: 4,
        salary: 'Paid Internship (~5,500 - 7,000 PLN/mo)',
        lang: 'English (Fluent)',
        deadline: '2026-12-15',
        method: 'Email & Careers Portal',
        source: 'Ashby / Official Careers',
        source_url: 'https://careers.brainly.com',
        fit_score: 98
      },
      {
        id: 'opp-bloober-qa',
        compId: 'comp-bloober',
        title: 'Game QA & Functionality Testing Intern',
        desc: 'Testing Unreal Engine 5 builds, executing bug reproduction steps, writing detailed Jira bug reports, testing UI and controller ergonomics for high-profile psychological horror titles in Kraków.',
        city: 'Kraków',
        cat: 'Game QA & Game Testing',
        work_arr: 'On-site',
        is_official: 1,
        tech: JSON.stringify(['Jira', 'Unreal Engine 5 Editor', 'TestRail', 'Bug Reporting', 'PC / Console Hardware']),
        start: '2027-02-15',
        end: '2027-06-30',
        duration: 4,
        salary: 'Paid Internship (~4,800 - 6,000 PLN/mo)',
        lang: 'English (Polish is a plus but not required)',
        deadline: '2027-01-10',
        method: 'Email',
        source: 'Official Careers Page',
        source_url: 'https://www.blooberteam.com/careers',
        fit_score: 97
      },
      {
        id: 'opp-allegro-fe',
        compId: 'comp-allegro',
        title: 'Junior Web Developer / Intern (Frontend & UI)',
        desc: 'Contribute to high-traffic web applications, collaborate with designers on the Opole/Allegro design system, implement responsive accessible components.',
        city: 'Warsaw',
        cat: 'Frontend Development',
        work_arr: 'Hybrid',
        is_official: 1,
        tech: JSON.stringify(['React', 'TypeScript', 'Figma', 'Jest', 'Storybook']),
        start: '2027-03-01',
        end: '2027-07-01',
        duration: 4,
        salary: 'Paid Internship (~6,500 - 8,000 PLN/mo)',
        lang: 'English / Polish friendly',
        deadline: '2026-12-30',
        method: 'Careers Portal',
        source: 'Greenhouse Job Board',
        source_url: 'https://allegro.pl/praca',
        fit_score: 95
      },
      {
        id: 'opp-cdpr-spec',
        compId: 'comp-cdpr',
        title: 'Speculative University Placement: Junior Game Dev / Tech Art / QA',
        desc: 'Speculative application for university curricular internship for Spring 2027. CDPR accepts university student inquiries for technical and testing roles.',
        city: 'Warsaw',
        cat: 'Game Development',
        work_arr: 'Hybrid',
        is_official: 0,
        tech: JSON.stringify(['C++', 'C# / Unity', 'Unreal Engine', 'Git', 'Multimedia']),
        start: '2027-03-01',
        end: '2027-06-30',
        duration: 4,
        salary: 'Subject to department agreement',
        lang: 'English',
        deadline: '2027-01-31',
        method: 'Email',
        source: 'Official Direct Outreach',
        source_url: 'https://www.cdprojektred.com/en/careers',
        fit_score: 94
      },
      {
        id: 'opp-netguru-design',
        compId: 'comp-netguru',
        title: 'UI/UX Design & Web Product Trainee',
        desc: 'Work alongside senior product designers building Figma prototypes, conducting user research, and bridging UI design with frontend development.',
        city: 'Gdańsk',
        cat: 'UI/UX Design & Web Design',
        work_arr: 'Hybrid',
        is_official: 1,
        tech: JSON.stringify(['Figma', 'Design Systems', 'UI Prototyping', 'HTML/CSS basics']),
        start: '2027-03-01',
        end: '2027-06-30',
        duration: 4,
        salary: 'Paid Traineeship (~5,000 PLN/mo)',
        lang: 'English',
        deadline: '2027-01-15',
        method: 'Email & Lever',
        source: 'Lever Job Board',
        source_url: 'https://www.netguru.com/career',
        fit_score: 93
      }
    ];

    const insertOpp = db.prepare(`
      INSERT INTO opportunities (
        id, company_id, title, description, city, country, category, work_arrangement,
        is_official_vacancy, required_technologies, internship_start, internship_end,
        duration_months, salary_info, language_requirements, application_deadline,
        application_method, source_name, source_url, fit_score, is_active
      ) VALUES (?, ?, ?, ?, ?, 'Poland', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    for (const op of oppsSeed) {
      insertOpp.run([
        op.id, op.compId, op.title, op.desc, op.city, op.cat, op.work_arr, op.is_official,
        op.tech, op.start, op.end, op.duration, op.salary, op.lang, op.deadline,
        op.method, op.source, op.source_url, op.fit_score
      ]);
    }

    // Seed sample application in tracker
    db.prepare(`
      INSERT INTO applications (
        id, company_id, opportunity_id, contact_id, status, priority,
        target_role, city, date_contacted, next_follow_up_date, follow_up_count,
        notes, source
      ) VALUES (
        'app-brainly-1', 'comp-brainly', 'opp-brainly-fe', 'ct-brainly',
        'Draft prepared', 'High',
        'Frontend / Web Engineering University Intern', 'Kraków',
        NULL, NULL, 0,
        'Identified Brainly as top priority in Kraków. Draft prepared and waiting for review.',
        'Ashby Job Board'
      )
    `).run([]);

    db.prepare(`
      INSERT INTO applications (
        id, company_id, opportunity_id, contact_id, status, priority,
        target_role, city, date_contacted, next_follow_up_date, follow_up_count,
        notes, source
      ) VALUES (
        'app-bloober-1', 'comp-bloober', 'opp-bloober-qa', 'ct-bloober',
        'Ready to contact', 'High',
        'Game QA & Functionality Testing Intern', 'Kraków',
        NULL, NULL, 0,
        'Bloober Team QA position aligns with Feb-Jun 2027 dates. CV ready.',
        'Official Careers'
      )
    `).run([]);

    // Log seed audit
    db.prepare(`
      INSERT INTO audit_logs (id, action_type, entity_type, entity_id, details)
      VALUES ('audit-init', 'system_init', 'database', 'internship_hunter.sqlite', 'Initialized database and seeded initial verified Polish tech & gaming hubs')
    `).run([]);
  }

  // Seed default settings
  const defaultSettings = [
    { key: 'daily_send_limit', value: '20', desc: 'Max outgoing emails allowed per day' },
    { key: 'first_follow_up_days', value: '7', desc: 'Business days before 1st follow-up' },
    { key: 'second_follow_up_days', value: '7', desc: 'Business days before 2nd follow-up' },
    { key: 'max_follow_ups', value: '2', desc: 'Maximum follow-up emails per company' },
    { key: 'auto_send_enabled', value: 'false', desc: 'Safety switch: automatic sending disabled by default' },
    { key: 'default_language', value: 'English', desc: 'Default language for outreach emails' },
    { key: 'ai_provider', value: 'builtin', desc: 'AI Provider: builtin or openai' },
    { key: 'openai_api_key', value: '', desc: 'Encrypted or masked OpenAI API Key' },
    { key: 'preferred_cities', value: JSON.stringify(['Kraków', 'Warsaw', 'Gdańsk']), desc: 'Primary target cities in Poland' },
    { key: 'working_hours_only', value: 'true', desc: 'Only schedule emails during Polish business hours (9am - 5pm CET)' }
  ];

  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value, description) VALUES (?, ?, ?)');
  for (const s of defaultSettings) {
    insertSetting.run([s.key, s.value, s.desc]);
  }
}

module.exports = {
  initializeDatabase,
  getDbInstance: () => dbInstance,
};
