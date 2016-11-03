/**
 * Created by subhasis on 11/2/16.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('js-vendor', function () {
    gulp.src(['public/vendor/jquery/dist/jquery.min.js',
        'public/vendor/bootstrap/dist/js/bootstrap.js',
        'public/vendor/toastr/toastr.js',
        'public/vendor/angular/angular.js',
        'public/vendor/angular-animate/angular-animate.js',
        'public/vendor/angular-aria/angular-aria.js',
        'public/vendor/angular-material/angular-material.js',
        'public/vendor/angular-messages/angular-messages.js',
        'public/vendor/angular-material-icons/angular-material-icons.js',
        'public/vendor/angular-resource/angular-resource.js',
        'public/vendor/angular-route/angular-route.js',
        'public/vendor/ng-file-upload/ng-file-upload-shim.min.js',
        'public/vendor/ng-file-upload/ng-file-upload.min.js'])
        .pipe(concat('vendor.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('public/dist/.'));
});

gulp.task('js-bundle', function () {
    gulp.src(['public/app/modules/**/*.js','public/app/app.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/dist/.'));
});

gulp.task('build-client',['js-vendor','js-bundle']);

gulp.task('watch', ['build-client'], function () {
    gulp.watch('public/app/**/*.js', ['build-client']);
});