const gulp = require('gulp')
const babel = require('gulp-babel')
const watch = require('gulp-watch')
const rollup = require('gulp-rollup')
const replace = require("rollup-plugin-replace")
const gulpSequence = require('gulp-sequence')

// 开发环境
gulp.task('builddev', () => {
  return watch('./src/nodeuii/**/*.js', {
    ignoreInitial: false
  }, () => {
    gulp.src('./src/nodeuii/**/*.js')
      .pipe(babel({
        // 不让外部的babelrc影响到内部
        babelrc: false,
        "plugins": [
          // 只编译import
          "transform-es2015-modules-commonjs",
          // 装饰器
          ["@babel/plugin-proposal-decorators", { "legacy": true }]
        ]
      }))
      .pipe(gulp.dest('dist'))
  })
})

// 生产环境
gulp.task('buildprod', () => {
  gulp.src('./src/nodeuii/**/*.js')
  .pipe(babel({
    babelrc: false,
      "plugins": [
        "transform-es2015-modules-commonjs",
        "@babel/plugin-proposal-decorators"
      ]
    }))
    .pipe(gulp.dest('dist'))
})
// 配置文件 tree-shaking
gulp.task('buildconfig', () => {
  gulp.src('./src/nodeuii/pm2.json')
    .pipe(gulp.dest('dist'))
  gulp.src('./src/nodeuii/**/*.js')
    .pipe(rollup({
      output: {
        format: "cjs"
      },
      input: './src/nodeuii/config/index.js',
      plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify('production')
        })
      ]
    }))
    .pipe(gulp.dest('dist'))
})

let _task = ['builddev']
// 上线阶段 hint 编译 清洗&拷贝热启动文件
if (process.env.NODE_ENV === 'production') {
  _task = gulpSequence(['buildprod', 'buildconfig'])
}

gulp.task('default', _task)