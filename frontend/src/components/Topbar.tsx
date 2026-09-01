import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  LogOut, 
  User as UserIcon,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon
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
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
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
  onRoleChange,
  theme = 'dark',
  onToggleTheme
}) => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => {
    return localStorage.getItem('profilePhoto');
  });

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
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-2">
        {/* Light / Dark Mode Toggle */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-[#0E1538] border border-[#1E2964] hover:border-[#7C5CFC] text-slate-300 hover:text-white transition-all shrink-0 cursor-pointer shadow-sm"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400 animate-in spin-in-180 duration-300" />
            )}
          </button>
        )}

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
