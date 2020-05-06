const Controller = require('egg').Controller;
class HomeController extends Controller {


    async userPage() {
        const { ctx } = this;
        await ctx.render('user',{
        });
    }


}


module.exports = HomeController;