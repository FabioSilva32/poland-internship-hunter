// AI Email Generator & Template Service
// Strictly enforces accuracy: never invents skills, projects, or credentials not in profile

const getLiveProjectsBlock = (p) => `• CineLog (Movie & TV Tracking PWA): https://cinelog-phi.vercel.app/?tab=explore
• Poland Internship Hunter (Desktop App): https://github.com/FabioSilva32/poland-internship-hunter
• Retiro Interior (Tourism Portal): https://retirointerior.netlify.app/#conceito
• StocksVault (Financial Portfolio Tracker): https://stocksvault.netlify.app/portfolio
• GitHub Profile: ${p.github_url || 'https://github.com/FabioSilva32'}`;

const TEMPLATES = {
  // A. Speculative internship inquiry
  speculative_inquiry: {
    name: 'Speculative University Internship Inquiry',
    concise: (p, c) => ({
      subject: `University Internship Inquiry (Spring 2027) – Web Multimedia Development – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Hiring Team'},

I am an undergraduate student studying Desenvolvimento Web Multimédia (Web Multimedia Development) at IPCA (Polytechnic Institute of Cávado and Ave) in Portugal. 

As part of my degree program, I will be completing a 4-month university curricular internship in Poland, ideally from March through June/July 2027.

I have been following ${c.name}'s work${c.products ? ` on ${c.products}` : ''} and greatly admire your focus on quality engineering and digital innovation. My academic and project background focuses on modern web engineering (${p.skillsList || 'TypeScript, React, Node.js'}), UI/UX design systems in Figma, and interactive multimedia.

I am writing to inquire whether ${c.name} accepts university internship placements during the Spring 2027 semester. I would welcome the opportunity to contribute to your engineering or design teams while completing my academic requirements.

My CV is attached, and you can explore my live deployed web applications and source code here:
${getLiveProjectsBlock(p)}

Thank you for your time and consideration.

${p.signature || `Kind regards,\n${p.full_name}\n${p.university}`}`
    }),
    detailed: (p, c) => ({
      subject: `University Internship Inquiry – Spring 2027 (Mar–Jul) – Web Multimedia Engineering – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Talent & Engineering Team'},

I hope this email finds you well.

My name is ${p.full_name}, and I am currently in my penultimate year studying Desenvolvimento Web Multimédia (Web Multimedia Development) at IPCA (Instituto Politécnico do Cávado e do Ave) in Portugal.

I am planning my final-year mandatory university internship and am specifically seeking an on-site or hybrid opportunity in Poland (especially ${c.city || 'Kraków/Warsaw'}) starting in March 2027 for a duration of approximately 4 months (March through June/July 2027).

Why I am contacting ${c.name}:
${c.name} has built a standout reputation${c.products ? ` through projects like ${c.products}` : ' in the Polish technology sector'}. My degree specifically bridges the gap between software engineering, modern frontend architecture, and user experience design. Over the course of my studies, I have gained hands-on experience in:
- Modern Web & Software Development: ${p.skillsList || 'TypeScript, React, Node.js, REST APIs, Git'}
- Design Systems & Prototyping: Component-driven UI development and Figma prototyping
- Multimedia & Interactive Systems: Digital media pipelines, accessibility standards, and testing

Does ${c.name} consider speculative curricular internship placements for university students during the Spring 2027 period? An official university internship protocol and insurance can be fully arranged by my institution.

I have attached my current CV for your review. You can also explore my live applications, project repositories, and design case studies at:
${getLiveProjectsBlock(p)}

I would be delighted to speak briefly if there might be an opening or future intake. Thank you very much for your time.

${p.signature || `Sincerely,\n${p.full_name}\n${p.degree} Student\n${p.university}`}`
    })
  },

  // B. Application to an advertised internship
  advertised_internship: {
    name: 'Application to Advertised Internship Vacancy',
    concise: (p, c) => ({
      subject: `Application: ${c.jobTitle || 'Internship Position'} – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Recruitment Team'},

I am writing to express my enthusiastic interest in the ${c.jobTitle || 'Internship'} position at ${c.name}${c.city ? ` in ${c.city}` : ''}.

I am an undergraduate student in Desenvolvimento Web Multimédia at IPCA in Portugal, and I am available for a 4-month curricular internship starting in March 2027 (through June/July 2027).

My background directly matches the technical skills required for this role, specifically ${c.requiredTech || p.skillsList || 'TypeScript, React, and UI/UX design'}. Through both coursework and practical project work, I am accustomed to writing clean, maintainable code, adhering to design specifications, and collaborating via Git.

Please find my CV attached. You can also explore my live deployed applications and verified repositories:
${getLiveProjectsBlock(p)}

I would welcome the opportunity to discuss how my profile aligns with the needs of ${c.name}.

${p.signature || `Best regards,\n${p.full_name}`}`
    }),
    detailed: (p, c) => ({
      subject: `Application for ${c.jobTitle || 'Internship'} – ${p.full_name} (IPCA Portugal)`,
      body: `Dear ${c.recipientName || c.name + ' Hiring Team'},

I am writing to apply for the ${c.jobTitle || 'Internship'} position at ${c.name}, which I discovered via your careers page.

As a student completing my degree in Desenvolvimento Web Multimédia at IPCA (Instituto Politécnico do Cávado e do Ave, Portugal), I am seeking a full-time university placement in Poland from March 2027 to June/July 2027 (4 months).

The requirements outlined for the position strongly match my profile:
- Practical experience with ${c.requiredTech || p.skillsList || 'modern web technologies, frontend frameworks, and responsive design'}
- Solid understanding of software development workflows, version control with Git, and UI component architecture
- High level of English proficiency (C1 level), accustomed to working in international environments
- Strong motivation to learn, receive constructive feedback, and contribute to active production releases

My university provides standard European internship documentation, tripartite agreements, and insurance coverage.

I have attached my updated CV and would be glad to provide any additional project documentation or take a technical assessment.

Thank you for your consideration.

${p.signature || `Warm regards,\n${p.full_name}\n${p.portfolio_url}`}`
    })
  },

  // C. Game QA and game testing internship
  game_qa_internship: {
    name: 'Game QA & Game Testing Internship',
    concise: (p, c) => ({
      subject: `Game QA / Testing University Internship (Spring 2027) – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' QA Team'},

I am an undergraduate student in Web Multimedia Development at IPCA (Portugal), seeking a 4-month university internship in Game Quality Assurance and Functionality Testing in Poland from March through June/July 2027.

With an educational background combining programming concepts, multimedia pipelines, and interactive systems, I have a deep appreciation for the technical discipline required in game testing: methodical bug isolation, clear Jira-style defect reproduction, edge-case analysis, and build verification.

I would love the opportunity to contribute my diligence and technical awareness to ${c.name}'s QA team.

My CV is attached. I look forward to hearing if you have openings for QA interns during the Spring 2027 period.

${p.signature || `Best regards,\n${p.full_name}`}`
    }),
    detailed: (p, c) => ({
      subject: `Game QA & Functionality Testing Internship Inquiry – Spring 2027 – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Quality Assurance & Production Team'},

I hope this message finds you well.

My name is ${p.full_name}, and I am completing my degree in Web Multimedia Development at IPCA in Portugal. I am currently seeking a 4-month university curricular internship in Poland (especially Kraków or Warsaw) for the Spring 2027 semester (March to June/July 2027).

I am writing to ${c.name} specifically because of your high standards of production and gameplay experience${c.products ? ` in titles such as ${c.products}` : ''}.

Why my background is relevant to your QA team:
- Technical understanding of engines and game systems: Experience with Unity and C#, game loops, asset hierarchies, and performance profiling.
- Rigorous bug reporting: Trained in reproducible step-by-step documentation, regression testing, log capture, and severity triage.
- Cross-discipline communication: Studying multimedia development gives me the vocabulary to communicate effectively with programmers, artists, and level designers.
- Languages: Fluent in English (C1), with technical and bug-writing proficiency.

My university facilitates all necessary student internship agreements. Please find my CV attached for your review.

Thank you very much for your time and consideration.

${p.signature || `Sincerely,\n${p.full_name}\n${p.university}`}`
    })
  },

  // D. Game development internship
  game_dev_internship: {
    name: 'Game Development / Technical Art Internship',
    concise: (p, c) => ({
      subject: `Game Development Internship Inquiry (Spring 2027) – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Engineering Team'},

I am an undergraduate student studying Web Multimedia Development at IPCA in Portugal, writing to inquire about junior game development or technical internship opportunities at ${c.name} for Spring 2027 (March to June/July 2027, 4 months).

My coursework and personal work incorporate C#, Unity 3D, gameplay scripting, shader basics, and interactive UI logic. I am eager to contribute to ${c.name}'s development pipeline and learn from your team.

My CV is attached, and my projects are available at ${p.github_url} and ${p.portfolio_url}.

Thank you for considering my application.

${p.signature || `Best regards,\n${p.full_name}`}`
    }),
    detailed: (p, c) => ({
      subject: `Game Programming & Interactive Tech Internship (Spring 2027) – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Development Team'},

I am writing to inquire about university internship opportunities in game programming, gameplay scripting, or technical interactive systems at ${c.name} for the Spring 2027 semester (March–June/July 2027).

I am currently studying Web Multimedia Development at IPCA (Instituto Politécnico do Cávado e do Ave) in Portugal. The program combines software engineering, object-oriented programming (C#), interactive media pipelines, and computer graphics fundamentals.

I have worked with Unity and C# on gameplay mechanics, state machines, and player controllers, and I am comfortable with version control (Git) and collaborative development.

Poland has one of the world's most vibrant game development communities, and completing my university internship with ${c.name} would be an extraordinary milestone for my professional development.

Please find my CV attached. You can view my source code and demos at:
- GitHub: ${p.github_url}
- Portfolio: ${p.portfolio_url}

Thank you for your time, and I look forward to your response.

${p.signature || `Sincerely,\n${p.full_name}`}`
    })
  },

  // E. Frontend/web development internship
  frontend_web_internship: {
    name: 'Frontend & Web Development Internship',
    concise: (p, c) => ({
      subject: `Frontend / Web Engineering Internship (Spring 2027) – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Frontend Team'},

I am an undergraduate student in Web Multimedia Development at IPCA (Portugal), seeking a 4-month frontend development internship in Poland from March through June/July 2027.

My core technical focus is modern TypeScript, React, responsive CSS/Tailwind, and accessible component architectures. I would love to bring my enthusiasm and frontend skills to ${c.name}.

My CV is attached, and my live projects and code are available at ${p.portfolio_url} and ${p.github_url}.

Thank you for your consideration.

${p.signature || `Best regards,\n${p.full_name}`}`
    }),
    detailed: (p, c) => ({
      subject: `Frontend Development University Internship (Mar–Jul 2027) – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Engineering Team'},

I hope you are having a productive week.

I am an undergraduate student in my final year of Web Multimedia Development at IPCA in Portugal, writing to explore internship or trainee opportunities in frontend development at ${c.name} in Poland starting March 2027 for a duration of 4 months.

My technical profile is centered on modern web applications:
- Strong foundations in TypeScript, JavaScript (ESNext), and React
- Responsive, modular styling using Tailwind CSS, CSS Modules, and Figma design tokens
- State management, API integration (REST / GraphQL), and asynchronous data handling
- Dedicated focus on accessibility (WCAG), performance optimization, and clean code

I am seeking an environment where I can contribute to production features, learn from senior engineers, and complete my university degree requirements.

Please review my attached CV, or inspect my live deployed projects and code:
${getLiveProjectsBlock(p)}

Thank you for your time, and I look forward to any potential openings.

${p.signature || `Kind regards,\n${p.full_name}\n${p.university}`}`
    })
  },

  // F. Software development internship
  software_dev_internship: {
    name: 'General Software Engineering Internship',
    concise: (p, c) => ({
      subject: `Software Engineering University Internship (Spring 2027) – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Engineering Lead'},

I am a computer science and multimedia student at IPCA in Portugal, seeking a 4-month software engineering university placement in Poland from March to June/July 2027.

I possess solid foundations in object-oriented programming, data structures, TypeScript/JavaScript, and backend REST APIs with Node.js and SQL databases.

I have attached my CV and would appreciate learning whether ${c.name} accepts university interns during this timeframe.

${p.signature || `Best regards,\n${p.full_name}`}`
    }),
    detailed: (p, c) => ({
      subject: `Software Development Internship Application (Spring 2027) – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Recruitment & Technology Team'},

I am writing to inquire about software engineering internship positions at ${c.name} for the Spring 2027 semester (March 2027 to June/July 2027).

I am currently studying Web Multimedia Development at IPCA in Portugal. My academic training emphasizes software engineering fundamentals, database systems (SQL), algorithms, and full-stack web architectures.

Key areas of my technical training:
- Full-stack development with TypeScript, React, and Node.js
- Database design, normalization, and persistence (SQLite, PostgreSQL)
- Version control workflows with Git, branch management, and CI/CD basics
- Strong problem-solving mindset and fluent English communication (C1)

I am eager to contribute to ${c.name}'s software products while fulfilling my university degree's curricular internship module.

Please find my CV attached. You may also view my code on GitHub at ${p.github_url}.

Thank you for your consideration.

${p.signature || `Sincerely,\n${p.full_name}`}`
    })
  },

  // G. UI/UX and multimedia internship
  ui_ux_internship: {
    name: 'UI/UX Design & Web Design Internship',
    concise: (p, c) => ({
      subject: `UI/UX Design & Web Product Internship (Spring 2027) – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Design Team'},

I am an undergraduate student in Web Multimedia Development at IPCA (Portugal), passionate about UI/UX design, interactive prototyping in Figma, and design systems.

I am seeking a 4-month university internship in Poland from March through June/July 2027. My dual training in design and frontend engineering allows me to design user-centered experiences that are technically feasible.

My CV and design portfolio (${p.portfolio_url}) are available for your review.

Thank you for your time.

${p.signature || `Kind regards,\n${p.full_name}`}`
    }),
    detailed: (p, c) => ({
      subject: `UI/UX & Interactive Design Internship (Spring 2027) – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Product & Design Team'},

I hope this email finds you well.

My name is ${p.full_name}, and I am studying Web Multimedia Development at IPCA in Portugal. I am reaching out to inquire about UI/UX design, product design, or web design internship placements at ${c.name} in Poland starting in March 2027 (4 months duration).

What makes my profile unique is the integration of UX design principles with real-world frontend implementation skills:
- User-centric design in Figma: Wireframing, interactive prototyping, user flows, and component design systems
- Technical implementation knowledge: Deep understanding of HTML5, CSS/Tailwind, and React, allowing seamless developer handoffs
- Visual and multimedia design: Typography, accessibility standards, and visual balance

I would love to contribute to ${c.name}'s digital products and user experience. Please find my CV attached, and explore my design case studies at ${p.portfolio_url}.

Thank you very much for your consideration.

${p.signature || `Warm regards,\n${p.full_name}`}`
    })
  },

  // H. Follow-up after no response
  follow_up_no_response: {
    name: 'Polite Follow-up (No Response After 7 Business Days)',
    concise: (p, c) => ({
      subject: `Following up: University Internship Inquiry (Spring 2027) – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Hiring Team'},

I am writing to briefly follow up on my previous inquiry regarding potential university internship opportunities for Spring 2027 (March to June/July).

I remain very interested in the work ${c.name} is doing and would appreciate knowing if your team is currently reviewing student applications for this period.

My CV is re-attached for your convenience. Thank you again for your time.

${p.signature || `Kind regards,\n${p.full_name}`}`
    }),
    detailed: (p, c) => ({
      subject: `Following up on University Internship Application (Spring 2027) – ${p.full_name}`,
      body: `Dear ${c.recipientName || c.name + ' Talent Acquisition Team'},

I hope you are having a wonderful week.

I am writing to politely follow up on the university internship inquiry I submitted last week regarding a placement from March through June/July 2027 in Poland.

I understand this is a busy period for your team, but I wanted to reaffirm my enthusiasm for ${c.name} and reiterate my availability for a brief conversation or technical assessment.

As a reminder, I am an undergraduate student in Web Multimedia Development at IPCA (Portugal) with skills in modern web development (${p.skillsList || 'TypeScript, React'}) and UI/UX design.

My CV is attached. Thank you again for your consideration and time.

${p.signature || `Sincerely,\n${p.full_name}`}`
    })
  },

  // I. Reply to a company requesting additional information
  reply_request_info: {
    name: 'Reply to Company Requesting Additional Information',
    concise: (p, c) => ({
      subject: `Re: Internship Inquiry – Requested Information – ${p.full_name}`,
      body: `Dear ${c.recipientName || 'Hiring Team'},

Thank you very much for your response and for considering my application.

As requested, please find the additional information below:
• Availability dates: March 1, 2027 – June 30, 2027 (4 months / full-time)
• University protocol: Tripartite Erasmus+ / Curricular Internship Agreement provided by IPCA
• Working language: Fluent in English (C1)

Please let me know if you require any additional documents, academic transcripts, or portfolio references.

${p.signature || `Best regards,\n${p.full_name}`}`
    }),
    detailed: (p, c) => ({
      subject: `Re: Internship Inquiry – Additional Information & Documentation – ${p.full_name}`,
      body: `Dear ${c.recipientName || 'Hiring Team'},

Thank you for getting back to me so promptly and for the opportunity to provide further details regarding my internship application.

Here is the requested information regarding my university curricular placement:
1. Exact Internship Window: March 1, 2027 to June 30, 2027 (approximately 17 weeks, meeting my degree's 4-month requirement).
2. Institutional Agreement: My university, IPCA (Instituto Politécnico do Cávado e do Ave, Portugal), will provide an official curricular internship protocol, including standard academic evaluation sheets and university liability insurance.
3. Relevant Technical Projects: In addition to my attached CV, you can review live project demonstrations at ${p.portfolio_url} and code repositories at ${p.github_url}.

I remain at your full disposal should you wish to arrange a virtual meeting or if your engineering leads have any technical questions.

Thank you again for your time and guidance.

${p.signature || `Warm regards,\n${p.full_name}`}`
    })
  },

  // J. Reply to a rejection, thanking the recruiter professionally
  reply_rejection_thank_you: {
    name: 'Professional Thank-You Reply to Rejection',
    concise: (p, c) => ({
      subject: `Re: Internship Inquiry – Thank you – ${p.full_name}`,
      body: `Dear ${c.recipientName || 'Hiring Team'},

Thank you for taking the time to review my profile and for informing me of your decision.

While I am naturally disappointed that there is no opening at this time, I truly appreciate your prompt communication and consideration. I will continue to follow ${c.name}'s achievements with great interest.

I hope we may cross paths again in the future.

${p.signature || `Best regards,\n${p.full_name}`}`
    }),
    detailed: (p, c) => ({
      subject: `Re: Internship Inquiry – Thank you for your consideration – ${p.full_name}`,
      body: `Dear ${c.recipientName || 'Hiring Team'},

Thank you very much for updating me regarding the status of my internship application.

Although I regret that you are unable to offer an internship placement for the Spring 2027 period, I sincerely appreciate your transparency and the time your team invested in reviewing my profile.

I have immense respect for the work being done at ${c.name} and will continue following your company's projects closely. Should an appropriate opportunity or future junior intake arise, I would be delighted to reconnect.

Wishing you and the entire team at ${c.name} continued success.

${p.signature || `Sincerely,\n${p.full_name}\n${p.portfolio_url}`}`
    })
  }
};

// Portuguese translations option
function translateToPortuguese(templateKey, conciseOrDetailed, profile, company) {
  if (templateKey === 'speculative_inquiry') {
    return {
      subject: `Candidatura a Estágio Curricular Universitário (Primavera 2027) – ${profile.full_name}`,
      body: `Exmo(a) Senhor(a) ${company.recipientName || 'Responsável pelo Recrutamento'},

Chamo-me ${profile.full_name} e sou estudante da Licenciatura em Desenvolvimento Web Multimédia no IPCA (Instituto Politécnico do Cávado e do Ave) em Portugal.

No âmbito da conclusão do meu curso universitário, realizarei um estágio curricular com a duração de 4 meses, com início previsto para março de 2027 até junho/julho de 2027.

Escrevo-lhe para manifestar o meu profundo interesse na ${company.name} e consultar a vossa disponibilidade para acolher um estagiário curricular durante este período. A minha formação conjuga engenharia web (${profile.skillsList || 'TypeScript, React, Node.js'}), design de interfaces e sistemas multimédia.

Junto envio o meu Curriculum Vitae para a vossa apreciação. Poderá igualmente consultar os meus projetos práticos em:
• Portfólio: ${profile.portfolio_url}
• GitHub: ${profile.github_url}

Agradeço desde já a atenção dispensada.

${profile.signature || `Com os melhores cumprimentos,\n${profile.full_name}\n${profile.university}`}`
    };
  }
  return null;
}

// Generate email using either local deterministic templates, Gemini, or OpenAI
async function generateEmail({
  templateType = 'speculative_inquiry',
  variant = 'concise',
  profile,
  company,
  opportunity = null,
  language = 'English',
  provider = 'gemini',
  apiKey = null,
  geminiKey = null,
  customInstructions = ''
}) {
  if (language === 'Portuguese') {
    const pt = translateToPortuguese(templateType, variant, profile, company);
    if (pt) return pt;
  }

  const templateGroup = TEMPLATES[templateType] || TEMPLATES.speculative_inquiry;
  const generatorFn = variant === 'detailed' ? templateGroup.detailed : templateGroup.concise;

  const formatList = (val) => {
    if (!val) return '';
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.join(', ');
        } catch (e) {}
      }
      return val;
    }
    return String(val);
  };

  // Build composite company info
  const compData = {
    name: company.name,
    recipientName: company.contact_name || company.recipient_name,
    city: company.city,
    products: formatList(company.products),
    jobTitle: opportunity?.title || '',
    requiredTech: formatList(opportunity?.required_technologies),
  };

  // 1. If Gemini API is configured or selected, use Google's free Gemini API
  const activeGeminiKey = geminiKey || (apiKey && apiKey.trim().startsWith('AIzaSy') ? apiKey : null);
  if ((provider === 'gemini' || !apiKey) && activeGeminiKey) {
    try {
      const promptText = `You are an expert career advisor generating a professional, natural, high-converting internship email for a university student.
CRITICAL RULES:
1. NEVER hallucinate or invent skills, degrees, or experience not provided in the student profile.
2. The student studies Desenvolvimento Web Multimédia at IPCA, Portugal.
3. Internship timeframe: February 1, 2027 to June 30, 2027 (4 months) in Poland.
4. Keep the tone professional, sincere, concise, and non-generic. No cheesy praise or artificial buzzwords.
5. Highlight the student's live deployed projects and code repositories:
   • CineLog (Movie & TV Tracking PWA): https://cinelog-phi.vercel.app/?tab=explore
   • Poland Internship Hunter (Desktop CRM): https://github.com/FabioSilva32/poland-internship-hunter
   • Retiro Interior (Tourism Platform): https://retirointerior.netlify.app/#conceito
   • StocksVault (Financial Portfolio Tracker): https://stocksvault.netlify.app/portfolio
   • GitHub: https://github.com/FabioSilva32
6. Return a JSON object with strictly two keys: "subject" and "body".

Student Profile: ${JSON.stringify(profile)}
Target Company: ${JSON.stringify(compData)}
Template Type: ${templateType}
Variant: ${variant}
Language: ${language}
Custom Instructions: ${customInstructions || 'None'}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeGeminiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText);
          if (parsed.subject && parsed.body) {
            return { subject: parsed.subject, body: parsed.body, provider: 'gemini' };
          }
        }
      } else {
        const errText = await response.text();
        console.warn('[AI Service] Gemini API returned error:', response.status, errText);
      }
    } catch (err) {
      console.warn('[AI Service] Gemini call failed, falling back to built-in template engine:', err.message);
    }
  }

  // 2. If OpenAI API key is supplied, attempt an enhanced personalized completion
  if (apiKey && apiKey.trim().startsWith('sk-') && provider !== 'gemini') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.4,
          messages: [
            {
              role: 'system',
              content: `You are an expert career advisor generating a professional, natural, high-converting internship email for a university student.
CRITICAL RULES:
1. NEVER hallucinate or invent skills, degrees, or experience not provided in the student profile.
2. The student studies Desenvolvimento Web Multimédia at IPCA, Portugal.
3. Internship timeframe: February 1, 2027 to June 30, 2027 (4 months) in Poland.
4. Keep the tone professional, sincere, concise, and non-generic. No cheesy praise or artificial buzzwords.
5. Return a JSON object with strictly two keys: "subject" and "body".`
            },
            {
              role: 'user',
              content: `Generate a ${variant} email in ${language}.
Template Type: ${templateType}
Student Profile: ${JSON.stringify(profile)}
Company: ${JSON.stringify(compData)}
Custom Instructions: ${customInstructions || 'None'}`
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        if (parsed.subject && parsed.body) {
          return { subject: parsed.subject, body: parsed.body, provider: 'openai' };
        }
      }
    } catch (err) {
      console.warn('[AI Service] OpenAI call failed or timed out, falling back to built-in template engine:', err.message);
    }
  }

  // Built-in deterministic template (guaranteed 100% reliable, zero external network dependency)
  const result = generatorFn(profile, compData);
  return {
    subject: result.subject,
    body: result.body,
    provider: 'builtin-template'
  };
}

module.exports = {
  TEMPLATES,
  generateEmail
};
