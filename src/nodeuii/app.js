import Koa from 'koa'
import config from './config/index'
import log4js from 'log4js'
import errorHandler from './middlewares/errorHandler'
import co from 'co'
import render from 'koa-swig'
import router from 'koa-simple-router'
import controllersInit from './controllers/controllersInit'
import serve from 'koa-static'

const app = new Koa()

// 路由
controllersInit.getAllRouters(app, router)

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

// 记录错误日志
log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'dogjun.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
})
const logger = log4js.getLogger('cheese')


errorHandler.error(app,logger)

app.listen(config.port, () => {
  console.log(`Server is running at port ${config.port}`)
})

// 方便测试用
module.exports = app