const webpack = require('webpack')
const argv = require('yargs-parser')(process.argv.slice(2))
const merge = require('webpack-merge')
const glob = require('glob')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const htmlAfterWebpackPlugin = require('./config/htmlAfterWebpackPlugin.js')
const { join,resolve } = require('path')
const files = glob.sync('./src/webapp/views/**/*.entry.js')
const _mode = argv.mode
const _modeflag = _mode === 'production' ? true : false
const _mergeConfig = require(`./config/webpack.${argv.mode}.js`)
// const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
// console.log('得到的参数:', argv.mode)
// console.log('entry:', files)

// 入口配置
let _entry = {}
// htmlWebpackPlugin数组
let _plugins = []
// 生成入口配置和htmlWebpackPlugin数组
for (let item of files) {
  if (/.+\/([a-zA-Z]+-[a-zA-Z]+)(\.entry\.js$)/g.test(item) === true) {
    const entrykey = RegExp.$1
    _entry[entrykey] = item
    const [dist, template] = entrykey.split('-')
    _plugins.push(new HtmlWebpackPlugin({
      filename: `../views/${dist}/pages/${template}.html`,
      template: `src/webapp/views/${dist}/pages/${template}.html`,
      chunks: ['runtime', 'common', entrykey],
      minify: {
        collapseWhitespace: _modeflag,
        removeAttributeQutoes: _modeflag
      },
      inject: false
    }))
  }
}

// 默认配置
let defaultConfig = {
  entry: _entry,
  output: {
    path: join(__dirname, './dist/assets'),
    publicPath: '/',
    filename: 'scripts/[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.(png|jpg|gif|eot|woff|woff2|ttf|svg|otf)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: _mode == "production" ? "images/[name].[hash:5].[ext]" : "images/[name].[ext]"
        }
      }]
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimize: _modeflag
            }
          },
          'postcss-loader'
        ]
      })
    }]
  },
  optimization: {
    // 原 CommonsChunkPlugin 配置
    splitChunks: {
      cacheGroups: {
        common: {
          chunks: 'all',
          name: 'common',
          minChunks: 2
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  plugins: [
    ..._plugins,
    new htmlAfterWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    modules: [
      resolve(__dirname, 'node_modules'), // 使用绝对路径指定 node_modules，不做过多查询
    ],
    // 删除不必要的后缀自动补全，少了文件后缀的自动匹配，即减少了文件路径查询的工作
    extensions: [".js", ".css"]
  }
}

module.exports = merge(defaultConfig, _mergeConfig)