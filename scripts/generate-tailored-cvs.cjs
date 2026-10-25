const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { initializeDatabase, getDbInstance } = require('../electron/database/db.cjs');

// Base CSS styling for clean, modern, single-page A4 European Tech CV
const baseCss = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    font-size: 10.5px;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  @page {
    size: A4;
    margin: 6.8mm 11mm;
  }
  .page {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  
  /* Header */
  .header {
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-bottom: 10px;
  }
  .name {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #0f172a;
    text-transform: uppercase;
  }
  .target-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--accent);
    margin-top: 1px;
    letter-spacing: 0.2px;
  }
  .contact-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 6px;
    font-size: 10px;
    color: #475569;
    font-weight: 500;
  }
  .contact-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .contact-item a {
    color: #475569;
    text-decoration: none;
  }
  .badge-relocate {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 9.5px;
  }

  /* Two Column Layout */
  .grid {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 18px;
  }

  /* Section Headings */
  .section-title {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #0f172a;
    border-bottom: 1.5px solid var(--accent);
    padding-bottom: 3px;
    margin-bottom: 7px;
  }

  /* Left Column Elements */
  .sidebar-section {
    margin-bottom: 9px;
  }
  .summary-text {
    font-size: 9.6px;
    color: #334155;
    line-height: 1.45;
    text-align: justify;
  }
  .edu-item {
    margin-bottom: 7px;
  }
  .edu-degree {
    font-weight: 700;
    color: #0f172a;
    font-size: 10px;
    line-height: 1.25;
  }
  .edu-school {
    color: var(--accent);
    font-weight: 600;
    font-size: 9.5px;
  }
  .edu-meta {
    color: #64748b;
    font-size: 9px;
    margin-bottom: 2px;
  }
  .edu-details {
    color: #475569;
    font-size: 9px;
    line-height: 1.35;
  }

  /* Skills */
  .skill-group {
    margin-bottom: 6px;
  }
  .skill-group-name {
    font-weight: 700;
    color: #0f172a;
    font-size: 9.5px;
    margin-bottom: 2px;
  }
  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 3.5px;
  }
  .skill-tag {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 1.5px 5.5px;
    border-radius: 3px;
    font-size: 8.5px;
    font-weight: 600;
    color: #334155;
  }

  /* Languages */
  .lang-item {
    display: flex;
    justify-content: space-between;
    font-size: 9.5px;
    padding: 2px 0;
    color: #334155;
  }
  .lang-level {
    color: #64748b;
    font-weight: 600;
  }

  /* Right Column: Experience & Projects */
  .exp-item {
    margin-bottom: 9px;
  }
  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1.5px;
  }
  .exp-role {
    font-size: 10.5px;
    font-weight: 700;
    color: #0f172a;
  }
  .exp-company {
    font-weight: 600;
    color: var(--accent);
    font-size: 10px;
  }
  .exp-dates {
    font-size: 9px;
    color: #64748b;
    font-weight: 600;
  }
  .exp-bullets {
    list-style: disc;
    padding-left: 14px;
    color: #334155;
    font-size: 9.5px;
    line-height: 1.4;
  }
  .exp-bullets li {
    margin-bottom: 2px;
  }

  /* Project Box */
  .proj-item {
    background: #f8fafc;
    border-left: 2.5px solid var(--accent);
    padding: 4px 7px;
    margin-bottom: 4.5px;
    border-radius: 0 4px 4px 0;
  }
  .proj-title {
    font-size: 9.8px;
    font-weight: 700;
    color: #0f172a;
  }
  .proj-tech {
    font-size: 8.5px;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 2px;
  }
  .proj-desc {
    font-size: 9px;
    color: #334155;
    line-height: 1.35;
  }
`;

// 3 CV Variant Configurations
const CV_TEMPLATES = [
  // 1. Frontend & Web Development
  {
    fileName: 'CV_Fabio_Silva_Frontend_Web.pdf',
    htmlName: 'CV_Fabio_Silva_Frontend_Web.html',
    category: 'fullstack_web',
    title: 'CV - Frontend & Web Development (PDF)',
    accent: '#4338ca', // Indigo
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Fábio Silva - Frontend & Web Development CV</title>
  <style>
    :root { --accent: #4338ca; }
    ${baseCss}
  </style>
</head>
<body>
  <div class="page">
    <header class="header">
      <h1 class="name">Fábio Júnior Fernandes Silva</h1>
      <div class="contact-bar">
        <span class="contact-item">📧 fabioz262006@gmail.com</span>
        <span class="contact-item">📞 +351 930 534 067</span>
        <span class="contact-item">📍 Braga / Vila Verde, Portugal</span>
        <span class="contact-item">📈 <a href="https://stocksvault.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">stocksvault.netlify.app</a></span>
        <span class="contact-item">🌐 <a href="https://cinelog-phi.vercel.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">cinelog-phi.vercel.app</a></span>
        <span class="contact-item">🌿 <a href="https://retirointerior.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">retirointerior.netlify.app</a></span>
        <span class="contact-item">💻 <a href="https://github.com/FabioSilva32" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">github.com/FabioSilva32</a></span>
        <span class="badge-relocate">✓ Relocating to Poland (Feb–Jun 2027)</span>
      </div>
    </header>

    <div class="grid">
      <!-- Left Column: Summary, Education, Skills, Languages -->
      <aside>
        <section class="sidebar-section">
          <h2 class="section-title">Profile</h2>
          <p class="summary-text">
            Undergraduate Web Multimedia Development student at IPCA (Portugal) with a solid technical background in computer hardware, networking, and relational databases. Seeking a 4-month university curricular internship in Poland (February 1 – June 30, 2027) focused on Frontend Engineering, Modern Web Frameworks (TypeScript/React/Angular), and component-driven UI development. Bilateral Erasmus+/university protocol and insurance fully arranged by institution.
          </p>
        </section>

        <section class="sidebar-section">
          <h2 class="section-title">Education</h2>
          <div class="edu-item">
            <div class="edu-degree">BSc in Web Multimedia Development</div>
            <div class="edu-school">IPCA (Polytechnic Institute of Cávado & Ave)</div>
            <div class="edu-meta">2024 – Present (Graduating 2027) • Portugal</div>
            <div class="edu-details">
              Focus: TypeScript, React, Angular, Web Architectures, REST APIs, UI/UX Design, and Relational Databases.
            </div>
          </div>
          <div class="edu-item">
            <div class="edu-degree">Professional IT Management (Level 4)</div>
            <div class="edu-school">Escola Secundária de Vila Verde</div>
            <div class="edu-meta">Sep 2021 – Jul 2024 • Portugal</div>
            <div class="edu-details">
              Hardware assembly & diagnostics, Windows/Linux OS admin, networking (TCP/IP), peripheral maintenance.
            </div>
          </div>
        </section>

        <section class="sidebar-section">
          <h2 class="section-title">Technical Skills</h2>
          <div class="skill-group">
            <div class="skill-group-name">Frontend & Languages</div>
            <div class="skill-tags">
              <span class="skill-tag">TypeScript</span>
              <span class="skill-tag">JavaScript (ES6+)</span>
              <span class="skill-tag">React</span>
              <span class="skill-tag">Angular</span>
              <span class="skill-tag">HTML5 & CSS3</span>
              <span class="skill-tag">Tailwind CSS</span>
            </div>
          </div>
          <div class="skill-group">
            <div class="skill-group-name">Architecture & Backend</div>
            <div class="skill-tags">
              <span class="skill-tag">RESTful APIs</span>
              <span class="skill-tag">HTTP Services</span>
              <span class="skill-tag">SQL & Relational DBs</span>
              <span class="skill-tag">Node.js basics</span>
              <span class="skill-tag">SQLite</span>
            </div>
          </div>
          <div class="skill-group">
            <div class="skill-group-name">Tools & Systems</div>
            <div class="skill-tags">
              <span class="skill-tag">Git / GitHub</span>
              <span class="skill-tag">VS Code</span>
              <span class="skill-tag">Figma</span>
              <span class="skill-tag">Hardware Diagnostics</span>
              <span class="skill-tag">Linux / Windows</span>
            </div>
          </div>
        </section>

        <section class="sidebar-section">
          <h2 class="section-title">Languages</h2>
          <div class="lang-item">
            <span>English</span>
            <span class="lang-level">Fluent / Professional (C1)</span>
          </div>
          <div class="lang-item">
            <span>Portuguese</span>
            <span class="lang-level">Native Speaker</span>
          </div>
        </section>
      </aside>

      <!-- Right Column: Projects & Experience -->
      <main>
        <section style="margin-bottom: 9px;">
          <h2 class="section-title">Featured Web & Software Projects</h2>
          
          <div class="proj-item">
            <div class="proj-title">CineLog — Movie & TV Series Tracking PWA (Live Production App)</div>
            <div class="proj-tech">React • JavaScript / TypeScript • TMDB REST API • Mobile PWA • <a href="https://cinelog-phi.vercel.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">cinelog-phi.vercel.app</a></div>
            <div class="proj-desc">
              Progressive Web App for media exploration and review diaries with TMDB API integration, fluid touch navigation, dark-canvas styling, and instant edge CDN rendering on Vercel.
            </div>
          </div>

          <div class="proj-item">
            <div class="proj-title">Poland Internship Hunter & Automation Desktop App</div>
            <div class="proj-tech">TypeScript • React • Tailwind CSS • SQLite • Electron • <a href="https://github.com/FabioSilva32/poland-internship-hunter" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">github.com/FabioSilva32/poland-internship-hunter</a></div>
            <div class="proj-desc">
              Built an automated desktop CRM & outreach platform tailored for European internships. Implemented 5-factor fit scoring algorithms, dynamic email generation, local SQLite database persistence, and rate-limited direct SMTP transmission.
            </div>
          </div>

          <div class="proj-item">
            <div class="proj-title">Retiro Interior & ACRIALBI — Live Deployed Web Platforms</div>
            <div class="proj-tech">HTML5 • CSS3 • JavaScript • Responsive UX • <a href="https://retirointerior.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">retirointerior.netlify.app</a> • <a href="https://acrialbi.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">acrialbi.netlify.app</a></div>
            <div class="proj-desc">
              Designed modern, responsive web portals on Netlify featuring fluid section navigation, mobile-first flex/grid layouts, and accessible contrast compliance.
            </div>
          </div>

          <div class="proj-item">
            <div class="proj-title">StocksVault — Financial Portfolio & Stock Tracker (Live Production App)</div>
            <div class="proj-tech">Angular • TypeScript • REST API • Data Visualizations • <a href="https://stocksvault.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">stocksvault.netlify.app</a></div>
            <div class="proj-desc">
              Architected and deployed a responsive financial portfolio manager with reactive Angular services for real-time asset allocations, comparative stock analytics, interactive watchlists, and performance metrics dashboards.
            </div>
          </div>
        </section>

        <section>
          <h2 class="section-title">Work & Internship Experience</h2>

          <div class="exp-item">
            <div class="exp-header">
              <div>
                <span class="exp-role">IT Systems & Database Support Intern</span> • 
                <span class="exp-company">Hospital Misericórdia de Vila Verde</span>
              </div>
              <span class="exp-dates">May 2024 – Jun 2024</span>
            </div>
            <ul class="exp-bullets">
              <li>Supported health information system operations, verifying database integrity and updating digital patient and administrative registries with zero error tolerance.</li>
              <li>Authored and formatted technical documentation, system reports, and procedural manuals for institutional personnel.</li>
              <li>Diagnosed and resolved hardware, workstation network, and software troubleshooting tickets across hospital departments.</li>
            </ul>
          </div>

          <div class="exp-item">
            <div class="exp-header">
              <div>
                <span class="exp-role">Database & Systems Support Intern</span> • 
                <span class="exp-company">Câmara Municipal de Vila Verde (City Hall)</span>
              </div>
              <span class="exp-dates">Jun 2023 – Jul 2023</span>
            </div>
            <ul class="exp-bullets">
              <li>Assisted IT department in compiling, validating, and maintaining municipal databases of suppliers and citizen records.</li>
              <li>Conducted data cleaning routines and cross-referenced relational datasets to eliminate duplicate entries across municipal branches.</li>
              <li>Coordinated with public officers to configure workstations and resolve operational software bottlenecks.</li>
            </ul>
          </div>

          <div class="exp-item">
            <div class="exp-header">
              <div>
                <span class="exp-role">Digital Records & Systems Intern</span> • 
                <span class="exp-company">OnDigital</span>
              </div>
              <span class="exp-dates">Jun 2022 – Jul 2022</span>
            </div>
            <ul class="exp-bullets">
              <li>Managed structured digital asset archiving, data verification, and digital inventory upkeep for commercial clients.</li>
              <li>Maintained accurate digital logs to ensure prompt retrieval and backup continuity of enterprise files.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  </div>
</body>
</html>`
  },

  // 2. UI/UX Design & Multimedia
  {
    fileName: 'CV_Fabio_Silva_UI_UX_Design.pdf',
    htmlName: 'CV_Fabio_Silva_UI_UX_Design.html',
    category: 'ui_ux',
    title: 'CV - UI/UX Design & Prototyping (PDF)',
    accent: '#7c3aed', // Purple
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Fábio Silva - UI/UX Design & Prototyping CV</title>
  <style>
    :root { --accent: #7c3aed; }
    ${baseCss}
  </style>
</head>
<body>
  <div class="page">
    <header class="header">
      <h1 class="name">Fábio Júnior Fernandes Silva</h1>
      <div class="contact-bar">
        <span class="contact-item">📧 fabioz262006@gmail.com</span>
        <span class="contact-item">📞 +351 930 534 067</span>
        <span class="contact-item">📍 Braga / Vila Verde, Portugal</span>
        <span class="contact-item">📈 <a href="https://stocksvault.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">stocksvault.netlify.app</a></span>
        <span class="contact-item">🌐 <a href="https://cinelog-phi.vercel.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">cinelog-phi.vercel.app</a></span>
        <span class="contact-item">🌿 <a href="https://retirointerior.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">retirointerior.netlify.app</a></span>
        <span class="contact-item">💻 <a href="https://github.com/FabioSilva32" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">github.com/FabioSilva32</a></span>
        <span class="badge-relocate">✓ Relocating to Poland (Feb–Jun 2027)</span>
      </div>
    </header>

    <div class="grid">
      <!-- Left Column -->
      <aside>
        <section class="sidebar-section">
          <h2 class="section-title">Profile</h2>
          <p class="summary-text">
            Creative and user-centered Web Multimedia Development undergraduate at IPCA (Portugal) bridging the gap between product design, interaction systems, and frontend code. Seeking a 4-month university curricular internship in Poland (February 1 – June 30, 2027) in UI/UX Design, Design Systems, or Interactive Multimedia. Hands-on experience building component design libraries, high-fidelity Figma prototypes, and clean user journeys.
          </p>
        </section>

        <section class="sidebar-section">
          <h2 class="section-title">Education</h2>
          <div class="edu-item">
            <div class="edu-degree">BSc in Web Multimedia Development</div>
            <div class="edu-school">IPCA (Polytechnic Institute of Cávado & Ave)</div>
            <div class="edu-meta">2024 – Present (Graduating 2027) • Portugal</div>
            <div class="edu-details">
              Focus: Interface Design & Usability (UI/UX), Multimedia Content Production, Design Systems, Human-Centered Interaction, Frontend Foundations.
            </div>
          </div>
          <div class="edu-item">
            <div class="edu-degree">Professional IT Management (Level 4)</div>
            <div class="edu-school">Escola Secundária de Vila Verde</div>
            <div class="edu-meta">Sep 2021 – Jul 2024 • Portugal</div>
            <div class="edu-details">
              Information systems architecture, digital hardware, peripheral diagnostics, multimedia workstations.
            </div>
          </div>
        </section>

        <section class="sidebar-section">
          <h2 class="section-title">Design & Technical Skills</h2>
          <div class="skill-group">
            <div class="skill-group-name">UI/UX & Prototyping</div>
            <div class="skill-tags">
              <span class="skill-tag">Figma</span>
              <span class="skill-tag">Design Systems</span>
              <span class="skill-tag">Interactive Prototyping</span>
              <span class="skill-tag">Wireframing</span>
              <span class="skill-tag">User Flows & IA</span>
              <span class="skill-tag">Usability Testing</span>
            </div>
          </div>
          <div class="skill-group">
            <div class="skill-group-name">Multimedia & Visual Design</div>
            <div class="skill-tags">
              <span class="skill-tag">Photoshop</span>
              <span class="skill-tag">Illustrator</span>
              <span class="skill-tag">After Effects</span>
              <span class="skill-tag">Premiere Pro</span>
              <span class="skill-tag">HTML5 & CSS3</span>
              <span class="skill-tag">Tailwind CSS</span>
            </div>
          </div>
          <div class="skill-group">
            <div class="skill-group-name">Collaboration & Methods</div>
            <div class="skill-tags">
              <span class="skill-tag">Design-to-Dev Handoff</span>
              <span class="skill-tag">Git / GitHub</span>
              <span class="skill-tag">Agile / Kanban</span>
              <span class="skill-tag">Heuristic Analysis</span>
            </div>
          </div>
        </section>

        <section class="sidebar-section">
          <h2 class="section-title">Languages</h2>
          <div class="lang-item">
            <span>English</span>
            <span class="lang-level">Fluent / Professional (C1)</span>
          </div>
          <div class="lang-item">
            <span>Portuguese</span>
            <span class="lang-level">Native Speaker</span>
          </div>
        </section>
      </aside>

      <!-- Right Column -->
      <main>
        <section style="margin-bottom: 9px;">
          <h2 class="section-title">Featured UI/UX & Multimedia Projects</h2>
          
          <div class="proj-item">
            <div class="proj-title">CineLog — Mobile PWA & Cinema Discovery UI/UX Architecture</div>
            <div class="proj-tech">Mobile-First UI • PWA • Dark-Mode Canvas • <a href="https://cinelog-phi.vercel.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">cinelog-phi.vercel.app</a></div>
            <div class="proj-desc">
              Designed an immersive, tactile cinema tracking application interface. Formatted high-contrast movie poster exploration grids, responsive bottom-sheet navigation, user diary review logging, and custom collection organization.
            </div>
          </div>

          <div class="proj-item">
            <div class="proj-title">Poland Internship Hunter — Design System & UI Architecture</div>
            <div class="proj-tech">Figma • Design Tokens • Dark Mode UI • Tailwind CSS • <a href="https://github.com/FabioSilva32/poland-internship-hunter" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">github.com/FabioSilva32/poland-internship-hunter</a></div>
            <div class="proj-desc">
              Designed a comprehensive high-density desktop interface system with custom tokenized dark-mode color palettes, accessible typography hierarchies, intuitive pipeline Kanban boards, and modal micro-interactions.
            </div>
          </div>

          <div class="proj-item">
            <div class="proj-title">Retiro Interior & ACRIALBI — Live Deployed Web Platforms</div>
            <div class="proj-tech">Figma • Responsive UX • Visual Hierarchy • <a href="https://retirointerior.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">retirointerior.netlify.app</a> • <a href="https://acrialbi.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">acrialbi.netlify.app</a></div>
            <div class="proj-desc">
              Created digital UI experiences featuring concept showcases, user-centered content layouts, accessible color palettes, and responsive grid systems for diverse display sizes.
            </div>
          </div>

          <div class="proj-item">
            <div class="proj-title">StocksVault — Financial Dashboard & Asset Comparison UX (Live App)</div>
            <div class="proj-tech">Angular • Financial Visualizations • High-Density Tables • <a href="https://stocksvault.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">stocksvault.netlify.app</a></div>
            <div class="proj-desc">
              Designed clean data tables and equity comparison views. Focused on typographic hierarchy for financial metrics, intuitive watchlist filters, and responsive layout scaling across mobile and desktop.
            </div>
          </div>
        </section>

        <section>
          <h2 class="section-title">Professional & Technical Experience</h2>

          <div class="exp-item">
            <div class="exp-header">
              <div>
                <span class="exp-role">Digital Documentation & Systems Intern</span> • 
                <span class="exp-company">Hospital Misericórdia de Vila Verde</span>
              </div>
              <span class="exp-dates">May 2024 – Jun 2024</span>
            </div>
            <ul class="exp-bullets">
              <li>Standardized formatting, layout, and visual readability of official healthcare technical documents, reports, and administrative protocols.</li>
              <li>Assisted medical staff in navigating internal healthcare applications, collecting user feedback to troubleshoot interface friction points.</li>
              <li>Maintained strict patient database organization, ensuring information accessibility across healthcare departments.</li>
            </ul>
          </div>

          <div class="exp-item">
            <div class="exp-header">
              <div>
                <span class="exp-role">Information Architecture & Database Intern</span> • 
                <span class="exp-company">Câmara Municipal de Vila Verde</span>
              </div>
              <span class="exp-dates">Jun 2023 – Jul 2023</span>
            </div>
            <ul class="exp-bullets">
              <li>Restructured municipal data registries to improve internal navigation and record retrieval speeds for civil servants.</li>
              <li>Collaborated across departments to audit public service forms, ensuring data fields were clear, uniform, and user-friendly.</li>
            </ul>
          </div>

          <div class="exp-item">
            <div class="exp-header">
              <div>
                <span class="exp-role">Digital Media & Data Archiving Intern</span> • 
                <span class="exp-company">OnDigital</span>
              </div>
              <span class="exp-dates">Jun 2022 – Jul 2022</span>
            </div>
            <ul class="exp-bullets">
              <li>Processed, cataloged, and organized digital media files and commercial assets with consistent tagging and metadata hierarchies.</li>
              <li>Ensured visual and digital assets complied with client archival specifications.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  </div>
</body>
</html>`
  },

  // 3. Game QA & Testing
  {
    fileName: 'CV_Fabio_Silva_Game_QA_Testing.pdf',
    htmlName: 'CV_Fabio_Silva_Game_QA_Testing.html',
    category: 'game_qa',
    title: 'CV - Game QA & Software Testing (PDF)',
    accent: '#059669', // Emerald
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Fábio Silva - Game QA & Software Testing CV</title>
  <style>
    :root { --accent: #059669; }
    ${baseCss}
  </style>
</head>
<body>
  <div class="page">
    <header class="header">
      <h1 class="name">Fábio Júnior Fernandes Silva</h1>
      <div class="contact-bar">
        <span class="contact-item">📧 fabioz262006@gmail.com</span>
        <span class="contact-item">📞 +351 930 534 067</span>
        <span class="contact-item">📍 Braga / Vila Verde, Portugal</span>
        <span class="contact-item">📈 <a href="https://stocksvault.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">stocksvault.netlify.app</a></span>
        <span class="contact-item">🌐 <a href="https://cinelog-phi.vercel.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">cinelog-phi.vercel.app</a></span>
        <span class="contact-item">🌿 <a href="https://retirointerior.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">retirointerior.netlify.app</a></span>
        <span class="contact-item">💻 <a href="https://github.com/FabioSilva32" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">github.com/FabioSilva32</a></span>
        <span class="badge-relocate">✓ Relocating to Poland (Feb–Jun 2027)</span>
      </div>
    </header>

    <div class="grid">
      <!-- Left Column -->
      <aside>
        <section class="sidebar-section">
          <h2 class="section-title">Profile</h2>
          <p class="summary-text">
            Web Multimedia Development undergraduate at IPCA (Portugal) with formal technical certification in Computer Hardware & Systems Management. Passionate gamer and rigorous tester seeking a 4-month curricular internship in Poland (February 1 – June 30, 2027) with Polish game studios (CD Projekt RED, 11 bit studios, Ten Square Games) or software engineering teams. Skilled in bug reproduction, test execution, hardware diagnostics, and issue tracking.
          </p>
        </section>

        <section class="sidebar-section">
          <h2 class="section-title">Education</h2>
          <div class="edu-item">
            <div class="edu-degree">BSc in Web Multimedia Development</div>
            <div class="edu-school">IPCA (Polytechnic Institute of Cávado & Ave)</div>
            <div class="edu-meta">2024 – Present (Graduating 2027) • Portugal</div>
            <div class="edu-details">
              Focus: Software Development, Interactive Multimedia Pipelines, Systems Testing, Relational Databases, Web Technologies.
            </div>
          </div>
          <div class="edu-item">
            <div class="edu-degree">Professional IT Management (Level 4)</div>
            <div class="edu-school">Escola Secundária de Vila Verde</div>
            <div class="edu-meta">Sep 2021 – Jul 2024 • Portugal</div>
            <div class="edu-details">
              Hardware assembly, GPU/CPU stress diagnostics, OS fault isolation (Windows/Linux), LAN networking, peripheral profiling.
            </div>
          </div>
        </section>

        <section class="sidebar-section">
          <h2 class="section-title">QA & Technical Skills</h2>
          <div class="skill-group">
            <div class="skill-group-name">Testing & Methodologies</div>
            <div class="skill-tags">
              <span class="skill-tag">Functional Testing</span>
              <span class="skill-tag">Regression Testing</span>
              <span class="skill-tag">Bug Reproduction</span>
              <span class="skill-tag">Test Plan Execution</span>
              <span class="skill-tag">Jira / Bug Tracking</span>
              <span class="skill-tag">Edge-Case Analysis</span>
            </div>
          </div>
          <div class="skill-group">
            <div class="skill-group-name">Hardware & Environments</div>
            <div class="skill-tags">
              <span class="skill-tag">Hardware Assembly</span>
              <span class="skill-tag">Performance Profiling</span>
              <span class="skill-tag">Windows & Linux</span>
              <span class="skill-tag">GPU / Driver Testing</span>
              <span class="skill-tag">Network Diagnostics</span>
              <span class="skill-tag">Crash Log Reading</span>
            </div>
          </div>
          <div class="skill-group">
            <div class="skill-group-name">Software & Scripting</div>
            <div class="skill-tags">
              <span class="skill-tag">JavaScript / TypeScript</span>
              <span class="skill-tag">SQL Databases</span>
              <span class="skill-tag">Git Version Control</span>
              <span class="skill-tag">HTML5 / CSS3</span>
            </div>
          </div>
        </section>

        <section class="sidebar-section">
          <h2 class="section-title">Languages</h2>
          <div class="lang-item">
            <span>English</span>
            <span class="lang-level">Fluent / Professional (C1)</span>
          </div>
          <div class="lang-item">
            <span>Portuguese</span>
            <span class="lang-level">Native Speaker</span>
          </div>
        </section>
      </aside>

      <!-- Right Column -->
      <main>
        <section style="margin-bottom: 9px;">
          <h2 class="section-title">Featured QA & Software Testing Projects</h2>
          
          <div class="proj-item">
            <div class="proj-title">CineLog PWA — Cross-Device Functional & API Testing</div>
            <div class="proj-tech">PWA Testing • TMDB API Validation • Mobile Viewports • <a href="https://cinelog-phi.vercel.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">cinelog-phi.vercel.app</a></div>
            <div class="proj-desc">
              Conducted cross-browser and mobile device verification for a movie tracking web application. Tested TMDB REST API response edge-cases, asynchronous media poster caching, network latency resilience, and touch interaction fidelity.
            </div>
          </div>

          <div class="proj-item">
            <div class="proj-title">End-to-End Application Testing Matrix — Poland Internship Hunter</div>
            <div class="proj-tech">Black-Box Testing • Edge Case Validation • Process Isolation • SQLite • <a href="https://github.com/FabioSilva32/poland-internship-hunter" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">github.com/FabioSilva32/poland-internship-hunter</a></div>
            <div class="proj-desc">
              Designed and executed manual test suites validating database transaction concurrency, JSON payload integrity, rate-limiting boundaries, and IPC message handling across multi-process Electron architectures.
            </div>
          </div>

          <div class="proj-item">
            <div class="proj-title">Retiro Interior & ACRIALBI — Responsive UI/UX & Web Verification</div>
            <div class="proj-tech">Cross-Browser Testing • Responsive Viewports • <a href="https://retirointerior.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">retirointerior.netlify.app</a> • <a href="https://acrialbi.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">acrialbi.netlify.app</a></div>
            <div class="proj-desc">
              Executed cross-platform verification for deployed Netlify web applications. Verified viewport breakpoints, section navigation reliability, DOM element accessibility, and typography scaling.
            </div>
          </div>

          <div class="proj-item">
            <div class="proj-title">StocksVault — Financial Computation & Component Integrity Testing (Live App)</div>
            <div class="proj-tech">Angular • Data Validation • Boundary Testing • <a href="https://stocksvault.netlify.app" target="_blank" style="color:var(--accent);font-weight:700;text-decoration:none;">stocksvault.netlify.app</a></div>
            <div class="proj-desc">
              Conducted functional verification across stock portfolio allocation formulas, currency conversions, comparison table sorting logic, and asynchronous REST state transitions.
            </div>
          </div>
        </section>

        <section>
          <h2 class="section-title">Technical Experience & Systems Support</h2>

          <div class="exp-item">
            <div class="exp-header">
              <div>
                <span class="exp-role">Systems & Verification Intern</span> • 
                <span class="exp-company">Hospital Misericórdia de Vila Verde</span>
              </div>
              <span class="exp-dates">May 2024 – Jun 2024</span>
            </div>
            <ul class="exp-bullets">
              <li>Conducted system verification checks on clinical databases to ensure zero corrupted patient records and strict data reliability.</li>
              <li>Diagnosed hardware failures and application crashes on hospital workstations, logging actionable reproduction steps for senior technicians.</li>
              <li>Verified software installations and network printer connectivity across high-pressure hospital departments.</li>
            </ul>
          </div>

          <div class="exp-item">
            <div class="exp-header">
              <div>
                <span class="exp-role">Data Validation & Systems Intern</span> • 
                <span class="exp-company">Câmara Municipal de Vila Verde</span>
              </div>
              <span class="exp-dates">Jun 2023 – Jul 2023</span>
            </div>
            <ul class="exp-bullets">
              <li>Performed systematic auditing and data verification across municipal databases, flagging discrepancies and duplicate records.</li>
              <li>Created structured validation routines to ensure data entry compliance across municipal service counters.</li>
            </ul>
          </div>

          <div class="exp-item">
            <div class="exp-header">
              <div>
                <span class="exp-role">Data Integrity & Archival Intern</span> • 
                <span class="exp-company">OnDigital</span>
              </div>
              <span class="exp-dates">Jun 2022 – Jul 2022</span>
            </div>
            <ul class="exp-bullets">
              <li>Executed QA checks on scanned enterprise files and database logs, maintaining 99%+ accuracy during digital transformation projects.</li>
              <li>Maintained strict adherence to digital storage standards and naming conventions.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  </div>
</body>
</html>`
  }
];

app.setName('poland-internship-hunter');

app.whenReady().then(async () => {
  try {
    console.log('[CV Generator] Initializing database...');
    const db = await initializeDatabase();

    // Directory for output PDFs and HTML files
    const docsDir = path.join(app.getPath('appData'), 'poland-internship-hunter', 'documents');
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

    const localExportDir = path.join(__dirname, '../generated-cvs');
    if (!fs.existsSync(localExportDir)) fs.mkdirSync(localExportDir, { recursive: true });

    // Single invisible BrowserWindow reused across print jobs
    const win = new BrowserWindow({
      show: false,
      width: 800,
      height: 1130,
      webPreferences: {
        offscreen: true,
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    for (const cv of CV_TEMPLATES) {
      console.log(`[CV Generator] Processing: ${cv.title}...`);

      // 1. Save HTML file locally for user review/customization
      const localHtmlPath = path.resolve(localExportDir, cv.htmlName);
      fs.writeFileSync(localHtmlPath, cv.html, 'utf8');

      // 2. Load and render HTML
      await win.loadFile(localHtmlPath);
      await new Promise(r => setTimeout(r, 250)); // allow font and layout pass

      // Generate pristine A4 PDF
      const pdfBuffer = await win.webContents.printToPDF({
        pageSize: 'A4',
        printBackground: true,
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      });

      // 3. Save PDF to persistent app documents directory & local export dir
      const persistentPdfPath = path.resolve(docsDir, cv.fileName);
      fs.writeFileSync(persistentPdfPath, pdfBuffer);

      const localPdfPath = path.resolve(localExportDir, cv.fileName);
      fs.writeFileSync(localPdfPath, pdfBuffer);

      console.log(`[CV Generator] Generated PDF (${pdfBuffer.length} bytes) at: ${persistentPdfPath}`);

      // 4. Register in SQLite database documents table
      const docId = 'cv-' + cv.category;
      const existing = db.prepare('SELECT id FROM documents WHERE id = ? OR category = ?').get(docId, cv.category);

      if (existing) {
        db.prepare(`
          UPDATE documents 
          SET title = ?, file_path = ?, file_size = ?, mime_type = 'application/pdf', is_default = 1
          WHERE id = ?
        `).run(cv.title, persistentPdfPath, pdfBuffer.length, existing.id);
      } else {
        db.prepare(`
          INSERT INTO documents (id, title, category, file_path, file_size, mime_type, is_default)
          VALUES (?, ?, ?, ?, ?, 'application/pdf', 1)
        `).run(docId, cv.title, cv.category, persistentPdfPath, pdfBuffer.length);
      }
    }

    console.log('[CV Generator] Successfully generated and registered all 3 tailored CVs in SQLite!');
  } catch (err) {
    console.error('[CV Generator] Error:', err);
  } finally {
    app.quit();
  }
});
