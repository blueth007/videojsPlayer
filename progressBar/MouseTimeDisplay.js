var MouseTimeDisplay = videojs.getComponent("MouseTimeDisplay");
var ProgressControl = videojs.getComponent("ProgressControl");

MouseTimeDisplay.prototype.options_ = {
    children: ["CanvasPanel", "timeTooltip"],
};

MouseTimeDisplay.prototype.update = function (seekBarRect, seekBarPoint) {
    const time = seekBarPoint * this.player_.duration();
    //console.log(this);
    this.getChild("timeTooltip").updateTime(
        seekBarRect,
        seekBarPoint,
        time,
        () => {
            this.el_.style.left = `${seekBarRect.width * seekBarPoint}px`;
        }
    );

    //更新canvasPanel
    this.getChild("canvasPanel").updateTime(time);
};