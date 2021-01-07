var MenuButton = videojs.getComponent("MenuButton");
var Menu = videojs.getComponent("Menu");
/**
 * @param super 全部替换为 MenuButton.prototype.对应函数.call(this);
 */

var qualityMenuButton = videojs.extend(MenuButton, {
    constructor: function (player, options) {
        var options = options || {};
        MenuButton.apply(this, arguments);
        // this.addClass("vjs-quality-panel");  // vs buildCssClass互斥
        this.on("keydown", this.handleKeyPress);
        this.on("mouseover", this.handleMouseOver);
        this.on("mouseout", this.handleMouseOut);
        this.updateVisibility();
        this.updateLabel();
        this.player().qualityRate = "360";
        this.updateQuality();
        this.on(player, "loadstart", this.updateVisibility);
        this.on(player, "qualitychange", this.updateLabel);
    },
    updateQuality: function () {

        if (this.player().playlist()) {
            this.player().qualityRate = this.player().src().match(/(?<==)(\w+)/g)[1]
        } else this.qualityRates().map(da => {
            if (da.name == 'default') {
                this.player().qualityRate = da.label;
                return true
            }
        });
    },

    createEl: function () {
        var el = MenuButton.prototype.createEl.call(this);
        // console.log(el);
        this.labelEl_ = videojs.dom.createEl("div", {
            className: "vjs-quality-value",
            innerHTML: "自动",
        });

        el.appendChild(this.labelEl_);
        return el;
    },

    buildCSSClass: function () {
        var origin = MenuButton.prototype.buildCSSClass.call(this);
        // return `vjs-quality-panel  ${MenuButton.prototype.buildCSSClass.call(this)}`;
        return "vjs-quality-panel " + origin;
    },

    buildWrapperCSSClass: function () {
        var origin = MenuButton.prototype.buildWrapperCSSClass.call(this);
        // return `vjs-quality-panel  ${MenuButton.prototype.buildCSSClass.call(this)}`;
        return "vjs-quality-panel " + origin;
        // return `vjs-quality-panel  ${MenuButton.prototype.buildWrapperCSSClass.call(
        //   this
        // )}`;
    },
    dispose: function () {
        this.labelEl_ = null;
        this.player().qualityRate = null
        MenuButton.prototype.dispose.call(this);
    },
    handleClick: function (e) {
        const currentRate = this.player().qualityRate;
        const rates = this.qualityRates().map(da => da.label).sort((a, b) => a - b);
        // this will select first one if the last one currently selected
        let newRate = rates[0];
        for (var i = 0; i < rates.length; i++) {
            if (Number(rates[i]) > Number(currentRate)) {
                newRate = rates[i];
                break;
            }
        }
        //   console.log(newRate, currentRate)
        this.player().qualityRate = newRate
        this.player().trigger("qualitychange", {
            data: newRate
        });
    },
    createMenu: function () {
        var menu = new Menu(this.player()),
            o = this,
            rates = this.qualityRates();
        var qualities = rates.map(it => it.label).sort((a, b) => b - a)

        for (let index = 0; index < qualities.length; index++) {
            var Item = new qualityItem(this.player(), {
                text: qualities[index],
            });
            menu.addChild(Item);
        }
        return menu;
    },
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
    /**
     * Get possible playquality rates
     *
     * @return {Array}
     *         All possible playquality rates
     */
    qualityRates: function () {
        return this.player().options().qualities || []
    },
    /**
     * Get whether playquality rates is supported by the tech
     * and an array of playback rates exists
     *
     * @return {boolean}
     * Whether changing playquality rate is supported
     */
    playQualitySupported: function () {
        // return true;
        return (
            this.player().tech_ &&
            this.player().qualityRate &&
            this.qualityRates() &&
            this.qualityRates().length > 0
        );
    },
    updateVisibility: function (event) {
        if (this.playQualitySupported()) {
            this.removeClass("vjs-hidden");
        } else {
            this.addClass("vjs-hidden");
        }
    },
    updateLabel: function (event, value) {
        // console.log("updateLabel", event, value);
        if (this.playQualitySupported()) {
            this.player().qualityRate = value.data;
            this.labelEl_.innerHTML = value.data + "P"
            this.qualityRates().some(da => {
                if (da.name == "default" && (da.label === value.data)) {
                    this.labelEl_.innerHTML = "自动"
                    return true
                }
            })
        }
    },
});
qualityMenuButton.prototype.controlText_ = "清晰度";

videojs.registerComponent("qualityMenuButton", qualityMenuButton);