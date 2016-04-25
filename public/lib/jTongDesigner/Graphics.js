/**
 * 图形绘制类，提供给组件使用的绘图接口
 * Created by Daniel on 16-4-6.
 */

var Graphics = function(canvas){

    this.canvas = canvas;
    this.ctx = canvas.getElement().getContext("2d");
}

/**
 * 清除指定区域
 * @param x
 * @param y
 * @param width
 * @param height
 */
Graphics.prototype.clearRect = function(x, y, width, height){
    this.ctx.clearRect(x, y, width, height);
}

/**
 * 绘制线段
 * @param pen
 * @param beginX
 * @param beginY
 * @param endX
 * @param endY
 */
Graphics.prototype.drawLine = function(pen,beginX,beginY,endX,endY){
    this.ctx.save();
    this.ctx.strokeStyle = pen.Color;
    this.ctx.lineWidth = pen.Width;

    this.ctx.beginPath();
    this.ctx.moveTo(beginX,beginY);
    this.ctx.lineTo(endX,endY);
    this.ctx.stroke();
    this.ctx.restore();
}

/**
 * 绘制矩形
 * @param pen
 * @param x
 * @param y
 * @param width
 * @param height
 */
Graphics.prototype.drawRect = function(pen,x,y,width,height){
    this.ctx.save();
    this.ctx.strokeStyle = pen.Color;
    this.ctx.lineWidth = pen.Width;

    if(pen.shadowColor != null){
        this.ctx.shadowColor = pen.shadowColor;
        this.ctx.shadowBlur = pen.shadowBlur;
        this.ctx.shadowOffsetX = pen.shadowOffsetX;
        this.ctx.shadowOffsetY = pen.shadowOffsetY;
    }

    this.ctx.strokeRect(x,y,width,height);
    this.ctx.restore();
}

/**
 * 绘制字符串
 */
Graphics.prototype.drawText = function(text, font, x, y){
    this.ctx.save();

    this.ctx.strokeStyle = font.Color;
    if(font.shadowColor != null){
        this.ctx.shadowColor = font.shadowColor;
        this.ctx.shadowBlur = font.shadowBlur;
        this.ctx.shadowOffsetX = font.shadowOffsetX;
        this.ctx.shadowOffsetY = font.shadowOffsetY;
    }

    this.ctx.font = font.size+" "+font.family;
    this.ctx.textAlign = font.textAlign;
    this.ctx.textBaseline = font.textBaseline;
    this.ctx.strokeText(text, x, y);

    this.ctx.restore();
}

/**
 * 绘制自定义路径
 * @param brush
 * @param points
 */
Graphics.prototype.drawPath = function(pen,points){
    if(points instanceof Array && points.length > 1){
        this.ctx.save();
        this.ctx.strokeStyle = pen.Color;
        this.ctx.lineWidth = pen.Width;

        if(pen.shadowColor != null){
            this.ctx.shadowColor = pen.shadowColor;
            this.ctx.shadowBlur = pen.shadowBlur;
            this.ctx.shadowOffsetX = pen.shadowOffsetX;
            this.ctx.shadowOffsetY = pen.shadowOffsetY;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x,points[0].y);
        for(var i = 1,len = points.length; i < len; i++){
            var pointItem = points[i];
            this.ctx.lineTo(pointItem.x, pointItem.y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }
}

/**
 * 绘制圆形
 * @param pen
 * @param x
 * @param y
 * @param radius
 */
    Graphics.prototype.drawCircle = function(pen, x, y, radius){
    this.ctx.save();
    this.ctx.strokeStyle = pen.Color;
    this.ctx.lineWidth = pen.Width;

    if(pen.shadowColor != null){
        this.ctx.shadowColor = pen.shadowColor;
        this.ctx.shadowBlur = pen.shadowBlur;
        this.ctx.shadowOffsetX = pen.shadowOffsetX;
        this.ctx.shadowOffsetY = pen.shadowOffsetY;
    }

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2,false);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
}

/**
 * 填充字符串
 */
Graphics.prototype.fillText = function(text, font, x, y){
    this.ctx.save();

    this.ctx.fillStyle = font.Color;
    if(font.shadowColor != null){
        this.ctx.shadowColor = font.shadowColor;
        this.ctx.shadowBlur = font.shadowBlur;
        this.ctx.shadowOffsetX = font.shadowOffsetX;
        this.ctx.shadowOffsetY = font.shadowOffsetY;
    }

    this.ctx.font = font.size+" "+font.family;
    this.ctx.textAlign = font.textAlign;
    this.ctx.textBaseline = font.textBaseline;

    this.ctx.fillText(text, x, y);

    this.ctx.restore();
}

/**
 * 填充矩形
 * @param brush
 * @param x
 * @param y
 * @param width
 * @param height
 */
Graphics.prototype.fillRect = function(brush,x,y,width,height){

    this.ctx.save();
    this.ctx.fillStyle = brush.Color;

    if(brush.shadowColor != null){
        this.ctx.shadowColor = brush.shadowColor;
        this.ctx.shadowBlur = brush.shadowBlur;
        this.ctx.shadowOffsetX = brush.shadowOffsetX;
        this.ctx.shadowOffsetY = brush.shadowOffsetY;
    }

    this.ctx.fillRect(x,y,width,height);
    this.ctx.restore();
}

/**
 * 绘制图片
 * @param image 要绘制的图片
 * @param x 绘制的x坐标
 * @param y 绘制的y坐标
 */
Graphics.prototype.drawImage = function(image, x, y, width, height){
    this.ctx.save();
    this.ctx.drawImage(image, x, y, width, height);
    this.ctx.restore();
}

/**
 * 绘制自定义路径
 * @param brush
 * @param points
 */
Graphics.prototype.fillPath = function(brush,points){
    if(points instanceof Array && points.length > 1){
        this.ctx.save();
        this.ctx.fillStyle = brush.Color;

        if(brush.shadowColor != null){
            this.ctx.shadowColor = brush.shadowColor;
            this.ctx.shadowBlur = brush.shadowBlur;
            this.ctx.shadowOffsetX = brush.shadowOffsetX;
            this.ctx.shadowOffsetY = brush.shadowOffsetY;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x,points[0].y);
        for(var i = 1,len = points.length; i < len; i++){
            var pointItem = points[i];
            this.ctx.lineTo(pointItem.x, pointItem.y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
}

/**
 * 填充圆形
 * @param pen
 * @param x
 * @param y
 * @param radius
 */
Graphics.prototype.fillCircle = function(brush, x, y, radius){
    this.ctx.save();
    this.ctx.fillStyle = brush.Color;

    if(brush.shadowColor != null){
        this.ctx.shadowColor = brush.shadowColor;
        this.ctx.shadowBlur = brush.shadowBlur;
        this.ctx.shadowOffsetX = brush.shadowOffsetX;
        this.ctx.shadowOffsetY = brush.shadowOffsetY;
    }

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2,false);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
}

/**
 * 画笔
 * @param color
 * @param width
 * @constructor
 */
var Pen = function(color,width){
    this.Color = color;
    this.Width = width;

    this.shadowColor = null;
    this.shadowBlur = 2;
    this.shadowOffsetX = 3;
    this.shadowOffsetY = 3;

}

/**
 * 画刷
 * @param color
 * @param width
 * @constructor
 */
var Brush = function(color){
    this.Color = color;

    this.shadowColor = null;
    this.shadowBlur = 2;
    this.shadowOffsetX = 3;
    this.shadowOffsetY = 3;
}

/**
 * 字体
 * @param family
 * @param size
 * @param color
 * @constructor
 */
var Font = function(family,size,color){
    this.Color = color;
    this.family = family;
    this.size = size;

    this.textAlign = "start";
    this.textBaseline = "top";

    this.shadowColor = null;
    this.shadowBlur = 2;
    this.shadowOffsetX = 3;
    this.shadowOffsetY = 3;
}

//var GraphicsPath = function(){
//
//}