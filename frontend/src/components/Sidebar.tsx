import React, { useState } from 'react';
import { 
  Compass, 
  Cpu, 
  Terminal, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Repeat, 
  Award, 
  UserCheck, 
  Layers,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  LogOut,
  User as UserIcon,
  X,
  GraduationCap,
  BriefcaseBusiness,
  Building,
  Menu
} from 'lucide-react';
import { UserRole, StudentProfile } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  student: StudentProfile | null;
  onRoleChange: (role: UserRole) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  setActiveTab,
  student,
  onRoleChange,
  onOpenProfile,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return 'SB';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const handleRoleSelect = (role: UserRole) => {
    onRoleChange(role);
    setShowRoleMenu(false);
    if (onCloseMobile) onCloseMobile();
  };

  // Render Inner Sidebar Content (parameterized by whether it's collapsed or in drawer)
  const renderContent = (collapsed: boolean, isDrawer = false) => {
    return (
      <div className="flex flex-col h-full bg-[#070B20] border-r border-[#19224D] select-none">
        {/* Brand Header */}
        <div className={`p-4 border-b border-[#151D42] flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-sm tracking-wider">
              SB
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-[15px] tracking-tight truncate">SkillBridge</span>
                  <span className="text-[#8B5CF6] font-black text-[15px] shrink-0">AI</span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 truncate">SIH26044 · Career OS</p>
              </div>
            )}
          </div>

          {/* Close button for mobile drawer */}
          {isDrawer && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg bg-[#0E1538] text-slate-400 hover:text-white transition-colors"
              title="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Desktop Collapse Button */}
          {!isDrawer && onToggleCollapse && !collapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#0E1538] transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role Switcher */}
        {!collapsed ? (
          <div className="px-3 pt-3 pb-1 relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0E1538] border border-[#1E2964] hover:border-[#7C5CFC] transition-colors group text-left shadow-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 shrink-0 rounded-full bg-emerald-400 animate-pulse"></span>
                <div className="min-w-0">
                  <p className="text-[9.5px] text-slate-400 uppercase tracking-wider font-semibold">Active Role</p>
                  <p className="text-xs font-bold text-white capitalize truncate">
                    {currentRole === 'hod' ? 'HOD / Faculty' : currentRole === 'mentor' ? 'Industry Mentor' : 'Student Candidate'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-[#A78BFA] group-hover:text-white font-medium bg-[#1D1E4E] px-1.5 py-0.5 rounded shrink-0">
                Switch
              </span>
            </button>

            {showRoleMenu && (
              <div className="absolute top-14 left-3 right-3 bg-[#0B1033] border border-[#232F6E] rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                <button
                  onClick={() => handleRoleSelect('student')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                    currentRole === 'student' ? 'bg-[#7C5CFC] text-white' : 'text-slate-300 hover:bg-[#141B48] hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-cyan-300 shrink-0" />
                  <div>
                    <p className="font-bold">Student Candidate</p>
                    <p className="text-[10px] opacity-80">Skill Passport & Micro-Gigs</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('mentor')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                    currentRole === 'mentor' ? 'bg-[#7C5CFC] text-white' : 'text-slate-300 hover:bg-[#141B48] hover:text-white'
                  }`}
                >
                  <BriefcaseBusiness className="w-4 h-4 text-pink-300 shrink-0" />
                  <div>
                    <p className="font-bold">Industry Mentor</p>
                    <p className="text-[10px] opacity-80">Capsules & Reviews</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('hod')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                    currentRole === 'hod' ? 'bg-[#7C5CFC] text-white' : 'text-slate-300 hover:bg-[#141B48] hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4 text-amber-300 shrink-0" />
                  <div>
                    <p className="font-bold">HOD / College Admin</p>
                    <p className="text-[10px] opacity-80">Cohort & Auto-MoU</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-2 flex justify-center">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="p-2 rounded-lg bg-[#0E1538] border border-[#1E2964] text-[#A78BFA] hover:text-white"
              title={`Switch Role (Current: ${currentRole})`}
            >
              {currentRole === 'hod' ? (
                <Building className="w-4 h-4 text-amber-400" />
              ) : currentRole === 'mentor' ? (
                <BriefcaseBusiness className="w-4 h-4 text-pink-400" />
              ) : (
                <GraduationCap className="w-4 h-4 text-cyan-400" />
              )}
            </button>
          </div>
        )}

        {/* Navigation Menus */}
        <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-4">
          {/* STUDENT PORTAL MENU */}
          {currentRole === 'student' && (
            <>
              <div>
                {!collapsed && (
                  <div className="px-2.5 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Career Hub
                  </div>
                )}
                <div className="space-y-0.5">
                  <button
                    id="nav-dashboard"
                    onClick={() => handleTabClick('dashboard')}
                    title="Career Overview"
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      activeTab === 'dashboard'
                        ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                        : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                    {!collapsed && <span className="truncate">Career Overview</span>}
                  </button>

                  <button
                    id="nav-skills"
                    onClick={() => handleTabClick('skills')}
                    title="Skill Intelligence"
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      activeTab === 'skills'
                        ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                        : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                    }`}
                  >
                    <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                    {!collapsed && <span className="truncate">Skill Intelligence</span>}
                  </button>

                  <button
                    id="nav-ghost"
                    onClick={() => handleTabClick('ghost')}
                    title="Ghost Internships (Zero NDA)"
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      activeTab === 'ghost'
                        ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                        : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                    }`}
                  >
                    <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="truncate">Ghost Internships</span>
                        <span className="ml-auto text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded shrink-0">
                          Zero NDA
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    id="nav-gigs"
                    onClick={() => handleTabClick('gigs')}
                    title="Micro-Internship Gigs"
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      activeTab === 'gigs'
                        ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                        : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                    {!collapsed && <span className="truncate">Micro-Internship Gigs</span>}
                  </button>

                  <button
                    id="nav-mentors"
                    onClick={() => handleTabClick('mentors')}
                    title="Mentor Capsules (15 Min)"
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      activeTab === 'mentors'
                        ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                        : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4 text-pink-400 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="truncate">Mentor Capsules</span>
                        <span className="ml-auto text-[9px] bg-pink-500/20 text-pink-300 font-bold px-1.5 py-0.5 rounded shrink-0">
                          15 Min
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                {!collapsed && (
                  <div className="px-2.5 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Ledger & Intelligence
                  </div>
                )}
                <div className="space-y-0.5">
                  <button
                    id="nav-passport"
                    onClick={() => handleTabClick('passport')}
                    title="Experience Passport"
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      activeTab === 'passport'
                        ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                        : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                    {!collapsed && <span className="truncate">Experience Passport</span>}
                  </button>

                  <button
                    id="nav-trust"
                    onClick={() => handleTabClick('trust')}
                    title="Trust & Verification"
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      activeTab === 'trust'
                        ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                        : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                    }`}
                  >
                    <Award className="w-4 h-4 text-teal-400 shrink-0" />
                    {!collapsed && <span className="truncate">Trust & Verification</span>}
                  </button>

                  <button
                    id="nav-helpdesk"
                    onClick={() => handleTabClick('helpdesk')}
                    title="AI Help Desk & Advisor"
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      activeTab === 'helpdesk'
                        ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                        : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-violet-400 shrink-0" />
                    {!collapsed && <span className="truncate">AI Help Desk & Advisor</span>}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* FACULTY / HOD PORTAL MENU */}
          {currentRole === 'hod' && (
            <div>
              {!collapsed && (
                <div className="px-2.5 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Governance
                </div>
              )}
              <div className="space-y-0.5">
                <button
                  onClick={() => handleTabClick('faculty-unplaced')}
                  title="Unplaced Cohort (32%)"
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    activeTab === 'faculty-unplaced' || activeTab === 'dashboard'
                      ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                      : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                  {!collapsed && <span className="truncate">Unplaced Cohort (32%)</span>}
                </button>

                <button
                  onClick={() => handleTabClick('faculty-mou')}
                  title="Auto MoU Generator"
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    activeTab === 'faculty-mou'
                      ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                      : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  {!collapsed && <span className="truncate">Auto MoU Generator</span>}
                </button>

                <button
                  onClick={() => handleTabClick('faculty-swap')}
                  title="Faculty Swap Exchange"
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    activeTab === 'faculty-swap'
                      ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                      : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                  }`}
                >
                  <Repeat className="w-4 h-4 text-emerald-400 shrink-0" />
                  {!collapsed && <span className="truncate">Faculty Swap</span>}
                </button>

                <button
                  onClick={() => handleTabClick('faculty-curriculum')}
                  title="AI Curriculum Alignment"
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    activeTab === 'faculty-curriculum'
                      ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                      : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                  {!collapsed && <span className="truncate">Curriculum Alignment</span>}
                </button>
              </div>
            </div>
          )}

          {/* INDUSTRY MENTOR PORTAL MENU */}
          {currentRole === 'mentor' && (
            <div>
              {!collapsed && (
                <div className="px-2.5 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Mentorship
                </div>
              )}
              <div className="space-y-0.5">
                <button
                  onClick={() => handleTabClick('mentor-pipeline')}
                  title="Assigned Student Pipeline"
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    activeTab === 'mentor-pipeline' || activeTab === 'dashboard'
                      ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                      : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  {!collapsed && <span className="truncate">Student Pipeline</span>}
                </button>

                <button
                  onClick={() => handleTabClick('mentor-reviews')}
                  title="Ghost Task Submissions"
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    activeTab === 'mentor-reviews'
                      ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                      : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                  }`}
                >
                  <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
                  {!collapsed && <span className="truncate">Task Submissions</span>}
                </button>

                <button
                  onClick={() => handleTabClick('mentor-capsules')}
                  title="15-Min Capsule Slots"
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    activeTab === 'mentor-capsules'
                      ? 'bg-[#7C5CFC]/20 text-[#C4B5FD] border border-[#7C5CFC]/40 shadow-sm'
                      : 'text-slate-300 hover:bg-[#0E1438] hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-pink-400 shrink-0" />
                  {!collapsed && <span className="truncate">15-Min Capsule Slots</span>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Card & Sign Out */}
        <div className="p-3 border-t border-[#151D42] bg-[#0A0F2B]">
          {!collapsed ? (
            <>
              <div
                onClick={() => {
                  onOpenProfile();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0E1438] border border-[#1E2964] hover:border-[#7C5CFC] cursor-pointer transition-all group"
              >
                {localStorage.getItem('profilePhoto') ? (
                  <img
                    src={localStorage.getItem('profilePhoto')!}
                    alt="Avatar"
                    className="w-8 h-8 shrink-0 rounded-lg object-cover border border-[#7C5CFC]/50 shadow-md"
                  />
                ) : (
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-[#7C5CFC] to-[#4F46E5] flex items-center justify-center font-bold text-white text-xs shadow-md">
                    {getInitials(
                      currentRole === 'hod'
                        ? 'Dr. Arvind Sharma'
                        : currentRole === 'mentor'
                        ? 'Amit Verma'
                        : student?.name || 'Adarsh Pratap'
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate group-hover:text-[#C4B5FD] transition-colors">
                    {currentRole === 'hod'
                      ? 'Dr. Arvind Sharma'
                      : currentRole === 'mentor'
                      ? 'Amit Verma'
                      : student?.name || 'Adarsh Pratap'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {currentRole === 'hod'
                      ? 'HOD · Dept of CSIT'
                      : currentRole === 'mentor'
                      ? 'TCS Senior Architect'
                      : 'CSIT · Batch 2025-29'}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              <div className="mt-2 flex items-center justify-between px-1">
                <button
                  onClick={() => {
                    onOpenProfile();
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className="text-[11px] text-rose-400/80 hover:text-rose-300 flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  onOpenProfile();
                }}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C5CFC] to-[#4F46E5] flex items-center justify-center font-bold text-white text-xs shadow-md"
                title="View Profile & DNA"
              >
                {getInitials(student?.name || 'Adarsh')}
              </button>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#0E1438] transition-colors"
                  title="Expand Sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Desktop / Large Screen In-Flow Sidebar */}
      <aside className={`hidden md:flex flex-col shrink-0 h-screen transition-all duration-200 ${isCollapsed ? 'w-[70px]' : 'w-64'}`}>
        {renderContent(isCollapsed, false)}
      </aside>

      {/* 2. Mobile / Narrow Screen Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Solid dark backdrop with smooth dismissal */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />
          {/* Drawer container */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-10 flex flex-col h-full bg-[#070B20]">
            {renderContent(false, true)}
          </div>
        </div>
      )}
    </>
  );
};
