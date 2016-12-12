//issues.js
//获取应用实例
var app = getApp();
Page({
  data: {
    title: '',
    content: '',
    info: '',
    imgs: [],
    Authorization: 'dG9rZW4gYWNlODhiYzQ2ODIwZTlhZTdmMjJkZDY3MzI4NzhiZWFhNWE3YzkzZA=='
  },
  onLoad: function(){
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        var info = '用户信息\r\n';
        info += '用户名：' + app._user.wx.nickName;
        info += '（' + app._user.we.info.name + '），';
        info += '手机型号：' + res.model;
        info += '（' + res.pixelRatio + '），';
        info += '微信版本号：' + res.version;
        _this.setData({
          info: info
        });
      }
    });
    wx.request({
      url: 'https://we.cqu.pt/api/upload/get_upload_token.php',
      // data: data,
      method: 'POST',
      success: function(res){
        console.log(res.data.data.token);
      }
    })
  },
  listenerTitle: function(e){
    this.setData({
      'title': e.detail.value
    });
  },
  listenerTextarea: function(e){
    this.setData({
      'content': e.detail.value
    });
  },
  choosePhoto: function() {
    wx.chooseImage({
      sourceType: ['album'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        app.showErrorModal('上传图片暂不可用', '提醒');
        // 上传图片
        // wx.uploadFile({
        //   url: 'http://up.qiniu.com',
        //   header: {
        //     'Content-Type': 'multipart/form-data'
        //   },
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData:{
        //     'user': 'test'
        //   },
        //   success: function(res){
        //     var data = res.data
        //     //do something
        //   }
        // });
      }
    });
  },
  submit: function(){
    var _this = this, header = {}, data = {};
    header['Authorization'] = app.util.base64.decode(_this.data.Authorization);
    data.title = _this.data.title;
    data.content = _this.data.content + '\r\n\r\n' + _this.data.info;
    wx.request({
      url: 'https://api.github.com/repos/lanshan-studio/wecqupt/issues',
      data: data,
      method: 'POST',
      header: header,
      success: function(res){
        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        console.log(res);
        // complete
      }
    })
  }
});