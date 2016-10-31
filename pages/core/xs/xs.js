//xs.js
//获取应用实例
var app = getApp();

var testData = [
      {
        name: 'demo1',
        stuId: '1234567891',
        gendor: '男',
        classId: '01020304',
        major: '电子专业',
        college: '通信',
        headImg: ''
      },
      {
        name: 'demo2',
        stuId: '5555555555',
        gendor: '女',
        classId: '01020304',
        major: '电子专业',
        college: '通信',
        headImg: ''
      },
      {
        name: 'demo3',
        stuId: '9989878989',
        gendor: '男',
        classId: '01020304',
        major: '电子专业',
        college: '通信',
        headImg: ''
      }
    ];

// 对数据进行加工
function doData(data) {

  for (var i = 0, len = data.length; i < len; i++) {

    data[ i ].display = false;
    data[ i ].headImg = data[ i ].headImg || '/images/core/xs/default-head-img.png';
  }

  return data;
}

// 搜索
function search(dataString) {

  var result = [],
      i = 0,
      len = testData.length,
      reg = new RegExp(dataString),
      data = doData(testData);

  for (i = 0;i < len; i++) {
    
    if (data[ i ].stuId.match(reg)) {
      data[ i ].activeName = dataString;
      result.push(data[ i ]);
    }
  } 

  return result;
}

Page({
  data: {
    header: {
      searchChange: true, // input获取焦点的变化标识
      inputValue: ''
    },
    main: {
     // display: false, // 触发下拉列表的变化标识 和 额外信息下拉列表的变化标识
      mainDisplay: true // main 显示的变化标识
    },
    testData: null
  },

  // header
  bindSearchTap: function () {
    this.setData({
      'header.searchChange': false
    });
  },

  bindKeyChange: function (e) {
    this.setData({
       'header.inputValue': e.detail.value
    });

    var that = this;

    setTimeout(function () {

    var testData = search(e.detail.value);
    that.setData({
      'testData': testData,
      'main.mainDisplay': false
    });
    console.log(testData);
    }, 200);
  },

  bindCancelSearchTap: function (e) {
     this.setData({
      'header.searchChange': true,
      'header.inputValue': '',
      'main.mainDisplay': true
    });
  },

  // main
  bindOpenList: function (e) {

    var index = parseInt(e.currentTarget.dataset.index, 10),
        curData = testData[ index ],
        strObjFalse = '{"testData[' + index +'].display": false}',
        strObjTrue = '{"testData[' + index +'].display": true}';
    
    strObjFalse = JSON.parse(strObjFalse);
    strObjTrue = JSON.parse(strObjTrue);

    if (curData.display) {
      
      curData.display = false;
      this.setData(strObjFalse);
    }
    else {
      
      curData.display = true;
      this.setData(strObjTrue);

    }
  },

  onReady: function () {

  }
});