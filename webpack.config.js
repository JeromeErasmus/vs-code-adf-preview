const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  // Configuration for the webview bundle
  const webviewConfig = {
    name: 'webview',
    mode: argv.mode || 'development',
    entry: './src/webview/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist', 'webview'),
      filename: 'bundle.js',
      clean: true
    },
    devtool: isProduction ? false : 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        'react-intl-next': 'react-intl'
      },
      fallback: {
        "process": require.resolve("process/browser.js"),
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer"),
        "util": require.resolve("util"),
        "url": require.resolve("url"),
        "querystring": require.resolve("querystring-es3"),
        "fs": false,
        "net": false,
        "tls": false,
        "assert": require.resolve("assert"),
        "constants": require.resolve("constants-browserify"),
        "domain": require.resolve("domain-browser"),
        "events": require.resolve("events"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "punycode": require.resolve("punycode"),
        "string_decoder": require.resolve("string_decoder"),
        "vm": require.resolve("vm-browserify"),
        "zlib": require.resolve("browserify-zlib")
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      // We don't use HtmlWebpackPlugin here since VS Code provides the HTML
      // The webview HTML is generated in the extension code
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({}),
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      }),
    ],
    optimization: {
      minimize: isProduction,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          atlaskit: {
            test: /[\\/]node_modules[\\/]@atlaskit[\\/]/,
            name: 'atlaskit-vendor',
            priority: 10,
            filename: 'atlaskit-vendor.js'
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            priority: 9,
            filename: 'react-vendor.js'
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 8,
            filename: 'vendor.js'
          }
        }
      }
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxAssetSize: 5000000, // 5MB - accounting for @atlaskit/renderer
      maxEntrypointSize: 5000000
    }
  };

  // Configuration for the extension bundle
  const extensionConfig = {
    name: 'extension',
    mode: argv.mode || 'development',
    target: 'node',
    entry: './src/extension/extension.ts',
    output: {
      path: path.resolve(__dirname, 'dist', 'extension'),
      filename: 'extension.js',
      libraryTarget: 'commonjs2',
      clean: true
    },
    devtool: isProduction ? false : 'source-map',
    externals: {
      vscode: 'commonjs vscode'
    },
    resolve: {
      extensions: ['.ts', '.js', '.mjs'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@shared': path.resolve(__dirname, 'src/shared')
      },
      mainFields: ['module', 'main'],
      conditionNames: ['import', 'module', 'require', 'default']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false
          },
          include: /node_modules\/extended-markdown-adf-parser/
        }
      ]
    },
    optimization: {
      minimize: false // Don't minimize extension code for better debugging
    },
    experiments: {
      topLevelAwait: true
    }
  };

  return [webviewConfig, extensionConfig];
};