var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

var lessOptions = {};
var autoprefixOptions = {};

gulp.task('default', () => {
    gulp.src('src/style.less')
        .pipe(less(lessOptions))
        .pipe(autoprefixer(autoprefixOptions))
        .pipe(gulp.dest('dist'));

    gulp.src('src/font/*')
        .pipe(gulp.dest('dist/font/'));
});

gulp.task('host', () => {
    var watcher = gulp.watch('src/**', ['default']);
    watcher.on('change', (event) => {
        console.log('Rebuilding...');
    });
});
