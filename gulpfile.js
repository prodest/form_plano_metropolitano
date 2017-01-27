const gulp = require( 'gulp' );
const sourcemaps = require( 'gulp-sourcemaps' );
const ts = require( 'gulp-typescript' );
const minify = require( 'gulp-minify' );
const path = require( 'path' );
const clean = require( 'gulp-clean' );
const bundle = require( 'gulp-bundle-assets' );
const gulpSystemjsBuilder = require( 'gulp-systemjs-builder' );
const Builder = require( 'systemjs-builder' );
const watch = require( 'gulp-watch');

let paths = {
    srcPath: 'src/app/',
    buildPath: 'build/src/',
    bundlePath: 'src/bundle/',
    src: [ 'src/app/**/*.ts' ],
    static: [ 'src/**/*.html', 'src/*.js', 'src/**/*.css' ],
    css: [ 'src/app/**/*.css' ],
    compiled: [ 'src/app/**/*.map', 'src/app/**/*.js', 'src/app/**/*.map' ]
};

gulp.task( 'clean', function () {
    return gulp
        .src( [ paths.buildPath, paths.bundlePath ], { read: false })
        .pipe( clean() )
});

gulp.task( 'bundle', [ 'copy:css' ], function () {
    const builder = new Builder( '.', './src/systemjs.config.js' );

    return builder.buildStatic( 'src/app', './src/bundle/main.js' )
        .then( function () {
            console.log( 'Build complete' );
        })
        .catch( function ( err ) {
            console.log( 'Build error' );
            console.log( err );
        });
    // return gulp.src( paths.srcPath )
    // .pipe( builder.bundle( '' ) )
});

gulp.task( 'watch:src', function() {
    return watch( paths.static, { ignoreInitial: false })
        .pipe(gulp.dest( paths.buildPath ));
});

gulp.task( 'build:copy-static', function () {
    return gulp.src( paths.static )
        .pipe( gulp.dest( paths.buildPath ) )
});

gulp.task( 'copy:css', [ 'clean' ], function () {
    return gulp.src( paths.css )
        .pipe( gulp.dest( paths.bundlePath ) )
});

gulp.task( 'build:bundle', [ 'build' ], function () {
    return gulp.src( './bundle.config.js' )
        .pipe( bundle() )
        .pipe( gulp.dest( paths.bundlePath ) );
});

gulp.task( 'build', [ 'clean' ], function () {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down

    return gulp.src( paths.src )
        .pipe( sourcemaps.init() )
        .pipe( ts() )
        .pipe( sourcemaps.write( '.', { includeContent: true, sourceRoot: () => path.join( __dirname, paths.srcPath ) }) )
        .pipe( gulp.dest( paths.buildPath ) );
});

gulp.task( 'build:prod', [ 'clean' ], function () {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down

    return gulp.src( paths.src )
        .pipe( ts() )
        .pipe( bundle() )
        .pipe( minify() )
        .pipe( gulp.dest( paths.buildPath ) );
});