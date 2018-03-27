const argv = require('yargs-parser')(process.argv.slice(2))
const merge = require('webpack-merge')
const glob = require('glob')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {join} = require('path')
const files = glob.sync('./src/webapp/views/**/*.entry.js')
const _mergeConfig = require(`./config/webpack.${argv.mode}.js`)
console.log('得到的参数:', argv.mode)
console.log('entry:', files)

// 拼接多入口
let _entry = {}
for (let item of files) {
  item.replace(/.+\/([a-zA-Z]+-[a-zA-Z]+)(\.entry\.js$)/g, (match, $1) => {
    _entry[$1] = item
  })
}
console.log(_entry)
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
  plugins: [
    // new MiniCssExtractPlugin({
    //   // Options similar to the same options in webpackOptions.output
    //   // both options are optional
    //   filename: "styles/[name].css"
    //   // chunkFilename: "[id].css"
    // })
    new CopyWebpackPlugin([{
      from: 'src/webapp/views/common',
      to: '../views/common'
    }, {
      from: 'src/webapp/widgets',
      to: '../widgets'
    }]),
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: '../views/hello/pages/index.html',
      template: 'src/webapp/views/hello/pages/index.html',
      inject: false
    }),
    new ExtractTextPlugin({
      filename: 'styles/[name].css',
      // 必须设置
      allChunks: true
    })
  ]
}

module.exports = merge(defaultConfig, _mergeConfig)