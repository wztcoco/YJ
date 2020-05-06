var lectureId = localStorage.getItem('lectureId')||'1';
var userId = localStorage.getItem('userId') || '1';
var instance = axios.create({
    baseURL:'/front/api/',
    timeout:1000,
    headers:{'content-type': 'application/json'}
});
var getTypeFromServer = function(vmObj){
    var args = { };
    instance.post('/lecture/getLectureTypeList',{'args':args})
    .then(function(res){
        console.log(res);
        var res = res.data.obj;
        vmObj.typeArr=res;
    })
};
var getUserClick=function(){
    var args = {
        "userId": userId,
        "lectureId": lectureId
    };
    instance.post('/lecture/getClick',{'args':args})
    .then(function(res){
        console.log(res);
    })
}
var getDataFromServer = function(vmObj){
    var args = {
        "lectureId":parseInt(vmObj.selectLectureId),
    };
    instance.post('/lecture/getLectureDetail',{'args':args})
    .then(function(res){
        console.log(res);
        var res = res.data.obj;
        vmObj.lectureData.posterImg = res.posterImg;
        vmObj.lectureData.introduction = res.introduction;
        vmObj.lectureData.speakerIntroduction = res.speakerIntroduction;
        vmObj.lectureData.speakerName = res.speakerName;
        vmObj.lectureData.speakerImg = res.speakerImg;
        vmObj.tableData[0].price = res.ticketPrice[0];
        vmObj.tableData[1].price = res.ticketPrice[1];
        vmObj.tableData[2].price = res.ticketPrice[2];
        vmObj.tableData[0].restNum = res.ticketLeftNum[0];
        vmObj.tableData[1].restNum = res.ticketLeftNum[1];
        vmObj.tableData[2].restNum = res.ticketLeftNum[2];
        vmObj.tableData[0].time = res.participateTime;
        vmObj.tableData[1].time = res.participateTime;
        vmObj.tableData[2].time = res.participateTime;
        vmObj.activities = res.lectureProcess;
    })
};

var purchaseTicket = function(vmObj){
    var args = {
        "lectureId":parseInt(vmObj.selectLectureId),
        "userId":userId,
        "ticketNumArr":[parseInt(vmObj.tableData[0].amount),parseInt(vmObj.tableData[1].amount),parseInt(vmObj.tableData[2].amount)],
        "payAmount":vmObj.sum
    };
    instance.post('/lecture/purchaseTicket',{'args':args})
    .then(function(res){
        console.log(res);
        
    })
};


var vm = new Vue({
    el: "#container",
    data: {
        selectLectureId:lectureId,
        activeIndex2: '1',
        rules: {
            
        },
        lectureData:{
            speakerImg:'',
            speakerName:'',
            posterImg:'',
            introduction:'',
            speakerIntroduction:'',
            ticketPrice:[],
            participateTime:'',
            lectureProcess:[],
            ticketLeftNum:[]
        },
        searchTArr: [{
            "timeId":0,
            "startTime": "0",
            "endTime": "0",
            "timeName": "全部"
        }, {
            "timeId":1,
            "startTime": new Date().format("yyyy-MM-dd"),
            "endTime": "0",
            "timeName": "明天"
        }, {
            "timeId":2,
            "startTime": new Date().format("yyyy-MM-dd"),
            "endTime": "0",
            "timeName": "未来一周"
        }, {
            "timeId":3,
            "startTime": new Date().format("yyyy-MM-dd"),
            "endTime": "0",
            "timeName": "本周末"
        }, {
            "timeId":4,
            "startTime": new Date().format("yyyy-MM-dd"),
            "endTime": "0",
            "timeName": "本月"
        }],
        cityArr:[{
            "areaCode": 000000,
            "cityName": "全国"
        },{
            "areaCode": 110000,
            "cityName": "北京"
        }, {
            "areaCode": 310000,
            "cityName": "上海"
        },{
            "areaCode": 440100,
            "cityName": "广州"
        }, {
            "areaCode": 440300,
            "cityName": "深圳"
        },{
            "areaCode": 330100,
            "cityName": "杭州"
        }, {
            "areaCode": 510100,
            "cityName": "成都"
        },{
            "areaCode": 320100,
            "cityName": "南京"
        }, {
            "areaCode": 320100,
            "cityName": "苏州"
        },{
            "areaCode": 420100,
            "cityName": "武汉"
        }, {
            "areaCode": 120000,
            "cityName": "天津"
        },{
            "areaCode": 500000,
            "cityName": "重庆"
        }],
        typeArr:[],
        actInput:"",
        actInput:"",
        sels: [],
        total: null,
        reverse: false,
        activities: [{
            content: '签到',
            timestamp: '12:30-13:00'
        }, {
            content: '陈冲进行演讲',
            timestamp: '13:00-14:00'
        }, {
            content: '休息',
            timestamp: '14:00-14:10'
        }, {
            content: '陈冲进行下半部分演讲',
            timestamp: '14:10-15:10'
        }, {
            content: '自由交流',
            timestamp: '15:10-15:30'
        }, {
            content: '合影留念',
            timestamp: '15:30-15:40'
        }],
        tableData: [ {
            name: '免费票',
            price: 0,
            restNum:10,
            time: '2019-04-08',
            amount: 0
          }, {
            name: '普通票',
            price: 10,
            restNum:10,
            time: '2019-04-08',
            amount: 0
          }, {
            name: 'VIP票',
            price: 20,
            restNum:10,
            time: '2019-04-08',
            amount: 0
          }],
          sum:0
    },
    created: function(){
        getTypeFromServer(this);
        getUserClick();
        if (this.selectLectureId != "") {
            getDataFromServer(this);;
        } else {
            
        }
    },
    methods: {
        backToIndex(){
            location.replace('/front/index');
        },
        selectTime(index) {
            localStorage.setItem('startTime', this.searchTArr[index].startTime);
            localStorage.setItem('endTime', this.searchTArr[index].endTime);
            location.replace('/front/lecture');
        },
        selectType(index) {
            localStorage.setItem('lectureTypeId', this.typeArr[index].lectureTypeId);
            location.replace('/front/lecture');
        },
        selectCity(index) {
            localStorage.setItem('townCode', this.cityArr[index].areaCode);
            location.replace('/front/lecture');
        },
        searchKey(){
            localStorage.setItem('keyword', this.actInput);
            location.replace('/front/lecture');
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            
        },
        handleSub:function (row) {
           
            //更新用户状态，弹窗确认
            if(row.amount>0)
            {
                row.restNum++;
                row.amount--;
                this.sum-=row.price;
            }
        },
        handleAdd:function (row) {
            
            //更新用户状态，弹窗确认
            if(row.restNum>0)
            {
                row.amount++;
                row.restNum--;
                this.sum+=row.price;
            }
        },
        handlePay:function(){
            var that=this;
            this.$confirm('确认购买?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                purchaseTicket(that);
            });
        },
        userCenter(){
            location.replace('/front/user');
        }
    }

});