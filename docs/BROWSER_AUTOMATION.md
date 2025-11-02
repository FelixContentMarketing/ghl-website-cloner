# Browser Automation für GoHighLevel Import

## Übersicht

Da die GoHighLevel API keine offiziellen Endpoints zum Erstellen von Funnels oder Pages bereitstellt, nutzt diese App Browser Automation als Workaround. Dieser Ansatz simuliert manuelle Benutzerinteraktionen im GHL-Dashboard.

## Vorteile

- Nutzt die offizielle GHL-UI (weniger anfällig für Breaking Changes)
- Keine undokumentierten APIs erforderlich
- Funktioniert mit allen GHL-Features
- Visuelles Debugging möglich

## Nachteile

- Langsamer als direkte API-Calls
- Abhängig von UI-Änderungen
- Benötigt Browser-Ressourcen
- Komplexere Fehlerbehandlung

## Implementierung

Die Browser Automation ist in `GHLBrowserAutomation.ts` implementiert und nutzt Playwright.

### Authentifizierung

```typescript
// Cookie-basierte Authentifizierung
await page.context().addCookies([
  {
    name: 'access_token',
    value: authTokens.accessToken,
    domain: '.gohighlevel.com',
    path: '/'
  }
]);
```

### Funnel-Erstellung

Der Prozess läuft in folgenden Schritten ab:

1. Navigation zur Funnels-Seite
2. Klick auf "New Funnel" Button
3. Auswahl von "From Blank"
4. Eingabe des Funnel-Namens
5. Bestätigung der Erstellung
6. Hinzufügen von Pages
7. Injektion von Custom HTML/CSS

## Wichtige Hinweise

### UI-Selektoren

Die Selektoren müssen an die tatsächliche GHL-UI angepasst werden. Aktuelle Selektoren sind Platzhalter:

```typescript
// Beispiel - muss angepasst werden
'button:has-text("New Funnel")'
'input[placeholder*="name"]'
```

### Empfohlener Workflow

1. **Manuelle Inspektion**: Öffnen Sie GHL im Browser und inspizieren Sie die UI-Elemente
2. **Selektoren identifizieren**: Notieren Sie die korrekten Selektoren
3. **Code anpassen**: Aktualisieren Sie die Selektoren in `GHLBrowserAutomation.ts`
4. **Testen**: Führen Sie Tests mit `headless: false` durch

### Debugging

```typescript
// Für visuelles Debugging
const browser = await chromium.launch({
  headless: false,  // Browser sichtbar
  slowMo: 100       // Verlangsamte Ausführung
});
```

## Alternative Ansätze

### 1. Reverse Engineering interner APIs

**Vorteil:** Schneller und effizienter  
**Nachteil:** Instabil, kann jederzeit brechen

Methode:
- Network-Tab im Browser öffnen
- Manuelles Clonen durchführen
- API-Calls analysieren
- Endpoints und Payloads dokumentieren

### 2. Export/Import-Workflow

**Vorteil:** Nutzt offizielle GHL-Funktionen  
**Nachteil:** Erfordert manuelle Schritte

Methode:
- Funnel als JSON exportieren
- JSON-Struktur analysieren
- Eigene JSON-Dateien generieren
- Über GHL-UI importieren

### 3. Warten auf offizielle API

**Vorteil:** Stabil und supportet  
**Nachteil:** Zeitrahmen unbekannt

Die GHL-Community hat bereits Feature Requests für Funnel-APIs eingereicht. Es ist möglich, dass diese in Zukunft verfügbar werden.

## Best Practices

1. **Fehlerbehandlung**: Implementieren Sie robuste Try-Catch-Blöcke
2. **Timeouts**: Nutzen Sie angemessene Wartezeiten für UI-Elemente
3. **Screenshots**: Erstellen Sie Screenshots bei Fehlern für Debugging
4. **Logging**: Protokollieren Sie jeden Schritt für Nachvollziehbarkeit
5. **Rate Limiting**: Vermeiden Sie zu schnelle Automation

## Zukünftige Verbesserungen

- Automatische Selektor-Erkennung
- Retry-Mechanismen bei UI-Änderungen
- Parallele Funnel-Erstellung
- Webhook-Integration für Status-Updates
- Screenshot-basierte Validierung

## Support

Bei Problemen mit der Browser Automation:
1. Überprüfen Sie die GHL-UI auf Änderungen
2. Aktualisieren Sie Playwright auf die neueste Version
3. Testen Sie mit verschiedenen Browser-Engines
4. Konsultieren Sie die Playwright-Dokumentation
