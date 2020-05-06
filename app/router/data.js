module.exports = app => {
    const { router, controller } = app;
    router.get('/front/data', controller.web.data.dataPage);//登录页面
};