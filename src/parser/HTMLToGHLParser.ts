import type {
  ScrapingResult,
  GHLFunnelData,
  GHLPageData,
  Section,
  ParserOptions
} from '../types/index.js';

export class HTMLToGHLParser {
  private defaultOptions: ParserOptions = {
    preserveCustomCSS: true,
    minifyHTML: false,
    removeScripts: false,
    convertToGHLComponents: true
  };

  async parse(
    scrapingResult: ScrapingResult,
    funnelName: string,
    locationId: string,
    options?: Partial<ParserOptions>
  ): Promise<GHLFunnelData> {
    const opts = { ...this.defaultOptions, ...options };

    console.log(`Parsing scraped content for funnel: ${funnelName}`);

    // Create the main page data
    const mainPage = this.createPageData(
      scrapingResult,
      funnelName,
      opts
    );

    // Build the funnel data structure
    const funnelData: GHLFunnelData = {
      name: funnelName,
      locationId,
      pages: [mainPage],
      settings: {
        trackingCodeHead: scrapingResult.structure.customCode.head,
        trackingCodeBody: '',
        faviconUrl: scrapingResult.metadata.favicon
      }
    };

    return funnelData;
  }

  private createPageData(
    scrapingResult: ScrapingResult,
    pageName: string,
    options: ParserOptions
  ): GHLPageData {
    // Combine all CSS
    const combinedCSS = this.combineCSS(scrapingResult.css);

    // Process HTML
    let processedHTML = scrapingResult.html;
    if (options.minifyHTML) {
      processedHTML = this.minifyHTML(processedHTML);
    }
    if (options.removeScripts) {
      processedHTML = this.removeScripts(processedHTML);
    }

    // Combine JavaScript
    const combinedJS = this.combineJavaScript(scrapingResult.javascript);

    return {
      name: pageName,
      url: this.generateSlug(pageName),
      html: processedHTML,
      css: combinedCSS,
      javascript: combinedJS,
      sections: scrapingResult.structure.sections
    };
  }

  private combineCSS(cssArray: string[]): string {
    return cssArray
      .filter(css => css && css.trim().length > 0)
      .join('\n\n/* ========== Next Stylesheet ========== */\n\n');
  }

  private combineJavaScript(jsArray: string[]): string {
    // Filter out external script URLs and only keep inline scripts
    const inlineScripts = jsArray.filter(js => 
      !js.startsWith('http') && !js.startsWith('//')
    );

    return inlineScripts
      .filter(js => js && js.trim().length > 0)
      .join('\n\n/* ========== Next Script ========== */\n\n');
  }

  private minifyHTML(html: string): string {
    // Simple minification: remove extra whitespace
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }

  private removeScripts(html: string): string {
    // Remove script tags
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  private generateSlug(name: string): string {
    return '/' + name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Convert HTML sections to GHL-compatible format
   * This is a simplified version - in production, this would need
   * to map to GHL's specific page builder format
   */
  convertToGHLFormat(sections: Section[]): any {
    return sections.map(section => ({
      type: section.type,
      id: section.id,
      content: {
        rows: section.rows.map(row => ({
          columns: row.columns.map(col => ({
            width: col.width,
            elements: col.elements
          }))
        }))
      },
      styles: section.styles
    }));
  }
}
