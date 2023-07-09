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
var Loader = /** @class */ (function () {
    function Loader() {
        this.start = 0;
        this.end = 0;
        this.startDir = 0;
        this.endDir = 1;
        this.shown = true;
    }
    Loader.prototype.draw = function (context, cx, cy) {
        if (!this.shown) {
            return;
        }
        context.strokeStyle = "indigo";
        context.lineCap = 'round';
        context.lineWidth = Math.min(window.innerWidth, window.innerHeight) / 80;
        var r = Math.min(window.innerHeight, window.innerWidth) / 11;
        context.save();
        context.translate(cx, cy);
        context.beginPath();
        for (var j = this.start; j <= this.end; j++) {
            var x = r * Math.cos(j * Math.PI / 180);
            var y = r * Math.sin(j * Math.PI / 180);
            if (j == this.start) {
                context.moveTo(x, y);
            }
            else {
                context.lineTo(x, y);
            }
        }
        context.stroke();
        context.restore();
    };
    Loader.prototype.update = function () {
        this.start += 15 * this.startDir;
        this.end += 15 * this.endDir;
        if (this.end == 360 && this.start == 360) {
            this.startDir = 0;
            this.endDir = 1;
            this.start = 0;
            this.end = 0;
        }
        else if (this.end == 360) {
            this.endDir = 0;
            this.startDir = 1;
        }
    };
    Loader.prototype.render = function (context, cx, cy) {
        this.draw(context, cx, cy);
        this.update();
    };
    Loader.prototype.remove = function () {
        this.shown = false;
    };
    return Loader;
}());
var loop = new Loop();
var Stage = /** @class */ (function () {
    function Stage() {
        this.context = null;
        this.canvas = document.createElement('canvas');
        this.loader = new Loader();
        this.loaderId = -1;
    }
    Stage.prototype.initCanvas = function () {
        var _this = this;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 500;
        this.canvas.height = 300;
        this.context = this.canvas.getContext('2d');
        output.appendChild(this.canvas);
        this.loaderId = loop.push(function () {
            if (_this.context) {
                _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                _this.loader.render(_this.context, _this.canvas.width / 2, _this.canvas.height / 2);
            }
        });
        loop.start();
    };
    Stage.prototype.render = function (image, quote) {
        var _this = this;
        var w = this.canvas.width;
        var h = this.canvas.height;
        var img = new Image(256, 256);
        img.src = image;
        img.onload = function () {
            loop.stop(_this.loaderId);
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
                context.fillText(quote, w / 2 - context.measureText(quote).width / 2, y + img.height + 20);
            }
        };
    };
    Stage.create = function () {
        var stage = new Stage();
        stage.initCanvas();
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
var stageMap = {};
var handleButtonClick = function (cb) {
    button.onclick = function () {
        var query = inputBox.value;
        queryContainer.addQuery(query);
        stageMap[queryContainer.getCurrQueryId()] = Stage.create();
        cb(query, queryContainer.getCurrQueryId());
    };
};
var renderImageWithText = function (queryId, quote, image) {
    stageMap[queryId].render(image, quote);
};
