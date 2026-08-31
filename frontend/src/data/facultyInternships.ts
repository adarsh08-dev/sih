import { FacultyInternship, InternshipOpportunity, Application, ApprovalRequest } from '../types/facultyInternship';

export const mockInternships: FacultyInternship[] = [
  { id: 'i1', facultyName: 'Dr. Arvind K. Sharma', designation: 'HOD', hostOrganization: 'TCS Research', type: 'Research Internship', startDate: '2026-06-01', endDate: '2026-08-31', status: 'Ongoing', focusArea: 'Federated Learning' },
  { id: 'i2', facultyName: 'Dr. Arvind K. Sharma', designation: 'HOD', hostOrganization: 'Infosys', type: 'Industrial Training', startDate: '2026-05-15', endDate: '2026-06-30', status: 'Completed', focusArea: 'Cloud Infrastructure' },
];

export const mockOpportunities: InternshipOpportunity[] = [
  { id: 'o1', title: 'AI Ethics Workshop', hostOrganization: 'Google', type: 'Research Internship', startDate: '2026-10-01', duration: '4 weeks', focusArea: 'AI', eligibility: 'Ph.D.' },
  { id: 'o2', title: 'Cloud Security Audit', hostOrganization: 'AWS', type: 'Corporate Residency', startDate: '2026-11-15', duration: '8 weeks', focusArea: 'Cloud', eligibility: 'M.Tech' },
];

export const mockApplications: Application[] = [
  { id: 'a1', internshipId: 'o1', title: 'AI Ethics Workshop', hostOrganization: 'Google', appliedDate: '2026-08-25', status: 'Applied' },
];

export const mockApprovalRequests: ApprovalRequest[] = [
  { id: 'r1', facultyName: 'Prof. Anjali Gupta', hostOrganization: 'Wipro', type: 'Industrial Training', requestedDate: '2026-08-28', status: 'Pending' },
];
