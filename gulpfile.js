const gulp = require('gulp')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const minify = require('gulp-minify')
const cleanCSS = require('gulp-clean-css')
const cssmin = require('gulp-cssmin');

function javascript () {
    // place code for your default task here
    return gulp.src([
        'assets/js/jquery-3.2.1.slim.min.js',
        'assets/js/bootstrap.min.js',
        'assets/js/highlight.js',
        'assets/js/main.js'
    ])
        .pipe(concat('build.js'))
        .pipe(minify())
        .pipe(gulp.dest('public/js'))
}

function css () {
    return gulp.src([
        'assets/css/font.css',
        'assets/css/bootstrap.css',
        'assets/css/highlight.css',
        'assets/css/main.css'
    ])
        .pipe(concat('build.css'))
        .pipe(cleanCSS())
        .pipe(cssmin())
        .pipe(gulp.dest('public/css'))
}

exports.default = gulp.series(javascript, css)
