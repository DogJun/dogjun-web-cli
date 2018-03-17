"use strict";

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _index = require("./config/index");

var _index2 = _interopRequireDefault(_index);

var _log4js = require("log4js");

var _log4js2 = _interopRequireDefault(_log4js);

var _errorHandler = require("./middlewares/errorHandler");

var _errorHandler2 = _interopRequireDefault(_errorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default();

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

const logger = _log4js2.default.getLogger('cheese'); // 记录错误日志


_errorHandler2.default.error(app, logger);

app.listen(_index2.default.port, () => {
  console.log(`Server is running at port ${_index2.default.port}`);
});