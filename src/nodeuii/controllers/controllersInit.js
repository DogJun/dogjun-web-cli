import indexController from './indexController'
const controllersInit = {
  getAllRouters (app, router) {
    app.use(router(_ => {
      _.get('/index', indexController.indexAction())
      _.get('/index/test', indexController.testAction())
    }))
  }
}

export default controllersInit