"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextTool = void 0;
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var ShapeEnum_1 = require("../ShapeEnum");
var ToolEnum_1 = require("../../tools/ToolEnum");
var Events_1 = require("../../event/Events");
var Tag = '[TextTool]';
var TextTool = /** @class */ (function () {
    function TextTool() {
        var _this = this;
        this._editor = document.createElement('textarea');
        this.setCurShape = function (shape) {
            var preShape = _this._curShape;
            if (preShape === shape)
                return;
            preShape && (preShape.editing = false);
            _this._curShape = shape;
            shape && (shape.editing = true);
            if (shape) {
                _this._updateEditorStyle(shape);
                _this._editor.style.display = 'block';
                _this._editor.value = shape.text;
            }
            else {
                _this._editor.style.display = 'gone';
            }
            if (preShape && !preShape.text) {
                var board = _this.board;
                if (!board)
                    return;
                board.remove(preShape);
            }
        };
        this._updateEditorStyle = function (shape) {
            _this._editor.style.font = shape.data.font;
            _this._editor.style.left = shape.data.x + 'px';
            _this._editor.style.top = shape.data.y + 'px';
            _this._editor.style.minWidth = shape.data.w + 'px';
            _this._editor.style.minHeight = shape.data.h + 'px';
            _this._editor.style.maxWidth = shape.data.w + 'px';
            _this._editor.style.maxHeight = shape.data.h + 'px';
            _this._editor.style.paddingLeft = shape.data.t_l + 'px';
            _this._editor.style.paddingTop = shape.data.t_t + 'px';
        };
        this._updateShapeText = function () {
            var shape = _this._curShape;
            if (!shape)
                return;
            var prev = shape.data.copy();
            shape.setText(_this._editor.value, false);
            shape.setSelection({
                start: _this._editor.selectionStart,
                end: _this._editor.selectionEnd
            });
            _this._updateEditorStyle(shape);
            var board = _this.board;
            if (!board)
                return;
            var curr = shape.data.copy();
            board.emit(new Events_1.ShapesChangedEvent(_this.type, { shapeDatas: [[curr, prev]] }));
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
    TextTool.prototype.start = function () {
        this._editor.addEventListener('input', this._updateShapeText);
        document.addEventListener('selectionchange', this._updateShapeText);
    };
    TextTool.prototype.end = function () {
        this._editor.removeEventListener('input', this._updateShapeText);
        document.removeEventListener('selectionchange', this._updateShapeText);
        this.setCurShape();
    };
    Object.defineProperty(TextTool.prototype, "type", {
        get: function () { return ToolEnum_1.ToolEnum.Text; },
        enumerable: false,
        configurable: true
    });
    TextTool.prototype.render = function () { };
    Object.defineProperty(TextTool.prototype, "board", {
        get: function () {
            return this._board;
        },
        set: function (v) {
            var _a, _b;
            this._board = v;
            (_b = (_a = this._board) === null || _a === void 0 ? void 0 : _a.onscreen.parentElement) === null || _b === void 0 ? void 0 : _b.appendChild(this._editor);
        },
        enumerable: false,
        configurable: true
    });
    TextTool.prototype.pointerMove = function (dot) { };
    TextTool.prototype.pointerDown = function (dot) {
        var _this = this;
        var board = this.board;
        if (!board)
            return;
        var shapeText;
        var shapes = board.hits(__assign(__assign({}, dot), { w: 0, h: 0 }));
        for (var i = 0; i < shapes.length; ++i) {
            var shape = shapes[i];
            if (shape.data.type !== ShapeEnum_1.ShapeEnum.Text)
                continue;
            shapeText = shapes[i];
            break;
        }
        if (!shapeText && this._curShape) {
            return this.setCurShape();
        }
        else if (!shapeText) {
            var newShapeText = board.factory.newShape(ShapeEnum_1.ShapeEnum.Text);
            newShapeText.move(dot.x, dot.y);
            board.add(newShapeText);
            shapeText = newShapeText;
        }
        this.setCurShape(shapeText);
        setTimeout(function () { return _this._editor.focus(); }, 10);
    };
    TextTool.prototype.pointerDraw = function (dot) { };
    TextTool.prototype.pointerUp = function (dot) { };
    return TextTool;
}());
exports.TextTool = TextTool;
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Text, function () { return new TextTool; }, { name: 'text', desc: 'text drawer', shape: ShapeEnum_1.ShapeEnum.Text });
//# sourceMappingURL=Tool.js.map