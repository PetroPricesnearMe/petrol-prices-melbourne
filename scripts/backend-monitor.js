/**
 * Backend Monitoring Agent
 * Scans backend for issues and reports to master agent every 30 minutes
 * 
 * Monitors:
 * - API endpoints health
 * - Data file integrity
 * - Environment variables
 * - Database connectivity
 * - File system issues
 * - Server availability
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

class BackendMonitor {
  constructor() {
    this.reportLog = [];
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.timestamp = new Date().toISOString();
  }

  /**
   * Main monitoring function
   */
  async runFullScan() {
    console.log('\n🔍 ===== BACKEND MONITORING SCAN STARTED =====');
    console.log(`⏰ Timestamp: ${this.timestamp}\n`);

    this.reportLog.push({
      type: 'scan_start',
      timestamp: this.timestamp,
      message: 'Backend monitoring scan initiated'
    });

    // Run all checks
    await this.checkAPIEndpoints();
    await this.checkDataFiles();
    await this.checkEnvironmentVariables();
    await this.checkServerFiles();
    await this.checkDatabaseConfig();
    await this.checkPublicAssets();
    await this.checkNodeModules();

    // Generate report
    this.generateReport();
    this.saveReport();

    return this.getReportSummary();
  }

  /**
   * Check API endpoints health
   */
  async checkAPIEndpoints() {
    console.log('📡 Checking API endpoints...');
    
    const endpoints = [
      { path: 'pages/api/health.js', name: 'Health Check API' },
      { path: 'pages/api/stations.js', name: 'Stations API' }
    ];

    for (const endpoint of endpoints) {
      const fullPath = path.join(process.cwd(), endpoint.path);
      
      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check for common issues
          if (!content.includes('export default')) {
            this.errors.push({
              category: 'API',
              file: endpoint.path,
              issue: 'Missing default export',
              severity: 'HIGH'
            });
          }

          if (content.includes('console.log') && !content.includes('console.error')) {
            this.warnings.push({
              category: 'API',
              file: endpoint.path,
              issue: 'Console.log found but no error handling',
              severity: 'LOW'
            });
          }

          this.info.push({
            category: 'API',
            file: endpoint.path,
            status: 'OK',
            message: `${endpoint.name} file exists and is readable`
          });

        } catch (error) {
          this.errors.push({
            category: 'API',
            file: endpoint.path,
            issue: `Failed to read file: ${error.message}`,
            severity: 'HIGH'
          });
        }
      } else {
        this.errors.push({
          category: 'API',
          file: endpoint.path,
          issue: 'API endpoint file not found',
          severity: 'CRITICAL'
        });
      }
    }
  }

  /**
   * Check data files integrity
   */
  async checkDataFiles() {
    console.log('📊 Checking data files...');
    
    const dataFiles = [
      { path: 'public/data/stations.geojson', type: 'geojson', required: true },
      { path: 'public/data/stations.csv', type: 'csv', required: false },
      { path: 'database/Petrol_Stations.geojson', type: 'geojson', required: false }
    ];

    for (const dataFile of dataFiles) {
      const fullPath = path.join(process.cwd(), dataFile.path);
      
      if (fs.existsSync(fullPath)) {
        try {
          const stats = fs.statSync(fullPath);
          
          // Check file size
          if (stats.size === 0) {
            this.errors.push({
              category: 'DATA',
              file: dataFile.path,
              issue: 'Data file is empty',
              severity: 'HIGH'
            });
          } else if (stats.size < 100) {
            this.warnings.push({
              category: 'DATA',
              file: dataFile.path,
              issue: `Data file is very small (${stats.size} bytes)`,
              severity: 'MEDIUM'
            });
          } else {
            // Validate JSON structure for geojson
            if (dataFile.type === 'geojson') {
              const content = fs.readFileSync(fullPath, 'utf8');
              try {
                const json = JSON.parse(content);
                if (!json.features || !Array.isArray(json.features)) {
                  this.errors.push({
                    category: 'DATA',
                    file: dataFile.path,
                    issue: 'Invalid GeoJSON structure: missing features array',
                    severity: 'HIGH'
                  });
                } else if (json.features.length === 0) {
                  this.warnings.push({
                    category: 'DATA',
                    file: dataFile.path,
                    issue: 'GeoJSON has no features',
                    severity: 'MEDIUM'
                  });
                } else {
                  this.info.push({
                    category: 'DATA',
                    file: dataFile.path,
                    status: 'OK',
                    message: `Valid GeoJSON with ${json.features.length} features`
                  });
                }
              } catch (jsonError) {
                this.errors.push({
                  category: 'DATA',
                  file: dataFile.path,
                  issue: `Invalid JSON: ${jsonError.message}`,
                  severity: 'HIGH'
                });
              }
            } else {
              this.info.push({
                category: 'DATA',
                file: dataFile.path,
                status: 'OK',
                message: `File exists (${(stats.size / 1024).toFixed(2)} KB)`
              });
            }
          }
        } catch (error) {
          this.errors.push({
            category: 'DATA',
            file: dataFile.path,
            issue: `Failed to read file: ${error.message}`,
            severity: 'HIGH'
          });
        }
      } else if (dataFile.required) {
        this.errors.push({
          category: 'DATA',
          file: dataFile.path,
          issue: 'Required data file not found',
          severity: 'CRITICAL'
        });
      } else {
        this.info.push({
          category: 'DATA',
          file: dataFile.path,
          status: 'MISSING',
          message: 'Optional data file not found'
        });
      }
    }
  }

  /**
   * Check environment variables
   */
  async checkEnvironmentVariables() {
    console.log('🔐 Checking environment variables...');
    
    const envFile = path.join(process.cwd(), '.env.local');
    const envExampleFile = path.join(process.cwd(), '.env.example');
    
    const requiredVars = [
      'ANTHROPIC_API_KEY',
      'NEXT_PUBLIC_MAPBOX_TOKEN'
    ];

    // Check if .env.local exists
    if (!fs.existsSync(envFile)) {
      this.warnings.push({
        category: 'ENV',
        file: '.env.local',
        issue: 'Environment file not found',
        severity: 'MEDIUM'
      });
    } else {
      try {
        const envContent = fs.readFileSync(envFile, 'utf8');
        
        for (const varName of requiredVars) {
          if (!envContent.includes(varName)) {
            this.warnings.push({
              category: 'ENV',
              file: '.env.local',
              issue: `Missing or empty ${varName}`,
              severity: 'MEDIUM'
            });
          } else {
            this.info.push({
              category: 'ENV',
              file: '.env.local',
              status: 'OK',
              message: `${varName} is configured`
            });
          }
        }
      } catch (error) {
        this.errors.push({
          category: 'ENV',
          file: '.env.local',
          issue: `Failed to read environment file: ${error.message}`,
          severity: 'HIGH'
        });
      }
    }

    // Check if .env.example exists
    if (fs.existsSync(envExampleFile)) {
      this.info.push({
        category: 'ENV',
        file: '.env.example',
        status: 'OK',
        message: 'Example environment file exists'
      });
    }
  }

  /**
   * Check server files
   */
  async checkServerFiles() {
    console.log('🖥️  Checking server files...');
    
    const serverFiles = [
      { path: 'server.js', name: 'Express Server', required: true },
      { path: 'next.config.js', name: 'Next.js Config', required: true },
      { path: 'package.json', name: 'Package Config', required: true }
    ];

    for (const file of serverFiles) {
      const fullPath = path.join(process.cwd(), file.path);
      
      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Specific checks based on file type
          if (file.path === 'server.js') {
            if (!content.includes('express')) {
              this.errors.push({
                category: 'SERVER',
                file: file.path,
                issue: 'Express not imported in server.js',
                severity: 'HIGH'
              });
            }
            if (!content.includes('app.listen')) {
              this.errors.push({
                category: 'SERVER',
                file: file.path,
                issue: 'No app.listen() call found',
                severity: 'HIGH'
              });
            }
          }

          if (file.path === 'package.json') {
            try {
              const pkg = JSON.parse(content);
              if (!pkg.dependencies) {
                this.errors.push({
                  category: 'SERVER',
                  file: file.path,
                  issue: 'No dependencies found in package.json',
                  severity: 'HIGH'
                });
              } else {
                this.info.push({
                  category: 'SERVER',
                  file: file.path,
                  status: 'OK',
                  message: `${Object.keys(pkg.dependencies).length} dependencies configured`
                });
              }
            } catch (jsonError) {
              this.errors.push({
                category: 'SERVER',
                file: file.path,
                issue: `Invalid JSON: ${jsonError.message}`,
                severity: 'CRITICAL'
              });
            }
          }

          this.info.push({
            category: 'SERVER',
            file: file.path,
            status: 'OK',
            message: `${file.name} exists and is readable`
          });

        } catch (error) {
          this.errors.push({
            category: 'SERVER',
            file: file.path,
            issue: `Failed to read file: ${error.message}`,
            severity: 'HIGH'
          });
        }
      } else if (file.required) {
        this.errors.push({
          category: 'SERVER',
          file: file.path,
          issue: `Required server file not found`,
          severity: 'CRITICAL'
        });
      }
    }
  }

  /**
   * Check database configuration
   */
  async checkDatabaseConfig() {
    console.log('🗄️  Checking database configuration...');
    
    const mcpConfigPath = path.join(process.cwd(), 'mcp.json');
    
    if (fs.existsSync(mcpConfigPath)) {
      try {
        const content = fs.readFileSync(mcpConfigPath, 'utf8');
        const config = JSON.parse(content);
        
        if (!config.mcpServers) {
          this.errors.push({
            category: 'DATABASE',
            file: 'mcp.json',
            issue: 'No mcpServers configuration found',
            severity: 'HIGH'
          });
        } else {
          const serverCount = Object.keys(config.mcpServers).length;
          this.info.push({
            category: 'DATABASE',
            file: 'mcp.json',
            status: 'OK',
            message: `${serverCount} MCP server(s) configured`
          });
        }
      } catch (error) {
        this.errors.push({
          category: 'DATABASE',
          file: 'mcp.json',
          issue: `Failed to parse MCP config: ${error.message}`,
          severity: 'HIGH'
        });
      }
    } else {
      this.warnings.push({
        category: 'DATABASE',
        file: 'mcp.json',
        issue: 'MCP configuration file not found',
        severity: 'MEDIUM'
      });
    }
  }

  /**
   * Check public assets
   */
  async checkPublicAssets() {
    console.log('🖼️  Checking public assets...');
    
    const publicPath = path.join(process.cwd(), 'public');
    
    if (!fs.existsSync(publicPath)) {
      this.errors.push({
        category: 'ASSETS',
        file: 'public/',
        issue: 'Public directory not found',
        severity: 'CRITICAL'
      });
      return;
    }

    const requiredAssets = [
      'favicon.ico',
      'manifest.json',
      'robots.txt'
    ];

    for (const asset of requiredAssets) {
      const assetPath = path.join(publicPath, asset);
      if (fs.existsSync(assetPath)) {
        this.info.push({
          category: 'ASSETS',
          file: `public/${asset}`,
          status: 'OK',
          message: 'Asset exists'
        });
      } else {
        this.warnings.push({
          category: 'ASSETS',
          file: `public/${asset}`,
          issue: 'Recommended asset not found',
          severity: 'LOW'
        });
      }
    }
  }

  /**
   * Check node_modules
   */
  async checkNodeModules() {
    console.log('📦 Checking node_modules...');
    
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    
    if (fs.existsSync(nodeModulesPath)) {
      this.info.push({
        category: 'DEPENDENCIES',
        file: 'node_modules/',
        status: 'OK',
        message: 'Dependencies are installed'
      });
    } else {
      this.errors.push({
        category: 'DEPENDENCIES',
        file: 'node_modules/',
        issue: 'node_modules directory not found. Run npm install',
        severity: 'CRITICAL'
      });
    }
  }

  /**
   * Generate report
   */
  generateReport() {
    console.log('\n📋 ===== BACKEND MONITORING REPORT =====\n');
    
    const totalIssues = this.errors.length + this.warnings.length;
    const criticalIssues = this.errors.filter(e => e.severity === 'CRITICAL').length;
    const highIssues = this.errors.filter(e => e.severity === 'HIGH').length;
    const mediumIssues = this.warnings.filter(w => w.severity === 'MEDIUM').length;
    const lowIssues = this.warnings.filter(w => w.severity === 'LOW').length;

    console.log(`⏰ Scan Time: ${this.timestamp}`);
    console.log(`📊 Total Issues: ${totalIssues}`);
    console.log(`🔴 Critical: ${criticalIssues}`);
    console.log(`🟠 High: ${highIssues}`);
    console.log(`🟡 Medium: ${mediumIssues}`);
    console.log(`🟢 Low: ${lowIssues}`);
    console.log(`✅ Info: ${this.info.length}\n`);

    if (this.errors.length > 0) {
      console.log('❌ ERRORS:');
      this.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. [${error.severity}] ${error.category} - ${error.file}`);
        console.log(`     ${error.issue}\n`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      this.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. [${warning.severity}] ${warning.category} - ${warning.file}`);
        console.log(`     ${warning.issue}\n`);
      });
    }

    if (totalIssues === 0) {
      console.log('✅ No issues found! Backend is healthy.\n');
    }

    console.log('===== END OF REPORT =====\n');
  }

  /**
   * Save report to file
   */
  saveReport() {
    const reportsDir = path.join(process.cwd(), 'logs', 'backend-reports');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(reportsDir, `report-${timestamp}.json`);

    const report = {
      timestamp: this.timestamp,
      summary: {
        totalIssues: this.errors.length + this.warnings.length,
        critical: this.errors.filter(e => e.severity === 'CRITICAL').length,
        high: this.errors.filter(e => e.severity === 'HIGH').length,
        medium: this.warnings.filter(w => w.severity === 'MEDIUM').length,
        low: this.warnings.filter(w => w.severity === 'LOW').length,
        info: this.info.length
      },
      errors: this.errors,
      warnings: this.warnings,
      info: this.info,
      reportLog: this.reportLog
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`💾 Report saved to: ${reportPath}`);

    // Also save latest report
    const latestPath = path.join(reportsDir, 'latest.json');
    fs.writeFileSync(latestPath, JSON.stringify(report, null, 2));
    console.log(`💾 Latest report saved to: ${latestPath}\n`);
  }

  /**
   * Get report summary
   */
  getReportSummary() {
    return {
      timestamp: this.timestamp,
      totalIssues: this.errors.length + this.warnings.length,
      errors: this.errors,
      warnings: this.warnings,
      info: this.info,
      status: this.errors.length === 0 ? 'HEALTHY' : 'ISSUES_FOUND'
    };
  }
}

// Export for use in other scripts
module.exports = BackendMonitor;

// Run if called directly
if (require.main === module) {
  const monitor = new BackendMonitor();
  monitor.runFullScan()
    .then((summary) => {
      console.log('✅ Monitoring scan completed');
      process.exit(summary.errors.length > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Monitoring scan failed:', error);
      process.exit(1);
    });
}

