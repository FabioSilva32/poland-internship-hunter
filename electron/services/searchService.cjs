const { calculateFitScore } = require('./fitScoreService.cjs');

// Verified Greenhouse Polish engineering boards
const GREENHOUSE_BOARDS = [
  { token: 'allegro', company: 'Allegro', city: 'Warsaw', defaultTech: ['React', 'TypeScript', 'Java'] },
  { token: 'snowflake', company: 'Snowflake Poland', city: 'Warsaw', defaultTech: ['TypeScript', 'React', 'C++', 'Python'] },
  { token: 'docplanner', company: 'Docplanner', city: 'Warsaw', defaultTech: ['PHP', 'React', 'TypeScript'] },
];

// Verified Lever Polish engineering boards
const LEVER_BOARDS = [
  { token: 'netguru', company: 'Netguru', city: 'Gdańsk', defaultTech: ['React', 'TypeScript', 'Figma', 'UI/UX'] },
  { token: 'spyrosoft', company: 'Spyrosoft', city: 'Kraków', defaultTech: ['C++', 'React', 'QA', 'Embedded'] },
];

// Verified Ashby Polish engineering boards
const ASHBY_BOARDS = [
  { token: 'brainly', company: 'Brainly', city: 'Kraków', defaultTech: ['React', 'TypeScript', 'GraphQL', 'Python'] },
];

async function runCompanyAndInternshipSearch({
  db,
  city = 'All',
  category = 'All',
  includeSpeculative = true,
  includeOfficial = true
}) {
  const profileRow = db.prepare('SELECT * FROM user_profile LIMIT 1').get();
  const searchRunId = 'run-' + Date.now();
  let totalDiscovered = 0;
  let newCompanies = 0;

  console.log(`[Search] Starting search run ${searchRunId} (City: ${city}, Category: ${category})...`);

  // Record search run start
  db.prepare(`
    INSERT INTO search_runs (id, provider_name, query_params, opportunities_found, new_companies_found, status)
    VALUES (?, 'multi_provider_hub', ?, 0, 0, 'running')
  `).run(searchRunId, JSON.stringify({ city, category, includeSpeculative, includeOfficial }));

  // 1. Fetch live jobs from public Greenhouse boards where permitted
  for (const board of GREENHOUSE_BOARDS) {
    if (city !== 'All' && !board.city.toLowerCase().includes(city.toLowerCase())) continue;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${board.token}/jobs`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const jobs = data.jobs || [];

        for (const job of jobs) {
          const title = (job.title || '').toLowerCase();
          const isInternOrJunior = title.includes('intern') || title.includes('trainee') || title.includes('junior') || title.includes('staz') || title.includes('praktyk') || title.includes('graduate');
          const isRelevantCategory = isInternOrJunior && (
            title.includes('software') || title.includes('engineer') || title.includes('frontend') ||
            title.includes('web') || title.includes('ui') || title.includes('ux') ||
            title.includes('qa') || title.includes('test') || title.includes('developer')
          );

          if (isRelevantCategory || isInternOrJunior) {
            // Find or create company
            let comp = db.prepare('SELECT id FROM companies WHERE name = ?').get(board.company);
            if (!comp) {
              const compId = 'comp-' + board.token;
              db.prepare(`
                INSERT INTO companies (id, name, city, website, careers_url, industry, fit_score, priority)
                VALUES (?, ?, ?, ?, ?, 'Software & Technology', 85, 'High')
              `).run(compId, board.company, board.city, `https://${board.token}.com`, job.absolute_url);
              comp = { id: compId };
              newCompanies++;
            }

            // Deduplication check: check if opportunity already exists
            const existingOpp = db.prepare('SELECT id FROM opportunities WHERE source_url = ? OR (company_id = ? AND title = ?)').get(job.absolute_url, comp.id, job.title);
            if (!existingOpp) {
              const oppId = 'opp-gh-' + job.id;
              const fit = calculateFitScore(profileRow || {}, {
                city: board.city,
                category: 'Software / Web Development',
                technologies: board.defaultTech,
                internship_start: '2027-03-01'
              });

              db.prepare(`
                INSERT INTO opportunities (
                  id, company_id, title, description, city, country, category,
                  work_arrangement, is_official_vacancy, required_technologies,
                  internship_start, internship_end, duration_months, language_requirements,
                  source_name, source_url, fit_score, fit_breakdown
                ) VALUES (?, ?, ?, ?, ?, 'Poland', 'Web & Software Engineering', 'Hybrid', 1, ?, '2027-03-01', '2027-06-30', 4, 'English', 'Greenhouse Job Board', ?, ?, ?)
              `).run(
                oppId, comp.id, job.title, `Live vacancy from official Greenhouse job board: ${job.title}`,
                board.city, JSON.stringify(board.defaultTech), job.absolute_url, fit.fitScore, JSON.stringify(fit.breakdown)
              );
              totalDiscovered++;
            }
          }
        }
      }
    } catch (err) {
      console.warn(`[Search] Greenhouse query for ${board.token} skipped or timed out:`, err.message);
    }
  }

  // 2. Refresh fit scores of all companies and opportunities based on active user profile
  const allOpps = db.prepare(`
    SELECT o.*, c.name as company_name, c.is_gaming 
    FROM opportunities o 
    JOIN companies c ON o.company_id = c.id
  `).all();

  for (const op of allOpps) {
    const fit = calculateFitScore(profileRow || {}, {
      city: op.city,
      category: op.category,
      is_gaming: op.is_gaming,
      technologies: op.required_technologies ? JSON.parse(op.required_technologies) : [],
      internship_start: op.internship_start,
      language_requirements: op.language_requirements
    });

    db.prepare('UPDATE opportunities SET fit_score = ?, fit_breakdown = ? WHERE id = ?').run(
      fit.fitScore, JSON.stringify(fit.breakdown), op.id
    );
  }

  // Update search run status
  db.prepare(`
    UPDATE search_runs 
    SET opportunities_found = ?, new_companies_found = ?, status = 'completed'
    WHERE id = ?
  `).run(totalDiscovered, newCompanies, searchRunId);

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (id, action_type, entity_type, entity_id, details)
    VALUES (?, 'search', 'search_run', ?, ?)
  `).run('audit-' + Date.now(), searchRunId, JSON.stringify({ city, category, newDiscovered: totalDiscovered }));

  return {
    success: true,
    runId: searchRunId,
    newOpportunities: totalDiscovered,
    newCompanies
  };
}

module.exports = {
  runCompanyAndInternshipSearch
};
