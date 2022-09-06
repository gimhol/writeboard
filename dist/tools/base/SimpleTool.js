"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTool = void 0;
var RectHelper_1 = require("../../utils/RectHelper");
var Events_1 = require("../../event/Events");
var Tag = '[SimpleTool]';
var SimpleTool = /** @class */ (function () {
    function SimpleTool(type, shapeType) {
        this._rect = new RectHelper_1.RectHelper();
        this._type = type;
        this._shapeType = shapeType;
    }
    Object.defineProperty(SimpleTool.prototype, "type", {
        get: function () { return this._type; },
        enumerable: false,
        configurable: true
    });
    SimpleTool.prototype.start = function () {
    };
    SimpleTool.prototype.end = function () {
        delete this._curShape;
    };
    SimpleTool.prototype.render = function () { };
    Object.defineProperty(SimpleTool.prototype, "board", {
        get: function () {
            return this._board;
        },
        set: function (v) {
            this._board = v;
        },
        enumerable: false,
        configurable: true
    });
    SimpleTool.prototype.pointerMove = function (dot) { };
    SimpleTool.prototype.pointerDown = function (dot) {
        var x = dot.x, y = dot.y;
        var board = this.board;
        if (!board)
            return;
        this._curShape = board.factory.newShape(this._shapeType);
        var shape = this._curShape;
        if (!shape)
            return;
        board.add(shape);
        this._rect.start(x, y);
        this.updateGeo();
    };
    SimpleTool.prototype.pointerDraw = function (dot) {
        var x = dot.x, y = dot.y;
        this._rect.end(x, y);
        this.updateGeo();
    };
    SimpleTool.prototype.pointerUp = function (dot) {
        var x = dot.x, y = dot.y;
        this._rect.end(x, y);
        this.updateGeo();
        delete this._curShape;
    };
    SimpleTool.prototype.updateGeo = function () {
        var _this = this;
        var _a = this._rect.gen(), x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        var shape = this._curShape;
        var board = this.board;
        if (!shape || !board)
            return;
        if (this._prevData) {
            shape.geo(x, y, w, h);
            return;
        }
        this._prevData = (0, Events_1.pickShapeGeoData)(shape.data);
        var prev = this._prevData;
        var emitEvent = function () {
            var curr = (0, Events_1.pickShapeGeoData)(shape.data);
            board.emit(new Events_1.ShapesGeoEvent(_this.type, { shapeDatas: [[curr, prev]] }));
            delete _this._prevData;
        };
        shape.geo(x, y, w, h);
        setTimeout(emitEvent, 1000 / 60);
    };
    return SimpleTool;
}());
exports.SimpleTool = SimpleTool;
//# sourceMappingURL=SimpleTool.js.map