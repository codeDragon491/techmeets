var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    imageResize = require('gulp-image-resize'),
    runSequence = require('run-sequence');

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app',
            index: 'index.html'
        },
        browser: ["google chrome"]
    });
});

gulp.task('compile-sass', function () {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'));
});

gulp.task('optimize-css-js', function () {
    var cssPlugins = [
        autoprefixer({
            browsers: ['last 10 version']
        }),
        cssnano()
    ];
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.css', postcss(cssPlugins)))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'));
});

gulp.task('optimize-dist-html', function () {
    return gulp.src('dist/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('optimize-images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(imageResize({
            width: 1280,
            quality: 1,
            noProfile: true,
            crop: false,
            upscale: false
        }))
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.jpegtran({
                progressive: true,
                verbose: true
            }),
            imagemin.optipng({
                interlaced: true,
                optimizationLevel: 3
            }),
            imagemin.svgo({
                plugins: [{
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    }
                ]
            })
        ], {
            verbose: true
        }))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('build', function (callback) {
    runSequence('compile-sass', 'optimize-css-js', 'optimize-dist-html', 'optimize-images', callback);
});

gulp.task('watcher', ['browserSync'], function () {
    gulp.watch('app/sass/**/*.scss', ['compile-sass']);
    gulp.watch('app/*.html', browserSync.reload);
});