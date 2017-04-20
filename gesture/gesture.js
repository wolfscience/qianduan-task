/**
 * Created by zero on 2017/3/27.
 */
$(document).ready(function(){
    $("[data-role='content']").css("background-color","#CCCCCC");
    var CanvasCircle = new mycanvas(30,30,29);
    CanvasCircle.init();
});

/*手势密码组件,参数分别代表X、Y方向上的间距，圆圈的半径*/
function mycanvas(offsetX,offsetY,circleR){
    var CircleCenter = [],  //记录圆心相对坐标
        intervalX,  //画布X方向上两圆间隔
        intervalY,  //画布Y方向上两圆间隔
        intervalTime = 500,//操作完成0.5秒后初始化界面
        paddiffx = parseInt($("[data-role = 'content']").css("padding-left")), //父元素横向内边距
        paddiffy = parseInt($("[data-role = 'content']").css("padding-top")),  //父元素顶部内边距
        headdiff = $("[data-role = 'header']").get(0).offsetHeight, //header高度
        canvasWidth = document.body.offsetWidth-paddiffx*2, //画布宽度
        canvasHeight,  //画布高度
        settingNum = 0;   //判断设置密码时，是初次还是二次
    intervalX = (canvasWidth - 2*offsetX - 6*circleR)/2;
    intervalY = intervalX;
    canvasHeight = 2*offsetY + 6*circleR + 2*intervalY;
    this.init = function(){  //初始化函数，包括canvas创建、事件绑定等
        $("#drawing").css("height",canvasHeight);
        var drawing = document.getElementById("drawing");
        var mycanvas = document.createElement("canvas");
        if(mycanvas.getContext){
            drawing.appendChild(mycanvas); //底层画布，用于画圆
            mycanvas.width = canvasWidth;
            mycanvas.height = canvasHeight;
            mycanvas.style.zIndex = 0;
            mycanvas.style.position = "absolute";

            var linecanvas = document.createElement("canvas"); //顶层画布，用于画线
            drawing.appendChild(linecanvas);
            linecanvas.width = canvasWidth;
            linecanvas.height = canvasHeight;
            linecanvas.style.zIndex = 1;
            linecanvas.style.position = "absolute";

            for(var row=0;row<3;row++){         //初始化圆心，CircleCenter数组
                for(var col=0;col<3;col++){
                    var center = {
                        X:offsetX + (2*col+1)*circleR + col*intervalX,
                        Y:offsetY + (2*row+1)*circleR + row*intervalY
                    };
                    CircleCenter.push(center);
                }
            }
            InitCircle();   //初始化图形
            initEvent(linecanvas,linecanvas.getContext("2d")); //绑定事件
        }else{

            drawing.html("抱歉，浏览器不支持canvas");
        }
     };

    //给顶层画布绑定触控监听事件
    function initEvent(mycanvas,cxt){
         var op;   //单选框的内容,表示正在进行的操作
         var $p = $("[data-role='content'] :nth-child(2)"); //文字提示栏
         var selectCenter = []; //一次触控操作选中的密码
         var firstSelect = []; //设置密码第一步成功时，设置的密码
         var localpsw;  //localStorahe中存储的密码
         mycanvas.addEventListener("touchstart",function(e){
             op = $("input[name='op']:checked").val();
             if(op == "verify") {
                 localpsw = localStorage.password.split(",");
                 if(typeof localpsw == "undefined"){
                     $p.html("请先设置密码");
                 }
             }
             InitCircle();
             IsCenterSelect(e.touches[0], selectCenter);
         },false);
         mycanvas.addEventListener("touchmove",function(e){
             e.preventDefault();
             var touches = e.touches[0];
             IsCenterSelect(touches,selectCenter);
             cxt.clearRect(0,0,canvasWidth,canvasHeight);
             Draw(cxt,selectCenter,{X:touches.pageX,Y:touches.pageY});
         },false);
         mycanvas.addEventListener("touchend",function(e){
             op = $("input[name='op']:checked").val();
             if(op == "setting"){
                 cxt.clearRect(0,0,canvasWidth,canvasHeight);
                 Draw(cxt,selectCenter,null);
                 var len = selectCenter.length;
                 if(len < 5){
                     $p.html("密码太短，至少需要5个点");
                 }else{
                     if(settingNum == 0){
                         settingNum = 1;
                         $p.html("请再次输入手势密码");
                         firstSelect = selectCenter.concat();
                     } else{
                         settingNum = 0;
                         if(firstSelect.length!=len){
                             firstSelect = [];
                             $p.html("两次输入的不一致");
                         }else{
                             for(var i=0;i<len;i++){
                                 if(selectCenter[i]!=firstSelect[i]){
                                     break;
                                 }
                             }
                             if(i!=len){
                                 firstSelect = [];
                                 $p.html("两次输入的不一致");
                             }else{
                                 $p.html("密码设置成功");
                                 firstSelect = [];
                                 localStorage.password = selectCenter;
                             }
                         }
                         setTimeout(function(){$p.html("请输入手势密码")},intervalTime);
                     }
                 }
             }else{
                 localpsw = localStorage.password.split(",");
                 if(typeof  localpsw != "undefined"){
                     var pswLen = localpsw.length;
                     if(pswLen!=selectCenter.length){
                         $p.html("输入的密码不正确");
                     }
                     else{
                         for(i=0;i<pswLen;i++){
                             if(localpsw[i]!=selectCenter[i]){
                                 break;
                             }
                         }
                         if(i!=pswLen){
                             $p.html("输入的密码不正确");
                         }else{
                             $p.html("密码正确！");
                             setTimeout(function(){$p.html("请输入手势密码")},intervalTime);
                         }
                     }
                 }
             }
             setTimeout(InitCircle,intervalTime);
             selectCenter = []; //一次操作完成，清空选中的圆圈
         },false);
    }

    //初始化图形，参数为null表示执行界面初始化，不为null则底图变为9个全白的圆圈。
    function InitCircle(){
        var cxt = $("#drawing :first-child").get(0).getContext("2d");
        var cxt_line = $("#drawing :nth-child(2)").get(0).getContext("2d");
        cxt.clearRect(0,0,canvasWidth,canvasHeight);
        cxt_line.clearRect(0,0,canvasWidth,canvasHeight);
        for(var i=0;i<9;i++){  //将圆圈画成白色
            cxt.beginPath();
            cxt.lineWidth = 1;
            cxt.arc(CircleCenter[i].X,CircleCenter[i].Y,circleR,0,360,false);
            cxt.fillStyle="white";
            cxt.fill();//画实心圆
            cxt.arc(CircleCenter[i].X,CircleCenter[i].Y,circleR+1,0,360,false);
            cxt.strokeStyle="gray";
            cxt.stroke();
            cxt.closePath();
        }
    }

    //判断触摸点是否在圆内，在则加入selectCenter数组中
    function IsCenterSelect(touches,selectCenter)
    {
        for (var i = 0; i < 9; i++) {
            var centerPoint = CircleCenter[i];
            var xdiff = Math.abs(centerPoint.X - touches.pageX+paddiffx); //x轴上的差值，touches的坐标为绝对坐标，需转化为相对坐标
            var ydiff = Math.abs(centerPoint.Y - touches.pageY+headdiff+paddiffy); //y轴上的差值，坐标处理如x轴
            var dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);  //相差距离
            if (dir < circleR ) {
                if(selectCenter.indexOf(i) < 0){ selectCenter.push(i);}
                break;
            }
        }
    }

    //执行画手势密码操作
    function Draw(cxt,selectCenter,touchPoint){
        if (selectCenter.length > 0) {
            cxt.beginPath();
            for (var i = 0; i < selectCenter.length; i++) {
                var pointIndex = selectCenter[i];
                cxt.lineTo(CircleCenter[pointIndex].X,CircleCenter[pointIndex].Y);
                var cxt_circle=$("#drawing :first-child").get(0).getContext("2d"); //选中的圈变色
                cxt_circle.beginPath();
                cxt_circle.arc(CircleCenter[pointIndex].X,CircleCenter[pointIndex].Y,circleR,0,360,false);
                cxt_circle.fillStyle="orange";//填充颜色
                cxt_circle.fill();//画实心圆
                cxt_circle.arc(CircleCenter[pointIndex].X,CircleCenter[pointIndex].Y,circleR,0,360,false);
                cxt_circle.strokeStyle="red";
                cxt_circle.stroke();
                cxt_circle.closePath();
            }
            cxt.lineWidth = 2;
            cxt.strokeStyle = "red";
            cxt.stroke();
            cxt.closePath();
            if(touchPoint!=null)
            {
                var lastPointIndex=selectCenter[selectCenter.length-1];
                var lastPoint=CircleCenter[lastPointIndex];
                cxt.beginPath();
                cxt.moveTo(lastPoint.X,lastPoint.Y);
                cxt.lineTo(touchPoint.X-paddiffx,touchPoint.Y-paddiffy-headdiff);
                cxt.stroke();
                cxt.closePath();
            }
        }
    }
};
