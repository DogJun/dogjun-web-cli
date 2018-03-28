// class indexController{
//   constructor () {}
//   indexAction() {
//     return async (ctx, next) => {
//       const indexModelIns = new IndexModel()
//       const result = await indexModelIns.getData()
//       ctx.body = await ctx.render('index', {data: result})
//     }
//   }
//   testAction () {
//     return async (ctx, next) => {
//       ctx.body = {
//         data: 'hello test'
//       }
//     } 
//   }
// }

// export default indexController
import {route, GET, POST, before} from 'awilix-koa'

@route('/user')
export default class UserController {
  constructor ({userService}) {
    this.userService = userService
  }
  @route('/:id')
  @GET()
  async getUser (ctx, next) {
    const result = await this.userService.getData(ctx.params.id)
    ctx.body = await ctx.render('user/pages/index', {data: result})
  }
}