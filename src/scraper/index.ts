import { WebScraper } from './WebScraper.js';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function main() {
  const scraper = new WebScraper();
  
  try {
    // Example URL to scrape (you can change this)
    const url = process.argv[2] || 'https://example.com';
    
    console.log(`Starting scraper for URL: ${url}`);
    
    await scraper.initialize();
    const result = await scraper.scrapeWebsite(url);
    
    // Save results to file
    const outputPath = join(process.cwd(), 'scraping-result.json');
    writeFileSync(outputPath, JSON.stringify(result, null, 2));
    
    console.log('\n=== Scraping Results ===');
    console.log(`URL: ${result.url}`);
    console.log(`Is GHL Website: ${result.isGHLWebsite}`);
    console.log(`Title: ${result.metadata.title}`);
    console.log(`Sections found: ${result.structure.sections.length}`);
    console.log(`Assets found: ${result.assets.length}`);
    console.log(`CSS files: ${result.css.length}`);
    console.log(`\nFull results saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await scraper.close();
  }
}

main();
