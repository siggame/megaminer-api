/**
 * Commands:
 * - gulp clean: delete compiled code
 * - gulp compile: compile code in preparation for deployment
 * - gulp server: compile and run a new application server
 * - gulp watch: compile code and start the node process while watching for code changes so it can re-compile as needed
 * - gulp: compile code in preparation for deployment
 */

const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');
const clean = require('gulp-clean');

const spawn = require('child_process').spawn;
const tsProject = ts.createProject('tsconfig.json');

// Variable to store the node process between gulp server runs
let node;

/**
 * Delete all files and folders in the release folder.
 */
function cleanTask() {
  return gulp.src('release', { read: false, allowEmpty: true })
    .pipe(clean());
}

/**
 * Compile TypeScript source code using type declarations.
 */
function compileTask() {
  const tsResult = gulp.src([
    "./src/**/*.ts", // source TypeScript files
    "./types/**/*.d.ts", // custom TypeScript type declarations
    "./node_modules/@types/**/*.d.ts" // type declarations from node modules
  ]).pipe(tsProject());

  // Merge output streams if necessary
  return merge([
    tsResult.js.pipe(gulp.dest('./release'))
  ]);
}

/**
 * Try to run the application server.
 * @param {function} callback - run when done
 */
function serverTask(callback) {
  // Kill the previously running server, if there is one
  if (node) {
    node.kill();
  }

  // Spawn a new node ChildProcess running the release server
  node = spawn('node', ['release/server.js'], { stdio: 'inherit' });

  // Log errors on close
  node.on('close', (statusCode) => {
    if (statusCode === 8) {
      gulp.log("Error detected, waiting for changes...");
    }
  });

  // Signal that we are done with this task
  // This is necessary because we don't return anything
  callback();
}

/**
 * Re-run gulp server when changes in source code are detected.
 */
function watchTask() {
  gulp.watch('./src/**/*.ts', gulp.series('server'));
}

/* Export functions for gulp to run as tasks. */

// gulp clean
exports.clean = cleanTask;

// gulp compile
exports.compile = gulp.series(exports.clean, compileTask);

// gulp server
exports.server = gulp.series(exports.compile, serverTask);

// gulp watch
exports.watch = gulp.series(exports.server, watchTask);

// gulp
exports.default = exports.compile;