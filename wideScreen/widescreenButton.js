var Button = videojs.getComponent("Button");
/**
 * @param super 全部替换为 Component.prototype.对应函数.call(this);
 */

var WideScreenButton = videojs.extend(Button, {
    constructor: function (player, options) {
        Button.apply(this, arguments);
        // this.addClass("vjs-widescreen-button");
        this.isWide = false;
    },
    buildCSSClass: function () {
        var origin = Button.prototype.buildCSSClass.call(this);
        return "vjs-widescreen-button " + origin;
        // return `vjs-widescreen-button ${Button.prototype.buildCSSClass.call(this)}`;
    },
    handleClick: function (e) {
        // console.log(this.player().isFullscreen_) 
        var parent = this.player().el().parentNode;
        this.player().isFullscreen_ ? this.player().exitFullscreen() : ""; //如果是全屏先退出全屏再宽屏
        if (this.isWide) {
            parent.classList.remove("vjs-wideScreen");
            this.player().addClass("vjs-playlist-offset")
        } else {
            parent.classList.add("vjs-wideScreen");
            this.player().removeClass("vjs-playlist-offset")
        }
        this.isWide = !this.isWide;
    },
});
WideScreenButton.prototype.controlText_ = "宽屏";
videojs.registerComponent("WideScreenButton", WideScreenButton);