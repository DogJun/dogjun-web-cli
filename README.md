# 项目目录结构
```
.
├── README.md
├── config // webpack配置
│   ├── htmlAfterWebpackPlugin.js 
│   ├── webpack.development.js
│   └── webpack.production.js
├── docs // 生成文档
│   ├── jsdocs
│   └── service-reporter
├── gulpfile.js // gulp脚本 
├── logs // 日志
│   └── dogjun.log
├── package-lock.json
├── package.json
├── postcss.config.js // postcss配置
├── src // 源码
│   ├── nodeuii // node端
│   │   ├── app.js // node入口文件
│   │   ├── config // node配置
│   │   │   └── index.js
│   │   ├── controllers // 路由
│   │   │   ├── HelloController.js
│   │   │   └── UserController.js
│   │   ├── middlewares // 中间件
│   │   │   └── errorHandler.js
│   │   └── services // 服务
│   │       ├── HelloService.js
│   │       └── UserService.js
│   └── webapp // 前端
│       ├── views // 模板
│       │   ├── common
│       │   ├── hello
│       │   └── user
│       └── widgets // 组件
│           ├── footer
│           └── topbanner
├── tests // 测试
│   ├── mochaRunner.js
│   └── service
│       └── router.spec.js
└── webpack.config.js // webpack配置
```
