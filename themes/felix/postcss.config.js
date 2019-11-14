module.exports = {
  parser: 'postcss-scss',
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('precss'),
    require('postcss-font-display'),
    require('@fullhuman/postcss-purgecss')({
      content: ['layouts/**/*.html', 'layouts/*.html', 'themes/**/layouts/**/*.html', 'themes/**/layouts/*.html'],
      extractors: [
        {
          extractor: require('purgecss-from-html'),
          extensions: ['html'],
        },
      ],
      fontFace: false,
    }),
    require('autoprefixer'),
  ],
};
