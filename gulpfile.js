//###[ CONSTANTS ]######################################################################################################

var RUNS_IN_DOCKER = false,
    APPNAME = '',
	BUILD_DEST = './build/'+APPNAME,
	BROWSERSYNC_NOTIFICATION_CONFIG = {
		styles : [
			'display: none',
			'padding: 15px',
			'font-family: sans-serif',
			'position: fixed',
			'font-size: 1em',
			'z-index: 9999',
			'bottom: 0px',
			'right: 0px',
			'border-top-left-radius: 5px',
			'background-color: #1B2032',
			'opacity: 0.4',
			'margin: 0',
			'color: white',
			'text-align: center'
		]
	},
	BROWSERSYNC_CONFIG = {
		server : {
			baseDir : BUILD_DEST
		},
		host : '0.0.0.0',
		open : false,
		notify : BROWSERSYNC_NOTIFICATION_CONFIG,
		ghostMode : false
	};



//###[ MODULES ]########################################################################################################

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	del = require('del'),
	stripLine = require('gulp-strip-line'),
	removeEmptyLines = require('gulp-remove-empty-lines'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	requirejs = require('gulp-requirejs-optimize'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
	sequence = require('run-sequence');



//###[ TASKS ]######################################################################################################

gulp.task('clean-build', function(){
	return del.sync([BUILD_DEST+'/*'], {force : true});
});

gulp.task('clean-temp', function(){
	return del([BUILD_DEST+'/temp'], {force : true});
});



gulp.task('images', function (){
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest(BUILD_DEST+'/img'));
});

gulp.task('fonts', function (){
    return gulp.src('./src/fnt/**/*.*')
        .pipe(gulp.dest(BUILD_DEST+'/fnt'));
});

gulp.task('templates', function (){
	gulp.src('./src/tpl/index.html')
		.pipe(gulp.dest(BUILD_DEST));

    return gulp.src(['./src/tpl/**/*.*', '!./src/tpl/index.html'])
        .pipe(gulp.dest(BUILD_DEST+'/tpl'));
});



gulp.task('js-lib', function(){
	return gulp.src([
		'./node_modules/babel-polyfill/dist/polyfill.js',
		'./bower_components/lodash/lodash.js',
		'./bower_components/jquery/dist/jquery.js',
		'./bower_components/jqueryannex/src/jquery.annex.js',
		'./bower_components/what-input/dist/what-input.js',
        './bower_components/foundation-sites/dist/js/plugins/foundation.core.js',
		'./bower_components/foundation-sites/dist/js/plugins/foundation.util.mediaQuery.js',
		'./bower_components/knockout/dist/knockout.js',
		'./src/js/lib/knockout.viewmodel.js',
        './bower_components/requirejs/require.js'
	])
		.pipe(sourcemaps.init())
			.pipe(concat('lib.js'))
			.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(BUILD_DEST+'/js/lib'));
});



gulp.task('es6-to-es5', function(){
	return gulp.src([
		'./src/js/**/*.js'
	])
		.pipe(babel()).on('error', function(err){
			// log error but continue with the task flow anyway
			// keeps watchers alive!
			gutil.log(err);
			this.emit('end');
		})
		.pipe(gulp.dest(BUILD_DEST+'/temp/js'));
});

var BUNDLES = ['app', 'page'],
	BUNDLE_TASKS = [],
	fCreateBundleTask = function(srcList, buildName, buildPath){
		return function(){
			return gulp.src(srcList)
			.pipe(sourcemaps.init())
				.pipe(requirejs({
					optimize : 'uglify2'
				})).on('error', function(err){
					// log error but continue with the task flow anyway
					// keeps watchers alive!
					gutil.log(err);
					this.emit('end');
				})
				.pipe(stripLine(['sourceMappingURL='+buildName+'-bundle.build.js.map']))
				.pipe(rename(buildName+'.js'))
			.pipe(sourcemaps.write('./'))
			.pipe(removeEmptyLines())
			.pipe(gulp.dest(buildPath));
		};
	};

for( var i = 0; i < BUNDLES.length; i++ ){
	BUNDLE_TASKS.push('requirejs-optimize-'+BUNDLES[i]);

	gulp.task('requirejs-optimize-'+BUNDLES[i], fCreateBundleTask(
		[BUILD_DEST+'/temp/js/'+BUNDLES[i]+'-bundle.js'],
		BUNDLES[i],
		BUILD_DEST+'/js/bundles'
	));
}

gulp.task('js', ['es6-to-es5'], function(){
	return sequence(BUNDLE_TASKS);
});

gulp.task('js-refresh', ['es6-to-es5'], function(){
	return sequence(BUNDLE_TASKS.concat(['clean-temp']));
});



gulp.task('sass', function(){
	return gulp.src([
		'./src/sass/main.scss'
	])
		.pipe(sourcemaps.init())
			.pipe(sass({
				outputStyle: 'compressed',
				includePaths: ['./bower_components/foundation-sites/scss']
			}).on('error', function(err){
				// log error but continue with the task flow anyway
				// keeps watchers alive!
				gutil.log(err);
				this.emit('end');
			}))
			.pipe(autoprefixer({browsers : ['last 2 versions', 'IE >= 10']}))
			.pipe(rename('main.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(BUILD_DEST+'/css'));
});



gulp.task('watch', function(){
	var pollConfig = RUNS_IN_DOCKER ? {usePolling: true, interval: 1000, awaitWriteFinish : true} : {};

	watch('./src/js/**/*.js', pollConfig, function(){ sequence('js-refresh', function(){ reload('*.js'); }); });
	watch(['./src/sass/**/*.sass', './src/sass/**/*.scss'], pollConfig, function(){ sequence('sass', function(){ reload('*.css'); }); });
    watch('./src/tpl/**/*.*', pollConfig, function(){ sequence('templates', function(){ reload(); }); });
    watch('./src/img/**/*.*', pollConfig, function(){ sequence('images', function(){ reload(); }); });
});



gulp.task('server', function(){
	return browserSync.init(BROWSERSYNC_CONFIG);
});

gulp.task('autoreload', function(){
	delete BROWSERSYNC_CONFIG.server;
	BROWSERSYNC_CONFIG.proxy = '0.0.0.0:8000';

	return browserSync.init(BROWSERSYNC_CONFIG);
});



gulp.task('build', ['clean-build'], function(){
	return sequence(
        ['images', 'fonts', 'templates', 'js-lib', 'sass'],
        'js-refresh'
    );
});



gulp.task('serve', function(){
	return sequence('build', 'server', 'watch');
});

gulp.task('buildandautoreload', function(){
	return sequence('build', 'autoreload', 'watch');
});

gulp.task('default', function(){
	return sequence('buildandautoreload');
});
