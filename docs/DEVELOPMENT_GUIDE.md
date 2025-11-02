# Entwicklungs-Anleitung

## Erste Schritte

### 1. Dependencies installieren

```bash
npm install
npx playwright install chromium
```

### 2. Environment konfigurieren

```bash
cp .env.example .env
# Bearbeiten Sie .env mit Ihren Credentials
```

### 3. Erste Tests durchführen

```bash
# Scraper testen
npm run scrape https://example.com

# Vollständigen Prozess testen
npm run dev https://example.com "Test Funnel"
```

## Nächste Entwicklungsschritte

### Priorität 1: Browser Automation vervollständigen

Die Browser Automation in `GHLBrowserAutomation.ts` ist ein Grundgerüst. Folgende Schritte sind erforderlich:

1. **UI-Selektoren aktualisieren**
   - Öffnen Sie GHL im Browser
   - Inspizieren Sie die tatsächlichen UI-Elemente
   - Aktualisieren Sie die Selektoren im Code

2. **Custom Code Injection implementieren**
   - Finden Sie den Weg zum Custom Code Editor in GHL
   - Implementieren Sie die Injektion von HTML/CSS/JS

3. **Fehlerbehandlung verbessern**
   - Screenshots bei Fehlern
   - Retry-Mechanismen
   - Detailliertes Logging

### Priorität 2: Asset-Upload zur GHL Media Library

Implementieren Sie den Upload von Assets:

```typescript
// In GHLApiClient.ts erweitern
async uploadAssetToGHL(asset: Asset): Promise<string> {
  // 1. Asset von URL downloaden
  // 2. Zu GHL Media Library hochladen
  // 3. GHL Media ID zurückgeben
}
```

### Priorität 3: Verbesserung des HTML-Parsers

Der aktuelle Parser ist grundlegend. Verbesserungen:

- Bessere Erkennung von Layout-Strukturen
- Preservation von Responsive Design
- Mapping zu GHL-spezifischen Komponenten
- Support für komplexe CSS (Flexbox, Grid)

### Priorität 4: Web-UI entwickeln

Erstellen Sie eine benutzerfreundliche Web-Oberfläche:

- React/Next.js Frontend
- OAuth 2.0 Integration
- Job-Queue Visualisierung
- Live-Preview der gescrapten Inhalte

## Testing-Strategie

### Unit Tests

```bash
npm test
```

Zu testende Komponenten:
- WebScraper
- HTMLToGHLParser
- GHLApiClient
- AssetDownloader

### Integration Tests

Testen Sie den vollständigen Workflow:
1. Scraping
2. Parsing
3. GHL-Import

### E2E Tests

Nutzen Sie Playwright für End-to-End Tests mit echten Websites.

## Debugging-Tipps

### Scraper debuggen

```typescript
// In WebScraper.ts
const browser = await chromium.launch({
  headless: false,  // Browser sichtbar
  slowMo: 100       // Verlangsamte Ausführung
});
```

### Browser Automation debuggen

```typescript
// Screenshots erstellen
await page.screenshot({ path: 'debug.png' });

// HTML ausgeben
console.log(await page.content());
```

## Code-Qualität

### TypeScript Strict Mode

Das Projekt nutzt TypeScript im Strict Mode. Achten Sie auf:
- Korrekte Typisierung
- Keine `any` Types
- Null-Checks

### Code-Formatierung

```bash
# Prettier installieren (optional)
npm install -D prettier
npx prettier --write "src/**/*.ts"
```

## Performance-Optimierung

### Paralleles Scraping

Implementieren Sie paralleles Scraping für mehrere URLs:

```typescript
async scrapMultipleUrls(urls: string[]): Promise<ScrapingResult[]> {
  return Promise.all(
    urls.map(url => this.scrapeWebsite(url))
  );
}
```

### Caching

Implementieren Sie Caching für bereits gescrapte Websites:
- Redis für Session-Cache
- Filesystem für Asset-Cache

## Deployment

### Docker

Erstellen Sie ein Dockerfile:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables

Für Production:
- Nutzen Sie Secrets Management (AWS Secrets Manager, etc.)
- Niemals Tokens im Code committen
- Environment-spezifische Configs

## Monitoring

Implementieren Sie Monitoring für:
- Scraping-Erfolgsrate
- API-Fehlerrate
- Performance-Metriken
- User-Aktivität

## Sicherheit

### Best Practices

1. **Token-Sicherheit**
   - Verschlüsselte Speicherung
   - Regelmäßige Rotation
   - Sichere Übertragung

2. **Rate Limiting**
   - API-Call Limits beachten
   - Queue-System implementieren

3. **Input Validation**
   - URLs validieren
   - XSS-Schutz
   - SQL-Injection-Schutz

## Contribution Guidelines

1. Fork das Repository
2. Feature-Branch erstellen
3. Tests schreiben
4. Code committen
5. Pull Request öffnen

### Commit-Konventionen

```
feat: Neue Funktion
fix: Bugfix
docs: Dokumentation
test: Tests
refactor: Code-Refactoring
```
