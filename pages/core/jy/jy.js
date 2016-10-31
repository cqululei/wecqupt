//jy.js
//获取应用实例
var app = getApp();
Page({
  data: {
    jyData: []
  },
  onLoad: function() {
    var _this = this;
    wx.request({
      url: "http://we.cqupt.edu.cn/api/get_booklist.php",
      data: {
        yktID: "1636792"
      },
      success: function(res) {
        console.log(res);
        _this.setData({
          jyData: res.data.data
        });
      console.log(res.data.data);
        
      }
    });
  }

 
});