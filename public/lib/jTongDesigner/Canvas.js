/**
 * 画布类，代表一个可以使用的画布
 * Created by Daniel on 16-4-6.
 */
var Canvas = function(id,name,designer){

    this.id = id;
    this.x = 0;
    this.y = 0;
    this.width = designer.getWidth();
    this.height = designer.getHeight();

    //创建画布
    this.designer = designer;
    this.htmlElement = document.createElement('canvas');
    this.htmlElement.id = id;
    this.htmlElement.setAttribute("name",name);

    this.htmlElement.style.position = 'absolute';
    this.htmlElement.style.left = 0;
    this.htmlElement.style.top = 0;
    this.htmlElement.style.width = this.width + 'px';
    this.htmlElement.style.height = this.height + 'px';
    this.htmlElement.width = this.width;
    this.htmlElement.height = this.height;
//    this.htmlElement.setAttribute("data-tong-id",id);
    this.htmlElement.style['-webkit-user-select'] = 'none';
    this.htmlElement.style['user-select'] = 'none';
    this.htmlElement.style['-webkit-touch-callout'] = 'none';
    this.htmlElement.style['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';

    //初始化Graphics
    this.Graphics = new Graphics(this);

    //初始化元素集合
    this.controls=[];

}

/**
 * 获取ID
 */
Canvas.prototype.getId = function(){
    return this.id;
}

/**
 * 获取元素
 * @returns {HTMLElement|*}
 */
Canvas.prototype.getElement = function(){
    return this.htmlElement;
}

/**
 * 获取元素边界
 * @returns {ClientRect}
 */
Canvas.prototype.getBoundingClientRect = function(){
    return this.htmlElement.getBoundingClientRect();
}

/**
 * 获取绘制接口
 * @returns {Graphics|*}
 */
Canvas.prototype.getGraphics = function(){
    return this.Graphics;
}

/**
 * 清除画布
 */
Canvas.prototype.clear = function(){
    this.Graphics.clearRect(0,0,this.width,this.height);
}

/**
 * 绘制
 */
Canvas.prototype.paint = function(){

    var g = this.getGraphics();
    this.clear();
//    for(var key in this.controls){
//        var controlItem = this.controls[key];
//        try{
//            controlItem.paint(g);
//        }catch(ex){}
//    }
    for(var i = 0,len = this.controls.length;i<len;i++){
        var controlItem = this.controls[i];
        try{
            controlItem.paint(g);
        }catch(ex){}
    }
}

/**
 * 添加元素
 * @param control
 */
Canvas.prototype.addControl = function(control){
    if(control == null) return;

    var name = control.name;
    if(name == null || name === undefined) throw new Error("控件无效的Name值");

    var controlItem = this.getControl(name);
    if(controlItem == null){
//        this.controls[name]=control;
//        control.id = + new Date();
        control.id = guid.id();
        control.parent = this;
        this.controls.push(control);
        this.paint();
    }else{
        throw new Error("Name值为："+name+"的控件已经存在！");
    }
}

/**
 * 移除指定的元素
 * @param id
 */
Canvas.prototype.removeControl = function(id){
    if(this.controls.length > 0){
        for(var i = this.controls.length - 1; i>=0 ;i--){
            var controlItem = this.controls[i];
            if(controlItem.id == id){
                this.controls.splice(i,1);
                break;
            }
        }
    }
}

/**
 * 获取指定坐标的元素
 * @param x
 * @param y
 */
Canvas.prototype.findControl = function(x,y){
    if(this.controls.length > 0){
        for(var i = this.controls.length - 1; i>=0 ;i--){
            var controlItem = this.controls[i];
            if(controlItem.pointExists(x,y)){
                //获取子元素
                if(controlItem.controls!=null){
                    for(var j = controlItem.controls.length -1; j >= 0; j--){
                        var chControlItem = controlItem.controls[j];
                        if(chControlItem.pointExists(x,y)){
                            return chControlItem;
                        }
                    }
                }
                return controlItem;
            }
        }
    }
    return null;
}

/**
 * 根据元素名称获取元素
 * @param name
 * @returns {*}
 */
Canvas.prototype.getControl = function(name){
//    if(this.controls[name]!=null)
//        return this.controls[name];
//    return null;
    for(var i = 0,len = this.controls.length;i<len;i++){
        var controlItem = this.controls[i];
        if(controlItem.name == name)
            return controlItem;
    }
    return null;
}
