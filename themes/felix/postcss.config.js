process.chdir(__dirname);

module.exports = {
  parser: 'postcss-scss',
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('precss'),
    require('postcss-font-display'),
    require('autoprefixer'),
  ],
};
