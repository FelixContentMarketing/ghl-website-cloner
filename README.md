# GoHighLevel Website Cloner

Eine leistungsstarke App zum automatischen Klonen von Websites/Funnels in GoHighLevel-Subaccounts.

## Überblick

Diese App ermöglicht es, durch einfache Eingabe einer URL eine vorhandene Website automatisch in einen GoHighLevel-Subaccount zu klonen. Die App nutzt fortschrittliches Web Scraping, intelligentes HTML-Parsing und GoHighLevel-API-Integration, um den Cloning-Prozess zu automatisieren.

## Features

- **Automatisches Web Scraping** mit Playwright
- **Intelligente HTML/CSS/JS-Extraktion**
- **Asset-Management** (Bilder, Fonts, Videos)
- **GoHighLevel-Erkennung** für optimierte Verarbeitung
- **Strukturanalyse** und Parsing von Sections, Rows, Columns
- **TypeScript** für Type Safety
- **Modulare Architektur** für einfache Erweiterbarkeit

## Technologie-Stack

- **Node.js** 20+
- **TypeScript** 5.3+
- **Playwright** für Browser-Automation
- **Cheerio** für HTML-Parsing
- **Axios** für HTTP-Requests
- **GoHighLevel API** v2

## Installation

```bash
# Repository klonen
git clone <repository-url>
cd ghl-website-cloner

# Dependencies installieren
npm install

# Playwright Browser installieren
npx playwright install chromium

# Environment-Variablen konfigurieren
cp .env.example .env
# Bearbeiten Sie .env mit Ihren GHL-Credentials
```

## Konfiguration

Erstellen Sie eine `.env`-Datei mit folgenden Variablen:

```env
GHL_ACCESS_TOKEN=your-access-token
GHL_LOCATION_ID=your-location-id
GHL_CLIENT_ID=your-client-id
GHL_CLIENT_SECRET=your-client-secret
```

## Verwendung

### 1. Website scrapen (ohne GHL-Import)

```bash
npm run scrape https://example.com
```

Dies erstellt eine `scraping-result.json` mit allen extrahierten Daten.

### 2. Kompletter Cloning-Prozess

```bash
npm run dev https://example.com "Mein Funnel Name"
```

### 3. Programmatische Verwendung

```typescript
import { WebsiteCloner } from './src/WebsiteCloner.js';

const cloner = new WebsiteCloner();

await cloner.initialize({
  accessToken: 'your-token',
  locationId: 'your-location-id'
});

const job = await cloner.cloneWebsite(
  'https://example.com',
  'Mein Funnel',
  'location-id'
);

console.log('Cloning completed:', job);
```

## Projektstruktur

```
ghl-website-cloner/
├── src/
│   ├── scraper/
│   │   ├── WebScraper.ts       # Hauptklasse für Web Scraping
│   │   └── index.ts            # CLI-Tool für Scraping
│   ├── parser/
│   │   └── HTMLToGHLParser.ts  # HTML zu GHL Konverter
│   ├── ghl-api/
│   │   └── GHLApiClient.ts     # GHL API Client
│   ├── types/
│   │   └── index.ts            # TypeScript Typdefinitionen
│   ├── utils/                  # Utility-Funktionen
│   ├── WebsiteCloner.ts        # Haupt-Cloner-Klasse
│   └── index.ts                # Entry Point
├── tests/                      # Test-Dateien
├── package.json
├── tsconfig.json
└── README.md
```

## API-Dokumentation

### WebScraper

Hauptklasse für das Scraping von Websites.

**Methoden:**
- `initialize()` - Initialisiert den Browser
- `scrapeWebsite(url, options)` - Scraped eine Website
- `close()` - Schließt den Browser

### HTMLToGHLParser

Konvertiert HTML-Strukturen in GHL-kompatibles Format.

**Methoden:**
- `parse(scrapingResult, funnelName, locationId, options)` - Parsed und konvertiert

### WebsiteCloner

Orchestriert den gesamten Cloning-Prozess.

**Methoden:**
- `initialize(authTokens)` - Initialisiert mit GHL-Credentials
- `cloneWebsite(sourceUrl, funnelName, locationId, options)` - Führt Cloning durch
- `cleanup()` - Räumt Ressourcen auf

## Entwicklung

```bash
# Development-Modus mit Auto-Reload
npm run dev

# TypeScript kompilieren
npm run build

# Tests ausführen
npm test
```

## Wichtige Hinweise

### API-Limitierungen

Die GoHighLevel API bietet derzeit **keine offiziellen Endpoints** zum Erstellen von Funnels oder Pages. Diese App bereitet die Daten vor, aber der finale Import-Schritt erfordert eine der folgenden Lösungen:

1. **Browser-Automation** (Puppeteer/Playwright) zur Simulation manueller Schritte
2. **Reverse Engineering** interner GHL-APIs (nicht empfohlen, da instabil)
3. **Manuelle Import-Funktion** über GHL-UI

### Aktuelle Implementierung

Die aktuelle Version führt folgende Schritte aus:

1. ✅ Website scrapen (HTML, CSS, JS, Assets)
2. ✅ Struktur analysieren und parsen
3. ✅ In GHL-Format konvertieren
4. ⚠️ Import in GHL (vorbereitet, aber nicht automatisiert)

Der Import-Schritt muss derzeit manuell oder über Browser-Automation erfolgen.

## Roadmap

- [ ] Browser-Automation für GHL-Import implementieren
- [ ] Asset-Upload zur GHL Media Library
- [ ] Responsive Design-Preservation verbessern
- [ ] Support für komplexe Funnel-Strukturen
- [ ] Web-UI für einfachere Bedienung
- [ ] OAuth 2.0 Integration
- [ ] Job-Queue für parallele Cloning-Jobs
- [ ] Webhook-Notifications bei Completion

## Rechtliche Hinweise

**Wichtig:** Diese App ist als Tool für Inspiration und Strukturanalyse gedacht. Beim Klonen von Websites müssen Sie:

- Urheberrechte respektieren
- Nur eigene Websites oder Websites mit Erlaubnis klonen
- Geklonte Inhalte anpassen und nicht 1:1 kopieren
- Texte, Bilder und Branding ersetzen

Die Entwickler übernehmen keine Haftung für missbräuchliche Verwendung.

## Lizenz

MIT License - siehe LICENSE-Datei für Details.

## Support

Bei Fragen oder Problemen:
- GitHub Issues öffnen
- Dokumentation konsultieren
- Community-Forum nutzen

## Mitwirken

Contributions sind willkommen! Bitte:
1. Fork das Repository
2. Feature-Branch erstellen
3. Changes committen
4. Pull Request öffnen

## Changelog

### Version 1.0.0 (Initial Release)
- Web Scraping mit Playwright
- HTML/CSS/JS Extraktion
- Asset-Erkennung
- GHL-Website-Erkennung
- Strukturanalyse
- TypeScript-Support
- Modulare Architektur
