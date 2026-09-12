export interface ConnectionStatus {
  connected: boolean;
  username?: string;
  avatarUrl?: string;
}

export const checkConnection = async (platform: 'github' | 'linkedin'): Promise<ConnectionStatus> => {
  try {
    const response = await fetch(`/api/auth/status/${platform}`);
    if (!response.ok) return { connected: false };
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return { connected: false };
    const data = await response.json();
    return {
      connected: Boolean(data && data.connected),
      username: data?.username,
      avatarUrl: data?.avatarUrl
    };
  } catch {
    return { connected: false };
  }
};

export const connectAccount = async (platform: 'github' | 'linkedin') => {
  try {
    const response = await fetch(`/api/auth/url?platform=${platform}`);
    if (!response.ok) throw new Error('Failed to get auth URL');
    const data = await response.json();
    const url = data?.url;
    if (!url) return;
    
    const authWindow = window.open(url, 'oauth_popup', 'width=600,height=700');
    if (!authWindow) {
      console.warn('Popups blocked or not supported in iframe environment');
    }
  } catch (e: any) {
    console.warn('OAuth connect notice:', e.message);
  }
};

export const disconnectAccount = async (platform: 'github' | 'linkedin') => {
  try {
    const response = await fetch(`/api/auth/disconnect/${platform}`, { method: 'POST' });
    if (!response.ok) return false;
    return true;
  } catch {
    return false;
  }
};
