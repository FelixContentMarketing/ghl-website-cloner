import { WebsiteCloner } from './WebsiteCloner.js';
import type { GHLAuthTokens } from './types/index.js';

async function main() {
  const cloner = new WebsiteCloner();
  
  try {
    // Example authentication tokens (replace with real tokens)
    const authTokens: GHLAuthTokens = {
      accessToken: process.env.GHL_ACCESS_TOKEN || 'your-access-token',
      locationId: process.env.GHL_LOCATION_ID || 'your-location-id'
    };

    // Initialize the cloner
    await cloner.initialize(authTokens);

    // Example: Clone a website
    const sourceUrl = process.argv[2] || 'https://example.com';
    const funnelName = process.argv[3] || 'Cloned Funnel';

    console.log(`Starting cloning process...`);
    console.log(`Source URL: ${sourceUrl}`);
    console.log(`Funnel Name: ${funnelName}`);
    console.log(`Location ID: ${authTokens.locationId}`);
    console.log('---');

    const job = await cloner.cloneWebsite(
      sourceUrl,
      funnelName,
      authTokens.locationId
    );

    console.log('\n=== Cloning Job Completed ===');
    console.log(`Job ID: ${job.id}`);
    console.log(`Status: ${job.status}`);
    console.log(`Progress: ${job.progress}%`);
    
    if (job.funnelData) {
      console.log(`\nFunnel created:`);
      console.log(`  Name: ${job.funnelData.name}`);
      console.log(`  Pages: ${job.funnelData.pages.length}`);
    }

  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  } finally {
    await cloner.cleanup();
  }
}

main();
