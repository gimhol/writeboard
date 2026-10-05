var Events;
(function (Events) {
    function pickShapePosData(data) {
        return {
            i: data.i,
            x: data.x,
            y: data.y,
        };
    }
    Events.pickShapePosData = pickShapePosData;
    function pickShapeGeoData(data) {
        return {
            i: data.i,
            x: data.x,
            y: data.y,
            w: data.w,
            h: data.h,
            r: data.r
        };
    }
    Events.pickShapeGeoData = pickShapeGeoData;
})(Events || (Events = {}));

var EventEnum;
(function (EventEnum) {
    EventEnum["Invalid"] = "";
    EventEnum["ShapesAdded"] = "SHAPES_ADDED";
    EventEnum["ShapesRemoved"] = "SHAPES_REMOVED";
    EventEnum["ShapesChanging"] = "SHAPES_CHANGING";
    EventEnum["ShapesChanged"] = "SHAPES_CHANGED";
    EventEnum["ShapesDone"] = "SHAPES_DONE";
    EventEnum["ShapesGeoChanging"] = "SHAPES_GEO_CHANGING";
    EventEnum["ShapesGeoChanged"] = "SHAPES_GEO_CHANGED";
    EventEnum["ToolChanged"] = "TOOL_CHANGED";
    EventEnum["LayerAdded"] = "LAYER_ADDED";
    EventEnum["LayerRemoved"] = "LAYER_REMOVED";
    EventEnum["ShapesSelected"] = "SHAPES_SELECTED";
    EventEnum["ShapesDeselected"] = "SHAPES_DESELECTED";
    EventEnum["WorldRectChanged"] = "WORLD_RECT_CHANGED";
    EventEnum["ViewportChanged"] = "VIEWPORT_CHANGED";
    /** 工具在画布上移动 */
    EventEnum["ToolMove"] = "TOOL_MOVE";
    /** 工具按下 */
    EventEnum["ToolDown"] = "TOOL_DOWN";
    /** 工具在画布上移动（按下后） */
    EventEnum["ToolDraw"] = "TOOL_DRAW";
    /** 工具抬起 */
    EventEnum["ToolUp"] = "TOOL_UP";
})(EventEnum || (EventEnum = {}));

const isNum = (x) => typeof x === 'number';
const isStr = (x) => typeof x === 'string';
const findKey = (obj, value) => Object.keys(obj).find(k => obj[k] === value);
const enumNameGetter = (name, e) => (value) => {
    const k = findKey(e, value);
    return isStr(k) ? `${name}.${k}` : '' + value;
};

class ShapeStyle {
    get fillStyle() { return this.b || ''; }
    set fillStyle(v) { if (v)
        this.b = v;
    else
        delete this.b; }
    get strokeStyle() { return this.a || ''; }
    set strokeStyle(v) { if (v)
        this.a = v;
    else
        delete this.a; }
    get lineCap() { return this.c || 'round'; }
    set lineCap(v) { if (v)
        this.c = v;
    else
        delete this.c; }
    get lineDash() { return this.d || []; }
    set lineDash(v) {
        if (Array.isArray(v) && v.length > 0)
            this.d = [...v];
        else
            delete this.d;
    }
    get lineDashOffset() { return this.e || 0; }
    set lineDashOffset(v) { if (v)
        this.e = v;
    else
        delete this.e; }
    get lineJoin() { return this.f || 'round'; }
    set lineJoin(v) { if (v)
        this.f = v;
    else
        delete this.f; }
    get lineWidth() { return this.g || 0; }
    set lineWidth(v) { if (v)
        this.g = v;
    else
        delete this.g; }
    get miterLimit() { return this.h || 0; }
    set miterLimit(v) { if (v)
        this.h = v;
    else
        delete this.h; }
    merge(o) {
        return this.read(o);
    }
    read(o) {
        if (o.a)
            this.a = o.a;
        if (o.b)
            this.b = o.b;
        if (o.c)
            this.c = o.c;
        if (o.d)
            this.d = [...o.d];
        if (isNum(o.e))
            this.e = o.e;
        if (o.f)
            this.f = o.f;
        if (isNum(o.g))
            this.g = o.g;
        if (isNum(o.h))
            this.h = o.h;
        return this;
    }
    copy() {
        const ret = new (Object.getPrototypeOf(this).constructor);
        return ret.read(this);
    }
}

/**
 * 表示图形能以何种方式被拉伸
 *
 * @export
 * @enum {number}
 */
var Resizable;
(function (Resizable) {
    /** 禁止 */ Resizable[Resizable["None"] = 0] = "None";
    Resizable[Resizable["TopLeft"] = 1] = "TopLeft";
    Resizable[Resizable["Top"] = 2] = "Top";
    Resizable[Resizable["TopRight"] = 4] = "TopRight";
    Resizable[Resizable["Right"] = 8] = "Right";
    Resizable[Resizable["BottomRight"] = 16] = "BottomRight";
    Resizable[Resizable["Bottom"] = 32] = "Bottom";
    Resizable[Resizable["BottomLeft"] = 64] = "BottomLeft";
    Resizable[Resizable["Left"] = 128] = "Left";
    /** 水平 */ Resizable[Resizable["Horizontal"] = 136] = "Horizontal";
    /** 垂直 */ Resizable[Resizable["Vertical"] = 34] = "Vertical";
    /** 四角 */ Resizable[Resizable["Corner"] = 85] = "Corner";
    /** 八向 */ Resizable[Resizable["All"] = 255] = "All";
})(Resizable || (Resizable = {}));
const opposites = {
    [Resizable.None]: Resizable.None,
    [Resizable.TopLeft]: Resizable.BottomRight,
    [Resizable.Top]: Resizable.Bottom,
    [Resizable.TopRight]: Resizable.BottomLeft,
    [Resizable.Right]: Resizable.Left,
    [Resizable.BottomRight]: Resizable.TopLeft,
    [Resizable.Bottom]: Resizable.Top,
    [Resizable.BottomLeft]: Resizable.TopRight,
    [Resizable.Left]: Resizable.Right,
    [Resizable.Horizontal]: Resizable.Horizontal,
    [Resizable.Vertical]: Resizable.Vertical,
    [Resizable.Corner]: Resizable.Corner,
    [Resizable.All]: Resizable.All,
};
const degrees = {
    [Resizable.Top]: 0,
    [Resizable.TopRight]: 0.7853981633974483,
    [Resizable.Right]: 1.5707963267948966,
    [Resizable.BottomRight]: 2.356194490192345,
    [Resizable.Bottom]: 3.141592653589793,
    [Resizable.BottomLeft]: 3.9269908169872414,
    [Resizable.Left]: 4.71238898038469,
    [Resizable.TopLeft]: 5.497787143782138,
    [Resizable.None]: NaN,
    [Resizable.Horizontal]: NaN,
    [Resizable.Vertical]: NaN,
    [Resizable.Corner]: NaN,
    [Resizable.All]: NaN
};

/**
 * 数组类型相关的工具函数
 */
var Arrays;
(function (Arrays) {
    function firstOf(arr, transform) {
        for (let i = 0, len = arr.length; i < len; i++) {
            const result = transform(arr[i]);
            if (result !== null && result !== void 0) {
                return result;
            }
        }
        return null;
    }
    Arrays.firstOf = firstOf;
})(Arrays || (Arrays = {}));

class BinaryRange {
    constructor(f, t) {
        this.from = f;
        this.to = t;
    }
    set(range) {
        this.from = range.from;
        this.to = range.to;
    }
    get mid() {
        return (this.from + this.to) / 2;
    }
    hit(other) {
        return !(this.from > other.to) && !(this.to < other.from);
    }
}

class BinaryTree {
    constructor(opts) {
        this._range = new BinaryRange(0, 0);
        this._items = [];
        this._itemCount = 0;
        this._level = 0;
        this._opts = Object.assign({}, opts);
        this._range.set(opts.range);
    }
    get children() { return [this._child0, this._child1]; }
    get maxItems() { return this._opts.maxItems || 20; }
    get parent() { return this._parent; }
    get level() { return this._level; }
    get itemCount() { return this._itemCount; }
    get range() { return this._range; }
    get items() { return this._items; }
    get child0() { return this._child0; }
    get child1() { return this._child1; }
    get genChild0() {
        if (!this._child0) {
            this._child0 = new BinaryTree(Object.assign(Object.assign({}, this._opts), { range: this.childRange0 }));
            this._child0._parent = this;
            this._child0._level = this._level + 1;
        }
        return this._child0;
    }
    get genChild1() {
        if (!this._child1) {
            this._child1 = new BinaryTree(Object.assign(Object.assign({}, this._opts), { range: this.childRange1 }));
            this._child1._parent = this;
            this._child1._level = this._level + 1;
        }
        return this._child1;
    }
    get childRange0() {
        if (!this._childRange0)
            this._childRange0 = new BinaryRange(this._range.from, this._range.mid);
        return this._childRange0;
    }
    get childRange1() {
        if (!this._childRange1)
            this._childRange1 = new BinaryRange(this._range.mid, this._range.to);
        return this._childRange1;
    }
    split() {
        if (this._child0 && this._child1)
            return;
        let item, itemRange, inChild0, inChild1, hitCount;
        for (let i = 0; i < this._items.length; ++i) {
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
    }
    insert(item) {
        ++this._itemCount;
        const itemRange = this._opts.getItemRange(item);
        const needSplit = this._itemCount >= this.maxItems;
        needSplit && this.split();
        if (needSplit) {
            const inChild0 = this.childRange0.hit(itemRange) ? 1 : 0;
            const inChild1 = this.childRange1.hit(itemRange) ? 1 : 0;
            if (inChild0)
                return this.genChild0.insert(item);
            else if (inChild1)
                return this.genChild1.insert(item);
        }
        this._items.push(item);
        return this;
    }
    removeOnlyUnderMe(item) {
        const idx = this._items.indexOf(item);
        if (idx >= 0) {
            --this._itemCount;
            this._items.splice(idx, 1);
            return true;
        }
        return false;
    }
    remove(item) {
        var _a, _b, _c, _d;
        if (this._opts.getTree) {
            // 从子节点到父节点的移除逻辑
            let tree = this._opts.getTree(item);
            if (!tree)
                return false;
            const result = tree.removeOnlyUnderMe(item);
            tree._itemCount++;
            let treeNeedMerge;
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
    }
    merge() {
        this.children.forEach(child => {
            if (!child)
                return;
            child.merge();
            child._items.forEach(item => {
                this.items.push(item);
                this._opts.onTreeChanged && this._opts.onTreeChanged(item, child, this);
            });
        });
        delete this._child0;
        delete this._child1;
    }
}

/**
 * 数字类型相关的工具函数
 */
var Numbers;
(function (Numbers) {
    function isVaild(n) {
        if (typeof n !== 'number')
            return false;
        return !Number.isNaN(n);
    }
    Numbers.isVaild = isVaild;
    /**
     * 判断两个数值是否相等
     *
     * 差值小于等于Number.EPSILON时，视为相等
     *
     * @export
     * @see {Number.EPSILON}
     * @param {number} a 值1
     * @param {number} b 值2
     * @return {boolean} a等于b时返回true，否则返回false
     */
    function equals(a, b) {
        return Math.abs(a - b) <= Number.EPSILON;
    }
    Numbers.equals = equals;
})(Numbers || (Numbers = {}));
/**
 * 角度弧度相关的工具函数
 */
var Degrees;
(function (Degrees) {
    const { PI } = Math;
    const PI_2 = PI * 2;
    const _180_D_PI = 180 / PI;
    function normalized(v) {
        if (!v)
            return v;
        else if (Numbers.equals(0, v))
            return 0;
        else if (v < 0)
            return v % PI_2 + PI_2;
        else
            return v % PI_2;
    }
    Degrees.normalized = normalized;
    function angle(v) {
        return v ? v * _180_D_PI : v;
    }
    Degrees.angle = angle;
})(Degrees || (Degrees = {}));

const { EPSILON: EPS } = Number;
const { abs: abs$1 } = Math;
class Line {
    constructor(x0 = 0, y0 = 0, x1 = 0, y1 = 0) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
    }
    pure() {
        return {
            x0: this.x0,
            y0: this.y0,
            x1: this.x1,
            y1: this.y1,
        };
    }
    set(o) {
        this.x0 = o.x0;
        this.y0 = o.y0;
        this.x1 = o.x1;
        this.y1 = o.y1;
    }
    toString() {
        return `Line(x0=${this.x0}, y0=${this.x0}, x1=${this.x1}, y1=${this.y1})`;
    }
    mid() { return Line.mid(this); }
    start() { return Line.start(this); }
    end() { return Line.end(this); }
    static mid(l) {
        return {
            x: l.x1 + (l.x1 - l.x0) / 2,
            y: l.y1 + (l.y1 - l.y0) / 2
        };
    }
    static start(l) {
        return { x: l.x0, y: l.y0 };
    }
    static end(l) {
        return { x: l.x1, y: l.y1 };
    }
    static pure(x0, y0, x1, y1) {
        return { x0, y0, x1, y1 };
    }
    static create(line) {
        return new Line(line.x0, line.y0, line.x1, line.y1);
    }
    static intersection(a_x0, a_y0, a_x1, a_y1, b_x0, b_y0, b_x1, b_y1) {
        const a1 = a_y1 - a_y0;
        const b1 = a_x0 - a_x1;
        const c1 = (a_x1 - a_x0) * a_y0 - (a_y1 - a_y0) * a_x0;
        const a2 = b_y1 - b_y0;
        const b2 = b_x0 - b_x1;
        const c2 = (b_x1 - b_x0) * b_y0 - (b_y1 - b_y0) * b_x0;
        const denominator = a1 * b2 - a2 * b1;
        // 情况1：分母为0 → 两直线平行或重合
        if (abs$1(denominator) < EPS) {
            // 检查是否重合（C1*A2 是否等于 C2*A1，或 C1*B2 是否等于 C2*B1，避免A2/B2为0的情况）
            return (abs$1(c1 * a2 - c2 * a1) < EPS ||
                abs$1(c1 * b2 - c2 * b1) < EPS) ? 'collinear' : null;
        }
        // 情况2：存在唯一交点
        const x = (b1 * c2 - b2 * c1) / denominator;
        const y = (a2 * c1 - a1 * c2) / denominator;
        return { x, y };
    }
    static intersection2(l0, l1) {
        return this.intersection(l0.x0, l0.y0, l0.x1, l0.y1, l1.x0, l1.y0, l1.x1, l1.y1);
    }
}

class LineSegment extends Line {
    toString() {
        return `LineSegment(x0=${this.x0}, y0=${this.x0}, x1=${this.x1}, y1=${this.y1})`;
    }
    static create(line) {
        return new LineSegment(line.x0, line.y0, line.x1, line.y1);
    }
    static intersection(a_x0, a_y0, a_x1, a_y1, b_x0, b_y0, b_x1, b_y1) {
        const denominator = (a_x0 - a_x1) * (b_y0 - b_y1) - (a_y0 - a_y1) * (b_x0 - b_x1);
        // 如果分母为0，表示线段平行或共线
        if (denominator === 0) {
            return null;
        }
        const t = ((a_x0 - b_x0) * (b_y0 - b_y1) - (a_y0 - b_y0) * (b_x0 - b_x1)) / denominator;
        const s = ((a_x0 - b_x0) * (a_y0 - a_y1) - (a_y0 - b_y0) * (a_x0 - a_x1)) / denominator;
        if (t < 0 || t > 1 || s < 0 || s > 1)
            return null;
        const x = a_x0 + t * (a_x1 - a_x0);
        const y = a_y0 + t * (a_y1 - a_y0);
        return { x, y };
    }
    static intersection2(a, b) {
        return LineSegment.intersection(a.x0, a.y0, a.x1, a.y1, b.x0, b.y0, b.x1, b.y1);
    }
}

const { pow, abs, sin: sin$1, cos: cos$1, sqrt, PI: PI$1 } = Math;
class Vector {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    plus(o) { return this.add(o.x, o.y); }
    minus(o) { return this.add(-o.x, -o.y); }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    add(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }
    read(a) {
        this.x = a.x;
        this.y = a.y;
        return this;
    }
    toString() {
        return `Vector(x=${this.x}, y=${this.y})`;
    }
    rotate(radians, b) {
        const { x, y } = Vector.rotated2(this.x, this.y, b.x, b.y, radians);
        return this.set(x, y);
    }
    rotated(radians, b) {
        const { x, y } = Vector.rotated2(this.x, this.y, b.x, b.y, radians);
        return new Vector(x, y);
    }
    static plus(a, b) { return { x: a.x + b.x, y: a.y + b.y }; }
    static minus(a, b) { return { x: a.x - b.x, y: a.y - b.y }; }
    static ensure(rect) {
        return rect instanceof Vector ? rect : Vector.create(rect);
    }
    static create(a) {
        return new Vector(a.x, a.y);
    }
    static mid(v0, v1, factor = 0.5) {
        return {
            x: v0.x + (v1.x - v0.x) * factor,
            y: v0.y + (v1.y - v0.y) * factor,
        };
    }
    static pure(x, y) {
        return { x, y };
    }
    static distance(a, b) {
        return sqrt(pow(a.x - b.x, 2) +
            pow(a.y - b.y, 2));
    }
    static manhattan(a, b) {
        return abs(a.x - b.x) + abs(a.y - b.y);
    }
    static dot(a, b) {
        return abs(a.x * b.x + a.y * b.y);
    }
    static multiply(a, n) {
        return { x: a.x * n, y: a.y * n };
    }
    static rotated(a, b, radians) {
        return this.rotated2(a.x, a.y, b.x, b.y, radians);
    }
    static rotated2(ax, ay, bx, by, radians) {
        if (!radians || Numbers.equals(radians % (PI$1 * 2), 0))
            return { x: ax, y: ay };
        const dx = ax - bx;
        const dy = ay - by;
        const c = cos$1(radians);
        const s = sin$1(radians);
        return {
            x: dx * c - dy * s + bx,
            y: dx * s + dy * c + by,
        };
    }
    static equal2(x, y, x1, y1) {
        return abs(x - x1) <= Number.EPSILON && abs(y - y1) <= Number.EPSILON;
    }
}
// const test_vector_rotated = () => {
//   const a: IVector = { x: 1, y: 1 };
//   const b: IVector = { x: 2, y: 2 };
//   return [
//     Vector.create(Vector.rotated(a, b, 0 * Math.PI / 2)),
//     Vector.create(Vector.rotated(a, b, 1 * Math.PI / 2)),
//     Vector.create(Vector.rotated(a, b, 2 * Math.PI / 2)),
//     Vector.create(Vector.rotated(a, b, 3 * Math.PI / 2)),
//   ].join('\n')
// }
// alert('' + test_vector_rotated())

const { min: min$3, max: max$3 } = Math;
class Rect {
    get top() { return this.y; }
    get left() { return this.x; }
    get right() { return this.x + this.w; }
    get bottom() { return this.y + this.h; }
    set top(v) {
        this.h = this.bottom - v;
        this.y = v;
    }
    set left(v) {
        this.w = this.right - v;
        this.x = v;
    }
    set right(v) {
        this.w = v - this.x;
    }
    set bottom(v) {
        this.h = v - this.y;
    }
    /**
     * 获取顶点
     *
     * @readonly
     * @type {[IVector, IVector, IVector, IVector]}
     */
    get dots() {
        return [
            { x: this.x, y: this.y },
            { x: this.right, y: this.y },
            { x: this.right, y: this.bottom },
            { x: this.x, y: this.bottom },
        ];
    }
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = 0;
        this.y = 0;
        this.w = -1;
        this.h = -1;
        this.set(x, y, w, h);
    }
    pure() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
        };
    }
    set(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    read(o) {
        this.x = o.x;
        this.y = o.y;
        this.w = o.w;
        this.h = o.h;
    }
    hit(b) {
        return Rect.hit(this, b);
    }
    toString() {
        return `Rect(x=${this.x}, y=${this.x}, w=${this.w}, h=${this.h})`;
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    mid() {
        return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
    }
    vaild() {
        return this.w >= 0 || this.h >= 0;
    }
    static ensure(rect) {
        return rect instanceof Rect ? rect : Rect.create(rect);
    }
    static create(rect) {
        return new Rect(rect.x, rect.y, rect.w, rect.h);
    }
    static pure(x, y, w, h) {
        return { x, y, w, h };
    }
    static pure2(r) {
        return { x: r.x, y: r.y, w: r.w, h: r.h };
    }
    static bounds(r1, r2) {
        const x = min$3(r1.x, r2.x);
        const y = min$3(r1.y, r2.y);
        return {
            x, y,
            w: max$3(r1.x + r1.w, r2.x + r2.w) - x,
            h: max$3(r1.y + r1.h, r2.y + r2.h) - y
        };
    }
    static hit(a, b) {
        let w = 0;
        let h = 0;
        if ('w' in b && 'h' in b) {
            w = b.w;
            h = b.h;
        }
        return (a.x + a.w >= b.x &&
            b.x + w >= a.x &&
            a.y + a.h >= b.y &&
            b.y + h >= a.y);
    }
    static intersect(a, b) {
        const x = max$3(a.x, b.x);
        const y = max$3(a.y, b.y);
        const right = min$3(a.x + a.w, b.x + b.w);
        const bottom = min$3(a.y + a.h, b.y + b.h);
        return {
            x, y,
            w: right - x,
            h: bottom - y
        };
    }
    /**
     * 获取矩形与线段的交点
     * (与边共线视为不相交)
     *
     * @static
     * @param {IRect} rect
     * @param {ILine} line 线段
     * @return {IVector[]} 当不相交时，返回空数组，否则返回非空Vector数组
     * @memberof Rect
     */
    static line_segment_intersection(rect, line) {
        const sides = [
            { x0: rect.x, y0: rect.y, x1: rect.x + rect.w, y1: rect.y },
            { x0: rect.x, y0: rect.y, x1: rect.x, y1: rect.y + rect.h },
            { x0: rect.x, y0: rect.y + rect.h, x1: rect.x + rect.w, y1: rect.y + rect.h },
            { x0: rect.x + rect.w, y0: rect.y, x1: rect.x + rect.w, y1: rect.y + rect.h }
        ];
        const ret = [];
        for (const side of sides) {
            const vector = LineSegment.intersection2(side, line);
            if (vector)
                ret.push(vector);
        }
        if (ret.length <= 1)
            return ret;
        const s = LineSegment.start(line);
        ret.sort((a, b) => Vector.distance(a, s) - Vector.distance(b, s));
        return ret;
    }
}
Rect.equal = (a, b) => (Numbers.equals(a.x, b.x) &&
    Numbers.equals(a.y, b.y) &&
    Numbers.equals(a.w, b.w) &&
    Numbers.equals(a.h, b.h));

class RotatedRect {
    get axisX() { return this._axisX; }
    get axisY() { return this._axisY; }
    set top(v) {
        this.h = this.bottom - v;
        this.y = v;
    }
    set left(v) {
        this.w = this.right - v;
        this.x = v;
    }
    set right(v) {
        this.w = v - this.x;
    }
    get right() {
        return this.x + this.w;
    }
    set bottom(v) {
        this.h = v - this.y;
    }
    get bottom() {
        return this.y + this.h;
    }
    get dots() {
        return RotatedRect.dots_cs(this.x, this.y, this.w, this.h, this._cr, this._sr);
    }
    get r() { return this._r; }
    set r(r) {
        this._r = r;
        this._cr = Math.cos(r);
        this._sr = Math.sin(r);
        this._axisX = { x: this._cr, y: this._sr };
        this._axisY = { x: -this._sr, y: this._cr };
    }
    get middleX() { return this.x + this.w / 2; }
    get middleY() { return this.y + this.h / 2; }
    set middleX(v) { this.x = v - this.w / 2; }
    set middleY(v) { this.y = v - this.h / 2; }
    constructor(x = 0, y = 0, w = 0, h = 0, r = 0) {
        this._r = 0;
        this._cr = 0;
        this._sr = 0;
        this._axisX = { x: 0, y: 0 };
        this._axisY = { x: 0, y: 0 };
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this._cr = Math.cos(r);
        this._sr = Math.sin(r);
        this._axisX = { x: this._cr, y: this._sr };
        this._axisY = { x: -this._sr, y: this._cr };
        this._r = r;
    }
    set(o) {
        this.x = o.x;
        this.y = o.y;
        this.w = o.w;
        this.h = o.h;
        this.r = o.r || 0;
        return this;
    }
    hit(b) {
        return RotatedRect.hit(this, b);
    }
    toString() {
        return `RotatedRect(x=${this.x}, y=${this.x}, w=${this.w}, h=${this.h}, r=${this.r})`;
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    mid() {
        return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
    }
    static ensure(rect) {
        return rect instanceof RotatedRect ? rect : RotatedRect.create(rect);
    }
    static create(rect) {
        return new RotatedRect(rect.x, rect.y, rect.w, rect.h, rect.r);
    }
    static pure(x, y, w, h, r) {
        return { x, y, w, h, r };
    }
    static dots_cs(x, y, w, h, c, s) {
        const bx = x + w / 2;
        const by = y + h / 2;
        const right = x + w;
        const bottom = y + h;
        const dot = (x, y) => {
            const dx = x - bx;
            const dy = y - by;
            return {
                x: Number((dx * c - dy * s + bx).toPrecision(4)),
                y: Number((dx * s + dy * c + by).toPrecision(4)),
            };
        };
        return [
            dot(x, y),
            dot(right, y),
            dot(right, bottom),
            dot(x, bottom),
        ];
    }
    static dots(x, y, w, h, r = 0) {
        const c = Math.cos(r);
        const s = Math.sin(r);
        return this.dots_cs(x, y, w, h, c, s);
    }
    static dots2(r) {
        return this.dots(r.x, r.y, r.w, r.h, r.r);
    }
    static hit(a, b) {
        if (!a.r && !b.r)
            return Rect.hit(a, b);
        const realA = a instanceof RotatedRect ? a : new RotatedRect(a.x, a.y, a.w, a.h, a.r);
        const realB = b instanceof RotatedRect ? b : new RotatedRect(b.x, b.y, b.w, b.h, b.r);
        const centerDistanceVertor = { x: realA.middleX - realB.middleX, y: realA.middleY - realB.middleY };
        const axes = [realA._axisX, realA._axisY, realB._axisX, realB._axisY];
        for (let i = 0, len = axes.length; i < len; i++) {
            const a = axes[i];
            const p0 = realA.projection(a);
            const p1 = realB.projection(a);
            const p2 = Vector.dot(centerDistanceVertor, a) * 2;
            if (p0 + p1 <= p2) {
                return false;
            }
        }
        return true;
    }
    projection(axis) {
        const px = Vector.dot(this._axisX, axis);
        const py = Vector.dot(this._axisY, axis);
        return px * this.w + py * this.h;
    }
}

class Polygon {
    constructor(dots = []) {
        this.dots = dots.map(dot => Vector.create(dot));
    }
    read(o) {
        this.dots = o.dots.map(dot => Vector.create(dot));
        return this;
    }
    toString() {
        return `Polygon(dots.length=${this.dots.length})`;
    }
    static from_rect(rect) {
        const R = rect.r ? RotatedRect : Rect;
        return new Polygon(R.ensure(rect).dots);
    }
    static intersect_linesegment(polygon, ax, ay, bx, by) {
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const a = polygon[j];
            const b = polygon[i];
            const dot = LineSegment.intersection(a.x, a.y, b.x, b.y, ax, ay, bx, by);
            if (dot)
                return dot;
        }
        return null;
    }
    static contain_dot(polygon, d) {
        return this.contain_dot2(polygon, d.x, d.y);
    }
    static contain_dot2(polygon, x, y) {
        let inside = false;
        // 遍历多边形的每条边
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const a = polygon[j];
            const b = polygon[i];
            // 检查点是否在边的端点上
            if (Vector.equal2(a.x, a.y, x, y) || Vector.equal2(b.x, b.y, x, y)) {
                return true; // 点在顶点上
            }
            // 判断射线与边是否相交
            const intersect = ((b.y > y) !== (a.y > y)) && (x < (a.x - b.x) * (y - b.y) / (a.y - b.y) + b.x);
            if (intersect)
                inside = !inside;
        }
        return inside;
    }
}

class QuadTree {
    constructor(opts) {
        this._items = [];
        this._itemCount = 0;
        this._rect = new Rect(0, 0, 0, 0);
        this._level = 0;
        this._opts = Object.assign({}, opts);
        this._rect.read(opts.rect);
    }
    get children() { return [this._child0, this._child1, this._child2, this._child3]; }
    get maxItems() { return this._opts.maxItems || 20; }
    get parent() { return this._parent; }
    get level() { return this._level; }
    get itemCount() { return this._itemCount; }
    get rect() { return this._rect; }
    get items() { return this._items; }
    get child0() { return this._child0; }
    get child1() { return this._child1; }
    get child2() { return this._child2; }
    get child3() { return this._child3; }
    get genChild0() {
        if (!this._child0) {
            this._child0 = new QuadTree(Object.assign(Object.assign({}, this._opts), { rect: this.childRect0 }));
            this._child0._parent = this;
            this._child0._level = this._level + 1;
        }
        return this._child0;
    }
    get genChild1() {
        if (!this._child1) {
            this._child1 = new QuadTree(Object.assign(Object.assign({}, this._opts), { rect: this.childRect1 }));
            this._child1._parent = this;
            this._child1._level = this._level + 1;
        }
        return this._child1;
    }
    get genChild2() {
        if (!this._child2) {
            this._child2 = new QuadTree(Object.assign(Object.assign({}, this._opts), { rect: this.childRect2 }));
            this._child2._parent = this;
            this._child2._level = this._level + 1;
        }
        return this._child2;
    }
    get genChild3() {
        if (!this._child3) {
            this._child3 = new QuadTree(Object.assign(Object.assign({}, this._opts), { rect: this.childRect3 }));
            this._child3._parent = this;
            this._child3._level = this._level + 1;
        }
        return this._child3;
    }
    get childRect0() {
        if (!this._childRect0) {
            const { x, y } = this.rect;
            const w = this.rect.w / 2;
            const h = this.rect.h / 2;
            this._childRect0 = new Rect(x, y, w, h);
        }
        return this._childRect0;
    }
    get childRect1() {
        if (!this._childRect1) {
            const { y } = this.rect;
            const w = this.rect.w / 2;
            const h = this.rect.h / 2;
            const { x: midX } = this.rect.mid();
            this._childRect1 = new Rect(midX, y, w, h);
        }
        return this._childRect1;
    }
    get childRect2() {
        if (!this._childRect2) {
            const { x } = this.rect;
            const w = this.rect.w / 2;
            const h = this.rect.h / 2;
            const { y: midY } = this.rect.mid();
            this._childRect2 = new Rect(x, midY, w, h);
        }
        return this._childRect2;
    }
    get childRect3() {
        if (!this._childRect3) {
            const w = this.rect.w / 2;
            const h = this.rect.h / 2;
            const { x: midX, y: midY } = this.rect.mid();
            this._childRect3 = new Rect(midX, midY, w, h);
        }
        return this._childRect3;
    }
    split() {
        if (this._child0 && this._child1 && this._child2 && this._child3)
            return;
        let item, itemRect, inChild0, inChild1, inChild2, inChild3, hitCount;
        for (let i = 0; i < this._items.length; ++i) {
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
    }
    insert(item) {
        ++this._itemCount;
        const itemRect = this._opts.getItemRect(item);
        const needSplit = this._itemCount >= this.maxItems;
        needSplit && this.split();
        if (needSplit) {
            const inChild0 = this.childRect0.hit(itemRect) ? 1 : 0;
            const inChild1 = this.childRect1.hit(itemRect) ? 1 : 0;
            const inChild2 = this.childRect2.hit(itemRect) ? 1 : 0;
            const inChild3 = this.childRect3.hit(itemRect) ? 1 : 0;
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
    }
    removeOnlyUnderMe(item) {
        const idx = this._items.indexOf(item);
        if (idx >= 0) {
            --this._itemCount;
            this._items.splice(idx, 1);
            return true;
        }
        return false;
    }
    remove(item) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this._opts.getTree) {
            // 从子节点到父节点的移除逻辑
            let tree = this._opts.getTree(item);
            if (!tree)
                return false;
            const result = tree.removeOnlyUnderMe(item);
            tree._itemCount++;
            let treeNeedMerge;
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
    }
    merge() {
        this.children.forEach(child => {
            if (!child)
                return;
            child.merge();
            child._items.forEach(item => {
                this.items.push(item);
                this._opts.onTreeChanged && this._opts.onTreeChanged(item, child, this);
            });
        });
        delete this._child0;
        delete this._child1;
        delete this._child2;
        delete this._child3;
    }
}

function getValue(v, prev) {
    return typeof v !== 'function' ? v : v(prev);
}

var ShapeEventEnum;
(function (ShapeEventEnum) {
    ShapeEventEnum["StartDirty"] = "start_dirty";
    ShapeEventEnum["EndDirty"] = "end_dirty";
    ShapeEventEnum["BoardChanged"] = "board_changed";
})(ShapeEventEnum || (ShapeEventEnum = {}));

const { floor: floor$2, max: max$2, ceil: ceil$1, sin, cos, PI, min: min$2 } = Math;
/**
 * 一切图形的基类
 *
 * @export
 * @class Shape 图形基类
 * @template D 图形数据类
 */
class Shape {
    constructor(data, cls) {
        this._r = Resizable.None;
        /** @deprecated */ this.boundingRect = () => this.aabb();
        this._relCount = 0;
        this._d = new cls(data);
    }
    /**
     * 图形的数据
     *
     * @readonly
     * @type {D}
     * @memberof Shape
     */
    get data() { return this._d; }
    /**
     * 图形类型
     *
     * 当图形为内置图形时，值为ShapeEnum，否则为字符串
     *
     * @readonly
     * @see {ShapeEnum}
     * @type {ShapeType}
     * @memberof Shape
     */
    get type() { return this._d.t; }
    /**
     * 图形属于哪个黑板
     *
     * @type {(Board | undefined)}
     * @memberof Shape
     */
    get board() { return this._b; }
    set board(v) {
        if (v === this._b)
            return;
        const prev = this._b;
        this._b = v;
        this.dispatchEvent(ShapeEventEnum.BoardChanged, { shape: this, prev });
    }
    /**
     * 图形是否可见，
     *
     * 当不可见时，图形将在渲染时被忽略
     *
     * @type {boolean}
     * @memberof Shape
     */
    get visible() { return this._d.visible; }
    set visible(v) {
        if (this._d.visible === v)
            return;
        const prev = { b: { v: v ? 0 : (void 0) } };
        this.beginDirty(prev);
        this._d.visible = v;
        this.endDirty(prev);
    }
    /**
     * 是否正在编辑中
     *
     * TODO
     *
     * @type {boolean}
     * @memberof Shape
     */
    get editing() { return this._d.editing; }
    set editing(v) {
        if (this._d.editing === v)
            return;
        const prev = { b: { e: v ? (void 0) : 1 } };
        this.beginDirty(prev);
        this._d.editing = v;
        this.endDirty(prev);
    }
    /**
     * 图形是否被选中
     *
     * 选中图形后，图形将呈现为被选中状态，其他一些对图形的操作均需要选中图形
     *
     * @type {boolean}
     * @memberof Shape
     */
    get selected() { return this._d.selected; }
    set selected(v) {
        if (this._d.selected === v)
            return;
        const prev = { b: { s: v ? (void 0) : 1 } };
        this.beginDirty(prev);
        this._d.selected = v;
        this.endDirty(prev);
    }
    /**
     * 图形是否可以被用户修改尺寸
     *
     * 当不为Resizable.None时，选中的图形将出现控制点，
     * 此时可以点击拖拽控制点来修改图形的尺寸
     *
     * @type {Resizable}
     * @memberof Shape
     */
    get resizable() { return this._r; }
    set resizable(v) { this._r = v; }
    /**
     * 图形是否被锁定
     *
     * 被锁定的图形将不能被编辑，选中图形时，选中图形将显示为被锁定
     *
     * @type {boolean}
     * @memberof Shape
     */
    get locked() { return this._d.locked; }
    set locked(v) {
        if (this._d.locked === v)
            return;
        const prev = { b: { f: v ? (void 0) : 1 } };
        this.beginDirty(prev);
        this._d.locked = v;
        this.endDirty(prev);
    }
    /**
     * 图形能否交互
     *
     * 当ghost为true时，只能看见这个图形，而不能选中并与其产生交互。
     * 利用这个属性，可以实现比较特殊的功能，比如：背景图
     *
     * @type {boolean}
     * @memberof Shape
     */
    get ghost() { return this._d.ghost; }
    set ghost(v) {
        if (this._d.ghost === v)
            return;
        const prev = { b: { g: v ? (void 0) : 1 } };
        this.beginDirty(prev);
        this._d.ghost = v;
        this.endDirty(prev);
    }
    /**
     * 图形描边宽度
     * 若图形不存在描边，则为0
     *
     * @type {number}
     * @memberof Shape
     */
    get lineWidth() { return this._d.lineWidth; }
    set lineWidth(v) {
        if (!this._d.needStroke) {
            return;
        }
        const prev = { a: { g: this._d.lineWidth } };
        this.beginDirty(prev);
        this._d.lineWidth = max$2(0, v);
        this.endDirty(prev);
    }
    set groupId(v) {
        var _a;
        if (this._d.groupId === v)
            return;
        this._d.groupId = v;
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.update_items_group([this]);
    }
    get groupId() { return this._d.groupId; }
    merge(data) {
        const prev = this.data.copy();
        this.beginDirty(prev);
        this.data.merge(data);
        this.endDirty(prev);
    }
    beginDirty(prev) {
        this.dispatchEvent(ShapeEventEnum.StartDirty, { shape: this, prev });
        this.markDirty();
    }
    endDirty(prev) {
        this.markDirty();
        this.dispatchEvent(ShapeEventEnum.EndDirty, { shape: this, prev });
    }
    markDirty(rect = this.aabb()) {
        var _a;
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.markDirty(rect);
    }
    /**
     * 移动图形
     *
     * @param x x坐标
     * @param y y坐标
     * @returns void
     */
    move(x, y, dirty = true) {
        return this.geo(x, y, this._d.w, this._d.h, dirty);
    }
    resize(w, h, dirty = true) {
        return this.geo(this._d.x, this._d.y, w, h, dirty);
    }
    set midX(v) {
        this.beginDirty();
        this._d.midX = v;
        this.endDirty();
    }
    set midY(v) {
        this.beginDirty();
        this._d.midY = v;
        this.endDirty();
    }
    get x() { return this._d.x; }
    get y() { return this._d.y; }
    get z() { return this._d.z; }
    get halfW() { return this._d.halfW; }
    get halfH() { return this._d.halfH; }
    get midX() { return this._d.midX; }
    get midY() { return this._d.midY; }
    get w() { return this._d.w; }
    get h() { return this._d.h; }
    get left() { return this._d.x; }
    get top() { return this._d.y; }
    get right() { return this._d.w + this._d.x; }
    get bottom() { return this._d.h + this._d.y; }
    get topLeft() { return { x: this.left, y: this.top }; }
    get bottomLeft() { return { x: this.left, y: this.bottom }; }
    get topRight() { return { x: this.right, y: this.top }; }
    get bottomRight() { return { x: this.right, y: this.bottom }; }
    get leftTop() { return this.topLeft; }
    get leftBottom() { return this.bottomLeft; }
    get rightTop() { return this.topRight; }
    get rightBottom() { return this.bottomRight; }
    get midTop() { return { x: this.midX, y: this.top }; }
    get midBottom() { return { x: this.midX, y: this.bottom }; }
    get midLeft() { return { x: this.left, y: this.midY }; }
    get midRight() { return { x: this.right, y: this.midY }; }
    get rotatedTopLeft() { return this.map2world(0, 0); }
    get rotatedBottomLeft() { return this.map2world(0, this.h); }
    get rotatedTopRight() { return this.map2world(this.w, 0); }
    get rotatedBottomRight() { return this.map2world(this.w, this.h); }
    get rotatedLeftTop() { return this.map2world(0, 0); }
    get rotatedLeftBottom() { return this.map2world(0, this.h); }
    get rotatedRightTop() { return this.map2world(this.w, 0); }
    get rotatedRightBottom() { return this.map2world(this.w, this.h); }
    get rotatedMidTop() { return this.map2world(this.halfW, 0); }
    get rotatedMidBottom() { return this.map2world(this.halfW, this.h); }
    get rotatedMidLeft() { return this.map2world(0, this.halfH); }
    get rotatedMidRight() { return this.map2world(this.w, this.halfH); }
    get rotatedMid() { return this.map2world(this.halfW, this.halfH); }
    get rotation() { return this.data.rotation; }
    getRotatedDot(which) {
        switch (which) {
            case Resizable.TopLeft: return this.rotatedTopLeft;
            case Resizable.Top: return this.rotatedMidTop;
            case Resizable.TopRight: return this.rotatedTopRight;
            case Resizable.Right: return this.rotatedMidRight;
            case Resizable.BottomRight: return this.rotatedBottomRight;
            case Resizable.Bottom: return this.rotatedMidBottom;
            case Resizable.BottomLeft: return this.rotatedBottomLeft;
            case Resizable.Left: return this.rotatedMidLeft;
            case Resizable.None:
            case Resizable.Horizontal:
            case Resizable.Vertical:
            case Resizable.Corner:
            case Resizable.All:
                return { x: NaN, y: NaN };
        }
    }
    rotateBy(d, x, y) {
        const r = this._d.rotation + d;
        this.rotateTo(r, x, y);
    }
    rotateTo(r, x, y) {
        if (r == this._d.rotation)
            return;
        const old_rotation = this._d.r;
        const prev = { x: this._d.x, y: this._d.y, r: old_rotation };
        this.beginDirty(prev);
        this._d.rotation = r % (PI * 2);
        if (Numbers.isVaild(x) && Numbers.isVaild(y)) {
            const m = Vector.rotated2(this.midX, this.midY, x, y, this.rotation - (old_rotation || 0));
            this._d.x = m.x - this.w / 2;
            this._d.y = m.y - this.h / 2;
        }
        this.endDirty(prev);
    }
    getGeo() {
        return new Rect(this._d.x, this._d.y, this._d.w, this._d.h);
    }
    setGeo(rect, dirty = true) {
        return this.geo(rect.x, rect.y, rect.w, rect.h, dirty);
    }
    geo(x, y, w, h, dirty = true) {
        if (x === this._d.x &&
            y === this._d.y &&
            w === this._d.w &&
            h === this._d.h)
            return this;
        if (!dirty) {
            this._d.x = x;
            this._d.y = y;
            this._d.w = w;
            this._d.h = h;
            return this;
        }
        const prev = {
            x: this._d.x, y: this._d.y,
            w: this._d.w, h: this._d.h
        };
        this.beginDirty(prev);
        this._d.x = x;
        this._d.y = y;
        this._d.w = w;
        this._d.h = h;
        this.endDirty(prev);
        return this;
    }
    moveBy(x, y, dirty = true) {
        return this.geo(this._d.x + x, this._d.y + y, this._d.w, this._d.h, dirty);
    }
    resizeBy(w, h, dirty = true) {
        return this.geo(this._d.x, this._d.y, this._d.w + w, this._d.h + h, dirty);
    }
    geoBy(x, y, w, h, dirty = true) {
        return this.geo(this._d.x + x, this._d.y + y, this._d.w + w, this._d.h + h, dirty);
    }
    render(ctx) {
        var _a, _c, _e, _f, _g, _h;
        if (!this.visible)
            return;
        const decoration = (_a = this.board) === null || _a === void 0 ? void 0 : _a.shapeDecoration;
        const { ghost, locked, resizable, selected } = this;
        this.beginDraw(ctx);
        ghost && ((_c = decoration === null || decoration === void 0 ? void 0 : decoration.ghost) === null || _c === void 0 ? void 0 : _c.call(decoration, this, ctx));
        selected && locked && ((_e = decoration === null || decoration === void 0 ? void 0 : decoration.locked) === null || _e === void 0 ? void 0 : _e.call(decoration, this, ctx));
        selected && !locked && ((_f = decoration === null || decoration === void 0 ? void 0 : decoration.selected) === null || _f === void 0 ? void 0 : _f.call(decoration, this, ctx));
        selected && !locked && resizable && ((_g = decoration === null || decoration === void 0 ? void 0 : decoration.resizable) === null || _g === void 0 ? void 0 : _g.call(decoration, this, ctx));
        this.endDraw(ctx);
        (_h = decoration === null || decoration === void 0 ? void 0 : decoration.debug) === null || _h === void 0 ? void 0 : _h.call(decoration, this, ctx);
    }
    /**
     * 绘制矩形
     *
     * @returns
     */
    drawingRect() {
        const d = this._d;
        return {
            x: 0,
            y: 0,
            w: floor$2(d.w),
            h: floor$2(d.h)
        };
    }
    selectorRect() {
        const { w, h, locked, lineWidth } = this.data;
        const hlw = floor$2(lineWidth / 2);
        const offset = locked ? 0 : 0.5;
        return {
            x: offset - hlw,
            y: offset - hlw,
            w: floor$2(w + hlw * 2) - 1,
            h: floor$2(h + hlw * 2) - 1
        };
    }
    /**
     * 获取AABB包围盒
     *
     * 包围盒矩形的数据均为整数。
     *
     * 脏区域会根据包围盒矩形的来运算
     *
     * @return {IRect} 包围盒矩形
     * @memberof Shape
     */
    aabb() {
        var _a;
        const d = this.data;
        const offset = (d.lineWidth % 2) ? 1 : 0;
        const overbound1 = ((_a = this.board) === null || _a === void 0 ? void 0 : _a.factory.overbound(this)) || 1;
        const overbound2 = overbound1 * 2;
        const rr = {
            x: floor$2(d.x - d.lineWidth / 2 - overbound1),
            y: floor$2(d.y - d.lineWidth / 2 - overbound1),
            w: ceil$1(d.w + d.lineWidth + offset + overbound2),
            h: ceil$1(d.h + d.lineWidth + offset + overbound2),
            r: d.r,
        };
        if (!d.r)
            return rr;
        const { dots } = RotatedRect.create(rr);
        let x = rr.x;
        let y = rr.y;
        let r = rr.x + rr.w;
        let b = rr.y + rr.h;
        for (const dot of dots) {
            x = min$2(x, floor$2(dot.x));
            y = min$2(y, floor$2(dot.y));
            r = max$2(r, ceil$1(dot.x));
            b = max$2(b, ceil$1(dot.y));
        }
        return { x, y, w: r - x, h: b - y };
    }
    obb() {
        const lw = this.lineWidth;
        const x = this.x - lw / 2;
        const y = this.y - lw / 2;
        const w = this.w + lw;
        const h = this.h + lw;
        return { x, y, w, h, r: this.rotation };
    }
    getResizerNumbers(x, y, w, h) {
        var _a;
        const lw = 1;
        const hlw = lw / 2;
        const s = ((_a = this._b) === null || _a === void 0 ? void 0 : _a.factory.resizer.size) || 10;
        return {
            s,
            lx: x,
            rx: x + w - s,
            ty: y,
            by: y + h - s,
            mx: floor$2(x + (w - s) / 2) - hlw,
            my: floor$2(y + (h - s) / 2) - hlw,
        };
    }
    map2me(arg0, arg1) {
        const ix = isNum(arg0) ? arg0 : arg0.x;
        const iy = isNum(arg0) ? arg1 : arg0.y;
        const { r, x, y } = this.data;
        if (!r)
            return new Vector(ix - x, iy - y);
        const mx = this.midX;
        const my = this.midY;
        const cr = cos(-r);
        const sr = sin(-r);
        const dx = ix - mx;
        const dy = iy - my;
        return new Vector(dx * cr - dy * sr + mx - x, dx * sr + dy * cr + my - y);
    }
    map2world(arg0, arg1) {
        const ix = isNum(arg0) ? arg0 : arg0.x;
        const iy = isNum(arg0) ? arg1 : arg0.y;
        const { r, x, y, w, h } = this.data;
        if (!r)
            return { x: ix + x, y: iy + y };
        const mx = w / 2;
        const my = h / 2;
        const cr = cos(r);
        const sr = sin(r);
        const dx = ix - mx;
        const dy = iy - my;
        return {
            x: dx * cr - dy * sr + mx + x,
            y: dx * sr + dy * cr + my + y
        };
    }
    resizableDirection(pointerX, pointerY) {
        var _a;
        if (!this.selected || !this._r || this.ghost || this.locked || !((_a = this.board) === null || _a === void 0 ? void 0 : _a.shapeResizble)) {
            return [Resizable.None, undefined];
        }
        const { x: l, y: t } = this.data;
        const { x, y, w, h } = this.selectorRect();
        const { s, lx, rx, ty, by, mx, my } = this.getResizerNumbers(l + x, t + y, w, h);
        const pos = this.map2me(pointerX, pointerY).plus(this);
        const rect = new Rect(0, 0, s, s);
        if (this.resizable & Resizable.Top) {
            rect.moveTo(mx, ty);
            if (rect.hit(pos))
                return [Resizable.Top, rect];
        }
        if (this.resizable & Resizable.Bottom) {
            rect.moveTo(mx, by);
            if (rect.hit(pos))
                return [Resizable.Bottom, rect];
        }
        if (this.resizable & Resizable.Left) {
            rect.moveTo(lx, my);
            if (rect.hit(pos))
                return [Resizable.Left, rect];
        }
        if (this.resizable & Resizable.Right) {
            rect.moveTo(rx, my);
            if (rect.hit(pos))
                return [Resizable.Right, rect];
        }
        if (this.resizable & Resizable.TopLeft) {
            rect.moveTo(lx, ty);
            if (rect.hit(pos))
                return [Resizable.TopLeft, rect];
        }
        if (this.resizable & Resizable.TopRight) {
            rect.moveTo(rx, ty);
            if (rect.hit(pos))
                return [Resizable.TopRight, rect];
        }
        if (this.resizable & Resizable.BottomLeft) {
            rect.moveTo(lx, by);
            if (rect.hit(pos))
                return [Resizable.BottomLeft, rect];
        }
        if (this.resizable & Resizable.BottomRight) {
            rect.moveTo(rx, by);
            if (rect.hit(pos))
                return [Resizable.BottomRight, rect];
        }
        return [Resizable.None, undefined];
    }
    beginDraw(ctx) {
        let { x, y, w, h, r, c, d } = this.data;
        ctx.save();
        x = floor$2(x);
        y = floor$2(y);
        const hw = floor$2(w / 2);
        const hh = floor$2(h / 2);
        if (r || c || d) {
            ctx.translate(x + hw, y + hh);
            r && ctx.rotate(r);
            (c || d) && ctx.scale(c !== null && c !== void 0 ? c : 1, d !== null && d !== void 0 ? d : 1);
            ctx.translate(-hw, -hh);
        }
        else {
            ctx.translate(x, y);
        }
    }
    endDraw(ctx) {
        ctx.restore();
    }
    addEventListener(arg0, arg1, arg2) {
        this._ele = this._ele || document.createElement('a');
        this._ele.addEventListener(arg0, arg1, arg2);
        if (!(arg2 === null || arg2 === void 0 ? void 0 : arg2.once))
            this._relCount++;
        return this;
    }
    removeEventListener(arg0, arg1, arg2) {
        var _a;
        (_a = this._ele) === null || _a === void 0 ? void 0 : _a.removeEventListener(arg0, arg1, arg2);
        return this;
    }
    dispatchEvent(type, detail) {
        var _a;
        (_a = this._ele) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new CustomEvent(type, { detail }));
        return this;
    }
}

var ShapeEnum;
(function (ShapeEnum) {
    ShapeEnum[ShapeEnum["Invalid"] = 0] = "Invalid";
    ShapeEnum[ShapeEnum["Pen"] = 1] = "Pen";
    ShapeEnum[ShapeEnum["Rect"] = 2] = "Rect";
    ShapeEnum[ShapeEnum["Oval"] = 3] = "Oval";
    ShapeEnum[ShapeEnum["Text"] = 4] = "Text";
    ShapeEnum[ShapeEnum["Polygon"] = 5] = "Polygon";
    ShapeEnum[ShapeEnum["Tick"] = 6] = "Tick";
    ShapeEnum[ShapeEnum["Cross"] = 7] = "Cross";
    ShapeEnum[ShapeEnum["HalfTick"] = 8] = "HalfTick";
    ShapeEnum[ShapeEnum["Lines"] = 9] = "Lines";
    ShapeEnum[ShapeEnum["Img"] = 10] = "Img";
})(ShapeEnum || (ShapeEnum = {}));
const getShapeName = enumNameGetter("ShapeType", ShapeEnum);

class ShapeStatus {
    /** 是否可见 */
    get visible() { return this.v != 0; }
    /** 设置是否可见 */
    set visible(v) { if (v)
        delete this.v;
    else
        this.v = 0; }
    /** 是否被选中 */
    get selected() { return !!this.s; }
    /** 设置是否被选中 */
    set selected(v) { if (v)
        this.s = 1;
    else
        delete this.s; }
    /** 设置是否被选中 */
    get editing() { return !!this.e; }
    /** 设置是否被选中 */
    set editing(v) { if (v)
        this.e = 1;
    else
        delete this.e; }
    /** 是否被锁定 */
    get locked() { return !!this.f; }
    /** 设置是否被锁定 */
    set locked(v) { if (v)
        this.f = 1;
    else
        delete this.f; }
    /** 是否不允许selector操作 */
    get ghost() { return !!this.g; }
    /** 设置是否不允许selector操作 */
    set ghost(v) { if (v)
        this.g = 1;
    else
        delete this.g; }
    merge(o) {
        this.read(o);
        return this;
    }
    read(o) {
        if (isNum(o.v))
            this.v = o.v;
        if (isNum(o.s))
            this.s = o.s;
        if (isNum(o.e))
            this.e = o.e;
        if (isNum(o.f))
            this.f = o.f;
        if (isNum(o.g))
            this.g = o.g;
        return this;
    }
    copy() {
        const ret = new (Object.getPrototypeOf(this).constructor);
        return ret.read(this);
    }
}

class ShapeData {
    /**
     * Creates an instance of ShapeData.
     *
     * @description
     *    here, subclasses' "read" can't be called correctly because of "this" problem.
     *    subclass needs to call its own 'read' in its own 'constructor'
     *
     *    like:
     *    ``` typescript
     *    class SubData extends ShapeData {
     *      constructor(other?: Partial<SubData>) {
     *        // super(other); // don't do it
     *        super();
     *        this.read(other) // subclasses need to call its own 'read' in its own 'constructor'
     *      }
     *    }
     *    ```
     * @constructor
     * @param {?Partial<ShapeData>} [other]
     */
    constructor(other) {
        this.t = ShapeEnum.Invalid;
        this.i = '';
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.z = 0;
        other && this.read(other);
    }
    get style() {
        if (this.a instanceof ShapeStyle)
            return this.a;
        else if (this.a)
            return this.a = new ShapeStyle().merge(this.a);
        else
            return this.a = new ShapeStyle();
    }
    ;
    get status() {
        if (this.b instanceof ShapeStatus)
            return this.b;
        else if (this.b)
            return this.b = new ShapeStatus().merge(this.b);
        else
            return this.b = new ShapeStatus();
    }
    ;
    /**
     * getter: type
     *
     * @type {ShapeType}
     * @memberof ShapeData
     */
    get type() { return this.t; }
    /**
     * setter: type
     *
     * @type {ShapeType}
     * @memberof ShapeData
     */
    set type(v) { this.t = v; }
    /**
     *
     * @type {string}
     * @memberof ShapeData
     */
    get id() { return this.i; }
    set id(v) { this.i = v; }
    get scaleX() { var _a; return (_a = this.c) !== null && _a !== void 0 ? _a : 1; }
    set scaleX(v) { if (v == 1) {
        delete this.c;
    }
    else
        this.c = v; }
    get scaleY() { var _a; return (_a = this.d) !== null && _a !== void 0 ? _a : 1; }
    set scaleY(v) { if (v == 1) {
        delete this.d;
    }
    else
        this.d = v; }
    get fillStyle() { return this.style.fillStyle; }
    set fillStyle(v) { this.style.fillStyle = v; }
    get strokeStyle() { return this.style.strokeStyle; }
    set strokeStyle(v) { this.style.strokeStyle = v; }
    get lineCap() { return this.style.lineCap; }
    set lineCap(v) { this.style.lineCap = v; }
    get lineDash() { return this.style.lineDash; }
    set lineDash(v) { this.style.lineDash = v; }
    get lineDashOffset() { return this.style.lineDashOffset; }
    set lineDashOffset(v) { this.style.lineDashOffset = v; }
    get lineJoin() { return this.style.lineJoin; }
    set lineJoin(v) { this.style.lineJoin = v; }
    get lineWidth() { return this.style.lineWidth; }
    set lineWidth(v) { this.style.lineWidth = v; }
    get miterLimit() { return this.style.miterLimit; }
    set miterLimit(v) { this.style.miterLimit = v; }
    get visible() { return this.status.visible; }
    set visible(v) { this.status.visible = v; }
    get selected() { return this.status.selected; }
    set selected(v) { this.status.selected = v; }
    get editing() { return this.status.editing; }
    set editing(v) { this.status.editing = v; }
    get locked() { return this.status.locked; }
    set locked(v) { this.status.locked = v; }
    get ghost() { return this.status.ghost; }
    set ghost(v) { this.status.ghost = v; }
    get layer() { return this.l; }
    set layer(v) { this.l = v; }
    get needFill() { return true; }
    get needStroke() { return true; }
    get rotation() { var _a; return (_a = this.r) !== null && _a !== void 0 ? _a : 0; }
    set rotation(v) { if (!v)
        delete this.r;
    else
        this.r = Degrees.normalized(v); }
    get halfW() { return this.w / 2; }
    set halfW(v) { this.w = v * 2; }
    get halfH() { return this.h / 2; }
    set halfH(v) { this.h = v * 2; }
    get midX() { return this.x + this.halfW; }
    set midX(v) { this.x = v - this.halfW; }
    get midY() { return this.y + this.halfH; }
    set midY(v) { this.y = v - this.halfH; }
    /**
     * raw field: g
     */
    get groupId() { var _a; return (_a = this.g) !== null && _a !== void 0 ? _a : ''; }
    set groupId(v) { if (v)
        this.g = v;
    else
        delete this.g; }
    merge(o) {
        this.read(o);
        return this;
    }
    read(o) {
        if (isStr(o.t) || isNum(o.t))
            this.t = o.t;
        if (isStr(o.i))
            this.i = o.i;
        if (isStr(o.g))
            this.g = o.g;
        if (isNum(o.x))
            this.x = o.x;
        if (isNum(o.y))
            this.y = o.y;
        if (isNum(o.z))
            this.z = o.z;
        if (isNum(o.w))
            this.w = o.w;
        if (isNum(o.h))
            this.h = o.h;
        if (isStr(o.l))
            this.l = o.l;
        if (isNum(o.c))
            this.c = o.c;
        if (isNum(o.d))
            this.d = o.d;
        this.r = isNum(o.r) ? o.r : void 0;
        const { style, status } = o;
        const { a = style, b = status } = o;
        if (a)
            this.style.read(a);
        if (b)
            this.status.read(b);
        if (a)
            this.style.read(a);
        if (b)
            this.status.read(b);
        return this;
    }
    copy() {
        const ret = new (Object.getPrototypeOf(this).constructor);
        return ret.read(this);
    }
    /** 清洗掉可空的字段 */
    wash() {
        delete_void(this, 'a', 'b', 'c', 'd', 'l', 'r', 'g');
        delete_void(this.a, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h');
        delete_void(this.b, 'v', 's', 'e', 'f', 'g');
        delete_eobj(this, 'a', 'b');
        return this;
    }
}
function delete_void(o, ...ks) {
    if (o)
        for (const k of ks)
            if (k in o && o[k] === void 0)
                delete o[k];
}
function delete_eobj(o, ...ks) {
    if (o)
        for (const k of ks)
            if (o[k] && typeof o[k] === 'object' && !Object.keys(o[k]).length)
                delete o[k];
}

class ShapeNeedPath extends Shape {
    constructor(data, cls) {
        super(data, cls);
        this._r = Resizable.All;
    }
    path(ctx) {
        throw new Error("Method 'path' not implemented.");
    }
    render(ctx) {
        if (!this.visible)
            return;
        this.beginDraw(ctx);
        const d = this.data;
        if (d.fillStyle || (d.lineWidth && d.strokeStyle))
            this.path(ctx);
        if (d.fillStyle) {
            ctx.fillStyle = d.fillStyle;
            ctx.fill();
        }
        if (d.lineWidth && d.strokeStyle) {
            ctx.lineCap = d.lineCap;
            ctx.lineDashOffset = d.lineDashOffset;
            ctx.lineJoin = d.lineJoin;
            ctx.lineWidth = d.lineWidth;
            ctx.miterLimit = d.miterLimit;
            ctx.strokeStyle = d.strokeStyle;
            ctx.setLineDash(d.lineDash);
            ctx.stroke();
        }
        this.endDraw(ctx);
        super.render(ctx);
    }
}

class CrossData extends ShapeData {
    get needFill() {
        return false;
    }
    constructor(other) {
        super();
        this.type = ShapeEnum.Cross;
        this.strokeStyle = '#FF0000';
        this.lineWidth = 2;
        other && this.read(other);
    }
}

var FontFamilysChecker;
(function (FontFamilysChecker) {
    class Checker {
        constructor() {
            this.w = 128;
            this.h = 128;
            this.txt = "a啊.?!";
            this.fontSize = 128;
            this.arial = "arial";
            const canvas = this.canvas = document.createElement("canvas");
            const ctx = this.ctx = canvas.getContext("2d", { willReadFrequently: true });
            canvas.width = this.w = 64;
            canvas.height = this.h = 64;
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.textBaseline = "middle";
        }
        draw(fontFamily = this.arial) {
            this.ctx.clearRect(0, 0, this.w, this.h);
            this.ctx.font = this.fontSize + "px " + fontFamily + ", " + this.arial;
            this.ctx.fillText(this.txt, this.w / 2, this.h / 2);
            return this.ctx.getImageData(0, 0, this.w, this.h).data.filter(v => v != 0).join("");
        }
        ;
    }
    function check(fontFamily) {
        const checker = new Checker();
        if (typeof fontFamily !== "string") {
            return false;
        }
        if (fontFamily.toLowerCase() === checker.arial.toLowerCase()) {
            return true;
        }
        return checker.draw() !== checker.draw(fontFamily);
    }
    FontFamilysChecker.check = check;
})(FontFamilysChecker || (FontFamilysChecker = {}));

const BUILT_IN_FONTS = [
    { family: "SimSun", name: "宋体", desc: "宋体" },
    { family: "SimHei", name: "黑体", desc: "黑体" },
    { family: "Microsoft Yahei", name: "微软雅黑", desc: "微软雅黑" },
    { family: "Microsoft JhengHei", name: "微软正黑体", desc: "微软正黑体" },
    { family: "KaiTi", name: "楷体", desc: "楷体" },
    { family: "NSimSun", name: "新宋体", desc: "新宋体" },
    { family: "FangSong", name: "仿宋", desc: "仿宋" },
    { family: "STKaiti", name: "华文楷体", desc: "华文楷体" },
    { family: "STSong", name: "华文宋体", desc: "华文宋体" },
    { family: "STFangsong", name: "华文仿宋", desc: "华文仿宋" },
    { family: "STZhongsong", name: "华文中宋", desc: "华文中宋" },
    { family: "STHupo", name: "华文琥珀", desc: "华文琥珀" },
    { family: "STXinwei", name: "华文新魏", desc: "华文新魏" },
    { family: "STLiti", name: "华文隶书", desc: "华文隶书" },
    { family: "STXingkai", name: "华文行楷", desc: "华文行楷" },
    { family: "YouYuan", name: "幼圆", desc: "幼圆" },
    { family: "LiSu", name: "隶书", desc: "隶书" },
    { family: "STXihei", name: "华文细黑", desc: "华文细黑" },
    { family: "STCaiyun", name: "华文彩云", desc: "华文彩云" },
    { family: "FZShuTi", name: "方正舒体", desc: "方正舒体" },
    { family: "FZYaoti", name: "方正姚体", desc: "方正姚体" },
];

var ToolEnum;
(function (ToolEnum) {
    ToolEnum["Invalid"] = "";
    ToolEnum["Selector"] = "TOOL_SELECTOR";
    ToolEnum["Pen"] = "TOOL_PEN";
    ToolEnum["Rect"] = "TOOL_RECT";
    ToolEnum["Oval"] = "TOOL_OVAL";
    ToolEnum["Text"] = "TOOL_TEXT";
    ToolEnum["Polygon"] = "TOOL_POLYGON";
    ToolEnum["Tick"] = "TOOL_TICK";
    ToolEnum["Cross"] = "TOOL_CROSS";
    ToolEnum["HalfTick"] = "TOOL_HALFTICK";
    ToolEnum["Lines"] = "TOOL_Lines";
    ToolEnum["Img"] = "TOOL_Img";
    ToolEnum["Eraser"] = "TOOL_Eraser";
})(ToolEnum || (ToolEnum = {}));
const getToolName = enumNameGetter("ToolEnum", ToolEnum);

var FactoryEnum;
(function (FactoryEnum) {
    FactoryEnum[FactoryEnum["Invalid"] = 0] = "Invalid";
    FactoryEnum[FactoryEnum["Default"] = 1] = "Default";
})(FactoryEnum || (FactoryEnum = {}));
const getFactoryName = enumNameGetter("FactoryEnum", FactoryEnum);

const Tag$3 = 'Gaia';
class Gaia {
    static get fonts() {
        if (!this._fonts_ininted) {
            this.registerFont(BUILT_IN_FONTS);
            this._fonts_ininted = true;
        }
        return this._fonts;
    }
    static registerFont(infos) {
        for (const info of infos) {
            if (this._fonts.has(info.family)) {
                console.warn(`[${Tag$3}::registerFont] font info already exists, family: "${info.family}"`);
                continue;
            }
            const ok = this.checkFont(info.family);
            if (ok)
                this._fonts.set(info.family, info);
            else
                console.warn(`[${Tag$3}::registerFont] font not supported, family: "${info.family}", name: "${info.name}", desc: "${info.desc}"`);
        }
    }
    /**
     * 注册工厂
     *
     * @static
     * @param {FactoryType} type 工厂类型
     * @param {IFactoryCreater} creator
     * @param {IFactoryInfomation} info
     * @memberof Gaia
     */
    static registerFactory(type, creator, info = {}) {
        if (this._factorys.has(type)) {
            console.warn(`[${Tag$3}::registerFactory] factory '${type}' already exists!`);
        }
        else if (this._factoryInfos.has(type)) {
            console.warn(`[${Tag$3}::registerFactory] factory info '${type}' already exists!`);
        }
        this.overrideFactory(type, creator, info);
    }
    static overrideFactory(type, creator, info) {
        var _a, _b;
        if (creator)
            this._factorys.set(type, creator);
        if (info) {
            const factoryName = getFactoryName(type) + ' Factory';
            this._factoryInfos.set(type, { name: (_a = info.name) !== null && _a !== void 0 ? _a : factoryName, desc: (_b = info.desc) !== null && _b !== void 0 ? _b : factoryName });
        }
    }
    /**
     * 列出工厂类型
     *
     * @static
     * @return {FactoryType[]}
     * @memberof Gaia
     */
    static listFactories() {
        return Array.from(this._factoryInfos.keys());
    }
    static factory(type) {
        return this._factorys.get(type);
    }
    static registerTool(type, creator, info = {}) {
        if (this._tools.has(type)) {
            console.warn(`${Tag$3}::registerTool`, `tool '${type}' already exists!`);
        }
        else if (this._toolInfos.has(type)) {
            console.warn(`${Tag$3}::registerTool`, `tool info '${type}' already exists!`);
        }
        this.overrideTool(type, creator, info);
    }
    static overrideTool(type, creator, info) {
        if (creator)
            this._tools.set(type, creator);
        if (info) {
            const toolName = getToolName(type);
            this._toolInfos.set(type, {
                shape: info === null || info === void 0 ? void 0 : info.shape,
                name: (info === null || info === void 0 ? void 0 : info.name) || toolName,
                desc: (info === null || info === void 0 ? void 0 : info.desc) || toolName,
            });
        }
    }
    static listTools() {
        return Array.from(this._tools.keys());
    }
    static tool(type) {
        return this._tools.get(type);
    }
    static toolInfo(type) {
        return this._toolInfos.get(type);
    }
    static editToolInfo(type, func) {
        let info = this._toolInfos.get(type);
        if (!info) {
            return;
        }
        info = func(info);
        this._toolInfos.set(type, info);
    }
    static registerShape(type, dataCreator, shapeCreator, info = {}) {
        if (this._shapeInfos.has(type)) {
            console.warn(`${Tag$3}::registerShape`, `shape info '${type}' already exists!`);
        }
        else if (this._shapeDatas.has(type)) {
            console.warn(`${Tag$3}::registerShape`, `shape data'${type}' already exists!`);
        }
        else if (this._shapes.has(type)) {
            console.warn(`${Tag$3}::registerShape`, `shape '${type}' already exists!`);
        }
        this.overrideShape(type, dataCreator, shapeCreator, info);
    }
    static overrideShape(type, dataCreator, shapeCreator, info) {
        if (info) {
            const shapeName = getShapeName(type);
            this._shapeInfos.set(type, {
                name: info.name || shapeName,
                desc: info.desc || shapeName,
                type
            });
        }
        if (dataCreator)
            this._shapeDatas.set(type, dataCreator);
        if (shapeCreator)
            this._shapes.set(type, shapeCreator);
    }
    static listShapes() {
        return Array.from(this._shapes.keys());
    }
    static shapeInfo(type) {
        return this._shapeInfos.get(type);
    }
    static shapeData(type) {
        return this._shapeDatas.get(type);
    }
    static shape(type) {
        return this._shapes.get(type);
    }
    static registAction(eventType, handler) {
        this._actionHandler.set(eventType, handler);
    }
    static listActions() { return Array.from(this._actionHandler.keys()); }
    static action(eventType) {
        return this._actionHandler.get(eventType);
    }
}
Gaia._fonts = new Map();
Gaia._tools = new Map();
Gaia._toolInfos = new Map();
Gaia._shapeDatas = new Map();
Gaia._shapes = new Map();
Gaia._shapeInfos = new Map();
Gaia._factorys = new Map();
Gaia._factoryInfos = new Map();
Gaia._fonts_ininted = false;
Gaia.checkFont = FontFamilysChecker.check;
Gaia._actionHandler = new Map();

class ShapeCross extends ShapeNeedPath {
    constructor(data) {
        super(data, CrossData);
    }
    path(ctx) {
        const { x, y, w, h } = this.drawingRect();
        const a = { x: x, y: y + 0.05 * h };
        const b = { x: x + w, y: y + h - 0.05 * h };
        const c = { x: x + 0.05 * w, y: y + h };
        const d = { x: x + w - 0.05 * w, y: y };
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(x + w / 2 + 0.2 * w, y + h / 2 + 0.1 * h, b.x, b.y);
        ctx.moveTo(c.x, c.y);
        ctx.quadraticCurveTo(x + w / 2 - 0.05 * w, y + h / 2 - 0.1 * h, d.x, d.y);
    }
}
Gaia.registerShape(ShapeEnum.Cross, () => new CrossData, d => new ShapeCross(d));

var GenMode;
(function (GenMode) {
    GenMode[GenMode["FromCorner"] = 0] = "FromCorner";
    GenMode[GenMode["FromCenter"] = 1] = "FromCenter";
})(GenMode || (GenMode = {}));
var LockMode;
(function (LockMode) {
    LockMode[LockMode["Default"] = 0] = "Default";
    LockMode[LockMode["Square"] = 1] = "Square";
    LockMode[LockMode["Circle"] = 2] = "Circle";
})(LockMode || (LockMode = {}));
class RectHelper {
    constructor() {
        this._from = Vector.pure(NaN, NaN);
        this._to = Vector.pure(NaN, NaN);
    }
    get ok() { return isNaN(this._from.x) || isNaN(this._to.x); }
    get from() { return this._from; }
    get to() { return this._to; }
    start(x, y) {
        this._from.x = x;
        this._from.y = y;
        this._to.x = x;
        this._to.y = y;
    }
    end(x, y) {
        this._to.x = x;
        this._to.y = y;
    }
    clear() {
        this._from = Vector.pure(NaN, NaN);
        this._to = Vector.pure(NaN, NaN);
    }
    gen() {
        const { x: x0, y: y0 } = this._from;
        const { x: x1, y: y1 } = this._to;
        const x = Math.min(x0, x1);
        const y = Math.min(y0, y1);
        return {
            x, y,
            w: Math.max(x0, x1) - x,
            h: Math.max(y0, y1) - y
        };
    }
}

class SimpleTool {
    get type() { return this._type; }
    constructor(type, shapeType) {
        this._keys = new Map();
        this.keydown = (e) => {
            switch (e.key) {
                case 'Control':
                case 'Alt':
                case 'Shift':
                    this._keys.set(e.key, true);
                    this.applyRect();
                    return;
            }
        };
        this.keyup = (e) => {
            switch (e.key) {
                case 'Control':
                case 'Alt':
                case 'Shift':
                    this._keys.set(e.key, false);
                    this.applyRect();
                    return;
            }
        };
        this._rect = new RectHelper();
        this._type = type;
        this._shapeType = shapeType;
    }
    holdingKey(...keys) {
        for (let i = 0; i < keys.length; ++i) {
            if (!this._keys.get(keys[i])) {
                return false;
            }
        }
        return true;
    }
    start() {
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
    }
    end() {
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);
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
        this._curShape.data.layer = board.layer().id;
        const shape = this._curShape;
        if (!shape)
            return;
        board.add(shape, true);
        this._rect.start(x, y);
        this.updateGeo(0);
    }
    pointerDraw(dot) {
        const { x, y } = dot;
        this._rect.end(x, y);
        this.updateGeo(1);
    }
    pointerUp(dot) {
        const { x, y } = dot;
        this._rect.end(x, y);
        this.updateGeo(2);
        delete this._curShape;
    }
    applyRect() {
        var _a;
        const { x, y, w, h } = this._rect.gen();
        (_a = this._curShape) === null || _a === void 0 ? void 0 : _a.geo(x, y, w, h);
    }
    updateGeo(state) {
        const shape = this._curShape;
        const board = this.board;
        if (!shape || !board)
            return;
        switch (state) {
            case 0: {
                this._prevData = Events.pickShapeGeoData(shape.data);
                this._startData = this._prevData;
                this.applyRect();
                break;
            }
            case 1: {
                this.applyRect();
                const curr = Events.pickShapeGeoData(shape.data);
                board.emit(EventEnum.ShapesGeoChanging, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: [[curr, this._prevData]]
                });
                this._prevData = curr;
                break;
            }
            case 2: {
                this.applyRect();
                const curr = Events.pickShapeGeoData(shape.data);
                board.emit(EventEnum.ShapesGeoChanging, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: [[curr, this._prevData]]
                });
                board.emit(EventEnum.ShapesGeoChanged, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: [[curr, this._startData]]
                });
                board.emit(EventEnum.ShapesDone, {
                    operator: board.whoami,
                    shapeDatas: [shape.data.copy()]
                });
                this._prevData = curr;
                break;
            }
        }
    }
}

Gaia.registerTool(ToolEnum.Cross, () => new SimpleTool(ToolEnum.Cross, ShapeEnum.Cross), { name: 'Cross', desc: 'cross drawer', shape: ShapeEnum.Cross });

class HalfTickData extends ShapeData {
    get needFill() {
        return false;
    }
    constructor(other) {
        super();
        this.type = ShapeEnum.HalfTick;
        this.strokeStyle = '#FF0000';
        this.lineWidth = 2;
        other && this.read(other);
    }
}

class ShapeHalfTick extends ShapeNeedPath {
    constructor(data) {
        super(data, HalfTickData);
    }
    path(ctx) {
        const { x, y, w, h } = this.drawingRect();
        const a = { x: x, y: y + h * 0.7 };
        const b = { x: x + w / 3, y: y + h };
        const c = { x: x + w, y: y };
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(a.x + (b.x - a.x) / 3, a.y, b.x, b.y - (b.y - a.y) / 3, b.x, b.y);
        ctx.bezierCurveTo(b.x, b.y - (b.y - c.y) / 3, c.x - (c.x - b.x) / 4, c.y, c.x, c.y);
        const e = { x: x + w * 0.35, y: y + h * 0.25 };
        const f = { x: x + w * 0.70, y: y + h * 0.70 };
        ctx.moveTo(e.x, e.y);
        ctx.lineTo(f.x, f.y);
    }
}
Gaia.registerShape(ShapeEnum.HalfTick, () => new HalfTickData, d => new ShapeHalfTick(d));

Gaia.registerTool(ToolEnum.HalfTick, () => new SimpleTool(ToolEnum.HalfTick, ShapeEnum.HalfTick), { name: 'Half tick', desc: 'half tick drawer', shape: ShapeEnum.HalfTick });

var ObjectFit;
(function (ObjectFit) {
    ObjectFit[ObjectFit["Fill"] = 0] = "Fill";
    ObjectFit[ObjectFit["Contain"] = 1] = "Contain";
    ObjectFit[ObjectFit["Cover"] = 2] = "Cover";
})(ObjectFit || (ObjectFit = {}));
class ImgData extends ShapeData {
    get src() { var _a; return (_a = this.s) !== null && _a !== void 0 ? _a : ''; }
    set src(v) { if (!v) {
        delete this.s;
    }
    else
        this.s = v; }
    get objectFit() { var _a; return (_a = this.f) !== null && _a !== void 0 ? _a : ObjectFit.Fill; }
    set objectFit(v) { this.f = v; }
    get needFill() {
        return false;
    }
    get needStroke() {
        return false;
    }
    constructor(other) {
        super();
        this.type = ShapeEnum.Img;
        other && this.read(other);
    }
    read(other) {
        super.read(other);
        if (isStr(other.s))
            this.s = other.s;
        if (isNum(other.f))
            this.f = other.f;
        return this;
    }
}

class ShapeImg extends Shape {
    constructor(data) {
        super(data, ImgData);
        this._loaded = false;
        this._error = '';
        this.onLoad = () => {
            this.beginDirty();
            this._loaded = true;
            this.endDirty();
        };
        this.onError = (e) => {
            this.beginDirty();
            this._error = 'fail to load: ' + e.target.src;
            this.endDirty();
        };
        this._r = Resizable.All;
    }
    get img() {
        const d = this.data;
        if (this._src === d.src) {
            return this._img;
        }
        if (this._img) {
            this._img.removeEventListener('load', this.onLoad);
            this._img.removeEventListener('error', this.onError);
        }
        this._src = d.src;
        this._loaded = false;
        this._error = '';
        this._img = new Image();
        this._img.src = this.data.src;
        this._img.addEventListener('load', this.onLoad);
        this._img.addEventListener('error', this.onError);
        return this._img;
    }
    render(ctx) {
        if (!this.visible)
            return;
        const { img } = this;
        if (this._loaded) {
            let { x, y, w, h } = this.drawingRect();
            switch (this.data.objectFit) {
                case ObjectFit.Fill: {
                    this.beginDraw(ctx);
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
                    this.endDraw(ctx);
                    break;
                }
                case ObjectFit.Contain: {
                    const a = img.width / img.height;
                    const b = w / h;
                    let dx = x;
                    let dy = y;
                    let dw = w;
                    let dh = h;
                    if (a > b) {
                        dh = w / a;
                        dy += (h - dh) * 0.5;
                    }
                    else {
                        dw = h * a;
                        dx += (w - dw) * 0.5;
                    }
                    this.beginDraw(ctx);
                    ctx.drawImage(img, 0, 0, img.width, img.height, dx - x, dy - y, dw, dh);
                    this.endDraw(ctx);
                    break;
                }
                case ObjectFit.Cover: {
                    const a = img.width / img.height;
                    const b = w / h;
                    let sx = 0;
                    let sy = 0;
                    let sw = img.width;
                    let sh = img.height;
                    if (a < b) {
                        sh = sw / b;
                        sy = (img.height - sh) / 2;
                    }
                    else {
                        sw = sh * b;
                        sx = (img.width - sw) / 2;
                    }
                    this.beginDraw(ctx);
                    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
                    this.endDraw(ctx);
                    break;
                }
            }
        }
        else if (this._error) {
            this.drawText(ctx, 'error: ' + this._error);
        }
        else {
            this.drawText(ctx, 'loading: ' + this.data.src);
        }
        super.render(ctx);
    }
    drawText(ctx, text) {
        this.beginDraw(ctx);
        const { x, y, w, h } = this.drawingRect();
        ctx.fillStyle = '#FF000088';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#00000088';
        ctx.fillRect(0, 0, w, h);
        ctx.font = 'normal 16px serif';
        ctx.fillStyle = 'white';
        const { fontBoundingBoxDescent: fd, fontBoundingBoxAscent: fa, actualBoundingBoxLeft: al } = ctx.measureText(text);
        const height = fd + fa;
        ctx.fillText(text, x + 1 + al, y + height);
        this.endDraw(ctx);
    }
}
Gaia.registerShape(ShapeEnum.Img, () => new ImgData, d => new ShapeImg(d));

Gaia.registerTool(ToolEnum.Img, () => new SimpleTool(ToolEnum.Img, ShapeEnum.Img), { name: 'Image', desc: 'Image drawer', shape: ShapeEnum.Img });

class LinesData extends ShapeData {
    get coords() { return this.u; }
    set coords(v) { this.u = v; }
    get needFill() {
        return false;
    }
    constructor(other) {
        super(other);
        this.u = [];
        this.type = ShapeEnum.Lines;
        this.strokeStyle = '#ff0000';
        this.lineCap = 'round';
        this.lineJoin = 'round';
        this.lineWidth = 2;
        if (other)
            this.read(other);
    }
    read(other) {
        super.read(other);
        const { coords } = other;
        const { u = coords } = other;
        if (Array.isArray(u))
            this.coords = [...u];
        return this;
    }
    merge(other) {
        super.read(other);
        const { coords } = other;
        const { u = coords } = other;
        if (Array.isArray(u))
            this.coords = [...u];
        return this;
    }
}

class ShapeLines extends Shape {
    constructor(data) {
        super(data, LinesData);
        this._srcGeo = null;
        this._path2D = new Path2D();
        let x, y;
        for (let i = 0; i < this.data.coords.length; i += 2) {
            x = this.data.coords[i];
            y = this.data.coords[i + 1];
            this.updatePath(x, y, i === 0 ? 'first' : undefined);
        }
        this.updateSrcGeo();
    }
    merge(data) {
        const prev = this.data.copy();
        this.beginDirty(prev);
        const startIdx = this.data.coords.length;
        this.data.merge(data);
        const endIdx = this.data.coords.length - 1;
        if (startIdx !== endIdx) {
            let x, y;
            for (let i = startIdx; i <= endIdx; i += 2) {
                x = this.data.coords[i];
                y = this.data.coords[i + 1];
                this.updatePath(x, y, i === 0 ? 'first' : undefined);
            }
        }
        this.updateSrcGeo();
        this.endDirty(prev);
    }
    /**
     * 计算原始矩形
     * @param dot
     */
    updateSrcGeo() {
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;
        for (let i = 0; i < this.data.coords.length; i += 2) {
            const x = this.data.coords[i];
            const y = this.data.coords[i + 1];
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }
        this._srcGeo = {
            x: minX,
            y: minY,
            w: maxX - minX,
            h: maxY - minY
        };
        return this._srcGeo;
    }
    updatePath(x, y, type) {
        if (type === 'first') {
            this._path2D.moveTo(x, y);
        }
        else {
            this._path2D.lineTo(x, y);
        }
    }
    pushDot(dot, type) {
        this.data.coords.push(dot.x, dot.y);
        const geo = this.updateSrcGeo();
        this.updatePath(dot.x, dot.y, type);
        this.geo(geo.x, geo.y, geo.w, geo.h);
        this.endDirty();
    }
    editDot(dot) {
        this.data.coords[this.data.coords.length - 2] = dot.x;
        this.data.coords[this.data.coords.length - 1] = dot.y;
        this._path2D = new Path2D();
        for (let i = 0; i < this.data.coords.length; i += 2) {
            const x = this.data.coords[i];
            const y = this.data.coords[i + 1];
            this.updatePath(x, y, i === 0 ? 'first' : undefined);
        }
        const geo = this.updateSrcGeo();
        this.geo(geo.x, geo.y, geo.w, geo.h);
        this.endDirty();
    }
    render(ctx) {
        if (!this.visible) {
            return;
        }
        const d = this.data;
        if (d.lineWidth && d.strokeStyle && this._srcGeo) {
            ctx.save();
            ctx.translate(this.data.x - this._srcGeo.x, this.data.y - this._srcGeo.y);
            ctx.lineCap = d.lineCap;
            ctx.lineDashOffset = d.lineDashOffset || 0;
            ctx.lineJoin = d.lineJoin;
            ctx.lineWidth = d.lineWidth || 0;
            ctx.miterLimit = d.miterLimit || 0;
            ctx.strokeStyle = d.strokeStyle;
            ctx.setLineDash(d.lineDash);
            ctx.stroke(this._path2D);
            ctx.restore();
        }
        super.render(ctx);
    }
}
Gaia.registerShape(ShapeEnum.Lines, () => new LinesData, d => new ShapeLines(d));

class LinesTool {
    constructor() {
        this._pressingShift = false;
        this._pressingControl = false;
        this._keydown = (e) => {
            if (e.key === 'Shift') {
                this._pressingShift = true;
            }
            else if (e.key === 'Control') {
                this._pressingControl = true;
            }
        };
        this._keyup = (e) => {
            if (e.key === 'Shift') {
                this._pressingShift = false;
            }
            else if (e.key === 'Control') {
                this._pressingControl = false;
            }
        };
        this._blur = (e) => {
            this._pressingShift = false;
            this._pressingControl = false;
        };
    }
    start() {
        window.addEventListener('keydown', this._keydown, true);
        window.addEventListener('keyup', this._keyup, true);
        window.addEventListener('blur', this._blur, true);
    }
    end() {
        window.removeEventListener('keydown', this._keydown, true);
        window.removeEventListener('keyup', this._keyup, true);
        window.removeEventListener('blur', this._blur, true);
    }
    get type() { return ToolEnum.Lines; }
    render() { }
    get board() {
        return this._board;
    }
    set board(v) {
        this._board = v;
    }
    addDot(dot, type) {
        const shape = this._curShape;
        const board = this.board;
        if (!shape || !board)
            return;
        if (this._prevData)
            return shape.pushDot(dot, type);
        const emitEvent = () => {
            const prev = this._prevData;
            if (!prev)
                return;
            const curr = shape.data.copy();
            curr.coords.splice(0, prev.coords.length);
            board.emit(EventEnum.ShapesChanging, {
                operator: board.whoami,
                shapeDatas: [[curr, prev]]
            });
            delete this._prevData;
        };
        this._prevData = shape.data.copy();
        const prev = this._prevData;
        if (prev.coords.length <= 0) {
            shape.pushDot(dot, type);
            emitEvent();
        }
        else {
            shape.pushDot(dot, type);
            setTimeout(emitEvent, 1000 / 30);
        }
    }
    moveDot(dot) {
        const shape = this._curShape;
        const board = this.board;
        if (!shape || !board)
            return;
        if (this._pressingControl && shape.data.coords.length >= 4) {
            const prevX = shape.data.coords[shape.data.coords.length - 4];
            const prevY = shape.data.coords[shape.data.coords.length - 3];
            const angle = Math.atan2(dot.y - prevY, dot.x - prevX) * 180 / Math.PI;
            const o = Math.sqrt((Math.pow(dot.x - prevX, 2) + Math.pow(dot.y - prevY, 2)) / 2);
            if (angle > 22.5 && angle <= 67.5) {
                dot.x = prevX + o;
                dot.y = prevY + o;
            }
            else if (angle > 67.5 && angle <= 112.5) {
                dot.x = prevX;
            }
            else if (angle > 112.5 && angle <= 157.5) {
                dot.x = prevX - o;
                dot.y = prevY + o;
            }
            else if (angle > 157.5 || angle <= -157.5) {
                dot.y = prevY;
            }
            else if (angle <= -112.5 && angle > -157.5) {
                dot.x = prevX - o;
                dot.y = prevY - o;
            }
            else if (angle <= -67.5 && angle > -112.5) {
                dot.x = prevX;
            }
            else if (angle <= -22.5 && angle > -67.5) {
                dot.x = prevX + o;
                dot.y = prevY - o;
            }
            else {
                dot.y = prevY;
            }
        }
        if (this._prevData)
            return shape.editDot(dot);
        const emitEvent = () => {
            const prev = this._prevData;
            if (!prev)
                return;
            const curr = shape.data.copy();
            curr.coords.splice(0, prev.coords.length);
            board.emit(EventEnum.ShapesChanging, {
                operator: board.whoami,
                shapeDatas: [[curr, prev]]
            });
            delete this._prevData;
        };
        this._prevData = shape.data.copy();
        const prev = this._prevData;
        if (prev.coords.length <= 0) {
            shape.editDot(dot);
            emitEvent();
        }
        else {
            shape.editDot(dot);
            setTimeout(emitEvent, 1000 / 30);
        }
    }
    pointerMove(dot) {
        if (this._curShape) {
            this.moveDot(dot);
        }
    }
    pointerDown(dot) {
        const board = this.board;
        if (!board) {
            return;
        }
        if (!this._curShape) {
            this._curShape = board.factory.newShape(ShapeEnum.Lines);
            this._curShape.data.layer = board.layer().id;
            this._curShape.data.editing = true;
            board.add(this._curShape, true);
            this.addDot(dot, 'first');
            this.addDot(dot);
        }
    }
    pointerDraw(dot) {
        this.moveDot(dot);
    }
    pointerUp(dot) {
        var _a;
        const shape = this._curShape;
        if (!shape) {
            return;
        }
        if (!this._pressingShift) {
            shape.data.editing = false;
            (_a = this._board) === null || _a === void 0 ? void 0 : _a.emit(EventEnum.ShapesDone, {
                operator: this._board.whoami,
                shapeDatas: [shape.data.copy()]
            });
            delete this._curShape;
        }
        else {
            this.addDot(dot);
        }
    }
}
Gaia.registerTool(ToolEnum.Lines, () => new LinesTool(), { name: 'Lines', desc: 'lines', shape: ShapeEnum.Lines });

class OvalData extends ShapeData {
    constructor(other) {
        super();
        this.type = ShapeEnum.Oval;
        this.strokeStyle = '#ff0000';
        this.lineWidth = 2;
        other && this.read(other);
    }
}

class ShapeOval extends ShapeNeedPath {
    constructor(data) {
        super(data, OvalData);
    }
    path(ctx) {
        const { x, y, w, h } = this.drawingRect();
        const r = (w > h) ? w : h;
        const scale = { x: w / r, y: h / r };
        ctx.save();
        ctx.scale(scale.x, scale.y);
        ctx.beginPath();
        ctx.arc((x + 0.5 * w) / scale.x, (y + 0.5 * h) / scale.y, r / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.restore();
    }
}
Gaia.registerShape(ShapeEnum.Oval, () => new OvalData, d => new ShapeOval(d));

class OvalTool extends SimpleTool {
    constructor() {
        super(ToolEnum.Oval, ShapeEnum.Oval);
    }
    applyRect() {
        var _a;
        if (this.holdingKey('Shift', 'Alt')) {
            // 从圆心开始绘制正圆
            const f = this._rect.from;
            const t = this._rect.to;
            const r = Math.sqrt(Math.pow(f.y - t.y, 2) + Math.pow(f.x - t.x, 2));
            const x = f.x - r;
            const y = f.y - r;
            (_a = this._curShape) === null || _a === void 0 ? void 0 : _a.geo(x, y, r * 2, r * 2);
        }
        else if (this.holdingKey('Shift')) {
            // 四角开始绘制正圆
            // TODO;
            return super.applyRect();
        }
        else if (this.holdingKey('Alt')) {
            // 圆心开始绘制椭圆
            // TODO;
            return super.applyRect();
        }
        else {
            // 四角开始绘制椭圆
            return super.applyRect();
        }
    }
}
Gaia.registerTool(ToolEnum.Oval, () => new OvalTool(), { name: 'Oval', desc: 'oval drawer', shape: ShapeEnum.Oval });

var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["Invalid"] = 0] = "Invalid";
    ChangeType[ChangeType["All"] = 1] = "All";
    ChangeType[ChangeType["Append"] = 2] = "Append";
    ChangeType[ChangeType["Subtract"] = 3] = "Subtract";
})(ChangeType || (ChangeType = {}));
class PenData extends ShapeData {
    get src_rect() { return this._src_rect; }
    get dotsType() { return this.v; }
    set dotsType(v) { this.v = v; }
    get coords() { return this.u; }
    set coords(v) {
        this.u = v;
        this.reset_src_rect(this.u);
    }
    add_coords(v) {
        if (!v.length)
            return this;
        const empty = !this.u.length;
        this.u.push(...v);
        if (empty)
            this.reset_src_rect(v);
        else
            this.expand_src_rect(v);
        return this;
    }
    del_coords(start, deleteCount) {
        const ret = this.u.splice(start, deleteCount);
        this.reset_src_rect(this.u);
        return ret;
    }
    reset_src_rect(u = this.coords) {
        if (!u.length) {
            this._src_rect.x = 0;
            this._src_rect.y = 0;
            this._src_rect.w = -1;
            this._src_rect.h = -1;
            return this._src_rect;
        }
        this._src_rect.x = u[0];
        this._src_rect.y = u[1];
        this._src_rect.w = 0;
        this._src_rect.h = 0;
        return this.expand_src_rect(u);
    }
    expand_src_rect(u) {
        let src_r = this._src_rect.right;
        let src_b = this._src_rect.bottom;
        for (let i = 0; i < u.length; i += 2) {
            this._src_rect.x = Math.min(u[i + 0], this._src_rect.x);
            this._src_rect.y = Math.min(u[i + 1], this._src_rect.y);
            src_r = Math.max(u[i + 0], src_r);
            src_b = Math.max(u[i + 1], src_b);
        }
        this._src_rect.right = src_r;
        this._src_rect.bottom = src_b;
        return this._src_rect;
    }
    get coords2world() {
        const { rotation = 0, u } = this;
        const src_rect = this.reset_src_rect();
        const { x: mx, y: my } = src_rect.mid();
        const dot_on_world = (x, y) => {
            const ret = Vector.rotated2(x, y, mx, my, rotation);
            ret.x -= src_rect.x - this.x;
            ret.y -= src_rect.y - this.y;
            return ret;
        };
        const ret = [];
        for (let i = 0; i < u.length; i += 2) {
            const { x, y } = dot_on_world(u[i], u[i + 1]);
            ret.push(x, y);
        }
        return ret;
    }
    get needFill() {
        return false;
    }
    constructor(other) {
        super();
        this.v = ChangeType.All;
        this.u = [];
        this._src_rect = new Rect(0, 0, 0, 0);
        this.type = ShapeEnum.Pen;
        this.strokeStyle = '#ff0000';
        this.lineCap = 'round';
        this.lineJoin = 'round';
        this.lineWidth = 5;
        other && this.read(other);
    }
    read(other) {
        super.read(other);
        const { u = other.coords, v = other.dotsType } = other;
        if (v)
            this.dotsType = v;
        if (Array.isArray(u))
            this.coords = [...u];
        return this;
    }
    merge(other) {
        super.read(other);
        const { u = other.coords } = other;
        if (!Array.isArray(u)) {
            return this;
        }
        switch (other.dotsType) {
            case ChangeType.Subtract:
                this.coords = this.coords.slice(0, -u.length);
                break;
            case ChangeType.Append:
                this.add_coords(u);
                break;
            default:
                this.coords = [...u];
                break;
        }
        return this;
    }
}

class ShapePen extends Shape {
    static is(shape) {
        return shape.type === ShapeEnum.Pen && shape.type === shape.data.type;
    }
    constructor(data) {
        super(data, PenData);
        this._lineFactor = 0.5;
        this._smoothFactor = 0.5;
        let x, y;
        for (let i = 0; i < this.data.coords.length; i += 2) {
            x = this.data.coords[i];
            y = this.data.coords[i + 1];
            if (i === 0)
                this.updatePath(x, y, 'first');
            else if (i >= this.data.coords.length - 2)
                this.updatePath(x, y, 'last');
            else
                this.updatePath(x, y, 'mid');
        }
    }
    merge(data) {
        const prev = this.data.copy();
        this.beginDirty(prev);
        const startIdx = this.data.coords.length;
        this.data.merge(data);
        const endIdx = this.data.coords.length - 1;
        if (startIdx !== endIdx) {
            let x, y;
            for (let i = startIdx; i <= endIdx; i += 2) {
                x = this.data.coords[i];
                y = this.data.coords[i + 1];
                const t = i === 0 ? 'first' : (!this.data.editing && i === endIdx) ? 'last' : 'mid';
                this.updatePath(x, y, t);
            }
        }
        this.endDirty(prev);
    }
    updatePath(x, y, type) {
        if (type === 'first') {
            this.prev_dot = { x, y };
            this._path2D = new Path2D();
            this._path2D.moveTo(x, y);
            return;
        }
        if (!this._path2D)
            return;
        const { x: prev_x, y: prev_y } = this.prev_dot;
        if (this.prev_t === undefined) {
            this.prev_t = {
                x: x - (x - prev_x) * this._lineFactor,
                y: y - (y - prev_y) * this._lineFactor
            };
            this._path2D.lineTo(this.prev_t.x, this.prev_t.y);
        }
        const { x: prev_t_x, y: prev_t_y } = this.prev_t;
        const t_x_0 = prev_x + (x - prev_x) * this._lineFactor;
        const t_y_0 = prev_y + (y - prev_y) * this._lineFactor;
        const t_x_1 = x - (x - prev_x) * this._lineFactor;
        const t_y_1 = y - (y - prev_y) * this._lineFactor;
        const c_x_0 = prev_t_x + (prev_x - prev_t_x) * this._smoothFactor; // 第一控制点x坐标
        const c_y_0 = prev_t_y + (prev_y - prev_t_y) * this._smoothFactor; // 第一控制点y坐标
        const c_x_1 = prev_x + (t_x_0 - prev_x) * (1 - this._smoothFactor); // 第二控制点x坐标
        const c_y_1 = prev_y + (t_y_0 - prev_y) * (1 - this._smoothFactor); // 第二控制点y坐标
        this._path2D.bezierCurveTo(c_x_0, c_y_0, c_x_1, c_y_1, t_x_0, t_y_0);
        if (type === 'last') {
            delete this.prev_t;
            delete this.prev_dot;
            this._path2D.lineTo(x, y);
        }
        else {
            this.prev_t = { x: t_x_1, y: t_y_1 };
            this.prev_dot = { x, y };
        }
    }
    appendDot(dot, type) {
        const coords = this.data.coords;
        const prevX = coords[coords.length - 2];
        const prevY = coords[coords.length - 1];
        if (type === 'first') {
            this.data.coords = [dot.x, dot.y];
        }
        else if (prevY === dot.y && prevX === dot.x && type !== 'last') {
            return;
        }
        else {
            this.data.add_coords([dot.x, dot.y]);
        }
        const geo = this.data.src_rect;
        this.updatePath(dot.x, dot.y, type);
        this.geo(geo.x, geo.y, geo.w, geo.h);
        this.endDirty();
    }
    applyCoords(coords) {
        for (let i = 0; i < coords.length; i += 2) {
            const t = i === 0 ? 'first' : i == coords.length - 2 ? 'last' : 'mid';
            this.appendDot({ x: coords[i], y: coords[i + 1] }, t);
        }
    }
    applyDots(dots) {
        for (let i = 0; i < dots.length; ++i) {
            const t = i === 0 ? 'first' : i == dots.length - 1 ? 'last' : 'mid';
            this.appendDot(dots[i], t);
        }
    }
    render(ctx) {
        if (!this.visible)
            return;
        const d = this.data;
        if (d.lineWidth && d.strokeStyle) {
            this.beginDraw(ctx);
            ctx.translate(-this.data.src_rect.x, -this.data.src_rect.y);
            ctx.lineCap = d.lineCap;
            ctx.lineDashOffset = d.lineDashOffset || 0;
            ctx.lineJoin = d.lineJoin;
            ctx.lineWidth = d.lineWidth || 0;
            ctx.miterLimit = d.miterLimit || 0;
            ctx.strokeStyle = d.strokeStyle;
            ctx.setLineDash(d.lineDash);
            this._path2D && ctx.stroke(this._path2D);
            this.endDraw(ctx);
        }
        super.render(ctx);
    }
}
Gaia.registerShape(ShapeEnum.Pen, () => new PenData, d => new ShapePen(d));

class PenTool {
    constructor() {
        this.type = ToolEnum.Pen;
        this.board = void 0;
    }
    end() {
        const shape = this._curShape;
        if (shape && shape.data.coords.length >= 2) {
            const { coords } = shape.data;
            this.pointerUp({
                x: coords[coords.length - 2],
                y: coords[coords.length - 1],
                p: 0
            });
        }
        delete this._curShape;
    }
    pointerDown(dot) {
        const board = this.board;
        if (!board)
            return;
        this._curShape = board.factory.newShape(ShapeEnum.Pen);
        this._curShape.data.layer = board.layer().id;
        this._curShape.data.editing = true;
        board.add(this._curShape, true);
        this.addDot(dot, 'first');
    }
    pointerDraw(dot) {
        this.addDot(dot, 'mid');
    }
    pointerUp(dot) {
        var _a;
        const shape = this._curShape;
        if (shape) {
            shape.data.editing = false;
            this.addDot(dot, 'last');
            (_a = this.board) === null || _a === void 0 ? void 0 : _a.emit(EventEnum.ShapesDone, {
                operator: this.board.whoami,
                shapeDatas: [shape.data.copy()]
            });
            delete this._curShape;
        }
    }
    addDot(dot, type) {
        const shape = this._curShape;
        const board = this.board;
        if (!shape || !board)
            return;
        if (this._prevData)
            return shape.appendDot(dot, type);
        const emitEvent = () => {
            const prev = this._prevData;
            if (!prev)
                return;
            const curr = shape.data.copy();
            curr.dotsType = ChangeType.Append;
            curr.del_coords(0, prev.coords.length);
            board.emit(EventEnum.ShapesChanging, {
                operator: board.whoami,
                shapeDatas: [[curr, prev]]
            });
            delete this._prevData;
        };
        this._prevData = shape.data.copy();
        const prev = this._prevData;
        if (prev.coords.length <= 0) {
            shape.appendDot(dot, type);
            emitEvent();
        }
        else {
            shape.appendDot(dot, type);
            setTimeout(emitEvent, 1000 / 30);
        }
    }
}
Gaia.registerTool(ToolEnum.Pen, () => new PenTool(), { name: 'Pen', desc: 'simple pen', shape: ShapeEnum.Pen });

class PolygonData extends ShapeData {
    constructor(other) {
        super(other);
        this.u = [];
        this.type = ShapeEnum.Polygon;
        this.fillStyle = '#ff0000';
        this.strokeStyle = '#000000';
        this.lineWidth = 2;
        other && this.read(other);
    }
    get dots() { return this.u; }
    set dots(v) { this.u = v; }
    read(other) {
        super.read(other);
        const { u = other.dots } = other;
        if (u)
            this.u = u.map(v => (Object.assign({}, v)));
        return this;
    }
}

class ShapePolygon extends ShapeNeedPath {
    constructor(data) {
        super(data, PolygonData);
    }
    path(ctx) {
        const { x, y, w, h } = this.drawingRect();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
    }
}
Gaia.registerShape(ShapeEnum.Polygon, () => new PolygonData, d => new ShapePolygon(d));

const desc = {
    name: 'Polygon', desc: 'Polygon Drawer', shape: ShapeEnum.Polygon
};
Gaia.registerTool(ToolEnum.Polygon, () => new SimpleTool(ToolEnum.Polygon, ShapeEnum.Polygon), desc);

class RectData extends ShapeData {
    constructor(other) {
        super();
        this.type = ShapeEnum.Rect;
        this.strokeStyle = '#ff0000';
        this.lineWidth = 5;
        other && this.read(other);
    }
}

class ShapeRect extends ShapeNeedPath {
    constructor(data) {
        super(data, RectData);
    }
    path(ctx) {
        const { x, y, w, h } = this.drawingRect();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
    }
}
Gaia.registerShape(ShapeEnum.Rect, () => new RectData, d => new ShapeRect(d));

Gaia.registerTool(ToolEnum.Rect, () => new SimpleTool(ToolEnum.Rect, ShapeEnum.Rect), { name: 'Rectangle', desc: 'rect drawer', shape: ShapeEnum.Rect });

class TextData extends ShapeData {
    constructor(other) {
        super(other);
        /** text */
        this.s = '';
        /** TFontStyle */
        this.u = ['normal', 'normal', 'normal', 24, 'Simsum'];
        /** padding left */
        this.m = 3;
        /** padding right */
        this.n = 3;
        /** padding top */
        this.p = 3;
        /** padding bottom */
        this.q = 3;
        this.type = ShapeEnum.Text;
        this.fillStyle = '#ff0000';
        this.strokeStyle = '';
        this.lineWidth = 0;
        other && this.read(other);
    }
    get text() { return this.s; }
    set text(v) { this.s = v; }
    get f_d() { return this.u; }
    set f_d(v) { this.u = v; }
    get t_l() { return this.m; }
    set t_l(v) { this.m = v; }
    get t_r() { return this.n; }
    set t_r(v) { this.n = v; }
    get t_t() { return this.p; }
    set t_t(v) { this.p = v; }
    get t_b() { return this.q; }
    set t_b(v) { this.q = v; }
    get font() {
        const arr = [...this.f_d];
        arr[3] = `${arr[3]}px`;
        return arr.join(' ');
    }
    ;
    get font_style() { return this.f_d[0]; }
    get font_variant() { return this.f_d[1]; }
    get font_weight() { return this.f_d[2]; }
    get font_size() { return this.f_d[3]; }
    get font_family() { return this.f_d[4]; }
    set font_style(v) { this.f_d[0] = v; }
    set font_variant(v) { this.f_d[1] = v; }
    set font_weight(v) { this.f_d[2] = v; }
    set font_size(v) { this.f_d[3] = v; }
    set font_family(v) { this.f_d[4] = v; }
    read(o) {
        super.read(o);
        const { s = o.text, u = o.f_d, m = o.t_l, n = o.t_r, p = o.t_t, q = o.t_b, } = o;
        if (isStr(s))
            this.s = s;
        if (Array.isArray(u))
            this.u = [...u];
        if (isNum(m))
            this.m = m;
        if (isNum(n))
            this.n = n;
        if (isNum(p))
            this.p = p;
        if (isNum(q))
            this.q = q;
        return this;
    }
}

class TextSelection {
    constructor(start = -1, end = -1) {
        this.start = -1;
        this.end = -1;
        this.start = start;
        this.end = end;
    }
    equal(other) {
        return this.start === other.start && this.end === other.end;
    }
}

let _measurer;
/**
 * 延迟创建文本测量用的画布上下文，
 * 避免在非 DOM 环境（如 Node）中引入本模块时抛错
 *
 * Creates the canvas context for text measuring lazily,
 * so importing this module in non-DOM environments (e.g. Node) does not throw.
 */
const getMeasurer = () => {
    if (!_measurer)
        _measurer = document.createElement('canvas').getContext('2d');
    return _measurer;
};
class ShapeText extends Shape {
    get text() { return this.data.s; }
    set text(v) { this.setText(v); }
    get selection() { return this._selection; }
    set selection(v) { this.setSelection(v); }
    get selectionRects() { return this._selectionRects; }
    get offscreen() {
        this._offscreen = this._offscreen || document.createElement('canvas');
        return this._offscreen;
    }
    constructor(data) {
        super(data, TextData);
        this._selection = new TextSelection;
        this._lines = [];
        this._selectionRects = [];
        this._cursorVisible = false;
        this._calculateLines();
        this._calculateSectionRects();
    }
    get fontSize() { return this.data.font_size; }
    set fontSize(v) {
        const prev = {};
        this.beginDirty(prev);
        this.data.font_size = v;
        this._calculateLines();
        this._calculateSectionRects();
        this.endDirty(prev);
    }
    merge(data) {
        const prev = this.data.copy();
        this.beginDirty(prev);
        this.data.merge(data);
        this._calculateLines();
        this._calculateSectionRects();
        this.endDirty(prev);
    }
    _setCursorVisible(v = !this._cursorVisible) {
        this._cursorVisible = v;
        this.endDirty();
    }
    _setCursorFlashing(v) {
        if (v)
            this._cursorVisible = true;
        if (v === !!this._cursorFlashingTimer)
            return;
        clearInterval(this._cursorFlashingTimer);
        delete this._cursorFlashingTimer;
        if (v) {
            this._cursorFlashingTimer = setInterval(() => this._setCursorVisible(), 500);
        }
        else {
            this._setCursorVisible(true);
        }
    }
    _applyStyle(ctx) {
        if (!ctx)
            return;
        ctx.font = this.data.font;
        ctx.fillStyle = this.data.fillStyle;
        ctx.strokeStyle = this.data.strokeStyle;
        ctx.lineWidth = this.data.lineWidth;
        ctx.setLineDash([]);
    }
    setText(v, dirty = true) {
        if (this.data.s === v)
            return;
        this.data.s = v;
        this._calculateLines();
        dirty && this.endDirty();
    }
    setSelection(v = { start: -1, end: -1 }, dirty = true) {
        if (this._selection.equal(v))
            return;
        this._selection.start = v.start;
        this._selection.end = v.end;
        this._setCursorFlashing(v.start === v.end && v.start >= 0);
        this._calculateSectionRects();
        dirty && this.endDirty();
    }
    _calculateLines() {
        const measurer = getMeasurer();
        this._applyStyle(measurer);
        let totalH = this.data.p;
        let totalW = 0;
        const text = this.text;
        this._lines = text.split('\n').map(v => {
            const str = v + '\n';
            const tm = measurer.measureText(str);
            const y = totalH;
            const bl = y + tm.fontBoundingBoxAscent;
            totalW = Math.max(tm.width, totalW);
            totalH += tm.fontBoundingBoxAscent + tm.fontBoundingBoxDescent;
            return Object.assign({ str, x: this.data.m, y, bl }, tm);
        });
        totalH += this.data.q;
        totalW += this.data.n + this.data.m;
        this.resize(totalW, totalH);
    }
    _calculateSectionRects() {
        const measurer = getMeasurer();
        this._applyStyle(measurer);
        const selection = this._selection;
        let lineStart = 0;
        let lineEnd = 0;
        this._selectionRects = [];
        for (let i = 0; i < this._lines.length; ++i) {
            const { str, y, x } = this._lines[i];
            lineEnd += str.length;
            if (lineEnd <= selection.start) {
                lineStart = lineEnd;
                continue;
            }
            if (lineStart > selection.end)
                break;
            const pre = str.substring(0, selection.start - lineStart);
            const mid = str.substring(selection.start - lineStart, selection.end - lineStart);
            const tm0 = measurer.measureText(pre);
            const tm1 = measurer.measureText(mid);
            const left = x + tm0.width;
            const top = y;
            const height = tm1.fontBoundingBoxAscent + tm1.fontBoundingBoxDescent;
            this._selectionRects.push(new Rect(left, top, Math.max(2, tm1.width), height));
            lineStart = lineEnd;
        }
    }
    render(ctx) {
        if (!this.visible)
            return;
        const needStroke = this.data.strokeStyle && this.data.lineWidth;
        const needFill = this.data.fillStyle;
        if (!this.editing && !needStroke && !needFill) {
            return super.render(ctx);
        }
        this.beginDraw(ctx);
        if (this.editing) {
            const { x, y, w, h } = this.drawingRect();
            let lineWidth = 1;
            let halfLineW = lineWidth / 2;
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = this.data.fillStyle || 'white';
            ctx.setLineDash([]);
            ctx.strokeRect(x + halfLineW, y + halfLineW, w - lineWidth, h - lineWidth);
        }
        if (needStroke || needFill) {
            const { x, y, w, h } = this.drawingRect();
            const { offscreen } = this;
            offscreen.width = w;
            offscreen.height = h;
            const octx = offscreen.getContext('2d');
            this._applyStyle(octx);
            octx.globalCompositeOperation = 'source-over';
            for (let i = 0; i < this._lines.length; ++i) {
                const line = this._lines[i];
                needFill && octx.fillText(line.str, line.x, line.bl);
                needStroke && octx.strokeText(line.str, line.x, line.bl);
            }
            if (this._cursorVisible && this.editing) {
                octx.globalCompositeOperation = 'xor';
                octx.fillStyle = this._cursorFlashingTimer ? this.data.fillStyle : '#2f71ff';
                for (let i = 0; i < this._selectionRects.length; ++i) {
                    const rect = this._selectionRects[i];
                    ctx.fillStyle = 'white';
                    ctx.fillRect(x + rect.x, y + rect.y, rect.w, rect.h);
                    octx.fillRect(rect.x, rect.y, rect.w, rect.h);
                }
            }
            ctx.drawImage(offscreen, x, y);
        }
        this.endDraw(ctx);
        return super.render(ctx);
    }
}
Gaia.registerShape(ShapeEnum.Text, () => new TextData, d => new ShapeText(d));

var styles = {"layer_onscreen_canvas":"writeboard_layer_onscreen_canvas_kWJIP","text_editor":"writeboard_text_editor_nWT80"};

class TextTool {
    set curShape(shape) {
        var _a;
        const preShape = this._curShape;
        if (preShape === shape)
            return;
        this._curShape = shape;
        if (shape) {
            shape.editing = true;
            this._updateEditorStyle(shape);
            this.editor.style.display = 'block';
            this.editor.value = shape.text;
        }
        else {
            this.editor.style.display = 'none';
        }
        if (preShape) {
            preShape.editing = false;
            if (!preShape.text && !this._newTxt) {
                const board = this.board;
                if (!board)
                    return;
                preShape.merge(this._prevData);
                board.remove(preShape, true);
            }
            else if (this._newTxt) {
                this._newTxt = false;
                (_a = this._board) === null || _a === void 0 ? void 0 : _a.emit(EventEnum.ShapesDone, {
                    operator: this._board.whoami,
                    shapeDatas: [preShape.data.copy()]
                });
            }
        }
        this._prevData = shape === null || shape === void 0 ? void 0 : shape.data.copy();
    }
    constructor() {
        this.type = ToolEnum.Text;
        this.editor = document.createElement('textarea');
        this._newTxt = false;
        this._updateEditorStyle = (shape) => {
            const { board } = this;
            if (!board)
                return;
            this.editor.style.font = shape.data.font;
            this.editor.style.left = board.world.x + shape.data.x + 'px';
            this.editor.style.top = board.world.y + shape.data.y + 'px';
            this.editor.style.minWidth = shape.data.w + 'px';
            this.editor.style.minHeight = shape.data.h + 'px';
            this.editor.style.maxWidth = shape.data.w + 'px';
            this.editor.style.maxHeight = shape.data.h + 'px';
            this.editor.style.paddingLeft = shape.data.t_l + 'px';
            this.editor.style.paddingTop = shape.data.t_t + 'px';
            this.editor.style.transform = `rotate(${(180 * shape.data.rotation / Math.PI).toFixed(4)}deg) scale(${shape.data.scaleX},${shape.data.scaleY})`;
        };
        this._updateShapeText = () => {
            const shape = this._curShape;
            if (!shape)
                return;
            const prev = shape.data.copy();
            shape.setText(this.editor.value, false);
            shape.setSelection({
                start: this.editor.selectionStart,
                end: this.editor.selectionEnd
            });
            this._updateEditorStyle(shape);
            const board = this.board;
            if (!board)
                return;
            const curr = shape.data.copy();
            board.emit(EventEnum.ShapesChanging, {
                operator: board.whoami,
                shapeDatas: [[curr, prev]]
            });
        };
        this._docPointerdown = (e) => {
            this.curShape = undefined;
        };
        this._keydown = (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.curShape = undefined;
            }
            else if (e.key === 'Escape') {
                this.curShape = undefined;
            }
            e.stopPropagation();
        };
        this.editor.wrap = 'off';
        this.editor.classList.add(styles.text_editor);
    }
    start() {
        this.editor.addEventListener('keydown', this._keydown);
        this.editor.addEventListener('input', this._updateShapeText);
        document.addEventListener('selectionchange', this._updateShapeText);
        document.addEventListener('pointerdown', this._docPointerdown);
    }
    end() {
        this.editor.remove();
        this.editor.removeEventListener('keydown', this._keydown);
        this.editor.removeEventListener('input', this._updateShapeText);
        document.removeEventListener('selectionchange', this._updateShapeText);
        document.removeEventListener('pointerdown', this._docPointerdown);
        this.curShape = undefined;
    }
    get board() {
        return this._board;
    }
    set board(v) {
        var _a;
        this._board = v;
        const pe = (_a = this._board) === null || _a === void 0 ? void 0 : _a.element;
        if (pe && this.editor.parentElement !== pe) {
            pe.appendChild(this.editor);
        }
    }
    pointerDown(dot) {
        const { board } = this;
        if (!board) {
            return;
        }
        let shapeText;
        const shapes = board.hits(Object.assign(Object.assign({}, dot), { w: 0, h: 0 }));
        for (let i = 0; i < shapes.length; ++i) {
            const shape = shapes[i];
            if (shape.data.type !== ShapeEnum.Text)
                continue;
            shapeText = shapes[i];
            break;
        }
        if (!shapeText && this._curShape) {
            this.curShape = undefined;
            return;
        }
        else if (!shapeText) {
            this._newTxt = true;
            const newShapeText = board.factory.newShape(ShapeEnum.Text);
            newShapeText.data.layer = board.layer().id;
            newShapeText.move(dot.x, dot.y);
            board.add(newShapeText, true);
            shapeText = newShapeText;
        }
        this.connect(shapeText);
    }
    connect(shapeText) {
        const { board } = this;
        if (!board) {
            return;
        }
        this.curShape = shapeText;
        setTimeout(() => this.editor.focus(), 10);
    }
}
Gaia.registerTool(ToolEnum.Text, () => new TextTool, { name: 'Text', desc: 'enter some text', shape: ShapeEnum.Text });

class TickData extends ShapeData {
    get needFill() {
        return false;
    }
    constructor(other) {
        super();
        this.type = ShapeEnum.Tick;
        this.strokeStyle = '#FF0000';
        this.lineWidth = 2;
        other && this.read(other);
    }
}

class ShapeTick extends ShapeNeedPath {
    constructor(data) {
        super(data, TickData);
    }
    path(ctx) {
        const { x, y, w, h } = this.drawingRect();
        const a = { x: x, y: y + h * 0.7 };
        const b = { x: x + w / 3, y: y + h };
        const c = { x: x + w, y: y };
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(a.x + (b.x - a.x) / 3, a.y, b.x, b.y - (b.y - a.y) / 3, b.x, b.y);
        ctx.bezierCurveTo(b.x, b.y - (b.y - c.y) / 3, c.x - (c.x - b.x) / 4, c.y, c.x, c.y);
    }
}
Gaia.registerShape(ShapeEnum.Tick, () => new TickData, d => new ShapeTick(d));

Gaia.registerTool(ToolEnum.Tick, () => new SimpleTool(ToolEnum.Tick, ShapeEnum.Tick), { name: 'Tick', desc: 'tick drawer', shape: ShapeEnum.Tick });

class LayerInfo {
    constructor(inits) {
        this.id = inits.id;
        this.name = inits.name;
    }
    pure() {
        return { id: this.id, name: this.name };
    }
}
class Layer {
    get name() { return this._info.name; }
    ;
    get info() { return this._info; }
    ;
    get onscreen() { return this._onscreen; }
    ;
    get offscreen() { return this._offscreen; }
    ;
    get ctx() { return this._ctx; }
    ;
    get octx() { return this._octx; }
    ;
    get opacity() {
        const v = this._onscreen.style.opacity;
        return v === '' ? 1 : Number(v);
    }
    ;
    set opacity(v) { this._onscreen.style.opacity = '' + v; }
    ;
    get id() { return this._info.id; }
    constructor(inits) {
        var _a;
        this._own_onscreen = false;
        this._own_offscreen = false;
        this._info = new LayerInfo(inits);
        this._onscreen = (_a = inits.onscreen) !== null && _a !== void 0 ? _a : document.createElement('canvas');
        this._own_onscreen = !inits.onscreen;
        this._onscreen.setAttribute('layer_id', this.id);
        this._onscreen.setAttribute('layer_name', this.name);
        this._onscreen.draggable = false;
        this._onscreen.classList.add(styles.layer_onscreen_canvas);
        this._ctx = this._onscreen.getContext('2d');
        this._offscreen = document.createElement('canvas');
        // this._offscreen.style.position = 'fixed'
        // this._offscreen.style.border = '1px solid black'
        // document.body.appendChild(this._offscreen)
        this._own_offscreen = true;
        this._offscreen.width = this._onscreen.width;
        this._offscreen.height = this._onscreen.height;
        this._octx = this._offscreen.getContext('2d');
    }
    get width() {
        return this._onscreen.width;
    }
    set width(v) {
        if (Numbers.equals(this.width, v))
            return;
        this._onscreen.width = v;
        this._offscreen.width = v;
    }
    get height() {
        return this._onscreen.height;
    }
    set height(v) {
        if (Numbers.equals(this.height, v))
            return;
        this._onscreen.height = v;
        this._offscreen.height = v;
    }
    destroy() {
        if (this._own_onscreen)
            this._onscreen.remove();
        if (this._own_offscreen)
            this._offscreen.remove();
    }
    /**
     * @deprecated 拼写错误，请使用 destroy()
     * @deprecated misspelled, use destroy() instead
     */
    destory() { this.destroy(); }
}

const { floor: floor$1, ceil } = Math;
const Tag$2 = 'Board';
class Board {
    get lb_down() { return !!this._mousebuttons[0]; }
    get mb_down() { return !!this._mousebuttons[1]; }
    get viewport() { return this._viewport; }
    get world() { return this._world; }
    get whoami() { return this._whoami; }
    get width() { return this._viewport.w; }
    set width(v) {
        const rect = this._viewport.pure();
        rect.w = v;
        this.set_viewport(rect);
    }
    get height() { return this._viewport.h; }
    set height(v) {
        const rect = this._viewport.pure();
        rect.h = v;
        this.set_viewport(rect);
    }
    scroll_to(x, y, opts) {
        const rect = this._world.pure();
        const { min, max } = Math;
        rect.x = -max(min(x, this._world.w - this._viewport.w), 0);
        rect.y = -max(min(y, this._world.h - this._viewport.h), 0);
        this.set_world_rect(rect, opts);
        return this;
    }
    set_world_rect(to, opts) {
        if (Rect.equal(this._world, to))
            return;
        const form = this._world.pure();
        this._world.x = to.x;
        this._world.y = to.y;
        this._world.w = to.w;
        this._world.h = to.h;
        this.markViewDirty();
        this.read_emit_opts(opts, (operator) => {
            this.emit(EventEnum.WorldRectChanged, { operator, form, to: this._world.pure() });
        });
    }
    set_viewport(to, opts) {
        if (Rect.equal(this._viewport, to))
            return;
        const form = this._viewport.pure();
        this._viewport.read(to);
        this._layers.forEach(l => {
            l.width = this._viewport.w;
            l.height = this._viewport.h;
        });
        this.markViewDirty();
        this.read_emit_opts(opts, (operator) => {
            this.emit(EventEnum.ViewportChanged, { operator, form, to: this._viewport.pure() });
        });
    }
    scroll_by(x, y, opts) {
        return this.scroll_to(-this.world.x + x, -this.world.y + y, opts);
    }
    addLayer(layer, opts) {
        if (!layer) {
            layer = this.factory.newLayer();
            this.addLayer(layer);
            return true;
        }
        if (this._layers.has(layer.id)) {
            console.error(`[${Tag$2}] addLayer(): layerId already existed! id = ${layer.id}`);
            return false;
        }
        if (layer instanceof Layer) {
            const l = layer;
            l.width = this.width;
            l.height = this.height;
            l.onscreen.style.pointerEvents = 'none';
            this._element.appendChild(l.onscreen);
            this._layers.set(l.info.id, l);
            this.read_emit_opts(opts, (operator) => {
                this.emit(EventEnum.LayerAdded, { operator, layer: l.info.pure() });
            });
            this.markViewDirty();
        }
        else {
            layer = this.factory.newLayer(layer);
            this.addLayer(layer);
        }
        return true;
    }
    markViewDirty() {
        this.markDirty({
            x: -this.world.x,
            y: -this.world.y,
            w: this.viewport.w,
            h: this.viewport.h
        });
        return this;
    }
    removeLayer(layerId, opts) {
        const layer = this._layers.get(layerId);
        if (!layer) {
            console.error(`[${Tag$2}::editLayer] removeLayer(): layer not found! id = ${layerId}`);
            return false;
        }
        this._layers.delete(layerId);
        this._element.removeChild(layer.onscreen);
        this.read_emit_opts(opts, operator => {
            this.emit(EventEnum.LayerRemoved, { operator, layer: layer.info.pure() });
        });
        return true;
    }
    editLayer(layerId) {
        if (!this._layers.has(layerId)) {
            console.error(`[${Tag$2}::editLayer] editLayer(): layer not found! id = ${layerId}`);
            return false;
        }
        this._layers.forEach((layer, id) => {
            layer.onscreen.style.pointerEvents = id === layerId ? '' : 'none';
        });
        this._editingLayerId = layerId;
        return true;
    }
    layer(id = this._editingLayerId) {
        return this._layers.get(id);
    }
    addLayers(layers) {
        if (!layers.length)
            return;
        layers.forEach(v => this.addLayer(v));
    }
    get layers() { return Array.from(this._layers.values()); }
    get element() { return this._element; }
    constructor(factory, options) {
        var _a, _b;
        this._toolType = void 0;
        this._layers = new Map();
        this._mousebuttons = {};
        this._tools = new Map();
        this._selects = [];
        this._own_element = false;
        this._whoami = 'local';
        this._editingLayerId = '';
        this._viewport = new Rect(0, 0, 600, 600);
        this._world = new Rect(0, 0, 1600, 1600);
        this._world_drag_start_pos = { x: 0, y: 0 };
        /**
         * 是否允许用户拉伸图形
         *
         * @type {boolean}
         */
        this.shapeResizble = true;
        /**
         * 是否允许用户旋转图形
         *
         * @type {boolean}
         */
        this.shapeRotatable = true;
        this.read_emit_opts = (opts, fn) => {
            if (!opts)
                return;
            const operator = typeof opts === 'boolean' ? this.whoami : opts.operator;
            fn(operator);
        };
        this._listeners = new Map();
        /**
         * 鼠标滚动事件
         *
         * @protected
         * @param {WheelEvent} e
         * @memberof Board
         */
        this._wheel = (e) => {
            const sx = e.shiftKey ? e.deltaY : 0;
            const sy = e.shiftKey ? 0 : e.deltaY;
            this.scroll_by(sx, sy, true);
        };
        this._pointerdown = (e) => {
            var _a, _b;
            this._mousebuttons[e.button] = 1;
            if (e.button === 0) {
                if (!this.tool) {
                    console.warn(`[${Tag$2}::_pointerdown] toolType not set`);
                    return;
                }
                if (this.tool) {
                    const dot = this.getDot(e);
                    const d = Object.assign({ operator: this.whoami, tool: this.tool }, dot);
                    this.emit(EventEnum.ToolDown, d);
                    (_b = (_a = this.tool).pointerDown) === null || _b === void 0 ? void 0 : _b.call(_a, dot);
                    e.stopPropagation();
                }
            }
            else if (e.button === 1) {
                this._world_drag_start_pos = {
                    x: -this._world.x + e.x,
                    y: -this._world.y + e.y,
                };
                e.stopPropagation();
            }
            else {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        this._pointermove = (e) => {
            var _a, _b, _c, _d;
            if (this.mb_down) {
                const { x, y } = this._world_drag_start_pos;
                this.scroll_to(x - e.x, y - e.y, true);
            }
            if (this.tool) {
                const dot = this.getDot(e);
                const d = Object.assign({ operator: this.whoami, tool: this.tool }, dot);
                if (this.lb_down) {
                    this.emit(EventEnum.ToolDraw, d);
                    (_b = (_a = this.tool).pointerDraw) === null || _b === void 0 ? void 0 : _b.call(_a, dot);
                }
                else {
                    this.emit(EventEnum.ToolMove, d);
                    (_d = (_c = this.tool).pointerMove) === null || _d === void 0 ? void 0 : _d.call(_c, dot);
                }
                e.stopPropagation();
            }
        };
        this._pointerup = (e) => {
            var _a, _b;
            if (e.button == 0) {
                if (this.tool) {
                    const dot = this.getDot(e);
                    const d = Object.assign({ operator: this.whoami, tool: this.tool }, dot);
                    this.emit(EventEnum.ToolUp, d);
                    (_b = (_a = this.tool) === null || _a === void 0 ? void 0 : _a.pointerUp) === null || _b === void 0 ? void 0 : _b.call(_a, dot);
                }
                e.stopPropagation();
            }
            this._mousebuttons[e.button] = 0;
        };
        this._factory = factory;
        this._shapesMgr = this._factory.newShapesMgr();
        this._element = (_a = options.element) !== null && _a !== void 0 ? _a : document.createElement('div');
        this._own_element = !options.element;
        this.shapeDecoration = factory.newShapeDecoration(this);
        const { width = this._viewport.w, scrollWidth = width, height = this._viewport.h, scrollHeight = height, toolType = this._toolType, } = options;
        this._viewport.w = width;
        this._world.w = scrollWidth;
        this._viewport.h = height;
        this._world.h = scrollHeight;
        this._toolType = toolType;
        const layers = (_b = options.layers) !== null && _b !== void 0 ? _b : [];
        if (!layers.length) {
            layers.push({
                id: factory.newLayerId(),
                name: factory.newLayerName(),
            });
        }
        this.addLayers(layers);
        this.editLayer(layers[0].id);
        this._element.addEventListener('pointerdown', this._pointerdown);
        this._element.addEventListener('wheel', this._wheel);
        this._element.tabIndex = 0;
        this._element.style.outline = 'none';
        window.addEventListener('pointermove', this._pointermove);
        window.addEventListener('pointerup', this._pointerup);
    }
    find(id) {
        return this._shapesMgr.find(id);
    }
    toSnapshot() {
        return {
            v: 0,
            x: 0,
            y: 0,
            w: this.width,
            h: this.height,
            l: Array.from(this._layers.values()).map(v => v.info),
            s: this.shapes().map(v => v.data.wash())
        };
    }
    fromSnapshot(snapshot) {
        this.removeAll(false);
        Array.from(this._layers.keys()).forEach((layerId) => this.removeLayer(layerId));
        if (snapshot.l.length) {
            this.addLayers(snapshot.l);
            this.editLayer(snapshot.l[0].id);
        }
        const shapes = snapshot.s.map((v) => this.factory.newShape(v));
        this.add(shapes, false);
    }
    toJson(replacer, space) {
        return JSON.stringify(this.toSnapshot(), replacer, space);
    }
    fromJson(json) {
        this.fromSnapshot(JSON.parse(json));
    }
    shapes() {
        return this._shapesMgr.shapes();
    }
    exists(items) {
        return this._shapesMgr.exists(items);
    }
    hit(rect, predicate) {
        return this._shapesMgr.hit(rect, predicate);
    }
    hits(rect, predicate) {
        return this._shapesMgr.hits(rect, predicate);
    }
    once(type, listener) {
        const real_listener = (data) => listener(data);
        real_listener.once = true;
        return this.on(type, real_listener);
    }
    on(type, listener) {
        var _a;
        const set = (_a = this._listeners.get(type)) !== null && _a !== void 0 ? _a : new Set();
        this._listeners.set(type, set);
        set.add(listener);
        return () => this.off(type, listener);
    }
    off(type, listener) {
        const set = this._listeners.get(type);
        if (!set)
            return;
        set.delete(listener);
        if (!set.size)
            this._listeners.delete(type);
        return;
    }
    emit(k, detail) {
        const set = this._listeners.get(k);
        if (!set)
            return;
        const onces = [];
        for (const l of set) {
            l(Object.assign({ timeStamp: Date.now(), type: k }, detail));
            if (l.once)
                onces.push(l);
        }
        for (const l of onces)
            set.delete(l);
    }
    get factory() { return this._factory; }
    set factory(v) { this._factory = v; }
    ctx(layerId = this._editingLayerId) {
        var _a;
        return (_a = this.onscreen(layerId)) === null || _a === void 0 ? void 0 : _a.getContext('2d');
    }
    octx(layerId = this._editingLayerId) {
        var _a;
        return (_a = this.offscreen(layerId)) === null || _a === void 0 ? void 0 : _a.getContext('2d');
    }
    onscreen(layerId = this._editingLayerId) {
        var _a;
        return (_a = this.layer(layerId)) === null || _a === void 0 ? void 0 : _a.onscreen;
    }
    offscreen(layerId = this._editingLayerId) {
        var _a;
        return (_a = this.layer(layerId)) === null || _a === void 0 ? void 0 : _a.offscreen;
    }
    get toolType() { return this._toolType; }
    set toolType(v) { this.setToolType(v); }
    setToolType(to) {
        var _a, _b, _c, _d;
        if (this._toolType === to) {
            /*
            Note：
              使用选择器工具，双击文本编辑文本时，会切换至文本工具。
              这种情况下，文本编辑框失去焦点时，切回选择器工具。
              为了避免使用者在这种状态下，主动选择文本工具后，被切回选择器工具。
              这里将相关回调移除。
            */
            if (this._tool instanceof TextTool && this._tool.selectorCallback) {
                this._tool.editor.removeEventListener('blur', this._tool.selectorCallback);
            }
            return;
        }
        const from = this._toolType;
        this._toolType = to;
        this.emit(EventEnum.ToolChanged, {
            operator: this._whoami,
            from, to
        });
        (_b = (_a = this._tool) === null || _a === void 0 ? void 0 : _a.end) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (!to)
            return;
        this._tool = this._factory.newTool(to);
        if (!this._tool) {
            console.error(`[${Tag$2}::setToolType] toolType not supported. got ${to}`);
            return;
        }
        this._tool.board = this;
        this._tools.set(to, this._tool);
        (_d = (_c = this._tool).start) === null || _d === void 0 ? void 0 : _d.call(_c);
    }
    get selects() {
        return this._selects;
    }
    add(shapes, opts) {
        shapes = Array.isArray(shapes) ? shapes : [shapes];
        if (!shapes.length)
            return 0;
        const ret = this._shapesMgr.add(shapes);
        shapes.forEach(item => {
            item.board = this;
            if (item.selected)
                this._selects.push(item);
            this.markDirty(item.aabb());
        });
        this.read_emit_opts(opts, (operator) => {
            this.emit(EventEnum.ShapesAdded, {
                operator,
                shapeDatas: shapes.map(v => v.data.copy())
            });
        });
        return ret;
    }
    remove(shapes, opts) {
        shapes = Array.isArray(shapes) ? shapes : [shapes];
        if (!shapes.length)
            return 0;
        const remains = shapes.filter(a => !this.selects.find(b => a === b));
        this.setSelects(remains, opts);
        this.read_emit_opts(opts, (operator) => {
            this.emit(EventEnum.ShapesRemoved, {
                operator,
                shapeDatas: shapes.map(v => v.data)
            });
        });
        shapes.forEach(item => this.markDirty(item.aabb()));
        const ret = this._shapesMgr.remove(shapes);
        shapes.forEach(item => { item.board = void 0; });
        return ret;
    }
    removeAll(emit) {
        return this.remove(this._shapesMgr.shapes(), emit);
    }
    removeSelected(emit) {
        this.remove(this._selects.filter(v => !v.locked), emit);
        this._selects = [];
    }
    /**
     * 全选图形
     *
     * @param {true} [emit] 是否发射事件
     * @return {Shape[]} 新选中的图形
     * @memberof Board
     */
    selectAll(emit) {
        return this.setSelects([...this.shapes()], emit)[0];
    }
    /**
     * 取消选择
     *
     * @param {true} [emit] 是否发射事件
     * @return {Shape[]} ？？？
     * @memberof Board
     */
    deselect(emit) {
        return this.setSelects([], emit)[1];
    }
    /**
     * 选中指定区域内的图形，指定区域以外的会被取消选择
     *
     * @param {IRect} rect
     * @param {?EmitOpts} opts 事件发射选项
     * @param {?IHitPredicate} predicate 筛选函数
     * @return {[Shape[], Shape[]]} [新选中的图形的数组, 取消选择的图形的数组]
     * @memberof Board
     */
    selectAt(rect, opts, predicate) {
        const hits = this._shapesMgr.hits(rect, predicate);
        return this.setSelects(hits, opts);
    }
    /**
     * 设置被选中的图形，原来被选中的图形数组将被取消选中
     *
     * @param {Shape[]} shapes 被选中的图形
     * @param {(EmitOpts)} [opts]
     * @return {[Shape[], Shape[]]} [被选中的图形数组， 取消选中的图形数组]
     * @memberof Board
     */
    setSelects(shapes, opts) {
        /** 全部新选择的图形 */
        const selected_shapes = new Set(shapes);
        /** 全部新选择的组合ID */
        const selected_group_ids = new Set();
        for (const shape of shapes) {
            if (shape.groupId)
                selected_group_ids.add(shape.groupId);
        }
        /** 确保组合的其他图形也被选择 */
        for (const group_id of selected_group_ids) {
            const shapes = this._shapesMgr.shapes_by_group(group_id);
            for (const shape of shapes)
                selected_shapes.add(shape);
        }
        /** 新的被选择图形 */
        const next_selecteds = [];
        for (const shape of selected_shapes) {
            if (!shape.selected)
                next_selecteds.push(shape);
        }
        const next_desecteds = this._selects.filter(a => !next_selecteds.find(b => a === b));
        next_desecteds.forEach(v => v.selected = false);
        next_selecteds.forEach(v => v.selected = true);
        this._selects = Array.from(selected_shapes);
        this.read_emit_opts(opts, (operator) => {
            next_selecteds.length && this.emit(EventEnum.ShapesSelected, {
                operator,
                shapeDatas: next_selecteds.map(v => v.data)
            });
            next_desecteds.length && this.emit(EventEnum.ShapesDeselected, {
                operator,
                shapeDatas: next_desecteds.map(v => v.data)
            });
        });
        return [next_selecteds, next_desecteds];
    }
    map2world(x, y) {
        const layer = this.layer();
        const ele = layer.onscreen;
        const { width: w, height: h, left, top } = ele.getBoundingClientRect();
        const sw = ele.width / w;
        const sh = ele.height / h;
        return [sw * (x - left) - this._world.x, sh * (y - top) - this._world.y];
    }
    getDot(ev) {
        const { pressure = 0.5 } = ev;
        const [x, y] = this.map2world(ev.x, ev.y);
        return { x, y, p: pressure };
    }
    get tools() { return this._tools; }
    get tool() { return this._tool; }
    /**
     * 标记脏矩形区域，将触发重绘
     * 若在重绘前，连续调用，将会将多个矩形合并一个大的矩形，并仅会触发一次重绘。
     *
     * 脏矩形必须是整数，否则将导致画面有“脏东西”，所以传入浮点的矩形将被取整后再运算
     *
     * @param {Readonly<IRect>} rect 新的脏矩形区域
     * @memberof Board
     */
    markDirty(rect) {
        const requested = !this._dirty;
        const x = floor$1(rect.x);
        const y = floor$1(rect.y);
        const rr = { x, y, w: ceil(x + rect.w) - x, h: ceil(y + rect.h) - y };
        this._dirty = this._dirty ? Rect.bounds(this._dirty, rr) : rr;
        requested && requestAnimationFrame(() => this.render());
    }
    /**
     * 绘制
     *
     * @memberof Board
     */
    render() {
        var _a, _b;
        const dirty = this._dirty;
        if (!dirty)
            return;
        this._layers.forEach(layer => {
            const { octx } = layer;
            octx.save();
            octx.translate(this._viewport.x + this._world.x, this._viewport.y + this._world.y);
            octx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h);
        });
        this._shapesMgr.shapes().forEach(v => {
            const br = v.aabb();
            if (!Rect.hit(br, dirty))
                return;
            const layer = this._layers.get(v.data.layer || '');
            if (!layer)
                return;
            v.render(layer.octx);
        });
        (_b = (_a = this.tool) === null || _a === void 0 ? void 0 : _a.render) === null || _b === void 0 ? void 0 : _b.call(_a, this.layer().octx);
        this._layers.forEach(layer => {
            const { ctx, octx, offscreen } = layer;
            ctx.save();
            const tx = this._viewport.x + this._world.x;
            const ty = this._viewport.y + this._world.y;
            ctx.translate(tx, ty);
            ctx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h);
            ctx.drawImage(offscreen, dirty.x + tx, dirty.y + ty, dirty.w, dirty.h, dirty.x, dirty.y, dirty.w, dirty.h);
            ctx.restore();
            octx.restore();
        });
        delete this._dirty;
    }
    destroy() {
        this._element.removeEventListener('pointerdown', this._pointerdown);
        this._element.removeEventListener('wheel', this._wheel);
        window.removeEventListener('pointermove', this._pointermove);
        window.removeEventListener('pointerup', this._pointerup);
        this._layers.forEach(v => v.destroy());
        if (this._own_element)
            this._element.remove();
    }
    /**
     * @deprecated 拼写错误，请使用 destroy()
     * @deprecated misspelled, use destroy() instead
     */
    destory() { this.destroy(); }
    group(shapes, groupId = this.factory.newGroupId(shapes), opts) {
        const changed_shapes = [];
        const shapeDatas = [];
        for (const shape of shapes) {
            if (shape.locked)
                continue;
            const prev = { g: shape.groupId };
            shape.groupId = groupId;
            shapeDatas.push([shape.data.copy(), prev]);
            changed_shapes.push(shape);
        }
        this.update_items_group(changed_shapes);
        this.read_emit_opts(opts, (operator) => {
            if (shapeDatas.length)
                this.emit(EventEnum.ShapesChanged, { operator, shapeDatas });
        });
        return this;
    }
    ungroup(shapes, opts) {
        return this.group(shapes, '', opts);
    }
    raise(shapes, opts) {
        var _a, _b;
        if (!shapes.length)
            return this;
        let zz = (_b = (_a = this._shapesMgr.maxZ()) === null || _a === void 0 ? void 0 : _a.z) !== null && _b !== void 0 ? _b : 0;
        this._shapesMgr.remove(shapes);
        shapes.sort((a, b) => a.z - b.z);
        if (opts) {
            const shapeDatas = [];
            for (let i = 0; i < shapes.length; ++i) {
                const shape = shapes[i];
                if (shape.locked)
                    continue;
                const prev = { z: shape.data.z };
                shape.data.z = ++zz;
                shape.markDirty();
                shapeDatas.push([shape.data.copy(), prev]);
            }
            if (shapeDatas.length)
                this.read_emit_opts(opts, (operator) => {
                    this.emit(EventEnum.ShapesChanged, { operator, shapeDatas });
                });
        }
        else {
            for (let i = 0; i < shapes.length; ++i) {
                const shape = shapes[i];
                if (shape.locked)
                    continue;
                shape.data.z = ++zz;
                shape.markDirty();
            }
        }
        this._shapesMgr.add(shapes);
        return this;
    }
    sink(shapes, opts) {
        var _a, _b;
        if (!shapes.length)
            return this;
        let zz = (_b = (_a = this._shapesMgr.minZ()) === null || _a === void 0 ? void 0 : _a.z) !== null && _b !== void 0 ? _b : 0;
        this._shapesMgr.remove(shapes);
        shapes.sort((a, b) => a.z - b.z);
        if (opts) {
            const shapeDatas = [];
            for (let i = shapes.length - 1; i >= 0; --i) {
                const shape = shapes[i];
                if (shape.locked)
                    continue;
                const prev = { z: shape.data.z };
                shape.data.z = --zz;
                shape.markDirty();
                shapeDatas.push([shape.data.copy(), prev]);
            }
            if (shapeDatas.length)
                this.read_emit_opts(opts, (operator) => {
                    this.emit(EventEnum.ShapesChanged, { operator, shapeDatas });
                });
        }
        else {
            for (let i = shapes.length - 1; i >= 0; --i) {
                const shape = shapes[i];
                if (shape.locked)
                    continue;
                shape.data.z = --zz;
                shape.markDirty();
            }
        }
        this._shapesMgr.add(shapes);
        return this;
    }
    update_items_group(shapes) {
        this._shapesMgr.update_items_group(shapes);
        return this;
    }
}

const warn = (func) => console.warn('[InvalidTool]', func);
class InvalidTool {
    start() { warn('start'); }
    end() { warn('end'); }
    get type() { return ''; }
    get board() { warn('get board'); return; }
    set board(_) { warn('set board'); }
    pointerMove() { warn('pointerMove'); }
    pointerDown() { warn('pointerDown'); }
    pointerDraw() { warn('pointerDraw'); }
    pointerUp() { warn('pointerUp'); }
    render() { warn('render'); }
}

function throttle(interval, cb) {
    let _waiting = false;
    let _result = void 0;
    let ret = function (...args) {
        if (_waiting)
            return _result;
        _waiting = true;
        _result = cb(...args);
        setTimeout(() => _waiting = false, interval);
        return _result;
    };
    return Object.assign(ret, { enforce: cb });
}

const { min: min$1, max: max$1 } = Math;
class ShapeGroup extends ShapeRect {
    constructor() {
        super(new ShapeData);
        this._members = [];
        this._geo = new Rect(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
        this.data.selected = true;
        this.data.visible = false;
        this.data.strokeStyle = '';
        this.data.fillStyle = '';
        this.data.lineWidth = 0;
        this.resizable = Resizable.None;
    }
    hit(dot) {
        if (!this.visible)
            return null;
        const d = this.map2me(dot.x, dot.y).plus(this.data);
        if (!this.getGeo().hit(d))
            return null;
        return this.resizableDirection(dot.x, dot.y);
    }
    reset() {
        this._members = [];
        this.visible = false;
        this._geo.x = Number.MAX_SAFE_INTEGER;
        this._geo.y = Number.MAX_SAFE_INTEGER;
        this._geo.w = Number.MIN_SAFE_INTEGER;
        this._geo.h = Number.MIN_SAFE_INTEGER;
        this.rotateTo(0);
    }
    setMembers(shapes) {
        this.reset();
        const rotation = this.data.rotation;
        this._members.length = 0;
        const geo = this._geo;
        for (const s of shapes) {
            if (s.locked)
                continue;
            this._members.push({ shape: s, rotation: s.rotation - rotation });
            const { x, y, w, h } = s.aabb();
            geo.left = min$1(geo.left, x);
            geo.right = max$1(geo.right, x + w);
            geo.top = min$1(geo.top, y);
            geo.bottom = max$1(geo.bottom, y + h);
        }
        if (!this._members.length) {
            geo.left;
        }
        this.setGeo(geo);
        this.visible = !!this._members.length;
    }
    rotateTo(r, x, y) {
        super.rotateTo(r, x, y);
        for (const { shape, rotation } of this._members) {
            shape.rotateTo(r + rotation, x !== null && x !== void 0 ? x : this.midX, y !== null && y !== void 0 ? y : this.midY);
        }
    }
}

class ShapeRotator extends Shape {
    get target() { return this._target; }
    get _distance() { var _a; return ((_a = this.board) === null || _a === void 0 ? void 0 : _a.factory.rotator.distance) || 30; }
    get _width() { var _a; return ((_a = this.board) === null || _a === void 0 ? void 0 : _a.factory.rotator.size) || 10; }
    constructor() {
        super({}, ShapeData);
        this._ctrl = new Rect(0, 0, 0, 0);
        this._oY = 0;
        this._oX = 0;
        this._update = (shape) => {
            var _a, _b;
            this.beginDirty();
            const { x: mx, y: my } = shape.rotatedMid;
            const w = this._width;
            const d = this._distance;
            const v = shape.visible && shape.selected && !shape.locked && !!shape.board;
            if (v) {
                this.data.w = w;
                this.data.h = shape.h + d * 2;
                const offset = Vector.rotated2(0, shape.lineWidth / 2, 0, 0, shape.rotation);
                this.data.x = mx - this.halfW - offset.x;
                this.data.y = my - this.halfH - offset.y;
                this.data.rotation = shape.rotation;
                const s = ((_a = this.board) === null || _a === void 0 ? void 0 : _a.factory.rotator.size) || 10;
                this._ctrl.w = s;
                this._ctrl.h = s;
            }
            this.data.visible = v && !!((_b = this.board) === null || _b === void 0 ? void 0 : _b.shapeRotatable);
            this.endDirty();
        };
        this._listener1 = (e) => this._update(e.detail.shape);
        this._listener2 = (e) => this._update(e.detail.shape);
        this.data.ghost = true;
        this.data.visible = false;
        this.data.lineWidth = 10;
    }
    follow(shape) {
        this.unfollow();
        shape.addEventListener(ShapeEventEnum.EndDirty, this._listener1);
        shape.addEventListener(ShapeEventEnum.BoardChanged, this._listener2);
        this._update(shape);
        this._target = shape;
    }
    unfollow() {
        var _a, _b;
        (_a = this._target) === null || _a === void 0 ? void 0 : _a.removeEventListener(ShapeEventEnum.EndDirty, this._listener1);
        (_b = this._target) === null || _b === void 0 ? void 0 : _b.removeEventListener(ShapeEventEnum.BoardChanged, this._listener2);
        delete this._target;
    }
    render(ctx) {
        if (!this.visible)
            return;
        this.beginDraw(ctx);
        const { x, y, w, h } = this._ctrl;
        const mx = Math.floor(x + w / 2) - 0.5;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + w / 2, w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx, y + h);
        ctx.lineTo(mx, this._distance);
        ctx.stroke();
        this.endDraw(ctx);
    }
    pointerDown(dot) {
        const ret = this.visible && !!this._target && this.hit(dot);
        if (ret) {
            this._oX = this._target.midX;
            this._oY = this._target.midY;
        }
        return ret;
    }
    pointerDraw(dot) {
        var _a;
        const dx = this._oX - dot.x;
        const dy = this._oY - dot.y;
        if (Numbers.equals(dx + dy, 0))
            return;
        (_a = this._target) === null || _a === void 0 ? void 0 : _a.rotateTo(Math.atan2(dy, dx) - Math.PI / 2);
    }
    hit(dot) {
        return this._ctrl.hit(this.map2me(dot.x, dot.y));
    }
}

class ShapeSelector extends ShapeRect {
    constructor() {
        super(new ShapeData);
        this.data.lineWidth = 2;
        this.data.strokeStyle = '#003388FF';
        this.data.fillStyle = '#00338855';
        this.data.ghost = true;
    }
}

var SelectorStatus;
(function (SelectorStatus) {
    SelectorStatus[SelectorStatus["Idle"] = 0] = "Idle";
    SelectorStatus[SelectorStatus["ReadyForDragging"] = 1] = "ReadyForDragging";
    SelectorStatus[SelectorStatus["Dragging"] = 2] = "Dragging";
    SelectorStatus[SelectorStatus["ReadyForSelecting"] = 3] = "ReadyForSelecting";
    SelectorStatus[SelectorStatus["Selecting"] = 4] = "Selecting";
    SelectorStatus[SelectorStatus["ReadyForResizing"] = 5] = "ReadyForResizing";
    SelectorStatus[SelectorStatus["Resizing"] = 6] = "Resizing";
    SelectorStatus[SelectorStatus["ReadyForRotating"] = 7] = "ReadyForRotating";
    SelectorStatus[SelectorStatus["Rotating"] = 8] = "Rotating";
})(SelectorStatus || (SelectorStatus = {}));
const { min, max, atan2, floor } = Math;
class ResizeInfo {
    constructor() {
        this.direction = Resizable.None;
        this.anchor = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };
        this.shape = null;
    }
    reset() {
        this.direction = Resizable.None;
        this.offset.x = this.offset.y = this.anchor.x = this.anchor.y = 0;
        this.shape = null;
    }
}
class SelectorTool {
    constructor() {
        this._doubleClickTimer = 0;
        this._picking = new ShapeGroup();
        this._selector = new ShapeSelector();
        this._rectHelper = new RectHelper();
        this._status = SelectorStatus.Idle;
        this._prevPos = { x: 0, y: 0 };
        this._resizer = new ResizeInfo();
        this._rotator = new ShapeRotator();
        this._windowPointerDown = () => this.deselect();
        this._shapes = [];
        this.onSelectChanged = () => {
            this._picking.reset();
            const { selects } = this.board;
            if (selects.length > 1) {
                this._picking.setMembers(selects);
                this._rotator.follow(this._picking);
            }
            else if (selects.length == 1) {
                this._rotator.follow(selects[0]);
            }
            else {
                this._picking.reset();
            }
        };
        this._pen_in_click = (shape, rect) => {
            // 当点击位置未命中
            if (!ShapePen.is(shape))
                return false;
            return this._pen_in_rect(shape, rect);
        };
        this._pen_in_rect = (shape, rect) => {
            if (!ShapePen.is(shape))
                return true;
            const lw = shape.lineWidth;
            const rect_r = (rect.r ? RotatedRect : Rect).ensure({
                x: rect.x - lw / 2,
                y: rect.y - lw / 2,
                w: rect.w + lw,
                h: rect.h + lw,
                r: rect.r
            });
            const { dots } = rect_r;
            const { coords } = shape.data;
            for (let i = 2; i < coords.length; i += 2) {
                const a = coords[i - 2];
                const b = coords[i - 1];
                const c = coords[i + 0];
                const d = coords[i + 1];
                if ((i === 2 && Polygon.contain_dot2(dots, a, b)) ||
                    Polygon.contain_dot2(dots, c, d) ||
                    Polygon.intersect_linesegment(dots, a, b, c, d)) {
                    return true;
                }
            }
            console.log('' + rect_r, '' + new Vector(coords[0], coords[1]));
            return false;
        };
        this.emitGeoEvent = throttle(1000 / 30, (isLast) => {
            const { board, _shapes } = this;
            if (!board || !_shapes.length)
                return;
            if (isLast) {
                board.emit(EventEnum.ShapesGeoChanged, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: this._shapes.map(v => [
                        Events.pickShapeGeoData(v.shape.data), v.startData
                    ])
                });
            }
            else {
                board.emit(EventEnum.ShapesGeoChanging, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: this._shapes.map(v => [
                        Events.pickShapeGeoData(v.shape.data), v.prevData
                    ])
                });
            }
        });
    }
    get type() { return ToolEnum.Selector; }
    get picking() { return this._picking; }
    get resizer() { return this._resizer; }
    get board() { return this._selector.board; }
    set board(v) {
        this._selector.board = v;
        this._rotator.board = v;
        this._picking.board = v;
        v.on(EventEnum.ShapesSelected, this.onSelectChanged);
        v.on(EventEnum.ShapesDeselected, this.onSelectChanged);
    }
    get rect() { return this._rectHelper; }
    set cursor(v) {
        this.board.element.style.cursor = v;
    }
    render(ctx) {
        this._selector.render(ctx);
        this._rotator.render(ctx);
        this._picking.render(ctx);
    }
    start() {
        this.board.element.style.cursor = '';
        document.addEventListener('pointerdown', this._windowPointerDown);
    }
    end() {
        this.board.element.style.cursor = '';
        document.removeEventListener('pointerdown', this._windowPointerDown);
        this.deselect();
        this._rotator.unfollow();
    }
    deselect() {
        const { board } = this;
        if (!board) {
            return;
        }
        board.deselect(true);
    }
    connect(shapes, startX, startY) {
        let x = startX;
        let y = startY;
        this._shapes = shapes.map(v => {
            const data = {
                i: v.data.i,
                x: v.data.x,
                y: v.data.y,
                w: v.data.w,
                h: v.data.h,
                r: v.data.r,
            };
            if (startX === void 0) {
                x = x === void 0 ? v.data.x : min(x, v.data.x);
                y = y === void 0 ? v.data.y : min(y, v.data.y);
            }
            return {
                shape: v,
                prevData: data,
                startData: data,
            };
        });
        this._prevPos = { x: x, y: y };
        return this;
    }
    move(curX, curY) {
        return this.moveBy(curX - this._prevPos.x, curY - this._prevPos.y);
    }
    moveBy(diffX, diffY) {
        this._prevPos.x += diffX;
        this._prevPos.y += diffY;
        for (let i = 0, len = this._shapes.length; i < len; ++i) {
            const v = this._shapes[i];
            const { rotatedTopLeft: a, rotatedTopRight: b, rotatedBottomLeft: c, rotatedBottomRight: d, locked, } = v.shape;
            if (locked)
                continue;
            v.prevData = Events.pickShapePosData(v.shape.data);
            v.shape.moveBy(diffX, diffY);
        }
        this._picking.moveBy(diffX, diffY);
        return this;
    }
    pointerDown(dot) {
        const { board, _status } = this;
        if (_status !== SelectorStatus.Idle)
            return;
        const { x, y } = dot;
        if (this._rotator.pointerDown(dot)) {
            this._status = SelectorStatus.ReadyForRotating;
            this.connect([this._rotator.target], x, y);
            return;
        }
        if (this._picking.hit(dot)) {
            this._status = SelectorStatus.ReadyForDragging;
            this.connect(board.selects, x, y);
            return;
        }
        this._rectHelper.start(x, y);
        this.updateGeo();
        /* 点击位置的全部图形 */
        let shapes = board.hits({ x, y, w: 0, h: 0 });
        if (!shapes.length)
            shapes = board.hits({ x: x - 15, y: y - 15, w: 30, h: 30 }, this._pen_in_click);
        const shape = Arrays.firstOf(shapes, it => (it.selected && !it.locked) ? it : null) || shapes[0];
        if (!shape || shape.locked) {
            // 点击的位置无任何未锁定图形，则框选图形, 并取消选择以选择的图形
            this._status = SelectorStatus.ReadyForSelecting;
            this._selector.visible = true;
            this.deselect();
        }
        else if (!shape.selected) {
            // 点击位置存在图形，且图形未被选择，则选择点中的图形。
            this._status = SelectorStatus.ReadyForDragging;
            this._rotator.follow(shape);
            board.setSelects([shape], true);
        }
        else {
            // 点击位置存在图形，且图形已被选择，则判断是否点击尺寸调整。
            const dot = shape.map2me(x, y).plus(shape.data);
            const [direction, resizerRect] = shape.resizableDirection(x, y);
            if (direction) {
                this._resizer.direction = direction;
                this._resizer.shape = shape;
                this._resizer.anchor = shape.getRotatedDot(opposites[direction]);
                switch (direction) {
                    case Resizable.Top:
                        this._resizer.offset.x = 0;
                        this._resizer.offset.y = resizerRect.top - dot.y;
                        break;
                    case Resizable.Bottom:
                        this._resizer.offset.x = 0;
                        this._resizer.offset.y = resizerRect.bottom - dot.y;
                        break;
                    case Resizable.Left:
                        this._resizer.offset.x = resizerRect.left - dot.x;
                        this._resizer.offset.y = 0;
                        break;
                    case Resizable.Right:
                        this._resizer.offset.x = resizerRect.right - dot.x;
                        this._resizer.offset.y = 0;
                        break;
                    case Resizable.TopLeft:
                        this._resizer.offset.x = resizerRect.left - dot.x;
                        this._resizer.offset.y = resizerRect.top - dot.y;
                        break;
                    case Resizable.TopRight:
                        this._resizer.offset.x = resizerRect.right - dot.x;
                        this._resizer.offset.y = resizerRect.top - dot.y;
                        break;
                    case Resizable.BottomLeft:
                        this._resizer.offset.x = resizerRect.left - dot.x;
                        this._resizer.offset.y = resizerRect.bottom - dot.y;
                        break;
                    case Resizable.BottomRight:
                        this._resizer.offset.x = resizerRect.right - dot.x;
                        this._resizer.offset.y = resizerRect.bottom - dot.y;
                        break;
                }
                this._status = SelectorStatus.ReadyForResizing;
                board.setSelects([shape], true);
            }
            else {
                this._status = SelectorStatus.ReadyForDragging;
            }
        }
        this.connect(board.selects, x, y);
    }
    pointerMove(dot) {
        if (this._rotator.hit(dot)) {
            this.cursor = 'crosshair';
            return;
        }
        const temp = this._picking.hit(dot);
        if (temp) {
            this.cursor = this.getReiszerCursor(temp[0], this._picking);
            return;
        }
        const result = Arrays.firstOf(this.board.selects, it => {
            const { x, y } = it.map2me(dot.x, dot.y).plus(it.data);
            if (it.locked)
                return null;
            const hit = it.getGeo().hit({ x, y });
            if (!hit)
                return null;
            const [direction] = it.resizableDirection(dot.x, dot.y);
            return [direction, it];
        });
        this.cursor = result ? this.getReiszerCursor(...result) : '';
    }
    getReiszerCursor(direction, shape) {
        if (!direction || !this.board.shapeResizble)
            return 'move';
        const a = shape.getRotatedDot(direction);
        a.x -= shape.midX;
        a.y -= shape.midY;
        const d = atan2(a.x, -a.y);
        const which = floor(Degrees.normalized(0.39269908169872414 + d) / 0.7853981633974483) % 8;
        switch (which) {
            case 0: return 'ns-resize';
            case 4: return 'ns-resize';
            case 2: return 'ew-resize';
            case 6: return 'ew-resize';
            case 3: return 'se-resize';
            case 7: return 'nw-resize';
            case 1: return 'ne-resize';
            case 5: return 'sw-resize';
        }
        return '';
    }
    pointerDraw(dot) {
        const board = this.board;
        if (!board)
            return;
        switch (this._status) {
            case SelectorStatus.ReadyForRotating: // let it fall-through
                this._status = SelectorStatus.Rotating;
            case SelectorStatus.Rotating:
                this._rotator.pointerDraw(dot);
                this.emitGeoEvent(false);
                break;
            case SelectorStatus.ReadyForSelecting: // let it fall-through
                if (Vector.manhattan(this._prevPos, dot) < 5) {
                    return;
                }
                this._status = SelectorStatus.Selecting;
            case SelectorStatus.Selecting: {
                this._rectHelper.end(dot.x, dot.y);
                this.updateGeo();
                board.selectAt(this._selector.data, true, this._pen_in_rect);
                return;
            }
            case SelectorStatus.ReadyForDragging: // let it fall-through
                if (Vector.manhattan(this._prevPos, dot) < 5) {
                    return;
                }
                this._status = SelectorStatus.Dragging;
            case SelectorStatus.Dragging: {
                this.move(dot.x, dot.y).emitGeoEvent(false);
                return;
            }
            case SelectorStatus.ReadyForResizing: // let it fall-through
                if (Vector.manhattan(this._prevPos, dot) < 5) {
                    return;
                }
                this._status = SelectorStatus.Resizing;
            case SelectorStatus.Resizing: {
                const { shape, offset, anchor, direction } = this._resizer;
                if (!shape)
                    return;
                const geo = shape.getGeo();
                const minsize = board.factory.resizer.size * 3;
                const { x, y } = shape.map2me(dot.x, dot.y).plus(shape).plus(offset);
                const { left: l, right: r, bottom: b, top: t } = geo;
                this.cursor = this.getReiszerCursor(direction, shape);
                switch (direction) {
                    case Resizable.Top:
                        geo.top = min(y, b - minsize);
                        break;
                    case Resizable.Bottom:
                        geo.bottom = max(y, t + minsize);
                        break;
                    case Resizable.Left:
                        geo.left = min(x, r - minsize);
                        break;
                    case Resizable.Right:
                        geo.right = max(x, l + minsize);
                        break;
                    case Resizable.TopLeft:
                        geo.top = min(y, b - minsize);
                        geo.left = min(x, r - minsize);
                        break;
                    case Resizable.TopRight:
                        geo.top = min(y, b - minsize);
                        geo.right = max(x, l + minsize);
                        break;
                    case Resizable.BottomLeft:
                        geo.bottom = max(y, t + minsize);
                        geo.left = min(x, r - minsize);
                        break;
                    case Resizable.BottomRight:
                        geo.bottom = max(y, t + minsize);
                        geo.right = max(x, l + minsize);
                        break;
                }
                shape.beginDirty(Rect.pure2(shape));
                shape.geo(geo.x, geo.y, geo.w, geo.h, false);
                const o = Vector.minus(anchor, shape.getRotatedDot(opposites[direction]));
                shape.moveBy(o.x, o.y, false);
                shape.endDirty(Rect.pure2(shape));
                this.emitGeoEvent(false);
                return;
            }
        }
    }
    pointerUp() {
        var _a;
        switch (this._status) {
            case SelectorStatus.ReadyForDragging: {
                // 双击判定
                if (!this._doubleClickTimer) {
                    this._doubleClickTimer = setTimeout(() => this._doubleClickTimer = 0, 500);
                }
                else {
                    clearTimeout(this._doubleClickTimer);
                    this._doubleClickTimer = 0;
                    this.doubleClick();
                }
                break;
            }
            case SelectorStatus.Resizing:
                (_a = this.resizer.shape) === null || _a === void 0 ? void 0 : _a.markDirty();
            // let it fall-throught
            case SelectorStatus.Rotating:
            case SelectorStatus.Dragging: {
                this.emitGeoEvent.enforce(true);
                break;
            }
        }
        this._selector.visible = false;
        this._rectHelper.clear();
        this._resizer.reset();
        this._status = SelectorStatus.Idle;
    }
    doubleClick() {
        const { board } = this;
        if (!board) {
            return;
        }
        // 双击某个文本时，切换到文本编辑工具，编辑此文本，当文本编辑框失去焦点时，回到选择器工具；
        if (this._shapes.length && this._shapes[0].shape instanceof ShapeText) {
            board.setToolType(ToolEnum.Text);
            const textTool = board.tool;
            textTool.selectorCallback = () => {
                board.setToolType(ToolEnum.Selector);
                textTool.end();
            };
            textTool.editor.addEventListener('blur', textTool.selectorCallback, { once: true });
            textTool.connect(this._shapes[0].shape);
        }
    }
    updateGeo() {
        const { x, y, w, h } = this._rectHelper.gen();
        this._selector.geo(x, y, w, h);
    }
}
Gaia.registerTool(ToolEnum.Selector, () => new SelectorTool, {
    name: 'Selector',
    desc: 'pick shapes'
});

class Indicator extends ShapeRect {
    constructor() {
        super(new ShapeData);
        this.data.lineWidth = 1;
        this.data.strokeStyle = '#00000055';
        this.data.fillStyle = '#FFFFFF55';
        this.data.ghost = true;
        this.data.w = 100;
        this.data.h = 100;
    }
    press() {
        this.data.strokeStyle = '#000000FF';
        this.data.fillStyle = '#FFFFFFFF';
        this.markDirty();
    }
    release() {
        this.data.strokeStyle = '#00000055';
        this.data.fillStyle = '#FFFFFF55';
        this.markDirty();
    }
}

class EraserTool {
    constructor() {
        this.type = ToolEnum.Eraser;
        this.indicator = new Indicator();
        this._breakings = [];
        this._predicate_and_calc = (shape) => {
            if (shape.type !== ShapeEnum.Pen)
                return false;
            const pen = shape;
            const coords = pen.data.coords2world;
            const coords_arr = [];
            let hit_1 = false;
            for (let i = 2; i < coords.length; i += 2) {
                const a = { x: coords[i - 2], y: coords[i - 1] };
                const b = { x: coords[i + 0], y: coords[i + 1] };
                if (i == 2)
                    hit_1 = Rect.hit(this.indicator.data, a);
                const hit_2 = Rect.hit(this.indicator.data, b);
                /* 线段的两个端点都在矩形内，该线段被擦除 */
                if (hit_1 && hit_2)
                    continue;
                const intersections = Rect.line_segment_intersection(this.indicator.data, { x0: a.x, y0: a.y, x1: b.x, y1: b.y });
                /* 线段的端点，一个在内，一个在外，线段与矩形交点应只有1个 */
                if (hit_1 != hit_2 && intersections.length != 1)
                    debugger;
                /* 线段的端点，都在矩形外，线段与矩形交点应只有2个或0个 */
                if (!hit_1 && !hit_2 && intersections.length != 0 && intersections.length != 2)
                    debugger;
                const append_prev_lines = (v) => {
                    if (coords_arr.length)
                        coords_arr[coords_arr.length - 1].push(v);
                    else
                        coords_arr.push([a, v]);
                };
                const create_next_lines = (v) => coords_arr.push([v, b]);
                if (!hit_1 && hit_2) {
                    /* 线段起点在矩形外，线段终点在矩形内 */
                    append_prev_lines(intersections[0]);
                }
                else if (hit_1 && !hit_2) {
                    /* 线段起点在矩形内，线段终点在矩形外 */
                    create_next_lines(intersections[0]);
                }
                else if (intersections.length === 2) {
                    /* 原线段穿过矩形 */
                    append_prev_lines(intersections[0]);
                    create_next_lines(intersections[1]);
                }
                else if (!intersections.length) {
                    append_prev_lines(b);
                }
                hit_1 = hit_2;
            }
            if (coords_arr.length === 1 && coords_arr[0].length === pen.data.coords.length)
                return false;
            this._breakings.push([pen, coords_arr]);
            return true;
        };
    }
    get board() { return this.indicator.board; }
    set board(v) { this.indicator.board = v; }
    start() { console.log('[EraserTool::start]'); }
    end() {
        this.indicator.markDirty();
    }
    update_geo(dot) {
        this.indicator.move(dot.x - this.indicator.w / 2, dot.y - this.indicator.h / 2);
    }
    pointerDown(dot) {
        this.indicator.press();
        this.pointerDraw(dot);
    }
    pointerUp(dot) {
        this.indicator.release();
    }
    pointerDraw(dot) {
        this.update_geo(dot);
        this._breakings.length = 0;
        this.board.hits(this.indicator.data, this._predicate_and_calc);
        const add_pens = [];
        const del_pens = [];
        for (const [pen, dots_arr] of this._breakings) {
            for (let dots of dots_arr) {
                const new_data = pen.data.copy();
                new_data.id = this.board.factory.newShapeId(new_data);
                new_data.rotation = 0;
                new_data.x = 0;
                new_data.y = 0;
                new_data.w = 0;
                new_data.h = 0;
                const new_pen = this.board.factory.newShape(new_data);
                new_pen.applyDots(dots);
                add_pens.push(new_pen);
            }
            del_pens.push(pen);
        }
        this.board.remove(del_pens, true);
        this.board.add(add_pens, true);
    }
    pointerMove(dot) {
        this.update_geo(dot);
    }
    render(ctx) {
        this.indicator.render(ctx);
    }
}
Gaia.registerTool(ToolEnum.Eraser, () => new EraserTool, {
    name: 'Eraser',
    desc: 'erase pen shape'
});

class DefaultShapeDecoration {
    constructor(board) {
        this.lock_icon_w = 25;
        this.lock_icon_h = 25;
        this.lock_path_2d = null;
        this.board = board;
    }
    dash_stroke(ctx, segments) {
        ctx.strokeStyle = 'white';
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.strokeStyle = 'black';
        ctx.setLineDash(segments);
        ctx.stroke();
    }
    /**
     * 检查一个图形是否是被选择的图形之一
     *
     * @note 有些工具自身需要利用图形来渲染自身，这些图形不会再board?.selects中。
     * @param {Shape} shape 图形
     * @returns {boolean} 若是返回true，否则返回false
     */
    is_mutiply_selected(shape) {
        var _a;
        const selects = (_a = this.board) === null || _a === void 0 ? void 0 : _a.selects;
        if (!selects)
            return false;
        return selects.some(v => v === shape) && selects.length > 1;
    }
    draw_lock(ctx) {
        if (!this.lock_path_2d) {
            const path = this.lock_path_2d = new Path2D();
            const w = 15;
            const h = 12;
            const t = w * 0.65;
            const l = (this.lock_icon_w - w) / 2;
            const r = l + w;
            const mx = l + w / 2;
            const my = t + h / 2;
            path.roundRect(0, 0, this.lock_icon_w, this.lock_icon_h, 2);
            path.roundRect(l, t, w, h, 2);
            path.moveTo(l + w / 6, t);
            path.arc(mx, t - 2, w / 3, Math.PI, 0);
            path.lineTo(r - w / 6, t);
            path.moveTo(mx, my - h * 0.3);
            path.lineTo(mx, my + h * 0.2);
            path.arc(mx, my + h * 0.2, 1, 0, Math.PI * 2);
        }
        ctx.fillStyle = '#FFFFFF88';
        ctx.strokeStyle = '#00000088';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.fill(this.lock_path_2d);
        ctx.stroke(this.lock_path_2d);
    }
    locked(shape, ctx) {
        /* 选择多个图形时，图形本身的矩形示意框不展示 */
        // if (this.is_mutiply_selected(shape)) return;
        const lineWidth = 2;
        ctx.lineWidth = lineWidth;
        let { x, y, w, h } = shape.selectorRect();
        ctx.beginPath();
        ctx.rect(x + 1, y + 1, w - 1, h - 1);
        ctx.closePath();
        this.dash_stroke(ctx, [lineWidth * 8]);
        ctx.translate(w - this.lock_icon_w - 5, 5);
        this.draw_lock(ctx);
    }
    selected(shape, ctx) {
        if (shape.groupId) {
            const lineWidth = 1;
            ctx.lineWidth = lineWidth;
            const { x, y, w, h } = shape.selectorRect();
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.closePath();
            ctx.stroke();
            return;
        }
        /* 选择多个图形时，图形本身的矩形示意框不展示 */
        if (this.is_mutiply_selected(shape))
            return;
        const lineWidth = 1;
        ctx.lineWidth = lineWidth;
        const { x, y, w, h } = shape.selectorRect();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        this.dash_stroke(ctx, [lineWidth * 4]);
    }
    resizable(shape, ctx) {
        var _a;
        if (!((_a = this.board) === null || _a === void 0 ? void 0 : _a.shapeResizble) || !shape.resizable)
            return false;
        /* 选择多个图形时，图形本身的resize示意框不展示 */
        if (this.is_mutiply_selected(shape))
            return;
        const { tool } = this.board;
        const anchor = opposites[tool instanceof SelectorTool && tool.resizer.shape === shape ? tool.resizer.direction : Resizable.None];
        let { x, y, w, h } = shape.selectorRect();
        ctx.fillStyle = 'white';
        ctx.setLineDash([]);
        const { s, lx, rx, ty, by, mx, my, } = shape.getResizerNumbers(x, y, w, h);
        const { resizable } = shape;
        let rects = [];
        if (resizable & Resizable.Top) {
            rects.push([[mx, ty, s, s], anchor == Resizable.Top]);
        }
        if (resizable & Resizable.Bottom) {
            rects.push([[mx, by, s, s], anchor == Resizable.Bottom]);
        }
        if (resizable & Resizable.Left) {
            rects.push([[lx, my, s, s], anchor == Resizable.Left]);
        }
        if (resizable & Resizable.Right) {
            rects.push([[rx, my, s, s], anchor == Resizable.Right]);
        }
        if (resizable & Resizable.TopLeft) {
            rects.push([[lx, ty, s, s], anchor == Resizable.TopLeft]);
        }
        if (resizable & Resizable.TopRight) {
            rects.push([[rx, ty, s, s], anchor == Resizable.TopRight]);
        }
        if (resizable & Resizable.BottomLeft) {
            rects.push([[lx, by, s, s], anchor == Resizable.BottomLeft]);
        }
        if (resizable & Resizable.BottomRight) {
            rects.push([[rx, by, s, s], anchor == Resizable.BottomRight]);
        }
        for (const [nums, is_anchor] of rects) {
            ctx.beginPath();
            if (is_anchor) {
                ctx.moveTo(nums[0], nums[1]);
                ctx.lineTo(nums[0] + nums[2], nums[1] + nums[3]);
                ctx.moveTo(nums[0] + nums[2], nums[1]);
                ctx.lineTo(nums[0], nums[1] + nums[3]);
            }
            ctx.rect(...nums);
            ctx.fill();
            ctx.stroke();
        }
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const Tag$1 = 'DefaultShapesMgr';
class DefaultShapesMgr {
    constructor() {
        this._group_shapes_map = new Map();
        this._items = [];
        this._kvs = {};
    }
    find(id) {
        return this._kvs[id] || null;
    }
    shapes() { return this._items; }
    exists(items) {
        let ret = 0;
        items.forEach(v => {
            if (this._kvs[v.data.id])
                ++ret;
        });
        return ret;
    }
    add(items) {
        let ret = 0;
        items.forEach(item => {
            if (this._kvs[item.data.id])
                return console.warn(`[${Tag$1}::add] can not add "${item.data.id}", already exists!`);
            this._kvs[item.data.id] = item;
            this._items.push(item);
            this.ensure_shapes_set_by_group(item.groupId).add(item);
            ++ret;
        });
        this._items.sort((a, b) => a.data.z - b.data.z);
        return ret;
    }
    remove(items) {
        let ret = 0;
        items.forEach(item => {
            var _a;
            const idx = this._items.findIndex(v => v === item);
            if (idx < 0)
                return;
            this._items = this._items.filter((_, i) => i !== idx);
            delete this._kvs[item.data.id];
            (_a = this._group_shapes_map.get(item.groupId)) === null || _a === void 0 ? void 0 : _a.delete(item);
            ++ret;
        });
        return ret;
    }
    is_hit(shape, rect, predicate) {
        if (shape.ghost)
            return false;
        if (!RotatedRect.hit(shape.obb(), rect))
            return false;
        if (!predicate)
            return true;
        return predicate(shape, rect);
    }
    hits(rect, predicate) {
        const count = this._items.length;
        const ret = [];
        for (let idx = count - 1; idx >= 0; --idx) {
            const v = this._items[idx];
            if (this.is_hit(v, rect, predicate))
                ret.push(v);
        }
        return ret;
    }
    hit(rect, predicate) {
        const count = this._items.length;
        for (let idx = count - 1; idx >= 0; --idx) {
            const v = this._items[idx];
            if (this.is_hit(v, rect, predicate))
                return v;
        }
        return null;
    }
    minZ() {
        var _a;
        return (_a = this._items[0]) !== null && _a !== void 0 ? _a : null;
    }
    maxZ() {
        var _a;
        return (_a = this._items[this._items.length - 1]) !== null && _a !== void 0 ? _a : null;
    }
    groups() {
        return Array.from(this._group_shapes_map.keys());
    }
    ensure_shapes_set_by_group(groupd_id) {
        let set = this._group_shapes_map.get(groupd_id);
        if (set)
            return set;
        set = new Set();
        this._group_shapes_map.set(groupd_id, set);
        return set;
    }
    shapes_by_group(groupd_id) {
        const set = this._group_shapes_map.get(groupd_id);
        if (!set)
            return [];
        return Array.from(set);
    }
    update_items_group(shapes) {
        for (const shape of shapes) {
            for (const [g, s] of this._group_shapes_map) {
                if (g !== shape.groupId && s.has(shape)) {
                    s.delete(shape);
                    break;
                }
            }
            this.ensure_shapes_set_by_group(shape.groupId).add(shape);
        }
    }
}

const Tag = '[DefaultFactory]';
class DefaultFactory {
    constructor() {
        this._z = 0;
        this._time = 0;
        this._shapeTemplates = {};
        this.resizer = { size: 10 };
        this.rotator = { size: 10, distance: 30 };
        /** @deprecated */ this.fontFamilies = () => Array.from(Gaia.fonts.keys());
        /** @deprecated */ this.fontName = (f) => { var _a, _b; return ((_b = (_a = Gaia.fonts.get(f)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : f); };
    }
    get type() {
        return FactoryEnum.Default;
    }
    shapeTemplate(type) {
        const ret = this._shapeTemplates[type] || this.newShapeData(type);
        this._shapeTemplates[type] = ret;
        return ret;
    }
    setShapeTemplate(type, template) {
        this._shapeTemplates[type] = template;
    }
    newBoard(options) {
        return new Board(this, options);
    }
    newShapesMgr() {
        return new DefaultShapesMgr();
    }
    newTool(toolType) {
        const create = Gaia.tool(toolType);
        if (!create) {
            console.warn(Tag, `newTool("${toolType}"), ${toolType} is not registered`);
            return new InvalidTool;
        }
        const ret = create();
        if (ret.type !== toolType) {
            console.warn(Tag, `newTool("${toolType}"), ${toolType} is not corrent! check member 'type' of your Tool!`);
        }
        return ret;
    }
    newShapeData(shapeType) {
        const create = Gaia.shapeData(shapeType);
        if (!create) {
            console.warn(Tag, `newShapeData("${shapeType}"), ${shapeType} is not registered`);
            return new ShapeData;
        }
        const ret = create();
        if (ret.type !== shapeType) {
            console.warn(Tag, `newShapeData("${shapeType}"), ${shapeType} is not corrent! check member 'type' of your ShapeData!`);
        }
        return ret;
    }
    newShapeId(data) {
        return data.t + '_' + Date.now() + (++this._time);
    }
    newShapeZ(data) {
        return Date.now() + (++this._z);
    }
    newShape(v) {
        var _a, _b;
        const isNew = isNum(v) || isStr(v);
        const type = isNew ? v : v.t;
        const data = this.newShapeData(type);
        const template = isNew ? this.shapeTemplate(v) : v;
        data.read(template);
        if (isNew) {
            data.id = this.newShapeId(data);
            data.z = this.newShapeZ(data);
        }
        return (_b = (_a = Gaia.shape(type)) === null || _a === void 0 ? void 0 : _a(data)) !== null && _b !== void 0 ? _b : new Shape(data, ShapeData);
    }
    newLayerId() {
        return `layer_${Date.now()}_${++this._time}`;
    }
    newLayerName() {
        return `layer_${Date.now()}_${++this._time}`;
    }
    newLayer(inits = {}) {
        const { id = this.newLayerId(), name = this.newLayerName() } = inits, remains = __rest(inits, ["id", "name"]);
        return new Layer(Object.assign({ id, name }, remains));
    }
    newShapeDecoration(board) {
        return new DefaultShapeDecoration(board);
    }
    overbound(_) { return 1; }
    newGroupId(shapes) {
        return `group_${Date.now()}${shapes.length}${++this._time}`;
    }
}
Gaia.registerFactory(FactoryEnum.Default, () => new DefaultFactory(), { name: 'bulit-in Factory', desc: 'bulit-in Factory' });

class ActionQueue {
    constructor() {
        this._actionsIdx = -1;
        this._actions = [];
        this._cancellers = [];
    }
    setActor(actor) {
        this._cancellers.forEach(v => v());
        this._cancellers = [];
        if (!actor) {
            return this;
        }
        Gaia.listActions().forEach(eventType => {
            const handler = Gaia.action(eventType);
            if (!handler) {
                return;
            }
            const func = (detail) => {
                if (detail.operator !== actor.whoami) {
                    return;
                }
                if (!handler.isAction(actor, detail)) {
                    return;
                }
                if (this._actionsIdx < this._actions.length - 1) {
                    /* 丢弃被撤销的分支，保留仍然生效的 [0, _actionsIdx] */
                    this._actions = this._actions.slice(0, this._actionsIdx + 1);
                }
                this._actions.push([
                    () => handler.undo(actor, detail),
                    () => handler.redo(actor, detail),
                ]);
                this._actionsIdx = this._actions.length - 1;
            };
            this._cancellers.push(actor.on(eventType, func));
        });
        return this;
    }
    undo() {
        if (this._actionsIdx < 0) {
            console.log('[ActionQueue] no more undo.');
            return this;
        }
        this._actions[this._actionsIdx][0]();
        --this._actionsIdx;
        return this;
    }
    redo() {
        if (this._actionsIdx >= this._actions.length - 1) {
            console.log('[ActionQueue] no more redo.');
            return this;
        }
        ++this._actionsIdx;
        this._actions[this._actionsIdx][1]();
        return this;
    }
    get index() { return this._actionsIdx; }
    get length() { return this._actions.length; }
    get canRedo() { return this._actionsIdx < this._actions.length - 1; }
    get canUndo() { return this._actionsIdx >= 0; }
}
const _changeShapes = (board, shapeDatas, which) => {
    shapeDatas.forEach((currAndPrev) => {
        var _a;
        const data = currAndPrev[which];
        const id = data.i;
        id && ((_a = board.find(id)) === null || _a === void 0 ? void 0 : _a.merge(data));
    });
};
const _addShapes = (board, shapeDatas) => {
    const shapes = shapeDatas.map(v => board.factory.newShape(v));
    board.add(shapes, { operator: 'action_queue' });
};
const _removeShapes = (board, shapeDatas) => {
    const shapes = shapeDatas === null || shapeDatas === void 0 ? void 0 : shapeDatas.map(data => board.find(data.i)).filter(v => v);
    board.remove(shapes, { operator: 'action_queue' });
};
Gaia.registAction(EventEnum.ShapesDone, {
    isAction: () => true,
    undo: (board, detail) => {
        const { shapeDatas } = detail;
        _removeShapes(board, shapeDatas);
    },
    redo: (board, detail) => {
        const { shapeDatas } = detail;
        _addShapes(board, shapeDatas);
    }
});
Gaia.registAction(EventEnum.ShapesRemoved, {
    isAction: () => true,
    undo: (board, detail) => {
        const { shapeDatas } = detail;
        _addShapes(board, shapeDatas);
    },
    redo: (board, detail) => {
        const { shapeDatas } = detail;
        _removeShapes(board, shapeDatas);
    }
});
Gaia.registAction(EventEnum.ShapesGeoChanged, {
    isAction: (board, detail) => {
        return detail.tool === ToolEnum.Selector;
    },
    undo: (board, detail) => {
        const { shapeDatas } = detail;
        _changeShapes(board, shapeDatas, 1);
        board.emit(EventEnum.ShapesGeoChanged, {
            operator: 'action_queue',
            tool: ToolEnum.Invalid,
            shapeDatas: shapeDatas.map(arr => [arr[1], arr[0]])
        });
    },
    redo: (board, detail) => {
        const { shapeDatas } = detail;
        _changeShapes(board, shapeDatas, 0);
        board.emit(EventEnum.ShapesGeoChanged, {
            operator: 'action_queue',
            tool: ToolEnum.Invalid,
            shapeDatas
        });
    }
});

class FClipboard {
    constructor(board) {
        this.shapesMark = "write_board_shapes:";
        this.handleClipboardItem = (item) => {
            if (item.types.indexOf("image/png") >= 0)
                item.getType("image/png").then(this.pastePNG);
            else if (item.types.indexOf("image/jpeg") >= 0)
                item.getType("image/jpeg").then(this.pasteJPG);
            else if (item.types.indexOf("text/plain") >= 0)
                item.getType("text/plain").then(it => it.text()).then(this.pasteTXT);
        };
        this.pastePNG = (blob) => {
            console.log("TODO: handlePastePng");
        };
        this.pasteJPG = (blob) => {
            console.log("TODO: handlePasteJpg");
        };
        this.pasteTXT = (txt) => {
            if (txt.startsWith(this.shapesMark))
                this.pasteShapes(JSON.parse(txt.substring(this.shapesMark.length)));
            else
                console.log("TODO: handlePasteTxt");
        };
        this.pasteShapes = (raws) => {
            const board = this.board;
            const factory = board.factory;
            const shapes = raws.sort((a, b) => a.z - b.z).map(raw => {
                raw.i = factory.newShapeId(raw);
                raw.z = factory.newShapeZ(raw);
                raw.b && (raw.b.f = void 0);
                raw.x = raw.x + 10;
                raw.y = raw.y + 10;
                const shape = factory.newShape(raw);
                shape.selected = true;
                return shape;
            });
            board.deselect(false);
            board.add(shapes, true);
            board.emit(EventEnum.ShapesDone, {
                operator: board.whoami,
                shapeDatas: raws
            });
        };
        this.board = board;
    }
    cut() {
        this.copy();
        this.board.removeSelected(true);
    }
    copy() {
        const datas = this.board.selects.map(shape => shape.data);
        const blob = new Blob([this.shapesMark, JSON.stringify(datas)], { type: 'text/plain' });
        navigator.clipboard.write([
            new ClipboardItem({ "text/plain": Promise.resolve(blob) })
        ]).catch(e => {
            console.error(e);
        });
    }
    paste() {
        navigator.clipboard.read()
            .then(items => items.forEach(this.handleClipboardItem))
            .catch(e => console.error(e));
    }
}

class Player {
    constructor() {
        this._eventIdx = 0;
        this._options = {};
        this._rate = 1;
        this._state = 'idle';
        this._req_id = 0;
        /** 当前回放时间（剧本相对时间，ms） */
        this._time = 0;
        /** 已经应用到画布的时间，-1 表示还没应用过 */
        this._applied = -1;
        /** 上一帧的时间戳，0 表示下一帧只对表、不推进时间 */
        this._last_ts = 0;
        this._frame = (ts) => {
            this._req_id = 0;
            if (this._state !== 'playing')
                return;
            const duration = this.duration;
            if (this._last_ts)
                this._time += (ts - this._last_ts) * this._rate;
            this._last_ts = ts;
            const finished = this._rate >= 0 ? this._time >= duration : this._time <= 0;
            if (finished) {
                this._time = this._rate >= 0 ? duration : 0;
                this._applyTo(this._time);
                this._finish();
                return;
            }
            this._applyTo(this._time);
            this._emitProgress();
            this._req_id = requestAnimationFrame(this._frame);
        };
    }
    get state() { return this._state; }
    get playing() { return this._state === 'playing'; }
    get paused() { return this._state === 'paused'; }
    get actor() { return this._actor; }
    get screenplay() { return this._screenplay; }
    get rate() { return this._rate; }
    set rate(v) { this._rate = Number.isFinite(v) ? v : 1; }
    /** 当前回放时间（剧本相对时间，ms） */
    get time() { return this._time; }
    /** 剧本总时长（ms）；旧格式剧本没有 endTime 时按最后一个事件的时间戳推断 */
    get duration() {
        const screenplay = this._screenplay;
        if (!screenplay)
            return 0;
        const start = screenplay.startTime || 0;
        let end = screenplay.endTime || 0;
        if (!(end >= start)) {
            const last = screenplay.events[screenplay.events.length - 1];
            end = start + Math.max(0, (last === null || last === void 0 ? void 0 : last.timestamp) || 0);
        }
        return end - start;
    }
    /** 回放进度，0 ~ 1 */
    get progress() {
        const duration = this.duration;
        if (duration <= 0)
            return this._state === 'idle' ? 0 : 1;
        return Math.min(1, Math.max(0, this._time / duration));
    }
    /** 已应用的事件下标 */
    get eventIndex() { return this._eventIdx; }
    get eventCount() { var _a, _b; return (_b = (_a = this._screenplay) === null || _a === void 0 ? void 0 : _a.events.length) !== null && _b !== void 0 ? _b : 0; }
    getProgress() {
        return {
            state: this._state,
            time: this._time,
            duration: this.duration,
            progress: this.progress,
            eventIndex: this._eventIdx,
            eventCount: this.eventCount,
            rate: this._rate,
        };
    }
    /**
     * 从剧本起点开始回放
     *
     * @description 内部会先 stop()，所以重复调用不会叠加时间轴
     */
    play(actor, screenplay, options = {}) {
        this.stop();
        this._options = Object.assign({}, options);
        if (options.rate !== undefined)
            this.rate = options.rate;
        this.begin(actor, screenplay);
        this._applyTo(0); // 立刻呈现「第 0 帧」：快照 + 零时刻的事件
        this._state = 'playing';
        this._emitProgress();
        this._req_id = requestAnimationFrame(this._frame);
        return this;
    }
    /**
     * 准备回放：只还原快照、不启动时间轴
     *
     * @description 之后可用 update_once() / seek() 手动驱动，或在测试里逐步应用
     */
    begin(actor, screenplay) {
        this._cancelFrame();
        this._actor = actor;
        this._screenplay = {
            startTime: screenplay.startTime || 0,
            endTime: screenplay.endTime || 0,
            snapshot: screenplay.snapshot,
            events: screenplay.events || [],
        };
        this._eventIdx = 0;
        this._time = 0;
        this._applied = -1;
        this._last_ts = 0;
        this._state = 'idle';
        if (screenplay.snapshot)
            actor.fromSnapshot(screenplay.snapshot);
        return this;
    }
    /** 暂停，保留当前位置，可用 resume() 继续 */
    pause() {
        if (this._state !== 'playing')
            return this;
        this._cancelFrame();
        this._state = 'paused';
        this._last_ts = 0;
        this._emitProgress();
        return this;
    }
    /** 继续播放 */
    resume() {
        if (this._state !== 'paused')
            return this;
        this._state = 'playing';
        this._last_ts = 0;
        this._req_id = requestAnimationFrame(this._frame);
        this._emitProgress();
        return this;
    }
    /** 停止：取消时间轴，画面停在当前位置；不会触发 onEnd */
    stop() {
        this._cancelFrame();
        this._last_ts = 0;
        if (this._state !== 'ended')
            this._state = 'stopped';
        return this;
    }
    /**
     * 跳到指定回放时间（ms）
     *
     * @description 往前跳是增量应用；往回跳会先从快照重建，再重放到目标时间
     */
    seek(time) {
        if (!this._screenplay)
            return this;
        const { min, max } = Math;
        const to = max(0, min(time, this.duration));
        this._time = to;
        this._last_ts = 0;
        this._applyTo(to);
        this._emitProgress();
        return this;
    }
    /** 倒放（把倍速取负） */
    backward() {
        this._rate = -Math.abs(this._rate || 1);
        return this;
    }
    /** 正放（把倍速取正） */
    forward() {
        this._rate = Math.abs(this._rate || 1);
        return this;
    }
    /**
     * 应用到指定时间为止的所有事件
     *
     * @description 只推进事件、不改变播放状态，也不会启动时间轴
     * @param {number} time 剧本相对时间（ms），传 Infinity 表示全部应用
     */
    update_once(time) {
        const screenplay = this._screenplay;
        if (!screenplay)
            return;
        while (this._eventIdx < screenplay.events.length) {
            const event = screenplay.events[this._eventIdx];
            if (!event || event.timestamp > time) {
                break;
            }
            this._applyEvent(event);
            ++this._eventIdx;
        }
    }
    /** 推进一帧（平时由 requestAnimationFrame 驱动，测试里可以手动调用） */
    tick(time) {
        this._frame(time);
    }
    _finish() {
        var _a, _b;
        this._cancelFrame();
        this._state = 'ended';
        const progress = this.getProgress();
        this._emitProgress();
        (_b = (_a = this._options).onEnd) === null || _b === void 0 ? void 0 : _b.call(_a, progress);
    }
    _emitProgress() {
        var _a, _b;
        (_b = (_a = this._options).onProgress) === null || _b === void 0 ? void 0 : _b.call(_a, this.getProgress());
    }
    _cancelFrame() {
        if (this._req_id) {
            cancelAnimationFrame(this._req_id);
            this._req_id = 0;
        }
    }
    /** 把画布推进（或回退）到指定时间；回退时从快照重建，保证状态精确 */
    _applyTo(time) {
        if (time < this._applied) {
            this._rebuildTo(time);
            return;
        }
        this.update_once(time);
        this._applied = time;
    }
    _rebuildTo(time) {
        const actor = this._actor;
        const screenplay = this._screenplay;
        if (!actor || !screenplay)
            return;
        this._eventIdx = 0;
        if (screenplay.snapshot)
            actor.fromSnapshot(screenplay.snapshot);
        else
            actor.removeAll(false);
        this.update_once(time);
        this._applied = time;
    }
    _applyEvent(e) {
        switch (e.type) {
            case EventEnum.ShapesAdded: {
                const { shapeDatas } = e;
                this._addShape(shapeDatas);
                break;
            }
            case EventEnum.ShapesGeoChanging:
            case EventEnum.ShapesGeoChanged:
            case EventEnum.ShapesChanging:
            case EventEnum.ShapesChanged: {
                const { shapeDatas } = e;
                this._changeShapes(shapeDatas, 0);
                break;
            }
            case EventEnum.ShapesRemoved: {
                const { shapeDatas } = e;
                this._removeShape(shapeDatas);
                break;
            }
            case EventEnum.WorldRectChanged: {
                const { to } = e;
                this._actor.set_world_rect(to);
                break;
            }
            case EventEnum.ViewportChanged: {
                const { to } = e;
                this._actor.set_viewport(to);
            }
        }
    }
    _addShape(shapeDatas) {
        const shapes = shapeDatas === null || shapeDatas === void 0 ? void 0 : shapeDatas.map(v => this._actor.factory.newShape(v));
        shapes && this._actor.add(shapes, false);
    }
    _removeShape(shapeDatas) {
        const shapes = shapeDatas === null || shapeDatas === void 0 ? void 0 : shapeDatas.map(data => this._actor.find(data.i)).filter(v => v);
        shapes && this._actor.remove(shapes, false);
    }
    _changeShapes(shapeDatas, which) {
        shapeDatas.forEach((currAndPrev) => {
            var _a;
            const data = currAndPrev[which];
            const id = data.i;
            id && ((_a = this._actor.find(id)) === null || _a === void 0 ? void 0 : _a.merge(data));
        });
    }
}

/******************************************************************
 * Copyright @ 2023 朱剑豪. All rights reserverd.
 * @file   src\features\Recorder.ts
 * @author 朱剑豪
 * @date   2023/07/02 23:31
 * @desc   事件记录器
 ******************************************************************/
/** 工具事件里的 tool 是工具实例（循环引用），导出前替换成它的类型字符串 */
function pickTool(detail) {
    const tool = detail.tool;
    if (tool === void 0 || tool === null)
        return {};
    return { tool: typeof tool === 'string' ? tool : tool.type };
}
class Recorder {
    get running() { return this._running; }
    get actor() { return this._actor; }
    constructor() {
        this._cancellers = [];
        this._running = false;
        console.log('[Recorder] constructor()');
    }
    getScreenplay() {
        return this._screenplay || null;
    }
    getJson() {
        return this._screenplay ? JSON.stringify(this._screenplay) : null;
    }
    getActor() {
        return this._actor;
    }
    setActor(v) {
        if (this._actor === v) {
            return this;
        }
        if (this._running) {
            this.stop();
        }
        this._actor = v;
        return this;
    }
    destroy() {
        console.log('[Recorder] destroy()');
    }
    /**
     * @deprecated 拼写错误，请使用 destroy()
     * @deprecated misspelled, use destroy() instead
     */
    destory() { this.destroy(); }
    stop() {
        console.log('[Recorder] stop()');
        if (this._screenplay) {
            this._screenplay.endTime = performance.now();
        }
        this._running = false;
        this._cancellers.forEach(v => v());
        this._cancellers = [];
        return this;
    }
    start() {
        console.log('[Recorder] start()');
        const actor = this._actor;
        if (!actor) {
            console.warn('[Recorder] start() faild, actor not set.');
            return this;
        }
        this._running = true;
        this._cancellers.forEach(v => v());
        this._cancellers = [];
        const start_time = performance.now();
        const screenplay = this._screenplay = {
            startTime: start_time,
            endTime: start_time,
            snapshot: actor.toSnapshot(),
            events: []
        };
        for (const key in EventEnum) {
            const v = EventEnum[key];
            const func = (detail) => {
                const now = performance.now();
                screenplay.events.push(Object.assign(Object.assign(Object.assign({}, detail), pickTool(detail)), { timestamp: now - start_time }));
                screenplay.endTime = now;
            };
            this._cancellers.push(actor.on(v, func));
        }
        return this;
    }
}

export { ActionQueue, Arrays, BUILT_IN_FONTS, BinaryRange, BinaryTree, Board, ChangeType, CrossData, SimpleTool as CrossTool, DefaultFactory, DefaultShapeDecoration, Degrees, EraserTool, EventEnum, Events, FClipboard, FactoryEnum, FontFamilysChecker, Gaia, HalfTickData, SimpleTool as HalfTickTool, ImgData, InvalidTool, Layer, LayerInfo, LinesData, LinesTool, Numbers, ObjectFit, OvalData, OvalTool, PenData, PenTool, Player, Polygon, PolygonData, SimpleTool as PolygonTool, QuadTree, Recorder, Rect, RectData, SimpleTool as RectTool, Resizable, RotatedRect, SelectorStatus, SelectorTool, Shape, ShapeCross, ShapeData, ShapeEnum, ShapeEventEnum, ShapeHalfTick, ShapeImg, ShapeLines, ShapeNeedPath, ShapeOval, ShapePen, ShapePolygon, ShapeRect, ShapeStatus, ShapeStyle, ShapeText, ShapeTick, SimpleTool, TextData, TextSelection, TextTool, TickData, SimpleTool as TickTool, ToolEnum, Vector, degrees, getFactoryName, getShapeName, getToolName, getValue, opposites };
//# sourceMappingURL=writeboard.js.map
