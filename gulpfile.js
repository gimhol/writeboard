const gulp = require('gulp')
const child_process = require('child_process')
const taskNames = {
  tsc: 'tsc',
  tsc_demo: 'tsc_demo',
  browserify: 'browserify',
  copy_public: 'copy_public',
}
gulp.task(taskNames.tsc, (done) => {
  const childProcess = child_process.exec('npm run tsc');
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
  childProcess.on('exit', done);
})
gulp.task(taskNames.tsc_demo, (done) => {
  const childProcess = child_process.exec('npm run tsc-demo');
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
  childProcess.on('exit', done);
})
gulp.task(taskNames.browserify, (done) => {
  const childProcess = child_process.exec('npm run browserify');
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
  childProcess.on('exit', done)
})
gulp.task(taskNames.copy_public, () => {
  return gulp.src('./example/public/**/*').pipe(gulp.dest('output'))
})
exports.default = function () {
  gulp.watch('./example/src/**/*.ts', gulp.series(taskNames.tsc_demo, taskNames.browserify));
  gulp.watch('./example/public/**/*.*', gulp.series(taskNames.copy_public));
  gulp.watch('./src/**/*.ts', gulp.series(taskNames.tsc, taskNames.browserify));
  gulp.series(taskNames.tsc, taskNames.tsc_demo, taskNames.browserify, taskNames.copy_public)()
}