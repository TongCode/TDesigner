/**
 * 基础组件
 * Created by Daniel on 16-4-13.
 */

function TongBaseComponent(){
    var self = this;
//
//    this.drag = false;

    this.backGroundBrush = new Brush("#009999");

    /**
     * 判断指定坐标是否在有效范围
     * @param x
     * @param y
     */
    this.pointExists = function(x,y){
        var hasRect = x >= this.getGX()
                    && x <= this.getGWidth()
                    && y >= this.getGY()
                    && y <= this.getGHeight();
        return hasRect;
    }

    this.getGX = function(){
        return this.parent.x + this.parent.borderWidth + this.x;
    }

    this.getGWidth = function(){
        return this.getGX() + this.width;
    }

    this.getGY = function(){
        return this.parent.y + this.parent.titleHeight + this.y;
    }

    this.getGHeight = function(){
        return this.getGY() + this.height
    }

    //绘制控制点
    this.handlePoints = [];

    this.drawPointer = function(g){
        var brush = tongDesigner.linkPointerBrush;
        var gx = this.getGX();
        var gy = this.getGY();
        var gw = this.width;
        var gh = this.height;

        //g.drawRect(tongDesigner.pointerPen,gx,gy ,gw,gh);



//        g.fillRect(brush,gx + gw / 2 - pointOffset, gy - pointOffset,pointWidth,pointWidth);//上中
//        g.fillRect(brush,gx + gw - pointOffset, gy + gh / 2 - pointOffset,pointWidth,pointWidth);//右中
//        g.fillRect(brush,gx + gw / 2 - pointOffset, gy + gh - pointOffset,pointWidth,pointWidth);//下中
//        g.fillRect(brush,gx - pointOffset, gy + gh / 2 - pointOffset,pointWidth,pointWidth);//左中

        for(var i = 0, len = this.handlePoints.length; i < len; i++){
            var rectItem = this.handlePoints[i];
            g.fillRect(brush,rectItem.x, rectItem.y, rectItem.w, rectItem.h);
        }

        //自定义图形的绘制

    }

    //创建连接控制柄位置
    this.drawLinkPoint = function(e){
        //绘制连接△

    }
}

TongBaseComponent.prototype = new IControl();

/**
 * 绘制元素
 * @param g
 */
TongBaseComponent.prototype.paint = function(g){

    var gx = this.getGX();
    var gy = this.getGY();
    var gw = this.width;
    var gh = this.height;

    var self = this;
    if(this.image == null){
        imageLoad.load(this.imageUrl,function(image){
            self.image = image;
            g.drawImage(image, gx, gy, gw, gh);
        })
    }else{
        g.drawImage(this.image, gx, gy, gw, gh);
    }

    //g.fillRect(this.backGroundBrush,this.parent.x + this.parent.borderWidth + this.x,this.parent.y + this.parent.titleHeight + this.y,this.width,this.height);


    var pointWidth = 8;
    var pointOffset = pointWidth / 2;

    //更新句柄位置
    this.handlePoints[0] = {id:this.handleEnum.W, x:gx + gw - pointOffset, y:gy + gh / 2 - pointOffset, w:pointWidth, h:pointWidth};
    this.handlePoints[1] = {id:this.handleEnum.E, x:gx - pointOffset, y:gy + gh / 2 - pointOffset, w:pointWidth, h:pointWidth};

    //绘制焦点
    if(this.isfocus){
        this.drawPointer(g);
    }
}

/**
 * 获取控制柄坐标
 * @param id
 * @returns {*}
 */
TongBaseComponent.prototype.getHandlePoint = function(id){
    for(var i = 0, len = this.handlePoints.length; i < len; i++){
        var rectItem = this.handlePoints[i];
        if(rectItem.id == id){
            return rectItem;
        }
    }
    return null;
}

/**
 * 判断是否在控制柄中
 * @param x
 * @param y
 * @returns {*}
 */
TongBaseComponent.prototype.handleExists = function(x, y){
    console.log("控制点坐标检测："+this.name+":::"+x+","+y+",",this.handlePoints);
    for(var i = 0, len = this.handlePoints.length; i < len; i++){
        var rectItem = this.handlePoints[i];
        console.log("控制点坐标比较：x="+rectItem.x+","+(rectItem.x + rectItem.w)+",y="+rectItem.y+","+(rectItem.y + rectItem.h)+","+"<>"+x+","+y);
        if(x >= rectItem.x && x <= rectItem.x + rectItem.w && y >= rectItem.y && y <= rectItem.y + rectItem.h){
            //封装控制点事件
            return {id:rectItem.id, x:x, y:y};
        }
    }
    return null;
}