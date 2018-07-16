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
    const webpack = require('webpack');
    // const devWebpackConfig = require('../../webpack.config.js');
    // const compile = webpack(devWebpackConfig);
    // const middleware = require('webpack-dev-middleware');
    // app.use(middleware({
    //   // options
    // }));
    const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
    const devWebpackConfig = require('../../webpack.config.js');
    // 本地的开发环境默认就是使用 development mode
    devWebpackConfig.mode = 'development'
    const compile = webpack(devWebpackConfig)
    app.use(devMiddleware(compile, {
      // display no info to console (only warnings and errors) 
      noInfo: false,
      // display nothing to the console 
      quiet: false,
      // switch into lazy mode 
      // that means no watching, but recompilation on every request 
      lazy: false,
      // watch options (only lazy: false) 
      watchOptions: {
          aggregateTimeout: 300,
          poll: true
      },
      // public path to bind the middleware to 
      // use the same as in webpack 
      publicPath: "/",
      // custom headers 
      headers: {
          "Access-Control-Allow-Origin": "*"
      },
      // options for formating the statistics 
      stats: {
          colors: true
      }
    }))
    app.use(hotMiddleware(compile, {
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000
    }))
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