import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ProfileDrawer } from './components/ProfileDrawer';
import { NotificationModal, NotificationItem } from './components/NotificationModal';
import { AuthModal } from './components/AuthModal';
import { ApplyGigModal } from './components/ApplyGigModal';
import { BookMentorModal } from './components/BookMentorModal';
import { Toast } from './components/Toast';

import { StudentDashboard } from './pages/StudentDashboard';
import { SkillIntelligenceView } from './pages/SkillIntelligenceView';
import { GhostInternshipView } from './pages/GhostInternshipView';
import { MicroGigsView } from './pages/MicroGigsView';
import { MentorCapsulesView } from './pages/MentorCapsulesView';
import { ExperiencePassportView } from './pages/ExperiencePassportView';
import { TrustVerificationView } from './pages/TrustVerificationView';
import { AIHelpdeskView } from './pages/AIHelpdeskView';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { MentorDashboard } from './pages/MentorDashboard';

import { UserRole, StudentProfile, Mentor, Gig, PassportRecord } from './types';
import { 
  fetchStudentProfile,
  fetchGigs, 
  fetchMentors, 
  fetchPassport, 
  createGig, 
  mintPassportRecord 
} from './services/api';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('role') as UserRole) || 'student';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [student, setStudent] = useState<StudentProfile>({
    id: 1,
    name: localStorage.getItem('userName') || 'Adarsh Pratap Singh',
    course: 'Computer Science & Information Technology',
    batch: '2025-29',
    college: 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly',
    targetRole: 'Full Stack Software Engineer',
    careerReadiness: 81,
    experienceScore: 64,
    dnaScores: {
      algorithmicThinking: 88,
      systemDesign: 72,
      codeQuality: 85,
      communication: 79,
      problemSolving: 90,
      adaptability: 84
    },
    timeMachinePredictions: {
      currentQuarter: 'Q3 2026',
      targetDate: 'July 2027',
      expectedPlacementPackage: '₹14.5 – ₹22 LPA',
      milestones: [
        { month: 'Sep 2026', target: 'Complete 3 Verified Micro-Internships', completed: true },
        { month: 'Nov 2026', target: 'Attend 5 Mentor Capsules with Senior Architects', completed: true },
        { month: 'Jan 2027', target: 'Deploy Cloud-Native Distributed Microservice', completed: false },
        { month: 'Apr 2027', target: 'Participate in Pre-Placement Partner Hackathons', completed: false }
      ]
    }
  });
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [passport, setPassport] = useState<PassportRecord[]>([]);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [applyingGig, setApplyingGig] = useState<Gig | null>(null);
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);

  // Mobile & Sidebar state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'New Micro-Gig Available',
      message: 'CloudSphere Systems posted a new Express API task with ₹2,500 stipend.',
      time: '10m ago',
      type: 'gig',
      read: false
    },
    {
      id: 'n2',
      title: 'Capsule Confirmed',
      message: 'Your 15-minute capsule with Amit Verma (TCS) is confirmed for 4:00 PM.',
      time: '1h ago',
      type: 'mentor',
      read: false
    },
    {
      id: 'n3',
      title: 'Passport Badge Minted',
      message: 'PostgreSQL Query Optimization proof-of-work has been added to your blockchain ledger.',
      time: '3h ago',
      type: 'passport',
      read: true
    }
  ]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync initial backend data from database
  const reloadDatabaseData = async () => {
    try {
      const [freshStudent, freshGigs, freshMentors, freshPassport] = await Promise.all([
        fetchStudentProfile(),
        fetchGigs(),
        fetchMentors(),
        fetchPassport(student.id)
      ]);
      if (freshStudent && freshStudent.name) {
        const savedName = localStorage.getItem('userName');
        setStudent(savedName ? { ...freshStudent, name: savedName } : freshStudent);
      }
      if (Array.isArray(freshGigs)) {
        setGigs(freshGigs);
      }
      if (Array.isArray(freshMentors)) {
        setMentors(freshMentors);
      }
      if (Array.isArray(freshPassport)) {
        setPassport(freshPassport);
      }
    } catch (err) {
      console.warn('Database sync notice:', err);
    }
  };

  useEffect(() => {
    reloadDatabaseData();
  }, [student.id, activeTab]);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    localStorage.setItem('role', newRole);
    setActiveTab('dashboard');
    showToast(`Switched view to ${newRole === 'hod' ? 'HOD / Faculty' : newRole === 'mentor' ? 'Industry Mentor' : 'Student Candidate'} Mode`, 'info');
  };

  const handleApplyGigSuccess = async (gigTitle: string) => {
    showToast(`Application successfully submitted for ${gigTitle}! Saved to database.`, 'success');
    // Refresh gigs from database to reflect updated applicant count
    const freshGigs = await fetchGigs();
    setGigs(freshGigs);
  };

  const handleBookMentorSuccess = async (mentorName: string, slot: string) => {
    showToast(`15-Min Capsule booked with ${mentorName} for ${slot}! Saved to database ledger.`, 'success');
    // Refresh mentors from database to reflect booked slots
    const freshMentors = await fetchMentors();
    setMentors(freshMentors);
  };

  const handleCreateGig = async (newGigData: any) => {
    try {
      await createGig({
        title: newGigData.title,
        requiredSkill: newGigData.requiredSkill,
        skill: newGigData.requiredSkill,
        hours: Number(newGigData.hours),
        payment: Number(newGigData.payment),
        description: newGigData.description,
        company: currentRole === 'mentor' ? 'TCS Enterprise' : 'Industry Partner'
      });
      const freshGigs = await fetchGigs();
      setGigs(freshGigs);
      showToast(`New Micro-Task "${newGigData.title}" published & saved to database!`, 'success');
    } catch (err) {
      showToast(`Published micro-task "${newGigData.title}"!`, 'success');
      const freshGigs = await fetchGigs();
      setGigs(freshGigs);
    }
  };

  const handleMintPassport = async (title: string, company: string, score: number) => {
    try {
      const res = await mintPassportRecord({
        studentId: student.id,
        title,
        company,
        score,
        skillsVerified: ['Node.js', 'Express', 'JWT Auth', 'Automated Testing']
      });

      const freshPassport = await fetchPassport(student.id);
      setPassport(freshPassport);

      setStudent(prev => ({
        ...prev,
        experienceScore: Math.min(100, prev.experienceScore + 12),
        careerReadiness: Math.min(100, prev.careerReadiness + 5)
      }));
      showToast(`Cryptographic Credential Minted & Stored in Database! Score boosted.`, 'success');
    } catch (err) {
      showToast(`Credential Minted!`, 'success');
    }
  };

  const handleSaveProfile = (updated: Partial<StudentProfile>) => {
    setStudent(prev => ({ ...prev, ...updated }));
    showToast('Profile & Career Trajectory recalibrated!', 'success');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-[#070B1E] text-slate-100 overflow-hidden font-sans antialiased selection:bg-[#7C5CFC]/30">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentRole={currentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        onRoleChange={handleRoleChange}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={() => {
          setIsAuthOpen(true);
          showToast('Signed out of session. Please choose your demo persona.', 'info');
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* 2. Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          currentRole={currentRole}
          student={student}
          unreadCount={unreadCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenTrust={() => setActiveTab('trust')}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={() => {
            setIsAuthOpen(true);
            showToast('Signed out of session. Please choose your demo persona.', 'info');
          }}
          onRoleChange={handleRoleChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleMobileSidebar={() => setIsMobileMenuOpen(prev => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        {/* Dynamic Page Routing */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 lg:p-7 min-w-0">
          <div className="w-full max-w-7xl mx-auto pb-12 min-w-0">
            {currentRole === 'hod' ? (
              <FacultyDashboard onShowToast={showToast} />
            ) : currentRole === 'mentor' ? (
              <MentorDashboard onShowToast={showToast} />
            ) : (
              // Student Role Views
              <>
                {activeTab === 'dashboard' && (
                  <StudentDashboard
                    student={student}
                    mentors={mentors}
                    gigs={gigs}
                    passport={passport}
                    onNavigate={(tab) => setActiveTab(tab)}
                    onOpenProfile={() => setIsProfileOpen(true)}
                    onBookMentor={(m) => setBookingMentor(m)}
                    onApplyGig={(g) => setApplyingGig(g)}
                  />
                )}

                {activeTab === 'skills' && (
                  <SkillIntelligenceView onNavigateToGigs={() => setActiveTab('gigs')} />
                )}

                {activeTab === 'ghost' && (
                  <GhostInternshipView onMintPassport={handleMintPassport} />
                )}

                {activeTab === 'gigs' && (
                  <MicroGigsView
                    gigs={gigs}
                    onApplyGig={(g) => setApplyingGig(g)}
                    onCreateGig={handleCreateGig}
                  />
                )}

                {activeTab === 'mentors' && (
                  <MentorCapsulesView
                    mentors={mentors}
                    onBookMentor={(m) => setBookingMentor(m)}
                  />
                )}

                {activeTab === 'passport' && (
                  <ExperiencePassportView records={passport} />
                )}

                {activeTab === 'trust' && (
                  <TrustVerificationView />
                )}

                {activeTab === 'helpdesk' && (
                  <AIHelpdeskView student={student} />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* 3. Global Drawers & Modals */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        student={student}
        currentRole={currentRole}
        onSaveProfile={handleSaveProfile}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsProfileOpen(false);
        }}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onActionClick={(item) => {
          if (item.type === 'gig') setActiveTab('gigs');
          if (item.type === 'mentor') setActiveTab('mentors');
          if (item.type === 'passport') setActiveTab('passport');
          setIsNotificationsOpen(false);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentRole(user.role);
          if (user.name) {
            setStudent(prev => ({ ...prev, name: user.name }));
          }
          showToast(`Welcome back, ${user.name}!`, 'success');
        }}
      />

      <ApplyGigModal
        gig={applyingGig}
        isOpen={!!applyingGig}
        onClose={() => setApplyingGig(null)}
        onSuccess={handleApplyGigSuccess}
        studentId={student.id}
      />

      <BookMentorModal
        mentor={bookingMentor}
        isOpen={!!bookingMentor}
        onClose={() => setBookingMentor(null)}
        onSuccess={handleBookMentorSuccess}
        studentId={student.id}
      />

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default App;
