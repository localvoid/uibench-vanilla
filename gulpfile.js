'use strict';

var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript');
var rollup = require('rollup');
var closureCompiler = require('google-closure-compiler').gulp();
var ghPages = require('gulp-gh-pages');

var CLOSURE_OPTS = {
  externs: 'externs/uibench.js',
  compilation_level: 'ADVANCED',
  language_in: 'ECMASCRIPT6_STRICT',
  language_out: 'ECMASCRIPT5_STRICT',
  use_types_for_optimization: true,
  assume_function_wrapper: true,
  output_wrapper: '(function(){%output%}).call();',
  summary_detail_level: 3,
  warning_level: 'QUIET'
};

gulp.task('clean', del.bind(null, ['dist', 'build']));

gulp.task('ts', function() {
  return gulp.src('web/**/*.ts')
    .pipe(ts(Object.assign(require('./tsconfig.json').compilerOptions, {
      typescript: require('typescript'),
    })))
    .pipe(gulp.dest('build/es6'));
});

gulp.task('js:bundle:innerhtml', ['ts'], function(done) {
  return rollup.rollup({
    format: 'es6',
    entry: 'build/es6/innerhtml.js',
  }).then(function(bundle) {
    return bundle.write({
      format: 'es6',
      dest: 'build/innerhtml.es6.js'
    });
  });
});

gulp.task('js:optimize:innerhtml', ['js:bundle:innerhtml'], function() {
  var opts = Object.create(CLOSURE_OPTS);
  opts['js_output_file'] = 'innerhtml.js';

  return gulp.src(['build/innerhtml.es6.js'])
      .pipe(closureCompiler(opts))
      .pipe(gulp.dest('dist'));
});

gulp.task('js', ['js:optimize:innerhtml']);

gulp.task('statics', function() {
  gulp.src(['./web/*.html'])
    .pipe(gulp.dest('dist'));
});

gulp.task('deploy', ['default'], function () {
  return gulp.src('dist/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['statics', 'js']);
