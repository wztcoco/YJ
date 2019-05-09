const Controller = require('egg').Controller;
class HomeController extends Controller {


    async lecturePage() {
        const { ctx } = this;
        await ctx.render('lecture',{
        });
    }


}


module.exports = HomeController;