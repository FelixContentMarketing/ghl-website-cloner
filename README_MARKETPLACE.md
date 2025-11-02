# Website Cloner

> Automatically clone any website into your CRM platform

## Overview

This app enables you to automatically clone any existing website by simply entering a URL. The app uses advanced web scraping, intelligent HTML parsing, and API integration to automate the cloning process.

## Features

- 🚀 **Automatic Web Scraping** with Playwright
- 🎨 **Intelligent HTML/CSS/JS Extraction**
- 📦 **Asset Management** (Images, Fonts, Videos)
- 🔍 **Structure Analysis** and parsing of Sections, Rows, Columns
- ⚡ **TypeScript** for Type Safety
- 🧩 **Modular Architecture** for easy extensibility

## Technology Stack

- **Node.js** 20+
- **TypeScript** 5.3+
- **Playwright** for Browser Automation
- **Cheerio** for HTML Parsing
- **Axios** for HTTP Requests

## Installation

```bash
# Clone repository
git clone https://github.com/FelixContentMarketing/ghl-website-cloner.git
cd ghl-website-cloner

# Install dependencies
npm install

# Install Playwright browser
npx playwright install chromium

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials
```

## Configuration

Create a `.env` file with the following variables:

```env
ACCESS_TOKEN=your-access-token
LOCATION_ID=your-location-id
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
```

## Usage

### 1. Scrape a website

```bash
npm run scrape https://example.com
```

This creates a `scraping-result.json` with all extracted data.

### 2. Complete cloning process

```bash
npm run dev https://example.com "My Funnel Name"
```

### 3. Programmatic usage

```typescript
import { WebsiteCloner } from './src/WebsiteCloner.js';

const cloner = new WebsiteCloner();

await cloner.initialize({
  accessToken: 'your-token',
  locationId: 'your-location-id'
});

const job = await cloner.cloneWebsite(
  'https://example.com',
  'My Funnel',
  'location-id'
);

console.log('Cloning completed:', job);
```

## Project Structure

```
website-cloner/
├── src/
│   ├── scraper/
│   │   ├── WebScraper.ts       # Main scraping class
│   │   └── index.ts            # CLI tool for scraping
│   ├── parser/
│   │   └── HTMLToGHLParser.ts  # HTML converter
│   ├── ghl-api/
│   │   └── GHLApiClient.ts     # API Client
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── WebsiteCloner.ts        # Main cloner class
│   └── index.ts                # Entry point
├── tests/                      # Test files
├── package.json
├── tsconfig.json
└── README.md
```

## API Documentation

### WebScraper

Main class for website scraping.

**Methods:**
- `initialize()` - Initializes the browser
- `scrapeWebsite(url, options)` - Scrapes a website
- `close()` - Closes the browser

### HTMLToGHLParser

Converts HTML structures to platform-compatible format.

**Methods:**
- `parse(scrapingResult, funnelName, locationId, options)` - Parses and converts

### WebsiteCloner

Orchestrates the entire cloning process.

**Methods:**
- `initialize(authTokens)` - Initializes with credentials
- `cloneWebsite(sourceUrl, funnelName, locationId, options)` - Performs cloning
- `cleanup()` - Cleans up resources

## Development

```bash
# Development mode with auto-reload
npm run dev

# Compile TypeScript
npm run build

# Run tests
npm test
```

## Important Notes

### Current Implementation

The current version performs the following steps:

1. ✅ Scrape website (HTML, CSS, JS, Assets)
2. ✅ Analyze and parse structure
3. ✅ Convert to platform format
4. ✅ Import into your CRM

## Roadmap

- [ ] Enhanced browser automation for import
- [ ] Asset upload to media library
- [ ] Improved responsive design preservation
- [ ] Support for complex funnel structures
- [ ] Web UI for easier operation
- [ ] OAuth 2.0 integration
- [ ] Job queue for parallel cloning jobs
- [ ] Webhook notifications on completion

## Legal Notice

**Important:** This app is intended as a tool for inspiration and structure analysis. When cloning websites, you must:

- Respect copyrights
- Only clone your own websites or websites with permission
- Adapt cloned content and not copy 1:1
- Replace texts, images, and branding

The developers assume no liability for misuse.

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues:
- Open GitHub Issues
- Consult documentation
- Use community forum

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Open pull request

## Changelog

### Version 1.0.0 (Initial Release)
- Web scraping with Playwright
- HTML/CSS/JS extraction
- Asset recognition
- Structure analysis
- TypeScript support
- Modular architecture
