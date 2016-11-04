var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

var lessOptions = {};
var autoprefixOptions = {};

gulp.task('default', () => {
    gulp.src('src/editor.less')
        .pipe(less(lessOptions))
        .pipe(autoprefixer(autoprefixOptions))
        .pipe(gulp.dest('dist/style/'));

    gulp.src('src/font/*')
        .pipe(gulp.dest('dist/style/font/'));

    gulp.src('index.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', () => {});

gulp.task('host', () => {
    var watcher = gulp.watch('src/**', ['default']);
    watcher.on('change', (event) => {
        console.log('Rebuilding...');
    });
});
