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
exports.BinaryTree = void 0;
var BinaryRange_1 = require("./BinaryRange");
var BinaryTree = /** @class */ (function () {
    function BinaryTree(opts) {
        this._range = new BinaryRange_1.BinaryRange(0, 0);
        this._items = [];
        this._itemCount = 0;
        this._level = 0;
        this._opts = __assign({}, opts);
        this._range.set(opts.range);
    }
    Object.defineProperty(BinaryTree.prototype, "children", {
        get: function () { return [this._child0, this._child1]; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "maxItems", {
        get: function () { return this._opts.maxItems || 20; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "parent", {
        get: function () { return this._parent; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "level", {
        get: function () { return this._level; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "itemCount", {
        get: function () { return this._itemCount; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "range", {
        get: function () { return this._range; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "items", {
        get: function () { return this._items; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "child0", {
        get: function () { return this._child0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "child1", {
        get: function () { return this._child1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "genChild0", {
        get: function () {
            if (!this._child0) {
                this._child0 = new BinaryTree(__assign(__assign({}, this._opts), { range: this.childRange0 }));
                this._child0._parent = this;
                this._child0._level = this._level + 1;
            }
            return this._child0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "genChild1", {
        get: function () {
            if (!this._child1) {
                this._child1 = new BinaryTree(__assign(__assign({}, this._opts), { range: this.childRange1 }));
                this._child1._parent = this;
                this._child1._level = this._level + 1;
            }
            return this._child1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "childRange0", {
        get: function () {
            if (!this._childRange0)
                this._childRange0 = new BinaryRange_1.BinaryRange(this._range.from, this._range.mid);
            return this._childRange0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BinaryTree.prototype, "childRange1", {
        get: function () {
            if (!this._childRange1)
                this._childRange1 = new BinaryRange_1.BinaryRange(this._range.mid, this._range.to);
            return this._childRange1;
        },
        enumerable: false,
        configurable: true
    });
    BinaryTree.prototype.split = function () {
        if (this._child0 && this._child1)
            return;
        var item, itemRange, inChild0, inChild1, in_lb, in_rb, hitCount;
        for (var i = 0; i < this._items.length; ++i) {
            item = this._items[i];
            itemRange = this._opts.getItemRange(item);
            inChild0 = this.childRange0.hit(itemRange) ? 1 : 0;
            inChild1 = this.childRange1.hit(itemRange) ? 1 : 0;
            hitCount = inChild0 + inChild1;
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
        }
    };
    BinaryTree.prototype.insert = function (item) {
        ++this._itemCount;
        var itemRange = this._opts.getItemRange(item);
        var needSplit = this._itemCount >= this.maxItems;
        needSplit && this.split();
        if (needSplit) {
            var inChild0 = this.childRange0.hit(itemRange) ? 1 : 0;
            var inChild1 = this.childRange1.hit(itemRange) ? 1 : 0;
            if (inChild0)
                return this.genChild0.insert(item);
            else if (inChild1)
                return this.genChild1.insert(item);
        }
        this._items.push(item);
        return this;
    };
    BinaryTree.prototype.removeOnlyUnderMe = function (item) {
        var idx = this._items.indexOf(item);
        if (idx >= 0) {
            --this._itemCount;
            this._items.splice(idx, 1);
            return true;
        }
        return false;
    };
    BinaryTree.prototype.remove = function (item) {
        var _a, _b, _c, _d;
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
        if ((_c = this._child0) === null || _c === void 0 ? void 0 : _c.remove(item)) {
            !this._child0.itemCount && delete this._child0;
        }
        else if ((_d = this._child1) === null || _d === void 0 ? void 0 : _d.remove(item)) {
            !this._child1.itemCount && delete this._child1;
        }
        else {
            return false;
        }
        --this._itemCount;
        if (this._itemCount < this.maxItems)
            this.merge();
        return true;
    };
    BinaryTree.prototype.merge = function () {
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
    };
    return BinaryTree;
}());
exports.BinaryTree = BinaryTree;
//# sourceMappingURL=BinaryTree.js.map