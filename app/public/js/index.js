var instance = axios.create({
    baseURL:'http://www.mastercoco.com:7777/front/api/',
    timeout:1000,
    headers:{'content-type': 'application/json'}
});

var getDataFromServer = function(vmObj,dateTime){
    var args = {
        "keyword":"",
        "pageSize":0,
        "today":dateTime?dateTime:0,
        "pageIndex":0
    };
    instance.post('/lecture/getLectureList',{'args':args})
        .then(function(res){
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
                {url:"../public/images/rotationChart.png"},
                {url:"../public/images/rotationChart.png"},
                {url:"../public/images/rotationChart.png"},
                {url:"../public/images/rotationChart.png"}
                ],
            lectureArray:[],
            rules: {

            },
            sels: [],
            total: null,
            tableData: [],
            activeName: 'first',
            // pageIndex: parseInt(page_index),
            // pageSize: parseInt(page_size),
            // pageSizesArr:PAGE_SIZE_ARR,
            // detailDialogFormVisible: false,
            // dialogLoading: true,
            // idList:[]
        }
    },
    created:function(){
      this.tabClick();
    },
    methods: {
        backToIndex(){
            location.replace('/front/index');
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        enrollDetail: function (id) {
            localStorage.setItem('lectureId', id);
            location.replace('http://www.mastercoco.com:7777/front/chair');

        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        tabClick(){
            if(this.activeName === 'first')
            {
                var date = new Date().format("yyyy-MM-dd");
                getDataFromServer(this,date);
            }else if(this.activeName === 'second'){
                getDataFromServer(this,0);
            }
        }
    }
});



