const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  output: {
    filename: "scripts/[name].[hash:5].bundle.js"
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles/[name].[hash:5].css',
      // 必须设置
      allChunks: true
    })
  ]
}