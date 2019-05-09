var lectureId = localStorage.getItem('lectureId') || '1';
var creatorId = '1';

var instance = axios.create({
    baseURL: '/front/api/',
    timeout: 2000,
    headers: { 'content-type': 'application/json' }
});

var getCityList = function (vmObj) {
    var args = {};
    instance.post('/lecture/getCityList', { 'args': args })
        .then(function (res) {
            var res = res.data.obj;
            vmObj.cityList = res;
        })
};
var getTownList = function (vmObj) {
    var args = { "cityCode": vmObj.lectureCity };
    instance.post('/lecture/getTownList', { 'args': args })
        .then(function (res) {
            var res = res.data.obj;
            vmObj.townList = res;
        })
};
var getLectureTypeList = function (vmObj) {
    var args = {};
    instance.post('/lecture/getLectureTypeList', { 'args': args })
        .then(function (res) {
            var res = res.data.obj;
            vmObj.typeList = res;
        })
};
var postLecture = function (vmObj) {
    for(var i=0;i<vmObj.processArr.length;i++)
    {
        vmObj.processArr[i].processTime=new Date().format("yyyy-MM-dd")+" "+vmObj.processArr[i].startTime+"-"+vmObj.processArr[i].endTime;
    }
    var args = {
        "creatorId":creatorId,
		"lectureName":vmObj.ruleForm.lectureName,
		"participateTime":vmObj.ruleForm.startTime.format("yyyy-MM-dd hh:mm:ss"),
		"endTime":vmObj.ruleForm.endTime.format("yyyy-MM-dd hh:mm:ss"),
		"schoolName":vmObj.ruleForm.lectureSchool,
		"cityCode":vmObj.lectureCity,
		"townCode":vmObj.lectureTown,
		"detailedAddress":vmObj.ruleForm.detailArea,
		"lectureTypeId":vmObj.ruleForm.lectureType,
		"posterImg":vmObj.posterImgs,
		"coverImg":vmObj.coverImgs,
		"introduction":vmObj.lectureDetail,
		"speakerInfo":{
			"speakerName":vmObj.speakerInfo,
			"speakerIntroduction":vmObj.lectureSpeaker,
			"coverImg":vmObj.speakerImgs
		},
		"tagArr":vmObj.tagArr,
		"ticketArr":vmObj.ticketArr,
		"processArr":vmObj.processArr,
		"lectureStatus":1

    };
    
    console.log(args);
    instance.post('/lecture/createLecture', { 'args': args })
        .then(function (res) {
            console.log(res);
        })
};
var vm = new Vue({
    el: "#container",
    data: {
        lectureCity: '',
        lectureTown: '',
        tagName: '',
        speakerInfo: '',
        lectureSpeaker: '',
        lectureDetail: '',
        posterImg: '',
        coverImg:'',
        speakerImg:'',
        posterImgs: '',
        coverImgs:'',
        speakerImgs:'',
        chairName: '',
        activeIndex2: '1',
        townList: [],
        cityList: [],
        typeList: [],
        ruleForm:
        {
            lectureType: '',
            lectureName: '',
            startTime: '',
            endTime: ''

        },
        ticketArr: [{
            "ticketId": 1,
            "ticketName": "免费票",
            "ticketPrice": 0,
            "ticketNum": 0
        }, {
            "ticketId": 2,
            "ticketName": "普通票",
            "ticketPrice": 0,
            "ticketNum": 0
        }, {
            "ticketId": 3,
            "ticketName": "VIP票",
            "ticketPrice": 0,
            "ticketNum": 0
        }],
        tagArr: [],
        processArr: [{
            sort: 1,
            content: '',
            processTime: '',
            startTime: '00:00',
            endTime: '00:00'
        }],
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
    },
    created: function () {
        if (this.selectLectureId != "") {
            // getDataFromServer(this);;
            getCityList(this);
            getLectureTypeList(this);
        } else {

        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);

        },
        selCity: function () {
            getTownList(this);
            console.log(this.lectureCity);
        },
        selTown: function () {
            console.log(this);
        },
        handleAvatarSuccess1(res, file) {
            this.posterImg = URL.createObjectURL(file.raw);
            this.posterImgs = res.obj.imgUrl;
        },
        handleAvatarSuccess2(res, file) {
            this.coverImg = URL.createObjectURL(file.raw);
            this.coverImgs = res.obj.imgUrl;
        },
        handleAvatarSuccess3(res, file) {
            this.speakerImg = URL.createObjectURL(file.raw);
            this.speakerImgs = res.obj.imgUrl;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 20;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 20MB!');
            }
            return isJPG && isLt2M;
        },
        addProcess() {
            console.log(this.processArr);
            const num = this.processArr.length;
            this.processArr.push({
                sort: num + 1,
                content: '',
                processTime: '',
                startTime: '00:00',
                endTime: '00:00'
            })
        },
        addTag() {
            if (!this.tagName) {
                this.$message.error('请输入标签!');

            } else {
                this.tagArr.push({
                    tagName: this.tagName
                })
                this.tagName = '';
            }
            console.log(this.tagArr);
        },
        deleteTag(index) {
            console.log(index);
            this.tagArr.splice(index, 1)
        },
        deleteTicket(row) {
            console.log(row.ticketId);
            this.ticketArr[row.ticketId - 1].ticketNum = 0;
            this.ticketArr[row.ticketId - 1].ticketPrice = 0;
        },
        saveLecture() {
            var that=this;
            this.$confirm('确认发布?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                postLecture(that)
            });
            
        },
        pushLecture() {

        },


    }

});