/**
 * Dynamic Sitemap Generator for Petrol Prices Near Me
 * Generates comprehensive sitemaps including all stations from CSV
 */

const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream, readFileSync } = require('fs');
const { resolve } = require('path');
const { pipeline } = require('stream');

// Configuration
const DOMAIN = 'https://petrolpricesnearme.com.au';
const STATIONS_CSV = resolve(__dirname, '../public/data/stations.csv');
const OUTPUT_DIR = resolve(__dirname, '../public');

// Parse CSV file
function parseStationsCSV() {
  const csvContent = readFileSync(STATIONS_CSV, 'utf-8');
  const lines = csvContent.split('\n').filter((line) => line.trim());
  const headers = lines[0].split('|');

  const stations = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('|');
    if (values.length >= headers.length) {
      const station = {};
      headers.forEach((header, index) => {
        station[header.trim()] = values[index]?.trim() || '';
      });

      // Only add valid stations with ID and name
      if (station.id && station['Station Name']) {
        stations.push(station);
      }
    }
  }

  return stations;
}

// Generate main sitemap
async function generateMainSitemap() {
  console.log('📄 Generating main sitemap...');

  const sitemap = new SitemapStream({
    hostname: DOMAIN,
    xmlns: {
      image: true,
      news: false,
      video: false,
      xhtml: false,
    },
  });

  const writeStream = createWriteStream(resolve(OUTPUT_DIR, 'sitemap.xml'));
  const currentDate = new Date().toISOString().split('T')[0];

  // Core pages
  const corePages = [
    { url: '/', changefreq: 'daily', priority: 1.0, lastmod: currentDate },
    { url: '/map', changefreq: 'hourly', priority: 0.95, lastmod: currentDate },
    {
      url: '/directory',
      changefreq: 'daily',
      priority: 0.9,
      lastmod: currentDate,
    },
    {
      url: '/faq',
      changefreq: 'monthly',
      priority: 0.85,
      lastmod: currentDate,
    },
    {
      url: '/fuel-price-trends',
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: currentDate,
    },
    { url: '/blog', changefreq: 'weekly', priority: 0.8, lastmod: currentDate },
    {
      url: '/station-amenities',
      changefreq: 'weekly',
      priority: 0.75,
      lastmod: currentDate,
    },
    {
      url: '/how-pricing-works',
      changefreq: 'monthly',
      priority: 0.75,
      lastmod: currentDate,
    },
    { url: '/chat', changefreq: 'weekly', priority: 0.7, lastmod: currentDate },
    {
      url: '/about',
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: currentDate,
    },
  ];

  // Regional pages
  const regions = [
    'melbourne-cbd',
    'northern-suburbs',
    'southern-suburbs',
    'eastern-suburbs',
    'western-suburbs',
    'south-east',
  ];

  const regionalPages = regions.flatMap((region) => [
    {
      url: `/regions/${region}`,
      changefreq: 'daily',
      priority: 0.85,
      lastmod: currentDate,
    },
    {
      url: `/directory?region=${region.toUpperCase().replace('-', '')}`,
      changefreq: 'daily',
      priority: 0.85,
      lastmod: currentDate,
    },
  ]);

  // Brand pages
  const brands = [
    'bp',
    'caltex',
    'shell',
    '7-eleven',
    'coles-express',
    'united',
    'ampol',
    'mobil',
  ];
  const brandPages = brands.map((brand) => ({
    url: `/brands/${brand}`,
    changefreq: 'daily',
    priority: 0.8,
    lastmod: currentDate,
  }));

  // Popular suburbs
  const suburbs = [
    'melbourne',
    'carlton',
    'richmond',
    'st-kilda',
    'frankston',
    'dandenong',
    'geelong',
    'ballarat',
    'bendigo',
    'werribee',
    'box-hill',
    'sunshine',
    'preston',
    'ringwood',
  ];
  const suburbPages = suburbs.map((suburb) => ({
    url: `/location/${suburb}`,
    changefreq: 'daily',
    priority: 0.75,
    lastmod: currentDate,
  }));

  // Write all URLs
  const allPages = [
    ...corePages,
    ...regionalPages,
    ...brandPages,
    ...suburbPages,
  ];

  pipeline(sitemap, writeStream, (err) => {
    if (err) {
      console.error('❌ Error generating sitemap:', err);
      process.exit(1);
    }
  });

  for (const page of allPages) {
    sitemap.write(page);
  }

  sitemap.end();

  await streamToPromise(sitemap);
  console.log('✅ Main sitemap generated successfully!');
}

// Generate stations sitemap (separate file for large dataset)
async function generateStationsSitemap() {
  console.log('📄 Generating stations sitemap...');

  try {
    const stations = parseStationsCSV();
    console.log(`   Found ${stations.length} stations`);

    const sitemap = new SitemapStream({ hostname: DOMAIN });
    const writeStream = createWriteStream(
      resolve(OUTPUT_DIR, 'sitemap-stations.xml')
    );
    const currentDate = new Date().toISOString().split('T')[0];

    pipeline(sitemap, writeStream, (err) => {
      if (err) {
        console.error('❌ Error generating stations sitemap:', err);
        process.exit(1);
      }
    });

    // Add each station
    for (const station of stations) {
      if (station.id) {
        sitemap.write({
          url: `/stations/${station.id}`,
          changefreq: 'daily',
          priority: 0.6,
          lastmod: currentDate,
        });
      }
    }

    sitemap.end();

    await streamToPromise(sitemap);
    console.log('✅ Stations sitemap generated successfully!');
  } catch (error) {
    console.error('❌ Error parsing stations:', error);
    process.exit(1);
  }
}

// Generate sitemap index
async function generateSitemapIndex() {
  console.log('📄 Generating sitemap index...');

  const currentDate = new Date().toISOString().split('T')[0];
  const indexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-stations.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

  const fs = require('fs');
  fs.writeFileSync(resolve(OUTPUT_DIR, 'sitemap-index.xml'), indexContent);
  console.log('✅ Sitemap index generated successfully!');
}

// Main execution
async function main() {
  console.log('🚀 Starting sitemap generation...\n');

  try {
    await generateMainSitemap();
    await generateStationsSitemap();
    await generateSitemapIndex();

    console.log('\n✨ All sitemaps generated successfully!');
    console.log(`\n📋 Files created:`);
    console.log(`   • ${OUTPUT_DIR}/sitemap.xml (main pages)`);
    console.log(`   • ${OUTPUT_DIR}/sitemap-stations.xml (all stations)`);
    console.log(`   • ${OUTPUT_DIR}/sitemap-index.xml (sitemap index)`);
    console.log(`\n🌐 Submit to Google Search Console:`);
    console.log(`   ${DOMAIN}/sitemap-index.xml`);
  } catch (error) {
    console.error('\n❌ Error generating sitemaps:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateMainSitemap,
  generateStationsSitemap,
  generateSitemapIndex,
};
