var Component = videojs.getComponent("Component");
/**
 * @param super 全部替换为 Component.prototype.对应函数.call(this);
 */

var WideScreenButton = videojs.extend(Component, {
  constructor: function (player, options) {
    Component.apply(this, arguments);
    // this.addClass("vjs-widescreen-button");
    this.isWide = false;
  },
  createEl: function () {
    return videojs.dom.createEl("div", {
      className: "vjs-right-button",
      dir: "ltr",
    });
  },
});

videojs.registerComponent("RightButton", WideScreenButton);
