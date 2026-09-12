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

      <div className="relative w-full max-w-lg bg-[#0B0E1A] border border-[#5E3A5C]/40 rounded-2xl shadow-2xl overflow-hidden z-10 animate-fade-in flex flex-col max-h-[85vh] text-[#F3E9EC]">
        {/* Header */}
        <div className="p-5 border-b border-[#5E3A5C]/30 flex items-center justify-between bg-[#0B0E1A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#2C1B2F] text-[#B47A9A] border border-[#5E3A5C]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3E9EC]">Live Workspace Alerts</h3>
              <p className="text-[11px] text-[#F3E9EC]/60">Real-time Notification Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-[#B47A9A] hover:text-[#F3E9EC] px-2.5 py-1 rounded-lg bg-[#2C1B2F] border border-[#5E3A5C] hover:border-[#B47A9A] transition-colors cursor-pointer"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#2C1B2F] border border-[#5E3A5C] hover:border-[#B47A9A] text-[#F3E9EC]/60 hover:text-[#F3E9EC] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-[#F3E9EC]/50 text-xs">
              No new alerts. You're all caught up!
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onActionClick(n)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? 'bg-[#2C1B2F]/50 border-[#5E3A5C] text-[#F3E9EC]/70 hover:bg-[#2C1B2F]'
                    : 'bg-[#2C1B2F] border-[#B47A9A] text-[#F3E9EC] shadow-md'
                }`}
              >
                <div className="p-2 rounded-lg mt-0.5 bg-[#5E3A5C]/40 text-[#B47A9A] border border-[#5E3A5C]">
                  {n.type === 'gig' && <Briefcase className="w-4 h-4" />}
                  {n.type === 'mentor' && <Users className="w-4 h-4" />}
                  {n.type === 'passport' && <ShieldCheck className="w-4 h-4" />}
                  {n.type === 'system' && <Sparkles className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold truncate text-[#F3E9EC]">{n.title}</p>
                    <span className="text-[10px] text-[#F3E9EC]/50 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-[#F3E9EC]/80 line-clamp-2 leading-relaxed">{n.message}</p>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[#B47A9A] shrink-0 mt-2"></span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
