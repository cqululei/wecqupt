//kb.js
//获取应用实例
var app = getApp();
Page({
  data: {
    _current: 0,
    scroll: {
      top: 60,
      left: 300
    },
    blur: '',
    weeks : ['第一周','第二周','第三周','第四周','第五周','第六周','第七周','第八周','第九周','第十周','十一周','十二周','十三周','十四周','十五周','十六周','十七周','十八周','十九周','二十周']
  },
  onLoad: function(){
    var xh = "2014211418";
    this.get_kb(xh);
  },
  showDetail: function(e){
    var data = e.currentTarget.dataset;

    this.setData({
      tapTarget: {
        week : data.week,
        class: data.class
      },
      blur: 'blur',
      detail: 'detail'
    });
    var animation;
    var that = this;
    var _top = this.data.scroll.top,
        _left = this.data.scroll.left;
    function scrollAnimation() {
      if(_top==0&&_left==0){
          animation = null;
          return true;
      }
      if(_top < 10){
        _top = 0;
      } else {
        _top -= 10;
      }
      if(_left < 10){
        _left = 0;
      } else {
        _left -= 10;
      }

      that.setData({
        scroll: {
          top: _top,
          left: _left
        },
      });
      
      animation = requestAnimationFrame(scrollAnimation);
    }
    animation = requestAnimationFrame(scrollAnimation);
    console.log(e.target.dataset);
  },
  onScroll: function(e){
    this.setData({
      scroll: {
        top: e.detail.scrollTop,
        left: e.detail.scrollLeft
      },
    });
  },
  hideDetail: function(){
    if (this.data.blur != ''){
      this.setData({
        blur: '',
        detail: ''
      });
    }
  },
  currentChange: function(e){
    var current = e.detail.current
    this.setData({
      _current: current,
      week : current+1
    });
  },
  get_kb: function(xh){
    var _this = this;
    wx.request({
      url: "https://we.cqu.pt/api/get_kebiao.php",
      data: {
        xh: xh
      },
      success: function(res) {
        console.log(res);
        if (res.data.status == 200){

          var _data = res.data.data;

          var colors = ['red','green','purple','yellow'];
          var i,j,k,c=0;
          var colorsDic = {};
          var _lessons = [];

          for( i = 0 ; i < _data.lessons.length; i++){
            _lessons[i] = _data.lessons[i];
            for( j = 0; j < _lessons[i].length; j++){
              _lessons[i][j] = _data.lessons[i][j];
              for( k = 0; k < _lessons[i][j].length; k++){
                if(_lessons[i][j][k].class_id){
                  if (!colorsDic[_lessons[i][j][k].class_id]) {
                    if (i>0 && _lessons[i-1][j][k] && _lessons[i-1][j][k].color == colors[c]) {
                      c++;  // 与左边相同时改变颜色
                      if (c == 4) c = 0;
                    }
                    
                    colorsDic[_lessons[i][j][k].class_id] = colors[c];
                  }
                                   
                  _lessons[i][j][k].color = colorsDic[_lessons[i][j][k].class_id];
                  
                }
                c++; // k值相同不需要改变颜色
                if (c == 4) c = 0;
              }
            }
          }

          var day = _data.day;
          var week = _data.week;
          var mon = _data.lessons[0];
          var tue = _data.lessons[1];
          var wed = _data.lessons[2];
          var thu = _data.lessons[3];
          var fri = _data.lessons[4];
          var sat = _data.lessons[5];
          var sun = _data.lessons[6];
          var day_cn = '';

          switch(day){
            case '0': day_cn = '星期天';
                    break;
            case '1': day_cn = '星期一';
                    break;
            case '2': day_cn = '星期二';
                    break;
            case '3': day_cn = '星期三';
                    break;
            case '4': day_cn = '星期四';
                    break;
            case '5': day_cn = '星期五';
                    break;
            case '6': day_cn = '星期六';
                    break;

          }

          _this.setData({
            day : day,
            day_cn : day_cn,
            week : week,
            _current : week-1,
            lessons : _data.lessons,
            mon: mon,
            tue: tue,
            wed: wed,
            thu: thu,
            fri: fri,
            sat: sat,
            sun: sun,
            mon0 : mon[0],
            mon1 : mon[1],
            mon2 : mon[2],
            mon3 : mon[3],
            mon4 : mon[4],
            mon5 : mon[5],
            tue0 : tue[0],
            tue1 : tue[1],
            tue2 : tue[2],
            tue3 : tue[3],
            tue4 : tue[4],
            tue5 : tue[5],
            wed0 : wed[0],
            wed1 : wed[1],
            wed2 : wed[2],
            wed3 : wed[3],
            wed4 : wed[4],
            wed5 : wed[5],
            thu0 : thu[0],
            thu1 : thu[1],
            thu2 : thu[2],
            thu3 : thu[3],
            thu4 : thu[4],
            thu5 : thu[5],
            fri0 : fri[0],
            fri1 : fri[1],
            fri2 : fri[2],
            fri3 : fri[3],
            fri4 : fri[4],
            fri5 : fri[5],
            sat0 : sat[0],
            sat1 : sat[1],
            sat2 : sat[2],
            sat3 : sat[3],
            sat4 : sat[4],
            sat5 : sat[5],
            sun0 : sun[0],
            sun1 : sun[1],
            sun2 : sun[2],
            sun3 : sun[3],
            sun4 : sun[4],
            sun5 : sun[5],
          });
          
          console.log(_this.data);

        }

      }
    });
  }
});