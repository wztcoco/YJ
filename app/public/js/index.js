var instance = axios.create({
    baseURL:'http://www.mastercoco.com:7777/front/api/',
    timeout:1000,
    headers:{'content-type': 'application/json'}
});

var getDataFromServer = function(vmObj){
    var args = {
        "keyword":"",
        "pageSize":15,
        "today":0,
        "pageIndex":1
    };
    instance.post('/lecture/getLectureList',{'args':args})
        .then(function(res){
            console.log(res);
            var res = res.data.obj;
            vmObj.lectureArray = res.searchLectureList;
        })
};


var vm = new Vue({
    el: "#container",
    data: function () {
        return {
            activeIndex2:"1",
            backgroundArray:[
                {url:"../images/rotationChart.png"},
                {url:"../images/rotationChart.png"},
                {url:"../images/rotationChart.png"},
                {url:"../images/rotationChart.png"}
                ],
            lectureArray:[],
            rules: {

            },
            sels: [],
            total: null,
            tableData: [],

            // pageIndex: parseInt(page_index),
            // pageSize: parseInt(page_size),
            // pageSizesArr:PAGE_SIZE_ARR,
            // detailDialogFormVisible: false,
            // dialogLoading: true,
            // idList:[]
        }
    },
    created:function(){
      getDataFromServer(this);
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        enrollDetail: function (id) {
            console.log(id);
            localStorage.setItem('lectureId', id);
            location.replace('http://127.0.0.1:8882/html/chair');
        }
    }

});