//ykt.js
//获取应用实例
var app = getApp();
Page({
  data: {
      showDetail: false,
      dict: []   
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
          dict: res.data.data
        });
       
        //数据源提取  
        var dict = res.data.data.slice(0, 10).reverse();  
        console.log(dict);      
        var len = dict.length,
            xArr = [],  // x轴坐标集
            yArr = [],  // 点集
            tmp_yArr = [], // 余额
            spaceX = 37; // 表示横坐标的间隔距离
        for(var i = 0; i < len; i ++){  

            // 横坐标          
            xArr.push(i * spaceX);  

            // 纵坐标
            tmp_yArr.push(dict[i].balance); 
        }  
       
       // 余额的最大最小值
        var tmp_minY = Math.min.apply(Math, tmp_yArr);  
        var tmp_maxY = Math.max.apply(Math, tmp_yArr);

        //canvas 
        var context = wx.createContext();
        
        var canvasWidth = 800,
            canvasHeight = 300,
            gridMarginTop = 15, // 折线图上距离
            gridMarginLeft = 20, // 折线图左距离
            gridNum = 5;
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        var spaceYe = (tmp_maxY - tmp_minY) / gridNum,     
            spaceY = (canvasHeight - gridMarginTop) / gridNum; 
          console.log(spaceY);
        var options = {
            canvasWidth: canvasWidth,    // 矩形宽度
            canvasHeight: canvasHeight,   // 矩形高度
            gridMarginTop: 15,   // 折线图上距离
            gridMarginLeft: 20,  // 折线图左距离 
            xArr: xArr,          // 横坐标
            tmp_yArr: tmp_yArr,  // 点集
            gridNum: gridNum,          // 横网格线数量
            tmp_minY: tmp_minY,  // 余额最小值
            tmp_maxY: tmp_maxY,  // 余额最大值
            context: context,    // canvas上下文
            spaceYe: spaceYe,
            spaceY: spaceY,
            len: len,            // 数据数组长度
            yArr: yArr,
            spaceX: spaceX
        };

        /*
        * 绘制横轴&纵轴&网格线
        */
        _this.drawLineXY(options);

        /*
        * 描点连线
        */
        _this.drawPointLine(options);
       
        wx.drawCanvas({
          canvasId: "firstCanvas",
          actions: context.getActions() // 获取绘图动作数组
        });
        
      }
    });
  },

  // 绘制横轴&纵轴&网格线
  drawLineXY: function(options) {
      var context = options.context,
          gridMarginLeft = options.gridMarginLeft,
          gridMarginTop = options.gridMarginTop,
          canvasHeight = options.canvasHeight,
          canvasWidth = options.canvasWidth,
          xArr = options.xArr,
          gridNum = options.gridNum,
          tmp_minY = options.tmp_minY,
          tmp_maxY = options.tmp_maxY,
          spaceYe = options.spaceYe,
          spaceY = options.spaceY;
      /*
      * 绘制横轴和纵轴
      */        
      context.setStrokeStyle("#E4E4E4");
      context.setFillStyle("#E4E4E4");
      context.beginPath();
        context.moveTo(xArr[0] + gridMarginLeft, canvasHeight);
        context.lineTo(xArr[xArr.length - 1] + gridMarginLeft, canvasHeight);
      context.beginPath();
        context.moveTo(xArr[0] + gridMarginLeft, canvasHeight);
        context.lineTo(xArr[0] + gridMarginLeft, gridMarginTop); 
        context.stroke();  
      context.closePath();        

      /*
       * 余额纵坐标&横网格线
       * gridNum: 横网格线条数,设置为5条线
       * spaceY: 横网格间距
       * spaceYe: 纵轴余额的金额间隔
      */
          
      // 绘制横网格      
      for (var i = 0; i <= gridNum; i ++) {

        // 纵轴金额
        var numY = Math.round(tmp_minY + spaceYe * i);
        
        context.beginPath();          
          context.fillText(numY, xArr[0] + 5, canvasHeight - spaceY * i);
          context.moveTo(xArr[0] + gridMarginLeft, canvasHeight - spaceY * i);
          context.lineTo(xArr[xArr.length - 1] + gridMarginLeft, canvasHeight - spaceY * i);
          context.stroke();
        context.closePath(); 
      }       

      // 绘制竖网格
      for (var i = 0; i < xArr.length; i ++) {
        context.beginPath();          
          context.moveTo(xArr[i] + gridMarginLeft, canvasHeight);
          context.lineTo(xArr[i] + gridMarginLeft, gridMarginTop);
          context.stroke();
        context.closePath();
      }
  },

  // 描点&连线
  drawPointLine: function(options) {
    var context = options.context,
        yArr = options.yArr,
        gridMarginLeft = options.gridMarginLeft,
        gridMarginTop = options.gridMarginTop,
        canvasHeight = options.canvasHeight,
        canvasWidth = options.canvasWidth,
        xArr = options.xArr,
        gridNum = options.gridNum,
        tmp_minY = options.tmp_minY,
        tmp_maxY = options.tmp_maxY,
        spaceYe = options.spaceYe,
        spaceY = options.spaceY,
        tmp_yArr = options.tmp_yArr,
        len = options.len,
        spaceX = options.spaceX

    /* 
    * 点集的纵坐标
    * 根据网格间距/余额间距的比例算出点的对应纵坐标
    */
    for(var i = 0; i < len; i++){  
      yArr.push((tmp_yArr[i] - tmp_minY)*spaceY/spaceYe);
    } 

    /* 
    * 描点连线
    */  
    context.setStrokeStyle("#fadd7f");
    context.setFillStyle("#fadd7f");

    // 连折线
    for(var i=0 ;i < len - 1; i++){  
        var x = xArr[i];                 
        context.beginPath();
          context.moveTo(gridMarginLeft + i * spaceX, canvasHeight-yArr[i]);
          context.lineTo(xArr[i + 1] + gridMarginLeft, canvasHeight-yArr[i + 1]);
          context.stroke();          
        context.closePath();
    }   
        
    //描点  
    context.setStrokeStyle("#EA2000");
    context.setFillStyle("#EA2000");
    for(var i = 0; i < len; i ++){  
      var x     = xArr[i] + 20,           // 横坐标
          y     = canvasHeight-yArr[i]   // 纵坐标         

      context.beginPath();   
        context.arc(x, y, 2, 0, 2*Math.PI); // 画点              
        context.fill();  
        context.fillText(tmp_yArr[i], x, y - 5);  // 消费金额
        context.fillText(i + 1, x, canvasHeight + 10); // 消费次数(横轴)              
      context.closePath();

      // pointArr.push({
      //   x: x,
      //   y: y
      // }); 
    }  
  },
  
  // 展示学费详情
  slideDetail: function(e) {

    var showDetail = this.data.showDetail;
    this.setData({
      showDetail: !showDetail
    });    
  },

  canvasTap: function(e) {              
    
    this.data.canvasFun(e);
  }
  
});