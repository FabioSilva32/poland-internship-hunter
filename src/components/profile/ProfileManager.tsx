import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, Skill, Document } from '../../types';
import {
  UserCheck,
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  Save,
  Plus,
  Trash2,
  FileText,
  Upload,
  Link,
  Github,
  Linkedin,
  Globe,
  Paperclip,
  CheckCircle2,
  Mail,
  Phone,
} from 'lucide-react';

export const ProfileManager: React.FC = () => {
  const { profile, refreshProfile, showToast } = useApp();

  const [formData, setFormData] = useState<any>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillCat, setNewSkillCat] = useState<any>('Programming');
  const [newSkillProf, setNewSkillProf] = useState<any>('Intermediate');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const loadSkills = async () => {
    if (window.desktopAPI?.getSkills) {
      const data = await window.desktopAPI.getSkills();
      setSkills(data);
    }
  };

  const loadDocuments = async () => {
    if (window.desktopAPI?.getDocuments) {
      const docs = await window.desktopAPI.getDocuments();
      setDocuments(docs);
    }
  };

  useEffect(() => {
    loadSkills();
    loadDocuments();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    if (window.desktopAPI?.updateUserProfile) {
      try {
        await window.desktopAPI.updateUserProfile(formData);
        showToast('Personal profile updated in persistent SQLite database.', 'success');
        refreshProfile();
      } catch (err: any) {
        showToast('Failed to save profile: ' + err.message, 'error');
      }
    }
    setSaving(false);
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    if (window.desktopAPI?.addSkill) {
      try {
        await window.desktopAPI.addSkill({
          category: newSkillCat,
          name: newSkillName.trim(),
          proficiency: newSkillProf,
        });
        setNewSkillName('');
        showToast(`Skill "${newSkillName}" added.`, 'success');
        loadSkills();
      } catch (err: any) {
        showToast('Error adding skill: ' + err.message, 'error');
      }
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (window.desktopAPI?.deleteSkill) {
      try {
        await window.desktopAPI.deleteSkill(id);
        loadSkills();
      } catch (err: any) {
        showToast('Error: ' + err.message, 'error');
      }
    }
  };

  const handleUploadCv = async (category: string) => {
    if (window.desktopAPI?.uploadCv) {
      try {
        const res = await window.desktopAPI.uploadCv({
          title: `CV_${category}_2027.pdf`,
          category,
        });
        if (res.success) {
          showToast(`CV uploaded and registered successfully.`, 'success');
          loadDocuments();
        }
      } catch (err: any) {
        showToast('Upload error: ' + err.message, 'error');
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#090d16]">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            University Student Profile & Multi-Version Resumes
          </h3>
          <p className="text-xs text-slate-400">
            Configure your verified academic data once. The AI email generator pulls directly from here.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal & Contact Details */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              Personal & Contact Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your Full Name"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Preferred Contact Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@alunos.ipca.pt"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+351 912 345 678"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Academic & University Details */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              University & Degree (Portugal)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Degree Name</label>
                <input
                  type="text"
                  value={formData.degree || ''}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Higher Education Institution</label>
                <input
                  type="text"
                  value={formData.university || ''}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Campus Location</label>
                <input
                  type="text"
                  value={formData.campus_city || ''}
                  onChange={(e) => setFormData({ ...formData, campus_city: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Current Academic Year</label>
                <input
                  type="text"
                  value={formData.current_year || ''}
                  onChange={(e) => setFormData({ ...formData, current_year: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Internship Timeline & Dates */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Target Internship Placement Window (Spring 2027)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Preferred Start Date</label>
                <input
                  type="date"
                  value={formData.internship_start_preferred || '2027-03-01'}
                  onChange={(e) => setFormData({ ...formData, internship_start_preferred: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Preferred End Date</label>
                <input
                  type="date"
                  value={formData.internship_end_preferred || '2027-06-30'}
                  onChange={(e) => setFormData({ ...formData, internship_end_preferred: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Required Duration</label>
                <input
                  type="number"
                  value={formData.preferred_duration_months || 4}
                  onChange={(e) => setFormData({ ...formData, preferred_duration_months: parseInt(e.target.value, 10) })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Online Presence & Links */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Link className="w-4 h-4 text-cyan-400" />
              Online Presence & Public Verification
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  Portfolio URL
                </label>
                <input
                  type="url"
                  value={formData.portfolio_url || ''}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-purple-400" />
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.github_url || ''}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Email Signature */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Preferred Email Signature
            </h4>
            <textarea
              value={formData.signature || ''}
              onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
              className="w-full h-24 p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Right 1 Col: Skills & Multi-Version CVs */}
        <div className="space-y-5">
          {/* Multi-Version CV Manager */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Tailored CV Versions
            </h4>
            <p className="text-[11px] text-slate-400">
              Upload targeted resumes for different job families in Poland.
            </p>

            <div className="space-y-2.5">
              {[
                { cat: 'fullstack_web', label: 'Frontend / Web Development CV', desc: 'React, TypeScript, Next.js' },
                { cat: 'game_qa', label: 'Game QA & Testing CV', desc: 'Jira, Unreal Engine, Bug Reproduction' },
                { cat: 'ui_ux', label: 'UI/UX Design CV', desc: 'Figma, Design Systems, UX Research' },
              ].map((cv) => (
                <div
                  key={cv.cat}
                  className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200">{cv.label}</span>
                    <span className="text-[10px] text-slate-400 block">{cv.desc}</span>
                  </div>
                  <button
                    onClick={() => handleUploadCv(cv.cat)}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-[11px] font-semibold border border-indigo-500/30 flex items-center gap-1 transition"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                  </button>
                </div>
              ))}
            </div>

            {documents.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Uploaded Documents</span>
                {documents.map((doc) => (
                  <div key={doc.id} className="text-xs text-slate-300 font-mono flex items-center justify-between">
                    <span className="truncate max-w-[180px]">{doc.title}</span>
                    <span className="text-slate-500 text-[10px]">{(doc.file_size / 1024).toFixed(0)} KB</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technical Skills Catalog */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              Verified Skills Directory ({skills.length})
            </h4>

            {/* Add Skill Row */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New skill (e.g. Tailwind CSS)"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                />
                <button
                  onClick={handleAddSkill}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={newSkillCat}
                  onChange={(e) => setNewSkillCat(e.target.value)}
                  className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                >
                  <option value="Programming">Programming</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="GameDev">GameDev</option>
                  <option value="Design">Design</option>
                  <option value="Tools">Tools</option>
                </select>

                <select
                  value={newSkillProf}
                  onChange={(e) => setNewSkillProf(e.target.value)}
                  className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Existing Skills List */}
            <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto p-1">
              {skills.map((s) => (
                <div
                  key={s.id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs"
                >
                  <span>{s.name}</span>
                  <span className="text-[9px] text-slate-500 font-mono">({s.proficiency[0]})</span>
                  <button
                    onClick={() => handleDeleteSkill(s.id)}
                    className="text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
