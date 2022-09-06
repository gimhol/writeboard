"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenTool = void 0;
var ToolEnum_1 = require("../../tools/ToolEnum");
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var ShapeEnum_1 = require("../ShapeEnum");
var Events_1 = require("../../event/Events");
var Data_1 = require("./Data");
var Tag = '[PenTool]';
var PenTool = /** @class */ (function () {
    function PenTool() {
    }
    PenTool.prototype.start = function () {
    };
    PenTool.prototype.end = function () {
        delete this._curShape;
    };
    Object.defineProperty(PenTool.prototype, "type", {
        get: function () { return ToolEnum_1.ToolEnum.Pen; },
        enumerable: false,
        configurable: true
    });
    PenTool.prototype.render = function () { };
    Object.defineProperty(PenTool.prototype, "board", {
        get: function () {
            return this._board;
        },
        set: function (v) {
            this._board = v;
        },
        enumerable: false,
        configurable: true
    });
    PenTool.prototype.addDot = function (dot, type) {
        var _this = this;
        var shape = this._curShape;
        var board = this.board;
        if (!shape || !board)
            return;
        if (this._prevData)
            return shape.appendDot(dot, type);
        var emitEvent = function () {
            var prev = _this._prevData;
            if (!prev)
                return;
            var curr = shape.data.copy();
            curr.dotsType = Data_1.DotsType.Append;
            curr.coords.splice(0, prev.coords.length);
            board.emit(new Events_1.ShapesChangedEvent(_this.type, { shapeDatas: [[curr, prev]] }));
            delete _this._prevData;
        };
        this._prevData = shape.data.copy();
        var prev = this._prevData;
        if (prev.coords.length <= 0) {
            shape.appendDot(dot, type);
            emitEvent();
        }
        else {
            shape.appendDot(dot, type);
            setTimeout(emitEvent, 1000 / 30);
        }
    };
    PenTool.prototype.pointerMove = function (dot) { };
    PenTool.prototype.pointerDown = function (dot) {
        var board = this.board;
        if (!board)
            return;
        this._curShape = board.factory.newShape(ShapeEnum_1.ShapeEnum.Pen);
        this._curShape.data.editing = true;
        board.add(this._curShape);
        this.addDot(dot, 'first');
    };
    PenTool.prototype.pointerDraw = function (dot) {
        this.addDot(dot);
    };
    PenTool.prototype.pointerUp = function (dot) {
        var shape = this._curShape;
        if (shape)
            shape.data.editing = false;
        this.addDot(dot, 'last');
        this.end();
    };
    return PenTool;
}());
exports.PenTool = PenTool;
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Pen, function () { return new PenTool(); }, { name: 'pen', desc: 'simple pen', shape: ShapeEnum_1.ShapeEnum.Pen });
//# sourceMappingURL=Tool.js.map