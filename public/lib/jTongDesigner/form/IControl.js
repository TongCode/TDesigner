/**
 * 控件基层接口
 * Created by Daniel on 16-4-7.
 */

function IControl(){

    //Fields
    this.x = 0;                     // 元素的X坐标
    this.y = 0;                     // 元素的Y坐标
    this.width = 100;               // 元素的宽度
    this.height = 100;              // 元素的高度

    this._focus = false;             // 元素焦点状态

    this.drag = false;              //是否可以拖拽
    this.canfocus = true;           //是否可以获得焦点
    this.canlink = true;            //是否可以进行连接

    this.borderColor = null;        // 元素的边框颜色
    this.borderWidth = 0;           // 元素的边框宽度

    this.backColor = null;          // 元素的背景色
    this.foreColor = null;          // 元素的前景色

}

IControl.prototype.paint = function(g){};

/**
 * 判断指定的坐标点是否在图形范围内
 * @param x
 * @param y
 * @returns {boolean}
 */
IControl.prototype.pointExists = function(x,y){return false;}

/**
 * 判断指定的坐标是否在控制点范围内
 * @param x
 * @param y
 * @returns {boolean}
 */
IControl.prototype.handleExists = function(x,y){return false;}

IControl.prototype.getWidth = function(){
    return this.width;
};

/**
 * 元素获取焦点
 */
IControl.prototype.focus = function(){
    this._focus = true;
}

/**
 * 元素失去焦点
 */
IControl.prototype.lostFocus = function(){
    this._focus = false;
}