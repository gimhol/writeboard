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
exports.QuadTree = void 0;
var Rect_1 = require("./Rect");
var QuadTree = /** @class */ (function () {
    function QuadTree(opts) {
        this._items = [];
        this._itemCount = 0;
        this._rect = new Rect_1.Rect(0, 0, 0, 0);
        this._level = 0;
        this._opts = __assign({}, opts);
        this._rect.set(opts.rect);
    }
    Object.defineProperty(QuadTree.prototype, "children", {
        get: function () { return [this._child0, this._child1, this._child2, this._child3]; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "maxItems", {
        get: function () { return this._opts.maxItems || 20; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "parent", {
        get: function () { return this._parent; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "level", {
        get: function () { return this._level; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "itemCount", {
        get: function () { return this._itemCount; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "rect", {
        get: function () { return this._rect; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "items", {
        get: function () { return this._items; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "child0", {
        get: function () { return this._child0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "child1", {
        get: function () { return this._child1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "child2", {
        get: function () { return this._child2; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "child3", {
        get: function () { return this._child3; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "genChild0", {
        get: function () {
            if (!this._child0) {
                this._child0 = new QuadTree(__assign(__assign({}, this._opts), { rect: this.childRect0 }));
                this._child0._parent = this;
                this._child0._level = this._level + 1;
            }
            return this._child0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "genChild1", {
        get: function () {
            if (!this._child1) {
                this._child1 = new QuadTree(__assign(__assign({}, this._opts), { rect: this.childRect1 }));
                this._child1._parent = this;
                this._child1._level = this._level + 1;
            }
            return this._child1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "genChild2", {
        get: function () {
            if (!this._child2) {
                this._child2 = new QuadTree(__assign(__assign({}, this._opts), { rect: this.childRect2 }));
                this._child2._parent = this;
                this._child2._level = this._level + 1;
            }
            return this._child2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "genChild3", {
        get: function () {
            if (!this._child3) {
                this._child3 = new QuadTree(__assign(__assign({}, this._opts), { rect: this.childRect3 }));
                this._child3._parent = this;
                this._child3._level = this._level + 1;
            }
            return this._child3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "childRect0", {
        get: function () {
            if (!this._childRect0) {
                var _a = this.rect, x = _a.x, y = _a.y;
                var w = this.rect.w / 2;
                var h = this.rect.h / 2;
                this._childRect0 = new Rect_1.Rect(x, y, w, h);
            }
            return this._childRect0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "childRect1", {
        get: function () {
            if (!this._childRect1) {
                var y = this.rect.y;
                var w = this.rect.w / 2;
                var h = this.rect.h / 2;
                var midX = this.rect.mid().x;
                this._childRect1 = new Rect_1.Rect(midX, y, w, h);
            }
            return this._childRect1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "childRect2", {
        get: function () {
            if (!this._childRect2) {
                var x = this.rect.x;
                var w = this.rect.w / 2;
                var h = this.rect.h / 2;
                var midY = this.rect.mid().y;
                this._childRect2 = new Rect_1.Rect(x, midY, w, h);
            }
            return this._childRect2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "childRect3", {
        get: function () {
            if (!this._childRect3) {
                var w = this.rect.w / 2;
                var h = this.rect.h / 2;
                var _a = this.rect.mid(), midX = _a.x, midY = _a.y;
                this._childRect3 = new Rect_1.Rect(midX, midY, w, h);
            }
            return this._childRect3;
        },
        enumerable: false,
        configurable: true
    });
    QuadTree.prototype.split = function () {
        if (this._child0 && this._child1 && this._child2 && this._child3)
            return;
        var item, itemRect, inChild0, inChild1, inChild2, inChild3, hitCount;
        for (var i = 0; i < this._items.length; ++i) {
            item = this._items[i];
            itemRect = this._opts.getItemRect(item);
            inChild0 = this.childRect0.hit(itemRect) ? 1 : 0;
            inChild1 = this.childRect1.hit(itemRect) ? 1 : 0;
            inChild2 = this.childRect2.hit(itemRect) ? 1 : 0;
            inChild3 = this.childRect3.hit(itemRect) ? 1 : 0;
            hitCount = inChild0 + inChild1 + inChild2 + inChild3;
            if (hitCount !== 1)
                continue;
            this._items.splice(i, 1);
            --i;
            if (inChild0) {
                this.genChild0.insert(item);
                this._opts.onTreeChanged && this._opts.onTreeChanged(item, this, this.genChild0);
            }
            else if (inChild1) {
                this.genChild1.insert(item);
                this._opts.onTreeChanged && this._opts.onTreeChanged(item, this, this.genChild1);
            }
            else if (inChild2) {
                this.genChild2.insert(item);
                this._opts.onTreeChanged && this._opts.onTreeChanged(item, this, this.genChild2);
            }
            else if (inChild3) {
                this.genChild3.insert(item);
                this._opts.onTreeChanged && this._opts.onTreeChanged(item, this, this.genChild3);
            }
        }
    };
    QuadTree.prototype.insert = function (item) {
        ++this._itemCount;
        var itemRect = this._opts.getItemRect(item);
        var needSplit = this._itemCount >= this.maxItems;
        needSplit && this.split();
        if (needSplit) {
            var inChild0 = this.childRect0.hit(itemRect) ? 1 : 0;
            var inChild1 = this.childRect1.hit(itemRect) ? 1 : 0;
            var inChild2 = this.childRect2.hit(itemRect) ? 1 : 0;
            var inChild3 = this.childRect3.hit(itemRect) ? 1 : 0;
            if (inChild0)
                return this.genChild0.insert(item);
            else if (inChild1)
                return this.genChild1.insert(item);
            else if (inChild2)
                return this.genChild2.insert(item);
            else if (inChild3)
                return this.genChild3.insert(item);
        }
        this._items.push(item);
        return this;
    };
    QuadTree.prototype.removeOnlyUnderMe = function (item) {
        var idx = this._items.indexOf(item);
        if (idx >= 0) {
            --this._itemCount;
            this._items.splice(idx, 1);
            return true;
        }
        return false;
    };
    QuadTree.prototype.remove = function (item) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this._opts.getTree) {
            // 从子节点到父节点的移除逻辑
            var tree = this._opts.getTree(item);
            if (!tree)
                return false;
            var result = tree.removeOnlyUnderMe(item);
            tree._itemCount++;
            var treeNeedMerge = void 0;
            do {
                --tree._itemCount;
                if (tree._itemCount <= 0) {
                    if (((_a = tree.parent) === null || _a === void 0 ? void 0 : _a._child0) === tree)
                        delete tree.parent._child0;
                    if (((_b = tree.parent) === null || _b === void 0 ? void 0 : _b._child1) === tree)
                        delete tree.parent._child1;
                    if (((_c = tree.parent) === null || _c === void 0 ? void 0 : _c._child2) === tree)
                        delete tree.parent._child2;
                    if (((_d = tree.parent) === null || _d === void 0 ? void 0 : _d._child3) === tree)
                        delete tree.parent._child3;
                }
                else if (tree._itemCount < this.maxItems) {
                    treeNeedMerge = tree;
                }
                tree = tree.parent;
            } while (tree);
            treeNeedMerge === null || treeNeedMerge === void 0 ? void 0 : treeNeedMerge.merge();
            return result;
        }
        // 从父节点的到子节点移除逻辑
        if (this.removeOnlyUnderMe(item))
            return true;
        if ((_e = this._child0) === null || _e === void 0 ? void 0 : _e.remove(item)) {
            !this._child0.itemCount && delete this._child0;
        }
        else if ((_f = this._child1) === null || _f === void 0 ? void 0 : _f.remove(item)) {
            !this._child1.itemCount && delete this._child1;
        }
        else if ((_g = this._child2) === null || _g === void 0 ? void 0 : _g.remove(item)) {
            !this._child2.itemCount && delete this._child2;
        }
        else if ((_h = this._child3) === null || _h === void 0 ? void 0 : _h.remove(item)) {
            !this._child3.itemCount && delete this._child3;
        }
        else {
            return false;
        }
        --this._itemCount;
        if (this._itemCount < this.maxItems)
            this.merge();
        return true;
    };
    QuadTree.prototype.merge = function () {
        var _this = this;
        this.children.forEach(function (child) {
            if (!child)
                return;
            child.merge();
            child._items.forEach(function (item) {
                _this.items.push(item);
                _this._opts.onTreeChanged && _this._opts.onTreeChanged(item, child, _this);
            });
        });
        delete this._child0;
        delete this._child1;
        delete this._child2;
        delete this._child3;
    };
    return QuadTree;
}());
exports.QuadTree = QuadTree;
//# sourceMappingURL=QuadTree.js.map