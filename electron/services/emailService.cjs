const fs = require('fs');
const path = require('path');

const nodemailer = require('nodemailer');

// Global emergency pause state
let isGlobalPaused = false;

function setGlobalPause(paused) {
  isGlobalPaused = !!paused;
  return isGlobalPaused;
}

function getGlobalPauseState() {
  return isGlobalPaused;
}

// Get user configured sender email
function getSenderEmail(db) {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'sender_email'").get();
  if (row && row.value && row.value.trim()) {
    return row.value.trim();
  }
  const prof = db.prepare("SELECT email FROM user_profile LIMIT 1").get();
  return prof?.email || 'fabioz262006@gmail.com';
}

// Create Nodemailer transport for Gmail
async function createTransporter(db) {
  const user = getSenderEmail(db);
  const passRow = db.prepare("SELECT value FROM settings WHERE key = 'gmail_app_password'").get();
  const pass = passRow?.value ? passRow.value.replace(/\s+/g, '') : null;

  if (!pass) {
    return null; // Local mode / simulation
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass
    }
  });
}

// Test SMTP connection with Google
async function testEmailConnection(db) {
  const user = getSenderEmail(db);
  const passRow = db.prepare("SELECT value FROM settings WHERE key = 'gmail_app_password'").get();
  const pass = passRow?.value ? passRow.value.replace(/\s+/g, '') : null;

  if (!pass) {
    return {
      success: false,
      message: 'No Google App Password entered yet. Please generate a 16-character App Password from Google Account Security and paste it below.'
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass
      }
    });

    await transporter.verify();
    return {
      success: true,
      message: `Successfully connected to Gmail SMTP as ${user}! Automated live sending is fully active.`
    };
  } catch (err) {
    return {
      success: false,
      message: `Gmail SMTP authentication failed: ${err.message}. Make sure 2-Step Verification is active on your Google account and you are using an App Password.`
    };
  }
}

// Format RFC 822 .eml file content
function generateEmlContent({ from, to, subject, body, date = new Date() }) {
  const boundary = `----=_Part_${Date.now()}`;
  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    `Date: ${date.toUTCString()}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8; format=flowed`,
    `Content-Transfer-Encoding: 8bit`,
    `X-Mailer: Poland-Internship-Hunter-Desktop/1.0`,
    '',
    body
  ].join('\r\n');
}

// Export draft to an .eml file
function exportDraftAsEml(draft, targetFilePath) {
  const content = generateEmlContent({
    from: draft.from_address || 'fabioz262006@gmail.com',
    to: draft.recipient_email,
    subject: draft.subject,
    body: draft.body_text,
    date: new Date()
  });
  fs.writeFileSync(targetFilePath, content, 'utf8');
  return { success: true, filePath: targetFilePath };
}

// Simulate or execute send email with rate limiting, optional real SMTP, and audit logging
async function sendEmail({
  db,
  draftId,
  senderAccountId = null,
  isDryRun = false
}) {
  if (isGlobalPaused) {
    throw new Error('Global sending is currently PAUSED. Unpause before proceeding.');
  }

  // 1. Fetch draft
  const draft = db.prepare(`
    SELECT d.*, c.name as company_name, c.opt_out 
    FROM email_drafts d 
    JOIN companies c ON d.company_id = c.id 
    WHERE d.id = ?
  `).get(draftId);

  if (!draft) {
    throw new Error('Draft not found.');
  }

  if (draft.opt_out === 1) {
    throw new Error(`Company "${draft.company_name}" has requested no further contact (Opt-out active).`);
  }

  // 2. Check if already sent
  if (draft.status === 'sent') {
    throw new Error('This email has already been sent to avoid duplicate outreach.');
  }

  // 3. Verify attachments if any
  let attachedDoc = null;
  if (draft.cv_document_id) {
    attachedDoc = db.prepare('SELECT * FROM documents WHERE id = ?').get(draft.cv_document_id);
    if (attachedDoc && !fs.existsSync(attachedDoc.file_path)) {
      throw new Error(`Attached CV file was not found on disk at: ${attachedDoc.file_path}`);
    }
  }

  // 4. Check daily send limit
  const today = new Date().toISOString().slice(0, 10);
  const sentTodayRow = db.prepare(`
    SELECT count(*) as count 
    FROM email_messages 
    WHERE direction = 'outgoing' AND date(sent_at) = date('now')
  `).get();

  const limitRow = db.prepare("SELECT value FROM settings WHERE key = 'daily_send_limit'").get();
  const dailyLimit = limitRow ? parseInt(limitRow.value, 10) : 20;

  if (sentTodayRow.count >= dailyLimit) {
    throw new Error(`Daily send limit reached (${sentTodayRow.count}/${dailyLimit}). To prevent spam flags, wait until tomorrow or increase limit in Settings.`);
  }

  const fromEmail = getSenderEmail(db);
  const userProfile = db.prepare('SELECT full_name FROM user_profile LIMIT 1').get();
  const senderName = userProfile?.full_name || 'Fábio Silva';

  // 5. If live Gmail transporter is configured, dispatch real email
  let liveSent = false;
  const transporter = await createTransporter(db);
  if (transporter && !isDryRun) {
    const mailOptions = {
      from: `"${senderName}" <${fromEmail}>`,
      to: draft.recipient_email,
      subject: draft.subject,
      text: draft.body_text
    };

    if (attachedDoc && fs.existsSync(attachedDoc.file_path)) {
      const resolvedFilename = attachedDoc.file_name 
        || path.basename(attachedDoc.file_path) 
        || (attachedDoc.title && attachedDoc.title.endsWith('.pdf') ? attachedDoc.title : `${attachedDoc.title || 'Curriculum_Vitae'}.pdf`);

      mailOptions.attachments = [
        {
          filename: resolvedFilename,
          path: attachedDoc.file_path
        }
      ];
    }

    await transporter.sendMail(mailOptions);
    liveSent = true;
  }

  // 6. Update draft status
  db.prepare(`
    UPDATE email_drafts 
    SET status = 'sent', sent_at = datetime('now'), updated_at = datetime('now') 
    WHERE id = ?
  `).run(draftId);

  // 7. Record in email_messages
  const msgId = 'msg-' + Date.now();
  db.prepare(`
    INSERT INTO email_messages (
      id, application_id, company_id, direction, from_address, to_address, subject, full_body, sent_at, delivery_status
    ) VALUES (?, ?, ?, 'outgoing', ?, ?, ?, ?, datetime('now'), 'delivered')
  `).run(
    msgId,
    draft.application_id,
    draft.company_id,
    fromEmail,
    draft.recipient_email,
    draft.subject,
    draft.body_text
  );

  // 8. Update application status to 'Email sent'
  if (draft.application_id) {
    // Calculate follow-up due date (default 7 business days from now)
    const dueDate = calculateBusinessDaysFromNow(7);
    db.prepare(`
      UPDATE applications 
      SET status = 'Email sent', date_contacted = datetime('now'), next_follow_up_date = ?, last_activity_at = datetime('now')
      WHERE id = ?
    `).run(dueDate, draft.application_id);

    // Schedule 1st follow-up record
    db.prepare(`
      INSERT INTO follow_ups (id, application_id, follow_up_number, due_date, status, rule_trigger)
      VALUES (?, ?, 1, ?, 'pending', '7_business_days_initial')
    `).run('fu-' + Date.now(), draft.application_id, dueDate);
  }

  // 9. Log audit trail
  db.prepare(`
    INSERT INTO audit_logs (id, action_type, entity_type, entity_id, details)
    VALUES (?, 'send', 'email_draft', ?, ?)
  `).run(
    'audit-' + Date.now(),
    draftId,
    JSON.stringify({
      recipient: draft.recipient_email,
      subject: draft.subject,
      mode: liveSent ? 'live_gmail_smtp' : 'local_staged'
    })
  );

  return {
    success: true,
    liveSent,
    message: liveSent
      ? `Live email successfully delivered to ${draft.recipient_email} from ${fromEmail}! Next follow-up scheduled for ${calculateBusinessDaysFromNow(7)}.`
      : `Email marked as sent (Staged). Follow-up scheduled for ${calculateBusinessDaysFromNow(7)}.`,
    sentCountToday: sentTodayRow.count + 1,
    dailyLimit
  };
}

function calculateBusinessDaysFromNow(daysToAdd) {
  let date = new Date();
  let added = 0;
  while (added < daysToAdd) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // skip Sunday (0) and Saturday (6)
      added++;
    }
  }
  return date.toISOString().slice(0, 10);
}

module.exports = {
  setGlobalPause,
  getGlobalPauseState,
  generateEmlContent,
  exportDraftAsEml,
  sendEmail,
  testEmailConnection,
  calculateBusinessDaysFromNow
};
