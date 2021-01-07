var Plugin = videojs.getPlugin('plugin');





var Advanced = videojs.extend(Plugin, {

    constructor: function (player, options) {
        Plugin.call(this, player, options);

        if (options.customClass) {
            player.addClass(options.customClass);
        }

        if (player.playlist) {
            player.addClass("vjs-playlist-offset"); //添加播放列表偏移其宽度
        }
        player.on('playing', function () {

            videojs.log('playback begin!');
        });

        player.el_.oncontextmenu = function (event) {
            var e = event || window.event;
            //取消默认浏览器自带右键
            e.preventDefault();
            var menu = document.getElementsByClassName("vjs-mydefine-right-menu")[0];
            //根据事件对象中鼠标点击的位置，进行定位
            menu.style.left = e.clientX - player.el().parentNode.offsetLeft - player.el().offsetLeft + 'px';
            menu.style.top = e.pageY + 'px';
            // 执行代码块
            // console.log(e.clientX, e.pageY)
        }
        this.on(player, ['playing', 'pause'], this.updateState);
        this.on('statechanged', this.logState);
    },

    dispose() {
        super.dispose();
        videojs.log('the advanced plugin is being disposed');
    },

    updateState() {

        this.setState({
            playing: !this.player.paused()
        });
    },

    logState(changed) {
        videojs.log(`the player is now ${this.state.playing ? 'playing' : 'paused'}`);
    }
})

videojs.registerPlugin('advanced', Advanced);