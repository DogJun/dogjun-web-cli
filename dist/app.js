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

var _koaStatic = require("koa-static");

var _koaStatic2 = _interopRequireDefault(_koaStatic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  asClass,
  asValue,
  createContainer,
  Lifetime
} = require('awilix');

const {
  loadControllers,
  scopePerRequest
} = require('awilix-koa');

const app = new _koa2.default(); // 记录错误日志

_log4js2.default.configure({
  appenders: {
    cheese: {
      type: 'file',
      filename: './logs/dogjun.log'
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

_errorHandler2.default.error(app, logger); // 创建IOC容器


const container = createContainer(); // 每一个请求都是一个 new model

app.use(scopePerRequest(container)); // 装载所有的 models 并将 services 代码注入到 controllers

container.loadModules([`${__dirname}/services/*.js`], {
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: Lifetime.SCOPED
  }
}); // 注册所有的路由

app.use(loadControllers('controllers/*.js', {
  cwd: __dirname
})); // 模板

app.context.render = _co2.default.wrap((0, _koaSwig2.default)({
  // ...your setting 
  root: _index2.default.viewDir,
  autoescape: true,
  cache: 'memory',
  // disable, set to false 
  ext: 'html',
  writeBody: false
})); // 静态资源

app.use((0, _koaStatic2.default)(_index2.default.staticDir));
app.listen(_index2.default.port, () => {
  console.log(`Server is running at port ${_index2.default.port}`);
}); // 方便测试用

module.exports = app;