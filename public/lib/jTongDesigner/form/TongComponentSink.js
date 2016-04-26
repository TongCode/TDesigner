/**
 * DGF组件，Image特性组件
 * Created by Daniel on 16-4-13.
 */

function TongComponentSink(){
    this.canlink = true;

    //this.backGroundBrush = new Brush("#FF00FF");

    this.image = null;
    this.imageUrl = "/lib/jTongDesigner/image/icon_r_tlq.png";

    this.handlePoints = [];

    //Sink处于接收端，默认链接为W
//    this.getDefaultLinkPoint = function(){
//
//    }
}

TongComponentSink.prototype = new TongBaseComponent();
