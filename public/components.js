var inputBox = document.getElementById('textInput');
var button = document.getElementById('submit');
var output = document.getElementById('output');
var Stage = /** @class */ (function () {
    function Stage(image, quote) {
        this.image = image;
        this.quote = quote;
    }
    Stage.prototype.render = function () {
        var _this = this;
        var canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 300;
        var context = canvas.getContext('2d');
        document.body.appendChild(canvas);
        var img = new Image(256, 256);
        img.src = this.image;
        img.onload = function () {
            if (context) {
                context.drawImage(img, 0, 0);
                context.font = context.font.replace(/\d/g, "32");
                context.fillStyle = 'black';
                context.fillText(_this.quote, 128 - context.measureText(_this.quote).width / 2, 288);
            }
        };
    };
    Stage.create = function (image, quote) {
        var stage = new Stage(image, quote);
        stage.render();
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
