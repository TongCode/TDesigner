/**
 * App控件
 * Created by Daniel on 16-4-7.
 */


function TongApp(){

    this.titleHeight = 25;
    this.borderWidth = 5;

    this.drag = true;

    this.text = "我是一个APP";

    var self = this;

    var backGroundBrush = new Brush("#FFA500");
    backGroundBrush.shadowColor="#ccc";

    var contentBrush = new Brush("#FFF");

    //子元素管理
    this.controls = [];

    //绘制函数
    this.paint = function(g){
        //绘制元素
        g.fillRect(backGroundBrush,this.x,this.y,this.width,this.height);
        //绘制内容区
        this.bodyX = this.x + this.borderWidth;
        this.bodyY = this.y + this.titleHeight;
        this.bodyWidth = this.width - this.borderWidth * 2;
        this.bodyHeight = this.height - this.borderWidth - this.titleHeight;
        g.fillRect(contentBrush,this.bodyX,this.bodyY,this.bodyWidth,this.bodyHeight);

        drawAppName(g);

        //绘制焦点
        if(this.isfocus){
            drawPointer(g);
        }

        //绘制子元素
        for(var i = 0,len = this.controls.length;i<len;i++){
            var controlItem = this.controls[i];
            try{
                controlItem.paint(g);
            }catch(ex){
                console.log("子元素["+controlItem.name+"]绘制异常：",ex);
            }
        }
    }

    /**
     * 判断指定坐标是否在有效范围
     * @param x
     * @param y
     */
    this.pointExists = function(x,y){
        var hasRect = x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
        return hasRect;
    }

    //绘制控制点
    function drawPointer(g){
        var brush = tongDesigner.pointerBrush;
        g.drawRect(tongDesigner.pointerPen,self.x, self.y,self.width, self.height);
        var pointWidth = 6;
        var pointOffset = pointWidth / 2;
        if(self.height > 50){
            g.fillRect(brush,self.x-pointOffset, self.y-pointOffset,pointWidth,pointWidth);//左上
            g.fillRect(brush,self.x + self.width - pointOffset, self.y-pointOffset,pointWidth,pointWidth);//右上
            g.fillRect(brush,self.x-pointOffset, self.y + self.height-pointOffset,pointWidth,pointWidth);//左下
            g.fillRect(brush,self.x + self.width - pointOffset, self.y + self.height-pointOffset,pointWidth,pointWidth);//右下
        }

        g.fillRect(brush,self.x + self.width / 2 - pointOffset, self.y-pointOffset,pointWidth,pointWidth);//上中
        g.fillRect(brush,self.x + self.width - pointOffset, self.y + self.height / 2 - pointOffset,pointWidth,pointWidth);//右中
        g.fillRect(brush,self.x + self.width / 2 - pointOffset, self.y + self.height - pointOffset,pointWidth,pointWidth);//下中
        g.fillRect(brush,self.x - pointOffset, self.y + self.height / 2 - pointOffset,pointWidth,pointWidth);//左中
    }

    //绘制App标题
    var titleFont = new Font("微软幼圆","14px","#336699");
    function drawAppName(g){
        if(self.text != null && self.text !== undefined){
            //计算文字高度
            g.fillText(self.text,titleFont,self.x + 10,self.y + 8);
        }
    }

    //元素事件处理
    //默认鼠标进入
//    this.onmouseover = function(e){
//        console.log("鼠标移入元素："+this.name+","+this.id);
//    }
//
//    //默认鼠标移出
//    this.onmouseout = function(e){
//        console.log("鼠标移出元素："+this.name+","+this.id);
//    }
//
//      this.onclick = function(e){
//          console.log(this.name+"被单机！");
//      }
//
//      this.onmousedown = function(e){
//          console.log(this.name+"被按下！");
//      }
//
//      this.onmouseup = function(e){
//          console.log(this.name+"抬起")
//      }
//        this.ondragbegin = function(e){
//            console.log(this.name+"开始拖动");
//        }
//
//        this.ondragend = function(e){
//            console.log(this.name+"结束拖动");
//        }

//
//    return{
//        paint:paint
//    }
}


TongApp.prototype = new IControl();
/**
 * 添加Source元素
 * @param control
 */
TongApp.prototype.addSource = function(control){
    if(control == null) return;

    var name = control.name;
    if(name == null || name === undefined) throw new Error("控件无效的Name值");

    var controlItem = this.getControl(name);
    if(controlItem == null){
//        this.controls[name]=control;
//        control.id = + new Date();
        control.id = guid.id();
        control.parent = this;

        //定制组件位置
        control.y = this.bodyHeight / 2 - control.height / 2;
        control.x = 10;

        this.controls.push(control);
        this.parent.paint();//App的重绘？不会导致整个层的重绘
    }else{
        throw new Error("Name值为："+name+"的控件已经存在！");
    }
}

/**
 * 添加DGF组件
 * @param control
 */
TongApp.prototype.addDGF = function(control){
    if(control == null) return;

    var name = control.name;
    if(name == null || name === undefined) throw new Error("控件无效的Name值");

    var controlItem = this.getControl(name);
    if(controlItem == null){
//        control.id = + new Date();
        control.id = guid.id();
        control.parent = this;

        //定制组件位置
        control.y = this.bodyHeight / 2 - control.height / 2;
        control.x = this.bodyWidth / 2 - control.width / 2;

        this.controls.push(control);
        this.parent.paint();//App的重绘？不会导致整个层的重绘
    }else{
        throw new Error("Name值为："+name+"的控件已经存在！");
    }
}

/**
 * 添加Sink组件
 * @param control
 */
TongApp.prototype.addSink = function(control){
    if(control == null) return;

    var name = control.name;
    if(name == null || name === undefined) throw new Error("控件无效的Name值");

    var controlItem = this.getControl(name);
    if(controlItem == null){
//        control.id = + new Date();
        control.id = guid.id();
        control.parent = this;

        //定制组件位置
        control.y = this.bodyHeight / 2 - control.height / 2;
        control.x = this.bodyWidth - control.width - 10;

        this.controls.push(control);
        this.parent.paint();//App的重绘？不会导致整个层的重绘
    }else{
        throw new Error("Name值为："+name+"的控件已经存在！");
    }
}

TongApp.prototype.addControl = function(control){
    if(control == null) return;

    var name = control.name;
    if(name == null || name === undefined) throw new Error("控件无效的Name值");

    var controlItem = this.getControl(name);
    if(controlItem == null){
        control.id = guid.id();
        control.parent = this;
        this.controls.push(control);
        this.parent.paint();
    }else{
        throw new Error("Name值为："+name+"的控件已经存在！");
    }
}

/**
 * 获取指定坐标的元素
 * @param x
 * @param y
 */
//TongApp.prototype.findControl = function(x,y){
//    if(this.controls.length > 0){
//        for(var i = this.controls.length - 1; i>=0 ;i--){
//            var controlItem = this.controls[i];
//            if(controlItem.pointExists(x,y)){
//                return controlItem;
//            }
//        }
//    }
//    return null;
//}

/**
 * 根据元素名称获取元素
 * @param name
 * @returns {*}
 */
TongApp.prototype.getControl = function(name){
    for(var i = 0,len = this.controls.length;i<len;i++){
        var controlItem = this.controls[i];
        if(controlItem.name == name)
            return controlItem;
    }
    return null;
}