import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Shield, 
  Bell, 
  Menu, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  BriefcaseBusiness,
  GraduationCap,
  Building
} from 'lucide-react';
import { UserRole, StudentProfile } from '../types';

interface TopbarProps {
  currentRole: UserRole;
  student: StudentProfile | null;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenTrust: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onToggleMobileSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onRoleChange?: (role: UserRole) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentRole,
  student,
  unreadCount,
  onOpenNotifications,
  onOpenTrust,
  onOpenProfile,
  onOpenAuth,
  onLogout,
  searchQuery,
  setSearchQuery,
  onToggleMobileSidebar,
  isSidebarCollapsed,
  onToggleCollapse,
  onRoleChange
}) => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => {
    return localStorage.getItem('profilePhoto');
  });
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Synchronize photo across storage events
  useEffect(() => {
    const updatePhoto = () => {
      setProfilePhoto(localStorage.getItem('profilePhoto'));
    };
    window.addEventListener('storage', updatePhoto);
    const interval = setInterval(updatePhoto, 1000);
    return () => {
      window.removeEventListener('storage', updatePhoto);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="h-16 shrink-0 bg-[#090E2B] border-b border-[#18214D] sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 select-none min-w-0">
      {/* Left section: Avatar Icon + Hamburger / Collapse + Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-lg min-w-0">
        {/* Mobile Hamburger Toggle */}
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl bg-[#0E1538] border border-[#1E2964] text-slate-300 hover:text-white shrink-0 cursor-pointer"
            title="Open Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Desktop Sidebar Toggle when collapsed */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-2 rounded-xl bg-[#0E1538] border border-[#1E2964] text-slate-400 hover:text-white hover:border-[#7C5CFC] transition-colors shrink-0 cursor-pointer"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeft className="w-4 h-4 text-[#A78BFA]" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}

        {/* TOP HEADER - LEFT AVATAR ICON (LinkedIn Style) */}
        <div
          onClick={onOpenProfile}
          className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-full flex items-center justify-center overflow-hidden shrink-0 cursor-pointer shadow-sm hover:ring-2 hover:ring-[#7C5CFC]/50 transition-all bg-[#E5E7EB]"
          title="Open Profile Drawer"
        >
          {profilePhoto ? (
            <img 
              src={profilePhoto} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#E5E7EB] flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#6B7280]" />
            </div>
          )}
        </div>

        {/* Search input with responsive behavior */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, gigs, mentors, passports..."
            className="w-full bg-[#0E1538] border border-[#1E2964] focus:border-[#7C5CFC] text-slate-200 placeholder-slate-400 text-xs rounded-xl pl-8 pr-3 py-1.5 sm:py-2 outline-none transition-all shadow-inner truncate"
          />
        </div>
      </div>

      {/* Right action controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-2">
        {/* Switch Role Button */}
        {onRoleChange && (
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#0E1538] border border-[#1E2964] hover:border-[#7C5CFC] text-slate-200 text-xs font-bold transition-all cursor-pointer"
              title="Switch Platform Role"
            >
              {currentRole === 'hod' ? (
                <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : currentRole === 'mentor' ? (
                <BriefcaseBusiness className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              )}
              <span className="hidden sm:inline capitalize">
                {currentRole === 'hod' ? 'HOD' : currentRole === 'mentor' ? 'Mentor' : 'Student'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 top-11 w-48 bg-[#0B1033] border border-[#232F6E] rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                <button
                  onClick={() => {
                    onRoleChange('student');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    currentRole === 'student' ? 'bg-[#7C5CFC] text-white' : 'text-slate-300 hover:bg-[#141B48]'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-cyan-300" />
                  <span>Student Candidate</span>
                </button>

                <button
                  onClick={() => {
                    onRoleChange('mentor');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    currentRole === 'mentor' ? 'bg-[#7C5CFC] text-white' : 'text-slate-300 hover:bg-[#141B48]'
                  }`}
                >
                  <BriefcaseBusiness className="w-4 h-4 text-pink-300" />
                  <span>Industry Mentor</span>
                </button>

                <button
                  onClick={() => {
                    onRoleChange('hod');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    currentRole === 'hod' ? 'bg-[#7C5CFC] text-white' : 'text-slate-300 hover:bg-[#141B48]'
                  }`}
                >
                  <Building className="w-4 h-4 text-amber-300" />
                  <span>HOD / Faculty</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trust & Verify Shortcut */}
        <button
          onClick={onOpenTrust}
          className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-semibold shadow-sm transition-all hover:bg-emerald-900/30 cursor-pointer"
          title="Open Blockchain Trust & Verification Explorer"
        >
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="hidden md:inline">Trust & Verify</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-[#0E1538] border border-[#1E2964] hover:border-[#7C5CFC] text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
          title="Notification Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#090E2B] animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Logout Quick Action */}
        <button
          onClick={onLogout}
          className="p-2 rounded-lg bg-[#0E1538] border border-[#1E2964] hover:border-rose-500 text-slate-400 hover:text-rose-400 transition-colors shrink-0 cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
