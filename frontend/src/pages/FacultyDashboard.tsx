import React from 'react';
import { 
  Building2, 
  Download,
} from 'lucide-react';
import { FacultyOverview } from './FacultyOverviewView';
import { IndustryOpportunities } from './IndustryOpportunitiesView';
import { FacultyProfileView } from './FacultyProfileView';
import { UnplacedCohortView } from './UnplacedCohortView';
import { AutoMouView } from './AutoMouView';
import { IndustrialTrainingView } from './IndustrialTrainingView';
import { FacultySwapView } from './FacultySwapView';
import { FacultyInternshipsView } from './FacultyInternshipsView';
import { CurriculumAlignmentView } from './CurriculumAlignmentView';
import { ResearchCollaborationView } from './ResearchCollaborationView';
import { FdpProgramsView } from './FdpProgramsView';
import { ConsultancyView } from './ConsultancyView';
import { LiveIndustryProjectsView } from './LiveIndustryProjectsView';
import { WorkshopsGuestLecturesView } from './WorkshopsGuestLecturesView';
import { GenericFacultyView } from './GenericFacultyView';

import { StudentMentorshipView } from './StudentMentorshipView';
import { AcademicIntelligenceView } from './AcademicIntelligenceView';
import { AiFacultyAdvisorView } from './AiFacultyAdvisorView';
import { HODDashboardView } from './HODDashboardView';
import { MyApplicationsView } from './MyApplicationsView';
import { MyCollaborationsView } from './MyCollaborationsView';
import { AchievementsCertificatesView } from './AchievementsCertificatesView';

interface FacultyDashboardProps {
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  activeTab: string;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onShowToast, activeTab }) => {
  const handleExportNaac = () => {
    onShowToast('NAAC Criterion 1 & 2 Institutional Skill Passport Report exported (PDF/JSON)!', 'success');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'faculty-overview': return <FacultyOverview />;
      case 'faculty-profile': return <FacultyProfileView />;
      case 'faculty-unplaced': return <UnplacedCohortView />;
      case 'industry-opportunities': return <IndustryOpportunities />;
      case 'auto-mou': return <AutoMouView />;
      case 'faculty-swap': return <FacultySwapView />;
      case 'student-mentorship': return <StudentMentorshipView onShowToast={onShowToast} />;
      case 'academic-intelligence': return <AcademicIntelligenceView onShowToast={onShowToast} />;
      case 'ai-faculty-advisor': return <AiFacultyAdvisorView />;
      case 'dashboard': return <HODDashboardView />;

      case 'curriculum-alignment': return <CurriculumAlignmentView />;
      case 'industrial-training': return <IndustrialTrainingView />;
      case 'faculty-internships': return <FacultyInternshipsView />;
      case 'research-collaboration': return <ResearchCollaborationView onShowToast={onShowToast} />;
      case 'consultancy': return <ConsultancyView onShowToast={onShowToast} />;
      case 'fdp-programs': return <FdpProgramsView onShowToast={onShowToast} />;
      case 'live-projects': return <LiveIndustryProjectsView onShowToast={onShowToast} />;
      case 'collaboration-hub': return <GenericFacultyView title="Collaboration Hub" />;
      case 'my-applications': return <MyApplicationsView onShowToast={onShowToast} />;
      case 'workshops': return <WorkshopsGuestLecturesView onShowToast={onShowToast} />;
      case 'innovation-challenges': return <GenericFacultyView title="Innovation Challenges" />;
      case 'my-collaborations': return <MyCollaborationsView onShowToast={onShowToast} />;
      case 'achievements': return <AchievementsCertificatesView onShowToast={onShowToast} />;
      default: return <div className="p-8 text-center text-slate-400">Section content: {activeTab}</div>;
    }
  };


  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C48] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold tracking-wide uppercase mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Academic & Industry Collaboration</span>
          </div>
          <h1 className="text-2xl font-black text-white">Dr. Arvind K. Sharma</h1>
          <p className="text-xs text-slate-300">
            Head of Department · Computer Science & Information Technology · MJPRU Bareilly
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportNaac}
            className="px-4 py-2 rounded-xl bg-[#182358] hover:bg-[#202E72] border border-[#2B3B8A] text-slate-100 text-xs font-bold flex items-center gap-2 transition-all shadow"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>NAAC Report</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </div>
  );
};
