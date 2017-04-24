/**
 * Created by fuwu2 on 2017/4/21.
 */
(function() {
  function drawArc(radarR_in,canvasId) {  //画圈

    var count = 6;
    var radarR_in = arguments[0] || 30000;
    if (count != 0) {
      var canvasId = canvasId || 'arcCanvas';
      var canvas = document.getElementById(canvasId);
      var canvasR = canvas.height;     //目前认为是正方形   只需要 R
      var ctx = canvas.getContext("2d");
      if (canvasR > 400) {
        ctx.font = "15px 宋体";
      } else {
        ctx.font = "10px 宋体";
        count = Math.ceil(count / 2);
      }

      var inter = Math.floor((canvasR - 1) / (2 * count));
      var txt = "";
      ctx.clearRect(0, 0, canvasR, canvasR);
      ctx.beginPath();
      ctx.strokeStyle = 'rgb(1, 204, 209)';
      ctx.fillStyle = 'rgb(1, 204, 209)';
      for (var i = 0; i <= count; i++) {
        if (i == 0) {
          ctx.arc((canvasR / 2), (canvasR / 2), 1, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
        } else {
          if (i == count) {
            txt = radarR_in + "m";
          } else {
            txt = Math.round((radarR_in / count) * i) + "m";
          }
          if (canvasR > 400) {
            ctx.fillText(txt, Math.round(canvasR / 2) - 20, (count - i) * inter + 20);
          } else {
            ctx.fillText(txt, Math.round(canvasR / 2) - 15, (count - i) * inter + 15);
          }

          ctx.moveTo((canvasR / 2) + i * inter, (canvasR / 2));
          ctx.arc((canvasR / 2), (canvasR / 2), i * inter, 0, 2 * Math.PI);

          ctx.stroke();
        }
      }
      ctx.closePath();
    }
  }
  window.drawArc = drawArc;
})();