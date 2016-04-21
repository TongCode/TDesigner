/**
 * Created by Daniel on 16-4-6.
 */

var guid = (function(){
    //var idStart = 0;
    var idStart = + new Date();
    return{
        id:function(){
            return ++idStart;
        }
    }
})();

var jTongDesigner = (function(){

    var _instances = {};//实例列表

    /**
     * 初始化组件，创建指定的元素
     * @param dom
     */
    function init(dom){

        if(dom == null && dom === undefined) return;

        console.log("初始化组件");
        var jtd = new JTongDesigner(guid.id(),dom);

        _instances[jtd.getId()] = jtd;

        //初始化背景画布
        var backgroundCanvas = jtd.createCanvas("tong_background");

        //初始化一些其他属性
        var clientRect = backgroundCanvas.getBoundingClientRect();
        jtd.x = clientRect.left * (jtd.getWidth() / clientRect.width);
        jtd.y = clientRect.top * (jtd.getHeight() / clientRect.height);

        //绘制背景
        var g = backgroundCanvas.getGraphics();
        var pen = new Pen("#c9c9c9",0.5);

        var width = jtd.getWidth();
        var height = jtd.getHeight();

        for(var i = 0; i < width; i += 14.5){
            g.drawLine(pen,i,0,i,height);
        }

        for(var i = 0; i < height; i += 14.5){
            g.drawLine(pen,0,i,width,i);
        }

        return jtd;
    }


    var JTongDesigner= function(id,root){
        var self = this;

        this.id = id;

        //初始化设计器
        this.root = root;
        this.root.innerHTML = '';
        this.root.style['-webkit-tap-highlight-color'] = 'transparent';
        this.root.style['-webkit-user-select'] = 'none';
        this.root.style['user-select'] = 'none';
        this.root.style['-webkit-touch-callout'] = 'none';

        //缓存Canvas
        this.storage = [];
        this.handler = new Handler(root,this);

        /**
         * 获取ID
         * @returns {*}
         */
        JTongDesigner.prototype.getId = function(){
            return this.id;
        }

        /**
         * 创建画布，并返回画布的ID
         * @param name
         */
        JTongDesigner.prototype.createCanvas = function(name){
            var canvasId = guid.id();
            if(name === undefined || name == null) name = canvasId;
            var canvas = new Canvas(canvasId,name,this);
            this.addCanvas(canvas);
            return canvas;
        }

        /**
         *
         */
        JTongDesigner.prototype.addCanvas = function(canvas){

            if(canvas == null) return;

            //判断指定的ID是否存在
            var id = canvas.getId();
            var canvasItem = this.getCanvas(id);

            if(canvasItem == null){
                //添加注册到界面、列表
                this.root.appendChild(canvas.getElement());
                this.storage.push(canvas);
            }
        }

        /**
         * 获取指定的Canvas
         * @param id
         * @returns {*}
         */
        JTongDesigner.prototype.getCanvas = function(id){
            if(this.storage.length <= 0) return null;

            for(var i = 0, len = this.storage.length; i < len; i++){
                var canvasItem = this.storage[i];
                if(canvasItem.getId() == id){
                    return canvasItem;
                }
            }
            return null;
        }

        /**
         * 获取指定位置的有效图形
         * @param x
         * @param y
         *
         * @modify 添加组件元素的选择
         */
        JTongDesigner.prototype.getEventTarget = function(x,y){
            if(this.storage.length > 0){
                //后置元素在上层
                for(var i = this.storage.length - 1;i >= 0;i--){
                    var canvasItem = this.storage[i];
                    //获取指定层的合格元素
                    var control = canvasItem.findControl(x,y);
                    if(control!=null){
                        return {control:control,canvas:canvasItem};
                    }
                }
            }
            return null;
        }

        /**
         * 获取设计区宽度
         */
        JTongDesigner.prototype.getWidth = function(){
            var stl = this.root.currentStyle || document.defaultView.getComputedStyle(this.root);
            return ((root.clientWidth || parseInt(stl.width,10)) - parseInt(stl.paddingLeft,10) - parseInt(stl.paddingRight,10)).toFixed(0) - 0;

        }

        /**
         * 获取设计区高度
         * @returns {number}
         */
        JTongDesigner.prototype.getHeight = function(){
            var stl = this.root.currentStyle || document.defaultView.getComputedStyle(this.root);
            return ((root.clientHeight || parseInt(stl.height,10)) - parseInt(stl.paddingTop,10) - parseInt(stl.paddingBottom,10)).toFixed(0) - 0;

        }

        /**
         * 改变鼠标样式
         * @param cursor
         */
        JTongDesigner.prototype.setCursor = function(cursor){
            this.root.style.cursor = cursor;
        }

    }


    /**
     * 组件序号初始化
     */
//    var guid = (function(){
//        var idStart = 0;
//        return{
//            id:function(){
//                return ++idStart;
//            }
//        }
//    })();


    return{
        init:init,
        version:"1.0"
    }


})();


