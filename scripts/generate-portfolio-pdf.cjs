const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { initializeDatabase } = require('../electron/database/db.cjs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Fábio Silva - Technical Projects Portfolio & Case Studies</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      font-size: 10px;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @page {
      size: A4;
      margin: 10mm 12mm;
    }
    .page {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

    /* Header */
    .header {
      border-bottom: 2px solid #4338ca;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .name {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .title-sub {
      font-size: 12px;
      font-weight: 700;
      color: #4338ca;
      margin-top: 1px;
    }
    .contact-links {
      text-align: right;
      font-size: 9.5px;
      color: #475569;
      line-height: 1.4;
    }
    .contact-links a {
      color: #4338ca;
      text-decoration: none;
      font-weight: 700;
    }

    /* Section */
    .section-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f172a;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 3px;
      margin-bottom: 9px;
      margin-top: 4px;
    }

    /* Project Card */
    .project-card {
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #4338ca;
      border-radius: 6px;
      padding: 9px 12px;
      margin-bottom: 10px;
      background: #fafafa;
    }
    .project-card.green {
      border-left-color: #059669;
    }
    .project-card.purple {
      border-left-color: #7c3aed;
    }
    .project-card.amber {
      border-left-color: #d97706;
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }
    .project-title {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
    }
    .project-badge {
      font-size: 8.5px;
      font-weight: 700;
      padding: 1.5px 6px;
      border-radius: 4px;
      background: #e0e7ff;
      color: #3730a3;
    }
    .project-badge.green {
      background: #d1fae5;
      color: #065f46;
    }

    .project-tech {
      font-size: 9px;
      font-weight: 700;
      color: #4338ca;
      margin-bottom: 5px;
    }
    .project-desc {
      font-size: 9.5px;
      color: #334155;
      line-height: 1.4;
      margin-bottom: 5px;
    }
    .project-highlights {
      list-style: disc;
      padding-left: 14px;
      font-size: 9px;
      color: #475569;
      line-height: 1.35;
    }
    .project-highlights li {
      margin-bottom: 2px;
    }

    .project-url {
      font-size: 9px;
      font-weight: 700;
      margin-top: 5px;
      display: inline-block;
      color: #4338ca;
      text-decoration: none;
    }

    /* Grid for secondary projects */
    .grid-two {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
    }

    .footer {
      margin-top: 10px;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 8.5px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="header">
      <div>
        <h1 class="name">Fábio Júnior Fernandes Silva</h1>
        <div class="title-sub">Web Multimedia Development Student • IPCA (Portugal)</div>
      </div>
      <div class="contact-links">
        <div>📧 fabioz262006@gmail.com • 📞 +351 930 534 067</div>
        <div>💻 <a href="https://github.com/FabioSilva32" target="_blank">github.com/FabioSilva32</a></div>
        <div>🌐 <a href="https://cinelog-phi.vercel.app/?tab=explore" target="_blank">cinelog-phi.vercel.app</a></div>
        <div>✓ Relocating to Poland: Spring 2027 (Feb–Jun)</div>
      </div>
    </header>

    <h2 class="section-title">⭐ Primary Featured Production Applications</h2>

    <!-- Project 1: CineLog -->
    <div class="project-card">
      <div class="project-header">
        <div class="project-title">1. CineLog — Movie & TV Series Tracking Progressive Web App (PWA)</div>
        <span class="project-badge green">✓ Live in Production</span>
      </div>
      <div class="project-tech">React • JavaScript / TypeScript • TMDB REST API • Mobile-First PWA • Vercel Deployment</div>
      <div class="project-desc">
        A full-featured movie and TV exploration application designed for cinephiles. Features real-time API queries, fluid bottom-sheet mobile navigation, custom diary watchlist logging, and responsive dark-canvas styling.
      </div>
      <ul class="project-highlights">
        <li><strong>Architecture & API Integration:</strong> Interfaced The Movie Database (TMDB) REST endpoints with asynchronous error handling, media poster caching, and search debouncing.</li>
        <li><strong>Mobile PWA Fidelity:</strong> Built with mobile-first touch ergonomics, gesture support, responsive typography hierarchies, and offline manifest metadata.</li>
        <li><strong>Live Deployment:</strong> Configured automated CI/CD deployment pipelines on Vercel with zero downtime.</li>
      </ul>
      <a class="project-url" href="https://cinelog-phi.vercel.app/?tab=explore" target="_blank">🔗 Live Demo: https://cinelog-phi.vercel.app/?tab=explore</a>
    </div>

    <!-- Project 2: Poland Internship Hunter -->
    <div class="project-card purple">
      <div class="project-header">
        <div class="project-title">2. Poland Internship Hunter & Outreach Automation Desktop Application</div>
        <span class="project-badge">Desktop App & CRM</span>
      </div>
      <div class="project-tech">TypeScript • React • Tailwind CSS • SQLite • Electron Desktop Shell • Nodemailer SMTP • Google Gemini API</div>
      <div class="project-desc">
        A multi-process Windows desktop CRM engineered to automate European curricular internship discovery, candidate-company fit scoring, personalized email generation, and rate-limited direct SMTP outreach for Polish tech firms and game studios.
      </div>
      <ul class="project-highlights">
        <li><strong>Explainable Fit Scoring Engine (0–100):</strong> Implemented multi-factor heuristic matching comparing student coursework against company tech stacks, locations (Kraków/Warsaw/Gdańsk), and academic dates.</li>
        <li><strong>Multi-Provider Discovery:</strong> Live query parsers for Greenhouse, Lever, and Ashby careers boards with scheduled background checks and polite rate-limiting intervals.</li>
        <li><strong>Local Persistence:</strong> Full relational SQLite database architecture with 14-stage Kanban tracking and tamper-evident audit logging.</li>
      </ul>
      <a class="project-url" href="https://github.com/FabioSilva32/poland-internship-hunter" target="_blank">🔗 Source Code & Releases: https://github.com/FabioSilva32/poland-internship-hunter</a>
    </div>

    <h2 class="section-title">💼 Technical Experience & Institutional Systems Work</h2>

    <div class="grid-two">
      <!-- Experience 1 -->
      <div class="project-card green" style="margin-bottom:0;">
        <div class="project-header">
          <div class="project-title" style="font-size:10.5px;">Hospital Misericórdia de Vila Verde</div>
          <span style="font-size:8px;color:#64748b;font-weight:600;">May – Jun 2024</span>
        </div>
        <div class="project-tech" style="color:#059669;">IT Systems & Database Support Intern</div>
        <ul class="project-highlights">
          <li>Audited and updated clinical databases ensuring data integrity across hospital departments.</li>
          <li>Authored technical procedural documentation and standard operating manuals for clinical software.</li>
          <li>Diagnosed hardware, network, and application troubleshooting tickets with zero error tolerance.</li>
        </ul>
      </div>

      <!-- Experience 2 -->
      <div class="project-card amber" style="margin-bottom:0;">
        <div class="project-header">
          <div class="project-title" style="font-size:10.5px;">Câmara Municipal de Vila Verde</div>
          <span style="font-size:8px;color:#64748b;font-weight:600;">Jun – Jul 2023</span>
        </div>
        <div class="project-tech" style="color:#d97706;">Database & Information Architecture Intern</div>
        <ul class="project-highlights">
          <li>Audited municipal supplier records and citizen databases, eliminating duplicate entries.</li>
          <li>Restructured data registries to accelerate record lookup speeds for civil service departments.</li>
          <li>Assisted in setting up workstation configurations and network peripheral diagnostics.</li>
        </ul>
      </div>
    </div>

    <div style="margin-top:10px;">
      <h2 class="section-title">📂 Additional Repositories & Coursework Highlights (IPCA)</h2>
      <div class="project-card" style="border-left-color:#64748b;margin-bottom:0;">
        <div class="project-desc" style="margin-bottom:2px;">
          <strong>Other Repositories on GitHub:</strong> <code>RetiroInterior</code> (Full-stack web application), <code>StockVault</code> (Inventory and asset management system), <code>ACRIALBI</code> (Multimedia web portal), <code>koenigsegg-site</code> (Interactive automotive design showcase).
        </div>
        <div style="font-size:9px;color:#475569;">
          <strong>Technical Tooling:</strong> Git/GitHub, Figma, VS Code, Linux & Windows Admin, Relational SQL, REST APIs, TypeScript, React.
        </div>
      </div>
    </div>

    <div class="footer">
      <span>Fábio Júnior Fernandes Silva • IPCA Web Multimedia Development</span>
      <span>Curricular Internship Target: Poland (February 1 – June 30, 2027)</span>
      <span>Portfolio & Project Brief</span>
    </div>
  </div>
</body>
</html>`;

app.whenReady().then(async () => {
  try {
    console.log('[Portfolio Generator] Initializing...');
    const localExportDir = path.resolve(__dirname, '../generated-cvs');
    const docsDir = path.join(app.getPath('userData'), 'documents');

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

    // Register into SQLite database
    const db = await initializeDatabase();
    const docId = 'doc-portfolio-showcase';
    const existing = db.prepare('SELECT id FROM documents WHERE id = ?').get(docId);
    if (existing) {
      db.prepare(`
        UPDATE documents 
        SET title = ?, file_path = ?, file_size = ?, mime_type = 'application/pdf', is_default = 1
        WHERE id = ?
      `).run('Portfolio - Project Showcase & Case Studies (PDF)', persistentPdfPath, pdfBuffer.length, docId);
    } else {
      db.prepare(`
        INSERT INTO documents (id, title, category, file_path, file_size, mime_type, is_default)
        VALUES (?, ?, 'portfolio', ?, ?, 'application/pdf', 1)
      `).run(docId, 'Portfolio - Project Showcase & Case Studies (PDF)', persistentPdfPath, pdfBuffer.length);
    }

    console.log('[Portfolio Generator] Successfully registered Portfolio in SQLite database!');
  } catch (err) {
    console.error('[Portfolio Generator] Error:', err);
  } finally {
    app.quit();
  }
});
