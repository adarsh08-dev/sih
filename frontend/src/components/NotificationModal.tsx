import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'gig' | 'mentor' | 'passport' | 'system';
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onActionClick: (item: NotificationItem) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onActionClick
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 select-none">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-[#0A0F2E] border border-[#1E2964] rounded-2xl shadow-2xl overflow-hidden z-10 animate-fade-in flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#18214D] flex items-center justify-between bg-[#0C133B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-[#A78BFA]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Workspace Alerts</h3>
              <p className="text-[11px] text-slate-400">Real-time Notification Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-[#A78BFA] hover:text-white px-2.5 py-1 rounded bg-[#151E4E] hover:bg-[#1D275A] transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#0E1538] hover:bg-[#18214D] text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No new alerts. You're all caught up!
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onActionClick(n)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? 'bg-[#0E1538]/60 border-[#1A2352] text-slate-300'
                    : 'bg-[#121A46] border-[#2D3C84] text-white shadow-md'
                }`}
              >
                <div className={`p-2 rounded-lg mt-0.5 ${
                  n.type === 'gig' ? 'bg-amber-500/20 text-amber-300' :
                  n.type === 'mentor' ? 'bg-pink-500/20 text-pink-300' :
                  n.type === 'passport' ? 'bg-emerald-500/20 text-emerald-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {n.type === 'gig' && <Briefcase className="w-4 h-4" />}
                  {n.type === 'mentor' && <Users className="w-4 h-4" />}
                  {n.type === 'passport' && <ShieldCheck className="w-4 h-4" />}
                  {n.type === 'system' && <Sparkles className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold truncate">{n.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{n.message}</p>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[#7C5CFC] shrink-0 mt-2"></span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
