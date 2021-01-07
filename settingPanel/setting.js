var MenuButton = videojs.getComponent("MenuButton");
var Menu = videojs.getComponent("Menu");
/**
 * @param super 全部替换为 MenuButton.prototype.对应函数.call(this);
 */

var SettingPanel = videojs.extend(MenuButton, {
  constructor: function (player, options) {
    MenuButton.apply(this, arguments);
    // this.addClass("vjs-setting-button");
    this.on("keydown", this.handleKeyPress);
    this.on("mouseover", this.handleMouseOver);
    this.on("mouseout", this.handleMouseOut);
  },

  //   createEl: function () {
  //     var el = videojs.dom.createEl();

  //     this.labelEl_ = videojs.dom.createEl("div", {
  //       className: "vjs-playback-rate-value",
  //       innerHTML: "1x",
  //     });

  //     el.appendChild(this.labelEl_);

  //     return el;
  //   },

  buildCSSClass: function () {
    var origin = MenuButton.prototype.buildCSSClass.call(this);
    // return `vjs-setting-button ${MenuButton.prototype.buildCSSClass.call(this)}`;
    return "vjs-setting-button " + origin;
  },

  buildWrapperCSSClass: function () {
    var origin = MenuButton.prototype.buildWrapperCSSClass.call(this);
    return "vjs-setting-button " + origin;
    // return `vjs-setting-button  ${MenuButton.prototype.buildWrapperCSSClass.call(
    //   this
    // )}`;
  },

  /**
   * Create the playback rate menu
   *
   * @return {Menu}
   *         Menu object populated with {@link PlaybackRateMenuItem}s
   */
  createMenu: function () {
    var menu = new Menu(this.player());

    menu.addChild(
      new SettingItem(this.player(), {
        text: "镜像",
        isChecked: false,
        isLabel: true,
      })
    );
    menu.addChild(
      new SettingItem(this.player(), {
        text: "循环",
        isLabel: true,
        isChecked: this.player().options.loop,
      })
    );
    menu.addChild(
      new SettingItem(this.player(), {
        text: "更多...",
        isChecked: this.player().options.loop,
        isLabel: false,
      })
    );

    return menu;
  },

  /**
   * This gets called when a `VolumePanel` gains hover via a `mouseover` event.
   * Turns on listening for `mouseover` event. When they happen it
   * calls `this.handleMouseOver`.
   *
   * @param {EventTarget~Event} event
   *        The `mouseover` event that caused this function to be called.
   *
   * @listens mouseover
   */
  handleMouseOver: function (event) {
    this.addClass("vjs-hover");
    // Events.on(document, 'keyup', Fn.bind(this, this.handleKeyPress));
  },
  handleMouseOut: function (event) {
    this.removeClass("vjs-hover");
    // Events.off(document, 'keyup', Fn.bind(this, this.handleKeyPress));
  },
  /**
   * Handles `keyup` event on the document or `keydown` event on the `VolumePanel`,
   * looking for ESC, which hides the `VolumeControl`.
   *    */
  handleKeyPress: function (event) {
    if (keycode.isEventKey(event, "Esc")) {
      this.handleMouseOut();
    }
  },
});
//
// SettingPanel.prototype.options_ = {
//   children: ["SettingButton"],
// };

MenuButton.registerComponent("SettingPanel", SettingPanel);
//export default SettingPanel;
