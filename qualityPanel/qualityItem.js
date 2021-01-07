var Item = videojs.getComponent("MenuItem");
/**
 * @param super 全部替换为 Component.prototype.对应函数.call(this);
 */

var qualityItem = videojs.extend(Item, {
    constructor: function (player, options) {
        var options = options || {};
        var label = options.text;
        // console.log(player, player.options().qualities);
        options.label = label + "P";
        // options.selected = false;
        options.selected = player.options().qualities.find(item => item.label === options.text).name === "default"; //判断传递时候是默认
        options.selectable = true;
        options.multiSelectable = false;
        Item.apply(this, arguments);
        this.label = label;
        this.on(player, "qualitychange", this.update);
    },
    handleClick: function (event) {
        Item.prototype.handleClick.call(this);
        var o_ = this;
        var player = o_.player();
        player.qualityRate = o_.label;
        //切换前状态
        var currentTime = player.currentTime();
        var isPaused = player.paused();
        var playRate = player.playbackRate();
        var currentSource = player.src();
        var posterImageSrc = player.options().poster;
        var options = currentSource.match(/(?<==)(\w+)/g);
        var currentItem = player.playlist.currentItem();
        console.log(o_.label, options, currentItem)
        var usrl = {};

        //本地
        // player.options().qualities.some(item => {
        //     if (item.label === o_.label) {
        //         usrl = item;
        //         return true
        //     }
        // })
        // 异步 ;
        ajax({
            url: "https://www.fastmock.site/mock/ba626d3a3c555c7573691f44c72396fa/videjs/videojs/playquality",
            data: JSON.stringify({
                "name": options[0],
                "label": o_.label
            }),
            method: "POST",
            success: function (data) {
                const result = JSON.parse(data)
                console.log(player.playlist())
                if (result.code == 0) return
                player.src(result.srcurl);
                player.load();
                player.on("loadstart", function () {
                    player.currentTime(currentTime);
                    player.playbackRate(playRate)
                    player.userActive(true)

                    setTimeout(function () {
                        isPaused ? player.pause() : player.play();
                    }, 1000)
                })
                player.playlist()[currentItem].sources[0] = result.srcurl
                player.trigger("qualitychange", {
                    data: o_.label
                });
            },
            error: function (err) {
                console.log(err);
            }
        })


    },
    update: function (event) {
        // console.log(this.label, this.player().qualityRate)
        this.selected(this.label === this.player().qualityRate);

    },
});
qualityItem.prototype.contentElType = "button";
videojs.registerComponent("qualityItem", qualityItem);

function ajax(option) {
    // 创建一个 XMLHttpRequest 对象
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
        requestData = option.data,
        requestUrl = option.url,
        requestMethod = option.method;
    // 如果是GET请求，需要将option中的参数拼接到URL后面
    if ('POST' != requestMethod && requestData) {
        var query_string = '';
        // 遍历option.data对象，构建GET查询参数
        for (var item in requestData) {
            query_string += item + '=' + requestData[item] + '&';
        }
        // 注意这儿拼接的时候，需要判断是否已经有 ?
        requestUrl.indexOf('?') > -1 ?
            requestUrl = requestUrl + '&' + query_string :
            requestUrl = requestUrl + '?' + query_string;

        // GET 请求参数放在URL中，将requestData置为空
        requestData = null;
    }
    // ajax 请求成功之后的回调函数
    xhr.onreadystatechange = function () {

        // readyState=4表示接受响应完毕
        if (xhr.readyState == ("number" == typeof XMLHttpRequest.DONE ? XMLHttpRequest.DONE : 4)) {
            if (200 == xhr.status) { // 判断状态码
                var response = xhr.response || xhr.responseText || {}; // 获取返回值
                // if define success callback, call it, if response is string, convert it to json objcet
                console.log(response);
                option.success && option.success(response); // 调用成功的回调函数处理返回值
                // 可以判断返回数据类型，对数据进行JSON解析或者XML解析
                // option.success && option.success('string' == typeof response ? JSON.parse(response) : response);
            } else {
                // if define error callback, call it
                option.error && option.error(xhr, xhr.statusText);
            }
        }
    };

    // 发送ajax请求

    xhr.open(requestMethod, requestUrl, true);

    // 请求超时的回调

    xhr.ontimeout = function () {

        option.timeout && option.timeout(xhr, xhr.statusText);

    };

    // 定义超时时间

    xhr.timeout = option.timeout || 0;

    // 设置响应头部，这儿默认设置为json格式，可以定义为其他格式，修改头部即可

    xhr.setRequestHeader && xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');

    xhr.withCredentials = (option.xhrFields || {}).withCredentials;

    // 这儿主要用于发送POST请求的数据

    xhr.send(requestData);

}