module.exports = {
  // Change the default stories directory to the component directories
  stories: ['../src/**/**/*.stories.jsx'],
  // Configure Storybook addons
  addons: [
      // Add feature to display data received by event handlers in Storybook
      '@storybook/addon-actions',
      // Add feature to create links that navigate between stories in Storybook
      '@storybook/addon-links',
      // Add feature to edit props dynamically using the Storybook UI
      '@storybook/addon-knobs/register'
  ],
  // Edit Storybooks webpack configuration to support
  webpackFinal: async config => {
    // Add support for Sass imports in js
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        { loader: 'style-loader' }, // Creates the javascript to inject CSS into the DOM
        { loader: 'css-loader' },   // Interprets @import/url() as import/require() within the js and resolves them
        { loader: 'sass-loader' }   // Loads a Sass/SCSS file and compiles it to CSS.
      ]
    });

    return config;
  }
};
