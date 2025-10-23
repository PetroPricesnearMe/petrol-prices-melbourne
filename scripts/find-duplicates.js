#!/usr/bin/env node
/**
 * Find Duplicate Components Script
 * 
 * Identifies duplicate or similar components that can be consolidated
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

function getAllComponents(dir, componentList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!['node_modules', '.next', 'build'].includes(file)) {
        getAllComponents(filePath, componentList);
      }
    } else if (file.match(/\.(tsx?|jsx?)$/)) {
      componentList.push({
        path: filePath,
        name: file,
        content: fs.readFileSync(filePath, 'utf8'),
      });
    }
  });

  return componentList;
}

function findSimilarComponents(components) {
  log.title('🔍 Finding Similar Components...');

  const similar = [];

  // Look for components with similar names
  const nameGroups = {};
  components.forEach((comp) => {
    const baseName = comp.name
      .replace(/\.(tsx?|jsx?)$/, '')
      .replace(/(Component|Page|Container|Wrapper)$/, '')
      .toLowerCase();

    if (!nameGroups[baseName]) {
      nameGroups[baseName] = [];
    }
    nameGroups[baseName].push(comp);
  });

  // Report groups with multiple components
  Object.entries(nameGroups).forEach(([name, comps]) => {
    if (comps.length > 1) {
      similar.push({
        baseName: name,
        count: comps.length,
        components: comps.map((c) => path.relative(process.cwd(), c.path)),
      });
    }
  });

  if (similar.length === 0) {
    log.success('No duplicate component names found!');
  } else {
    log.warning(`Found ${similar.length} groups of similar component names:`);
    similar.forEach((group) => {
      console.log(`\n  "${group.baseName}" (${group.count} components):`);
      group.components.forEach((comp) => {
        console.log(`    - ${comp}`);
      });
    });
  }

  return similar;
}

function findDuplicateLogic(components) {
  log.title('🔄 Finding Duplicate Logic Patterns...');

  const patterns = {
    useState: /useState\s*\(/g,
    useEffect: /useEffect\s*\(/g,
    fetch: /fetch\s*\(/g,
    axios: /axios\./g,
    map: /\.map\s*\(/g,
    filter: /\.filter\s*\(/g,
  };

  const duplicates = [];

  components.forEach((comp1, i) => {
    components.slice(i + 1).forEach((comp2) => {
      const similarity = calculateSimilarity(comp1.content, comp2.content);
      
      if (similarity > 0.7) {
        // More than 70% similar
        duplicates.push({
          similarity: (similarity * 100).toFixed(1) + '%',
          file1: path.relative(process.cwd(), comp1.path),
          file2: path.relative(process.cwd(), comp2.path),
        });
      }
    });
  });

  if (duplicates.length === 0) {
    log.success('No significant duplicate logic found!');
  } else {
    log.warning(`Found ${duplicates.length} pairs of similar files:`);
    duplicates.slice(0, 10).forEach((dup) => {
      console.log(`\n  ${dup.similarity} similarity:`);
      console.log(`    ${dup.file1}`);
      console.log(`    ${dup.file2}`);
    });
    if (duplicates.length > 10) {
      console.log(`  ... and ${duplicates.length - 10} more pairs`);
    }
  }

  return duplicates;
}

function calculateSimilarity(str1, str2) {
  // Simple similarity calculation based on common lines
  const lines1 = str1.split('\n').filter((l) => l.trim().length > 0);
  const lines2 = str2.split('\n').filter((l) => l.trim().length > 0);

  const set1 = new Set(lines1.map((l) => l.trim()));
  const set2 = new Set(lines2.map((l) => l.trim()));

  const intersection = [...set1].filter((x) => set2.has(x));
  const union = new Set([...set1, ...set2]);

  return intersection.length / union.size;
}

function main() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔════════════════════════════════════╗');
  console.log('║  Component Duplication Detector   ║');
  console.log('╚════════════════════════════════════╝');
  console.log(colors.reset);

  const srcDir = path.join(process.cwd(), 'src');
  const components = getAllComponents(srcDir);

  log.info(`Analyzing ${components.length} components...`);

  const similarNames = findSimilarComponents(components);
  const duplicateLogic = findDuplicateLogic(components);

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalComponents: components.length,
    similarNameGroups: similarNames.length,
    duplicateLogicPairs: duplicateLogic.length,
    similarNames,
    duplicateLogic: duplicateLogic.slice(0, 20), // Top 20
  };

  const reportPath = path.join(process.cwd(), 'duplicate-components-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  log.success(`\nReport saved to: duplicate-components-report.json`);

  const totalIssues = similarNames.length + duplicateLogic.length;
  if (totalIssues === 0) {
    log.success('🎉 No duplicate components found!');
  } else {
    log.warning(`\n⚠️  Found ${totalIssues} potential duplication issues.`);
    console.log('\nConsider consolidating duplicate components into reusable ones.');
  }
}

main();

