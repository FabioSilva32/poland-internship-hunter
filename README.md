# Poland Internship Hunter & Email Automation (Windows Desktop App)

A specialized Windows desktop application built with **React**, **TypeScript**, **Tailwind CSS**, and **SQLite (Node 22/24 built-in engine)** wrapped in a native **Electron desktop shell**, designed specifically for a university student studying **Desenvolvimento Web Multimédia at IPCA (Portugal)** seeking a 4-month curricular internship in Poland for **Spring 2027 (March to June/July 2027)**.

---

## 🚀 Key Features

### 1. Executive Dashboard
- **Comprehensive KPI Tracking**: Total companies discovered, companies worth contacting, active internship vacancies, 2027 date-compatible positions, emails drafted, emails sent, replies received, interviews, and rejections.
- **Geographic Density**: Visual opportunity breakdown for **Kraków (#1 top preference)**, **Warsaw**, and **Gdańsk**.
- **Application Pipeline Visualizer**: Real-time status tracker across all 14 stages.
- **Prominent Sync Button**: Instant 1-click trigger to sync live providers.

### 2. Multi-Provider Company & Vacancy Discovery
- **Live Provider Querying**: Seamless JSON endpoints for Greenhouse, Lever, and Ashby job boards.
- **Curated Polish Directory**: Pre-seeded with verified top tier game studios (*CD Projekt RED, Bloober Team, 11 bit studios, Flying Wild Hog*) and high-scale tech firms (*Brainly, Allegro, Cisco Systems Poland, Netguru*).
- **Accurate Classification**: Clearly separates **Official Vacancies** from **Speculative Inquiries**.
- **Deduplication Engine**: Normalizes company titles, URLs, and job postings.

### 3. Transparent Fit Score (0–100) & Company Research
- **Multi-Factor Explainable Scoring**:
  1. *Academic Degree Relevance* (IPCA Web Multimedia curriculum: TypeScript, React, UI/UX, Multimedia)
  2. *Industry & Role Alignment* (Software dev, Frontend, UI/UX, Game QA & testing)
  3. *Location Match* (Kraków priority score: 100%, Warsaw: 95%, Gdańsk: 90%)
  4. *2027 Dates & Duration* (March–June 2027 window)
  5. *Language Compatibility* (English-friendly work environment)
- **Verified Contacts**: Recruiter contacts labeled by source (`verified_website`, `public_source`, `form_only`).
- **Priority Management**: Toggle companies between *High*, *Medium*, and *Low*.

### 4. Personalized Email AI Generator (10 Templates × 2 Variants)
- **10 Purpose-Built Templates**:
  - `A`: Speculative University Internship Inquiry
  - `B`: Application to Advertised Vacancy
  - `C`: Game QA & Functionality Testing Internship
  - `D`: Game Development & Tech Art
  - `E`: Frontend & Web Development
  - `F`: General Software Engineering
  - `G`: UI/UX Design & Web Product
  - `H`: Polite Follow-Up (No Response after 7 days)
  - `I`: Reply to Company Requesting Additional Info
  - `J`: Professional Thank-You Reply to Rejection
- **Two Stylistic Variants**: *Concise* (high-impact, quick read) and *Detailed* (formal institutional presentation).
- **Language Support**: English (default) and Portuguese.
- **Zero Hallucination Constraint**: Strictly incorporates verified student skills without inventing experience.
- **Multi-Version CV Attachments**: Attach specific resumes (Web Developer, Game QA, or UI/UX).
- **Export Options**: 1-click RFC 822 `.eml` export, clipboard copy with full headers, or direct send.

### 5. Application CRM & Kanban Board
- **14 Lifecycle Statuses**: `Discovered`, `Researching`, `Ready to contact`, `Draft prepared`, `Awaiting approval`, `Email sent`, `Follow-up due`, `Replied`, `Interview`, `Offer received`, `Rejected`, `Withdrawn`, `No response`, `Not suitable`.
- **Dual Views**: Interactive Kanban board and sortable Table view.
- **CSV Data Export**: Generate clean reports for university internship supervisors.

### 6. Batch Outreach Review & Responsible Automation
- **Mandatory Manual Approval**: Individual checkbox for every company before dispatch.
- **Emergency Stop**: Global Pause switch instantly freezes the outgoing queue.
- **Daily Rate Limiting**: Built-in 20 email/day gauge to preserve mailbox sender reputation.

### 7. Automated Follow-Up Engine
- **Cadence Rules**:
  - Follow-up #1: Scheduled 7 business days after initial contact.
  - Follow-up #2: Scheduled another 7 business days later.
  - Maximum 2 follow-ups per company.
- **Automatic Suppression**: Instantly cancelled if the company replies, rejects, or opts out.

---

## 🛠️ Technology Stack & Architecture

- **Desktop Shell**: Electron 33 (Native Windows 10/11 frame, system dialogs, secure context isolation).
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Database**: Local SQLite 3 via Node.js 22/24 built-in `node:sqlite` (`DatabaseSync` with WAL mode & foreign keys).
- **Security**: ContextBridge IPC, secrets kept out of frontend and logs, OS DPAPI storage.
- **Validation**: Zod schema validation.

---

## 📦 Installation & Running Locally

### Prerequisites
- Windows 10 or Windows 11
- Node.js v20+ (v24.14+ recommended)

### Quick Start
```powershell
# 1. Navigate to the project directory
cd poland-internship-hunter

# 2. Run the application in desktop mode (spawns Vite + Electron)
npm run dev

# Or run the renderer in your browser for preview:
npm run dev:renderer
```

---

## 🔒 Configuration & API Setup

### 1. AI Configuration (Settings Page)
- **Default Engine**: Built-in deterministic template generator works 100% offline with zero credits required.
- **OpenAI (Optional)**: If you possess an OpenAI API key (`sk-...`), paste it in **Settings > AI Generator & API Configuration**. The key is stored securely and masked.

### 2. Email OAuth Configuration
- **Gmail**: Go to Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client ID (Desktop Application). Add scope `https://www.googleapis.com/auth/gmail.send`.
- **Microsoft Graph**: Azure Portal > App Registrations > Delegated Permission `Mail.Send`.
- **Offline / Manual Fallback**: If you prefer not to connect an account, use the **Export .eml** or **Copy** buttons to send directly from Outlook or Thunderbird.

---

## 🏗️ Building the Windows Installer (.exe)

To build the standalone Windows `.exe` installer (NSIS):
```powershell
# Compiles frontend assets and packages the Electron Windows executable
npm run build
```
The output installer will be generated in `dist-electron/`.

---

## 📂 Local Database Location
The persistent SQLite database is located at:
`%APPDATA%/poland-internship-hunter/database/internship_hunter.sqlite` (Production)
or `./data/internship_hunter.sqlite` (Development).
