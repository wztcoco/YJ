const Controller = require('egg').Controller;
class HomeController extends Controller {


    async buildPage() {
        const { ctx } = this;
        await ctx.render('build',{
        });
    }


}


module.exports = HomeController;