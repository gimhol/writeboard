"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTool = void 0;
const Events_1 = require("../../event/Events");
const RectHelper_1 = require("../../utils/RectHelper");
const Tag = '[SimpleTool]';
class SimpleTool {
    get type() { return this._type; }
    constructor(type, shapeType) {
        this._keys = {};
        this._rect = new RectHelper_1.RectHelper();
        this._type = type;
        this._shapeType = shapeType;
        window.addEventListener('keydown', e => this.keydown(e));
        window.addEventListener('keyup', e => this.keyup(e));
    }
    keydown(e) {
        switch (e.key) {
            case 'Control':
            case 'Alt':
            case 'Shift':
                if (!this._keys[e.key]) {
                    this._keys[e.key] = true;
                    this.applyRect();
                }
                return;
        }
    }
    keyup(e) {
        switch (e.key) {
            case 'Control':
            case 'Alt':
            case 'Shift':
                if (this._keys[e.key]) {
                    this._keys[e.key] = false;
                    this.applyRect();
                }
                return;
        }
    }
    holdingKey(...keys) {
        for (let i = 0; i < keys.length; ++i) {
            if (!keys[i]) {
                return false;
            }
        }
        return true;
    }
    start() {
    }
    end() {
        delete this._curShape;
    }
    render() { }
    get board() {
        return this._board;
    }
    set board(v) {
        this._board = v;
    }
    pointerMove(dot) { }
    pointerDown(dot) {
        const { x, y } = dot;
        const board = this.board;
        if (!board)
            return;
        this._curShape = board.factory.newShape(this._shapeType);
        this._curShape.data.layer = board.currentLayer().info.name;
        const shape = this._curShape;
        if (!shape)
            return;
        board.add(shape);
        this._rect.start(x, y);
        this.updateGeo();
    }
    pointerDraw(dot) {
        const { x, y } = dot;
        this._rect.end(x, y);
        this.updateGeo();
    }
    pointerUp(dot) {
        const { x, y } = dot;
        this._rect.end(x, y);
        this.updateGeo();
        delete this._curShape;
    }
    applyRect() {
        var _a;
        const { x, y, w, h } = this._rect.gen();
        (_a = this._curShape) === null || _a === void 0 ? void 0 : _a.geo(x, y, w, h);
    }
    updateGeo() {
        const shape = this._curShape;
        const board = this.board;
        if (!shape || !board)
            return;
        if (this._prevData) {
            this.applyRect();
            return;
        }
        this._prevData = (0, Events_1.pickShapeGeoData)(shape.data);
        const prev = this._prevData;
        const emitEvent = () => {
            const curr = (0, Events_1.pickShapeGeoData)(shape.data);
            board.emit(new Events_1.ShapesGeoEvent(this.type, { shapeDatas: [[curr, prev]] }));
            delete this._prevData;
        };
        this.applyRect();
        setTimeout(emitEvent, 1000 / 60);
    }
}
exports.SimpleTool = SimpleTool;
//# sourceMappingURL=SimpleTool.js.map