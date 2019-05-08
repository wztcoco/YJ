module.exports = app => {
    const { router, controller } = app;
    router.get('/front/build', controller.web.build.buildPage);//登录页面
};