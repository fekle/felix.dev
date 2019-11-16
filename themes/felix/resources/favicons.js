var favicons = require('favicons').stream,
  log = require('fancy-log'),
  gulp = require('gulp');

gulp.task('favicons', function() {
  return gulp
    .src('./favicon.png')
    .pipe(
      favicons({
        path: '/favicons',
        appName: 'felix.dev',
        appShortName: 'felix.dev',
        appDescription: "Felix Klein's Homepage",
        developerName: 'Felix Klein',
        developerURL: 'https://felix.dev',
        dir: 'auto',
        lang: 'en-US',
        background: '#111111',
        theme_color: '#ffa86a',
        appleStatusBarStyle: 'black-translucent',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        version: '1.0',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: true,
          favicons: true,
          firefox: true,
          windows: true,
          yandex: true,
        },

        html: 'index.html',
        pipeHTML: true,
        replace: true,
      }),
    )
    .on('error', log)
    .pipe(gulp.dest('../static/favicons'));
});
