const gulp = require('gulp');
const webpack = require('webpack');
const nodemon = require('nodemon');
const Mocha = require('mocha');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const webpackConfig = require('./webpackConfig.js');

// Sass.
gulp.task('build:css', () => {
  gulp.src('src/style/style.scss')
    .pipe(
      sass({ includePaths: 'src' }).on('error', sass.logError)
    )
    .pipe(gulp.dest('out/public/css'));
});
gulp.task('watch:css', ['build:css'], () => {
  gulp.watch('src/**/*.scss', ['build:css']);
});

// Server JS build.
gulp.task('build:server', [], done => (
  webpack(webpackConfig.server).run(webpackConfig.callback(done))
));
gulp.task('watch:server', ['build:server'], () => {
  webpack(webpackConfig.server).watch(100, (err, stats) => {
    webpackConfig.callback()(err, stats);
    nodemon.restart();
  });
});

const WEBPACK_TASKS = ['oneoff', 'client', 'ios', 'android'];
const TASKS = ['css', 'server'].concat(WEBPACK_TASKS);

WEBPACK_TASKS.forEach(task => {
  gulp.task(`build:${task}`, [], done => (
    webpack(webpackConfig[task]).run(webpackConfig.callback(done))
  ));
  gulp.task(`watch:${task}`, [`build:${task}`], () => (
    webpack(webpackConfig[task]).watch(100, webpackConfig.callback())
  ));
});

// Aliases.
gulp.task('build', TASKS.map(t => `build:${t}`));
gulp.task('watch', TASKS.map(t => `watch:${t}`));

// Start server and watch. Restart server on rebuild.
gulp.task('start', ['watch'], () => {
  nodemon({
    execMap: {
      js: 'node',
    },
    script: 'out/server.js',
    ignore: ['*'],
    watch: ['foo/'],
    ext: 'noop',
  }).on('restart', function() {
    console.log('nodemon: Server restarted.');
  });
});

// Build a test bundle and run tests.
gulp.task('test', [], done => {
  webpack(webpackConfig.test).run(webpackConfig.callback(() => {
    const mocha = new Mocha();
    mocha.addFile('out/test.js');
    mocha.run(done);
  }));
});

// Clean.
gulp.task('clean', [], () => (
  gulp.src('out', { read: false }).pipe(clean())
));

module.exports = gulp;
