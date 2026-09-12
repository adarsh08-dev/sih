import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  RefreshCw,
  Sparkles,
  Key,
  Compass,
  ArrowRight,
  Download,
  Layers,
  Clock,
  Check,
  Camera,
  Info,
  Edit2
} from 'lucide-react';
import { StudentProfile, UserRole } from '../types';
import { detectAccurateLocation, syncLocationAcrossApp, normalizeLocationString } from '../utils/locationService';

export interface UserProfileData {
  name: string;
  rollNo?: string;
  email: string;
  department?: string;
  dept?: string;
  college?: string;
  year?: string;
  role?: string;
  type?: string;
  company?: string;
  location?: string;
  lat?: number;
  lng?: number;
  photo?: string | null;
}

export const getStoredUserProfile = (): UserProfileData => {
  let p: any = {
    name: 'Adarsh Pratap Singh',
    rollNo: '22001015001',
    email: 'adarsh.pratap@mjpru.ac.in',
    department: 'Computer Science & IT',
    college: 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly',
    year: '2025-29',
    role: 'student',
    type: 'Student Candidate',
    location: 'Bareilly, Uttar Pradesh, India'
  };

  try {
    const raw = localStorage.getItem('userProfile');
    if (raw) {
      const parsed = JSON.parse(raw);
      p = { ...p, ...parsed };
    }
  } catch (err) {
    console.warn('Error reading userProfile:', err);
  }

  const photo = localStorage.getItem('userPhoto') || localStorage.getItem('profilePhoto');
  if (photo) p.photo = photo;

  const loc = localStorage.getItem('userLocation');
  if (loc) p.location = loc;

  // Geographic state normalization
  if (p.location && typeof p.location === 'string') {
    const parts = p.location.split(',').map((s: string) => s.trim());
    if (parts.length >= 2) {
      p.location = normalizeLocationString(parts[0], parts[1], parts[2]);
    }
  }

  const savedRole = localStorage.getItem('userRole') || localStorage.getItem('role');
  if (savedRole) {
    p.role = savedRole;
  }

  return p;
};

interface ProfessionalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  student?: StudentProfile | null;
  currentRole?: UserRole;
  onSaveProfile?: (updated: Partial<StudentProfile>) => void;
  onNavigateTab?: (tab: string) => void;
}

export const ProfessionalProfile: React.FC<ProfessionalProfileProps> = ({
  isOpen,
  onClose,
  student,
  currentRole = 'student',
  onSaveProfile,
  onNavigateTab
}) => {
  const [p, setP] = useState<UserProfileData>(getStoredUserProfile);
  const [isLocationRefreshing, setIsLocationRefreshing] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState('');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(p.name);
  const [editDepartment, setEditDepartment] = useState(p.department || p.dept || '');
  const [editCollege, setEditCollege] = useState(p.college || '');
  const [editRollNo, setEditRollNo] = useState(p.rollNo || '');
  const [editEmail, setEditEmail] = useState(p.email);
  const [editYear, setEditYear] = useState(p.year || '');
  const [editCompany, setEditCompany] = useState(p.company || '');

  // Sub-feature Modals State
  const [activeModal, setActiveModal] = useState<
    'dna' | 'roadmap' | 'certifications' | 'applications' | 'settings' | null
  >(null);

  // Sync on open
  useEffect(() => {
    if (isOpen) {
      const fresh = getStoredUserProfile();
      setP(fresh);
      setEditName(fresh.name);
      setEditDepartment(fresh.department || fresh.dept || '');
      setEditCollege(fresh.college || '');
      setEditRollNo(fresh.rollNo || '');
      setEditEmail(fresh.email);
      setEditYear(fresh.year || '');
      setEditCompany(fresh.company || '');
    }
  }, [isOpen]);

  const handleManualLocationSubmit = (customLoc?: string) => {
    const locToSave = (customLoc || tempLocation || '').trim();
    if (!locToSave) return;
    
    // Normalize string if formatted with commas
    const parts = locToSave.split(',').map(s => s.trim());
    const normalized = parts.length >= 2 ? normalizeLocationString(parts[0], parts[1], parts[2]) : locToSave;

    const updatedProfile = { ...p, location: normalized };
    syncLocationAcrossApp(normalized);
    setP(updatedProfile);
    setIsManualLocation(false);
    setLocationError(null);
    setLocationSuccess(true);
    setTimeout(() => setLocationSuccess(false), 2500);
  };

  // GPS & Network Geolocation refresh function
  const refreshLocation = useCallback(async () => {
    setIsLocationRefreshing(true);
    setLocationSuccess(false);
    setLocationError(null);

    try {
      const result = await detectAccurateLocation();
      const newLoc = result.location;

      const updatedProfile = {
        ...p,
        location: newLoc,
        lat: result.lat,
        lng: result.lng
      };
      
      syncLocationAcrossApp(newLoc, result.lat, result.lng);
      setP(updatedProfile);
      setLocationSuccess(true);
      setTimeout(() => setLocationSuccess(false), 3000);
    } catch (err: any) {
      console.error('Geolocation Error:', err);
      setLocationError(err?.message || 'Unable to detect GPS. Click to edit manually.');
    } finally {
      setIsLocationRefreshing(false);
    }
  }, [p]);

  // Instant Photo Edit from Profile Drawer
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      localStorage.setItem('userPhoto', base64);
      localStorage.setItem('profilePhoto', base64);
      const updated = { ...p, photo: base64 };
      localStorage.setItem('userProfile', JSON.stringify(updated));
      setP(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...p,
      name: editName,
      department: editDepartment,
      college: editCollege,
      rollNo: editRollNo,
      email: editEmail,
      year: editYear,
      company: editCompany
    };
    localStorage.setItem('userProfile', JSON.stringify(updated));
    localStorage.setItem('userName', editName);
    localStorage.setItem('userEmail', editEmail);
    if (editRollNo) localStorage.setItem('userRollNo', editRollNo);
    if (editDepartment) localStorage.setItem('userCourse', editDepartment);
    if (editCollege) localStorage.setItem('userCollege', editCollege);
    if (editYear) localStorage.setItem('userYear', editYear);

    setP(updated);

    if (onSaveProfile) {
      onSaveProfile({
        name: editName,
        course: editDepartment,
        college: editCollege,
        rollNo: editRollNo,
        email: editEmail,
        batch: editYear
      });
    }

    setIsEditModalOpen(false);
  };

  // Close on Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModal) setActiveModal(null);
        else if (isEditModalOpen) setIsEditModalOpen(false);
        else if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isEditModalOpen, activeModal, onClose]);

  const isHOD = (p.role || '').toLowerCase().includes('hod') || currentRole === 'hod';
  const isMentor = (p.role || '').toLowerCase().includes('mentor') || currentRole === 'mentor';
  const isStudent = !isHOD && !isMentor;

  const getSubtitle = () => {
    if (isHOD) return `HOD - ${p.department || p.dept || 'CSIT'}`;
    if (isMentor) return `Mentor - ${p.company || 'Enterprise Partner'}`;
    return `${p.department || 'Computer Science & IT'} · Full Stack Software Engineer`;
  };

  const roleLabel = isHOD ? 'HOD / Faculty' : isMentor ? 'Industry Mentor' : 'Student Candidate';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none font-sans">
          {/* Backdrop with fade animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10 pointer-events-none">
            <motion.div 
              initial={{ x: '-100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0.9 }}
              transition={{ type: 'spring', damping: 26, stiffness: 240, mass: 0.8 }}
              className="w-screen max-w-md bg-[#0B0E1A] border-r border-[#5E3A5C]/40 shadow-2xl flex flex-col justify-between text-[#F3E9EC] pointer-events-auto font-sans"
            >
              
              {/* Scrollable Main Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 sidebar-scrollbar">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#B47A9A] tracking-[1.6px] uppercase">
                      PROFESSIONAL PROFILE
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2C1B2F] text-[#F3E9EC]/70 font-semibold border border-[#5E3A5C] flex items-center gap-1">
                      🔒 {p.role || currentRole}
                    </span>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-1.5 rounded-xl bg-[#2C1B2F] hover:bg-[#5E3A5C] text-[#F3E9EC]/60 hover:text-[#F3E9EC] border border-[#5E3A5C] transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

            {/* Profile Avatar Card */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              {/* Avatar */}
              <div className="relative">
                <div className="w-[84px] h-[84px] rounded-full border-2 border-dashed border-[#5E3A5C] p-[3px] flex items-center justify-center bg-[#2C1B2F] shadow-inner">
                  {p.photo ? (
                    <img 
                      src={p.photo} 
                      alt={p.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#00030E] flex items-center justify-center text-[#F3E9EC]/50">
                      <UserIcon className="w-9 h-9" />
                    </div>
                  )}
                </div>

                {/* Edit Photo + Button */}
                <input 
                  type="file" 
                  accept="image/*" 
                  id="profilePhotoEdit" 
                  className="hidden" 
                  onChange={handleProfilePhotoChange} 
                />
                <label
                  htmlFor="profilePhotoEdit"
                  className="absolute bottom-0 right-0 w-[26px] h-[26px] rounded-full bg-[#5E3A5C] hover:bg-[#B47A9A] text-[#F3E9EC] flex items-center justify-center shadow-lg border-2 border-[#0B0E1A] cursor-pointer transition-all hover:scale-110 active:scale-95"
                  title="Upload Photo"
                >
                  <Plus className="w-3.5 h-3.5" />
                </label>
              </div>

              {/* Name & Subtitle */}
              <div>
                <h3 className="text-lg font-bold text-[#F3E9EC]">
                  {p.name || 'Adarsh Pratap Singh'}
                </h3>
                <p className="text-xs text-[#B47A9A] font-medium mt-0.5">
                  {getSubtitle()}
                </p>
                <p className="text-[11px] text-[#F3E9EC]/50 mt-0.5 truncate max-w-[320px]">
                  {p.college || 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly'}
                </p>
              </div>

              {/* Location Row */}
              <div className="flex flex-col items-center gap-2">
                {isManualLocation ? (
                  <div className="flex flex-col items-center gap-2 mt-1">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2C1B2F] border border-[#B47A9A]/40 shadow-md">
                      <input
                        type="text"
                        autoFocus
                        className="bg-transparent text-xs text-[#F3E9EC] placeholder-[#F3E9EC]/40 outline-none w-48 font-medium"
                        placeholder="e.g. Bareilly, Uttar Pradesh, India"
                        value={tempLocation}
                        onChange={(e) => setTempLocation(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleManualLocationSubmit()}
                      />
                      <button
                        onClick={() => handleManualLocationSubmit()}
                        className="bg-[#5E3A5C] text-[#F3E9EC] p-1 rounded-full hover:bg-[#B47A9A] transition-colors"
                        title="Save location"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setIsManualLocation(false)}
                        className="text-[#F3E9EC]/40 hover:text-[#F3E9EC] px-1"
                        title="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Quick City Presets */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xs">
                      {[
                        'Bareilly, Uttar Pradesh, India',
                        'Lucknow, Uttar Pradesh, India',
                        'Delhi NCR, India',
                        'Bengaluru, Karnataka, India',
                        'Pune, Maharashtra, India',
                        'Remote / Worldwide'
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleManualLocationSubmit(preset)}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[#2C1B2F] hover:bg-[#5E3A5C] text-[#F3E9EC]/70 hover:text-[#F3E9EC] border border-[#5E3A5C] transition-colors"
                        >
                          {preset.split(',')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2C1B2F] border border-[#5E3A5C] mt-1 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B47A9A] animate-pulse" />
                    <span 
                      onClick={() => {
                        setTempLocation(p.location || '');
                        setIsManualLocation(true);
                      }}
                      className="text-xs text-[#F3E9EC]/80 hover:text-[#F3E9EC] font-medium cursor-pointer transition-colors flex items-center gap-1"
                      title="Click to edit location"
                    >
                      {p.location || 'Bareilly, Uttar Pradesh, India'}
                      <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity ml-0.5 text-[#F3E9EC]/50" />
                    </span>
                    <button
                      type="button"
                      onClick={refreshLocation}
                      disabled={isLocationRefreshing}
                      className="w-[26px] h-[26px] rounded-full bg-[#0B0E1A] border border-[#5E3A5C] flex items-center justify-center text-[#F3E9EC]/50 hover:bg-[#5E3A5C] hover:text-[#F3E9EC] transition-all hover:scale-105 active:scale-95 cursor-pointer ml-1"
                      title="Auto-detect Live GPS / Network Location"
                    >
                      {locationSuccess ? (
                        <Check className="w-3 h-3 text-[#B47A9A]" />
                      ) : (
                        <RefreshCw className={`w-3 h-3 ${isLocationRefreshing ? 'animate-spin text-[#B47A9A]' : ''}`} />
                      )}
                    </button>
                  </div>
                )}

                {locationError && !isManualLocation && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 max-w-[280px]">
                      <Info className="w-3 h-3 shrink-0" />
                      <span className="truncate">{locationError}</span>
                      <button 
                        onClick={() => {
                          setTempLocation(p.location || '');
                          setIsManualLocation(true);
                        }}
                        className="underline hover:text-white ml-1 font-bold whitespace-nowrap"
                      >
                        Edit Manually
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-[#2C1B2F] border border-[#5E3A5C] rounded-xl p-3.5 space-y-2.5 shadow-inner">
              {isStudent && (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#F3E9EC]/40 uppercase tracking-wider font-semibold text-[10px]">
                      # Roll Number
                    </span>
                    <span className="font-mono text-[#F3E9EC] font-medium">
                      {p.rollNo || '22001015001'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#F3E9EC]/40 uppercase tracking-wider font-semibold text-[10px]">
                      Academic Batch
                    </span>
                    <span className="text-[#F3E9EC]/80">
                      {p.year || '2025-29'}
                    </span>
                  </div>
                </>
              )}

              {isHOD && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#F3E9EC]/40 uppercase tracking-wider font-semibold text-[10px]">
                    Department
                  </span>
                  <span className="text-[#F3E9EC] font-medium">
                    {p.department || p.dept || 'Computer Science & IT'}
                  </span>
                </div>
              )}

              {isMentor && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#F3E9EC]/40 uppercase tracking-wider font-semibold text-[10px]">
                    Company
                  </span>
                  <span className="text-[#F3E9EC] font-medium">
                    {p.company || 'TCS Enterprise'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F3E9EC]/40 uppercase tracking-wider font-semibold text-[10px]">
                  Email
                </span>
                <span className="text-[#F3E9EC]/80 truncate max-w-[220px]">
                  {p.email}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F3E9EC]/40 uppercase tracking-wider font-semibold text-[10px]">
                  Institution / Affiliation
                </span>
                <span className="text-[#F3E9EC]/80 truncate max-w-[200px] text-right">
                  {p.college || 'MJPRU Bareilly'}
                </span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#5E3A5C] hover:border-[#B47A9A] hover:bg-[#5E3A5C]/20 text-xs font-semibold text-[#F3E9EC]/80 hover:text-[#F3E9EC] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#B47A9A]" />
              <span>+ Edit Profile / Experience</span>
            </button>

            {/* Menu Items */}
            <div className="space-y-1.5 pt-1">
              <div 
                onClick={() => setActiveModal('dna')}
                className="p-3 rounded-xl bg-[#2C1B2F] hover:bg-[#5E3A5C]/30 border border-[#5E3A5C] hover:border-[#B47A9A] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5E3A5C]/40 text-[#B47A9A] flex items-center justify-center border border-[#5E3A5C]">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#F3E9EC]">Skill DNA & Telemetry</div>
                    <div className="text-[10px] text-[#F3E9EC]/50">Verified code design & algorithms</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#5E3A5C]/40 text-[#B47A9A] font-bold text-[10px] border border-[#5E3A5C]">
                  84/100
                </span>
              </div>

              <div 
                onClick={() => setActiveModal('roadmap')}
                className="p-3 rounded-xl bg-[#2C1B2F] hover:bg-[#5E3A5C]/30 border border-[#5E3A5C] hover:border-[#B47A9A] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5E3A5C]/40 text-[#B47A9A] flex items-center justify-center border border-[#5E3A5C]">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#F3E9EC]">Learning Roadmap</div>
                    <div className="text-[10px] text-[#F3E9EC]/50">Curated milestone trajectory</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#F3E9EC]/40 group-hover:text-[#F3E9EC]" />
              </div>

              <div 
                onClick={() => setActiveModal('certifications')}
                className="p-3 rounded-xl bg-[#2C1B2F] hover:bg-[#5E3A5C]/30 border border-[#5E3A5C] hover:border-[#B47A9A] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5E3A5C]/40 text-[#B47A9A] flex items-center justify-center border border-[#5E3A5C]">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#F3E9EC]">Certifications & Passport</div>
                    <div className="text-[10px] text-[#F3E9EC]/50">Verifiable blockchain credentials</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#F3E9EC]/40 group-hover:text-[#F3E9EC]" />
              </div>

              <div 
                onClick={() => setActiveModal('settings')}
                className="p-3 rounded-xl bg-[#2C1B2F] hover:bg-[#5E3A5C]/30 border border-[#5E3A5C] hover:border-[#B47A9A] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5E3A5C]/40 text-[#B47A9A] flex items-center justify-center border border-[#5E3A5C]">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#F3E9EC]">Portal Settings</div>
                    <div className="text-[10px] text-[#F3E9EC]/50">Security, telemetry, preferences</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#F3E9EC]/40 group-hover:text-[#F3E9EC]" />
              </div>
            </div>
          </div>

          {/* Footer Ribbon */}
          <div className="p-4 border-t border-[#5E3A5C]/30 bg-[#00030E] flex items-center justify-between text-xs text-[#F3E9EC]/50">
            <span>Ladder AI</span>
            <span className="text-[10px] text-[#B47A9A] font-bold">v2.4.0 Live</span>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0E1A] border border-[#5E3A5C] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-[#F3E9EC] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#5E3A5C] pb-3">
              <h4 className="text-sm font-bold text-[#F3E9EC] flex items-center gap-2">
                <span>Edit Profile Information</span>
              </h4>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg bg-[#2C1B2F] text-[#F3E9EC]/60 hover:text-[#F3E9EC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#F3E9EC]/70 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#2C1B2F] border border-[#5E3A5C] focus:border-[#B47A9A] rounded-xl px-3 py-2 text-xs text-[#F3E9EC] outline-none"
                />
              </div>

              {isStudent && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#F3E9EC]/70 mb-1">Roll Number</label>
                    <input
                      type="text"
                      value={editRollNo}
                      onChange={(e) => setEditRollNo(e.target.value)}
                      className="w-full bg-[#2C1B2F] border border-[#5E3A5C] focus:border-[#B47A9A] rounded-xl px-3 py-2 text-xs text-[#F3E9EC] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#F3E9EC]/70 mb-1">Academic Batch</label>
                    <input
                      type="text"
                      value={editYear}
                      onChange={(e) => setEditYear(e.target.value)}
                      className="w-full bg-[#2C1B2F] border border-[#5E3A5C] focus:border-[#B47A9A] rounded-xl px-3 py-2 text-xs text-[#F3E9EC] outline-none"
                    />
                  </div>
                </>
              )}

              {isMentor && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#F3E9EC]/70 mb-1">Company & Experience</label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full bg-[#2C1B2F] border border-[#5E3A5C] focus:border-[#B47A9A] rounded-xl px-3 py-2 text-xs text-[#F3E9EC] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#F3E9EC]/70 mb-1">Department</label>
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full bg-[#2C1B2F] border border-[#5E3A5C] focus:border-[#B47A9A] rounded-xl px-3 py-2 text-xs text-[#F3E9EC] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#F3E9EC]/70 mb-1">University / College</label>
                <input
                  type="text"
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  className="w-full bg-[#2C1B2F] border border-[#5E3A5C] focus:border-[#B47A9A] rounded-xl px-3 py-2 text-xs text-[#F3E9EC] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#2C1B2F] hover:bg-[#5E3A5C] text-xs font-semibold text-[#F3E9EC]/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5E3A5C] hover:bg-[#B47A9A] text-xs font-bold text-[#F3E9EC] shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-feature Dialogs */}
      {activeModal === 'dna' && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0E1A] border border-[#5E3A5C] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-[#F3E9EC] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#5E3A5C] pb-3">
              <h4 className="text-sm font-bold text-[#F3E9EC] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#B47A9A]" />
                <span>Skill DNA Telemetry Analysis</span>
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-[#2C1B2F] text-[#F3E9EC]/60 hover:text-[#F3E9EC]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#2C1B2F] border border-[#5E3A5C] text-[#F3E9EC]">
                Overall Index: <strong className="text-[#B47A9A] text-sm">84 / 100</strong> (Top 8th Percentile)
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Algorithmic Thinking</span>
                    <span className="font-bold text-[#F3E9EC]">88%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#2C1B2F] rounded-full overflow-hidden">
                    <div className="h-full bg-[#B47A9A] rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>System Design & Architecture</span>
                    <span className="font-bold text-[#F3E9EC]">72%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#2C1B2F] rounded-full overflow-hidden">
                    <div className="h-full bg-[#5E3A5C] rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Code Quality & Testing</span>
                    <span className="font-bold text-[#F3E9EC]">85%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#2C1B2F] rounded-full overflow-hidden">
                    <div className="h-full bg-[#B47A9A] rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'roadmap' && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0E1A] border border-[#5E3A5C] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-[#F3E9EC] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#5E3A5C] pb-3">
              <h4 className="text-sm font-bold text-[#F3E9EC] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#B47A9A]" />
                <span>Learning Roadmap & Milestones</span>
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-[#2C1B2F] text-[#F3E9EC]/60 hover:text-[#F3E9EC]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#2C1B2F] border border-[#5E3A5C] flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B47A9A] shrink-0" />
                <div>
                  <div className="font-semibold text-[#F3E9EC]">Complete 3 Verified Micro-Internships</div>
                  <div className="text-[10px] text-[#F3E9EC]/50">Earned 12 XP · Verified on Blockchain</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#2C1B2F] border border-[#5E3A5C] flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B47A9A] shrink-0" />
                <div>
                  <div className="font-semibold text-[#F3E9EC]">Attend 5 Mentor Capsules</div>
                  <div className="text-[10px] text-[#F3E9EC]/50">TCS & Google Senior Architects</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#2C1B2F] border border-[#5E3A5C] flex items-center gap-2.5 opacity-60">
                <Clock className="w-4 h-4 text-[#B47A9A] shrink-0" />
                <div>
                  <div className="font-semibold text-[#F3E9EC]">Deploy Cloud-Native Distributed Microservice</div>
                  <div className="text-[10px] text-[#F3E9EC]/50">Target: Jan 2027</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'certifications' && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0E1A] border border-[#5E3A5C] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-[#F3E9EC] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#5E3A5C] pb-3">
              <h4 className="text-sm font-bold text-[#F3E9EC] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#B47A9A]" />
                <span>Verified Certifications & Passport</span>
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-[#2C1B2F] text-[#F3E9EC]/60 hover:text-[#F3E9EC]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#2C1B2F] border border-[#5E3A5C] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#F3E9EC]">Express.js API Security & JWT</div>
                  <div className="text-[10px] text-[#F3E9EC]/50">CloudSphere Systems · 94% Proof of Work</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#5E3A5C]/40 text-[#B47A9A] rounded border border-[#5E3A5C]">Minted</span>
              </div>
              <div className="p-3 rounded-xl bg-[#2C1B2F] border border-[#5E3A5C] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#F3E9EC]">PostgreSQL Query Optimizer Badge</div>
                  <div className="text-[10px] text-[#F3E9EC]/50">DataCore Labs · 91% Proof of Work</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#5E3A5C]/40 text-[#B47A9A] rounded border border-[#5E3A5C]">Minted</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0E1A] border border-[#5E3A5C] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-[#F3E9EC] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#5E3A5C] pb-3">
              <h4 className="text-sm font-bold text-[#F3E9EC] flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#B47A9A]" />
                <span>Portal Settings</span>
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-[#2C1B2F] text-[#F3E9EC]/60 hover:text-[#F3E9EC]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#2C1B2F] border border-[#5E3A5C]">
                <div>
                  <div className="font-semibold text-[#F3E9EC]">High-Accuracy Geolocation</div>
                  <div className="text-[10px] text-[#F3E9EC]/50">GPS coordinates saved for university sync</div>
                </div>
                <span className="text-[#B47A9A] font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#2C1B2F] border border-[#5E3A5C]">
                <div>
                  <div className="font-semibold text-[#F3E9EC]">Role Guard Telemetry</div>
                  <div className="text-[10px] text-[#F3E9EC]/50">Cryptographic role separation enabled</div>
                </div>
                <span className="text-[#B47A9A] font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'roadmap' && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F2A] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#A78BFA]" />
                <span>Learning Roadmap & Milestones</span>
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Complete 3 Verified Micro-Internships</div>
                  <div className="text-[10px] text-white/50">Earned 12 XP · Verified on Blockchain</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Attend 5 Mentor Capsules</div>
                  <div className="text-[10px] text-white/50">TCS & Google Senior Architects</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5 opacity-60">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Deploy Cloud-Native Distributed Microservice</div>
                  <div className="text-[10px] text-white/50">Target: Jan 2027</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'certifications' && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F2A] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified Certifications & Passport</span>
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Express.js API Security & JWT</div>
                  <div className="text-[10px] text-white/50">CloudSphere Systems · 94% Proof of Work</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">Minted</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">PostgreSQL Query Optimizer Badge</div>
                  <div className="text-[10px] text-white/50">DataCore Labs · 91% Proof of Work</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">Minted</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F2A] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-300" />
                <span>Portal Settings</span>
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                <div>
                  <div className="font-semibold text-white">High-Accuracy Geolocation</div>
                  <div className="text-[10px] text-white/50">GPS coordinates saved for university sync</div>
                </div>
                <span className="text-emerald-400 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                <div>
                  <div className="font-semibold text-white">Role Guard Telemetry</div>
                  <div className="text-[10px] text-white/50">Cryptographic role separation enabled</div>
                </div>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    )}
    </AnimatePresence>
  );
};

export default ProfessionalProfile;
