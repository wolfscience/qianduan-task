/**
 * Created by fuwu2 on 2017/4/20.
 */
//传入图层名称
(function(){
  //计算外部点集
  function pathMethods(t, cx, cy, radius, start, end) {
    var point = (end - start) * t + start;
    var ret = [
      (Math.cos(point) * radius) + cx,
      (Math.sin(point) * radius) + cy
    ];
    ret.angle = point;
    ret.t = t;
    return ret;
  }
  var argIfRadius = [0, 0, 0, 1, 1, 0]; //参数是否是角度

  function Sector(canvas,level,cover) {
    var cover = cover || 30; // 扇形覆盖宽度 ，0-360
    var canvasR = document.getElementById (canvas).height;
    var d = {
        width: canvasR,
        height: canvasR,
        pointDistance: 1/(Math.abs(cover)),
        strokeColor: 'rgba(75, 152, 78, 0.5)',
        drawline: function(point, index) {  //画扫描线
            var cx = canvasR/2,
                cy = canvasR/2,
                _ = this._,
                angle = (Math.PI/180) * (point.progress * 360),
                innerRadius = index;
            _.beginPath();
            _.moveTo(point.x, point.y);
            _.lineTo(
                (Math.cos(angle) * innerRadius) + cx,
                (Math.sin(angle) * innerRadius) + cy
            );
            //_.closePath();
            _.stroke();
        },
        path: [
            [canvasR/2, canvasR/2, canvasR/2, level-90, level-90+cover] //扫描参数，分别为中心点x坐标，y坐标，扇形长度，起始角度，结束角度
        ]
    };
    this.id = canvas;
    this.data = d.path;
    this.pointDistance = d.pointDistance;
    this.strokeColor = d.strokeColor || '#FFF';
    this.drawlineMethod = d.drawline;
    this.width = d.width;    //画布宽度
    this.height = d.height; //画布高度
    this.canvas = document.getElementById(this.id);
    this._ = this.canvas.getContext('2d');
    this.setup();
  }
  Sector.prototype = {
    /*初始化，创建points*/
    setup: function() {
      var args,
        type,
        value,
        data = this.data;
      this.points = []; //外部点集
      for (var i = -1, l = data.length; ++i < l;) {
        args = data[i];
        for (var a = -1, al = args.length; ++a < al;) {
          type = argIfRadius[a];
          value = args[a];
          switch (type) {
            case 1:
              value *= Math.PI/180;
              break;
            default :
              break;
          }
          args[a] = value;
        }
        args.unshift(0);
        for (var r, pd = this.pointDistance, t = pd; t <= 1; t += pd) {
          t = Math.round(t*1/pd) / (1/pd);
          args[0] = t;
          r = pathMethods.apply(null,args);
          this.points.push({
            x: r[0],
            y: r[1],
            progress: t
          });
        }
      }
    },

    //定义扫描线属性
    prep: function() {
      this._.clearRect(0, 0, this.width, this.height);
      var points = this.points,
        pointsLength = points.length,
        pd = this.pointDistance,
        point;
      for (var i = -1, l = pointsLength; ++i < l;) {
        point = points[i];
        if (!point) continue;
        this.alpha = Math.round(1000*(i/(l-1)))/1000;
        this._.lineWidth = 3;
        this._.globalAlpha = 1 - this.alpha;
        this._.strokeStyle = this.strokeColor;
        indexD = i/(l-1);
        this.drawlineMethod(point, indexD);
      }
      return 0;
    },
    //画扇形
    draw: function() {
      var hoc = this;
      hoc.prep();
    }
   }
   window.Sector = Sector;
})();
