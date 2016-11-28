//bx.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    list: [],
    process_state: {
      '未审核': 'waited',
      '未受理': 'waited',
      '已受理': 'accepted',
      '已派出': 'dispatched',
      '已完工': 'finished',
      '驳回': 'refused'
    }
  },
  //下拉更新
  onPullDownRefresh: function(){
    this.getData();
  },
  onLoad: function(){
    this.getData();
  },
  getData: function(){
    var that = this;
    if(!app._user.xs.ykth){
      app.showErrorModal('未绑定');
      that.setData({
        remind: '未绑定'
      });
      return false;
    }
    // 发送请求
    wx.request({
      url: app._server + "/api/bx/get_repair_list.php", 
      data: {
        "yktID": app._user.xs.ykth
      },
      success: function(res) {

        if(res.data.status === 200) {
          var list = res.data.data;
          if(!list || !list.length){
            that.setData({
              'remind': '无申报记录'
            });
          }else{
            for(var i = 0, len = list.length; i < len; i++) {
              list[i].state = that.data.process_state[list[i].wx_wxztm];
            }
            that.setData({
              'list': list,
              'remind': ''
            });
          }
        }else{
          app.showErrorModal(res.data.message);
          that.setData({
            remind: res.data.message || '未知错误'
          });
        }
      },
      fail: function(res) {
        app.showErrorModal(res.errMsg);
        that.setData({
          remind: '网络错误'
        });
      },
      complete: function(){
        wx.stopPullDownRefresh();
      }
    });
  }
  
});

