"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextTool = void 0;
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const Events_1 = require("../../event/Events");
const Tag = '[TextTool]';
class TextTool {
    constructor() {
        this._editor = document.createElement('textarea');
        this.setCurShape = (shape) => {
            const preShape = this._curShape;
            if (preShape === shape)
                return;
            preShape && (preShape.editing = false);
            this._curShape = shape;
            shape && (shape.editing = true);
            if (shape) {
                this._updateEditorStyle(shape);
                this._editor.style.display = 'block';
                this._editor.value = shape.text;
            }
            else {
                this._editor.style.display = 'gone';
            }
            if (preShape && !preShape.text) {
                const board = this.board;
                if (!board)
                    return;
                board.remove(preShape);
            }
        };
        this._updateEditorStyle = (shape) => {
            this._editor.style.font = shape.data.font;
            this._editor.style.left = shape.data.x + 'px';
            this._editor.style.top = shape.data.y + 'px';
            this._editor.style.minWidth = shape.data.w + 'px';
            this._editor.style.minHeight = shape.data.h + 'px';
            this._editor.style.maxWidth = shape.data.w + 'px';
            this._editor.style.maxHeight = shape.data.h + 'px';
            this._editor.style.paddingLeft = shape.data.t_l + 'px';
            this._editor.style.paddingTop = shape.data.t_t + 'px';
        };
        this._updateShapeText = () => {
            const shape = this._curShape;
            if (!shape)
                return;
            const prev = shape.data.copy();
            shape.setText(this._editor.value, false);
            shape.setSelection({
                start: this._editor.selectionStart,
                end: this._editor.selectionEnd
            });
            this._updateEditorStyle(shape);
            const board = this.board;
            if (!board)
                return;
            const curr = shape.data.copy();
            board.emit(new Events_1.ShapesChangedEvent(this.type, { shapeDatas: [[curr, prev]] }));
        };
        this._editor.wrap = 'off';
        this._editor.style.display = 'none';
        this._editor.style.position = 'absolute';
        this._editor.style.left = '0px';
        this._editor.style.top = '0px';
        this._editor.style.boxSizing = 'border-box';
        this._editor.style.outline = 'none';
        this._editor.style.border = 'none';
        this._editor.style.resize = 'none';
        this._editor.style.padding = '0px';
        this._editor.style.margin = '0px';
        this._editor.style.transition = 'none';
        this._editor.style.opacity = '0%';
    }
    start() {
        this._editor.addEventListener('input', this._updateShapeText);
        document.addEventListener('selectionchange', this._updateShapeText);
    }
    end() {
        this._editor.removeEventListener('input', this._updateShapeText);
        document.removeEventListener('selectionchange', this._updateShapeText);
        this.setCurShape();
    }
    get type() { return ToolEnum_1.ToolEnum.Text; }
    render() { }
    get board() {
        return this._board;
    }
    set board(v) {
        var _a, _b, _c;
        this._board = v;
        (_c = (_b = (_a = this._board) === null || _a === void 0 ? void 0 : _a.onscreen(0)) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.appendChild(this._editor);
    }
    pointerMove(dot) { }
    pointerDown(dot) {
        const board = this.board;
        if (!board)
            return;
        let shapeText;
        const shapes = board.hits(Object.assign(Object.assign({}, dot), { w: 0, h: 0 }));
        for (let i = 0; i < shapes.length; ++i) {
            const shape = shapes[i];
            if (shape.data.type !== ShapeEnum_1.ShapeEnum.Text)
                continue;
            shapeText = shapes[i];
            break;
        }
        if (!shapeText && this._curShape) {
            return this.setCurShape();
        }
        else if (!shapeText) {
            const newShapeText = board.factory.newShape(ShapeEnum_1.ShapeEnum.Text);
            newShapeText.data.layer = board.currentLayer().info.name;
            newShapeText.move(dot.x, dot.y);
            board.add(newShapeText);
            shapeText = newShapeText;
        }
        this.setCurShape(shapeText);
        setTimeout(() => this._editor.focus(), 10);
    }
    pointerDraw(dot) { }
    pointerUp(dot) { }
}
exports.TextTool = TextTool;
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Text, () => new TextTool, { name: 'text', desc: 'text drawer', shape: ShapeEnum_1.ShapeEnum.Text });
//# sourceMappingURL=Tool.js.map