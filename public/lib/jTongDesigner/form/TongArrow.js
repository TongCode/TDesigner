/**
 * 箭头图形
 * Created by Daniel on 4/21/16.
 */

function TongArrow(){
    var self = this;

    this.drag = false;

    this.beginControl = null;
    this.beginHandlePoint = null;
    this.endControl = null;
    this.endHandlePoint = null;

    this.ex = this.ey = 0;

    this.linePen = new Pen("#666",2);

    //添加箭头模式， 向右，向左，双向
    this.mode = 2; //0   1    2

    var arrowRadius = 5;

    //绑定到指定元素，不只是元素，主要是元素的handlePoint
    this.bindBegin = function(control,id){
        this.beginControl = control;
        var handlePoint = control.getHandlePoint(id);
        this.beginHandlePoint = handlePoint;
        if(handlePoint!=null){
            this.x = handlePoint.x + handlePoint.w / 2;
            this.y = handlePoint.y + handlePoint.h / 2;
        }
    }

    this.bindEnd = function(control,id){
        this.endControl = control;
        var handlePoint = control.getHandlePoint(id);
        this.endHandlePoint = handlePoint;
        if(handlePoint!=null){
            this.ex = handlePoint.x + handlePoint.w / 2;
            this.ey = handlePoint.y + handlePoint.h / 2;
        }
    }

    this.paint = function(g){

//        var endX = this.x + this.width;
//        var endY = this.y + this.height;
        if(this.beginControl!=null){
            var handlePoint = this.beginControl.getHandlePoint(this.beginHandlePoint.id);
            this.x = handlePoint.x + handlePoint.w / 2;
            this.y = handlePoint.y + handlePoint.h / 2;
        }

        if(this.endControl!=null){
            var handlePoint = this.endControl.getHandlePoint(this.endHandlePoint.id);
            this.ex = handlePoint.x + handlePoint.w / 2;
            this.ey = handlePoint.y + handlePoint.h / 2;
        }

        g.drawLine(this.linePen,this.x,this.y,this.ex,this.ey);


        var tmpx = this.ex - this.x ;
        var tmpy = this.y - this.ey;
        var angle = Math.atan2(tmpy,tmpx)*(180/Math.PI);

        switch(this.mode){
            case 0:
                drawEndArrow(g,this.ex,this.ey,angle);
                break;
            case 1:
                drawBeginArrow(g,this.x,this.y,angle);
                break;
            case 2:
                drawBeginArrow(g,this.x,this.y,angle);
                drawEndArrow(g,this.ex,this.ey,angle);
                break;
        }


        //绘制焦点
        if(this.isfocus){
            this.drawPointer(g);
        }
    }

    //绘制控制点
    this.handlePoints = [];

    this.drawPointer = function(g){

//        var endX = this.x + this.width;
//        var endY = this.y + this.height;

        //g.drawRect(this.linePen,this.x, this.y, this.width, this.height);
        this.handlePoints[0] = {id:this.handleEnum.W, x:this.x, y:this.y, w:4, h:4};
        this.handlePoints[1] = {id:this.handleEnum.E, x:this.ex, y:this.ey, w:4, h:4};
//        this.handlePoints[1] = {id:this.handleEnum.E, x:endX, y:endY, w:4, h:4};

        for(var i = 0, len = this.handlePoints.length; i < len; i++){
            var rectItem = this.handlePoints[i];
            g.fillCircle(tongDesigner.linkPointerPen,rectItem.x,rectItem.y, 4);
        }
    }

    //绘制开始坐标的箭头
    function drawBeginArrow(g,x,y,angle){
        var centerX = x + arrowRadius * Math.cos(angle *(Math.PI/180)) ;
        var centerY = y - arrowRadius * Math.sin(angle *(Math.PI/180)) ;
        var leftX = centerX - arrowRadius * Math.cos((angle +120) *(Math.PI/180));
        var leftY = centerY + arrowRadius * Math.sin((angle +120) *(Math.PI/180));
        var rightX = centerX - arrowRadius * Math.cos((angle +240) *(Math.PI/180));
        var rightY = centerY + arrowRadius * Math.sin((angle +240) *(Math.PI/180));

//        g.fillCircle(tongDesigner.linkPointerPen,centerX,centerY, 2);
//        g.fillCircle(tongDesigner.linkPointerPen,leftX,leftY, 2);
//        g.fillCircle(tongDesigner.linkPointerPen,rightX,rightY, 2);
        g.fillPath(tongDesigner.pointerBrush,[{x:x,y:y},{x:leftX,y:leftY},{x:rightX,y:rightY}]);
    }

    //绘制结束坐标的箭头
    function drawEndArrow(g,x,y,angle){
        var centerX = x - arrowRadius * Math.cos(angle *(Math.PI/180)) ;
        var centerY = y + arrowRadius * Math.sin(angle *(Math.PI/180)) ;
        var leftX = centerX + arrowRadius * Math.cos((angle +120) *(Math.PI/180));
        var leftY = centerY - arrowRadius * Math.sin((angle +120) *(Math.PI/180));
        var rightX = centerX + arrowRadius * Math.cos((angle +240) *(Math.PI/180));
        var rightY = centerY - arrowRadius * Math.sin((angle +240) *(Math.PI/180));

//        g.fillCircle(tongDesigner.linkPointerPen,centerX,centerY, 2);
//        g.fillCircle(tongDesigner.linkPointerPen,leftX,leftY, 2);
//        g.fillCircle(tongDesigner.linkPointerPen,rightX,rightY, 2);
        g.fillPath(tongDesigner.pointerBrush,[{x:x,y:y},{x:leftX,y:leftY},{x:rightX,y:rightY}]);
    }

    //判断点是否在线上,水平，垂直，斜率
    this.pointExists = function(x,y){

        //获取矩形有效范围
        var minX = 0, minY = 0, maxX = 0, maxY = 0;

        if(this.x < this.ex){
            minX = this.x;
            maxX = this.ex;
        }else{
            minX = this.ex;
            maxX = this.x;
        }


        if(this.y < this.ey){
            minY = this.y;
            maxY = this.ey;
        }else{
            minY = this.ey;
            maxY = this.y;
        }

        //优先判断是否在矩形中
        var hasRect = x >= minX
            && x <= maxX
            && y >= minY
            && y <= maxY;

        if(!hasRect)//如果不在范围内，附带判断是否在控制点上
            hasRect = this.handleExists(x,y);

        return hasRect;
    }

    /**
     * 判断是否在控制点上，先矩形判断，后期需改为圆形判断
     * @param x
     * @param y
     * @returns {*}
     */
    this.handleExists = function(x, y){
        for(var i = 0, len = this.handlePoints.length; i < len; i++){
            var rectItem = this.handlePoints[i];
            if(x >= rectItem.x - 4 && x <= rectItem.x + rectItem.w + 4 && y >= rectItem.y - 4 && y <= rectItem.y + rectItem.h + 4){
                //封装控制点事件
                return {id:rectItem.id, x:x, y:y};
            }
        }
        return null;
    }

}

TongArrow.prototype = new IControl();