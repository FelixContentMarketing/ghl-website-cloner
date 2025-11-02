# OAuth Setup - Einfache Anleitung (Basierend auf deiner CSV Importer App)

## Übersicht

Ich habe deine CSV Importer App analysiert. Hier ist genau, was du für die Website Cloner App einstellen musst.

---

## 1. Scopes (Berechtigungen)

### Was du bei deiner CSV Importer App hast:
```
✅ locations/customValues.readonly
✅ locations/customValues.write
```

### Was du für Website Cloner brauchst:

**Minimal (für Testing):**
```
✅ locations.readonly
✅ locations.write
```

**Erweitert (für vollständige Funktionalität):**
```
✅ locations.readonly
✅ locations.write
✅ locations/customValues.readonly
✅ locations/customValues.write
```

### 💡 Meine Empfehlung:

Starte mit diesen **4 Scopes**:
```
locations.readonly
locations.write
locations/customValues.readonly
locations/customValues.write
```

Das gibt dir Zugriff auf:
- Location-Informationen
- Custom Values (für Metadata)
- Basis-Funktionalität zum Testen

---

## 2. Redirect URLs

### Was du bei deiner CSV Importer App hast:
```
https://promechsys.com-import/customvalues.knoalle.app/
https://promechsys.com-import/customvalues.knoalle.app
```

### Was du für Website Cloner brauchst:

**Option 1: Lokales Testing (Empfohlen für den Start)**
```
http://localhost:3000/auth/callback
```

**Option 2: Deine bestehende Domain nutzen**
```
https://promechsys.com/website-cloner/auth/callback
```
oder
```
https://website-cloner.knoalle.app/auth/callback
```

### So fügst du sie hinzu:

1. Trage die URL in das Feld "Redirect URL" ein
2. Klicke auf "+ Add"
3. Die URL erscheint in der Liste "Added redirect URLs"

### 💡 Meine Empfehlung:

**Füge beide hinzu:**
```
http://localhost:3000/auth/callback          (für lokales Testing)
https://promechsys.com/website-cloner/auth/callback  (für Production)
```

---

## 3. Client Keys

### Was du bei deiner CSV Importer App hast:
```
✅ ProMechSysPublic (Client ID: 68e789d84422...)
✅ ProMechSys CS... (Client ID: 68e789d84422...)
```

### Was du für Website Cloner brauchst:

**Erstelle 1-2 Client Keys:**

#### Option 1: Nur Development
```
Name: WebsiteCloner-Dev
```

#### Option 2: Development + Production
```
Name: WebsiteCloner-Dev
Name: WebsiteCloner-Prod
```

### So erstellst du Client Keys:

1. Klicke auf "+ Add" im Bereich "Client Keys"
2. Gib einen Namen ein: `WebsiteCloner-Dev`
3. Klicke auf "Create"
4. **WICHTIG:** Kopiere sofort Client ID und Client Secret!
   - Client Secret wird nur einmal angezeigt
   - Du kannst ihn später nicht mehr sehen

### Wo speichern?

Erstelle/aktualisiere deine `.env`-Datei:

```env
# Website Cloner OAuth
GHL_CLIENT_ID=deine-neue-client-id-hier
GHL_CLIENT_SECRET=dein-neues-client-secret-hier
GHL_REDIRECT_URI=http://localhost:3000/auth/callback

# Optional: Production
GHL_CLIENT_ID_PROD=deine-prod-client-id-hier
GHL_CLIENT_SECRET_PROD=dein-prod-client-secret-hier
GHL_REDIRECT_URI_PROD=https://promechsys.com/website-cloner/auth/callback
```

---

## 4. Shared Secret

### Was du bei deiner CSV Importer App hast:
```
(Noch nicht generiert - "Click on generate key to create new Shared Secret key")
```

### Brauchst du das für Website Cloner?

**Nein, nicht für initiales Testing.**

Du kannst es später generieren, wenn du Webhooks implementierst.

---

## 5. Schritt-für-Schritt: Genau das Gleiche wie bei CSV Importer

### Schritt 1: Scopes auswählen

1. Klicke auf "Select Scopes"
2. Suche und wähle:
   - `locations.readonly`
   - `locations.write`
   - `locations/customValues.readonly`
   - `locations/customValues.write`
3. Die ausgewählten Scopes erscheinen als blaue Tags

### Schritt 2: Redirect URLs hinzufügen

1. Trage ein: `http://localhost:3000/auth/callback`
2. Klicke "+ Add"
3. Trage ein: `https://promechsys.com/website-cloner/auth/callback`
4. Klicke "+ Add"

### Schritt 3: Client Keys erstellen

1. Klicke "+ Add" im Bereich "Client Keys"
2. Name: `WebsiteCloner-Dev`
3. Klicke "Create"
4. **Kopiere Client ID und Client Secret sofort!**
5. Speichere sie in deiner `.env`-Datei

### Schritt 4: Speichern

Klicke unten rechts auf "Save"

---

## 6. Deine bestehende Infrastruktur nutzen

### Du hast bereits:
- ✅ Domain: `promechsys.com`
- ✅ Subdomain: `knoalle.app`
- ✅ OAuth-Flow implementiert (bei CSV Importer)

### Du kannst:

**Option 1: Gleiche Infrastruktur nutzen**
- Erweitere deine bestehende OAuth-Implementierung
- Füge einen neuen Endpoint hinzu: `/website-cloner/auth/callback`
- Nutze die gleiche Authentifizierungs-Logik

**Option 2: Separater Service**
- Erstelle einen neuen Service für Website Cloner
- Nutze eine Subdomain: `website-cloner.knoalle.app`
- Komplett unabhängig von CSV Importer

### 💡 Meine Empfehlung:

**Nutze deine bestehende Infrastruktur:**
```
https://promechsys.com/website-cloner/
```

Das spart Zeit und du kannst Code wiederverwenden.

---

## 7. Code-Beispiel (basierend auf deiner CSV Importer App)

### Wenn du Node.js/Express nutzt:

```javascript
// website-cloner-oauth.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const CLIENT_ID = process.env.GHL_CLIENT_ID;
const CLIENT_SECRET = process.env.GHL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GHL_REDIRECT_URI;

// Scopes für Website Cloner
const SCOPES = [
  'locations.readonly',
  'locations.write',
  'locations/customValues.readonly',
  'locations/customValues.write'
].join(' ');

// Step 1: Redirect to GHL OAuth
router.get('/auth', (req, res) => {
  const authUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
  res.redirect(authUrl);
});

// Step 2: Handle callback
router.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('No authorization code received');
  }

  try {
    // Exchange code for token
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

    const { access_token, refresh_token, expires_in, locationId } = tokenResponse.data;

    // TODO: Speichere Tokens in Datenbank
    // await saveTokens(locationId, access_token, refresh_token);

    res.json({
      success: true,
      message: 'Authentication successful',
      locationId: locationId,
      expiresIn: expires_in
    });

  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.response?.data 
    });
  }
});

module.exports = router;
```

### In deiner Haupt-App:

```javascript
// app.js
const express = require('express');
const websiteClonerOAuth = require('./website-cloner-oauth');

const app = express();

// Mount OAuth routes
app.use('/website-cloner', websiteClonerOAuth);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('OAuth URL: http://localhost:3000/website-cloner/auth');
});
```

---

## 8. Testing

### Schritt 1: Server starten

```bash
node app.js
```

### Schritt 2: OAuth-Flow starten

Öffne im Browser:
```
http://localhost:3000/website-cloner/auth
```

### Schritt 3: Location auswählen

1. Du wirst zu GHL weitergeleitet
2. Wähle eine Location aus
3. Klicke "Authorize"

### Schritt 4: Token erhalten

Du wirst zurück zu `/auth/callback` geleitet und siehst:
```json
{
  "success": true,
  "message": "Authentication successful",
  "locationId": "abc123...",
  "expiresIn": 86400
}
```

### Schritt 5: API testen

```javascript
const axios = require('axios');

const accessToken = 'dein-access-token-hier';
const locationId = 'deine-location-id-hier';

// Test: Custom Values abrufen
const response = await axios.get(
  `https://services.leadconnectorhq.com/locations/${locationId}/customValues`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Version': '2021-07-28'
    }
  }
);

console.log('Custom Values:', response.data);
```

---

## 9. Checkliste (Genau wie bei CSV Importer)

- [ ] **Scopes ausgewählt**
  - [ ] `locations.readonly`
  - [ ] `locations.write`
  - [ ] `locations/customValues.readonly`
  - [ ] `locations/customValues.write`

- [ ] **Redirect URLs hinzugefügt**
  - [ ] `http://localhost:3000/auth/callback`
  - [ ] `https://promechsys.com/website-cloner/auth/callback`

- [ ] **Client Keys erstellt**
  - [ ] Name: `WebsiteCloner-Dev`
  - [ ] Client ID gespeichert
  - [ ] Client Secret gespeichert

- [ ] **`.env` aktualisiert**
  - [ ] `GHL_CLIENT_ID`
  - [ ] `GHL_CLIENT_SECRET`
  - [ ] `GHL_REDIRECT_URI`

- [ ] **Gespeichert**
  - [ ] "Save" Button geklickt

- [ ] **OAuth-Flow getestet**
  - [ ] Server gestartet
  - [ ] `/auth` aufgerufen
  - [ ] Location autorisiert
  - [ ] Token erhalten

---

## 10. Unterschiede zu CSV Importer

### CSV Importer:
- Scopes: `locations/customValues.readonly`, `locations/customValues.write`
- Funktionalität: Custom Values importieren

### Website Cloner:
- Scopes: `locations.readonly`, `locations.write` + Custom Values
- Funktionalität: Komplette Websites importieren

### Gemeinsam:
- Gleiche OAuth-Flow-Struktur
- Gleiche Domain/Infrastruktur nutzbar
- Gleiche Token-Handling-Logik

---

## Zusammenfassung

### Was du jetzt tun musst:

1. **Gehe zu:** https://marketplace.gohighlevel.com/app-settings/[DEINE-APP-ID]/advanced/auth

2. **Scopes:** Wähle `locations.readonly`, `locations.write`, `locations/customValues.readonly`, `locations/customValues.write`

3. **Redirect URLs:** Füge hinzu:
   - `http://localhost:3000/auth/callback`
   - `https://promechsys.com/website-cloner/auth/callback`

4. **Client Keys:** Erstelle `WebsiteCloner-Dev` und speichere Credentials

5. **Save:** Klicke "Save"

6. **Testing:** Implementiere OAuth-Flow und teste

**Zeitaufwand:** 10-15 Minuten

---

**Das war's! Du kannst jetzt die gleiche Struktur wie bei deiner CSV Importer App verwenden.** 🚀
