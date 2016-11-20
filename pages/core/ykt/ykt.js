//ykt.js
//获取应用实例
var app = getApp();
Page({
  data: {
      count: 12,         // 展示的消费次数
      width: 0,          // 画布宽
      height: 300,       // 画布高
      showDetail: false, // 详情show
      dict: [],          // 所有消费数据
      points: [],        // 余额点的集合
      tapDetail: {},     // 每个点对应的详情集合
      lineLeft: -5,      // 详情垂直线的初始左边距
      gridMarginLeft: 20,
      balance: 0 
  },
  onLoad: function(){
      var _this = this;
      wx.getSystemInfo({
          success: function(res) {
              _this.data.width = res.windowWidth;
          }
      });
      wx.request({
          url: app._server + "/api/get_yktcost.php",
          data: {
              yktID: "1636792"
          },
          success: function(res) {

              var data = res.data.data.slice(0, _this.data.count).reverse();
              _this.setData({
                  dict: data,
                  balance: data[data.length - 1].balance
              });
              console.log(_this.data.balance);

              /*
              * 获取最近12次的消费数据绘制折线图
              **/
              var dict = _this.data.dict;              
              console.log(dict);
              var len = dict.length,
                  xArr = [],           // x轴坐标
                  yArr = [],           // 余额点在画布中的纵坐标
                  tmp_yArr = [],       // 余额
                  canvasWidth = _this.data.width,
                  spaceX = (canvasWidth-2*_this.data.gridMarginLeft)/(_this.data.count-1),   // 表示横坐标的间隔距离
                  canvasHeight = _this.data.height,
                  gridMarginTop = 15,  // 折线图上距离
                  gridMarginLeft = _this.data.gridMarginLeft, // 折线图左距离
                  gridNum = 5;

              // 余额&横坐标
              for(var i = 0; i < len; i ++){  
                  xArr.push(i * spaceX);  
                  tmp_yArr.push(dict[i].balance); 
              }  

              //canvas 
              var context = wx.createContext();
              var options = {
                  canvasWidth: canvasWidth,     // 矩形宽度
                  canvasHeight: canvasHeight,   // 矩形高度
                  gridMarginTop: 15,            // 折线图上距离
                  gridMarginLeft: 20,           // 折线图左距离 
                  xArr: xArr,                   // 横坐标
                  tmp_yArr: tmp_yArr,           // 点集
                  gridNum: gridNum,             // 横网格线数量
                  context: context,             // canvas上下文
                  len: len,                     // 数据数组长度
                  yArr: yArr,
                  spaceX: spaceX
              };
              context.clearRect(0, 0, canvasWidth, canvasHeight);

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
                  actions: context.getActions(), // 获取绘图动作数组
                  reserve: true
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
          tmp_yArr = options.tmp_yArr,
          gridNum = options.gridNum;
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
       * tmp_minY: 余额的最小值
       * tmp_maxY: 余额的最大值
      */
      var tmp_minY = Math.min.apply(Math, tmp_yArr), 
          tmp_maxY = Math.max.apply(Math, tmp_yArr),
          spaceYe = (tmp_maxY - tmp_minY) / gridNum,     
          spaceY = (canvasHeight - gridMarginTop) / gridNum;

      // 绘制竖网格
      for (var i = 0; i < xArr.length; i ++) {
          context.beginPath();          
              context.moveTo(xArr[i] + gridMarginLeft, canvasHeight);
              context.lineTo(xArr[i] + gridMarginLeft, gridMarginTop);
              context.stroke();
          context.closePath();
      }
           
      // 绘制横网格&纵轴金额  
      for (var i = 0; i <= gridNum; i ++) {
          var numY = 0;
          // 纵轴金额
          if (i === 0) {
              numY = 0;
          } else {
              numY = Math.round(tmp_minY + spaceYe * i);   
          }               
          context.beginPath();
            context.moveTo(xArr[0] + gridMarginLeft, canvasHeight - spaceY * i);
            context.lineTo(xArr[xArr.length - 1] + gridMarginLeft, canvasHeight - spaceY * i);
            context.stroke();
          context.closePath(); 

          context.setFillStyle("#EA2000");
          context.beginPath();
            context.fillText(numY, xArr[0] + 5, canvasHeight - spaceY * i);
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
          tmp_yArr = options.tmp_yArr,
          len = options.len,
          spaceX = options.spaceX;
    
      var pointArr = [];

      /* 
      * 点集的纵坐标
      * 根据网格间距/余额间距的比例算出点的对应纵坐标
      * spaceY: 横网格间距
      * spaceYe: 纵轴余额的金额间隔
      * tmp_minY: 余额的最小值
      * tmp_maxY: 余额的最大值
      * yArr: 点在画布中的纵坐标
      */
      var tmp_minY = Math.min.apply(Math, tmp_yArr), 
          tmp_maxY = Math.max.apply(Math, tmp_yArr),
          spaceYe = (tmp_maxY - tmp_minY) / gridNum,     
          spaceY = (canvasHeight - gridMarginTop) / gridNum;
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
          var x = xArr[i] + gridMarginLeft,           // 横坐标
              y = canvasHeight-yArr[i]   // 纵坐标         

          context.beginPath();   
              context.arc(x, y, 2, 0, 2*Math.PI); // 画点              
              context.fill();  
              context.fillText(tmp_yArr[i], x, y - 5);  // 消费金额
              context.fillText(i + 1, x, canvasHeight + 10); // 消费次数(横轴)              
          context.closePath();

          // 将点在画布中的坐标&消费详情存入数组
          pointArr.push({
              x: x,
              y: y,
              detail: this.data.dict[i]
          });
      }  
      this.setData({
          points: pointArr,
          tapDetail: pointArr[this.data.count - 1].detail
      });
  },

  // 触摸详情
  canvasTap: function(e) {      

      // 手指在画布中的坐标        
      var tapX = e.detail.x,
          tapY = e.detail.y,        
          pointsLen = this.data.points.length,
          points = this.data.points,
          diffX = 0,
          diffY = 0,
          _this = this;

      // 若手指与点距离小于10，则显示详情
      for (var i = 0; i < pointsLen; i ++) {
          diffX = Math.abs(tapX - points[i].x);
          diffY = Math.abs(tapY - points[i].y);
          if (diffX <= 10) {
              this.setData({
                  tapDetail: points[i].detail,
                  lineLeft: this.data.gridMarginLeft + (this.data.width-40)/(this.data.count-1)*i
              });            
            
          }             
      }
  },
  
  // 展示学费详情
  slideDetail: function(e) {

      var showDetail = this.data.showDetail;
      this.setData({
          showDetail: !showDetail
      });    
  }
  
});