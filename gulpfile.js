const gulp = require('gulp')
const path = require('path')
const { compile_typescript } = require('./gulp/task/compile_typescript')
const { browserify_javascript } = require('./gulp/task/browserify_javascript')
const { clean_all } = require('./gulp/task/clean_all')
const { gen_demo } = require('./gulp/task/gen_demo')
const { demo_dir } = require('./gulp/conf')
gulp.task('compile_typescript', compile_typescript)
gulp.task('browserify_javascript', browserify_javascript)
gulp.task('clean_all', clean_all)
gulp.task('gen_demo', gen_demo)

const connect = require('gulp-connect');
gulp.task('start_dev_server', async () => {
  connect.server({ root: demo_dir, livereload: true, port: 10123 });
})
gulp.task('reload_web', async () => {
  gulp.src(path.join(demo_dir, '**/*.*')).pipe(connect.reload())
})

gulp.watch('./src/**/*.*', gulp.series('compile_typescript', 'browserify_javascript', 'reload_web'))
gulp.watch('./public/**/*.*', gulp.series('gen_demo', 'reload_web'))
exports.default = gulp.series(
  'clean_all',
  'compile_typescript',
  'browserify_javascript',
  'gen_demo',
  'start_dev_server'
);

