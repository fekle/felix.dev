'use strict';

const p = require('path');
const fs = require('fs');
const gulp = require('gulp');

const { exec, forEachFile } = require('./resources/gulp/util');

// go to correct dir
process.chdir(__dirname);

const paths = {
  theme: './themes/felix',
  dist: './dist',
};

const imagemin = () =>
  require('gulp-imagemin')([
    require('imagemin-mozjpeg')({ quality: 85, progressive: true }),
    require('imagemin-pngquant')({ quality: [0.85, 1] }),
    require('imagemin-optipng')({ optimizationLevel: 3 }),
    require('imagemin-gifsicle')({ interlaced: true }),
    require('imagemin-svgo')(),
  ]);

gulp.task('clean', () => exec(`rm -rf '${paths.dist}'`));

gulp.task('hugo:chroma', () =>
  exec(`hugo gen chromastyles --style=monokai > '${p.join(paths.theme, 'assets/css/vendor/chroma.css')}'`),
);

gulp.task('hugo:watch', () => exec('env NODE_ENV=development hugo --gc --cleanDestinationDir --watch -D server'));
gulp.task('hugo:dev', () => exec('env NODE_ENV=development hugo --gc --cleanDestinationDir'));
gulp.task('hugo:prod', () => exec('env NODE_ENV=production hugo --gc --cleanDestinationDir --minify'));

gulp.task('favicons:convert', () =>
  gulp
    .src(p.join(paths.theme, 'resources/favicon.svg'))
    .pipe(
      require('gulp-favicons')({
        path: '/img/favicons',
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
          android: {
            background: 'rgba(0,0,0,0)',
          },
          appleIcon: {
            background: 'rgba(0,0,0,0)',
          },
          appleStartup: {
            background: 'rgba(0,0,0,0)',
          },
          coast: {
            background: 'rgba(0,0,0,0)',
          },
          favicons: {
            background: 'rgba(0,0,0,0)',
          },
          firefox: {
            background: 'rgba(0,0,0,0)',
          },
          windows: {
            background: 'rgba(0,0,0,0)',
          },
          yandex: {
            background: 'rgba(0,0,0,0)',
          },
        },
        html: 'index.html',
        pipeHTML: true,
        replace: true,
      }),
    )
    .pipe(gulp.dest(p.join(paths.theme, 'static/img/favicons'))),
);
gulp.task('favicons:compress', () =>
  gulp
    .src(p.join(paths.theme, 'static/img/favicons/**/*.{png,svg,jpg,jpeg,gif,ico,webp}'))
    .pipe(imagemin())
    .pipe(gulp.dest(p.join(paths.theme, 'static/img/favicons'))),
);

gulp.task('favicons:move-meta-html', cb =>
  fs.rename(
    p.join(paths.theme, 'static/img/favicons/index.html'),
    p.join(paths.theme, 'layouts/partials/favicons.html'),
    cb,
  ),
);
gulp.task('favicons:copy-legacy', cb =>
  fs.copyFile(p.join(paths.theme, 'static/img/favicons/favicon.ico'), p.join(paths.theme, 'static/favicon.ico'), cb),
);
gulp.task(
  'favicons',
  gulp.series(
    'favicons:convert',
    'favicons:compress',
    gulp.parallel('favicons:move-meta-html', 'favicons:copy-legacy'),
  ),
);

gulp.task('postcss', () =>
  gulp
    .src(p.join(paths.dist, '**/*.css'))
    .pipe(
      require('gulp-postcss')([
        require('postcss-font-display'),
        require('autoprefixer'),
        require('@fullhuman/postcss-purgecss')({
          content: ['./dist/**/*.html', './dist/**/*.js'],
          keyframes: true,
          fontFace: true,
        }),
        require('cssnano')({
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        }),
      ]),
    )
    .pipe(gulp.dest(paths.dist)),
);

gulp.task('imagemin', () =>
  gulp
    .src(p.join(paths.dist, '**/*.{png,svg,jpg,jpeg,gif,ico,webp}'))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist)),
);

gulp.task('compress', () =>
  gulp.src([p.join(paths.dist, '**/*'), '!**/*.gz']).pipe(forEachFile(f => exec(`zopfli --gzip --i5 '${f}'`))),
);

gulp.task('fmt', () => exec("prettier --color --write './**/*.{js,ts,jsx,tsx,json,css,scss,pcss,yml,yaml}'"));

gulp.task('build:dev', gulp.series('clean', 'hugo:dev'));
gulp.task('build:prod', gulp.series('clean', 'hugo:prod', gulp.parallel('postcss', 'imagemin'), 'compress'));

gulp.task('build', gulp.series('build:prod'));
gulp.task('default', gulp.series('build'));
