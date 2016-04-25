/**
 * DGF组件，Image特性组件
 * Created by Daniel on 16-4-13.
 */

function TongComponentDGF(){
    this.canlink = false;

    //this.backGroundBrush = new Brush("#595959");

    this.image = null;
    this.imageUrl = "/lib/jTongDesigner/image/icon_r_dgfe.png";

    this.handlePoints = [];

}

TongComponentDGF.prototype = new TongBaseComponent();
