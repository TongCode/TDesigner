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
        var mouseEvent = new MouseEvent(event,tdesigner);
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

            broadcast(mouseEvent.target,clickName,mouseEvent);

        }
        else{
            if(oldClickEvent != null && oldClickEvent.target.isfocus){
                oldClickEvent.target.lostFocus();
                oldClickEvent.canvas.paint();
            }

            oldClickEvent = null;
        }
    }

    //鼠标移动事件，可以产生出鼠标移入、鼠标移除事件、拖动事件
    var oldMouseEvent = null;//记录点击历史？
    var mouseoverName = "onmouseover";
    var mouseoutName = "onmouseout";
    this.onmousemove = function(event){

        //获取触发事件
        var mouseEvent = new MouseEvent(event,tdesigner);

        if(isdrag){ //拖动中，直接处理元素位移
            oldMouseDownUpEvent.target.x = mouseEvent.x - oldMouseDownUpEvent.offsetX;
            oldMouseDownUpEvent.target.y = mouseEvent.y - oldMouseDownUpEvent.offsetY;
            oldMouseDownUpEvent.canvas.paint();
        }else if(islink){//链接中，处理链接过程
            console.log("链接的元素：",oldLinkEvent);
            //更新制定箭头位置
            var handlePoint = oldLinkEvent.linkPoint;
            var target = oldLinkEvent.target;
            if(handlePoint!=null){
                if(handlePoint.id == target.handleEnum.E){
                    //更新结束点
                    target.ex = mouseEvent.x;
                    target.ey = mouseEvent.y;
                }else if(handlePoint.id == target.handleEnum.W){
                    //更新起始点
                    target.x = mouseEvent.x;
                    target.y = mouseEvent.y;
                }

                oldLinkEvent.canvas.paint();
            }
        }

        //处理移动
        if(mouseEvent.target != null){
            //元素进入
            if(oldMouseEvent == null || oldMouseEvent.target.id != mouseEvent.target.id){
                if(oldMouseEvent != null)
                    broadcast(oldMouseEvent.target,mouseoutName,mouseEvent);

                oldMouseEvent = mouseEvent;
                broadcast(mouseEvent.target,mouseoverName,mouseEvent);
            }

            //@add 添加入口判断条件，只有非拖拽状态下且元素具有焦点的情况下可以拖拽 减少代码执行量
            if(!isdrag && isCanDrap && mouseEvent.target.isfocus){
                var canDragBegin = isCanDrap && mouseEvent.target.drag && oldMouseDownUpEvent != null && oldMouseDownUpEvent.button == MouseButton.LeftButton;
                if(self.debug)console.log("拖动检测结果：",canDragBegin);
                if(canDragBegin){
                    if(self.debug)console.log("拖动开始..");
                    //拖动开始
                    isdrag = true;
                    broadcast(oldMouseDownUpEvent,dragBeginName,mouseEvent);
                }
            }

            //@add
            if(!islink && isCanLink && mouseEvent.target.isfocus){
                var canLinkBegin = isCanLink;
                if(self.debug)console.log("可用链接点为：",oldMouseDownUpEvent.linkPoint);
                oldLinkEvent = oldMouseDownUpEvent;
                //判断是点在可连接元素还是链接线上，如果是元素上，且有存在的连接线，则改变事件元素，如果是连线则进行处理，如果元素无连接，则创建链接
                if(!(oldMouseDownUpEvent.target instanceof TongArrow)){
                    //获取指定连接点绑定的连接线
                    var tmpArrow = new TongArrow();
                    tmpArrow.id = guid.id();
                    tmpArrow.name = tmpArrow.id;
                    tmpArrow.ex = mouseEvent.x;
                    tmpArrow.ey = mouseEvent.y;

                    //将元素的触发句柄作为开始点绑定到箭头开始，模拟触发的为箭头的结束点
                    tmpArrow.bindBegin(oldMouseDownUpEvent.target,oldMouseDownUpEvent.linkPoint.id);

                    //构建事件源，模拟触发的控制点为箭头的结束点
                    oldLinkEvent.linkPoint = {id:oldMouseDownUpEvent.target.handleEnum.E, x:mouseEvent.x, y:mouseEvent.y};

                    oldMouseDownUpEvent.target.parent.parent.addControl(tmpArrow);

                    oldLinkEvent.target = tmpArrow;
                }
                islink = true;
                self.jtd.setCursor("crosshair");
            }

            //添加鼠标改变，如果鼠标移入的控件处于焦点状态,添加非拖拽模式下进行修改，拖拽中无需修改，减少代码执行
            if(!isdrag && !islink){
                if(mouseEvent.target.isfocus){
                    self.jtd.setCursor("move");
                }else{
                    //修复鼠标还原
                    self.jtd.setCursor("default");
                }
            }


        }else{
            //处理鼠标移出事件
            if(oldMouseEvent != null){
                broadcast(oldMouseEvent.target,mouseoutName,mouseEvent);
            }
            oldMouseEvent = null;

            //链接事件移出后需要保持状态
            if(!islink){
                self.jtd.setCursor("default");
            }
        }
    }

    //鼠标彻底移除设计区事件
    this.onmouseout = function(event){

    }

    //鼠标按下、抬起
    var oldMouseDownUpEvent = null;//记录点击历史？
    var mouseupName = "onmouseup";
    var mousedownName = "onmousedown";
    var isCanLink = false,isCanDrap = false;
    this.onmousedown = function(event){
        //获取触发事件
        var mouseEvent = new MouseEvent(event,tdesigner);
        getMouseOffsetInControl(mouseEvent);//处理偏移量
        //鼠标按键处理
        //@add 2016-04-21 代码重构添加按下预判操作
        //如果有点击到元素
        if(mouseEvent.target!=null){
            //如果元素已经获取到焦点，
            if(mouseEvent.target.isfocus){
                //并且在控制柄中
                var handleEnumItem = mouseEvent.target.handleExists(mouseEvent.x, mouseEvent.y);
                if(self.debug)console.log("点击在句柄：",handleEnumItem);
                if(handleEnumItem!=null){

                    mouseEvent.linkPoint = handleEnumItem;

                    //在控制句柄上触发，如果移动则为链接事件
                    isCanLink = true;
                    isCanDrap = false;
                }else{
                    //未在控制句柄上触发，如果移动则为移动
                    isCanLink = false;
                    isCanDrap = true;
                }
                if(self.debug)console.log("点击结果监控：",isCanLink,isCanDrap);
            }
        }

        //判断鼠标在指定元素上按下
        oldMouseDownUpEvent = mouseEvent;
        broadcast(mouseEvent.target,mousedownName,mouseEvent);

    }
    //鼠标抬起事件，可能按住后 移动到元素外，处理新元素的抬起
    this.onmouseup = function(event){
        //事件转换
        var mouseEvent = new MouseEvent(event,tdesigner);

        //触发抬起事件
        broadcast(mouseEvent.target,mouseupName,mouseEvent);

        //触发拖动停止
        if(isdrag){
            isdrag = false;
            broadcast(mouseEvent.target,dragEndName,mouseEvent);
        }else if(islink){
            islink = false;

        }

        //链接停止

        oldMouseDownUpEvent = null;
        isCanLink = false;
        isCanDrap = false;
    }

    //拖动事件
    var isdrag = false;
    var dragBeginName = "ondragbegin";
    var dragEndName = "ondragend";

    //链接事件
    var islink = false;
    var oldLinkEvent = null;
    var linkBeginName = "onlinkbegin";
    var linkEndName = "onlinkend";


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
 * 转换基础的Event
 * @param event
 * @param tdesigner
 * @constructor
 */
function MouseEvent(event,tdesigner){

    event = event || window.event;

    if(event.stopPropagation){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }

    //转换基础的鼠标事件信息
    this.sourceX        = event.x;
    this.sourceY        = event.y;
    this.sender         = event.toElement || event.relatedTarget || event.srcElement || event.target;
    this.button         = window.attachEvent ? (event.button == 1 ? 0 : (event.button == 4 ? 1 : event.button)) : event.button;

    this.x              = event.x - tdesigner.x;  //x坐标
    this.y              = event.y - tdesigner.y;  //y坐标

    //选择图形
    this.target = null;
    this.canvas = null;
    var newEventTarget = tdesigner.getEventTarget(this.x,this.y);
    if(newEventTarget!=null){
        this.canvas     = newEventTarget.canvas;
        this.target     = newEventTarget.control;
    }
}

/**
 * 处理指定的事件偏移量
 * @param event
 */
function getMouseOffsetInControl(event){
    if(event !=null && event.target!=null){
        event.offsetX = event.x - event.target.x;
        event.offsetY = event.y - event.target.y;
    }
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