/**
 * DGF组件，Image特性组件
 * Created by Daniel on 16-4-13.
 */

function TongComponentSource(){
    this.canlink = true;

    //this.backGroundBrush = new Brush("#0A0A0A");

    this.image = null;
    this.imageUrl = "/lib/jTongDesigner/image/icon_r_cdc.png";

    this.handlePoints = [];

//    this.onmouseover = function(e){
//        console.log("拖动进来啦~~");
//    }

    this.onmouseout = function(e){
        console.log("拖动离开啦~~");
    }
}

TongComponentSource.prototype = new TongBaseComponent();
