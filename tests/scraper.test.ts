import { WebScraper } from '../src/scraper/WebScraper.js';

async function testScraper() {
  console.log('=== Testing WebScraper ===\n');
  
  const scraper = new WebScraper();
  
  try {
    // Test 1: Initialize scraper
    console.log('Test 1: Initializing scraper...');
    await scraper.initialize();
    console.log('✓ Scraper initialized successfully\n');
    
    // Test 2: Scrape a simple website
    console.log('Test 2: Scraping example.com...');
    const result = await scraper.scrapeWebsite('https://example.com', {
      timeout: 10000,
      downloadAssets: false
    });
    
    console.log('✓ Website scraped successfully');
    console.log(`  - URL: ${result.url}`);
    console.log(`  - Title: ${result.metadata.title}`);
    console.log(`  - Is GHL Website: ${result.isGHLWebsite}`);
    console.log(`  - Sections: ${result.structure.sections.length}`);
    console.log(`  - CSS files: ${result.css.length}`);
    console.log(`  - Assets: ${result.assets.length}\n`);
    
    // Test 3: Validate structure
    console.log('Test 3: Validating page structure...');
    if (result.structure.sections.length > 0) {
      console.log('✓ Page structure parsed successfully');
      console.log(`  - First section type: ${result.structure.sections[0].type}`);
    } else {
      console.log('⚠ No sections found in structure');
    }
    
    console.log('\n=== All tests completed ===');
    
  } catch (error) {
    console.error('✗ Test failed:', error);
  } finally {
    await scraper.close();
  }
}

testScraper();
