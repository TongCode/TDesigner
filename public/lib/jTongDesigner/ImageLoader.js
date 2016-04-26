/**
 * Created by Daniel on 4/25/16.
 */

function ImageLoader(){
    //图片缓存
    this.imageCache={};
}

/**
 * 加载图片
 * @param url
 */
ImageLoader.prototype.load = function(url,callback){
    var self = this;
    //获取指定地址的URl
    var image = this.getImage(url);
    if(image == null){
        image = new Image();
        image.onload = function(e){
            self.imageCache[url] = image;
            if(callback) callback(image);
        }
        image.src = url;
    }else{
        callback(image);
    }

}

/**
 * 获取图片
 * @param url
 * @returns {*}
 */
ImageLoader.prototype.getImage = function(url){
    for(var key in this.imageCache){
        if(url == key)
            return this.imageCache[key];
    }
    return null;
}

var imageLoad = new ImageLoader();

//缓存通用图片
imageLoad.load("/lib/jTongDesigner/image/icon_r_cdc.png");
imageLoad.load("/lib/jTongDesigner/image/icon_r_dgfe.png");
imageLoad.load("/lib/jTongDesigner/image/icon_r_dgfg.png");
imageLoad.load("/lib/jTongDesigner/image/icon_r_dgfr.png");
imageLoad.load("/lib/jTongDesigner/image/icon_r_tlq.png");
imageLoad.load("/lib/jTongDesigner/image/icon_r_sql.png");
imageLoad.load("/lib/jTongDesigner/image/icon_r_table.png");