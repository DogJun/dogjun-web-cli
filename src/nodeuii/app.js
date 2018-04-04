import Koa from 'koa'
import config from './config/index'
import log4js from 'log4js'
import errorHandler from './middlewares/errorHandler'
import co from 'co'
import render from 'koa-swig'
import serve from 'koa-static'
import webpack from 'webpack'
import webpackDevMiddleware from 'koa-webpack-dev-middleware'
import webpackHotMiddleware from 'koa-webpack-hot-middleware'
// const webpackConfig = require('../webpack.config')
const { asClass, asValue, createContainer, Lifetime} = require('awilix')
const { loadControllers, scopePerRequest } = require('awilix-koa')

const app = new Koa()
const compiler = webpack(webpackConfig)
// app.use(webpackDevMiddleware(compiler, {
//   noInfo: true,
//   watchOptions: {
//     ignored: /node_modules/,
//   },
//   reload: true,
//   publicPath: config.viewDir,
//   stats: {
//     colors: true
//   }
// }))
// app.use(webpackHotMiddleware(compiler))
// 记录错误日志
log4js.configure({
  appenders: { cheese: { type: 'file', filename: './logs/dogjun.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
})
const logger = log4js.getLogger('cheese')
errorHandler.error(app,logger)

// 创建IOC容器
const container = createContainer()
// 每一个请求都是一个 new model
app.use(scopePerRequest(container))
// 装载所有的 models 并将 services 代码注入到 controllers
container.loadModules([`${__dirname}/services/*.js`], {
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: Lifetime.SCOPED
  }
})
// 注册所有的路由
app.use(loadControllers('controllers/*.js', {cwd: __dirname}))

// 模板
app.context.render = co.wrap(render({
  // ...your setting 
  root: config.viewDir,
  autoescape: true,
  cache: 'memory', // disable, set to false 
  ext: 'html',
  writeBody: false
}));

// 静态资源
app.use(serve(config.staticDir))

app.listen(config.port, () => {
  console.log(`Server is running at port ${config.port}`)
})

// 方便测试用
module.exports = app