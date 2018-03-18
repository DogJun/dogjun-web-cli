"use strict";

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _index = require("./config/index");

var _index2 = _interopRequireDefault(_index);

var _log4js = require("log4js");

var _log4js2 = _interopRequireDefault(_log4js);

var _errorHandler = require("./middlewares/errorHandler");

var _errorHandler2 = _interopRequireDefault(_errorHandler);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _koaSwig = require("koa-swig");

var _koaSwig2 = _interopRequireDefault(_koaSwig);

var _koaSimpleRouter = require("koa-simple-router");

var _koaSimpleRouter2 = _interopRequireDefault(_koaSimpleRouter);

var _controllersInit = require("./controllers/controllersInit");

var _controllersInit2 = _interopRequireDefault(_controllersInit);

var _koaStatic = require("koa-static");

var _koaStatic2 = _interopRequireDefault(_koaStatic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default(); // 路由

_controllersInit2.default.getAllRouters(app, _koaSimpleRouter2.default); // 模板


app.context.render = _co2.default.wrap((0, _koaSwig2.default)({
  // ...your setting 
  root: _index2.default.viewDir,
  autoescape: true,
  cache: 'memory',
  // disable, set to false 
  ext: 'html',
  writeBody: false
})); // 静态资源

app.use((0, _koaStatic2.default)(_index2.default.staticDir)); // 记录错误日志

_log4js2.default.configure({
  appenders: {
    cheese: {
      type: 'file',
      filename: 'dogjun.log'
    }
  },
  categories: {
    default: {
      appenders: ['cheese'],
      level: 'error'
    }
  }
});

const logger = _log4js2.default.getLogger('cheese');

_errorHandler2.default.error(app, logger);

app.listen(_index2.default.port, () => {
  console.log(`Server is running at port ${_index2.default.port}`);
}); // 方便测试用

module.exports = app;