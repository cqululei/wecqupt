//cj.js
//获取应用实例
var app = getApp();
Page({
  data: {
    cjInfo : [

    ],
    xqNum : {
      grade: '',
      semester: ''
    },
    xqName : {
      grade: '',
      semester: ''
    }
  },
  onLoad: function(){
    var _this = this;
    _this.setData({
      id: app._user.xs.xh,
      name: app._user.xs.name
    });
    app.showLoadToast();
    wx.request({
      url: app._server + "/api/get_kscj.php",
      data: {
        xh: app._user.xs.xh,
        sfzh: app._user.xs.sfz_h6
      },
      success: function(res) {

        var _data = res.data.data;

        var term = _data[0].term;
        var xh = _data[0].xh;
        var year = term.slice(0,4);
        var semester = term.slice(4);
        var yearIn = xh.slice(0,4);
        var xqName_grade = changeNum(year - yearIn + 1);
        var xqName_semester = (semester == 1) ? '上' : '下';
        var xqName = {
          grade: xqName_grade,
          semester: xqName_semester,
          term: term
        };
        
        _this.setData({
          cjInfo: _data,
          xqName: xqName
        });

      },
      complete: function(){
        wx.hideToast();
      }
    });

    function changeNum(num){  
      var china = new Array('零','一','二','三','四','五','六','七','八','九');  
      var arr = new Array();  
      var n = ''.split.call(num,''); 
      for(var i = 0; i < n.length; i++){  
        arr[i] = china[n[i]];  
      }  
      return arr.join("")  
    }  


  }
});