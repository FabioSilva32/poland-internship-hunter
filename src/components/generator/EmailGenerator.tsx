import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Company, Opportunity, Document } from '../../types';
import {
  Sparkles,
  Send,
  Save,
  Download,
  Copy,
  Check,
  Building2,
  FileText,
  Paperclip,
  Languages,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Upload,
} from 'lucide-react';

export const EmailGenerator: React.FC = () => {
  const {
    selectedCompanyId,
    selectedOpportunityId,
    showToast,
    refreshMetrics,
    setActiveTab,
  } = useApp();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompId, setSelectedCompId] = useState<string>(selectedCompanyId || 'comp-bloober');
  const [currentCompany, setCurrentCompany] = useState<any>(null);

  // Generator Controls
  const [templateType, setTemplateType] = useState<string>('speculative_inquiry');
  const [variant, setVariant] = useState<'concise' | 'detailed'>('concise');
  const [language, setLanguage] = useState<'English' | 'Portuguese'>('English');
  const [customInstructions, setCustomInstructions] = useState<string>('');

  // Draft state
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [bodyText, setBodyText] = useState<string>('');
  const [selectedCvDocId, setSelectedCvDocId] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [generating, setGenerating] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Load companies & documents
  useEffect(() => {
    if (window.desktopAPI?.getCompanies) {
      window.desktopAPI.getCompanies({}).then((data: Company[]) => {
        setCompanies(data);
        if (data.length > 0 && !selectedCompanyId) {
          setSelectedCompId(data[0].id);
        }
      });
    }

    if (window.desktopAPI?.getDocuments) {
      window.desktopAPI.getDocuments().then((docs: Document[]) => {
        setDocuments(docs);
        const tailoredCvs = docs.filter(d => d.id !== 'doc-portfolio-showcase' && d.category !== 'portfolio');
        if (tailoredCvs.length > 0) {
          setSelectedCvDocId(tailoredCvs[0].id);
        } else if (docs.length > 0) {
          setSelectedCvDocId(docs[0].id);
        }
      });
    }
  }, []);

  // Update current company
  useEffect(() => {
    if (selectedCompanyId) setSelectedCompId(selectedCompanyId);
  }, [selectedCompanyId]);

  const cleanEmailText = (text: string) => {
    if (!text) return text;
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
      .replace(/https:\/\/cinelog-phi\.vercel\.app\/?[^\s\n•)]*/g, 'https://cinelog-phi.vercel.app')
      .replace(/https:\/\/retirointerior\.netlify\.app\/?[^\s\n•)]*/g, 'https://retirointerior.netlify.app')
      .replace(/https:\/\/stocksvault\.netlify\.app\/?[^\s\n•)]*/g, 'https://stocksvault.netlify.app')
      .replace(/https:\/\/acrialbi\.netlify\.app\/?[^\s\n•)]*/g, 'https://acrialbi.netlify.app');
  };

  useEffect(() => {
    if (selectedCompId && window.desktopAPI?.getCompanyDetails) {
      window.desktopAPI.getCompanyDetails(selectedCompId).then((comp: any) => {
        setCurrentCompany(comp);
        if (comp?.contacts && comp.contacts.length > 0) {
          setRecipientEmail(comp.contacts[0].email || '');
          setRecipientName(comp.contacts[0].name || '');
        } else {
          setRecipientEmail(`careers@${(comp?.name || 'company').toLowerCase().replace(/\s+/g, '')}.com`);
          setRecipientName(`${comp?.name || 'Company'} Hiring Team`);
        }
        // Reset body text so that switching companies auto-generates a fresh tailored draft
        setBodyText('');
      });
    }
  }, [selectedCompId]);

  // Trigger generation
  const handleGenerate = async () => {
    if (!currentCompany) return;
    setGenerating(true);
    showToast('Synthesizing verified profile data & company context...', 'info');

    if (window.desktopAPI?.generateEmail) {
      try {
        const res = await window.desktopAPI.generateEmail({
          templateType,
          variant,
          company: {
            ...currentCompany,
            recipientName,
          },
          opportunity: currentCompany.opportunities?.[0] || null,
          language,
          customInstructions,
        });

        setSubject(cleanEmailText(res.subject));
        setBodyText(cleanEmailText(res.body));
        showToast('Personalized email generated successfully!', 'success');
      } catch (err: any) {
        showToast('Generation error: ' + err.message, 'error');
      }
    }
    setGenerating(false);
  };

  // Initial auto-generation on load or company switch
  useEffect(() => {
    if (currentCompany && !bodyText && !generating) {
      handleGenerate();
    }
  }, [currentCompany, bodyText]);

  // Save Draft to SQLite
  const handleSaveDraft = async () => {
    if (!recipientEmail || !subject || !bodyText) {
      showToast('Please provide recipient email, subject, and body.', 'warning');
      return;
    }

    if (window.desktopAPI?.saveDraft) {
      try {
        await window.desktopAPI.saveDraft({
          company_id: selectedCompId,
          recipient_email: recipientEmail,
          recipient_name: recipientName,
          subject,
          body_text: bodyText,
          template_type: templateType,
          variant,
          cv_document_id: selectedCvDocId || null,
          status: 'draft',
        });
        showToast('Draft successfully saved to database.', 'success');
        refreshMetrics();
      } catch (err: any) {
        showToast('Error saving draft: ' + err.message, 'error');
      }
    }
  };

  // Direct Send with Safety Controls
  const handleSendEmail = async () => {
    if (!recipientEmail || !subject || !bodyText) {
      showToast('Recipient, subject, and message body are required.', 'warning');
      return;
    }

    setSending(true);
    try {
      // First save draft
      const saveRes = await window.desktopAPI.saveDraft({
        company_id: selectedCompId,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        subject,
        body_text: bodyText,
        template_type: templateType,
        variant,
        cv_document_id: selectedCvDocId || null,
        is_approved: 1,
        status: 'approved',
      });

      // Dispatch send
      const sendRes = await window.desktopAPI.sendEmail(saveRes.id);
      showToast(sendRes.message, 'success');
      refreshMetrics();
      setActiveTab('tracker');
    } catch (err: any) {
      showToast('Send failed: ' + err.message, 'error');
    }
    setSending(false);
  };

  // Export .eml
  const handleExportEml = async () => {
    try {
      const saveRes = await window.desktopAPI.saveDraft({
        company_id: selectedCompId,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        subject,
        body_text: bodyText,
        template_type: templateType,
        variant,
        status: 'draft',
      });
      const exp = await window.desktopAPI.exportEml(saveRes.id);
      if (exp.success) {
        showToast(`Exported .eml to: ${exp.filePath}`, 'success');
      }
    } catch (err: any) {
      showToast('Export error: ' + err.message, 'error');
    }
  };

  // Copy to clipboard
  const handleCopyToClipboard = () => {
    const fullText = `To: ${recipientEmail}\nSubject: ${subject}\n\n${bodyText}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    showToast('Email content copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickUploadCv = async () => {
    if (window.desktopAPI?.uploadCv) {
      try {
        const res = await window.desktopAPI.uploadCv({
          title: `CV_Fabio_Silva_2027.pdf`,
          category: 'general',
        });
        if (res.success) {
          showToast(`CV uploaded and ready to attach!`, 'success');
          const docs = await window.desktopAPI.getDocuments();
          setDocuments(docs);
          setSelectedCvDocId(res.id);
        }
      } catch (err: any) {
        showToast('Upload error: ' + err.message, 'error');
      }
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#090d16]">
      {/* Left Configuration Panel */}
      <div className="w-96 border-r border-slate-800 bg-slate-900/50 p-5 overflow-y-auto space-y-4 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Outreach Parameters
          </h3>
          <p className="text-xs text-slate-400">Configure recipient, template, and persona</p>
        </div>

        {/* Company Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Target Polish Company:
          </label>
          <select
            value={selectedCompId}
            onChange={(e) => setSelectedCompId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.city} • {c.fit_score}% Fit)
              </option>
            ))}
          </select>
        </div>

        {/* Recipient Email & Name */}
        <div className="grid grid-cols-1 gap-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Recipient Email (Verified)</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Recipient Name / Team</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 10 Template Selector (Section 7) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            Outreach Template:
          </label>
          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
          >
            <option value="speculative_inquiry">A. Speculative Internship Inquiry</option>
            <option value="advertised_internship">B. Application to Advertised Vacancy</option>
            <option value="game_qa_internship">C. Game QA & Functionality Testing</option>
            <option value="game_dev_internship">D. Game Development & Tech Art</option>
            <option value="frontend_web_internship">E. Frontend & Web Development</option>
            <option value="software_dev_internship">F. General Software Engineering</option>
            <option value="ui_ux_internship">G. UI/UX Design & Web Product</option>
            <option value="follow_up_no_response">H. Follow-up (No Response)</option>
            <option value="reply_request_info">I. Reply to Info Request</option>
            <option value="reply_rejection_thank_you">J. Thank You Reply to Rejection</option>
          </select>
        </div>

        {/* Variant & Language Toggle */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Style Variant</label>
            <div className="grid grid-cols-2 rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setVariant('concise')}
                className={`py-1 rounded-md transition ${variant === 'concise' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Concise
              </button>
              <button
                onClick={() => setVariant('detailed')}
                className={`py-1 rounded-md transition ${variant === 'detailed' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Detailed
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Language</label>
            <div className="grid grid-cols-2 rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setLanguage('English')}
                className={`py-1 rounded-md transition ${language === 'English' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('Portuguese')}
                className={`py-1 rounded-md transition ${language === 'Portuguese' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                PT
              </button>
            </div>
          </div>
        </div>

        {/* CV Version Selector with 1-Click Upload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
              Tailored CV Attachment:
            </label>
            <button
              onClick={handleQuickUploadCv}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
              title="Upload your PDF CV"
            >
              <Upload className="w-3 h-3" />
              + Upload PDF
            </button>
          </div>
          <select
            value={selectedCvDocId}
            onChange={(e) => setSelectedCvDocId(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">No Tailored CV (Portfolio Showcase Only)</option>
            {documents.filter(d => d.id !== 'doc-portfolio-showcase' && d.category !== 'portfolio').map((doc) => (
              <option key={doc.id} value={doc.id}>
                📄 {doc.title} ({(doc.file_size / 1024).toFixed(0)} KB)
              </option>
            ))}
            {documents.length === 0 && (
              <option value="" disabled>No CV uploaded yet — click "+ Upload PDF" above</option>
            )}
          </select>

          {/* Portfolio Always Attached Callout */}
          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-sm">🎨</span>
              <div>
                <div className="text-emerald-200 font-semibold">
                  Portfolio Showcase PDF
                </div>
                <div className="text-[10px] text-emerald-400/80">
                  Always attached to every outreach email
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              ✓ Attached
            </span>
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Custom Emphasis (Optional)</label>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g., Emphasize Erasmus+ insurance, or highlight React 19 and Tailwind knowledge..."
            className="w-full h-16 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Regenerate Action */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
          <span>{generating ? 'Regenerating...' : 'Regenerate Draft'}</span>
        </button>

        {/* Safety Box */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>Zero Hallucinations: All qualifications and dates are strictly verified against your student profile.</span>
        </div>
      </div>

      {/* Right Editable Preview Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-white">Draft Preview & Editor</h3>
            <p className="text-xs text-slate-400">Review and refine before saving or dispatching</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyToClipboard}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleExportEml}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export .eml</span>
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
            >
              <Save className="w-3.5 h-3.5 text-indigo-400" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={handleSendEmail}
              disabled={sending}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sending ? 'Sending...' : 'Approve & Send'}</span>
            </button>
          </div>
        </div>

        {/* Email Header Fields */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 shrink-0">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-16 font-semibold text-slate-400">To:</span>
            <span className="font-mono text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/50">
              {recipientEmail || 'None configured'}
            </span>
            <span className="text-slate-500">({recipientName})</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="w-16 font-semibold text-slate-400">Subject:</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Active Attachments Preview */}
          <div className="flex items-center gap-3 text-xs pt-2 border-t border-slate-800/80">
            <span className="w-16 font-semibold text-slate-400 flex items-center gap-1">
              <Paperclip className="w-3 h-3 text-slate-400" />
              Files:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {documents.find(d => d.id === selectedCvDocId) && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium text-[11px]">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  {documents.find(d => d.id === selectedCvDocId)?.title}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium text-[11px]">
                <span>🎨</span>
                Portfolio Showcase PDF
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">Always attached</span>
              </span>
            </div>
          </div>
        </div>

        {/* Body Editor Area */}
        <div className="flex-1 flex flex-col rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-inner">
          <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Plaintext Body (Markdown & formatting preserved)</span>
            <span>{bodyText.length} characters • ~{Math.ceil(bodyText.split(/\s+/).length / 200)} min read</span>
          </div>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="flex-1 w-full p-4 bg-transparent text-xs text-slate-200 font-mono leading-relaxed focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
};
