//ykt.js
//获取应用实例
var app = getApp();
Page({
  data: {
    showDetail: false,
    dict: [
      {x: "2015-04-24", y: 15},  
      {x: "2015-04-25", y: 13},  
      {x: "2015-04-26", y: 17},  
      {x: "2015-04-27", y: 20},  
      {x: "2015-04-28", y: 21}  
    ]
  },
  onLoad: function(){
    var _this = this;
    wx.request({
      url: "http://we.cqupt.edu.cn/api/get_yktcost.php",
      data: {
        yktID: "1636792"
      },
      success: function(res) {
        console.log(res);
        _this.setData({
          yktData: res.data.data
        });
      }
    });
  },
  onReady: function() {
   
    var dict = this.data.dict;
    
     //数据源提取  
    var len = dict.length,
        xArr = [],  // x轴坐标集
        yArr = [],  // 点集
        tmp_yArr = [];  
    for(var i = 0; i < len; i ++){  
        xArr.push((i + 0.5) * 70);  
        tmp_yArr.push(dict[i].y);  
    }  
    var tmp_minY = Math.min.apply(Math, tmp_yArr);//最小值  
    var tmp_maxY = Math.max.apply(Math, tmp_yArr);//最大值  
    if (tmp_maxY - tmp_minY <= 100) {  
        for(var i = 0; i < len; i++){  
            yArr.push(tmp_yArr[i] - tmp_minY + 50);//与最小的做比较  
        }  
    } else {//如果相差太大会导致图表不美观  
        for(var i = 0; i < len; i ++){  
           yArr.push(tmp_yArr[i] / 500);  
       }  
    }  
    var minY = Math.min.apply(Math, yArr);  
    var maxY = Math.max.apply(Math, yArr);  

    //canvas 
    var context = wx.createContext();
    //画折线  
    for(var i=0 ;i<len; i++){  
        var x = xArr[i];  
        var y = maxY - yArr[i] + minY;  
        if(i === 0){  
            context.moveTo(x, y);  
        }  
        else{  
            context.lineTo(x, y);  
        }  
    }  
    context.setStrokeStyle("#fadd7f");
    context.setFillStyle("#EA2000");
    context.moveTo(xArr[0] - 20, 130);
    context.lineTo(xArr[xArr.length - 1] + 20, 130); 

    context.moveTo(xArr[0] - 20, 130);
    context.lineTo(xArr[0] - 20, maxY - 170); 
    context.stroke();  
     
    //画点  
    for(var i = 0; i < len; i ++){  
        var x = xArr[i];              // 横坐标
        var y = maxY - yArr[i] + minY;// 纵坐标
        var xMemo = dict[i].x;        // 日期  
        var yMemo = "¥" + dict[i].y;  // 每日消费
        context.beginPath();   
          context.arc(x, y, 2, 0, 2*Math.PI);//画点  
          context.fill();  
          context.fillText(yMemo, x + 3, y - 10);  
          context.fillText(xMemo, x - 20, 150, 40);//画文字
        context.closePath();  
    }  
  
    // 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为
    wx.drawCanvas({
      canvasId: 'firstCanvas',
      actions: context.getActions() // 获取绘图动作数组
    });
  },
  // 展示学费详情
  slideDetail: function(e) {

    var showDetail = this.data.showDetail;
    this.setData({
      showDetail: !showDetail
    });
    
  }
  
});