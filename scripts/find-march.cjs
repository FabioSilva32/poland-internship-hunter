const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbs = [
  path.join(process.env.APPDATA, 'poland-internship-hunter', 'database', 'internship_hunter.sqlite'),
  path.join(process.env.APPDATA, 'Electron', 'database', 'internship_hunter.sqlite'),
  path.join(process.cwd(), 'data', 'internship_hunter.sqlite')
];

for (const p of dbs) {
  if (fs.existsSync(p)) {
    console.log('=== Checking DB:', p);
    const db = new DatabaseSync(p);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    for (const t of tables) {
      try {
        const rows = db.prepare('SELECT * FROM ' + t.name).all();
        for (const r of rows) {
          const s = JSON.stringify(r);
          if (s.includes('March') || s.includes('march') || s.includes('June/July')) {
            console.log('MATCH IN', p, 'TABLE:', t.name, 'id:', r.id);
            console.log(s);
          }
        }
      } catch (e) {}
    }
  }
}
