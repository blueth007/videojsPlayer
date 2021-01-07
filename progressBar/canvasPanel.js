var Component = videojs.getComponent("Component");

/**
 * @param super 全部替换为 Component.prototype.对应函数.call(this);
 */

var CanvasPanel = videojs.extend(Component, {
    constructor: function (player, options) {
        Component.apply(this, arguments);
        this.updateTime = _.throttle(this.updateTime, 30);
        // this.update = videojs.throttle(videojs.bind(this, this.update), videojs.UPDATE_REFRESH_INTERVAL);

    },
    createEl: function () {
        return videojs.dom.createEl("div", {
            className: "vjs-time-tooltip vjs-canvas-panel",
        });
    },
    updateTime: function (time) {
        // console.log(time);
        this.showCanvas(time);
    },
    showCanvas: function (time) {
        var o_ = this.el();
        var video = document.createElement("video");
        video.setAttribute("preload", "metadata");
        var playerId = this.player().options().id;


        video.src = this.player().src() + "#t=" + time;
        videoWidth = this.player().el().clientWidth;
        videoHeight = this.player().el().clientHeight;
        video.width = videoWidth;
        video.height = videoHeight;
        video.style = "display:none";
        const canvas = document.createElement("canvas");
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        video.oncanplay = function () {
            //加载完成后执行代码
            canvas.getContext("2d").drawImage(video, 0, 0, videoWidth, videoHeight);
            o_.innerHTML = "";
            o_.appendChild(canvas);
            //video.parentNode.removeChild(video)
            video = null;
        };
        if (!time) {
            o_.innerHTML = "";
        }
    },
});

videojs.registerComponent("CanvasPanel", CanvasPanel);