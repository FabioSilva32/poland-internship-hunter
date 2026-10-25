const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbs = [
  path.join(process.env.APPDATA, 'poland-internship-hunter', 'database', 'internship_hunter.sqlite'),
  path.join(process.env.APPDATA, 'Electron', 'database', 'internship_hunter.sqlite'),
  path.join(process.cwd(), 'data', 'internship_hunter.sqlite')
];

for (const p of dbs) {
  if (!fs.existsSync(p)) continue;
  console.log('Resetting CRM in DB:', p);
  const db = new DatabaseSync(p);

  try {
    // 1. Delete all dummy seeded applications
    const deletedApps = db.prepare('DELETE FROM applications').run();
    console.log('  Deleted applications from CRM.');

    // 2. Delete test approved/queued drafts so queue is 0
    db.prepare("DELETE FROM email_drafts WHERE status = 'approved' OR status = 'draft'").run();
    console.log('  Cleared pending/test drafts from queue.');

    // 3. Clear any orphaned follow-ups
    try {
      db.prepare('DELETE FROM follow_ups').run();
      console.log('  Cleared follow_ups.');
    } catch (e) {}

  } catch (err) {
    console.warn('  Error resetting CRM:', err.message);
  }
}

console.log('Application CRM reset complete.');
