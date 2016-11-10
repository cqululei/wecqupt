//news.js
//获取应用实例
var app = getApp();
Page({
  data: {
    page: 0,
    list: [
      { id: 0, 'type': 'all', name: '头条', url: 'get_newslist.php' },
      { id: 1, 'type': 'jw', name: '教务公告', url: 'news/jwgg_list.php' },
      { id: 2, 'type': 'oa', name: 'OA公告', url: 'news/oa_list.php' },
      { id: 3, 'type': 'hy', name: '会议通知', url: 'news/hytz_list.php' },
      { id: 4, 'type': 'jz', name: '学术讲座', url: 'news/xsjz_list.php' },
      { id: 5, 'type': 'new', name: '综合新闻', url: 'news/zhxw_list.php' },
    ],
    'active': {
      'type': 'all',
      data: []
    }
  },
  onLoad: function(){
    app.showLoadToast();
    this.getNewsList(0);
  },
  getNewsList: function(newsTpyeId){
    var _this = this;
    _this.setData({
      'page': _this.data.page + 1
    });
    //获取资讯列表
    wx.request({
      url: app._server + '/api/' + _this.data.list[newsTpyeId].url,
      data: {
        page: _this.data.page
      },
      success: function(res) {
        _this.setData({
          'active.data': _this.data.active.data.concat(res.data.data)
        });
        wx.hideToast();
      }
    });
  },
  changeFilter: function(e){
    this.setData({
      'active.type': e.target.id,
      'active.data': [],
      'page': 0
    });
    app.showLoadToast();
    this.getNewsList(e.target.dataset.id);
  }
});