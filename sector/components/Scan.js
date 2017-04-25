/**
 * Created by zero on 2017/4/25.
 */
define(['Sector'],function(sector){
  var Scan = function(canvasid,startRadius, endRadius, internalRadius,intervalTime,cover) { //画布id，开始扫描角度，结束扫描角度，扫描速度,扫描间隔，扫描覆盖角度
    var canvasid = canvasid || 'ppiCanvas',
      startRadius = startRadius || 120,
      endRadius = endRadius||240,
      internalRadius = internalRadius||100,
      cover = cover||30;
    var radar_romate_flag = 1,
      level = startRadius,
      starttime = new Date().getTime(),
      count = 0;
    function regularUpdateRadar() {
      count++;
      var offset = new Date().getTime() - (starttime + count * intervalTime);
      var nexttime = intervalTime - offset;
      if(nexttime<0) {
        nexttime = 0;
        starttime = new Date().getTime();
        count = 0;
      }
      if (radar_romate_flag) {
        if (level  < endRadius-cover) {
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
      var a = new sector.Sector(canvasid, level,cover);
      a.draw();
      setTimeout(regularUpdateRadar, nexttime)
    }
    setTimeout(regularUpdateRadar,intervalTime);
  };
  return {
    Scan:Scan
  }
});