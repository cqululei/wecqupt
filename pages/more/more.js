//more.js
//获取应用实例
var app = getApp();
Page({
  data: {
    user: {}
  },
  //下拉更新
  onPullDownRefresh: function(){
    this.getData();
  },
  onLoad: function(){
    this.getData();
  },
  getData: function(){
    var _this = this;
    _this.setData({
      'user': app._user,
      'is_bind': !!app._user.is_bind
    });
    wx.stopPullDownRefresh();
  }
});