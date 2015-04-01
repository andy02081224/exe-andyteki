var gulp = require('gulp'),
    path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    livereload = require('gulp-livereload'),
    server = require('gulp-develop-server'),
    autoprefixer = require('gulp-autoprefixer'),
    inject = require('gulp-inject'),
    filter = require('gulp-filter'),
    bowerFiles = require('main-bower-files'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    wiredep = require('wiredep').stream;

gulp.task('connect', function() {
  server.listen( {path: 'app.js'}, livereload.listen);
});

gulp.task('watch', function() {
  // Watch server, config, route and model changes
  gulp.watch(['app.js', 'config/*', 'app/controllers/**/*', 'app/models/**/*'], function(file) {
    server.restart(function(err) {
      if (!err) livereload.changed(file.path);
    });
  });

  // Watch static file changes
  var staticFiles = gulp.watch(['public/css/**/*.css', 'public/js/**/*.js', 'app/views/**/*.handlebars']);
  staticFiles.on('change', function(file) {
    livereload.changed(file.path);
  });
});

gulp.task('autoprefixer', function() {
  return gulp.src('public/css/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/css/'));
});


gulp.task('buildCSS', function() {
  var cssFilter = filter('**/*.css');

  return gulp.src(['public/components/normalize.css/normalize.css', '/components/jquery-ui/themes/ui-lightness/jquery-ui.min.css'].concat('public/css/**/*.css'))
    .pipe(cssFilter)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('public/css/'));
})

gulp.task('buildVendor', function() {
  // var jsFilter = filter('**/*js');

  return gulp.src(['public/components/jquery/dist/jquery.min.js', 'public/components/jquery-ui/jquery-ui.min.js'])
    .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('public/js/'));
});

gulp.task('buildScript', function() {
  return gulp.src(['public/js/**/*.js', '!public/js/**/*.min.js'])
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('public/js/'));
});

gulp.task('injectMain', function() {
  var sources = gulp.src(['public/css/**/*.min.css', 'public/js/vendor.min.js', 'public/js/main.min.js']);

  gulp.src('app/views/layouts/*.handlebars')
    .pipe(inject(sources, {
      ignorePath: 'public'
    }))
    .pipe(gulp.dest('app/views/layouts/'))
});

gulp.task('buildImage', function() {
  gulp.src('public/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/img/'));
});

gulp.task('wiredep', function() {
  gulp.src('app/views/layouts/main.handlebars')
    .pipe(wiredep({
      ignorePath: /(.*?public)/
    }))
    .pipe(gulp.dest('app/views/layouts/'));
});

gulp.task('build', ['buildCSS', 'buildVendor', 'buildScript', 'injectMain', 'buildImage'], function() {
  console.log('App builds successfully');
});

gulp.task('default', [
  'connect', 'watch'
]);
