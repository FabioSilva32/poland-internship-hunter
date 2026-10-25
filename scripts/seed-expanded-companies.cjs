const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbs = [
  path.join(process.env.APPDATA, 'poland-internship-hunter', 'database', 'internship_hunter.sqlite'),
  path.join(process.cwd(), 'data', 'internship_hunter.sqlite')
];

const newCompanies = [
  {
    id: 'comp-miquido',
    name: 'Miquido',
    website: 'https://www.miquido.com',
    careers_url: 'https://www.miquido.com/career/',
    city: 'Kraków',
    country: 'Poland',
    description: 'Premier digital product and software development agency headquartered in Zabłocie, Kraków. Renowned for modern web engineering (React, TypeScript), mobile apps, and human-centered UI/UX design in Figma.',
    industry: 'Digital Product Agency & Web Development',
    is_gaming: 0,
    technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Figma', 'UI/UX Design', 'Next.js', 'REST APIs']),
    departments: JSON.stringify(['Frontend Engineering', 'UI/UX Product Design', 'Mobile Development', 'Quality Assurance']),
    products: JSON.stringify(['Onkyo Music Platform', 'Skyscanner Web Modules', 'Topline App', 'Next-Gen FinTech Dashboards']),
    priority: 'High',
    fit_score: 97,
    fit_reasons: JSON.stringify([
      { factor: 'Location Match', score: 20, max: 20, text: 'Headquartered in Kraków (#1 preferred city)' },
      { factor: 'Degree Alignment', score: 25, max: 25, text: 'Direct overlap with Web Multimedia (React, TypeScript, Figma)' },
      { factor: 'Industry Focus', score: 25, max: 25, text: 'Top European web design and engineering studio' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Welcomes curricular and Erasmus+ university interns' },
      { factor: 'Language Compatibility', score: 12, max: 15, text: 'Fully international, English-speaking company culture' }
    ]),
    contact_email: 'jobs@miquido.com',
    contact_name: 'Miquido Talent Acquisition',
    opp_title: 'Speculative University Internship: Web Frontend & UI/UX Design',
    opp_category: 'Web & Frontend Development'
  },
  {
    id: 'comp-codete',
    name: 'Codete',
    website: 'https://codete.com',
    careers_url: 'https://codete.com/careers',
    city: 'Kraków',
    country: 'Poland',
    description: 'Kraków-based technology consultancy and software house specializing in full-stack web engineering, modern frontend architectures, cloud solutions, and data science.',
    industry: 'IT Consulting & Software Engineering',
    is_gaming: 0,
    technologies: JSON.stringify(['TypeScript', 'JavaScript', 'React', 'Angular', 'Node.js', 'SQL', 'Git']),
    departments: JSON.stringify(['Web Development', 'Frontend Engineering', 'Cloud & DevOps', 'QA']),
    products: JSON.stringify(['Enterprise Web Portals', 'Fintech Dashboards', 'Cloud Management Platforms']),
    priority: 'High',
    fit_score: 95,
    fit_reasons: JSON.stringify([
      { factor: 'Location Match', score: 20, max: 20, text: 'Main office located in Kraków' },
      { factor: 'Degree Alignment', score: 24, max: 25, text: 'Strong frontend and full-stack web alignment' },
      { factor: 'Industry Focus', score: 24, max: 25, text: 'Professional consulting and modern web stacks' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Spring 2027 curricular placement window' },
      { factor: 'Language Compatibility', score: 12, max: 15, text: 'English is standard for client projects' }
    ]),
    contact_email: 'careers@codete.com',
    contact_name: 'Codete HR & Recruitment Desk',
    opp_title: 'Curricular Internship: Junior Web & Frontend Engineering',
    opp_category: 'Web & Frontend Development'
  },
  {
    id: 'comp-softwaremind',
    name: 'Software Mind',
    website: 'https://softwaremind.com',
    careers_url: 'https://softwaremind.com/careers/',
    city: 'Kraków',
    country: 'Poland',
    description: 'Major software engineering and digital transformation company headquartered in Kraków, partnering with top European startups and enterprises across modern web architectures.',
    industry: 'Software Engineering & Web Solutions',
    is_gaming: 0,
    technologies: JSON.stringify(['TypeScript', 'React', 'Angular', 'Node.js', 'REST APIs', 'SQL', 'Git']),
    departments: JSON.stringify(['Software Engineering', 'Frontend Development', 'Quality Assurance', 'UX/UI']),
    products: JSON.stringify(['FinTech Platforms', 'Digital Telecommunication Portals', 'Cloud Web Apps']),
    priority: 'High',
    fit_score: 94,
    fit_reasons: JSON.stringify([
      { factor: 'Location Match', score: 20, max: 20, text: 'Kraków headquarters' },
      { factor: 'Degree Alignment', score: 24, max: 25, text: 'Web Multimedia and programming match' },
      { factor: 'Industry Focus', score: 24, max: 25, text: 'Extensive web development divisions' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Fits 4-month curricular timeline' },
      { factor: 'Language Compatibility', score: 11, max: 15, text: 'International work environment' }
    ]),
    contact_email: 'career@softwaremind.com',
    contact_name: 'Software Mind People Team',
    opp_title: 'University Placement: Software & Web Development',
    opp_category: 'Software Development & Programming'
  },
  {
    id: 'comp-railwaymen',
    name: 'Railwaymen',
    website: 'https://railwaymen.org',
    careers_url: 'https://railwaymen.org/careers',
    city: 'Kraków',
    country: 'Poland',
    description: 'Kraków web and mobile development studio specializing in interactive web applications, component architectures, and responsive UI/UX design.',
    industry: 'Web & Mobile Application Development',
    is_gaming: 0,
    technologies: JSON.stringify(['React', 'TypeScript', 'HTML5', 'CSS3 / Tailwind', 'Node.js', 'Figma']),
    departments: JSON.stringify(['Frontend Engineering', 'Product Design', 'Backend Web']),
    products: JSON.stringify(['Fintech Web Apps', 'SaaS Portals', 'E-commerce Solutions']),
    priority: 'High',
    fit_score: 93,
    fit_reasons: JSON.stringify([
      { factor: 'Location Match', score: 20, max: 20, text: 'Kraków local studio' },
      { factor: 'Degree Alignment', score: 24, max: 25, text: 'Direct match for React, CSS, and UI prototyping' },
      { factor: 'Industry Focus', score: 24, max: 25, text: 'Web applications and digital products' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Curricular internship compatibility' },
      { factor: 'Language Compatibility', score: 10, max: 15, text: 'English client communication' }
    ]),
    contact_email: 'jobs@railwaymen.org',
    contact_name: 'Railwaymen Talent Team',
    opp_title: 'Junior Web & Frontend Internship',
    opp_category: 'Web & Frontend Development'
  },
  {
    id: 'comp-starward',
    name: 'Starward Industries',
    website: 'https://starwardindustries.com',
    careers_url: 'https://starwardindustries.com/jobs/',
    city: 'Kraków',
    country: 'Poland',
    description: 'Kraków game development studio founded by veteran developers from CD Projekt RED and Techland. Creators of the acclaimed retro-futuristic hard sci-fi thriller The Invincible.',
    industry: 'Video Games',
    is_gaming: 1,
    technologies: JSON.stringify(['Unreal Engine 5', 'C++', 'C#', 'Game QA & Defect Tracking', 'Photogrammetry', 'Jira']),
    departments: JSON.stringify(['Game Development', 'Game QA & Testing', 'Technical Art', 'UI Design']),
    products: JSON.stringify(['The Invincible', 'Sci-Fi Narrative Interactive Systems']),
    priority: 'High',
    fit_score: 96,
    fit_reasons: JSON.stringify([
      { factor: 'Location Match', score: 20, max: 20, text: 'Located directly in Kraków' },
      { factor: 'Gaming Alignment', score: 25, max: 25, text: 'Outstanding fit for Game QA, testing, and multimedia' },
      { factor: 'Degree Alignment', score: 25, max: 25, text: 'Web Multimedia interactive systems overlap' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'February–June 2027 window fits semester requirements' },
      { factor: 'Language Compatibility', score: 11, max: 15, text: 'English-speaking production team' }
    ]),
    contact_email: 'contact@starwardindustries.com',
    contact_name: 'Starward Industries Production & QA Lead',
    opp_title: 'Game QA & Functionality Testing Placement',
    opp_category: 'Game QA & Game Testing'
  },
  {
    id: 'comp-peoplecanfly',
    name: 'People Can Fly',
    website: 'https://peoplecanfly.com',
    careers_url: 'https://peoplecanfly.com/careers/',
    city: 'Warsaw',
    country: 'Poland',
    description: 'Leading European AAA game studio known for Outriders, Bulletstorm, and Gears of War: Judgment. Focuses on Unreal Engine 5 action shooters, gameplay tech, and QA pipelines.',
    industry: 'Video Games & AAA Entertainment',
    is_gaming: 1,
    technologies: JSON.stringify(['Unreal Engine 5', 'C++', 'Game QA & Testing', 'Python', 'C#', 'Jira']),
    departments: JSON.stringify(['Game Engineering', 'Quality Assurance & Testing', 'Technical Art', 'UI']),
    products: JSON.stringify(['Outriders', 'Bulletstorm', 'Project Gemini', 'Project Maverick']),
    priority: 'High',
    fit_score: 95,
    fit_reasons: JSON.stringify([
      { factor: 'Gaming Alignment', score: 25, max: 25, text: 'Major AAA studio with dedicated QA and junior pipelines' },
      { factor: 'Location Match', score: 19, max: 20, text: 'Warsaw studio matches top preferences' },
      { factor: 'Degree Alignment', score: 25, max: 25, text: 'Programming, testing, and multimedia pipelines' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Spring 2027 curricular internship fit' },
      { factor: 'Language Compatibility', score: 11, max: 15, text: 'English is the official working language' }
    ]),
    contact_email: 'jobs@peoplecanfly.com',
    contact_name: 'People Can Fly Talent Team',
    opp_title: 'Junior Game QA & Functionality Testing Intern',
    opp_category: 'Game QA & Game Testing'
  },
  {
    id: 'comp-techland',
    name: 'Techland',
    website: 'https://techland.net',
    careers_url: 'https://techland.net/careers',
    city: 'Warsaw',
    country: 'Poland',
    description: 'One of Poland\'s premier game developers and publishers, creators of the worldwide blockbuster Dying Light series, Dead Island, and Call of Juarez.',
    industry: 'Video Games & AAA Entertainment',
    is_gaming: 1,
    technologies: JSON.stringify(['C++', 'Unreal Engine', 'Custom Engine', 'Game QA & Test Automation', 'C#']),
    departments: JSON.stringify(['Production', 'Game Testing & QA', 'Engine & Gameplay', 'Tools']),
    products: JSON.stringify(['Dying Light 2: Stay Human', 'Dying Light: The Beast', 'Dead Island']),
    priority: 'High',
    fit_score: 95,
    fit_reasons: JSON.stringify([
      { factor: 'Gaming Alignment', score: 25, max: 25, text: 'Premier Polish AAA game developer' },
      { factor: 'Location Match', score: 19, max: 20, text: 'Warsaw and Wrocław studio hubs' },
      { factor: 'Degree Alignment', score: 24, max: 25, text: 'Game QA, scripting, and interactive tech' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Curricular internship protocol supported' },
      { factor: 'Language Compatibility', score: 12, max: 15, text: 'Global team communicating in English' }
    ]),
    contact_email: 'jobs@techland.net',
    contact_name: 'Techland Recruitment Desk',
    opp_title: 'Game Testing & Quality Assurance Intern',
    opp_category: 'Game QA & Game Testing'
  },
  {
    id: 'comp-theastronauts',
    name: 'The Astronauts',
    website: 'https://www.theastronauts.com',
    careers_url: 'https://www.theastronauts.com/category/jobs/',
    city: 'Warsaw',
    country: 'Poland',
    description: 'Renowned independent Polish game studio founded by Adrian Chmielarz, creators of The Vanishing of Ethan Carter and the dark fantasy FPS Witchfire.',
    industry: 'Video Games',
    is_gaming: 1,
    technologies: JSON.stringify(['Unreal Engine 5', 'C++', 'Game QA Testing', 'C#', 'Photogrammetry']),
    departments: JSON.stringify(['Game Development', 'QA & Playtesting', 'Design & Art']),
    products: JSON.stringify(['Witchfire', 'The Vanishing of Ethan Carter']),
    priority: 'High',
    fit_score: 94,
    fit_reasons: JSON.stringify([
      { factor: 'Gaming Alignment', score: 25, max: 25, text: 'High-craft boutique game studio' },
      { factor: 'Location Match', score: 19, max: 20, text: 'Warsaw studio' },
      { factor: 'Degree Alignment', score: 24, max: 25, text: 'Multimedia and game testing integration' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Spring 2027 placement' },
      { factor: 'Language Compatibility', score: 11, max: 15, text: 'English widely used' }
    ]),
    contact_email: 'contact@theastronauts.com',
    contact_name: 'The Astronauts Hiring Team',
    opp_title: 'Speculative Internship: Game QA & Interactive Scripting',
    opp_category: 'Game QA & Game Testing'
  },
  {
    id: 'comp-creepyjar',
    name: 'Creepy Jar',
    website: 'https://creepyjar.com',
    careers_url: 'https://creepyjar.com/en/career/',
    city: 'Warsaw',
    country: 'Poland',
    description: 'Warsaw game developer behind the international hit Green Hell and upcoming sci-fi base-building survival game StarRupture.',
    industry: 'Video Games',
    is_gaming: 1,
    technologies: JSON.stringify(['Unity 3D', 'C#', 'Unreal Engine', 'Game QA & Testing', 'Jira']),
    departments: JSON.stringify(['Development', 'Quality Assurance', 'Art & Multimedia']),
    products: JSON.stringify(['Green Hell', 'StarRupture']),
    priority: 'High',
    fit_score: 95,
    fit_reasons: JSON.stringify([
      { factor: 'Gaming Alignment', score: 25, max: 25, text: 'Strong Unity and C# studio fit' },
      { factor: 'Location Match', score: 19, max: 20, text: 'Warsaw studio location' },
      { factor: 'Degree Alignment', score: 25, max: 25, text: 'Direct alignment with Unity, C#, and QA' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: '4-month internship calendar' },
      { factor: 'Language Compatibility', score: 11, max: 15, text: 'English development environment' }
    ]),
    contact_email: 'jobs@creepyjar.com',
    contact_name: 'Creepy Jar Recruitment',
    opp_title: 'Game QA & Functionality Tester Trainee',
    opp_category: 'Game QA & Game Testing'
  },
  {
    id: 'comp-cigames',
    name: 'CI Games',
    website: 'https://www.cigames.com',
    careers_url: 'https://www.cigames.com/careers/',
    city: 'Warsaw',
    country: 'Poland',
    description: 'International game publisher and developer headquartered in Warsaw, creators of Lords of the Fallen and the Sniper Ghost Warrior franchise.',
    industry: 'Video Games',
    is_gaming: 1,
    technologies: JSON.stringify(['Unreal Engine 5', 'C++', 'C#', 'QA Bug Reporting', 'Jira']),
    departments: JSON.stringify(['Engineering', 'Quality Assurance', 'Production']),
    products: JSON.stringify(['Lords of the Fallen', 'Sniper Ghost Warrior Contracts 2']),
    priority: 'High',
    fit_score: 93,
    fit_reasons: JSON.stringify([
      { factor: 'Gaming Alignment', score: 25, max: 25, text: 'Major Polish publisher and development house' },
      { factor: 'Location Match', score: 19, max: 20, text: 'Warsaw headquarters' },
      { factor: 'Degree Alignment', score: 23, max: 25, text: 'Game QA, build verification, and multimedia' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Spring 2027 timeline' },
      { factor: 'Language Compatibility', score: 11, max: 15, text: 'English production pipelines' }
    ]),
    contact_email: 'careers@cigames.com',
    contact_name: 'CI Games Recruitment Team',
    opp_title: 'Game QA & Verification Intern',
    opp_category: 'Game QA & Game Testing'
  },
  {
    id: 'comp-docplanner',
    name: 'Docplanner',
    website: 'https://www.docplanner.com',
    careers_url: 'https://www.docplanner.com/career',
    city: 'Warsaw',
    country: 'Poland',
    description: 'Healthcare tech unicorn headquartered in Poland (ZnanyLekarz), connecting millions of patients and doctors across Europe with complex web platforms and reactive frontends.',
    industry: 'HealthTech & Consumer Web Platform',
    is_gaming: 0,
    technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Figma', 'UI/UX Design Systems', 'REST APIs', 'SQL']),
    departments: JSON.stringify(['Product & Design', 'Frontend Web', 'Engineering', 'QA']),
    products: JSON.stringify(['ZnanyLekarz Portal', 'Doctor Video Telehealth', 'Docplanner Clinic Management']),
    priority: 'High',
    fit_score: 94,
    fit_reasons: JSON.stringify([
      { factor: 'Degree Alignment', score: 25, max: 25, text: 'TypeScript, React, and Figma UI/UX match' },
      { factor: 'Location Match', score: 19, max: 20, text: 'Warsaw and Kraków teams' },
      { factor: 'Industry Focus', score: 24, max: 25, text: 'High-scale consumer web technology' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Spring 2027 placement' },
      { factor: 'Language Compatibility', score: 11, max: 15, text: 'English is company operating language' }
    ]),
    contact_email: 'careers@docplanner.com',
    contact_name: 'Docplanner Talent Acquisition Team',
    opp_title: 'Frontend Web Engineering & UI Intern',
    opp_category: 'Web & Frontend Development'
  },
  {
    id: 'comp-monterail',
    name: 'Monterail',
    website: 'https://www.monterail.com',
    careers_url: 'https://www.monterail.com/careers',
    city: 'Wrocław',
    country: 'Poland',
    description: 'Renowned digital product development and web consultancy building modern web applications, design systems, and frontend architectures for international clients.',
    industry: 'Web Development & UI/UX Consultancy',
    is_gaming: 0,
    technologies: JSON.stringify(['React', 'TypeScript', 'Figma', 'UI/UX Design', 'Tailwind CSS', 'Node.js']),
    departments: JSON.stringify(['Frontend Web', 'Product Design', 'Quality Assurance']),
    products: JSON.stringify(['FinTech Web Platforms', 'Enterprise Design Systems', 'Interactive SaaS']),
    priority: 'High',
    fit_score: 94,
    fit_reasons: JSON.stringify([
      { factor: 'Degree Alignment', score: 25, max: 25, text: 'Perfect alignment with modern frontend and Figma' },
      { factor: 'Location Match', score: 18, max: 20, text: 'Wrocław / Hybrid across Poland' },
      { factor: 'Industry Focus', score: 25, max: 25, text: 'Specializes in custom modern web applications' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Supports university curricular agreements' },
      { factor: 'Language Compatibility', score: 11, max: 15, text: 'English-first consultancy' }
    ]),
    contact_email: 'recruitment@monterail.com',
    contact_name: 'Monterail People & Culture',
    opp_title: 'Frontend Developer & UI/UX Trainee',
    opp_category: 'Web & Frontend Development'
  },
  {
    id: 'comp-apptension',
    name: 'Apptension',
    website: 'https://apptension.com',
    careers_url: 'https://apptension.com/career',
    city: 'Poznań',
    country: 'Poland',
    description: 'Creative technology agency specializing in interactive web experiences, cutting-edge frontend production (WebGL, React, Three.js), and multimedia digital design.',
    industry: 'Creative Web & Interactive Production',
    is_gaming: 0,
    technologies: JSON.stringify(['TypeScript', 'React', 'WebGL', 'Three.js', 'Figma', 'UI/UX Design', 'CSS Animations']),
    departments: JSON.stringify(['Creative Tech', 'Frontend Engineering', 'Interactive Design']),
    products: JSON.stringify(['Interactive Web Portals', 'Award-Winning Brand Experiences', 'Digital Media Showcases']),
    priority: 'High',
    fit_score: 96,
    fit_reasons: JSON.stringify([
      { factor: 'Degree Alignment', score: 25, max: 25, text: 'Exceptional match for Web Multimedia Development' },
      { factor: 'Industry Focus', score: 25, max: 25, text: 'Focuses on creative web, animations, and frontend' },
      { factor: 'Location Match', score: 19, max: 20, text: 'Poznań / Hybrid across Poland' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Spring 2027 internship timeline' },
      { factor: 'Language Compatibility', score: 12, max: 15, text: 'English client and team communications' }
    ]),
    contact_email: 'career@apptension.com',
    contact_name: 'Apptension Creative Tech Team',
    opp_title: 'Interactive Frontend & Creative Web Intern',
    opp_category: 'Web & Frontend Development'
  },
  {
    id: 'comp-10clouds',
    name: '10Clouds',
    website: 'https://10clouds.com',
    careers_url: 'https://10clouds.com/careers/',
    city: 'Warsaw',
    country: 'Poland',
    description: 'Digital product design and web development agency with over a decade of experience building modern web products, responsive UIs, and FinTech applications.',
    industry: 'Digital Product Design & Web Development',
    is_gaming: 0,
    technologies: JSON.stringify(['React', 'TypeScript', 'Figma', 'UI/UX Prototyping', 'Node.js', 'Next.js']),
    departments: JSON.stringify(['Product Design', 'Web Frontend', 'QA & Delivery']),
    products: JSON.stringify(['Fintech Dashboards', 'Web Applications', 'Interactive Design Prototypes']),
    priority: 'High',
    fit_score: 93,
    fit_reasons: JSON.stringify([
      { factor: 'Degree Alignment', score: 24, max: 25, text: 'React, TypeScript, and Figma design systems' },
      { factor: 'Location Match', score: 19, max: 20, text: 'Warsaw presence' },
      { factor: 'Industry Focus', score: 24, max: 25, text: 'Modern web engineering and UI design' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Accommodates university curricular schedules' },
      { factor: 'Language Compatibility', score: 11, max: 15, text: 'English-speaking agency' }
    ]),
    contact_email: 'careers@10clouds.com',
    contact_name: '10Clouds People & Talent',
    opp_title: 'UI/UX Design & Frontend Engineering Trainee',
    opp_category: 'UI/UX Design & Web Design'
  },
  {
    id: 'comp-spyrosoft',
    name: 'Spyrosoft',
    website: 'https://spyro-soft.com',
    careers_url: 'https://spyro-soft.com/career',
    city: 'Kraków',
    country: 'Poland',
    description: 'European software engineering consultancy with prominent offices in Kraków and Wrocław, operating dedicated practices in modern web development, software testing, and QA.',
    industry: 'Software Engineering & QA Consulting',
    is_gaming: 0,
    technologies: JSON.stringify(['TypeScript', 'React', 'QA Manual & Automation Testing', 'Node.js', 'C++', 'Git']),
    departments: JSON.stringify(['Web Development', 'Quality Assurance & Testing', 'Embedded Tech']),
    products: JSON.stringify(['Automotive Web Applications', 'Enterprise Systems', 'QA Testing Frameworks']),
    priority: 'High',
    fit_score: 93,
    fit_reasons: JSON.stringify([
      { factor: 'Location Match', score: 20, max: 20, text: 'Established office in Kraków' },
      { factor: 'Degree Alignment', score: 23, max: 25, text: 'Web development and QA testing alignment' },
      { factor: 'Industry Focus', score: 24, max: 25, text: 'Professional engineering services' },
      { factor: 'Dates & Duration', score: 15, max: 15, text: 'Spring 2027 curricular internship' },
      { factor: 'Language Compatibility', score: 11, max: 15, text: 'English client communication' }
    ]),
    contact_email: 'careers@spyro-soft.com',
    contact_name: 'Spyrosoft Recruitment Desk',
    opp_title: 'Junior Software & QA Testing University Intern',
    opp_category: 'Game QA & Game Testing'
  }
];

for (const p of dbs) {
  if (fs.existsSync(p)) {
    console.log('Seeding into:', p);
    const db = new DatabaseSync(p);

    const insertCompany = db.prepare(`
      INSERT OR REPLACE INTO companies (
        id, name, website, careers_url, city, country, description, industry,
        is_gaming, technologies, departments, products, priority, fit_score, fit_reasons, is_speculative_candidate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const insertContact = db.prepare(`
      INSERT OR REPLACE INTO contacts (
        id, company_id, name, role, email, source_type, is_verified
      ) VALUES (?, ?, ?, ?, ?, 'verified_website', 1)
    `);

    const insertOpp = db.prepare(`
      INSERT OR REPLACE INTO opportunities (
        id, company_id, title, description, city, country, category, work_arrangement,
        is_official_vacancy, required_technologies, internship_start, internship_end,
        duration_months, language_requirements, source_name, source_url, fit_score, fit_breakdown
      ) VALUES (?, ?, ?, ?, ?, 'Poland', ?, 'Hybrid', 0, ?, '2027-02-01', '2027-06-30', 4, 'English', 'Speculative Curricular Target', ?, ?, ?)
    `);

    for (const c of newCompanies) {
      insertCompany.run(
        c.id, c.name, c.website, c.careers_url, c.city, c.country, c.description,
        c.industry, c.is_gaming, c.technologies, c.departments, c.products,
        c.priority, c.fit_score, c.fit_reasons
      );

      const contactId = 'cont-' + c.id;
      insertContact.run(contactId, c.id, c.contact_name, 'Talent Acquisition & University Outreach', c.contact_email);

      const oppId = 'opp-' + c.id + '-spec';
      insertOpp.run(
        oppId, c.id, c.opp_title, c.description, c.city, c.opp_category,
        c.technologies, c.careers_url, c.fit_score, c.fit_reasons
      );
    }

    const totalCount = db.prepare('SELECT count(*) as count FROM companies').get().count;
    const oppCount = db.prepare('SELECT count(*) as count FROM opportunities').get().count;
    console.log('  -> Total companies now:', totalCount, '| Total opportunities:', oppCount);
  }
}
