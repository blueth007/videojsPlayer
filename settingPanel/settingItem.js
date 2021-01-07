var Item = videojs.getComponent("MenuItem");
/**
 * @param super 全部替换为 Component.prototype.对应函数.call(this);
 */

var SettingItem = videojs.extend(Item, {
  constructor: function (player, options) {
    var options = options || {};
    var label = options.text;
    // console.log(options);
    Item.apply(this, arguments);
    this.checked = true;
    this.isSelected = false;
  },
  createEl: function () {
    //在内部不能获取到this.checked
    this.nonIconControl = true;
    var o_ = this;
    var html = "<span>" + o_.options().text + "</span>";

    //       ` <span>${o_.options().text}</span>`;
    html = o_.options().isLabel
      ? //   ? html +
        //     `
        //     <label class="switch" >
        //          <input type="checkbox"
        //              ${o_.options().isChecked ? "checked" : ""}
        //          />
        //          <div class="slider"></div>
        //     </label> `
        //   : html;
        html +
        ' <label class="switch" ><input type="checkbox" ' +
        (o_.options().isChecked ? "checked" : "") +
        '/><div class="slider"></div> </label>'
      : html;

    var el = videojs.dom.createEl("li", {
      className: "vjs-menu-item",
      innerHTML: html,
      tabIndex: -1,
    });
    el.setAttribute("data-name", o_.options().text);
    return el;
  },
  handleClick: function () {
    this.selected(this.el());
    var inputitem = this.el().getElementsByTagName("input")[0];
    // console.log(this.el(), this.player().el());
    if (!inputitem) return false;
    var isChecked = inputitem.checked;
    isChecked = !isChecked;
    var Tagvideo = this.player().el().getElementsByTagName("video")[0];
    console.log(Tagvideo);
    //切换 checkbox
    if (this.el().getAttribute("data-name") == "镜像") {
      isChecked
        ? (Tagvideo.style.transform = "rotateY(180deg)")
        : (Tagvideo.style.transform = "rotateY(0)");
    }
    if (this.el().getAttribute("data-name") == "循环") {
      if (isChecked) {
        this.player().options().loop = true;
      } else {
        this.player().options().loop = false;
      }
    }
    inputitem.checked = isChecked;
  },
  selected: function (selt) {
    // console.log(selt, this.checked);
  },
});
SettingItem.prototype.contentElType = "button";
videojs.registerComponent("SettingItem", SettingItem);
