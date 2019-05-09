var instance = axios.create({
    baseURL: 'http://www.mastercoco.com:7777/front/api/',
    timeout: 1000,
    headers: {'content-type': 'application/json'}
});

var getTypeFromServer = function (vmObj) {
    vmObj.lectureTypeArray=[];
    vmObj.townArray=[];
    vmObj.schoolArray=[];
    var args1 = {
        "cityCode": "330100",
    };

    instance.post('/lecture/getLectureTypeList')
        .then(function (res) {
            var res = res.data.obj;
            vmObj.lectureTypeArray.push({"lectureTypeId": 0, "lectureTypeName": "不限"});
            res.forEach(function (item, index) {
                vmObj.lectureTypeArray.push(item);
            })


        });
    instance.post('/lecture/getTownList', {'args': args1})
        .then(function (res) {
            var res = res.data.obj;
            vmObj.townArray.push({"areaName": "不限", "townCode": "0"});
            res.forEach(function (item, index) {
                vmObj.townArray.push(item);
            })
        });

    var args2 = {
        "townCode": vmObj.townCode,
    };

    instance.post('/lecture/getSchoolList', {'args': args2})
        .then(function (res) {
            var res = res.data.obj;
            vmObj.schoolArray.push({"schoolName": "不限", "lectureAddressId": 0});
            res.forEach(function (item, index) {
                vmObj.schoolArray.push(item);
            })
        });
};
var getDataFromServer = function (vmObj) {
    var args = {
        "lectureTypeId": vmObj.lectureTypeId,
        "townCode": vmObj.townCode,
        "schoolName": vmObj.schoolName,
        "startTime": vmObj.startTime,
        "endTime": vmObj.endTime,
        "pageSize": 0,
        "pageIndex": 0,
    };
    instance.post('/lecture/getLectureListAdvanced', {'args': args})
        .then(function (res) {
            var res = res.data.obj;
            vmObj.lectureArray = res.searchLectureList;
        });
};
var getStartTime = function () {
    var startTime = new Date().format("yyyy-MM-dd");
    return startTime;
};
var getEndTime = function (n) {
    var d = new Date();
    var endTime = new Date(d.getFullYear(),d.getMonth(),d.getDate()+n).format("yyyy-MM-dd");
    return endTime;
};
var getTimeArray = function () {
    var startTime = getStartTime();
    var endTime = [];
    endTime[0] = getEndTime(0);
    endTime[1] = getEndTime(1);
    endTime[2] = getEndTime(7);
    endTime[3] = getEndTime(14);
    var array = [
        {
            "time": "不限",
            "startTime": "0",
            "endTime": "0",
        },
        {
            "time": "今天",
            "startTime": startTime,
            "endTime": endTime[0],
        },
        {
            "time": "明天",
            "startTime": startTime,
            "endTime": endTime[1],
        },
        {
            "time": "一周内",
            "startTime": startTime,
            "endTime": endTime[2],
        },
        {
            "time": "两周内",
            "startTime": startTime,
            "endTime": endTime[3],
        }];
    return array;
};
var vm = new Vue({
    el: "#container",
    data: function () {
        return {
            activeIndex2: "1",
            backgroundArray: [
                {url: "../images/rotationChart.png"},
                {url: "../images/rotationChart.png"},
                {url: "../images/rotationChart.png"},
                {url: "../images/rotationChart.png"}
            ],

            lectureArray: [],
            lectureTypeArray: [],
            townArray: [],
            schoolArray: [],
            timeArray: [],

            rules: {},

            lectureTypeId: "",
            townCode: "",
            lectureAddressId: "",
            startTime: "",
            endTime: "",

            sels: [],
            total: null,
            tableData: [],
            activeName: 'first',
            isActive1: 0,
            isActive2: 0,
            isActive3: 0,
            isActive4: 0,
        }
    },
    created: function () {
        this.lectureTypeId = 0;
        this.townCode = "0";
        this.schoolName = "";
        this.startTime = "0";
        this.endTime = "0";
        this.timeArray = getTimeArray();
        getTypeFromServer(this);
        getDataFromServer(this);
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        enrollDetail(id) {
            localStorage.setItem('lectureId', id);
            loadPartList('/front/chair');

        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        tagSelect1(item, index) {
            this.isActive1 = index;
            this.lectureTypeId = this.lectureTypeArray[index].lectureTypeId;
            getDataFromServer(this);
        },
        tagSelect2(item, index) {
            this.isActive2 = index;
            this.townCode = this.townArray[index].townCode;
            getTypeFromServer(this);
            getDataFromServer(this);
        },
        tagSelect3(item, index) {
            this.isActive3 = index;
            this.schoolName = this.schoolArray[index].schoolName;
            getDataFromServer(this);
        },
        tagSelect4(item, index) {
            this.isActive4 = index;
            this.startTime = this.timeArray[index].startTime;
            this.endTime = this.timeArray[index].endTime;
            getDataFromServer(this);
        },
    }
});




