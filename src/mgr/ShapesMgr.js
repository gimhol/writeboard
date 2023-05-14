"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapesMgr = void 0;
const Array_1 = require("../utils/Array");
const Rect_1 = require("../utils/Rect");
const Tag = '[ShapesMgr]';
class ShapesMgr {
    constructor() {
        this._items = [];
        this._kvs = {};
    }
    finds(ids) {
        const ret = [];
        ids.forEach(id => {
            const shape = this._kvs[id];
            shape && ret.push(shape);
        });
        return ret;
    }
    find(id) {
        return this._kvs[id];
    }
    shapes() { return this._items; }
    exists(...items) {
        let ret = 0;
        items.forEach(v => {
            if (this._kvs[v.data.id])
                ++ret;
        });
        return ret;
    }
    add(...items) {
        let ret = 0;
        items.forEach(item => {
            if (this.exists(item))
                return console.warn(Tag, `can not add "${item.data.id}", already exists!`);
            this._kvs[item.data.id] = item;
            this._items.push(item);
            ++ret;
        });
        this._items.sort((a, b) => a.data.z - b.data.z);
        return ret;
    }
    remove(...items) {
        let ret = 0;
        items.forEach(item => {
            const idx = (0, Array_1.findIndex)(this._items, v => v === item);
            if (idx < 0)
                return;
            this._items = this._items.filter((_, i) => i !== idx);
            delete this._kvs[item.data.id];
            ++ret;
        });
        return ret;
    }
    hits(rect) {
        const count = this._items.length;
        const ret = [];
        for (let idx = count - 1; idx >= 0; --idx) {
            const v = this._items[idx];
            if (Rect_1.Rect.hit(v.data, rect))
                ret.push(v);
        }
        return ret;
    }
    hit(rect) {
        const count = this._items.length;
        for (let idx = count - 1; idx >= 0; --idx) {
            const v = this._items[idx];
            if (Rect_1.Rect.hit(v.data, rect))
                return v;
        }
    }
}
exports.ShapesMgr = ShapesMgr;
//# sourceMappingURL=ShapesMgr.js.map