export interface FacultyInternship {
  id: string;
  facultyName: string;
  designation: string;
  hostOrganization: string;
  type: 'Industrial Training' | 'Research Internship' | 'Corporate Residency';
  startDate: string;
  endDate: string;
  status: 'Ongoing' | 'Completed' | 'Pending Approval' | 'Rejected';
  focusArea: string;
}

export interface InternshipOpportunity {
  id: string;
  title: string;
  hostOrganization: string;
  type: 'Industrial Training' | 'Research Internship' | 'Corporate Residency';
  startDate: string;
  duration: string;
  focusArea: string;
  eligibility: string;
}

export interface Application {
  id: string;
  internshipId: string;
  title: string;
  hostOrganization: string;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Approved' | 'Rejected';
}

export interface ApprovalRequest {
  id: string;
  facultyName: string;
  hostOrganization: string;
  type: string;
  requestedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}
