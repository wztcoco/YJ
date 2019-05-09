module.exports = app => {
    const { router, controller } = app;
    router.get('/front/lecture', controller.web.lecture.lecturePage);//登录页面
};