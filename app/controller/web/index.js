const Controller = require('egg').Controller;
class HomeController extends Controller {


    async indexPage() {
        const { ctx } = this;
        await ctx.render('home',{
        });
    }


}


module.exports = HomeController;