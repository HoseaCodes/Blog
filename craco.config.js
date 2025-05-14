const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Set the public path
      webpackConfig.output.publicPath = 'auto';
      
      // Disable react-refresh-webpack-plugin to avoid compatibility issues
      if (env === 'development') {
        webpackConfig.plugins = webpackConfig.plugins.filter(
          (plugin) => !plugin.constructor || plugin.constructor.name !== 'ReactRefreshPlugin'
        );
      }
      
      // Add Module Federation Plugin
      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          // Name of your portfolio application
          name: 'portfolio',
          
          // Remote modules you want to consume
          remotes: {
            // The format is "remoteName@remoteUrl/remoteEntry.js"
            game: process.env.NODE_ENV === 'production'
              ? 'game@https://your-game-center-production-url.com/remoteEntry.js'
              : 'game@http://localhost:3001/remoteEntry.js',
          },
          
          // Shared dependencies - using React 17 versions
          shared: {
            react: { 
              singleton: true, 
              requiredVersion: "^17.0.2" 
            },
            'react-dom': { 
              singleton: true, 
              requiredVersion: "^17.0.2" 
            },
            'react-router-dom': { 
              singleton: true, 
              requiredVersion: "^5.3.4" 
            },
          },
        })
      );
      
      return webpackConfig;
    },
  },
};