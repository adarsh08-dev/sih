export interface ConnectionStatus {
  connected: boolean;
  username?: string;
  avatarUrl?: string;
}

export const checkConnection = async (platform: 'github' | 'linkedin'): Promise<ConnectionStatus> => {
  const response = await fetch(`/api/auth/status/${platform}`);
  if (!response.ok) return { connected: false };
  return response.json();
};

export const connectAccount = async (platform: 'github' | 'linkedin') => {
  const response = await fetch(`/api/auth/url?platform=${platform}`);
  if (!response.ok) throw new Error('Failed to get auth URL');
  const { url } = await response.json();
  
  const authWindow = window.open(url, 'oauth_popup', 'width=600,height=700');
  if (!authWindow) {
    throw new Error('Please allow popups for this site to connect your account.');
  }
};

export const disconnectAccount = async (platform: 'github' | 'linkedin') => {
  const response = await fetch(`/api/auth/disconnect/${platform}`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to disconnect');
  return true;
};
