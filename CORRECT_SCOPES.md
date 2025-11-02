# Korrekte Scopes für Website Cloner App

## ⚠️ WICHTIG: Minimale Berechtigungen verwenden!

Du hast absolut recht - `locations.write` ist viel zu weitreichend und sensibel. Hier sind die **korrekten, minimalen Scopes** für die Website Cloner App.

---

## Funnel-bezogene Scopes (aus deinem Screenshot)

### Für Funnels:

#### Readonly (Lesen):
```
✅ funnels/redirect.readonly      - Funnel Redirects lesen
✅ funnels/page.readonly          - Funnel Pages lesen
✅ funnels/funnel.readonly        - Funnels lesen
✅ funnels/pagecount.readonly     - Page Count lesen
```

#### Write (Schreiben):
```
✅ funnels/redirect.write         - Funnel Redirects erstellen/bearbeiten
```

**Hinweis:** Es gibt anscheinend **KEINE** `funnels/page.write` oder `funnels/funnel.write` Scopes in der API! Das ist das Problem, das ich in der Analyse erwähnt habe.

---

## Website/Blog-bezogene Scopes (aus deinem Screenshot)

### Für Websites/Blogs:

#### Readonly:
```
✅ wordpress.site.readonly        - WordPress Sites lesen
✅ blogs/check-slug.readonly      - Blog Slugs prüfen
✅ blogs/category.readonly        - Blog Categories lesen
✅ blogs/author.readonly          - Blog Authors lesen
```

#### Write:
```
✅ blogs/post.write               - Blog Posts erstellen
✅ blogs/post-update.write        - Blog Posts aktualisieren
✅ socialplanner/category.write   - Social Planner Categories
```

---

## Empfohlene Scopes für Website Cloner

### Minimal (Nur Lesen - für Testing):

```
✅ funnels/funnel.readonly
✅ funnels/page.readonly
✅ funnels/redirect.readonly
```

**Was du damit machen kannst:**
- Bestehende Funnels auflisten
- Funnel-Pages lesen
- Funnel-Struktur analysieren

**Was du NICHT machen kannst:**
- Neue Funnels erstellen
- Pages bearbeiten
- Content importieren

---

### Erweitert (mit Schreib-Zugriff):

```
✅ funnels/funnel.readonly
✅ funnels/page.readonly
✅ funnels/redirect.readonly
✅ funnels/redirect.write
```

**Zusätzlich kannst du:**
- Redirects erstellen (für importierte Pages)

**Aber IMMER NOCH NICHT:**
- Neue Funnels erstellen ❌
- Pages erstellen ❌

---

## Das Problem: Keine Funnel/Page Creation API

### Was die API NICHT bietet:

❌ `funnels/funnel.write` - Existiert nicht!
❌ `funnels/page.write` - Existiert nicht!

### Warum das ein Problem ist:

Die Website Cloner App kann:
1. ✅ Websites scrapen
2. ✅ Content extrahieren
3. ✅ Bestehende Funnels lesen
4. ❌ **KEINE neuen Funnels/Pages erstellen via API**

---

## Lösungsansätze

### Option 1: Nur Readonly (Analyse-Tool)

**Scopes:**
```
funnels/funnel.readonly
funnels/page.readonly
```

**Funktionalität:**
- Website scrapen ✅
- Funnel-Struktur analysieren ✅
- Vergleich zwischen gescrapten und bestehenden Funnels ✅
- **Manueller Import** durch Benutzer ❌

**Use Case:**
"Website Analyzer" - Analysiert Websites und zeigt, wie sie in Funnels strukturiert werden könnten.

---

### Option 2: Export/Import-Tool

**Scopes:**
```
funnels/funnel.readonly
funnels/page.readonly
```

**Funktionalität:**
- Website scrapen ✅
- JSON-Export erstellen ✅
- Benutzer lädt JSON herunter ✅
- Benutzer importiert manuell in GHL ❌

**Use Case:**
"Website Exporter" - Exportiert Website-Struktur als JSON, das manuell importiert werden kann.

---

### Option 3: Browser Automation (Workaround)

**Scopes:**
```
funnels/funnel.readonly
funnels/page.readonly
```

**Funktionalität:**
- Website scrapen ✅
- Browser Automation nutzt GHL-UI ✅
- Automatischer Import via UI-Simulation ✅

**Hinweis:** Erfordert Browser-Automation (Puppeteer/Playwright), ist aber machbar.

---

### Option 4: Hybrid (Empfohlen)

**Scopes:**
```
funnels/funnel.readonly
funnels/page.readonly
funnels/redirect.readonly
funnels/redirect.write
```

**Funktionalität:**
- Website scrapen ✅
- Funnel-Struktur vorbereiten ✅
- JSON-Export für manuellen Import ✅
- Redirects automatisch erstellen ✅

**Use Case:**
"Website Migration Assistant" - Bereitet alles vor, Benutzer importiert manuell, App erstellt dann Redirects.

---

## Meine Empfehlung für deine App

### Für initiales Testing und MVP:

```
✅ funnels/funnel.readonly
✅ funnels/page.readonly
✅ funnels/redirect.readonly
```

**Warum:**
- Minimal invasiv
- Keine sensiblen Schreib-Rechte
- Ausreichend für Analyse und Export-Funktionalität
- Benutzer behält volle Kontrolle über Import

---

### Für erweiterte Funktionalität (später):

```
✅ funnels/funnel.readonly
✅ funnels/page.readonly
✅ funnels/redirect.readonly
✅ funnels/redirect.write
✅ blogs/post.write              (falls Blog-Import gewünscht)
✅ blogs/post-update.write       (falls Blog-Updates gewünscht)
```

**Warum:**
- Ermöglicht Redirect-Management
- Blog-Import als Bonus-Feature
- Immer noch keine kritischen Location-Rechte

---

## Vergleich: Was du NICHT brauchst

### ❌ Zu vermeiden:

```
❌ locations.write               - VIEL zu weitreichend!
❌ locations.readonly            - Nicht nötig für Funnels
❌ locations/customValues.write  - Nicht relevant
❌ contacts.write                - Nicht relevant
❌ opportunities.write           - Nicht relevant
```

**Warum:**
- `locations.write` gibt Zugriff auf ALLE Location-Einstellungen (sehr sensibel!)
- Website Cloner braucht nur Funnel-bezogene Scopes
- Minimale Berechtigungen = mehr Vertrauen von Benutzern

---

## Finale Empfehlung

### Für deine Website Cloner App im Marketplace:

```
Scopes:
✅ funnels/funnel.readonly
✅ funnels/page.readonly
✅ funnels/redirect.readonly
✅ funnels/redirect.write
```

**Das ermöglicht:**
1. Bestehende Funnels lesen und analysieren
2. Funnel-Struktur verstehen
3. Redirects für importierte Pages erstellen
4. Export-Funktionalität für manuellen Import

**Das verhindert:**
- Ungewollte Änderungen an Location-Settings
- Übermäßige Berechtigungen
- Sicherheitsbedenken bei Benutzern

---

## Implementierungs-Strategie

### Phase 1: Readonly (MVP)
```
funnels/funnel.readonly
funnels/page.readonly
```
- Website scrapen
- JSON-Export
- Analyse-Dashboard

### Phase 2: Redirects (Enhancement)
```
+ funnels/redirect.write
```
- Automatische Redirect-Erstellung nach manuellem Import

### Phase 3: Browser Automation (Advanced)
```
(Keine zusätzlichen Scopes nötig)
```
- UI-Automation für automatischen Import
- Nutzt bestehende readonly-Scopes

---

## Code-Beispiel mit korrekten Scopes

```javascript
const SCOPES = [
  'funnels/funnel.readonly',
  'funnels/page.readonly',
  'funnels/redirect.readonly',
  'funnels/redirect.write'
].join(' ');

const authUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
```

---

## Zusammenfassung

### ✅ Verwende diese Scopes:
```
funnels/funnel.readonly
funnels/page.readonly
funnels/redirect.readonly
funnels/redirect.write
```

### ❌ Verwende NICHT:
```
locations.write
locations.readonly
locations/customValues.write
```

**Grund:** Minimale Berechtigungen für maximale Sicherheit und Benutzervertrauen.

---

**Danke für den Hinweis! Das ist viel sicherer und angemessener für die App.** 🔒
