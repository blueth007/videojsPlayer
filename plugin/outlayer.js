(function () {
    /* jshint eqnull: true*/
    /* global require */
    "use strict";
    var videojs = null;
    if (typeof window.videojs === "undefined" && typeof require === "function") {
        videojs = require("video.js");
    } else {
        videojs = window.videojs;
    }

    (function (window, videojs) {
        var videoJsOutLayer,
            defaults = {
                ui: true,
            };

        var Component = videojs.getComponent("Component");
        var menuRight = videojs.extend(Component, {
            constructor: function (player, options) {
                Component.call(this, player, options);

            },
            createEl: function () {
                var content = videojs.dom.createEl("ul", {
                    className: "vjs-mydefine-right-menu ",
                })
                content.appendChild(this.contentInfo());
                return content
            },

            contentInfo: function () {
                var text = "视频信息" //this.player().src();
                var o_ = this;
                return videojs.dom.createEl("li", {
                    className: "v11",
                    innerHTML: text,
                    onclick: function (e) {
                        console.log(o_.player().src());

                    }
                })
            }

        });
        Component.registerComponent("menuRight", menuRight);


        var ModalDialog = videojs.getComponent("ModalDialog");
        var outLayer = videojs.extend(ModalDialog, {
            constructor: function (player, options) {
                options.selectable = true;
                // Sets this.player_, this.options_ and initializes the component
                ModalDialog.call(this, player, options);
                this.fill();
                this.hasBeenOpened_ = this.hasBeenFilled_ = true;
                this.updateDisplay = videojs.bind(this, this.updateDisplay);
                this.endDialog = videojs.dom.createEl("p", {
                    className: "vjs-control-text",
                    textContent: this.localize("End of dialog window."),
                });
                this.el().appendChild(this.endDialog);
                this.on(player, "contextmenu", this.updateCss);
                this.on(player, ["contextmenu", "playlistitem"], this.updateContent);

            },
            buildCSSClass: function () {
                return (
                    "vjs-modal-dialog  vjs-hidden vjs-out-layer"
                );
            },
            dispose: function () {
                this.endDialog = null;
                ModalDialog.prototype.dispose.call(this);
            },
            content: function () {
                var o_ = this;
                o_.el_1 = videojs.dom.createEl("div", {
                    className: "vjs-item-one",
                    innerHTML: `
                    <p> 播放地址：${ o_.player_.src()}</p>
                    <p> 播放速率：${o_.player_.playbackRate()} </p>
                    `,
                });
                return o_.el_1;
            },
            handleContentMenu: function (e) {
                e.preventDefault();
                console.log(this);
            },
            handleClose: function () {
                console.log(1)
            },
            updateDisplay() {
                const ttDisplay = this.player_.getChild("videoJsOutLayer");

                if (ttDisplay) {
                    ttDisplay.updateDisplay();
                }
            },
            updateCss: function () {
                this.toggleClass("vjs-hidden-opacity")
                this.toggleClass("vjs-hidden")
            },
            updateContent: function () {

                this.el_1.innerHTML = `
                    <p> 播放地址：${ this.player_.src()}</p>
                    <p> 播放速率：${this.player_.playbackRate()} </p>
                    `


            },
            close: function () {
                this.toggleClass("vjs-hidden-opacity")
                this.toggleClass("vjs-hidden")

            }
        });
        outLayer.prototype.options_ = {
            children: [
                "menuRight"
            ]
        }
        ModalDialog.registerComponent("outLayer", outLayer);

        videoJsOutLayer = function (options) {
            var settings = videojs.mergeOptions(defaults, options),
                player = this;
            player.ready(function () {
                if (settings.ui) {
                    var Layer = new outLayer(player, settings);

                    player.controlBar.videoJsOutLayer = player.el_.insertBefore(
                        Layer.el_,
                        player.controlBar.el_
                    );

                    //    player.controlBar.outLayer = player.controlBar.el_.insertBefore(layer.el_, insertBeforeNode);
                    player.controlBar.videoJsOutLayer.dispose = function () {
                        this.parentNode.removeChild(this);
                    };
                }
            });
        };
        videojs.registerPlugin("videoJsOutLayer", videoJsOutLayer);
    })(window, videojs);
})();