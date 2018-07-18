import _ from 'lodash'
import path from 'path'

let config = {
  "env": process.env.NODE_ENV || 'development', // "development" "production"
  "viewDir": path.join(__dirname, '..', 'views'),
  "staticDir": path.join(__dirname, '..', 'assets'),
  "port": 8080
}

const init = (app) => {
  // 开发环境
  if (process.env.NODE_ENV === 'development') {
    const devConfig = {
      // port: '8080'
    }
    config = _.extend(config, devConfig)
    const webpack = require('webpack')
    const devMiddleware = require('webpack-dev-middleware')
    const hotMiddleware = require('webpack-hot-middleware')
    const devWebpackConfig = require('../../webpack.config.js')
    const koa2Connect = require('koa2-connect')
    // 本地的开发环境默认就是使用 development mode
    devWebpackConfig.mode = 'development'
    const compiler = webpack(devWebpackConfig)
    const expressDevMiddleware = devMiddleware(compiler, {
      publicPath: devWebpackConfig.output.publicPath,
      quiet: true //向控制台显示任何内容 
    })
    const expressHotMiddleware = hotMiddleware(compiler,{
      log: false,
      path: "/__webpack_hmr",
      overlay:true,
      heartbeat: 2000,
    })
    // convert to koaMiddleware!
    app.use(koa2Connect(expressDevMiddleware));
    app.use(koa2Connect(expressHotMiddleware));
  }
  // 生产环境
  if (process.env.NODE_ENV === 'production') {
    const prodConfig = {
      port: '8081'
    }
    config = _.extend(config, prodConfig)
  }
  return config
}

export default app => init(app)