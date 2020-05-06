var lectureId = localStorage.getItem('lectureId') || '1';
var creatorId = '1';
var userId = localStorage.getItem('userId') || '1';
var instance = axios.create({
    baseURL: '/front/api/',
    timeout: 2000,
    headers: { 'content-type': 'application/json' }
});

var getDataFromServer = function(vmObj){
    var args = {
            "keyword":"",
            "pageSize":8,
            "today":0,
            "pageIndex":1
    };
    instance.post('/lecture/getLectureList',{'args':args})
    .then(function(res){
        console.log(res);
        var res = res.data.obj;
        vmObj.lectureArray=res.searchLectureList;
    })
};
var getTypeFromServer = function(vmObj){
    var args = { };
    instance.post('/lecture/getLectureTypeList',{'args':args})
    .then(function(res){
        console.log(res);
        var res = res.data.obj;
        vmObj.typeArr=res;
    })
};
var vm = new Vue({
    el: "#container",
    data: {
        ruleForm:
        {
            lectureType: '',
            lectureName: '',
            startTime: '',
            endTime: ''

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
        tagArr: [],
        processArr: [{
            sort: 1,
            content: '',
            processTime: '',
            startTime: '00:00',
            endTime: '00:00'
        }],
        picArr:[
            {id:0,idView:"../public/images/others/chair2.png"},
            {id:1,idView:"../public/images/others/rotationChart.png"}
        ],
        rules: {
            lectureName: [
                { required: true, message: '请填写讲座名称' },
            ],
            startTime: [
                { required: true, message: '请选择讲座开始时间' },
            ],
            endTime: [
                { required: true, message: '请选择讲座结束时间' },
            ]
        },
        bannerHeight:"300",
        posterArgs: {
            "dirName": "posterImg",
            "userId": creatorId
        },
        coverArgs: {
            "dirName": "coverImg",
            "userId": creatorId
        },
        speakerArgs: {
            "dirName": "speakerImg",
            "userId": creatorId
        },
        lectureArray:[],
    },
    created: function () {
        getDataFromServer(this);
        getTypeFromServer(this);
        if (this.selectLectureId != "") {

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
        imgLoad(){
            this.$nextTick(()=>{
                this.bannerHeight=this.$refs.bannerHeight[0].height;
            })
        },
        enrollDetail: function (id) {
            localStorage.setItem('lectureId', id);
            location.replace('/front/chair');

        },
        buildAct: function () {
            location.replace('/front/build');
        },
        userCenter(){
            location.replace('/front/user');
        }
    },
    mounted(){
        this.imgLoad();
        window.addEventListener('resize',()=>{
            this.bannerHeight=this.$refs.bannerHeight[0].height;
            this.imgLoad();
        },false)
    },
});