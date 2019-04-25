'use strict';

const Service = require('egg').Service;
const constant = require('../../constant');
const md5 = require('js-md5');
const Sequelize = require('sequelize');
const underscore = require('underscore');
const GsLecture=require('../../model/gs_lecture');
const moment = require('moment');

class LectureService extends Service {
    //获取讲座详情
    async getLectureDetail(params){
        const ctx = this.ctx;
        const {lectureId}=params;
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
        const searchLectureDetail=await ctx.model.ViLectureSpeakerTypeBind.findOne({
            where:{
               lectureId:lectureId
            },
            raw:true,
            attributes:['posterImg','introduction','speakerIntroduction','ticketPrice',
                'ticketTypeNum',ctx.helper.formatDatabaseTime('participateTime', '%Y-%m-%d'),
                'speakerName','speakerImg']
        });
        //再查询流程信息
        const searchProcessInfo=await ctx.model.GsProcess.findAll({
            where:{
               lectureId:lectureId
            },
            raw:true,
            attributes: ['processTime','content','sort'],
            order:[['sort']]
        });
        // 再查询剩余票数目信息
        const searchLeftTicket=await ctx.model.GsUserTicketBind.findAll({
            where:{
                lectureId:lectureId
            },
            raw:true,
            attributes:['ticketType','lectureId','ticketId']
        });
        const ticketTypeArr=[1,2,3];
        let ticketLeftNum=[];
        for(let i in ticketTypeArr){
            ticketLeftNum.push(underscore.where(searchLeftTicket,{ticketType:ticketTypeArr[i]}).length)
        }
        searchLectureDetail.ticketPrice=getQuestionTypeNum(searchLectureDetail.ticketPrice);
        let ticketTypeNum=getQuestionTypeNum(searchLectureDetail.ticketTypeNum);
        searchLectureDetail.ticketTypeNum=getQuestionTypeNum(searchLectureDetail.ticketTypeNum);
        for(let i in ticketLeftNum){
            ticketLeftNum[i]=ticketTypeNum[i]-ticketLeftNum[i];
        }
        //深拷贝基本信息至出参数组中
        let {...responseObj}=searchLectureDetail;
        responseObj.lectureProcess=searchProcessInfo;
        responseObj.ticketLeftNum=ticketLeftNum;
        return ctx.helper.getApiResult(constant.apiCode.normal, '查询成功',responseObj);
    }
    //获取讲座列表
    async getLectureList(params){
        const ctx=this.ctx;
        const {keyword="",pageIndex=1,pageSize=30,today=0}=params;
        const searchObj={
            where:{
                lectureName:{$like:'%'+keyword+'%'},
                participateTime:{$between:[today+" 00:00:00",today+" 23:59:59"]},
            },
            attributes:['lectureId','lectureName',ctx.helper.formatDatabaseTime('participateTime', '%Y-%m-%d %H:%i'),
                ctx.helper.formatDatabaseTime('endTime', '%Y-%m-%d %H:%i'),'coverImg','speakerName'],
            limit: pageSize,
            offset: pageSize * (pageIndex - 1),
            raw:true,
            order:[['participateTime','DESC']]
        };
        if(today==0){
            delete searchObj.where.participateTime;
        }
        const searchLectureList=await ctx.model.ViLectureSpeakerTypeBind.findAndCountAll(searchObj);
        //处理讲座时间
        underscore.map(searchLectureList.rows,function(item) {

            item.lectureTime=item.participateTime+'-'+moment(item.endTime).toString().substring(16,21)
        });
        let responseObj={};
        responseObj.searchLectureList=searchLectureList.rows;
        responseObj.total=searchLectureList.count;
        return ctx.helper.getApiResult(constant.apiCode.normal, '查询列表成功',responseObj);

    }
    //购买门票
    async purchaseTicket(params){
        const ctx=this.ctx;
        let {lectureId,userId,ticketNumArr,payAmount}=params;
        const t=await ctx.model.transaction();
        const nowTime=new Date();
        let tradeNumHash=md5(lectureId+userId+nowTime);
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
        try{
            //先向交易表中添加一条数据
            const createTrade=await ctx.model.GsTrade.create({
                lectureId:lectureId,
                userId:userId,
                tradeNum:tradeNumHash,
                payAmount:payAmount,
                createTime:nowTime
            },{
                transaction:t
            });
            //再向票记录表中新增买票的记录
            let ticketPurchaseArr=[];

            for(let i=0;i<=ticketNumArr.length-1;i++){
                for(let j=0;j<=ticketNumArr[i]-1;j++){
                    let ticketCodeHash=md5(userId+(i+1)+j+nowTime+lectureId);
                    let obj={
                        userId:userId,
                        ticketType:i+1,
                        createTime:nowTime,
                        tradeId:createTrade.tradeId,
                        lectureId:lectureId,
                        ticketCode:ticketCodeHash
                    }
                    ticketPurchaseArr.push(obj);
                }
            }
            const createTicket=await ctx.model.GsUserTicketBind.bulkCreate(ticketPurchaseArr,{
                transaction:t
            });
            await t.commit();
            return ctx.helper.getApiResult(constant.apiCode.normal, '买票成功',{tradeNum:createTrade.tradeNum});

        }catch(err){
            console.log(err);
            await t.rollback();
            return ctx.helper.getApiResult(constant.apiCode.serviceError, '内部错误', err);
        }

    }
}


module.exports = LectureService;
