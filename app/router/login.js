module.exports = app => {
    const { router, controller } = app;
    router.get('/front/login', controller.web.login.loginPage);//登录页面
};