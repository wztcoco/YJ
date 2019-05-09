'use strict';

const Service = require('egg').Service;
const constant = require('../../constant');
const md5 = require('js-md5');
const Sequelize = require('sequelize');
const underscore = require('underscore');
const promise = require('bluebird');
const formidable = require('formidable');
const path = require('path');
const moment = require('moment');
const fs = require('fs');

class LectureService extends Service {
    //获取讲座详情
    async getLectureDetail(params) {
        const ctx = this.ctx;
        const {lectureId} = params;

        //封装一个转换字符串为数组的函数
        function getQuestionTypeNum(str) {
            let handleArr = [];
            if (str !== null) {
                const tempArr = str.substring(1, str.length - 1).split(",");
                for (const i in tempArr) {
                    handleArr.push(parseInt(tempArr[i]));
                }
            } else {
                handleArr = [0, 0, 0, 0];
            }
            return handleArr;
        }

        //先查询基本信息
        const searchLectureDetail = await ctx.model.ViLectureSpeakerTypeBind.findOne({
            where: {
                lectureId: lectureId
            },
            raw: true,
            attributes: ['posterImg', 'introduction', 'speakerIntroduction', 'ticketPrice',
                'ticketTypeNum', ctx.helper.formatDatabaseTime('participateTime', '%Y-%m-%d'),
                'speakerName', 'speakerImg']
        });
        //再查询流程信息
        const searchProcessInfo = await ctx.model.GsProcess.findAll({
            where: {
                lectureId: lectureId
            },
            raw: true,
            attributes: ['processTime', 'content', 'sort'],
            order: [['sort']]
        });
        // 再查询剩余票数目信息
        const searchLeftTicket = await ctx.model.GsUserTicketBind.findAll({
            where: {
                lectureId: lectureId
            },
            raw: true,
            attributes: ['ticketType', 'lectureId', 'ticketId']
        });
        const ticketTypeArr = [1, 2, 3];
        let ticketLeftNum = [];
        for (let i in ticketTypeArr) {
            ticketLeftNum.push(underscore.where(searchLeftTicket, {ticketType: ticketTypeArr[i]}).length)
        }
        searchLectureDetail.ticketPrice = getQuestionTypeNum(searchLectureDetail.ticketPrice);
        let ticketTypeNum = getQuestionTypeNum(searchLectureDetail.ticketTypeNum);
        searchLectureDetail.ticketTypeNum = getQuestionTypeNum(searchLectureDetail.ticketTypeNum);
        for (let i in ticketLeftNum) {
            ticketLeftNum[i] = ticketTypeNum[i] - ticketLeftNum[i];
        }
        //深拷贝基本信息至出参数组中
        let {...responseObj} = searchLectureDetail;
        responseObj.lectureProcess = searchProcessInfo;
        responseObj.ticketLeftNum = ticketLeftNum;
        return ctx.helper.getApiResult(constant.apiCode.normal, '查询成功', responseObj);
    }

    //获取讲座列表
    async getLectureList(params) {
        const ctx = this.ctx;
        const {keyword = "", pageIndex = 1, pageSize = 30, today = 0} = params;
        const searchObj = {
            where: {
                lectureName: {$like: '%' + keyword + '%'},
                lectureStatus: 1,
                participateTime: {$between: [today + " 00:00:00", today + " 23:59:59"]},
            },
            attributes: ['lectureId', 'lectureName', ctx.helper.formatDatabaseTime('participateTime', '%Y-%m-%d %H:%i'),
                ctx.helper.formatDatabaseTime('endTime', '%Y-%m-%d %H:%i'), 'coverImg', 'speakerName', 'schoolName'],
            limit: pageSize,
            offset: pageSize * (pageIndex - 1),
            raw: true,
            order: [['participateTime', 'DESC']]
        };
        if (pageIndex === 0 && pageSize === 0) {
            delete searchObj.limit;
            delete searchObj.offset;
        }
        if (today == 0) {
            delete searchObj.where.participateTime;
        }
        const searchLectureList = await ctx.model.ViLectureSpeakerTypeBind.findAndCountAll(searchObj);
        //处理讲座时间
        underscore.map(searchLectureList.rows, function (item) {

            item.lectureTime = item.participateTime + '-' + moment(item.endTime).toString().substring(16, 21)
        });
        let responseObj = {};
        responseObj.searchLectureList = searchLectureList.rows;
        responseObj.total = searchLectureList.count;
        return ctx.helper.getApiResult(constant.apiCode.normal, '查询列表成功', responseObj);

    }

    //购买门票
    async purchaseTicket(params) {
        const ctx = this.ctx;
        let {lectureId, userId, ticketNumArr, payAmount} = params;
        const t = await ctx.model.transaction();
        const nowTime = new Date();
        let tradeNumHash = md5(lectureId + userId + nowTime);
        // //封装一个转换字符串为数组的函数
        // function getQuestionTypeNum(str) {
        //     let handleArr = [];
        //     if (str !== null) {
        //         const tempArr = str.substring(1, str.length - 1).split(",");
        //         for (const i in tempArr) {
        //             handleArr.push(parseInt(tempArr[i]));
        //         }
        //     } else {
        //         handleArr = [0, 0, 0, 0];
        //     }
        //     return handleArr;
        // }
        try {
            //先向交易表中添加一条数据
            const createTrade = await ctx.model.GsTrade.create({
                lectureId: lectureId,
                userId: userId,
                tradeNum: tradeNumHash,
                payAmount: payAmount,
                createTime: nowTime
            }, {
                transaction: t
            });
            //再向票记录表中新增买票的记录
            let ticketPurchaseArr = [];

            for (let i = 0; i <= ticketNumArr.length - 1; i++) {
                for (let j = 0; j <= ticketNumArr[i] - 1; j++) {
                    let ticketCodeHash = md5(userId + (i + 1) + j + nowTime + lectureId);
                    let obj = {
                        userId: userId,
                        ticketType: i + 1,
                        createTime: nowTime,
                        tradeId: createTrade.tradeId,
                        lectureId: lectureId,
                        ticketCode: ticketCodeHash
                    }
                    ticketPurchaseArr.push(obj);
                }
            }
            const createTicket = await ctx.model.GsUserTicketBind.bulkCreate(ticketPurchaseArr, {
                transaction: t
            });
            await t.commit();
            return ctx.helper.getApiResult(constant.apiCode.normal, '买票成功', {tradeNum: createTrade.tradeNum});

        } catch (err) {
            console.log(err);
            await t.rollback();
            return ctx.helper.getApiResult(constant.apiCode.serviceError, '内部错误', err);
        }

    }

    //发起讲座
    async createLecture(params) {
        const ctx = this.ctx;
        let {
            creatorId, lectureName, participateTime, endTime, schoolName, cityCode, townCode, detailedAddress,
            lectureTypeId, posterImg, coverImg, introduction, speakerInfo, tagArr, ticketArr, processArr, lectureStatus = 1
        } = params;
        const t = await ctx.model.transaction();
        const nowTime = new Date();
        try {
            // 向主讲人表中插入一条主讲人数据
            const createSpeakerResult = await ctx.model.GsSpeaker.create(speakerInfo, {
                transaction: t
            });
            // 向地址表中插入一条地址信息的数据
            const createLectureAddress = await ctx.model.GsLectureAddress.create({
                schoolName: schoolName,
                cityCode: cityCode,
                townCode: townCode,
                detailedAddress: detailedAddress
            }, {
                transaction: t
            });
            let ticketTypeNum = [], ticketPrice = [], ticketType = [1, 2, 3];
            //处理票信息
            for (let i in ticketType) {
                let resultArr = underscore.where(ticketArr, {ticketId: ticketType[i]});
                // 如果有值
                if (resultArr.length !== 0) {
                    ticketTypeNum.push(resultArr[0].ticketNum);
                    ticketPrice.push(resultArr[0].ticketPrice);
                }
            }

            // 向讲座表中插入一条讲座基本信息的数据
            const createBasicLectureInfoResult = await ctx.model.GsLecture.create({
                creatorId: creatorId,
                participateTime: participateTime,
                endTime: endTime,
                createTime: nowTime,
                lectureName: lectureName,
                coverImg: coverImg,
                posterImg: posterImg,
                introduction: introduction,
                lectureTypeId: lectureTypeId,
                lectureAddressId: createLectureAddress.lectureAddressId,
                speakerId: createSpeakerResult.speakerId,
                ticketTypeNum: "[" + ticketTypeNum.toString() + "]",
                ticketPrice: "[" + ticketPrice.toString() + "]"
            });
            for (let i in processArr) {
                processArr[i].lectureId = createBasicLectureInfoResult.lectureId
            }
            // 向流程表中插入流程数据
            const createProcessInfo = await ctx.model.GsProcess.bulkCreate(processArr, {
                transaction: t
            });
            for (let i in tagArr) {
                tagArr[i].lectureId = createBasicLectureInfoResult.lectureId
            }
            // 向标签表中插入讲座标签的数据
            const createTagResult = await ctx.model.GsTag.bulkCreate(tagArr, {
                transaction: t
            });
            await t.commit();
            return ctx.helper.getApiResult(constant.apiCode.normal, '创建讲座成功', {lectureId: createBasicLectureInfoResult.lectureId});
        } catch (err) {
            console.log(err);
            await t.rollback();
            return ctx.helper.getApiResult(constant.apiCode.serviceError, '内部错误', err);
        }


    }

    //获取讲座类型列表
    async getLectureTypeList() {
        const ctx = this.ctx;
        const getLectureTypeListResult = await ctx.model.GsLectureType.findAll({
            order: [['lectureTypeId', 'DESC']],
            row: true
        });
        return ctx.helper.getApiResult(constant.apiCode.normal, '获取讲座列表成功', getLectureTypeListResult);

    }

    //获取城市列表
    async getCityList(params) {
        const ctx = this.ctx;
        const searchCityList = await ctx.model.ViCityTownBind.findAll({
            attributes: ['cityName', 'cityCode'],
            group: 'cityCode'
        });
        return ctx.helper.getApiResult(constant.apiCode.normal, '获取城市列表成功', searchCityList);
    }

    //获取乡镇列表
    async getTownList(params) {
        const ctx = this.ctx;
        const {cityCode} = params;
        const searchTownList = await ctx.model.ViCityTownBind.findAll({
            attributes: ['areaName', ['areaCode','townCode']],
            where: {
                cityCode: cityCode
            }
        });
        return ctx.helper.getApiResult(constant.apiCode.normal, '获取乡镇列表成功', searchTownList);
    }

    //获取学校列表
    async getSchoolList(params) {
        const ctx = this.ctx;
        const {townCode='0'} = params;
        //设定搜索条件对象
        const searchObj={
            attributes: ['schoolName', 'lectureAddressId'],
            group: 'schoolName',
            where: {
                townCode: townCode
            }
        };
        if(townCode==='0'){
            delete searchObj.where.townCode;
        }
        const searchTownList = await ctx.model.GsLectureAddress.findAll(searchObj);
        return ctx.helper.getApiResult(constant.apiCode.normal, '获取学校列表成功', searchTownList);
    }

    //获取讲座列表(高级筛选)
    async getLectureListAdvanced(params) {
        const ctx = this.ctx;
        const {keyword = "", pageIndex = 1, pageSize = 30, startTime = "0", endTime = "0", lectureTypeId = 0, townCode = "0", schoolName = ""} = params;
        const searchObj = {
            where: {
                lectureName: {$like: '%' + keyword + '%'},
                lectureStatus: 1,
                participateTime: {$between: [startTime + " 00:00:00", endTime + " 23:59:59"]},
            },
            attributes: ['lectureId', 'lectureName', ctx.helper.formatDatabaseTime('participateTime', '%Y-%m-%d %H:%i'),
                ctx.helper.formatDatabaseTime('endTime', '%Y-%m-%d %H:%i'), 'coverImg', 'speakerName', 'schoolName'],
            limit: pageSize,
            offset: pageSize * (pageIndex - 1),
            raw: true,
            order: [['participateTime', 'DESC']]
        };
        if (pageIndex === 0 && pageSize === 0) {
            delete searchObj.limit;
            delete searchObj.offset;
        }
        //讲座类型筛选
        if (lectureTypeId !== 0) {
            searchObj.where.lectureTypeId = lectureTypeId;
        }
        //讲座区域筛选
        if (townCode != "0") {
            searchObj.where.townCode = townCode;
        }
        //讲座学校名称筛选
        if (schoolName !== ""&&schoolName !== "不限") {
            searchObj.where.schoolName = schoolName;
        }
        //讲座日期筛选
        if (startTime === "0" && endTime === "0") {
            delete searchObj.where.participateTime;
        }
        const searchLectureList = await ctx.model.ViLectureSpeakerTypeBind.findAndCountAll(searchObj);
        //处理讲座时间
        underscore.map(searchLectureList.rows, function (item) {

            item.lectureTime = item.participateTime + '-' + moment(item.endTime).toString().substring(16, 21)
        });
        let responseObj = {};
        responseObj.searchLectureList = searchLectureList.rows;
        responseObj.total = searchLectureList.count;
        return ctx.helper.getApiResult(constant.apiCode.normal, '查询列表成功', responseObj);

    }
    //图片上传
    uploadCommonImg() {

        const ctx=this.ctx;
        const file = ctx.request.files[0];
        console.log('file=========='+file);
        const dirName=ctx.request.body.dirName;
        const userId=ctx.request.body.userId;
        const extName=path.extname(file.filename);
        let filePath = file.filepath;
        let targetPath = moment().format('YYYYMMDDHHmmssSSSS_') + userId + extName;
        console.log('direname======='+__dirname);
        let finalPath =__dirname+ `/../../public/images/${dirName}/${targetPath}`;
        try{
            console.log(filePath);
            console.log(finalPath);
            fs.rename(filePath, finalPath,function (error) {
                if(error){
                    console.log(error);
                    return ctx.helper.getApiResult(constant.apiCode.serviceError, '内部错误', error);
                }
                else{
                    console.log("well done")
                }
            });
            return ctx.helper.getApiResult(constant.apiCode.normal, '上传成功', {imgUrl: `http://www.mastercoco.com:7777/public/images/${dirName}/${targetPath}`});

        }catch(err){
            console.log(err);
            return ctx.helper.getApiResult(constant.apiCode.serviceError, '内部错误', error);
        }
    }
}


module.exports = LectureService;
