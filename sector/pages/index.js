/**
 * Created by zero on 2017/4/25.
 */
requirejs.config({
  baseUrl:"./",
  paths:{
    drawArc:"./components/drawArc",
    Sector:"./components/sector",
    Scan:"./components/Scan"
  }
});

require(['drawArc','Scan'],function(drawArc,Scan){
         drawArc.drawArc();
         Scan.Scan('ppiCanvas',120,240,3,100,30);
});