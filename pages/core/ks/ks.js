//ks.js
//获取应用实例
var app = getApp();
Page({
  data: {
    ks: {
        ksName: '2016-2017年度上学期期末考试',
        stuId: '2014210172',
        stuName: '杨奇奇'
    },
    first: 1,
    class: [
        { id:'0', ksName: '通信原理A', ksDate: '2017-01-06', ksTime: '9:30-11.30', ksPlace: '三教3106', ksSeat: '28' },
        { id:'1', ksName: '通信原理A', ksDate: '2017-01-06', ksTime: '9:30-11.30', ksPlace: '三教3106', ksSeat: '28' },
        { id:'2', ksName: '通信原理A', ksDate: '2017-01-06', ksTime: '9:30-11.30', ksPlace: '三教3106', ksSeat: '28' }
    ]
  },
  togglePage: function (e) {
    var id = e.currentTarget.id, data = {};
    data.show = [];
    console.log(this.data.class.length);
    for (var i = 0, len = this.data.class.length; i < len; i++) {
        data.show[i] = false;
    }
    if(this.data.first){
      this.setData(data);
      this.data.first = 0;
    }
    data.show[id] = !this.data.show[id];
    this.setData(data);
  },
  onLoad: function(){

  }
});
