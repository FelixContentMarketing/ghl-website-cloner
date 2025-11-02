# OAuth Setup Guide - App zum Testen installieren

## Übersicht

Um deine App zu installieren und zu testen, musst du die OAuth-Konfiguration im Marketplace einrichten. Hier ist eine Schritt-für-Schritt-Anleitung.

---

## 1. Scopes (Berechtigungen)

### Was sind Scopes?

Scopes bestimmen, welche Berechtigungen deine App hat, um auf Daten zuzugreifen oder Aktionen durchzuführen.

### Empfohlene Scopes für Website Cloner:

Klicke auf "Select Scopes" und wähle folgende aus:

#### Minimal (für Testing):
```
✅ locations.readonly    - Location-Informationen lesen
✅ locations.write       - Location-Daten schreiben
```

#### Erweitert (für vollständige Funktionalität):
```
✅ locations.readonly    - Location-Informationen lesen
✅ locations.write       - Location-Daten schreiben
✅ contacts.readonly     - Kontakte lesen (optional)
✅ contacts.write        - Kontakte schreiben (optional)
✅ opportunities.readonly - Opportunities lesen (optional)
✅ opportunities.write   - Opportunities schreiben (optional)
```

#### Für Media/Assets:
```
✅ medias.readonly       - Media Library lesen
✅ medias.write          - Media Library schreiben
```

### 💡 Empfehlung für den Start:

**Nur diese 2 Scopes für Testing:**
- `locations.readonly`
- `locations.write`

Später kannst du weitere Scopes hinzufügen, wenn du mehr Funktionalität brauchst.

---

## 2. Redirect URLs

### Was ist eine Redirect URL?

Nach der OAuth-Authentifizierung wird der Benutzer zu dieser URL weitergeleitet. Die App erhält dort den Authorization Code.

### Für lokales Testing:

```
http://localhost:3000/auth/callback
```

### Für Production (später):

```
https://your-domain.com/auth/callback
```

### So fügst du eine Redirect URL hinzu:

1. Trage die URL in das Feld "Redirect URL" ein
2. Klicke auf "+ Add"
3. Die URL erscheint in der Liste "Added redirect URLs"

### 💡 Für jetzt:

**Füge diese URL hinzu:**
```
http://localhost:3000/auth/callback
```

**Hinweis:** Du musst später einen lokalen Server auf Port 3000 starten, um den OAuth-Flow zu testen.

---

## 3. Client Keys (Client ID & Secret)

### Was sind Client Keys?

- **Client ID:** Öffentlicher Identifier deiner App
- **Client Secret:** Geheimer Schlüssel (wie ein Passwort)

### So erstellst du Client Keys:

1. Klicke auf "+ Add" im Bereich "Client Keys"
2. Gib einen Namen ein (z.B. "Development" oder "Testing")
3. Klicke auf "Create"
4. **Wichtig:** Speichere Client ID und Client Secret sofort!
   - Client Secret wird nur einmal angezeigt
   - Du kannst ihn später nicht mehr sehen

### Wo speichern?

Erstelle eine `.env`-Datei in deinem Projekt:

```env
GHL_CLIENT_ID=deine-client-id-hier
GHL_CLIENT_SECRET=dein-client-secret-hier
GHL_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 💡 Empfehlung:

**Erstelle 2 Client Keys:**
1. "Development" - für lokales Testing
2. "Production" - für später (wenn die App live geht)

---

## 4. Shared Secret (Optional)

### Was ist ein Shared Secret?

Ein zusätzlicher Sicherheitsschlüssel für Webhook-Validierung.

### Brauchst du das jetzt?

**Nein, nicht für initiales Testing.**

Du kannst es später generieren, wenn du Webhooks implementierst.

### Wenn du es trotzdem erstellen möchtest:

1. Klicke auf "Generate key"
2. Speichere den generierten Key
3. Füge ihn zu deiner `.env` hinzu:

```env
GHL_SHARED_SECRET=dein-shared-secret-hier
```

---

## 5. Minimale Konfiguration zum Testen

### Schritt 1: Scopes auswählen

```
✅ locations.readonly
✅ locations.write
```

### Schritt 2: Redirect URL hinzufügen

```
http://localhost:3000/auth/callback
```

### Schritt 3: Client Keys erstellen

1. Klicke "+ Add"
2. Name: "Development"
3. Speichere Client ID und Client Secret

### Schritt 4: Speichern

Klicke unten rechts auf "Save"

---

## 6. OAuth-Flow implementieren

### Einfacher Test-Server (Node.js)

Erstelle eine Datei `oauth-test-server.js`:

```javascript
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

const CLIENT_ID = process.env.GHL_CLIENT_ID;
const CLIENT_SECRET = process.env.GHL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GHL_REDIRECT_URI;

// Step 1: Redirect to GHL OAuth page
app.get('/auth', (req, res) => {
  const authUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=locations.readonly locations.write`;
  res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code for token
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('No authorization code received');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://services.leadconnectorhq.com/oauth/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    res.json({
      success: true,
      access_token,
      refresh_token,
      expires_in
    });

    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);

  } catch (error) {
    console.error('Error exchanging code:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

app.listen(PORT, () => {
  console.log(`OAuth test server running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/auth to start OAuth flow`);
});
```

### Server starten:

```bash
node oauth-test-server.js
```

### OAuth-Flow testen:

1. Öffne Browser: `http://localhost:3000/auth`
2. Du wirst zu GHL weitergeleitet
3. Wähle eine Location aus
4. Autorisiere die App
5. Du wirst zurück zu `/auth/callback` geleitet
6. Du siehst Access Token und Refresh Token

---

## 7. Alternative: Ohne eigenen Server (für Quick Test)

### Verwende Postman oder Insomnia:

#### Schritt 1: Authorization URL aufrufen

```
https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=DEINE_CLIENT_ID&redirect_uri=http://localhost:3000/auth/callback&scope=locations.readonly locations.write
```

Ersetze `DEINE_CLIENT_ID` mit deiner tatsächlichen Client ID.

#### Schritt 2: Code aus URL extrahieren

Nach der Autorisierung wirst du zu einer URL wie dieser weitergeleitet:

```
http://localhost:3000/auth/callback?code=ABC123XYZ...
```

Kopiere den `code`-Parameter.

#### Schritt 3: Token-Exchange in Postman

**POST Request zu:**
```
https://services.leadconnectorhq.com/oauth/token
```

**Body (JSON):**
```json
{
  "client_id": "DEINE_CLIENT_ID",
  "client_secret": "DEIN_CLIENT_SECRET",
  "grant_type": "authorization_code",
  "code": "DER_CODE_AUS_SCHRITT_2",
  "redirect_uri": "http://localhost:3000/auth/callback"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

---

## 8. Access Token verwenden

### In deiner App:

```typescript
import axios from 'axios';

const accessToken = 'dein-access-token-hier';

// Beispiel: Locations abrufen
const response = await axios.get('https://services.leadconnectorhq.com/locations/', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Version': '2021-07-28'
  }
});

console.log('Locations:', response.data);
```

---

## 9. Checkliste für Testing

- [ ] Scopes ausgewählt (`locations.readonly`, `locations.write`)
- [ ] Redirect URL hinzugefügt (`http://localhost:3000/auth/callback`)
- [ ] Client Keys erstellt und gespeichert
- [ ] `.env`-Datei mit Client ID, Secret, Redirect URI erstellt
- [ ] OAuth-Test-Server implementiert (oder Postman vorbereitet)
- [ ] OAuth-Flow getestet
- [ ] Access Token erhalten
- [ ] API-Call mit Access Token getestet

---

## 10. Troubleshooting

### Fehler: "Invalid redirect_uri"

**Lösung:** Stelle sicher, dass die Redirect URI in der App-Konfiguration exakt mit der URI im OAuth-Request übereinstimmt (inkl. http/https, Port, Pfad).

### Fehler: "Invalid client_id"

**Lösung:** Überprüfe, dass du die richtige Client ID verwendest.

### Fehler: "Invalid client_secret"

**Lösung:** Client Secret könnte falsch sein. Erstelle ggf. neue Client Keys.

### Fehler: "Insufficient scopes"

**Lösung:** Füge die benötigten Scopes in der App-Konfiguration hinzu.

### Redirect funktioniert nicht

**Lösung:** 
- Stelle sicher, dass dein lokaler Server läuft
- Prüfe, ob Port 3000 verfügbar ist
- Teste mit einem anderen Port (z.B. 8080)

---

## 11. Nächste Schritte nach erfolgreichem Testing

1. **Token Refresh implementieren**
   - Access Tokens laufen nach 24 Stunden ab
   - Nutze Refresh Token, um neue Access Tokens zu erhalten

2. **Token-Storage**
   - Speichere Tokens sicher (z.B. in Datenbank)
   - Verschlüssele sensible Daten

3. **Production Redirect URL**
   - Erstelle eine öffentliche URL für Production
   - Füge sie zu den Redirect URLs hinzu

4. **Webhooks einrichten**
   - Für Installation/Uninstallation-Events
   - Nutze Shared Secret für Validierung

---

## Zusammenfassung

### Minimale Konfiguration zum Sofort-Testen:

1. **Scopes:** `locations.readonly`, `locations.write`
2. **Redirect URL:** `http://localhost:3000/auth/callback`
3. **Client Keys:** Erstellen und in `.env` speichern
4. **OAuth-Test-Server:** Starten und Flow testen

**Zeitaufwand:** 15-30 Minuten

---

**Viel Erfolg beim Testing!** 🚀
