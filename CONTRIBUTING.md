# Contributing to GHL Website Cloner

Vielen Dank für Ihr Interesse, zu diesem Projekt beizutragen! Wir freuen uns über Beiträge jeder Art.

## Wie kann ich beitragen?

### Fehler melden

Wenn Sie einen Fehler gefunden haben:

1. Überprüfen Sie, ob der Fehler bereits gemeldet wurde
2. Öffnen Sie ein neues Issue mit detaillierten Informationen:
   - Beschreibung des Problems
   - Schritte zur Reproduktion
   - Erwartetes vs. tatsächliches Verhalten
   - Screenshots (falls relevant)
   - Ihre Umgebung (OS, Node-Version, etc.)

### Feature-Vorschläge

Haben Sie eine Idee für ein neues Feature?

1. Öffnen Sie ein Issue mit dem Label "enhancement"
2. Beschreiben Sie das Feature und den Use Case
3. Diskutieren Sie mit der Community

### Code beitragen

1. **Fork das Repository**
   ```bash
   gh repo fork FelixContentMarketing/ghl-website-cloner
   ```

2. **Erstellen Sie einen Feature-Branch**
   ```bash
   git checkout -b feature/mein-neues-feature
   ```

3. **Machen Sie Ihre Änderungen**
   - Folgen Sie dem bestehenden Code-Stil
   - Schreiben Sie Tests für neue Features
   - Aktualisieren Sie die Dokumentation

4. **Committen Sie Ihre Änderungen**
   ```bash
   git commit -m "feat: Beschreibung des Features"
   ```

5. **Pushen Sie den Branch**
   ```bash
   git push origin feature/mein-neues-feature
   ```

6. **Öffnen Sie einen Pull Request**

## Commit-Konventionen

Wir verwenden [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Neue Funktion
- `fix:` Bugfix
- `docs:` Dokumentation
- `style:` Code-Formatierung
- `refactor:` Code-Refactoring
- `test:` Tests
- `chore:` Wartungsarbeiten

Beispiele:
```
feat: Add support for video asset download
fix: Resolve scraping timeout issue
docs: Update installation instructions
```

## Code-Stil

- Nutzen Sie TypeScript mit strict mode
- Folgen Sie den ESLint-Regeln
- Schreiben Sie aussagekräftige Variablennamen
- Kommentieren Sie komplexe Logik

## Tests

Stellen Sie sicher, dass alle Tests erfolgreich sind:

```bash
npm test
```

Fügen Sie Tests für neue Features hinzu:

```typescript
// tests/mein-feature.test.ts
import { describe, it, expect } from 'vitest';

describe('Mein Feature', () => {
  it('sollte korrekt funktionieren', () => {
    // Test-Code
  });
});
```

## Dokumentation

Aktualisieren Sie die Dokumentation für:
- Neue Features
- API-Änderungen
- Konfigurationsoptionen
- Beispiele

## Pull Request Prozess

1. Stellen Sie sicher, dass alle Tests erfolgreich sind
2. Aktualisieren Sie die README.md bei Bedarf
3. Beschreiben Sie Ihre Änderungen im PR
4. Warten Sie auf Review und Feedback
5. Nehmen Sie ggf. Änderungen vor

## Code Review

Alle Pull Requests werden reviewed. Erwarten Sie:
- Konstruktives Feedback
- Vorschläge zur Verbesserung
- Diskussionen über Implementierungsdetails

## Community-Richtlinien

- Seien Sie respektvoll und professionell
- Helfen Sie anderen Community-Mitgliedern
- Teilen Sie Ihr Wissen
- Akzeptieren Sie konstruktive Kritik

## Lizenz

Durch Ihren Beitrag stimmen Sie zu, dass Ihre Änderungen unter der MIT-Lizenz lizenziert werden.

## Fragen?

Bei Fragen öffnen Sie ein Issue oder kontaktieren Sie die Maintainer.

Vielen Dank für Ihren Beitrag! 🎉
