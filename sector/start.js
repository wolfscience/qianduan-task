/**
 * Created by fuwu2 on 2017/4/21.
 * */

  var EventUtil = {
    addHandler:function(element,type,handler){
        if(element.addEventListener){
            element.addEventListener(type,handler,false);
        } else if(element.attachEvent){
            element.attachEvent("on"+type,handler);
        } else{
            element["on"+type] = handler;
        }
    },
    removeHandler:function(element,type,handler){
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            element.detachEvent("on" + type,handler);
        }else{
            element["on"+type] = null;
        }
    }
};

(function() {
  function Scan(startRadius, endRadius, internalRadius,intervalTime) { //开始扫描角度，结束扫描角度，扫描速度
    var radar_romate_flag = 1,
        level = startRadius,
        starttime = new Date().getTime(),
        count = 0;
    function regularUpdateRadar() {
      count++;
      var offset = new Date().getTime() - (starttime + count * intervalTime);
      var nexttime = intervalTime - offset;
      if(nexttime<0) nexttime = 0;
      if (radar_romate_flag) {
        if (level < endRadius) {
          level = level + internalRadius;
        } else {
          radar_romate_flag = 0;
        }
      } else {
        if (level > startRadius) {
          level = level - internalRadius;
        } else {
          radar_romate_flag = 1;
        }
      }
      var a = new Sector('ppiCanvas', level);
      a.draw();
      setTimeout(regularUpdateRadar, nexttime)
    }
    setTimeout(regularUpdateRadar,intervalTime);
  }
  window.Scan = Scan;
})();

EventUtil.addHandler(document,"DOMContentLoaded",function(){
    drawArc();
    Scan(120,210,3,100);
});