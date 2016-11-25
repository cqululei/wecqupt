//append.js
//获取应用实例
var app = getApp();
Page({
  data: {
    buildings: ['请选择寝室楼栋', '1栋'], // picker-range
    ibuilding: 0,  // picker-index
    room_focus: false,
    sfz_focus: false
  },
  onLoad: function(){

  },
  buildingPicker: function(e) {
    this.setData({
      ibuilding: e.detail.value
    });
  },
  inputFocus: function(e){
    if(e.target.id == 'room'){
      this.setData({
        'room_focus': true
      });
    }else if(e.target.id == 'sfz'){
      this.setData({
        'sfz_focus': true
      });
    }
  },
  inputBlur: function(e){
    if(e.target.id == 'room'){
      this.setData({
        'room_focus': false
      });
    }else if(e.target.id == 'sfz'){
      this.setData({
        'sfz_focus': false
      });
    }
  },
});