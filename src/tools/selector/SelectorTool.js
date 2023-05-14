"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorTool = exports.SelectorStatus = void 0;
const RectHelper_1 = require("../../utils/RectHelper");
const Data_1 = require("../../shape/base/Data");
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
const Shape_1 = require("../../shape/rect/Shape");
const Events_1 = require("../../event/Events");
const ToolEnum_1 = require("../ToolEnum");
var SelectorStatus;
(function (SelectorStatus) {
    SelectorStatus["Invalid"] = "SELECTOR_STATUS_INVALID";
    SelectorStatus["Dragging"] = "SELECTOR_STATUS_DRAGGING";
    SelectorStatus["Selecting"] = "SELECTOR_STATUS_SELECTING";
})(SelectorStatus = exports.SelectorStatus || (exports.SelectorStatus = {}));
const Tag = '[SelectorTool]';
class SelectorTool {
    get type() { return ToolEnum_1.ToolEnum.Selector; }
    get board() {
        return this._rect.board;
    }
    set board(v) {
        this._rect.board = v;
    }
    constructor() {
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
    render(ctx) {
        this._rect.render(ctx);
    }
    start() {
    }
    end() {
        var _a;
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.deselect();
    }
    pointerDown(dot) {
        const { x, y } = dot;
        this._prevPos = { x, y };
        const board = this.board;
        if (!board)
            return;
        switch (this._status) {
            case SelectorStatus.Invalid:
                this._rectHelper.start(x, y);
                this.updateGeo();
                let shape = board.hit({ x, y, w: 0, h: 0 });
                if (!shape || !shape.selected)
                    shape = board.selectNear({ x, y, w: 0, h: 0 });
                if (shape) {
                    this._status = SelectorStatus.Dragging;
                }
                else {
                    this._status = SelectorStatus.Selecting;
                    this._rect.visible = true;
                }
                this._shapes = board.selects.map(v => {
                    const data = {
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
    }
    pointerMove() { }
    pointerDraw(dot) {
        const diffX = dot.x - this._prevPos.x;
        const diffY = dot.y - this._prevPos.y;
        this._prevPos = dot;
        const board = this.board;
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
                this._shapes.forEach(v => {
                    v.prevData = (0, Events_1.pickShapePositionData)(v.shape.data);
                    v.shape.moveBy(diffX, diffY);
                });
                this.emitEvent(false);
                return;
            }
        }
    }
    emitEvent(immediately) {
        if (this._waiting && !immediately)
            return;
        this._waiting = true;
        const board = this.board;
        if (!board)
            return;
        board.emit(new Events_1.ShapesMovedEvent(this.type, {
            shapeDatas: this._shapes.map(v => {
                return [(0, Events_1.pickShapePositionData)(v.shape.data), v.prevData];
            })
        }));
        setTimeout(() => { this._waiting = false; }, 1000 / 30);
    }
    pointerUp() {
        this._status = SelectorStatus.Invalid;
        this._rect.visible = false;
        this._rectHelper.clear();
        this.emitEvent(true);
    }
    updateGeo() {
        const { x, y, w, h } = this._rectHelper.gen();
        this._rect.geo(x, y, w, h);
    }
}
exports.SelectorTool = SelectorTool;
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Selector, () => new SelectorTool, {
    name: 'selector',
    desc: 'selector'
});
//# sourceMappingURL=SelectorTool.js.map