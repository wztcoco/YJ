const constant = require("../constant");
const sequelize = require('sequelize');
const underscore = require('underscore');
const fs = require('mz/fs');
const path = require('path');
const toArray = require('stream-to-array');
const sendToWormhole = require('stream-wormhole');
const moment = require('moment');
const UUID =require('node-uuid');

module.exports = {

  getApiResult: function() {
    //  校验固定入参格式
    if (typeof arguments[0] !== "number") {
      throw Error("The first argument is not a number!");
    }
    if (typeof arguments[1] !== "string") {
      throw Error("The second argument is not String");
    }

    //  固定入参赋值
    const retcode = arguments[0];
    const prompt = arguments[1];

    //  定义返回值
    const jsonResult = JSON.parse(JSON.stringify(constant.apiResultModel));
    jsonResult.retcode = retcode;
    jsonResult.msg.prompt = prompt;
    if (arguments[0] >= 0) {
      //  表示成功返回
      //  校验返回数据
      let jsonData;
      if (arguments[2] instanceof Object) {
        jsonData = arguments[2];
      } else if (!arguments[2]) {
        jsonData = {};
      } else {
        throw Error("The jsonData is not an object!");
      }
      jsonResult.obj = jsonData;
    } else if (arguments[0] < 0) {
      //  表示失败返回
      let error;
      if (arguments[2] instanceof Error) {
        error = arguments[2];
      } else if (!arguments[2]) {
        error = "";
      } else {
        throw Error("The error is not an error type!");
      }
      jsonResult.msg.error = error.message;
    }
    return jsonResult;
  },
  formatDatabaseTime: function(column, formatString) {
    return [sequelize.fn("DATE_FORMAT", sequelize.col(column), formatString) ,column];
  },
};
