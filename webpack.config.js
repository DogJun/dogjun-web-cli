const argv = require('yargs-parser')(process.argv.slice(2))
const merge = require('webpack-merge')
const glob = require('glob')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const htmlAfterWebpackPlugin = require('./config/htmlAfterWebpackPlugin.js')
// const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {join} = require('path')
const files = glob.sync('./src/webapp/views/**/*.entry.js')
const _mergeConfig = require(`./config/webpack.${argv.mode}.js`)
// console.log('得到的参数:', argv.mode)
// console.log('entry:', files)

// 入口配置
let _entry = {}
// htmlWebpackPlugin需要的chunks数组
let _templateArr = []
// 插件配置
let configPlugins = [
  // new MiniCssExtractPlugin({
  //   // Options similar to the same options in webpackOptions.output
  //   // both options are optional
  //   filename: "styles/[name].css"
  //   // chunkFilename: "[id].css"
  // })
  new CopyWebpackPlugin([{
    from: 'src/webapp/views/common',
    to: '../views/common'
  }]),
  new htmlAfterWebpackPlugin()
]
// 生成入口配置和chunks数组
for (let item of files) {
  item.replace(/.+\/([a-zA-Z]+)-([a-zA-Z]+)(\.entry\.js$)/g, (match, $1) => {
    _entry[$1] = item
    _templateArr.push($1)
  })
}
// console.log(_templateArr)
// 遍历生成htmlWebpackPlugin
_templateArr.forEach((item) => {
  const htmlPlugin = new HtmlWebpackPlugin({  
    filename: `../views/${item}/pages/index.html`,
    template: `src/webapp/views/${item}/pages/index.html`,
    inject: false,
    chunks: [item]
  })
  configPlugins.unshift(htmlPlugin)
})

// 默认配置
let defaultConfig = {
  entry: _entry,
  output: {
    path: join(__dirname, './dist/assets'),
    publicPath: '/',
    filename: 'scripts/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        // use: [
        //   MiniCssExtractPlugin.loader,
        //   "css-loader"
        // ]
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
            loader: "postcss-loader"
          }]
        })
      }
    ]
  },
  plugins: configPlugins
}

module.exports = merge(defaultConfig, _mergeConfig)