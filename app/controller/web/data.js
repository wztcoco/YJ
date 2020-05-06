const Controller = require('egg').Controller;
class HomeController extends Controller {


    async dataPage() {
        const { ctx } = this;
        await ctx.render('data',{
        });
    }


}


module.exports = HomeController;