"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorTool = exports.SelectorStatus = void 0;
var RectHelper_1 = require("../../utils/RectHelper");
var Data_1 = require("../../shape/base/Data");
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var Shape_1 = require("../../shape/rect/Shape");
var Events_1 = require("../../event/Events");
var ToolEnum_1 = require("../ToolEnum");
var SelectorStatus;
(function (SelectorStatus) {
    SelectorStatus["Invalid"] = "SELECTOR_STATUS_INVALID";
    SelectorStatus["Dragging"] = "SELECTOR_STATUS_DRAGGING";
    SelectorStatus["Selecting"] = "SELECTOR_STATUS_SELECTING";
})(SelectorStatus = exports.SelectorStatus || (exports.SelectorStatus = {}));
var Tag = '[SelectorTool]';
var SelectorTool = /** @class */ (function () {
    function SelectorTool() {
        this._rect = new Shape_1.ShapeRect(new Data_1.ShapeData);
        this._rectHelper = new RectHelper_1.RectHelper();
        this._status = SelectorStatus.Invalid;
        this._prevPos = { x: 0, y: 0 };
        this._shapes = [];
        this._waiting = false;
        this._rect.data.lineWidth = 2;
        this._rect.data.strokeStyle = '#003388FF';
        this._rect.data.fillStyle = '#00338855';
    }
    Object.defineProperty(SelectorTool.prototype, "type", {
        get: function () { return ToolEnum_1.ToolEnum.Selector; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SelectorTool.prototype, "board", {
        get: function () {
            return this._rect.board;
        },
        set: function (v) {
            this._rect.board = v;
        },
        enumerable: false,
        configurable: true
    });
    SelectorTool.prototype.render = function (ctx) {
        this._rect.render(ctx);
    };
    SelectorTool.prototype.start = function () {
    };
    SelectorTool.prototype.end = function () {
        var _a;
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.deselect();
    };
    SelectorTool.prototype.pointerDown = function (dot) {
        var x = dot.x, y = dot.y;
        this._prevPos = { x: x, y: y };
        var board = this.board;
        if (!board)
            return;
        switch (this._status) {
            case SelectorStatus.Invalid:
                this._rectHelper.start(x, y);
                this.updateGeo();
                var shape = board.hit({ x: x, y: y, w: 0, h: 0 });
                if (!shape || !shape.selected)
                    shape = board.selectNear({ x: x, y: y, w: 0, h: 0 });
                if (shape) {
                    this._status = SelectorStatus.Dragging;
                }
                else {
                    this._status = SelectorStatus.Selecting;
                    this._rect.visible = true;
                }
                this._shapes = board.selects.map(function (v) {
                    var data = {
                        i: v.data.i,
                        x: v.data.x,
                        y: v.data.y
                    };
                    return {
                        shape: v,
                        prevData: data
                    };
                });
                return;
        }
    };
    SelectorTool.prototype.pointerMove = function () { };
    SelectorTool.prototype.pointerDraw = function (dot) {
        var diffX = dot.x - this._prevPos.x;
        var diffY = dot.y - this._prevPos.y;
        this._prevPos = dot;
        var board = this.board;
        if (!board)
            return;
        switch (this._status) {
            case SelectorStatus.Selecting: {
                this._rectHelper.end(dot.x, dot.y);
                this.updateGeo();
                board.selectAt(this._rect.data);
                return;
            }
            case SelectorStatus.Dragging: {
                this._shapes.forEach(function (v) {
                    v.prevData = (0, Events_1.pickShapePositionData)(v.shape.data);
                    v.shape.moveBy(diffX, diffY);
                });
                this.emitEvent(false);
                return;
            }
        }
    };
    SelectorTool.prototype.emitEvent = function (immediately) {
        var _this = this;
        if (this._waiting && !immediately)
            return;
        this._waiting = true;
        var board = this.board;
        if (!board)
            return;
        board.emit(new Events_1.ShapesMovedEvent(this.type, {
            shapeDatas: this._shapes.map(function (v) {
                return [(0, Events_1.pickShapePositionData)(v.shape.data), v.prevData];
            })
        }));
        setTimeout(function () { _this._waiting = false; }, 1000 / 30);
    };
    SelectorTool.prototype.pointerUp = function () {
        this._status = SelectorStatus.Invalid;
        this._rect.visible = false;
        this._rectHelper.clear();
        this.emitEvent(true);
    };
    SelectorTool.prototype.updateGeo = function () {
        var _a = this._rectHelper.gen(), x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        this._rect.geo(x, y, w, h);
    };
    return SelectorTool;
}());
exports.SelectorTool = SelectorTool;
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Selector, function () { return new SelectorTool; }, {
    name: 'selector',
    desc: 'selector'
});
//# sourceMappingURL=SelectorTool.js.map