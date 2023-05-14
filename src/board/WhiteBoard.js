"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhiteBoard = void 0;
const event_1 = require("../event");
const tools_1 = require("../tools");
const utils_1 = require("../utils");
const Layer_1 = require("./Layer");
const Tag = '[WhiteBoard]';
class WhiteBoard {
    get width() {
        return this._layers[0].width;
    }
    set width(v) {
        this._layers.forEach(l => l.width = v);
    }
    get height() {
        return this._layers[0].height;
    }
    set height(v) {
        this._layers.forEach(l => l.height = v);
    }
    layer(idx) {
        return this._layers[idx];
    }
    setCurrentLayer(idx) {
        if (idx < 0) {
            return false;
        }
        if (idx > this._layers.length - 1) {
            return false;
        }
        for (let i = 0; i < this._layers.length; ++i) {
            this._layers[i].onscreen.style.pointerEvents = 'none';
        }
        this._currentLayer = this._layers[idx];
        this._currentLayer.onscreen.style.pointerEvents = '';
        return true;
    }
    constructor(factory, options) {
        this._toolType = tools_1.ToolEnum.Pen;
        this._layerMap = {};
        this._mousedown = false;
        this._tools = {};
        this._selects = [];
        this._eventsObserver = new event_1.Observer();
        this._eventEmitter = new event_1.Emitter();
        this._operator = 'whiteboard';
        this.pointerdown = (e) => {
            var _a;
            if (e.button !== 0) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            this._mousedown = true;
            (_a = this.tool) === null || _a === void 0 ? void 0 : _a.pointerDown(this.getDot(e));
        };
        this.pointermove = (e) => {
            var _a, _b;
            if (this._mousedown)
                (_a = this.tool) === null || _a === void 0 ? void 0 : _a.pointerDraw(this.getDot(e));
            else
                (_b = this.tool) === null || _b === void 0 ? void 0 : _b.pointerMove(this.getDot(e));
        };
        this.pointerup = (e) => {
            var _a;
            this._mousedown = false;
            (_a = this.tool) === null || _a === void 0 ? void 0 : _a.pointerUp(this.getDot(e));
        };
        this._factory = factory;
        this._shapesMgr = this._factory.newShapesMgr();
        this._layers = options.layers.map(v => {
            const ret = new Layer_1.Layer(v);
            this._layerMap[ret.name] = ret;
            return ret;
        });
        if (options.width) {
            this.width = options.width;
        }
        if (options.height) {
            this.height = options.height;
        }
        this._dirty = { x: 0, y: 0, w: this.onscreen().width, h: this.onscreen().height };
        for (let i = 0; i < this._layers.length; ++i) {
            this.listenTo(this._layers[i].onscreen, 'pointerdown', this.pointerdown);
            this.listenTo(this._layers[i].onscreen, 'pointermove', this.pointermove);
            this.listenTo(this._layers[i].onscreen, 'pointerup', this.pointerup);
            this._layers[i].onscreen.addEventListener('contextmenu', e => { e.preventDefault(); e.stopPropagation(); });
        }
        this.setCurrentLayer(0);
        this.render();
        if (options.toolType) {
            this.toolType = options.toolType;
        }
    }
    finds(ids) {
        return this._shapesMgr.finds(ids);
    }
    find(id) {
        return this._shapesMgr.find(id);
    }
    toJson() {
        return {
            x: 0, y: 0,
            w: this._layers[0].onscreen.width,
            h: this._layers[0].onscreen.height,
            shapes: this.shapes().map(v => v.data)
        };
    }
    toJsonStr() {
        return JSON.stringify(this.toJson());
    }
    fromJson(jobj) {
        this.removeAll();
        this._layers[0].onscreen.width = jobj.w;
        this._layers[0].onscreen.height = jobj.h;
        this._layers[0].onscreen.width = jobj.w;
        this._layers[0].onscreen.height = jobj.h;
        const shapes = jobj.shapes.map((v) => this.factory.newShape(v));
        this.add(...shapes);
    }
    fromJsonStr(json) {
        this.fromJson(JSON.parse(json));
    }
    shapes() {
        return this._shapesMgr.shapes();
    }
    exists(...items) {
        return this._shapesMgr.exists(...items);
    }
    hit(rect) {
        return this._shapesMgr.hit(rect);
    }
    hits(rect) {
        return this._shapesMgr.hits(rect);
    }
    addEventListener(type, callback) {
        return this._eventEmitter.addEventListener(type, callback);
    }
    removeEventListener(type, callback) {
        return this._eventEmitter.removeEventListener(type, callback);
    }
    dispatchEvent(e) {
        return this._eventEmitter.dispatchEvent(e);
    }
    on(type, callback) {
        return this._eventEmitter.on(type, callback);
    }
    once(type, callback) {
        return this._eventEmitter.once(type, callback);
    }
    emit(e) {
        return this._eventEmitter.emit(e);
    }
    listenTo(target, type, callback) {
        return this._eventsObserver.listenTo(target, type, callback);
    }
    destory() { return this._eventsObserver.destory(); }
    get factory() { return this._factory; }
    set factory(v) { this._factory = v; }
    currentLayer() {
        return this._currentLayer;
    }
    ctx(idx = 0) {
        var _a;
        return (_a = this.onscreen(idx)) === null || _a === void 0 ? void 0 : _a.getContext('2d');
    }
    octx(idx = 0) {
        var _a;
        return (_a = this.offscreen(idx)) === null || _a === void 0 ? void 0 : _a.getContext('2d');
    }
    onscreen(idx = 0) {
        return this._layers[idx].onscreen;
    }
    offscreen(idx = 0) {
        return this._layers[idx].offscreen;
    }
    get toolType() { return this._toolType; }
    set toolType(v) { this.setToolType(v); }
    setToolType(to) {
        if (this._toolType === to)
            return;
        const from = this._toolType;
        this._toolType = to;
        this.emit(new event_1.ToolChangedEvent(this._operator, { from, to }));
    }
    get selects() {
        return this._selects;
    }
    set selects(v) {
        this._selects.forEach(v => v.selected = false);
        this._selects = v;
        this._selects.forEach(v => v.selected = true);
    }
    add(...shapes) {
        if (!shapes.length)
            return 0;
        const ret = this._shapesMgr.add(...shapes);
        shapes.forEach(item => {
            item.board = this;
            if (item.selected)
                this._selects.push(item);
            this.markDirty(item.boundingRect());
        });
        const e = new event_1.ShapesAddedEvent(this._operator, { shapeDatas: shapes.map(v => v.data.copy()) });
        this.emit(e);
        return ret;
    }
    remove(...shapes) {
        if (!shapes.length)
            return 0;
        const ret = this._shapesMgr.remove(...shapes);
        shapes.forEach(item => {
            this.markDirty(item.boundingRect());
            item.board = undefined;
        });
        const e = new event_1.ShapesRemovedEvent(this._operator, { shapeDatas: shapes.map(v => v.data.copy()) });
        this.emit(e);
        return ret;
    }
    removeAll() {
        return this.remove(...this._shapesMgr.shapes());
    }
    removeSelected() {
        this.remove(...this._selects);
        this._selects = [];
    }
    selectAll() {
        this.selects = [...this._shapesMgr.shapes()];
    }
    deselect() {
        this.selects = [];
    }
    selectAt(rect) {
        const ret = this._shapesMgr.hits(rect);
        this.selects = ret;
        return ret;
    }
    selectNear(rect) {
        const ret = this._shapesMgr.hit(rect);
        this.selects = ret ? [ret] : [];
        return ret;
    }
    getDot(ev) {
        const ele = this._layers[0].onscreen;
        const sw = ele.width / ele.offsetWidth;
        const sh = ele.height / ele.offsetHeight;
        const { pressure = 0.5 } = ev;
        return {
            x: Math.floor(sw * ev.offsetX),
            y: Math.floor(sh * ev.offsetY),
            p: pressure
        };
    }
    get tools() { return this._tools; }
    get tool() {
        var _a;
        const toolType = this._toolType;
        if (!this._tool || this._tool.type !== toolType) {
            (_a = this._tool) === null || _a === void 0 ? void 0 : _a.end();
            this._tool = this._factory.newTool(toolType);
            if (this._tool) {
                this._tool.board = this;
                this._tools[toolType] = this._tool;
                this._tool.start();
            }
        }
        return this._tool;
    }
    markDirty(rect) {
        const requestRender = !this._dirty;
        this._dirty = this._dirty ? utils_1.Rect.bounds(this._dirty, rect) : rect;
        requestRender && requestAnimationFrame(() => this.render());
    }
    render() {
        var _a;
        const dirty = this._dirty;
        if (!dirty)
            return;
        for (let i = 0; i < this._layers.length; ++i) {
            this._layers[i].ctx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h);
            this._layers[i].octx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h);
        }
        this._shapesMgr.shapes().forEach(v => {
            const br = v.boundingRect();
            const layer = this._layerMap[v.data.layer];
            if (utils_1.Rect.hit(br, dirty) && layer)
                v.render(layer.octx);
        });
        (_a = this.tool) === null || _a === void 0 ? void 0 : _a.render(this.currentLayer().octx);
        for (let i = 0; i < this._layers.length; ++i) {
            const { ctx, offscreen } = this._layers[i];
            ctx.drawImage(offscreen, dirty.x, dirty.y, dirty.w, dirty.h, dirty.x, dirty.y, dirty.w, dirty.h);
        }
        delete this._dirty;
    }
}
exports.WhiteBoard = WhiteBoard;
//# sourceMappingURL=WhiteBoard.js.map