(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditPanel = exports.SectionTitle = void 0;
const StyleType_1 = require("./G/BaseView/StyleType");
const View_1 = require("./G/BaseView/View");
const IconButton_1 = require("./G/CompoundView/IconButton");
const State_1 = require("./G/State");
class SectionTitle extends View_1.View {
    constructor(text) {
        super('div');
        this.styles.apply('', {
            padding: 5,
            fontSize: 16,
        });
        this.inner.innerText = text;
    }
}
exports.SectionTitle = SectionTitle;
class EditPanel extends View_1.View {
    get state() { return this._state; }
    constructor() {
        super('div');
        this.onStateChange = (e) => {
            const { needImg, needText, needFill, needStroke } = e.detail.curr;
            this[needStroke ? 'addChild' : 'removeChild'](this._editStrokeView);
            this[needFill ? 'addChild' : 'removeChild'](this._editFillView);
            this[needImg ? 'addChild' : 'removeChild'](this._editImgView);
            this[needText ? 'addChild' : 'removeChild'](this._editTextView);
            if (needImg || needText || needFill || needStroke) {
                this.styles.apply('', v => (Object.assign(Object.assign({}, v), { width: 300, opacity: 1 })));
            }
            else {
                this.styles.apply('', v => (Object.assign(Object.assign({}, v), { width: 0, opacity: 0 })));
            }
        };
        this.styles.apply('', {
            position: 'absolute',
            alignSelf: StyleType_1.CssAlignSelf.Stretch,
            right: 0,
            top: 0,
            bottom: 0,
            width: 0,
            background: 'white',
            opacity: 0,
            boxShadow: '0px 0px 10px 1px #00000011',
            zIndex: 1,
            transition: 'width 300ms, opacity 255ms',
            overflow: 'hidden',
        });
        this._state = new State_1.State({
            needFill: false,
            needStroke: false,
            needText: false,
            needImg: false,
        });
        this._state.setOwner(this.inner);
        this._state.addEventListener(State_1.StateEventType.Change, this.onStateChange);
        this._editImgView = new View_1.View('div');
        this._editImgView.addChild(new SectionTitle('Image'));
        this._editImgView.styles.apply('', { borderBottom: '1px solid #eaeaea' });
        this._editTextView = new View_1.View('div');
        this._editTextView.addChild(new SectionTitle('Text'));
        this._editTextView.styles.apply('', { borderBottom: '1px solid #eaeaea' });
        this._editStrokeView = new View_1.View('div');
        this._editStrokeView.addChild(new SectionTitle('Stroke'));
        this._editStrokeView.styles.apply('', { borderBottom: '1px solid #eaeaea' });
        this._editFillView = new View_1.View('div');
        this._editFillView.addChild(new SectionTitle('Fill'));
        this._editFillView.styles.apply('', { borderBottom: '1px solid #eaeaea' });
        const btnClose = new IconButton_1.IconButton().init({ src: './ic_btn_close.svg' });
        btnClose.styles.apply('', {
            position: 'absolute',
            right: 0,
            top: 0
        });
        btnClose.icon.styles.apply('', { fill: 'currentColor', color: 'black' });
        btnClose.addEventListener('click', () => {
            this.styles.apply('', v => (Object.assign(Object.assign({}, v), { width: 0 })));
        });
        this.addChild(btnClose);
    }
}
exports.EditPanel = EditPanel;

},{"./G/BaseView/StyleType":5,"./G/BaseView/View":7,"./G/CompoundView/IconButton":8,"./G/State":15}],2:[function(require,module,exports){
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

},{"./SizeType":4,"./Styles":6,"./View":7}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const View_1 = require("./View");
class Image extends View_1.View {
    get src() { return this.inner.src; }
    set src(v) { this.inner.src = v; }
    constructor(inits) {
        super('img');
        (inits === null || inits === void 0 ? void 0 : inits.src) && (this.src = inits.src);
        (inits === null || inits === void 0 ? void 0 : inits.style) && (this.styles.apply('_', inits.style));
    }
    addEventListener(arg0, arg1, arg2) {
        return super.addEventListener(arg0, arg1, arg2);
    }
    removeEventListener(arg0, arg1, arg2) {
        return super.removeEventListener(arg0, arg1, arg2);
    }
}
exports.Image = Image;

},{"./View":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeType = void 0;
var SizeType;
(function (SizeType) {
    SizeType["Small"] = "s";
    SizeType["Middle"] = "m";
    SizeType["Large"] = "l";
})(SizeType = exports.SizeType || (exports.SizeType = {}));

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Styles = void 0;
const StyleType_1 = require("./StyleType");
const utils_1 = require("../utils");
class Styles {
    static css(href) {
        let link = this.csses.get(href);
        if (link) {
            return link;
        }
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
        this.csses.set(href, link);
        return link;
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

},{"../utils":16,"./StyleType":5}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
const EventType_1 = require("../Events/EventType");
const FocusOb_1 = require("../Observer/FocusOb");
const HoverOb_1 = require("../Observer/HoverOb");
const Styles_1 = require("./Styles");
class View {
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
    constructor(arg0) {
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
}
exports.View = View;
View.RAW_KEY_IN_ELEMENT = 'g_view';

},{"../Events/EventType":12,"../Observer/FocusOb":13,"../Observer/HoverOb":14,"./Styles":6}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconButton = void 0;
const Button_1 = require("../BaseView/Button");
const Image_1 = require("../BaseView/Image");
const StyleType_1 = require("../BaseView/StyleType");
class IconButton extends Button_1.Button {
    get icon() { return this._icon; }
    get srcs() {
        var _a;
        this.private = (_a = this.private) !== null && _a !== void 0 ? _a : new Map();
        return this.private;
    }
    set srcs(v) {
        this.private = v;
        this.updateContent();
    }
    constructor() {
        super();
        this._icon = new Image_1.Image({
            style: {
                width: '100%',
                height: '100%',
                objectFit: StyleType_1.CssObjectFit.Contain,
            }
        });
    }
    init(inits) {
        this._icon.draggable = false;
        const superInits = Object.assign(Object.assign({}, inits), { content: this._icon });
        if (inits === null || inits === void 0 ? void 0 : inits.srcs) {
            this.srcs.set(Button_1.ButtonState.Normal, inits.srcs[0]);
            this.srcs.set(Button_1.ButtonState.Checked, inits.srcs[1]);
        }
        else if (inits === null || inits === void 0 ? void 0 : inits.src) {
            this.srcs.set(Button_1.ButtonState.Normal, inits.src);
            this.srcs.set(Button_1.ButtonState.Checked, inits.src);
        }
        return super.init(superInits);
    }
    updateContent() {
        const src = this.srcs.get(this.checked ? Button_1.ButtonState.Checked : Button_1.ButtonState.Normal);
        const content = this.content;
        if (content instanceof Image_1.Image) {
            content.src = src;
        }
        super.updateContent();
    }
}
exports.IconButton = IconButton;

},{"../BaseView/Button":2,"../BaseView/Image":3,"../BaseView/StyleType":5}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuEventType = void 0;
var MenuEventType;
(function (MenuEventType) {
    MenuEventType["ItemClick"] = "onItemClick";
})(MenuEventType = exports.MenuEventType || (exports.MenuEventType = {}));

},{}],10:[function(require,module,exports){
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

},{".":11,"../../BaseView/View":7}],11:[function(require,module,exports){
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

},{"../../BaseView/Styles":6,"../../BaseView/View":7,"../../Observer/HoverOb":14,"../../utils":16,"./Events":9,"./ItemView":10}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.StateEventType = void 0;
var StateEventType;
(function (StateEventType) {
    StateEventType["Change"] = "G_STATE_CHANGE";
})(StateEventType = exports.StateEventType || (exports.StateEventType = {}));
class State {
    get value() { return this._value; }
    constructor(inits) {
        this._elements = new Set();
        this._value = new Proxy(inits, {
            set: (target, p, newValue) => {
                if (target[p] === newValue) {
                    return true;
                }
                if (!this._timer) {
                    const prev = Object.assign({}, target);
                    this._timer = setTimeout(() => {
                        var _a;
                        if (!this._elements.size && !this._owner) {
                            return;
                        }
                        const curr = Object.assign(Object.assign({}, target), { [p]: newValue });
                        const e = new CustomEvent(StateEventType.Change, { detail: { prev, curr } });
                        (_a = this._owner) === null || _a === void 0 ? void 0 : _a.dispatchEvent(e);
                        this._elements.forEach(ele => ele.dispatchEvent(e));
                        delete this._timer;
                    }, 1);
                }
                target[p] = newValue;
                return true;
            },
        });
    }
    connect(ele) {
        if (this._elements.has(ele)) {
            return this;
        }
        return this;
    }
    disconnect(ele) {
        if (!this._elements.has(ele)) {
            return this;
        }
        return this;
    }
    setOwner(ele) {
        this._owner = ele;
        return this;
    }
    addEventListener(type, listener, options) {
        var _a;
        return (_a = this._owner) === null || _a === void 0 ? void 0 : _a.addEventListener(type.toString(), listener, options);
    }
    removeEventListener(type, listener, options) {
        var _a;
        return (_a = this._owner) === null || _a === void 0 ? void 0 : _a.removeEventListener(type.toString(), listener, options);
    }
}
exports.State = State;

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("../../dist");
const event_1 = require("../../dist/event");
const EditPanel_1 = require("./EditPanel");
const View_1 = require("./G/BaseView/View");
const Menu_1 = require("./G/CompoundView/Menu");
const resultWidth = 600;
const resultHeight = 800;
const factory = dist_1.Gaia.factory(dist_1.FactoryEnum.Default)();
const mainView = View_1.View.get(document.body).styles.apply('', {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundImage: 'url(./kiwihug-zGZYQQVmXw0-unsplash.jpg)',
    backgroundSize: '100% 100%'
}).view;
const editPanel = new EditPanel_1.EditPanel();
var MenuKey;
(function (MenuKey) {
    MenuKey["SelectAll"] = "SelectAll";
    MenuKey["RemoveSelected"] = "RemoveSelected";
    MenuKey["Deselect"] = "Deselect";
    MenuKey["ClearUp"] = "ClearUp";
    MenuKey["InsertImage"] = "InsertImage";
    MenuKey["ExportResult"] = "ExportResult";
})(MenuKey || (MenuKey = {}));
const menu = new Menu_1.Menu(mainView).setup([{
        label: '工具',
        items: dist_1.Gaia.listTools().map(v => ({ key: v, label: v }))
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
        }
    }
});
const blackboard = new View_1.View('div').styles.apply('', {
    boxShadow: '3px 3px 10px 1px #00000011',
    width: resultWidth,
    height: resultHeight,
    boxSizing: 'border-box',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'absolute',
    transformOrigin: '50% 50%',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    background: 'white',
}).view;
const contentZone = new View_1.View('div');
contentZone.styles.apply('', {
    position: 'relative',
    flex: 1,
    overflow: 'hidden',
});
contentZone.addChild(blackboard);
mainView.addChild(contentZone, editPanel);
const board = factory.newWhiteBoard({
    width: resultWidth,
    height: resultHeight,
    element: blackboard.inner,
});
const updateEditPanel = () => {
    let needFill = false;
    let needStroke = false;
    let needText = false;
    let needImg = false;
    board.selects.forEach(shape => {
        needFill = needFill || shape.data.needFill;
        needStroke = needStroke || shape.data.needStroke;
        needText = needText || shape.data.type === dist_1.ShapeEnum.Text;
        needImg = needImg || shape.data.type === dist_1.ShapeEnum.Img;
    });
    editPanel.state.value.needFill = needFill;
    editPanel.state.value.needStroke = needStroke;
    editPanel.state.value.needText = needText;
    editPanel.state.value.needImg = needImg;
};
board.addEventListener(event_1.EventEnum.ShapesSelected, e => {
    updateEditPanel();
});
board.addEventListener(event_1.EventEnum.ShapesDeselected, e => {
    updateEditPanel();
});
Object.assign(window, {
    board, factory, mainView, Gaia: dist_1.Gaia, menu
});
const oncontextmenu = (e) => {
    menu.move(e.x, e.y).show();
    e.stopPropagation();
    e.preventDefault();
};
const onkeydown = (e) => {
    if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        const func = ctrlShorcuts.get(e.key);
        if (func) {
            func();
            e.stopPropagation();
            e.preventDefault();
        }
    }
    else if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
        do {
            const toolEnum = toolShortcuts.get(e.key);
            if (toolEnum) {
                board.setToolType(toolEnum);
                e.stopPropagation();
                e.preventDefault();
                break;
            }
            const func = onekeyShorcuts.get(e.key);
            if (func) {
                func();
                e.stopPropagation();
                e.preventDefault();
                break;
            }
        } while (false);
    }
};
const toolShortcuts = new Map([
    ['s', dist_1.ToolEnum.Selector],
    ['p', dist_1.ToolEnum.Pen],
    ['r', dist_1.ToolEnum.Rect],
    ['o', dist_1.ToolEnum.Oval],
    ['t', dist_1.ToolEnum.Text],
    ['z', dist_1.ToolEnum.Tick],
    ['c', dist_1.ToolEnum.Cross],
    ['x', dist_1.ToolEnum.HalfTick],
    ['l', dist_1.ToolEnum.Lines]
]);
const onekeyShorcuts = new Map([
    ['Delete', () => {
            board.removeSelected(true);
        }]
]);
const ctrlShorcuts = new Map([
    ['a', () => board.selectAll(true)],
    ['d', () => board.deselect(true)],
]);
board.addEventListener(event_1.EventEnum.LayerAdded, e => {
    e.detail.onscreen.addEventListener('keydown', onkeydown);
    e.detail.onscreen.addEventListener('contextmenu', oncontextmenu);
});
board.addEventListener(event_1.EventEnum.LayerRemoved, e => {
    e.detail.onscreen.removeEventListener('keydown', onkeydown);
    e.detail.onscreen.removeEventListener('contextmenu', oncontextmenu);
});
board.layers.forEach(layer => {
    layer.onscreen.addEventListener('keydown', onkeydown);
    layer.onscreen.addEventListener('contextmenu', oncontextmenu);
});
window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'a') {
        e.stopPropagation();
    }
});

},{"../../dist":28,"../../dist/event":23,"./EditPanel":1,"./G/BaseView/View":7,"./G/CompoundView/Menu":11}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const event_1 = require("../event");
const tools_1 = require("../tools");
const utils_1 = require("../utils");
const Layer_1 = require("./Layer");
const Tag = '[Board]';
class Board {
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
        if (this._layers.has(layer.info.id)) {
            console.error(`[WhiteBoard] addLayer(): layerId already existed! id = ${layer.info.id}`);
            return false;
        }
        if (layer instanceof Layer_1.Layer) {
            layer.width = this.width;
            layer.height = this.height;
            layer.onscreen.style.pointerEvents = 'none';
            layer.onscreen.addEventListener('pointerdown', this.pointerdown);
            layer.onscreen.addEventListener('pointermove', this.pointermove);
            layer.onscreen.addEventListener('pointerup', this.pointerup);
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
        layer.onscreen.removeEventListener('pointerdown', this.pointerdown);
        layer.onscreen.removeEventListener('pointermove', this.pointermove);
        layer.onscreen.removeEventListener('pointerup', this.pointerup);
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
    constructor(factory, options) {
        var _a, _b;
        this._toolType = tools_1.ToolEnum.Pen;
        this._layers = new Map();
        this._mousedown = false;
        this._tools = {};
        this._selects = [];
        this._operator = 'whiteboard';
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
        window.addEventListener('pointermove', this.pointermove);
        window.addEventListener('pointerup', this.pointerup);
    }
    finds(ids) {
        return this._shapesMgr.finds(ids);
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
        if (this._toolType === to)
            return;
        const from = this._toolType;
        this._toolType = to;
        this.emitEvent(event_1.EventEnum.ToolChanged, {
            operator: this._operator,
            from, to
        });
    }
    get selects() {
        return this._selects;
    }
    add(arg0, emit) {
        const shapes = Array.isArray(arg0) ? arg0 : [arg0];
        if (!shapes.length)
            return 0;
        const ret = this._shapesMgr.add(...shapes);
        shapes.forEach(item => {
            item.board = this;
            if (item.selected)
                this._selects.push(item);
            this.markDirty(item.boundingRect());
        });
        if (emit) {
            this.emitEvent(event_1.EventEnum.ShapesAdded, {
                shapeDatas: shapes.map(v => v.data.copy())
            });
        }
        return ret;
    }
    remove(arg0, emit) {
        const shapes = Array.isArray(arg0) ? arg0 : [arg0];
        if (!shapes.length)
            return 0;
        const ret = this._shapesMgr.remove(...shapes);
        shapes.forEach(item => {
            this.markDirty(item.boundingRect());
            item.board = undefined;
        });
        if (emit) {
            const datas = shapes.map(v => v.data);
            const deselecteds = datas.filter(v => v.selected);
            this.emitEvent(event_1.EventEnum.ShapesDeselected, deselecteds);
            this.emitEvent(event_1.EventEnum.ShapesRemoved, { shapeDatas: datas });
        }
        return ret;
    }
    removeAll(emit) {
        return this.remove(this._shapesMgr.shapes(), emit);
    }
    removeSelected(emit) {
        this.remove(this._selects, emit);
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
        return this.setSelects(this.shapes(), emit)[0];
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
    selectAt(rect, emit) {
        const hits = this._shapesMgr.hits(rect);
        return this.setSelects(hits, emit);
    }
    setSelects(shapes, emit) {
        const selecteds = shapes.filter(v => !v.selected);
        const desecteds = this._selects.filter(a => !shapes.find(b => a === b));
        desecteds.forEach(v => v.selected = false);
        selecteds.forEach(v => v.selected = true);
        this._selects = shapes;
        if (emit) {
            selecteds.length && this.emitEvent(event_1.EventEnum.ShapesSelected, selecteds.map(v => v.data));
            desecteds.length && this.emitEvent(event_1.EventEnum.ShapesDeselected, desecteds.map(v => v.data));
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

},{"../event":23,"../tools":86,"../utils":97,"./Layer":19}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = exports.LayerInfo = void 0;
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
        this._onscreen.tabIndex = 0;
        this._onscreen.draggable = false;
        this._onscreen.style.position = 'absolute';
        this._onscreen.style.touchAction = 'none';
        this._onscreen.style.userSelect = 'none';
        this._onscreen.style.left = '0px';
        this._onscreen.style.right = '0px';
        this._onscreen.style.top = '0px';
        this._onscreen.style.bottom = '0px';
        this._onscreen.style.transition = 'opacity 200ms';
        this._onscreen.style.outline = 'none';
        this._onscreen.addEventListener('pointerdown', () => {
            this._onscreen.focus();
        }, { passive: true });
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

},{}],20:[function(require,module,exports){
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

},{"./Board":18,"./Layer":19}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEnum = void 0;
var EventEnum;
(function (EventEnum) {
    EventEnum["Invalid"] = "";
    EventEnum["ShapesAdded"] = "SHAPES_ADDED";
    EventEnum["ShapesRemoved"] = "SHAPES_REMOVED";
    EventEnum["ShapesChanged"] = "SHAPES_CHANGED";
    EventEnum["ShapesMoved"] = "SHAPES_MOVED";
    EventEnum["ShapesResized"] = "SHAPES_RESIZED";
    EventEnum["ToolChanged"] = "TOOL_CHANGED";
    EventEnum["LayerAdded"] = "LAYER_ADDED";
    EventEnum["LayerRemoved"] = "LAYER_REMOVED";
    EventEnum["ShapesSelected"] = "SHAPES_SELECTED";
    EventEnum["ShapesDeselected"] = "SHAPES_DESELECTED";
})(EventEnum = exports.EventEnum || (exports.EventEnum = {}));

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const EventType_1 = require("./EventType");
var Events;
(function (Events) {
    function pickShapePositionData(data) {
        return {
            i: data.i,
            x: data.x,
            y: data.y
        };
    }
    Events.pickShapePositionData = pickShapePositionData;
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

},{"./EventType":21}],23:[function(require,module,exports){
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

},{"./EventType":21,"./Events":22}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const event_1 = require("../event");
class Player {
    constructor() {
        this.eventIdx = 0;
        this.firstEventTime = 0;
        this.startTime = 0;
        this.timer = 0;
    }
    start(actor, screenplay) {
        this.actor = actor;
        this.screenplay = {
            startTime: screenplay.startTime || 0,
            snapshot: screenplay.snapshot,
            events: screenplay.events || [],
        };
        this.startTime = Date.now();
        this.firstEventTime = 0;
        if (screenplay.snapshot) {
            actor.fromSnapshot(screenplay.snapshot);
        }
        this.tick();
    }
    stop() {
        clearTimeout(this.timer);
    }
    tick() {
        const screenplay = this.screenplay;
        if (!screenplay)
            return this.stop();
        const event = screenplay.events[this.eventIdx];
        if (!event)
            return this.stop();
        let timeStamp = event.timestamp;
        if (!this.firstEventTime && timeStamp)
            this.firstEventTime = timeStamp;
        this.applyEvent(event);
        ++this.eventIdx;
        const next = screenplay.events[this.eventIdx];
        if (!next)
            return this.stop();
        timeStamp = next.timestamp;
        const diff = Math.max(1, (timeStamp - screenplay.startTime) - (this.firstEventTime - screenplay.startTime) - (Date.now() - this.startTime));
        this.timer = setTimeout(() => this.tick(), diff);
    }
    applyEvent(e) {
        var _a, _b;
        const actor = this.actor;
        if (!actor) {
            return;
        }
        switch (e.type) {
            case event_1.EventEnum.ShapesAdded: {
                const detail = e.detail;
                const shapes = (_a = detail.shapeDatas) === null || _a === void 0 ? void 0 : _a.map(v => actor.factory.newShape(v));
                shapes && actor.add(shapes, false);
                break;
            }
            case event_1.EventEnum.ShapesMoved:
            case event_1.EventEnum.ShapesResized:
            case event_1.EventEnum.ShapesChanged: {
                const detail = e.detail;
                detail.shapeDatas.forEach(([curr]) => {
                    var _a;
                    const id = curr.i;
                    id && ((_a = actor.find(id)) === null || _a === void 0 ? void 0 : _a.merge(curr));
                });
                break;
            }
            case event_1.EventEnum.ShapesRemoved: {
                const detail = e.detail;
                const shapes = (_b = detail.shapeDatas) === null || _b === void 0 ? void 0 : _b.map(data => actor.find(data.i)).filter(v => v);
                shapes && actor.remove(shapes, false);
                break;
            }
        }
    }
}
exports.Player = Player;

},{"../event":23}],25:[function(require,module,exports){
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
        const startTime = new CustomEvent('').timeStamp;
        const screenplay = {
            startTime,
            snapshot: actor.toSnapshot(),
            events: []
        };
        for (const key in event_1.EventEnum) {
            const v = event_1.EventEnum[key];
            const func = (e) => {
                screenplay.events.push({
                    timestamp: e.timeStamp - startTime,
                    type: e.type,
                    detail: e.detail
                });
            };
            this._screenplay = screenplay;
            actor.addEventListener(v, func);
            const canceller = () => actor.removeEventListener(v, func);
            this._cancellers.push(canceller);
        }
        return this;
    }
}
exports.Recorder = Recorder;

},{"../event":23}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],27:[function(require,module,exports){
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

},{"./Player":24,"./Recorder":25,"./Screenplay":26}],28:[function(require,module,exports){
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

},{"./board":20,"./features":27,"./mgr":33,"./shape":51,"./tools":86,"./utils":97}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultFactory = void 0;
const Data_1 = require("../shape/base/Data");
const ShapesMgr_1 = require("./ShapesMgr");
const Shape_1 = require("../shape/base/Shape");
const InvalidTool_1 = require("../tools/base/InvalidTool");
const FactoryEnum_1 = require("./FactoryEnum");
const Gaia_1 = require("./Gaia");
const board_1 = require("../board");
const Tag = '[DefaultFactory]';
class DefaultFactory {
    constructor() {
        this._z = 0;
        this._time = 0;
        this._shapeTemplates = {};
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
        const isNew = typeof v === 'string' || typeof v === 'number';
        const type = isNew ? v : v.t;
        const data = this.newShapeData(type);
        const template = isNew ? this.shapeTemplate(v) : v;
        data.copyFrom(template);
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
        return new board_1.Layer(inits);
    }
}
exports.DefaultFactory = DefaultFactory;
Gaia_1.Gaia.registerFactory(FactoryEnum_1.FactoryEnum.Default, () => new DefaultFactory(), { name: 'bulit-in Factory', desc: 'bulit-in Factory' });

},{"../board":20,"../shape/base/Data":35,"../shape/base/Shape":36,"../tools/base/InvalidTool":82,"./FactoryEnum":30,"./Gaia":31,"./ShapesMgr":32}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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
}
exports.Gaia = Gaia;
Gaia._tools = new Map();
Gaia._toolInfos = new Map();
Gaia._shapeDatas = new Map();
Gaia._shapes = new Map();
Gaia._shapeInfos = new Map();
Gaia._factorys = new Map();
Gaia._factoryInfos = new Map();

},{"../shape/ShapeEnum":34,"../tools/ToolEnum":81}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultShapesMgr = void 0;
const Rect_1 = require("../utils/Rect");
const Tag = '[DefaultShapesMgr]';
class DefaultShapesMgr {
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
exports.DefaultShapesMgr = DefaultShapesMgr;

},{"../utils/Rect":94}],33:[function(require,module,exports){
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

},{"./Factory":29,"./FactoryEnum":30,"./Gaia":31,"./ShapesMgr":32}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
class ShapeData {
    constructor() {
        this.t = ShapeEnum_1.ShapeEnum.Invalid;
        this.i = '';
        this.x = 0;
        this.y = 0;
        this.w = -0;
        this.h = -0;
        this.z = -0;
        this.l = '';
        this.style = {};
        this.status = {};
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
    get visible() { var _a; return ((_a = this.status) === null || _a === void 0 ? void 0 : _a.v) !== 0; }
    set visible(v) {
        if (!this.status)
            this.status = {};
        if (v)
            this.status.v = 1;
        else if (v === false)
            this.status.v = 0;
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
    get layer() { return this.l; }
    set layer(v) { this.l = v; }
    get needFill() { return true; }
    get needStroke() { return true; }
    merge(other) {
        this.copyFrom(other);
        return this;
    }
    copyFrom(other) {
        if (typeof other.t === 'string' || typeof other.t === 'number')
            this.t = other.t;
        if (typeof other.i === 'string')
            this.i = other.i;
        if (typeof other.x === 'number')
            this.x = other.x;
        if (typeof other.y === 'number')
            this.y = other.y;
        if (typeof other.z === 'number')
            this.z = other.z;
        if (typeof other.w === 'number')
            this.w = other.w;
        if (typeof other.h === 'number')
            this.h = other.h;
        if (typeof other.l === 'string')
            this.l = other.l;
        const { style, status } = other;
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
            if (typeof style.e === 'number')
                this.style.e = style.e;
            if (style.f)
                this.style.f = style.f;
            if (typeof style.g === 'number')
                this.style.g = style.g;
            if (typeof style.h === 'number')
                this.style.h = style.h;
        }
        if (status) {
            if (!this.status)
                this.status = {};
            if (typeof status.v === 'number')
                this.status.v = status.v;
            if (typeof status.s === 'number')
                this.status.s = status.s;
            if (typeof status.e === 'number')
                this.status.e = status.e;
        }
        return this;
    }
    copy() {
        return new ShapeData().copyFrom(this);
    }
}
exports.ShapeData = ShapeData;

},{"../ShapeEnum":34}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = exports.Resizable = exports.ResizeDirection = void 0;
const Rect_1 = require("../../utils/Rect");
var ResizeDirection;
(function (ResizeDirection) {
    ResizeDirection[ResizeDirection["None"] = 0] = "None";
    ResizeDirection[ResizeDirection["TopLeft"] = 1] = "TopLeft";
    ResizeDirection[ResizeDirection["TopRight"] = 2] = "TopRight";
    ResizeDirection[ResizeDirection["BottomLeft"] = 3] = "BottomLeft";
    ResizeDirection[ResizeDirection["BottomRight"] = 4] = "BottomRight";
})(ResizeDirection = exports.ResizeDirection || (exports.ResizeDirection = {}));
var Resizable;
(function (Resizable) {
    Resizable[Resizable["None"] = 0] = "None";
    Resizable[Resizable["All"] = 1] = "All";
})(Resizable = exports.Resizable || (exports.Resizable = {}));
class Shape {
    constructor(data) {
        this._resizable = Resizable.None;
        this._data = data;
    }
    get data() { return this._data; }
    get type() { return this._data.type; }
    get board() { return this._board; }
    set board(v) { this._board = v; }
    get visible() {
        return !!this._data.visible;
    }
    set visible(v) {
        if (!!this._data.visible === v)
            return;
        this._data.visible = v;
        this.markDirty();
    }
    get editing() { return !!this._data.editing; }
    set editing(v) {
        if (!!this._data.editing === v)
            return;
        this._data.editing = v;
        this.markDirty();
    }
    get selected() { return !!this._data.selected; }
    set selected(v) {
        if (!!this._data.selected === v)
            return;
        this._data.selected = v;
        this.markDirty();
    }
    get resizable() { return this._resizable; }
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
    getGeo() {
        return new Rect_1.Rect(this._data.x, this._data.y, this._data.w, this._data.h);
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
        if (this.selected) {
            // 虚线其实相当损耗性能
            const lineWidth = 1;
            const halfLineW = lineWidth / 2;
            ctx.lineWidth = lineWidth;
            const { x, y, w, h } = this.boundingRect();
            ctx.beginPath();
            ctx.rect(x + halfLineW, y + halfLineW, w - lineWidth, h - lineWidth);
            ctx.closePath();
            ctx.strokeStyle = 'white';
            ctx.setLineDash([]);
            ctx.stroke();
            ctx.strokeStyle = 'black';
            ctx.setLineDash([lineWidth * 4]);
            ctx.stroke();
            if (this._resizable === Resizable.All) {
                ctx.fillStyle = 'white';
                ctx.setLineDash([]);
                const s = 5;
                const lx = x + halfLineW;
                const rx = x + w - s - halfLineW;
                const ty = y + halfLineW;
                const by = y + h - s - halfLineW;
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
    }
    drawingRect() {
        const d = this._data;
        const drawOffset = (d.lineWidth % 2) ? 0.5 : 0;
        return {
            x: Math.floor(d.x) + drawOffset,
            y: Math.floor(d.y) + drawOffset,
            w: Math.floor(d.w),
            h: Math.floor(d.h)
        };
    }
    boundingRect() {
        const d = this.data;
        const offset = (d.lineWidth % 2) ? 1 : 0;
        return {
            x: Math.floor(d.x - d.lineWidth / 2),
            y: Math.floor(d.y - d.lineWidth / 2),
            w: Math.ceil(d.w + d.lineWidth + offset),
            h: Math.ceil(d.h + d.lineWidth + offset)
        };
    }
    resizeDirection(pointerX, pointerY) {
        if (!this.selected || !this._resizable) {
            return [ResizeDirection.None, undefined];
        }
        const lineWidth = 1;
        const halfLineW = lineWidth / 2;
        const { x, y, w, h } = this.boundingRect();
        const s = 5;
        const lx = x + halfLineW;
        const rx = x + w - s - halfLineW;
        const ty = y + halfLineW;
        const by = y + h - s - halfLineW;
        const pos = { x: pointerX, y: pointerY };
        const rect = new Rect_1.Rect(0, 0, s, s);
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
}
exports.Shape = Shape;

},{"../../utils/Rect":94}],37:[function(require,module,exports){
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
        super.render(ctx);
    }
}
exports.ShapeNeedPath = ShapeNeedPath;

},{"./Shape":36}],38:[function(require,module,exports){
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

},{"./Data":35,"./Shape":36,"./ShapeNeedPath":37}],39:[function(require,module,exports){
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
    copy() {
        return new CrossData().copyFrom(this);
    }
}
exports.CrossData = CrossData;

},{"../ShapeEnum":34,"../base":38}],40:[function(require,module,exports){
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

},{"../../mgr/Gaia":31,"../ShapeEnum":34,"../base/ShapeNeedPath":37,"./Data":39}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "CrossTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Cross, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Cross, ShapeEnum_1.ShapeEnum.Cross), { name: 'cross', desc: 'cross drawer', shape: ShapeEnum_1.ShapeEnum.Cross });

},{"../../mgr/Gaia":31,"../../tools/ToolEnum":81,"../../tools/base/SimpleTool":83,"../ShapeEnum":34}],42:[function(require,module,exports){
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

},{"./Data":39,"./Shape":40,"./Tool":41}],43:[function(require,module,exports){
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
    copy() {
        return new HalfTickData().copyFrom(this);
    }
}
exports.HalfTickData = HalfTickData;

},{"../ShapeEnum":34,"../base":38}],44:[function(require,module,exports){
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

},{"../../mgr/Gaia":31,"../ShapeEnum":34,"../base/ShapeNeedPath":37,"./Data":43}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HalfTickTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "HalfTickTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.HalfTick, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.HalfTick, ShapeEnum_1.ShapeEnum.HalfTick), { name: 'half tick', desc: 'half tick drawer', shape: ShapeEnum_1.ShapeEnum.HalfTick });

},{"../../mgr/Gaia":31,"../../tools/ToolEnum":81,"../../tools/base/SimpleTool":83,"../ShapeEnum":34}],46:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Data":43,"./Shape":44,"./Tool":45,"dup":42}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgData = exports.ObjectFit = void 0;
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
    copy() {
        return new ImgData().copyFrom(this);
    }
    copyFrom(other) {
        super.copyFrom(other);
        if (typeof other.s === 'string')
            this.s = other.s;
        if (typeof other.f === 'number')
            this.f = other.f;
        return this;
    }
}
exports.ImgData = ImgData;

},{"../ShapeEnum":34,"../base":38}],48:[function(require,module,exports){
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
        var _a;
        const d = this.data;
        if (((_a = this._img) === null || _a === void 0 ? void 0 : _a.src) === d.src) {
            return this._img;
        }
        ;
        if (this._img) {
            this._img.removeEventListener('load', this.onLoad);
            this._img.removeEventListener('error', this.onError);
        }
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
            let { x, y, w, h } = this.boundingRect();
            switch (this.data.objectFit) {
                case Data_1.ObjectFit.Fill: {
                    ctx.drawImage(img, 0, 0, img.width, img.height, x, y, w, h);
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
                    ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh);
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
                    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
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
        const { x, y, w, h } = this.boundingRect();
        ctx.fillStyle = '#00000088';
        ctx.fillRect(x, y, w, h);
        ctx.font = 'normal 16px serif';
        ctx.fillStyle = 'white';
        const { fontBoundingBoxDescent: fd, fontBoundingBoxAscent: fa, actualBoundingBoxLeft: al } = ctx.measureText(text);
        const height = fd + fa;
        ctx.fillText(this._error, 1 + x + al, y + height);
    }
}
exports.ShapeImg = ShapeImg;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Img, () => new Data_1.ImgData, d => new ShapeImg(d));

},{"../../mgr/Gaia":31,"../ShapeEnum":34,"../base":38,"./Data":47}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "RectTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Img, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Img, ShapeEnum_1.ShapeEnum.Img), { name: 'Img', desc: 'Img drawer', shape: ShapeEnum_1.ShapeEnum.Img });

},{"../../mgr/Gaia":31,"../../tools/ToolEnum":81,"../../tools/base/SimpleTool":83,"../ShapeEnum":34}],50:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Data":47,"./Shape":48,"./Tool":49,"dup":42}],51:[function(require,module,exports){
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

},{"./ShapeEnum":34,"./base":38,"./cross":42,"./halftick":46,"./img":50,"./lines":55,"./oval":59,"./pen":63,"./polygon":67,"./rect":71,"./text":76,"./tick":80}],52:[function(require,module,exports){
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
    copyFrom(other) {
        super.copyFrom(other);
        if (Array.isArray(other.coords))
            this.coords = [...other.coords];
        return this;
    }
    merge(other) {
        super.copyFrom(other);
        if (Array.isArray(other.coords)) {
            this.coords = [...other.coords];
        }
        return this;
    }
    copy() {
        return new LinesData().copyFrom(this);
    }
}
exports.LinesData = LinesData;

},{"../ShapeEnum":34,"../base":38}],53:[function(require,module,exports){
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

},{"../../mgr/Gaia":31,"../ShapeEnum":34,"../base":38,"./Data":52}],54:[function(require,module,exports){
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
            board.emitEvent(event_1.EventEnum.ShapesChanged, {
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
            board.emitEvent(event_1.EventEnum.ShapesChanged, {
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
        const shape = this._curShape;
        if (!shape) {
            return;
        }
        if (!this._pressingShift) {
            shape.data.editing = false;
            delete this._curShape;
        }
        else {
            this.addDot(dot);
        }
    }
}
exports.LinesTool = LinesTool;
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Lines, () => new LinesTool(), { name: 'lines', desc: 'lines', shape: ShapeEnum_1.ShapeEnum.Lines });

},{"../../event":23,"../../mgr/Gaia":31,"../../tools/ToolEnum":81,"../ShapeEnum":34}],55:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Data":52,"./Shape":53,"./Tool":54,"dup":42}],56:[function(require,module,exports){
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
    copy() {
        return new OvalData().copyFrom(this);
    }
}
exports.OvalData = OvalData;

},{"../ShapeEnum":34,"../base":38}],57:[function(require,module,exports){
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

},{"../../mgr/Gaia":31,"../ShapeEnum":34,"../base/ShapeNeedPath":37,"./Data":56}],58:[function(require,module,exports){
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
            const f = this._rect.from();
            const t = this._rect.to();
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
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Oval, () => new OvalTool(), { name: 'oval', desc: 'oval drawer', shape: ShapeEnum_1.ShapeEnum.Oval });

},{"../../mgr/Gaia":31,"../../tools/ToolEnum":81,"../../tools/base/SimpleTool":83,"../ShapeEnum":34}],59:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Data":56,"./Shape":57,"./Tool":58,"dup":42}],60:[function(require,module,exports){
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
    copyFrom(other) {
        super.copyFrom(other);
        if (other.dotsType)
            this.dotsType = other.dotsType;
        if (Array.isArray(other.coords))
            this.coords = [...other.coords];
        return this;
    }
    merge(other) {
        super.copyFrom(other);
        if (Array.isArray(other.coords)) {
            if (other.dotsType === DotsType.Append)
                this.coords.push(...other.coords);
            else
                this.coords = [...other.coords];
        }
        return this;
    }
    copy() {
        return new PenData().copyFrom(this);
    }
}
exports.PenData = PenData;

},{"../ShapeEnum":34,"../base":38}],61:[function(require,module,exports){
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
        this.data.dotsType = Data_1.DotsType.All;
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
exports.ShapePen = ShapePen;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Pen, () => new Data_1.PenData, d => new ShapePen(d));

},{"../../mgr/Gaia":31,"../ShapeEnum":34,"../base":38,"./Data":60}],62:[function(require,module,exports){
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
            board.emitEvent(event_1.EventEnum.ShapesChanged, {
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
        const shape = this._curShape;
        if (shape)
            shape.data.editing = false;
        this.addDot(dot, 'last');
        this.end();
    }
}
exports.PenTool = PenTool;
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Pen, () => new PenTool(), { name: 'pen', desc: 'simple pen', shape: ShapeEnum_1.ShapeEnum.Pen });

},{"../../event":23,"../../mgr/Gaia":31,"../../tools/ToolEnum":81,"../ShapeEnum":34,"./Data":60}],63:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Data":60,"./Shape":61,"./Tool":62,"dup":42}],64:[function(require,module,exports){
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
    copyFrom(other) {
        super.copyFrom(other);
        if ('dots' in other)
            this.dots = other.dots.map(v => (Object.assign({}, v)));
        return this;
    }
    copy() {
        return new PolygonData().copyFrom(this);
    }
}
exports.PolygonData = PolygonData;

},{"../ShapeEnum":34,"../base":38}],65:[function(require,module,exports){
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

},{"../../mgr/Gaia":31,"../ShapeEnum":34,"../base/ShapeNeedPath":37,"./Data":64}],66:[function(require,module,exports){
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

},{"../../mgr/Gaia":31,"../../tools/ToolEnum":81,"../../tools/base/SimpleTool":83,"../ShapeEnum":34}],67:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Data":64,"./Shape":65,"./Tool":66,"dup":42}],68:[function(require,module,exports){
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
    copy() {
        return new RectData().copyFrom(this);
    }
}
exports.RectData = RectData;

},{"../ShapeEnum":34,"../base":38}],69:[function(require,module,exports){
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

},{"../../mgr/Gaia":31,"../ShapeEnum":34,"../base/ShapeNeedPath":37,"./Data":68}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "RectTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Rect, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Rect, ShapeEnum_1.ShapeEnum.Rect), { name: 'rect', desc: 'rect drawer', shape: ShapeEnum_1.ShapeEnum.Rect });

},{"../../mgr/Gaia":31,"../../tools/ToolEnum":81,"../../tools/base/SimpleTool":83,"../ShapeEnum":34}],71:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Data":68,"./Shape":69,"./Tool":70,"dup":42}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextData = void 0;
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
    copyFrom(other) {
        super.copyFrom(other);
        if (typeof other.text === 'string')
            this.text = other.text;
        if (Array.isArray(other.f_d))
            this.f_d = [...other.f_d];
        if (typeof other.t_l === 'number')
            this.t_l = other.t_l;
        if (typeof other.t_r === 'number')
            this.t_r = other.t_r;
        if (typeof other.t_t === 'number')
            this.t_t = other.t_t;
        if (typeof other.t_b === 'number')
            this.t_b = other.t_b;
        return this;
    }
    copy() {
        return new TextData().copyFrom(this);
    }
}
exports.TextData = TextData;

},{"../ShapeEnum":34,"../base":38}],73:[function(require,module,exports){
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
    constructor(data) {
        super(data);
        this._selection = new TextSelection_1.TextSelection;
        this._lines = [];
        this._selectionRects = [];
        this._cursorVisible = false;
        this._calculateLines();
        this._calculateSectionRects();
    }
    merge(data) {
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
        if (this.editing) {
            const { x, y, w, h } = this.boundingRect();
            let lineWidth = 1;
            let halfLineW = lineWidth / 2;
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = this.data.fillStyle || 'white';
            ctx.setLineDash([]);
            ctx.strokeRect(x + halfLineW, y + halfLineW, w - lineWidth, h - lineWidth);
        }
        if (needStroke || needFill) {
            const { x, y } = this.data;
            this._applyStyle(ctx);
            for (let i = 0; i < this._lines.length; ++i) {
                const line = this._lines[i];
                needFill && ctx.fillText(line.str, x + line.x, y + line.bl);
                needStroke && ctx.strokeText(line.str, x + line.x, y + line.bl);
            }
            if (this._cursorVisible && this.editing) {
                ctx.globalCompositeOperation = 'xor';
                for (let i = 0; i < this._selectionRects.length; ++i) {
                    const rect = this._selectionRects[i];
                    ctx.fillRect(x + rect.x, y + rect.y, rect.w, rect.h);
                }
                ctx.globalCompositeOperation = 'source-over';
            }
        }
        return super.render(ctx);
    }
}
exports.ShapeText = ShapeText;
Gaia_1.Gaia.registerShape(ShapeEnum_1.ShapeEnum.Text, () => new Data_1.TextData, d => new ShapeText(d));

},{"../../mgr/Gaia":31,"../../utils/Rect":94,"../ShapeEnum":34,"../base":38,"./Data":72,"./TextSelection":74}],74:[function(require,module,exports){
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

},{}],75:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const event_1 = require("../../event");
const Tag = '[TextTool]';
class TextTool {
    set curShape(shape) {
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
            if (!preShape.text) {
                const board = this.board;
                if (!board)
                    return;
                board.remove(preShape, true);
            }
        }
    }
    constructor() {
        this._editor = document.createElement('textarea');
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
            board.emitEvent(event_1.EventEnum.ShapesChanged, {
                shapeType: this.type,
                shapeDatas: [[curr, prev]]
            });
        };
        this._keydown = (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.curShape = undefined;
            }
            else if (e.key === 'Escape') {
                this.curShape = undefined;
            }
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
        this._editor.addEventListener('keydown', this._keydown);
        this._editor.addEventListener('input', this._updateShapeText);
        document.addEventListener('selectionchange', this._updateShapeText);
    }
    end() {
        this._editor.removeEventListener('keydown', this._keydown);
        this._editor.removeEventListener('input', this._updateShapeText);
        document.removeEventListener('selectionchange', this._updateShapeText);
        this.curShape = undefined;
    }
    get type() { return ToolEnum_1.ToolEnum.Text; }
    render() { }
    get board() {
        return this._board;
    }
    set board(v) {
        var _a, _b, _c;
        this._board = v;
        (_c = (_b = (_a = this._board) === null || _a === void 0 ? void 0 : _a.onscreen()) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.appendChild(this._editor);
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
            this.curShape = undefined;
            return;
        }
        else if (!shapeText) {
            const newShapeText = board.factory.newShape(ShapeEnum_1.ShapeEnum.Text);
            newShapeText.data.layer = board.layer().id;
            newShapeText.move(dot.x, dot.y);
            board.add(newShapeText, true);
            shapeText = newShapeText;
        }
        this.curShape = shapeText;
        setTimeout(() => this._editor.focus(), 10);
    }
    pointerDraw(dot) { }
    pointerUp(dot) { }
}
exports.TextTool = TextTool;
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Text, () => new TextTool, { name: 'text', desc: 'text drawer', shape: ShapeEnum_1.ShapeEnum.Text });

},{"../../event":23,"../../mgr/Gaia":31,"../../tools/ToolEnum":81,"../ShapeEnum":34}],76:[function(require,module,exports){
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

},{"./Data":72,"./Shape":73,"./TextSelection":74,"./Tool":75}],77:[function(require,module,exports){
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
    copy() {
        return new TickData().copyFrom(this);
    }
}
exports.TickData = TickData;

},{"../ShapeEnum":34,"../base":38}],78:[function(require,module,exports){
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

},{"../../mgr/Gaia":31,"../ShapeEnum":34,"../base/ShapeNeedPath":37,"./Data":77}],79:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "TickTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Tick, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Tick, ShapeEnum_1.ShapeEnum.Tick), { name: 'tick', desc: 'tick drawer', shape: ShapeEnum_1.ShapeEnum.Tick });

},{"../../mgr/Gaia":31,"../../tools/ToolEnum":81,"../../tools/base/SimpleTool":83,"../ShapeEnum":34}],80:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Data":77,"./Shape":78,"./Tool":79,"dup":42}],81:[function(require,module,exports){
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

},{}],82:[function(require,module,exports){
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

},{"../ToolEnum":81}],83:[function(require,module,exports){
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
        this._prevData = event_1.Events.pickShapeGeoData(shape.data);
        const prev = this._prevData;
        const emitEvent = () => {
            const curr = event_1.Events.pickShapeGeoData(shape.data);
            board.emitEvent(event_1.EventEnum.ShapesResized, {
                shapeDatas: [[curr, prev]]
            });
            delete this._prevData;
        };
        this.applyRect();
        setTimeout(emitEvent, 1000 / 60);
    }
}
exports.SimpleTool = SimpleTool;

},{"../../event":23,"../../utils/RectHelper":95}],84:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],85:[function(require,module,exports){
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

},{"./InvalidTool":82,"./SimpleTool":83,"./Tool":84}],86:[function(require,module,exports){
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

},{"./ToolEnum":81,"./base":85,"./selector":88}],87:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorTool = exports.SelectorStatus = void 0;
const RectHelper_1 = require("../../utils/RectHelper");
const Data_1 = require("../../shape/base/Data");
const Gaia_1 = require("../../mgr/Gaia");
const Shape_1 = require("../../shape/rect/Shape");
const ToolEnum_1 = require("../ToolEnum");
const Events_1 = require("../../event/Events");
const event_1 = require("../../event");
var SelectorStatus;
(function (SelectorStatus) {
    SelectorStatus[SelectorStatus["Invalid"] = 0] = "Invalid";
    SelectorStatus[SelectorStatus["Dragging"] = 1] = "Dragging";
    SelectorStatus[SelectorStatus["Selecting"] = 2] = "Selecting";
    SelectorStatus[SelectorStatus["Resizing"] = 3] = "Resizing";
})(SelectorStatus = exports.SelectorStatus || (exports.SelectorStatus = {}));
const Tag = '[SelectorTool]';
class SelectorTool {
    get type() { return ToolEnum_1.ToolEnum.Selector; }
    get board() {
        return this._rect.board;
    }
    set board(v) {
        this._rect.board = v;
    }
    constructor() {
        this._rect = new Shape_1.ShapeRect(new Data_1.ShapeData);
        this._rectHelper = new RectHelper_1.RectHelper();
        this._status = SelectorStatus.Invalid;
        this._prevPos = { x: 0, y: 0 };
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
    }
    end() {
        this.deselect();
    }
    deselect() {
        const { board } = this;
        if (!board) {
            return;
        }
        board.deselect(true);
    }
    pointerDown(dot) {
        const { x, y } = dot;
        this._prevPos = { x, y };
        const board = this.board;
        if (!board)
            return;
        switch (this._status) {
            case SelectorStatus.Invalid:
                this._rectHelper.start(x, y);
                this.updateGeo();
                const shape = board.hit({ x, y, w: 0, h: 0 });
                if (!shape) {
                    // 点击的位置无任何图形，则框选图形, 并取消选择以选择的图形
                    this._status = SelectorStatus.Selecting;
                    this._rect.visible = true;
                    this.deselect();
                }
                else if (!shape.selected) {
                    // 点击位置存在图形，且图形未被选择，则选择点中的图形。
                    this._status = SelectorStatus.Dragging;
                    board.setSelects([shape], true);
                }
                else {
                    // 点击位置存在图形，且图形已被选择，则判断是否点击尺寸调整。
                    const [direction, resizerRect] = shape.resizeDirection(dot.x, dot.y);
                    if (direction) {
                        this._resizerRect = resizerRect;
                        this._status = SelectorStatus.Resizing;
                        board.setSelects([shape], true);
                    }
                    else {
                        this._status = SelectorStatus.Dragging;
                    }
                }
                this._shapes = board.selects.map(v => {
                    const data = {
                        i: v.data.i,
                        x: v.data.x,
                        y: v.data.y
                    };
                    return {
                        shape: v,
                        prevData: data
                    };
                });
                return;
        }
    }
    pointerMove() { }
    pointerDraw(dot) {
        const diffX = dot.x - this._prevPos.x;
        const diffY = dot.y - this._prevPos.y;
        this._prevPos = dot;
        const board = this.board;
        if (!board)
            return;
        switch (this._status) {
            case SelectorStatus.Selecting: {
                this._rectHelper.end(dot.x, dot.y);
                this.updateGeo();
                board.selectAt(this._rect.data, true);
                return;
            }
            case SelectorStatus.Dragging: {
                this._shapes.forEach(v => {
                    v.prevData = Events_1.Events.pickShapePositionData(v.shape.data);
                    v.shape.moveBy(diffX, diffY);
                });
                this.emitEvent(false);
                return;
            }
            case SelectorStatus.Resizing: {
                this.emitEvent(false);
                return;
            }
        }
    }
    emitEvent(immediately) {
        if (this._waiting && !immediately)
            return;
        this._waiting = true;
        const board = this.board;
        if (!board)
            return;
        board.emitEvent(event_1.EventEnum.ShapesMoved, {
            shapeDatas: this._shapes.map(v => {
                const ret = [
                    Events_1.Events.pickShapePositionData(v.shape.data), v.prevData
                ];
                return ret;
            })
        });
        setTimeout(() => { this._waiting = false; }, 1000 / 30);
    }
    pointerUp() {
        this._status = SelectorStatus.Invalid;
        this._rect.visible = false;
        this._rectHelper.clear();
        this.emitEvent(true);
    }
    updateGeo() {
        const { x, y, w, h } = this._rectHelper.gen();
        this._rect.geo(x, y, w, h);
    }
}
exports.SelectorTool = SelectorTool;
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Selector, () => new SelectorTool, {
    name: 'selector',
    desc: 'selector'
});

},{"../../event":23,"../../event/Events":22,"../../mgr/Gaia":31,"../../shape/base/Data":35,"../../shape/rect/Shape":69,"../../utils/RectHelper":95,"../ToolEnum":81}],88:[function(require,module,exports){
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

},{"./SelectorTool":87}],89:[function(require,module,exports){
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

},{}],90:[function(require,module,exports){
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

},{"./BinaryRange":89}],91:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],92:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],93:[function(require,module,exports){
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

},{"./Rect":94}],94:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
class Rect {
    get top() { return this.y; }
    get left() { return this.x; }
    get right() { return this.x + this.w; }
    get bottom() { return this.y + this.h; }
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

},{}],95:[function(require,module,exports){
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
        this._from = Vector_1.Vector.pure(-999, -999);
        this._to = Vector_1.Vector.pure(-999, -999);
    }
    from() {
        return this._from;
    }
    to() {
        return this._to;
    }
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
        this._from = Vector_1.Vector.pure(-999, -999);
        this._to = Vector_1.Vector.pure(-999, -999);
    }
    gen(options) {
        // PREF: IMPROVE ME
        const lockMode = (options === null || options === void 0 ? void 0 : options.lockMode) || LockMode.Default;
        const genMode = (options === null || options === void 0 ? void 0 : options.genMode) || GenMode.FromCorner;
        let { x: x0, y: y0 } = this._from;
        let { x: x1, y: y1 } = this._to;
        switch (lockMode) {
            case LockMode.Square:
                if (genMode === GenMode.FromCenter) {
                    const d = Math.max(Math.abs(x0 - x1), Math.abs(y0 - y1));
                    x1 = x0 + d;
                    y1 = y0 + d;
                }
                else if (genMode === GenMode.FromCorner) {
                    const k = (y0 - y1) / (x0 - x1) > 0 ? 1 : -1;
                    const b = y1 + k * x1;
                    x1 = (b - y0 + k * x0) / (2 * k);
                    y1 = -k * x1 + b;
                }
                break;
            case LockMode.Circle:
                if (genMode === GenMode.FromCenter) {
                    const r = Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2));
                    x1 = x0 + r;
                    y1 = y0 + r;
                }
                else if (genMode === GenMode.FromCorner) {
                    const d = Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2));
                    const xo = (x0 + x1) / 2;
                    const yo = (y0 + y1) / 2;
                    return {
                        x: xo - d / 2,
                        y: yo - d / 2,
                        w: d,
                        h: d,
                    };
                }
                break;
        }
        switch (genMode) {
            case GenMode.FromCenter: {
                const halfW = Math.abs(x0 - x1);
                const halfH = Math.abs(y0 - y1);
                return {
                    x: x0 - halfW,
                    y: y0 - halfH,
                    w: 2 * halfW,
                    h: 2 * halfH,
                };
            }
            default: {
                const x = Math.min(x0, x1);
                const y = Math.min(y0, y1);
                return {
                    x, y,
                    w: Math.max(x0, x1) - x,
                    h: Math.max(y0, y1) - y
                };
            }
        }
    }
}
exports.RectHelper = RectHelper;

},{"./Vector":96}],96:[function(require,module,exports){
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
    static distance(v0, v1) {
        return Math.sqrt(Math.pow(v0.x - v1.x, 2) +
            Math.pow(v0.y - v1.y, 2));
    }
}
exports.Vector = Vector;

},{}],97:[function(require,module,exports){
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

},{"./BinaryRange":89,"./BinaryTree":90,"./Dot":91,"./ITree":92,"./QuadTree":93,"./Rect":94,"./Vector":96}]},{},[17]);
