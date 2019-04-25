/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  // config.keys = appInfo.name + '_1551666629015_623';

  // add your middleware config here
  config.middleware = [];

  // 端口号
  config.cluster = {
    listen: {
      port: 7777,
    },
    workers:1
  };

  config.security = {
    csrf:{
      enable: false,
      ignoreJSON: true
    },
    //设置前端项目端口号为白名单
    domainWhiteList: ['http://localhost:5000','http://localhost:5001']
  };

  config.cors = {
    origin:'*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  const dbConfig = {
    dialect: 'mysql',
    database: 'gs',
    host: 'rm-bp1if8r19l8p05ns7do.mysql.rds.aliyuncs.com',
    port: '3306',
    username: 'nygma_root',
    password: 'Rax147852369',
    timezone: '+08:00'
  };

  // 数据库配置
  config.sequelize = dbConfig;

  config.knex = {
    // database configuration
    client: {
      // database dialect
      dialect: dbConfig.dialect,
      connection: {
        // host
        host: dbConfig.host,
        // port
        port: dbConfig.port,
        // username
        user: dbConfig.username,
        // password
        password: dbConfig.password,
        // database
        database: dbConfig.database,
        requestTimeout: 600000,
      },
      // connection pool
      pool: { min: 0, max: 20 },
      // acquire connection timeout, millisecond
      acquireConnectionTimeout: 600000,
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.bodyParser = {
    enable: true,
    encoding: 'utf8',
    formLimit: '50mb',
    jsonLimit: '50mb',
    strict: true,
    queryString: {
      arrayLimit: 100,
      depth: 5,
      parameterLimit: 1000,
    }
  };

  //egg自带获取数据流插件
  config.multipart = {
    whitelist: [
      '.xlsx',
    ],
  };


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
