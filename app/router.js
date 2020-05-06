'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/front/api/:subclass/:fun', controller.front.index.home);
  require('./router/chair')(app);
  require('./router/build')(app);
  require('./router/index')(app);
  require('./router/lecture')(app);
  require('./router/user')(app);
  require('./router/login')(app);
  require('./router/data')(app);
};
