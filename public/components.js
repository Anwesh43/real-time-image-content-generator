var inputBox = document.getElementById('textInput');
var button = document.getElementById('submit');
var output = document.getElementById('output');
var DELAY = 10;
var Loop = /** @class */ (function () {
    function Loop() {
        this.animated = false;
        this.cbs = [];
        this.count = 0;
    }
    Loop.prototype.push = function (cb) {
        this.count++;
        this.cbs.push({
            id: this.count,
            cb: cb
        });
        return this.count;
    };
    Loop.prototype.start = function () {
        var _this = this;
        if (!this.animated) {
            this.animated = true;
            this.interval = setInterval(function () {
                _this.cbs.forEach(function (an) {
                    an.cb();
                });
            }, DELAY);
        }
    };
    Loop.prototype.stop = function (id) {
        this.cbs = this.cbs.filter(function (an) { return an.id != id; });
        if (this.cbs.length == 0) {
            this.animated = false;
            clearInterval(this.interval);
        }
    };
    return Loop;
}());
var Stage = /** @class */ (function () {
    function Stage(image, quote) {
        this.image = image;
        this.quote = quote;
        this.context = null;
        this.canvas = document.createElement('canvas');
    }
    Stage.prototype.initCanvas = function () {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 500;
        this.canvas.height = 300;
        this.context = this.canvas.getContext('2d');
        output.appendChild(this.canvas);
    };
    Stage.prototype.render = function () {
        var _this = this;
        var w = this.canvas.width;
        var h = this.canvas.height;
        var img = new Image(256, 256);
        img.src = this.image;
        img.onload = function () {
            if (_this.context) {
                var context = _this.context;
                context.fillStyle = '#212121';
                context.fillRect(0, 0, w, h);
                var x = w / 2 - img.width / 2;
                var y = h / 2 - img.height / 2;
                context.drawImage(img, x, y);
                context.font = context.font.replace(/\d+/, "16");
                console.log(context.font);
                context.fillStyle = '#BDBDBD';
                context.fillText(_this.quote, w / 2 - context.measureText(_this.quote).width / 2, y + img.height + 20);
            }
        };
    };
    Stage.create = function (image, quote) {
        var stage = new Stage(image, quote);
        stage.render();
        console.log('imageStr', image);
        return stage;
    };
    return Stage;
}());
var QueryContainer = /** @class */ (function () {
    function QueryContainer() {
        this.queries = [];
        this.count = 0;
    }
    QueryContainer.prototype.addQuery = function (query) {
        this.queries.push(query);
        this.count++;
    };
    QueryContainer.prototype.getCurrQueryId = function () {
        return "query_".concat(this.count);
    };
    return QueryContainer;
}());
var queryContainer = new QueryContainer();
var handleButtonClick = function (cb) {
    button.onclick = function () {
        var query = inputBox.value;
        queryContainer.addQuery(query);
        cb(query, queryContainer.getCurrQueryId());
    };
};
