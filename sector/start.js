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

function Scan(startRadius,endRadius,internalRadius){ //开始扫描角度，结束扫描角度，扫描速度
    var radar_romate_flag = 1;
    var timer_scan;
    level = startRadius;
    function regularUpdateRadar () {
        if(radar_romate_flag){
            if(level<endRadius) {
                level = level +internalRadius;
            } else {
                radar_romate_flag = 0;
            }
        } else{
            if(level>startRadius){
                level = level -internalRadius;
            }else {
                radar_romate_flag = 1;
            }
        }
        var a = new Sector('ppiCanvas');
        a.draw();
    }
    timer_scan = setInterval(regularUpdateRadar,100);
    return timer_scan;
}

EventUtil.addHandler(document,"DOMContentLoaded",function(){
    drawArc();
    var timer_scan = Scan(120,210,3);  //可通过通过清除计数器停止扫描
});