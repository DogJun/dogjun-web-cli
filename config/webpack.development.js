const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require("path")
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  plugins: [
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../' , '/src/webapp/views/common/'),
      to: '../views/common'
    }]),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../', '/src/webapp/widgets/'),
      to: '../widgets'
    }], {
      copyUnmodified: true,
      ignore: ['*.js', '*.css']
    }),
    new ExtractTextPlugin({
      filename: 'styles/[name].css',
      // 必须设置
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}