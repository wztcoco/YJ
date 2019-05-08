const Controller = require('egg').Controller;
class HomeController extends Controller {


    async chairPage() {
        const { ctx } = this;
        await ctx.render('chair',{
        });
    }


}


module.exports = HomeController;