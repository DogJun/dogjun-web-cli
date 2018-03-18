const gulp = require('gulp')
const babel = require('gulp-babel')
const watch = require('gulp-watch')
const rollup = require('gulp-rollup')
const replace = require("rollup-plugin-replace")

// 开发环境
gulp.task('builddev', () => {
  return watch('./src/nodeuii/**/*.js', {ignoreInitial: false}, () => {
    gulp.src('./src/nodeuii/**/*.js')
      .pipe(babel({
        babelrc: false, // 不让外部的babelrc影响到内部
        "plugins": ["transform-es2015-modules-commonjs"] // 只编译import
      }))
      .pipe(gulp.dest('./build'))
  })
})

// 生产环境
gulp.task('buildprod', () => {
  gulp.src('./src/nodeuii/**/*.js')
    .pipe(babel({
      babelrc: false, // 不让外部的babelrc影响到内部
      // ignore: ['./src/nodeuii/config/index.js'],
      "plugins": ["transform-es2015-modules-commonjs"] // 只编译import
    }))
    .pipe(rollup({
      output:{
        format: "cjs",
      },
      input: './src/nodeuii/config/index.js',
      plugins: [
        replace({
          "process.env.NODE_ENV": JSON.stringify('production')
        })
      ]
    }))
    .pipe(gulp.dest('./build'))
})


let _task = ['builddev']
// 生产环境
if (process.env.NODE_ENV === 'production') {
  _task = ['buildprod']
}

gulp.task('default', _task)