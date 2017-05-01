初版：
画布分两层，两层画布的位置、z-index需要自己写css设定，position均为absolute，位置重叠，一个上层、一个下层

下层画布画同心圆，文件为drawArc.js，调用函数drawArc，参数为雷达探测范围、画布id

上层画布画扇形，文件为sector.js，创建Sector实例，调用Sector原型下的draw方法画扇形

扫描效果由start.js实现，创建了一个跨浏览器的DOM2级事件监听器，在DOMContentLoaded事件（即jquery中的$(document）.ready)触发时，画同心圆，开始扫描。
扫描函数为Scan(canvasid,startRadius, endRadius, internalRadius,intervalTime,cover)
canvasid表示画扇形的画布id
startRadius表示扫描开始角度
endRadius表示扫描结束角度
internalRadius表示每次变化角度
intervalTime表示每次变化时间间隔
cover表示扇形覆盖角度
（角度为以正北方向为0度角，顺时针角度）
Scan函数中利用setTimeout调用regularUpdateRadar函数实现来回扫描效果，
由于计时器实际使用过程中会出现偏差越来越大的情况，所以函数内部实现了粗略的校准功能

模块化：
引入require.js函数，实现AMD模块化，目录为
sector
  components
    drawArc.js
    Scan.js
    sector.js
  lib
    require.js
  pages
    index.js
  RadarScan.html
index.js为入口文件，触发模块加载完成的回调函数

localtest2

