/**
 * 事件处理
 * Created by Daniel on 16-4-8.
 */

function Handler(root,tdesigner){

    var self = this;

    this.root = root;
    this.jtd = tdesigner;

    this.debug = true;

//    this.eventTarget = null;//缓存已经出发的对象
//    this.eventCanvas = null;//缓存对象Canvas

    //鼠标点击事件
    var oldClickEvent = null;//记录点击历史？
    var clickName = "onclick";
    this.onclick = function(event){
        //事件转换
        event = event || window.event;
        var target = event.toElement || event.relatedTarget || event.srcElement || event.target;
        var mouseEvent = new MouseEvents(event,target,tdesigner);
        if(self.debug) console.log("点击元素：",mouseEvent.target);
        if(mouseEvent.target!=null){

            //缓存事件判断
            if(oldClickEvent == null || oldClickEvent.target.id != mouseEvent.target.id){

                if(oldClickEvent != null){
                    oldClickEvent.target.lostFocus();
                    if(self.debug) console.log("失去焦点："+oldClickEvent);
                }

                oldClickEvent = mouseEvent;

                //添加判断是否可以获取焦点
                if(self.debug) console.log("获取焦点开关："+mouseEvent.target.canfocus);
                if(mouseEvent.target.canfocus){
                    mouseEvent.target.focus();
                    mouseEvent.canvas.paint();
                    self.jtd.setCursor("move");
                }
            }

            //触发元素事件
            broadcast(mouseEvent.target,clickName,mouseEvent);

//            self.eventTarget = mouseEvent.target;
//            self.eventCanvas = mouseEvent.canvas;


        }
        else{
            if(oldClickEvent != null && oldClickEvent.target._focus){
                oldClickEvent.target.lostFocus();
                oldClickEvent.canvas.paint();
            }

            oldClickEvent = null;

//            if(self.eventTarget!=null)
//                self.eventTarget.lostFocus();
//
//            if(self.eventCanvas!=null)
//                self.eventCanvas.paint();
//
//            self.eventTarget = null;
//            self.eventCanvas = null;
        }


    }

    //鼠标移动事件，可以产生出鼠标移入、鼠标移除事件、拖动事件
    var oldMouseEvent = null;//记录点击历史？
    var mouseoverName = "onmouseover";
    var mouseoutName = "onmouseout";
    this.onmousemove = function(event){

        //事件转换
        event = event || window.event;
        var target = event.toElement || event.relatedTarget || event.srcElement || event.target;

        //添加拖动时选择器开关
        var mouseEvent = new MouseEvents(event,target,tdesigner,!isdrag);
        //拖动模式，重写事件源，放置筛选算法导致元素切换
        if(isdrag)
            mouseEvent.changeTarget({control:oldMouseDownUpEvent.target,canvas:oldMouseDownUpEvent.canvas});

        //获取当前可以处理的元素，如果是存在则触发进入事件
        if(mouseEvent.target!=null){
            //如果存在正在处理的元素对象，处理新元素的进入事件
            if(oldMouseEvent == null || oldMouseEvent.target.id != mouseEvent.target.id){
                if(oldMouseEvent != null)
                    broadcast(oldMouseEvent.target,mouseoutName,mouseEvent);

                oldMouseEvent = mouseEvent;
                broadcast(mouseEvent.target,mouseoverName,mouseEvent);
            }

            //判断是否是拖动
//            console.log("拖动监测：",isdrag,oldMouseDownUpEvent,mouseEvent.button,MouseButton.LeftButton);
            //添加元素只有在获得焦点之后才可拖动
            //添加元素可拖动标记
            //console.log("拖动权限监测："+mouseEvent.target.name+","+mouseEvent.target.drag+"比对"+(mouseEvent.target.drag && !isdrag && oldMouseDownUpEvent != null && mouseEvent.button == MouseButton.LeftButton && mouseEvent.target._focus)+"比对"+isdrag);
            if(mouseEvent.target.drag && !isdrag && oldMouseDownUpEvent != null && mouseEvent.button == MouseButton.LeftButton && mouseEvent.target._focus){
                //console.log("拖动开始..");
                //拖动开始
                isdrag = true;
                broadcast(oldMouseDownUpEvent,dragBeginName,mouseEvent);
            }
            //@2016-04-20 添加链接拖拽功能，判断是否在控制点上
//            else if(mouseEvent.target.canlink && !link && oldMouseDownUpEvent != null && mouseEvent.button == MouseButton.LeftButton && mouseEvent.target._focus){
//
//
//            }
            else if(isdrag  && mouseEvent.target._focus){
                //拖动处理
                //更新元素位置
                mouseEvent.target.x = mouseEvent.x - oldMouseDownUpEvent.offsetX;
                mouseEvent.target.y = mouseEvent.y - oldMouseDownUpEvent.offsetY;
                mouseEvent.canvas.paint();
            }

            //添加鼠标改变，如果鼠标移入的控件处于焦点状态,添加非拖拽模式下进行修改，拖拽中无需修改，减少代码执行
            if(!isdrag){
                if(mouseEvent.target._focus){
                    self.jtd.setCursor("move");
                }else{
                    //修复鼠标还原
                    self.jtd.setCursor("default");
                }
            }

//           if(self.eventTarget==null || self.eventTarget.id != mouseEvent.target.id){
//               if(self.eventTarget!=null){
//                   //self.eventTarget.onmouseout(mouseEvent);
//                   broadcast(self.eventTarget,mouseoutName,mouseEvent);
//               }
//                self.eventTarget = mouseEvent.target;
//                self.eventCanvas = mouseEvent.canvas;
////                mouseEvent.target.onmouseover(mouseEvent);
//               broadcast(mouseEvent.target,mouseoverName,mouseEvent);
//            }
        }else{
            //处理鼠标移出事件
            if(oldMouseEvent != null){
                broadcast(oldMouseEvent.target,mouseoutName,mouseEvent);
            }

            oldMouseEvent = null;
            self.jtd.setCursor("default");
//            if(self.eventTarget!=null)
//                broadcast(self.eventTarget,mouseoutName,mouseEvent);
////                self.eventTarget.onmouseout(mouseEvent);

//            self.eventTarget = null;
//            self.eventCanvas = null;
        }
    }

    //鼠标彻底移除设计区事件
    this.onmouseout = function(event){

    }

    //鼠标按下、抬起
    var oldMouseDownUpEvent = null;//记录点击历史？
    var mouseupName = "onmouseup";
    var mousedownName = "onmousedown";
    this.onmousedown = function(event){
        //事件转换
        event = event || window.event;
        var target = event.toElement || event.relatedTarget || event.srcElement || event.target;
        var mouseEvent = new MouseEvents(event,target,tdesigner);

        //判断鼠标在指定元素上按下
        oldMouseDownUpEvent = mouseEvent;

        broadcast(mouseEvent.target,mousedownName,mouseEvent);

    }
    //鼠标抬起事件，可能按住后 移动到元素外，处理新元素的抬起
    this.onmouseup = function(event){
        //事件转换
        event = event || window.event;
        var target = event.toElement || event.relatedTarget || event.srcElement || event.target;
        var mouseEvent = new MouseEvents(event,target,tdesigner);

        //触发抬起事件
        broadcast(mouseEvent.target,mouseupName,mouseEvent);

        //触发拖动停止
        if(isdrag){
            isdrag = false;
            broadcast(mouseEvent.target,dragEndName,mouseEvent);
        }

        oldMouseDownUpEvent = null;
    }

    //拖动事件
    var isdrag = false;
    var dragBeginName = "ondragbegin";
    var dragEndName = "ondragend";

    //初始化事件绑定
    if(window.addEventListener){
        root.addEventListener('click', this.onclick);
        root.addEventListener('mousemove', this.onmousemove);
        root.addEventListener('mousedown',this.onmousedown);
        root.addEventListener("mouseup",this.onmouseup);
    }else {
        root.attachEvent('onclick', this.onclick);
        root.attachEvent('onmousemove', this.onmousemove);
        root.attachEvent('onmousedown',this.onmousedown);
        root.attachEvent("onmouseup",this.onmouseup);
    }

    /**
     * 判断指定的事件是否存在
     * @param target
     * @param hname
     */
    function hasEventHandler(target,hname){
        if(target == null) return false;
        return target[hname]!=null && target[hname]!== undefined;
    }

    /**
     * 触发指定的事件
     * @param target
     * @param hname
     * @param event
     */
    function broadcast(target,hname,event){
        if(target != null){
            if(hasEventHandler(target,hname)){
                target[hname](event);
            }
        }
    }

}

/**
 * 鼠标事件
 * @param event
 * @param tdesigner
 * @constructor
 */
function MouseEvents(event,target,tdesigner,selector){

    if(event.stopPropagation){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }

    var self = this;

    //坐标转换
    this.altKey         = event.altKey;           //alt是否按下
    this.ctrlKey        = event.ctrlKey;          //ctrl是否按下
    this.shiftKey       = event.shiftKey;         //shift是否按下
    this.metaKey        = event.metaKey;          //meta是否按下

    this.mouseX         = event.x;                //鼠标X坐标
    this.mouseY         = event.y;                //鼠标Y坐标

    this.x              = event.x - tdesigner.x;  //x坐标
    this.y              = event.y - tdesigner.y;  //y坐标

    this.button         = window.attachEvent ? (event.button == 1 ? 0 : (event.button == 4 ? 1 : event.button)) : event.button;

    this.fromTarget     = target;

    var isNeedSelector = selector === undefined ? true : selector;//添加是否需要选择元素开关，减少选择元素次数，默认开启
    //提供改变事件源的函数，主要方便一些事件源的构造
    this.changeTarget = function(sender){
        if(sender!=null){
            this.target = sender.control;
            this.canvas = sender.canvas;
            //添加偏移量记录
            this.offsetX = this.x - sender.control.x;
            this.offsetY = this.y - sender.control.y;
            console.log("监控偏移量："+this.offsetX+","+this.offsetY);
        }else{
            this.target = null;
            this.canvas = null;
            this.offsetX = null;
            this.offsetY = null;
        }
    }

    //获取优先触发的元素
    var sender = isNeedSelector ? tdesigner.getEventTarget(this.x,this.y) : null;
    this.changeTarget(sender);
//    var sender = tdesigner.getEventTarget(this.x,this.y);
//
//    if(sender != null){
//        this.target = sender.control;
//        this.canvas = sender.canvas;
//
//        //添加偏移量记录
//        this.offsetX = this.x - this.target.x;
//        this.offsetY = this.y - this.target.y;
//
//    }else{
//        this.target = null;
//        this.canvas = null;
//        this.offsetX = null;
//        this.offsetY = null;
//    }
}

/**
 * 鼠标按键
 * @constructor
 */
var MouseButton = {
    /**
     * 鼠标左键
     * @type {number}
     */
    LeftButton : 0,
    /**
     * 鼠标中键
     * @type {number}
     */
    WheelButton : 1,
    /**
     * 鼠标右键
     * @type {number}
     */
    RightButton : 2
}