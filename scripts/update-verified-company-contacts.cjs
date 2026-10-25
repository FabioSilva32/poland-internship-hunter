const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbs = [
  path.join(process.env.APPDATA, 'poland-internship-hunter', 'database', 'internship_hunter.sqlite'),
  path.join(process.env.APPDATA, 'Electron', 'database', 'internship_hunter.sqlite'),
  path.join(process.cwd(), 'data', 'internship_hunter.sqlite')
];

const verifiedContacts = [
  { company_id: 'comp-cdpr', name: 'CDPR Development & Web Team', role: 'Engineering & Web Recruitment Desk', email: 'dev@cdprojektred.com', notes: 'Direct inbox for software, programming, and web candidates. QA candidates can use testers@cdprojektred.com or corporate contact@cdprojekt.com.' },
  { company_id: 'comp-bloober', name: 'Bloober Team HR & Office', role: 'Studio Office & Recruitment', email: 'biuro@blooberteam.com', notes: 'Verified general office inbox. Direct applications also via https://blooberteam.recruitee.com.' },
  { company_id: 'comp-apptension', name: 'Apptension Creative Tech Team', role: 'Operations & Talent Desk', email: 'contact@apptension.com', notes: 'Verified direct inbox for studio and talent inquiries. (Note: career@ bounced; contact@ is active).' },
  { company_id: 'comp-11bit', name: '11 bit studios Recruitment', role: 'HR & Talent Acquisition Desk', email: 'jobs@11bitstudios.com', notes: 'Verified jobs email for candidate applications and student inquiries. Also info@11bitstudios.com.' },
  { company_id: 'comp-flyingwildhog', name: 'Flying Wild Hog Recruitment', role: 'Talent Acquisition Team', email: 'contact@flyingwildhog.com', notes: 'Verified direct studio inbox for candidate applications across Warsaw, Cracow, and Rzeszów.' },
  { company_id: 'comp-peoplecanfly', name: 'People Can Fly Talent Team', role: 'Studio Operations & HR Desk', email: 'office@peoplecanfly.com', notes: 'Verified main office inbox for studio inquiries and talent outreach.' },
  { company_id: 'comp-techland', name: 'Techland Recruitment Desk', role: 'Talent Acquisition & Office', email: 'contact@techland.net', notes: 'Direct contact for Techland offices. Also apply via https://techland.net/job-offers.' },
  { company_id: 'comp-creepyjar', name: 'Creepy Jar Recruitment', role: 'Studio Operations & Hiring', email: 'office@creepyjar.com', notes: 'Verified studio inbox in Warsaw. Applications also via https://creepyjar.teamtailor.com.' },
  { company_id: 'comp-theastronauts', name: 'The Astronauts Team', role: 'Studio Core Team', email: 'contact@theastronauts.com', notes: 'Verified studio contact inbox in Warsaw for Witcher/Witchfire creators.' },
  { company_id: 'comp-cigames', name: 'CI Games Recruitment', role: 'Talent & HR Team', email: 'info@cigames.com', notes: 'Verified general & talent inbox. Also applies via https://cigames.teamtailor.com.' },
  { company_id: 'comp-starward', name: 'Starward Industries Team', role: 'Studio & Recruitment Desk', email: 'info@starward.industries', notes: 'Verified domain is .industries (not .com). Kraków studio.' },
  { company_id: 'comp-miquido', name: 'Miquido Talent Team', role: 'People & Culture Desk', email: 'hello@miquido.com', notes: 'Verified primary inbox for talent and company outreach in Kraków.' },
  { company_id: 'comp-codete', name: 'Codete Recruitment', role: 'Talent Acquisition Desk', email: 'codete@jobs.workablemail.com', notes: 'Direct Workable talent pipeline inbox. Alternatively office@codete.com.' },
  { company_id: 'comp-10clouds', name: '10Clouds Talent Team', role: 'People & Culture Desk', email: 'hello@10clouds.com', notes: 'Verified direct email. Also 10clouds@jobs.workablemail.com for Workable applicant pool.' },
  { company_id: 'comp-monterail', name: 'Monterail Talent Team', role: 'People & Culture Desk', email: 'hello@monterail.com', notes: 'Verified company and talent inbox in Wrocław.' },
  { company_id: 'comp-railwaymen', name: 'Railwaymen Recruitment', role: 'Talent & Management Desk', email: 'info@railwaymen.org', notes: 'Verified Kraków software house inbox for speculative applications.' },
  { company_id: 'comp-spyrosoft', name: 'Spyrosoft Talent Team', role: 'Talent Acquisition Desk', email: 'office@spyro-soft.com', notes: 'Verified headquarters inbox in Wrocław.' },
  { company_id: 'comp-brainly', name: 'Brainly Recruitment Desk', role: 'People Operations', email: 'contact@brainly.com', notes: 'Verified corporate inbox in Kraków. Portal at https://careers.brainly.com.' },
  { company_id: 'comp-allegro', name: 'Allegro Talent Acquisition', role: 'Campus & Early Career Hiring', email: 'praca@allegro.pl', notes: 'Official praca inbox for Allegro Poland. Official portal at https://jobs.allegro.eu.' },
  { company_id: 'comp-netguru', name: 'Netguru People Team', role: 'Talent Operations Desk', email: 'hello@netguru.com', notes: 'Verified general outreach inbox in Poznań. Portal at https://www.netguru.com/career.' },
  { company_id: 'comp-softwaremind', name: 'Software Mind Recruitment', role: 'Talent Acquisition Desk', email: 'contact@softwaremind.com', notes: 'Verified contact inbox in Kraków.' },
  { company_id: 'comp-docplanner', name: 'Docplanner People Experience', role: 'Global Talent Team', email: 'contact@docplanner.com', notes: 'Verified contact inbox in Warsaw. Portal at https://www.docplanner.com/career.' }
];

for (const p of dbs) {
  if (!fs.existsSync(p)) continue;
  console.log('Updating contacts in DB:', p);
  const db = new DatabaseSync(p);

  for (const c of verifiedContacts) {
    const existing = db.prepare('SELECT id FROM contacts WHERE company_id = ?').all(c.company_id);
    if (existing && existing.length > 0) {
      db.prepare(`
        UPDATE contacts 
        SET name = ?, role = ?, email = ?, notes = ?, is_verified = 1
        WHERE id = ?
      `).run(c.name, c.role, c.email, c.notes, existing[0].id);
    } else {
      const id = 'cnt-' + c.company_id.replace('comp-', '');
      db.prepare(`
        INSERT INTO contacts (id, company_id, name, role, email, source_type, is_verified, notes)
        VALUES (?, ?, ?, ?, ?, 'verified_website', 1, ?)
      `).run(id, c.company_id, c.name, c.role, c.email, c.notes);
    }
  }
  console.log(`  Updated ${verifiedContacts.length} verified contacts.`);
}

console.log('All contacts updated with verified real email addresses.');
