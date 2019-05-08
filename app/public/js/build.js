var lectureId = localStorage.getItem('lectureId')||'1';
var userId = '1';

var instance = axios.create({
    baseURL:'http://www.mastercoco.com:7777/front/api/',
    timeout:1000,
    headers:{'content-type': 'application/json'}
});

// var getDataFromServer = function(vmObj){
//     var args = {
//         "lectureId":parseInt(vmObj.selectLectureId),
//     };
//     instance.post('/lecture/getLectureDetail',{'args':args})
//     .then(function(res){
//         console.log(res);
//         var res = res.data.obj;
//         vmObj.chairName = res.chairName;
//     })
// };

// var purchaseTicket = function(vmObj){
//     var args = {
//         "lectureId":parseInt(vmObj.selectLectureId),
//         "userId":userId,
//         "ticketNumArr":[parseInt(vmObj.tableData[0].amount),parseInt(vmObj.tableData[1].amount),parseInt(vmObj.tableData[2].amount)],
//         "payAmount":vmObj.sum
//     };
//     instance.post('/lecture/purchaseTicket',{'args':args})
//     .then(function(res){
//         console.log(res);
        
//     })
// };


var vm = new Vue({
    el: "#container",
    data: {
        chairName:'',
        activeIndex2: '1',
        townList :[],
        cityList:[],
        typeList:[],
        ruleForm:
            {
                lectureName:'',
                startTime:'',
                endTime: ''

            },
        rules: {
            lectureName: [
                {required: true, message: '请填写讲座名称'},
            ],
            startTime: [
                {required: true, message: '请选择讲座开始时间'},
            ],
            endTime: [
                {required: true, message: '请选择讲座结束时间'},
            ]
        },
        
    },
    created: function(){
        if (this.selectLectureId != "") {
            // getDataFromServer(this);;
        } else {
            
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            
        },
        selChange: function () {

        }
    }

});