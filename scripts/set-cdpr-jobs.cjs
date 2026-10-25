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
  const db = new DatabaseSync(p);
  db.prepare(`
    UPDATE contacts 
    SET email = 'jobs@cdprojektred.com', 
        name = 'CD PROJEKT RED Recruitment',
        role = 'Job Offers & Talent Acquisition',
        notes = 'Official Job Offers inbox from cdprojektred.com/contact'
    WHERE company_id = 'comp-cdpr'
  `).run();
  console.log('Updated CDPR to jobs@cdprojektred.com in', p);
}
