const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbs = [
  path.join(process.env.APPDATA, 'poland-internship-hunter', 'database', 'internship_hunter.sqlite'),
  path.join(process.env.APPDATA, 'Electron', 'database', 'internship_hunter.sqlite'),
  path.join(process.cwd(), 'data', 'internship_hunter.sqlite')
];

function cleanText(text) {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/\bMarch through June\/July 2027\b/gi, 'February through June 2027')
    .replace(/\bMarch to June\/July 2027\b/gi, 'February to June 2027')
    .replace(/\bMarch through June\/July\b/gi, 'February through June')
    .replace(/\bMarch to June\/July\b/gi, 'February to June')
    .replace(/\bMarch 1, 2027\b/gi, 'February 1, 2027')
    .replace(/\bMarch 2027\b/gi, 'February 2027')
    .replace(/\bstarting in March\b/gi, 'starting in February')
    .replace(/\bfrom March\b/gi, 'from February')
    .replace(/\bmarço de 2027 até junho\/julho de 2027\b/gi, 'fevereiro de 2027 até junho de 2027')
    .replace(/\bmarço de 2027\b/gi, 'fevereiro de 2027')
    // Clean URLs
    .replace(/https:\/\/cinelog-phi\.vercel\.app\/?[^\s\n•)]*/g, 'https://cinelog-phi.vercel.app')
    .replace(/https:\/\/retirointerior\.netlify\.app\/?[^\s\n•)]*/g, 'https://retirointerior.netlify.app')
    .replace(/https:\/\/stocksvault\.netlify\.app\/?[^\s\n•)]*/g, 'https://stocksvault.netlify.app')
    .replace(/https:\/\/acrialbi\.netlify\.app\/?[^\s\n•)]*/g, 'https://acrialbi.netlify.app');
}

const cleanSignature = `Kind regards,
Fábio Júnior Fernandes Silva
Web Multimedia Development | IPCA
Email: fabioz262006@gmail.com | Phone: +351 930 534 067
Live Projects:
• CineLog (PWA): https://cinelog-phi.vercel.app
• Poland Internship Hunter (Desktop App): https://github.com/FabioSilva32/poland-internship-hunter
• Retiro Interior: https://retirointerior.netlify.app
• StocksVault: https://stocksvault.netlify.app
• ACRIALBI: https://acrialbi.netlify.app
GitHub: https://github.com/FabioSilva32`;

for (const p of dbs) {
  if (!fs.existsSync(p)) continue;
  console.log('Cleaning database:', p);
  const db = new DatabaseSync(p);

  try {
    // 1. Update user_profile
    db.prepare(`
      UPDATE user_profile 
      SET portfolio_url = 'https://cinelog-phi.vercel.app',
          signature = ?,
          internship_start_preferred = '2027-02-01',
          internship_end_preferred = '2027-06-30'
      WHERE id = 'student-primary'
    `).run(cleanSignature);
    console.log('  user_profile updated.');
  } catch (e) {
    console.warn('  user_profile error:', e.message);
  }

  try {
    // 2. Clean email_drafts
    const drafts = db.prepare('SELECT id, subject, body_text FROM email_drafts').all();
    for (const d of drafts) {
      const newSubject = cleanText(d.subject);
      const newBody = cleanText(d.body_text);
      db.prepare('UPDATE email_drafts SET subject = ?, body_text = ? WHERE id = ?').run(newSubject, newBody, d.id);
    }
    console.log(`  ${drafts.length} email_drafts cleaned.`);
  } catch (e) {
    console.warn('  email_drafts error:', e.message);
  }

  try {
    // 3. Clean email_messages
    const msgs = db.prepare('SELECT id, subject, full_body FROM email_messages').all();
    for (const m of msgs) {
      const newSubject = cleanText(m.subject);
      const newBody = cleanText(m.full_body);
      db.prepare('UPDATE email_messages SET subject = ?, full_body = ? WHERE id = ?').run(newSubject, newBody, m.id);
    }
    console.log(`  ${msgs.length} email_messages cleaned.`);
  } catch (e) {
    console.warn('  email_messages error:', e.message);
  }
}

console.log('Database cleanup completed successfully.');
