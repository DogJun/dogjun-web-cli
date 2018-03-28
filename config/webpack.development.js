const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles/[name].css',
      // 必须设置
      allChunks: true
    })
  ]
}