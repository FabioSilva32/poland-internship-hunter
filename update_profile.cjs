const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

async function updateProfile() {
  const dbPath = path.join(process.env.APPDATA, 'poland-internship-hunter', 'database', 'internship_hunter.sqlite');
  console.log('Updating SQLite at:', dbPath);

  if (!fs.existsSync(dbPath)) {
    console.error('Database file does not exist at:', dbPath);
    return;
  }

  const SQL = await initSqlJs();
  const fileBuffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(fileBuffer);

  const sig = `Kind regards,
Fábio Júnior Fernandes Silva
Web Multimedia Development | IPCA
Email: fabioz262006@gmail.com | Phone: +351 930 534 067
Live Projects:
• CineLog: https://cinelog-phi.vercel.app/?tab=explore
• Retiro Interior: https://retirointerior.netlify.app/#conceito
• ACRIALBI: https://acrialbi.netlify.app/#ideias
GitHub: https://github.com/FabioSilva32`;

  db.run(`
    UPDATE user_profile SET
      full_name = 'Fábio Júnior Fernandes Silva',
      email = 'fabioz262006@gmail.com',
      phone = '+351 930 534 067',
      portfolio_url = 'https://cinelog-phi.vercel.app/?tab=explore',
      github_url = 'https://github.com/FabioSilva32',
      internship_start_preferred = '2027-02-01',
      internship_end_preferred = '2027-06-30',
      preferred_duration_months = 4,
      signature = ?,
      updated_at = datetime('now')
    WHERE id = 'student-primary'
  `, [sig]);

  // Also update email_accounts default email if present
  db.run(`UPDATE email_accounts SET email_address = 'fabioz262006@gmail.com' WHERE 1=1`);

  // Update default settings preferred dates if needed
  db.run(`UPDATE settings SET value = '2027-02-01' WHERE key = 'internship_start_preferred'`);

  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
  console.log('Successfully updated profile in SQLite database!');

  const row = db.prepare('SELECT full_name, email, phone, internship_start_preferred, internship_end_preferred, preferred_duration_months FROM user_profile').getAsObject();
  console.log('Current DB state:', JSON.stringify(row, null, 2));
}

updateProfile().catch(console.error);
