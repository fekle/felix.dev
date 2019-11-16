const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./dist/**/*.html', './dist/**/*.js'],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});

const cssnano = require('cssnano')({
  preset: [
    'default',
    {
      discardComments: {
        removeAll: true,
      },
    },
  ],
});

module.exports = {
  parser: 'postcss-scss',
  plugins: [...(process.env.NODE_ENV === 'production' ? [purgecss, cssnano] : [])],
};
