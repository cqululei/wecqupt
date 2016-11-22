//detail.js (common)
var app = getApp();
module.exports.ipage = {
  data: {
    remind: "加载中",
    title: "",    // 新闻标题
    date: "",     // 发布日期
    author: "",   // 发布作者
    reading: "",   // 阅读量
    content: "",  // 新闻内容
    file: false,  // 附件，true or false
    size: "",     // 附件大小
    fileName: "", // 附件名称
    fileSource: ""// 附件来源
  },

  convertHtmlToText: function(inputText){
        var returnText = "" + inputText;
        returnText = returnText.replace(/&mdash/gi,'-').replace(/&ldquo/gi,'“').replace(/&rdquo/gi,'”');
        return returnText;
  },
  
  onLoad: function(options){
    var _this = this;

    if(!options.type || !options.id) {
      app.showErrorModal('404');
      _this.setData({
        remind: '404'
      });
      return false;
    }

    wx.request({
      url: app._server + '/api/get_news_detail.php',
      data: options,
      success: function(res){
          console.log(res.data);
        if(res.data.status === 200){
          var info = res.data.data;
          // 提取信息中的时间，作者，阅读量
          var author_info = [];
          if(info.author){
            var author_info = info.author.split(' ').map(function(e){
              return e.split(':')[1];
            });
          }
          _this.setData({
            date: author_info[0] || info.time || "",  // 发布日期
            author: author_info[1] || "",     // 发布作者
            reading: author_info[2] || "",    // 阅读量
            title: info.title,            //新闻标题
            content: _this.convertHtmlToText(info.body),  // 新闻内容
            remind: ''
          })

          // 如果存在附件则提取附件里面的信息
          if(info.fjlist && info.fjlist.length){
            var fjlist = info.fjlist;
            
            wx.downloadFile({
              url: fjlist.flink, //仅为示例，并非真实的资源
              success: function(res) {
                wx.getSavedFileInfo({
                  filePath: res.tempFilePath, //仅做示例用，非真正的文件路径
                  success: function(res) {
                    // 解析文件大小的函数
                      function bytesToSize(bytes) {
                          if (bytes === 0) return '0 B';
                          var k = 1000, // or 1024
                              sizes = ['B', 'KB', 'MB', 'GB'],
                              i = Math.floor(Math.log(bytes) / Math.log(k));
                        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
                      }
                    var size = bytesToSize(res.size);
                    _this.setData({
                      "file": true,
                      'size': size,  // 附件大小
                      'fileName': fjlist.fjtitle, // 附件名称
                      'fileSource': "oa公告"
                    });
                  }
                })
              }
            })
          }
          
        }else{
          app.showErrorModal(res.data.message);
          _this.setData({
            remind: res.data.message || '未知错误'
          });
        }
      },
      fail: function(){
        app.showErrorModal(res.errMsg);
        _this.setData({
          remind: '网络错误'
        });
      }
    })
  }
};