import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { GitHubIcon } from '../assets/GitHubIcon';
import { LinkedInIcon } from '../assets/LinkedInIcon';
import { checkConnection, connectAccount, disconnectAccount } from '../services/oauth';

interface AccountProps {
  platform: 'github' | 'linkedin';
  collapsed: boolean;
}

const AccountRow: React.FC<AccountProps> = ({ platform, collapsed }) => {
  const [status, setStatus] = useState<{ connected: boolean; username?: string }>({ connected: false });
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    const result = await checkConnection(platform);
    setStatus(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        fetchStatus();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [platform]);

  const handleConnect = async () => {
    try {
      await connectAccount(platform);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisconnect = async () => {
    await disconnectAccount(platform);
    fetchStatus();
  };

  const Icon = platform === 'github' ? GitHubIcon : LinkedInIcon;

  return (
    <div className={`flex items-center ${collapsed ? 'justify-center p-2 w-9 h-9 mx-auto' : 'justify-between p-2'} rounded-lg bg-[#2C1B2F] border border-[#5E3A5C]`}>
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
        <Icon className={`w-4 h-4 ${platform === 'github' ? 'text-[#F3E9EC]' : 'text-[#B47A9A]'}`} />
        {!collapsed && <span className="text-xs font-medium text-[#F3E9EC]/80 capitalize">{platform}</span>}
      </div>
      
      {!collapsed && (
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#F3E9EC]/50" />
          ) : status.connected ? (
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span className="truncate">{status.username}</span>
              <button onClick={handleDisconnect} className="text-rose-400 hover:text-white">×</button>
            </div>
          ) : (
            <button onClick={handleConnect} className="text-[10px] bg-[#5E3A5C] hover:bg-[#B47A9A] text-[#F3E9EC] px-2 py-0.5 rounded transition-colors">Connect</button>
          )}
        </div>
      )}
    </div>
  );
};

export const ConnectedAccounts: React.FC<{ collapsed: boolean, role: string }> = ({ collapsed, role }) => (
  <div className="space-y-2">
    {!collapsed && <div className="px-2.5 text-[10px] font-bold text-[#F3E9EC]/40 uppercase tracking-[1.5px]">CONNECTED ACCOUNTS</div>}
    <div className="space-y-1.5 px-2.5">
      {role === 'student' && <AccountRow platform="github" collapsed={collapsed} />}
      <AccountRow platform="linkedin" collapsed={collapsed} />
    </div>
  </div>
);
