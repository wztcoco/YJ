const Controller = require('egg').Controller;
class HomeController extends Controller {


    async loginPage() {
        const { ctx } = this;
        await ctx.render('login',{
        });
    }


}


module.exports = HomeController;