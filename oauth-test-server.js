/**
 * OAuth Test Server für Website Cloner App
 * 
 * Dieser Server ermöglicht es, den OAuth-Flow zu testen.
 * 
 * Setup:
 * 1. npm install express axios dotenv
 * 2. Erstelle .env mit GHL_CLIENT_ID, GHL_CLIENT_SECRET, GHL_REDIRECT_URI
 * 3. node oauth-test-server.js
 * 4. Öffne http://localhost:3000/auth
 */

const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables
const CLIENT_ID = process.env.GHL_CLIENT_ID;
const CLIENT_SECRET = process.env.GHL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GHL_REDIRECT_URI || `http://localhost:${PORT}/auth/callback`;

// Scopes für Website Cloner
const SCOPES = [
  'funnels/funnel.readonly',
  'funnels/page.readonly',
  'funnels/redirect.readonly',
  'funnels/redirect.write'
].join(' ');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Website Cloner OAuth Test</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #4F46E5;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 10px 0;
        }
        .button:hover {
          background: #4338CA;
        }
        .info {
          background: #EEF2FF;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .error {
          background: #FEE2E2;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
          color: #991B1B;
        }
        code {
          background: #F3F4F6;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔐 Website Cloner OAuth Test</h1>
        
        ${!CLIENT_ID || !CLIENT_SECRET ? `
          <div class="error">
            <strong>⚠️ Konfiguration fehlt!</strong>
            <p>Bitte erstelle eine <code>.env</code> Datei mit:</p>
            <pre>
GHL_CLIENT_ID=deine-client-id
GHL_CLIENT_SECRET=dein-client-secret
GHL_REDIRECT_URI=http://localhost:${PORT}/auth/callback
            </pre>
          </div>
        ` : `
          <div class="info">
            <strong>✅ Server läuft!</strong>
            <p>Client ID: <code>${CLIENT_ID.substring(0, 10)}...</code></p>
            <p>Redirect URI: <code>${REDIRECT_URI}</code></p>
            <p>Scopes: <code>${SCOPES}</code></p>
          </div>
          
          <h2>OAuth-Flow starten</h2>
          <p>Klicke auf den Button, um den OAuth-Flow zu starten:</p>
          <a href="/auth" class="button">🚀 Mit GHL verbinden</a>
          
          <h2>Was passiert?</h2>
          <ol>
            <li>Du wirst zu GoHighLevel weitergeleitet</li>
            <li>Wähle eine Location aus</li>
            <li>Autorisiere die App</li>
            <li>Du wirst zurück zu <code>/auth/callback</code> geleitet</li>
            <li>Der Server tauscht den Code gegen Access Token</li>
            <li>Du siehst die Token-Informationen</li>
          </ol>
        `}
      </div>
    </body>
    </html>
  `);
});

// Step 1: Redirect to GHL OAuth
app.get('/auth', (req, res) => {
  if (!CLIENT_ID) {
    return res.status(500).send('CLIENT_ID not configured');
  }

  const authUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
  
  console.log('🔗 Redirecting to OAuth URL:', authUrl);
  res.redirect(authUrl);
});

// Step 2: Handle OAuth callback
app.get('/auth/callback', async (req, res) => {
  const { code, error, error_description } = req.query;
  
  // Check for OAuth errors
  if (error) {
    console.error('❌ OAuth Error:', error, error_description);
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OAuth Error</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .error { background: #FEE2E2; padding: 20px; border-radius: 8px; color: #991B1B; }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>❌ OAuth Error</h1>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Description:</strong> ${error_description || 'No description'}</p>
          <a href="/">← Zurück</a>
        </div>
      </body>
      </html>
    `);
  }

  // Check for authorization code
  if (!code) {
    console.error('❌ No authorization code received');
    return res.status(400).send('No authorization code received');
  }

  console.log('✅ Authorization code received:', code.substring(0, 20) + '...');

  try {
    // Exchange code for access token
    console.log('🔄 Exchanging code for access token...');
    
    const tokenResponse = await axios.post(
      'https://services.leadconnectorhq.com/oauth/token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { 
      access_token, 
      refresh_token, 
      expires_in, 
      token_type,
      locationId,
      companyId,
      userId
    } = tokenResponse.data;

    console.log('✅ Access token received!');
    console.log('📍 Location ID:', locationId);
    console.log('⏰ Expires in:', expires_in, 'seconds');

    // Test API call
    let locationData = null;
    try {
      console.log('🧪 Testing API call...');
      const apiResponse = await axios.get(
        `https://services.leadconnectorhq.com/locations/${locationId}`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Version': '2021-07-28'
          }
        }
      );
      locationData = apiResponse.data;
      console.log('✅ API call successful!');
    } catch (apiError) {
      console.error('❌ API call failed:', apiError.response?.data || apiError.message);
    }

    // Display success page
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OAuth Success</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 1000px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .success {
            background: #D1FAE5;
            padding: 20px;
            border-radius: 8px;
            color: #065F46;
            margin-bottom: 20px;
          }
          .token-box {
            background: #F3F4F6;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
            word-break: break-all;
            font-family: monospace;
            font-size: 12px;
          }
          .info-box {
            background: #EEF2FF;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
          }
          h2 {
            color: #333;
            margin-top: 30px;
          }
          .copy-btn {
            background: #4F46E5;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
          }
          .copy-btn:hover {
            background: #4338CA;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">
            <h1>✅ OAuth erfolgreich!</h1>
            <p>Die Authentifizierung war erfolgreich. Du hast jetzt Zugriff auf die GHL API.</p>
          </div>

          <h2>📍 Location Information</h2>
          <div class="info-box">
            <strong>Location ID:</strong> ${locationId || 'N/A'}<br>
            <strong>Company ID:</strong> ${companyId || 'N/A'}<br>
            <strong>User ID:</strong> ${userId || 'N/A'}<br>
            ${locationData ? `<strong>Location Name:</strong> ${locationData.location?.name || 'N/A'}` : ''}
          </div>

          <h2>🔑 Access Token</h2>
          <div class="token-box">${access_token}</div>
          <button class="copy-btn" onclick="navigator.clipboard.writeText('${access_token}')">📋 Kopieren</button>

          <h2>🔄 Refresh Token</h2>
          <div class="token-box">${refresh_token}</div>
          <button class="copy-btn" onclick="navigator.clipboard.writeText('${refresh_token}')">📋 Kopieren</button>

          <h2>⏰ Token Info</h2>
          <div class="info-box">
            <strong>Token Type:</strong> ${token_type}<br>
            <strong>Expires In:</strong> ${expires_in} seconds (${Math.round(expires_in / 3600)} hours)<br>
            <strong>Expires At:</strong> ${new Date(Date.now() + expires_in * 1000).toLocaleString('de-DE')}
          </div>

          <h2>💾 Speichere diese Tokens</h2>
          <p>Füge sie zu deiner <code>.env</code> Datei hinzu:</p>
          <div class="token-box">
GHL_ACCESS_TOKEN=${access_token}
GHL_REFRESH_TOKEN=${refresh_token}
GHL_LOCATION_ID=${locationId}
          </div>

          <h2>🧪 Nächste Schritte</h2>
          <ol>
            <li>Kopiere die Tokens in deine .env Datei</li>
            <li>Teste API-Calls mit dem Access Token</li>
            <li>Implementiere Token Refresh (läuft nach 24h ab)</li>
            <li>Integriere in deine Website Cloner App</li>
          </ol>

          <a href="/">← Zurück zur Startseite</a>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('❌ Token exchange failed:', error.response?.data || error.message);
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Token Exchange Error</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .error { background: #FEE2E2; padding: 20px; border-radius: 8px; color: #991B1B; }
          pre { background: #F3F4F6; padding: 15px; border-radius: 6px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>❌ Token Exchange Failed</h1>
          <p><strong>Error:</strong> ${error.message}</p>
          ${error.response?.data ? `
            <h3>Details:</h3>
            <pre>${JSON.stringify(error.response.data, null, 2)}</pre>
          ` : ''}
          <a href="/">← Zurück</a>
        </div>
      </body>
      </html>
    `);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    configured: !!(CLIENT_ID && CLIENT_SECRET),
    redirect_uri: REDIRECT_URI,
    scopes: SCOPES
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 OAuth Test Server gestartet!');
  console.log('');
  console.log(`📍 Server läuft auf: http://localhost:${PORT}`);
  console.log(`🔗 OAuth-Flow starten: http://localhost:${PORT}/auth`);
  console.log(`✅ Health Check: http://localhost:${PORT}/health`);
  console.log('');
  
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.log('⚠️  WARNUNG: CLIENT_ID oder CLIENT_SECRET nicht konfiguriert!');
    console.log('   Erstelle eine .env Datei mit:');
    console.log('   GHL_CLIENT_ID=deine-client-id');
    console.log('   GHL_CLIENT_SECRET=dein-client-secret');
    console.log('');
  } else {
    console.log('✅ OAuth konfiguriert und bereit!');
    console.log('');
  }
});
