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
        var info = '---\r\n用户信息\r\n';
        info += '用户名：' + app._user.wx.nickName;
        if(app._user.we.type){
          info += '（' + app._user.we.type + '-' + app._user.we.info.name + '-' + app._user.we.info.id + '）';
        }
        info += '\r\n手机型号：' + res.model;
        info += '（' +res.windowWidth+'x'+res.windowHeight+ '）';
        info += '\r\n微信版本号：' + res.version;
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
    if(!_this.data.title){
      app.showErrorModal('请输入反馈标题', '反馈失败');
      return false;
    }
    if(!_this.data.content){
      app.showErrorModal('请输入反馈内容', '反馈失败');
      return false;
    }
    data.title = '【' + app._user.wx.nickName + '】' + _this.data.title;
    data.body = _this.data.content + '\r\n\r\n' + _this.data.info;
    app.showLoadToast();
    wx.request({
      url: 'https://api.github.com/repos/lanshan-studio/wecqupt/issues',
      data: data,
      method: 'POST',
      header: header,
      success: function(res){
        var text = '反馈成功，您可通过访问 ' + res.data.html_url + ' 了解反馈动态';
        wx.showModal({
          title: '反馈成功',
          content: text,
          showCancel: false,
          success: function(res) {
            wx.navigateBack();
          }
        });
      },
      fail: function(res) {
        app.showErrorModal(res.errMsg);
      },
      complete: function() {
        wx.hideToast();
      }
    })
  }
});