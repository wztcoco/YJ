var lectureId = localStorage.getItem('lectureId')||'1';
var userId = '1';

var instance = axios.create({
    baseURL:'http://www.mastercoco.com:7777/front/api/',
    timeout:1000,
    headers:{'content-type': 'application/json'}
});

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
            speakerName:'',
            posterImg:'',
            introduction:'',
            speakerIntroduction:'',
            ticketPrice:[],
            participateTime:'',
            lectureProcess:[],
            ticketLeftNum:[]
        },
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
        if (this.selectLectureId != "") {
            getDataFromServer(this);;
        } else {
            
        }
    },
    methods: {
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
            this.$confirm('确认买票?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                purchaseTicket(that);
            });
        }
    }

});