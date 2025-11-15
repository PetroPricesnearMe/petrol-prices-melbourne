#!/usr/bin/env node

/**
 * Melbourne Map Image Optimization Script
 *
 * This script optimizes the melbourne-map-vector.png image for web performance
 * by creating multiple optimized versions and formats.
 *
 * Requirements:
 * - sharp: npm install sharp
 *
 * Usage:
 * node scripts/optimize-melbourne-map.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_PATH = path.join(
  __dirname,
  '..',
  'public',
  'images',
  'melbourne-map-vector.png'
);
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'optimized');
const BACKUP_PATH = path.join(
  __dirname,
  '..',
  'public',
  'images',
  'melbourne-map-vector-original.png'
);

// Responsive sizes for different viewports
const SIZES = [
  { width: 640, suffix: 'mobile' }, // Mobile
  { width: 1024, suffix: 'tablet' }, // Tablet
  { width: 1920, suffix: 'desktop' }, // Desktop
  { width: 2560, suffix: 'large' }, // Large screens
];

// Optimization settings
const QUALITY = {
  webp: 85, // WebP quality (recommended: 80-90)
  avif: 75, // AVIF quality (recommended: 70-80)
  png: 90, // PNG quality (recommended: 85-95)
  jpeg: 85, // JPEG quality (recommended: 80-90)
};

/**
 * Main optimization function
 */
async function optimizeImage() {
  console.log('🎨 Melbourne Map Image Optimization\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check if input file exists
  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`❌ Error: Input file not found at ${INPUT_PATH}`);
    console.error('Please ensure the melbourne-map-vector.png file exists.');
    process.exit(1);
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Created output directory: ${OUTPUT_DIR}\n`);
  }

  // Backup original file
  if (!fs.existsSync(BACKUP_PATH)) {
    fs.copyFileSync(INPUT_PATH, BACKUP_PATH);
    console.log(`✅ Backed up original image to: ${BACKUP_PATH}\n`);
  }

  try {
    // Get original image metadata
    const metadata = await sharp(INPUT_PATH).metadata();
    console.log('📊 Original Image Information:');
    console.log(`   Format: ${metadata.format}`);
    console.log(`   Dimensions: ${metadata.width}x${metadata.height}`);
    console.log(
      `   Size: ${(fs.statSync(INPUT_PATH).size / 1024).toFixed(2)} KB`
    );
    console.log(`   Channels: ${metadata.channels}`);
    console.log(`   Has Alpha: ${metadata.hasAlpha}\n`);

    console.log('🔄 Starting optimization...\n');

    // Process each size
    for (const size of SIZES) {
      await processSize(size, metadata);
    }

    // Create optimized version at original size
    await createOptimizedOriginal(metadata);

    console.log('\n✅ Optimization Complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📦 Generated Files:');

    const files = fs.readdirSync(OUTPUT_DIR);
    files.forEach((file) => {
      const filePath = path.join(OUTPUT_DIR, file);
      const stats = fs.statSync(filePath);
      console.log(`   ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
    });

    console.log('\n💡 Next Steps:');
    console.log('   1. Review optimized images in public/images/optimized/');
    console.log('   2. Replace original with optimized version if satisfied');
    console.log('   3. Update Next.js Image component if using specific sizes');
    console.log('   4. Test on different devices and browsers\n');
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
}

/**
 * Process a specific size
 */
async function processSize(size, originalMetadata) {
  const { width, suffix } = size;

  console.log(`📐 Processing ${suffix} (${width}px)...`);

  // Skip if original is smaller than target width
  if (originalMetadata.width < width) {
    console.log(`   ⚠️  Skipped (original is smaller)\n`);
    return;
  }

  const baseFilename = `melbourne-map-${suffix}`;

  try {
    // WebP - Best for modern browsers
    await sharp(INPUT_PATH)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: QUALITY.webp, effort: 6 })
      .toFile(path.join(OUTPUT_DIR, `${baseFilename}.webp`));
    console.log(`   ✓ Generated WebP`);

    // AVIF - Even better compression, newer format
    await sharp(INPUT_PATH)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .avif({ quality: QUALITY.avif, effort: 6 })
      .toFile(path.join(OUTPUT_DIR, `${baseFilename}.avif`));
    console.log(`   ✓ Generated AVIF`);

    // PNG - Fallback with optimization
    await sharp(INPUT_PATH)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .png({
        quality: QUALITY.png,
        compressionLevel: 9,
        adaptiveFiltering: true,
      })
      .toFile(path.join(OUTPUT_DIR, `${baseFilename}.png`));
    console.log(`   ✓ Generated optimized PNG`);

    console.log();
  } catch (error) {
    console.error(`   ❌ Error processing ${suffix}:`, error.message);
  }
}

/**
 * Create optimized version at original size
 */
async function createOptimizedOriginal(metadata) {
  console.log('🔍 Creating optimized version at original size...');

  try {
    // Optimized PNG (replace original)
    await sharp(INPUT_PATH)
      .png({
        quality: QUALITY.png,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true, // Use palette-based PNG if beneficial
      })
      .toFile(path.join(OUTPUT_DIR, 'melbourne-map-optimized.png'));
    console.log('   ✓ Generated optimized PNG');

    // WebP version
    await sharp(INPUT_PATH)
      .webp({ quality: QUALITY.webp, effort: 6 })
      .toFile(path.join(OUTPUT_DIR, 'melbourne-map-optimized.webp'));
    console.log('   ✓ Generated optimized WebP');

    // AVIF version
    await sharp(INPUT_PATH)
      .avif({ quality: QUALITY.avif, effort: 6 })
      .toFile(path.join(OUTPUT_DIR, 'melbourne-map-optimized.avif'));
    console.log('   ✓ Generated optimized AVIF');
  } catch (error) {
    console.error('   ❌ Error creating optimized original:', error.message);
  }
}

/**
 * Run the optimization
 */
if (require.main === module) {
  optimizeImage().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { optimizeImage };
