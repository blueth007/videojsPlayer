var Component = videojs.getComponent("ClickableComponent");

var ClickBar = videojs.extend(Component, {
  constructor: function (player, options) {
    // It is important to invoke the superclass before anything else,
    // to get all the features of components out of the box!
    // 在做其它事之前先调用父类的构造函数是很重要的，
    // 这样可以使父组件的所有特性在子组件中开箱即用。
    Component.apply(this, arguments);

    this.controlText("设置");
    // If a `text` option was passed in, update the text content of
    // the component.
    // 如果在options中传了text属性，那么更新这个组件的文字显示
  },
  buildCSSClass: function () {
    return "vjs-widescreen-button vjs-control vjs-button";
  },

  handleClick: function (e) {
    console.log("click", this.player);
    this.player().pause();
    this.player().addClass("vjs-wideScreen");
  },
  handleKeyDown: function (e) {
    console.log("keydown", e);
  },
});

// Register the component with Video.js, so it can be used in players.
// 在videojs中注册这个组件，才可以使用哦.
videojs.registerComponent("ClickBar", ClickBar);
