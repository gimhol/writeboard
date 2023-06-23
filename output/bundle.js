(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorViewEventTypes = void 0;
const Button_1 = require("./G/BaseView/Button");
const ButtonGroup_1 = require("./G/Helper/ButtonGroup");
const Canvas_1 = require("./G/BaseView/Canvas");
const NumberInput_1 = require("./G/BaseView/NumberInput");
const View_1 = require("./G/BaseView/View");
const SubWin_1 = require("./G/CompoundView/SubWin");
const Color_1 = require("./colorPalette/Color");
const ColorPalette_1 = require("./colorPalette/ColorPalette");
var ColorKind;
(function (ColorKind) {
    ColorKind["Line"] = "Line";
    ColorKind["Fill"] = "Fill";
})(ColorKind || (ColorKind = {}));
class ColorKindButton extends Button_1.Button {
    get kind() { return this._kind; }
    set color(v) { var _a; (_a = this._colorBrick) === null || _a === void 0 ? void 0 : _a.styles.apply('_', old => (Object.assign(Object.assign({}, old), { background: '' + v }))); }
    constructor() {
        super();
    }
    init(inits) {
        super.init(inits);
        this._kind = inits === null || inits === void 0 ? void 0 : inits.kind;
        this.styles.apply('normal', v => (Object.assign(Object.assign({}, v), { paddingLeft: 5, paddingRight: 5 })));
        const content = new View_1.View('div');
        content.styles.apply('_', {
            display: 'inline-flex',
            alignItems: 'center',
            color: 'white'
        });
        content.inner.append((inits === null || inits === void 0 ? void 0 : inits.kind) + ' ');
        this._colorBrick = new View_1.View('div');
        this._colorBrick.styles.apply('_', {
            marginLeft: 5,
            background: '' + (inits === null || inits === void 0 ? void 0 : inits.defaultColor),
            width: 16,
            height: 16,
        });
        content.addChild(this._colorBrick);
        this.content = content;
        return this;
    }
}
var ColorViewEventTypes;
(function (ColorViewEventTypes) {
    ColorViewEventTypes["LineColorChange"] = "linecolorchange";
    ColorViewEventTypes["FillColorChange"] = "fillcolorchange";
})(ColorViewEventTypes = exports.ColorViewEventTypes || (exports.ColorViewEventTypes = {}));
class ColorView extends SubWin_1.Subwin {
    setEditingColor(v) {
        if (!v) {
            return;
        }
        this._editing = v;
        this._colorPalette.value = this._colors[this._editing];
    }
    constructor() {
        super();
        this._inputs = {
            r: new ColorNumInput(),
            g: new ColorNumInput(),
            b: new ColorNumInput(),
            a: new ColorNumInput(),
        };
        this._editing = ColorKind.Line;
        this._colors = {
            [ColorKind.Line]: new Color_1.RGBA(255, 255, 255, 255),
            [ColorKind.Fill]: new Color_1.RGBA(100, 100, 100, 255)
        };
        this._btnColors = {
            [ColorKind.Line]: new ColorKindButton().init({ checkable: true, kind: ColorKind.Line, defaultColor: this._colors[ColorKind.Line] }),
            [ColorKind.Fill]: new ColorKindButton().init({ checkable: true, kind: ColorKind.Fill, defaultColor: this._colors[ColorKind.Fill] })
        };
        this.header.title = 'color';
        this.styles.apply('_', {});
        this.content = new View_1.View('div');
        this.content.styles.apply('_', {
            flex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            minWidth: '250px',
            minHeight: '200px',
        });
        const currentColorWrapper = new View_1.View('div');
        currentColorWrapper.styles.apply('_', {
            display: 'flex',
            padding: '5px 5px',
        });
        this.content.addChild(currentColorWrapper);
        currentColorWrapper.addChild(this._btnColors.Line, this._btnColors.Fill);
        const buttonGroup = new ButtonGroup_1.ButtonGroup({
            buttons: [this._btnColors.Line, this._btnColors.Fill]
        });
        buttonGroup.onClick = btn => this.setEditingColor(btn === null || btn === void 0 ? void 0 : btn.kind);
        const canvasWrapper = new View_1.View('div');
        canvasWrapper.styles.apply('_', {
            flex: 1,
            position: 'relative',
        });
        this.content.addChild(canvasWrapper);
        const canvas = new Canvas_1.Canvas();
        canvas.draggable = false;
        canvas.width = 1;
        canvas.height = 1;
        canvas.styles.apply('_', {
            position: 'absolute',
            left: '10px',
            right: '10px',
            userSelect: 'none',
        });
        canvasWrapper.addChild(canvas);
        this._colorPalette = new ColorPalette_1.ColorPalette(canvas.inner);
        this._colorPalette.value = this._colors[this._editing];
        new ResizeObserver(entries => entries.forEach(entry => {
            canvas.width = Math.max(1, entry.contentRect.width - 20);
            canvas.height = Math.max(1, entry.contentRect.height);
            this._colorPalette.update();
        })).observe(canvasWrapper.inner);
        const inputWrapper = new View_1.View('div');
        inputWrapper.styles.apply('_', {
            display: 'grid',
            padding: '0px 5px',
            gridTemplateColumns: 'repeat(4, 10px auto)',
            fontSize: 12,
            color: 'white',
            alignItems: 'center',
        });
        this.content.addChild(inputWrapper);
        ['r', 'g', 'b', 'a'].forEach(n => {
            this._inputs[n].onChange((s) => {
                const color = this._colorPalette.value.copy();
                color[n] = s.num;
                this._colorPalette.value = color;
            });
            inputWrapper.inner.append(n.toUpperCase() + ':');
            inputWrapper.addChild(this._inputs[n]);
        });
        this._colorPalette.onChanged = v => {
            var _a, _b, _c, _d;
            this._colors[this._editing] = v.copy();
            (_a = this._inputs.r) === null || _a === void 0 ? void 0 : _a.setNum(v.r);
            (_b = this._inputs.g) === null || _b === void 0 ? void 0 : _b.setNum(v.g);
            (_c = this._inputs.b) === null || _c === void 0 ? void 0 : _c.setNum(v.b);
            (_d = this._inputs.a) === null || _d === void 0 ? void 0 : _d.setNum(v.a);
            this._btnColors[this._editing].color = v;
            switch (this._editing) {
                case ColorKind.Line:
                    this.inner.dispatchEvent(new CustomEvent(ColorViewEventTypes.LineColorChange, { detail: v }));
                    break;
                case ColorKind.Fill:
                    this.inner.dispatchEvent(new CustomEvent(ColorViewEventTypes.FillColorChange, { detail: v }));
                    break;
            }
        };
        this.removeChild(this.footer);
    }
}
exports.default = ColorView;
ColorView.EventTypes = ColorViewEventTypes;
class ColorNumInput extends NumberInput_1.NumberInput {
    constructor() {
        super();
        this.max = 255;
        this.min = 0;
        this.styles.apply('_', {
            minWidth: 0,
            flex: 1,
            background: 'transparent',
            color: 'white',
            border: 'none',
            outline: 'none',
            borderRadius: 5,
            margin: '5px 5px 3px 5px',
            fontSize: 12
        });
    }
}

},{"./G/BaseView/Button":2,"./G/BaseView/Canvas":3,"./G/BaseView/NumberInput":5,"./G/BaseView/View":10,"./G/CompoundView/SubWin":17,"./G/Helper/ButtonGroup":25,"./colorPalette/Color":37,"./colorPalette/ColorPalette":38}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = exports.ButtonState = void 0;
const SizeType_1 = require("./SizeType");
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
        styles[this.hover ? 'addCls' : 'delCls']('g_button_hover');
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

},{"./SizeType":6,"./View":10}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
const View_1 = require("./View");
class Canvas extends View_1.View {
    set width(v) { this.inner.width = v; }
    get width() { return this.inner.width; }
    set height(v) { this.inner.height = v; }
    get height() { return this.inner.height; }
    constructor(ele) { ele ? super(ele) : super('canvas'); }
}
exports.Canvas = Canvas;

},{"./View":10}],4:[function(require,module,exports){
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

},{"./View":10}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberInput = void 0;
const TextInput_1 = require("./TextInput");
class NumberInput extends TextInput_1.TextInput {
    onChange(v) { this._onChange = v; }
    setNum(v) { this.num = v; }
    get num() { return Number(this.inner.value); }
    set num(v) { this.value = '' + v; }
    get max() { return this.inner.max === '' ? null : Number(this.inner.max); }
    set max(v) { this.inner.max = null === v ? '' : ('' + v); }
    get min() { return this.inner.min === '' ? null : Number(this.inner.min); }
    set min(v) { this.inner.min = null === v ? '' : ('' + v); }
    get value() { return this.inner.value; }
    set value(v) { this.inner.value = v; }
    constructor() {
        super();
        this.inner.type = 'number';
    }
}
exports.NumberInput = NumberInput;

},{"./TextInput":9}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeType = void 0;
var SizeType;
(function (SizeType) {
    SizeType["Small"] = "s";
    SizeType["Middle"] = "m";
    SizeType["Large"] = "l";
})(SizeType = exports.SizeType || (exports.SizeType = {}));

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoPxKeys = exports.CssDisplay = exports.CssCursor = exports.CssFlexDirection = exports.CssPosition = exports.CssObjectFit = void 0;
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

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Styles = void 0;
const StyleType_1 = require("./StyleType");
const utils_1 = require("../utils");
class Styles {
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

},{"../utils":31,"./StyleType":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInput = exports.InputStyleNames = void 0;
const View_1 = require("./View");
var InputStyleNames;
(function (InputStyleNames) {
    InputStyleNames["Normal"] = "normal";
    InputStyleNames["Focused"] = "focused";
    InputStyleNames["Hover"] = "hover";
    InputStyleNames["Disabled"] = "disabled";
})(InputStyleNames = exports.InputStyleNames || (exports.InputStyleNames = {}));
;
class TextInput extends View_1.View {
    onChange(v) { this._onChange = v; }
    get disabled() { return this.inner.disabled; }
    set disabled(v) { this.inner.disabled = v; }
    get value() { return this.inner.value; }
    set value(v) { this.inner.value = v; }
    focus() { this.inner.focus(); }
    blur() { this.inner.blur(); }
    constructor() {
        super('input');
        this.focusOb;
        this.hoverOb;
        this.styles
            .register(InputStyleNames.Focused)
            .register(InputStyleNames.Hover)
            .register(InputStyleNames.Disabled)
            .apply(InputStyleNames.Normal, { transition: 'all 200ms' });
        this.inner.type = 'text';
        this.inner.addEventListener('input', () => { var _a; return (_a = this._onChange) === null || _a === void 0 ? void 0 : _a.call(this, this); });
        this.inner.addEventListener('keydown', e => e.key === 'Enter' && this.blur());
        const ob = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    this.updateStyle();
                }
            });
        });
        ob.observe(this.inner, { attributes: true });
    }
    updateStyle() {
        const styles = this.styles;
        if (this.disabled) {
            styles.add(InputStyleNames.Disabled);
            styles.del(InputStyleNames.Focused, InputStyleNames.Hover);
        }
        else {
            if (this.focused) {
                styles.add(InputStyleNames.Focused);
            }
            else {
                styles.del(InputStyleNames.Focused);
            }
            if (this.hover) {
                styles.add(InputStyleNames.Hover);
            }
            else {
                styles.del(InputStyleNames.Hover);
            }
        }
        styles.refresh();
    }
    onHover(hover) {
        this.updateStyle();
    }
    onFocus(focused) {
        this.updateStyle();
    }
}
exports.TextInput = TextInput;

},{"./View":10}],10:[function(require,module,exports){
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

},{"../Events/EventType":24,"../Observer/FocusOb":29,"../Observer/HoverOb":30,"./Styles":8}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockPosition = void 0;
var DockPosition;
(function (DockPosition) {
    DockPosition["Hide"] = "hide";
    DockPosition["ToLeft"] = "toLeft";
    DockPosition["ToRight"] = "toRight";
    DockPosition["ToTop"] = "toTop";
    DockPosition["ToBottom"] = "toBottom";
    DockPosition["ToCenter"] = "toCenter";
})(DockPosition = exports.DockPosition || (exports.DockPosition = {}));

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const View_1 = require("../BaseView/View");
const HoverOb_1 = require("../Observer/HoverOb");
const DockPosition_1 = require("./DockPosition");
class DockResultPreview extends View_1.View {
    constructor() {
        super('div');
        this._indicatorPositionMap = new Map();
        this._hovering = null;
        this._onHover = (hover, e) => {
            var _a;
            const view = View_1.View.try(e.target, View_1.View);
            if (hover) {
                this._hovering = view;
            }
            else if (view === this._hovering) {
                this._hovering = null;
            }
            else {
                return;
            }
            const position = (_a = this._indicatorPositionMap.get(this._hovering)) !== null && _a !== void 0 ? _a : DockPosition_1.DockPosition.Hide;
            this[position]();
        };
        this.styles.addCls('g_dock_result_preview').apply('hidden', { opacity: 0 });
    }
    addIndicator(position, view) {
        this._indicatorPositionMap.set(view, position);
        new HoverOb_1.HoverOb(view.inner).setCallback(this._onHover);
        return this;
    }
    hide() {
        this.styles.apply('hidden', { opacity: 0 });
    }
    toLeft() {
        this.styles.del('hidden').apply('show', { opacity: 1, right: '75%' });
    }
    toRight() {
        this.styles.del('hidden').apply('show', { opacity: 1, left: '75%' });
    }
    toTop() {
        this.styles.del('hidden').apply('show', { opacity: 1, bottom: '75%' });
    }
    toBottom() {
        this.styles.del('hidden').apply('show', { opacity: 1, top: '75%' });
    }
    toCenter() {
        this.styles.del('hidden').apply('show', { opacity: 1 });
    }
}
exports.default = DockResultPreview;

},{"../BaseView/View":10,"../Observer/HoverOb":30,"./DockPosition":11}],13:[function(require,module,exports){
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

},{"../BaseView/Button":2,"../BaseView/Image":4,"../BaseView/StyleType":7}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = exports.MenuEventType = exports.MenuItemView = void 0;
const View_1 = require("../BaseView/View");
const HoverOb_1 = require("../Observer/HoverOb");
const utils_1 = require("../utils");
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
            this._submenu = new Menu(this._menu.container, info);
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
var MenuEventType;
(function (MenuEventType) {
    MenuEventType["ItemClick"] = "onItemClick";
})(MenuEventType = exports.MenuEventType || (exports.MenuEventType = {}));
class GlobalPointerDown extends View_1.View {
    constructor() {
        super('div');
        window.addEventListener('pointerdown', e => {
            if ((0, utils_1.findParent)(e.target, ele => !!View_1.View.try(ele, Menu))) {
                return;
            }
            this.inner.dispatchEvent(new PointerEvent('fired'));
        }, true);
    }
}
const globalDown = new GlobalPointerDown();
class Menu extends View_1.View {
    get container() { return this._container; }
    constructor(container, inits) {
        var _a, _b;
        super('div');
        this._items = [];
        this._zIndex = 9999;
        this._container = container;
        this._zIndex = (_a = inits === null || inits === void 0 ? void 0 : inits.zIndex) !== null && _a !== void 0 ? _a : this._zIndex;
        this.styles.setCls('g_menu');
        this.setup((_b = inits === null || inits === void 0 ? void 0 : inits.items) !== null && _b !== void 0 ? _b : []);
        globalDown.addEventListener('fired', () => this.hide());
        window.addEventListener('blur', () => this.hide());
    }
    addEventListener(arg0, arg1, arg2) {
        return super.addEventListener(arg0, arg1, arg2);
    }
    removeEventListener(arg0, arg1, arg2) {
        return super.removeEventListener(arg0, arg1, arg2);
    }
    item(key) {
        var _a;
        return (_a = this._items.find(v => v.info.key === key)) === null || _a === void 0 ? void 0 : _a.info;
    }
    setup(items) {
        this._items.forEach(item => {
            var _a, _b;
            item.removeEventListener('click', this._onitemclick);
            (_a = item.submenu) === null || _a === void 0 ? void 0 : _a.removeEventListener(MenuEventType.ItemClick, this._onsubmenuitemclick);
            (_b = item.submenu) === null || _b === void 0 ? void 0 : _b.removeSelf();
            this.removeChild(item);
        });
        this._items = items.map(info => {
            var _a;
            this._onitemclick = () => {
                this.inner.dispatchEvent(new CustomEvent(MenuEventType.ItemClick, { detail: info }));
                this.hide();
            };
            this._onsubmenuitemclick = (e) => {
                this.inner.dispatchEvent(new CustomEvent(MenuEventType.ItemClick, { detail: e.detail }));
                this.hide();
            };
            const view = new MenuItemView(this, Object.assign(Object.assign({}, info), { zIndex: this._zIndex + 1 }));
            this.addChild(view);
            view.addEventListener('click', this._onitemclick);
            (_a = view.submenu) === null || _a === void 0 ? void 0 : _a.addEventListener(MenuEventType.ItemClick, this._onsubmenuitemclick);
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
Menu.EventType = MenuEventType;

},{"../BaseView/View":10,"../Observer/HoverOb":30,"../utils":31}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubwinFooter = void 0;
const View_1 = require("../../BaseView/View");
class SubwinFooter extends View_1.View {
    constructor() {
        super('div');
        this.styles.addCls('g_subwin_footer');
    }
}
exports.SubwinFooter = SubwinFooter;

},{"../../BaseView/View":10}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubwinHeader = void 0;
const SizeType_1 = require("../../BaseView/SizeType");
const View_1 = require("../../BaseView/View");
const IconButton_1 = require("../IconButton");
class SubwinHeader extends View_1.View {
    get btnClose() { return this._btnClose; }
    get iconView() { return this._iconView; }
    get titleView() { return this._titleView; }
    get title() { return this._titleView.inner.innerHTML; }
    set title(v) { this._titleView.inner.innerHTML = v; }
    constructor() {
        super('div');
        this.styles.addCls('g_subwin_header');
        this._iconView = new IconButton_1.IconButton().init({ size: SizeType_1.SizeType.Small }).styles.addCls('g_subwin_icon').view;
        this._iconView.icon.addEventListener('load', e => this._iconView.styles.apply('', { display: undefined }));
        this._iconView.icon.addEventListener('error', e => this._iconView.styles.apply('', { display: 'none' }));
        this.addChild(this._iconView);
        this._titleView = new View_1.View('div').styles.addCls('g_subwin_title').view;
        this.addChild(this._titleView);
        this._btnClose = new IconButton_1.IconButton().init({ src: './ic_btn_close.svg', size: SizeType_1.SizeType.Small }).styles.addCls('g_subwin_btn_close').view;
        this.addChild(this._btnClose);
    }
}
exports.SubwinHeader = SubwinHeader;

},{"../../BaseView/SizeType":6,"../../BaseView/View":10,"../IconButton":13}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subwin = exports.StyleNames = void 0;
const Footer_1 = require("./Footer");
const Header_1 = require("./Header");
const View_1 = require("../../BaseView/View");
const ViewDragger_1 = require("../../Helper/ViewDragger");
var StyleNames;
(function (StyleNames) {
    StyleNames["Normal"] = "normal";
    StyleNames["Docked"] = "docked";
})(StyleNames = exports.StyleNames || (exports.StyleNames = {}));
class Subwin extends View_1.View {
    get dragger() { return this._dragger; }
    workspace() { return this._workspace; }
    setWorkspace(v) { this._workspace = v; return this; }
    get header() { return this._header; }
    ;
    get footer() { return this._footer; }
    ;
    get content() { return this._content; }
    set content(v) {
        if (this._content) {
            this.removeChild(this._content);
        }
        this._content = v;
        if (v) {
            this.insertBefore(this._footer, v);
        }
    }
    raise() {
        this.styles.delCls('g_subwin_lower').addCls('g_subwin_raised');
    }
    lower() {
        this.styles.delCls('g_subwin_raised').addCls('g_subwin_lower');
    }
    constructor() {
        super('div');
        this._header = new Header_1.SubwinHeader();
        this._footer = new Footer_1.SubwinFooter();
        this._dragWhenDocked = (x, y, prevX, prevY) => {
            var _a;
            if (Math.abs(x - prevX) + Math.abs(y - prevY) > 20) {
                const w0 = this.inner.offsetWidth;
                (_a = this.workspace()) === null || _a === void 0 ? void 0 : _a.undock(this);
                const w1 = this.inner.offsetWidth;
                this._dragger.offsetX = (w1 - 60) * this._dragger.offsetX / w0;
            }
        };
        this.styles.addCls('g_subwin').apply(StyleNames.Normal, {});
        this.addChild(this._header, this._footer);
        this._dragger = new ViewDragger_1.ViewDragger({
            responser: this,
            handles: [
                this.header.titleView,
                this.header.iconView
            ],
            handleMove: this.move.bind(this),
        });
        this._resizeOb = new ResizeObserver(() => {
            const { width, height } = this.inner.getBoundingClientRect();
            this.resize(width, height);
        });
        this._resizeOb.observe(this.inner);
        this.header.btnClose.addEventListener('click', e => this.styles.apply('hidden', { display: 'none' }));
    }
    dockableView() {
        return this;
    }
    move(x, y) {
        this.styles.edit(StyleNames.Normal, v => (Object.assign(Object.assign({}, v), { left: x, top: y }))).refresh();
    }
    resize(width, height) {
        this.styles.edit(StyleNames.Normal, v => (Object.assign(Object.assign({}, v), { width, height }))).refresh();
    }
    onDocked() {
        this._resizeOb.unobserve(this.inner);
        this.styles
            .addCls('g_subwin_docked')
            .delCls('g_subwin_raised', 'g_subwin_lower')
            .del(StyleNames.Normal)
            .add(StyleNames.Docked)
            .refresh();
        this.dragger.handleMove = this._dragWhenDocked.bind(this);
        this.header.btnClose.styles.addCls('g_gone');
    }
    onUndocked() {
        this._resizeOb.observe(this.inner);
        this.styles
            .delCls('g_subwin_docked')
            .add(StyleNames.Normal)
            .del(StyleNames.Docked)
            .refresh();
        this.dragger.handleMove = this.move.bind(this);
        this.header.btnClose.styles.delCls('g_gone');
    }
    resizeDocked(width, height) {
        this.styles.apply(StyleNames.Docked, v => (Object.assign(Object.assign({}, v), { width, height })));
    }
    addEventListener(arg0, arg1, arg2) {
        return super.addEventListener(arg0, arg1, arg2);
    }
    removeEventListener(arg0, arg1, arg2) {
        return super.removeEventListener(arg0, arg1, arg2);
    }
}
exports.Subwin = Subwin;
Subwin.StyleNames = StyleNames;

},{"../../BaseView/View":10,"../../Helper/ViewDragger":28,"./Footer":15,"./Header":16}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockView = exports.DockViewStyles = exports.StyleName = void 0;
const View_1 = require("../../BaseView/View");
const EventType_1 = require("../../Events/EventType");
const DockableDirection_1 = require("./DockableDirection");
const DockableResizer_1 = require("./DockableResizer");
var StyleName;
(function (StyleName) {
    StyleName["AsRoot"] = "asroot";
    StyleName["Normal"] = "normal";
    StyleName["MaxDocked"] = "MaxDocked";
    StyleName["Docked"] = "MinDocked ";
})(StyleName = exports.StyleName || (exports.StyleName = {}));
exports.DockViewStyles = {
    [StyleName.AsRoot]: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },
    [StyleName.Normal]: {
        pointerEvents: 'none',
        alignItems: 'stretch',
    },
    [StyleName.Docked]: {
        position: 'relative',
        width: 'unset',
        height: 'unset',
        alignSelf: 'stretch',
    },
    [StyleName.MaxDocked]: {
        flex: 1
    }
};
const Tag = '[DockView]';
class DockView extends View_1.View {
    get direction() { return this._direction; }
    constructor(direction = DockableDirection_1.DockableDirection.None) {
        super('div');
        this._direction = DockableDirection_1.DockableDirection.None;
        this._direction = direction;
        if (direction === DockableDirection_1.DockableDirection.H) {
            this.styles.apply('', { display: "flex", flexDirection: 'row' });
        }
        else if (direction === DockableDirection_1.DockableDirection.V) {
            this.styles.apply('', { display: "flex", flexDirection: 'column' });
        }
        this.styles.addCls('DockView');
        this.styles
            .registers(exports.DockViewStyles)
            .apply(StyleName.Normal);
    }
    workspace() { return this._workspace; }
    setWorkspace(v) { this._workspace = v; return this; }
    setContent(view) { super.addChild(view); }
    push(dockables) {
        if (!dockables.length) {
            return this;
        }
        const children = dockables.map(child => child.dockableView());
        const beginAnchor = this.lastChild;
        for (let i = 1; i < children.length; i += 2) {
            children.splice(i, 0, new DockableResizer_1.DockableResizer(this._direction));
        }
        if (beginAnchor) {
            children.unshift(new DockableResizer_1.DockableResizer(this._direction));
        }
        super.addChild(...children);
        dockables.forEach(v => this._dockableDocked(v));
        return this;
    }
    unshift(dockables) {
        if (!dockables.length) {
            return this;
        }
        const children = dockables.map(child => child.dockableView());
        const endAnchor = this.firstChild;
        for (let i = 1; i < children.length; i += 2) {
            children.splice(i, 0, new DockableResizer_1.DockableResizer(this._direction));
        }
        if (endAnchor) {
            children.push(new DockableResizer_1.DockableResizer(this._direction));
        }
        super.insertBefore(0, ...children);
        dockables.forEach(v => this._dockableDocked(v));
        return this;
    }
    dockBefore(anchor, dockables) {
        if (!dockables.length) {
            return this;
        }
        const children = dockables.map(child => child.dockableView());
        const endAnchor = anchor.dockableView();
        for (let i = 1; i < children.length; i += 2) {
            children.splice(i, 0, new DockableResizer_1.DockableResizer(this._direction));
        }
        if (endAnchor) {
            children.push(new DockableResizer_1.DockableResizer(this._direction));
        }
        super.insertBefore(endAnchor, ...children);
        dockables.forEach(v => this._dockableDocked(v));
        return this;
    }
    dockAfter(anchor, dockables) {
        if (!dockables.length) {
            return this;
        }
        const children = dockables.map(child => child.dockableView());
        const beginAnchor = anchor.dockableView();
        for (let i = 1; i < children.length; i += 2) {
            const resizer = new DockableResizer_1.DockableResizer(this._direction);
            children.splice(i, 0, resizer);
        }
        if (beginAnchor) {
            children.unshift(new DockableResizer_1.DockableResizer(this._direction));
        }
        super.insertAfter(beginAnchor, ...children);
        dockables.forEach(v => this._dockableDocked(v));
        return this;
    }
    replace(anchor, dockable) {
        const newChild = dockable.dockableView();
        const oldChild = anchor.dockableView();
        super.replaceChild(newChild, oldChild);
        this._dockableDocked(dockable);
        this._dockableUndocked(anchor);
        return this;
    }
    remove(dockable) {
        const view = dockable.dockableView();
        const nextResizer = view.nextSibling;
        const prevResizer = view.prevSibling;
        const children = [dockable.dockableView()];
        if (prevResizer) {
            children.unshift(prevResizer);
        }
        else if (nextResizer) {
            children.push(nextResizer);
        }
        this._dockableUndocked(dockable);
        return super.removeChild(...children);
    }
    dockableView() { return this; }
    onDocked() {
        this.styles.apply(StyleName.Docked);
    }
    onUndocked() {
        this.styles.forgo(StyleName.MaxDocked, StyleName.Docked);
    }
    asRoot(v) {
        this.styles[v ? 'apply' : 'forgo'](StyleName.AsRoot);
        return this;
    }
    resizeDocked(width, height) {
        this.styles.apply(StyleName.Docked, v => (Object.assign(Object.assign({}, v), { width, height })));
    }
    addEventListener(arg0, arg1, arg2) {
        return super.addEventListener(arg0, arg1, arg2);
    }
    removeEventListener(arg0, arg1, arg2) {
        return super.removeEventListener(arg0, arg1, arg2);
    }
    _dockableDocked(v) {
        v.onDocked();
        v.dispatchEvent(new Event(EventType_1.DockableEventType.Docked));
    }
    _dockableUndocked(v) {
        v.onUndocked();
        v.dispatchEvent(new Event(EventType_1.DockableEventType.Undocked));
    }
}
exports.DockView = DockView;
DockView.StyleName = StyleName;

},{"../../BaseView/View":10,"../../Events/EventType":24,"./DockableDirection":19,"./DockableResizer":20}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockableDirection = void 0;
var DockableDirection;
(function (DockableDirection) {
    DockableDirection["None"] = "";
    DockableDirection["H"] = "h";
    DockableDirection["V"] = "v";
})(DockableDirection = exports.DockableDirection || (exports.DockableDirection = {}));

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockableResizer = void 0;
const View_1 = require("../../BaseView/View");
const ViewDragger_1 = require("../../Helper/ViewDragger");
const HoverOb_1 = require("../../Observer/HoverOb");
const SubWin_1 = require("../SubWin");
const DockView_1 = require("./DockView");
const DockableDirection_1 = require("./DockableDirection");
class DockableResizer extends View_1.View {
    constructor(direction) {
        super('div');
        const w = direction === DockableDirection_1.DockableDirection.H ? 1 : undefined;
        const h = direction === DockableDirection_1.DockableDirection.V ? 1 : undefined;
        const hOffset = direction === DockableDirection_1.DockableDirection.H ? -3 : 0;
        const vOffset = direction === DockableDirection_1.DockableDirection.V ? -3 : 0;
        this.styles
            .addCls('g_dockable_resizer')
            .apply('', {
            width: w,
            maxWidth: w,
            minWidth: w,
            height: h,
            maxHeight: h,
            minHeight: h,
        });
        const handle = new View_1.View('div');
        handle.styles.addCls('handle').apply('', {
            left: hOffset,
            right: hOffset,
            top: vOffset,
            bottom: vOffset,
            cursor: direction === DockableDirection_1.DockableDirection.H ? 'col-resize' : 'row-resize',
        });
        new HoverOb_1.HoverOb(handle.inner).setCallback(hover => handle.styles[hover ? 'addCls' : 'delCls']('handle_hover'));
        this.addChild(handle);
        const handleDown = () => {
            prevView = this.prevSibling;
            nextView = this.nextSibling;
            prevViewRect = prevView === null || prevView === void 0 ? void 0 : prevView.inner.getBoundingClientRect();
            nextViewRect = nextView === null || nextView === void 0 ? void 0 : nextView.inner.getBoundingClientRect();
        };
        const handleMove = (x, y, oldX, oldY) => {
            if ((prevView instanceof SubWin_1.Subwin) || prevView instanceof DockView_1.DockView && prevView.direction !== DockableDirection_1.DockableDirection.None) {
                prevView.resizeDocked(direction === DockableDirection_1.DockableDirection.H ? (-3 + prevViewRect.width - oldX + x) : undefined, direction === DockableDirection_1.DockableDirection.V ? (-3 + prevViewRect.height - oldY + y) : undefined);
            }
            if (nextView instanceof SubWin_1.Subwin || nextView instanceof DockView_1.DockView && nextView.direction !== DockableDirection_1.DockableDirection.None) {
                nextView.resizeDocked(direction === DockableDirection_1.DockableDirection.H ? (3 + nextViewRect.width + oldX - x) : undefined, direction === DockableDirection_1.DockableDirection.V ? (3 + nextViewRect.height + oldY - y) : undefined);
            }
        };
        let prevView;
        let nextView;
        let prevViewRect;
        let nextViewRect;
        new ViewDragger_1.ViewDragger({
            handles: [handle],
            responser: this,
            handleDown,
            handleMove,
        });
    }
}
exports.DockableResizer = DockableResizer;

},{"../../BaseView/View":10,"../../Helper/ViewDragger":28,"../../Observer/HoverOb":30,"../SubWin":17,"./DockView":18,"./DockableDirection":19}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicatorImage = exports.srcs = void 0;
const Image_1 = require("../../BaseView/Image");
const DockPosition_1 = require("../DockPosition");
exports.srcs = {
    [DockPosition_1.DockPosition.Hide]: "",
    [DockPosition_1.DockPosition.ToLeft]: "./ic_dock_to_left.svg",
    [DockPosition_1.DockPosition.ToRight]: "./ic_dock_to_right.svg",
    [DockPosition_1.DockPosition.ToTop]: "./ic_dock_to_top.svg",
    [DockPosition_1.DockPosition.ToBottom]: "./ic_dock_to_bottom.svg",
    [DockPosition_1.DockPosition.ToCenter]: "./ic_dock_to_center.svg"
};
class IndicatorImage extends Image_1.Image {
    constructor(inits) {
        super({ src: exports.srcs[inits.type] });
        this.styles
            .addCls('g_indicator_image')
            .apply('', Object.assign({}, inits.style));
        this.draggable = false;
    }
    onHover(hover) {
        this.styles[hover ? 'addCls' : 'delCls']('g_indicator_image_hover');
    }
    onRemoved() {
        this.styles.delCls('g_indicator_image_hover');
    }
    fakeIn() {
        this.styles.addCls('g_indicator_image_appear');
        this.hoverOb.disabled = false;
    }
    fakeOut() {
        this.styles.delCls('g_indicator_image_appear');
        this.hoverOb.disabled = true;
        this.onHover(false);
    }
}
exports.IndicatorImage = IndicatorImage;

},{"../../BaseView/Image":4,"../DockPosition":11}],22:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicatorView = void 0;
const View_1 = require("../../BaseView/View");
const DockPosition_1 = require("../DockPosition");
const DockResultPreview_1 = __importDefault(require("../DockResultPreview"));
const IndicatorImage_1 = require("./IndicatorImage");
const Tag = '[IndicatorView]';
class IndicatorView extends View_1.View {
    constructor() {
        super('div');
        this._left = new IndicatorImage_1.IndicatorImage({ type: DockPosition_1.DockPosition.ToLeft }).styles.apply('override', {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        }).view;
        this._top = new IndicatorImage_1.IndicatorImage({ type: DockPosition_1.DockPosition.ToTop }).styles.apply('override', {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        }).view;
        this._right = new IndicatorImage_1.IndicatorImage({ type: DockPosition_1.DockPosition.ToRight }).styles.apply('override', {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
        }).view;
        this._bottom = new IndicatorImage_1.IndicatorImage({ type: DockPosition_1.DockPosition.ToBottom }).styles.apply('override', {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
        }).view;
        this._center = new IndicatorImage_1.IndicatorImage({ type: DockPosition_1.DockPosition.ToCenter }).styles.apply('override', {
            borderRadius: 0,
        }).view;
        this._dockResultPreview = new DockResultPreview_1.default()
            .addIndicator(DockPosition_1.DockPosition.ToLeft, this._left)
            .addIndicator(DockPosition_1.DockPosition.ToRight, this._right)
            .addIndicator(DockPosition_1.DockPosition.ToTop, this._top)
            .addIndicator(DockPosition_1.DockPosition.ToBottom, this._bottom)
            .addIndicator(DockPosition_1.DockPosition.ToCenter, this._center);
        this.styles.addCls('g_indicator_view');
        this.styles.register('appear', {
            opacity: 1,
            pointerEvents: 'all'
        });
        const content = new View_1.View('div');
        content.styles.addCls('content');
        content.addChild(new View_1.View('div'), this._top, new View_1.View('div'), this._left, this._center, this._right, new View_1.View('div'), this._bottom, new View_1.View('div'));
        this.addChild(this._dockResultPreview);
        this.addChild(content);
        this._resizeOb = new ResizeObserver(entries => {
            entries.forEach(e => {
                var _a;
                switch (e.target) {
                    case (_a = this._following) === null || _a === void 0 ? void 0 : _a.inner: {
                        const { left, top, width, height } = e.target.getBoundingClientRect();
                        this.styles.apply('normal', v => (Object.assign(Object.assign({}, v), { left, top, width, height })));
                        break;
                    }
                }
            });
        });
    }
    fakeIn(v) {
        this._following = v;
        this._resizeOb.observe(this._following.inner);
        const { left, top, width, height } = v.inner.getBoundingClientRect();
        this.styles.apply('normal', v => (Object.assign(Object.assign({}, v), { left, top, width, height })));
        this.styles.addCls('g_indicator_view_appear');
        this.hoverOb.disabled = false;
        this._left.fakeIn();
        this._right.fakeIn();
        this._top.fakeIn();
        this._bottom.fakeIn();
        this._center.fakeIn();
    }
    fakeOut() {
        if (this._following) {
            this._resizeOb.unobserve(this._following.inner);
            delete this._following;
        }
        this.styles.delCls('g_indicator_view_appear');
        this.hoverOb.disabled = true;
        this.onHover(false);
        this._left.fakeOut();
        this._right.fakeOut();
        this._top.fakeOut();
        this._bottom.fakeOut();
        this._center.fakeOut();
    }
}
exports.IndicatorView = IndicatorView;

},{"../../BaseView/View":10,"../DockPosition":11,"../DockResultPreview":12,"./IndicatorImage":21}],23:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceView = void 0;
const View_1 = require("../../BaseView/View");
const EventType_1 = require("../../Events/EventType");
const utils_1 = require("../../utils");
const SubWin_1 = require("../SubWin");
const DockView_1 = require("./DockView");
const DockableDirection_1 = require("./DockableDirection");
const IndicatorImage_1 = require("./IndicatorImage");
const List_1 = require("../../Helper/List");
const IndicatorView_1 = require("./IndicatorView");
const DockResultPreview_1 = __importDefault(require("../DockResultPreview"));
const DockPosition_1 = require("../DockPosition");
class WorkspaceView extends View_1.View {
    _updateUndockedWinsStyle() {
        this._undockedWins.forEach((win, idx, arr) => {
            win.styles.apply('free_in_workspace', {
                zIndex: `${this._zIndex + arr.length - idx}`,
                maxWidth: '100%',
                maxHeight: '100%'
            });
            idx > 0 ? win.lower() : win.raise();
            ++idx;
        });
    }
    get rootDockView() { return this._rootDockView; }
    get deepestDockView() { return this._deepestDockView; }
    ;
    constructor(arg0, inits) {
        var _a;
        super(arg0);
        this._zIndex = 0;
        this._pointerdowns = new Map();
        this._draggingSubwin = null;
        this._undockedWins = new List_1.List();
        this._dockedWins = new List_1.List();
        this._dockLeftIndicator = new IndicatorImage_1.IndicatorImage({
            type: DockPosition_1.DockPosition.ToLeft, style: {
                position: 'absolute', left: 16, top: 'calc(50% - 24px)'
            }
        });
        this._dockTopIndicator = new IndicatorImage_1.IndicatorImage({
            type: DockPosition_1.DockPosition.ToTop, style: {
                position: 'absolute', left: 'calc(50% - 24px)', top: 16
            }
        });
        this._dockRightIndicator = new IndicatorImage_1.IndicatorImage({
            type: DockPosition_1.DockPosition.ToRight, style: {
                position: 'absolute', right: 16, top: 'calc(50% - 24px)'
            }
        });
        this._dockBottomIndicator = new IndicatorImage_1.IndicatorImage({
            type: DockPosition_1.DockPosition.ToBottom, style: {
                position: 'absolute', left: 'calc(50% - 24px)', bottom: 16
            }
        });
        this._dockResultPreview = new DockResultPreview_1.default()
            .addIndicator(DockPosition_1.DockPosition.ToLeft, this._dockLeftIndicator)
            .addIndicator(DockPosition_1.DockPosition.ToRight, this._dockRightIndicator)
            .addIndicator(DockPosition_1.DockPosition.ToTop, this._dockTopIndicator)
            .addIndicator(DockPosition_1.DockPosition.ToBottom, this._dockBottomIndicator);
        this._dockIndicator = new IndicatorView_1.IndicatorView();
        this._rootDockView = new DockView_1.DockView().asRoot(true).setWorkspace(this);
        this._deepestDockView = this._rootDockView.addEventListener(EventType_1.DockableEventType.Docked, e => {
            let ele = View_1.View.try(e.target, View_1.View);
            while (ele) {
                if (ele instanceof DockView_1.DockView) {
                    ele.styles.apply(DockView_1.DockView.StyleName.MaxDocked);
                }
                ele = ele.parent;
            }
        });
        this._onSubwinDragStart = (e) => {
            this._draggingSubwin = View_1.View.try(e.target, SubWin_1.Subwin);
            if (!this._draggingSubwin) {
                return;
            }
            this._dockLeftIndicator.fakeIn();
            this._dockRightIndicator.fakeIn();
            this._dockTopIndicator.fakeIn();
            this._dockBottomIndicator.fakeIn();
        };
        this._onSubwinDragging = (e) => {
            var _a;
            const subwin = View_1.View.try(e.target, SubWin_1.Subwin);
            if (!subwin) {
                return;
            }
            const { pageX, pageY, dragger: { offsetX, offsetY } } = e.detail;
            const mouseX = pageX;
            const mouseY = pageY;
            let draggingIn = (_a = this._undockedWins.findR(v => {
                const { left, right, top, bottom } = v.inner.getBoundingClientRect();
                return v != subwin && mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom;
            })) !== null && _a !== void 0 ? _a : this._dockedWins.findR(v => {
                const { left, right, top, bottom } = v.inner.getBoundingClientRect();
                return v != subwin && mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom;
            });
            if (!draggingIn && this._deepestDockView !== this._rootDockView) {
                const { left, right, top, bottom } = this._deepestDockView.inner.getBoundingClientRect();
                if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
                    draggingIn = this._deepestDockView;
                }
            }
            if (this._draggingIn !== draggingIn) {
                this._draggingIn = draggingIn;
                if (draggingIn) {
                    this._dockIndicator.fakeIn(draggingIn);
                }
                else {
                    this._dockIndicator.fakeOut();
                }
            }
        };
        this._onSubwinDragEnd = (e) => {
            const subwin = View_1.View.try(e.target, SubWin_1.Subwin);
            if (!subwin) {
                return;
            }
            if (this._dockBottomIndicator.hover) {
                this.dockToRoot(subwin, DockableDirection_1.DockableDirection.V, 'end');
            }
            else if (this._dockTopIndicator.hover) {
                this.dockToRoot(subwin, DockableDirection_1.DockableDirection.V, 'start');
            }
            else if (this._dockLeftIndicator.hover) {
                this.dockToRoot(subwin, DockableDirection_1.DockableDirection.H, 'start');
            }
            else if (this._dockRightIndicator.hover) {
                this.dockToRoot(subwin, DockableDirection_1.DockableDirection.H, 'end');
            }
            else if (this._dockIndicator._bottom.hover) {
                this.dockAround(subwin, this._draggingIn, DockableDirection_1.DockableDirection.V, 'end');
            }
            else if (this._dockIndicator._top.hover) {
                this.dockAround(subwin, this._draggingIn, DockableDirection_1.DockableDirection.V, 'start');
            }
            else if (this._dockIndicator._left.hover) {
                this.dockAround(subwin, this._draggingIn, DockableDirection_1.DockableDirection.H, 'start');
            }
            else if (this._dockIndicator._right.hover) {
                this.dockAround(subwin, this._draggingIn, DockableDirection_1.DockableDirection.H, 'end');
            }
            else {
                const rect = (0, utils_1.getValue)(this._rect);
                if (!rect) {
                    return;
                }
                this.clampSubwin(subwin, rect);
            }
            this._dockLeftIndicator.fakeOut();
            this._dockRightIndicator.fakeOut();
            this._dockTopIndicator.fakeOut();
            this._dockBottomIndicator.fakeOut();
            this._dockIndicator.fakeOut();
            this._draggingSubwin = null;
            this._draggingIn = undefined;
        };
        this.styles.addCls('workspaceView');
        this._rect = inits.rect;
        this._zIndex = (_a = inits === null || inits === void 0 ? void 0 : inits.zIndex) !== null && _a !== void 0 ? _a : this._zIndex;
        this.addChild(this._rootDockView);
        this.addChild(this._dockResultPreview);
        this.addChild(this._dockLeftIndicator);
        this.addChild(this._dockRightIndicator);
        this.addChild(this._dockTopIndicator);
        this.addChild(this._dockBottomIndicator);
        this.addChild(this._dockIndicator);
        (inits === null || inits === void 0 ? void 0 : inits.wins) && this.addChild(...inits.wins);
    }
    dockToRoot(target, direction, pos) {
        const way = pos === 'start' ? 'unshift' : 'push';
        if (direction === this._rootDockView.direction) {
            this._rootDockView[way]([target]);
        }
        else {
            const temp = this._rootDockView.asRoot(false);
            this._rootDockView = new DockView_1.DockView(direction).asRoot(true).setWorkspace(this);
            this._rootDockView[way](pos === 'start' ? [target, temp] : [temp, target]);
            this.addChild(this._rootDockView);
        }
        (target instanceof SubWin_1.Subwin) && this._dockedWins.insert(0, target);
        (target instanceof SubWin_1.Subwin) && target.styles.forgo('free_in_workspace');
        this._updateUndockedWinsStyle();
    }
    dockAround(target, anchor, direction, pos) {
        // if (anchor !== this._deepestDockView) {
        //   console.warn('[WorkspaceView] dockAround() failed, Not support dock around to this anchor yet, anchor:', anchor);
        //   return;
        // }
        const { parent } = anchor.dockableView();
        if (!(parent instanceof DockView_1.DockView)) {
            console.warn('[WorkspaceView] dockAround() failed, only support dock into DockView, but got:', parent);
            return;
        }
        if (parent.direction === direction) {
            if (pos === 'start') {
                parent.dockBefore(anchor, [target]);
            }
            else {
                parent.dockAfter(anchor, [target]);
            }
        }
        else {
            const dockView = new DockView_1.DockView(direction).setWorkspace(this);
            parent.replace(anchor, dockView);
            if (pos === 'start') {
                dockView.push([target, anchor]);
            }
            else {
                dockView.push([anchor, target]);
            }
        }
        (target instanceof SubWin_1.Subwin) && this._dockedWins.insert(0, target);
        (target instanceof SubWin_1.Subwin) && target.styles.forgo('free_in_workspace');
        this._updateUndockedWinsStyle();
    }
    undock(target) {
        var _a;
        const view = target.dockableView();
        if (!(view instanceof SubWin_1.Subwin)) {
            console.warn('[Workspace] only support undock SubWin, but got:', view);
            return this;
        }
        const parent = view.parent;
        if (!(parent instanceof DockView_1.DockView)) {
            console.warn('[Workspace] only support undock SubWin from dockView, trying to undock', view, 'from', parent);
            return this;
        }
        parent.remove(view);
        this.addChild(target.dockableView());
        if (parent.children.length <= 1) {
            const child = parent.children[0];
            (_a = parent.parent) === null || _a === void 0 ? void 0 : _a.replaceChild(child, parent);
            if (parent === this._rootDockView) {
                this._rootDockView = child;
                this._rootDockView.asRoot(true);
            }
        }
        this._updateUndockedWinsStyle();
        return this;
    }
    clampAllSubwin() {
        const rect = (0, utils_1.getValue)(this._rect);
        if (!rect) {
            return;
        }
        this.children.forEach(v => (v instanceof SubWin_1.Subwin) && this.clampSubwin(v, rect));
    }
    clampSubwin(subwin, rect) {
        let { offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h, } = subwin.inner;
        if (x + w > rect.x + rect.w) {
            x = rect.x + rect.w - w;
        }
        if (y + h > rect.y + rect.h) {
            y = rect.y + rect.h - h;
        }
        if (y < rect.y) {
            y = rect.y;
        }
        if (x < rect.x) {
            x = rect.x;
        }
        subwin.move(x, y);
    }
    addChild(...children) {
        super.addChild(...children);
        this._updateUndockedWinsStyle();
        return this;
    }
    insertBefore(anchorOrIdx, ...children) {
        super.insertBefore(anchorOrIdx, ...children);
        this._updateUndockedWinsStyle();
        return this;
    }
    removeChild(...children) {
        super.removeChild(...children);
        this._updateUndockedWinsStyle();
        return this;
    }
    _handleAddedChildren(children) {
        // console.log('[Workspace]_handleAddedChildren', children)
        children.forEach(v => {
            if (!(v instanceof SubWin_1.Subwin)) {
                return;
            }
            v.setWorkspace(this);
            v.addEventListener(EventType_1.EventType.ViewDragStart, this._onSubwinDragStart);
            v.addEventListener(EventType_1.EventType.ViewDragging, this._onSubwinDragging);
            v.addEventListener(EventType_1.EventType.ViewDragEnd, this._onSubwinDragEnd);
            const ondown = () => {
                this._undockedWins.delete(v).insert(0, v);
                this._updateUndockedWinsStyle();
            };
            this._pointerdowns.set(v, ondown);
            v.addEventListener('pointerdown', ondown);
            v.addEventListener('touchstart', ondown, { passive: true });
            this._undockedWins.insert(0, v);
            this._dockedWins.delete(v);
        });
        super._handleAddedChildren(children);
    }
    _prehandleRemovedChildren(children) {
        // console.log('[Workspace]_prehandleRemovedChildren', children)
        children.forEach(child => {
            if (!(child instanceof SubWin_1.Subwin)) {
                return;
            }
            const listener = this._pointerdowns.get(child);
            if (listener) {
                child.removeEventListener('pointerdown', listener);
                child.removeEventListener('touchstart', listener);
            }
            this._undockedWins.delete(child);
        });
        return super._prehandleRemovedChildren(children);
    }
}
exports.WorkspaceView = WorkspaceView;

},{"../../BaseView/View":10,"../../Events/EventType":24,"../../Helper/List":27,"../../utils":31,"../DockPosition":11,"../DockResultPreview":12,"../SubWin":17,"./DockView":18,"./DockableDirection":19,"./IndicatorImage":21,"./IndicatorView":22}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementDragger = void 0;
const EventType_1 = require("../Events/EventType");
class ElementDragger {
    get offsetX() { return this._offsetX; }
    get offsetY() { return this._offsetY; }
    set offsetX(v) { this._offsetX = v; }
    set offsetY(v) { this._offsetY = v; }
    isIgnore(target) {
        return this._ignores.indexOf(target) >= 0;
    }
    get handles() { return this._handles; }
    set handles(v) {
        this._handles.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown, true));
        this._handles.forEach(v => v.removeEventListener('touchstart', this._ontouchstart, true));
        this._handles = v;
        if (!this._disabled) {
            this._handles.forEach(v => v.addEventListener('pointerdown', this._onpointerdown, true));
            this._handles.forEach(v => v.addEventListener('touchstart', this._ontouchstart, { capture: true, passive: false }));
        }
    }
    set handleMove(v) { this._handleMove = v; }
    set handleDown(v) { this._handleDown = v; }
    set handleUp(v) { this._handleUp = v; }
    get responser() { return this._responser; }
    set responser(v) { this._responser = v; }
    get ignores() { return this._ignores; }
    get disabled() { return this._disabled; }
    set disabled(v) {
        if (this._disabled === v) {
            return;
        }
        this._disabled = v;
        v ? this.stopListen() : this.startListen();
    }
    startListen() {
        document.addEventListener('pointermove', this._pointermove, true);
        document.addEventListener('pointerup', this._onpointerup, true);
        document.addEventListener('blur', this._onblur);
        this._handles.forEach(v => v.addEventListener('pointerdown', this._onpointerdown, true));
        document.addEventListener('touchmove', this._ontouchmove, true);
        document.addEventListener('touchend', this._ontouchend, true);
        document.addEventListener('touchcancel', this._ontouchend);
        this._handles.forEach(v => v.addEventListener('touchstart', this._ontouchstart, { capture: true, passive: true }));
    }
    stopListen() {
        document.removeEventListener('pointermove', this._pointermove, true);
        document.removeEventListener('pointerup', this._onpointerup, true);
        document.removeEventListener('blur', this._onblur);
        this._handles.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown));
        document.removeEventListener('touchmove', this._ontouchmove, true);
        document.removeEventListener('touchend', this._ontouchend, true);
        document.removeEventListener('touchcancel', this._ontouchend);
        this._handles.forEach(v => v.removeEventListener('touchstart', this._ontouchstart));
    }
    constructor(inits) {
        this._handles = [];
        this._ignores = [];
        this._responser = null;
        this._offsetX = 0;
        this._offsetY = 0;
        this._down = false;
        this._disabled = false;
        this._oldX = 0;
        this._oldY = 0;
        this._handleMove = (x, y) => {
            if (!this._responser) {
                return;
            }
            this._responser.style.left = `${x}px`;
            this._responser.style.top = `${y}px`;
        };
        this._ondown = (target, pageX, pageY) => {
            var _a, _b;
            if (!this._responser) {
                return;
            }
            if (this.isIgnore(target)) {
                return;
            }
            const { left, top } = target.getBoundingClientRect();
            this._down = true;
            this._offsetX = pageX - left;
            this._offsetY = pageY - top;
            while (target !== this._responser) {
                this._offsetX += target.offsetLeft;
                this._offsetY += target.offsetTop;
                if (!target.parentElement) {
                    break;
                }
                target = target.parentElement;
                if (this.isIgnore(target)) {
                    this._down = false;
                    return;
                }
            }
            if (this.isIgnore(target)) {
                this._down = false;
                return;
            }
            this._oldX = left;
            this._oldY = top;
            (_a = this._handleDown) === null || _a === void 0 ? void 0 : _a.call(this);
            const event = new CustomEvent(EventType_1.EventType.ViewDragStart, {
                detail: { pageX, pageY, dragger: this }
            });
            (_b = this.responser) === null || _b === void 0 ? void 0 : _b.dispatchEvent(event);
            event.preventDefault();
            event.stopPropagation();
        };
        this._onmove = (pageX, pageY) => {
            var _a, _b;
            if (!this._responser || !this._down) {
                return;
            }
            (_a = this._handleMove) === null || _a === void 0 ? void 0 : _a.call(this, pageX - this._offsetX, pageY - this._offsetY, this._oldX, this._oldY);
            const event = new CustomEvent(EventType_1.EventType.ViewDragging, {
                detail: { pageX, pageY, dragger: this }
            });
            (_b = this.responser) === null || _b === void 0 ? void 0 : _b.dispatchEvent(event);
            event.preventDefault();
            event.stopPropagation();
        };
        this._onup = () => {
            var _a, _b;
            if (!this._down)
                return;
            (_a = this._handleUp) === null || _a === void 0 ? void 0 : _a.call(this);
            const event = new CustomEvent(EventType_1.EventType.ViewDragEnd, {
                detail: { dragger: this }
            });
            (_b = this.responser) === null || _b === void 0 ? void 0 : _b.dispatchEvent(event);
            this._down = false;
            event.preventDefault();
            event.stopPropagation();
        };
        this._onpointerdown = (e) => {
            if (e.button !== 0) {
                return;
            }
            const target = e.target;
            this._ondown(target, e.pageX, e.pageY);
        };
        this._pointermove = (e) => {
            this._onmove(e.pageX, e.pageY);
        };
        this._onpointerup = (e) => {
            if (e.button !== 0) {
                return;
            }
            this._onup();
        };
        this._ontouchstart = (e) => {
            if (e.touches.length !== 1) {
                return;
            }
            const target = e.target;
            this._ondown(target, e.touches[0].pageX, e.touches[0].pageY);
        };
        this._ontouchmove = (e) => {
            if (e.touches.length !== 1) {
                return;
            }
            this._onmove(e.touches[0].pageX, e.touches[0].pageY);
        };
        this._ontouchend = (e) => {
            if (e.touches.length !== 0) {
                return;
            }
            this._onup();
        };
        this._onblur = () => this._onup();
        (inits === null || inits === void 0 ? void 0 : inits.responser) && (this.responser = inits.responser);
        (inits === null || inits === void 0 ? void 0 : inits.handles) && (this._handles = inits.handles);
        (inits === null || inits === void 0 ? void 0 : inits.ignores) && (this._ignores = inits.ignores);
        (inits === null || inits === void 0 ? void 0 : inits.handleMove) && (this._handleMove = inits.handleMove);
        this._handleDown = inits === null || inits === void 0 ? void 0 : inits.handleDown;
        this._handleUp = inits === null || inits === void 0 ? void 0 : inits.handleUp;
        this.startListen();
    }
    destory() {
        this.stopListen();
    }
}
exports.ElementDragger = ElementDragger;

},{"../Events/EventType":24}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
class List extends Array {
    get size() { return this.length; }
    remove(element) {
        return this.delete(element);
    }
    delete(element) {
        const index = this.indexOf(element);
        index >= 0 && this.splice(index, 1);
        return this;
    }
    add(element) {
        this.push(element);
        return this;
    }
    insert(index, element) {
        this.splice(index, 0, element);
        return this;
    }
    findR(predicate, thisArg) {
        for (let i = this.length - 1; i >= 0; --i) {
            if (predicate(this[i], i, this)) {
                return this[i];
            }
        }
        return undefined;
    }
    forEach(callbackfn, thisArg) {
        super.forEach(callbackfn);
        return this;
    }
}
exports.List = List;

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewDragger = void 0;
const View_1 = require("../BaseView/View");
const ElementDragger_1 = require("./ElementDragger");
class ViewDragger {
    get offsetX() { return this._dragger.offsetX; }
    get offsetY() { return this._dragger.offsetY; }
    set offsetX(v) { this._dragger.offsetX = v; }
    set offsetY(v) { this._dragger.offsetY = v; }
    get handles() { return this._dragger.handles.map(v => View_1.View.get(v)); }
    set handles(v) { this._dragger.handles = v.map(v => v.inner); }
    get view() { return View_1.View.get(this._dragger.responser); }
    set view(v) { var _a; this._dragger.responser = (_a = v === null || v === void 0 ? void 0 : v.inner) !== null && _a !== void 0 ? _a : null; }
    get ignores() { return this._dragger.ignores.map(v => View_1.View.get(v)); }
    get disabled() { return this._dragger.disabled; }
    set disabled(v) { this._dragger.disabled = v; }
    set handleMove(v) { this._dragger.handleMove = v; }
    set handleDown(v) { this._dragger.handleDown = v; }
    set handleUp(v) { this._dragger.handleUp = v; }
    constructor(inits) {
        var _a, _b, _c, _d;
        this._dragger = new ElementDragger_1.ElementDragger({
            responser: (_a = inits === null || inits === void 0 ? void 0 : inits.responser) === null || _a === void 0 ? void 0 : _a.inner,
            handles: (_b = inits === null || inits === void 0 ? void 0 : inits.handles) === null || _b === void 0 ? void 0 : _b.map(v => v.inner),
            ignores: (_c = inits === null || inits === void 0 ? void 0 : inits.ignores) === null || _c === void 0 ? void 0 : _c.map(v => v.inner),
            handleDown: inits === null || inits === void 0 ? void 0 : inits.handleDown,
            handleMove: (_d = inits === null || inits === void 0 ? void 0 : inits.handleMove) !== null && _d !== void 0 ? _d : ((x, y) => { var _a; return (_a = this.view) === null || _a === void 0 ? void 0 : _a.styles.apply('view_dragger_pos', { left: x, top: y }); }),
            handleUp: inits === null || inits === void 0 ? void 0 : inits.handleUp,
        });
    }
    destory() {
        this._dragger.destory();
    }
}
exports.ViewDragger = ViewDragger;

},{"../BaseView/View":10,"./ElementDragger":26}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerItemView = exports.LayersView = exports.LayersViewEventType = void 0;
const Button_1 = require("./G/BaseView/Button");
const SizeType_1 = require("./G/BaseView/SizeType");
const TextInput_1 = require("./G/BaseView/TextInput");
const View_1 = require("./G/BaseView/View");
const SubWin_1 = require("./G/CompoundView/SubWin");
const FocusOb_1 = require("./G/Observer/FocusOb");
var LayersViewEventType;
(function (LayersViewEventType) {
    LayersViewEventType["LayerAdded"] = "LayerAdded";
    LayersViewEventType["LayerRemoved"] = "LayerRemoved";
    LayersViewEventType["LayerNameChanged"] = "LayerNameChanged";
    LayersViewEventType["LayerVisibleChanged"] = "LayerVisibleChanged";
    LayersViewEventType["LayerActived"] = "LayerActived";
})(LayersViewEventType = exports.LayersViewEventType || (exports.LayersViewEventType = {}));
class LayersView extends SubWin_1.Subwin {
    addEventListener(arg0, arg1, arg2) {
        return super.addEventListener(arg0, arg1, arg2);
    }
    constructor() {
        super();
        this._layers = [];
        this.header.title = 'layers';
        this.content = new View_1.View('div');
        this.content.styles.apply("", {
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden'
        });
        this.styles.apply("", { minWidth: '225px' });
        this.btnAddLayer = new Button_1.Button().init({ content: '📃', title: '新建图层', size: SizeType_1.SizeType.Small }).addEventListener('click', (e) => {
            const event = new CustomEvent(LayersViewEventType.LayerAdded, { detail: '' + Date.now() });
            this.inner.dispatchEvent(event);
        });
        this.footer.addChild(this.btnAddLayer);
        this.btnAddFolder = new Button_1.Button().init({ content: '📂', title: '新建图层组', size: SizeType_1.SizeType.Small });
        this.footer.addChild(this.btnAddFolder);
    }
    layers() { return this._layers; }
    addLayer(inits) {
        var _a;
        const item = new LayerItemView(inits);
        this._layers.push(item);
        (_a = this.content) === null || _a === void 0 ? void 0 : _a.addChild(item);
        item.addEventListener('click', () => {
            var _a, _b;
            item.selected = true;
            (_b = (_a = this.content) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.forEach(v => v.selected = false);
            const detail = { id: item.state.id };
            this.inner.dispatchEvent(new CustomEvent(LayersViewEventType.LayerActived, { detail }));
        });
        return item;
    }
}
exports.LayersView = LayersView;
LayersView.EventType = LayersViewEventType;
class LayerItemView extends View_1.View {
    get state() { return this._state; }
    get selected() { return this._state.selected; }
    set selected(v) {
        this._state.selected = v;
        this.styles.apply("", v => (Object.assign(Object.assign({}, v), { background: this.state.selected ? '#00000044' : '' })));
    }
    updateStyle() {
        const styleName = `${this.hover}_${this.selected}`;
        this.styles.del(this._prevStyleName).add(styleName).refresh();
        this._prevStyleName = styleName;
    }
    onHover(hover) { this.updateStyle(); }
    constructor(inits) {
        super('div');
        this._state = {
            id: '',
            visible: true,
            locked: false,
            name: '',
            selected: false,
        };
        this._state.id = inits.id;
        this._state.name = inits.name;
        this.styles
            .register('false_false', {})
            .register('true_false', { background: '#00000022' })
            .register('false_true', { background: '#00000033' })
            .register('true_true', { background: '#00000044' })
            .apply("", {
            display: 'flex',
            position: 'relative',
            padding: 5,
            borderBottom: '1px solid #00000022',
            transition: 'all 200ms',
        });
        const btn0 = new Button_1.Button().init({
            checkable: true,
            checked: this._state.locked,
            contents: ['🔓', '🔒']
        });
        btn0.addEventListener('click', () => {
            this._state.locked = btn0.checked;
        });
        this.addChild(btn0);
        const btn1 = new Button_1.Button().init({
            checkable: true,
            checked: this._state.visible,
            contents: ['🙈', '🐵']
        });
        btn1.addEventListener('click', () => {
            var _a, _b;
            this._state.visible = btn1.checked;
            const detail = {
                id: this.state.id,
                visible: btn1.checked
            };
            (_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.inner.dispatchEvent(new CustomEvent(LayersViewEventType.LayerVisibleChanged, { detail }));
        });
        this.addChild(btn1);
        const btn2 = new Button_1.Button().init({
            checkable: true,
            checked: this._state.visible,
            contents: ['➕', '➖']
        });
        btn2.addEventListener('click', () => {
            this._state.visible = btn2.checked;
        });
        this.addChild(btn2);
        const inputName = new TextInput_1.TextInput();
        inputName.styles.register(TextInput_1.InputStyleNames.Hover, v => (Object.assign(Object.assign({}, v), { background: '#00000022' }))).register(TextInput_1.InputStyleNames.Focused, v => (Object.assign(Object.assign({}, v), { color: 'white' }))).register(TextInput_1.InputStyleNames.Normal, v => (Object.assign(Object.assign({}, v), { outline: 'none', border: 'none', minWidth: 100, flex: 1, height: 24, borderRadius: 5, padding: '0px 5px', background: 'none', color: '#FFFFFF88' }))).refresh();
        inputName.value = inits.name;
        inputName.disabled = true;
        this.addChild(inputName);
        new FocusOb_1.FocusOb(inputName.inner, (v) => inputName.disabled = !v);
        const btn3 = new Button_1.Button().init({ content: '🖊️' });
        btn3.addEventListener('click', () => {
            inputName.disabled = false;
            inputName.focus();
        });
        this.addChild(btn3);
    }
}
exports.LayerItemView = LayerItemView;

},{"./G/BaseView/Button":2,"./G/BaseView/SizeType":6,"./G/BaseView/TextInput":9,"./G/BaseView/View":10,"./G/CompoundView/SubWin":17,"./G/Observer/FocusOb":29}],33:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecorderView = void 0;
const Player_1 = require("../../dist/features/Player");
const Recorder_1 = require("../../dist/features/Recorder");
const Button_1 = require("./G/BaseView/Button");
const StyleType_1 = require("./G/BaseView/StyleType");
const View_1 = require("./G/BaseView/View");
const SubWin_1 = require("./G/CompoundView/SubWin");
const demo_helloworld_1 = __importDefault(require("./demo_helloworld"));
const demo_rect_n_oval_1 = __importDefault(require("./demo_rect_n_oval"));
class RecorderView extends SubWin_1.Subwin {
    get btnStartRecord() { return this._btnStartRecord; }
    get btnStopRecord() { return this._btnStopRecord; }
    get btnPlay() { return this._btnPlay; }
    get btnDemo0() { return this._btnDemo0; }
    get btnDemo1() { return this._btnDemo1; }
    get textarea() { return this._textarea; }
    get board() { return this._board; }
    set board(v) { this._board = v; }
    constructor() {
        super();
        this._btnStartRecord = new Button_1.Button().init({ content: '开始录制' });
        this._btnStopRecord = new Button_1.Button().init({ content: '停止录制' });
        this._btnPlay = new Button_1.Button().init({ content: '播放' });
        this._btnDemo0 = new Button_1.Button().init({ content: '"hello world"' });
        this._btnDemo1 = new Button_1.Button().init({ content: '"rect & oval"' });
        this._textarea = new View_1.View('textarea');
        this.header.title = 'recorder';
        this.content = new View_1.View('div');
        this.content.styles.apply('', { flex: 1, display: StyleType_1.CssDisplay.Flex, flexDirection: StyleType_1.CssFlexDirection.column });
        this.content.addChild(this._btnStartRecord);
        this.content.addChild(this._btnStopRecord);
        this.content.addChild(this._btnPlay);
        this.content.addChild(this._btnDemo0);
        this.content.addChild(this._btnDemo1);
        this.content.addChild(this._textarea);
        this._textarea.styles.apply('', { resize: 'vertical' });
        this.btnStartRecord.addEventListener('click', () => this.startRecord());
        this.btnStopRecord.addEventListener('click', () => this.endRecord());
        this.btnPlay.addEventListener('click', () => {
            this.endRecord();
            this.replay();
        });
        this.btnDemo0.addEventListener('click', () => {
            this.endRecord();
            this.textarea.inner.value = demo_helloworld_1.default;
            this.replay();
        });
        this.btnDemo1.addEventListener('click', () => {
            this.endRecord();
            this.textarea.inner.value = demo_rect_n_oval_1.default;
            this.replay();
        });
    }
    startRecord() {
        var _a, _b;
        const board = (_a = this._board) === null || _a === void 0 ? void 0 : _a.call(this);
        if (!board) {
            return;
        }
        (_b = this._recorder) === null || _b === void 0 ? void 0 : _b.destory();
        this._recorder = new Recorder_1.Recorder();
        this._recorder.start(board);
    }
    endRecord() {
        var _a;
        if (!this._recorder) {
            return;
        }
        this.textarea.inner.value = this._recorder.toJsonStr();
        (_a = this._recorder) === null || _a === void 0 ? void 0 : _a.destory();
        this._recorder = undefined;
    }
    replay() {
        var _a, _b;
        const board = (_a = this._board) === null || _a === void 0 ? void 0 : _a.call(this);
        if (!board) {
            return;
        }
        this.endRecord();
        const str = this.textarea.inner.value;
        (_b = this._player) === null || _b === void 0 ? void 0 : _b.stop();
        this._player = new Player_1.Player();
        this._player.start(board, JSON.parse(str));
    }
}
exports.RecorderView = RecorderView;

},{"../../dist/features/Player":48,"../../dist/features/Recorder":49,"./G/BaseView/Button":2,"./G/BaseView/StyleType":7,"./G/BaseView/View":10,"./G/CompoundView/SubWin":17,"./demo_helloworld":39,"./demo_rect_n_oval":40}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotView = void 0;
const Button_1 = require("./G/BaseView/Button");
const StyleType_1 = require("./G/BaseView/StyleType");
const View_1 = require("./G/BaseView/View");
const SubWin_1 = require("./G/CompoundView/SubWin");
class SnapshotView extends SubWin_1.Subwin {
    get board() { return this._board; }
    set board(v) { this._board = v; }
    constructor() {
        super();
        this._textarea = new View_1.View('textarea');
        this.header.title = 'snapshot';
        this.content = new View_1.View('div');
        this.content.styles.apply('', { flex: 1, display: StyleType_1.CssDisplay.Flex, flexDirection: StyleType_1.CssFlexDirection.column });
        this.content.addChild(new Button_1.Button().init({ content: 'save Snapshot' }).addEventListener('click', () => {
            var _a;
            const board = (_a = this._board) === null || _a === void 0 ? void 0 : _a.call(this);
            if (!board) {
                return;
            }
            this._textarea.inner.value = board.toJson();
        }));
        this.content.addChild(new Button_1.Button().init({ content: 'load Snapshot' }).addEventListener('click', () => {
            var _a;
            const board = (_a = this._board) === null || _a === void 0 ? void 0 : _a.call(this);
            if (!board) {
                return;
            }
            board.fromJson(this._textarea.inner.value);
        }));
        this.content.addChild(this._textarea);
        this._textarea.styles.apply('', { resize: 'vertical' });
    }
}
exports.SnapshotView = SnapshotView;

},{"./G/BaseView/Button":2,"./G/BaseView/StyleType":7,"./G/BaseView/View":10,"./G/CompoundView/SubWin":17}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsView = exports.ToolButton = void 0;
const dist_1 = require("../../dist");
const SizeType_1 = require("./G/BaseView/SizeType");
const View_1 = require("./G/BaseView/View");
const IconButton_1 = require("./G/CompoundView/IconButton");
const SubWin_1 = require("./G/CompoundView/SubWin");
const ButtonGroup_1 = require("./G/Helper/ButtonGroup");
class ToolButton extends IconButton_1.IconButton {
    get toolType() { return this._toolType; }
    constructor() {
        super();
    }
    init(inits) {
        this._toolType = inits === null || inits === void 0 ? void 0 : inits.toolType;
        return super.init(Object.assign(Object.assign({}, inits), { checkable: true, size: SizeType_1.SizeType.Large }));
    }
}
exports.ToolButton = ToolButton;
class ToolsView extends SubWin_1.Subwin {
    set onToolClick(v) {
        this._toolButtonGroup.onClick = v;
    }
    setToolType(toolEnum) {
        this._toolsBtns.forEach(v => {
            v.checked = toolEnum === v.toolType;
        });
    }
    constructor() {
        super();
        this.header.title = 'tools';
        this.content = new View_1.View('div');
        this.content.styles.apply("", {
            flex: '1',
            overflowY: 'auto',
            overflowX: 'hidden',
            width: 64,
        });
        this._toolsBtns = [
            new ToolButton().init({ src: './ic_tool_selector.svg', toolType: dist_1.ToolEnum.Selector }),
            new ToolButton().init({ src: './ic_tool_pen.svg', toolType: dist_1.ToolEnum.Pen }),
            new ToolButton().init({ src: './ic_tool_rect.svg', toolType: dist_1.ToolEnum.Rect }),
            new ToolButton().init({ src: './ic_tool_oval.svg', toolType: dist_1.ToolEnum.Oval }),
            new ToolButton().init({ src: './ic_tool_text.svg', toolType: dist_1.ToolEnum.Text }),
            new ToolButton().init({ src: './ic_tool_tick.svg', toolType: dist_1.ToolEnum.Tick }),
            new ToolButton().init({ src: './ic_tool_halftick.svg', toolType: dist_1.ToolEnum.HalfTick }),
            new ToolButton().init({ src: './ic_tool_cross.svg', toolType: dist_1.ToolEnum.Cross }),
            new ToolButton().init({ src: './ic_tool_lines.svg', toolType: dist_1.ToolEnum.Lines })
        ];
        this._toolsBtns.forEach(btn => { var _a; return (_a = this.content) === null || _a === void 0 ? void 0 : _a.addChild(btn); });
        this._toolButtonGroup = new ButtonGroup_1.ButtonGroup({ buttons: this._toolsBtns });
        this.removeChild(this.footer);
    }
}
exports.ToolsView = ToolsView;

},{"../../dist":52,"./G/BaseView/SizeType":6,"./G/BaseView/View":10,"./G/CompoundView/IconButton":13,"./G/CompoundView/SubWin":17,"./G/Helper/ButtonGroup":25}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToyView = void 0;
const dist_1 = require("../../dist");
const Button_1 = require("./G/BaseView/Button");
const View_1 = require("./G/BaseView/View");
const SubWin_1 = require("./G/CompoundView/SubWin");
const v255 = () => Math.floor(Math.random() * 255);
const rColor = () => `rgb(${v255()},${v255()},${v255()})`;
class ToyView extends SubWin_1.Subwin {
    get board() { return this._board; }
    set board(v) { this._board = v; }
    constructor() {
        super();
        this.header.title = 'toys';
        this.content = new View_1.View('div');
        this.content.styles.apply('', {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden'
        });
        const randomShapeItem = (item) => {
            var _a;
            const board = (_a = this._board) === null || _a === void 0 ? void 0 : _a.call(this);
            if (!board) {
                return;
            }
            item.geo(Math.floor(Math.random() * board.width), Math.floor(Math.random() * board.height), 50, 50);
            item.data.fillStyle = rColor();
            item.data.strokeStyle = rColor();
        };
        this.content.addChild(new Button_1.Button().init({
            content: 'random add 1000 rect'
        }).addEventListener('click', () => {
            var _a;
            const board = (_a = this._board) === null || _a === void 0 ? void 0 : _a.call(this);
            if (!board) {
                return;
            }
            const items = [];
            for (let i = 0; i < 1000; ++i) {
                const item = board.factory.newShape(dist_1.ShapeEnum.Rect);
                item.data.layer = board.layer().id;
                randomShapeItem(item);
                items.push(item);
            }
            board.add(...items);
        }));
        this.content.addChild(new Button_1.Button().init({
            content: 'random add 1000 oval'
        }).addEventListener('click', () => {
            var _a;
            const board = (_a = this._board) === null || _a === void 0 ? void 0 : _a.call(this);
            if (!board) {
                return;
            }
            const items = [];
            for (let i = 0; i < 1000; ++i) {
                const item = board.factory.newShape(dist_1.ShapeEnum.Oval);
                item.data.layer = board.layer().id;
                randomShapeItem(item);
                items.push(item);
            }
            board.add(...items);
        }));
        this.content.addChild(new Button_1.Button().init({
            content: 'random draw 1000 pen'
        }).addEventListener('click', () => {
            var _a;
            const board = (_a = this._board) === null || _a === void 0 ? void 0 : _a.call(this);
            if (!board) {
                return;
            }
            const items = [];
            for (let i = 0; i < 1000; ++i) {
                const item = board.factory.newShape(dist_1.ShapeEnum.Pen);
                item.data.layer = board.layer().id;
                let x = Math.floor(Math.random() * board.width);
                let y = Math.floor(Math.random() * board.height);
                const v5 = () => Math.floor(Math.random() * 5);
                const lenth = Math.floor(Math.random() * 100);
                for (let j = 0; j < lenth; ++j) {
                    x += v5();
                    y += v5();
                    item.appendDot({ x, y, p: 0.5 });
                }
                randomShapeItem(item);
                items.push(item);
            }
            board.add(...items);
        }));
    }
}
exports.ToyView = ToyView;

},{"../../dist":52,"./G/BaseView/Button":2,"./G/BaseView/View":10,"./G/CompoundView/SubWin":17}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HSB = exports.RGBA = exports.RGB = exports.clampI = exports.clampF = void 0;
const clampF = (min, max, value) => Math.max(min, Math.min(max, value));
exports.clampF = clampF;
const clampI = (min, max, value) => Math.floor((0, exports.clampF)(min, max, value));
exports.clampI = clampI;
class RGB {
    static get White() { return new RGB(255, 255, 255); }
    static get Black() { return new RGB(0, 0, 0); }
    get r() { return this._r; }
    set r(v) {
        this._r = (0, exports.clampI)(0, 255, v);
    }
    get g() { return this._g; }
    set g(v) {
        this._g = (0, exports.clampI)(0, 255, v);
    }
    get b() { return this._b; }
    set b(v) {
        this._b = (0, exports.clampI)(0, 255, v);
    }
    equal(o) {
        return this.r === o.r && this.g === o.g && this.b === o.b;
    }
    setR(v) {
        this.r = v;
        return this;
    }
    setG(v) {
        this.g = v;
        return this;
    }
    setB(v) {
        this.b = v;
        return this;
    }
    constructor(r = 0, g = 0, b = 0) {
        this._r = 0;
        this._g = 0;
        this._b = 0;
        this.r = r;
        this.g = g;
        this.b = b;
    }
    copy() {
        return new RGB(this.r, this.g, this.b);
    }
    toString() {
        return `rgb(${this.r},${this.g},${this.b})`;
    }
    toHex() {
        return "#" +
            (this.r < 16 ? '0' : '') +
            Math.floor(this.r).toString(16) +
            (this.g < 16 ? '0' : '') +
            Math.floor(this.g).toString(16) +
            (this.b < 16 ? '0' : '') +
            Math.floor(this.b).toString(16);
    }
    toHSB(hues) {
        var rgb = [
            this.r,
            this.g,
            this.b
        ];
        rgb.sort(function sortNumber(a, b) {
            return a - b;
        });
        var max = rgb[2];
        var min = rgb[0];
        var ret = new HSB(0, max == 0 ? 0 : (max - min) / max, max / 255);
        var rgbR = this.r;
        var rgbG = this.g;
        var rgbB = this.b;
        if (max == min) { // lost rgb 
            if (hues === undefined) {
                return null;
            }
            else {
                ret.h = hues;
            }
        }
        else if (max == rgbR && rgbG >= rgbB)
            ret.h = (rgbG - rgbB) * 60 / (max - min) + 0;
        else if (max == rgbR && rgbG < rgbB)
            ret.h = (rgbG - rgbB) * 60 / (max - min) + 360;
        else if (max == rgbG)
            ret.h = (rgbB - rgbR) * 60 / (max - min) + 120;
        else if (max == rgbB)
            ret.h = (rgbR - rgbG) * 60 / (max - min) + 240;
        return ret;
    }
    toRGBA(a) {
        return new RGBA(this.r, this.g, this.b, a);
    }
}
exports.RGB = RGB;
class RGBA extends RGB {
    static get White() { return new RGBA(255, 255, 255, 255); }
    static get Black() { return new RGBA(0, 0, 0, 255); }
    static get WhiteT() { return new RGBA(255, 255, 255, 0); }
    static get BlackT() { return new RGBA(0, 0, 0, 0); }
    get a() { return this._a; }
    set a(v) {
        this._a !== v;
        this._a = (0, exports.clampI)(0, 255, v);
    }
    equal(o) {
        return this.r === o.r && this.g === o.g && this.b === o.b && this.a === o.a;
    }
    setA(v) {
        this.a = v;
        return this;
    }
    constructor(r = 0, g = 0, b = 0, a = 0) {
        super(r, g, b);
        this._a = 0;
        this.a = a;
    }
    copy() {
        return new RGBA(this.r, this.g, this.b, this.a);
    }
    toString() {
        return `rgba(${this.r},${this.g},${this.b},${(this.a / 255).toFixed(2)})`;
    }
    toHex() {
        return "#" +
            (this.r < 16 ? '0' : '') +
            Math.floor(this.r).toString(16) +
            (this.g < 16 ? '0' : '') +
            Math.floor(this.g).toString(16) +
            (this.b < 16 ? '0' : '') +
            Math.floor(this.b).toString(16) +
            (this.a < 16 ? '0' : '') +
            Math.floor(this.a).toString(16);
    }
    toRGB() {
        return new RGB(this.r, this.g, this.b);
    }
}
exports.RGBA = RGBA;
class HSB {
    get h() { return this._h; }
    set h(v) { this._h = (0, exports.clampI)(0, 360, v); }
    get s() { return this._s; }
    set s(v) { this._s = (0, exports.clampF)(0, 1, v); }
    get b() { return this._b; }
    set b(v) { this._b = (0, exports.clampF)(0, 1, v); }
    equal(o) {
        return this.h === o.h && this.s === o.s && this.b === o.b;
    }
    constructor(h, s, b) {
        this._h = 0;
        this._s = 0;
        this._b = 0;
        this.h = h;
        this.s = s;
        this.b = b;
    }
    copy() {
        return new HSB(this.h, this.s, this.b);
    }
    toString() {
        return 'hsb(' + this.h + ',' + this.s + ',' + this.b + ')';
    }
    toRGB() {
        if (isNaN(this.h))
            console.warn('lost hues!');
        var i = Math.floor((this.h / 60) % 6);
        var f = (this.h / 60) - i;
        var pool = {
            f: f,
            p: this.b * (1 - this.s),
            q: this.b * (1 - f * this.s),
            t: this.b * (1 - (1 - f) * this.s),
            v: this.b
        };
        var relations = [
            ['v', 't', 'p'],
            ['q', 'v', 'p'],
            ['p', 'v', 't'],
            ['p', 'q', 'v'],
            ['t', 'p', 'v'],
            ['v', 'p', 'q'],
        ];
        return new RGB(255 * pool[relations[i][0]], 255 * pool[relations[i][1]], 255 * pool[relations[i][2]]);
    }
    toRGBA(a) {
        return this.toRGB().toRGBA(a);
    }
    stripSB() {
        return new HSB(this.h, 1, 1);
    }
}
exports.HSB = HSB;

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorPalette = void 0;
const Rect_1 = require("../../../dist/utils/Rect");
const Vector_1 = require("../../../dist/utils/Vector");
const Color_1 = require("./Color");
class Base {
    get rect() { return this._rect; }
    set rect(v) {
        this._rect.set(v);
        this.update();
    }
    constructor(onscreen, offscreen, rect) {
        this._pos = new Vector_1.Vector(0, 0);
        this._requested = false;
        if (rect)
            this._rect = Rect_1.Rect.create(rect);
        else
            this._rect = new Rect_1.Rect(0, 0, onscreen.width, onscreen.height);
        this._offscreen = offscreen;
        this._onscreen = onscreen;
        onscreen.addEventListener('pointerdown', e => this.pointerstart(e));
        document.addEventListener('pointermove', e => this.pointermove(e));
        document.addEventListener('pointerup', e => this.pointerend(e));
        document.addEventListener('pointercancel', e => this.pointerend(e));
        setTimeout(() => this.update(), 1);
    }
    pointerstart(e) {
        if (!this.pressOnMe(e) || this._pointerId)
            return;
        this._pointerId = e.pointerId;
        this.updatePos(e);
        this.update();
    }
    pointermove(e) {
        if (e.pointerId !== this._pointerId)
            return;
        this.updatePos(e);
        this.update();
    }
    pointerend(e) {
        if (e.pointerId !== this._pointerId)
            return;
        delete this._pointerId;
        this.updatePos(e);
        this.update();
    }
    pressOnMe(e) {
        if (e.pointerType === 'mouse' && e.button !== 0)
            return false;
        const { x, y } = this.pos(e);
        return x < this._rect.w && y < this._rect.h && x >= 0 && y >= 0;
    }
    pos(e) {
        const { left, top, width, height } = this._onscreen.getBoundingClientRect();
        const { x, y, w, h } = this._rect;
        return new Vector_1.Vector((e.clientX - left) * this._onscreen.width / width - x, (e.clientY - top) * this._onscreen.height / height - y);
    }
    clampPos(e) {
        const pos = this.pos(e);
        pos.x = (0, Color_1.clampI)(0, this._rect.w, pos.x);
        pos.y = (0, Color_1.clampI)(0, this._rect.h, pos.y);
        return pos;
    }
    updatePos(e) {
        this._pos = this.clampPos(e);
    }
    update() {
        if (this._requested)
            return;
        this._requested = true;
        requestAnimationFrame(() => {
            this.drawOffscreen();
            const onscreen = this._onscreen.getContext('2d');
            onscreen.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
            onscreen.drawImage(this._offscreen, this._rect.x, this._rect.y, this._rect.w, this._rect.h, this._rect.x, this._rect.y, this._rect.w, this._rect.h);
            this._requested = false;
        });
    }
    drawOffscreen() { }
}
class ColorCol extends Base {
    constructor() {
        super(...arguments);
        this.__colors = [
            new Color_1.RGB(255, 0, 0),
            new Color_1.RGB(255, 255, 0),
            new Color_1.RGB(0, 255, 0),
            new Color_1.RGB(0, 255, 255),
            new Color_1.RGB(0, 0, 255),
            new Color_1.RGB(255, 0, 255),
            new Color_1.RGB(255, 0, 0)
        ];
        this._result = 0;
    }
    get value() { return this._result; }
    set value(v) {
        this._result = (0, Color_1.clampF)(0, 360, v);
        this.update();
    }
    set onChanged(cb) { this._onChanged = cb; }
    updatePos(e) {
        var _a;
        super.updatePos(e);
        const { y } = this._pos;
        this._result = (0, Color_1.clampF)(0, 360, (y / this._rect.h) * 360);
        (_a = this._onChanged) === null || _a === void 0 ? void 0 : _a.call(this, this._result);
        this.update();
    }
    drawOffscreen() {
        const ctx = this._offscreen.getContext('2d');
        ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
        ctx.fillStyle = 'white';
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        let dd = 8;
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'lightgray';
        for (let yy = this._rect.y; yy < this._rect.bottom; yy += dd) {
            for (let xx = this._rect.x; xx < this._rect.right; xx += dd) {
                ctx.fillRect(xx, yy, dd / 2, dd / 2);
                ctx.fillRect(xx + dd / 2, yy + dd / 2, dd / 2, dd / 2);
            }
        }
        ctx.globalCompositeOperation = 'source-over';
        const grd = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x, this._rect.y + this._rect.h);
        const length = this.__colors.length;
        for (var i = 0; i < length; ++i) {
            var step = i / (length - 1);
            var color = this.__colors[i].toString();
            grd.addColorStop(step, color);
        }
        ctx.fillStyle = grd;
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        const y = this._rect.h * (this._result / 360);
        const indicatorSize = 4;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(Math.floor(this._rect.x) + 1, Math.floor(y - indicatorSize / 2) - 0.5, Math.floor(this._rect.w) - 2, indicatorSize);
        ctx.stroke();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(Math.floor(this._rect.x) + 1, Math.floor(y - indicatorSize / 2) - 0.5, Math.floor(this._rect.w) - 2, indicatorSize);
        ctx.stroke();
    }
}
class AlphaRow extends Base {
    constructor() {
        super(...arguments);
        this._base = new Color_1.RGB(255, 0, 0);
        this._value = this._base.toRGBA(255);
    }
    get value() { return this._value.copy(); }
    set value(v) {
        this._value = v.copy();
        this._base = v.toRGB();
        this.update();
    }
    get base() { return this._base.copy(); }
    set base(v) {
        this._base = v.copy();
        this._value = this._base.toRGBA(this._value.a);
        this.update();
    }
    set onChanged(cb) {
        this._onChanged = cb;
    }
    updatePos(e) {
        var _a;
        super.updatePos(e);
        const { x } = this._pos;
        this._value = this._base.toRGBA((0, Color_1.clampI)(0, 255, 255 * (1 - x / this._rect.w)));
        (_a = this._onChanged) === null || _a === void 0 ? void 0 : _a.call(this, this._value);
        this.update();
    }
    drawOffscreen() {
        const ctx = this._offscreen.getContext('2d');
        ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
        ctx.fillStyle = 'white';
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        let dd = 8;
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'lightgray';
        for (let yy = this._rect.y; yy < this._rect.bottom; yy += dd) {
            for (let xx = this._rect.x; xx < this._rect.right; xx += dd) {
                ctx.fillRect(xx, yy, dd / 2, dd / 2);
                ctx.fillRect(xx + dd / 2, yy + dd / 2, dd / 2, dd / 2);
            }
        }
        ctx.globalCompositeOperation = 'source-over';
        const g0 = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x + this._rect.w, this._rect.y);
        g0.addColorStop(0, '' + this._base);
        g0.addColorStop(1, '' + this._base.toRGBA(0));
        ctx.fillStyle = g0;
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        const x = this._rect.w * (1 - this._value.a / 255);
        const indicatorSize = 4;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(Math.floor(x - indicatorSize / 2) - 0.5, Math.floor(this._rect.y) + 1, indicatorSize, Math.floor(this._rect.h) - 2);
        ctx.stroke();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(Math.floor(x - indicatorSize / 2) - 0.5, Math.floor(this._rect.y) + 1, indicatorSize, Math.floor(this._rect.h) - 2);
        ctx.stroke();
    }
}
class HBZone extends Base {
    constructor() {
        super(...arguments);
        this._hues = 0;
        this._value = new Color_1.HSB(this._hues, 1, 1);
    }
    get value() { return this._value.copy(); }
    set value(v) {
        this._value = v.copy();
        this.hues = v.h;
    }
    get hues() { return this._hues; }
    set hues(v) {
        this._hues = (0, Color_1.clampI)(0, 359, v);
        this._value = new Color_1.HSB(this._hues, this._value.s, this._value.b);
        this.update();
    }
    set onChanged(cb) { this._onChanged = cb; }
    updatePos(e) {
        var _a;
        super.updatePos(e);
        const { x, y } = this._pos;
        this._value = new Color_1.HSB(this._hues, (0, Color_1.clampF)(0, 1, 1 - x / this._rect.w), (0, Color_1.clampF)(0, 1, 1 - y / this._rect.h));
        (_a = this._onChanged) === null || _a === void 0 ? void 0 : _a.call(this, this._value);
        this.update();
    }
    drawOffscreen() {
        const ctx = this._offscreen.getContext('2d');
        ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
        const g0 = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x + this._rect.w, this._rect.y);
        g0.addColorStop(0, '' + new Color_1.HSB(this._hues, 1, 1).toRGB());
        g0.addColorStop(1, 'white');
        ctx.fillStyle = g0;
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        const g1 = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x, this._rect.y + this._rect.h);
        g1.addColorStop(0, 'transparent');
        g1.addColorStop(1, 'black');
        ctx.fillStyle = g1;
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        const hsb = this._value;
        const x = this._rect.w * (1 - hsb.s);
        const y = this._rect.h * (1 - hsb.b);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(Math.floor(x) - 0.5, Math.floor(y) - 0.5, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(Math.floor(x) - 0.5, Math.floor(y) - 0.5, 4, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
class FinalZone extends Base {
    constructor() {
        super(...arguments);
        this._curr = Color_1.RGBA.BlackT.copy();
        this._prev = Color_1.RGBA.BlackT.copy();
    }
    get curr() { return this._curr.copy(); }
    set curr(color) {
        this._curr = color.copy();
        this.update();
    }
    get prev() { return this._prev.copy(); }
    set prev(color) {
        this._prev = color.copy();
        this.update();
    }
    drawOffscreen() {
        const ctx = this._offscreen.getContext('2d');
        ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
        ctx.fillStyle = 'white';
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        let dd = 8;
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'lightgray';
        for (let yy = this._rect.y; yy < this._rect.bottom; yy += dd) {
            for (let xx = this._rect.x; xx < this._rect.right; xx += dd) {
                ctx.fillRect(xx, yy, dd / 2, dd / 2);
                ctx.fillRect(xx + dd / 2, yy + dd / 2, dd / 2, dd / 2);
            }
        }
        ctx.globalCompositeOperation = 'source-over';
        {
            ctx.fillStyle = '' + this._curr;
            let x = Math.floor(this._rect.x + 1);
            let y = Math.floor(this._rect.y + 1);
            let w = Math.floor((this._rect.w - 2) / 2);
            let h = Math.floor(this._rect.h - 2);
            ctx.fillRect(x, y, w, h);
            x += w;
            ctx.fillStyle = '' + this._prev;
            ctx.fillRect(x, y, w, h);
        }
    }
}
class ColorPalette {
    get onChanged() { return this._onChanged; }
    set onChanged(v) { this._onChanged = v; }
    set value(v) {
        const hsb = v.toHSB(this._colorCol.value);
        this._colorCol.value = hsb.h;
        this._hbZone.value = hsb;
        this._alphaRow.value = v;
        this._finalZone.curr = v;
        this._finalZone.prev = v;
    }
    get value() { return this._alphaRow.value; }
    constructor(onscreen) {
        this._rowH = 16;
        this._colW = 16;
        this._onscreen = onscreen;
        this._offscreen = document.createElement('canvas');
        this._colorCol = new ColorCol(this._onscreen, this._offscreen);
        this._hbZone = new HBZone(this._onscreen, this._offscreen);
        this._alphaRow = new AlphaRow(this._onscreen, this._offscreen);
        this._finalZone = new FinalZone(this._onscreen, this._offscreen);
        this._colorCol.onChanged = v => {
            var _a;
            this._hbZone.hues = v;
            this._alphaRow.base = this._hbZone.value.toRGB();
            this._finalZone.curr = this._alphaRow.value;
            (_a = this._onChanged) === null || _a === void 0 ? void 0 : _a.call(this, this._finalZone.curr);
        };
        this._hbZone.onChanged = v => {
            var _a;
            this._alphaRow.base = v.toRGB();
            this._finalZone.curr = this._alphaRow.value;
            (_a = this._onChanged) === null || _a === void 0 ? void 0 : _a.call(this, this._finalZone.curr);
        };
        this._alphaRow.onChanged = v => {
            var _a;
            this._finalZone.curr = v;
            (_a = this._onChanged) === null || _a === void 0 ? void 0 : _a.call(this, this._finalZone.curr);
        };
        this._hbZone.hues = 0;
        this.update();
        document.addEventListener('pointerup', _ => this._finalZone.prev = this._finalZone.curr);
        document.addEventListener('pointercancel', _ => this._finalZone.prev = this._finalZone.curr);
    }
    update() {
        const { width: w, height: h } = this._onscreen;
        this._offscreen.width = w;
        this._offscreen.height = h;
        this._colorCol.rect = new Rect_1.Rect(w - this._colW, 0, this._colW, h - this._rowH);
        this._hbZone.rect = new Rect_1.Rect(0, 0, w - this._colW, h - this._rowH);
        this._alphaRow.rect = new Rect_1.Rect(0, h - this._rowH, w - this._colW, this._rowH);
        this._finalZone.rect = new Rect_1.Rect(w - this._colW, h - this._rowH, this._colW, this._rowH);
        this._colorCol.drawOffscreen();
        this._alphaRow.drawOffscreen();
        this._hbZone.drawOffscreen();
        this._finalZone.drawOffscreen();
    }
}
exports.ColorPalette = ColorPalette;

},{"../../../dist/utils/Rect":114,"../../../dist/utils/Vector":116,"./Color":37}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `{
  "startTime": 2124.7999999970198,
  "snapshot": {
    "v": 0,
    "x": 0,
    "y": 0,
    "w": 1024,
    "h": 1024,
    "l": [
      {
        "id": "layer_1687536696552_1",
        "name": "layer_1687536696552_2"
      }
    ],
    "s": []
  },
  "events": [
    {
      "timeStamp": 488.20000000298023,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 1,
            "i": "1_16875366990673",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687536699068,
            "l": "layer_1687536696552_1",
            "style": {
              "a": "#ff0000",
              "c": "round",
              "f": "round",
              "g": 3
            },
            "status": {
              "e": 1
            },
            "dotsType": 1,
            "coords": []
          }
        ]
      }
    },
    {
      "timeStamp": 489.20000000298023,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 54,
              "y": 76,
              "w": 0,
              "h": 0,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                54,
                76
              ]
            },
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": []
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 550.9000000022352,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 54,
              "y": 76,
              "w": 16,
              "h": 33,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                55,
                79,
                62,
                90,
                70,
                109
              ]
            },
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 54,
              "y": 76,
              "w": 0,
              "h": 0,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                54,
                76
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 600.9000000022352,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 54,
              "y": 76,
              "w": 23,
              "h": 91,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                75,
                131,
                77,
                151,
                74,
                167
              ]
            },
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 54,
              "y": 76,
              "w": 16,
              "h": 33,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                54,
                76,
                55,
                79,
                62,
                90,
                70,
                109
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 650.9000000022352,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 54,
              "y": 76,
              "w": 23,
              "h": 129,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                68,
                182,
                61,
                195,
                57,
                205
              ]
            },
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 54,
              "y": 76,
              "w": 23,
              "h": 91,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                54,
                76,
                55,
                79,
                62,
                90,
                70,
                109,
                75,
                131,
                77,
                151,
                74,
                167
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 700.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 54,
              "y": 76,
              "w": 23,
              "h": 134,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                57,
                210,
                57,
                209
              ]
            },
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 54,
              "y": 76,
              "w": 23,
              "h": 129,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                54,
                76,
                55,
                79,
                62,
                90,
                70,
                109,
                75,
                131,
                77,
                151,
                74,
                167,
                68,
                182,
                61,
                195,
                57,
                205
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 735.3000000007451,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 54,
              "y": 76,
              "w": 23,
              "h": 134,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 2,
              "coords": [
                58,
                208,
                58,
                208
              ]
            },
            {
              "t": 1,
              "i": "1_16875366990673",
              "x": 54,
              "y": 76,
              "w": 23,
              "h": 134,
              "z": 1687536699068,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                54,
                76,
                55,
                79,
                62,
                90,
                70,
                109,
                75,
                131,
                77,
                151,
                74,
                167,
                68,
                182,
                61,
                195,
                57,
                205,
                57,
                210,
                57,
                209
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 923.9000000022352,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 1,
            "i": "1_16875366995044",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687536699506,
            "l": "layer_1687536696552_1",
            "style": {
              "a": "#ff0000",
              "c": "round",
              "f": "round",
              "g": 3
            },
            "status": {
              "e": 1
            },
            "dotsType": 1,
            "coords": []
          }
        ]
      }
    },
    {
      "timeStamp": 924.1000000014901,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 120,
              "y": 88,
              "w": 0,
              "h": 0,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                120,
                88
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": []
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 967.8000000007451,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 115,
              "y": 88,
              "w": 5,
              "h": 58,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                120,
                94,
                117,
                114,
                115,
                146
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 120,
              "y": 88,
              "w": 0,
              "h": 0,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1017.4000000022352,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 115,
              "y": 88,
              "w": 5,
              "h": 120,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                115,
                175,
                115,
                197,
                117,
                208
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 115,
              "y": 88,
              "w": 5,
              "h": 58,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1067.4000000022352,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 115,
              "y": 88,
              "w": 5,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                117,
                209
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 115,
              "y": 88,
              "w": 5,
              "h": 120,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1101.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 108,
              "y": 88,
              "w": 12,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                117,
                208,
                114,
                202,
                108,
                195
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 115,
              "y": 88,
              "w": 5,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1150.6000000014901,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 85,
              "y": 88,
              "w": 35,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                99,
                187,
                90,
                183,
                85,
                183
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 108,
              "y": 88,
              "w": 12,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1200.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 36,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                84,
                183,
                84,
                184,
                84,
                186
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 85,
              "y": 88,
              "w": 35,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1250.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 36,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                86,
                188,
                91,
                190,
                101,
                191
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 36,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1300.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 61,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                114,
                191,
                131,
                189,
                145,
                185
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 36,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1350.6000000014901,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 67,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                150,
                181,
                151,
                178,
                151,
                175
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 61,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1400.4000000022352,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 67,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                149,
                172,
                148,
                169,
                146,
                168
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 67,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1450.6000000014901,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 67,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                145,
                168,
                144,
                168,
                140,
                171
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 67,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1500.7000000029802,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 67,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                135,
                180,
                131,
                191,
                130,
                201
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 67,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1550.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 67,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                131,
                206,
                134,
                208,
                138,
                209
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 67,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1600.7000000029802,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 86,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                145,
                207,
                156,
                200,
                170,
                189
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 67,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1651,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 111,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                180,
                176,
                188,
                160,
                195,
                142
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 86,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1701,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 128,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                201,
                120,
                208,
                99,
                212,
                87
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 88,
              "w": 111,
              "h": 121,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1777.4000000022352,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 128,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                212,
                88,
                211,
                91,
                206,
                102
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 128,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1817.7000000029802,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 128,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                199,
                117,
                190,
                138,
                182,
                155
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 128,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1867.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 128,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                177,
                174,
                175,
                189,
                175,
                200
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 128,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1919.4000000022352,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 128,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                176,
                203,
                178,
                205,
                182,
                205
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 128,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1967.9000000022352,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 138,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                190,
                200,
                206,
                186,
                222,
                169
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 128,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2017.6000000014901,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 170,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                240,
                144,
                250,
                123,
                254,
                103
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 138,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2068.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 172,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                256,
                84,
                255,
                75
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 87,
              "w": 170,
              "h": 122,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2117.10000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 172,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                254,
                75,
                250,
                82,
                242,
                98
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 172,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2166.900000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 172,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                230,
                124,
                220,
                153,
                217,
                174
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 172,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2216.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 172,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                217,
                187,
                219,
                193,
                222,
                195
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 172,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2267.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 172,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                224,
                195,
                231,
                193,
                241,
                186
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 172,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2318.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 180,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                253,
                176,
                262,
                166,
                264,
                162
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 172,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195,
                224,
                195,
                231,
                193,
                241,
                186
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2398.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 180,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                264,
                163,
                262,
                168,
                259,
                176
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 180,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195,
                224,
                195,
                231,
                193,
                241,
                186,
                253,
                176,
                262,
                166,
                264,
                162
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2435.2000000029802,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 180,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                259,
                186,
                259,
                192,
                262,
                195
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 180,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195,
                224,
                195,
                231,
                193,
                241,
                186,
                253,
                176,
                262,
                166,
                264,
                162,
                264,
                163,
                262,
                168,
                259,
                176
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2483.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 190,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                264,
                195,
                269,
                192,
                274,
                185
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 180,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195,
                224,
                195,
                231,
                193,
                241,
                186,
                253,
                176,
                262,
                166,
                264,
                162,
                264,
                163,
                262,
                168,
                259,
                176,
                259,
                186,
                259,
                192,
                262,
                195
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2535.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 195,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                278,
                176,
                279,
                167,
                277,
                160
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 190,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195,
                224,
                195,
                231,
                193,
                241,
                186,
                253,
                176,
                262,
                166,
                264,
                162,
                264,
                163,
                262,
                168,
                259,
                176,
                259,
                186,
                259,
                192,
                262,
                195,
                264,
                195,
                269,
                192,
                274,
                185
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2583.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 195,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                271,
                156,
                267,
                156,
                264,
                160
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 195,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195,
                224,
                195,
                231,
                193,
                241,
                186,
                253,
                176,
                262,
                166,
                264,
                162,
                264,
                163,
                262,
                168,
                259,
                176,
                259,
                186,
                259,
                192,
                262,
                195,
                264,
                195,
                269,
                192,
                274,
                185,
                278,
                176,
                279,
                167,
                277,
                160
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2633.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 195,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                263,
                168,
                264,
                175,
                268,
                179
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 195,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195,
                224,
                195,
                231,
                193,
                241,
                186,
                253,
                176,
                262,
                166,
                264,
                162,
                264,
                163,
                262,
                168,
                259,
                176,
                259,
                186,
                259,
                192,
                262,
                195,
                264,
                195,
                269,
                192,
                274,
                185,
                278,
                176,
                279,
                167,
                277,
                160,
                271,
                156,
                267,
                156,
                264,
                160
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2683.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 203,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                273,
                180,
                280,
                178,
                287,
                173
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 195,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195,
                224,
                195,
                231,
                193,
                241,
                186,
                253,
                176,
                262,
                166,
                264,
                162,
                264,
                163,
                262,
                168,
                259,
                176,
                259,
                186,
                259,
                192,
                262,
                195,
                264,
                195,
                269,
                192,
                274,
                185,
                278,
                176,
                279,
                167,
                277,
                160,
                271,
                156,
                267,
                156,
                264,
                160,
                263,
                168,
                264,
                175,
                268,
                179
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2732.7000000029802,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 208,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                292,
                168,
                292,
                166
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 203,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195,
                224,
                195,
                231,
                193,
                241,
                186,
                253,
                176,
                262,
                166,
                264,
                162,
                264,
                163,
                262,
                168,
                259,
                176,
                259,
                186,
                259,
                192,
                262,
                195,
                264,
                195,
                269,
                192,
                274,
                185,
                278,
                176,
                279,
                167,
                277,
                160,
                271,
                156,
                267,
                156,
                264,
                160,
                263,
                168,
                264,
                175,
                268,
                179,
                273,
                180,
                280,
                178,
                287,
                173
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2816.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 209,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                293,
                165
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 208,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195,
                224,
                195,
                231,
                193,
                241,
                186,
                253,
                176,
                262,
                166,
                264,
                162,
                264,
                163,
                262,
                168,
                259,
                176,
                259,
                186,
                259,
                192,
                262,
                195,
                264,
                195,
                269,
                192,
                274,
                185,
                278,
                176,
                279,
                167,
                277,
                160,
                271,
                156,
                267,
                156,
                264,
                160,
                263,
                168,
                264,
                175,
                268,
                179,
                273,
                180,
                280,
                178,
                287,
                173,
                292,
                168,
                292,
                166
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2983.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 209,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 2,
              "coords": [
                293,
                165
              ]
            },
            {
              "t": 1,
              "i": "1_16875366995044",
              "x": 84,
              "y": 75,
              "w": 209,
              "h": 134,
              "z": 1687536699506,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 1,
              "coords": [
                120,
                88,
                120,
                94,
                117,
                114,
                115,
                146,
                115,
                175,
                115,
                197,
                117,
                208,
                117,
                209,
                117,
                208,
                114,
                202,
                108,
                195,
                99,
                187,
                90,
                183,
                85,
                183,
                84,
                183,
                84,
                184,
                84,
                186,
                86,
                188,
                91,
                190,
                101,
                191,
                114,
                191,
                131,
                189,
                145,
                185,
                150,
                181,
                151,
                178,
                151,
                175,
                149,
                172,
                148,
                169,
                146,
                168,
                145,
                168,
                144,
                168,
                140,
                171,
                135,
                180,
                131,
                191,
                130,
                201,
                131,
                206,
                134,
                208,
                138,
                209,
                145,
                207,
                156,
                200,
                170,
                189,
                180,
                176,
                188,
                160,
                195,
                142,
                201,
                120,
                208,
                99,
                212,
                87,
                212,
                88,
                211,
                91,
                206,
                102,
                199,
                117,
                190,
                138,
                182,
                155,
                177,
                174,
                175,
                189,
                175,
                200,
                176,
                203,
                178,
                205,
                182,
                205,
                190,
                200,
                206,
                186,
                222,
                169,
                240,
                144,
                250,
                123,
                254,
                103,
                256,
                84,
                255,
                75,
                254,
                75,
                250,
                82,
                242,
                98,
                230,
                124,
                220,
                153,
                217,
                174,
                217,
                187,
                219,
                193,
                222,
                195,
                224,
                195,
                231,
                193,
                241,
                186,
                253,
                176,
                262,
                166,
                264,
                162,
                264,
                163,
                262,
                168,
                259,
                176,
                259,
                186,
                259,
                192,
                262,
                195,
                264,
                195,
                269,
                192,
                274,
                185,
                278,
                176,
                279,
                167,
                277,
                160,
                271,
                156,
                267,
                156,
                264,
                160,
                263,
                168,
                264,
                175,
                268,
                179,
                273,
                180,
                280,
                178,
                287,
                173,
                292,
                168,
                292,
                166,
                293,
                165
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3220.5,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 1,
            "i": "1_16875367018005",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687536701803,
            "l": "layer_1687536696552_1",
            "style": {
              "a": "#ff0000",
              "c": "round",
              "f": "round",
              "g": 3
            },
            "status": {
              "e": 1
            },
            "dotsType": 1,
            "coords": []
          }
        ]
      }
    },
    {
      "timeStamp": 3220.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 370,
              "y": 158,
              "w": 0,
              "h": 0,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                370,
                158
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": []
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3267.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 364,
              "y": 158,
              "w": 6,
              "h": 14,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                369,
                159,
                367,
                165,
                364,
                172
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 370,
              "y": 158,
              "w": 0,
              "h": 0,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3317.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 9,
              "h": 31,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                362,
                180,
                361,
                186,
                363,
                189
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 364,
              "y": 158,
              "w": 6,
              "h": 14,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3367.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 13,
              "h": 31,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                366,
                189,
                368,
                189,
                374,
                186
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 9,
              "h": 31,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3417.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 30,
              "h": 31,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                381,
                179,
                387,
                172,
                391,
                167
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 13,
              "h": 31,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3466.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 30,
              "h": 31,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                391,
                166
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 30,
              "h": 31,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3500.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 30,
              "h": 31,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                391,
                167,
                391,
                173,
                391,
                180
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 30,
              "h": 31,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3550.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 38,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                394,
                186,
                396,
                190,
                399,
                190
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 30,
              "h": 31,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3600.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 50,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                403,
                188,
                408,
                182,
                411,
                174
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 38,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3650.7000000029802,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 50,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                411,
                167,
                409,
                161,
                407,
                158
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 50,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3717.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 50,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                407,
                159,
                407,
                163,
                411,
                166
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 50,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3767.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 75,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                418,
                169,
                427,
                169,
                436,
                169
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 50,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3817.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 84,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                443,
                167,
                445,
                166,
                445,
                165
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 75,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3900.7000000029802,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 84,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                444,
                165,
                440,
                167,
                436,
                171
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 84,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 3950.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 84,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                432,
                175,
                431,
                179,
                431,
                181
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 84,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4000.7000000029802,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 84,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                431,
                182,
                434,
                183,
                444,
                182
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 84,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4050.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 107,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                455,
                178,
                464,
                173,
                468,
                168
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 84,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4100.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 153,
              "w": 107,
              "h": 37,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                468,
                163,
                464,
                157,
                459,
                153
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 158,
              "w": 107,
              "h": 32,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4150.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 107,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                456,
                151,
                456,
                156
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 153,
              "w": 107,
              "h": 37,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4200.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 107,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                457,
                160,
                461,
                164,
                466,
                165
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 107,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153,
                456,
                151,
                456,
                156
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4250.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 118,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                473,
                165,
                478,
                163,
                479,
                162
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 107,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153,
                456,
                151,
                456,
                156,
                457,
                160,
                461,
                164,
                466,
                165
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4328.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 123,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                480,
                162,
                482,
                163,
                484,
                167
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 118,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153,
                456,
                151,
                456,
                156,
                457,
                160,
                461,
                164,
                466,
                165,
                473,
                165,
                478,
                163,
                479,
                162
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4367.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 125,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                486,
                172,
                486,
                178,
                484,
                182
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 123,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153,
                456,
                151,
                456,
                156,
                457,
                160,
                461,
                164,
                466,
                165,
                473,
                165,
                478,
                163,
                479,
                162,
                480,
                162,
                482,
                163,
                484,
                167
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4418,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 125,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                481,
                183
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 125,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153,
                456,
                151,
                456,
                156,
                457,
                160,
                461,
                164,
                466,
                165,
                473,
                165,
                478,
                163,
                479,
                162,
                480,
                162,
                482,
                163,
                484,
                167,
                486,
                172,
                486,
                178,
                484,
                182
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4467.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 125,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                481,
                182,
                481,
                180,
                482,
                174,
                486,
                162
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 125,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153,
                456,
                151,
                456,
                156,
                457,
                160,
                461,
                164,
                466,
                165,
                473,
                165,
                478,
                163,
                479,
                162,
                480,
                162,
                482,
                163,
                484,
                167,
                486,
                172,
                486,
                178,
                484,
                182,
                481,
                183
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4517.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 145,
              "w": 151,
              "h": 45,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                493,
                153,
                502,
                147,
                512,
                145
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 151,
              "w": 125,
              "h": 39,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153,
                456,
                151,
                456,
                156,
                457,
                160,
                461,
                164,
                466,
                165,
                473,
                165,
                478,
                163,
                479,
                162,
                480,
                162,
                482,
                163,
                484,
                167,
                486,
                172,
                486,
                178,
                484,
                182,
                481,
                183,
                481,
                182,
                481,
                180,
                482,
                174,
                486,
                162
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4567.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 145,
              "w": 163,
              "h": 45,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                518,
                147,
                522,
                154,
                524,
                162
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 145,
              "w": 151,
              "h": 45,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153,
                456,
                151,
                456,
                156,
                457,
                160,
                461,
                164,
                466,
                165,
                473,
                165,
                478,
                163,
                479,
                162,
                480,
                162,
                482,
                163,
                484,
                167,
                486,
                172,
                486,
                178,
                484,
                182,
                481,
                183,
                481,
                182,
                481,
                180,
                482,
                174,
                486,
                162,
                493,
                153,
                502,
                147,
                512,
                145
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4616.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 145,
              "w": 163,
              "h": 45,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                524,
                166,
                524,
                167
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 145,
              "w": 163,
              "h": 45,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153,
                456,
                151,
                456,
                156,
                457,
                160,
                461,
                164,
                466,
                165,
                473,
                165,
                478,
                163,
                479,
                162,
                480,
                162,
                482,
                163,
                484,
                167,
                486,
                172,
                486,
                178,
                484,
                182,
                481,
                183,
                481,
                182,
                481,
                180,
                482,
                174,
                486,
                162,
                493,
                153,
                502,
                147,
                512,
                145,
                518,
                147,
                522,
                154,
                524,
                162
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4676.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 145,
              "w": 163,
              "h": 45,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                524,
                166,
                524,
                164,
                524,
                161
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 145,
              "w": 163,
              "h": 45,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153,
                456,
                151,
                456,
                156,
                457,
                160,
                461,
                164,
                466,
                165,
                473,
                165,
                478,
                163,
                479,
                162,
                480,
                162,
                482,
                163,
                484,
                167,
                486,
                172,
                486,
                178,
                484,
                182,
                481,
                183,
                481,
                182,
                481,
                180,
                482,
                174,
                486,
                162,
                493,
                153,
                502,
                147,
                512,
                145,
                518,
                147,
                522,
                154,
                524,
                162,
                524,
                166,
                524,
                167
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4712.10000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 145,
              "w": 164,
              "h": 45,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 2,
              "coords": [
                525,
                157,
                525,
                157
              ]
            },
            {
              "t": 1,
              "i": "1_16875367018005",
              "x": 361,
              "y": 145,
              "w": 163,
              "h": 45,
              "z": 1687536701803,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                370,
                158,
                369,
                159,
                367,
                165,
                364,
                172,
                362,
                180,
                361,
                186,
                363,
                189,
                366,
                189,
                368,
                189,
                374,
                186,
                381,
                179,
                387,
                172,
                391,
                167,
                391,
                166,
                391,
                167,
                391,
                173,
                391,
                180,
                394,
                186,
                396,
                190,
                399,
                190,
                403,
                188,
                408,
                182,
                411,
                174,
                411,
                167,
                409,
                161,
                407,
                158,
                407,
                159,
                407,
                163,
                411,
                166,
                418,
                169,
                427,
                169,
                436,
                169,
                443,
                167,
                445,
                166,
                445,
                165,
                444,
                165,
                440,
                167,
                436,
                171,
                432,
                175,
                431,
                179,
                431,
                181,
                431,
                182,
                434,
                183,
                444,
                182,
                455,
                178,
                464,
                173,
                468,
                168,
                468,
                163,
                464,
                157,
                459,
                153,
                456,
                151,
                456,
                156,
                457,
                160,
                461,
                164,
                466,
                165,
                473,
                165,
                478,
                163,
                479,
                162,
                480,
                162,
                482,
                163,
                484,
                167,
                486,
                172,
                486,
                178,
                484,
                182,
                481,
                183,
                481,
                182,
                481,
                180,
                482,
                174,
                486,
                162,
                493,
                153,
                502,
                147,
                512,
                145,
                518,
                147,
                522,
                154,
                524,
                162,
                524,
                166,
                524,
                167,
                524,
                166,
                524,
                164,
                524,
                161
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 4993.5,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 1,
            "i": "1_16875367035736",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687536703577,
            "l": "layer_1687536696552_1",
            "style": {
              "a": "#ff0000",
              "c": "round",
              "f": "round",
              "g": 3
            },
            "status": {
              "e": 1
            },
            "dotsType": 1,
            "coords": []
          }
        ]
      }
    },
    {
      "timeStamp": 4993.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 571,
              "y": 95,
              "w": 0,
              "h": 0,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                571,
                95
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": []
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5033.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 561,
              "y": 95,
              "w": 10,
              "h": 15,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                570,
                95,
                567,
                100,
                561,
                110
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 571,
              "y": 95,
              "w": 0,
              "h": 0,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5083.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 543,
              "y": 95,
              "w": 28,
              "h": 60,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                554,
                125,
                548,
                141,
                543,
                155
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 561,
              "y": 95,
              "w": 10,
              "h": 15,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5133.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 35,
              "h": 90,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                538,
                169,
                536,
                179,
                536,
                185
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 543,
              "y": 95,
              "w": 28,
              "h": 60,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5183.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 35,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                536,
                189,
                537,
                190,
                539,
                190
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 35,
              "h": 90,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5233.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 35,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                541,
                190,
                548,
                184,
                559,
                176
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 35,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5282.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 44,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                572,
                167,
                580,
                160
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 35,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5316.900000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 47,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                582,
                156,
                583,
                155
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 44,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5400.10000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 47,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                582,
                158,
                579,
                164,
                576,
                171
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 47,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5450,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 47,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                574,
                179,
                574,
                185,
                575,
                186
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 47,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155,
                582,
                158,
                579,
                164,
                576,
                171
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5500.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 47,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                576,
                186,
                577,
                186,
                578,
                186
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 47,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155,
                582,
                158,
                579,
                164,
                576,
                171,
                574,
                179,
                574,
                185,
                575,
                186
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5550.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 58,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                582,
                185,
                587,
                181,
                594,
                174
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 47,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155,
                582,
                158,
                579,
                164,
                576,
                171,
                574,
                179,
                574,
                185,
                575,
                186,
                576,
                186,
                577,
                186,
                578,
                186
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5600.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 69,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                601,
                163,
                604,
                151,
                605,
                136
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 58,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155,
                582,
                158,
                579,
                164,
                576,
                171,
                574,
                179,
                574,
                185,
                575,
                186,
                576,
                186,
                577,
                186,
                578,
                186,
                582,
                185,
                587,
                181,
                594,
                174
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5650.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 88,
              "w": 69,
              "h": 102,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                605,
                119,
                604,
                104,
                603,
                88
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 95,
              "w": 69,
              "h": 95,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155,
                582,
                158,
                579,
                164,
                576,
                171,
                574,
                179,
                574,
                185,
                575,
                186,
                576,
                186,
                577,
                186,
                578,
                186,
                582,
                185,
                587,
                181,
                594,
                174,
                601,
                163,
                604,
                151,
                605,
                136
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5700.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 80,
              "w": 69,
              "h": 110,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                603,
                80,
                603,
                81
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 88,
              "w": 69,
              "h": 102,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155,
                582,
                158,
                579,
                164,
                576,
                171,
                574,
                179,
                574,
                185,
                575,
                186,
                576,
                186,
                577,
                186,
                578,
                186,
                582,
                185,
                587,
                181,
                594,
                174,
                601,
                163,
                604,
                151,
                605,
                136,
                605,
                119,
                604,
                104,
                603,
                88
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5750.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 80,
              "w": 69,
              "h": 110,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                602,
                93,
                599,
                108,
                596,
                125
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 80,
              "w": 69,
              "h": 110,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155,
                582,
                158,
                579,
                164,
                576,
                171,
                574,
                179,
                574,
                185,
                575,
                186,
                576,
                186,
                577,
                186,
                578,
                186,
                582,
                185,
                587,
                181,
                594,
                174,
                601,
                163,
                604,
                151,
                605,
                136,
                605,
                119,
                604,
                104,
                603,
                88,
                603,
                80,
                603,
                81
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5800.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 80,
              "w": 69,
              "h": 110,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                593,
                142,
                593,
                157,
                593,
                170
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 80,
              "w": 69,
              "h": 110,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155,
                582,
                158,
                579,
                164,
                576,
                171,
                574,
                179,
                574,
                185,
                575,
                186,
                576,
                186,
                577,
                186,
                578,
                186,
                582,
                185,
                587,
                181,
                594,
                174,
                601,
                163,
                604,
                151,
                605,
                136,
                605,
                119,
                604,
                104,
                603,
                88,
                603,
                80,
                603,
                81,
                602,
                93,
                599,
                108,
                596,
                125
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5850.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 80,
              "w": 69,
              "h": 110,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                598,
                179,
                600,
                181,
                601,
                181
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 80,
              "w": 69,
              "h": 110,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155,
                582,
                158,
                579,
                164,
                576,
                171,
                574,
                179,
                574,
                185,
                575,
                186,
                576,
                186,
                577,
                186,
                578,
                186,
                582,
                185,
                587,
                181,
                594,
                174,
                601,
                163,
                604,
                151,
                605,
                136,
                605,
                119,
                604,
                104,
                603,
                88,
                603,
                80,
                603,
                81,
                602,
                93,
                599,
                108,
                596,
                125,
                593,
                142,
                593,
                157,
                593,
                170
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5900.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 80,
              "w": 98,
              "h": 110,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                605,
                179,
                617,
                169,
                634,
                156
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 80,
              "w": 69,
              "h": 110,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155,
                582,
                158,
                579,
                164,
                576,
                171,
                574,
                179,
                574,
                185,
                575,
                186,
                576,
                186,
                577,
                186,
                578,
                186,
                582,
                185,
                587,
                181,
                594,
                174,
                601,
                163,
                604,
                151,
                605,
                136,
                605,
                119,
                604,
                104,
                603,
                88,
                603,
                80,
                603,
                81,
                602,
                93,
                599,
                108,
                596,
                125,
                593,
                142,
                593,
                157,
                593,
                170,
                598,
                179,
                600,
                181,
                601,
                181
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5950.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 80,
              "w": 119,
              "h": 110,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 2,
              "coords": [
                651,
                144,
                655,
                140,
                655,
                140
              ]
            },
            {
              "t": 1,
              "i": "1_16875367035736",
              "x": 536,
              "y": 80,
              "w": 98,
              "h": 110,
              "z": 1687536703577,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                571,
                95,
                570,
                95,
                567,
                100,
                561,
                110,
                554,
                125,
                548,
                141,
                543,
                155,
                538,
                169,
                536,
                179,
                536,
                185,
                536,
                189,
                537,
                190,
                539,
                190,
                541,
                190,
                548,
                184,
                559,
                176,
                572,
                167,
                580,
                160,
                582,
                156,
                583,
                155,
                582,
                158,
                579,
                164,
                576,
                171,
                574,
                179,
                574,
                185,
                575,
                186,
                576,
                186,
                577,
                186,
                578,
                186,
                582,
                185,
                587,
                181,
                594,
                174,
                601,
                163,
                604,
                151,
                605,
                136,
                605,
                119,
                604,
                104,
                603,
                88,
                603,
                80,
                603,
                81,
                602,
                93,
                599,
                108,
                596,
                125,
                593,
                142,
                593,
                157,
                593,
                170,
                598,
                179,
                600,
                181,
                601,
                181,
                605,
                179,
                617,
                169,
                634,
                156
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 6548.60000000149,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 1,
            "i": "1_16875367051287",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687536705133,
            "l": "layer_1687536696552_1",
            "style": {
              "a": "#ff0000",
              "c": "round",
              "f": "round",
              "g": 3
            },
            "status": {
              "e": 1
            },
            "dotsType": 1,
            "coords": []
          }
        ]
      }
    },
    {
      "timeStamp": 6548.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367051287",
              "x": 681,
              "y": 79,
              "w": 0,
              "h": 0,
              "z": 1687536705133,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                681,
                79
              ]
            },
            {
              "t": 1,
              "i": "1_16875367051287",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "z": 1687536705133,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": []
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 6600.10000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367051287",
              "x": 680,
              "y": 79,
              "w": 2,
              "h": 31,
              "z": 1687536705133,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                682,
                85,
                682,
                97,
                680,
                110
              ]
            },
            {
              "t": 1,
              "i": "1_16875367051287",
              "x": 681,
              "y": 79,
              "w": 0,
              "h": 0,
              "z": 1687536705133,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                681,
                79
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 6650,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367051287",
              "x": 673,
              "y": 79,
              "w": 9,
              "h": 78,
              "z": 1687536705133,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                677,
                126,
                675,
                141,
                673,
                157
              ]
            },
            {
              "t": 1,
              "i": "1_16875367051287",
              "x": 680,
              "y": 79,
              "w": 2,
              "h": 31,
              "z": 1687536705133,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                681,
                79,
                682,
                85,
                682,
                97,
                680,
                110
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 6699.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367051287",
              "x": 673,
              "y": 79,
              "w": 9,
              "h": 93,
              "z": 1687536705133,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 2,
              "coords": [
                673,
                168,
                673,
                172,
                673,
                172
              ]
            },
            {
              "t": 1,
              "i": "1_16875367051287",
              "x": 673,
              "y": 79,
              "w": 9,
              "h": 78,
              "z": 1687536705133,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                681,
                79,
                682,
                85,
                682,
                97,
                680,
                110,
                677,
                126,
                675,
                141,
                673,
                157
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 6811.800000000745,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 1,
            "i": "1_16875367053928",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687536705398,
            "l": "layer_1687536696552_1",
            "style": {
              "a": "#ff0000",
              "c": "round",
              "f": "round",
              "g": 3
            },
            "status": {
              "e": 1
            },
            "dotsType": 1,
            "coords": []
          }
        ]
      }
    },
    {
      "timeStamp": 6811.900000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367053928",
              "x": 673,
              "y": 176,
              "w": 0,
              "h": 0,
              "z": 1687536705398,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                673,
                176
              ]
            },
            {
              "t": 1,
              "i": "1_16875367053928",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "z": 1687536705398,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": []
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 6866.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367053928",
              "x": 673,
              "y": 176,
              "w": 0,
              "h": 8,
              "z": 1687536705398,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                673,
                179,
                673,
                182,
                673,
                184
              ]
            },
            {
              "t": 1,
              "i": "1_16875367053928",
              "x": 673,
              "y": 176,
              "w": 0,
              "h": 0,
              "z": 1687536705398,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                673,
                176
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 6916.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367053928",
              "x": 673,
              "y": 176,
              "w": 1,
              "h": 12,
              "z": 1687536705398,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 2,
              "coords": [
                674,
                187,
                674,
                188,
                674,
                188
              ]
            },
            {
              "t": 1,
              "i": "1_16875367053928",
              "x": 673,
              "y": 176,
              "w": 0,
              "h": 8,
              "z": 1687536705398,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                673,
                176,
                673,
                179,
                673,
                182,
                673,
                184
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7519.400000002235,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 1,
            "i": "1_16875367060999",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687536706106,
            "l": "layer_1687536696552_1",
            "style": {
              "a": "#ff0000",
              "c": "round",
              "f": "round",
              "g": 3
            },
            "status": {
              "e": 1
            },
            "dotsType": 1,
            "coords": []
          }
        ]
      }
    },
    {
      "timeStamp": 7519.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 197,
              "y": 293,
              "w": 0,
              "h": 0,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                197,
                293
              ]
            },
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": []
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7583.5,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 197,
              "y": 292,
              "w": 21,
              "h": 2,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                199,
                292,
                208,
                292,
                218,
                294
              ]
            },
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 197,
              "y": 293,
              "w": 0,
              "h": 0,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                197,
                293
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7633.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 197,
              "y": 292,
              "w": 37,
              "h": 35,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                227,
                301,
                232,
                313,
                234,
                327
              ]
            },
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 197,
              "y": 292,
              "w": 21,
              "h": 2,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                197,
                293,
                199,
                292,
                208,
                292,
                218,
                294
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7683.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 197,
              "y": 292,
              "w": 37,
              "h": 67,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                233,
                341,
                229,
                353,
                228,
                359
              ]
            },
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 197,
              "y": 292,
              "w": 37,
              "h": 35,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                197,
                293,
                199,
                292,
                208,
                292,
                218,
                294,
                227,
                301,
                232,
                313,
                234,
                327
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7732.900000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 197,
              "y": 292,
              "w": 37,
              "h": 70,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                227,
                362
              ]
            },
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 197,
              "y": 292,
              "w": 37,
              "h": 67,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                197,
                293,
                199,
                292,
                208,
                292,
                218,
                294,
                227,
                301,
                232,
                313,
                234,
                327,
                233,
                341,
                229,
                353,
                228,
                359
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7783.10000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 197,
              "y": 292,
              "w": 37,
              "h": 70,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 2,
              "coords": [
                227,
                361,
                229,
                357,
                230,
                355,
                230,
                355
              ]
            },
            {
              "t": 1,
              "i": "1_16875367060999",
              "x": 197,
              "y": 292,
              "w": 37,
              "h": 70,
              "z": 1687536706106,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                197,
                293,
                199,
                292,
                208,
                292,
                218,
                294,
                227,
                301,
                232,
                313,
                234,
                327,
                233,
                341,
                229,
                353,
                228,
                359,
                227,
                362
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 9946.300000000745,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 1,
            "i": "1_168753670852610",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687536708534,
            "l": "layer_1687536696552_1",
            "style": {
              "a": "#ff0000",
              "c": "round",
              "f": "round",
              "g": 3
            },
            "status": {
              "e": 1
            },
            "dotsType": 1,
            "coords": []
          }
        ]
      }
    },
    {
      "timeStamp": 9946.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 232,
              "y": 386,
              "w": 0,
              "h": 0,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                232,
                386
              ]
            },
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": []
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 9984.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 232,
              "y": 386,
              "w": 11,
              "h": 14,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                233,
                388,
                237,
                393,
                243,
                400
              ]
            },
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 232,
              "y": 386,
              "w": 0,
              "h": 0,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                232,
                386
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 10034.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 232,
              "y": 386,
              "w": 42,
              "h": 31,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                251,
                407,
                262,
                413,
                274,
                417
              ]
            },
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 232,
              "y": 386,
              "w": 11,
              "h": 14,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                232,
                386,
                233,
                388,
                237,
                393,
                243,
                400
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 10084.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 232,
              "y": 386,
              "w": 99,
              "h": 31,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                288,
                417,
                308,
                410,
                331,
                394
              ]
            },
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 232,
              "y": 386,
              "w": 42,
              "h": 31,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                232,
                386,
                233,
                388,
                237,
                393,
                243,
                400,
                251,
                407,
                262,
                413,
                274,
                417
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 10134.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 232,
              "y": 355,
              "w": 132,
              "h": 62,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                352,
                376,
                362,
                362,
                364,
                355
              ]
            },
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 232,
              "y": 386,
              "w": 99,
              "h": 31,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                232,
                386,
                233,
                388,
                237,
                393,
                243,
                400,
                251,
                407,
                262,
                413,
                274,
                417,
                288,
                417,
                308,
                410,
                331,
                394
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 10184.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 232,
              "y": 352,
              "w": 132,
              "h": 65,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 2,
              "coords": [
                364,
                352,
                364,
                352
              ]
            },
            {
              "t": 1,
              "i": "1_168753670852610",
              "x": 232,
              "y": 355,
              "w": 132,
              "h": 62,
              "z": 1687536708534,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                232,
                386,
                233,
                388,
                237,
                393,
                243,
                400,
                251,
                407,
                262,
                413,
                274,
                417,
                288,
                417,
                308,
                410,
                331,
                394,
                352,
                376,
                362,
                362,
                364,
                355
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11151.70000000298,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 1,
            "i": "1_168753670973111",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687536709740,
            "l": "layer_1687536696552_1",
            "style": {
              "a": "#ff0000",
              "c": "round",
              "f": "round",
              "g": 3
            },
            "status": {
              "e": 1
            },
            "dotsType": 1,
            "coords": []
          }
        ]
      }
    },
    {
      "timeStamp": 11151.900000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 387,
              "y": 307,
              "w": 0,
              "h": 0,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                387,
                307
              ]
            },
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": []
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11186.10000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 387,
              "y": 303,
              "w": 0,
              "h": 4,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                387,
                306,
                387,
                305,
                387,
                303
              ]
            },
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 387,
              "y": 307,
              "w": 0,
              "h": 0,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                387,
                307
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11234.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 387,
              "y": 290,
              "w": 31,
              "h": 17,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                391,
                299,
                403,
                294,
                418,
                290
              ]
            },
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 387,
              "y": 303,
              "w": 0,
              "h": 4,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                387,
                307,
                387,
                306,
                387,
                305,
                387,
                303
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11284.20000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 387,
              "y": 289,
              "w": 57,
              "h": 18,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                431,
                289,
                440,
                290,
                444,
                295
              ]
            },
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 387,
              "y": 290,
              "w": 31,
              "h": 17,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                387,
                307,
                387,
                306,
                387,
                305,
                387,
                303,
                391,
                299,
                403,
                294,
                418,
                290
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11334,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 387,
              "y": 289,
              "w": 59,
              "h": 22,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                445,
                301,
                446,
                308,
                446,
                311
              ]
            },
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 387,
              "y": 289,
              "w": 57,
              "h": 18,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                387,
                307,
                387,
                306,
                387,
                305,
                387,
                303,
                391,
                299,
                403,
                294,
                418,
                290,
                431,
                289,
                440,
                290,
                444,
                295
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11410.10000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 387,
              "y": 289,
              "w": 59,
              "h": 22,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 2,
              "coords": [
                446,
                311
              ]
            },
            {
              "t": 1,
              "i": "1_168753670973111",
              "x": 387,
              "y": 289,
              "w": 59,
              "h": 22,
              "z": 1687536709740,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 1,
              "coords": [
                387,
                307,
                387,
                306,
                387,
                305,
                387,
                303,
                391,
                299,
                403,
                294,
                418,
                290,
                431,
                289,
                440,
                290,
                444,
                295,
                445,
                301,
                446,
                308,
                446,
                311
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11628.60000000149,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 1,
            "i": "1_168753671020812",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687536710218,
            "l": "layer_1687536696552_1",
            "style": {
              "a": "#ff0000",
              "c": "round",
              "f": "round",
              "g": 3
            },
            "status": {
              "e": 1
            },
            "dotsType": 1,
            "coords": []
          }
        ]
      }
    },
    {
      "timeStamp": 11628.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 480,
              "y": 306,
              "w": 0,
              "h": 0,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                480,
                306
              ]
            },
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": []
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11683.60000000149,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 480,
              "y": 295,
              "w": 7,
              "h": 11,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                480,
                305,
                480,
                301,
                487,
                295
              ]
            },
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 480,
              "y": 306,
              "w": 0,
              "h": 0,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                480,
                306
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11732.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 480,
              "y": 286,
              "w": 30,
              "h": 20,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                497,
                290,
                510,
                286
              ]
            },
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 480,
              "y": 295,
              "w": 7,
              "h": 11,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                480,
                306,
                480,
                305,
                480,
                301,
                487,
                295
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11766.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 480,
              "y": 285,
              "w": 49,
              "h": 21,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                521,
                285,
                526,
                288,
                529,
                294
              ]
            },
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 480,
              "y": 286,
              "w": 30,
              "h": 20,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                480,
                306,
                480,
                305,
                480,
                301,
                487,
                295,
                497,
                290,
                510,
                286
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11816.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 480,
              "y": 285,
              "w": 52,
              "h": 24,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                530,
                301,
                532,
                306,
                532,
                309
              ]
            },
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 480,
              "y": 285,
              "w": 49,
              "h": 21,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                480,
                306,
                480,
                305,
                480,
                301,
                487,
                295,
                497,
                290,
                510,
                286,
                521,
                285,
                526,
                288,
                529,
                294
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11896.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 480,
              "y": 285,
              "w": 52,
              "h": 24,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 2,
              "coords": [
                532,
                309
              ]
            },
            {
              "t": 1,
              "i": "1_168753671020812",
              "x": 480,
              "y": 285,
              "w": 52,
              "h": 24,
              "z": 1687536710218,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 1,
              "coords": [
                480,
                306,
                480,
                305,
                480,
                301,
                487,
                295,
                497,
                290,
                510,
                286,
                521,
                285,
                526,
                288,
                529,
                294,
                530,
                301,
                532,
                306,
                532,
                309
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12253.300000000745,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 1,
            "i": "1_168753671083313",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687536710844,
            "l": "layer_1687536696552_1",
            "style": {
              "a": "#ff0000",
              "c": "round",
              "f": "round",
              "g": 3
            },
            "status": {
              "e": 1
            },
            "dotsType": 1,
            "coords": []
          }
        ]
      }
    },
    {
      "timeStamp": 12253.400000002235,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753671083313",
              "x": 413,
              "y": 347,
              "w": 0,
              "h": 0,
              "z": 1687536710844,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                413,
                347
              ]
            },
            {
              "t": 1,
              "i": "1_168753671083313",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0,
              "z": 1687536710844,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": []
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12301.70000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753671083313",
              "x": 413,
              "y": 347,
              "w": 12,
              "h": 18,
              "z": 1687536710844,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                415,
                351,
                418,
                358,
                425,
                365
              ]
            },
            {
              "t": 1,
              "i": "1_168753671083313",
              "x": 413,
              "y": 347,
              "w": 0,
              "h": 0,
              "z": 1687536710844,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                413,
                347
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12351.300000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753671083313",
              "x": 413,
              "y": 347,
              "w": 62,
              "h": 26,
              "z": 1687536710844,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                437,
                370,
                454,
                373,
                475,
                372
              ]
            },
            {
              "t": 1,
              "i": "1_168753671083313",
              "x": 413,
              "y": 347,
              "w": 12,
              "h": 18,
              "z": 1687536710844,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                413,
                347,
                415,
                351,
                418,
                358,
                425,
                365
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12400.20000000298,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753671083313",
              "x": 413,
              "y": 347,
              "w": 84,
              "h": 26,
              "z": 1687536710844,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 2,
              "coords": [
                488,
                367,
                496,
                362,
                497,
                358
              ]
            },
            {
              "t": 1,
              "i": "1_168753671083313",
              "x": 413,
              "y": 347,
              "w": 62,
              "h": 26,
              "z": 1687536710844,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                413,
                347,
                415,
                351,
                418,
                358,
                425,
                365,
                437,
                370,
                454,
                373,
                475,
                372
              ]
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12449.800000000745,
      "type": "SHAPES_CHANGED",
      "detail": {
        "shapeType": "TOOL_PEN",
        "shapeDatas": [
          [
            {
              "t": 1,
              "i": "1_168753671083313",
              "x": 413,
              "y": 347,
              "w": 84,
              "h": 26,
              "z": 1687536710844,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {},
              "dotsType": 2,
              "coords": [
                497,
                351,
                497,
                349,
                497,
                349
              ]
            },
            {
              "t": 1,
              "i": "1_168753671083313",
              "x": 413,
              "y": 347,
              "w": 84,
              "h": 26,
              "z": 1687536710844,
              "l": "layer_1687536696552_1",
              "style": {
                "a": "#ff0000",
                "c": "round",
                "f": "round",
                "g": 3
              },
              "status": {
                "e": 1
              },
              "dotsType": 1,
              "coords": [
                413,
                347,
                415,
                351,
                418,
                358,
                425,
                365,
                437,
                370,
                454,
                373,
                475,
                372,
                488,
                367,
                496,
                362,
                497,
                358
              ]
            }
          ]
        ]
      }
    }
  ]
}`;

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `{
  "startTime": 2668.89999999851,
  "snapshot": {
    "v": 0,
    "x": 0,
    "y": 0,
    "w": 1024,
    "h": 1024,
    "l": [
      {
        "id": "layer_1687544552448_1",
        "name": "layer_1687544552448_2"
      }
    ],
    "s": []
  },
  "events": [
    {
      "timeStamp": 1178.1000000014901,
      "type": "TOOL_CHANGED",
      "detail": {
        "operator": "whiteboard",
        "from": "TOOL_PEN",
        "to": "TOOL_RECT"
      }
    },
    {
      "timeStamp": 1537.7000000029802,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 2,
            "i": "2_16875445565373",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687544556538,
            "l": "layer_1687544552448_1",
            "style": {
              "a": "#ff0000",
              "g": 2
            },
            "status": {}
          }
        ]
      }
    },
    {
      "timeStamp": 1554.7000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 0,
              "h": 1
            },
            {
              "i": "2_16875445565373",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1579.2000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 3,
              "h": 6
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 0,
              "h": 1
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1598.2000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 6,
              "h": 11
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 3,
              "h": 6
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1614.7000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 10,
              "h": 16
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 6,
              "h": 11
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1633.3000000044703,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 13,
              "h": 21
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 10,
              "h": 16
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1651.1000000014901,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 16,
              "h": 26
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 13,
              "h": 21
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1670.6000000014901,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 20,
              "h": 31
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 16,
              "h": 26
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1687.6000000014901,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 23,
              "h": 35
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 20,
              "h": 31
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1706.6000000014901,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 26,
              "h": 39
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 23,
              "h": 35
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1726.4000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 29,
              "h": 43
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 26,
              "h": 39
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1745.4000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 32,
              "h": 45
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 29,
              "h": 43
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1764.1000000014901,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 35,
              "h": 48
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 32,
              "h": 45
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1784.7000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 39,
              "h": 50
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 35,
              "h": 48
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1803.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 42,
              "h": 53
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 39,
              "h": 50
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1823.6000000014901,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 45,
              "h": 56
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 42,
              "h": 53
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1845.4000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 48,
              "h": 59
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 45,
              "h": 56
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1863.7000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 52,
              "h": 62
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 48,
              "h": 59
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1887.3000000044703,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 56,
              "h": 64
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 52,
              "h": 62
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1908.3000000044703,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 60,
              "h": 67
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 56,
              "h": 64
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1927.7000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 65,
              "h": 70
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 60,
              "h": 67
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1949.3000000044703,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 69,
              "h": 72
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 65,
              "h": 70
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1967.3000000044703,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 73,
              "h": 75
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 69,
              "h": 72
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 1987.2000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 78,
              "h": 77
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 73,
              "h": 75
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2006.3000000044703,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 83,
              "h": 80
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 78,
              "h": 77
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2025.1000000014901,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 90,
              "h": 83
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 83,
              "h": 80
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2042.9000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 96,
              "h": 84
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 90,
              "h": 83
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2061.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 102,
              "h": 85
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 96,
              "h": 84
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2080.2000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 106,
              "h": 86
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 102,
              "h": 85
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2101.2000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 107,
              "h": 87
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 106,
              "h": 86
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2122,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 109,
              "h": 88
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 107,
              "h": 87
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2140.7000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 112,
              "h": 88
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 109,
              "h": 88
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2159.3000000044703,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 115,
              "h": 89
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 112,
              "h": 88
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2176.3000000044703,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 118,
              "h": 91
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 115,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2195.7000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 120,
              "h": 91
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 118,
              "h": 91
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2218.7000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 121,
              "h": 91
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 120,
              "h": 91
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2243.2000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 121,
              "h": 92
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 121,
              "h": 91
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2269.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 122,
              "h": 92
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 121,
              "h": 92
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2302.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 123,
              "h": 93
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 122,
              "h": 92
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2324.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 124,
              "h": 93
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 123,
              "h": 93
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2347.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 126,
              "h": 95
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 124,
              "h": 93
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2368.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 127,
              "h": 96
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 126,
              "h": 95
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2386.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 128,
              "h": 97
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 127,
              "h": 96
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2407.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 130,
              "h": 98
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 128,
              "h": 97
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2433.9000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 131,
              "h": 99
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 130,
              "h": 98
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2462.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 132,
              "h": 100
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 131,
              "h": 99
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2480.2000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 133,
              "h": 101
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 132,
              "h": 100
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2501.9000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 134,
              "h": 103
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 133,
              "h": 101
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2522.60000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 136,
              "h": 104
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 134,
              "h": 103
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2565.4000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 138,
              "h": 105
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 136,
              "h": 104
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2603.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 140,
              "h": 106
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 138,
              "h": 105
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2621.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 141,
              "h": 108
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 140,
              "h": 106
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2646.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 143,
              "h": 109
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 141,
              "h": 108
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2664.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 144,
              "h": 110
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 143,
              "h": 109
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2681.4000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 145,
              "h": 112
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 144,
              "h": 110
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2698.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 147,
              "h": 113
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 145,
              "h": 112
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2716.9000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 149,
              "h": 115
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 147,
              "h": 113
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2742.4000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 150,
              "h": 116
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 149,
              "h": 115
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2773.2000000029802,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 151,
              "h": 117
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 150,
              "h": 116
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 2935.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 151,
              "h": 117
            },
            {
              "i": "2_16875445565373",
              "x": 58,
              "y": 41,
              "w": 151,
              "h": 117
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 5687.4000000059605,
      "type": "TOOL_CHANGED",
      "detail": {
        "operator": "whiteboard",
        "from": "TOOL_RECT",
        "to": "TOOL_OVAL"
      }
    },
    {
      "timeStamp": 7692.30000000447,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 3,
            "i": "3_16875445626924",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687544562694,
            "l": "layer_1687544552448_1",
            "style": {
              "a": "#ff0000",
              "g": 2
            },
            "status": {}
          }
        ]
      }
    },
    {
      "timeStamp": 7709.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 0,
              "h": 0
            },
            {
              "i": "3_16875445626924",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7768,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 6,
              "h": 3
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 0,
              "h": 0
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7788.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 12,
              "h": 7
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 6,
              "h": 3
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7804.9000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 18,
              "h": 11
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 12,
              "h": 7
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7822,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 24,
              "h": 15
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 18,
              "h": 11
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7842.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 28,
              "h": 19
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 24,
              "h": 15
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7862.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 32,
              "h": 22
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 28,
              "h": 19
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7881.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 36,
              "h": 25
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 32,
              "h": 22
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7899.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 40,
              "h": 28
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 36,
              "h": 25
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7918.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 44,
              "h": 31
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 40,
              "h": 28
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7935,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 48,
              "h": 33
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 44,
              "h": 31
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7952,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 52,
              "h": 36
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 48,
              "h": 33
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7970,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 55,
              "h": 40
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 52,
              "h": 36
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 7990.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 59,
              "h": 43
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 55,
              "h": 40
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8010.80000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 63,
              "h": 45
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 59,
              "h": 43
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8032.9000000059605,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 67,
              "h": 48
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 63,
              "h": 45
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8053,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 70,
              "h": 51
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 67,
              "h": 48
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8070.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 74,
              "h": 54
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 70,
              "h": 51
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8087,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 79,
              "h": 58
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 74,
              "h": 54
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8106,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 85,
              "h": 62
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 79,
              "h": 58
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8124,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 90,
              "h": 66
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 85,
              "h": 62
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8143,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 95,
              "h": 70
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 90,
              "h": 66
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8165,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 99,
              "h": 74
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 95,
              "h": 70
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8183.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 103,
              "h": 77
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 99,
              "h": 74
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8201.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 107,
              "h": 81
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 103,
              "h": 77
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8222.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 110,
              "h": 84
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 107,
              "h": 81
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8239.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 113,
              "h": 86
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 110,
              "h": 84
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8257.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 115,
              "h": 89
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 113,
              "h": 86
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8274.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 118,
              "h": 92
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 115,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8292.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 121,
              "h": 95
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 118,
              "h": 92
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8310.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 124,
              "h": 99
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 121,
              "h": 95
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8332.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 127,
              "h": 102
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 124,
              "h": 99
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8352,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 129,
              "h": 104
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 127,
              "h": 102
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8377,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 130,
              "h": 105
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 129,
              "h": 104
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8397.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 131,
              "h": 106
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 130,
              "h": 105
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8416.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 133,
              "h": 107
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 131,
              "h": 106
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8443.60000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 135,
              "h": 109
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 133,
              "h": 107
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8464.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 136,
              "h": 110
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 135,
              "h": 109
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8486.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 137,
              "h": 111
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 136,
              "h": 110
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8512.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 139,
              "h": 112
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 137,
              "h": 111
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8532.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 140,
              "h": 113
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 139,
              "h": 112
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8554.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 141,
              "h": 114
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 140,
              "h": 113
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8575.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 141,
              "h": 115
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 141,
              "h": 114
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8600.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 142,
              "h": 115
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 141,
              "h": 115
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8626.70000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 143,
              "h": 115
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 142,
              "h": 115
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8647.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 145,
              "h": 115
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 143,
              "h": 115
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8676.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 147,
              "h": 116
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 145,
              "h": 115
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8715.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 148,
              "h": 116
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 147,
              "h": 116
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 8819.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 149,
              "h": 116
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 148,
              "h": 116
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 9155.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 150,
              "h": 116
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 149,
              "h": 116
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 9179.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 151,
              "h": 117
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 150,
              "h": 116
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 10980,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 151,
              "h": 117
            },
            {
              "i": "3_16875445626924",
              "x": 57,
              "y": 41,
              "w": 151,
              "h": 117
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 11391.80000000447,
      "type": "TOOL_CHANGED",
      "detail": {
        "operator": "whiteboard",
        "from": "TOOL_OVAL",
        "to": "TOOL_RECT"
      }
    },
    {
      "timeStamp": 12682.20000000298,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 2,
            "i": "2_16875445676825",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687544567685,
            "l": "layer_1687544552448_1",
            "style": {
              "a": "#ff0000",
              "g": 2
            },
            "status": {}
          }
        ]
      }
    },
    {
      "timeStamp": 12699.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 0,
              "h": 0
            },
            {
              "i": "2_16875445676825",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12755.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 0,
              "h": 1
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 0,
              "h": 0
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12786.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 1,
              "h": 3
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 0,
              "h": 1
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12805.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 4,
              "h": 6
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 1,
              "h": 3
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12825.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 7,
              "h": 10
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 4,
              "h": 6
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12842.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 12,
              "h": 14
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 7,
              "h": 10
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12860.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 16,
              "h": 19
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 12,
              "h": 14
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12879,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 21,
              "h": 24
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 16,
              "h": 19
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12898,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 26,
              "h": 29
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 21,
              "h": 24
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12917,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 31,
              "h": 34
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 26,
              "h": 29
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12938.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 35,
              "h": 37
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 31,
              "h": 34
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12958.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 39,
              "h": 39
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 35,
              "h": 37
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 12976.80000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 42,
              "h": 41
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 39,
              "h": 39
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13000,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 45,
              "h": 43
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 42,
              "h": 41
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13018.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 49,
              "h": 45
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 45,
              "h": 43
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13036.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 54,
              "h": 50
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 49,
              "h": 45
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13055.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 60,
              "h": 54
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 54,
              "h": 50
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13072.60000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 65,
              "h": 59
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 60,
              "h": 54
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13089.60000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 70,
              "h": 63
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 65,
              "h": 59
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13110,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 75,
              "h": 67
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 70,
              "h": 63
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13129.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 79,
              "h": 70
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 75,
              "h": 67
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13149.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 83,
              "h": 73
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 79,
              "h": 70
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13172,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 86,
              "h": 74
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 83,
              "h": 73
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13190,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 88,
              "h": 76
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 86,
              "h": 74
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13208,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 91,
              "h": 78
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 88,
              "h": 76
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13226.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 94,
              "h": 81
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 91,
              "h": 78
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13245.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 97,
              "h": 83
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 94,
              "h": 81
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13264,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 100,
              "h": 86
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 97,
              "h": 83
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13286.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 102,
              "h": 87
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 100,
              "h": 86
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13304,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 103,
              "h": 88
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 102,
              "h": 87
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13334.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 104,
              "h": 88
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 103,
              "h": 88
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13411.90000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 105,
              "h": 89
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 104,
              "h": 88
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13439.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 107,
              "h": 89
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 105,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13479.90000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 108,
              "h": 89
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 107,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13561.40000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 109,
              "h": 89
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 108,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13623.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 110,
              "h": 89
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 109,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13662.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 112,
              "h": 89
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 110,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13703.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 113,
              "h": 89
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 112,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13776.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 114,
              "h": 89
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 113,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13800.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 116,
              "h": 89
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 114,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13832.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 117,
              "h": 89
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 116,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13855.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 118,
              "h": 89
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 117,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 13987.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 117,
              "h": 88
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 118,
              "h": 89
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14010.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 114,
              "h": 86
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 117,
              "h": 88
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14032.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 113,
              "h": 84
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 114,
              "h": 86
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14076,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 112,
              "h": 84
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 113,
              "h": 84
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14278.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 113,
              "h": 84
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 112,
              "h": 84
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14304.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 113,
              "h": 85
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 113,
              "h": 84
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14390.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 113,
              "h": 86
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 113,
              "h": 85
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14698.10000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 111,
              "h": 86
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 113,
              "h": 86
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14725.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 109,
              "h": 86
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 111,
              "h": 86
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14764,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 108,
              "h": 86
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 109,
              "h": 86
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14833.90000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 108,
              "h": 85
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 108,
              "h": 86
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14872.90000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 107,
              "h": 85
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 108,
              "h": 85
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 14996.60000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 107,
              "h": 84
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 107,
              "h": 85
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 15072,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 107,
              "h": 84
            },
            {
              "i": "2_16875445676825",
              "x": 78,
              "y": 57,
              "w": 107,
              "h": 84
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 22103.60000000149,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 2,
            "i": "2_16875445771036",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687544577107,
            "l": "layer_1687544552448_1",
            "style": {
              "a": "#000cffff",
              "g": 2,
              "b": "#646464ff"
            },
            "status": {}
          }
        ]
      }
    },
    {
      "timeStamp": 22120.20000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 1,
              "h": 0
            },
            {
              "i": "2_16875445771036",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 22138.40000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 13,
              "h": 10
            },
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 1,
              "h": 0
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 22155.40000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 36,
              "h": 26
            },
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 13,
              "h": 10
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 22172.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 59,
              "h": 42
            },
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 36,
              "h": 26
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 22189.40000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 73,
              "h": 55
            },
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 59,
              "h": 42
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 22207.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 80,
              "h": 62
            },
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 73,
              "h": 55
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 22230.90000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 81,
              "h": 63
            },
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 80,
              "h": 62
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 22274.90000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 81,
              "h": 63
            },
            {
              "i": "2_16875445771036",
              "x": 268,
              "y": 79,
              "w": 81,
              "h": 63
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24346.40000000596,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 2,
            "i": "2_16875445793467",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687544579351,
            "l": "layer_1687544552448_1",
            "style": {
              "a": "#000cffff",
              "g": 2,
              "b": "#6464645c"
            },
            "status": {}
          }
        ]
      }
    },
    {
      "timeStamp": 24362.80000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 0,
              "h": 0
            },
            {
              "i": "2_16875445793467",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24382.60000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 9,
              "h": 5
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 0,
              "h": 0
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24400.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 26,
              "h": 15
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 9,
              "h": 5
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24417.70000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 40,
              "h": 26
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 26,
              "h": 15
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24434.70000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 50,
              "h": 36
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 40,
              "h": 26
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24451.60000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 57,
              "h": 44
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 50,
              "h": 36
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24468.30000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 62,
              "h": 51
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 57,
              "h": 44
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24486.70000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 64,
              "h": 55
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 62,
              "h": 51
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24503.60000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 65,
              "h": 58
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 64,
              "h": 55
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24525.70000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 66,
              "h": 58
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 65,
              "h": 58
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24589.70000000298,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 67,
              "h": 58
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 66,
              "h": 58
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24660.60000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 68,
              "h": 58
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 67,
              "h": 58
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 24699.60000000149,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 68,
              "h": 59
            },
            {
              "i": "2_16875445793467",
              "x": 314,
              "y": 109,
              "w": 68,
              "h": 58
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 25290.20000000298,
      "type": "SHAPES_ADDED",
      "detail": {
        "operator": "whiteboard",
        "shapeDatas": [
          {
            "t": 2,
            "i": "2_16875445802908",
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0,
            "z": 1687544580296,
            "l": "layer_1687544552448_1",
            "style": {
              "a": "#000cffff",
              "g": 2,
              "b": "#6464645c"
            },
            "status": {}
          }
        ]
      }
    },
    {
      "timeStamp": 25306.80000000447,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 4,
              "h": 2
            },
            {
              "i": "2_16875445802908",
              "x": 0,
              "y": 0,
              "w": 0,
              "h": 0
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 25323.90000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 18,
              "h": 13
            },
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 4,
              "h": 2
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 25341.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 32,
              "h": 24
            },
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 18,
              "h": 13
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 25358.40000000596,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 41,
              "h": 32
            },
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 32,
              "h": 24
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 25375.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 45,
              "h": 35
            },
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 41,
              "h": 32
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 25399.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 46,
              "h": 37
            },
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 45,
              "h": 35
            }
          ]
        ]
      }
    },
    {
      "timeStamp": 25445.5,
      "type": "SHAPES_RESIZED",
      "detail": {
        "shapeDatas": [
          [
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 46,
              "h": 37
            },
            {
              "i": "2_16875445802908",
              "x": 237,
              "y": 64,
              "w": 46,
              "h": 37
            }
          ]
        ]
      }
    }
  ]
}
`;

},{}],41:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("../../dist");
const event_1 = require("../../dist/event");
const ColorView_1 = __importDefault(require("./ColorView"));
const View_1 = require("./G/BaseView/View");
const Menu_1 = require("./G/CompoundView/Menu");
const DockableDirection_1 = require("./G/CompoundView/Workspace/DockableDirection");
const WorkspaceView_1 = require("./G/CompoundView/Workspace/WorkspaceView");
const SnapshotView_1 = require("./SnapshotView");
const LayersView_1 = require("./LayersView");
const RecorderView_1 = require("./RecorderView");
const ToolsView_1 = require("./ToolsView");
const ToyView_1 = require("./ToyView");
const factory = dist_1.Gaia.factory(dist_1.FactoryEnum.Default)();
let board;
const workspace = new WorkspaceView_1.WorkspaceView('body', {
    rect() {
        return {
            x: 0, y: 0,
            w: document.body.offsetWidth,
            h: document.body.offsetHeight
        };
    },
    zIndex: 1000,
});
var MenuKey;
(function (MenuKey) {
    MenuKey["SelectAll"] = "SelectAll";
    MenuKey["RemoveSelected"] = "RemoveSelected";
    MenuKey["Deselect"] = "Deselect";
    MenuKey["ClearUp"] = "ClearUp";
})(MenuKey || (MenuKey = {}));
const menu = new Menu_1.Menu(workspace, {
    items: [{
            label: '工具',
            items: dist_1.Gaia.listTools().map(v => ({ key: v, label: v }))
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
        }]
});
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
            board.setToolType(e.detail.key);
            break;
        case MenuKey.SelectAll:
            board.selectAll();
            break;
        case MenuKey.Deselect:
            board.deselect();
            break;
        case MenuKey.RemoveSelected:
            board.removeSelected();
            break;
        case MenuKey.ClearUp:
            board.removeAll();
            break;
    }
});
const layersView = new LayersView_1.LayersView();
workspace.addChild(layersView);
layersView.addEventListener(LayersView_1.LayersView.EventType.LayerAdded, () => {
    const layer = factory.newLayer({
        info: {
            name: factory.newLayerName(),
            id: factory.newLayerId()
        },
        onscreen: document.createElement('canvas')
    });
    layersView.addLayer(layer);
    board.addLayer(layer);
});
layersView.addEventListener(LayersView_1.LayersView.EventType.LayerVisibleChanged, e => {
    const { id, visible } = e.detail;
    const layer = board.layer(id);
    if (!layer) {
        return;
    }
    layer.opacity = visible ? 1 : 0;
});
layersView.addEventListener(LayersView_1.LayersView.EventType.LayerActived, e => {
    const { id } = e.detail;
    board.editLayer(id);
});
const toolsView = new ToolsView_1.ToolsView;
workspace.addChild(toolsView);
toolsView.onToolClick = (btn) => board.setToolType(btn.toolType);
const colorView = new ColorView_1.default;
workspace.addChild(colorView);
colorView.inner.addEventListener(ColorView_1.default.EventTypes.LineColorChange, (e) => {
    const rgba = e.detail;
    dist_1.Gaia.listTools().forEach(toolType => {
        var _a;
        const shape = (_a = dist_1.Gaia.toolInfo(toolType)) === null || _a === void 0 ? void 0 : _a.shape;
        if (!shape)
            return;
        const template = board.factory.shapeTemplate(shape);
        template.strokeStyle = '' + rgba.toHex();
    });
});
colorView.inner.addEventListener(ColorView_1.default.EventTypes.FillColorChange, (e) => {
    const rgba = e.detail;
    dist_1.Gaia.listTools().forEach(toolType => {
        var _a;
        const shape = (_a = dist_1.Gaia.toolInfo(toolType)) === null || _a === void 0 ? void 0 : _a.shape;
        if (!shape)
            return;
        const template = board.factory.shapeTemplate(shape);
        template.fillStyle = '' + rgba.toHex();
    });
});
const toyView = new ToyView_1.ToyView();
toyView.board = () => board;
workspace.addChild(toyView);
const snapshotView = new SnapshotView_1.SnapshotView();
snapshotView.board = () => board;
workspace.addChild(snapshotView);
const recorderView = new RecorderView_1.RecorderView();
recorderView.board = () => board;
workspace.addChild(recorderView);
const rootView = new View_1.View('div');
rootView.styles.apply('', { pointerEvents: 'all' }).addCls('root');
workspace.rootDockView.setContent(rootView);
const blackboard = new View_1.View('div');
blackboard.styles.addCls('blackboard');
rootView.addChild(blackboard);
board = factory.newWhiteBoard({ width: 1024, height: 1024, element: blackboard.inner });
Object.assign(window, {
    board, factory, workspace, FactoryMgr: dist_1.Gaia
});
workspace.dockToRoot(toolsView, DockableDirection_1.DockableDirection.H, 'start');
workspace.dockToRoot(colorView, DockableDirection_1.DockableDirection.H, 'end');
workspace.dockAround(toyView, colorView, DockableDirection_1.DockableDirection.V, 'end');
workspace.dockAround(recorderView, toyView, DockableDirection_1.DockableDirection.V, 'end');
workspace.dockAround(snapshotView, recorderView, DockableDirection_1.DockableDirection.V, 'end');
workspace.dockAround(layersView, snapshotView, DockableDirection_1.DockableDirection.V, 'end');
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
        }
    }
    else if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
        do {
            const toolEnum = toolShortcuts.get(e.key);
            if (toolEnum) {
                board.setToolType(toolEnum);
                toolsView.setToolType(toolEnum);
                break;
            }
            const func = onekeyShorcuts.get(e.key);
            if (func) {
                func();
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
    ['Delete', () => board.removeSelected()]
]);
const ctrlShorcuts = new Map([
    ['a', () => board.toolType === dist_1.ToolEnum.Selector && board.selectAll()],
    ['d', () => board.deselect()],
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
    layersView.addLayer(layer);
});
window.addEventListener('resize', () => workspace.clampAllSubwin());

},{"../../dist":52,"../../dist/event":47,"./ColorView":1,"./G/BaseView/View":10,"./G/CompoundView/Menu":14,"./G/CompoundView/Workspace/DockableDirection":19,"./G/CompoundView/Workspace/WorkspaceView":23,"./LayersView":32,"./RecorderView":33,"./SnapshotView":34,"./ToolsView":35,"./ToyView":36}],42:[function(require,module,exports){
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
        this.removeAll();
        Array.from(this._layers.keys()).forEach((layerId) => this.removeLayer(layerId));
        this.addLayers(snapshot.l.map(info => ({ info })));
        const shapes = snapshot.s.map((v) => this.factory.newShape(v));
        this.add(...shapes);
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
        this.dispatchEvent(event_1.WhiteBoardEvent.toolChanged({ operator: this._operator, from, to }));
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
        const e = event_1.WhiteBoardEvent.shapesAdded({
            operator: this._operator,
            shapeDatas: shapes.map(v => v.data.copy())
        });
        this.dispatchEvent(e);
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
        const e = event_1.WhiteBoardEvent.shapesRemoved({
            operator: this._operator,
            shapeDatas: shapes.map(v => v.data.copy())
        });
        this.dispatchEvent(e);
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

},{"../event":47,"../tools":106,"../utils":117,"./Layer":43}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{"./Board":42,"./Layer":43}],45:[function(require,module,exports){
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
})(EventEnum = exports.EventEnum || (exports.EventEnum = {}));

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhiteBoardEvent = void 0;
const EventType_1 = require("./EventType");
var WhiteBoardEvent;
(function (WhiteBoardEvent) {
    function shapesAdded(detail) {
        return new CustomEvent(EventType_1.EventEnum.ShapesAdded, { detail });
    }
    WhiteBoardEvent.shapesAdded = shapesAdded;
    function shapesRemoved(detail) {
        return new CustomEvent(EventType_1.EventEnum.ShapesRemoved, { detail });
    }
    WhiteBoardEvent.shapesRemoved = shapesRemoved;
    function shapesChanged(detail) {
        return new CustomEvent(EventType_1.EventEnum.ShapesChanged, { detail });
    }
    WhiteBoardEvent.shapesChanged = shapesChanged;
    function shapesMoved(detail) {
        return new CustomEvent(EventType_1.EventEnum.ShapesMoved, { detail });
    }
    WhiteBoardEvent.shapesMoved = shapesMoved;
    function shapesResized(detail) {
        return new CustomEvent(EventType_1.EventEnum.ShapesResized, { detail });
    }
    WhiteBoardEvent.shapesResized = shapesResized;
    function pickShapePositionData(data) {
        return {
            i: data.i,
            x: data.x,
            y: data.y
        };
    }
    WhiteBoardEvent.pickShapePositionData = pickShapePositionData;
    function pickShapeGeoData(data) {
        return {
            i: data.i,
            x: data.x,
            y: data.y,
            w: data.w,
            h: data.h
        };
    }
    WhiteBoardEvent.pickShapeGeoData = pickShapeGeoData;
    function toolChanged(detail) {
        return new CustomEvent(EventType_1.EventEnum.ToolChanged, { detail });
    }
    WhiteBoardEvent.toolChanged = toolChanged;
})(WhiteBoardEvent = exports.WhiteBoardEvent || (exports.WhiteBoardEvent = {}));

},{"./EventType":45}],47:[function(require,module,exports){
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

},{"./EventType":45,"./Events":46}],48:[function(require,module,exports){
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
        let timeStamp = event.timeStamp;
        if (!this.firstEventTime && timeStamp)
            this.firstEventTime = timeStamp;
        this.applyEvent(event);
        ++this.eventIdx;
        const next = screenplay.events[this.eventIdx];
        if (!next)
            return this.stop();
        timeStamp = next.timeStamp;
        const diff = Math.max(1, (timeStamp - screenplay.startTime) - (this.firstEventTime - screenplay.startTime) - (Date.now() - this.startTime));
        this.timer = setTimeout(() => this.tick(), diff);
    }
    applyEvent(e) {
        var _a, _b;
        // console.log('[Player] applyEvent(), e = ', e);
        const actor = this.actor;
        if (!actor) {
            return;
        }
        switch (e.type) {
            case event_1.EventEnum.ShapesAdded: {
                const event = (e);
                const shapes = (_a = event.detail.shapeDatas) === null || _a === void 0 ? void 0 : _a.map(v => actor.factory.newShape(v));
                shapes && actor.add(...shapes);
                break;
            }
            case event_1.EventEnum.ShapesMoved:
            case event_1.EventEnum.ShapesResized:
            case event_1.EventEnum.ShapesChanged: {
                const event = (e);
                event.detail.shapeDatas.forEach(([curr]) => {
                    var _a;
                    const id = curr.i;
                    id && ((_a = actor.find(id)) === null || _a === void 0 ? void 0 : _a.merge(curr));
                });
                break;
            }
            case event_1.EventEnum.ShapesRemoved: {
                const event = (e);
                const shapes = (_b = event.detail.shapeDatas) === null || _b === void 0 ? void 0 : _b.map(data => actor.find(data.i)).filter(v => v);
                shapes && actor.remove(...shapes);
                break;
            }
        }
    }
}
exports.Player = Player;

},{"../event":47}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = void 0;
const event_1 = require("../event");
class Recorder {
    constructor() {
        this.cancellers = [];
        this._screenplay = {
            startTime: Date.now(),
            events: []
        };
    }
    destory() {
        console.log('[Recorder] destory()');
        this.cancellers.forEach(v => v());
        this.cancellers = [];
    }
    start(actor) {
        console.log('[Recorder] start()');
        this.cancellers.forEach(v => v());
        this.cancellers = [];
        const startTime = new CustomEvent('').timeStamp;
        this._screenplay = {
            startTime,
            snapshot: actor.toSnapshot(),
            events: []
        };
        for (const key in event_1.EventEnum) {
            const v = event_1.EventEnum[key];
            const func = (e) => {
                this._screenplay.events.push({
                    timeStamp: e.timeStamp - startTime,
                    type: e.type,
                    detail: e.detail
                });
            };
            actor.addEventListener(v, func);
            const canceller = () => actor.removeEventListener(v, func);
            this.cancellers.push(canceller);
        }
    }
    toJson() {
        return this._screenplay;
    }
    toJsonStr() {
        return JSON.stringify(this.toJson(), null, 2);
    }
}
exports.Recorder = Recorder;

},{"../event":47}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],51:[function(require,module,exports){
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

},{"./Player":48,"./Recorder":49,"./Screenplay":50}],52:[function(require,module,exports){
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

},{"./board":44,"./features":51,"./mgr":57,"./shape":71,"./tools":106,"./utils":117}],53:[function(require,module,exports){
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

},{"../board":44,"../shape/base/Data":59,"../shape/base/Shape":60,"../tools/base/InvalidTool":102,"./FactoryEnum":54,"./Gaia":55,"./ShapesMgr":56}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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

},{"../shape/ShapeEnum":58,"../tools/ToolEnum":101}],56:[function(require,module,exports){
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

},{"../utils/Rect":114}],57:[function(require,module,exports){
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

},{"./Factory":53,"./FactoryEnum":54,"./Gaia":55,"./ShapesMgr":56}],58:[function(require,module,exports){
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
        default: return type;
    }
}
exports.getShapeName = getShapeName;

},{}],59:[function(require,module,exports){
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

},{"../ShapeEnum":58}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = void 0;
const Rect_1 = require("../../utils/Rect");
class Shape {
    constructor(data) {
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
            let lineWidth = 1;
            let halfLineW = lineWidth / 2;
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
}
exports.Shape = Shape;

},{"../../utils/Rect":114}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeNeedPath = void 0;
const Shape_1 = require("./Shape");
class ShapeNeedPath extends Shape_1.Shape {
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

},{"./Shape":60}],62:[function(require,module,exports){
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

},{"./Data":59,"./Shape":60,"./ShapeNeedPath":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class CrossData extends base_1.ShapeData {
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

},{"../ShapeEnum":58,"../base":62}],64:[function(require,module,exports){
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

},{"../../mgr/Gaia":55,"../ShapeEnum":58,"../base/ShapeNeedPath":61,"./Data":63}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "CrossTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Cross, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Cross, ShapeEnum_1.ShapeEnum.Cross), { name: 'cross', desc: 'cross drawer', shape: ShapeEnum_1.ShapeEnum.Cross });

},{"../../mgr/Gaia":55,"../../tools/ToolEnum":101,"../../tools/base/SimpleTool":103,"../ShapeEnum":58}],66:[function(require,module,exports){
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

},{"./Data":63,"./Shape":64,"./Tool":65}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HalfTickData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class HalfTickData extends base_1.ShapeData {
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

},{"../ShapeEnum":58,"../base":62}],68:[function(require,module,exports){
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

},{"../../mgr/Gaia":55,"../ShapeEnum":58,"../base/ShapeNeedPath":61,"./Data":67}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HalfTickTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "HalfTickTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.HalfTick, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.HalfTick, ShapeEnum_1.ShapeEnum.HalfTick), { name: 'half tick', desc: 'half tick drawer', shape: ShapeEnum_1.ShapeEnum.HalfTick });

},{"../../mgr/Gaia":55,"../../tools/ToolEnum":101,"../../tools/base/SimpleTool":103,"../ShapeEnum":58}],70:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./Data":67,"./Shape":68,"./Tool":69,"dup":66}],71:[function(require,module,exports){
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

},{"./ShapeEnum":58,"./base":62,"./cross":66,"./halftick":70,"./lines":75,"./oval":79,"./pen":83,"./polygon":87,"./rect":91,"./text":96,"./tick":100}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinesData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class LinesData extends base_1.ShapeData {
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

},{"../ShapeEnum":58,"../base":62}],73:[function(require,module,exports){
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

},{"../../mgr/Gaia":55,"../ShapeEnum":58,"../base":62,"./Data":72}],74:[function(require,module,exports){
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
            board.dispatchEvent(event_1.WhiteBoardEvent.shapesChanged({ shapeType: this.type, shapeDatas: [[curr, prev]] }));
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
            board.dispatchEvent(event_1.WhiteBoardEvent.shapesChanged({ shapeType: this.type, shapeDatas: [[curr, prev]] }));
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
            board.add(this._curShape);
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

},{"../../event":47,"../../mgr/Gaia":55,"../../tools/ToolEnum":101,"../ShapeEnum":58}],75:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./Data":72,"./Shape":73,"./Tool":74,"dup":66}],76:[function(require,module,exports){
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

},{"../ShapeEnum":58,"../base":62}],77:[function(require,module,exports){
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

},{"../../mgr/Gaia":55,"../ShapeEnum":58,"../base/ShapeNeedPath":61,"./Data":76}],78:[function(require,module,exports){
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

},{"../../mgr/Gaia":55,"../../tools/ToolEnum":101,"../../tools/base/SimpleTool":103,"../ShapeEnum":58}],79:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./Data":76,"./Shape":77,"./Tool":78,"dup":66}],80:[function(require,module,exports){
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

},{"../ShapeEnum":58,"../base":62}],81:[function(require,module,exports){
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

},{"../../mgr/Gaia":55,"../ShapeEnum":58,"../base":62,"./Data":80}],82:[function(require,module,exports){
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
            board.dispatchEvent(event_1.WhiteBoardEvent.shapesChanged({ shapeType: this.type, shapeDatas: [[curr, prev]] }));
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
        board.add(this._curShape);
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

},{"../../event":47,"../../mgr/Gaia":55,"../../tools/ToolEnum":101,"../ShapeEnum":58,"./Data":80}],83:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./Data":80,"./Shape":81,"./Tool":82,"dup":66}],84:[function(require,module,exports){
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

},{"../ShapeEnum":58,"../base":62}],85:[function(require,module,exports){
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

},{"../../mgr/Gaia":55,"../ShapeEnum":58,"../base/ShapeNeedPath":61,"./Data":84}],86:[function(require,module,exports){
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

},{"../../mgr/Gaia":55,"../../tools/ToolEnum":101,"../../tools/base/SimpleTool":103,"../ShapeEnum":58}],87:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./Data":84,"./Shape":85,"./Tool":86,"dup":66}],88:[function(require,module,exports){
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

},{"../ShapeEnum":58,"../base":62}],89:[function(require,module,exports){
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

},{"../../mgr/Gaia":55,"../ShapeEnum":58,"../base/ShapeNeedPath":61,"./Data":88}],90:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "RectTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Rect, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Rect, ShapeEnum_1.ShapeEnum.Rect), { name: 'rect', desc: 'rect drawer', shape: ShapeEnum_1.ShapeEnum.Rect });

},{"../../mgr/Gaia":55,"../../tools/ToolEnum":101,"../../tools/base/SimpleTool":103,"../ShapeEnum":58}],91:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./Data":88,"./Shape":89,"./Tool":90,"dup":66}],92:[function(require,module,exports){
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

},{"../ShapeEnum":58,"../base":62}],93:[function(require,module,exports){
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

},{"../../mgr/Gaia":55,"../../utils/Rect":114,"../ShapeEnum":58,"../base":62,"./Data":92,"./TextSelection":94}],94:[function(require,module,exports){
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

},{}],95:[function(require,module,exports){
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
                board.remove(preShape);
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
            board.dispatchEvent(event_1.WhiteBoardEvent.shapesChanged({ shapeType: this.type, shapeDatas: [[curr, prev]] }));
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
            board.add(newShapeText);
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

},{"../../event":47,"../../mgr/Gaia":55,"../../tools/ToolEnum":101,"../ShapeEnum":58}],96:[function(require,module,exports){
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

},{"./Data":92,"./Shape":93,"./TextSelection":94,"./Tool":95}],97:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class TickData extends base_1.ShapeData {
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

},{"../ShapeEnum":58,"../base":62}],98:[function(require,module,exports){
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

},{"../../mgr/Gaia":55,"../ShapeEnum":58,"../base/ShapeNeedPath":61,"./Data":97}],99:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickTool = void 0;
const Gaia_1 = require("../../mgr/Gaia");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "TickTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
Gaia_1.Gaia.registerTool(ToolEnum_1.ToolEnum.Tick, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Tick, ShapeEnum_1.ShapeEnum.Tick), { name: 'tick', desc: 'tick drawer', shape: ShapeEnum_1.ShapeEnum.Tick });

},{"../../mgr/Gaia":55,"../../tools/ToolEnum":101,"../../tools/base/SimpleTool":103,"../ShapeEnum":58}],100:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./Data":97,"./Shape":98,"./Tool":99,"dup":66}],101:[function(require,module,exports){
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
        default: return type;
    }
}
exports.getToolName = getToolName;

},{}],102:[function(require,module,exports){
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

},{"../ToolEnum":101}],103:[function(require,module,exports){
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
        board.add(shape);
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
        this._prevData = event_1.WhiteBoardEvent.pickShapeGeoData(shape.data);
        const prev = this._prevData;
        const emitEvent = () => {
            const curr = event_1.WhiteBoardEvent.pickShapeGeoData(shape.data);
            board.dispatchEvent(event_1.WhiteBoardEvent.shapesResized({ shapeDatas: [[curr, prev]] }));
            delete this._prevData;
        };
        this.applyRect();
        setTimeout(emitEvent, 1000 / 60);
    }
}
exports.SimpleTool = SimpleTool;

},{"../../event":47,"../../utils/RectHelper":115}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],105:[function(require,module,exports){
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

},{"./InvalidTool":102,"./SimpleTool":103,"./Tool":104}],106:[function(require,module,exports){
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

},{"./ToolEnum":101,"./base":105,"./selector":108}],107:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorTool = exports.SelectorStatus = void 0;
const RectHelper_1 = require("../../utils/RectHelper");
const Data_1 = require("../../shape/base/Data");
const Gaia_1 = require("../../mgr/Gaia");
const Shape_1 = require("../../shape/rect/Shape");
const ToolEnum_1 = require("../ToolEnum");
const Events_1 = require("../../event/Events");
var SelectorStatus;
(function (SelectorStatus) {
    SelectorStatus["Invalid"] = "SELECTOR_STATUS_INVALID";
    SelectorStatus["Dragging"] = "SELECTOR_STATUS_DRAGGING";
    SelectorStatus["Selecting"] = "SELECTOR_STATUS_SELECTING";
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
        var _a;
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.deselect();
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
                let shape = board.hit({ x, y, w: 0, h: 0 });
                if (!shape || !shape.selected)
                    shape = board.selectNear({ x, y, w: 0, h: 0 });
                if (shape) {
                    this._status = SelectorStatus.Dragging;
                }
                else {
                    this._status = SelectorStatus.Selecting;
                    this._rect.visible = true;
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
                board.selectAt(this._rect.data);
                return;
            }
            case SelectorStatus.Dragging: {
                this._shapes.forEach(v => {
                    v.prevData = Events_1.WhiteBoardEvent.pickShapePositionData(v.shape.data);
                    v.shape.moveBy(diffX, diffY);
                });
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
        board.dispatchEvent(Events_1.WhiteBoardEvent.shapesMoved({
            shapeDatas: this._shapes.map(v => {
                return [Events_1.WhiteBoardEvent.pickShapePositionData(v.shape.data), v.prevData];
            })
        }));
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

},{"../../event/Events":46,"../../mgr/Gaia":55,"../../shape/base/Data":59,"../../shape/rect/Shape":89,"../../utils/RectHelper":115,"../ToolEnum":101}],108:[function(require,module,exports){
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

},{"./SelectorTool":107}],109:[function(require,module,exports){
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

},{}],110:[function(require,module,exports){
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

},{"./BinaryRange":109}],111:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],112:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],113:[function(require,module,exports){
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

},{"./Rect":114}],114:[function(require,module,exports){
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

},{}],115:[function(require,module,exports){
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

},{"./Vector":116}],116:[function(require,module,exports){
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

},{}],117:[function(require,module,exports){
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

},{"./BinaryRange":109,"./BinaryTree":110,"./Dot":111,"./ITree":112,"./QuadTree":113,"./Rect":114,"./Vector":116}]},{},[41]);
