const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        '@shared': path.resolve(__dirname, 'src/shared')
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
    ],
    optimization: {
      minimize: isProduction,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          atlaskit: {
            test: /[\\/]node_modules[\\/]@atlaskit[\\/]/,
            name: 'atlaskit',
            priority: 10
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 9
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 8
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
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@shared': path.resolve(__dirname, 'src/shared')
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    optimization: {
      minimize: false // Don't minimize extension code for better debugging
    }
  };

  return [webviewConfig, extensionConfig];
};