import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Sparkles, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award, 
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';
import { 
  getCustomPortfolioData, 
  saveCustomPortfolioData, 
  CustomPortfolioData,
  getProjects,
  saveProjects,
  getCertifications,
  saveCertifications,
  getStudentSkills,
  updateStudentSkills
} from '../services/studentCareerService';
import { ProjectItem, CertificationItem, SkillItem } from '../types';
import { syncLocationAcrossApp } from '../utils/locationService';

interface EditPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const EditPortfolioModal: React.FC<EditPortfolioModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'projects' | 'experience' | 'certs'>('basic');

  // Form states initialized from storage
  const [portfolioData, setPortfolioData] = useState<CustomPortfolioData>(() => getCustomPortfolioData());
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() => getProjects());
  const [certsList, setCertsList] = useState<CertificationItem[]>(() => getCertifications());
  const [skillsList, setSkillsList] = useState<SkillItem[]>(() => getStudentSkills());

  // New item draft states
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillScore, setNewSkillScore] = useState(85);
  const [newSkillCategory, setNewSkillCategory] = useState<'technical' | 'soft' | 'domain'>('technical');

  if (!isOpen) return null;

  const handleSaveAll = () => {
    saveCustomPortfolioData(portfolioData);
    saveProjects(projectsList);
    saveCertifications(certsList);
    updateStudentSkills(skillsList);

    if (portfolioData.location) {
      syncLocationAcrossApp(portfolioData.location);
    }

    // Also sync standard localStorage profile if needed
    try {
      const stored = localStorage.getItem('sb_user_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.name = portfolioData.name || parsed.name;
        parsed.targetRole = portfolioData.role || parsed.targetRole;
        parsed.email = portfolioData.email || parsed.email;
        if (portfolioData.location) parsed.location = portfolioData.location;
        localStorage.setItem('sb_user_profile', JSON.stringify(parsed));
      }
    } catch (e) {
      // ignore
    }

    onSaved();
    onClose();
  };

  // Add project helper
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'New Engineering Project',
      type: 'Live Challenge',
      difficulty: 'Intermediate',
      domain: 'Full-Stack',
      duration: '3 Weeks',
      stipend: 'Open Source',
      requiredSkills: ['React', 'Node.js'],
      description: 'Engineered a scalable web application with modern tech stack and automated CI/CD pipeline.',
      deliverables: ['GitHub Repository', 'Live Deployed Demo', 'Architecture RFC'],
      status: 'Available',
      bountyReward: 1500,
      partnerCompany: 'Ladder Labs'
    };
    setProjectsList([newProj, ...projectsList]);
  };

  // Remove project helper
  const handleRemoveProject = (id: string) => {
    setProjectsList(projectsList.filter(p => p.id !== id));
  };

  // Add certification helper
  const handleAddCert = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'Certified Cloud Practitioner',
      issuer: 'AWS Training & Certification',
      issueDate: '2026-08',
      expiryDate: '2029-08',
      credentialId: `AWS-${Math.floor(100000 + Math.random() * 900000)}`,
      skillsVerified: ['Cloud Infrastructure', 'Security'],
      verificationUrl: 'https://aws.amazon.com/verification'
    };
    setCertsList([newCert, ...certsList]);
  };

  // Remove cert helper
  const handleRemoveCert = (id: string) => {
    setCertsList(certsList.filter(c => c.id !== id));
  };

  // Add skill helper
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSk: SkillItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      subCategory: 'Custom Competency',
      level: Math.min(5, Math.max(1, Math.round(newSkillScore / 20))),
      maxLevel: 5,
      score: Number(newSkillScore),
      requiredLevel: 4,
      verified: true,
      assessmentScore: Number(newSkillScore),
      lastAssessed: new Date().toISOString().split('T')[0],
      trend: 'up'
    };
    setSkillsList([...skillsList, newSk]);
    setNewSkillName('');
  };

  // Remove skill helper
  const handleRemoveSkill = (id: string) => {
    setSkillsList(skillsList.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#0E1538] border border-[#1E2964] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1E2964] flex items-center justify-between bg-[#0B1033]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit ATS Resume & Digital Portfolio</h2>
              <p className="text-xs text-slate-400">Update personal info, skills, projects, and verified credentials.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1E2964] bg-[#0A0E2A] px-6 overflow-x-auto">
          {[
            { id: 'basic', label: 'Personal & Contact', icon: User },
            { id: 'skills', label: 'Skills & DNA', icon: Code },
            { id: 'projects', label: 'Featured Projects', icon: Briefcase },
            { id: 'experience', label: 'Experience & Gigs', icon: GraduationCap },
            { id: 'certs', label: 'Certifications', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-300">
          {/* TAB 1: BASIC & CONTACT */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={portfolioData.name || ''}
                    onChange={e => setPortfolioData({ ...portfolioData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Adarsh Pratap Singh"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Professional Role</label>
                  <input
                    type="text"
                    value={portfolioData.role || ''}
                    onChange={e => setPortfolioData({ ...portfolioData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Full-Stack Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={portfolioData.email || ''}
                    onChange={e => setPortfolioData({ ...portfolioData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. adarsh.pratap@mjpru.ac.in"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={portfolioData.phone || ''}
                    onChange={e => setPortfolioData({ ...portfolioData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Location / Base City</label>
                  <input
                    type="text"
                    value={portfolioData.location || ''}
                    onChange={e => setPortfolioData({ ...portfolioData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Bareilly / Delhi NCR, India"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">College / University</label>
                  <input
                    type="text"
                    value={portfolioData.college || ''}
                    onChange={e => setPortfolioData({ ...portfolioData, college: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Mahatma Jyotiba Phule Rohilkhand University"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Degree & Major</label>
                  <input
                    type="text"
                    value={portfolioData.degree || ''}
                    onChange={e => setPortfolioData({ ...portfolioData, degree: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. B.Tech in Computer Science & IT"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">CGPA / Grade</label>
                  <input
                    type="text"
                    value={portfolioData.cgpa || ''}
                    onChange={e => setPortfolioData({ ...portfolioData, cgpa: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. 8.4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Professional Bio / ATS Summary</label>
                <textarea
                  rows={3}
                  value={portfolioData.bio || ''}
                  onChange={e => setPortfolioData({ ...portfolioData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Summarize your key technical strengths, engineering background, and career goals."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#1E2964]">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={portfolioData.githubUrl || ''}
                    onChange={e => setPortfolioData({ ...portfolioData, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={portfolioData.linkedinUrl || ''}
                    onChange={e => setPortfolioData({ ...portfolioData, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Portfolio / Website URL</label>
                  <input
                    type="text"
                    value={portfolioData.portfolioUrl || ''}
                    onChange={e => setPortfolioData({ ...portfolioData, portfolioUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="https://mywebsite.dev"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS & DNA */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="bg-[#0B1033] p-4 rounded-xl border border-[#1E2964] space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-400" /> Add New Skill / Competency
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Skill Name</label>
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={e => setNewSkillName(e.target.value)}
                      placeholder="e.g. Next.js, Rust, Kubernetes"
                      className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Category</label>
                    <select
                      value={newSkillCategory}
                      onChange={e => setNewSkillCategory(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="technical">Technical Competency</option>
                      <option value="soft">Soft / Communication</option>
                      <option value="domain">Domain / CS Core</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Proficiency Score: {newSkillScore}%</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="40"
                        max="100"
                        value={newSkillScore}
                        onChange={e => setNewSkillScore(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Active Verified Skills ({skillsList.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {skillsList.map(s => (
                    <div key={s.id} className="p-3 bg-[#0B1033] border border-[#1E2964] rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{s.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {s.category.toUpperCase()} • Level {s.level}/5 • {s.score}% Score
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(s.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Remove Skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Manage your featured engineering projects and challenges.</span>
                <button
                  onClick={handleAddProject}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>

              <div className="space-y-3">
                {projectsList.map((p, idx) => (
                  <div key={p.id} className="p-4 bg-[#0B1033] border border-[#1E2964] rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <label className="block text-[10px] text-slate-400 mb-1">Project Title</label>
                        <input
                          type="text"
                          value={p.title}
                          onChange={e => {
                            const updated = [...projectsList];
                            updated[idx].title = e.target.value;
                            setProjectsList(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white font-bold"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveProject(p.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Tech Stack (comma-separated)</label>
                        <input
                          type="text"
                          value={p.requiredSkills.join(', ')}
                          onChange={e => {
                            const updated = [...projectsList];
                            updated[idx].requiredSkills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setProjectsList(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Duration / Timeline</label>
                        <input
                          type="text"
                          value={p.duration}
                          onChange={e => {
                            const updated = [...projectsList];
                            updated[idx].duration = e.target.value;
                            setProjectsList(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Description & Key Achievements</label>
                      <textarea
                        rows={2}
                        value={p.description}
                        onChange={e => {
                          const updated = [...projectsList];
                          updated[idx].description = e.target.value;
                          setProjectsList(updated);
                        }}
                        className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE & MICRO-GIGS */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {(portfolioData.experiences || []).map((exp, idx) => (
                  <div key={exp.id} className="p-4 bg-[#0B1033] border border-[#1E2964] rounded-xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Role / Position</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={e => {
                            const updated = [...(portfolioData.experiences || [])];
                            updated[idx].role = e.target.value;
                            setPortfolioData({ ...portfolioData, experiences: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={e => {
                            const updated = [...(portfolioData.experiences || [])];
                            updated[idx].company = e.target.value;
                            setPortfolioData({ ...portfolioData, experiences: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Period (e.g. Jun 2026 – Aug 2026)</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={e => {
                            const updated = [...(portfolioData.experiences || [])];
                            updated[idx].period = e.target.value;
                            setPortfolioData({ ...portfolioData, experiences: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Type / Program</label>
                        <input
                          type="text"
                          value={exp.type}
                          onChange={e => {
                            const updated = [...(portfolioData.experiences || [])];
                            updated[idx].type = e.target.value;
                            setPortfolioData({ ...portfolioData, experiences: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Key Impact & Deliverables</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={e => {
                          const updated = [...(portfolioData.experiences || [])];
                          updated[idx].description = e.target.value;
                          setPortfolioData({ ...portfolioData, experiences: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFICATIONS */}
          {activeTab === 'certs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Verified credentials and hackathon achievements.</span>
                <button
                  onClick={handleAddCert}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Certification
                </button>
              </div>

              <div className="space-y-3">
                {certsList.map((c, idx) => (
                  <div key={c.id} className="p-4 bg-[#0B1033] border border-[#1E2964] rounded-xl flex items-center justify-between gap-4">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Certification Name</label>
                        <input
                          type="text"
                          value={c.name}
                          onChange={e => {
                            const updated = [...certsList];
                            updated[idx].name = e.target.value;
                            setCertsList(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Issuing Authority / Credential ID</label>
                        <input
                          type="text"
                          value={`${c.issuer} (${c.credentialId})`}
                          onChange={e => {
                            const updated = [...certsList];
                            updated[idx].issuer = e.target.value;
                            setCertsList(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCert(c.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Certification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#1E2964] bg-[#0B1033] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> Save Portfolio Changes
          </button>
        </div>
      </div>
    </div>
  );
};
