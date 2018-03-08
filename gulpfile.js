/// <vs />
var gulp = require('gulp');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
// var cleanCss = require('gulp-clean-css');


var src = {
    css: 'css',
    html: '*.html',
    js: 'js/*.js',
    scss: 'sass/**/*.scss',
};

// Static Server + watching scss/html files
gulp.task('serve', function () {
    browserSync({
        server: "./",
        port: '4001'
    });
    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.html).on('change', reload);
    gulp.watch(src.js).on('change', reload);
});

gulp.task('sass', function () {
    return gulp.src(src.scss)
        .pipe(plumber())
        .pipe(sass.sync({
        }))
        .pipe(autoprefixer({
            browsers: ['last 50 versions'],
            cascade: false
        }))
        .pipe(concat('/css-bundle.css'))
        // .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(src.css))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
