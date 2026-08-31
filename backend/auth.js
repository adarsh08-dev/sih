const axios = require('axios');
const db = require('./db');

const handleAuthUrl = (req, res) => {
  const { platform } = req.query;
  const redirectUri = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/callback?platform=${platform}`;
  
  let authUrl = '';
  if (platform === 'github') {
    authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
  } else if (platform === 'linkedin') {
    authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email`;
  }
  
  res.json({ url: authUrl });
};

const handleAuthCallback = async (req, res) => {
  const { code, platform } = req.query;
  
  try {
    let accessToken = '';
    let userData = {};

    if (platform === 'github') {
      const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      }, { headers: { accept: 'application/json' } });
      
      accessToken = tokenResponse.data.access_token;
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${accessToken}` }
      });
      userData = { id: userResponse.data.id, username: userResponse.data.login, avatarUrl: userResponse.data.avatar_url };
    } else if (platform === 'linkedin') {
      const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: `${process.env.APP_URL}/api/auth/callback?platform=linkedin`,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET
        }
      });
      accessToken = tokenResponse.data.access_token;
      const userResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      userData = { id: userResponse.data.sub, username: userResponse.data.name, avatarUrl: userResponse.data.picture };
    }

    // Save connection to DB
    await db.query('INSERT INTO account_connections (user_id, platform, external_id, username, access_token) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id, platform) DO UPDATE SET access_token = $5', [1, platform, userData.id, userData.username, accessToken]);

    res.send(`
      <html><body><script>
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
          window.close();
        } else { window.location.href = '/'; }
      </script></body></html>
    `);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('Authentication failed');
  }
};

const handleAuthStatus = async (req, res) => {
  const { platform } = req.params;
  try {
    const result = await db.query('SELECT username FROM account_connections WHERE user_id = $1 AND platform = $2', [1, platform]);
    if (result.rows.length > 0) {
      res.json({ connected: true, username: result.rows[0].username });
    } else {
      res.json({ connected: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to check status' });
  }
};

const handleDisconnect = async (req, res) => {
  const { platform } = req.params;
  await db.query('DELETE FROM account_connections WHERE user_id = $1 AND platform = $2', [1, platform]);
  res.json({ success: true });
};

module.exports = { handleAuthUrl, handleAuthCallback, handleAuthStatus, handleDisconnect };
