module.exports = app => {
    const { router, controller } = app;
    router.get('/front/user', controller.web.user.userPage);//登录页面
};