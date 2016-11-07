var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var path = require('path');
var postcss = require('gulp-postcss');
var themeBuilder = require('./build/theme-builder');
var gap = require('gulp-append-prepend');
var stupidServer = require('stupid-server');

var lessOptions = {};
var autoprefixOptions = {};

gulp.task('theme-gen', () => {
    let stylePath = path.join(__dirname, 'node_modules/highlight.js/styles/');
    gulp.src([path.join(stylePath, '*.css'), '!' + path.join(stylePath, 'darkula.css')])
        .pipe(postcss([themeBuilder]))
        .pipe(gap.appendText(';\n'))
        .pipe(gap.appendFile('src/themes/template.less'))
        .pipe(less(lessOptions))
        .pipe(gulp.dest('dist/themes/'));
});

gulp.task('copy-font', () => {
    gulp.src('src/font/*')
        .pipe(gulp.dest('dist/style/font/'));
});

gulp.task('copy-demo', () => {
    gulp.src('index.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('main-css', () => {
    gulp.src('src/main.less')
        .pipe(less(lessOptions))
        .pipe(autoprefixer(autoprefixOptions))
        .pipe(rename('editor.css'))
        .pipe(gulp.dest('dist/style'));
});

gulp.task('default', ['main-css', 'copy-demo', 'copy-font', 'theme-gen']);

gulp.task('host', () => {
    stupidServer({path: path.join(__dirname, 'dist')}, () => {
        var watcher = gulp.watch(['src/**', 'index.html'], ['default']);
        watcher.on('change', (event) => {
            console.log('Rebuilding...');
        });
    });
});
