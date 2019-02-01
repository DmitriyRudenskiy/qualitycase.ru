const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const paths = {
    dest: './public',
    src: './assets'
};

console.log(paths.dest + '/css');

gulp.task('css', function () {
    return gulp.src(paths.src + '/css/*.css')
        .pipe($.csslint())
        //.pipe($.csslint.formatter())
        .pipe($.stripCssComments())
        //.pipe($.autoprefixer())
        .pipe($.concat('style.css'))
        .pipe($.cssnano())
        .pipe(gulp.dest(paths.dest + '/css'));
});