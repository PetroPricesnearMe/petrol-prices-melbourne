/**
 * Image Optimization Script
 * Optimizes images in the public/images directory
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
};

/**
 * Get file size in KB
 */
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

/**
 * Find all images in directory
 */
function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findImages(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Analyze images
 */
function analyzeImages(images) {
  log.info('Analyzing images...\n');

  const report = {
    total: images.length,
    totalSize: 0,
    largeImages: [],
    recommendations: [],
  };

  images.forEach((imagePath) => {
    const size = parseFloat(getFileSize(imagePath));
    report.totalSize += size;

    // Flag large images (> 200KB)
    if (size > 200) {
      report.largeImages.push({
        path: imagePath,
        size: size,
      });
    }
  });

  return report;
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(report) {
  const recommendations = [];

  // Large images
  if (report.largeImages.length > 0) {
    recommendations.push({
      type: 'large-images',
      count: report.largeImages.length,
      message: `Found ${report.largeImages.length} images larger than 200KB`,
      action: 'Compress these images or convert to WebP format',
      files: report.largeImages,
    });
  }

  // Total size
  if (report.totalSize > 5000) {
    recommendations.push({
      type: 'total-size',
      message: `Total image size is ${report.totalSize.toFixed(2)}KB`,
      action: 'Consider lazy loading images and using responsive images',
    });
  }

  return recommendations;
}

/**
 * Print report
 */
function printReport(report, recommendations) {
  console.log('\n' + '='.repeat(60));
  console.log('IMAGE OPTIMIZATION REPORT');
  console.log('='.repeat(60) + '\n');

  log.info(`Total Images: ${report.total}`);
  log.info(`Total Size: ${report.totalSize.toFixed(2)} KB\n`);

  if (recommendations.length === 0) {
    log.success('All images are optimized! 🎉\n');
    return;
  }

  log.warning(`Found ${recommendations.length} optimization opportunities:\n`);

  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec.message}`);
    console.log(`   Action: ${rec.action}`);

    if (rec.files) {
      console.log(`   Files:`);
      rec.files.forEach((file) => {
        console.log(`   - ${file.path} (${file.size.toFixed(2)} KB)`);
      });
    }
    console.log('');
  });

  console.log('='.repeat(60));
  console.log('OPTIMIZATION TIPS');
  console.log('='.repeat(60) + '\n');

  console.log('1. Use WebP format for better compression:');
  console.log('   https://developers.google.com/speed/webp\n');

  console.log('2. Use image optimization tools:');
  console.log('   - TinyPNG: https://tinypng.com/');
  console.log('   - ImageOptim: https://imageoptim.com/');
  console.log('   - Squoosh: https://squoosh.app/\n');

  console.log('3. Implement lazy loading:');
  console.log('   - Use loading="lazy" attribute');
  console.log('   - Or use IntersectionObserver API\n');

  console.log('4. Use responsive images:');
  console.log('   - Implement srcset and sizes attributes');
  console.log('   - Serve different sizes for different devices\n');

  console.log('='.repeat(60) + '\n');
}

/**
 * Main function
 */
function main() {
  const publicDir = path.join(__dirname, '..', 'public', 'images');
  const buildDir = path.join(__dirname, '..', 'build', 'images');

  log.info('Starting image optimization analysis...\n');

  // Check if directories exist
  const dirsToCheck = [
    { path: publicDir, name: 'Public Images' },
  ];

  if (fs.existsSync(buildDir)) {
    dirsToCheck.push({ path: buildDir, name: 'Build Images' });
  }

  let allImages = [];

  dirsToCheck.forEach(({ path: dir, name }) => {
    if (fs.existsSync(dir)) {
      log.info(`Scanning ${name}...`);
      const images = findImages(dir);
      allImages = allImages.concat(images);
      log.success(`Found ${images.length} images in ${name}`);
    } else {
      log.warning(`Directory not found: ${dir}`);
    }
  });

  console.log('');

  if (allImages.length === 0) {
    log.warning('No images found to analyze.');
    return;
  }

  // Analyze and report
  const report = analyzeImages(allImages);
  const recommendations = generateRecommendations(report);
  printReport(report, recommendations);

  // Exit with appropriate code
  process.exit(recommendations.length > 0 ? 1 : 0);
}

// Run the script
main();

