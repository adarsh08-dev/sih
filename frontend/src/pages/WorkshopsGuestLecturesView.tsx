import React, { useState, useMemo } from 'react';
import { 
  Presentation, 
  User, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  CheckCircle2, 
  Download, 
  Edit3, 
  Trash2, 
  X, 
  FileText, 
  Video, 
  MapPin, 
  Globe, 
  ChevronRight, 
  Sparkles, 
  Award, 
  BookOpen, 
  ExternalLink,
  Share2,
  Building2,
  Tv
} from 'lucide-react';
import { WorkshopGuestLecture } from '../types';
import { 
  getStoredWorkshops, 
  saveStoredWorkshops 
} from '../data/facultyCollaborationData';

interface WorkshopsGuestLecturesViewProps {
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const WorkshopsGuestLecturesView: React.FC<WorkshopsGuestLecturesViewProps> = ({ 
  onShowToast = () => {} 
}) => {
  const [events, setEvents] = useState<WorkshopGuestLecture[]>(getStoredWorkshops);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'attendees-desc' | 'title'>('date-desc');

  // Modals
  const [selectedEvent, setSelectedEvent] = useState<WorkshopGuestLecture | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<WorkshopGuestLecture | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<WorkshopGuestLecture | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<WorkshopGuestLecture>>({
    title: '',
    type: 'Workshop',
    speaker: {
      name: '',
      designation: 'Senior Principal Engineer',
      organization: 'Tech Industry Leader',
      bio: 'Distinguished expert with deep practical leadership.'
    },
    date: '2026-10-25',
    time: '11:00 AM – 01:00 PM IST',
    duration: '2.0 Hours',
    mode: 'Hybrid',
    venue: 'CSIT Central Auditorium & MS Teams',
    attendeesCount: 150,
    maxCapacity: 200,
    status: 'Upcoming',
    department: 'Computer Science & Information Technology',
    organizingCoordinator: 'Dr. Arvind K. Sharma (HOD)',
    description: '',
    keyTakeaways: [],
    targetAudience: 'B.Tech CSE/IT, MCA, and Research Scholars',
    certificateProvided: true,
    collaboratingPartner: 'Industry Technical Chapter Bareilly'
  });

  const [takeawaysInput, setTakeawaysInput] = useState('');

  const syncEvents = (updated: WorkshopGuestLecture[]) => {
    setEvents(updated);
    saveStoredWorkshops(updated);
  };

  // Filter & Sort
  const filteredEvents = useMemo(() => {
    return events
      .filter(e => {
        const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
        const matchesType = typeFilter === 'All' || e.type === typeFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          e.title.toLowerCase().includes(q) ||
          e.speaker.name.toLowerCase().includes(q) ||
          e.speaker.organization.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q);

        return matchesStatus && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'attendees-desc') return b.attendeesCount - a.attendeesCount;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [events, statusFilter, typeFilter, searchQuery, sortBy]);

  // Summary Metrics
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => e.status === 'Upcoming').length;
    const completedEvents = events.filter(e => e.status === 'Completed').length;
    const totalAttendees = events.reduce((acc, e) => acc + e.attendeesCount, 0);

    return {
      totalEvents,
      upcomingCount: upcomingEvents,
      completedCount: completedEvents,
      totalAttendees
    };
  }, [events]);

  // Unique Event Types
  const uniqueTypes = useMemo(() => {
    const types = new Set(events.map(e => e.type));
    return Array.from(types);
  }, [events]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      type: 'Workshop',
      speaker: {
        name: '',
        designation: 'Senior Architect',
        organization: 'Industry Partner',
        bio: 'Seasoned technical leader and domain speaker.'
      },
      date: '2026-10-25',
      time: '11:00 AM – 01:00 PM IST',
      duration: '2.0 Hours',
      mode: 'Hybrid',
      venue: 'CSIT Central Auditorium & MS Teams',
      attendeesCount: 120,
      maxCapacity: 200,
      status: 'Upcoming',
      department: 'Computer Science & Information Technology',
      organizingCoordinator: 'Dr. Arvind K. Sharma (HOD)',
      description: '',
      keyTakeaways: [],
      targetAudience: 'B.Tech CSE/IT, MCA, M.Tech Scholars',
      certificateProvided: true,
      collaboratingPartner: 'IEEE Computer Society Bareilly'
    });
    setTakeawaysInput('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (ev: WorkshopGuestLecture, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(ev);
    setFormData({ ...ev });
    setTakeawaysInput(ev.keyTakeaways ? ev.keyTakeaways.join('\n') : '');
    setIsAddModalOpen(true);
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      onShowToast('Please provide an event title.', 'error');
      return;
    }
    if (!formData.speaker?.name?.trim()) {
      onShowToast('Please specify the keynote speaker name.', 'error');
      return;
    }

    const takeawaysList = takeawaysInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingEvent) {
      const updated = events.map(ev => {
        if (ev.id === editingEvent.id) {
          return {
            ...ev,
            ...formData,
            keyTakeaways: takeawaysList.length > 0 ? takeawaysList : ev.keyTakeaways
          } as WorkshopGuestLecture;
        }
        return ev;
      });
      syncEvents(updated);
      onShowToast(`Updated workshop/lecture: "${formData.title}"`, 'success');
    } else {
      const newEvent: WorkshopGuestLecture = {
        id: `wk-${Date.now()}`,
        title: formData.title || 'Untitled Academic Event',
        type: (formData.type as any) || 'Workshop',
        speaker: {
          name: formData.speaker?.name || 'Distinguished Guest Speaker',
          designation: formData.speaker?.designation || 'Principal Specialist',
          organization: formData.speaker?.organization || 'Enterprise Org',
          bio: formData.speaker?.bio || 'Distinguished academic and industry guest speaker.'
        },
        date: formData.date || '2026-10-25',
        time: formData.time || '11:00 AM – 01:00 PM IST',
        duration: formData.duration || '2.0 Hours',
        mode: (formData.mode as any) || 'Hybrid',
        venue: formData.venue || 'CSIT Seminar Hall',
        attendeesCount: Number(formData.attendeesCount) || 120,
        maxCapacity: Number(formData.maxCapacity) || 200,
        status: (formData.status as any) || 'Upcoming',
        department: 'Computer Science & Information Technology',
        organizingCoordinator: formData.organizingCoordinator || 'Dr. Arvind K. Sharma (HOD)',
        description: formData.description || 'Interactive academic & industrial lecture empowering scholars with cutting-edge domain expertise.',
        keyTakeaways: takeawaysList.length > 0 ? takeawaysList : [
          'Practical industry architectures and best practices',
          'Interactive Q&A and networking with industry leadership',
          'Hands-on demonstrations and code walkthrough'
        ],
        targetAudience: formData.targetAudience || 'B.Tech/MCA Students & Faculty',
        certificateProvided: Boolean(formData.certificateProvided),
        collaboratingPartner: formData.collaboratingPartner || 'IEEE Student Chapter',
        recordingOrSlidesUrl: 'portal.mjpru.ac.in/events/archive'
      };
      syncEvents([newEvent, ...events]);
      onShowToast(`Registered event: "${newEvent.title}" (${newEvent.speaker.name})`, 'success');
    }

    setIsAddModalOpen(false);
    setEditingEvent(null);
  };

  // Delete Action
  const handleDeleteConfirm = () => {
    if (!deletingEvent) return;
    const updated = events.filter(e => e.id !== deletingEvent.id);
    syncEvents(updated);
    if (selectedEvent?.id === deletingEvent.id) {
      setSelectedEvent(null);
    }
    onShowToast(`Removed event: "${deletingEvent.title}"`, 'info');
    setDeletingEvent(null);
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C48] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold tracking-wide uppercase mb-2">
              <Presentation className="w-3.5 h-3.5 text-emerald-400" />
              <span>Workshops & Distinguished Guest Lectures</span>
            </div>
            <h2 className="text-2xl font-black text-white">Academic & Industry Colloquiums</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              High-caliber technical workshops, bootcamps, and executive guest lectures featuring leaders from Microsoft, NPCI, AWS, and TIFR.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all border border-emerald-400/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Workshop / Lecture</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Events</span>
              <Presentation className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">{stats.totalEvents}</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">Colloquiums & Bootcamps</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming Sessions</span>
              <Calendar className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300">{stats.upcomingCount}</div>
            <div className="text-[10px] text-indigo-300/80 mt-0.5">Open for registration</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Attendees</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300">{stats.totalAttendees}</div>
            <div className="text-[10px] text-cyan-400/80 mt-0.5">Scholars & Faculty</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed Sessions</span>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">{stats.completedCount}</div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">Archive & Recordings</div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="p-4 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Active/Ongoing', 'Upcoming', 'Completed', 'Proposal Stage'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-[#141C48]/60 text-slate-300 hover:bg-[#1A255C] hover:text-white border border-[#233175]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search, Type & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search event, speaker, venue..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-400 max-w-[150px]"
          >
            <option value="All">All Types</option>
            {uniqueTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="date-desc">Upcoming / Newest Date</option>
            <option value="attendees-desc">Most Attendees</option>
            <option value="title">Event Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Events Cards Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0E1538] border border-[#1E2964] space-y-3">
          <Presentation className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Workshops or Guest Lectures Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your filters or schedule a new academic workshop or guest lecture.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setTypeFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#1C2760] hover:bg-[#253480] text-xs text-emerald-300 font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEvents.map(event => {
            const capacityPercentage = Math.round((event.attendeesCount / event.maxCapacity) * 100);

            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-[#1E5C4A] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-emerald-950/20"
              >
                <div>
                  {/* Event Type & Status */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 flex items-center gap-1">
                        <Presentation className="w-3 h-3 text-emerald-400" />
                        <span>{event.type}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950/60 text-indigo-300 border border-indigo-700/50 flex items-center gap-1">
                        {event.mode === 'Online' ? <Tv className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        <span>{event.mode}</span>
                      </span>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide flex items-center gap-1.5 ${
                        event.status === 'Active/Ongoing'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : event.status === 'Completed'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : event.status === 'Upcoming'
                          ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          event.status === 'Active/Ongoing' ? 'bg-emerald-400 animate-pulse' :
                          event.status === 'Completed' ? 'bg-blue-400' :
                          event.status === 'Upcoming' ? 'bg-indigo-400' : 'bg-amber-400'
                        }`} />
                        {event.status}
                      </span>

                      {/* Quick Actions */}
                      <button
                        onClick={(e) => handleOpenEditModal(event, e)}
                        title="Edit Event"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-[#202D72] text-slate-300 hover:text-white border border-[#253578] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingEvent(event);
                        }}
                        title="Delete Event"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-[#253578] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Event Title */}
                  <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Speaker Banner */}
                  <div className="mt-3 p-3 rounded-xl bg-[#090E2C]/90 border border-[#1E2964] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Keynote Speaker
                      </div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{event.speaker.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {event.speaker.designation} · <strong className="text-slate-300">{event.speaker.organization}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Event Date & Time
                      </div>
                      <div className="text-xs font-bold text-emerald-300 mt-0.5">
                        {event.date}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {event.time}
                      </div>
                    </div>
                  </div>

                  {/* Venue & Target Audience */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        <strong className="text-white">Venue:</strong> {event.venue}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Users className="w-3 h-3 text-emerald-400" />
                        <span className="truncate">{event.attendeesCount} / {event.maxCapacity} Registered</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{event.collaboratingPartner || 'CSIT Chapter'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Capacity & Details Trigger */}
                <div className="mt-4 pt-3 border-t border-[#1C2760] space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-emerald-400" />
                        Seat Occupancy
                      </span>
                      <span className="font-bold text-slate-200">
                        {event.attendeesCount} of {event.maxCapacity} Seats ({capacityPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#141C48] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, capacityPercentage)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                      className="text-xs text-emerald-300 hover:text-emerald-200 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>View Session Outline & Register</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowToast(`Exported Official Brochure & Attendance Register for "${event.title}"`, 'success');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#141C48] hover:bg-[#1E2964] border border-[#2B3B8A] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Brochure</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="w-full max-w-2xl bg-[#0E1538] border border-[#2B3B8A] rounded-2xl p-6 space-y-5 my-auto text-white shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white hover:bg-[#1E2964]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
                  {selectedEvent.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                  {selectedEvent.mode}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedEvent.status === 'Active/Ongoing' ? 'bg-emerald-900/50 text-emerald-300' :
                  selectedEvent.status === 'Completed' ? 'bg-blue-900/50 text-blue-300' : 'bg-amber-900/50 text-amber-300'
                }`}>
                  {selectedEvent.status}
                </span>
              </div>

              <h2 className="text-xl font-black text-white leading-tight pr-6">
                {selectedEvent.title}
              </h2>
            </div>

            {/* Speaker Highlight Card */}
            <div className="p-4 rounded-xl bg-[#090E2C] border border-[#1E2964] space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Keynote Resource Person
              </span>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center text-emerald-300 font-bold text-base shrink-0">
                  {selectedEvent.speaker.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{selectedEvent.speaker.name}</div>
                  <div className="text-xs text-emerald-300 font-semibold">{selectedEvent.speaker.designation} · {selectedEvent.speaker.organization}</div>
                  {selectedEvent.speaker.bio && (
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{selectedEvent.speaker.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule & Venue Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#141C48]/60 border border-[#233175] text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date & Time</span>
                <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {selectedEvent.date}
                </span>
                <span className="text-[10px] text-slate-400 block">{selectedEvent.time}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Venue</span>
                <span className="font-bold text-white flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{selectedEvent.venue}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attendance / Seats</span>
                <span className="font-bold text-emerald-300 mt-0.5 block">
                  {selectedEvent.attendeesCount} / {selectedEvent.maxCapacity} Registered
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Session Overview & Objectives</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedEvent.description}</p>
            </div>

            {/* Key Takeaways */}
            {selectedEvent.keyTakeaways && selectedEvent.keyTakeaways.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Key Takeaways & Learning Outcomes</h4>
                <div className="space-y-1.5">
                  {selectedEvent.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#090E2C] border border-[#1E2964] flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1E2964]">
              <button
                onClick={() => {
                  onShowToast(`Exported Attendance Register & Certificates Roster for "${selectedEvent.title}"`, 'success');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Export Attendance Sheet</span>
              </button>

              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-[#141C48] hover:bg-[#1E2964] text-xs text-slate-300 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-[#0E1538] border border-[#2B3B8A] rounded-2xl p-6 space-y-5 my-auto text-white shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2964]">
              <div className="flex items-center gap-2">
                <Presentation className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">
                  {editingEvent ? 'Edit Workshop / Lecture' : 'Schedule New Workshop / Guest Lecture'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building Production LLM Agentic Pipelines with LangGraph"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Event Type *</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Guest Lecture">Guest Lecture</option>
                    <option value="Hands-on Bootcamp">Hands-on Bootcamp</option>
                    <option value="Masterclass">Masterclass</option>
                    <option value="Industry Keynote">Industry Keynote</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Delivery Mode *</label>
                  <select
                    value={formData.mode}
                    onChange={e => setFormData({ ...formData, mode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active/Ongoing">Active/Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Proposal Stage">Proposal Stage</option>
                  </select>
                </div>
              </div>

              {/* Speaker Fields */}
              <div className="p-3.5 rounded-xl bg-[#090E2C] border border-[#1E2964] space-y-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Speaker Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Speaker Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Er. Kunal Singhal"
                      value={formData.speaker?.name}
                      onChange={e => setFormData({ 
                        ...formData, 
                        speaker: { ...formData.speaker!, name: e.target.value } 
                      })}
                      className="w-full px-3 py-2 bg-[#141C48] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead GenAI Architect"
                      value={formData.speaker?.designation}
                      onChange={e => setFormData({ 
                        ...formData, 
                        speaker: { ...formData.speaker!, designation: e.target.value } 
                      })}
                      className="w-full px-3 py-2 bg-[#141C48] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Microsoft India IDC"
                      value={formData.speaker?.organization}
                      onChange={e => setFormData({ 
                        ...formData, 
                        speaker: { ...formData.speaker!, organization: e.target.value } 
                      })}
                      className="w-full px-3 py-2 bg-[#141C48] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    placeholder="10:00 AM – 04:30 PM IST"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Venue / Platform</label>
                  <input
                    type="text"
                    placeholder="CSIT Auditorium & MS Teams"
                    value={formData.venue}
                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Registered Attendees</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.attendeesCount}
                    onChange={e => setFormData({ ...formData, attendeesCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Max Hall Capacity</label>
                  <input
                    type="number"
                    min="10"
                    value={formData.maxCapacity}
                    onChange={e => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Session Description</label>
                <textarea
                  rows={2}
                  placeholder="Overview, syllabus, hands-on labs, and prerequisites..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Key Takeaways (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="Architecting cyclic state graphs with LangGraph&#10;Zero-shot RAG evaluation with RAGAS metrics&#10;Deploying lightweight models with Ollama & Docker"
                  value={takeawaysInput}
                  onChange={e => setTakeawaysInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2964]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141C48] hover:bg-[#1E2964] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white font-bold shadow-lg"
                >
                  {editingEvent ? 'Update Event' : 'Schedule Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deletingEvent && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingEvent(null)}
        >
          <div 
            className="w-full max-w-md bg-[#0E1538] border border-rose-600/40 rounded-2xl p-6 text-white space-y-4 shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Academic Event?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{deletingEvent.title}"</strong> featuring {deletingEvent.speaker.name}? This will remove the event brochure and cancel seat reservations.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingEvent(null)}
                className="px-4 py-2 rounded-xl bg-[#141C48] hover:bg-[#1E2964] text-xs text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold shadow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
