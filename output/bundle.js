(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = exports.ButtonState = void 0;
const SizeType_1 = require("./SizeType");
const Styles_1 = require("./Styles");
const View_1 = require("./View");
var ButtonState;
(function (ButtonState) {
    ButtonState[ButtonState["Normal"] = 0] = "Normal";
    ButtonState[ButtonState["Checked"] = 1] = "Checked";
})(ButtonState = exports.ButtonState || (exports.ButtonState = {}));
class Button extends View_1.View {
    get title() { return this.titles.get(ButtonState.Normal); }
    set title(v) {
        if (v === undefined) {
            return;
        }
        this.titles.set(ButtonState.Normal, v);
        this.titles.set(ButtonState.Checked, v);
        this.updateTitle();
    }
    get titles() {
        var _a;
        this._titles = (_a = this._titles) !== null && _a !== void 0 ? _a : new Map();
        return this._titles;
    }
    set titles(v) {
        this._titles = v;
        this.updateTitle();
    }
    get content() { return this.contents.get(ButtonState.Normal); }
    set content(v) {
        if (v === undefined) {
            return;
        }
        this.contents.set(ButtonState.Normal, v);
        this.contents.set(ButtonState.Checked, v);
        this.updateContent();
    }
    get contents() {
        var _a;
        this._contents = (_a = this._contents) !== null && _a !== void 0 ? _a : new Map();
        return this._contents;
    }
    set contents(v) {
        this._contents = v;
        this.updateContent();
    }
    get checked() { return this._checked; }
    set checked(v) {
        this._checked = v;
        this.updateStyle();
        this.updateTitle();
        this.updateContent();
    }
    get disabled() { return this.inner.disabled; }
    set disabled(v) {
        this.inner.disabled = v;
        this.updateStyle();
    }
    constructor() {
        super('button');
        this._size = SizeType_1.SizeType.Middle;
        this._checked = false;
        this._checkable = false;
        this.aaa = {
            [SizeType_1.SizeType.Small]: 'g_button_small',
            [SizeType_1.SizeType.Middle]: 'g_button_middle',
            [SizeType_1.SizeType.Large]: 'g_button_large',
        };
        Styles_1.Styles.css('./g_button.css');
        this.hoverOb;
        this.styles.addCls('g_button');
        this.inner.addEventListener('click', () => {
            if (this._checkable) {
                this._checked = !this._checked;
            }
            this.updateStyle();
            this.updateContent();
            this.updateTitle();
        });
    }
    init(inits) {
        var _a;
        this._size = (_a = inits === null || inits === void 0 ? void 0 : inits.size) !== null && _a !== void 0 ? _a : this._size;
        this._checkable = (inits === null || inits === void 0 ? void 0 : inits.checkable) === true;
        this._checked = (inits === null || inits === void 0 ? void 0 : inits.checked) === true;
        if (inits === null || inits === void 0 ? void 0 : inits.contents) {
            this.contents.set(ButtonState.Normal, inits.contents[0]);
            this.contents.set(ButtonState.Checked, inits.contents[1]);
        }
        else if (inits === null || inits === void 0 ? void 0 : inits.content) {
            this.contents.set(ButtonState.Normal, inits.content);
            this.contents.set(ButtonState.Checked, inits.content);
        }
        if (inits === null || inits === void 0 ? void 0 : inits.titles) {
            this.titles.set(ButtonState.Normal, inits.titles[0]);
            this.titles.set(ButtonState.Checked, inits.titles[1]);
        }
        else if (inits === null || inits === void 0 ? void 0 : inits.title) {
            this.titles.set(ButtonState.Normal, inits.title);
            this.titles.set(ButtonState.Checked, inits.title);
        }
        this.updateContent();
        this.updateTitle();
        this.updateSize();
        return this;
    }
    onHover(hover) {
        this.updateStyle();
    }
    updateStyle() {
        const styles = this.styles;
        styles[this.checked ? 'addCls' : 'delCls']('g_button_checked');
        styles[this.disabled ? 'addCls' : 'delCls']('g_button_disbaled');
        styles.refresh();
    }
    updateContent() {
        const content = this.contents.get(this._checked ? ButtonState.Checked : ButtonState.Normal);
        if (content === undefined) {
            this.inner.innerText = '';
        }
        else if (typeof content === 'string') {
            this.inner.innerText = content;
        }
        else {
            this.inner.innerHTML = '';
            this.addChild(content);
        }
    }
    updateTitle() {
        const title = this.titles.get(this._checked ? ButtonState.Checked : ButtonState.Normal);
        if (title === undefined) {
            this.inner.removeAttribute('title');
        }
        else {
            this.inner.setAttribute('title', title);
        }
    }
    updateSize() {
        this.styles
            .delCls(this.aaa[this._preSize])
            .addCls(this.aaa[this._size]);
        this._preSize = this._size;
    }
}
exports.Button = Button;
Button.State = ButtonState;

},{"./SizeType":2,"./Styles":4,"./View":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeType = void 0;
var SizeType;
(function (SizeType) {
    SizeType["Small"] = "s";
    SizeType["Middle"] = "m";
    SizeType["Large"] = "l";
})(SizeType = exports.SizeType || (exports.SizeType = {}));

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoPxKeys = exports.CssDisplay = exports.CssCursor = exports.CssFlexDirection = exports.CssPosition = exports.CssObjectFit = exports.CssAlignSelf = void 0;
var CssAlignSelf;
(function (CssAlignSelf) {
    CssAlignSelf["Auto"] = "auto";
    CssAlignSelf["Normal"] = "normal";
    CssAlignSelf["Center"] = "center";
    CssAlignSelf["Start"] = "start";
    CssAlignSelf["End"] = "end";
    CssAlignSelf["SelfStart"] = "self-start";
    CssAlignSelf["SelfEnd"] = "self-end";
    CssAlignSelf["FlexStart"] = "flex-start";
    CssAlignSelf["FlexEnd"] = "flex-end";
    CssAlignSelf["Baseline"] = "baseline";
    CssAlignSelf["FirstBaseline"] = "first baseline";
    CssAlignSelf["LastBaseline"] = "last baseline";
    CssAlignSelf["Stretch"] = "stretch";
    CssAlignSelf["SafeCenter"] = "safe center";
    CssAlignSelf["UnsafeCenter"] = "unsafe center";
    CssAlignSelf["Inherit"] = "inherit";
    CssAlignSelf["Initial"] = "initial";
    CssAlignSelf["Revert"] = "revert";
    CssAlignSelf["RevertLayer"] = "revert-layer";
    CssAlignSelf["Unset"] = "unset";
})(CssAlignSelf = exports.CssAlignSelf || (exports.CssAlignSelf = {}));
var CssObjectFit;
(function (CssObjectFit) {
    CssObjectFit["Fill"] = "fill";
    CssObjectFit["Contain"] = "contain";
    CssObjectFit["Cover"] = "cover";
    CssObjectFit["None"] = "none";
    CssObjectFit["scaleDown"] = "scale-down";
})(CssObjectFit = exports.CssObjectFit || (exports.CssObjectFit = {}));
var CssPosition;
(function (CssPosition) {
    CssPosition["Static"] = "static";
    CssPosition["Relative"] = "relative";
    CssPosition["Absolute"] = "absolute";
    CssPosition["Fixed"] = "fixed";
    CssPosition["Sticky"] = "sticky";
})(CssPosition = exports.CssPosition || (exports.CssPosition = {}));
var CssFlexDirection;
(function (CssFlexDirection) {
    CssFlexDirection["row"] = "row";
    CssFlexDirection["rowReverse"] = "row-reverse";
    CssFlexDirection["column"] = "column";
    CssFlexDirection["columnReverse"] = "column-reverse";
})(CssFlexDirection = exports.CssFlexDirection || (exports.CssFlexDirection = {}));
var CssCursor;
(function (CssCursor) {
    CssCursor["Auto"] = "auto";
    CssCursor["Default"] = "default";
    CssCursor["None"] = "none";
    CssCursor["ContextMenu"] = "context-menu";
    CssCursor["Help"] = "help";
    CssCursor["Pointer"] = "pointer";
    CssCursor["Progress"] = "progress";
    CssCursor["Wait"] = "wait";
    CssCursor["Cell"] = "cell";
    CssCursor["Crosshair"] = "crosshair";
    CssCursor["Text"] = "text";
    CssCursor["VerticalText"] = "vertical-text";
    CssCursor["Alias"] = "alias";
    CssCursor["Copy"] = "copy";
    CssCursor["Move"] = "move";
    CssCursor["NoDrop"] = "no-drop";
    CssCursor["NotAllowed"] = "not-allowed";
    CssCursor["Grab"] = "grab";
    CssCursor["Grabbing"] = "grabbing";
    CssCursor["AllScroll"] = "all-scroll";
    CssCursor["ResizeCol"] = "col-resize";
    CssCursor["ResizeRow"] = "row-resize";
    CssCursor["ResizeN"] = "n-resize";
    CssCursor["ResizeE"] = "e-resize";
    CssCursor["ResizeS"] = "s-resize";
    CssCursor["ResizeW"] = "w-resize";
    CssCursor["ResizeNE"] = "ne-resize";
    CssCursor["ResizeNW"] = "nw-resize";
    CssCursor["ResizeSE"] = "se-resize";
    CssCursor["ResizeSW"] = "sw-resize";
    CssCursor["ResizeEW"] = "ew-resize";
    CssCursor["ResizeNS"] = "ns-resize";
    CssCursor["ResizeNESW"] = "nesw-resize";
    CssCursor["ResizeNWSE"] = "nwse-resize";
    CssCursor["ZoomIn"] = "zoom-in";
    CssCursor["ZoomOut"] = "zoom-out";
})(CssCursor = exports.CssCursor || (exports.CssCursor = {}));
var CssDisplay;
(function (CssDisplay) {
    CssDisplay["Block"] = "block";
    CssDisplay["Inline"] = "inline";
    CssDisplay["InlineBlock"] = "inline-block";
    CssDisplay["Flex"] = "flex";
    CssDisplay["InlineFlex"] = "inline-flex";
    CssDisplay["Grid"] = "grid";
    CssDisplay["InlineGrid"] = "inline-grid";
    CssDisplay["FlowRoot"] = "flow-root";
    CssDisplay["None"] = "none";
    CssDisplay["Contents"] = "contents";
    CssDisplay["Table"] = "table";
    CssDisplay["TableRow"] = "table-row";
    CssDisplay["ListItem"] = "list-item";
    CssDisplay["Inherit"] = "inherit";
    CssDisplay["Initial"] = "initial";
    CssDisplay["Revert"] = "revert";
    CssDisplay["RevertLayer"] = "revert-layer";
    CssDisplay["Unset"] = "unset";
})(CssDisplay = exports.CssDisplay || (exports.CssDisplay = {}));
;
exports.autoPxKeys = new Set([
    'width',
    'height',
    'maxWidth',
    'maxHeight',
    'minWidth',
    'minHeight',
    'left',
    'right',
    'top',
    'bottom',
    'borderRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'fontSize',
    'lineHeight',
    'padding',
    'paddingLeft',
    'paddingRight',
    'paddingBottom',
    'paddingTop',
    'margin',
    'marginLeft',
    'marginRight',
    'marginBottom',
    'marginTop',
]);

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Styles = exports.flag = void 0;
const StyleType_1 = require("./StyleType");
const utils_1 = require("../utils");
exports.flag = 2;
class Styles {
    static css(...hrefs) {
        const ls = [];
        for (let i = 0; i < hrefs.length; ++i) {
            const href = hrefs[i] + '?t=' + exports.flag;
            const l = this.csses.get(href);
            if (l) {
                ls.push(Promise.resolve(l));
                continue;
            }
            const p = this.pendings.get(href);
            if (p) {
                ls.push(p);
                continue;
            }
            const n = new Promise((resolve, reject) => {
                const l = document.createElement('link');
                l.rel = 'stylesheet';
                l.href = href;
                l.onload = () => {
                    this.csses.set(href, l);
                    this.pendings.delete(href);
                    resolve(l);
                };
                l.onerror = (e) => {
                    this.csses.set(href, l);
                    this.pendings.delete(href);
                    resolve(l);
                };
                document.head.appendChild(l);
            });
            this.pendings.set(href, n);
            ls.push(n);
        }
        return Promise.all(ls);
    }
    get view() { return this._view; }
    get pool() {
        var _a;
        this._pool = (_a = this._pool) !== null && _a !== void 0 ? _a : new Map();
        return this._pool;
    }
    get applieds() {
        var _a;
        this._applieds = (_a = this._applieds) !== null && _a !== void 0 ? _a : new Set();
        return this._applieds;
    }
    constructor(view) {
        this._view = view;
    }
    read(name) {
        const ret = this.pool.get(name);
        if (!ret) {
            console.warn(`[styles] read(), style '${name}' not found!`);
        }
        return ret !== null && ret !== void 0 ? ret : {};
    }
    registers(styles) {
        for (const name in styles) {
            this.register(name, styles[name]);
        }
        return this;
    }
    register(name, style) {
        let processed = {};
        if (style) {
            const existed = this.pool.get(name);
            processed = (0, utils_1.reValue)(style, existed !== null && existed !== void 0 ? existed : {});
        }
        this.pool.set(name, processed);
        return this;
    }
    edit(name, style) {
        const old = this.pool.get(name);
        if (old === undefined) {
            console.warn(`[styles] edit(), style '${name}' not found!`);
            return this;
        }
        this.pool.set(name, style(old !== null && old !== void 0 ? old : {}));
        return this;
    }
    merge(name, style) {
        const old = this.pool.get(name);
        if (old === undefined) {
            console.warn(`[styles] merge(), style '${name}' not found!`);
            return this;
        }
        this.pool.set(name, Object.assign(Object.assign({}, old), style));
        return this;
    }
    add(...names) {
        names.forEach(name => this.applieds.add(name));
        return this;
    }
    del(...names) {
        names.forEach(name => this.applieds.delete(name));
        return this;
    }
    clear() {
        var _a;
        this.applieds.clear();
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.inner.removeAttribute('style');
        return this;
    }
    forgo(...names) {
        this.del(...names).refresh();
        return this;
    }
    refresh() {
        var _a;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.inner.removeAttribute('style');
        const final = {};
        this.applieds.forEach(name => {
            Object.assign(final, this.makeUp(this.read(name)));
        });
        Object.assign(this.view.inner.style, final);
    }
    apply(name, style) {
        if (style) {
            this.register(name, style).add(name).refresh();
        }
        else {
            this.add(name).refresh();
        }
        return this;
    }
    setCls(...names) {
        this.view.inner.className = '';
        return this.addCls(...names);
    }
    addCls(...names) {
        this.view.inner.classList.add(...names);
        return this;
    }
    delCls(...names) {
        this.view.inner.classList.remove(...names);
        return this;
    }
    destory() {
        delete this._view;
        this.pool.clear();
        this.applieds.clear();
    }
    makeUp(style) {
        const ret = Object.assign({}, style);
        StyleType_1.autoPxKeys.forEach(key => {
            if (typeof ret[key] === 'number') {
                ret[key] = `${ret[key]}px`;
            }
        });
        return ret;
    }
}
exports.Styles = Styles;
Styles.csses = new Map();
Styles.pendings = new Map;

},{"../utils":13,"./StyleType":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = exports.Ref = void 0;
const EventType_1 = require("../Events/EventType");
const FocusOb_1 = require("../Observer/FocusOb");
const HoverOb_1 = require("../Observer/HoverOb");
const Styles_1 = require("./Styles");
class Ref {
    constructor() {
        this.current = null;
    }
}
exports.Ref = Ref;
class View {
    static ref() {
        return new Ref();
    }
    static get(ele) {
        var _a;
        if (!ele) {
            return null;
        }
        return (_a = View.try(ele, View)) !== null && _a !== void 0 ? _a : new View(ele);
    }
    static try(ele, cls) {
        var _a;
        if (!ele) {
            return null;
        }
        const view = (_a = ele[View.RAW_KEY_IN_ELEMENT]) !== null && _a !== void 0 ? _a : null;
        cls = cls !== null && cls !== void 0 ? cls : View;
        return (view instanceof cls) ? view : null;
    }
    get hover() { return this.hoverOb.hover; }
    get hoverOb() {
        var _a;
        this._hoverOb = (_a = this._hoverOb) !== null && _a !== void 0 ? _a : new HoverOb_1.HoverOb(this.inner).setCallback(v => this.onHover(v));
        return this._hoverOb;
    }
    get focused() { return this.focusOb.focused; }
    get focusOb() {
        var _a;
        this._focusOb = (_a = this._focusOb) !== null && _a !== void 0 ? _a : new FocusOb_1.FocusOb(this.inner, v => this.onFocus(v));
        return this._focusOb;
    }
    get styles() {
        var _a;
        this._styles = (_a = this._styles) !== null && _a !== void 0 ? _a : new Styles_1.Styles(this);
        return this._styles;
    }
    get inner() { return this._inner; }
    get id() { return this.inner.id; }
    set id(v) { this.inner.id = v; }
    get parent() { return View.get(this.inner.parentElement); }
    get children() { return Array.from(this.inner.children).map(v => View.get(v)); }
    get lastChild() { return View.get(this.inner.children[this.inner.children.length - 1]); }
    get firstChild() { return View.get(this.inner.children[0]); }
    get draggable() { return this.inner.draggable; }
    set draggable(v) { this.inner.draggable = v; }
    get nextSibling() { return View.get(this.inner.nextElementSibling); }
    get prevSibling() { return View.get(this.inner.previousElementSibling); }
    constructor(arg0, innerText) {
        var _a, _b;
        if (arg0 === 'body') {
            this._inner = (_a = document.body) !== null && _a !== void 0 ? _a : document.createElement('body');
        }
        else if (arg0 === 'head') {
            this._inner = (_b = document.head) !== null && _b !== void 0 ? _b : document.createElement('head');
        }
        else if (typeof arg0 === 'string') {
            this._inner = document.createElement(arg0);
        }
        else {
            this._inner = arg0;
        }
        this.inner[View.RAW_KEY_IN_ELEMENT] = this;
        if (innerText !== undefined) {
            this.inner.innerText = innerText;
        }
    }
    onHover(hover) { }
    onFocus(focused) { }
    onAdded() { }
    onRemoved() { }
    addChild(...children) {
        if (!children.length) {
            return this;
        }
        children = this._prehandleAddedChild(children);
        this.inner.append(...children.map(v => v.inner));
        this._handleAddedChildren(children);
        return this;
    }
    insertBefore(anchorOrIdx, ...children) {
        var _a;
        if (!children.length) {
            return this;
        }
        let anchor = null;
        if (typeof anchorOrIdx === 'number') {
            anchor = (_a = this.inner.children[anchorOrIdx]) !== null && _a !== void 0 ? _a : null;
        }
        else if (anchorOrIdx instanceof View) {
            anchor = anchorOrIdx.inner;
        }
        children = this._prehandleAddedChild(children);
        if (anchor) {
            children.forEach(child => this.inner.insertBefore(child.inner, anchor));
        }
        else {
            this.inner.append(...children.map(v => v.inner));
        }
        this._handleAddedChildren(children);
        return this;
    }
    insertAfter(anchorOrIdx, ...children) {
        var _a;
        if (!children.length) {
            return this;
        }
        let anchor = null;
        if (typeof anchorOrIdx === 'number') {
            anchor = (_a = this.inner.children[anchorOrIdx + 1]) !== null && _a !== void 0 ? _a : null;
        }
        else if (anchorOrIdx instanceof View) {
            anchor = anchorOrIdx.inner.nextSibling;
        }
        children = this._prehandleAddedChild(children);
        if (anchor) {
            children.forEach(child => this.inner.insertBefore(child.inner, anchor));
        }
        else {
            this.inner.append(...children.map(v => v.inner));
        }
        this._handleAddedChildren(children);
        return this;
    }
    removeChild(...children) {
        if (!children.length) {
            return this;
        }
        children = this._prehandleRemovedChildren(children);
        children.forEach(child => this.inner.removeChild(child.inner));
        return this;
    }
    replaceChild(newChild, oldChild) {
        this._prehandleRemovedChildren([newChild]);
        this._prehandleAddedChild([newChild]);
        this.inner.replaceChild(newChild.inner, oldChild.inner);
        this._handleAddedChildren([newChild]);
        return this;
    }
    removeSelf() {
        var _a;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.removeChild(this);
        return this;
    }
    dispatchEvent(arg0) {
        return this.inner.dispatchEvent(arg0);
    }
    addEventListener(arg0, arg1, arg2) {
        this.inner.addEventListener(arg0, arg1, arg2);
        return this;
    }
    removeEventListener(arg0, arg1, arg2) {
        this.inner.removeEventListener(arg0, arg1, arg2);
        return this;
    }
    destory() {
        var _a, _b, _c, _d;
        (_a = this._focusOb) === null || _a === void 0 ? void 0 : _a.destory();
        (_b = this._hoverOb) === null || _b === void 0 ? void 0 : _b.destory();
        (_c = this._styles) === null || _c === void 0 ? void 0 : _c.destory();
        (_d = this._inner) === null || _d === void 0 ? true : delete _d[View.RAW_KEY_IN_ELEMENT];
        delete this._inner;
    }
    _prehandleAddedChild(children) {
        // console.log('[View]_prehandleAddedChild', children)
        children.forEach(child => child.removeSelf());
        return children;
    }
    _prehandleRemovedChildren(children) {
        // console.log('[View]_prehandleRemovedChildren', children)
        children = children.filter(child => child.inner.parentElement === this.inner);
        children.forEach(child => {
            child.inner.dispatchEvent(new Event(EventType_1.ViewEventType.Removed));
            child.onRemoved();
        });
        return children;
    }
    _handleAddedChildren(children) {
        // console.log('[View]_handleAddedChildren', children)
        children.forEach(child => {
            child.inner.dispatchEvent(new Event(EventType_1.ViewEventType.Added));
            child.onAdded();
        });
    }
    setAttribute(qualifiedName, value) {
        this.inner.setAttribute(qualifiedName, value);
        return this;
    }
    apply(handle) {
        handle(this);
        return this;
    }
    ref(ref) {
        ref.current = this;
        return this;
    }
}
exports.View = View;
View.RAW_KEY_IN_ELEMENT = 'g_view';

},{"../Events/EventType":9,"../Observer/FocusOb":11,"../Observer/HoverOb":12,"./Styles":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuEventType = void 0;
var MenuEventType;
(function (MenuEventType) {
    MenuEventType["ItemClick"] = "onItemClick";
})(MenuEventType = exports.MenuEventType || (exports.MenuEventType = {}));

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemView = void 0;
const View_1 = require("../../BaseView/View");
const _1 = require(".");
class MenuItemView extends View_1.View {
    get menu() { return this._menu; }
    get submenu() { return this._submenu; }
    get info() { return this._info; }
    setup(info = this._info) {
        var _a, _b;
        this._info = info;
        if (info.divider) {
            this.styles.setCls('g_menu_item_divider');
        }
        else if (info.danger) {
            this.styles.setCls('g_menu_item_normal', 'g_menu_item_danger');
        }
        else {
            this.styles.setCls('g_menu_item_normal');
        }
        const label = new View_1.View('div');
        label.styles.apply('', { flex: 1 });
        label.inner.innerText = (_a = info.label) !== null && _a !== void 0 ? _a : '';
        this.addChild(label);
        if ((_b = info.items) === null || _b === void 0 ? void 0 : _b.length) {
            const more = document.createElement('div');
            more.style.marginLeft = '5px';
            more.innerText = '>';
            this.inner.appendChild(more);
            this._submenu = new _1.Menu(this._menu.container, info);
        }
        this.hoverOb;
    }
    onHover(hover) {
        var _a;
        if (hover) {
            this.styles.addCls('g_menu_item_hover');
        }
        else {
            this.styles.delCls('g_menu_item_hover');
        }
        if (hover) {
            const { left, top, width, height } = this.inner.getBoundingClientRect();
            (_a = this._submenu) === null || _a === void 0 ? void 0 : _a.move(left + width, top).show();
        }
    }
    constructor(menu, info) {
        super('div');
        this._menu = menu;
        this._info = info;
        this.setup();
    }
}
exports.MenuItemView = MenuItemView;

},{".":8,"../../BaseView/View":5}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const Styles_1 = require("../../BaseView/Styles");
const View_1 = require("../../BaseView/View");
const HoverOb_1 = require("../../Observer/HoverOb");
const utils_1 = require("../../utils");
const Events_1 = require("./Events");
const ItemView_1 = require("./ItemView");
class Menu extends View_1.View {
    get container() { return this._container; }
    constructor(container, inits) {
        var _a, _b;
        super('div');
        this._items = [];
        this._zIndex = 9999;
        Styles_1.Styles.css('./g_menu.css');
        this._container = container;
        this._zIndex = (_a = inits === null || inits === void 0 ? void 0 : inits.zIndex) !== null && _a !== void 0 ? _a : this._zIndex;
        this.styles.addCls('g_menu');
        this.setup((_b = inits === null || inits === void 0 ? void 0 : inits.items) !== null && _b !== void 0 ? _b : []);
        window.addEventListener('pointerdown', e => {
            if ((0, utils_1.findParent)(e.target, ele => !!View_1.View.try(ele, Menu))) {
                return;
            }
            this.hide();
        }, true);
        window.addEventListener('blur', () => this.hide());
    }
    addEventListener(arg0, arg1, arg2) {
        return super.addEventListener(arg0, arg1, arg2);
    }
    removeEventListener(arg0, arg1, arg2) {
        return super.removeEventListener(arg0, arg1, arg2);
    }
    dispatchEvent(arg0) {
        return super.dispatchEvent(arg0);
    }
    setup(items) {
        this._items.forEach(item => {
            var _a, _b;
            item.removeEventListener('click', this._onitemclick);
            (_a = item.submenu) === null || _a === void 0 ? void 0 : _a.removeEventListener(Events_1.MenuEventType.ItemClick, this._onsubmenuitemclick);
            (_b = item.submenu) === null || _b === void 0 ? void 0 : _b.removeSelf();
            this.removeChild(item);
        });
        this._items = items.map(info => {
            var _a;
            this._onitemclick = () => {
                this.dispatchEvent(new CustomEvent(Events_1.MenuEventType.ItemClick, { detail: info }));
                this.hide();
            };
            this._onsubmenuitemclick = (e) => {
                this.dispatchEvent(new CustomEvent(Events_1.MenuEventType.ItemClick, { detail: e.detail }));
                this.hide();
            };
            const view = new ItemView_1.MenuItemView(this, Object.assign(Object.assign({}, info), { zIndex: this._zIndex + 1 }));
            this.addChild(view);
            view.addEventListener('click', this._onitemclick);
            (_a = view.submenu) === null || _a === void 0 ? void 0 : _a.addEventListener(Events_1.MenuEventType.ItemClick, this._onsubmenuitemclick);
            new HoverOb_1.HoverOb(view.inner).setCallback((hover) => {
                if (!hover) {
                    return;
                }
                this._items.forEach(other => {
                    var _a;
                    if (other === view) {
                        return;
                    }
                    (_a = other.submenu) === null || _a === void 0 ? void 0 : _a.hide();
                });
            });
            return view;
        });
        return this;
    }
    move(x, y) {
        this._items.forEach(item => { var _a; return (_a = item.submenu) === null || _a === void 0 ? void 0 : _a.hide(); });
        this.styles.apply('', v => (Object.assign(Object.assign({}, v), { left: x, top: y })));
        return this;
    }
    show() {
        this.styles.apply('', v => (Object.assign(Object.assign({}, v), { display: 'flex', zIndex: this._zIndex })));
        this.container.addChild(this);
        return this;
    }
    hide() {
        this._items.forEach(item => { var _a; return (_a = item.submenu) === null || _a === void 0 ? void 0 : _a.hide(); });
        this.styles.forgo('');
        this.removeSelf();
        return this;
    }
}
exports.Menu = Menu;
Menu.EventType = Events_1.MenuEventType;

},{"../../BaseView/Styles":4,"../../BaseView/View":5,"../../Observer/HoverOb":12,"../../utils":13,"./Events":6,"./ItemView":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockableEventType = exports.ViewEventType = exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType["ViewDragStart"] = "viewdragstart";
    EventType["ViewDragging"] = "viewdrag";
    EventType["ViewDragEnd"] = "viewdragend";
})(EventType = exports.EventType || (exports.EventType = {}));
var ViewEventType;
(function (ViewEventType) {
    ViewEventType["Added"] = "viewadded";
    ViewEventType["Removed"] = "viewremoved";
})(ViewEventType = exports.ViewEventType || (exports.ViewEventType = {}));
var DockableEventType;
(function (DockableEventType) {
    DockableEventType["Docked"] = "docked";
    DockableEventType["Undocked"] = "undocked";
})(DockableEventType = exports.DockableEventType || (exports.DockableEventType = {}));

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonGroup = exports.ButtonGroupMode = void 0;
var ButtonGroupMode;
(function (ButtonGroupMode) {
    ButtonGroupMode[ButtonGroupMode["None"] = 0] = "None";
    ButtonGroupMode[ButtonGroupMode["Single"] = 1] = "Single";
    ButtonGroupMode[ButtonGroupMode["Multipy"] = 2] = "Multipy";
})(ButtonGroupMode = exports.ButtonGroupMode || (exports.ButtonGroupMode = {}));
class ButtonGroup {
    set onClick(v) { this._onClick = v; }
    constructor(inits) {
        this._mode = ButtonGroupMode.Single;
        this._buttons = [];
        this._listeners = new Map();
        this._handleClick = (target) => {
            var _a;
            switch (this._mode) {
                case ButtonGroupMode.Single:
                    this._buttons.forEach(btn => btn.checked = target === btn);
                    break;
            }
            (_a = this._onClick) === null || _a === void 0 ? void 0 : _a.call(this, target);
        };
        if (inits === null || inits === void 0 ? void 0 : inits.buttons)
            this.addButton(...inits.buttons);
    }
    addButton(...buttons) {
        this._buttons.forEach(btn => {
            const l = this._listeners.get(btn);
            if (l) {
                btn.inner.removeEventListener('click', l);
            }
        });
        this._buttons = Array.from(new Set(this._buttons.concat(buttons)));
        this._buttons.forEach(btn => {
            const l = () => this._handleClick(btn);
            this._listeners.set(btn, l);
            btn.inner.addEventListener('click', l);
        });
    }
}
exports.ButtonGroup = ButtonGroup;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusOb = void 0;
class FocusOb {
    get focused() { return this._focused; }
    get disabled() { return this._disabled; }
    set disabled(v) {
        if (this._disabled === v) {
            return;
        }
        this._disabled = v;
        if (v) {
            this._ele.removeEventListener('focus', this._focus);
            this._ele.removeEventListener('blur', this._blur);
        }
        else {
            this._ele.addEventListener('focus', this._focus);
            this._ele.addEventListener('blur', this._blur);
        }
    }
    constructor(ele, cb) {
        this._focused = false;
        this._disabled = true;
        this._ele = ele;
        this._focus = (e) => { this._focused = true; cb(this._focused, e); };
        this._blur = (e) => { this._focused = false; cb(this._focused, e); };
        this.disabled = false;
    }
    destory() { this.disabled = true; }
}
exports.FocusOb = FocusOb;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverOb = void 0;
class HoverOb {
    get target() { return this._target; }
    set target(v) { v && this.setTarget(v); }
    get hover() {
        if (!this._target) {
            return;
        }
        if (getComputedStyle(this._target).pointerEvents === 'none') {
            return false;
        }
        else {
            return this._hover;
        }
    }
    get disabled() { return this._disabled; }
    set disabled(v) { this.setDisabled(v); }
    constructor(target) {
        this._disabled = false;
        this._hover = false;
        this._mouseenter = (e) => {
            var _a;
            this._hover = true;
            (_a = this._callback) === null || _a === void 0 ? void 0 : _a.call(this, this._hover, e);
        };
        this._mouseleave = (e) => {
            var _a;
            this._hover = false;
            (_a = this._callback) === null || _a === void 0 ? void 0 : _a.call(this, this._hover, e);
        };
        this.target = target;
    }
    setTarget(target) {
        if (this._target) {
            this._target.removeEventListener('mouseenter', this._mouseenter);
            this._target.removeEventListener('mouseleave', this._mouseleave);
        }
        this._target = target;
        if (!this._disabled && this._target) {
            this._target.addEventListener('mouseenter', this._mouseenter);
            this._target.addEventListener('mouseleave', this._mouseleave);
        }
        return this;
    }
    setDisabled(disabled) {
        var _a, _b, _c, _d;
        if (this._disabled === disabled) {
            return this;
        }
        this._disabled = disabled;
        if (disabled) {
            this._hover = false;
            (_a = this._target) === null || _a === void 0 ? void 0 : _a.removeEventListener('mouseenter', this._mouseenter);
            (_b = this._target) === null || _b === void 0 ? void 0 : _b.removeEventListener('mouseleave', this._mouseleave);
        }
        else {
            (_c = this._target) === null || _c === void 0 ? void 0 : _c.addEventListener('mouseenter', this._mouseenter);
            (_d = this._target) === null || _d === void 0 ? void 0 : _d.addEventListener('mouseleave', this._mouseleave);
        }
        return this;
    }
    setCallback(callback) {
        this._callback = callback;
        return this;
    }
    destory() {
        var _a, _b;
        (_a = this._target) === null || _a === void 0 ? void 0 : _a.removeEventListener('mouseenter', this._mouseenter);
        (_b = this._target) === null || _b === void 0 ? void 0 : _b.removeEventListener('mouseleave', this._mouseleave);
        this.disabled = true;
        delete this._target;
        delete this._callback;
    }
}
exports.HoverOb = HoverOb;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findParent = exports.reValue = exports.getValue = void 0;
function getValue(v) {
    return (typeof v !== 'function') ? v : v();
}
exports.getValue = getValue;
function reValue(next, prev) {
    return (typeof next !== 'function') ? next : next(prev);
}
exports.reValue = reValue;
function findParent(any, check) {
    if (any instanceof HTMLElement) {
        let ret = any.parentElement;
        while (ret && !check(ret)) {
            ret = ret.parentElement;
        }
        return ret;
    }
    return null;
}
exports.findParent = findParent;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shiftable = void 0;
class Shiftable {
    constructor(list) {
        this._i = -1;
        this._list = list;
    }
    set(list) {
        this._list = list;
        return this;
    }
    next() {
        this._i = (this._i + 1) % this._list.length;
        return this._list[this._i];
    }
}
exports.Shiftable = Shiftable;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortcutsKeeper = exports.ShortcutKind = void 0;
const dist_1 = require("../../dist");
const features_1 = require("../../dist/features");
var ShortcutKind;
(function (ShortcutKind) {
    ShortcutKind[ShortcutKind["None"] = 0] = "None";
    ShortcutKind["Ctrl"] = "ctrl";
    ShortcutKind["Shift"] = "shift";
    ShortcutKind["Alt"] = "alt";
    ShortcutKind["Single"] = "single";
})(ShortcutKind = exports.ShortcutKind || (exports.ShortcutKind = {}));
var BehaviorEnum;
(function (BehaviorEnum) {
    BehaviorEnum[BehaviorEnum["Copy"] = 1] = "Copy";
    BehaviorEnum[BehaviorEnum["Cut"] = 2] = "Cut";
    BehaviorEnum[BehaviorEnum["Paste"] = 3] = "Paste";
    BehaviorEnum[BehaviorEnum["Delete"] = 4] = "Delete";
    BehaviorEnum[BehaviorEnum["SelectAll"] = 5] = "SelectAll";
    BehaviorEnum[BehaviorEnum["Deselect"] = 6] = "Deselect";
    BehaviorEnum[BehaviorEnum["ToggleLock"] = 7] = "ToggleLock";
    BehaviorEnum[BehaviorEnum["Undo"] = 8] = "Undo";
    BehaviorEnum[BehaviorEnum["Redo"] = 9] = "Redo";
    BehaviorEnum[BehaviorEnum["MoveShapesUp"] = 10] = "MoveShapesUp";
    BehaviorEnum[BehaviorEnum["MoveShapesDown"] = 11] = "MoveShapesDown";
    BehaviorEnum[BehaviorEnum["MoveShapesLeft"] = 12] = "MoveShapesLeft";
    BehaviorEnum[BehaviorEnum["MoveShapesRight"] = 13] = "MoveShapesRight";
    BehaviorEnum[BehaviorEnum["MoveShapesUpABit"] = 14] = "MoveShapesUpABit";
    BehaviorEnum[BehaviorEnum["MoveShapesDownABit"] = 15] = "MoveShapesDownABit";
    BehaviorEnum[BehaviorEnum["MoveShapesLeftABit"] = 16] = "MoveShapesLeftABit";
    BehaviorEnum[BehaviorEnum["MoveShapesRightABit"] = 17] = "MoveShapesRightABit";
    BehaviorEnum[BehaviorEnum["MoveShapesUpMore"] = 18] = "MoveShapesUpMore";
    BehaviorEnum[BehaviorEnum["MoveShapesDownMore"] = 19] = "MoveShapesDownMore";
    BehaviorEnum[BehaviorEnum["MoveShapesLeftMore"] = 20] = "MoveShapesLeftMore";
    BehaviorEnum[BehaviorEnum["MoveShapesRightMore"] = 21] = "MoveShapesRightMore";
    BehaviorEnum[BehaviorEnum["ToolSelector"] = 22] = "ToolSelector";
    BehaviorEnum[BehaviorEnum["ToolPen"] = 23] = "ToolPen";
    BehaviorEnum[BehaviorEnum["ToolRect"] = 24] = "ToolRect";
    BehaviorEnum[BehaviorEnum["ToolOval"] = 25] = "ToolOval";
    BehaviorEnum[BehaviorEnum["ToolText"] = 26] = "ToolText";
    BehaviorEnum[BehaviorEnum["ToolTick"] = 27] = "ToolTick";
    BehaviorEnum[BehaviorEnum["ToolCross"] = 28] = "ToolCross";
    BehaviorEnum[BehaviorEnum["ToolHalfTick"] = 29] = "ToolHalfTick";
    BehaviorEnum[BehaviorEnum["ToolLines"] = 30] = "ToolLines";
})(BehaviorEnum || (BehaviorEnum = {}));
class ShortcutsKeeper {
    get board() { return this._board; }
    get actionQueue() { return this._actionQueue; }
    constructor(board, actionQueue) {
        this.undo = () => {
            this.actionQueue.canUndo && this.actionQueue.undo();
            return true;
        };
        this.redo = () => {
            this.actionQueue.canRedo && this.actionQueue.redo();
            return true;
        };
        this.moveShapes = (e) => {
            const { board } = this;
            const { selects, toolType } = board;
            if (!selects) {
                return true;
            }
            if (toolType !== dist_1.ToolEnum.Selector) {
                board.toolType = dist_1.ToolEnum.Selector;
            }
            ;
            let diffX = 0;
            let diffY = 0;
            /*
            按着shift移动50像素
            按着alt移动1像素
            否则移动5像素
            */
            let diff = e.shiftKey ? 50 : e.altKey ? 1 : 5;
            switch (e.key) {
                case 'ArrowUp':
                    diffY = -diff;
                    break;
                case 'ArrowDown':
                    diffY = diff;
                    break;
                case 'ArrowLeft':
                    diffX = -diff;
                    break;
                case 'ArrowRight':
                    diffX = diff;
                    break;
                default: return true;
            }
            const selector = board.tool;
            selector.connect(selects).moveBy(diffX, diffY).emitGeoEvent(true);
            board.toolType = toolType;
            board.setSelects(selects, true); // 切回其他工具时，会自动取消选择，这里重新选择已选择的图形
            return false;
        };
        this.handleKeyboardEvent = (e) => {
            var _a;
            const kind = this.shortcutKind(e);
            if (!kind)
                return;
            const behavior = (_a = this.keys.get(kind)) === null || _a === void 0 ? void 0 : _a.get(e.key);
            if (!behavior)
                return;
            const func = this.behaviors[behavior];
            if (func(e) === true) {
                return;
            } // func返回true时，意味着不要拦截默认事件。
            e.stopPropagation();
            e.preventDefault();
        };
        this.descriptions = {
            [BehaviorEnum.Copy]: "复制",
            [BehaviorEnum.Cut]: "剪切",
            [BehaviorEnum.Paste]: "粘贴",
            [BehaviorEnum.Delete]: "删除",
            [BehaviorEnum.SelectAll]: "全选",
            [BehaviorEnum.Deselect]: "取消选择",
            [BehaviorEnum.ToggleLock]: "锁定/解锁图形",
            [BehaviorEnum.Undo]: "撤销",
            [BehaviorEnum.Redo]: "重做",
            [BehaviorEnum.MoveShapesUp]: "向上移动图形",
            [BehaviorEnum.MoveShapesDown]: "向下移动图形",
            [BehaviorEnum.MoveShapesLeft]: "向左移动图形",
            [BehaviorEnum.MoveShapesRight]: "向右移动图形",
            [BehaviorEnum.MoveShapesUpABit]: "向上移动图形",
            [BehaviorEnum.MoveShapesDownABit]: "向下移动图形",
            [BehaviorEnum.MoveShapesLeftABit]: "向左移动图形",
            [BehaviorEnum.MoveShapesRightABit]: "向右移动图形",
            [BehaviorEnum.MoveShapesUpMore]: "向上移动图形",
            [BehaviorEnum.MoveShapesDownMore]: "向下移动图形",
            [BehaviorEnum.MoveShapesLeftMore]: "向左移动图形",
            [BehaviorEnum.MoveShapesRightMore]: "向右移动图形",
            [BehaviorEnum.ToolSelector]: "切换工具：选择器",
            [BehaviorEnum.ToolPen]: "切换工具：笔",
            [BehaviorEnum.ToolRect]: "切换工具：矩形",
            [BehaviorEnum.ToolOval]: "切换工具：椭圆",
            [BehaviorEnum.ToolText]: "切换工具：文本",
            [BehaviorEnum.ToolTick]: "切换工具：打钩",
            [BehaviorEnum.ToolCross]: "切换工具：打叉",
            [BehaviorEnum.ToolHalfTick]: "切换工具：打半对",
            [BehaviorEnum.ToolLines]: "切换工具：直线",
        };
        this.behaviors = {
            [BehaviorEnum.Copy]: () => { this._clipboard.copy(); },
            [BehaviorEnum.Cut]: () => { this._clipboard.cut(); },
            [BehaviorEnum.Paste]: () => { this._clipboard.paste(); },
            [BehaviorEnum.Delete]: () => this.board.removeSelected(true),
            [BehaviorEnum.SelectAll]: () => { this.selectAll(); },
            [BehaviorEnum.Deselect]: () => { this.deselect(); },
            [BehaviorEnum.ToggleLock]: () => { this.toggleShapeLocks(); },
            [BehaviorEnum.Undo]: this.undo,
            [BehaviorEnum.Redo]: this.redo,
            [BehaviorEnum.MoveShapesUp]: this.moveShapes,
            [BehaviorEnum.MoveShapesDown]: this.moveShapes,
            [BehaviorEnum.MoveShapesLeft]: this.moveShapes,
            [BehaviorEnum.MoveShapesRight]: this.moveShapes,
            [BehaviorEnum.MoveShapesUpABit]: this.moveShapes,
            [BehaviorEnum.MoveShapesDownABit]: this.moveShapes,
            [BehaviorEnum.MoveShapesLeftABit]: this.moveShapes,
            [BehaviorEnum.MoveShapesRightABit]: this.moveShapes,
            [BehaviorEnum.MoveShapesUpMore]: this.moveShapes,
            [BehaviorEnum.MoveShapesDownMore]: this.moveShapes,
            [BehaviorEnum.MoveShapesLeftMore]: this.moveShapes,
            [BehaviorEnum.MoveShapesRightMore]: this.moveShapes,
            [BehaviorEnum.ToolSelector]: () => this.board.setToolType(dist_1.ToolEnum.Selector),
            [BehaviorEnum.ToolPen]: () => this.board.setToolType(dist_1.ToolEnum.Pen),
            [BehaviorEnum.ToolRect]: () => this.board.setToolType(dist_1.ToolEnum.Rect),
            [BehaviorEnum.ToolOval]: () => this.board.setToolType(dist_1.ToolEnum.Oval),
            [BehaviorEnum.ToolText]: () => this.board.setToolType(dist_1.ToolEnum.Text),
            [BehaviorEnum.ToolTick]: () => this.board.setToolType(dist_1.ToolEnum.Tick),
            [BehaviorEnum.ToolCross]: () => this.board.setToolType(dist_1.ToolEnum.Cross),
            [BehaviorEnum.ToolHalfTick]: () => this.board.setToolType(dist_1.ToolEnum.HalfTick),
            [BehaviorEnum.ToolLines]: () => this.board.setToolType(dist_1.ToolEnum.Lines),
        };
        this.keys = new Map([
            [ShortcutKind.Ctrl, new Map([
                    ['c', BehaviorEnum.Copy],
                    ['x', BehaviorEnum.Cut],
                    ['v', BehaviorEnum.Paste],
                    ['a', BehaviorEnum.SelectAll],
                    ['d', BehaviorEnum.Deselect],
                    ['l', BehaviorEnum.ToggleLock],
                    ['z', BehaviorEnum.Undo],
                    ['y', BehaviorEnum.Redo]
                ])],
            [ShortcutKind.Shift, new Map([
                    ['ArrowUp', BehaviorEnum.MoveShapesUpMore],
                    ['ArrowDown', BehaviorEnum.MoveShapesDownMore],
                    ['ArrowLeft', BehaviorEnum.MoveShapesLeftMore],
                    ['ArrowRight', BehaviorEnum.MoveShapesRightMore],
                ])],
            [ShortcutKind.Alt, new Map([
                    ['ArrowUp', BehaviorEnum.MoveShapesUpABit],
                    ['ArrowDown', BehaviorEnum.MoveShapesDownABit],
                    ['ArrowLeft', BehaviorEnum.MoveShapesLeftABit],
                    ['ArrowRight', BehaviorEnum.MoveShapesRightABit],
                ])],
            [ShortcutKind.Single, new Map([
                    ['Delete', BehaviorEnum.Delete],
                    ['s', BehaviorEnum.ToolSelector],
                    ['p', BehaviorEnum.ToolPen],
                    ['r', BehaviorEnum.ToolRect],
                    ['o', BehaviorEnum.ToolOval],
                    ['t', BehaviorEnum.ToolText],
                    ['z', BehaviorEnum.ToolTick],
                    ['c', BehaviorEnum.ToolCross],
                    ['x', BehaviorEnum.ToolHalfTick],
                    ['l', BehaviorEnum.ToolLines],
                    ['ArrowUp', BehaviorEnum.MoveShapesUp],
                    ['ArrowDown', BehaviorEnum.MoveShapesDown],
                    ['ArrowLeft', BehaviorEnum.MoveShapesLeft],
                    ['ArrowRight', BehaviorEnum.MoveShapesRight],
                ])]
        ]);
        this.shortcuts = (() => {
            const ret = new Map();
            this.keys.forEach((v0, shortcutKind) => v0.forEach((behavior, key) => {
                var _a;
                ret.set(behavior, [shortcutKind, key, (_a = this.descriptions[behavior]) !== null && _a !== void 0 ? _a : ""]);
            }));
            return ret;
        })();
        this._board = board;
        this._actionQueue = actionQueue;
        this._clipboard = new features_1.FClipboard(board);
    }
    selectAll() {
        this.board.selectAll(true);
    }
    deselect() {
        this.board.deselect(true);
    }
    toggleShapeLocks() {
        const { selects } = this.board;
        if (!selects) {
            return;
        }
        const locked = !selects.find(v => !v.locked);
        selects.forEach(v => v.locked = !locked);
    }
    shortcutKind(e) {
        if (e.ctrlKey && !e.shiftKey && !e.altKey)
            return ShortcutKind.Ctrl; // 快捷键： ctrl + key
        else if (!e.ctrlKey && e.shiftKey && !e.altKey)
            return ShortcutKind.Shift; // 快捷键： alt + key
        else if (!e.ctrlKey && !e.shiftKey && e.altKey)
            return ShortcutKind.Alt; // 快捷键： alt + key
        return ShortcutKind.Single; // 快捷键： key
    }
}
exports.ShortcutsKeeper = ShortcutsKeeper;

},{"../../dist":31,"../../dist/features":28}],16:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("../../dist");
const event_1 = require("../../dist/event");
const Button_1 = require("./G/BaseView/Button");
const SizeType_1 = require("./G/BaseView/SizeType");
const Styles_1 = require("./G/BaseView/Styles");
const View_1 = require("./G/BaseView/View");
const Menu_1 = require("./G/CompoundView/Menu");
const ButtonGroup_1 = require("./G/Helper/ButtonGroup");
const Shiftable_1 = require("./Shiftable");
const Shortcuts_1 = require("./Shortcuts");
const Gim = __importStar(require("../../dist"));
View_1.View.get(document.head).addChild(new View_1.View('title', '每日一句'), new View_1.View('link')
    .setAttribute('rel', 'icon')
    .setAttribute('sizes', '16x16')
    .setAttribute('href', './calendar_phrases/logo.png'));
Styles_1.Styles.css('./calendar_phrases/styles/index.css', './calendar_phrases/styles/edit_panel.css').then(() => main());
function main() {
    const resultWidth = 600;
    const resultHeight = 600;
    const factory = dist_1.Gaia.factory(dist_1.FactoryEnum.Default)();
    const ffn = factory.fontFamilies().map(ff => ff + ' = ' + factory.fontName(ff));
    console.log('可用字体：', ffn);
    const mainView = View_1.View.ref();
    const blackboard = View_1.View.ref();
    View_1.View.get(document.body)
        .ref(mainView)
        .styles
        .addCls('g_cp_main_view')
        .view
        .addChild(View_1.View.get('div')
        .styles.addCls('g_cp_content_zone').view
        .addChild(View_1.View.get('div')
        .ref(blackboard)
        .styles
        .addCls('g_cp_blackboard')
        .apply('size', {
        width: resultWidth,
        height: resultHeight,
    })
        .view));
    let MenuKey;
    (function (MenuKey) {
        MenuKey["SelectAll"] = "SelectAll";
        MenuKey["RemoveSelected"] = "RemoveSelected";
        MenuKey["Deselect"] = "Deselect";
        MenuKey["ClearUp"] = "ClearUp";
        MenuKey["InsertImage"] = "InsertImage";
        MenuKey["ExportResult"] = "ExportResult";
    })(MenuKey || (MenuKey = {}));
    dist_1.Gaia.editToolInfo(dist_1.ToolEnum.Cross, v => (Object.assign(Object.assign({}, v), { name: '打叉' })));
    dist_1.Gaia.editToolInfo(dist_1.ToolEnum.HalfTick, v => (Object.assign(Object.assign({}, v), { name: '半对' })));
    dist_1.Gaia.editToolInfo(dist_1.ToolEnum.Img, v => (Object.assign(Object.assign({}, v), { name: '图片' })));
    dist_1.Gaia.editToolInfo(dist_1.ToolEnum.Lines, v => (Object.assign(Object.assign({}, v), { name: '直线' })));
    dist_1.Gaia.editToolInfo(dist_1.ToolEnum.Oval, v => (Object.assign(Object.assign({}, v), { name: '椭圆' })));
    dist_1.Gaia.editToolInfo(dist_1.ToolEnum.Pen, v => (Object.assign(Object.assign({}, v), { name: '笔' })));
    dist_1.Gaia.editToolInfo(dist_1.ToolEnum.Polygon, v => (Object.assign(Object.assign({}, v), { name: '多边形' })));
    dist_1.Gaia.editToolInfo(dist_1.ToolEnum.Rect, v => (Object.assign(Object.assign({}, v), { name: '矩形' })));
    dist_1.Gaia.editToolInfo(dist_1.ToolEnum.Selector, v => (Object.assign(Object.assign({}, v), { name: '选择器' })));
    dist_1.Gaia.editToolInfo(dist_1.ToolEnum.Text, v => (Object.assign(Object.assign({}, v), { name: '文本' })));
    dist_1.Gaia.editToolInfo(dist_1.ToolEnum.Tick, v => (Object.assign(Object.assign({}, v), { name: '打钩' })));
    const menu = new Menu_1.Menu(mainView.current).setup([{
            label: '工具',
            items: dist_1.Gaia.listTools()
                .filter(v => v !== dist_1.ToolEnum.Img && v !== dist_1.ToolEnum.Polygon)
                .map(v => { var _a, _b; return ({ key: v, label: (_b = (_a = dist_1.Gaia.toolInfo(v)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : v }); })
        }, {
            divider: true
        }, {
            key: MenuKey.InsertImage,
            label: '插入图片'
        }, {
            divider: true
        }, {
            key: MenuKey.ExportResult,
            label: '生成图片'
        }, {
            divider: true
        }, {
            key: MenuKey.SelectAll,
            label: '全选'
        }, {
            key: MenuKey.Deselect,
            label: '取消选择'
        }, {
            key: MenuKey.RemoveSelected,
            label: '删除选择'
        }, {
            divider: true
        }, {
            key: MenuKey.ClearUp,
            label: '删除全部',
            danger: true,
        }]);
    menu.addEventListener(Menu_1.Menu.EventType.ItemClick, (e) => {
        switch (e.detail.key) {
            case dist_1.ToolEnum.Rect:
            case dist_1.ToolEnum.Oval:
            case dist_1.ToolEnum.Pen:
            case dist_1.ToolEnum.Polygon:
            case dist_1.ToolEnum.Text:
            case dist_1.ToolEnum.Selector:
            case dist_1.ToolEnum.Tick:
            case dist_1.ToolEnum.Cross:
            case dist_1.ToolEnum.HalfTick:
            case dist_1.ToolEnum.Lines:
            case dist_1.ToolEnum.Img:
                board.setToolType(e.detail.key);
                break;
            case MenuKey.SelectAll:
                board.selectAll(true);
                break;
            case MenuKey.Deselect:
                board.deselect(true);
                break;
            case MenuKey.RemoveSelected:
                board.removeSelected(true);
                break;
            case MenuKey.ClearUp:
                board.removeAll(true);
                break;
            case MenuKey.InsertImage: {
                const input = document.createElement('input');
                input.accept = '.png,.jpeg,.jpg';
                input.type = 'file';
                input.multiple = true;
                input.title = '选择图片';
                input.onchange = () => {
                    const { files } = input;
                    if (!files) {
                        return;
                    }
                    for (let i = 0; i < files.length; ++i) {
                        const file = files.item(i);
                        if (!file) {
                            continue;
                        }
                        const img = new Image();
                        img.src = URL.createObjectURL(file);
                        img.onload = () => {
                            const shape = board.factory.newShape(dist_1.ShapeEnum.Img);
                            shape.data.src = img.src;
                            shape.data.w = img.naturalWidth;
                            shape.data.h = img.naturalHeight;
                            shape.data.layer = board.layer().id;
                            shape.data.objectFit = dist_1.ObjectFit.Cover;
                            board.add(shape, true);
                        };
                    }
                };
                input.click();
                break;
            }
            case MenuKey.ExportResult: {
                download();
                break;
            }
        }
    });
    const resize = () => {
        const { width } = mainView.current.inner.getBoundingClientRect();
        blackboard.current.styles.apply('transform', {
            transform: `translate(-50%,-50%) scale(${Math.min(1, width / resultWidth)})`
        });
    };
    window.addEventListener('resize', resize);
    resize();
    const board = factory.newWhiteBoard({
        width: resultWidth,
        height: resultHeight,
        element: blackboard.current.inner,
    });
    const aq = new dist_1.ActionQueue().setActor(board);
    const rec = new dist_1.Recorder().setActor(board);
    const sc = new dist_1.Player();
    const updateEditPanel = () => {
        let needFill = false;
        let needStroke = false;
        let needText = false;
        let needImg = false;
        let lineWidth = null;
        let fontSize = null;
        board.selects.forEach(shape => {
            needFill = needFill || shape.data.needFill;
            needStroke = needStroke || shape.data.needStroke;
            needText = needText || shape.data.type === dist_1.ShapeEnum.Text;
            needImg = needImg || shape.data.type === dist_1.ShapeEnum.Img;
            if (shape.data.needStroke) {
                const temp = shape.data.lineWidth;
                if (lineWidth === null) {
                    lineWidth = temp;
                }
                else if (lineWidth !== temp) {
                    lineWidth = undefined;
                }
            }
            if (shape.data.type === dist_1.ShapeEnum.Text) {
                const temp = shape.data.font_size;
                if (fontSize === null) {
                    fontSize = temp;
                }
                else if (fontSize !== temp) {
                    fontSize = undefined;
                }
            }
        });
        btnFontSizeDown.disabled = !needText;
        btnFontSizeUp.disabled = !needText;
        btnLineWidthDown.disabled = !needStroke;
        btnLineWidthUp.disabled = !needStroke;
    };
    board.addEventListener(event_1.EventEnum.ShapesSelected, e => updateEditPanel());
    board.addEventListener(event_1.EventEnum.ShapesDeselected, e => updateEditPanel());
    const oncontextmenu = (e) => {
        menu.move(e.x, e.y).show();
        e.stopPropagation();
        e.preventDefault();
    };
    const shortcutsKeeper = new Shortcuts_1.ShortcutsKeeper(board, aq);
    const onkeydown = (e) => {
        shortcutsKeeper.handleKeyboardEvent(e);
        console.log(shortcutsKeeper.shortcuts);
    };
    blackboard.current.addEventListener('keydown', onkeydown);
    blackboard.current.addEventListener('contextmenu', oncontextmenu);
    const init = (ttt) => {
        var _a, _b, _c, _d, _e;
        board.removeAll(false);
        const img_main = ((_a = board.find('img_header')) !== null && _a !== void 0 ? _a : board.factory.newShape(dist_1.ShapeEnum.Img));
        const imgd_main = img_main.data.copy();
        imgd_main.id = 'img_header';
        imgd_main.src = ttt.main_pic.src;
        imgd_main.locked = true;
        imgd_main.x = 0;
        imgd_main.y = 0;
        imgd_main.w = resultWidth;
        imgd_main.h = resultHeight;
        imgd_main.layer = board.layer().id;
        imgd_main.objectFit = dist_1.ObjectFit.Cover;
        img_main.merge(imgd_main);
        img_main.board || board.add(img_main, true);
        const img_logo = ((_b = board.find('img_logo')) !== null && _b !== void 0 ? _b : board.factory.newShape(dist_1.ShapeEnum.Img));
        const imgd_logo = img_logo.data.copy();
        imgd_logo.id = 'img_logo';
        imgd_logo.src = ttt.logo_img.src;
        imgd_logo.w = ttt.logo_img.w;
        imgd_logo.h = ttt.logo_img.h;
        imgd_logo.x = resultWidth - ttt.logo_img.w - 15;
        imgd_logo.y = resultHeight - ttt.logo_img.h - 15;
        imgd_logo.layer = board.layer().id;
        imgd_logo.objectFit = dist_1.ObjectFit.Cover;
        img_logo.merge(imgd_logo);
        img_logo.board || board.add(img_logo, true);
        const txt_main_font_size = 48;
        const txt_main_offset_y = 15;
        const txt_main = ((_c = board.find('txt_content')) !== null && _c !== void 0 ? _c : board.factory.newShape(dist_1.ShapeEnum.Text));
        const txtd_main = txt_main.data.copy();
        txtd_main.id = 'txt_content';
        txtd_main.x = 20;
        txtd_main.y = txt_main_offset_y;
        txtd_main.layer = board.layer().id;
        txtd_main.font_size = txt_main_font_size;
        txtd_main.text = ttt.main_txt.text;
        txt_main.merge(txtd_main);
        txt_main.board || board.add(txt_main, true);
        const txt_week_and_year_bottom = 30;
        const txt_week_and_year_fontsize = 32;
        const txt_date_fontsize = 128;
        const now = new Date();
        const txt_date = ((_d = board.find('txt_date')) !== null && _d !== void 0 ? _d : board.factory.newShape(dist_1.ShapeEnum.Text));
        const txtd_date = txt_date.data.copy();
        txtd_date.id = 'txt_date';
        txtd_date.x = 20;
        txtd_date.y = resultHeight - txt_date_fontsize - txt_week_and_year_fontsize - txt_week_and_year_bottom - 8;
        txtd_date.layer = board.layer().id;
        txtd_date.font_size = txt_date_fontsize;
        txtd_date.text = '' + (now.getMonth() + 1) + '.' + now.getDate();
        txt_date.merge(txtd_date);
        txt_date.merge(txtd_date);
        txt_date.board || board.add(txt_date, true);
        const weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        const txt_week_and_year = ((_e = board.find('txt_week_and_year')) !== null && _e !== void 0 ? _e : board.factory.newShape(dist_1.ShapeEnum.Text));
        const txtd_week_and_year = txt_week_and_year.data.copy();
        txtd_week_and_year.id = 'txt_week_and_year';
        txtd_week_and_year.x = 20;
        txtd_week_and_year.y = resultHeight - txt_week_and_year_fontsize - txt_week_and_year_bottom;
        txtd_week_and_year.layer = board.layer().id;
        txtd_week_and_year.font_size = txt_week_and_year_fontsize;
        txtd_week_and_year.text = weekDay[now.getDay()] + '. ' + now.getFullYear();
        txt_week_and_year.merge(txtd_week_and_year);
        txt_week_and_year.merge(txtd_week_and_year);
        txt_week_and_year.board || board.add(txt_week_and_year, true);
    };
    const templateText = board.factory.shapeTemplate(dist_1.ShapeEnum.Text);
    templateText.font_family = '"Microsoft YaHei", Arial, Helvetica, sans-serif';
    templateText.fillStyle = '#ffffff';
    templateText.strokeStyle = '#000000';
    templateText.font_weight = 'bold';
    templateText.lineWidth = 1;
    const main_pics = new Shiftable_1.Shiftable([
        './calendar_phrases/main_pics/header_0.jpg',
        './calendar_phrases/main_pics/header_1.jpg',
        './calendar_phrases/main_pics/header_2.jpg',
        './calendar_phrases/main_pics/header_3.jpg',
    ]);
    const main_txts = new Shiftable_1.Shiftable([
        '垂死病中惊坐起\n　　　　笑问客从何处来',
        '少壮不努力\n　　　　自挂东南枝叶',
        '长亭外　古道边\n　　　　一行白鹭上青天',
        'hello world',
    ]);
    const builtins = new Shiftable_1.Shiftable([{
            logo_img: { src: './calendar_phrases/logo.png', w: 150, h: 150 },
            main_pic: { src: main_pics.next() },
            main_txt: { text: main_txts.next() }
        }, {
            logo_img: { src: './calendar_phrases/logo.png', w: 150, h: 150 },
            main_pic: { src: main_pics.next() },
            main_txt: { text: main_txts.next() }
        }, {
            logo_img: { src: './calendar_phrases/logo.png', w: 150, h: 150 },
            main_pic: { src: main_pics.next() },
            main_txt: { text: main_txts.next() }
        }, {
            logo_img: { src: './calendar_phrases/logo.png', w: 150, h: 150 },
            main_pic: { src: main_pics.next() },
            main_txt: { text: main_txts.next() }
        }]);
    const btnNext = new Button_1.Button().init({ content: '😒', size: SizeType_1.SizeType.Large, title: '换一个' });
    btnNext.addEventListener('click', () => {
        init(builtins.next());
    });
    btnNext.inner.click();
    const btnExport = new Button_1.Button().init({ content: '💾', size: SizeType_1.SizeType.Large, title: '下载' });
    btnExport.addEventListener('click', () => download());
    const btnFontSizeUp = new Button_1.Button().init({ content: 'A➕', size: SizeType_1.SizeType.Large, title: 'A↑' });
    btnFontSizeUp.disabled = true;
    btnFontSizeUp.addEventListener('click', () => {
        board.selects.forEach(shape => {
            if (shape instanceof dist_1.ShapeText) {
                shape.fontSize = shape.fontSize + 1;
            }
        });
    });
    const btnFontSizeDown = new Button_1.Button().init({ content: 'A➖', size: SizeType_1.SizeType.Large, title: 'A↓' });
    btnFontSizeDown.disabled = true;
    btnFontSizeDown.addEventListener('click', () => {
        board.selects.forEach(shape => {
            if (shape instanceof dist_1.ShapeText) {
                shape.fontSize = Math.max(12, shape.fontSize - 1);
            }
        });
    });
    const btnLineWidthUp = new Button_1.Button().init({ content: 'L➕', size: SizeType_1.SizeType.Large, title: 'A↑' });
    btnLineWidthUp.disabled = true;
    btnLineWidthUp.addEventListener('click', () => {
        board.selects.forEach(shape => {
            if (shape.data.needStroke) {
                shape.lineWidth = shape.lineWidth + 1;
            }
        });
    });
    const btnRemove = new Button_1.Button().init({ content: '🗑️', size: SizeType_1.SizeType.Large, title: '移除' });
    btnRemove.addEventListener('click', () => { board.removeSelected(true); });
    const btnToolPen = new Button_1.Button().init({ content: '✒️', size: SizeType_1.SizeType.Large, title: '工具：笔' });
    btnToolPen.addEventListener('click', () => { board.setToolType(dist_1.ToolEnum.Pen); });
    const btnToolTxt = new Button_1.Button().init({ content: '💬', size: SizeType_1.SizeType.Large, title: '工具：文本' });
    btnToolTxt.addEventListener('click', () => { board.setToolType(dist_1.ToolEnum.Text); });
    const btnToolRect = new Button_1.Button().init({ content: '⬜', size: SizeType_1.SizeType.Large, title: '工具：矩形' });
    btnToolRect.addEventListener('click', () => { board.setToolType(dist_1.ToolEnum.Rect); });
    const btnToolOval = new Button_1.Button().init({ content: '⚪', size: SizeType_1.SizeType.Large, title: '工具：椭圆' });
    btnToolOval.addEventListener('click', () => { board.setToolType(dist_1.ToolEnum.Oval); });
    const btnToolSelector = new Button_1.Button().init({ content: '🖱️', size: SizeType_1.SizeType.Large, title: '工具：选择器' });
    btnToolSelector.addEventListener('click', () => { board.setToolType(dist_1.ToolEnum.Selector); });
    new ButtonGroup_1.ButtonGroup({
        buttons: [btnToolPen, btnToolTxt, btnToolRect, btnToolOval, btnToolSelector]
    });
    const btnLineWidthDown = new Button_1.Button().init({ content: 'L➖', size: SizeType_1.SizeType.Large, title: 'A↓' });
    btnLineWidthDown.disabled = true;
    btnLineWidthDown.addEventListener('click', () => {
        board.selects.forEach(shape => {
            if (shape.data.needStroke) {
                shape.lineWidth = shape.lineWidth - 1;
            }
        });
    });
    const btnRotate1 = new Button_1.Button().init({ content: '↺18°', size: SizeType_1.SizeType.Large, title: '↺18°' });
    btnRotate1.addEventListener('click', () => {
        board.selects.forEach(shape => shape.rotateBy(-Math.PI / 4));
    });
    const btnRotate2 = new Button_1.Button().init({ content: '↻18°', size: SizeType_1.SizeType.Large, title: '↻18°' });
    btnRotate2.addEventListener('click', () => {
        board.selects.forEach(shape => shape.rotateBy(Math.PI / 10));
    });
    const bottomRow = new View_1.View('div');
    bottomRow.styles.addCls('g_cp_content_bottom_row');
    bottomRow.addChild(btnRemove, btnToolPen, btnToolTxt, btnToolRect, btnToolOval, btnToolSelector, btnFontSizeUp, btnFontSizeDown, btnLineWidthUp, btnLineWidthDown, btnRotate1, btnRotate2, btnNext, btnExport);
    bottomRow.addEventListener('pointerdown', e => e.stopPropagation());
    mainView.current.addChild(bottomRow);
    const download = () => {
        board.deselect(true);
        requestAnimationFrame(() => {
            const l = board.layer().onscreen;
            const c = document.createElement('canvas');
            c.width = l.width;
            c.height = l.height;
            c.getContext('2d').fillStyle = 'white';
            c.getContext('2d').fillRect(0, 0, l.width, l.height);
            c.getContext('2d').drawImage(l, 0, 0, l.width, l.height);
            const a = document.createElement('a');
            a.href = c.toDataURL('image/png');
            a.download = '' + Date.now() + '.png';
            a.click();
        });
    };
    board.setToolType(dist_1.ToolEnum.Selector);
    Object.assign(window, {
        board, factory, mainView, Gaia: dist_1.Gaia, menu,
        gim: Gim,
        record: {
            who: rec,
            start: () => rec.stop().start(),
            stop: () => rec.stop()
        },
        player: {
            who: sc,
            play: () => {
                rec.stop();
                const sp = rec.getScreenplay();
                sp && sc.play(board, sp);
            },
            stop: () => sc.stop()
        },
        actions: {
            who: aq,
            undo: () => aq.undo(),
            redo: () => aq.redo(),
        }
    });
}

},{"../../dist":31,"../../dist/event":22,"./G/BaseView/Button":1,"./G/BaseView/SizeType":2,"./G/BaseView/Styles":4,"./G/BaseView/View":5,"./G/CompoundView/Menu":8,"./G/Helper/ButtonGroup":10,"./Shiftable":14,"./Shortcuts":15}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const event_1 = require("../event");
const shape_1 = require("../shape");
const tools_1 = require("../tools");
const utils_1 = require("../utils");
const Layer_1 = require("./Layer");
const Tag = '[Board]';
class Board {
    get whoami() {
        return this._whoami;
    }
    get width() {
        return this._width;
    }
    set width(v) {
        this._width = v;
        this._layers.forEach(l => l.width = v);
    }
    get height() {
        return this._height;
    }
    set height(v) {
        this._height = v;
        this._layers.forEach(l => l.height = v);
    }
    addLayer(layer) {
        if (!layer) {
            layer = this.factory.newLayer();
            this.addLayer(layer);
            return true;
        }
        if (this._layers.has(layer.info.id)) {
            console.error(`[WhiteBoard] addLayer(): layerId already existed! id = ${layer.info.id}`);
            return false;
        }
        if (layer instanceof Layer_1.Layer) {
            layer.width = this.width;
            layer.height = this.height;
            layer.onscreen.style.pointerEvents = 'none';
            this._element.appendChild(layer.onscreen);
            this._layers.set(layer.info.id, layer);
            this.dispatchEvent(new CustomEvent(event_1.EventEnum.LayerAdded, { detail: layer }));
            this.markDirty({ x: 0, y: 0, w: this.width, h: this.height });
        }
        else {
            layer = this.factory.newLayer(layer);
            this.addLayer(layer);
        }
        return true;
    }
    removeLayer(layerId) {
        const layer = this._layers.get(layerId);
        if (!layer) {
            console.error(`[WhiteBoard] removeLayer(): layer not found! id = ${layerId}`);
            return false;
        }
        this._layers.delete(layerId);
        this._element.removeChild(layer.onscreen);
        this.dispatchEvent(new CustomEvent(event_1.EventEnum.LayerRemoved, { detail: layer }));
        return true;
    }
    editLayer(layerId) {
        if (!this._layers.has(layerId)) {
            console.error(`[WhiteBoard] editLayer(): layer not found! id = ${layerId}`);
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
        if (!layers.length) {
            return;
        }
        layers.forEach(v => this.addLayer(v));
        this.editLayer(layers[0].info.id);
    }
    get layers() { return Array.from(this._layers.values()); }
    get element() { return this._element; }
    constructor(factory, options) {
        var _a, _b;
        this._toolType = tools_1.ToolEnum.Pen;
        this._layers = new Map();
        this._mousedown = false;
        this._tools = {};
        this._selects = [];
        this._whoami = 'local';
        this._editingLayerId = '';
        this._width = 512;
        this._height = 512;
        this.pointerdown = (e) => {
            var _a;
            if (e.button !== 0) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            this._mousedown = true;
            (_a = this.tool) === null || _a === void 0 ? void 0 : _a.pointerDown(this.getDot(e));
            e.stopPropagation();
        };
        this.pointermove = (e) => {
            var _a, _b;
            if (this._mousedown) {
                (_a = this.tool) === null || _a === void 0 ? void 0 : _a.pointerDraw(this.getDot(e));
            }
            else {
                (_b = this.tool) === null || _b === void 0 ? void 0 : _b.pointerMove(this.getDot(e));
            }
            e.stopPropagation();
        };
        this.pointerup = (e) => {
            var _a;
            if (!this._mousedown) {
                return;
            }
            this._mousedown = false;
            (_a = this.tool) === null || _a === void 0 ? void 0 : _a.pointerUp(this.getDot(e));
            e.stopPropagation();
        };
        this._factory = factory;
        this._shapesMgr = this._factory.newShapesMgr();
        this._element = (_a = options.element) !== null && _a !== void 0 ? _a : document.createElement('div');
        options.width && (this._width = options.width);
        options.height && (this._height = options.height);
        options.toolType && (this._toolType = options.toolType);
        const layers = (_b = options.layers) !== null && _b !== void 0 ? _b : [];
        if (!layers.length) {
            layers.push({
                info: {
                    id: factory.newLayerId(),
                    name: factory.newLayerName(),
                }
            });
        }
        this.addLayers(layers);
        this._element.addEventListener('pointerdown', this.pointerdown);
        this._element.tabIndex = 0;
        this._element.style.outline = 'none';
        window.addEventListener('pointermove', this.pointermove);
        window.addEventListener('pointerup', this.pointerup);
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
            s: this.shapes().map(v => v.data)
        };
    }
    fromSnapshot(snapshot) {
        this.removeAll(false);
        Array.from(this._layers.keys()).forEach((layerId) => this.removeLayer(layerId));
        this.addLayers(snapshot.l.map(info => ({ info })));
        const shapes = snapshot.s.map((v) => this.factory.newShape(v));
        this.add(shapes, false);
    }
    toJson() {
        return JSON.stringify(this.toSnapshot());
    }
    fromJson(json) {
        this.fromSnapshot(JSON.parse(json));
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
    addEventListener(arg0, arg1, arg2) {
        return this._element.addEventListener(arg0, arg1, arg2);
    }
    removeEventListener(arg0, arg1, arg2) {
        return this._element.removeEventListener(arg0, arg1, arg2);
    }
    dispatchEvent(e) {
        return this._element.dispatchEvent(e);
    }
    emitEvent(k, detail) {
        return this.dispatchEvent(new CustomEvent(k, { detail }));
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
        var _a;
        if (this._toolType === to) {
            /*
            Note：
              使用选择器工具，双击文本编辑文本时，会切换至文本工具。
              这种情况下，文本编辑框失去焦点时，切回选择器工具。
              为了避免使用者在这种状态下，主动选择文本工具后，被切回选择器工具。
              这里将相关回调移除。
            */
            if (this._tool instanceof shape_1.TextTool && this._tool.selectorCallback) {
                this._tool.editor.removeEventListener('blur', this._tool.selectorCallback);
            }
            return;
        }
        const from = this._toolType;
        this._toolType = to;
        this.emitEvent(event_1.EventEnum.ToolChanged, {
            operator: this._whoami,
            from, to
        });
        (_a = this._tool) === null || _a === void 0 ? void 0 : _a.end();
        this._tool = this._factory.newTool(to);
        if (!this._tool) {
            console.error('toolType not supported. got ', to);
            return;
        }
        this._tool.board = this;
        this._tools[to] = this._tool;
        this._tool.start();
    }
    get selects() {
        return this._selects;
    }
    add(shapes, arg1 = false) {
        const emit = typeof arg1 === 'boolean' ? arg1 : arg1.emit !== false;
        const operator = typeof arg1 === 'boolean' ? this._whoami : arg1.operator;
        shapes = Array.isArray(shapes) ? shapes : [shapes];
        if (!shapes.length)
            return 0;
        const ret = this._shapesMgr.add(...shapes);
        shapes.forEach(item => {
            item.board = this;
            if (item.selected)
                this._selects.push(item);
            this.markDirty(item.boundingRect());
        });
        emit && this.emitEvent(event_1.EventEnum.ShapesAdded, {
            operator,
            shapeDatas: shapes.map(v => v.data.copy())
        });
        return ret;
    }
    remove(shapes, opts) {
        var _a;
        const emit = !!opts;
        const operator = (_a = opts === null || opts === void 0 ? void 0 : opts.operator) !== null && _a !== void 0 ? _a : this._whoami;
        shapes = Array.isArray(shapes) ? shapes : [shapes];
        if (!shapes.length)
            return 0;
        const remains = shapes.filter(a => !this.selects.find(b => a === b));
        this.setSelects(remains, emit);
        if (emit) {
            const shapeDatas = shapes.map(v => v.data);
            shapeDatas.length && this.emitEvent(event_1.EventEnum.ShapesRemoved, {
                operator,
                shapeDatas
            });
        }
        const ret = this._shapesMgr.remove(...shapes);
        shapes.forEach(item => {
            this.markDirty(item.boundingRect());
            item.board = undefined;
        });
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
     * @return {[Shape[], Shape[]]} [新选中的图形的数组, 取消选择的图形的数组]
     * @param {true} [emit] 是否发射事件
     * @memberof Board
     */
    selectAt(rect, opts) {
        const hits = this._shapesMgr.hits(rect);
        return this.setSelects(hits, opts);
    }
    setSelects(shapes, opts) {
        var _a;
        const emit = !!opts;
        const operator = (_a = opts === null || opts === void 0 ? void 0 : opts.operator) !== null && _a !== void 0 ? _a : this._whoami;
        const selecteds = shapes.filter(v => !v.selected);
        const desecteds = this._selects.filter(a => !shapes.find(b => a === b));
        desecteds.forEach(v => v.selected = false);
        selecteds.forEach(v => v.selected = true);
        this._selects = shapes;
        if (emit) {
            selecteds.length && this.emitEvent(event_1.EventEnum.ShapesSelected, {
                operator,
                shapeDatas: selecteds.map(v => v.data)
            });
            desecteds.length && this.emitEvent(event_1.EventEnum.ShapesDeselected, {
                operator,
                shapeDatas: desecteds.map(v => v.data)
            });
        }
        return [selecteds, desecteds];
    }
    getDot(ev) {
        const layer = this.layer();
        const ele = layer.onscreen;
        const { width: w, height: h, left, top } = ele.getBoundingClientRect();
        const sw = ele.width / w;
        const sh = ele.height / h;
        const { pressure = 0.5 } = ev;
        return {
            x: Math.floor(sw * (ev.clientX - left)),
            y: Math.floor(sh * (ev.clientY - top)),
            p: pressure
        };
    }
    get tools() { return this._tools; }
    get tool() { return this._tool; }
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
        this._layers.forEach(layer => {
            layer.ctx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h);
            layer.octx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h);
        });
        this._shapesMgr.shapes().forEach(v => {
            const br = v.boundingRect();
            const layer = this._layers.get(v.data.layer);
            if (utils_1.Rect.hit(br, dirty) && layer)
                v.render(layer.octx);
        });
        (_a = this.tool) === null || _a === void 0 ? void 0 : _a.render(this.layer().octx);
        this._layers.forEach(layer => {
            const { ctx, offscreen } = layer;
            ctx.drawImage(offscreen, dirty.x, dirty.y, dirty.w, dirty.h, dirty.x, dirty.y, dirty.w, dirty.h);
        });
        delete this._dirty;
    }
}
exports.Board = Board;

},{"../event":22,"../shape":54,"../tools":89,"../utils":103,"./Layer":18}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = exports.LayerInfo = void 0;
const Css_1 = require("../utils/Css");
Css_1.Css.add(`
/*whiteboard STYLES*/
.g_whiteboard_layer {
  position: absolute;
  touch-action: none;
  user-select: none;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  transition: opacity 200ms;
  outline: none;
}`);
class LayerInfo {
    constructor(inits) {
        this.id = inits.id;
        this.name = inits.name;
    }
}
exports.LayerInfo = LayerInfo;
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
    get opacity() { return Number(this._offscreen.style.opacity); }
    ;
    set opacity(v) { this._onscreen.style.opacity = '' + v; }
    ;
    get id() { return this._info.id; }
    constructor(inits) {
        var _a;
        this._info = new LayerInfo(inits.info);
        this._onscreen = (_a = inits.onscreen) !== null && _a !== void 0 ? _a : document.createElement('canvas');
        this._onscreen.setAttribute('layer_id', this.id);
        this._onscreen.setAttribute('layer_name', this.name);
        this._onscreen.draggable = false;
        this._onscreen.classList.add('g_whiteboard_layer');
        this._ctx = this._onscreen.getContext('2d');
        this._offscreen = document.createElement('canvas');
        this._offscreen.width = this._onscreen.width;
        this._offscreen.height = this._onscreen.height;
        this._octx = this._offscreen.getContext('2d');
    }
    get width() {
        return this._onscreen.width;
    }
    set width(v) {
        this._onscreen.width = v;
        this._offscreen.width = v;
    }
    get height() {
        return this._onscreen.height;
    }
    set height(v) {
        this._onscreen.height = v;
        this._offscreen.height = v;
    }
}
exports.Layer = Layer;

},{"../utils/Css":94}],19:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Layer"), exports);
__exportStar(require("./Board"), exports);

},{"./Board":17,"./Layer":18}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEnum = void 0;
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
})(EventEnum = exports.EventEnum || (exports.EventEnum = {}));

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const EventType_1 = require("./EventType");
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
            h: data.h
        };
    }
    Events.pickShapeGeoData = pickShapeGeoData;
})(Events = exports.Events || (exports.Events = {}));

},{"./EventType":20}],22:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Events"), exports);
__exportStar(require("./EventType"), exports);

},{"./EventType":20,"./Events":21}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionQueue = void 0;
const EventType_1 = require("../event/EventType");
const mgr_1 = require("../mgr");
const tools_1 = require("../tools");
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
        mgr_1.Gaia.listActions().forEach(eventType => {
            const handler = mgr_1.Gaia.action(eventType);
            if (!handler) {
                return;
            }
            const func = (e) => {
                if (e.detail.operator !== actor.whoami) {
                    return;
                }
                if (!handler.isAction(actor, e)) {
                    return;
                }
                if (this._actionsIdx < this._actions.length - 1) {
                    this._actions = this._actions.slice(0, this._actionsIdx);
                }
                this._actions.push([
                    () => handler.undo(actor, e),
                    () => handler.redo(actor, e),
                ]);
                this._actionsIdx = this._actions.length - 1;
            };
            actor.addEventListener(eventType, func);
            const canceller = () => actor.removeEventListener(eventType, func);
            this._cancellers.push(canceller);
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
exports.ActionQueue = ActionQueue;
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
mgr_1.Gaia.registAction(EventType_1.EventEnum.ShapesDone, {
    isAction: () => true,
    undo: (board, event) => {
        const { detail: { shapeDatas } } = event;
        _removeShapes(board, shapeDatas);
    },
    redo: (board, event) => {
        const { detail: { shapeDatas } } = event;
        _addShapes(board, shapeDatas);
    }
});
mgr_1.Gaia.registAction(EventType_1.EventEnum.ShapesRemoved, {
    isAction: () => true,
    undo: (board, event) => {
        const { detail: { shapeDatas } } = event;
        _addShapes(board, shapeDatas);
    },
    redo: (board, event) => {
        const { detail: { shapeDatas } } = event;
        _removeShapes(board, shapeDatas);
    }
});
mgr_1.Gaia.registAction(EventType_1.EventEnum.ShapesGeoChanged, {
    isAction: (board, event) => {
        const ret = event.detail.tool === tools_1.ToolEnum.Selector;
        console.log("isAction:", ret);
        return ret;
    },
    undo: (board, event) => {
        const { detail: { shapeDatas } } = event;
        _changeShapes(board, shapeDatas, 1);
        board.emitEvent(EventType_1.EventEnum.ShapesGeoChanged, {
            operator: 'action_queue',
            tool: tools_1.ToolEnum.Invalid,
            shapeDatas: shapeDatas.map(arr => [arr[1], arr[0]])
        });
    },
    redo: (board, event) => {
        const { detail: { shapeDatas } } = event;
        _changeShapes(board, shapeDatas, 0);
        board.emitEvent(EventType_1.EventEnum.ShapesGeoChanged, {
            operator: 'action_queue',
            tool: tools_1.ToolEnum.Invalid,
            shapeDatas
        });
    }
});

},{"../event/EventType":20,"../mgr":36,"../tools":89}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FClipboard = void 0;
const EventType_1 = require("../event/EventType");
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
                raw.i = factory.newId(raw);
                raw.z = factory.newZ(raw);
                raw.status && (raw.status.f = 0);
                raw.x = raw.x + 10;
                raw.y = raw.y + 10;
                const shape = factory.newShape(raw);
                shape.selected = true;
                return shape;
            });
            board.deselect(false);
            board.add(shapes);
            board.emitEvent(EventType_1.EventEnum.ShapesDone, {
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
exports.FClipboard = FClipboard;

},{"../event/EventType":20}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const event_1 = require("../event");
class Player {
    constructor() {
        this.eventIdx = 0;
        this.startTime = 0;
        this._backwarding = false;
        this._requestId = 0;
    }
    play(actor, screenplay) {
        console.log('[Player]play()', screenplay);
        this.eventIdx = 0;
        this.actor = actor;
        this.screenplay = {
            startTime: screenplay.startTime || 0,
            snapshot: screenplay.snapshot,
            events: screenplay.events || [],
        };
        if (screenplay.snapshot) {
            actor.fromSnapshot(screenplay.snapshot);
        }
        this.startTime = performance.now();
        this.tick(this.startTime);
    }
    stop() {
        console.log('[Player]stop()');
        if (!this._requestId) {
            cancelAnimationFrame(this._requestId);
            this._requestId = 0;
        }
    }
    tick(time) {
        const { screenplay } = this;
        if (!screenplay) {
            return this.stop();
        }
        ;
        const playerTime = time - this.startTime;
        while (true) {
            const event = screenplay.events[this.eventIdx];
            if (!event) {
                return this.stop();
            }
            ;
            const eventTime = event.timestamp;
            if (eventTime > playerTime) {
                break;
            }
            this._applyEvent(event);
            ++this.eventIdx;
        }
        this._requestId = requestAnimationFrame(time => this.tick(time));
    }
    backward() {
        this._backwarding = true;
        return this;
    }
    forward() {
        this._backwarding = false;
        return this;
    }
    _applyEvent(e) {
        switch (e.type) {
            case event_1.EventEnum.ShapesAdded: {
                const { shapeDatas } = e.detail;
                this._addShape(shapeDatas);
                break;
            }
            case event_1.EventEnum.ShapesGeoChanging:
            case event_1.EventEnum.ShapesChanging: {
                const { shapeDatas } = e.detail;
                this._changeShapes(shapeDatas, 0);
                break;
            }
            case event_1.EventEnum.ShapesRemoved: {
                const { shapeDatas } = e.detail;
                this._removeShape(shapeDatas);
                break;
            }
        }
    }
    _undoEvent(e) {
        switch (e.type) {
            case event_1.EventEnum.ShapesAdded: {
                const { shapeDatas } = e.detail;
                this._removeShape(shapeDatas);
                break;
            }
            case event_1.EventEnum.ShapesGeoChanging:
            case event_1.EventEnum.ShapesChanging: {
                const { shapeDatas } = e.detail;
                this._changeShapes(shapeDatas, 1);
                break;
            }
            case event_1.EventEnum.ShapesRemoved: {
                const { shapeDatas } = e.detail;
                this._addShape(shapeDatas);
                break;
            }
        }
    }
    _addShape(shapeDatas) {
        const shapes = shapeDatas === null || shapeDatas === void 0 ? void 0 : shapeDatas.map(v => this.actor.factory.newShape(v));
        shapes && this.actor.add(shapes, false);
    }
    _removeShape(shapeDatas) {
        const shapes = shapeDatas === null || shapeDatas === void 0 ? void 0 : shapeDatas.map(data => this.actor.find(data.i)).filter(v => v);
        shapes && this.actor.remove(shapes, false);
    }
    _changeShapes(shapeDatas, which) {
        shapeDatas.forEach((currAndPrev) => {
            var _a;
            const data = currAndPrev[which];
            const id = data.i;
            id && ((_a = this.actor.find(id)) === null || _a === void 0 ? void 0 : _a.merge(data));
        });
    }
}
exports.Player = Player;

},{"../event":22}],26:[function(require,module,exports){
"use strict";
/******************************************************************
 * Copyright @ 2023 朱剑豪. All rights reserverd.
 * @file   src\features\Recorder.ts
 * @author 朱剑豪
 * @date   2023/07/02 23:31
 * @desc   事件记录器
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = void 0;
const event_1 = require("../event");
class Recorder {
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
    destory() {
        console.log('[Recorder] destory()');
    }
    stop() {
        console.log('[Recorder] stop()');
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
        const startTime = performance.now();
        const screenplay = {
            startTime,
            snapshot: actor.toSnapshot(),
            events: []
        };
        for (const key in event_1.EventEnum) {
            const v = event_1.EventEnum[key];
            const func = (e) => screenplay.events.push({
                timestamp: e.timeStamp - startTime,
                type: e.type,
                detail: e.detail
            });
            this._screenplay = screenplay;
            actor.addEventListener(v, func);
            const canceller = () => actor.removeEventListener(v, func);
            this._cancellers.push(canceller);
        }
        return this;
    }
}
exports.Recorder = Recorder;

},{"../event":22}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],28:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Player"), exports);
__exportStar(require("./Recorder"), exports);
__exportStar(require("./Screenplay"), exports);
__exportStar(require("./ActionQueue"), exports);
__exportStar(require("./FClipboard"), exports);

},{"./ActionQueue":23,"./FClipboard":24,"./Player":25,"./Recorder":26,"./Screenplay":27}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtInFontNames = exports.builtInFontFamilies = void 0;
exports.builtInFontFamilies = [
    "SimSun",
    "SimHei",
    "Microsoft Yahei",
    "Microsoft JhengHei",
    "KaiTi",
    "NSimSun",
    "FangSong",
    "PingFang SC",
    "STHeiti",
    "STKaiti",
    "STSong",
    "STFangsong",
    "STZhongsong",
    "STHupo",
    "STXinwei",
    "STLiti",
    "STXingkai",
    "Hiragino Sans GB",
    "Lantinghei SC",
    "Hanzipen SC",
    "Hannotate SC",
    "Songti SC",
    "Wawati SC",
    "Weibei SC",
    "Xingkai SC",
    "Yapi SC",
    "Yuanti SC",
    "YouYuan",
    "LiSu",
    "STXihei",
    "STKaiti",
    "STSong",
    "STFangsong",
    "STZhongsong",
    "STCaiyun",
    "STHupo",
    "STXinwei",
    "STLiti",
    "STXingkai",
    "FZShuTi",
    "FZYaoti",
];
exports.builtInFontNames = {
    "SimSun": "宋体",
    "SimHei": "黑体",
    "Microsoft Yahei": "微软雅黑",
    "Microsoft JhengHei": "微软正黑体",
    "KaiTi": "楷体",
    "NSimSun": "新宋体",
    "FangSong": "仿宋",
    "PingFang SC": "苹方",
    "STHeiti": "华文黑体",
    "STKaiti": "华文楷体",
    "STSong": "华文宋体",
    "STFangsong": "华文仿宋",
    "STZhongsong": "华文中宋",
    "STHupo": "华文琥珀",
    "STXinwei": "华文新魏",
    "STLiti": "华文隶书",
    "STXingkai": "华文行楷",
    "Hiragino Sans GB": "冬青黑体简",
    "Lantinghei SC": "兰亭黑-简",
    "Hanzipen SC": "翩翩体-简",
    "Hannotate SC": "手札体-简",
    "Songti SC": "宋体-简",
    "Wawati SC": "娃娃体-简",
    "Weibei SC": "魏碑-简",
    "Xingkai SC": "行楷-简",
    "Yapi SC": "雅痞-简",
    "Yuanti SC": "圆体-简",
    "YouYuan": "幼圆",
    "LiSu": "隶书",
    "STXihei": "华文细黑",
    "STCaiyun": "华文彩云",
    "FZShuTi": "方正舒体",
    "FZYaoti": "方正姚体"
};

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontFamilysChecker = void 0;
var FontFamilysChecker;
(function (FontFamilysChecker) {
    function check(fontFamilys) {
        const w = 64;
        const h = 64;
        const txt = "a啊";
        const fontSize = 64;
        const arial = "arial";
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        canvas.width = w;
        canvas.height = h;
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.textBaseline = "middle";
        const _drawTxt = function (fontFamily) {
            ctx.clearRect(0, 0, w, h);
            ctx.font = fontSize + "px " + fontFamily + ", " + arial;
            ctx.fillText(txt, w / 2, h / 2);
            return ctx.getImageData(0, 0, w, h).data.filter(v => v != 0).join("");
        };
        return fontFamilys.filter(fontFamily => {
            if (typeof fontFamily !== "string") {
                return false;
            }
            if (fontFamily.toLowerCase() === arial.toLowerCase()) {
                return true;
            }
            return _drawTxt(arial) !== _drawTxt(fontFamily);
        });
    }
    FontFamilysChecker.check = check;
    ;
})(FontFamilysChecker = exports.FontFamilysChecker || (exports.FontFamilysChecker = {}));

},{}],31:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./tools");
__exportStar(require("./board"), exports);
__exportStar(require("./features"), exports);
__exportStar(require("./mgr"), exports);
__exportStar(require("./shape"), exports);
__exportStar(require("./tools"), exports);
__exportStar(require("./utils"), exports);

},{"./board":19,"./features":28,"./mgr":36,"./shape":54,"./tools":89,"./utils":103}],32:[function(require,module,exports){
"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultFactory = void 0;
const Data_1 = require("../shape/base/Data");
const ShapesMgr_1 = require("./ShapesMgr");
const Shape_1 = require("../shape/base/Shape");
const InvalidTool_1 = require("../tools/base/InvalidTool");
const FactoryEnum_1 = require("./FactoryEnum");
const Gaia_1 = require("./Gaia");
const board_1 = require("../board");
const checker_1 = require("../fonts/checker");
const builtInFontFamilies_1 = require("../fonts/builtInFontFamilies");
const helper_1 = require("../utils/helper");
const Tag = '[DefaultFactory]';
class DefaultFactory {
    constructor() {
        this._z = 0;
        this._time = 0;
        this._shapeTemplates = {};
        this.resizer = {
            size: 10
        };
    }
    get type() {
        return FactoryEnum_1.FactoryEnum.Default;
    }
    shapeTemplate(type) {
        const ret = this._shapeTemplates[type] || this.newShapeData(type);
        this._shapeTemplates[type] = ret;
        return ret;
    }
    setShapeTemplate(type, template) {
        this._shapeTemplates[type] = template;
    }
    newWhiteBoard(options) {
        return new board_1.Board(this, options);
    }
    newShapesMgr() {
        return new ShapesMgr_1.DefaultShapesMgr();
    }
    newTool(toolType) {
        const create = Gaia_1.Gaia.tool(toolType);
        if (!create) {
            console.warn(Tag, `newTool("${toolType}"), ${toolType} is not registered`);
            return new InvalidTool_1.InvalidTool;
        }
        const ret = create();
        if (ret.type !== toolType) {
            console.warn(Tag, `newTool("${toolType}"), ${toolType} is not corrent! check member 'type' of your Tool!`);
        }
        return ret;
    }
    newShapeData(shapeType) {
        const create = Gaia_1.Gaia.shapeData(shapeType);
        if (!create) {
            console.warn(Tag, `newShapeData("${shapeType}"), ${shapeType} is not registered`);
            return new Data_1.ShapeData;
        }
        const ret = create();
        if (ret.type !== shapeType) {
            console.warn(Tag, `newShapeData("${shapeType}"), ${shapeType} is not corrent! check member 'type' of your ShapeData!`);
        }
        return ret;
    }
    newId(data) {
        return data.t + '_' + Date.now() + (++this._time);
    }
    newZ(data) {
        return Date.now() + (++this._z);
    }
    newShape(v) {
        var _a, _b;
        const isNew = (0, helper_1.isNum)(v) || (0, helper_1.isStr)(v);
        const type = isNew ? v : v.t;
        const data = this.newShapeData(type);
        const template = isNew ? this.shapeTemplate(v) : v;
        data.read(template);
        if (isNew) {
            data.id = this.newId(data);
            data.z = this.newZ(data);
        }
        return (_b = (_a = Gaia_1.Gaia.shape(type)) === null || _a === void 0 ? void 0 : _a(data)) !== null && _b !== void 0 ? _b : new Shape_1.Shape(data);
    }
    newLayerId() {
        return `layer_${Date.now()}_${++this._time}`;
    }
    newLayerName() {
        return `layer_${Date.now()}_${++this._time}`;
    }
    newLayer(inits) {
        const _a = inits || {}, { info } = _a, remainInits = __rest(_a, ["info"]);
        const _b = info || {}, { id = this.newLayerId(), name = this.newLayerName() } = _b, remainInfo = __rest(_b, ["id", "name"]);
        const _inits = Object.assign({ info: Object.assign({ id, name }, remainInfo) }, remainInits);
        return new board_1.Layer(_inits);
    }
    fontFamilies() {
        return checker_1.FontFamilysChecker.check(builtInFontFamilies_1.builtInFontFamilies);
    }
    fontName(fontFamily) {
        var _a;
        return (_a = builtInFontFamilies_1.builtInFontNames[fontFamily]) !== null && _a !== void 0 ? _a : fontFamily;
    }
}
exports.DefaultFactory = DefaultFactory;
Gaia_1.Gaia.registerFactory(FactoryEnum_1.FactoryEnum.Default, () => new DefaultFactory(), { name: 'bulit-in Factory', desc: 'bulit-in Factory' });

},{"../board":19,"../fonts/builtInFontFamilies":29,"../fonts/checker":30,"../shape/base/Data":38,"../shape/base/Shape":39,"../tools/base/InvalidTool":85,"../utils/helper":102,"./FactoryEnum":33,"./Gaia":34,"./ShapesMgr":35}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFactoryName = exports.FactoryEnum = void 0;
var FactoryEnum;
(function (FactoryEnum) {
    FactoryEnum[FactoryEnum["Invalid"] = 0] = "Invalid";
    FactoryEnum[FactoryEnum["Default"] = 1] = "Default";
})(FactoryEnum = exports.FactoryEnum || (exports.FactoryEnum = {}));
function getFactoryName(type) {
    switch (type) {
        case FactoryEnum.Invalid: return 'FactoryEnum.Invalid';
        case FactoryEnum.Default: return 'FactoryEnum.Default';
        default: return type;
    }
}
exports.getFactoryName = getFactoryName;

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gaia = void 0;
const ToolEnum_1 = require("../tools/ToolEnum");
const ShapeEnum_1 = require("../shape/ShapeEnum");
const Tag = '[Gaia]';
class Gaia {
    static registerFactory(type, creator, info) {
        if (this._factorys.has(type)) {
            console.warn(Tag, `registerFactory(), factory '${type}' already exists!`);
        }
        else if (this._factoryInfos.has(type)) {
            console.warn(Tag, `registerFactory(), factory info '${type}' already exists!`);
        }
        this._factorys.set(type, creator);
        this._factoryInfos.set(type, info);
    }
    static listFactories() {
        return Array.from(this._factoryInfos.keys());
    }
    static factory(type) {
        return this._factorys.get(type);
    }
    static registerTool(type, creator, info) {
        if (this._tools.has(type)) {
            console.warn(Tag, `registerTool(), tool '${type}' already exists!`);
        }
        else if (this._toolInfos.has(type)) {
            console.warn(Tag, `registerTool(), tool info '${type}' already exists!`);
        }
        this._tools.set(type, creator);
        this._toolInfos.set(type, {
            shape: info === null || info === void 0 ? void 0 : info.shape,
            name: (info === null || info === void 0 ? void 0 : info.name) || (0, ToolEnum_1.getToolName)(type),
            desc: (info === null || info === void 0 ? void 0 : info.desc) || (0, ToolEnum_1.getToolName)(type),
        });
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
    static registerShape(type, dataCreator, shapeCreator, info) {
        if (this._shapeInfos.has(type)) {
            console.warn(Tag, `registerShape(), shape info '${type}' already exists!`);
        }
        else if (this._shapeDatas.has(type)) {
            console.warn(Tag, `registerShape(), shape data'${type}' already exists!`);
        }
        else if (this._shapes.has(type)) {
            console.warn(Tag, `registerShape(), shape '${type}' already exists!`);
        }
        this._shapeInfos.set(type, {
            name: (info === null || info === void 0 ? void 0 : info.name) || (0, ShapeEnum_1.getShapeName)(type),
            desc: (info === null || info === void 0 ? void 0 : info.desc) || (0, ShapeEnum_1.getShapeName)(type),
            type
        });
        this._shapeDatas.set(type, dataCreator);
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
exports.Gaia = Gaia;
Gaia._tools = new Map();
Gaia._toolInfos = new Map();
Gaia._shapeDatas = new Map();
Gaia._shapes = new Map();
Gaia._shapeInfos = new Map();
Gaia._factorys = new Map();
Gaia._factoryInfos = new Map();
Gaia._actionHandler = new Map();

},{"../shape/ShapeEnum":37,"../tools/ToolEnum":84}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultShapesMgr = void 0;
const RotatedRect_1 = require("../utils/RotatedRect");
const Tag = '[DefaultShapesMgr]';
class DefaultShapesMgr {
    constructor() {
        this._items = [];
        this._kvs = {};
    }
    find(id) {
        return this._kvs[id] || null;
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
            const idx = this._items.findIndex(v => v === item);
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
            if (!v.ghost && RotatedRect_1.RotatedRect.hit(v.data, rect))
                ret.push(v);
        }
        return ret;
    }
    hit(rect) {
        const count = this._items.length;
        for (let idx = count - 1; idx >= 0; --idx) {
            const v = this._items[idx];
            if (!v.ghost && RotatedRect_1.RotatedRect.hit(v.data, rect))
                return v;
        }
        return null;
    }
}
exports.DefaultShapesMgr = DefaultShapesMgr;

},{"../utils/RotatedRect":100}],36:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Factory"), exports);
__exportStar(require("./FactoryEnum"), exports);
__exportStar(require("./Gaia"), exports);
__exportStar(require("./ShapesMgr"), exports);

},{"./Factory":32,"./FactoryEnum":33,"./Gaia":34,"./ShapesMgr":35}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShapeName = exports.ShapeEnum = void 0;
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
})(ShapeEnum = exports.ShapeEnum || (exports.ShapeEnum = {}));
function getShapeName(type) {
    switch (type) {
        case ShapeEnum.Invalid: return 'ShapeEnum.Invalid';
        case ShapeEnum.Pen: return 'ShapeEnum.Pen';
        case ShapeEnum.Rect: return 'ShapeEnum.Rect';
        case ShapeEnum.Oval: return 'ShapeEnum.Oval';
        case ShapeEnum.Text: return 'ShapeEnum.Text';
        case ShapeEnum.Polygon: return 'ShapeEnum.Polygon';
        case ShapeEnum.Tick: return 'ShapeEnum.Tick';
        case ShapeEnum.Cross: return 'ShapeEnum.Cross';
        case ShapeEnum.HalfTick: return 'ShapeEnum.HalfTick';
        case ShapeEnum.Lines: return 'ShapeEnum.Lines';
        case ShapeEnum.Img: return 'ShapeEnum.Img';
        default: return type;
    }
}
exports.getShapeName = getShapeName;

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeData = void 0;
const helper_1 = require("../../utils/helper");
const ShapeEnum_1 = require("../ShapeEnum");
class ShapeData {
    constructor() {
        this.t = ShapeEnum_1.ShapeEnum.Invalid;
        this.i = '';
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.z = 0;
        this.l = '';
        this.r = void 0; //Math.PI/4
        this.style = {};
        this.status = { v: 1 };
    }
    get type() { return this.t; }
    set type(v) { this.t = v; }
    get id() { return this.i; }
    set id(v) { this.i = v; }
    get fillStyle() { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.b) || ''; }
    set fillStyle(v) {
        if (!this.style)
            this.style = {};
        if (v)
            this.style.b = v;
        else
            delete this.style.b;
    }
    get strokeStyle() { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.a) || ''; }
    set strokeStyle(v) {
        if (!this.style)
            this.style = {};
        if (v)
            this.style.a = v;
        else
            delete this.style.a;
    }
    get lineCap() { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.c) || 'round'; }
    set lineCap(v) {
        if (!this.style)
            this.style = {};
        if (v)
            this.style.c = v;
        else
            delete this.style.c;
    }
    get lineDash() { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.d) || []; }
    set lineDash(v) {
        if (!this.style)
            this.style = {};
        if (Array.isArray(v) && v.length > 0)
            this.style.d = [...v];
        else
            delete this.style.d;
    }
    get lineDashOffset() { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.e) || 0; }
    set lineDashOffset(v) {
        if (!this.style)
            this.style = {};
        if (v)
            this.style.e = v;
        else
            delete this.style.e;
    }
    get lineJoin() { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.f) || 'round'; }
    set lineJoin(v) {
        if (!this.style)
            this.style = {};
        if (v)
            this.style.f = v;
        else
            delete this.style.f;
    }
    get lineWidth() { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.g) || 0; }
    set lineWidth(v) {
        if (!this.style)
            this.style = {};
        if (v)
            this.style.g = v;
        else
            delete this.style.g;
    }
    get miterLimit() { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.h) || 0; }
    set miterLimit(v) {
        if (!this.style)
            this.style = {};
        if (v)
            this.style.h = v;
        else
            delete this.style.h;
    }
    get visible() { var _a; return !!((_a = this.status) === null || _a === void 0 ? void 0 : _a.v); }
    set visible(v) {
        if (!this.status)
            this.status = {};
        if (v)
            this.status.v = 1;
        else
            delete this.status.v;
    }
    get selected() { var _a; return !!((_a = this.status) === null || _a === void 0 ? void 0 : _a.s); }
    set selected(v) {
        if (!this.status)
            this.status = {};
        if (v)
            this.status.s = 1;
        else
            delete this.status.s;
    }
    get editing() { var _a; return !!((_a = this.status) === null || _a === void 0 ? void 0 : _a.e); }
    set editing(v) {
        if (!this.status)
            this.status = {};
        if (v)
            this.status.e = 1;
        else
            delete this.status.e;
    }
    get locked() { var _a; return !!((_a = this.status) === null || _a === void 0 ? void 0 : _a.f); }
    set locked(v) {
        if (!this.status)
            this.status = {};
        if (v)
            this.status.f = 1;
        else
            delete this.status.f;
    }
    get ghost() { var _a; return !!((_a = this.status) === null || _a === void 0 ? void 0 : _a.g); }
    set ghost(v) {
        if (!this.status)
            this.status = {};
        if (v)
            this.status.g = 1;
        else
            delete this.status.g;
    }
    get layer() { return this.l; }
    set layer(v) { this.l = v; }
    get needFill() { return true; }
    get needStroke() { return true; }
    get rotation() { var _a; return (_a = this.r) !== null && _a !== void 0 ? _a : 0; }
    set rotation(v) { this.r = v || void 0; }
    merge(o) {
        this.read(o);
        return this;
    }
    read(o) {
        if ((0, helper_1.isStr)(o.t) || (0, helper_1.isNum)(o.t))
            this.t = o.t;
        if ((0, helper_1.isStr)(o.i))
            this.i = o.i;
        if ((0, helper_1.isNum)(o.x))
            this.x = o.x;
        if ((0, helper_1.isNum)(o.y))
            this.y = o.y;
        if ((0, helper_1.isNum)(o.z))
            this.z = o.z;
        if ((0, helper_1.isNum)(o.w))
            this.w = o.w;
        if ((0, helper_1.isNum)(o.h))
            this.h = o.h;
        if ((0, helper_1.isStr)(o.l))
            this.l = o.l;
        this.r = (0, helper_1.isNum)(o.r) ? o.r : void 0;
        const { style, status } = o;
        if (style) {
            if (!this.style)
                this.style = {};
            if (style.a)
                this.style.a = style.a;
            if (style.b)
                this.style.b = style.b;
            if (style.c)
                this.style.c = style.c;
            if (style.d)
                this.style.d = [...style.d];
            if ((0, helper_1.isNum)(style.e))
                this.style.e = style.e;
            if (style.f)
                this.style.f = style.f;
            if ((0, helper_1.isNum)(style.g))
                this.style.g = style.g;
            if ((0, helper_1.isNum)(style.h))
                this.style.h = style.h;
        }
        if (status) {
            if (!this.status)
                this.status = {};
            if ((0, helper_1.isNum)(status.v))
                this.status.v = status.v;
            if ((0, helper_1.isNum)(status.s))
                this.status.s = status.s;
            if ((0, helper_1.isNum)(status.e))
                this.status.e = status.e;
            if ((0, helper_1.isNum)(status.f))
                this.status.f = status.f;
            if ((0, helper_1.isNum)(status.g))
                this.status.g = status.g;
        }
        return this;
    }
    copy() {
        const ret = new (Object.getPrototypeOf(this).constructor);
        return ret.read(this);
    }
}
exports.ShapeData = ShapeData;

},{"../../utils/helper":102,"../ShapeEnum":37}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = exports.Resizable = exports.ResizeDirection = void 0;
const Rect_1 = require("../../utils/Rect");
var ResizeDirection;
(function (ResizeDirection) {
    ResizeDirection[ResizeDirection["None"] = 0] = "None";
    ResizeDirection["Top"] = "Top";
    ResizeDirection["Bottom"] = "Bottom";
    ResizeDirection["Left"] = "Left";
    ResizeDirection["Right"] = "Right";
    ResizeDirection["TopLeft"] = "TopLeft";
    ResizeDirection["TopRight"] = "TopRight";
    ResizeDirection["BottomLeft"] = "BottomLeft";
    ResizeDirection["BottomRight"] = "BottomRight";
})(ResizeDirection = exports.ResizeDirection || (exports.ResizeDirection = {}));
/**
 * 表示图形能以何种方式被拉伸
 *
 * @export
 * @enum {number}
 */
var Resizable;
(function (Resizable) {
    /**
     * 图形不能被拉伸
     */
    Resizable[Resizable["None"] = 0] = "None";
    /**
     * 八方向拉伸
     */
    Resizable[Resizable["All"] = 1] = "All";
})(Resizable = exports.Resizable || (exports.Resizable = {}));
/**
 * 一切图形的基类
 *
 * @export
 * @class Shape 图形基类
 * @template D 图形数据类
 */
class Shape {
    constructor(data) {
        this._resizable = Resizable.None;
        this._data = data;
    }
    /**
     * 图形的数据
     *
     * @readonly
     * @type {D}
     * @memberof Shape
     */
    get data() { return this._data; }
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
    get type() { return this._data.type; }
    /**
     * 图形属于哪个黑板
     *
     * @type {(Board | undefined)}
     * @memberof Shape
     */
    get board() { return this._board; }
    set board(v) { this._board = v; }
    /**
     * 图形是否可见，
     *
     * 当不可见时，图形将在渲染时被忽略
     *
     * @type {boolean}
     * @memberof Shape
     */
    get visible() { return !!this._data.visible; }
    set visible(v) {
        if (!!this._data.visible === v)
            return;
        this._data.visible = v;
        this.markDirty();
    }
    /**
     * 是否正在编辑中
     *
     * TODO
     *
     * @type {boolean}
     * @memberof Shape
     */
    get editing() { return !!this._data.editing; }
    set editing(v) {
        if (this._data.editing === v)
            return;
        this._data.editing = v;
        this.markDirty();
    }
    /**
     * 图形是否被选中
     *
     * 选中图形后，图形将呈现为被选中状态，其他一些对图形的操作均需要选中图形
     *
     * @type {boolean}
     * @memberof Shape
     */
    get selected() { return !!this._data.selected; }
    set selected(v) {
        if (this._data.selected === v)
            return;
        this._data.selected = v;
        this.markDirty();
    }
    /**
     * 图形是否可以被用户修改尺寸
     *
     * 当不为Resizable.None时，选中的图形将出现控制点，
     * 此时可以点击拖拽控制点来修改图形的尺寸
     *
     * @readonly
     * @type {Resizable}
     * @memberof Shape
     */
    get resizable() { return this._resizable; }
    /**
     * 图形是否被锁定
     *
     * 被锁定的图形将不能被编辑，选中图形时，选中图形将显示为被锁定
     *
     * @type {boolean}
     * @memberof Shape
     */
    get locked() { return this._data.locked; }
    set locked(v) {
        if (this._data.locked === v)
            return;
        this._data.locked = v;
        this.markDirty();
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
    get ghost() { return this._data.ghost; }
    set ghost(v) {
        if (this._data.ghost === v)
            return;
        this._data.ghost = v;
        this.markDirty();
    }
    /**
     * 图形描边宽度
     * 若图形不存在描边，则为0
     *
     * @type {number}
     * @memberof Shape
     */
    get lineWidth() { return this._data.lineWidth; }
    set lineWidth(v) {
        if (!this._data.needStroke) {
            return;
        }
        this.markDirty();
        this._data.lineWidth = Math.max(0, v);
        this.markDirty();
    }
    merge(data) {
        this.markDirty();
        this.data.merge(data);
        this.markDirty();
    }
    markDirty(rect) {
        var _a;
        rect = rect !== null && rect !== void 0 ? rect : this.boundingRect();
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.markDirty(rect);
    }
    /**
     * 移动图形
     *
     * @param x x坐标
     * @param y y坐标
     * @returns void
     */
    move(x, y) {
        if (x === this._data.x && y === this._data.y)
            return;
        this.markDirty();
        this._data.x = x;
        this._data.y = y;
        this.markDirty();
    }
    resize(w, h) {
        if (w === this._data.w && h === this._data.h)
            return;
        this.markDirty();
        this._data.w = w;
        this._data.h = h;
        this.markDirty();
    }
    rotateBy(d, ox = void 0, oy = void 0) {
        const r = this._data.rotation + d;
        this.rotateTo(r, ox, oy);
    }
    rotateTo(r, ox = void 0, oy = void 0) {
        if (r == this._data.rotation)
            return;
        this.markDirty();
        this._data.rotation = r;
        const { x, y, w, h } = this._data;
        const mx = x + w / 2;
        const my = y + h / 2;
        ox = ox !== null && ox !== void 0 ? ox : mx;
        oy = oy !== null && oy !== void 0 ? oy : my;
        const mx1 = (mx - ox) * Math.cos(r) - (my - oy) * Math.sin(r) + ox;
        const my1 = (mx - ox) * Math.sin(r) + (my - oy) * Math.cos(r) + oy;
        this._data.x = mx1 - w / 2;
        this._data.y = my1 - h / 2;
        this.markDirty();
    }
    getGeo() {
        return new Rect_1.Rect(this._data.x, this._data.y, this._data.w, this._data.h);
    }
    setGeo(rect) {
        this.geo(rect.x, rect.y, rect.w, rect.h);
    }
    geo(x, y, w, h) {
        if (x === this._data.x &&
            y === this._data.y &&
            w === this._data.w &&
            h === this._data.h)
            return;
        this.markDirty();
        this._data.x = x;
        this._data.y = y;
        this._data.w = w;
        this._data.h = h;
        this.markDirty();
    }
    moveBy(x, y) {
        this.markDirty();
        this._data.x += x;
        this._data.y += y;
        this.markDirty();
    }
    resizeBy(w, h) {
        this.markDirty();
        this._data.w += w;
        this._data.h += h;
        this.markDirty();
    }
    geoBy(x, y, w, h) {
        this.markDirty();
        this._data.x += x;
        this._data.y += y;
        this._data.w += w;
        this._data.h += h;
        this.markDirty();
    }
    render(ctx) {
        if (!this.visible)
            return;
        const { ghost, locked } = this;
        if (this.selected && !ghost) {
            // 虚线其实相当损耗性能
            const lineWidth = locked ? 2 : 1;
            const halfLineW = lineWidth / 2;
            ctx.lineWidth = lineWidth;
            this.beginDraw(ctx);
            let { x, y, w, h } = this.selectorRect();
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.closePath();
            ctx.strokeStyle = locked ? '#ffffff88' : '#ffffff';
            ctx.setLineDash([]);
            ctx.stroke();
            ctx.strokeStyle = locked ? '#00000088' : '#000000';
            ctx.setLineDash(locked ? [lineWidth * 8] : [lineWidth * 4]);
            ctx.stroke();
            if (!locked && this._resizable === Resizable.All) {
                ctx.fillStyle = 'white';
                ctx.setLineDash([]);
                const { s, lx, rx, ty, by, mx, my, } = this.getResizerNumbers(x, y, w, h);
                // top resizer
                ctx.beginPath();
                ctx.rect(mx, ty, s, s);
                ctx.fill();
                ctx.stroke();
                // bottom resizer
                ctx.beginPath();
                ctx.rect(mx, by, s, s);
                ctx.fill();
                ctx.stroke();
                // left resizer
                ctx.beginPath();
                ctx.rect(lx, my, s, s);
                ctx.fill();
                ctx.stroke();
                // right resizer
                ctx.beginPath();
                ctx.rect(rx, my, s, s);
                ctx.fill();
                ctx.stroke();
                // top-left resizer
                ctx.beginPath();
                ctx.rect(lx, ty, s, s);
                ctx.fill();
                ctx.stroke();
                // top-right resizer
                ctx.beginPath();
                ctx.rect(rx, ty, s, s);
                ctx.fill();
                ctx.stroke();
                // bottom-left resizer
                ctx.beginPath();
                ctx.rect(lx, by, s, s);
                ctx.fill();
                ctx.stroke();
                // bottom-right resizer
                ctx.beginPath();
                ctx.rect(rx, by, s, s);
                ctx.fill();
                ctx.stroke();
            }
            this.endDraw(ctx);
        }
    }
    /**
     * 绘制矩形
     *
     * @returns
     */
    drawingRect() {
        const d = this._data;
        return {
            x: 0,
            y: 0,
            w: Math.floor(d.w),
            h: Math.floor(d.h)
        };
    }
    selectorRect() {
        const { w, h, locked, lineWidth } = this.data;
        const hlw = Math.floor(lineWidth / 2);
        const offset = locked ? 0 : 0.5;
        return {
            x: offset - hlw,
            y: offset - hlw,
            w: Math.floor(w + hlw * 2) - 1,
            h: Math.floor(h + hlw * 2) - 1
        };
    }
    /**
     * 获取包围盒矩形
     *
     * @return {IRect} 包围盒矩形
     * @memberof Shape
     */
    boundingRect() {
        const d = this.data;
        const offset = (d.lineWidth % 2) ? 1 : 0;
        const overDraw1 = 1;
        const overDraw2 = overDraw1 * 2;
        if (!d.r)
            return {
                x: Math.floor(d.x - d.lineWidth / 2 - overDraw1),
                y: Math.floor(d.y - d.lineWidth / 2 - overDraw1),
                w: Math.ceil(d.w + d.lineWidth + offset + overDraw2),
                h: Math.ceil(d.h + d.lineWidth + offset + overDraw2)
            };
        const w = Math.abs(d.w * Math.cos(d.r)) + Math.abs(d.h * Math.sin(d.r));
        const h = Math.abs(d.w * Math.sin(d.r)) + Math.abs(d.h * Math.cos(d.r));
        const x = d.x - (w - d.w) / 2;
        const y = d.y - (h - d.h) / 2;
        return {
            x: Math.floor(x - d.lineWidth / 2 - overDraw1),
            y: Math.floor(y - d.lineWidth / 2 - overDraw1),
            w: Math.ceil(w + d.lineWidth + offset + overDraw2),
            h: Math.ceil(h + d.lineWidth + offset + overDraw2)
        };
    }
    getResizerNumbers(x, y, w, h) {
        var _a;
        const lw = 1;
        const hlw = lw / 2;
        const s = ((_a = this._board) === null || _a === void 0 ? void 0 : _a.factory.resizer.size) || 10;
        return {
            s,
            lx: x,
            rx: x + w - s,
            ty: y,
            by: y + h - s,
            mx: Math.floor(x + (w - s) / 2) - hlw,
            my: Math.floor(y + (h - s) / 2) - hlw,
        };
    }
    map2me(pointerX, pointerY) {
        const { r, x, y, w, h } = this.data;
        if (!r)
            return { x: pointerX, y: pointerY };
        const x2 = x + w / 2;
        const y2 = y + h / 2;
        const cr = Math.cos(-r);
        const sr = Math.sin(-r);
        const dx = pointerX - x2;
        const dy = pointerY - y2;
        return {
            x: dx * cr - dy * sr + x2,
            y: dx * sr + dy * cr + y2
        };
    }
    resizeDirection(pointerX, pointerY) {
        if (!this.selected || !this._resizable || this.ghost || this.locked) {
            return [ResizeDirection.None, undefined];
        }
        const { x: l, y: t } = this.data;
        const { x, y, w, h } = this.selectorRect();
        const { s, lx, rx, ty, by, mx, my } = this.getResizerNumbers(l + x, t + y, w, h);
        const pos = { x: pointerX, y: pointerY };
        const rect = new Rect_1.Rect(0, 0, s, s);
        rect.moveTo(mx, ty);
        if (rect.hit(pos)) {
            return [ResizeDirection.Top, rect];
        }
        rect.moveTo(mx, by);
        if (rect.hit(pos)) {
            return [ResizeDirection.Bottom, rect];
        }
        rect.moveTo(lx, my);
        if (rect.hit(pos)) {
            return [ResizeDirection.Left, rect];
        }
        rect.moveTo(rx, my);
        if (rect.hit(pos)) {
            return [ResizeDirection.Right, rect];
        }
        rect.moveTo(lx, ty);
        if (rect.hit(pos)) {
            return [ResizeDirection.TopLeft, rect];
        }
        rect.moveTo(rx, ty);
        if (rect.hit(pos)) {
            return [ResizeDirection.TopRight, rect];
        }
        rect.moveTo(lx, by);
        if (rect.hit(pos)) {
            return [ResizeDirection.BottomLeft, rect];
        }
        rect.moveTo(rx, by);
        if (rect.hit(pos)) {
            return [ResizeDirection.BottomRight, rect];
        }
        return [ResizeDirection.None, undefined];
    }
    beginDraw(ctx) {
        let { x, y, w, h, rotation } = this.data;
        ctx.save();
        x = Math.floor(x);
        y = Math.floor(y);
        const hw = Math.floor(w / 2);
        const hh = Math.floor(h / 2);
        if (rotation) {
            ctx.translate(x + hw, y + hh);
            ctx.rotate(rotation);
            ctx.translate(-hw, -hh);
        }
        else {
            ctx.translate(x, y);
        }
    }
    endDraw(ctx) {
        ctx.restore();
    }
}
exports.Shape = Shape;

},{"../../utils/Rect":98}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeNeedPath = void 0;
const Shape_1 = require("./Shape");
class ShapeNeedPath extends Shape_1.Shape {
    constructor(data) {
        super(data);
        this._resizable = Shape_1.Resizable.All;
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
exports.ShapeNeedPath = ShapeNeedPath;

},{"./Shape":39}],41:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Data"), exports);
__exportStar(require("./Shape"), exports);
__exportStar(require("./ShapeNeedPath"), exports);

},{"./Data":38,"./Shape":39,"./ShapeNeedPath":40}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class CrossData extends base_1.ShapeData {
    get needFill() {
        return false;
    }
    constructor() {
        super();
        this.type = ShapeEnum_1.ShapeEnum.Cross;
        this.strokeStyle = '#FF0000';
        this.lineWidth = 2;
    }
}
exports.CrossData = CrossData;

},{"../ShapeEnum":37,"../base":41}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeCross = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const Gaia_1 = require("../../mgr/Gaia");
const Data_1 = require("./Data");
const ShapeNeedPath_1 = require("../base/ShapeNeedPath");
class ShapeCross extends ShapeNeedPath_1.ShapeNeedPath {
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
exports.ShapeCross = ShapeCross;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Cross, () => new Data_1.CrossData, d => new ShapeCross(d));

},{"../../mgr/Gaia":34,"../ShapeEnum":37,"../base/ShapeNeedPath":40,"./Data":42}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "CrossTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Cross, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Cross, ShapeEnum_1.ShapeEnum.Cross), { name: 'Cross', desc: 'cross drawer', shape: ShapeEnum_1.ShapeEnum.Cross });

},{"../../mgr/Gaia":34,"../../tools/ToolEnum":84,"../../tools/base/SimpleTool":86,"../ShapeEnum":37}],45:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Data"), exports);
__exportStar(require("./Shape"), exports);
__exportStar(require("./Tool"), exports);

},{"./Data":42,"./Shape":43,"./Tool":44}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HalfTickData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class HalfTickData extends base_1.ShapeData {
    get needFill() {
        return false;
    }
    constructor() {
        super();
        this.type = ShapeEnum_1.ShapeEnum.HalfTick;
        this.strokeStyle = '#FF0000';
        this.lineWidth = 2;
    }
}
exports.HalfTickData = HalfTickData;

},{"../ShapeEnum":37,"../base":41}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeHalfTick = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const Gaia_1 = require("../../mgr/Gaia");
const Data_1 = require("./Data");
const ShapeNeedPath_1 = require("../base/ShapeNeedPath");
class ShapeHalfTick extends ShapeNeedPath_1.ShapeNeedPath {
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
exports.ShapeHalfTick = ShapeHalfTick;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.HalfTick, () => new Data_1.HalfTickData, d => new ShapeHalfTick(d));

},{"../../mgr/Gaia":34,"../ShapeEnum":37,"../base/ShapeNeedPath":40,"./Data":46}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HalfTickTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "HalfTickTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.HalfTick, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.HalfTick, ShapeEnum_1.ShapeEnum.HalfTick), { name: 'Half tick', desc: 'half tick drawer', shape: ShapeEnum_1.ShapeEnum.HalfTick });

},{"../../mgr/Gaia":34,"../../tools/ToolEnum":84,"../../tools/base/SimpleTool":86,"../ShapeEnum":37}],49:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./Data":46,"./Shape":47,"./Tool":48,"dup":45}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgData = exports.ObjectFit = void 0;
const helper_1 = require("../../utils/helper");
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
var ObjectFit;
(function (ObjectFit) {
    ObjectFit[ObjectFit["Fill"] = 0] = "Fill";
    ObjectFit[ObjectFit["Contain"] = 1] = "Contain";
    ObjectFit[ObjectFit["Cover"] = 2] = "Cover";
})(ObjectFit = exports.ObjectFit || (exports.ObjectFit = {}));
class ImgData extends base_1.ShapeData {
    get src() {
        return this.s;
    }
    set src(v) {
        this.s = v;
    }
    get objectFit() {
        var _a;
        return (_a = this.f) !== null && _a !== void 0 ? _a : ObjectFit.Fill;
    }
    set objectFit(v) {
        this.f = v;
    }
    get needFill() {
        return false;
    }
    get needStroke() {
        return false;
    }
    constructor() {
        super();
        // src: string = 'http://download.niushibang.com/tvzwLPPzgRqnab818f2c19e1b1aefa67e9682fec5a77.jpg';
        this.s = 'http://download.niushibang.com/niubo/wx/message/93482af6-597e-4d96-b91d-498222adcfaa/1686551265158.png';
        this.type = ShapeEnum_1.ShapeEnum.Img;
    }
    read(other) {
        super.read(other);
        if ((0, helper_1.isStr)(other.s))
            this.s = other.s;
        if ((0, helper_1.isNum)(other.f))
            this.f = other.f;
        return this;
    }
}
exports.ImgData = ImgData;

},{"../../utils/helper":102,"../ShapeEnum":37,"../base":41}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeImg = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
const Data_1 = require("./Data");
class ShapeImg extends base_1.Shape {
    constructor(data) {
        super(data);
        this._loaded = false;
        this._error = '';
        this.onLoad = () => {
            this._loaded = true;
            this.markDirty();
        };
        this.onError = (e) => {
            this._error = 'fail to load: ' + e.target.src;
            this.markDirty();
        };
        this._resizable = base_1.Resizable.All;
    }
    get img() {
        const d = this.data;
        if (this._src === d.src) {
            return this._img;
        }
        ;
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
                case Data_1.ObjectFit.Fill: {
                    this.beginDraw(ctx);
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
                    this.endDraw(ctx);
                    break;
                }
                case Data_1.ObjectFit.Contain: {
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
                case Data_1.ObjectFit.Cover: {
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
        const br = this.boundingRect();
        ctx.fillStyle = '#FF000088';
        ctx.fillRect(br.x, br.y, br.w, br.h);
        this.beginDraw(ctx);
        const { x, y, w, h } = this.drawingRect();
        ctx.fillStyle = '#00000088';
        ctx.fillRect(0, 0, w, h);
        ctx.font = 'normal 16px serif';
        ctx.fillStyle = 'white';
        const { fontBoundingBoxDescent: fd, fontBoundingBoxAscent: fa, actualBoundingBoxLeft: al } = ctx.measureText(text);
        const height = fd + fa;
        ctx.fillText(text, 1 + al, height);
        this.endDraw(ctx);
    }
}
exports.ShapeImg = ShapeImg;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Img, () => new Data_1.ImgData, d => new ShapeImg(d));

},{"../../mgr/Gaia":34,"../ShapeEnum":37,"../base":41,"./Data":50}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "RectTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Img, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Img, ShapeEnum_1.ShapeEnum.Img), { name: 'Image', desc: 'Image drawer', shape: ShapeEnum_1.ShapeEnum.Img });

},{"../../mgr/Gaia":34,"../../tools/ToolEnum":84,"../../tools/base/SimpleTool":86,"../ShapeEnum":37}],53:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./Data":50,"./Shape":51,"./Tool":52,"dup":45}],54:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./oval"), exports);
__exportStar(require("./pen"), exports);
__exportStar(require("./polygon"), exports);
__exportStar(require("./rect"), exports);
__exportStar(require("./ShapeEnum"), exports);
__exportStar(require("./text"), exports);
__exportStar(require("./tick"), exports);
__exportStar(require("./cross"), exports);
__exportStar(require("./halftick"), exports);
__exportStar(require("./lines"), exports);
__exportStar(require("./img"), exports);

},{"./ShapeEnum":37,"./base":41,"./cross":45,"./halftick":49,"./img":53,"./lines":58,"./oval":62,"./pen":66,"./polygon":70,"./rect":74,"./text":79,"./tick":83}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinesData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class LinesData extends base_1.ShapeData {
    get needFill() {
        return false;
    }
    constructor() {
        super();
        this.coords = [];
        this.type = ShapeEnum_1.ShapeEnum.Lines;
        this.strokeStyle = '#ff0000';
        this.lineCap = 'round';
        this.lineJoin = 'round';
        this.lineWidth = 2;
    }
    read(other) {
        super.read(other);
        if (Array.isArray(other.coords))
            this.coords = [...other.coords];
        return this;
    }
    merge(other) {
        super.read(other);
        if (Array.isArray(other.coords)) {
            this.coords = [...other.coords];
        }
        return this;
    }
}
exports.LinesData = LinesData;

},{"../ShapeEnum":37,"../base":41}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeLines = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const Gaia_1 = require("../../mgr/Gaia");
const base_1 = require("../base");
const Data_1 = require("./Data");
class ShapeLines extends base_1.Shape {
    constructor(v) {
        super(v);
        this._srcGeo = null;
        this._path2D = new Path2D();
        let x, y;
        for (let i = 0; i < v.coords.length; i += 2) {
            x = v.coords[i];
            y = v.coords[i + 1];
            this.updatePath(x, y, i === 0 ? 'first' : undefined);
        }
        this.updateSrcGeo();
    }
    merge(data) {
        this.markDirty();
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
        this.markDirty();
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
        this.markDirty();
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
        this.markDirty();
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
exports.ShapeLines = ShapeLines;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Lines, () => new Data_1.LinesData, d => new ShapeLines(d));

},{"../../mgr/Gaia":34,"../ShapeEnum":37,"../base":41,"./Data":55}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinesTool = void 0;
const ToolEnum_1 = require("../../tools/ToolEnum");
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const event_1 = require("../../event");
const Tag = '[LinesTool]';
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
    get type() { return ToolEnum_1.ToolEnum.Lines; }
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
            board.emitEvent(event_1.EventEnum.ShapesChanging, {
                operator: board.whoami,
                shapeType: this.type,
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
            board.emitEvent(event_1.EventEnum.ShapesChanging, {
                operator: board.whoami,
                shapeType: this.type,
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
            this._curShape = board.factory.newShape(ShapeEnum_1.ShapeEnum.Lines);
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
            (_a = this._board) === null || _a === void 0 ? void 0 : _a.emitEvent(event_1.EventEnum.ShapesDone, {
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
exports.LinesTool = LinesTool;
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Lines, () => new LinesTool(), { name: 'Lines', desc: 'lines', shape: ShapeEnum_1.ShapeEnum.Lines });

},{"../../event":22,"../../mgr/Gaia":34,"../../tools/ToolEnum":84,"../ShapeEnum":37}],58:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./Data":55,"./Shape":56,"./Tool":57,"dup":45}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvalData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class OvalData extends base_1.ShapeData {
    constructor() {
        super();
        this.type = ShapeEnum_1.ShapeEnum.Oval;
        // this.fillStyle = '#00000000'
        this.strokeStyle = '#ff0000';
        this.lineWidth = 2;
    }
}
exports.OvalData = OvalData;

},{"../ShapeEnum":37,"../base":41}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeOval = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const Gaia_1 = require("../../mgr/Gaia");
const Data_1 = require("./Data");
const ShapeNeedPath_1 = require("../base/ShapeNeedPath");
class ShapeOval extends ShapeNeedPath_1.ShapeNeedPath {
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
exports.ShapeOval = ShapeOval;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Oval, () => new Data_1.OvalData, d => new ShapeOval(d));

},{"../../mgr/Gaia":34,"../ShapeEnum":37,"../base/ShapeNeedPath":40,"./Data":59}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvalTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
class OvalTool extends SimpleTool_1.SimpleTool {
    constructor() {
        super(ToolEnum_1.ToolEnum.Oval, ShapeEnum_1.ShapeEnum.Oval);
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
exports.OvalTool = OvalTool;
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Oval, () => new OvalTool(), { name: 'Oval', desc: 'oval drawer', shape: ShapeEnum_1.ShapeEnum.Oval });

},{"../../mgr/Gaia":34,"../../tools/ToolEnum":84,"../../tools/base/SimpleTool":86,"../ShapeEnum":37}],62:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./Data":59,"./Shape":60,"./Tool":61,"dup":45}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenData = exports.DotsType = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
var DotsType;
(function (DotsType) {
    DotsType[DotsType["Invalid"] = 0] = "Invalid";
    DotsType[DotsType["All"] = 1] = "All";
    DotsType[DotsType["Append"] = 2] = "Append";
    DotsType[DotsType["Subtract"] = 3] = "Subtract";
})(DotsType = exports.DotsType || (exports.DotsType = {}));
class PenData extends base_1.ShapeData {
    get needFill() {
        return false;
    }
    constructor() {
        super();
        this.dotsType = DotsType.All;
        this.coords = [];
        this.type = ShapeEnum_1.ShapeEnum.Pen;
        this.strokeStyle = '#ff0000';
        this.lineCap = 'round';
        this.lineJoin = 'round';
        this.lineWidth = 3;
    }
    read(other) {
        super.read(other);
        if (other.dotsType)
            this.dotsType = other.dotsType;
        if (Array.isArray(other.coords))
            this.coords = [...other.coords];
        return this;
    }
    merge(other) {
        super.read(other);
        if (!Array.isArray(other.coords)) {
            return this;
        }
        switch (other.dotsType) {
            case DotsType.Subtract:
                this.coords = this.coords.slice(0, -other.coords.length);
                break;
            case DotsType.Append:
                this.coords.push(...other.coords);
                break;
            default:
                this.coords = [...other.coords];
                break;
        }
        return this;
    }
}
exports.PenData = PenData;

},{"../ShapeEnum":37,"../base":41}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapePen = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const Gaia_1 = require("../../mgr/Gaia");
const base_1 = require("../base");
const Data_1 = require("./Data");
class ShapePen extends base_1.Shape {
    constructor(v) {
        super(v);
        this._lineFactor = 0.5;
        this._smoothFactor = 0.5;
        this._srcGeo = null;
        this._path2D = new Path2D();
        let x, y;
        for (let i = 0; i < v.coords.length; i += 2) {
            x = v.coords[i];
            y = v.coords[i + 1];
            this.updateSrcGeo(x, y);
            if (i === 0)
                this.updatePath(x, y, 'first');
            else if (i >= v.coords.length - 2)
                this.updatePath(x, y, 'last');
            else
                this.updatePath(x, y);
        }
    }
    merge(data) {
        this.markDirty();
        const startIdx = this.data.coords.length;
        this.data.merge(data);
        const endIdx = this.data.coords.length - 1;
        if (startIdx !== endIdx) {
            let x, y;
            for (let i = startIdx; i <= endIdx; i += 2) {
                x = this.data.coords[i];
                y = this.data.coords[i + 1];
                this.updateSrcGeo(x, y);
                if (i === 0)
                    this.updatePath(x, y, 'first');
                else if (!this.data.editing && i === endIdx)
                    this.updatePath(x, y, 'last');
                else
                    this.updatePath(x, y);
            }
        }
        this.markDirty();
    }
    /**
     * 根据新加入的点，计算原始矩形
     * @param dot
     */
    updateSrcGeo(x, y) {
        if (this._srcGeo) {
            const left = Math.min(this._srcGeo.x, x);
            const top = Math.min(this._srcGeo.y, y);
            let w = Math.max(this._srcGeo.x + this._srcGeo.w, x) - left;
            let h = Math.max(this._srcGeo.y + this._srcGeo.h, y) - top;
            if (w !== w)
                w = 0; // NaN check
            if (h !== h)
                h = 0; // NaN check
            this._srcGeo = { x: left, y: top, w, h };
        }
        else {
            this._srcGeo = {
                x: x,
                y: y,
                w: 0,
                h: 0
            };
        }
        return this._srcGeo;
    }
    updatePath(x, y, type) {
        if (this.prev_dot === undefined) {
            this.prev_dot = { x, y };
            this._path2D.moveTo(x, y);
        }
        if (type === 'first')
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
        const prevY = coords[coords.length - 1];
        const prevX = coords[coords.length - 2];
        if (prevY === dot.y && prevX === dot.x && type !== 'last')
            return;
        this.data.coords.push(dot.x, dot.y);
        const geo = this.updateSrcGeo(dot.x, dot.y);
        this.updatePath(dot.x, dot.y, type);
        this.geo(geo.x, geo.y, geo.w, geo.h);
        this.markDirty();
    }
    render(ctx) {
        if (!this.visible)
            return;
        const d = this.data;
        if (d.lineWidth && d.strokeStyle && this._srcGeo) {
            this.beginDraw(ctx);
            ctx.translate(-this._srcGeo.x, -this._srcGeo.y);
            ctx.lineCap = d.lineCap;
            ctx.lineDashOffset = d.lineDashOffset || 0;
            ctx.lineJoin = d.lineJoin;
            ctx.lineWidth = d.lineWidth || 0;
            ctx.miterLimit = d.miterLimit || 0;
            ctx.strokeStyle = d.strokeStyle;
            ctx.setLineDash(d.lineDash);
            ctx.stroke(this._path2D);
            this.endDraw(ctx);
        }
        super.render(ctx);
    }
}
exports.ShapePen = ShapePen;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Pen, () => new Data_1.PenData, d => new ShapePen(d));

},{"../../mgr/Gaia":34,"../ShapeEnum":37,"../base":41,"./Data":63}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenTool = void 0;
const ToolEnum_1 = require("../../tools/ToolEnum");
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const Data_1 = require("./Data");
const event_1 = require("../../event");
const Tag = '[PenTool]';
class PenTool {
    start() {
    }
    end() {
        delete this._curShape;
    }
    get type() { return ToolEnum_1.ToolEnum.Pen; }
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
            return shape.appendDot(dot, type);
        const emitEvent = () => {
            const prev = this._prevData;
            if (!prev)
                return;
            const curr = shape.data.copy();
            curr.dotsType = Data_1.DotsType.Append;
            curr.coords.splice(0, prev.coords.length);
            board.emitEvent(event_1.EventEnum.ShapesChanging, {
                operator: board.whoami,
                shapeType: this.type,
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
    pointerMove(dot) { }
    pointerDown(dot) {
        const board = this.board;
        if (!board)
            return;
        this._curShape = board.factory.newShape(ShapeEnum_1.ShapeEnum.Pen);
        this._curShape.data.layer = board.layer().id;
        this._curShape.data.editing = true;
        board.add(this._curShape, true);
        this.addDot(dot, 'first');
    }
    pointerDraw(dot) {
        this.addDot(dot);
    }
    pointerUp(dot) {
        var _a;
        const shape = this._curShape;
        if (shape)
            shape.data.editing = false;
        this.addDot(dot, 'last');
        (_a = this._board) === null || _a === void 0 ? void 0 : _a.emitEvent(event_1.EventEnum.ShapesDone, {
            operator: this._board.whoami,
            shapeDatas: [shape.data.copy()]
        });
        this.end();
    }
}
exports.PenTool = PenTool;
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Pen, () => new PenTool(), { name: 'Pen', desc: 'simple pen', shape: ShapeEnum_1.ShapeEnum.Pen });

},{"../../event":22,"../../mgr/Gaia":34,"../../tools/ToolEnum":84,"../ShapeEnum":37,"./Data":63}],66:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./Data":63,"./Shape":64,"./Tool":65,"dup":45}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class PolygonData extends base_1.ShapeData {
    constructor() {
        super();
        this.dots = [];
        this.type = ShapeEnum_1.ShapeEnum.Polygon;
        this.fillStyle = '#ff0000';
        this.strokeStyle = '#000000';
        this.lineWidth = 2;
    }
    read(other) {
        super.read(other);
        if ('dots' in other)
            this.dots = other.dots.map(v => (Object.assign({}, v)));
        return this;
    }
}
exports.PolygonData = PolygonData;

},{"../ShapeEnum":37,"../base":41}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapePolygon = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const Gaia_1 = require("../../mgr/Gaia");
const Data_1 = require("./Data");
const ShapeNeedPath_1 = require("../base/ShapeNeedPath");
class ShapePolygon extends ShapeNeedPath_1.ShapeNeedPath {
    path(ctx) {
        const { x, y, w, h } = this.drawingRect();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
    }
}
exports.ShapePolygon = ShapePolygon;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Polygon, () => new Data_1.PolygonData, d => new ShapePolygon(d));

},{"../../mgr/Gaia":34,"../ShapeEnum":37,"../base/ShapeNeedPath":40,"./Data":67}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "PolygonTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
const desc = {
    name: 'Polygon', desc: 'Polygon Drawer', shape: ShapeEnum_1.ShapeEnum.Polygon
};
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Polygon, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Polygon, ShapeEnum_1.ShapeEnum.Polygon), desc);

},{"../../mgr/Gaia":34,"../../tools/ToolEnum":84,"../../tools/base/SimpleTool":86,"../ShapeEnum":37}],70:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./Data":67,"./Shape":68,"./Tool":69,"dup":45}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class RectData extends base_1.ShapeData {
    constructor() {
        super();
        this.type = ShapeEnum_1.ShapeEnum.Rect;
        this.strokeStyle = '#ff0000';
        this.lineWidth = 2;
    }
}
exports.RectData = RectData;

},{"../ShapeEnum":37,"../base":41}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeRect = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const Gaia_1 = require("../../mgr/Gaia");
const Data_1 = require("./Data");
const ShapeNeedPath_1 = require("../base/ShapeNeedPath");
class ShapeRect extends ShapeNeedPath_1.ShapeNeedPath {
    path(ctx) {
        const { x, y, w, h } = this.drawingRect();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
    }
}
exports.ShapeRect = ShapeRect;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Rect, () => new Data_1.RectData, d => new ShapeRect(d));

},{"../../mgr/Gaia":34,"../ShapeEnum":37,"../base/ShapeNeedPath":40,"./Data":71}],73:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "RectTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Rect, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Rect, ShapeEnum_1.ShapeEnum.Rect), { name: 'Rectangle', desc: 'rect drawer', shape: ShapeEnum_1.ShapeEnum.Rect });

},{"../../mgr/Gaia":34,"../../tools/ToolEnum":84,"../../tools/base/SimpleTool":86,"../ShapeEnum":37}],74:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./Data":71,"./Shape":72,"./Tool":73,"dup":45}],75:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextData = void 0;
const helper_1 = require("../../utils/helper");
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class TextData extends base_1.ShapeData {
    constructor() {
        super();
        this.text = '';
        this.f_d = ['normal', 'normal', 'normal', 24, 'Simsum'];
        this.t_l = 3;
        this.t_r = 3;
        this.t_t = 3;
        this.t_b = 3;
        this.type = ShapeEnum_1.ShapeEnum.Text;
        this.fillStyle = '#ff0000';
        this.strokeStyle = '';
        this.lineWidth = 0;
    }
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
        if ((0, helper_1.isStr)(o.text))
            this.text = o.text;
        if (Array.isArray(o.f_d))
            this.f_d = [...o.f_d];
        if ((0, helper_1.isNum)(o.t_l))
            this.t_l = o.t_l;
        if ((0, helper_1.isNum)(o.t_r))
            this.t_r = o.t_r;
        if ((0, helper_1.isNum)(o.t_t))
            this.t_t = o.t_t;
        if ((0, helper_1.isNum)(o.t_b))
            this.t_b = o.t_b;
        return this;
    }
}
exports.TextData = TextData;

},{"../../utils/helper":102,"../ShapeEnum":37,"../base":41}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeText = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const Gaia_1 = require("../../mgr/Gaia");
const Data_1 = require("./Data");
const base_1 = require("../base");
const Rect_1 = require("../../utils/Rect");
const TextSelection_1 = require("./TextSelection");
const measurer = document.createElement('canvas').getContext('2d');
class ShapeText extends base_1.Shape {
    get text() { return this.data.text; }
    set text(v) { this.setText(v); }
    get selection() { return this._selection; }
    set selection(v) { this.setSelection(v); }
    get selectionRects() { return this._selectionRects; }
    get offscreen() {
        this._offscreen = this._offscreen || document.createElement('canvas');
        return this._offscreen;
    }
    constructor(data) {
        super(data);
        this._selection = new TextSelection_1.TextSelection;
        this._lines = [];
        this._selectionRects = [];
        this._cursorVisible = false;
        this._calculateLines();
        this._calculateSectionRects();
    }
    get fontSize() { return this.data.font_size; }
    set fontSize(v) {
        this.markDirty();
        this.data.font_size = v;
        this._calculateLines();
        this._calculateSectionRects();
        this.markDirty();
    }
    merge(data) {
        this.markDirty();
        this.data.merge(data);
        this._calculateLines();
        this._calculateSectionRects();
        this.markDirty();
    }
    _setCursorVisible(v = !this._cursorVisible) {
        this._cursorVisible = v;
        this.markDirty();
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
        if (this.data.text === v)
            return;
        this.data.text = v;
        this._calculateLines();
        dirty && this.markDirty();
    }
    setSelection(v = { start: -1, end: -1 }, dirty = true) {
        if (this._selection.equal(v))
            return;
        this._selection.start = v.start;
        this._selection.end = v.end;
        this._setCursorFlashing(v.start === v.end && v.start >= 0);
        this._calculateSectionRects();
        dirty && this.markDirty();
    }
    _calculateLines() {
        this._applyStyle(measurer);
        let totalH = this.data.t_t;
        let totalW = 0;
        const text = this.text;
        this._lines = text.split('\n').map(v => {
            const str = v + '\n';
            const tm = measurer.measureText(str);
            const y = totalH;
            const bl = y + tm.fontBoundingBoxAscent;
            totalW = Math.max(tm.width, totalW);
            totalH += tm.fontBoundingBoxAscent + tm.fontBoundingBoxDescent;
            return Object.assign({ str, x: this.data.t_l, y, bl }, tm);
        });
        totalH += this.data.t_b;
        totalW += this.data.t_r + this.data.t_l;
        this.resize(totalW, totalH);
    }
    _calculateSectionRects() {
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
            this._selectionRects.push(new Rect_1.Rect(left, top, Math.max(2, tm1.width), height));
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
exports.ShapeText = ShapeText;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Text, () => new Data_1.TextData, d => new ShapeText(d));

},{"../../mgr/Gaia":34,"../../utils/Rect":98,"../ShapeEnum":37,"../base":41,"./Data":75,"./TextSelection":77}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSelection = void 0;
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
exports.TextSelection = TextSelection;

},{}],78:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextTool = void 0;
const event_1 = require("../../event");
const Gaia_1 = require("../../mgr/Gaia");
const ToolEnum_1 = require("../../tools/ToolEnum");
const Css_1 = require("../../utils/Css");
const ShapeEnum_1 = require("../ShapeEnum");
Css_1.Css.add(`
.g_whiteboard_text_editor {
  display: none;
  position: absolute;
  left: 0px;
  top: 0px;
  boxSizing: border-box;
  outline: none;
  border: none;
  resize: none;
  padding: 0px;
  margin: 0px;
  transition: none;
  opacity: 0%;
}`);
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
            this._editor.style.display = 'block';
            this._editor.value = shape.text;
        }
        else {
            this._editor.style.display = 'none';
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
                (_a = this._board) === null || _a === void 0 ? void 0 : _a.emitEvent(event_1.EventEnum.ShapesDone, {
                    operator: this._board.whoami,
                    shapeDatas: [preShape.data.copy()]
                });
            }
        }
        this._prevData = shape === null || shape === void 0 ? void 0 : shape.data.copy();
    }
    constructor() {
        this._editor = document.createElement('textarea');
        this._newTxt = false;
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
            this._editor.style.transform = `rotate(${(180 * shape.data.rotation / Math.PI).toFixed(4)}deg)`;
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
            board.emitEvent(event_1.EventEnum.ShapesChanging, {
                operator: board.whoami,
                shapeType: this.type,
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
        this._editor.wrap = 'off';
        this._editor.classList.add('g_whiteboard_text_editor');
    }
    start() {
        this._editor.addEventListener('keydown', this._keydown);
        this._editor.addEventListener('input', this._updateShapeText);
        document.addEventListener('selectionchange', this._updateShapeText);
        document.addEventListener('pointerdown', this._docPointerdown);
    }
    end() {
        this._editor.removeEventListener('keydown', this._keydown);
        this._editor.removeEventListener('input', this._updateShapeText);
        document.removeEventListener('selectionchange', this._updateShapeText);
        document.removeEventListener('pointerdown', this._docPointerdown);
        this.curShape = undefined;
    }
    get type() { return ToolEnum_1.ToolEnum.Text; }
    get board() {
        return this._board;
    }
    set board(v) {
        var _a, _b, _c;
        this._board = v;
        (_c = (_b = (_a = this._board) === null || _a === void 0 ? void 0 : _a.onscreen()) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.appendChild(this._editor);
    }
    get editor() { return this._editor; }
    render() { }
    pointerMove(dot) { }
    pointerDown(dot) {
        const { board } = this;
        if (!board) {
            return;
        }
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
            this.curShape = undefined;
            return;
        }
        else if (!shapeText) {
            this._newTxt = true;
            const newShapeText = board.factory.newShape(ShapeEnum_1.ShapeEnum.Text);
            newShapeText.data.layer = board.layer().id;
            newShapeText.move(dot.x, dot.y);
            board.add(newShapeText, true);
            shapeText = newShapeText;
        }
        this.connect(shapeText);
    }
    pointerDraw(dot) { }
    pointerUp(dot) { }
    connect(shapeText) {
        const { board } = this;
        if (!board) {
            return;
        }
        this.curShape = shapeText;
        setTimeout(() => this._editor.focus(), 10);
    }
}
exports.TextTool = TextTool;
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Text, () => new TextTool, { name: 'Text', desc: 'enter some text', shape: ShapeEnum_1.ShapeEnum.Text });

},{"../../event":22,"../../mgr/Gaia":34,"../../tools/ToolEnum":84,"../../utils/Css":94,"../ShapeEnum":37}],79:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Data"), exports);
__exportStar(require("./Shape"), exports);
__exportStar(require("./TextSelection"), exports);
__exportStar(require("./Tool"), exports);

},{"./Data":75,"./Shape":76,"./TextSelection":77,"./Tool":78}],80:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class TickData extends base_1.ShapeData {
    get needFill() {
        return false;
    }
    constructor() {
        super();
        this.type = ShapeEnum_1.ShapeEnum.Tick;
        this.strokeStyle = '#FF0000';
        this.lineWidth = 2;
    }
}
exports.TickData = TickData;

},{"../ShapeEnum":37,"../base":41}],81:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeTick = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const Gaia_1 = require("../../mgr/Gaia");
const Data_1 = require("./Data");
const ShapeNeedPath_1 = require("../base/ShapeNeedPath");
class ShapeTick extends ShapeNeedPath_1.ShapeNeedPath {
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
exports.ShapeTick = ShapeTick;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Tick, () => new Data_1.TickData, d => new ShapeTick(d));

},{"../../mgr/Gaia":34,"../ShapeEnum":37,"../base/ShapeNeedPath":40,"./Data":80}],82:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "TickTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Tick, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Tick, ShapeEnum_1.ShapeEnum.Tick), { name: 'Tick', desc: 'tick drawer', shape: ShapeEnum_1.ShapeEnum.Tick });

},{"../../mgr/Gaia":34,"../../tools/ToolEnum":84,"../../tools/base/SimpleTool":86,"../ShapeEnum":37}],83:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./Data":80,"./Shape":81,"./Tool":82,"dup":45}],84:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolName = exports.ToolEnum = void 0;
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
})(ToolEnum = exports.ToolEnum || (exports.ToolEnum = {}));
function getToolName(type) {
    switch (type) {
        case ToolEnum.Invalid: return 'ToolEnum.Invalid';
        case ToolEnum.Pen: return 'ToolEnum.Pen';
        case ToolEnum.Rect: return 'ToolEnum.Rect';
        case ToolEnum.Oval: return 'ToolEnum.Oval';
        case ToolEnum.Text: return 'ToolEnum.Text';
        case ToolEnum.Polygon: return 'ToolEnum.Polygon';
        case ToolEnum.Tick: return 'ToolEnum.Tick';
        case ToolEnum.Cross: return 'ToolEnum.Cross';
        case ToolEnum.HalfTick: return 'ToolEnum.HalfTick';
        case ToolEnum.Lines: return 'ToolEnum.Lines';
        case ToolEnum.Lines: return 'ToolEnum.Img';
        default: return type;
    }
}
exports.getToolName = getToolName;

},{}],85:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTool = void 0;
const ToolEnum_1 = require("../ToolEnum");
class InvalidTool {
    start() {
        console.warn('got InvalidTool');
    }
    end() {
        console.warn('got InvalidTool');
    }
    get type() { return ToolEnum_1.ToolEnum.Invalid; }
    get board() {
        console.warn('got InvalidTool');
        return;
    }
    set board(v) {
        console.warn('got InvalidTool');
    }
    pointerMove(dot) {
        console.warn('got InvalidTool');
    }
    pointerDown(dot) {
        console.warn('got InvalidTool');
    }
    pointerDraw(dot) {
        console.warn('got InvalidTool');
    }
    pointerUp(dot) {
        console.warn('got InvalidTool');
    }
    render() {
        console.warn('got InvalidTool');
    }
}
exports.InvalidTool = InvalidTool;

},{"../ToolEnum":84}],86:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTool = void 0;
const event_1 = require("../../event");
const RectHelper_1 = require("../../utils/RectHelper");
const Tag = '[SimpleTool]';
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
        this._rect = new RectHelper_1.RectHelper();
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
                this._prevData = event_1.Events.pickShapeGeoData(shape.data);
                this._startData = this._prevData;
                this.applyRect();
                break;
            }
            case 1: {
                this.applyRect();
                const curr = event_1.Events.pickShapeGeoData(shape.data);
                board.emitEvent(event_1.EventEnum.ShapesGeoChanging, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: [[curr, this._prevData]]
                });
                this._prevData = curr;
                break;
            }
            case 2: {
                this.applyRect();
                const curr = event_1.Events.pickShapeGeoData(shape.data);
                board.emitEvent(event_1.EventEnum.ShapesGeoChanging, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: [[curr, this._prevData]]
                });
                board.emitEvent(event_1.EventEnum.ShapesGeoChanged, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: [[curr, this._startData]]
                });
                board.emitEvent(event_1.EventEnum.ShapesDone, {
                    operator: board.whoami,
                    shapeDatas: [shape.data.copy()]
                });
                this._prevData = curr;
                break;
            }
        }
    }
}
exports.SimpleTool = SimpleTool;

},{"../../event":22,"../../utils/RectHelper":99}],87:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],88:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./InvalidTool"), exports);
__exportStar(require("./SimpleTool"), exports);
__exportStar(require("./Tool"), exports);

},{"./InvalidTool":85,"./SimpleTool":86,"./Tool":87}],89:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./selector"), exports);
__exportStar(require("./ToolEnum"), exports);

},{"./ToolEnum":84,"./base":88,"./selector":91}],90:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorTool = exports.SelectorStatus = void 0;
const RectHelper_1 = require("../../utils/RectHelper");
const Data_1 = require("../../shape/base/Data");
const Gaia_1 = require("../../mgr/Gaia");
const Shape_1 = require("../../shape/rect/Shape");
const ToolEnum_1 = require("../ToolEnum");
const base_1 = require("../../shape/base");
const Vector_1 = require("../../utils/Vector");
const Events_1 = require("../../event/Events");
const event_1 = require("../../event");
const shape_1 = require("../../shape");
var SelectorStatus;
(function (SelectorStatus) {
    SelectorStatus[SelectorStatus["Invalid"] = 0] = "Invalid";
    SelectorStatus[SelectorStatus["ReadyForDragging"] = 1] = "ReadyForDragging";
    SelectorStatus[SelectorStatus["Dragging"] = 2] = "Dragging";
    SelectorStatus[SelectorStatus["ReadyForSelecting"] = 3] = "ReadyForSelecting";
    SelectorStatus[SelectorStatus["Selecting"] = 4] = "Selecting";
    SelectorStatus[SelectorStatus["ReadyForResizing"] = 5] = "ReadyForResizing";
    SelectorStatus[SelectorStatus["Resizing"] = 6] = "Resizing";
})(SelectorStatus = exports.SelectorStatus || (exports.SelectorStatus = {}));
const Tag = '[SelectorTool]';
class SelectorTool {
    get type() { return ToolEnum_1.ToolEnum.Selector; }
    get board() { return this._rect.board; }
    set board(v) { this._rect.board = v; }
    get rect() { return this._rectHelper; }
    constructor() {
        this._doubleClickTimer = 0;
        this._rect = new Shape_1.ShapeRect(new Data_1.ShapeData);
        this._rectHelper = new RectHelper_1.RectHelper();
        this._status = SelectorStatus.Invalid;
        this._prevPos = { x: 0, y: 0 };
        this._resizerOffset = { x: 0, y: 0 };
        this._windowPointerDown = () => this.deselect();
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
        this.board.element.style.cursor = '';
        document.addEventListener('pointerdown', this._windowPointerDown);
    }
    end() {
        this.board.element.style.cursor = '';
        document.removeEventListener('pointerdown', this._windowPointerDown);
        this.deselect();
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
            };
            if (startX === undefined) {
                x = x === undefined ? v.data.x : Math.min(x, v.data.x);
                y = y === undefined ? v.data.y : Math.min(y, v.data.y);
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
        this._shapes.forEach(v => {
            v.prevData = Events_1.Events.pickShapePosData(v.shape.data);
            !v.shape.locked && v.shape.moveBy(diffX, diffY);
        });
        return this;
    }
    pointerDown(dot) {
        const { board, _status } = this;
        if (!board || _status !== SelectorStatus.Invalid) {
            return;
        }
        const { x, y } = dot;
        this._rectHelper.start(x, y);
        this.updateGeo();
        const shapes = board.hits({ x, y, w: 0, h: 0 }); // 点击位置的全部图形
        let shape;
        for (let i = 0; i < shapes.length; ++i) { // 找到距离用户最近的未锁定图形
            if (!shapes[i].locked) {
                shape = shapes[i];
                break;
            }
        }
        if (!shape || shape.locked) {
            // 点击的位置无任何未锁定图形，则框选图形, 并取消选择以选择的图形
            this._status = SelectorStatus.ReadyForSelecting;
            this._rect.visible = true;
            this.deselect();
        }
        else if (!shape.selected) {
            // 点击位置存在图形，且图形未被选择，则选择点中的图形。
            this._status = SelectorStatus.ReadyForDragging;
            board.setSelects([shape], true);
        }
        else {
            // 点击位置存在图形，且图形已被选择，则判断是否点击尺寸调整。
            const dot = shape.map2me(x, y);
            const [direction, resizerRect] = shape.resizeDirection(dot.x, dot.y);
            if (direction) {
                this._resizerDirection = direction;
                this._resizerRect = resizerRect;
                this._resizingShape = shape;
                switch (direction) {
                    case base_1.ResizeDirection.Top:
                        this._resizerOffset.x = 0;
                        this._resizerOffset.y = resizerRect.top - dot.y;
                        break;
                    case base_1.ResizeDirection.Bottom:
                        this._resizerOffset.x = 0;
                        this._resizerOffset.y = resizerRect.bottom - dot.y;
                        break;
                    case base_1.ResizeDirection.Left:
                        this._resizerOffset.x = resizerRect.left - dot.x;
                        this._resizerOffset.y = 0;
                        break;
                    case base_1.ResizeDirection.Right:
                        this._resizerOffset.x = resizerRect.right - dot.x;
                        this._resizerOffset.y = 0;
                        break;
                    case base_1.ResizeDirection.TopLeft:
                        this._resizerOffset.x = resizerRect.left - dot.x;
                        this._resizerOffset.y = resizerRect.top - dot.y;
                        break;
                    case base_1.ResizeDirection.TopRight:
                        this._resizerOffset.x = resizerRect.right - dot.x;
                        this._resizerOffset.y = resizerRect.top - dot.y;
                        break;
                    case base_1.ResizeDirection.BottomLeft:
                        this._resizerOffset.x = resizerRect.left - dot.x;
                        this._resizerOffset.y = resizerRect.bottom - dot.y;
                        break;
                    case base_1.ResizeDirection.BottomRight:
                        this._resizerOffset.x = resizerRect.right - dot.x;
                        this._resizerOffset.y = resizerRect.bottom - dot.y;
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
        let direction;
        let rect;
        this.board.selects.find(it => {
            const dot2 = it.map2me(dot.x, dot.y);
            const arr = it.resizeDirection(dot2.x, dot2.y);
            if (arr[0] != base_1.ResizeDirection.None) {
                direction = arr[0];
                rect = arr[1];
                return true;
            }
        });
        switch (direction) {
            case base_1.ResizeDirection.Top:
            case base_1.ResizeDirection.Bottom:
                this.board.element.style.cursor = 'ns-resize';
                break;
            case base_1.ResizeDirection.Left:
            case base_1.ResizeDirection.Right:
                this.board.element.style.cursor = 'ew-resize';
                break;
            case base_1.ResizeDirection.TopLeft:
            case base_1.ResizeDirection.BottomRight:
                this.board.element.style.cursor = 'nw-resize';
                break;
            case base_1.ResizeDirection.TopRight:
            case base_1.ResizeDirection.BottomLeft:
                this.board.element.style.cursor = 'ne-resize';
                break;
            default:
                this.board.element.style.cursor = '';
                break;
        }
    }
    pointerDraw(dot) {
        const board = this.board;
        if (!board)
            return;
        switch (this._status) {
            case SelectorStatus.ReadyForSelecting: // let it fall-through
                if (Vector_1.Vector.manhattan(this._prevPos, dot) < 5) {
                    return;
                }
                this._status = SelectorStatus.Selecting;
            case SelectorStatus.Selecting: {
                this._rectHelper.end(dot.x, dot.y);
                this.updateGeo();
                board.selectAt(this._rect.data, true);
                return;
            }
            case SelectorStatus.ReadyForDragging: // let it fall-through
                if (Vector_1.Vector.manhattan(this._prevPos, dot) < 5) {
                    return;
                }
                this._status = SelectorStatus.Dragging;
            case SelectorStatus.Dragging: {
                this.move(dot.x, dot.y).emitGeoEvent(false);
                return;
            }
            case SelectorStatus.ReadyForResizing: // let it fall-through
                if (Vector_1.Vector.manhattan(this._prevPos, dot) < 5) {
                    return;
                }
                this._status = SelectorStatus.Resizing;
            case SelectorStatus.Resizing: {
                const shape = this._resizingShape;
                const geo = shape.getGeo();
                const rs = board.factory.resizer.size;
                const { y: roy, x: rox } = this._resizerOffset;
                const { x, y } = dot;
                const { left: l, right: r, bottom: b, top: t } = geo;
                switch (this._resizerDirection) {
                    case base_1.ResizeDirection.Top:
                        geo.top = Math.floor(Math.min(roy + y, b - rs * 2));
                        break;
                    case base_1.ResizeDirection.Bottom:
                        geo.bottom = Math.ceil(Math.max(roy + y, t + rs * 2));
                        break;
                    case base_1.ResizeDirection.Left:
                        geo.left = Math.floor(Math.min(rox + x, r - rs * 2));
                        break;
                    case base_1.ResizeDirection.Right:
                        geo.right = Math.ceil(Math.max(rox + x, l + rs * 2));
                        break;
                    case base_1.ResizeDirection.TopLeft:
                        geo.top = Math.floor(Math.min(roy + y, b - rs * 2));
                        geo.left = Math.floor(Math.min(rox + x, r - rs * 2));
                        break;
                    case base_1.ResizeDirection.TopRight:
                        geo.top = Math.floor(Math.min(roy + y, b - rs * 2));
                        geo.right = Math.ceil(Math.max(rox + x, l + rs * 2));
                        break;
                    case base_1.ResizeDirection.BottomLeft:
                        geo.bottom = Math.ceil(Math.max(roy + y, t + rs * 2));
                        geo.left = Math.floor(Math.min(rox + x, r - rs * 2));
                        break;
                    case base_1.ResizeDirection.BottomRight:
                        geo.bottom = Math.ceil(Math.max(roy + y, t + rs * 2));
                        geo.right = Math.ceil(Math.max(rox + x, l + rs * 2));
                        break;
                }
                shape.setGeo(geo);
                this.emitGeoEvent(false);
                return;
            }
        }
    }
    pointerUp() {
        if (this._status === SelectorStatus.ReadyForDragging) {
            // 双击判定
            if (!this._doubleClickTimer) {
                this._doubleClickTimer = setTimeout(() => this._doubleClickTimer = 0, 500);
            }
            else {
                clearTimeout(this._doubleClickTimer);
                this._doubleClickTimer = 0;
                this.doubleClick();
            }
        }
        if (this._status === SelectorStatus.Dragging) {
            this.emitGeoEvent(true);
        }
        this._rect.visible = false;
        this._rectHelper.clear();
        this._status = SelectorStatus.Invalid;
    }
    doubleClick() {
        const { board } = this;
        if (!board) {
            return;
        }
        ;
        console.log(this._shapes.length);
        // 双击某个文本时，切换到文本编辑工具，编辑此文本，当文本编辑框失去焦点时，回到选择器工具；
        if (this._shapes.length && this._shapes[0].shape instanceof shape_1.ShapeText) {
            board.setToolType(ToolEnum_1.ToolEnum.Text);
            const textTool = board.tool;
            textTool.selectorCallback = () => board.setToolType(ToolEnum_1.ToolEnum.Selector);
            textTool.editor.addEventListener('blur', textTool.selectorCallback, { once: true });
            textTool.connect(this._shapes[0].shape);
        }
    }
    emitGeoEvent(immediate) {
        if (this._waiting && !immediate)
            return;
        this._waiting = true;
        const board = this.board;
        if (!board)
            return;
        board.emitEvent(event_1.EventEnum.ShapesGeoChanging, {
            operator: board.whoami,
            tool: this.type,
            shapeDatas: this._shapes.map(v => {
                const ret = [
                    Events_1.Events.pickShapeGeoData(v.shape.data), v.prevData
                ];
                return ret;
            })
        });
        setTimeout(() => { this._waiting = false; }, 1000 / 30);
        if (immediate) {
            board.emitEvent(event_1.EventEnum.ShapesGeoChanged, {
                operator: board.whoami,
                tool: this.type,
                shapeDatas: this._shapes.map(v => {
                    const ret = [
                        Events_1.Events.pickShapeGeoData(v.shape.data), v.startData
                    ];
                    return ret;
                })
            });
        }
    }
    updateGeo() {
        const { x, y, w, h } = this._rectHelper.gen();
        this._rect.geo(x, y, w, h);
    }
}
exports.SelectorTool = SelectorTool;
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Selector, () => new SelectorTool, {
    name: 'Selector',
    desc: 'pick shapes'
});

},{"../../event":22,"../../event/Events":21,"../../mgr/Gaia":34,"../../shape":54,"../../shape/base":41,"../../shape/base/Data":38,"../../shape/rect/Shape":72,"../../utils/RectHelper":99,"../../utils/Vector":101,"../ToolEnum":84}],91:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./SelectorTool"), exports);

},{"./SelectorTool":90}],92:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryRange = void 0;
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
exports.BinaryRange = BinaryRange;

},{}],93:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryTree = void 0;
const BinaryRange_1 = require("./BinaryRange");
class BinaryTree {
    constructor(opts) {
        this._range = new BinaryRange_1.BinaryRange(0, 0);
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
            this._childRange0 = new BinaryRange_1.BinaryRange(this._range.from, this._range.mid);
        return this._childRange0;
    }
    get childRange1() {
        if (!this._childRange1)
            this._childRange1 = new BinaryRange_1.BinaryRange(this._range.mid, this._range.to);
        return this._childRange1;
    }
    split() {
        if (this._child0 && this._child1)
            return;
        let item, itemRange, inChild0, inChild1, in_lb, in_rb, hitCount;
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
exports.BinaryTree = BinaryTree;

},{"./BinaryRange":92}],94:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Css = void 0;
const style_element_id = 'g_whiteboard_styles';
var Css;
(function (Css) {
    function add(style) {
        let ele = document.getElementById(style_element_id);
        if (!ele || ele.tagName !== 'STYLE') {
            ele = document.createElement('style');
            ele.id = style_element_id;
            document.head.append(ele);
        }
        ele.innerHTML += style;
    }
    Css.add = add;
})(Css = exports.Css || (exports.Css = {}));

},{}],95:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],96:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],97:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuadTree = void 0;
const Rect_1 = require("./Rect");
class QuadTree {
    constructor(opts) {
        this._items = [];
        this._itemCount = 0;
        this._rect = new Rect_1.Rect(0, 0, 0, 0);
        this._level = 0;
        this._opts = Object.assign({}, opts);
        this._rect.set(opts.rect);
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
            this._childRect0 = new Rect_1.Rect(x, y, w, h);
        }
        return this._childRect0;
    }
    get childRect1() {
        if (!this._childRect1) {
            const { y } = this.rect;
            const w = this.rect.w / 2;
            const h = this.rect.h / 2;
            const { x: midX } = this.rect.mid();
            this._childRect1 = new Rect_1.Rect(midX, y, w, h);
        }
        return this._childRect1;
    }
    get childRect2() {
        if (!this._childRect2) {
            const { x } = this.rect;
            const w = this.rect.w / 2;
            const h = this.rect.h / 2;
            const { y: midY } = this.rect.mid();
            this._childRect2 = new Rect_1.Rect(x, midY, w, h);
        }
        return this._childRect2;
    }
    get childRect3() {
        if (!this._childRect3) {
            const w = this.rect.w / 2;
            const h = this.rect.h / 2;
            const { x: midX, y: midY } = this.rect.mid();
            this._childRect3 = new Rect_1.Rect(midX, midY, w, h);
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
exports.QuadTree = QuadTree;

},{"./Rect":98}],98:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
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
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    set(o) {
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
    static create(rect) {
        return new Rect(rect.x, rect.y, rect.w, rect.h);
    }
    static pure(x, y, w, h) {
        return { x, y, w, h };
    }
    static bounds(r1, r2) {
        const x = Math.min(r1.x, r2.x);
        const y = Math.min(r1.y, r2.y);
        return {
            x, y,
            w: Math.max(r1.x + r1.w, r2.x + r2.w) - x,
            h: Math.max(r1.y + r1.h, r2.y + r2.h) - y
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
        const x = Math.max(a.x, b.x);
        const y = Math.max(a.y, b.y);
        const right = Math.min(a.x + a.w, b.x + b.w);
        const bottom = Math.min(a.y + a.h, b.y + b.h);
        return {
            x, y,
            w: right - x,
            h: bottom - y
        };
    }
}
exports.Rect = Rect;

},{}],99:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectHelper = exports.LockMode = exports.GenMode = void 0;
const Vector_1 = require("./Vector");
var GenMode;
(function (GenMode) {
    GenMode[GenMode["FromCorner"] = 0] = "FromCorner";
    GenMode[GenMode["FromCenter"] = 1] = "FromCenter";
})(GenMode = exports.GenMode || (exports.GenMode = {}));
var LockMode;
(function (LockMode) {
    LockMode[LockMode["Default"] = 0] = "Default";
    LockMode[LockMode["Square"] = 1] = "Square";
    LockMode[LockMode["Circle"] = 2] = "Circle";
})(LockMode = exports.LockMode || (exports.LockMode = {}));
class RectHelper {
    constructor() {
        this._from = Vector_1.Vector.pure(NaN, NaN);
        this._to = Vector_1.Vector.pure(NaN, NaN);
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
        this._from = Vector_1.Vector.pure(NaN, NaN);
        this._to = Vector_1.Vector.pure(NaN, NaN);
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
exports.RectHelper = RectHelper;

},{"./Vector":101}],100:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotatedRect = void 0;
const Vector_1 = require("./Vector");
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
    set bottom(v) {
        this.h = v - this.y;
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
        this.r = o.r;
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
    static create(rect) {
        return new RotatedRect(rect.x, rect.y, rect.w, rect.h, rect.r);
    }
    static pure(x, y, w, h, r) {
        return { x, y, w, h, r };
    }
    static hit(a, b) {
        const realA = a instanceof RotatedRect ? a : new RotatedRect(a.x, a.y, a.w, a.h, a.r || 0);
        const realB = b instanceof RotatedRect ? b : new RotatedRect(b.x, b.y, b.w, b.h, b.r || 0);
        const centerDistanceVertor = { x: realA.middleX - realB.middleX, y: realA.middleY - realB.middleY };
        const axes = [realA._axisX, realA._axisY, realB._axisX, realB._axisY];
        for (let i = 0, len = axes.length; i < len; i++) {
            const a = axes[i];
            const p0 = realA.projection(a);
            const p1 = realB.projection(a);
            const p2 = Vector_1.Vector.dot(centerDistanceVertor, a) * 2;
            if (p0 + p1 <= p2) {
                return false;
            }
        }
        return true;
    }
    projection(axis) {
        const px = Vector_1.Vector.dot(this._axisX, axis);
        const py = Vector_1.Vector.dot(this._axisY, axis);
        return px * this.w + py * this.h;
    }
}
exports.RotatedRect = RotatedRect;

},{"./Vector":101}],101:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
class Vector {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
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
        return Math.sqrt(Math.pow(a.x - b.x, 2) +
            Math.pow(a.y - b.y, 2));
    }
    static manhattan(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    static dot(a, b) {
        return Math.abs(a.x * b.x + a.y * b.y);
    }
    static multiply(a, n) {
        return { x: a.x * n, y: a.y * n };
    }
}
exports.Vector = Vector;

},{}],102:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStr = exports.isNum = void 0;
const isNum = (x) => typeof x === 'number';
exports.isNum = isNum;
const isStr = (x) => typeof x === 'string';
exports.isStr = isStr;

},{}],103:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = void 0;
function getValue(v, prev) {
    return typeof v !== 'function' ? v : v(prev);
}
exports.getValue = getValue;
__exportStar(require("./BinaryRange"), exports);
__exportStar(require("./BinaryTree"), exports);
__exportStar(require("./Dot"), exports);
__exportStar(require("./ITree"), exports);
__exportStar(require("./QuadTree"), exports);
__exportStar(require("./Rect"), exports);
__exportStar(require("./Vector"), exports);
__exportStar(require("./RotatedRect"), exports);

},{"./BinaryRange":92,"./BinaryTree":93,"./Dot":95,"./ITree":96,"./QuadTree":97,"./Rect":98,"./RotatedRect":100,"./Vector":101}]},{},[16]);
