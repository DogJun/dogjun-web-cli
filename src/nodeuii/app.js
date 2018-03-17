import Koa from 'koa'
import config from './config/index'
import log4js from 'log4js'
import errorHandler from './middlewares/errorHandler'

const app = new Koa()

log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'dogjun.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese')

// 记录错误日志
errorHandler.error(app,logger)

app.listen(config.port, () => {
  console.log(`Server is running at port ${config.port}`)
})