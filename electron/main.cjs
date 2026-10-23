const { app, BrowserWindow, ipcMain, shell, dialog, safeStorage } = require('electron');
const path = require('path');
const fs = require('fs');
const { initializeDatabase, getDbInstance } = require('./database/db.cjs');
const { calculateFitScore } = require('./services/fitScoreService.cjs');
const { generateEmail } = require('./services/aiService.cjs');
const { setGlobalPause, getGlobalPauseState, sendEmail, exportDraftAsEml, testEmailConnection } = require('./services/emailService.cjs');
const { runCompanyAndInternshipSearch } = require('./services/searchService.cjs');

let mainWindow = null;
let db = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 700,
    frame: true,
    backgroundColor: '#090d16',
    title: 'Poland Internship Hunter & Email Automation',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Load Vite dev server if running, or production build from dist/
  const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;
  const distPath = path.join(__dirname, '../dist/index.html');

  if (isDev && process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else if (fs.existsSync(distPath)) {
    mainWindow.loadFile(distPath);
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  // Handle external links safely in OS default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

let autoSearchTimer = null;

function setupScheduledSearch() {
  if (autoSearchTimer) clearInterval(autoSearchTimer);

  const checkAndRun = async () => {
    try {
      if (!db) return;
      const enabledRow = db.prepare("SELECT value FROM settings WHERE key = 'auto_sync_enabled'").get();
      const enabled = enabledRow ? enabledRow.value === 'true' : true;
      if (!enabled) return;

      const intervalHoursRow = db.prepare("SELECT value FROM settings WHERE key = 'auto_sync_interval_hours'").get();
      const intervalHours = intervalHoursRow ? parseFloat(intervalHoursRow.value) || 12 : 12;
      const intervalMs = intervalHours * 60 * 60 * 1000;

      // Find last successful search run
      const lastRun = db.prepare("SELECT created_at FROM search_runs WHERE status = 'completed' ORDER BY created_at DESC LIMIT 1").get();
      let shouldRun = false;

      if (!lastRun || !lastRun.created_at) {
        shouldRun = true;
      } else {
        const lastRunTime = new Date(lastRun.created_at).getTime();
        const now = Date.now();
        if (now - lastRunTime >= intervalMs) {
          shouldRun = true;
        }
      }

      if (shouldRun) {
        console.log(`[AutoSearch] Scheduled background search triggered (Cadence: ${intervalHours}h)...`);
        const result = await runCompanyAndInternshipSearch({
          db,
          city: 'All',
          category: 'All',
          includeSpeculative: true,
          includeOfficial: true
        });
        console.log(`[AutoSearch] Completed! Discovered ${result.newOpportunities} opps, ${result.newCompanies} companies.`);

        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('search:autoUpdateCompleted', {
            newOpportunities: result.newOpportunities,
            newCompanies: result.newCompanies,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.warn('[AutoSearch] Error during scheduled check:', err.message);
    }
  };

  // Run initial check 15 seconds after launch to ensure window is ready
  setTimeout(checkAndRun, 15000);

  // Check every 15 minutes if it is time to run the scheduled sync
  autoSearchTimer = setInterval(checkAndRun, 15 * 60 * 1000);
}

app.whenReady().then(async () => {
  // Initialize SQLite database
  db = await initializeDatabase();
  registerIpcHandlers();
  createWindow();
  setupScheduledSearch();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Register all IPC handlers
function registerIpcHandlers() {
  // 1. Dashboard Metrics
  ipcMain.handle('db:getDashboardMetrics', async () => {
    const totalCompanies = db.prepare('SELECT count(*) as count FROM companies').get().count;
    const worthContacting = db.prepare("SELECT count(*) as count FROM companies WHERE priority IN ('High', 'Medium') AND opt_out = 0").get().count;
    const totalOpportunities = db.prepare('SELECT count(*) as count FROM opportunities WHERE is_active = 1').get().count;
    const dateMatches = db.prepare("SELECT count(*) as count FROM opportunities WHERE (internship_start LIKE '%2027-02%' OR internship_start LIKE '%2027-03%')").get().count;
    
    const draftsCount = db.prepare("SELECT count(*) as count FROM email_drafts WHERE status IN ('draft', 'approved')").get().count;
    const sentCount = db.prepare("SELECT count(*) as count FROM email_messages WHERE direction = 'outgoing'").get().count;
    const repliesCount = db.prepare("SELECT count(*) as count FROM email_messages WHERE direction = 'incoming'").get().count;
    const interviewsCount = db.prepare("SELECT count(*) as count FROM applications WHERE status = 'Interview'").get().count;
    const rejectionsCount = db.prepare("SELECT count(*) as count FROM applications WHERE status = 'Rejected'").get().count;
    const awaitingResponse = db.prepare("SELECT count(*) as count FROM applications WHERE status = 'Email sent'").get().count;
    const upcomingFollowUps = db.prepare("SELECT count(*) as count FROM follow_ups WHERE status = 'pending' AND due_date <= date('now', '+7 days')").get().count;

    // By city
    const byCity = db.prepare(`
      SELECT city, count(*) as count 
      FROM opportunities 
      GROUP BY city 
      ORDER BY count DESC
    `).all();

    // Pipeline stages
    const pipeline = db.prepare(`
      SELECT status, count(*) as count 
      FROM applications 
      GROUP BY status
    `).all();

    return {
      totalCompanies,
      worthContacting,
      totalOpportunities,
      dateMatches,
      draftsCount,
      sentCount,
      repliesCount,
      interviewsCount,
      rejectionsCount,
      awaitingResponse,
      upcomingFollowUps,
      byCity,
      pipeline
    };
  });

  // 2. Companies
  ipcMain.handle('db:getCompanies', async (event, filters = {}) => {
    let query = 'SELECT * FROM companies WHERE 1=1';
    const params = [];

    if (filters.city && filters.city !== 'All') {
      query += ' AND city LIKE ?';
      params.push(`%${filters.city}%`);
    }
    if (filters.priority && filters.priority !== 'All') {
      query += ' AND priority = ?';
      params.push(filters.priority);
    }
    if (filters.gamingOnly) {
      query += ' AND is_gaming = 1';
    }
    if (filters.search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR technologies LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY fit_score DESC, name ASC';
    const companies = db.prepare(query).all(...params);
    return companies.map(c => ({
      ...c,
      technologies: c.technologies ? JSON.parse(c.technologies) : [],
      departments: c.departments ? JSON.parse(c.departments) : [],
      products: c.products ? JSON.parse(c.products) : [],
      fit_reasons: c.fit_reasons ? JSON.parse(c.fit_reasons) : []
    }));
  });

  ipcMain.handle('db:getCompanyDetails', async (event, id) => {
    const comp = db.prepare('SELECT * FROM companies WHERE id = ?').get(id);
    if (!comp) return null;

    const contacts = db.prepare('SELECT * FROM contacts WHERE company_id = ?').all(id);
    const opportunities = db.prepare('SELECT * FROM opportunities WHERE company_id = ? ORDER BY is_official_vacancy DESC').all(id);
    const applications = db.prepare('SELECT * FROM applications WHERE company_id = ?').all(id);
    const messages = db.prepare('SELECT * FROM email_messages WHERE company_id = ? ORDER BY sent_at DESC').all(id);

    return {
      ...comp,
      technologies: comp.technologies ? JSON.parse(comp.technologies) : [],
      departments: comp.departments ? JSON.parse(comp.departments) : [],
      products: comp.products ? JSON.parse(comp.products) : [],
      fit_reasons: comp.fit_reasons ? JSON.parse(comp.fit_reasons) : [],
      contacts,
      opportunities: opportunities.map(o => ({
        ...o,
        required_technologies: o.required_technologies ? JSON.parse(o.required_technologies) : [],
        fit_breakdown: o.fit_breakdown ? JSON.parse(o.fit_breakdown) : []
      })),
      applications,
      messages
    };
  });

  ipcMain.handle('db:updateCompanyPriority', async (event, id, priority) => {
    db.prepare('UPDATE companies SET priority = ?, updated_at = datetime("now") WHERE id = ?').run(priority, id);
    return { success: true };
  });

  // 3. Opportunities
  ipcMain.handle('db:getOpportunities', async (event, filters = {}) => {
    let query = `
      SELECT o.*, c.name as company_name, c.website as company_website, c.is_gaming as company_is_gaming, c.priority as company_priority
      FROM opportunities o
      JOIN companies c ON o.company_id = c.id
      WHERE o.is_active = 1
    `;
    const params = [];

    if (filters.city && filters.city !== 'All') {
      query += ' AND o.city LIKE ?';
      params.push(`%${filters.city}%`);
    }
    if (filters.category && filters.category !== 'All') {
      query += ' AND o.category LIKE ?';
      params.push(`%${filters.category}%`);
    }
    if (filters.officialOnly) {
      query += ' AND o.is_official_vacancy = 1';
    }
    if (filters.speculativeOnly) {
      query += ' AND o.is_official_vacancy = 0';
    }
    if (filters.dateMatchOnly) {
      query += " AND (o.internship_start LIKE '%2027-02%' OR o.internship_start LIKE '%2027-03%')";
    }
    if (filters.search) {
      query += ' AND (o.title LIKE ? OR c.name LIKE ? OR o.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY o.fit_score DESC, o.created_at DESC';
    const rows = db.prepare(query).all(...params);
    return rows.map(r => ({
      ...r,
      required_technologies: r.required_technologies ? JSON.parse(r.required_technologies) : [],
      fit_breakdown: r.fit_breakdown ? JSON.parse(r.fit_breakdown) : []
    }));
  });

  // 4. Applications Tracker (CRM)
  ipcMain.handle('db:getApplications', async (event, filters = {}) => {
    let query = `
      SELECT a.*, c.name as company_name, c.website as company_website, c.priority as company_priority,
             ct.name as contact_name, ct.email as contact_email, ct.role as contact_role
      FROM applications a
      JOIN companies c ON a.company_id = c.id
      LEFT JOIN contacts ct ON a.contact_id = ct.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status && filters.status !== 'All') {
      query += ' AND a.status = ?';
      params.push(filters.status);
    }
    if (filters.search) {
      query += ' AND (c.name LIKE ? OR a.target_role LIKE ? OR a.city LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY a.last_activity_at DESC';
    return db.prepare(query).all(...params);
  });

  ipcMain.handle('db:updateApplicationStatus', async (event, id, status) => {
    db.prepare('UPDATE applications SET status = ?, last_activity_at = datetime("now") WHERE id = ?').run(status, id);
    // Audit log
    db.prepare('INSERT INTO audit_logs (id, action_type, entity_type, entity_id, details) VALUES (?, "status_change", "application", ?, ?)')
      .run('audit-' + Date.now(), id, JSON.stringify({ newStatus: status }));
    return { success: true };
  });

  ipcMain.handle('db:createApplication', async (event, data) => {
    const id = data.id || 'app-' + Date.now();
    db.prepare(`
      INSERT INTO applications (
        id, company_id, opportunity_id, contact_id, status, priority,
        target_role, city, notes, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.company_id, data.opportunity_id || null, data.contact_id || null,
      data.status || 'Ready to contact', data.priority || 'High',
      data.target_role, data.city, data.notes || '', data.source || 'Direct Discovery'
    );
    return { success: true, id };
  });

  // 5. User Profile & Skills
  ipcMain.handle('db:getUserProfile', async () => {
    const profile = db.prepare('SELECT * FROM user_profile LIMIT 1').get();
    if (!profile) return null;
    return {
      ...profile,
      preferred_cities: profile.preferred_cities ? JSON.parse(profile.preferred_cities) : [],
      preferred_roles: profile.preferred_roles ? JSON.parse(profile.preferred_roles) : [],
      languages_spoken: profile.languages_spoken ? JSON.parse(profile.languages_spoken) : []
    };
  });

  ipcMain.handle('db:updateUserProfile', async (event, p) => {
    db.prepare(`
      UPDATE user_profile SET
        full_name = ?, email = ?, phone = ?, university = ?, degree = ?,
        campus_city = ?, current_year = ?, internship_start_preferred = ?,
        internship_end_preferred = ?, preferred_duration_months = ?,
        preferred_cities = ?, preferred_roles = ?, bio = ?, portfolio_url = ?,
        github_url = ?, linkedin_url = ?, languages_spoken = ?, signature = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      p.full_name, p.email, p.phone, p.university, p.degree,
      p.campus_city, p.current_year, p.internship_start_preferred,
      p.internship_end_preferred, p.preferred_duration_months,
      JSON.stringify(p.preferred_cities || []), JSON.stringify(p.preferred_roles || []),
      p.bio, p.portfolio_url, p.github_url, p.linkedin_url,
      JSON.stringify(p.languages_spoken || []), p.signature, p.id || 'student-primary'
    );
    return { success: true };
  });

  ipcMain.handle('db:getSkills', async () => {
    return db.prepare('SELECT * FROM skills ORDER BY category, name').all();
  });

  ipcMain.handle('db:addSkill', async (event, s) => {
    const id = 'sk-' + Date.now();
    db.prepare('INSERT INTO skills (id, category, name, proficiency, is_highlighted) VALUES (?, ?, ?, ?, 1)')
      .run(id, s.category, s.name, s.proficiency || 'Intermediate');
    return { success: true, id };
  });

  ipcMain.handle('db:deleteSkill', async (event, id) => {
    db.prepare('DELETE FROM skills WHERE id = ?').run(id);
    return { success: true };
  });

  // 6. Email Drafts & Generator
  ipcMain.handle('db:getDrafts', async (event, status) => {
    let query = `
      SELECT d.*, c.name as company_name, c.city as company_city, c.opt_out
      FROM email_drafts d
      JOIN companies c ON d.company_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (status && status !== 'All') {
      query += ' AND d.status = ?';
      params.push(status);
    }
    query += ' ORDER BY d.created_at DESC';
    return db.prepare(query).all(...params);
  });

  ipcMain.handle('db:saveDraft', async (event, draft) => {
    const id = draft.id || 'draft-' + Date.now();
    const existing = db.prepare('SELECT id FROM email_drafts WHERE id = ?').get(id);

    if (existing) {
      db.prepare(`
        UPDATE email_drafts SET
          recipient_email = ?, recipient_name = ?, subject = ?, body_text = ?,
          template_type = ?, variant = ?, cv_document_id = ?, is_approved = ?,
          status = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(
        draft.recipient_email, draft.recipient_name, draft.subject, draft.body_text,
        draft.template_type, draft.variant || 'concise', draft.cv_document_id || null,
        draft.is_approved ? 1 : 0, draft.status || 'draft', id
      );
    } else {
      db.prepare(`
        INSERT INTO email_drafts (
          id, application_id, company_id, recipient_email, recipient_name, subject,
          body_text, template_type, variant, cv_document_id, is_approved, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, draft.application_id || null, draft.company_id, draft.recipient_email,
        draft.recipient_name, draft.subject, draft.body_text, draft.template_type,
        draft.variant || 'concise', draft.cv_document_id || null,
        draft.is_approved ? 1 : 0, draft.status || 'draft'
      );
    }
    return { success: true, id };
  });

  ipcMain.handle('db:deleteDraft', async (event, id) => {
    db.prepare('DELETE FROM email_drafts WHERE id = ?').run(id);
    return { success: true };
  });

  ipcMain.handle('ai:generateEmail', async (event, params) => {
    const profile = db.prepare('SELECT * FROM user_profile LIMIT 1').get();
    const skills = db.prepare('SELECT name FROM skills WHERE is_highlighted = 1').all().map(s => s.name);
    
    // Retrieve AI keys and provider if stored
    const openaiKeyRow = db.prepare("SELECT value FROM settings WHERE key = 'openai_api_key'").get();
    const geminiKeyRow = db.prepare("SELECT value FROM settings WHERE key = 'gemini_api_key'").get();
    const providerRow = db.prepare("SELECT value FROM settings WHERE key = 'ai_provider'").get();

    return await generateEmail({
      templateType: params.templateType,
      variant: params.variant || 'concise',
      profile: {
        ...profile,
        skillsList: skills.join(', ')
      },
      company: params.company,
      opportunity: params.opportunity,
      language: params.language || 'English',
      provider: providerRow?.value || 'builtin',
      apiKey: openaiKeyRow?.value || '',
      geminiKey: geminiKeyRow?.value || '',
      customInstructions: params.customInstructions
    });
  });

  // 7. Email Actions & Safety Controls
  ipcMain.handle('email:sendEmail', async (event, draftId) => {
    return await sendEmail({ db, draftId });
  });

  ipcMain.handle('email:batchSend', async (event, draftIds) => {
    const results = [];
    for (const id of draftIds) {
      try {
        const res = await sendEmail({ db, draftId: id });
        results.push({ draftId: id, success: true, message: res.message });
      } catch (err) {
        results.push({ draftId: id, success: false, error: err.message });
      }
    }
    return results;
  });

  ipcMain.handle('email:exportEml', async (event, draftId) => {
    const draft = db.prepare('SELECT * FROM email_drafts WHERE id = ?').get(draftId);
    if (!draft) throw new Error('Draft not found');

    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export Email Draft (.eml)',
      defaultPath: `${draft.subject.replace(/[^a-zA-Z0-9_-]/g, '_')}.eml`,
      filters: [{ name: 'Email Message', extensions: ['eml'] }]
    });

    if (filePath) {
      return exportDraftAsEml(draft, filePath);
    }
    return { cancelled: true };
  });

  ipcMain.handle('email:setGlobalPause', async (event, paused) => {
    const state = setGlobalPause(paused);
    db.prepare('INSERT INTO audit_logs (id, action_type, entity_type, entity_id, details) VALUES (?, "pause_toggle", "system", "email_queue", ?)')
      .run('audit-' + Date.now(), JSON.stringify({ paused: state }));
    return { isPaused: state };
  });

  ipcMain.handle('email:getGlobalPause', async () => {
    return { isPaused: getGlobalPauseState() };
  });

  ipcMain.handle('email:testConnection', async () => {
    return await testEmailConnection(db);
  });

  // 8. Search Engine
  ipcMain.handle('search:run', async (event, params) => {
    return await runCompanyAndInternshipSearch({
      db,
      city: params.city || 'All',
      category: params.category || 'All',
      includeSpeculative: params.includeSpeculative !== false,
      includeOfficial: params.includeOfficial !== false
    });
  });

  ipcMain.handle('search:getLastRun', async () => {
    const lastRun = db.prepare("SELECT * FROM search_runs WHERE status = 'completed' ORDER BY created_at DESC LIMIT 1").get();
    const intervalRow = db.prepare("SELECT value FROM settings WHERE key = 'auto_sync_interval_hours'").get();
    const enabledRow = db.prepare("SELECT value FROM settings WHERE key = 'auto_sync_enabled'").get();
    return {
      lastRun: lastRun || null,
      autoSyncEnabled: enabledRow ? enabledRow.value === 'true' : true,
      intervalHours: intervalRow ? parseFloat(intervalRow.value) || 12 : 12
    };
  });

  // 9. Follow-Ups
  ipcMain.handle('db:getFollowUps', async () => {
    return db.prepare(`
      SELECT f.*, a.target_role, a.city, c.name as company_name, c.opt_out,
             ct.email as contact_email
      FROM follow_ups f
      JOIN applications a ON f.application_id = a.id
      JOIN companies c ON a.company_id = c.id
      LEFT JOIN contacts ct ON a.contact_id = ct.id
      ORDER BY f.due_date ASC
    `).all();
  });

  ipcMain.handle('db:updateFollowUpStatus', async (event, id, status) => {
    db.prepare('UPDATE follow_ups SET status = ? WHERE id = ?').run(status, id);
    return { success: true };
  });

  // 10. Settings & Security
  ipcMain.handle('db:getSettings', async () => {
    const rows = db.prepare('SELECT * FROM settings').all();
    const result = {};
    for (const r of rows) {
      // Mask sensitive credentials for security
      if (r.key === 'openai_api_key' && r.value) {
        result[r.key] = r.value.slice(0, 6) + '...' + r.value.slice(-4);
      } else if (r.key === 'gemini_api_key' && r.value) {
        result[r.key] = r.value.slice(0, 6) + '...' + r.value.slice(-4);
      } else if (r.key === 'gmail_app_password' && r.value) {
        result[r.key] = '••••••••••••••••';
      } else {
        result[r.key] = r.value;
      }
    }
    return result;
  });

  ipcMain.handle('db:updateSetting', async (event, key, value) => {
    db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime("now"))')
      .run(key, value);
    return { success: true };
  });

  ipcMain.handle('db:getAuditLogs', async () => {
    return db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
  });

  // 11. Documents & CSV
  ipcMain.handle('files:getDocuments', async () => {
    return db.prepare('SELECT * FROM documents ORDER BY created_at DESC').all();
  });

  ipcMain.handle('files:uploadCv', async (event, { title, category }) => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Select PDF CV to Upload',
      filters: [{ name: 'PDF Documents', extensions: ['pdf'] }],
      properties: ['openFile']
    });

    if (filePaths && filePaths.length > 0) {
      const selected = filePaths[0];
      const stats = fs.statSync(selected);
      const id = 'doc-' + Date.now();

      // Copy file to persistent user documents directory
      const docsDir = path.join(app.getPath('userData'), 'documents');
      if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
      const destPath = path.join(docsDir, path.basename(selected));
      fs.copyFileSync(selected, destPath);

      db.prepare(`
        INSERT INTO documents (id, title, category, file_path, file_size, mime_type, is_default)
        VALUES (?, ?, ?, ?, ?, 'application/pdf', 1)
      `).run(id, title || path.basename(selected), category || 'general', destPath, stats.size);

      return { success: true, id, filePath: destPath };
    }
    return { cancelled: true };
  });

  ipcMain.handle('files:exportCsv', async (event, table) => {
    let rows = [];
    if (table === 'companies') {
      rows = db.prepare('SELECT id, name, city, website, industry, fit_score, priority FROM companies').all();
    } else if (table === 'opportunities') {
      rows = db.prepare(`
        SELECT o.id, c.name as company, o.title, o.city, o.category, o.internship_start, o.fit_score, o.source_name, o.source_url 
        FROM opportunities o JOIN companies c ON o.company_id = c.id
      `).all();
    } else {
      rows = db.prepare(`
        SELECT a.id, c.name as company, a.target_role, a.city, a.status, a.priority, a.date_contacted, a.next_follow_up_date 
        FROM applications a JOIN companies c ON a.company_id = c.id
      `).all();
    }

    if (rows.length === 0) return { error: 'No data to export' };

    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [headers, ...rows.map(r => Object.values(r).map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','))].join('\n');

    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: `Export ${table} as CSV`,
      defaultPath: `${table}_export_${Date.now()}.csv`,
      filters: [{ name: 'CSV File', extensions: ['csv'] }]
    });

    if (filePath) {
      fs.writeFileSync(filePath, csvContent, 'utf8');
      return { success: true, filePath };
    }
    return { cancelled: true };
  });

  ipcMain.handle('shell:openExternal', (event, url) => {
    shell.openExternal(url);
  });
}
