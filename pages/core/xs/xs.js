//xs.js
//获取应用实例
var app = getApp();

Page({
  data: {
    header: {
      searchChange: true, // input获取焦点的变化标识
      inputValue: ''
    },
    main: {
      mainDisplay: true // main 显示的变化标识
    },
    testData: null,
    errObj: { // 不合法输入和查询失败的提示信息展示对象
      errorDisplay: true,
      errorMessage: '' ,
      errorInputValue: ''
    }
  },

  // header——最优
  bindSearchTap: function () {
    this.setData({
      'header.searchChange': false
    });
  },

  bindKeyInput: function (e) {

    var that = this,
        inputValue = e.detail.value,
        errorDisplay = false,
        errorMessage = '',
        errorInputValue = '',
        reDdata = null,
        numberSign = false; // 用户输入的是姓名还是学号的标识
      
    // 消除字符串首尾的空格
    function trim(str) {

      return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    inputValue = trim(inputValue);

    // 抽离对errObj的设置成一个单独的函数
    function setErrorObj(errorDisplay, errorMessage, errorInputValue) {

      that.setData({
        'errObj.errorDisplay': errorDisplay,
        'errObj.errorMessage': errorMessage,
        'errObj.errorInputValue': errorInputValue
      });
    }

    // 对输入的是空格或未进行输入进行处理
    if (inputValue === '') {

      setErrorObj(false, '输入无效!', '空格或无输入');
      this.setData({
        'main.mainDisplay': true
      });

      return false;
    }

    // 防止注入攻击
    function checkData(v) {

        var temp = v;
          
        v = v.replace(/\\|\/|\.|\'|\"|\<|\>/g, function (str) { return ''; });
        v = trim(v);

        errorDisplay = v.length < temp.length ? false : true;
        errorMessage = '请勿输入非法字符!';
        errorInputValue = temp;

        return v;
    }

    // 对输入进行过滤
    inputValue = checkData(inputValue);

    setErrorObj(errorDisplay, errorMessage, errorInputValue);
    this.setData({
       'header.inputValue': inputValue
    });

    // 存在非法输入只会提示错误消息而不会发送搜索请求
    if (errorDisplay === false) { 
      return false;
    }

    // 对输入类型进行处理 inputValue:String / to Number(10位)
    if (typeof parseInt(inputValue, 10) === 'number') {

      if (inputValue.length < 10) {

        setErrorObj(false, '请输入正确的姓名或学号.', inputValue);

        return false;
      }

      numberSign = true;
    }

    // 截取前十个字符 防止手动修改长度限制
    inputValue = inputValue.substr(0, 10);

    // 处理成功返回的数据
    function doSuccess(data, errorDisplay) {

      // 对数据进行自定义加工 给每个数据对象添加一些自定义属性
      function doData(data) {

        var curData = null,
            curXm = null,
            len = data.length;

        // 若查询没有查出结果，则直接显示提示信息并退出
        if (len === 0) {
          doFail();
          return false;
        }

        // 对名字的匹配部分进行高亮划分
        function doXm(str, xm) {

          var activeName = '',
              arrXm = xm.split(''),
              strIndex = xm.indexOf(str),
              strLength = str.length;

          activeName = xm.substr(strIndex, strLength);
          arrXm.splice(strIndex, strLength);
          xm = arrXm.join('');

          return {
            activeName: activeName || '',
            xm: xm || ''
          };
        }

        for (var i = 0; i < len; i++) {

          curData = data[ i ];
          curXm = numberSign ? curData.xm : doXm(inputValue, curData.xm);
          curData.display = false; // 添加控制隐藏列表信息显示的标识
          curData.headImg = curData.headImg || '/images/core/xs/default-head-img.png'; 
          curData.activeName =  curXm.activeName || '';
          curData.xm =  curXm.xm || curXm;
        }

        return data;
      }
     
      reDdata = doData(data);
      
      // 若reDdata===false, 查询没有结果
      if (reDdata === false) {
        return false;
      }
      
      that.setData({
        'testData': reDdata,
        'main.mainDisplay': false,
        'errObj.errorDisplay': errorDisplay
      });

    }

    // 处理没找到搜索到结果或错误情况
    function doFail(err) {

      var errorMessage = typeof err === 'undefined' ? '未搜索到相关信息.' : err.key;
      
      setErrorObj(false, errorMessage, inputValue);
      that.setData({
        'main.mainDisplay': true
      });
    }

    // 函数节流实现函数
    function trottle(method, context) {
      
      clearTimeout(method.timer);
      method.timer = setTimeout(function () {
        method.apply(context);
      },1000);
    } 

    trottle(function () {

      wx.request({
        url: 'http://we.cqupt.edu.cn/api/get_student_info.php', 
        data: {
          key: inputValue
        },
        header: {
            'Content-Type': 'application/json'
        },
        success: function(res) {

          doSuccess(res.data.data.rows, true);
        },
        fail: function(err) {

          doFail(err);
        }
      });

    }, this);

  },

  // 取消搜索——最优
  bindCancelSearchTap: function () {
    
     this.setData({
      'header.searchChange': true,
      'header.inputValue': '',
      'main.mainDisplay': true,
      'errObj.errorDisplay': true
    });
  },

  // main——最优
  bindOpenList: function (e) {

    var index = parseInt(e.currentTarget.dataset.index, 10),
        testData = this.data.testData,
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