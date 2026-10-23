// Fit score calculator (0-100) based on student profile and target company/opportunity
function calculateFitScore(profile, target) {
  // target can be a company or an opportunity with associated company details
  const breakdown = [];
  let totalScore = 0;

  // 1. Degree & Academic Relevance (Max 25 pts)
  // Student degree: Desenvolvimento Web Multimédia at IPCA (Web dev, Frontend, UI/UX, Multimedia)
  let degreeScore = 0;
  const techStr = (JSON.stringify(target.technologies || []) + ' ' + (target.description || '') + ' ' + (target.category || '')).toLowerCase();
  
  if (techStr.includes('react') || techStr.includes('frontend') || techStr.includes('web') || techStr.includes('typescript') || techStr.includes('javascript')) {
    degreeScore += 15;
  }
  if (techStr.includes('ui') || techStr.includes('ux') || techStr.includes('design') || techStr.includes('figma') || techStr.includes('multimedia')) {
    degreeScore += 7;
  }
  if (techStr.includes('c#') || techStr.includes('unity') || techStr.includes('unreal') || techStr.includes('qa') || techStr.includes('testing')) {
    degreeScore += 3;
  }
  degreeScore = Math.min(25, Math.max(10, degreeScore));
  breakdown.push({
    factor: 'Degree Relevance (Web Multimedia)',
    score: degreeScore,
    max: 25,
    reason: degreeScore >= 20 ? 'Strong overlap with IPCA Web Multimedia curriculum (Frontend, UI/UX, and Interactive Media)' : 'Good partial overlap with programming and software concepts'
  });
  totalScore += degreeScore;

  // 2. Preferred Areas & Gaming Alignment (Max 25 pts)
  // Preferences: 1. Software Dev 2. Web/Frontend 3. UI/UX 4. Multimedia & Game QA / Tech
  let areaScore = 0;
  const isGaming = target.is_gaming || techStr.includes('game') || techStr.includes('unreal') || techStr.includes('unity') || techStr.includes('qa');
  if (techStr.includes('software') || techStr.includes('fullstack') || techStr.includes('developer') || techStr.includes('engineering')) {
    areaScore += 14;
  }
  if (isGaming) {
    areaScore += 11;
  } else if (techStr.includes('frontend') || techStr.includes('ui/ux')) {
    areaScore += 9;
  }
  areaScore = Math.min(25, Math.max(12, areaScore));
  breakdown.push({
    factor: 'Target Role & Industry Match',
    score: areaScore,
    max: 25,
    reason: isGaming ? 'High alignment with video game tech and software testing interests' : 'Strong alignment with primary software/web development focus'
  });
  totalScore += areaScore;

  // 3. Location Preference (Max 20 pts)
  // Preferred: Kraków (#1), Warsaw (#2), Gdańsk (#3)
  const city = (target.city || '').toLowerCase();
  let locationScore = 12;
  let locReason = 'Located in Poland';
  if (city.includes('kraków') || city.includes('krakow')) {
    locationScore = 20;
    locReason = 'Top preferred location (Kraków tech & gaming ecosystem)';
  } else if (city.includes('warsaw') || city.includes('warszawa')) {
    locationScore = 19;
    locReason = 'Primary hub (Warsaw capital tech scene)';
  } else if (city.includes('gdańsk') || city.includes('gdansk') || city.includes('tricity')) {
    locationScore = 18;
    locReason = 'Preferred coastal tech hub (Gdańsk / Tricity)';
  } else if (city.includes('wrocław') || city.includes('poznan') || city.includes('katowice')) {
    locationScore = 15;
    locReason = 'Major Polish secondary tech city';
  }
  breakdown.push({
    factor: 'Location Preference',
    score: locationScore,
    max: 20,
    reason: locReason
  });
  totalScore += locationScore;

  // 4. Internship Dates & Period Compatibility (Max 15 pts)
  // Target: Feb/Mar 2027 to Jun/Jul 2027 (~4 months)
  let dateScore = 14;
  let dateReason = 'Spring/Summer semester matches European university schedule';
  if (target.internship_start) {
    if (target.internship_start.includes('2027-02') || target.internship_start.includes('2027-03')) {
      dateScore = 15;
      dateReason = 'Directly matches requested February 2027 start date (Feb–Jun 4 months)';
    } else {
      dateScore = 11;
      dateReason = 'Flexible dates; timing requires coordination';
    }
  }
  breakdown.push({
    factor: 'Internship Dates & Duration',
    score: dateScore,
    max: 15,
    reason: dateReason
  });
  totalScore += dateScore;

  // 5. Language & International Compatibility (Max 15 pts)
  let langScore = 13;
  let langReason = 'English accepted as primary working language';
  const langReq = (target.language_requirements || '').toLowerCase();
  if (langReq.includes('polish required') || langReq.includes('wymagany polski')) {
    langScore = 6;
    langReason = 'Notice: Polish language proficiency mentioned';
  } else if (langReq.includes('english') || target.is_gaming || target.industry?.includes('Global') || target.industry?.includes('International')) {
    langScore = 15;
    langReason = 'Fluent English environment with international teams';
  }
  breakdown.push({
    factor: 'Language Compatibility',
    score: langScore,
    max: 15,
    reason: langReason
  });
  totalScore += langScore;

  // Normalize final score between 0 and 100
  const finalScore = Math.min(100, Math.max(20, totalScore));
  let priority = 'Medium';
  if (finalScore >= 88) priority = 'High';
  else if (finalScore < 65) priority = 'Low';

  return {
    fitScore: finalScore,
    priority,
    breakdown,
  };
}

module.exports = { calculateFitScore };
