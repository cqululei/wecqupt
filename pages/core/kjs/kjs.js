//kjs.js
//获取应用实例
var app = getApp();

// 定义常量数据
var WEEK_DATA = ['', '第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周', '第八周', '第九周', '第十周', '第十一周', '第十二周', '第十三周', '第十四周', '第十五周', '第十六周', '第十七周', '第十八周', '第十九周', '第二十周'],
    DAY_DATA = ['', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    CLASSTIME_DATA = [{time: '1-2', index: '1@2'}, {time: '3-4', index: '3@4'},  {time: '5-6', index: '5@6'}, {time: '7-8', index: '7@8'}, {time: '9-10', index: '9@10'}, {time: '11-12', index: '11@12'}],
    BUILDING_DATA = ['', '', '二教', '三教', '四教', '五教', '', '', '八教', '其他'];


// 发送请求的函数
function sendRequest(requestData){

  var that = this;

  // 对成功进行处理
  function doSuccess(data) {

    that.setData({
      'testData': data
    });
  }

  // 对失败进行处理
  function doFail(err) {

    that.setData({
      'errObj.errorDisplay': false,
      'errObj.status': err.status,
      'errObj.errorMessage': err.message
    });
  }

  // 发送请求
  wx.request({
    url: 'http://we.cqupt.edu.cn/api/get_empty_room.php', 
    data: requestData,
    header: {
        'Content-Type': 'application/json'
    },
    success: function(res) {
      doSuccess(res.data.data);
    },
    fail: function(err) {
      doFail(err);
    }
  });
}


Page({
  data: {
    DATA: {
      WEEK_DATA: WEEK_DATA,
      DAY_DATA: DAY_DATA,
      CLASSTIME_DATA: CLASSTIME_DATA,
      BUILDING_DATA: BUILDING_DATA,
    },
    requestData: { // 发送请求的数据对象 初始为默认值
      weekNo: '1',
      weekDay: '1',
      buildingNo: '2',
      classNo: '1@2',
    },
    errObj: {
      errorDisplay: true,
      status: 500,
      errorMessage: ''
    },
    conditionSigns: { // 保存即时被点击选中的条件的显示的标识对象
      weekSign: 1,
      daySign: 1,
      classTimeSign: '1@2',
      buildingSign: 2
    },
    testData: null
  },

  // week
  chooseWeek: function (e) {
    
    var index = parseInt(e.target.dataset.weekno, 10);

    this.setData({
      'requestData.weekNo': index,
      'conditionSigns.weekSign': index
    });
  },

  weekTap: function (e) {

  },

  // day
  chooseDay: function (e) {

    var index = parseInt(e.target.dataset.dayno, 10);

    this.setData({
      'requestData.dayNo': index,
      'conditionSigns.daySign': index
    });
  },

  dayTap: function (e) {

  },

  // classTime
  chooseClaasTime: function (e) {
    
    var index = e.target.dataset.classno;

    this.setData({
      'requestData.classNo': index,
      'conditionSigns.classTimeSign': index
    });
  },

  classTimeTap: function (e) {

  },

  // building
  chooseBuilding: function (e) {
    
    var index = parseInt(e.target.dataset.buildingno, 10);

    this.setData({
      'requestData.buildingNo': index,
      'conditionSigns.buildingSign': index
    });
  },

  buildingTap: function (e) {

  },


  // query
  catchQuery: function () {

    // 函数节流实现函数
    function trottle(method, context, arr) {
      
      clearTimeout(method.timer);
      method.timer = setTimeout(function () {
        method.apply(context, arr);
      },1000);
    } 

    trottle(sendRequest, this, [ this.data.requestData ]);

    return false;
  },


  onReady: function(){

    sendRequest.apply(this, [ this.data.requestData ]);
  }
});