# Quickstart: OAuth Testing

## Problem

Die Redirect URLs funktionieren nicht, weil noch kein Server läuft, der diese URLs bedient.

**Fehler:**
- `http://localhost:3000/auth/callback` → ERR_CONNECTION_REFUSED
- `https://promechsys.com/website-cloner/auth/callback` → 404 Page not found

**Lösung:** Starte den OAuth-Test-Server!

---

## Schnellstart (5 Minuten)

### Schritt 1: Dependencies installieren

```bash
cd ghl-website-cloner
npm install express axios dotenv
```

### Schritt 2: .env Datei erstellen

Erstelle eine `.env` Datei im Projektverzeichnis:

```env
GHL_CLIENT_ID=deine-client-id-hier
GHL_CLIENT_SECRET=dein-client-secret-hier
GHL_REDIRECT_URI=http://localhost:3000/auth/callback
PORT=3000
```

**Wichtig:** Ersetze `deine-client-id-hier` und `dein-client-secret-hier` mit deinen tatsächlichen Werten aus dem GHL Marketplace!

### Schritt 3: Server starten

```bash
node oauth-test-server.js
```

Du solltest sehen:

```
🚀 OAuth Test Server gestartet!

📍 Server läuft auf: http://localhost:3000
🔗 OAuth-Flow starten: http://localhost:3000/auth
✅ Health Check: http://localhost:3000/health

✅ OAuth konfiguriert und bereit!
```

### Schritt 4: OAuth-Flow testen

1. Öffne im Browser: `http://localhost:3000`
2. Klicke auf "🚀 Mit GHL verbinden"
3. Du wirst zu GoHighLevel weitergeleitet
4. Wähle eine Location aus
5. Klicke "Authorize"
6. Du wirst zurück zu `localhost:3000/auth/callback` geleitet
7. Du siehst deine Access Token und Refresh Token!

---

## Was der Server macht

### Routes:

- **GET /** - Startseite mit Anleitung
- **GET /auth** - Leitet zu GHL OAuth weiter
- **GET /auth/callback** - Empfängt Code und tauscht gegen Token
- **GET /health** - Health Check

### OAuth-Flow:

1. User klickt "Mit GHL verbinden"
2. Server leitet zu GHL OAuth weiter mit:
   - Client ID
   - Redirect URI
   - Scopes: `funnels/funnel.readonly`, `funnels/page.readonly`, etc.
3. User autorisiert in GHL
4. GHL leitet zurück mit `code` Parameter
5. Server tauscht `code` gegen `access_token` und `refresh_token`
6. Server zeigt Tokens an

---

## Troubleshooting

### "CLIENT_ID not configured"

**Problem:** `.env` Datei fehlt oder ist leer

**Lösung:** Erstelle `.env` mit deinen Credentials

### "Invalid client_id"

**Problem:** Client ID ist falsch

**Lösung:** Überprüfe Client ID im GHL Marketplace unter "Client Keys"

### "Invalid redirect_uri"

**Problem:** Redirect URI stimmt nicht überein

**Lösung:** 
- Stelle sicher, dass `http://localhost:3000/auth/callback` im Marketplace eingetragen ist
- Prüfe, dass `.env` die gleiche URI enthält

### "Token exchange failed"

**Problem:** Client Secret ist falsch oder abgelaufen

**Lösung:** Erstelle neue Client Keys im Marketplace

---

## Nach erfolgreichem Test

### 1. Tokens speichern

Kopiere die Tokens aus dem Browser und füge sie zu `.env` hinzu:

```env
GHL_ACCESS_TOKEN=eyJhbGc...
GHL_REFRESH_TOKEN=eyJhbGc...
GHL_LOCATION_ID=abc123...
```

### 2. API testen

```javascript
const axios = require('axios');
require('dotenv').config();

const accessToken = process.env.GHL_ACCESS_TOKEN;
const locationId = process.env.GHL_LOCATION_ID;

// Test: Funnels abrufen
const response = await axios.get(
  `https://services.leadconnectorhq.com/funnels/lookup`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Version': '2021-07-28'
    },
    params: {
      locationId: locationId
    }
  }
);

console.log('Funnels:', response.data);
```

### 3. Token Refresh implementieren

Access Tokens laufen nach 24 Stunden ab. Nutze den Refresh Token:

```javascript
const refreshResponse = await axios.post(
  'https://services.leadconnectorhq.com/oauth/token',
  {
    client_id: process.env.GHL_CLIENT_ID,
    client_secret: process.env.GHL_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: process.env.GHL_REFRESH_TOKEN
  }
);

const newAccessToken = refreshResponse.data.access_token;
```

---

## Production Deployment

### Für promechsys.com:

1. **Server auf promechsys.com deployen**
2. **Route einrichten:** `/website-cloner/auth/callback`
3. **SSL/HTTPS aktivieren**
4. **Im Marketplace aktualisieren:** `https://promechsys.com/website-cloner/auth/callback`

### Express Route für Production:

```javascript
// In deiner bestehenden Express-App
const websiteClonerAuth = require('./oauth-test-server');
app.use('/website-cloner', websiteClonerAuth);
```

---

## Zusammenfassung

### Lokales Testing:
1. ✅ `npm install express axios dotenv`
2. ✅ `.env` erstellen mit Client ID & Secret
3. ✅ `node oauth-test-server.js`
4. ✅ `http://localhost:3000/auth` öffnen
5. ✅ OAuth-Flow durchlaufen
6. ✅ Tokens kopieren

### Production:
1. Server auf promechsys.com deployen
2. HTTPS einrichten
3. Redirect URI im Marketplace aktualisieren
4. Testen!

---

**Zeitaufwand:** 5-10 Minuten für lokales Testing

**Nächste Schritte:** Integriere OAuth in deine Website Cloner App
