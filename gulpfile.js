'use strict';

const p = require('path');
const fs = require('fs');
const gulp = require('gulp');

const { exec, forEachFile, withAllFiles, execAllFilesStdin } = require('./resources/gulp/util');

// add node_modules/.bin to path
process.env.PATH = `${process.env.PATH}:${__dirname}/node_modules/.bin`;

// variables
const DOCKER_DEV_TAG = 'docker.felix.dev/felix/felix.dev/web:dev';

// go to correct dir
process.chdir(__dirname);

const paths = {
  theme: './themes/felix',
  dist: './dist',
};

const imagemin = () =>
  require('gulp-imagemin')([
    require('imagemin-mozjpeg')({ quality: 85, progressive: true }),
    require('imagemin-pngquant')({ quality: [0.85, 0.95] }),
    require('imagemin-optipng')({ optimizationLevel: 3 }),
    require('imagemin-zopfli')({ transparent: true, more: true }),
    require('imagemin-gifsicle')({ interlaced: true }),
    require('imagemin-svgo')(),
  ]);
gulp.task('imagemin', () =>
  gulp
    .src([
      p.join('.', '{static,resources}/**/*.{png,svg,jpg,jpeg,gif,ico,webp}'),
      p.join(paths.theme, '{static,resources}/**/*.{png,svg,jpg,jpeg,gif,ico,webp}'),
    ])
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist)),
);

gulp.task('clean', () => exec(`rm -rf '${paths.dist}'`));

gulp.task('hugo:chroma', () =>
  exec(`hugo gen chromastyles --style=monokai > '${p.join(paths.theme, 'assets/css/vendor/chroma.css')}'`),
);

gulp.task('hugo:watch', () => exec('env NODE_ENV=development hugo --gc --cleanDestinationDir --watch -D server'));
gulp.task('hugo:dev', () => exec('env NODE_ENV=development hugo --gc --cleanDestinationDir'));
gulp.task('hugo:prod', () => exec('env NODE_ENV=production hugo --gc --cleanDestinationDir --minify'));

gulp.task('favicons:convert', () =>
  require('./resources/gulp/favicon-gen')(
    p.join(paths.theme, 'resources/favicon.svg'),
    p.join(paths.theme, 'static/img/favicons'),
  ),
);
gulp.task('favicons:copy-legacy', cb =>
  fs.copyFile(p.join(paths.theme, 'static/img/favicons/favicon-32.png'), p.join(paths.theme, 'static/favicon.ico'), cb),
);
gulp.task('favicons', gulp.series('favicons:convert', 'favicons:copy-legacy', 'imagemin'));

gulp.task('postcss', () => exec('cd themes/felix && postcss -o assets/css/main.css resources/css/main.pcss'));
gulp.task('postcss:watch', () =>
  exec('cd themes/felix && postcss -w --verbose -o assets/css/main.css resources/css/main.pcss'),
);

gulp.task('postcss-post', () =>
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

gulp.task('compress', () =>
  gulp.src([p.join(paths.dist, '**/*'), '!**/*.gz']).pipe(execAllFilesStdin("parallel -0 'zopfli --gzip --i5 {}'")),
);

gulp.task('fmt', () => exec("prettier --color --write './**/*.{js,ts,jsx,tsx,json,css,scss,pcss,yml,yaml}'"));

gulp.task('docker:build', () => exec(`docker build --pull -t ${DOCKER_DEV_TAG} .`));
gulp.task('docker:push', () => exec(`docker push ${DOCKER_DEV_TAG}`));

gulp.task('watch', gulp.parallel('hugo:watch', 'postcss:watch'));

gulp.task('build:dev', gulp.series('clean', 'postcss', 'hugo:dev'));
gulp.task('build:prod', gulp.series('clean', 'postcss', 'hugo:prod', 'postcss-post', 'compress'));

gulp.task('build', gulp.series('build:prod'));
gulp.task('default', gulp.series('build'));
