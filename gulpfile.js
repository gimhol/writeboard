import gulp from "gulp";
import connect from "gulp-connect";
import child_process from "child_process";

const taskNames = {
  tsc: 'tsc',
  tsc_demo: 'tsc_demo',
  browserify: 'browserify',
  copy_public: 'copy_public',
  start_server: 'start_server',
  reload_web: 'reload_web'
}

gulp.task(taskNames.start_server, function (done) {
  connect.server({
    root: "output",
    port: 5000,
    livereload: true
  }, done)
})

gulp.task(taskNames.reload_web, function () {
  gulp.src("./output/**/*.*").pipe(connect.reload())
})

gulp.task(taskNames.tsc, (done) => {
  const childProcess = child_process.exec('npm run rollup:cjs');
  childProcess.stdout?.pipe(process.stdout);
  childProcess.stderr?.pipe(process.stderr);
  childProcess.on('exit', done);
})
gulp.task(taskNames.tsc_demo, (done) => {
  const childProcess = child_process.exec('npm run tsc-demo');
  childProcess.stdout?.pipe(process.stdout);
  childProcess.stderr?.pipe(process.stderr);
  childProcess.on('exit', done);
})
gulp.task(taskNames.browserify, (done) => {
  const childProcess = child_process.exec('npm run browserify');
  childProcess.stdout?.pipe(process.stdout);
  childProcess.stderr?.pipe(process.stderr);
  childProcess.on('exit', done)
})
gulp.task(taskNames.copy_public, () => {
  return gulp.src('./demo/public/**/*').pipe(gulp.dest('output'))
})
export default function (done) {
  gulp.watch('./demo/src/**/*.ts', gulp.series(taskNames.tsc_demo, taskNames.browserify));
  gulp.watch('./demo/public/**/*.*', gulp.series(taskNames.copy_public));
  gulp.watch('./src/**/*.ts', gulp.series(taskNames.tsc, taskNames.browserify));
  gulp.watch('./output/**/*.*', gulp.series(taskNames.reload_web));

  gulp.series(
    taskNames.tsc,
    taskNames.tsc_demo,
    taskNames.browserify,
    taskNames.copy_public,
    taskNames.start_server
  )(done)
}