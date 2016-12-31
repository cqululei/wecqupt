//about.js
//获取应用实例
var app = getApp();
Page({
  data: {
    version: '',
    showLog: false
  },
  onLoad: function(){
    this.setData({
      version: app.version
    });
  },
  toggleLog: function(){
    this.setData({
      showLog: !this.data.showLog
    });
  }
});