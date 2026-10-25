const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const cleanSig = `Kind regards,
Fábio Júnior Fernandes Silva
Web Multimedia Development | IPCA
Email: fabioz262006@gmail.com | Phone: +351 930 534 067
GitHub: https://github.com/FabioSilva32`;

const dbPaths = [
  path.join(process.env.APPDATA, 'poland-internship-hunter', 'database', 'internship_hunter.sqlite'),
  path.join(process.env.APPDATA, 'Electron', 'database', 'internship_hunter.sqlite'),
  path.join(__dirname, '..', 'data', 'internship_hunter.sqlite')
];

function calculateBusinessDaysFrom(baseDateStr, daysToAdd) {
  let date = baseDateStr ? new Date(baseDateStr) : new Date();
  if (isNaN(date.getTime())) date = new Date();
  let added = 0;
  while (added < daysToAdd) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++;
    }
  }
  return date.toISOString().slice(0, 10);
}

async function run() {
  const SQL = await initSqlJs();

  for (const dbPath of dbPaths) {
    if (!fs.existsSync(dbPath)) {
      console.log('Skipping (not found):', dbPath);
      continue;
    }
    console.log('\n--- Processing:', dbPath);
    const filebuffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(filebuffer);

    // 1. Update user_profile signature
    db.run("UPDATE user_profile SET signature = ?, updated_at = datetime('now')", [cleanSig]);
    console.log('✓ Cleaned user_profile signature (removed duplicate Live Projects section)');

    // 2. Find all sent messages
    const stmt = db.prepare("SELECT id, company_id, to_address, sent_at FROM email_messages WHERE direction = 'outgoing' ORDER BY sent_at ASC");
    const msgs = [];
    while (stmt.step()) {
      msgs.push(stmt.getAsObject());
    }
    stmt.free();

    console.log(`Found ${msgs.length} outgoing sent messages.`);

    for (const msg of msgs) {
      if (!msg.company_id) continue;

      // Check if application already exists for this company
      const checkStmt = db.prepare("SELECT id, status FROM applications WHERE company_id = ?");
      checkStmt.bind([msg.company_id]);
      let appId = null;
      if (checkStmt.step()) {
        appId = checkStmt.getAsObject().id;
      }
      checkStmt.free();

      const dueDate = calculateBusinessDaysFrom(msg.sent_at, 7);

      if (!appId) {
        // Find company city
        const compStmt = db.prepare("SELECT city, name FROM companies WHERE id = ?");
        compStmt.bind([msg.company_id]);
        let compCity = 'Poland';
        if (compStmt.step()) {
          compCity = compStmt.getAsObject().city || 'Poland';
        }
        compStmt.free();

        appId = 'app-' + msg.company_id.replace('comp-', '');
        db.run(`
          INSERT INTO applications (
            id, company_id, status, priority, target_role, city, date_contacted, next_follow_up_date, source, created_at, last_activity_at
          ) VALUES (?, ?, 'Email sent', 'High', 'Web & Multimedia Development Intern', ?, ?, ?, 'Direct Email Outreach', ?, ?)
        `, [appId, msg.company_id, compCity, msg.sent_at || new Date().toISOString(), dueDate, msg.sent_at || new Date().toISOString(), msg.sent_at || new Date().toISOString()]);
        console.log(`✓ Created application record for ${msg.company_id} (${appId}) -> 'Email sent'`);
      } else {
        // Ensure status is 'Email sent' and dates are populated
        db.run(`
          UPDATE applications 
          SET status = 'Email sent', date_contacted = COALESCE(date_contacted, ?), next_follow_up_date = ?, last_activity_at = datetime('now')
          WHERE id = ?
        `, [msg.sent_at || new Date().toISOString(), dueDate, appId]);
        console.log(`✓ Updated existing application ${appId} -> 'Email sent'`);
      }

      // Link email_messages
      db.run("UPDATE email_messages SET application_id = ? WHERE id = ?", [appId, msg.id]);

      // Link corresponding email_drafts
      db.run("UPDATE email_drafts SET application_id = ? WHERE company_id = ?", [appId, msg.company_id]);

      // Create follow-up record if not exists
      const fuCheck = db.prepare("SELECT id FROM follow_ups WHERE application_id = ? AND follow_up_number = 1");
      fuCheck.bind([appId]);
      let hasFu = fuCheck.step();
      fuCheck.free();

      if (!hasFu) {
        const fuId = 'fu-' + msg.company_id.replace('comp-', '') + '-1';
        db.run(`
          INSERT INTO follow_ups (id, application_id, follow_up_number, due_date, status, rule_trigger, created_at)
          VALUES (?, ?, 1, ?, 'pending', '7_business_days_initial', datetime('now'))
        `, [fuId, appId, dueDate]);
        console.log(`✓ Scheduled follow-up for ${appId} due on ${dueDate}`);
      }
    }

    // Verify applications count
    const countStmt = db.prepare("SELECT count(*) as count FROM applications WHERE status = 'Email sent'");
    let count = 0;
    if (countStmt.step()) count = countStmt.getAsObject().count;
    countStmt.free();
    console.log(`Total applications in 'Email sent': ${count}`);

    // Save back to disk
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
    console.log('✓ Saved database successfully:', dbPath);
  }
}

run().catch(err => {
  console.error('Error running update:', err);
  process.exit(1);
});
