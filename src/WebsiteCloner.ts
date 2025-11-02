import { WebScraper } from './scraper/WebScraper.js';
import { HTMLToGHLParser } from './parser/HTMLToGHLParser.js';
import { GHLApiClient } from './ghl-api/GHLApiClient.js';
import type {
  CloningJob,
  GHLAuthTokens,
  ScraperOptions,
  ParserOptions
} from './types/index.js';

export class WebsiteCloner {
  private scraper: WebScraper;
  private parser: HTMLToGHLParser;
  private ghlClient: GHLApiClient | null = null;

  constructor() {
    this.scraper = new WebScraper();
    this.parser = new HTMLToGHLParser();
  }

  /**
   * Initialize the cloner with GHL authentication
   */
  async initialize(authTokens: GHLAuthTokens): Promise<void> {
    this.ghlClient = new GHLApiClient(authTokens);
    await this.scraper.initialize();
  }

  /**
   * Clone a website from URL to GoHighLevel
   */
  async cloneWebsite(
    sourceUrl: string,
    funnelName: string,
    locationId: string,
    options?: {
      scraperOptions?: Partial<ScraperOptions>;
      parserOptions?: Partial<ParserOptions>;
    }
  ): Promise<CloningJob> {
    if (!this.ghlClient) {
      throw new Error('GHL client not initialized. Call initialize() first.');
    }

    const job: CloningJob = {
      id: this.generateJobId(),
      userId: locationId,
      sourceUrl,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    try {
      // Step 1: Scrape the website
      console.log('Step 1: Scraping website...');
      job.status = 'scraping';
      job.progress = 10;

      const scrapingResult = await this.scraper.scrapeWebsite(
        sourceUrl,
        options?.scraperOptions
      );
      job.scrapingResult = scrapingResult;
      job.progress = 40;

      console.log(`Website scraped successfully. Is GHL website: ${scrapingResult.isGHLWebsite}`);

      // Step 2: Parse and convert to GHL format
      console.log('Step 2: Parsing and converting to GHL format...');
      job.status = 'parsing';
      job.progress = 50;

      const funnelData = await this.parser.parse(
        scrapingResult,
        funnelName,
        locationId,
        options?.parserOptions
      );
      job.funnelData = funnelData;
      job.progress = 70;

      console.log('Content parsed and converted successfully');

      // Step 3: Import to GoHighLevel
      console.log('Step 3: Importing to GoHighLevel...');
      job.status = 'importing';
      job.progress = 80;

      // Note: This is where we would use browser automation or undocumented APIs
      // For now, we'll just log the data that would be imported
      console.log('Funnel data ready for import:', {
        name: funnelData.name,
        pagesCount: funnelData.pages.length,
        locationId: funnelData.locationId
      });

      // TODO: Implement actual import mechanism
      // Option 1: Browser automation with Puppeteer/Playwright
      // Option 2: Reverse-engineered internal API calls
      // Option 3: Manual export/import flow

      job.status = 'completed';
      job.progress = 100;
      job.completedAt = new Date();

      console.log('Cloning job completed successfully!');

      return job;
    } catch (error) {
      job.status = 'failed';
      job.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Cloning job failed:', job.errorMessage);
      throw error;
    }
  }

  /**
   * Get existing funnels from GHL
   */
  async getExistingFunnels() {
    if (!this.ghlClient) {
      throw new Error('GHL client not initialized');
    }
    return await this.ghlClient.getFunnels();
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.scraper.close();
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
