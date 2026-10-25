const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { initializeDatabase } = require('../electron/database/db.cjs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Fábio Silva - Deployed Projects Portfolio & Technical Case Studies</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 9.6px;
      line-height: 1.44;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @page {
      size: A4;
      margin: 9mm 12mm;
    }
    .page {
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 279mm;
    }

    /* Header */
    .header {
      border-bottom: 2.5px solid #3b82f6;
      padding-bottom: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .name {
      font-size: 23px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.6px;
      text-transform: uppercase;
    }
    .title-sub {
      font-size: 11.5px;
      font-weight: 700;
      color: #2563eb;
      margin-top: 2px;
      letter-spacing: 0.1px;
    }
    .contact-links {
      text-align: right;
      font-size: 9.5px;
      color: #475569;
      line-height: 1.45;
    }
    .contact-links a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 700;
    }
    .badge-poland {
      display: inline-block;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #6ee7b7;
      padding: 1.5px 7px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 9px;
      margin-top: 3px;
    }

    /* Section Headings */
    .section-title {
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #1e293b;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 3px;
      margin-bottom: 7px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    /* Flagship Hero Projects (2-Column or Stacked) */
    .flagship-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
      margin-bottom: 10px;
    }
    .hero-card {
      border: 1.5px solid #cbd5e1;
      border-radius: 6px;
      padding: 9px 11px;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .hero-card.cinelog {
      border-top: 4px solid #059669;
      background: linear-gradient(180deg, #f0fdf4 0%, #fafafa 15%);
    }
    .hero-card.poland-hunter {
      border-top: 4px solid #7c3aed;
      background: linear-gradient(180deg, #faf5ff 0%, #fafafa 15%);
    }

    .hero-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .hero-title {
      font-size: 11.5px;
      font-weight: 800;
      color: #0f172a;
    }
    .hero-badge {
      font-size: 8px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .hero-badge.green {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .hero-badge.purple {
      background: #ede9fe;
      color: #5b21b6;
      border: 1px solid #ddd6fe;
    }

    .hero-tech {
      font-size: 8.8px;
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 5px;
    }
    .hero-desc {
      font-size: 9.3px;
      color: #334155;
      line-height: 1.4;
      margin-bottom: 6px;
    }
    .hero-bullets {
      list-style: none;
      font-size: 8.8px;
      color: #475569;
      line-height: 1.38;
      margin-bottom: 6px;
    }
    .hero-bullets li {
      position: relative;
      padding-left: 13px;
      margin-bottom: 3.5px;
    }
    .hero-bullets li::before {
      content: "▸";
      position: absolute;
      left: 0;
      color: #2563eb;
      font-weight: 800;
    }
    .hero-link-box {
      margin-top: 4px;
      padding-top: 5px;
      border-top: 1px dashed #cbd5e1;
      font-size: 9px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hero-link-box a {
      color: #2563eb;
      text-decoration: none;
    }

    /* Supporting Deployed Apps (3 Columns) */
    .supporting-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 7px;
      margin-bottom: 10px;
    }
    .support-card {
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #3b82f6;
      border-radius: 5px;
      padding: 7px 8px;
      background: #fbfcfd;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .support-card.blue { border-left-color: #2563eb; }
    .support-card.teal { border-left-color: #0d9488; }
    .support-card.amber { border-left-color: #d97706; }

    .support-title {
      font-size: 9.8px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .support-tech {
      font-size: 8px;
      font-weight: 700;
      color: #475569;
      margin-bottom: 3px;
    }
    .support-desc {
      font-size: 8.7px;
      color: #334155;
      line-height: 1.35;
      margin-bottom: 4px;
    }
    .support-link {
      font-size: 8.2px;
      font-weight: 700;
      margin-top: 3px;
      padding-top: 3px;
      border-top: 1px dashed #e2e8f0;
    }
    .support-link a {
      color: #2563eb;
      text-decoration: none;
    }

    /* Practical Experience Grid */
    .exp-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 8px;
    }
    .exp-card {
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #059669;
      border-radius: 5px;
      padding: 7px 9px;
      background: #fafafa;
    }
    .exp-card.amber { border-left-color: #d97706; }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .exp-org {
      font-size: 10px;
      font-weight: 800;
      color: #0f172a;
    }
    .exp-role {
      font-size: 8.8px;
      font-weight: 700;
      color: #059669;
      margin-bottom: 2px;
    }
    .exp-role.amber { color: #d97706; }
    .exp-desc {
      font-size: 8.7px;
      color: #475569;
      line-height: 1.36;
    }

    /* Academic Background Bar */
    .academic-bar {
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      background: #f8fafc;
      padding: 6px 10px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.8px;
      color: #334155;
    }
    .academic-title {
      font-weight: 800;
      color: #0f172a;
    }

    /* Footer */
    .footer {
      border-top: 1.5px solid #cbd5e1;
      padding-top: 5px;
      display: flex;
      justify-content: space-between;
      font-size: 8.5px;
      color: #64748b;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="page">
    <div>
      <!-- Header -->
      <header class="header">
        <div>
          <h1 class="name">Fábio Júnior Fernandes Silva</h1>
          <div class="title-sub">Web Multimedia Development Undergraduate • IPCA (Portugal)</div>
        </div>
        <div class="contact-links">
          <div>📧 <strong>fabioz262006@gmail.com</strong> • 📞 <strong>+351 930 534 067</strong></div>
          <div>💻 <a href="https://github.com/FabioSilva32" target="_blank">github.com/FabioSilva32</a></div>
          <div><span class="badge-poland">✓ Relocating to Poland: Spring 2027 (Feb 1 – Jun 30)</span></div>
        </div>
      </header>

      <!-- 1. Flagship Engineering & Production Showcases -->
      <h2 class="section-title">🌟 Flagship Engineering & Production Projects (Main Focus)</h2>

      <div class="flagship-grid">
        <!-- 1. CineLog (Hero Card) -->
        <div class="hero-card cinelog">
          <div>
            <div class="hero-header">
              <div class="hero-title">1. CineLog — Movie & Series Tracking PWA</div>
              <span class="hero-badge green">✓ Live on Vercel</span>
            </div>
            <div class="hero-tech">React • TypeScript • TMDB REST API • Mobile PWA • Vercel CI/CD</div>
            <div class="hero-desc">
              Production Progressive Web App engineered for cinema discovery, personal watchlists, and review diaries with touch-first ergonomics and offline capabilities.
            </div>
            <ul class="hero-bullets">
              <li><strong>Modern Component Architecture:</strong> Built with modular React and strict TypeScript, implementing smooth bottom-sheet navigation and dark-canvas tactile design.</li>
              <li><strong>Asynchronous Data & Caching:</strong> Interfaced The Movie Database (TMDB) REST API with debounced queries, client-side caching, and poster image optimization.</li>
              <li><strong>Automated Production Pipeline:</strong> Continuous integration and edge CDN rendering deployed on Vercel with zero cold-start delay.</li>
            </ul>
          </div>
          <div class="hero-link-box">
            <span>🔗 Live Application:</span>
            <a href="https://cinelog-phi.vercel.app" target="_blank">cinelog-phi.vercel.app ↗</a>
          </div>
        </div>

        <!-- 2. Poland Hunter (Hero Card) -->
        <div class="hero-card poland-hunter">
          <div>
            <div class="hero-header">
              <div class="hero-title">2. Poland Internship Hunter — Desktop CRM</div>
              <span class="hero-badge purple">Desktop Application</span>
            </div>
            <div class="hero-tech">TypeScript • React • SQLite • Electron • Gemini AI • Nodemailer</div>
            <div class="hero-desc">
              Full-featured Windows desktop platform automating European curricular internship discovery, candidate fit scoring, and scheduled background career board queries.
            </div>
            <ul class="hero-bullets">
              <li><strong>Explainable 5-Factor Scoring:</strong> Algorithmic engine evaluating candidate skills against Polish tech companies, academic dates, and target cities.</li>
              <li><strong>Multi-Process System Architecture:</strong> Electron desktop shell with IPC isolation between UI and Node.js services; scheduled career board polling with rate-limiting.</li>
              <li><strong>Local Data Persistence:</strong> Local SQLite relational database with 14-stage Kanban tracking, audit logging, and direct rate-limited Gmail SMTP dispatch.</li>
            </ul>
          </div>
          <div class="hero-link-box">
            <span>🔗 Source Code & Releases:</span>
            <a href="https://github.com/FabioSilva32/poland-internship-hunter" target="_blank">github.com/FabioSilva32/poland-internship-hunter ↗</a>
          </div>
        </div>
      </div>

      <!-- 2. Supporting Live Deployed Web Applications -->
      <h2 class="section-title">🌐 Additional Live Deployed Web Applications</h2>

      <div class="supporting-grid">
        <!-- Retiro Interior -->
        <div class="support-card teal">
          <div>
            <div class="support-title">Retiro Interior — Tourism Web Portal</div>
            <div class="support-tech">HTML5 • CSS3 • JavaScript • Netlify</div>
            <div class="support-desc">
              Responsive platform showcasing interior regional tourism, eco-retreats, and nature experiences with interactive responsive sections, fluid viewports, and retreat galleries.
            </div>
          </div>
          <div class="support-link">
            🔗 <a href="https://retirointerior.netlify.app" target="_blank">retirointerior.netlify.app ↗</a>
          </div>
        </div>

        <!-- StocksVault -->
        <div class="support-card blue">
          <div>
            <div class="support-title">StocksVault — Portfolio Tracker</div>
            <div class="support-tech">Angular • TypeScript • REST API • Netlify</div>
            <div class="support-desc">
              Financial web application for monitoring equity allocations, comparative stock analytics, interactive watchlists, and reactive metrics dashboards.
            </div>
          </div>
          <div class="support-link">
            🔗 <a href="https://stocksvault.netlify.app" target="_blank">stocksvault.netlify.app ↗</a>
          </div>
        </div>

        <!-- ACRIALBI -->
        <div class="support-card amber">
          <div>
            <div class="support-title">ACRIALBI — Creative Showcase</div>
            <div class="support-tech">Web Multimedia • CSS Grid • Netlify</div>
            <div class="support-desc">
              Digital multimedia web portal presenting creative concepts, community initiatives, and ideation galleries with WCAG-compliant accessible contrast.
            </div>
          </div>
          <div class="support-link">
            🔗 <a href="https://acrialbi.netlify.app" target="_blank">acrialbi.netlify.app ↗</a>
          </div>
        </div>
      </div>

      <!-- 3. Institutional Systems & Database Support Experience -->
      <h2 class="section-title">💼 Institutional Systems & Database Support Experience</h2>

      <div class="exp-grid">
        <div class="exp-card">
          <div class="exp-header">
            <span class="exp-org">Hospital Misericórdia de Vila Verde</span>
            <span style="font-size:8px;color:#64748b;font-weight:700;">May – Jun 2024</span>
          </div>
          <div class="exp-role">IT Systems & Database Support Intern</div>
          <div class="exp-desc">
            Audited health information system databases with zero error tolerance. Authored standard operating procedural manuals for clinical staff and resolved hardware, networking, and software troubleshooting tickets across hospital departments.
          </div>
        </div>

        <div class="exp-card amber">
          <div class="exp-header">
            <span class="exp-org">Câmara Municipal de Vila Verde (City Hall)</span>
            <span style="font-size:8px;color:#64748b;font-weight:700;">Jun – Jul 2023</span>
          </div>
          <div class="exp-role amber">Database & Information Systems Intern</div>
          <div class="exp-desc">
            Cross-referenced and audited municipal supplier and citizen datasets in municipal databases, eliminating duplicate entries. Configured administrative workstations and assisted departments with operational software diagnostics.
          </div>
        </div>
      </div>

      <!-- 4. Academic Foundation & Technical Toolkit -->
      <div class="academic-bar">
        <div>
          <span class="academic-title">🎓 Education:</span> BSc in Web Multimedia Development — <strong>IPCA</strong> (Instituto Politécnico do Cávado e do Ave, Portugal)
        </div>
        <div>
          <strong>Core Toolkit:</strong> TypeScript, JavaScript, React, Angular, SQLite, Node.js, Figma, Adobe CC (Photoshop, Illustrator, Premiere Pro, After Effects)
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <span>Fábio Júnior Fernandes Silva • IPCA Web Multimedia Development</span>
      <span>Live Projects: CineLog (PWA) • Poland Hunter (Desktop) • Retiro Interior • StocksVault • ACRIALBI</span>
      <span>Target Placement: Poland (Feb–Jun 2027)</span>
    </footer>
  </div>
</body>
</html>`;

app.whenReady().then(async () => {
  try {
    console.log('[Portfolio Generator] Initializing updated multi-live deployment portfolio...');
    const localExportDir = path.resolve(__dirname, '../generated-cvs');
    const docsDir = path.join(process.env.APPDATA, 'poland-internship-hunter', 'documents');

    if (!fs.existsSync(localExportDir)) fs.mkdirSync(localExportDir, { recursive: true });
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

    const htmlPath = path.resolve(localExportDir, 'Portfolio_Showcase_Fabio_Silva.html');
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');

    const win = new BrowserWindow({
      show: false,
      width: 800,
      height: 1130,
      webPreferences: { offscreen: true }
    });

    await win.loadFile(htmlPath);
    await new Promise(r => setTimeout(r, 250));

    const pdfBuffer = await win.webContents.printToPDF({
      pageSize: 'A4',
      printBackground: true,
      margins: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    const localPdfPath = path.resolve(localExportDir, 'Portfolio_Showcase_Fabio_Silva.pdf');
    fs.writeFileSync(localPdfPath, pdfBuffer);

    const persistentPdfPath = path.resolve(docsDir, 'Portfolio_Showcase_Fabio_Silva.pdf');
    fs.writeFileSync(persistentPdfPath, pdfBuffer);

    console.log(`[Portfolio Generator] Successfully saved PDF (${pdfBuffer.length} bytes) to: ${localPdfPath}`);

    // Register into persistent database
    const targetDbPath = path.join(process.env.APPDATA, 'poland-internship-hunter', 'database', 'internship_hunter.sqlite');
    if (fs.existsSync(targetDbPath)) {
      const initSqlJs = require('sql.js');
      const SQL = await initSqlJs();
      const db = new SQL.Database(fs.readFileSync(targetDbPath));
      db.run('DELETE FROM documents WHERE id = ?', ['doc-portfolio-showcase']);
      db.run('INSERT INTO documents (id, title, category, file_path, file_size, mime_type, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        'doc-portfolio-showcase',
        'Portfolio - Project Showcase & Case Studies (PDF)',
        'portfolio',
        persistentPdfPath,
        pdfBuffer.length,
        'application/pdf',
        1
      ]);
      fs.writeFileSync(targetDbPath, Buffer.from(db.export()));
      console.log('[Portfolio Generator] Registered updated portfolio in targetDb!');
    }
  } catch (err) {
    console.error('[Portfolio Generator] Error:', err);
  } finally {
    app.quit();
  }
});
