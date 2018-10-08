const gulp = require('gulp'),
      concat = require('gulp-concat'),
      browserSync = require('browser-sync').create();

browserSync.init({
  server: true
});

const buildJS = () => {
  return gulp.src('./src/*.js')
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./'));
}

const watch = () => {
  gulp.watch('./src/*.js').on('change', gulp.series(buildJS, browserSync.reload));
}

gulp.task('default', gulp.series(buildJS, watch));