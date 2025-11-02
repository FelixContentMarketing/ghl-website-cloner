import { chromium, Browser, Page } from 'playwright';
import * as cheerio from 'cheerio';
import type {
  ScrapingResult,
  Asset,
  PageMetadata,
  PageStructure,
  ScraperOptions,
  Section,
  Row,
  Column,
  Element
} from '../types/index.js';

export class WebScraper {
  private browser: Browser | null = null;
  private defaultOptions: ScraperOptions = {
    timeout: 30000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: {
      width: 1920,
      height: 1080
    },
    downloadAssets: true,
    maxDepth: 1
  };

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true
    });
  }

  async scrapeWebsite(
    url: string,
    options?: Partial<ScraperOptions>
  ): Promise<ScrapingResult> {
    const opts = { ...this.defaultOptions, ...options };

    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage({
      viewport: opts.viewport,
      userAgent: opts.userAgent
    });

    try {
      console.log(`Scraping website: ${url}`);
      
      // Navigate to the URL and wait for network to be idle
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: opts.timeout
      });

      // Wait for additional time to ensure all dynamic content is loaded
      await page.waitForTimeout(2000);

      // Get the full HTML content
      const html = await page.content();

      // Check if this is a GoHighLevel website
      const isGHLWebsite = await this.detectGHLWebsite(page, html);

      // Extract CSS
      const css = await this.extractCSS(page);

      // Extract JavaScript
      const javascript = await this.extractJavaScript(page);

      // Extract assets
      const assets = opts.downloadAssets ? await this.extractAssets(page, url) : [];

      // Extract metadata
      const metadata = await this.extractMetadata(page);

      // Parse page structure
      const structure = await this.parsePageStructure(html);

      return {
        url,
        html,
        css,
        javascript,
        assets,
        metadata,
        structure,
        isGHLWebsite
      };
    } catch (error) {
      console.error('Error scraping website:', error);
      throw new Error(`Failed to scrape website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await page.close();
    }
  }

  private async detectGHLWebsite(page: Page, html: string): Promise<boolean> {
    // Check for GHL-specific markers in the HTML
    const ghlMarkers = [
      'gohighlevel',
      'highlevel',
      'ghl-',
      'data-ghl',
      'leadconnectorhq'
    ];

    const htmlLower = html.toLowerCase();
    const hasGHLMarker = ghlMarkers.some(marker => htmlLower.includes(marker));

    // Check for GHL-specific scripts
    const scripts = await page.$$eval('script', (scripts) =>
      scripts.map(s => s.src).filter(Boolean)
    );
    const hasGHLScript = scripts.some(src => 
      src.includes('gohighlevel') || src.includes('leadconnectorhq')
    );

    return hasGHLMarker || hasGHLScript;
  }

  private async extractCSS(page: Page): Promise<string[]> {
    const cssArray: string[] = [];

    // Extract inline styles
    const inlineStyles = await page.$$eval('style', (styles) =>
      styles.map(s => s.textContent || '')
    );
    cssArray.push(...inlineStyles);

    // Extract external stylesheets
    const externalCSS = await page.$$eval('link[rel="stylesheet"]', (links) =>
      links.map(l => l.getAttribute('href')).filter(Boolean) as string[]
    );

    // Fetch external CSS content
    for (const href of externalCSS) {
      try {
        const response = await page.goto(href, { waitUntil: 'networkidle' });
        if (response) {
          const cssContent = await response.text();
          cssArray.push(cssContent);
        }
      } catch (error) {
        console.warn(`Failed to fetch CSS from ${href}:`, error);
      }
    }

    return cssArray;
  }

  private async extractJavaScript(page: Page): Promise<string[]> {
    const jsArray: string[] = [];

    // Extract inline scripts
    const inlineScripts = await page.$$eval('script:not([src])', (scripts) =>
      scripts.map(s => s.textContent || '')
    );
    jsArray.push(...inlineScripts.filter(Boolean));

    // Extract external script URLs (we'll store URLs, not content for security)
    const externalScripts = await page.$$eval('script[src]', (scripts) =>
      scripts.map(s => s.getAttribute('src')).filter(Boolean) as string[]
    );

    return [...jsArray, ...externalScripts];
  }

  private async extractAssets(page: Page, baseUrl: string): Promise<Asset[]> {
    const assets: Asset[] = [];

    // Extract images
    const images = await page.$$eval('img', (imgs) =>
      imgs.map(img => ({
        type: 'image' as const,
        url: img.src,
        alt: img.alt
      }))
    );
    assets.push(...images);

    // Extract videos
    const videos = await page.$$eval('video source, video', (elements) =>
      elements.map(el => ({
        type: 'video' as const,
        url: el.getAttribute('src') || (el as HTMLVideoElement).src
      })).filter(v => v.url)
    );
    assets.push(...videos);

    // Extract fonts from CSS
    const fontUrls = await page.evaluate(() => {
      const fonts: string[] = [];
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (rule instanceof CSSFontFaceRule) {
              const src = rule.style.getPropertyValue('src');
              const urlMatch = src.match(/url\(['"]?([^'"]+)['"]?\)/);
              if (urlMatch) {
                fonts.push(urlMatch[1]);
              }
            }
          }
        } catch (e) {
          // Skip CORS-protected stylesheets
        }
      }
      return fonts;
    });

    assets.push(...fontUrls.map(url => ({
      type: 'font' as const,
      url
    })));

    return assets;
  }

  private async extractMetadata(page: Page): Promise<PageMetadata> {
    return await page.evaluate(() => {
      const getMetaContent = (name: string): string | undefined => {
        const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return meta?.getAttribute('content') || undefined;
      };

      return {
        title: document.title,
        description: getMetaContent('description'),
        favicon: (document.querySelector('link[rel="icon"]') as HTMLLinkElement)?.href,
        ogImage: getMetaContent('og:image'),
        viewport: getMetaContent('viewport'),
        charset: document.characterSet
      };
    });
  }

  private async parsePageStructure(html: string): Promise<PageStructure> {
    const $ = cheerio.load(html);
    const sections: Section[] = [];

    // Extract global styles
    let globalStyles = '';
    $('style').each((_, el) => {
      globalStyles += $(el).html() + '\n';
    });

    // Extract custom code
    const customCode = {
      head: $('head').html() || '',
      body: $('body').html() || ''
    };

    // Parse main content sections
    const mainSelectors = ['main', 'section', '.section', '[class*="section"]'];
    
    mainSelectors.forEach(selector => {
      $(selector).each((index, element) => {
        const $section = $(element);
        
        const section: Section = {
          id: `section-${index}`,
          type: this.determineSectionType($section),
          rows: this.parseRows($section),
          styles: this.extractElementStyles($section)
        };

        sections.push(section);
      });
    });

    // If no sections found, create a single section from body
    if (sections.length === 0) {
      sections.push({
        id: 'section-0',
        type: 'content',
        rows: this.parseRows($('body')),
        styles: {}
      });
    }

    return {
      sections,
      globalStyles,
      customCode
    };
  }

  private determineSectionType($element: cheerio.Cheerio<cheerio.Element>): Section['type'] {
    const classes = $element.attr('class')?.toLowerCase() || '';
    const id = $element.attr('id')?.toLowerCase() || '';
    
    if (classes.includes('header') || id.includes('header')) return 'header';
    if (classes.includes('hero') || id.includes('hero')) return 'hero';
    if (classes.includes('footer') || id.includes('footer')) return 'footer';
    
    return 'content';
  }

  private parseRows($container: cheerio.Cheerio<cheerio.Element>): Row[] {
    const rows: Row[] = [];
    const $ = cheerio.load($container.html() || '');

    // Look for common row patterns
    const rowSelectors = ['.row', '[class*="row"]', '.container > div'];
    
    rowSelectors.forEach(selector => {
      $(selector).each((index, element) => {
        const $row = $(element);
        
        rows.push({
          id: `row-${index}`,
          columns: this.parseColumns($row),
          styles: this.extractElementStyles($row)
        });
      });
    });

    return rows;
  }

  private parseColumns($row: cheerio.Cheerio<cheerio.Element>): Column[] {
    const columns: Column[] = [];
    const $ = cheerio.load($row.html() || '');

    const columnSelectors = ['.col', '[class*="col-"]', '.column'];
    
    columnSelectors.forEach(selector => {
      $(selector).each((index, element) => {
        const $col = $(element);
        
        columns.push({
          id: `col-${index}`,
          width: this.determineColumnWidth($col),
          elements: this.parseElements($col),
          styles: this.extractElementStyles($col)
        });
      });
    });

    return columns;
  }

  private determineColumnWidth($col: cheerio.Cheerio<cheerio.Element>): number {
    const classes = $col.attr('class') || '';
    const colMatch = classes.match(/col-(\d+)/);
    return colMatch ? parseInt(colMatch[1]) : 12;
  }

  private parseElements($container: cheerio.Cheerio<cheerio.Element>): Element[] {
    const elements: Element[] = [];
    const $ = cheerio.load($container.html() || '');

    // Parse different element types
    $('h1, h2, h3, h4, h5, h6, p, span, div').each((index, element) => {
      const $el = $(element);
      
      elements.push({
        id: `element-${index}`,
        type: 'text',
        content: $el.text(),
        styles: this.extractElementStyles($el),
        attributes: this.extractAttributes($el)
      });
    });

    return elements;
  }

  private extractElementStyles($element: cheerio.Cheerio<cheerio.Element>): Record<string, string> {
    const style = $element.attr('style') || '';
    const styles: Record<string, string> = {};

    style.split(';').forEach(rule => {
      const [property, value] = rule.split(':').map(s => s.trim());
      if (property && value) {
        styles[property] = value;
      }
    });

    return styles;
  }

  private extractAttributes($element: cheerio.Cheerio<cheerio.Element>): Record<string, string> {
    const attrs: Record<string, string> = {};
    const element = $element.get(0);
    
    if (element && element.attribs) {
      Object.entries(element.attribs).forEach(([key, value]) => {
        if (key !== 'style' && key !== 'class') {
          attrs[key] = value;
        }
      });
    }

    return attrs;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
