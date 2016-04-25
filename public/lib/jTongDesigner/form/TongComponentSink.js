/**
 * DGF组件，Image特性组件
 * Created by Daniel on 16-4-13.
 */

function TongComponentSink(){
    this.canlink = false;

    //this.backGroundBrush = new Brush("#FF00FF");

    this.image = null;
    this.imageUrl = "/lib/jTongDesigner/image/icon_r_tlq.png";

    this.handlePoints = [];

}

TongComponentSink.prototype = new TongBaseComponent();
