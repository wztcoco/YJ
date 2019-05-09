'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async home() {
        const pathName=this.ctx.params.fun;
        const subclass=this.ctx.params.subclass;
        const funName=pathName.replace(/(\w)/,function(v){return v.toLowerCase();});
        const result = await this.ctx.service.front[subclass][funName](this.ctx.request.body.args);
        console.log(result);
        this.ctx.body = result;

    }

}

module.exports = IndexController;
