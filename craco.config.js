/**
 * CRACO Configuration for Create React App
 * Custom webpack configuration for bundle optimization
 */

const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Production optimizations
      if (env === 'production') {
        // Bundle splitting strategy
        webpackConfig.optimization = {
          ...webpackConfig.optimization,

          // Separate runtime chunk
          runtimeChunk: 'single',

          // Split chunks strategy
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20000,
            maxSize: 244000,
            cacheGroups: {
              // Vendor chunk - React ecosystem
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                name: 'vendor-react',
                priority: 40,
                reuseExistingChunk: true,
              },

              // Maps vendor chunk
              maps: {
                test: /[\\/]node_modules[\\/](mapbox-gl|react-map-gl)[\\/]/,
                name: 'vendor-maps',
                priority: 35,
                reuseExistingChunk: true,
              },

              // UI libraries
              ui: {
                test: /[\\/]node_modules[\\/](framer-motion|styled-components)[\\/]/,
                name: 'vendor-ui',
                priority: 30,
                reuseExistingChunk: true,
              },

              // Utilities
              utils: {
                test: /[\\/]node_modules[\\/](axios|lodash|date-fns)[\\/]/,
                name: 'vendor-utils',
                priority: 25,
                reuseExistingChunk: true,
              },

              // Common code shared between routes
              common: {
                minChunks: 2,
                priority: 20,
                reuseExistingChunk: true,
                name: 'common',
              },

              // All other vendors
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                priority: 10,
                reuseExistingChunk: true,
              }
            }
          },

          // Minimize configuration
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                  pure_funcs: ['console.log', 'console.info', 'console.debug'],
                  passes: 2
                },
                format: {
                  comments: false,
                },
                mangle: {
                  safari10: true
                }
              },
              extractComments: false,
            })
          ]
        };

        // Add compression plugins
        webpackConfig.plugins.push(
          // Gzip compression
          new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 1024,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          })
        );

        // Brotli compression (better than gzip)
        webpackConfig.plugins.push(
          new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg)$/,
            threshold: 1024,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          })
        );

        // Bundle analyzer (only when ANALYZE=true)
        if (process.env.ANALYZE === 'true') {
          webpackConfig.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              reportFilename: '../bundle-analysis.html',
              openAnalyzer: true,
            })
          );
        }

        // Disable source maps in production (security & size)
        webpackConfig.devtool = false;

        // Tree shaking optimization
        webpackConfig.optimization.usedExports = true;
        webpackConfig.optimization.sideEffects = false;
      }

      // Development optimizations
      if (env === 'development') {
        // Faster source maps
        webpackConfig.devtool = 'eval-source-map';

        // Disable chunk splitting in dev for faster rebuilds
        webpackConfig.optimization.splitChunks = {
          cacheGroups: {
            default: false
          }
        };
      }

      return webpackConfig;
    },
  },

  // Babel configuration for tree-shaking
  babel: {
    plugins: [
      // Transform imports for better tree-shaking
      ['babel-plugin-transform-imports', {
        'lodash': {
          transform: 'lodash/$' + '{member}',
          preventFullImport: true
        },
        '@mui/icons-material': {
          transform: '@mui/icons-material/$' + '{member}',
          preventFullImport: true
        }
      }]
    ]
  },

  // DevServer configuration
  devServer: (devServerConfig, { env, paths }) => {
    return {
      ...devServerConfig,
      compress: true, // Enable gzip compression in dev server
      hot: true,

      // Enable HTTP/2 for better performance
      http2: false, // Set to true with HTTPS

      headers: {
        'Cache-Control': 'no-store',
      }
    };
  }
};

