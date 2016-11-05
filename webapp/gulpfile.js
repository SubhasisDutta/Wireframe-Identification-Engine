/**
 * Created by subhasis on 11/2/16.
 */
var _ = require('lodash');
var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var gulpif = require('gulp-if');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var bowerResolve = require('bower-resolve');
var nodeResolve = require('resolve');

var production = (process.env.NODE_ENV === 'production');

var paths = {
  root: '.',
  client: './public/app',
  vendor: 'public/vendor',
  dist: './public/dist',
  clientBuild: 'public/build'
};

gulp.task('js-vendor', function () {
    // this task will go through ./bower.json and
    // uses bower-resolve to resolve its full path.
    // the full path will then be added to the bundle using require()
    var b = browserify({
        // generate source maps in non-production environment
        debug: !production
    });
    // get all bower components ids and use 'bower-resolve' to resolve
    // the ids to their full path, which we need for require()
    getBowerPackageIds().forEach(function (id) {
        var resolvedPath = bowerResolve.fastReadSync(id);
        b.require(resolvedPath, {
            // exposes the package id, so that we can require() from our code.
            // for eg: require('./vendor/angular/angular.js', {expose: 'angular'}) enables require('angular');
            // for more information: https://github.com/substack/node-browserify#brequirefile-opts
            expose: id
        });
    });

    // do the similar thing, but for npm-managed modules.
    // resolve path using 'resolve' module
    //getNPMPackageIds().forEach(function (id) {
    //    b.require(nodeResolve.sync(id), { expose: id });
    //});

    var stream = b
        .bundle()
        .on('error', function(err){
            // print the error (can replace with gulp-util)
            console.log(err.message);
            // end this stream
            this.emit('end');
        })
        .pipe(source('vendor.js'));

    //stream.pipe(streamify(ngAnnotate()));
    //stream.pipe(streamify(uglify({mangle: false})));
    stream.pipe(gulp.dest(paths.dist));
    return stream;
});

gulp.task('js-bundle', function () {

    var b = browserify(paths.client + '/app.js', {
        // generate source maps in non-production environment
        debug: !production
    });

    // mark vendor libraries defined in bower.json as an external library,
    // so that it does not get bundled with app.js.
    // instead, we will load vendor libraries from vendor.js bundle
    getBowerPackageIds().forEach(function (lib) {
        b.external(lib);
    });

    // do the similar thing, but for npm-managed modules.
    // resolve path using 'resolve' module
    //getNPMPackageIds().forEach(function (id) {
    //    b.external(id);
    //});

    var stream = b.bundle().pipe(source('bundle.js'));

    // pipe additional tasks here (for eg: minifying / uglifying, etc)
    // remember to turn off name-mangling if needed when uglifying

    stream.pipe(gulp.dest(paths.dist));

    return stream;

    // gulp.src(['public/app/module.js','public/app/modules/**/*.js','public/app/app.js'])
    //     .pipe(sourcemaps.init())
    //     .pipe(concat('bundle.js'))
    //     .pipe(ngAnnotate())
    //     .pipe(uglify())
    //     .pipe(sourcemaps.write())
    //     .pipe(gulp.dest('public/dist/.'));
});

gulp.task('build-client',['js-vendor','js-bundle']);

gulp.task('watch', ['js-bundle'], function () {
    gulp.watch('public/app/**/*.js', ['js-bundle']);
});

gulp.task('default',['build-client']);

/**
 * Helper function(s)
 */
function getBowerPackageIds() {
    // read bower.json and get dependencies' package ids
    var bowerManifest = {};
    try {
        bowerManifest = require(paths.root + '/bower.json');
    } catch (e) {
        // does not have a bower.json manifest
    }
    return _.keys(bowerManifest.dependencies) || [];
}

function getNPMPackageIds() {
    // read package.json and get dependencies' package ids
    var packageManifest = {};
    try {
        packageManifest = require(paths.root + '/package.json');
    } catch (e) {
        // does not have a package.json manifest
    }
    return _.keys(packageManifest.dependencies) || [];
}