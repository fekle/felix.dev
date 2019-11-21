process.chdir(__dirname);

module.exports = {
  parser: 'postcss-scss',
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('precss'),
    require('postcss-assets')({
      cachebuster: true,
      loadPaths: ['assets/', 'static/'],
    }),
  ],
};
