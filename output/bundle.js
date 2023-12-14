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
const cjs_1 = require("../../dist/cjs");
const cjs_2 = require("../../dist/cjs");
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
            if (toolType !== cjs_1.ToolEnum.Selector) {
                board.toolType = cjs_1.ToolEnum.Selector;
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
            selector.connect(selects).moveBy(diffX, diffY).emitGeoEvent.enforce(true);
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
            [BehaviorEnum.ToolSelector]: () => this.board.setToolType(cjs_1.ToolEnum.Selector),
            [BehaviorEnum.ToolPen]: () => this.board.setToolType(cjs_1.ToolEnum.Pen),
            [BehaviorEnum.ToolRect]: () => this.board.setToolType(cjs_1.ToolEnum.Rect),
            [BehaviorEnum.ToolOval]: () => this.board.setToolType(cjs_1.ToolEnum.Oval),
            [BehaviorEnum.ToolText]: () => this.board.setToolType(cjs_1.ToolEnum.Text),
            [BehaviorEnum.ToolTick]: () => this.board.setToolType(cjs_1.ToolEnum.Tick),
            [BehaviorEnum.ToolCross]: () => this.board.setToolType(cjs_1.ToolEnum.Cross),
            [BehaviorEnum.ToolHalfTick]: () => this.board.setToolType(cjs_1.ToolEnum.HalfTick),
            [BehaviorEnum.ToolLines]: () => this.board.setToolType(cjs_1.ToolEnum.Lines),
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
        this._clipboard = new cjs_2.FClipboard(board);
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

},{"../../dist/cjs":17}],16:[function(require,module,exports){
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
const cjs_1 = require("../../dist/cjs");
const Button_1 = require("./G/BaseView/Button");
const SizeType_1 = require("./G/BaseView/SizeType");
const Styles_1 = require("./G/BaseView/Styles");
const View_1 = require("./G/BaseView/View");
const Menu_1 = require("./G/CompoundView/Menu");
const ButtonGroup_1 = require("./G/Helper/ButtonGroup");
const Shiftable_1 = require("./Shiftable");
const Shortcuts_1 = require("./Shortcuts");
const Gim = __importStar(require("../../dist/cjs"));
View_1.View.get(document.head).addChild(new View_1.View('title', '每日一句'), new View_1.View('link')
    .setAttribute('rel', 'icon')
    .setAttribute('sizes', '16x16')
    .setAttribute('href', './calendar_phrases/logo.png'));
Styles_1.Styles.css('./calendar_phrases/styles/index.css', './calendar_phrases/styles/edit_panel.css').then(() => main());
function main() {
    const resultWidth = 600;
    const resultHeight = 600;
    const factory = cjs_1.Gaia.factory(cjs_1.FactoryEnum.Default)();
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
    cjs_1.Gaia.editToolInfo(cjs_1.ToolEnum.Cross, v => (Object.assign(Object.assign({}, v), { name: '打叉' })));
    cjs_1.Gaia.editToolInfo(cjs_1.ToolEnum.HalfTick, v => (Object.assign(Object.assign({}, v), { name: '半对' })));
    cjs_1.Gaia.editToolInfo(cjs_1.ToolEnum.Img, v => (Object.assign(Object.assign({}, v), { name: '图片' })));
    cjs_1.Gaia.editToolInfo(cjs_1.ToolEnum.Lines, v => (Object.assign(Object.assign({}, v), { name: '直线' })));
    cjs_1.Gaia.editToolInfo(cjs_1.ToolEnum.Oval, v => (Object.assign(Object.assign({}, v), { name: '椭圆' })));
    cjs_1.Gaia.editToolInfo(cjs_1.ToolEnum.Pen, v => (Object.assign(Object.assign({}, v), { name: '笔' })));
    cjs_1.Gaia.editToolInfo(cjs_1.ToolEnum.Polygon, v => (Object.assign(Object.assign({}, v), { name: '多边形' })));
    cjs_1.Gaia.editToolInfo(cjs_1.ToolEnum.Rect, v => (Object.assign(Object.assign({}, v), { name: '矩形' })));
    cjs_1.Gaia.editToolInfo(cjs_1.ToolEnum.Selector, v => (Object.assign(Object.assign({}, v), { name: '选择器' })));
    cjs_1.Gaia.editToolInfo(cjs_1.ToolEnum.Text, v => (Object.assign(Object.assign({}, v), { name: '文本' })));
    cjs_1.Gaia.editToolInfo(cjs_1.ToolEnum.Tick, v => (Object.assign(Object.assign({}, v), { name: '打钩' })));
    const menu = new Menu_1.Menu(mainView.current).setup([{
            label: '工具',
            items: cjs_1.Gaia.listTools()
                .filter(v => v !== cjs_1.ToolEnum.Img && v !== cjs_1.ToolEnum.Polygon)
                .map(v => { var _a, _b; return ({ key: v, label: (_b = (_a = cjs_1.Gaia.toolInfo(v)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : v }); })
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
            case cjs_1.ToolEnum.Rect:
            case cjs_1.ToolEnum.Oval:
            case cjs_1.ToolEnum.Pen:
            case cjs_1.ToolEnum.Polygon:
            case cjs_1.ToolEnum.Text:
            case cjs_1.ToolEnum.Selector:
            case cjs_1.ToolEnum.Tick:
            case cjs_1.ToolEnum.Cross:
            case cjs_1.ToolEnum.HalfTick:
            case cjs_1.ToolEnum.Lines:
            case cjs_1.ToolEnum.Img:
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
                            const shape = board.factory.newShape(cjs_1.ShapeEnum.Img);
                            shape.data.src = img.src;
                            shape.data.w = img.naturalWidth;
                            shape.data.h = img.naturalHeight;
                            shape.data.layer = board.layer().id;
                            shape.data.objectFit = cjs_1.ObjectFit.Cover;
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
    const aq = new cjs_1.ActionQueue().setActor(board);
    const rec = new cjs_1.Recorder().setActor(board);
    const sc = new cjs_1.Player();
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
            needText = needText || shape.data.type === cjs_1.ShapeEnum.Text;
            needImg = needImg || shape.data.type === cjs_1.ShapeEnum.Img;
            if (shape.data.needStroke) {
                const temp = shape.data.lineWidth;
                if (lineWidth === null) {
                    lineWidth = temp;
                }
                else if (lineWidth !== temp) {
                    lineWidth = undefined;
                }
            }
            if (shape.data.type === cjs_1.ShapeEnum.Text) {
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
    board.addEventListener(cjs_1.EventEnum.ShapesSelected, e => updateEditPanel());
    board.addEventListener(cjs_1.EventEnum.ShapesDeselected, e => updateEditPanel());
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
        const img_main = ((_a = board.find('img_header')) !== null && _a !== void 0 ? _a : board.factory.newShape(cjs_1.ShapeEnum.Img));
        const imgd_main = img_main.data.copy();
        imgd_main.id = 'img_header';
        imgd_main.src = ttt.main_pic.src;
        imgd_main.locked = true;
        imgd_main.x = 0;
        imgd_main.y = 0;
        imgd_main.w = resultWidth;
        imgd_main.h = resultHeight;
        imgd_main.layer = board.layer().id;
        imgd_main.objectFit = cjs_1.ObjectFit.Cover;
        img_main.merge(imgd_main);
        img_main.board || board.add(img_main, true);
        const img_logo = ((_b = board.find('img_logo')) !== null && _b !== void 0 ? _b : board.factory.newShape(cjs_1.ShapeEnum.Img));
        const imgd_logo = img_logo.data.copy();
        imgd_logo.id = 'img_logo';
        imgd_logo.src = ttt.logo_img.src;
        imgd_logo.w = ttt.logo_img.w;
        imgd_logo.h = ttt.logo_img.h;
        imgd_logo.x = resultWidth - ttt.logo_img.w - 15;
        imgd_logo.y = resultHeight - ttt.logo_img.h - 15;
        imgd_logo.layer = board.layer().id;
        imgd_logo.objectFit = cjs_1.ObjectFit.Cover;
        img_logo.merge(imgd_logo);
        img_logo.board || board.add(img_logo, true);
        const txt_main_font_size = 48;
        const txt_main_offset_y = 15;
        const txt_main = ((_c = board.find('txt_content')) !== null && _c !== void 0 ? _c : board.factory.newShape(cjs_1.ShapeEnum.Text));
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
        const txt_date = ((_d = board.find('txt_date')) !== null && _d !== void 0 ? _d : board.factory.newShape(cjs_1.ShapeEnum.Text));
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
        const txt_week_and_year = ((_e = board.find('txt_week_and_year')) !== null && _e !== void 0 ? _e : board.factory.newShape(cjs_1.ShapeEnum.Text));
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
    const templateText = board.factory.shapeTemplate(cjs_1.ShapeEnum.Text);
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
            if (shape instanceof cjs_1.ShapeText) {
                shape.fontSize = shape.fontSize + 1;
            }
        });
    });
    const btnFontSizeDown = new Button_1.Button().init({ content: 'A➖', size: SizeType_1.SizeType.Large, title: 'A↓' });
    btnFontSizeDown.disabled = true;
    btnFontSizeDown.addEventListener('click', () => {
        board.selects.forEach(shape => {
            if (shape instanceof cjs_1.ShapeText) {
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
    btnToolPen.addEventListener('click', () => { board.setToolType(cjs_1.ToolEnum.Pen); });
    const btnToolTxt = new Button_1.Button().init({ content: '💬', size: SizeType_1.SizeType.Large, title: '工具：文本' });
    btnToolTxt.addEventListener('click', () => { board.setToolType(cjs_1.ToolEnum.Text); });
    const btnToolRect = new Button_1.Button().init({ content: '⬜', size: SizeType_1.SizeType.Large, title: '工具：矩形' });
    btnToolRect.addEventListener('click', () => { board.setToolType(cjs_1.ToolEnum.Rect); });
    const btnToolOval = new Button_1.Button().init({ content: '⚪', size: SizeType_1.SizeType.Large, title: '工具：椭圆' });
    btnToolOval.addEventListener('click', () => { board.setToolType(cjs_1.ToolEnum.Oval); });
    const btnToolSelector = new Button_1.Button().init({ content: '🖱️', size: SizeType_1.SizeType.Large, title: '工具：选择器' });
    btnToolSelector.addEventListener('click', () => { board.setToolType(cjs_1.ToolEnum.Selector); });
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
    board.setToolType(cjs_1.ToolEnum.Selector);
    Object.assign(window, {
        board, factory, mainView, Gaia: cjs_1.Gaia, menu,
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

},{"../../dist/cjs":17,"./G/BaseView/Button":1,"./G/BaseView/SizeType":2,"./G/BaseView/Styles":4,"./G/BaseView/View":5,"./G/CompoundView/Menu":8,"./G/Helper/ButtonGroup":10,"./Shiftable":14,"./Shortcuts":15}],17:[function(require,module,exports){
'use strict';

exports.Events = void 0;
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
})(exports.Events || (exports.Events = {}));

exports.EventEnum = void 0;
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
})(exports.EventEnum || (exports.EventEnum = {}));

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

class QuadTree {
    constructor(opts) {
        this._items = [];
        this._itemCount = 0;
        this._rect = new Rect(0, 0, 0, 0);
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

class Vector {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    plus(o) { return this.add(o.x, o.y); }
    add(x, y) {
        this.x += x;
        this.y += y;
        return this;
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
    static create(rect) {
        return new RotatedRect(rect.x, rect.y, rect.w, rect.h, rect.r);
    }
    static pure(x, y, w, h, r) {
        return { x, y, w, h, r };
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

exports.Numbers = void 0;
(function (Numbers) {
    function equals(a, b) {
        return Math.abs(a - b) <= Number.EPSILON;
    }
    Numbers.equals = equals;
})(exports.Numbers || (exports.Numbers = {}));
exports.Degrees = void 0;
(function (Degrees) {
    function normalized(v) {
        if (!v)
            return v;
        else if (exports.Numbers.equals(0, v))
            return 0;
        else if (v < 0)
            return v % (Math.PI * 2) + Math.PI * 2;
        else
            return v % (Math.PI * 2);
    }
    Degrees.normalized = normalized;
    function angle(v) {
        return v ? 180 * v / Math.PI : v;
    }
    Degrees.angle = angle;
})(exports.Degrees || (exports.Degrees = {}));

exports.Arrays = void 0;
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
})(exports.Arrays || (exports.Arrays = {}));

function getValue(v, prev) {
    return typeof v !== 'function' ? v : v(prev);
}

const isNum = (x) => typeof x === 'number';
const isStr = (x) => typeof x === 'string';

exports.ShapeEnum = void 0;
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
})(exports.ShapeEnum || (exports.ShapeEnum = {}));
function getShapeName(type) {
    switch (type) {
        case exports.ShapeEnum.Invalid: return 'ShapeEnum.Invalid';
        case exports.ShapeEnum.Pen: return 'ShapeEnum.Pen';
        case exports.ShapeEnum.Rect: return 'ShapeEnum.Rect';
        case exports.ShapeEnum.Oval: return 'ShapeEnum.Oval';
        case exports.ShapeEnum.Text: return 'ShapeEnum.Text';
        case exports.ShapeEnum.Polygon: return 'ShapeEnum.Polygon';
        case exports.ShapeEnum.Tick: return 'ShapeEnum.Tick';
        case exports.ShapeEnum.Cross: return 'ShapeEnum.Cross';
        case exports.ShapeEnum.HalfTick: return 'ShapeEnum.HalfTick';
        case exports.ShapeEnum.Lines: return 'ShapeEnum.Lines';
        case exports.ShapeEnum.Img: return 'ShapeEnum.Img';
        default: return type;
    }
}

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

class ShapeData {
    constructor() {
        this.t = exports.ShapeEnum.Invalid;
        this.i = '';
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.z = 0;
        /** layerId */
        this.l = '';
        /** rotation */
        this.r = void 0;
        this.style = new ShapeStyle();
        this.status = new ShapeStatus();
    }
    get type() { return this.t; }
    set type(v) { this.t = v; }
    get id() { return this.i; }
    set id(v) { this.i = v; }
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
    set rotation(v) { this.r = exports.Degrees.normalized(v); }
    merge(o) {
        this.read(o);
        return this;
    }
    read(o) {
        if (isStr(o.t) || isNum(o.t))
            this.t = o.t;
        if (isStr(o.i))
            this.i = o.i;
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
        this.r = isNum(o.r) ? o.r : void 0;
        const { style, status } = o;
        if (style)
            this.style.read(style);
        if (status)
            this.status.read(status);
        return this;
    }
    copy() {
        const ret = new (Object.getPrototypeOf(this).constructor);
        return ret.read(this);
    }
}

var ShapeEventEnum;
(function (ShapeEventEnum) {
    ShapeEventEnum["StartDirty"] = "start_dirty";
    ShapeEventEnum["EndDirty"] = "end_dirty";
    ShapeEventEnum["BoardChanged"] = "board_changed";
})(ShapeEventEnum || (ShapeEventEnum = {}));

exports.ResizeDirection = void 0;
(function (ResizeDirection) {
    ResizeDirection[ResizeDirection["None"] = 0] = "None";
    ResizeDirection[ResizeDirection["Top"] = 1] = "Top";
    ResizeDirection[ResizeDirection["TopRight"] = 2] = "TopRight";
    ResizeDirection[ResizeDirection["Right"] = 3] = "Right";
    ResizeDirection[ResizeDirection["BottomRight"] = 4] = "BottomRight";
    ResizeDirection[ResizeDirection["Bottom"] = 5] = "Bottom";
    ResizeDirection[ResizeDirection["BottomLeft"] = 6] = "BottomLeft";
    ResizeDirection[ResizeDirection["Left"] = 7] = "Left";
    ResizeDirection[ResizeDirection["TopLeft"] = 8] = "TopLeft";
})(exports.ResizeDirection || (exports.ResizeDirection = {}));
/**
 * 表示图形能以何种方式被拉伸
 *
 * @export
 * @enum {number}
 */
exports.Resizable = void 0;
(function (Resizable) {
    /**
     * 图形不能被拉伸
     */
    Resizable[Resizable["None"] = 0] = "None";
    /**
     * 八方向拉伸
     */
    Resizable[Resizable["All"] = 1] = "All";
})(exports.Resizable || (exports.Resizable = {}));
/**
 * 一切图形的基类
 *
 * @export
 * @class Shape 图形基类
 * @template D 图形数据类
 */
class Shape {
    constructor(data) {
        this._resizable = exports.Resizable.None;
        this._relCount = 0;
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
    set board(v) {
        if (v === this._board)
            return;
        const prev = this._board;
        this._board = v;
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
    get visible() { return this._data.visible; }
    set visible(v) {
        if (this._data.visible === v)
            return;
        const prev = { status: { v: v ? 0 : (void 0) } };
        this.beginDirty(prev);
        this._data.visible = v;
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
    get editing() { return this._data.editing; }
    set editing(v) {
        if (this._data.editing === v)
            return;
        const prev = { status: { e: v ? (void 0) : 1 } };
        this.beginDirty(prev);
        this._data.editing = v;
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
    get selected() { return this._data.selected; }
    set selected(v) {
        if (this._data.selected === v)
            return;
        const prev = { status: { s: v ? (void 0) : 1 } };
        this.beginDirty(prev);
        this._data.selected = v;
        this.endDirty(prev);
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
        const prev = { status: { f: v ? (void 0) : 1 } };
        this.beginDirty(prev);
        this._data.locked = v;
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
    get ghost() { return this._data.ghost; }
    set ghost(v) {
        if (this._data.ghost === v)
            return;
        const prev = { status: { g: v ? (void 0) : 1 } };
        this.beginDirty(prev);
        this._data.ghost = v;
        this.endDirty(prev);
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
        const prev = { style: { g: this._data.lineWidth } };
        this.beginDirty(prev);
        this._data.lineWidth = Math.max(0, v);
        this.endDirty(prev);
    }
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
    markDirty(rect = this.boundingRect()) {
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
    move(x, y) {
        this.geo(x, y, this._data.w, this._data.h);
    }
    resize(w, h) {
        this.geo(this._data.x, this._data.y, w, h);
    }
    get x() { return this._data.x; }
    get y() { return this._data.y; }
    get halfW() { return this._data.w / 2; }
    get halfH() { return this._data.h / 2; }
    get midX() { return this._data.x + this.halfW; }
    get midY() { return this._data.y + this.halfH; }
    get w() { return this._data.w; }
    get h() { return this._data.h; }
    get left() { return this._data.x; }
    get right() { return this._data.y; }
    get top() { return this._data.w + this._data.x; }
    get bottom() { return this._data.h + this._data.y; }
    get topLeft() { return { x: this.left, y: this.top }; }
    get bottomLeft() { return { x: this.left, y: this.bottom }; }
    get topRight() { return { x: this.right, y: this.top }; }
    get bottomRight() { return { x: this.right, y: this.bottom }; }
    get leftTop() { return this.topLeft; }
    get leftBottom() { return this.bottomLeft; }
    get rightTop() { return this.topRight; }
    get rightBottom() { return this.bottomRight; }
    get rotatedTopLeft() { return this.map2world(0, 0); }
    get rotatedBottomLeft() { return this.map2world(0, this.h); }
    get rotatedTopRight() { return this.map2world(this.w, 0); }
    get rotatedBottomRight() { return this.map2world(this.w, this.h); }
    get rotatedLeftTop() { return this.map2world(0, 0); }
    get rotatedLeftBottom() { return this.map2world(0, this.h); }
    get rotatedRightTop() { return this.map2world(this.w, 0); }
    get rotatedRightBottom() { return this.map2world(this.w, this.h); }
    get midTop() { return { x: this.midX, y: this.top }; }
    get midBottom() { return { x: this.midX, y: this.bottom }; }
    get midLeft() { return { x: this.left, y: this.midY }; }
    get midRight() { return { x: this.right, y: this.midY }; }
    get rotatedMidTop() { return this.map2world(this.halfW, 0); }
    get rotatedMidBottom() { return this.map2world(this.halfW, this.h); }
    get rotatedMidLeft() { return this.map2world(0, this.halfH); }
    get rotatedMidRight() { return this.map2world(this.w, this.halfH); }
    get rotatedMid() { return this.map2world(this.halfW, this.halfH); }
    get rotation() { return this.data.rotation; }
    rotateBy(d, ox = void 0, oy = void 0) {
        const r = this._data.rotation + d;
        this.rotateTo(r, ox, oy);
    }
    rotateTo(r, ox = void 0, oy = void 0) {
        if (r == this._data.rotation)
            return;
        const prev = { x: this._data.x, y: this._data.y, r: this._data.r };
        this.beginDirty(prev);
        const { w, h, midX: mx, midY: my } = this;
        ox = ox !== null && ox !== void 0 ? ox : mx;
        oy = oy !== null && oy !== void 0 ? oy : my;
        const mx1 = (mx - ox) * Math.cos(r) - (my - oy) * Math.sin(r) + ox;
        const my1 = (mx - ox) * Math.sin(r) + (my - oy) * Math.cos(r) + oy;
        this._data.x = mx1 - w / 2;
        this._data.y = my1 - h / 2;
        this._data.rotation = r % (Math.PI * 2);
        this.endDirty(prev);
    }
    getGeo() {
        return new Rect(this._data.x, this._data.y, this._data.w, this._data.h);
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
        const prev = {
            x: this._data.x, y: this._data.y,
            w: this._data.w, h: this._data.h
        };
        this.beginDirty(prev);
        this._data.x = x;
        this._data.y = y;
        this._data.w = w;
        this._data.h = h;
        this.endDirty(prev);
    }
    moveBy(x, y) {
        this.geo(this._data.x + x, this._data.y + y, this._data.w, this._data.h);
    }
    resizeBy(w, h) {
        this.geo(this._data.x, this._data.y, this._data.w + w, this._data.h + h);
    }
    geoBy(x, y, w, h) {
        this.geo(this._data.x + x, this._data.y + y, this._data.w + w, this._data.h + h);
    }
    render(ctx) {
        var _a, _b, _c, _d, _e, _f;
        if (!this.visible)
            return;
        const decoration = (_a = this.board) === null || _a === void 0 ? void 0 : _a.factory.shapeDecoration(this);
        const { ghost, locked, resizable, selected } = this;
        this.beginDraw(ctx);
        ghost && ((_b = decoration === null || decoration === void 0 ? void 0 : decoration.ghost) === null || _b === void 0 ? void 0 : _b.call(decoration, this, ctx));
        selected && locked && ((_c = decoration === null || decoration === void 0 ? void 0 : decoration.locked) === null || _c === void 0 ? void 0 : _c.call(decoration, this, ctx));
        selected && !locked && ((_d = decoration === null || decoration === void 0 ? void 0 : decoration.selected) === null || _d === void 0 ? void 0 : _d.call(decoration, this, ctx));
        selected && !locked && resizable && ((_e = decoration === null || decoration === void 0 ? void 0 : decoration.resizable) === null || _e === void 0 ? void 0 : _e.call(decoration, this, ctx));
        this.endDraw(ctx);
        (_f = decoration === null || decoration === void 0 ? void 0 : decoration.debug) === null || _f === void 0 ? void 0 : _f.call(decoration, this, ctx);
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
        var _a;
        const d = this.data;
        const offset = (d.lineWidth % 2) ? 1 : 0;
        const overbound1 = ((_a = this.board) === null || _a === void 0 ? void 0 : _a.factory.overbound(this)) || 1;
        const overbound2 = overbound1 * 2;
        if (!d.r)
            return {
                x: Math.floor(d.x - d.lineWidth / 2 - overbound1),
                y: Math.floor(d.y - d.lineWidth / 2 - overbound1),
                w: Math.ceil(d.w + d.lineWidth + offset + overbound2),
                h: Math.ceil(d.h + d.lineWidth + offset + overbound2)
            };
        const w = Math.abs(d.w * Math.cos(d.r)) + Math.abs(d.h * Math.sin(d.r));
        const h = Math.abs(d.w * Math.sin(d.r)) + Math.abs(d.h * Math.cos(d.r));
        const x = d.x - (w - d.w) / 2;
        const y = d.y - (h - d.h) / 2;
        return {
            x: Math.floor(x - d.lineWidth / 2 - overbound1),
            y: Math.floor(y - d.lineWidth / 2 - overbound1),
            w: Math.ceil(w + d.lineWidth + offset + overbound2),
            h: Math.ceil(h + d.lineWidth + offset + overbound2)
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
    map2me(arg0, arg1) {
        const ix = isNum(arg0) ? arg0 : arg0.x;
        const iy = isNum(arg0) ? arg1 : arg0.y;
        const { r, x, y } = this.data;
        if (!r)
            return new Vector(ix - x, iy - y);
        const mx = this.midX;
        const my = this.midY;
        const cr = Math.cos(-r);
        const sr = Math.sin(-r);
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
        const cr = Math.cos(r);
        const sr = Math.sin(r);
        const dx = ix - mx;
        const dy = iy - my;
        return {
            x: dx * cr - dy * sr + mx + x,
            y: dx * sr + dy * cr + my + y
        };
    }
    resizeDirection(pointerX, pointerY) {
        if (!this.selected || !this._resizable || this.ghost || this.locked) {
            return [exports.ResizeDirection.None, undefined];
        }
        const { x: l, y: t } = this.data;
        const { x, y, w, h } = this.selectorRect();
        const { s, lx, rx, ty, by, mx, my } = this.getResizerNumbers(l + x, t + y, w, h);
        const pos = { x: pointerX, y: pointerY };
        const rect = new Rect(0, 0, s, s);
        rect.moveTo(mx, ty);
        if (rect.hit(pos)) {
            return [exports.ResizeDirection.Top, rect];
        }
        rect.moveTo(mx, by);
        if (rect.hit(pos)) {
            return [exports.ResizeDirection.Bottom, rect];
        }
        rect.moveTo(lx, my);
        if (rect.hit(pos)) {
            return [exports.ResizeDirection.Left, rect];
        }
        rect.moveTo(rx, my);
        if (rect.hit(pos)) {
            return [exports.ResizeDirection.Right, rect];
        }
        rect.moveTo(lx, ty);
        if (rect.hit(pos)) {
            return [exports.ResizeDirection.TopLeft, rect];
        }
        rect.moveTo(rx, ty);
        if (rect.hit(pos)) {
            return [exports.ResizeDirection.TopRight, rect];
        }
        rect.moveTo(lx, by);
        if (rect.hit(pos)) {
            return [exports.ResizeDirection.BottomLeft, rect];
        }
        rect.moveTo(rx, by);
        if (rect.hit(pos)) {
            return [exports.ResizeDirection.BottomRight, rect];
        }
        return [exports.ResizeDirection.None, undefined];
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

class ShapeNeedPath extends Shape {
    constructor(data) {
        super(data);
        this._resizable = exports.Resizable.All;
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

class OvalData extends ShapeData {
    constructor() {
        super();
        this.type = exports.ShapeEnum.Oval;
        // this.fillStyle = '#00000000'
        this.strokeStyle = '#ff0000';
        this.lineWidth = 2;
    }
}

exports.ToolEnum = void 0;
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
})(exports.ToolEnum || (exports.ToolEnum = {}));
function getToolName(type) {
    switch (type) {
        case exports.ToolEnum.Invalid: return 'ToolEnum.Invalid';
        case exports.ToolEnum.Pen: return 'ToolEnum.Pen';
        case exports.ToolEnum.Rect: return 'ToolEnum.Rect';
        case exports.ToolEnum.Oval: return 'ToolEnum.Oval';
        case exports.ToolEnum.Text: return 'ToolEnum.Text';
        case exports.ToolEnum.Polygon: return 'ToolEnum.Polygon';
        case exports.ToolEnum.Tick: return 'ToolEnum.Tick';
        case exports.ToolEnum.Cross: return 'ToolEnum.Cross';
        case exports.ToolEnum.HalfTick: return 'ToolEnum.HalfTick';
        case exports.ToolEnum.Lines: return 'ToolEnum.Lines';
        case exports.ToolEnum.Lines: return 'ToolEnum.Img';
        default: return type;
    }
}

const Tag$2 = '[Gaia]';
class Gaia {
    static registerFactory(type, creator, info) {
        if (this._factorys.has(type)) {
            console.warn(Tag$2, `registerFactory(), factory '${type}' already exists!`);
        }
        else if (this._factoryInfos.has(type)) {
            console.warn(Tag$2, `registerFactory(), factory info '${type}' already exists!`);
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
            console.warn(Tag$2, `registerTool(), tool '${type}' already exists!`);
        }
        else if (this._toolInfos.has(type)) {
            console.warn(Tag$2, `registerTool(), tool info '${type}' already exists!`);
        }
        this._tools.set(type, creator);
        this._toolInfos.set(type, {
            shape: info === null || info === void 0 ? void 0 : info.shape,
            name: (info === null || info === void 0 ? void 0 : info.name) || getToolName(type),
            desc: (info === null || info === void 0 ? void 0 : info.desc) || getToolName(type),
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
            console.warn(Tag$2, `registerShape(), shape info '${type}' already exists!`);
        }
        else if (this._shapeDatas.has(type)) {
            console.warn(Tag$2, `registerShape(), shape data'${type}' already exists!`);
        }
        else if (this._shapes.has(type)) {
            console.warn(Tag$2, `registerShape(), shape '${type}' already exists!`);
        }
        this._shapeInfos.set(type, {
            name: (info === null || info === void 0 ? void 0 : info.name) || getShapeName(type),
            desc: (info === null || info === void 0 ? void 0 : info.desc) || getShapeName(type),
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
Gaia._tools = new Map();
Gaia._toolInfos = new Map();
Gaia._shapeDatas = new Map();
Gaia._shapes = new Map();
Gaia._shapeInfos = new Map();
Gaia._factorys = new Map();
Gaia._factoryInfos = new Map();
Gaia._actionHandler = new Map();

class ShapeOval extends ShapeNeedPath {
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
Gaia.registerShape(exports.ShapeEnum.Oval, () => new OvalData, d => new ShapeOval(d));

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
                this._prevData = exports.Events.pickShapeGeoData(shape.data);
                this._startData = this._prevData;
                this.applyRect();
                break;
            }
            case 1: {
                this.applyRect();
                const curr = exports.Events.pickShapeGeoData(shape.data);
                board.emitEvent(exports.EventEnum.ShapesGeoChanging, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: [[curr, this._prevData]]
                });
                this._prevData = curr;
                break;
            }
            case 2: {
                this.applyRect();
                const curr = exports.Events.pickShapeGeoData(shape.data);
                board.emitEvent(exports.EventEnum.ShapesGeoChanging, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: [[curr, this._prevData]]
                });
                board.emitEvent(exports.EventEnum.ShapesGeoChanged, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: [[curr, this._startData]]
                });
                board.emitEvent(exports.EventEnum.ShapesDone, {
                    operator: board.whoami,
                    shapeDatas: [shape.data.copy()]
                });
                this._prevData = curr;
                break;
            }
        }
    }
}

class OvalTool extends SimpleTool {
    constructor() {
        super(exports.ToolEnum.Oval, exports.ShapeEnum.Oval);
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
Gaia.registerTool(exports.ToolEnum.Oval, () => new OvalTool(), { name: 'Oval', desc: 'oval drawer', shape: exports.ShapeEnum.Oval });

exports.DotsType = void 0;
(function (DotsType) {
    DotsType[DotsType["Invalid"] = 0] = "Invalid";
    DotsType[DotsType["All"] = 1] = "All";
    DotsType[DotsType["Append"] = 2] = "Append";
    DotsType[DotsType["Subtract"] = 3] = "Subtract";
})(exports.DotsType || (exports.DotsType = {}));
class PenData extends ShapeData {
    get needFill() {
        return false;
    }
    constructor() {
        super();
        this.dotsType = exports.DotsType.All;
        this.coords = [];
        this.type = exports.ShapeEnum.Pen;
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
            case exports.DotsType.Subtract:
                this.coords = this.coords.slice(0, -other.coords.length);
                break;
            case exports.DotsType.Append:
                this.coords.push(...other.coords);
                break;
            default:
                this.coords = [...other.coords];
                break;
        }
        return this;
    }
}

class ShapePen extends Shape {
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
                this.updateSrcGeo(x, y);
                if (i === 0)
                    this.updatePath(x, y, 'first');
                else if (!this.data.editing && i === endIdx)
                    this.updatePath(x, y, 'last');
                else
                    this.updatePath(x, y);
            }
        }
        this.endDirty(prev);
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
        this.endDirty();
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
Gaia.registerShape(exports.ShapeEnum.Pen, () => new PenData, d => new ShapePen(d));

class PenTool {
    start() {
    }
    end() {
        delete this._curShape;
    }
    get type() { return exports.ToolEnum.Pen; }
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
            curr.dotsType = exports.DotsType.Append;
            curr.coords.splice(0, prev.coords.length);
            board.emitEvent(exports.EventEnum.ShapesChanging, {
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
        this._curShape = board.factory.newShape(exports.ShapeEnum.Pen);
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
        (_a = this._board) === null || _a === void 0 ? void 0 : _a.emitEvent(exports.EventEnum.ShapesDone, {
            operator: this._board.whoami,
            shapeDatas: [shape.data.copy()]
        });
        this.end();
    }
}
Gaia.registerTool(exports.ToolEnum.Pen, () => new PenTool(), { name: 'Pen', desc: 'simple pen', shape: exports.ShapeEnum.Pen });

class PolygonData extends ShapeData {
    constructor() {
        super();
        this.dots = [];
        this.type = exports.ShapeEnum.Polygon;
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

class ShapePolygon extends ShapeNeedPath {
    path(ctx) {
        const { x, y, w, h } = this.drawingRect();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
    }
}
Gaia.registerShape(exports.ShapeEnum.Polygon, () => new PolygonData, d => new ShapePolygon(d));

const desc = {
    name: 'Polygon', desc: 'Polygon Drawer', shape: exports.ShapeEnum.Polygon
};
Gaia.registerTool(exports.ToolEnum.Polygon, () => new SimpleTool(exports.ToolEnum.Polygon, exports.ShapeEnum.Polygon), desc);

class RectData extends ShapeData {
    constructor() {
        super();
        this.type = exports.ShapeEnum.Rect;
        this.strokeStyle = '#ff0000';
        this.lineWidth = 2;
    }
}

class ShapeRect extends ShapeNeedPath {
    path(ctx) {
        const { x, y, w, h } = this.drawingRect();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
    }
}
Gaia.registerShape(exports.ShapeEnum.Rect, () => new RectData, d => new ShapeRect(d));

Gaia.registerTool(exports.ToolEnum.Rect, () => new SimpleTool(exports.ToolEnum.Rect, exports.ShapeEnum.Rect), { name: 'Rectangle', desc: 'rect drawer', shape: exports.ShapeEnum.Rect });

class TextData extends ShapeData {
    constructor() {
        super();
        this.text = '';
        this.f_d = ['normal', 'normal', 'normal', 24, 'Simsum'];
        this.t_l = 3;
        this.t_r = 3;
        this.t_t = 3;
        this.t_b = 3;
        this.type = exports.ShapeEnum.Text;
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
        if (isStr(o.text))
            this.text = o.text;
        if (Array.isArray(o.f_d))
            this.f_d = [...o.f_d];
        if (isNum(o.t_l))
            this.t_l = o.t_l;
        if (isNum(o.t_r))
            this.t_r = o.t_r;
        if (isNum(o.t_t))
            this.t_t = o.t_t;
        if (isNum(o.t_b))
            this.t_b = o.t_b;
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

const measurer = document.createElement('canvas').getContext('2d');
class ShapeText extends Shape {
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
        if (this.data.text === v)
            return;
        this.data.text = v;
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
Gaia.registerShape(exports.ShapeEnum.Text, () => new TextData, d => new ShapeText(d));

var Css;
(function (Css) {
    const style_element_id = 'g_whiteboard_styles';
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
})(Css || (Css = {}));

Css.add(`
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
                (_a = this._board) === null || _a === void 0 ? void 0 : _a.emitEvent(exports.EventEnum.ShapesDone, {
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
            board.emitEvent(exports.EventEnum.ShapesChanging, {
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
    get type() { return exports.ToolEnum.Text; }
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
            if (shape.data.type !== exports.ShapeEnum.Text)
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
            const newShapeText = board.factory.newShape(exports.ShapeEnum.Text);
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
Gaia.registerTool(exports.ToolEnum.Text, () => new TextTool, { name: 'Text', desc: 'enter some text', shape: exports.ShapeEnum.Text });

class TickData extends ShapeData {
    get needFill() {
        return false;
    }
    constructor() {
        super();
        this.type = exports.ShapeEnum.Tick;
        this.strokeStyle = '#FF0000';
        this.lineWidth = 2;
    }
}

class ShapeTick extends ShapeNeedPath {
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
Gaia.registerShape(exports.ShapeEnum.Tick, () => new TickData, d => new ShapeTick(d));

Gaia.registerTool(exports.ToolEnum.Tick, () => new SimpleTool(exports.ToolEnum.Tick, exports.ShapeEnum.Tick), { name: 'Tick', desc: 'tick drawer', shape: exports.ShapeEnum.Tick });

class CrossData extends ShapeData {
    get needFill() {
        return false;
    }
    constructor() {
        super();
        this.type = exports.ShapeEnum.Cross;
        this.strokeStyle = '#FF0000';
        this.lineWidth = 2;
    }
}

class ShapeCross extends ShapeNeedPath {
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
Gaia.registerShape(exports.ShapeEnum.Cross, () => new CrossData, d => new ShapeCross(d));

Gaia.registerTool(exports.ToolEnum.Cross, () => new SimpleTool(exports.ToolEnum.Cross, exports.ShapeEnum.Cross), { name: 'Cross', desc: 'cross drawer', shape: exports.ShapeEnum.Cross });

class HalfTickData extends ShapeData {
    get needFill() {
        return false;
    }
    constructor() {
        super();
        this.type = exports.ShapeEnum.HalfTick;
        this.strokeStyle = '#FF0000';
        this.lineWidth = 2;
    }
}

class ShapeHalfTick extends ShapeNeedPath {
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
Gaia.registerShape(exports.ShapeEnum.HalfTick, () => new HalfTickData, d => new ShapeHalfTick(d));

Gaia.registerTool(exports.ToolEnum.HalfTick, () => new SimpleTool(exports.ToolEnum.HalfTick, exports.ShapeEnum.HalfTick), { name: 'Half tick', desc: 'half tick drawer', shape: exports.ShapeEnum.HalfTick });

class LinesData extends ShapeData {
    get needFill() {
        return false;
    }
    constructor() {
        super();
        this.coords = [];
        this.type = exports.ShapeEnum.Lines;
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

class ShapeLines extends Shape {
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
Gaia.registerShape(exports.ShapeEnum.Lines, () => new LinesData, d => new ShapeLines(d));

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
    get type() { return exports.ToolEnum.Lines; }
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
            board.emitEvent(exports.EventEnum.ShapesChanging, {
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
            board.emitEvent(exports.EventEnum.ShapesChanging, {
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
            this._curShape = board.factory.newShape(exports.ShapeEnum.Lines);
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
            (_a = this._board) === null || _a === void 0 ? void 0 : _a.emitEvent(exports.EventEnum.ShapesDone, {
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
Gaia.registerTool(exports.ToolEnum.Lines, () => new LinesTool(), { name: 'Lines', desc: 'lines', shape: exports.ShapeEnum.Lines });

exports.ObjectFit = void 0;
(function (ObjectFit) {
    ObjectFit[ObjectFit["Fill"] = 0] = "Fill";
    ObjectFit[ObjectFit["Contain"] = 1] = "Contain";
    ObjectFit[ObjectFit["Cover"] = 2] = "Cover";
})(exports.ObjectFit || (exports.ObjectFit = {}));
class ImgData extends ShapeData {
    get src() {
        return this.s;
    }
    set src(v) {
        this.s = v;
    }
    get objectFit() {
        var _a;
        return (_a = this.f) !== null && _a !== void 0 ? _a : exports.ObjectFit.Fill;
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
        this.type = exports.ShapeEnum.Img;
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
        super(data);
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
        this._resizable = exports.Resizable.All;
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
                case exports.ObjectFit.Fill: {
                    this.beginDraw(ctx);
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
                    this.endDraw(ctx);
                    break;
                }
                case exports.ObjectFit.Contain: {
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
                case exports.ObjectFit.Cover: {
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
Gaia.registerShape(exports.ShapeEnum.Img, () => new ImgData, d => new ShapeImg(d));

Gaia.registerTool(exports.ToolEnum.Img, () => new SimpleTool(exports.ToolEnum.Img, exports.ShapeEnum.Img), { name: 'Image', desc: 'Image drawer', shape: exports.ShapeEnum.Img });

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

class ShapeRotator extends Shape {
    get target() { return this._target; }
    get _distance() { var _a; return ((_a = this.board) === null || _a === void 0 ? void 0 : _a.factory.rotator.distance) || 30; }
    get _width() { var _a; return ((_a = this.board) === null || _a === void 0 ? void 0 : _a.factory.rotator.size) || 10; }
    constructor() {
        super(new ShapeData);
        this._ctrlDot = new Rect(0, 0, 0, 0);
        this._oY = 0;
        this._oX = 0;
        this._update = (shape) => {
            var _a;
            this.beginDirty();
            const { x: mx, y: my } = shape.rotatedMid;
            const w = this._width;
            const d = this._distance;
            this.data.visible = shape.selected && !shape.locked && !!shape.board;
            console.log(this.data.visible);
            this.data.w = w;
            this.data.h = shape.h + d * 2;
            this.data.x = mx - this.halfW;
            this.data.y = my - this.halfH;
            this.data.rotation = shape.rotation;
            const s = ((_a = this.board) === null || _a === void 0 ? void 0 : _a.factory.rotator.size) || 10;
            this._ctrlDot.w = s;
            this._ctrlDot.h = s;
            this.endDirty();
        };
        this._listener = (e) => this._update(e.detail.shape);
        this._listener2 = (e) => this._update(e.detail.shape);
        this.data.ghost = true;
        this.data.visible = false;
    }
    follow(shape) {
        this.unfollow();
        shape.addEventListener(ShapeEventEnum.EndDirty, this._listener);
        shape.addEventListener(ShapeEventEnum.BoardChanged, this._listener2);
        this._update(shape);
        this._target = shape;
    }
    unfollow() {
        var _a, _b;
        (_a = this._target) === null || _a === void 0 ? void 0 : _a.removeEventListener(ShapeEventEnum.EndDirty, this._listener);
        (_b = this._target) === null || _b === void 0 ? void 0 : _b.removeEventListener(ShapeEventEnum.BoardChanged, this._listener2);
        delete this._target;
    }
    render(ctx) {
        if (!this.visible)
            return;
        this.beginDraw(ctx);
        const { x, y, w, h } = this._ctrlDot;
        const mx = Math.floor(x + w / 2) - 0.5;
        const t = Math.floor(y) + 0.5;
        const l = Math.floor(x) - 0.5;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.lineWidth = 1;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(l, t, w, h);
        ctx.beginPath();
        ctx.moveTo(mx, y + h);
        ctx.lineTo(mx, this._distance);
        ctx.stroke();
        this.endDraw(ctx);
        // super.render(ctx);
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
        if (exports.Numbers.equals(dx + dy, 0))
            return;
        (_a = this._target) === null || _a === void 0 ? void 0 : _a.rotateTo(Math.atan2(dy, dx) - Math.PI / 2);
    }
    hit(dot) {
        return this._ctrlDot.hit(this.map2me(dot.x, dot.y));
    }
}

exports.SelectorStatus = void 0;
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
})(exports.SelectorStatus || (exports.SelectorStatus = {}));
class SelectorTool {
    get type() { return exports.ToolEnum.Selector; }
    get board() { return this._selector.board; }
    set board(v) {
        this._selector.board = v;
        this._rotator.board = v;
    }
    get rect() { return this._rectHelper; }
    set cursor(v) {
        this.board.element.style.cursor = v;
    }
    constructor() {
        this._doubleClickTimer = 0;
        this._selector = new ShapeRect(new ShapeData);
        this._rectHelper = new RectHelper();
        this._status = exports.SelectorStatus.Idle;
        this._prevPos = { x: 0, y: 0 };
        this._resizer = {
            direction: exports.ResizeDirection.None,
            anchor: { x: 0, y: 0 },
            offset: { x: 0, y: 0 },
            shape: null
        };
        this._rotator = new ShapeRotator();
        this._windowPointerDown = () => this.deselect();
        this._shapes = [];
        this.emitGeoEvent = throttle(1000 / 30, (isLast) => {
            const { board, _shapes } = this;
            if (!board || !_shapes.length)
                return;
            if (isLast) {
                board.emitEvent(exports.EventEnum.ShapesGeoChanged, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: this._shapes.map(v => [
                        exports.Events.pickShapeGeoData(v.shape.data), v.startData
                    ])
                });
            }
            else {
                board.emitEvent(exports.EventEnum.ShapesGeoChanging, {
                    operator: board.whoami,
                    tool: this.type,
                    shapeDatas: this._shapes.map(v => [
                        exports.Events.pickShapeGeoData(v.shape.data), v.prevData
                    ])
                });
            }
        });
        this._selector.data.lineWidth = 2;
        this._selector.data.strokeStyle = '#003388FF';
        this._selector.data.fillStyle = '#00338855';
    }
    render(ctx) {
        this._selector.render(ctx);
        this._rotator.render(ctx);
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
                x = x === void 0 ? v.data.x : Math.min(x, v.data.x);
                y = y === void 0 ? v.data.y : Math.min(y, v.data.y);
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
            v.prevData = exports.Events.pickShapePosData(v.shape.data);
            !v.shape.locked && v.shape.moveBy(diffX, diffY);
        });
        return this;
    }
    pointerDown(dot) {
        const { board, _status } = this;
        if (!board || _status !== exports.SelectorStatus.Idle) {
            return;
        }
        const { x, y } = dot;
        if (this._rotator.pointerDown(dot)) {
            this._status = exports.SelectorStatus.ReadyForRotating;
            this.connect([this._rotator.target], x, y);
            return;
        }
        this._rectHelper.start(x, y);
        this.updateGeo();
        const shapes = board.hits({ x, y, w: 0, h: 0 }); // 点击位置的全部图形
        const shape = exports.Arrays.firstOf(shapes, it => (it.selected && !it.locked) ? it : null) || shapes[0];
        if (!shape || shape.locked) {
            // 点击的位置无任何未锁定图形，则框选图形, 并取消选择以选择的图形
            this._status = exports.SelectorStatus.ReadyForSelecting;
            this._selector.visible = true;
            this.deselect();
        }
        else if (!shape.selected) {
            // 点击位置存在图形，且图形未被选择，则选择点中的图形。
            this._status = exports.SelectorStatus.ReadyForDragging;
            this._rotator.follow(shape);
            board.setSelects([shape], true);
        }
        else {
            // 点击位置存在图形，且图形已被选择，则判断是否点击尺寸调整。
            const dot = shape.map2me(x, y).plus(shape.data);
            const [direction, resizerRect] = shape.resizeDirection(dot.x, dot.y);
            if (direction) {
                this._resizer.direction = direction;
                this._resizer.shape = shape;
                switch (direction) {
                    case exports.ResizeDirection.Top:
                        this._resizer.offset.x = 0;
                        this._resizer.offset.y = resizerRect.top - dot.y;
                        this._resizer.anchor = shape.rotatedMidBottom;
                        break;
                    case exports.ResizeDirection.Bottom:
                        this._resizer.offset.x = 0;
                        this._resizer.offset.y = resizerRect.bottom - dot.y;
                        this._resizer.anchor = shape.rotatedMidTop;
                        break;
                    case exports.ResizeDirection.Left:
                        this._resizer.offset.x = resizerRect.left - dot.x;
                        this._resizer.offset.y = 0;
                        this._resizer.anchor = shape.rotatedMidRight;
                        break;
                    case exports.ResizeDirection.Right:
                        this._resizer.offset.x = resizerRect.right - dot.x;
                        this._resizer.offset.y = 0;
                        this._resizer.anchor = shape.rotatedMidLeft;
                        break;
                    case exports.ResizeDirection.TopLeft:
                        this._resizer.offset.x = resizerRect.left - dot.x;
                        this._resizer.offset.y = resizerRect.top - dot.y;
                        this._resizer.anchor = shape.rotatedBottomRight;
                        break;
                    case exports.ResizeDirection.TopRight:
                        this._resizer.offset.x = resizerRect.right - dot.x;
                        this._resizer.offset.y = resizerRect.top - dot.y;
                        this._resizer.anchor = shape.rotatedBottomLeft;
                        break;
                    case exports.ResizeDirection.BottomLeft:
                        this._resizer.offset.x = resizerRect.left - dot.x;
                        this._resizer.offset.y = resizerRect.bottom - dot.y;
                        this._resizer.anchor = shape.rotatedTopRight;
                        break;
                    case exports.ResizeDirection.BottomRight:
                        this._resizer.offset.x = resizerRect.right - dot.x;
                        this._resizer.offset.y = resizerRect.bottom - dot.y;
                        this._resizer.anchor = shape.rotatedTopLeft;
                        break;
                }
                this._status = exports.SelectorStatus.ReadyForResizing;
                board.setSelects([shape], true);
            }
            else {
                this._status = exports.SelectorStatus.ReadyForDragging;
            }
        }
        this.connect(board.selects, x, y);
    }
    pointerMove(dot) {
        if (this._rotator.hit(dot)) {
            this.cursor = 'crosshair';
            return;
        }
        const result = exports.Arrays.firstOf(this.board.selects, it => {
            const { x, y } = it.map2me(dot.x, dot.y).plus(it.data);
            const [direction] = it.resizeDirection(x, y);
            if (direction != exports.ResizeDirection.None)
                return [direction, it];
        });
        if (result) {
            const [direction, shape] = result;
            let { rotation: deg } = shape;
            deg = exports.Degrees.normalized(deg + (direction - 1) * Math.PI / 4);
            switch (Math.floor((25 + exports.Degrees.angle(deg)) / 45) % 8) {
                case 0:
                case 4:
                    this.cursor = 'ns-resize';
                    break;
                case 2:
                case 6:
                    this.cursor = 'ew-resize';
                    break;
                case 3:
                case 7:
                    this.cursor = 'nw-resize';
                    break;
                case 1:
                case 5:
                    this.cursor = 'ne-resize';
                    break;
                default:
                    this.cursor = '';
                    break;
            }
            return;
        }
        this.cursor = '';
    }
    pointerDraw(dot) {
        var _a;
        const board = this.board;
        if (!board)
            return;
        switch (this._status) {
            case exports.SelectorStatus.ReadyForRotating: // let it fall-through
                this._status = exports.SelectorStatus.Rotating;
            case exports.SelectorStatus.Rotating:
                this._rotator.pointerDraw(dot);
                this.emitGeoEvent(false);
                break;
            case exports.SelectorStatus.ReadyForSelecting: // let it fall-through
                if (Vector.manhattan(this._prevPos, dot) < 5) {
                    return;
                }
                this._status = exports.SelectorStatus.Selecting;
            case exports.SelectorStatus.Selecting: {
                this._rectHelper.end(dot.x, dot.y);
                this.updateGeo();
                board.selectAt(this._selector.data, true);
                return;
            }
            case exports.SelectorStatus.ReadyForDragging: // let it fall-through
                if (Vector.manhattan(this._prevPos, dot) < 5) {
                    return;
                }
                this._status = exports.SelectorStatus.Dragging;
            case exports.SelectorStatus.Dragging: {
                this.move(dot.x, dot.y).emitGeoEvent(false);
                return;
            }
            case exports.SelectorStatus.ReadyForResizing: // let it fall-through
                if (Vector.manhattan(this._prevPos, dot) < 5) {
                    return;
                }
                this._status = exports.SelectorStatus.Resizing;
            case exports.SelectorStatus.Resizing: {
                const { shape, offset, anchor, direction } = this._resizer;
                if (!shape)
                    return;
                const geo = shape.getGeo();
                const rs = board.factory.resizer.size;
                const { y: roy, x: rox } = offset;
                const { x, y } = shape.map2me(dot.x, dot.y).plus(shape);
                const { left: l, right: r, bottom: b, top: t } = geo;
                switch (direction) {
                    case exports.ResizeDirection.Top:
                        geo.top = Math.min(roy + y, b - rs * 3);
                        break;
                    case exports.ResizeDirection.Bottom:
                        geo.bottom = Math.max(roy + y, t + rs * 3);
                        break;
                    case exports.ResizeDirection.Left:
                        geo.left = Math.min(rox + x, r - rs * 3);
                        break;
                    case exports.ResizeDirection.Right:
                        geo.right = Math.max(rox + x, l + rs * 3);
                        break;
                    case exports.ResizeDirection.TopLeft:
                        geo.top = Math.min(roy + y, b - rs * 3);
                        geo.left = Math.min(rox + x, r - rs * 3);
                        break;
                    case exports.ResizeDirection.TopRight:
                        geo.top = Math.min(roy + y, b - rs * 3);
                        geo.right = Math.max(rox + x, l + rs * 3);
                        break;
                    case exports.ResizeDirection.BottomLeft:
                        geo.bottom = Math.max(roy + y, t + rs * 3);
                        geo.left = Math.min(rox + x, r - rs * 3);
                        break;
                    case exports.ResizeDirection.BottomRight:
                        geo.bottom = Math.max(roy + y, t + rs * 3);
                        geo.right = Math.max(rox + x, l + rs * 3);
                        break;
                }
                const degree = (_a = shape.data.r) !== null && _a !== void 0 ? _a : 0;
                const rd = direction - 1;
                const beveling = (rd == 0 || rd == 4) ? geo.h : (rd == 2 || rd == 6) ? geo.w : Math.sqrt(geo.w * geo.w + geo.h * geo.h);
                let deg = degree + Math.PI * rd / 4;
                if (rd == 1 || rd == 5)
                    deg += Math.atan2(geo.w, geo.h) - Math.PI / 4;
                else if (rd == 3 || rd == 7)
                    deg += Math.atan2(geo.h, geo.w) - Math.PI / 4;
                const sinV = Math.sin(deg);
                const cosV = Math.cos(deg);
                const midX = anchor.x + sinV * beveling / 2;
                const midY = anchor.y - cosV * beveling / 2;
                shape.geo(midX - geo.w / 2, midY - geo.h / 2, geo.w, geo.h);
                this.emitGeoEvent(false);
                return;
            }
        }
    }
    pointerUp() {
        switch (this._status) {
            case exports.SelectorStatus.ReadyForDragging: {
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
            case exports.SelectorStatus.Rotating:
            case exports.SelectorStatus.Resizing:
            case exports.SelectorStatus.Dragging: {
                this.emitGeoEvent.enforce(true);
                break;
            }
        }
        this._selector.visible = false;
        this._rectHelper.clear();
        this._status = exports.SelectorStatus.Idle;
    }
    doubleClick() {
        const { board } = this;
        if (!board) {
            return;
        }
        // 双击某个文本时，切换到文本编辑工具，编辑此文本，当文本编辑框失去焦点时，回到选择器工具；
        if (this._shapes.length && this._shapes[0].shape instanceof ShapeText) {
            board.setToolType(exports.ToolEnum.Text);
            const textTool = board.tool;
            textTool.selectorCallback = () => board.setToolType(exports.ToolEnum.Selector);
            textTool.editor.addEventListener('blur', textTool.selectorCallback, { once: true });
            textTool.connect(this._shapes[0].shape);
        }
    }
    updateGeo() {
        const { x, y, w, h } = this._rectHelper.gen();
        this._selector.geo(x, y, w, h);
    }
}
Gaia.registerTool(exports.ToolEnum.Selector, () => new SelectorTool, {
    name: 'Selector',
    desc: 'pick shapes'
});

Css.add(`
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

class Board {
    get whoami() {
        return this._whoami;
    }
    get width() {
        return this._viewport.w;
    }
    set width(v) {
        this._viewport.w = v;
        this._layers.forEach(l => l.width = v);
    }
    get height() {
        return this._viewport.h;
    }
    set height(v) {
        this._viewport.h = v;
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
        if (layer instanceof Layer) {
            layer.width = this.width;
            layer.height = this.height;
            layer.onscreen.style.pointerEvents = 'none';
            this._element.appendChild(layer.onscreen);
            this._layers.set(layer.info.id, layer);
            this.dispatchEvent(new CustomEvent(exports.EventEnum.LayerAdded, { detail: layer }));
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
        this.dispatchEvent(new CustomEvent(exports.EventEnum.LayerRemoved, { detail: layer }));
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
        this._toolType = exports.ToolEnum.Pen;
        this._layers = new Map();
        this._mousedown = false;
        this._tools = {};
        this._selects = [];
        this._whoami = 'local';
        this._editingLayerId = '';
        this._viewport = new Rect(0, 0, 600, 600);
        this._world = new Rect(0, 0, 600, 600);
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
        if (options.width) {
            this._viewport.w = options.width;
            this._world.w = options.width;
        }
        if (options.height) {
            this._viewport.h = options.height;
            this._world.h = options.height;
        }
        if (options.toolType)
            this._toolType = options.toolType;
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
            if (this._tool instanceof TextTool && this._tool.selectorCallback) {
                this._tool.editor.removeEventListener('blur', this._tool.selectorCallback);
            }
            return;
        }
        const from = this._toolType;
        this._toolType = to;
        this.emitEvent(exports.EventEnum.ToolChanged, {
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
        emit && this.emitEvent(exports.EventEnum.ShapesAdded, {
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
            shapeDatas.length && this.emitEvent(exports.EventEnum.ShapesRemoved, {
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
            selecteds.length && this.emitEvent(exports.EventEnum.ShapesSelected, {
                operator,
                shapeDatas: selecteds.map(v => v.data)
            });
            desecteds.length && this.emitEvent(exports.EventEnum.ShapesDeselected, {
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
            x: Math.floor(sw * (ev.clientX - left - this._world.x)),
            y: Math.floor(sh * (ev.clientY - top - this._world.y)),
            p: pressure
        };
    }
    get tools() { return this._tools; }
    get tool() { return this._tool; }
    markDirty(rect) {
        const requested = !this._dirty;
        this._dirty = this._dirty ? Rect.bounds(this._dirty, rect) : rect;
        requested && requestAnimationFrame(() => this.render());
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
            if (!Rect.hit(br, dirty))
                return;
            const layer = this._layers.get(v.data.layer);
            if (!layer)
                return;
            v.render(layer.octx);
        });
        (_a = this.tool) === null || _a === void 0 ? void 0 : _a.render(this.layer().octx);
        this._layers.forEach(layer => {
            const { ctx, offscreen } = layer;
            ctx.save();
            ctx.translate(this._viewport.x + this._world.x, this._viewport.y + this._world.y);
            ctx.drawImage(offscreen, dirty.x, dirty.y, dirty.w, dirty.h, dirty.x, dirty.y, dirty.w, dirty.h);
            ctx.restore();
        });
        delete this._dirty;
    }
}

class DefaultShapeDecoration {
    dashSroke(ctx, segments) {
        ctx.strokeStyle = 'white';
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.strokeStyle = 'black';
        ctx.setLineDash(segments);
        ctx.stroke();
    }
    // debug(shape: Shape, ctx: CanvasRenderingContext2D){
    //   const { x, y, w, h } = shape.boundingRect()
    //   ctx.fillStyle = "#00FF0033"
    //   ctx.fillRect(x + 1, y + 1, w - 2, h - 2)
    // }
    locked(shape, ctx) {
        const lineWidth = 2;
        ctx.lineWidth = lineWidth;
        let { x, y, w, h } = shape.selectorRect();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        this.dashSroke(ctx, [lineWidth * 8]);
    }
    selected(shape, ctx) {
        const lineWidth = 1;
        ctx.lineWidth = lineWidth;
        let { x, y, w, h } = shape.selectorRect();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        this.dashSroke(ctx, [lineWidth * 4]);
    }
    resizable(shape, ctx) {
        let { x, y, w, h } = shape.selectorRect();
        ctx.fillStyle = 'white';
        ctx.setLineDash([]);
        const { s, lx, rx, ty, by, mx, my, } = shape.getResizerNumbers(x, y, w, h);
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
}

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
        const playerTime = time - this.startTime;
        while (true) {
            const event = screenplay.events[this.eventIdx];
            if (!event) {
                return this.stop();
            }
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
            case exports.EventEnum.ShapesAdded: {
                const { shapeDatas } = e.detail;
                this._addShape(shapeDatas);
                break;
            }
            case exports.EventEnum.ShapesGeoChanging:
            case exports.EventEnum.ShapesChanging: {
                const { shapeDatas } = e.detail;
                this._changeShapes(shapeDatas, 0);
                break;
            }
            case exports.EventEnum.ShapesRemoved: {
                const { shapeDatas } = e.detail;
                this._removeShape(shapeDatas);
                break;
            }
        }
    }
    _undoEvent(e) {
        switch (e.type) {
            case exports.EventEnum.ShapesAdded: {
                const { shapeDatas } = e.detail;
                this._removeShape(shapeDatas);
                break;
            }
            case exports.EventEnum.ShapesGeoChanging:
            case exports.EventEnum.ShapesChanging: {
                const { shapeDatas } = e.detail;
                this._changeShapes(shapeDatas, 1);
                break;
            }
            case exports.EventEnum.ShapesRemoved: {
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

/******************************************************************
 * Copyright @ 2023 朱剑豪. All rights reserverd.
 * @file   src\features\Recorder.ts
 * @author 朱剑豪
 * @date   2023/07/02 23:31
 * @desc   事件记录器
 ******************************************************************/
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
        for (const key in exports.EventEnum) {
            const v = exports.EventEnum[key];
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
/* global Reflect, Promise, SuppressedError, Symbol */


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

const Tag$1 = '[DefaultShapesMgr]';
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
                return console.warn(Tag$1, `can not add "${item.data.id}", already exists!`);
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
            if (!v.ghost && RotatedRect.hit(v.data, rect))
                ret.push(v);
        }
        return ret;
    }
    hit(rect) {
        const count = this._items.length;
        for (let idx = count - 1; idx >= 0; --idx) {
            const v = this._items[idx];
            if (!v.ghost && RotatedRect.hit(v.data, rect))
                return v;
        }
        return null;
    }
}

exports.FactoryEnum = void 0;
(function (FactoryEnum) {
    FactoryEnum[FactoryEnum["Invalid"] = 0] = "Invalid";
    FactoryEnum[FactoryEnum["Default"] = 1] = "Default";
})(exports.FactoryEnum || (exports.FactoryEnum = {}));
function getFactoryName(type) {
    switch (type) {
        case exports.FactoryEnum.Invalid: return 'FactoryEnum.Invalid';
        case exports.FactoryEnum.Default: return 'FactoryEnum.Default';
        default: return type;
    }
}

exports.FontFamilysChecker = void 0;
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
})(exports.FontFamilysChecker || (exports.FontFamilysChecker = {}));

const builtInFontFamilies = [
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
const builtInFontNames = {
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

const Tag = '[DefaultFactory]';
class DefaultFactory {
    constructor() {
        this._z = 0;
        this._time = 0;
        this._shapeTemplates = {};
        this.resizer = { size: 10 };
        this.rotator = { size: 10, distance: 30 };
        this._shapeDecoration = new DefaultShapeDecoration;
    }
    get type() {
        return exports.FactoryEnum.Default;
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
    newId(data) {
        return data.t + '_' + Date.now() + (++this._time);
    }
    newZ(data) {
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
            data.id = this.newId(data);
            data.z = this.newZ(data);
        }
        return (_b = (_a = Gaia.shape(type)) === null || _a === void 0 ? void 0 : _a(data)) !== null && _b !== void 0 ? _b : new Shape(data);
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
        return new Layer(_inits);
    }
    fontFamilies() {
        return exports.FontFamilysChecker.check(builtInFontFamilies);
    }
    fontName(fontFamily) {
        var _a;
        return (_a = builtInFontNames[fontFamily]) !== null && _a !== void 0 ? _a : fontFamily;
    }
    shapeDecoration(_) {
        return this._shapeDecoration;
    }
    overbound(_) { return 1; }
}
Gaia.registerFactory(exports.FactoryEnum.Default, () => new DefaultFactory(), { name: 'bulit-in Factory', desc: 'bulit-in Factory' });

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
Gaia.registAction(exports.EventEnum.ShapesDone, {
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
Gaia.registAction(exports.EventEnum.ShapesRemoved, {
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
Gaia.registAction(exports.EventEnum.ShapesGeoChanged, {
    isAction: (board, event) => {
        const ret = event.detail.tool === exports.ToolEnum.Selector;
        console.log("isAction:", ret);
        return ret;
    },
    undo: (board, event) => {
        const { detail: { shapeDatas } } = event;
        _changeShapes(board, shapeDatas, 1);
        board.emitEvent(exports.EventEnum.ShapesGeoChanged, {
            operator: 'action_queue',
            tool: exports.ToolEnum.Invalid,
            shapeDatas: shapeDatas.map(arr => [arr[1], arr[0]])
        });
    },
    redo: (board, event) => {
        const { detail: { shapeDatas } } = event;
        _changeShapes(board, shapeDatas, 0);
        board.emitEvent(exports.EventEnum.ShapesGeoChanged, {
            operator: 'action_queue',
            tool: exports.ToolEnum.Invalid,
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
                raw.i = factory.newId(raw);
                raw.z = factory.newZ(raw);
                raw.status && (raw.status.f = void 0);
                raw.x = raw.x + 10;
                raw.y = raw.y + 10;
                const shape = factory.newShape(raw);
                shape.selected = true;
                return shape;
            });
            board.deselect(false);
            board.add(shapes);
            board.emitEvent(exports.EventEnum.ShapesDone, {
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

exports.ActionQueue = ActionQueue;
exports.BinaryRange = BinaryRange;
exports.BinaryTree = BinaryTree;
exports.Board = Board;
exports.CrossData = CrossData;
exports.CrossTool = SimpleTool;
exports.DefaultFactory = DefaultFactory;
exports.DefaultShapeDecoration = DefaultShapeDecoration;
exports.DefaultShapesMgr = DefaultShapesMgr;
exports.FClipboard = FClipboard;
exports.Gaia = Gaia;
exports.HalfTickData = HalfTickData;
exports.HalfTickTool = SimpleTool;
exports.ImgData = ImgData;
exports.InvalidTool = InvalidTool;
exports.Layer = Layer;
exports.LayerInfo = LayerInfo;
exports.LinesData = LinesData;
exports.LinesTool = LinesTool;
exports.OvalData = OvalData;
exports.OvalTool = OvalTool;
exports.PenData = PenData;
exports.PenTool = PenTool;
exports.Player = Player;
exports.PolygonData = PolygonData;
exports.PolygonTool = SimpleTool;
exports.QuadTree = QuadTree;
exports.Recorder = Recorder;
exports.Rect = Rect;
exports.RectData = RectData;
exports.RectTool = SimpleTool;
exports.RotatedRect = RotatedRect;
exports.SelectorTool = SelectorTool;
exports.Shape = Shape;
exports.ShapeCross = ShapeCross;
exports.ShapeData = ShapeData;
exports.ShapeHalfTick = ShapeHalfTick;
exports.ShapeImg = ShapeImg;
exports.ShapeLines = ShapeLines;
exports.ShapeNeedPath = ShapeNeedPath;
exports.ShapeOval = ShapeOval;
exports.ShapePen = ShapePen;
exports.ShapePolygon = ShapePolygon;
exports.ShapeRect = ShapeRect;
exports.ShapeText = ShapeText;
exports.ShapeTick = ShapeTick;
exports.SimpleTool = SimpleTool;
exports.TextData = TextData;
exports.TextSelection = TextSelection;
exports.TextTool = TextTool;
exports.TickData = TickData;
exports.TickTool = SimpleTool;
exports.Vector = Vector;
exports.builtInFontFamilies = builtInFontFamilies;
exports.builtInFontNames = builtInFontNames;
exports.getFactoryName = getFactoryName;
exports.getShapeName = getShapeName;
exports.getToolName = getToolName;
exports.getValue = getValue;


},{}]},{},[16]);
