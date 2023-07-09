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
        canvas.width = 500;
        canvas.height = 300;
        var context = canvas.getContext('2d');
        output.appendChild(canvas);
        var img = new Image(256, 256);
        img.src = this.image;
        img.onload = function () {
            if (context) {
                context.fillStyle = '#212121';
                context.fillRect(0, 0, canvas.width, canvas.height);
                var x = canvas.width / 2 - img.width / 2;
                var y = canvas.height / 2 - img.height / 2;
                context.drawImage(img, x, y);
                context.font = context.font.replace(/\d+/, "16");
                console.log(context.font);
                context.fillStyle = '#BDBDBD';
                context.fillText(_this.quote, canvas.width / 2 - context.measureText(_this.quote).width / 2, y + img.height + 20);
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
