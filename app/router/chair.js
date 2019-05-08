module.exports = app => {
    const { router, controller } = app;
    router.get('/front/chair', controller.web.chair.chairPage);//登录页面
};