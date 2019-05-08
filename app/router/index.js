module.exports = app => {
    const { router, controller } = app;
    router.get('/front/index', controller.web.index.indexPage);//登录页面
};