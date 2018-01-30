var gulp = require('gulp');
var css2Style = require('./index.js');

gulp.task('cssLink2Style', function() {
    gulp.src('test/*.mustache').
    pipe(css2Style()).
    pipe(gulp.dest('dist'));
})