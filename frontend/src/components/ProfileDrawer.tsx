import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  Mail, 
  Hash, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Bell,
  Lock,
  UserCheck,
  Award,
  BarChart3,
  FileText,
  Bookmark,
  MapPin,
  Key,
  Compass,
  ArrowRight,
  Download,
  Sparkles,
  Layers,
  Clock,
  Code2
} from 'lucide-react';
import { StudentProfile, UserRole } from '../types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  currentRole: UserRole;
  onSaveProfile: (updated: Partial<StudentProfile>) => void;
  onNavigateTab?: (tab: string) => void;
}

const COURSE_OPTIONS = [
  'B.Tech AI & DS',
  'CSIT',
  'CSE',
  'IT',
  'Electronics & Communication (ECE)',
  'Electrical',
  'B.Tech Mechanical',
  'Civil',
  'Chemical',
  'BCA',
  'MCA'
];

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  student,
  currentRole,
  onSaveProfile,
  onNavigateTab
}) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // GPS Current Location
  const [currentLocation, setCurrentLocation] = useState<string>(() => {
    try {
      const p = JSON.parse(localStorage.getItem('student_profile') || '{}');
      return p.location || "Lucknow, Uttar Pradesh, India";
    } catch {
      return "Lucknow, Uttar Pradesh, India";
    }
  });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCourse, setEditCourse] = useState('B.Tech AI & DS');
  const [editYear, setEditYear] = useState('3rd Year (2025-29)');
  const [editRollNo, setEditRollNo] = useState('22001015001');
  const [editCollege, setEditCollege] = useState('Mahatma Jyotiba Phule Rohilkhand University, Bareilly');
  const [editEmail, setEditEmail] = useState('student@mjpru.ac.in');
  const [editTargetRole, setEditTargetRole] = useState('Full Stack Software Engineer');

  // Settings Modal State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsActiveView, setSettingsActiveView] = useState<'main' | 'account' | 'edit' | 'password' | 'notifications'>('main');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Sub-feature Modals State
  const [activeModal, setActiveModal] = useState<
    'dna' | 'roadmap' | 'certifications' | 'applications' | 'resume' | 'resources' | null
  >(null);

  // Auto Current Mobile Location (GPS)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.county ||
              "Lucknow";
            const state = data.address?.state || "Uttar Pradesh";
            const locationStr = `${city}, ${state}, India`;
            setCurrentLocation(locationStr);
            // also save to profile
            try {
              const p = JSON.parse(localStorage.getItem('student_profile') || '{}');
              p.location = locationStr;
              localStorage.setItem('student_profile', JSON.stringify(p));
            } catch (err) {
              console.warn('Storage sync issue:', err);
            }
          } catch {
            setCurrentLocation("Lucknow, Uttar Pradesh, India");
          }
        },
        () => {
          setCurrentLocation("Lucknow, Uttar Pradesh, India");
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    }
  }, []);

  // Load photo & user profile defaults from localStorage on mount / open
  useEffect(() => {
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
      setPhoto(savedPhoto);
    }
  }, [isOpen]);

  useEffect(() => {
    if (student) {
      setEditName(localStorage.getItem('userName') || student.name || 'Adarsh Pratap Singh');
      setEditCourse(localStorage.getItem('userCourse') || student.course || 'B.Tech AI & DS');
      setEditYear(localStorage.getItem('userYear') || student.batch || '3rd Year (2025-29)');
      setEditRollNo(localStorage.getItem('userRollNo') || student.rollNo || '22001015001');
      setEditCollege(localStorage.getItem('userCollege') || student.college || 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly');
      setEditEmail(localStorage.getItem('userEmail') || student.email || 'adarsh.pratap@mjpru.ac.in');
      setEditTargetRole(localStorage.getItem('userTargetRole') || student.targetRole || 'Full Stack Software Engineer');
    }
  }, [student, isOpen]);

  // Handle Esc key to close drawer and modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModal) {
          setActiveModal(null);
        } else if (isEditModalOpen) {
          setIsEditModalOpen(false);
        } else if (isSettingsModalOpen) {
          setIsSettingsModalOpen(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isEditModalOpen, isSettingsModalOpen, activeModal, onClose]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      try {
        localStorage.setItem('profilePhoto', base64);
        setPhoto(base64);
      } catch (err) {
        console.warn('LocalStorage quota limit reached for photo:', err);
        setPhoto(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userName', editName);
    localStorage.setItem('userCourse', editCourse);
    localStorage.setItem('userYear', editYear);
    localStorage.setItem('userRollNo', editRollNo);
    localStorage.setItem('userCollege', editCollege);
    localStorage.setItem('userEmail', editEmail);
    localStorage.setItem('userTargetRole', editTargetRole);

    onSaveProfile({
      name: editName,
      course: editCourse,
      batch: editYear,
      rollNo: editRollNo,
      college: editCollege,
      email: editEmail,
      targetRole: editTargetRole
    });

    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!isOpen) return null;

  const displayName = localStorage.getItem('userName') || student?.name || 'Adarsh Pratap Singh';
  const displayRole = localStorage.getItem('userTargetRole') || student?.targetRole || 'Full Stack Software Engineer';
  const displayCourse = localStorage.getItem('userCourse') || student?.course || 'B.Tech AI & DS';
  const displayYear = localStorage.getItem('userYear') || student?.batch || '3rd Year (2025-29)';
  const displayCollege = localStorage.getItem('userCollege') || student?.college || 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly';
  const displayRollNo = localStorage.getItem('userRollNo') || student?.rollNo || '22001015001';
  const displayEmail = localStorage.getItem('userEmail') || student?.email || 'adarsh.pratap@mjpru.ac.in';
  const dnaScoreValue = student?.experienceScore ? Math.round((student.experienceScore * 84) / 64) : 84;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-xs"
      />

      {/* Left Drawer Panel: 320px width (w-80), 100vh, bg-[#12162C] */}
      <div className="fixed left-0 top-0 w-80 h-full bg-[#12162C] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out border-r border-[#1E264F] overflow-hidden">
        {/* Top bar with close button */}
        <div className="p-4 border-b border-[#1C244D] flex items-center justify-between bg-[#0E132A]">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#A78BFA] flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#7C5CFC]" />
            Professional Profile
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A2248] transition-colors cursor-pointer"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* A) PHOTO WITH UPLOAD FROM MEDIA */}
          <div className="flex flex-col items-center text-center pt-1">
            <div className="relative w-[72px] h-[72px]">
              {photo ? (
                <img 
                  src={photo} 
                  alt="Profile"
                  className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-gray-400 object-cover shadow-md" 
                />
              ) : (
                <div className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-gray-400 bg-[#E5E7EB] flex items-center justify-center shadow-md">
                  <UserIcon className="w-9 h-9 text-[#6B7280]" />
                </div>
              )}

              <button 
                onClick={() => photoInputRef.current?.click()} 
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#7C5CFC] hover:bg-[#6D4AE8] rounded-full flex items-center justify-center border-2 border-[#12162C] transition-transform active:scale-95 shadow cursor-pointer"
                title="Upload Photo"
              >
                <Plus size={14} color="white" />
              </button>
            </div>
            
            <input 
              ref={photoInputRef} 
              type="file" 
              accept="image/*" 
              hidden 
              onChange={handleUpload} 
            />

            {uploadError && (
              <p className="text-[11px] text-rose-400 mt-2">{uploadError}</p>
            )}

            {/* B) Profile Identity Details */}
            <div className="mt-3 w-full">
              <h2 className="text-base font-extrabold text-white leading-tight">
                {displayName}
              </h2>
              <p className="text-xs font-semibold text-[#A78BFA] mt-0.5">
                {displayCourse} · {displayRole}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                {displayCollege}
              </p>

              {/* GPS Location Row */}
              <div className="flex items-center gap-1.5 justify-center mt-1.5 text-xs text-slate-300">
                <MapPin size={14} color="#7C5CFC" />
                <span className="truncate max-w-[240px]">{currentLocation}</span>
              </div>
            </div>
          </div>

          {/* Quick Academic Meta Pill Cards */}
          <div className="p-3 rounded-xl bg-[#0B0F24] border border-[#1C2552] space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Hash className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-slate-400 font-medium">Roll No:</span>
              <span className="font-bold font-mono text-slate-200 ml-auto">{displayRollNo}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="text-slate-400 font-medium">Email:</span>
              <span className="font-semibold text-slate-300 ml-auto truncate max-w-[140px]" title={displayEmail}>{displayEmail}</span>
            </div>
          </div>

          {/* C) EDIT BUTTON (Dashed like requested) */}
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="w-full border border-dashed border-[#9CA3AF] rounded-lg py-2.5 text-sm text-[#9CA3AF] hover:text-white hover:border-white transition-all flex items-center justify-center gap-2 cursor-pointer bg-[#141935]/40 hover:bg-[#141935]"
          >
            + Edit Profile / Experience
          </button>

          {/* 6 NAVIGATION ROWS */}
          <div className="rounded-xl overflow-hidden bg-[#0D122E] border border-white/[0.06] mt-3 divide-y divide-white/[0.06]">
            {/* 1. My Skill DNA Score */}
            <button
              onClick={() => setActiveModal('dna')}
              style={{
                padding: '14px 16px',
                fontSize: '14px',
                color: '#D1D5DB',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
              }}
              className="w-full flex items-center justify-between hover:bg-[#7C5CFC]/[0.08] transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={18} color="#9CA3AF" className="group-hover:text-[#A78BFA] transition-colors shrink-0" />
                <span className="font-medium">My Skill DNA Score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {dnaScoreValue}/100
                </span>
                <ChevronRight size={16} color="#4B5563" className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 2. My Learning Path */}
            <button
              onClick={() => setActiveModal('roadmap')}
              style={{
                padding: '14px 16px',
                fontSize: '14px',
                color: '#D1D5DB',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
              }}
              className="w-full flex items-center justify-between hover:bg-[#7C5CFC]/[0.08] transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3">
                <GraduationCap size={18} color="#9CA3AF" className="group-hover:text-cyan-400 transition-colors shrink-0" />
                <span className="font-medium">My Learning Path</span>
              </div>
              <ChevronRight size={16} color="#4B5563" className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 3. Certifications & Badges */}
            <button
              onClick={() => setActiveModal('certifications')}
              style={{
                padding: '14px 16px',
                fontSize: '14px',
                color: '#D1D5DB',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
              }}
              className="w-full flex items-center justify-between hover:bg-[#7C5CFC]/[0.08] transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3">
                <Award size={18} color="#9CA3AF" className="group-hover:text-amber-400 transition-colors shrink-0" />
                <span className="font-medium">Certifications & Badges</span>
              </div>
              <ChevronRight size={16} color="#4B5563" className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 4. Applications & Jobs */}
            <button
              onClick={() => setActiveModal('applications')}
              style={{
                padding: '14px 16px',
                fontSize: '14px',
                color: '#D1D5DB',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
              }}
              className="w-full flex items-center justify-between hover:bg-[#7C5CFC]/[0.08] transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3">
                <Briefcase size={18} color="#9CA3AF" className="group-hover:text-pink-400 transition-colors shrink-0" />
                <span className="font-medium">Applications & Jobs</span>
              </div>
              <ChevronRight size={16} color="#4B5563" className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 5. Resume & Portfolio */}
            <button
              onClick={() => setActiveModal('resume')}
              style={{
                padding: '14px 16px',
                fontSize: '14px',
                color: '#D1D5DB',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
              }}
              className="w-full flex items-center justify-between hover:bg-[#7C5CFC]/[0.08] transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} color="#9CA3AF" className="group-hover:text-indigo-400 transition-colors shrink-0" />
                <span className="font-medium">Resume & Portfolio</span>
              </div>
              <ChevronRight size={16} color="#4B5563" className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 6. Saved Resources */}
            <button
              onClick={() => setActiveModal('resources')}
              style={{
                padding: '14px 16px',
                fontSize: '14px',
                color: '#D1D5DB'
              }}
              className="w-full flex items-center justify-between hover:bg-[#7C5CFC]/[0.08] transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3">
                <Bookmark size={18} color="#9CA3AF" className="group-hover:text-emerald-400 transition-colors shrink-0" />
                <span className="font-medium">Saved Resources</span>
              </div>
              <ChevronRight size={16} color="#4B5563" className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* E) BOTTOM: Settings row with Gear icon (no emoji) */}
        <div className="p-4 border-t border-[#1C244D] bg-[#0E132A]">
          <button
            onClick={() => {
              setSettingsActiveView('main');
              setIsSettingsModalOpen(true);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#141A3B] border border-[#212C63] hover:border-[#7C5CFC] text-slate-300 hover:text-white transition-all text-xs font-bold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#A78BFA]" />
              <span>Settings & Privacy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#101633] border border-[#232F6E] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 sm:p-5 border-b border-[#1D275A] flex items-center justify-between bg-[#0C1128]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7C5CFC]/20 border border-[#7C5CFC]/40 flex items-center justify-center text-[#A78BFA]">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Edit Profile & Academic Identity</h3>
                  <p className="text-[11px] text-slate-400">Update your student information and course details</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2552]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#090D24] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                  placeholder="e.g. Adarsh Pratap Singh"
                />
              </div>

              {/* Target Role / Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Professional Role / Headline</label>
                <input
                  type="text"
                  value={editTargetRole}
                  onChange={(e) => setEditTargetRole(e.target.value)}
                  className="w-full bg-[#090D24] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                  placeholder="e.g. Full Stack Software Engineer"
                />
              </div>

              {/* Course Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Course / Specialization *</label>
                <select
                  value={editCourse}
                  onChange={(e) => setEditCourse(e.target.value)}
                  className="w-full bg-[#090D24] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none cursor-pointer"
                >
                  {COURSE_OPTIONS.map((c) => (
                    <option key={c} value={c} className="bg-[#101633] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year & Roll No Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Year / Cohort</label>
                  <input
                    type="text"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full bg-[#090D24] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                    placeholder="e.g. 3rd Year (2025-29)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">University Roll No</label>
                  <input
                    type="text"
                    value={editRollNo}
                    onChange={(e) => setEditRollNo(e.target.value)}
                    className="w-full bg-[#090D24] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                    placeholder="e.g. 22001015001"
                  />
                </div>
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Affiliated College / University</label>
                <input
                  type="text"
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  className="w-full bg-[#090D24] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                  placeholder="e.g. Mahatma Jyotiba Phule Rohilkhand University, Bareilly"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#090D24] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                  placeholder="e.g. student@mjpru.ac.in"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#1D275A] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141A3B] border border-[#212C63] text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SETTINGS & PRIVACY MODAL (Contains: Account Settings, Edit Profile, Change Password, Notifications, Logout red) */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#101633] border border-[#232F6E] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 sm:p-5 border-b border-[#1D275A] flex items-center justify-between bg-[#0C1128]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7C5CFC]/20 border border-[#7C5CFC]/40 flex items-center justify-center text-[#A78BFA]">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Settings & Privacy</h3>
                  <p className="text-[11px] text-slate-400">Account management & security options</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2552]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              {/* 1. Account Settings */}
              <div className="p-3.5 rounded-xl bg-[#090D24] border border-[#1E2964] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <UserIcon className="w-4 h-4 text-[#A78BFA]" />
                  <span>Account Settings</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Student ID: <span className="text-slate-200 font-mono">STU-2026-081</span> · Synced with MJPRU & SIH Portal
                </p>
              </div>

              {/* 2. Edit Profile Shortcut */}
              <button
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  setIsEditModalOpen(true);
                }}
                className="w-full p-3.5 rounded-xl bg-[#090D24] border border-[#1E2964] hover:border-[#7C5CFC] flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-xs font-bold text-white">Edit Academic Profile</span>
                    <p className="text-[11px] text-slate-400">Update course, roll number, and bio</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* 3. Change Password */}
              <div className="p-3.5 rounded-xl bg-[#090D24] border border-[#1E2964] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Change Password</span>
                </div>
                <div className="space-y-1.5">
                  <input
                    type="password"
                    placeholder="New password (min 8 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-[#7C5CFC]"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-[#7C5CFC]"
                  />
                  <button
                    onClick={() => {
                      if (newPassword && newPassword === confirmPassword) {
                        setPasswordSuccess(true);
                        setTimeout(() => setPasswordSuccess(false), 3000);
                        setNewPassword('');
                        setConfirmPassword('');
                      }
                    }}
                    className="px-3 py-1 bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                  {passwordSuccess && (
                    <span className="text-[11px] text-emerald-400 font-semibold ml-2">✓ Password updated</span>
                  )}
                </div>
              </div>

              {/* 4. Notifications */}
              <div className="p-3.5 rounded-xl bg-[#090D24] border border-[#1E2964] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span>Notifications</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Real-time micro-gig alerts, mentor capsule approvals, and recruiter outreach active.
                </p>
              </div>

              {/* 5. Logout button (Red #EF4444) */}
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-[#EF4444]/10 hover:bg-[#EF4444] border border-[#EF4444]/40 hover:border-[#EF4444] text-[#EF4444] hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Clear Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6 SUB-FEATURE MODALS */}
      {/* 1. Skill DNA Score Modal */}
      {activeModal === 'dna' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#101633] border border-[#232F6E] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 sm:p-5 border-b border-[#1D275A] flex items-center justify-between bg-[#0C1128]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-[#A78BFA]">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Skill DNA Score breakdown</h3>
                  <p className="text-[11px] text-slate-400">Overall Readiness: {dnaScoreValue}/100 · Top 8th Percentile</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2552]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {[
                { name: 'Algorithmic Thinking', score: 88, color: 'from-purple-500 to-indigo-500' },
                { name: 'System Design & Distributed Systems', score: 78, color: 'from-cyan-500 to-blue-500' },
                { name: 'Code Quality & Clean Architecture', score: 86, color: 'from-emerald-500 to-teal-500' },
                { name: 'Communication & Technical PRs', score: 82, color: 'from-amber-500 to-orange-500' },
                { name: 'Problem Solving & Debug Velocity', score: 90, color: 'from-pink-500 to-rose-500' },
                { name: 'Adaptability & AI Tooling', score: 85, color: 'from-violet-500 to-purple-500' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#090D24] border border-[#1E2964] space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{item.name}</span>
                    <span className="text-[#A78BFA] font-bold">{item.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#141B48] overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    if (onNavigateTab) onNavigateTab('skills');
                  }}
                  className="px-4 py-2 bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <span>Open Full Skill Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Learning Roadmap Modal */}
      {activeModal === 'roadmap' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#101633] border border-[#232F6E] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 sm:p-5 border-b border-[#1D275A] flex items-center justify-between bg-[#0C1128]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">My Learning Path & Milestones</h3>
                  <p className="text-[11px] text-slate-400">AI-curated trajectory to ₹14.5 – ₹22 LPA Placement</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2552]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {[
                { month: 'Sep 2026', title: 'Complete 3 Verified Micro-Internships', status: 'Completed', color: 'text-emerald-400 bg-emerald-500/10' },
                { month: 'Nov 2026', title: 'Attend 5 Mentor Capsules with Senior Architects', status: 'In Progress (3/5)', color: 'text-cyan-400 bg-cyan-500/10' },
                { month: 'Jan 2027', title: 'Deploy Cloud-Native Distributed Microservice', status: 'Upcoming', color: 'text-amber-400 bg-amber-500/10' },
                { month: 'Apr 2027', title: 'Participate in Pre-Placement Partner Hackathons', status: 'Upcoming', color: 'text-purple-400 bg-purple-500/10' }
              ].map((m, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#090D24] border border-[#1E2964] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.month}</span>
                    <h4 className="text-xs font-bold text-white">{m.title}</h4>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md ${m.color}`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Certifications & Badges Modal */}
      {activeModal === 'certifications' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#101633] border border-[#232F6E] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 sm:p-5 border-b border-[#1D275A] flex items-center justify-between bg-[#0C1128]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Certifications & Cryptographic Badges</h3>
                  <p className="text-[11px] text-slate-400">Blockchain-verified credentials & zero-NDA simulator proofs</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2552]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {[
                { title: 'Zero-Leak JWT Middleware & Revocation List', issuer: 'Infosys Springboard', date: 'Aug 2026', hash: '0x8f2a...9c41' },
                { title: 'PostgreSQL Distributed Sharding & Composite Index', issuer: 'TCS Industry Sprint', date: 'Jul 2026', hash: '0x4d1e...7b82' },
                { title: 'Micro-Internship Bounty: React 18 Concurrent Rendering', issuer: 'CloudSphere Labs', date: 'Jun 2026', hash: '0x1a9c...3f02' }
              ].map((cert, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#090D24] border border-[#1E2964] flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-white">{cert.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">{cert.issuer} · Issued {cert.date}</p>
                    <p className="text-[10px] font-mono text-cyan-400">Ledger Hash: {cert.hash}</p>
                  </div>
                </div>
              ))}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    if (onNavigateTab) onNavigateTab('passport');
                  }}
                  className="px-4 py-2 bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <span>Open Full Experience Passport</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Applications & Jobs Modal */}
      {activeModal === 'applications' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#101633] border border-[#232F6E] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 sm:p-5 border-b border-[#1D275A] flex items-center justify-between bg-[#0C1128]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Applications & Job Tracker</h3>
                  <p className="text-[11px] text-slate-400">Status of micro-gigs, ghost tasks & recruiter interviews</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2552]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {[
                { role: 'Backend API Engineer (Micro-Gig)', company: 'Wipro Digital', stipend: '₹3,500', status: 'Under Review', badge: 'bg-amber-500/10 text-amber-300' },
                { role: 'Full Stack Spring Boot Dev', company: 'TCS Placement Portal', stipend: '₹4,500', status: 'Shortlisted for PPO', badge: 'bg-emerald-500/10 text-emerald-300' },
                { role: '15-Min Capsule Session', company: 'Amit Verma (Senior Architect)', stipend: 'Mentorship', status: 'Confirmed (Friday 5:15 PM)', badge: 'bg-cyan-500/10 text-cyan-300' }
              ].map((app, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#090D24] border border-[#1E2964] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{app.role}</h4>
                    <p className="text-[11px] text-slate-400">{app.company} · {app.stipend}</p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md ${app.badge}`}>
                    {app.status}
                  </span>
                </div>
              ))}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    if (onNavigateTab) onNavigateTab('gigs');
                  }}
                  className="px-4 py-2 bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <span>Explore Open Gigs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Resume & Portfolio Modal */}
      {activeModal === 'resume' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#101633] border border-[#232F6E] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 sm:p-5 border-b border-[#1D275A] flex items-center justify-between bg-[#0C1128]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Dynamic ATS Resume & Portfolio</h3>
                  <p className="text-[11px] text-slate-400">Real-time auto-generated PDF with verified cryptographic badges</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2552]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="p-4 rounded-xl bg-[#090D24] border border-[#1E2964] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-white">Adarsh Pratap Singh · ATS Resume</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">ATS Score: 94/100</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Includes 3 verified enterprise micro-internships, 6 verified skill badges, and GitHub code proofs.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      alert('Downloading ATS Resume (PDF) with embedded cryptographic verification URLs.');
                    }}
                    className="px-4 py-2 bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ATS Resume (PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Saved Resources Modal */}
      {activeModal === 'resources' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#101633] border border-[#232F6E] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 sm:p-5 border-b border-[#1D275A] flex items-center justify-between bg-[#0C1128]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Saved Resources & Architecture Guides</h3>
                  <p className="text-[11px] text-slate-400">Saved masterclasses, repository snippets & interview guides</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2552]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {[
                { title: 'Distributed Systems & Database Sharding Patterns', type: 'Architecture Masterclass (45 mins)', author: 'Amit Verma (TCS Architect)' },
                { title: 'Zero-Leak JWT & Redis Revocation List Implementations', type: 'Production Code Boilerplate', author: 'Infosys Springboard' },
                { title: 'Top 50 Behavioral & System Design Interview Questions', type: 'Placement Blueprint 2026', author: 'MJPRU Placement Cell' }
              ].map((res, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#090D24] border border-[#1E2964] space-y-1">
                  <h4 className="text-xs font-bold text-white">{res.title}</h4>
                  <p className="text-[11px] text-slate-400">{res.type} · {res.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
