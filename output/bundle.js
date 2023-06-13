(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorViewEventTypes = void 0;
const Button_1 = require("./G/BaseView/Button");
const ButtonGroup_1 = require("./G/Helper/ButtonGroup");
const Canvas_1 = require("./G/BaseView/Canvas");
const NumberInput_1 = require("./G/BaseView/NumberInput");
const View_1 = require("./G/BaseView/View");
const Subwin_1 = require("./G/CompoundView/Subwin");
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
class ColorView extends Subwin_1.Subwin {
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

},{"./G/BaseView/Button":2,"./G/BaseView/Canvas":3,"./G/BaseView/NumberInput":5,"./G/BaseView/View":10,"./G/CompoundView/Subwin":14,"./G/Helper/ButtonGroup":22,"./colorPalette/Color":32,"./colorPalette/ColorPalette":33}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = exports.ButtonState = exports.ButtonStyleNames = void 0;
const SizeType_1 = require("./SizeType");
const View_1 = require("./View");
var ButtonStyleNames;
(function (ButtonStyleNames) {
    ButtonStyleNames["Normal"] = "normal";
    ButtonStyleNames["Hover"] = "hover";
    ButtonStyleNames["Disabled"] = "disabled";
    ButtonStyleNames["Checked"] = "checked";
    ButtonStyleNames["Small"] = "small";
    ButtonStyleNames["Middle"] = "middle";
    ButtonStyleNames["Large"] = "large";
})(ButtonStyleNames = exports.ButtonStyleNames || (exports.ButtonStyleNames = {}));
;
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
            [SizeType_1.SizeType.Small]: ButtonStyleNames.Small,
            [SizeType_1.SizeType.Middle]: ButtonStyleNames.Middle,
            [SizeType_1.SizeType.Large]: ButtonStyleNames.Large
        };
        this.hoverOb;
        this.styles.register(ButtonStyleNames.Small, {
            minWidth: 18,
            height: 18,
            lineHeight: 18,
            borderRadius: 5,
            fontSize: 12,
        }).register(ButtonStyleNames.Middle, {
            minWidth: 24,
            height: 24,
            lineHeight: 24,
            borderRadius: 5,
            fontSize: 14,
        }).register(ButtonStyleNames.Large, {
            minWidth: 32,
            height: 32,
            lineHeight: 32,
            borderRadius: 5,
            fontSize: 24,
        }).register(ButtonStyleNames.Normal, {
            userSelect: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 200ms',
            padding: 0,
            background: 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        }).register(ButtonStyleNames.Checked, {
            background: '#00000022'
        }).register(ButtonStyleNames.Hover, {
            background: '#00000044'
        }).add(ButtonStyleNames.Normal).refresh();
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
        styles[this.checked ? 'add' : 'remove'](ButtonStyleNames.Checked);
        styles[this.hover ? 'add' : 'remove'](ButtonStyleNames.Hover);
        styles[this.disabled ? 'add' : 'remove'](ButtonStyleNames.Disabled);
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
            .remove(this.aaa[this._preSize])
            .add(this.aaa[this._size])
            .refresh();
        this._preSize = this._size;
    }
}
exports.Button = Button;
Button.State = ButtonState;
Button.StyleNames = ButtonStyleNames;

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
    constructor() { super('canvas'); }
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
    remove(...names) {
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
        this.remove(...names).refresh();
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
    resetCls(...names) {
        this.view.inner.className = '';
        return this.applyCls(...names);
    }
    applyCls(...names) {
        this.view.inner.classList.add(...names);
        return this;
    }
    removeCls(...names) {
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

},{"../utils":29,"./StyleType":7}],9:[function(require,module,exports){
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
        styles[(this.focused && !this.disabled) ? 'add' : 'remove'](InputStyleNames.Focused);
        styles[(this.hover && !this.disabled) ? 'add' : 'remove'](InputStyleNames.Hover);
        styles[this.disabled ? 'add' : 'remove'](InputStyleNames.Disabled);
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
    get draggable() { return this.inner.draggable; }
    set draggable(v) { this.inner.draggable = v; }
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
        children.forEach(child => {
            this.inner.append(child.inner);
            child.inner.dispatchEvent(new Event(EventType_1.ViewEventType.Added));
            child.onAdded();
        });
        return this;
    }
    insertChild(anchorOrIdx, ...children) {
        if (anchorOrIdx === 0 && !this.inner.children.length) {
            children.forEach(child => {
                this.inner.append(child.inner);
                child.inner.dispatchEvent(new Event(EventType_1.ViewEventType.Added));
                child.onAdded();
            });
            return this;
        }
        const ele = (typeof anchorOrIdx === 'number') ?
            this.inner.children[anchorOrIdx] :
            anchorOrIdx.inner;
        if (!ele) {
            console.error('[View] insertChild failed! anchor element not found, idx = ', anchorOrIdx);
            return this;
        }
        children.forEach(child => {
            this.inner.insertBefore(child.inner, ele);
            child.inner.dispatchEvent(new Event(EventType_1.ViewEventType.Added));
            child.onAdded();
        });
        return this;
    }
    removeChild(...children) {
        children.forEach(child => {
            this.inner.removeChild(child.inner);
            child.inner.dispatchEvent(new Event(EventType_1.ViewEventType.Removed));
            child.onRemoved();
        });
        return this;
    }
    removeSelf() {
        var _a;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.removeChild(this);
        return this;
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
}
exports.View = View;
View.RAW_KEY_IN_ELEMENT = 'g_view';

},{"../Events/EventType":21,"../Observer/FocusOb":27,"../Observer/HoverOb":28,"./Styles":8}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconButton = void 0;
const Button_1 = require("../BaseView/Button");
const Image_1 = require("../BaseView/Image");
const StyleType_1 = require("../BaseView/StyleType");
class IconButton extends Button_1.Button {
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
    }
    init(inits) {
        const content = new Image_1.Image({
            style: {
                width: '100%',
                height: '100%',
                objectFit: StyleType_1.CssObjectFit.Contain,
            }
        });
        content.draggable = false;
        const superInits = Object.assign(Object.assign({}, inits), { content });
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

},{"../BaseView/Button":2,"../BaseView/Image":4,"../BaseView/StyleType":7}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = exports.MenuEventType = exports.MenuItemView = exports.StyleNames = void 0;
const StyleType_1 = require("../BaseView/StyleType");
const View_1 = require("../BaseView/View");
const HoverOb_1 = require("../Observer/HoverOb");
const utils_1 = require("../utils");
var StyleNames;
(function (StyleNames) {
    StyleNames["Normal"] = "Normal";
    StyleNames["ItemDivider"] = "ItemDivider";
    StyleNames["ItemNormal"] = "ItemNormal";
    StyleNames["ItemHover"] = "ItemHover";
})(StyleNames = exports.StyleNames || (exports.StyleNames = {}));
class MenuItemView extends View_1.View {
    get menu() { return this._menu; }
    get submenu() { return this._submenu; }
    get info() { return this._info; }
    setup(info = this._info) {
        var _a, _b;
        this._info = info;
        if (info.divider) {
            this.styles.clear().add(StyleNames.ItemDivider).refresh();
        }
        else {
            this.styles.clear().add(StyleNames.ItemNormal).refresh();
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
            this.styles.add(StyleNames.ItemHover).refresh();
        }
        else {
            this.styles.remove(StyleNames.ItemHover).refresh();
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
        this.styles.register(StyleNames.ItemDivider, {
            height: 1,
            background: '#00000011'
        }).register(StyleNames.ItemHover, {
            background: '#00000011'
        }).register(StyleNames.ItemNormal, {
            display: 'flex',
            borderRadius: 5,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 12,
        });
        this.setup();
    }
}
exports.MenuItemView = MenuItemView;
var MenuEventType;
(function (MenuEventType) {
    MenuEventType["ItemClick"] = "onItemClick";
})(MenuEventType = exports.MenuEventType || (exports.MenuEventType = {}));
class GlobalDown extends View_1.View {
    constructor() {
        super('div');
        document.addEventListener('pointerdown', e => {
            if ((0, utils_1.findParent)(e.target, ele => !!View_1.View.try(ele, Menu))) {
                return;
            }
            this.inner.dispatchEvent(new PointerEvent('fired'));
        });
    }
}
const globalDown = new GlobalDown();
class Menu extends View_1.View {
    get container() { return this._container; }
    constructor(container, inits) {
        var _a;
        super('div');
        this._items = [];
        this._container = container;
        this.styles.apply(StyleNames.Normal, {
            position: StyleType_1.CssPosition.Fixed,
            display: 'none',
            gridTemplateColumns: 'auto',
            background: 'white',
            borderRadius: 5,
            userSelect: 'none',
            transition: 'opacity 200ms',
        });
        this.setup((_a = inits === null || inits === void 0 ? void 0 : inits.items) !== null && _a !== void 0 ? _a : []);
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
            const view = new MenuItemView(this, info);
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
        this.styles.merge(StyleNames.Normal, { left: x, top: y }).refresh();
        return this;
    }
    show() {
        this.styles.merge(StyleNames.Normal, { display: 'grid' }).refresh();
        this.container.addChild(this);
        return this;
    }
    hide() {
        this._items.forEach(item => { var _a; return (_a = item.submenu) === null || _a === void 0 ? void 0 : _a.hide(); });
        this.styles.merge(StyleNames.Normal, { display: 'none' }).refresh();
        this.removeSelf();
        return this;
    }
}
exports.Menu = Menu;
Menu.StyleNames = StyleNames;
Menu.EventType = MenuEventType;

},{"../BaseView/StyleType":7,"../BaseView/View":10,"../Observer/HoverOb":28,"../utils":29}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergedSubwin = exports.SubwinTab = void 0;
const View_1 = require("../BaseView/View");
const DragInOutOB_1 = require("../Observer/DragInOutOB");
const Subwin_1 = require("./Subwin");
class SubwinTab extends View_1.View {
    constructor(inits) {
        super('div');
        this.styles.applyCls('subwin_tab').apply('_', {
            backgroundColor: inits.color,
            marginTop: 5,
            paddingLeft: 5,
            paddingRight: 5,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            alignSelf: 'stretch',
            display: 'flex',
            alignItems: 'center',
            marginRight: 1
        });
        this.inner.append(inits.title);
        this.inner.draggable = true;
        this.inner.addEventListener('dragstart', (e) => {
        });
        // this.inner.addEventListener('dragend', (e) => console.log('[SubwinTab]', e.type, inits.title))
        // this.inner.addEventListener('drag', (e) => console.log('[SubwinTab]', e.type, e))
        this.inner.addEventListener('dragover', (e) => {
            // if (e.target === this.inner) { return; }
            // console.log('[SubwinTab]', e.type, inits.title)
        });
    }
}
exports.SubwinTab = SubwinTab;
class MergedSubwin extends Subwin_1.Subwin {
    constructor() {
        var _a;
        super();
        this.subwins = [];
        this.tabs = new Map();
        this.header.styles;
        const onDragIn = (e, ele) => {
            console.log(ele.innerHTML, 'in');
        };
        const onDragOut = (e, ele) => {
            console.log(ele.innerHTML, 'out');
        };
        this._dragOutOB = new DragInOutOB_1.DragInOutOB({
            ele: this.header.titleView.inner,
            onDragOut,
            onDragIn,
        });
        this.header.iconView.content = '▨';
        this.content = new View_1.View('div');
        (_a = this.content) === null || _a === void 0 ? void 0 : _a.styles.apply('_', {
            position: 'relative',
            flex: 1,
            minWidth: '250px',
            minHeight: '200px',
        });
        this.styles.apply('normal', v => (Object.assign({}, v)));
        this.removeChild(this.footer);
        this.header.titleView.styles.apply('_', {
            display: 'flex',
            overflow: 'hidden'
        });
    }
    removeSubwin(subwin) {
        const idx = this.subwins.indexOf(subwin);
        if (idx < 0) {
            return;
        }
        this.subwins.splice(idx, 1);
        subwin.styles.forgo('merged');
        subwin.header.styles.forgo('merged');
    }
    addSubWin(subwin) {
        var _a, _b;
        if (this.subwins.indexOf(subwin) >= 0) {
            return;
        }
        this.subwins.push(subwin);
        subwin.styles.apply('merged', {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            boxShadow: 'none',
            resize: 'none',
        });
        subwin.header.styles.apply('merged', { display: 'none' });
        (_a = this.content) === null || _a === void 0 ? void 0 : _a.addChild(subwin);
        const tab = new SubwinTab({
            title: subwin.header.title,
            color: '#555555'
        });
        this.header.titleView.addChild(tab);
        this.tabs.set(subwin, tab);
        this.activedSubwin = subwin;
        const handleClick = () => {
            this.tabs.forEach((v, subwin) => {
                if (v === tab) {
                    v.styles.forgo('disactived');
                    subwin.styles.forgo('disactived');
                }
                else {
                    v.styles.apply('disactived', { opacity: '0.5' });
                    subwin.styles.apply('disactived', { display: 'none' });
                }
            });
        };
        this._dragOutOB.addDraggble(tab.inner);
        (_b = this.dragger.ignores) === null || _b === void 0 ? void 0 : _b.push(tab);
        tab.addEventListener('click', handleClick);
        handleClick();
    }
}
exports.MergedSubwin = MergedSubwin;

},{"../BaseView/View":10,"../Observer/DragInOutOB":26,"./Subwin":14}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subwin = exports.StyleNames = void 0;
const SubwinFooter_1 = require("./SubwinFooter");
const SubwinHeader_1 = require("./SubwinHeader");
const View_1 = require("../BaseView/View");
const ViewDragger_1 = require("../Helper/ViewDragger");
var StyleNames;
(function (StyleNames) {
    StyleNames["Root"] = "subwin";
    StyleNames["Raised"] = "subwin_raised";
    StyleNames["ChildRaised"] = "subwin_child_raised";
    StyleNames["ChildLowered"] = "subwin_child_lowered";
    StyleNames["Docked"] = "subwin_docked";
})(StyleNames = exports.StyleNames || (exports.StyleNames = {}));
class Subwin extends View_1.View {
    get dragger() { return this._dragger; }
    get workspace() { return this._workspace; }
    set workspace(v) { this._workspace = v; }
    get header() { return this._header; }
    ;
    get footer() { return this._footer; }
    ;
    get content() { return this._content; }
    set content(v) {
        if (this._content) {
            this._content.styles
                .remove(StyleNames.ChildRaised)
                .remove(StyleNames.ChildLowered)
                .forgo(StyleNames.ChildRaised, StyleNames.ChildLowered);
            this.removeChild(this._content);
        }
        this._content = v;
        if (v) {
            v.styles
                .register(StyleNames.ChildRaised, { opacity: 1, transition: 'all 200ms' })
                .register(StyleNames.ChildLowered, { opacity: 0.8, transition: 'all 200ms' });
            this.insertChild(this._footer, v);
        }
    }
    raise() {
        var _a, _b;
        this.styles.add(StyleNames.Raised).refresh();
        this.header.styles.remove(StyleNames.ChildLowered).apply(StyleNames.ChildRaised);
        (_a = this.content) === null || _a === void 0 ? void 0 : _a.styles.remove(StyleNames.ChildLowered).apply(StyleNames.ChildRaised);
        (_b = this.footer) === null || _b === void 0 ? void 0 : _b.styles.remove(StyleNames.ChildLowered).apply(StyleNames.ChildRaised);
    }
    lower() {
        var _a, _b;
        this.styles.remove(StyleNames.Raised).refresh();
        this.header.styles.remove(StyleNames.ChildRaised).apply(StyleNames.ChildLowered);
        (_a = this.content) === null || _a === void 0 ? void 0 : _a.styles.remove(StyleNames.ChildRaised).apply(StyleNames.ChildLowered);
        (_b = this.footer) === null || _b === void 0 ? void 0 : _b.styles.remove(StyleNames.ChildRaised).apply(StyleNames.ChildLowered);
    }
    constructor() {
        super('div');
        this._header = new SubwinHeader_1.SubwinHeader();
        this._footer = new SubwinFooter_1.SubwinFooter();
        this._dragWhenDocked = (x, y, prevX, prevY) => {
            var _a;
            if (Math.abs(x - prevX) + Math.abs(y - prevY) > 20) {
                const w0 = this.inner.offsetWidth;
                (_a = this.workspace) === null || _a === void 0 ? void 0 : _a.undockSubwin(this);
                const w1 = this.inner.offsetWidth;
                this._dragger.offsetX = (w1 - 60) * this._dragger.offsetX / w0;
            }
        };
        this._dragWhenUndocked = (x, y) => {
            this.styles.apply('view_dragger_pos', { left: x, top: y });
        };
        this.styles.register(StyleNames.Raised, {
            boxShadow: '5px 5px 10px 10px #00000022',
        }).register(StyleNames.Docked, {
            pointerEvents: 'all',
            position: 'relative',
            resize: 'none',
            width: 'unset',
            height: 'unset',
            left: 'unset',
            top: 'unset',
            boxShadow: 'unset',
            borderRadius: 0,
            zIndex: 'unset',
            border: 'none'
        }).apply(StyleNames.Root, {
            position: 'fixed',
            background: '#555555',
            overflow: 'hidden',
            border: '1px solid black',
            resize: 'both',
            boxShadow: '2px 2px 5px 5px #00000011',
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 200ms'
        });
        this._header.styles
            .register(StyleNames.ChildRaised, { opacity: 1, transition: 'all 200ms' })
            .register(StyleNames.ChildLowered, { opacity: 0.8, transition: 'all 200ms' });
        this._footer.styles
            .register(StyleNames.ChildRaised, { opacity: 1, transition: 'all 200ms' })
            .register(StyleNames.ChildLowered, { opacity: 0.8, transition: 'all 200ms' });
        this.addChild(this._header, this._footer);
        this._dragger = new ViewDragger_1.ViewDragger({
            responser: this,
            handles: [
                this.header.titleView,
                this.header.iconView
            ],
            handleMove: this._dragWhenUndocked,
        });
        this._resizeOb = new ResizeObserver(() => {
            const { width, height } = getComputedStyle(this.inner);
            this.styles.edit(StyleNames.Root, v => (Object.assign(Object.assign({}, v), { width, height })));
        });
        this._resizeOb.observe(this.inner);
    }
    onDocked() {
        this._resizeOb.unobserve(this.inner);
        this.styles.apply(StyleNames.Docked);
        this.dragger.handleMove = this._dragWhenDocked;
    }
    onUndocked() {
        this._resizeOb.observe(this.inner);
        this.styles.forgo(StyleNames.Docked);
        this.dragger.handleMove = this._dragWhenUndocked;
    }
    resizeDocked(width, height) {
        this.styles.apply(StyleNames.Docked, v => (Object.assign(Object.assign({}, v), { width, height })));
    }
}
exports.Subwin = Subwin;
Subwin.StyleNames = StyleNames;

},{"../BaseView/View":10,"../Helper/ViewDragger":25,"./SubwinFooter":15,"./SubwinHeader":16}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubwinFooter = void 0;
const View_1 = require("../BaseView/View");
class SubwinFooter extends View_1.View {
    constructor() {
        super('div');
        this.styles.apply('normal', {
            userSelect: 'none',
            width: '100%',
            color: '#FFFFFF88',
            padding: 3,
            background: '#333333',
            borderBottom: '#333333',
            display: 'flex',
            boxSizing: 'border-box',
            alignItems: 'center',
        });
    }
}
exports.SubwinFooter = SubwinFooter;

},{"../BaseView/View":10}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubwinHeader = exports.StyleNames = exports.Classnames = void 0;
const IconButton_1 = require("./IconButton");
const View_1 = require("../BaseView/View");
const FocusOb_1 = require("../Observer/FocusOb");
const Button_1 = require("../BaseView/Button");
var Classnames;
(function (Classnames) {
    Classnames["Root"] = "subwin_header";
    Classnames["IconView"] = "subwinheader_iconview";
    Classnames["TitleView"] = "subwinheader_titleview";
    Classnames["BtnClose"] = "subwinheader_btnclose";
})(Classnames = exports.Classnames || (exports.Classnames = {}));
var StyleNames;
(function (StyleNames) {
    StyleNames["Root"] = "subwin_header";
    StyleNames["IconView"] = "subwinheader_iconview";
    StyleNames["TitleView"] = "subwinheader_titleview";
    StyleNames["BtnClose"] = "subwinheader_btnclose";
})(StyleNames = exports.StyleNames || (exports.StyleNames = {}));
class SubwinHeader extends View_1.View {
    get iconView() { return this._iconView; }
    set iconView(v) { this._iconView = v; }
    get titleView() { return this._titleView; }
    set titleView(v) { this._titleView = v; }
    get title() { return this._titleView.inner.innerHTML; }
    set title(v) { this._titleView.inner.innerHTML = v; }
    constructor() {
        super('div');
        new FocusOb_1.FocusOb(this.inner, v => alert(v));
        this.styles
            .applyCls(Classnames.Root)
            .apply(StyleNames.Root, {
            userSelect: 'none',
            width: '100%',
            color: '#FFFFFF88',
            background: '#222222',
            borderBottom: '#222222',
            fontSize: 12,
            display: 'flex',
            boxSizing: 'border-box',
            alignItems: 'stretch',
            height: 28,
        });
        this._iconView = new Button_1.Button();
        this._iconView
            .styles
            .applyCls(Classnames.IconView)
            .apply(StyleNames.IconView, {
            alignSelf: 'center',
            marginLeft: 2,
        });
        this.addChild(this._iconView);
        this._titleView = new View_1.View('div');
        this._titleView.styles
            .applyCls(Classnames.TitleView)
            .apply(StyleNames.TitleView, {
            display: 'flex',
            alignItems: 'center',
            flex: 1,
        });
        this.addChild(this._titleView);
        this._btnClose = new IconButton_1.IconButton().init({ src: './ic_btn_close.svg' });
        this._btnClose.styles
            .applyCls(Classnames.BtnClose)
            .apply(StyleNames.BtnClose, {
            alignSelf: 'center',
            marginRight: 2,
        });
        this.addChild(this._btnClose);
    }
}
exports.SubwinHeader = SubwinHeader;
SubwinHeader.ClassNames = Classnames;
SubwinHeader.StyleNames = StyleNames;

},{"../BaseView/Button":2,"../BaseView/View":10,"../Observer/FocusOb":27,"./IconButton":11}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockView = exports.Resizer = exports.Direction = exports.DockViewStyles = exports.StyleNames = void 0;
const View_1 = require("../../BaseView/View");
const ViewDragger_1 = require("../../Helper/ViewDragger");
const HoverOb_1 = require("../../Observer/HoverOb");
const Subwin_1 = require("../Subwin");
var StyleNames;
(function (StyleNames) {
    StyleNames["Normal"] = "normal";
    StyleNames["Docked"] = "docked";
})(StyleNames = exports.StyleNames || (exports.StyleNames = {}));
exports.DockViewStyles = {
    [StyleNames.Normal]: {
        pointerEvents: 'none',
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        alignItems: 'stretch'
    },
    [StyleNames.Docked]: {
        position: 'relative',
        flex: 1
    }
};
var Direction;
(function (Direction) {
    Direction["None"] = "";
    Direction["H"] = "h";
    Direction["V"] = "v";
})(Direction = exports.Direction || (exports.Direction = {}));
class Resizer extends View_1.View {
    constructor(direction) {
        super('div');
        const w = direction === Direction.H ? 1 : undefined;
        const h = direction === Direction.V ? 1 : undefined;
        const hOffset = direction === Direction.H ? -3 : 0;
        const vOffset = direction === Direction.V ? -3 : 0;
        this.styles.apply('', {
            width: w,
            maxWidth: w,
            minWidth: w,
            height: h,
            maxHeight: h,
            minHeight: h,
            overflow: 'visible',
            zIndex: 1,
            position: 'relative',
            backgroundColor: 'black',
        });
        const handle = new View_1.View('div');
        handle.styles.register('hover', {
            backgroundColor: '#00000088',
        }).apply('', {
            left: hOffset,
            right: hOffset,
            top: vOffset,
            bottom: vOffset,
            cursor: direction === Direction.H ? 'col-resize' : 'row-resize',
            position: 'absolute',
            transition: 'background-color 200ms',
            pointerEvents: 'all'
        });
        new HoverOb_1.HoverOb(handle.inner).setCallback(hover => handle.styles[hover ? 'add' : 'remove']('hover').refresh());
        this.addChild(handle);
        const handleDown = () => {
            var _a;
            const chilren = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.children;
            const idx = chilren.indexOf(this);
            prevView = chilren[idx - 1];
            nextView = chilren[idx + 1];
            prevViewRect = prevView === null || prevView === void 0 ? void 0 : prevView.inner.getBoundingClientRect();
            nextViewRect = nextView === null || nextView === void 0 ? void 0 : nextView.inner.getBoundingClientRect();
        };
        const handleMove = (x, y, oldX, oldY) => {
            if ((prevView instanceof Subwin_1.Subwin) || prevView instanceof DockView && prevView.direction !== Direction.None) {
                prevView.resizeDocked(direction === Direction.H ? (-3 + prevViewRect.width - oldX + x) : undefined, direction === Direction.V ? (-3 + prevViewRect.height - oldY + y) : undefined);
            }
            if (nextView instanceof Subwin_1.Subwin || nextView instanceof DockView && nextView.direction !== Direction.None) {
                nextView.resizeDocked(direction === Direction.H ? (3 + nextViewRect.width + oldX - x) : undefined, direction === Direction.V ? (3 + nextViewRect.height + oldY - y) : undefined);
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
exports.Resizer = Resizer;
class DockView extends View_1.View {
    get direction() { return this._direction; }
    constructor(direction = Direction.None) {
        super('div');
        this._direction = Direction.None;
        this.prevResizers = new Map();
        this.nextResizers = new Map();
        this._direction = direction;
        if (direction === Direction.H) {
            this.styles.apply('', { display: "flex", flexDirection: 'row' });
        }
        else if (direction === Direction.V) {
            this.styles.apply('', { display: "flex", flexDirection: 'column' });
        }
        this.styles.applyCls('DockView');
        this.styles
            .registers(exports.DockViewStyles)
            .apply(StyleNames.Normal);
    }
    setContent(view) { super.addChild(view); }
    addChild(...children) {
        if (!children.length) {
            return this;
        }
        children.forEach(v => v.removeSelf());
        const beginAnchor = this.children[this.children.length - 1];
        for (let i = 1; i < children.length; i += 2) {
            const resizer = new Resizer(this.direction);
            this.nextResizers.set(children[i - 1], resizer);
            this.prevResizers.set(children[i], resizer);
            children.splice(i, 0, resizer);
        }
        if (beginAnchor) {
            const resizer = new Resizer(this.direction);
            this.nextResizers.set(beginAnchor, resizer);
            this.prevResizers.set(children[0], resizer);
            children.splice(0, 0, resizer);
        }
        super.addChild(...children);
        this.updateChildrenStyles(children);
        return this;
    }
    insertChild(anchor, ...children) {
        if (!children.length) {
            return this;
        }
        children.forEach(v => v.removeSelf());
        const idx = typeof anchor === 'number' ? anchor : this.children.indexOf(anchor);
        const beginAnchor = this.children[idx - 1];
        const endAnchor = this.children[idx];
        for (let i = 1; i < children.length; i += 2) {
            const resizer = new Resizer(this.direction);
            this.nextResizers.set(children[i - 1], resizer);
            this.prevResizers.set(children[i], resizer);
            children.splice(i, 0, resizer);
        }
        if (beginAnchor) {
            const resizer = new Resizer(this.direction);
            this.nextResizers.set(beginAnchor, resizer);
            this.prevResizers.set(children[0], resizer);
            children.splice(0, 0, resizer);
        }
        if (endAnchor) {
            const resizer = new Resizer(this.direction);
            this.nextResizers.set(children[children.length - 1], resizer);
            this.prevResizers.set(endAnchor, resizer);
            children.push(resizer);
        }
        super.insertChild(anchor, ...children);
        this.updateChildrenStyles(children);
        return this;
    }
    removeChild(...children) {
        const allChildren = this.children;
        super.removeChild(...children);
        const resizers = new Set();
        children.forEach(child => {
            if (allChildren[0] === child) {
                const resizer = this.nextResizers.get(child);
                resizer && resizers.add(resizer);
            }
            const resizer = this.prevResizers.get(child);
            resizer && resizers.add(resizer);
            if (child instanceof DockView || child instanceof Subwin_1.Subwin) {
                child.onUndocked();
            }
        });
        super.removeChild(...resizers);
        return this;
    }
    updateChildrenStyles(children) {
        children.forEach(v => {
            if (v instanceof DockView || v instanceof Subwin_1.Subwin) {
                v.onDocked();
            }
        });
    }
    onDocked() {
        this.styles.apply(StyleNames.Docked);
    }
    onUndocked() {
        this.styles.forgo(StyleNames.Docked);
    }
    resizeDocked(width, height) {
        this.styles.apply(StyleNames.Docked, v => (Object.assign(Object.assign({}, v), { width, height })));
    }
}
exports.DockView = DockView;

},{"../../BaseView/View":10,"../../Helper/ViewDragger":25,"../../Observer/HoverOb":28,"../Subwin":14}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicatorImage = void 0;
const Image_1 = require("../../BaseView/Image");
class IndicatorImage extends Image_1.Image {
    constructor(inits) {
        super({ src: inits.src });
        this.styles
            .register('', Object.assign({}, inits.style))
            .register('hover', {
            opacity: 0.8,
        })
            .register('normal', {
            width: 48,
            height: 48,
            zIndex: '10000',
            userSelect: 'none',
            background: '#000000FF',
            borderRadius: 5,
            opacity: 0,
            transition: 'all 200ms',
            pointerEvents: 'none'
        }).register('appear', {
            opacity: 0.3,
            pointerEvents: 'all'
        })
            .add('normal', '')
            .refresh();
        this.draggable = false;
    }
    onHover(hover) {
        this.styles[hover ? 'add' : 'remove']('hover').refresh();
    }
    onRemoved() {
        this.styles.remove('hover').refresh();
    }
    fakeIn() {
        this.styles.add('appear').refresh();
        this.hoverOb.disabled = false;
    }
    fakeOut() {
        this.styles.remove('appear').refresh();
        this.hoverOb.disabled = true;
        this.onHover(false);
    }
}
exports.IndicatorImage = IndicatorImage;

},{"../../BaseView/Image":4}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicatorView = void 0;
const View_1 = require("../../BaseView/View");
const IndicatorImage_1 = require("./IndicatorImage");
class IndicatorView extends View_1.View {
    constructor() {
        super('div');
        this._left = new IndicatorImage_1.IndicatorImage({ src: './ic_dock_to_left.svg' }).styles.apply('override', {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        }).view;
        this._top = new IndicatorImage_1.IndicatorImage({ src: './ic_dock_to_top.svg' }).styles.apply('override', {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        }).view;
        this._right = new IndicatorImage_1.IndicatorImage({ src: './ic_dock_to_right.svg' }).styles.apply('override', {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
        }).view;
        this._bottom = new IndicatorImage_1.IndicatorImage({ src: './ic_dock_to_bottom.svg' }).styles.apply('override', {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
        }).view;
        this._center = new IndicatorImage_1.IndicatorImage({ src: './ic_dock_to_bottom.svg' }).styles.apply('override', {
            borderRadius: 0,
        }).view;
        this.styles.applyCls('indicator_view');
        this.styles.register('normal', {
            position: 'absolute',
            opacity: 0,
            transition: 'opacity 200ms',
            zIndex: '9999',
            pointerEvents: 'none',
            boxSizing: 'border-box',
            border: '5px solid #0055ff88',
        }).register('appear', {
            opacity: 1,
            pointerEvents: 'all'
        }).apply('normal');
        const content = new View_1.View('div');
        content.styles.apply('', {
            position: 'fixed',
            zIndex: '9999',
            display: 'grid',
            transform: 'translate(-50%,-50%)',
            gridTemplateColumns: '48px 48px 48px',
            gridTemplateRows: '48px 48px 48px',
            gap: '0px',
        });
        content.addChild(new View_1.View('div'), this._top, new View_1.View('div'), this._left, this._center, this._right, new View_1.View('div'), this._bottom, new View_1.View('div'));
        this.addChild(content);
        new ResizeObserver(e => {
            const { left, top, width, height } = e[0].target.getBoundingClientRect();
            content.styles.apply('', v => (Object.assign(Object.assign({}, v), { left: left + width / 2, top: top + height / 2 })));
        }).observe(this.inner);
    }
    fakeIn() {
        this.styles.add('appear').refresh();
        this.hoverOb.disabled = false;
        this._left.fakeIn();
        this._right.fakeIn();
        this._top.fakeIn();
        this._bottom.fakeIn();
        this._center.fakeIn();
    }
    fakeOut() {
        this.styles.remove('appear').refresh();
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

},{"../../BaseView/View":10,"./IndicatorImage":18}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceView = void 0;
const View_1 = require("../../BaseView/View");
const EventType_1 = require("../../Events/EventType");
const utils_1 = require("../../utils");
const Subwin_1 = require("../Subwin");
const DockView_1 = require("./DockView");
const IndicatorImage_1 = require("./IndicatorImage");
const List_1 = require("../../Helper/List");
const IndicatorView_1 = require("./IndicatorView");
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
    get dockView() { return this._rootDockView; }
    constructor(arg0, inits) {
        var _a;
        super(arg0);
        this._zIndex = 0;
        this._pointerdowns = new Map();
        this._draggingSubwin = null;
        this._undockedWins = new List_1.List();
        this._dockedWins = new List_1.List();
        this._dockLeftIndicator = new IndicatorImage_1.IndicatorImage({
            src: './ic_dock_to_left.svg', style: {
                position: 'absolute', left: 16, top: 'calc(50% - 24px)'
            }
        });
        this._dockTopIndicator = new IndicatorImage_1.IndicatorImage({
            src: './ic_dock_to_top.svg', style: {
                position: 'absolute', left: 'calc(50% - 24px)', top: 16
            }
        });
        this._dockRightIndicator = new IndicatorImage_1.IndicatorImage({
            src: './ic_dock_to_right.svg', style: {
                position: 'absolute', right: 16, top: 'calc(50% - 24px)'
            }
        });
        this._dockBottomIndicator = new IndicatorImage_1.IndicatorImage({
            src: './ic_dock_to_bottom.svg', style: {
                position: 'absolute', left: 'calc(50% - 24px)', bottom: 16
            }
        });
        this._dockIndicator = new IndicatorView_1.IndicatorView();
        this._rootDockView = new DockView_1.DockView();
        this._deepestDockView = this._rootDockView;
        this._onSubwinDragStart = (e) => {
            this._draggingSubwin = View_1.View.try(e.target, Subwin_1.Subwin);
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
            const subwin = View_1.View.try(e.target, Subwin_1.Subwin);
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
                    const { left, top, width, height } = draggingIn.inner.getBoundingClientRect();
                    this._dockIndicator.styles.apply('normal', v => (Object.assign(Object.assign({}, v), { left, top, width, height })));
                    this._dockIndicator.fakeIn();
                }
                else {
                    this._dockIndicator.fakeOut();
                }
            }
        };
        this._onSubwinDragEnd = (e) => {
            const subwin = View_1.View.try(e.target, Subwin_1.Subwin);
            if (!subwin) {
                return;
            }
            if (this._dockBottomIndicator.hover) {
                this.dockToBottom(subwin);
            }
            else if (this._dockTopIndicator.hover) {
                this.dockToTop(subwin);
            }
            else if (this._dockLeftIndicator.hover) {
                this.dockToLeft(subwin);
            }
            else if (this._dockRightIndicator.hover) {
                this.dockToRight(subwin);
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
        this.styles.applyCls('workspaceView');
        this._rect = inits.rect;
        this._zIndex = (_a = inits === null || inits === void 0 ? void 0 : inits.zIndex) !== null && _a !== void 0 ? _a : this._zIndex;
        this.addChild(this._rootDockView);
        this.addChild(this._dockLeftIndicator);
        this.addChild(this._dockRightIndicator);
        this.addChild(this._dockTopIndicator);
        this.addChild(this._dockBottomIndicator);
        this.addChild(this._dockIndicator);
        (inits === null || inits === void 0 ? void 0 : inits.wins) && this.addChild(...inits.wins);
    }
    dockToTop(subwin) {
        this._dockedWins.insert(0, subwin);
        if (DockView_1.Direction.V === this._rootDockView.direction) {
            this._rootDockView.insertChild(0, subwin);
        }
        else {
            this._rootDockView = new DockView_1.DockView(DockView_1.Direction.V).insertChild(0, subwin, this._rootDockView);
            this.addChild(this._rootDockView);
        }
    }
    dockToBottom(subwin) {
        this._dockedWins.insert(0, subwin);
        if (DockView_1.Direction.V === this._rootDockView.direction) {
            this._rootDockView.addChild(subwin);
        }
        else {
            this._rootDockView = new DockView_1.DockView(DockView_1.Direction.V).addChild(this._rootDockView, subwin);
            this.addChild(this._rootDockView);
        }
    }
    dockToLeft(subwin) {
        this._dockedWins.insert(0, subwin);
        if (DockView_1.Direction.H === this._rootDockView.direction) {
            this._rootDockView.insertChild(0, subwin);
        }
        else {
            this._rootDockView = new DockView_1.DockView(DockView_1.Direction.H).insertChild(0, subwin, this._rootDockView);
            this.addChild(this._rootDockView);
        }
    }
    dockToRight(subwin) {
        this._dockedWins.insert(0, subwin);
        if (DockView_1.Direction.H === this._rootDockView.direction) {
            this._rootDockView.addChild(subwin);
        }
        else {
            this._rootDockView = new DockView_1.DockView(DockView_1.Direction.H).addChild(this._rootDockView, subwin);
            this.addChild(this._rootDockView);
        }
    }
    undockSubwin(subwin) {
        var _a;
        if (!(subwin.parent instanceof DockView_1.DockView)) {
            console.error('subwin is not docked!');
            return this;
        }
        let dockView = subwin.parent;
        subwin.removeSelf();
        this._dockedWins.delete(subwin);
        this.addChild(subwin);
        if (dockView.children.length <= 1) {
            (_a = dockView.parent) === null || _a === void 0 ? void 0 : _a.removeChild(dockView);
        }
        return this;
    }
    clampAllSubwin() {
        const rect = (0, utils_1.getValue)(this._rect);
        if (!rect) {
            return;
        }
        this.children.forEach(v => (v instanceof Subwin_1.Subwin) && this.clampSubwin(v, rect));
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
        subwin.styles.apply('view_dragger_pos', { left: x, top: y });
    }
    _handleAddedChildren(children) {
        children.forEach(v => {
            if (!(v instanceof Subwin_1.Subwin)) {
                return;
            }
            v.workspace = this;
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
        });
    }
    _handleRemovedChildren(children) {
        children.forEach(child => {
            if (!(child instanceof Subwin_1.Subwin)) {
                return;
            }
            const listener = this._pointerdowns.get(child);
            if (listener) {
                child.removeEventListener('pointerdown', listener);
                child.removeEventListener('touchstart', listener);
            }
            this._undockedWins.delete(child);
        });
    }
    addChild(...children) {
        super.addChild(...children);
        this._handleAddedChildren(children);
        this._updateUndockedWinsStyle();
        return this;
    }
    insertChild(anchorOrIdx, ...children) {
        super.insertChild(anchorOrIdx, ...children);
        this._handleAddedChildren(children);
        this._updateUndockedWinsStyle();
        return this;
    }
    removeChild(...children) {
        this._updateUndockedWinsStyle();
        this._handleRemovedChildren(children);
        return this;
    }
}
exports.WorkspaceView = WorkspaceView;

},{"../../BaseView/View":10,"../../Events/EventType":21,"../../Helper/List":24,"../../utils":29,"../Subwin":14,"./DockView":17,"./IndicatorImage":18,"./IndicatorView":19}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewEventType = exports.EventType = void 0;
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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
        this._handles.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown));
        this._handles.forEach(v => v.removeEventListener('touchstart', this._ontouchstart));
        this._handles = v;
        if (!this._disabled) {
            this._handles.forEach(v => v.addEventListener('pointerdown', this._onpointerdown));
            this._handles.forEach(v => v.addEventListener('touchstart', this._ontouchstart, { passive: true }));
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
        document.addEventListener('pointermove', this._pointermove);
        document.addEventListener('pointerup', this._onpointerup);
        document.addEventListener('blur', this._onblur);
        this._handles.forEach(v => v.addEventListener('pointerdown', this._onpointerdown));
        document.addEventListener('touchmove', this._ontouchmove);
        document.addEventListener('touchend', this._ontouchend);
        document.addEventListener('touchcancel', this._ontouchend);
        this._handles.forEach(v => v.addEventListener('touchstart', this._ontouchstart, { passive: true }));
    }
    stopListen() {
        document.removeEventListener('pointermove', this._pointermove);
        document.removeEventListener('pointerup', this._onpointerup);
        document.removeEventListener('blur', this._onblur);
        this._handles.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown));
        document.removeEventListener('touchmove', this._ontouchmove);
        document.removeEventListener('touchend', this._ontouchend);
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

},{"../Events/EventType":21}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"../BaseView/View":10,"./ElementDragger":23}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragInOutOB = void 0;
class DragInOutOB {
    get draggables() { return this._draggables; }
    set draggables(v) {
        this._draggables.forEach(v => {
            v.removeEventListener('dragstart', this._dragstart);
            v.removeEventListener('dragend', this._dragend);
        });
        this._draggables = v;
        this._draggables.forEach(v => {
            v.addEventListener('dragstart', this._dragstart);
            v.addEventListener('dragend', this._dragend);
        });
        if (this._draggables.indexOf(this._dragging) < 0) {
            delete this._dragging;
        }
    }
    draggableListening(v, listen) {
        if (listen) {
            v.addEventListener('dragstart', this._dragstart);
            v.addEventListener('dragend', this._dragend);
        }
        else {
            v.removeEventListener('dragstart', this._dragstart);
            v.removeEventListener('dragend', this._dragend);
        }
    }
    eleListening(listen) {
        if (listen) {
            this._ele.addEventListener('dragenter', this._dragenter);
            this._ele.addEventListener('dragleave', this._dragleave);
        }
        else {
            this._ele.removeEventListener('dragenter', this._dragenter);
            this._ele.removeEventListener('dragleave', this._dragleave);
        }
    }
    addDraggble(v) {
        const idx = this._draggables.indexOf(v);
        if (idx >= 0) {
            return false;
        }
        this._draggables.push(v);
        this.draggableListening(v, true);
        return true;
    }
    removeDraggble(v) {
        const idx = this._draggables.indexOf(v);
        if (idx < 0) {
            return false;
        }
        this._draggables.splice(idx, 1);
        this.draggableListening(v, false);
        this._dragging === v && delete this._dragging;
        return true;
    }
    get disabled() { return this._disabled; }
    set disabled(v) {
        if (this._disabled === v) {
            return;
        }
        if (v) {
            this.eleListening(false);
            this._draggables.forEach(v => this.draggableListening(v, false));
        }
        else {
            this.eleListening(true);
            this._draggables.forEach(v => this.draggableListening(v, true));
        }
    }
    constructor(inits) {
        this._disabled = true;
        this._draggables = [];
        this._dragstart = (e) => {
            this._dragging = e.target;
        };
        this._dragend = (e) => {
            delete this._dragging;
        };
        this._dragenter = (e) => {
            this._node = e.target;
        };
        this._dragleave = (e) => {
            var _a;
            if (this._node === e.target && this._dragging) {
                (_a = this._onDragOut) === null || _a === void 0 ? void 0 : _a.call(this, e, this._dragging);
            }
        };
        this._ele = inits.ele;
        this._onDragOut = inits.onDragOut;
        this.disabled = false;
    }
}
exports.DragInOutOB = DragInOutOB;

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerItemView = exports.LayersView = exports.LayersViewEventType = void 0;
const Button_1 = require("./G/BaseView/Button");
const SizeType_1 = require("./G/BaseView/SizeType");
const TextInput_1 = require("./G/BaseView/TextInput");
const View_1 = require("./G/BaseView/View");
const Subwin_1 = require("./G/CompoundView/Subwin");
const FocusOb_1 = require("./G/Observer/FocusOb");
var LayersViewEventType;
(function (LayersViewEventType) {
    LayersViewEventType["LayerAdded"] = "LayerAdded";
    LayersViewEventType["LayerRemoved"] = "LayerRemoved";
    LayersViewEventType["LayerNameChanged"] = "LayerNameChanged";
    LayersViewEventType["LayerVisibleChanged"] = "LayerVisibleChanged";
    LayersViewEventType["LayerActived"] = "LayerActived";
})(LayersViewEventType = exports.LayersViewEventType || (exports.LayersViewEventType = {}));
class LayersView extends Subwin_1.Subwin {
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
        const btnAddLayer = new Button_1.Button().init({ content: '📃', title: '新建图层', size: SizeType_1.SizeType.Small }).addEventListener('click', (e) => {
            const event = new CustomEvent(LayersViewEventType.LayerAdded, { detail: '' + Date.now() });
            this.inner.dispatchEvent(event);
        });
        this.footer.addChild(btnAddLayer);
        const btnAddFolder = new Button_1.Button().init({ content: '📂', title: '新建图层组', size: SizeType_1.SizeType.Small });
        this.footer.addChild(btnAddFolder);
    }
    layers() { return this._layers; }
    setLayers() { }
    addLayer(inits) {
        var _a;
        const item = new LayerItemView(inits);
        this._layers.push(item);
        (_a = this.content) === null || _a === void 0 ? void 0 : _a.addChild(item);
        item.addEventListener('click', () => {
            var _a, _b;
            (_b = (_a = this.content) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.forEach(v => v.selected = false);
            item.selected = true;
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
        this.styles.remove(this._prevStyleName).add(styleName).refresh();
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

},{"./G/BaseView/Button":2,"./G/BaseView/SizeType":6,"./G/BaseView/TextInput":9,"./G/BaseView/View":10,"./G/CompoundView/Subwin":14,"./G/Observer/FocusOb":27}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsView = exports.ToolButton = void 0;
const dist_1 = require("../../dist");
const SizeType_1 = require("./G/BaseView/SizeType");
const View_1 = require("./G/BaseView/View");
const IconButton_1 = require("./G/CompoundView/IconButton");
const Subwin_1 = require("./G/CompoundView/Subwin");
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
class ToolsView extends Subwin_1.Subwin {
    set onToolClick(v) {
        this._toolButtonGroup.onClick = v;
    }
    constructor() {
        super();
        this.header.title = 'tools';
        this.content = new View_1.View('div');
        this.content.styles.apply("", {
            flex: '1',
            overflowY: 'auto',
            overflowX: 'hidden'
        });
        const toolsBtns = [
            new ToolButton().init({ src: './ic_selector.svg', toolType: dist_1.ToolEnum.Selector }),
            new ToolButton().init({ src: './ic_pen.svg', toolType: dist_1.ToolEnum.Pen }),
            new ToolButton().init({ src: './ic_rect.svg', toolType: dist_1.ToolEnum.Rect }),
            new ToolButton().init({ src: './ic_oval.svg', toolType: dist_1.ToolEnum.Oval }),
            new ToolButton().init({ src: './ic_text.svg', toolType: dist_1.ToolEnum.Text })
        ];
        toolsBtns.forEach(btn => { var _a; return (_a = this.content) === null || _a === void 0 ? void 0 : _a.addChild(btn); });
        this._toolButtonGroup = new ButtonGroup_1.ButtonGroup({ buttons: toolsBtns });
        this.removeChild(this.footer);
    }
}
exports.ToolsView = ToolsView;

},{"../../dist":47,"./G/BaseView/SizeType":6,"./G/BaseView/View":10,"./G/CompoundView/IconButton":11,"./G/CompoundView/Subwin":14,"./G/Helper/ButtonGroup":22}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"../../../dist/utils/Rect":94,"../../../dist/utils/Vector":96,"./Color":32}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `{"snapshot":{"x":0,"y":0,"w":4096,"h":4096,"shapes":[]},"events":[{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328524304,"detail":{"shapeDatas":[{"t":1,"i":"1_16653285243041","x":0,"y":0,"w":0,"h":0,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524304,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285243041","x":159,"y":199,"w":0,"h":0,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[159,199]},{"t":1,"i":"1_16653285243041","x":0,"y":0,"w":0,"h":0,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524343,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285243041","x":157,"y":199,"w":2,"h":1,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[158,200,157,200]},{"t":1,"i":"1_16653285243041","x":159,"y":199,"w":0,"h":0,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[159,199]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524395,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285243041","x":157,"y":184,"w":13,"h":16,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[157,197,162,191,170,184]},{"t":1,"i":"1_16653285243041","x":157,"y":199,"w":2,"h":1,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[159,199,158,200,157,200]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524443,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285243041","x":157,"y":181,"w":28,"h":19,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[178,181,185,182]},{"t":1,"i":"1_16653285243041","x":157,"y":184,"w":13,"h":16,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[159,199,158,200,157,200,157,197,162,191,170,184]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524477,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285243041","x":157,"y":181,"w":37,"h":58,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[191,191,194,215,194,239]},{"t":1,"i":"1_16653285243041","x":157,"y":181,"w":28,"h":19,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[159,199,158,200,157,200,157,197,162,191,170,184,178,181,185,182]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524530,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285243041","x":157,"y":181,"w":37,"h":117,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[191,262,187,298]},{"t":1,"i":"1_16653285243041","x":157,"y":181,"w":37,"h":58,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[159,199,158,200,157,200,157,197,162,191,170,184,178,181,185,182,191,191,194,215,194,239]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524573,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285243041","x":157,"y":181,"w":37,"h":118,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{},"dotsType":2,"coords":[187,299,187,299]},{"t":1,"i":"1_16653285243041","x":157,"y":181,"w":37,"h":117,"z":1665328524305,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[159,199,158,200,157,200,157,197,162,191,170,184,178,181,185,182,191,191,194,215,194,239,191,262,187,298]}]]}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328524692,"detail":{"shapeDatas":[{"t":1,"i":"1_16653285246922","x":0,"y":0,"w":0,"h":0,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524693,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":239,"y":159,"w":0,"h":0,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[239,159]},{"t":1,"i":"1_16653285246922","x":0,"y":0,"w":0,"h":0,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524745,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":239,"y":159,"w":0,"h":36,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[239,165,239,175,239,195]},{"t":1,"i":"1_16653285246922","x":239,"y":159,"w":0,"h":0,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524795,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":239,"y":159,"w":14,"h":97,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[242,221,245,235,253,256]},{"t":1,"i":"1_16653285246922","x":239,"y":159,"w":0,"h":36,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524845,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":239,"y":159,"w":25,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[258,266,263,274,264,275]},{"t":1,"i":"1_16653285246922","x":239,"y":159,"w":14,"h":97,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524896,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":239,"y":159,"w":25,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[262,273,255,265,246,254]},{"t":1,"i":"1_16653285246922","x":239,"y":159,"w":25,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524946,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":222,"y":159,"w":42,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[235,242,229,239,222,241]},{"t":1,"i":"1_16653285246922","x":239,"y":159,"w":25,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328524996,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":50,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[217,244,214,246,214,247]},{"t":1,"i":"1_16653285246922","x":222,"y":159,"w":42,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525044,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":50,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[217,250,224,253]},{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":50,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525079,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":57,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[240,256,255,257,271,253]},{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":50,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525129,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":92,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[286,249,297,243,306,235]},{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":57,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525179,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":93,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[307,226,306,222,300,221]},{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":92,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525228,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":93,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[294,223,286,229]},{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":93,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525262,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":93,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[280,239,277,254,279,267]},{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":93,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525312,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":93,"h":117,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[284,273,292,276,302,273]},{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":93,"h":116,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525362,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":125,"h":117,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[313,263,329,235,339,210]},{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":93,"h":117,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525412,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":143,"w":144,"h":133,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[350,176,353,162,358,143]},{"t":1,"i":"1_16653285246922","x":214,"y":159,"w":125,"h":117,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525462,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":145,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[359,134,357,133,353,139]},{"t":1,"i":"1_16653285246922","x":214,"y":143,"w":144,"h":133,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525513,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":145,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[348,153,342,174,335,207]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":145,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525563,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":145,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[332,235,333,251,337,260]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":145,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525613,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":145,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[342,263,348,257,355,242]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":145,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525663,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":172,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[369,201,378,176,386,156]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":145,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525711,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":181,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[392,143,395,138]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":172,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525746,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":181,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[395,137,392,145,386,167]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":181,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525796,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":181,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[382,192,380,215,380,234]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":181,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525846,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":182,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[383,246,389,252,396,250]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":181,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525896,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":203,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[405,235,411,219,417,206]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":182,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525947,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":206,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[419,200,420,204,416,211]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":203,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328525997,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":206,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[415,221,415,230,420,239]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":206,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328526047,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":226,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[423,242,433,242,440,237]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":206,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211,415,221,415,230,420,239]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328526096,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":237,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[447,227,451,216,451,207]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":226,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211,415,221,415,230,420,239,423,242,433,242,440,237]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328526147,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":237,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[448,206,435,212,426,219]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":237,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211,415,221,415,230,420,239,423,242,433,242,440,237,447,227,451,216,451,207]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328526197,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":237,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[420,225,419,227,427,223]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":237,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211,415,221,415,230,420,239,423,242,433,242,440,237,447,227,451,216,451,207,448,206,435,212,426,219]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328526235,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":237,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{},"dotsType":2,"coords":[434,219,434,219]},{"t":1,"i":"1_16653285246922","x":214,"y":133,"w":237,"h":143,"z":1665328524694,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211,415,221,415,230,420,239,423,242,433,242,440,237,447,227,451,216,451,207,448,206,435,212,426,219,420,225,419,227,427,223]}]]}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328526782,"detail":{"shapeDatas":[{"t":1,"i":"1_16653285267823","x":0,"y":0,"w":0,"h":0,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328526782,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":522,"y":203,"w":0,"h":0,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[522,203]},{"t":1,"i":"1_16653285267823","x":0,"y":0,"w":0,"h":0,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328526847,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":512,"y":203,"w":10,"h":17,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[520,205,516,211,512,220]},{"t":1,"i":"1_16653285267823","x":522,"y":203,"w":0,"h":0,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328526896,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":12,"h":33,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[510,227,510,236]},{"t":1,"i":"1_16653285267823","x":512,"y":203,"w":10,"h":17,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328526930,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":24,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[517,247,522,250,534,253]},{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":12,"h":33,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328526980,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":43,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[542,248,550,235,553,222]},{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":24,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527033,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":43,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[553,213,551,209,551,208]},{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":43,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527084,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":43,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[551,212,551,214]},{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":43,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527132,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":45,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[553,229,554,239,555,243]},{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":43,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527179,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":54,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[559,246,564,247]},{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":45,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527215,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":74,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[569,242,577,232,584,217]},{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":54,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527265,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":77,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[586,209,587,204,586,202]},{"t":1,"i":"1_16653285267823","x":510,"y":203,"w":74,"h":50,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527315,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":77,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[579,204,574,205,571,207]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":77,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527366,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":77,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[570,208,575,208]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":77,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527415,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":88,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[581,209,588,209,598,209]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":77,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527463,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":100,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[603,209,610,208]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":88,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527499,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":101,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[611,208]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":100,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527538,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":101,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[610,208,608,208]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":101,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527580,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":101,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[606,208,602,213]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":101,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527614,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":101,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[598,223,597,231,598,239]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":101,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527663,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":101,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[601,243,606,244]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":101,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527696,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":108,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[611,242,618,231]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":101,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527731,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":111,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[621,218,621,211,616,208]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":108,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527780,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":111,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[613,208,605,213]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":111,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527814,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":111,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[601,215,601,216,609,212]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":111,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527864,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":118,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[620,207,628,204]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":111,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527898,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":140,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[644,202,648,202,650,209]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":118,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527948,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":140,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[650,217,650,230,650,240]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":140,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328527998,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":140,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[650,246,650,248,650,243]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":140,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209,650,217,650,230,650,240]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328528048,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":150,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[650,233,652,219,660,205]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":140,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209,650,217,650,230,650,240,650,246,650,248,650,243]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328528098,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":199,"w":166,"h":54,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[666,200,673,199,676,202]},{"t":1,"i":"1_16653285267823","x":510,"y":202,"w":150,"h":51,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209,650,217,650,230,650,240,650,246,650,248,650,243,650,233,652,219,660,205]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328528148,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":199,"w":168,"h":54,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[677,208,678,217,678,225]},{"t":1,"i":"1_16653285267823","x":510,"y":199,"w":166,"h":54,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209,650,217,650,230,650,240,650,246,650,248,650,243,650,233,652,219,660,205,666,200,673,199,676,202]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328528197,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285267823","x":510,"y":199,"w":168,"h":54,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{},"dotsType":2,"coords":[677,230,675,225,675,225]},{"t":1,"i":"1_16653285267823","x":510,"y":199,"w":168,"h":54,"z":1665328526785,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209,650,217,650,230,650,240,650,246,650,248,650,243,650,233,652,219,660,205,666,200,673,199,676,202,677,208,678,217,678,225]}]]}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328528642,"detail":{"shapeDatas":[{"t":1,"i":"1_16653285286424","x":0,"y":0,"w":0,"h":0,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328528642,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285286424","x":729,"y":138,"w":0,"h":0,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[729,138]},{"t":1,"i":"1_16653285286424","x":0,"y":0,"w":0,"h":0,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328528681,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285286424","x":729,"y":137,"w":1,"h":1,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[730,137]},{"t":1,"i":"1_16653285286424","x":729,"y":138,"w":0,"h":0,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[729,138]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328528731,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285286424","x":725,"y":137,"w":5,"h":8,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[729,139,725,145]},{"t":1,"i":"1_16653285286424","x":729,"y":137,"w":1,"h":1,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[729,138,730,137]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328528766,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285286424","x":702,"y":137,"w":28,"h":56,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[720,154,713,168,702,193]},{"t":1,"i":"1_16653285286424","x":725,"y":137,"w":5,"h":8,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[729,138,730,137,729,139,725,145]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328528815,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285286424","x":687,"y":137,"w":43,"h":111,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[694,214,687,238,687,248]},{"t":1,"i":"1_16653285286424","x":702,"y":137,"w":28,"h":56,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[729,138,730,137,729,139,725,145,720,154,713,168,702,193]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328528867,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285286424","x":687,"y":137,"w":43,"h":119,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[693,254,699,256]},{"t":1,"i":"1_16653285286424","x":687,"y":137,"w":43,"h":111,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[729,138,730,137,729,139,725,145,720,154,713,168,702,193,694,214,687,238,687,248]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328528915,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285286424","x":687,"y":137,"w":43,"h":119,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{},"dotsType":2,"coords":[714,249,719,245,719,245]},{"t":1,"i":"1_16653285286424","x":687,"y":137,"w":43,"h":119,"z":1665328528646,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[729,138,730,137,729,139,725,145,720,154,713,168,702,193,694,214,687,238,687,248,693,254,699,256]}]]}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328529023,"detail":{"shapeDatas":[{"t":1,"i":"1_16653285290235","x":0,"y":0,"w":0,"h":0,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529023,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":750,"y":210,"w":0,"h":0,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[750,210]},{"t":1,"i":"1_16653285290235","x":0,"y":0,"w":0,"h":0,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529065,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":746,"y":210,"w":4,"h":1,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[747,211,746,211]},{"t":1,"i":"1_16653285290235","x":750,"y":210,"w":0,"h":0,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[750,210]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529099,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":742,"y":210,"w":8,"h":1,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[744,211,742,211]},{"t":1,"i":"1_16653285290235","x":746,"y":210,"w":4,"h":1,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[750,210,747,211,746,211]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529150,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":729,"y":210,"w":21,"h":20,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[740,212,736,217,729,230]},{"t":1,"i":"1_16653285290235","x":742,"y":210,"w":8,"h":1,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[750,210,747,211,746,211,744,211,742,211]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529200,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":723,"y":210,"w":27,"h":40,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[724,243,723,248,728,250]},{"t":1,"i":"1_16653285290235","x":729,"y":210,"w":21,"h":20,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529250,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":723,"y":210,"w":42,"h":40,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[735,246,747,236,765,214]},{"t":1,"i":"1_16653285290235","x":723,"y":210,"w":27,"h":40,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529300,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":723,"y":151,"w":76,"h":99,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[779,194,793,167,799,151]},{"t":1,"i":"1_16653285290235","x":723,"y":210,"w":42,"h":40,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529349,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":723,"y":139,"w":78,"h":111,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[801,142,801,139]},{"t":1,"i":"1_16653285290235","x":723,"y":151,"w":76,"h":99,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214,779,194,793,167,799,151]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529383,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":723,"y":138,"w":78,"h":112,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[796,138,791,145,783,159]},{"t":1,"i":"1_16653285290235","x":723,"y":139,"w":78,"h":111,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214,779,194,793,167,799,151,801,142,801,139]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529433,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":723,"y":138,"w":78,"h":112,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[773,179,762,209,759,228]},{"t":1,"i":"1_16653285290235","x":723,"y":138,"w":78,"h":112,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214,779,194,793,167,799,151,801,142,801,139,796,138,791,145,783,159]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529483,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":723,"y":138,"w":78,"h":116,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[760,243,770,253,781,254]},{"t":1,"i":"1_16653285290235","x":723,"y":138,"w":78,"h":112,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214,779,194,793,167,799,151,801,142,801,139,796,138,791,145,783,159,773,179,762,209,759,228]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328529532,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285290235","x":723,"y":138,"w":85,"h":116,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{},"dotsType":2,"coords":[792,248,805,232,808,227,808,227]},{"t":1,"i":"1_16653285290235","x":723,"y":138,"w":78,"h":116,"z":1665328529028,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214,779,194,793,167,799,151,801,142,801,139,796,138,791,145,783,159,773,179,762,209,759,228,760,243,770,253,781,254]}]]}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328531790,"detail":{"shapeDatas":[{"t":1,"i":"1_16653285317906","x":0,"y":0,"w":0,"h":0,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328531790,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285317906","x":401,"y":349,"w":0,"h":0,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[401,349]},{"t":1,"i":"1_16653285317906","x":0,"y":0,"w":0,"h":0,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328531835,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285317906","x":401,"y":339,"w":10,"h":10,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[403,347,406,344,411,339]},{"t":1,"i":"1_16653285317906","x":401,"y":349,"w":0,"h":0,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[401,349]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328531885,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285317906","x":401,"y":331,"w":21,"h":18,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[416,335,422,331]},{"t":1,"i":"1_16653285317906","x":401,"y":339,"w":10,"h":10,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[401,349,403,347,406,344,411,339]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328531920,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285317906","x":401,"y":328,"w":51,"h":21,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[433,328,442,328,452,334]},{"t":1,"i":"1_16653285317906","x":401,"y":331,"w":21,"h":18,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[401,349,403,347,406,344,411,339,416,335,422,331]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328531969,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285317906","x":401,"y":328,"w":65,"h":25,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[460,342,466,353]},{"t":1,"i":"1_16653285317906","x":401,"y":328,"w":51,"h":21,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[401,349,403,347,406,344,411,339,416,335,422,331,433,328,442,328,452,334]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328532003,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285317906","x":401,"y":328,"w":66,"h":31,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{},"dotsType":2,"coords":[467,359,466,357,466,357]},{"t":1,"i":"1_16653285317906","x":401,"y":328,"w":65,"h":25,"z":1665328531796,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[401,349,403,347,406,344,411,339,416,335,422,331,433,328,442,328,452,334,460,342,466,353]}]]}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328532414,"detail":{"shapeDatas":[{"t":1,"i":"1_16653285324147","x":0,"y":0,"w":0,"h":0,"z":1665328532421,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328532414,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285324147","x":499,"y":354,"w":0,"h":0,"z":1665328532421,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[499,354]},{"t":1,"i":"1_16653285324147","x":0,"y":0,"w":0,"h":0,"z":1665328532421,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328532502,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285324147","x":499,"y":348,"w":2,"h":6,"z":1665328532421,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[500,353,500,351,501,348]},{"t":1,"i":"1_16653285324147","x":499,"y":354,"w":0,"h":0,"z":1665328532421,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[499,354]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328532552,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285324147","x":499,"y":335,"w":20,"h":19,"z":1665328532421,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[504,344,510,339,519,335]},{"t":1,"i":"1_16653285324147","x":499,"y":348,"w":2,"h":6,"z":1665328532421,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[499,354,500,353,500,351,501,348]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328532601,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285324147","x":499,"y":334,"w":37,"h":20,"z":1665328532421,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[526,334,536,339]},{"t":1,"i":"1_16653285324147","x":499,"y":335,"w":20,"h":19,"z":1665328532421,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[499,354,500,353,500,351,501,348,504,344,510,339,519,335]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328532666,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285324147","x":499,"y":334,"w":53,"h":25,"z":1665328532421,"style":{"a":"white","c":"round","f":"round","g":3},"status":{},"dotsType":2,"coords":[549,352,552,359,552,359]},{"t":1,"i":"1_16653285324147","x":499,"y":334,"w":37,"h":20,"z":1665328532421,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[499,354,500,353,500,351,501,348,504,344,510,339,519,335,526,334,536,339]}]]}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328533166,"detail":{"shapeDatas":[{"t":1,"i":"1_16653285331668","x":0,"y":0,"w":0,"h":0,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328533166,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285331668","x":428,"y":408,"w":0,"h":0,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[428,408]},{"t":1,"i":"1_16653285331668","x":0,"y":0,"w":0,"h":0,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328533221,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285331668","x":428,"y":408,"w":3,"h":8,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[428,410,429,413,431,416]},{"t":1,"i":"1_16653285331668","x":428,"y":408,"w":0,"h":0,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[428,408]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328533270,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285331668","x":428,"y":408,"w":19,"h":26,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[433,420,439,427,447,434]},{"t":1,"i":"1_16653285331668","x":428,"y":408,"w":3,"h":8,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[428,408,428,410,429,413,431,416]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328533318,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285331668","x":428,"y":408,"w":46,"h":38,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[457,440,474,446]},{"t":1,"i":"1_16653285331668","x":428,"y":408,"w":19,"h":26,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[428,408,428,410,429,413,431,416,433,420,439,427,447,434]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328533352,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285331668","x":428,"y":408,"w":82,"h":38,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":2,"coords":[489,446,510,438]},{"t":1,"i":"1_16653285331668","x":428,"y":408,"w":46,"h":38,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[428,408,428,410,429,413,431,416,433,420,439,427,447,434,457,440,474,446]}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_PEN","timeStamp":1665328533405,"detail":{"shapeDatas":[[{"t":1,"i":"1_16653285331668","x":428,"y":408,"w":118,"h":38,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{},"dotsType":2,"coords":[539,418,546,411,546,411]},{"t":1,"i":"1_16653285331668","x":428,"y":408,"w":82,"h":38,"z":1665328533174,"style":{"a":"white","c":"round","f":"round","g":3},"status":{"e":1},"dotsType":1,"coords":[428,408,428,410,429,413,431,416,433,420,439,427,447,434,457,440,474,446,489,446,510,438]}]]}}]}`;

},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `{"snapshot":{"x":0,"y":0,"w":4096,"h":4096,"shapes":[]},"events":[{"type":"TOOL_CHANGED","operator":"whiteboard","timeStamp":1665328594833,"detail":{"from":"TOOL_SELECTOR","to":"TOOL_RECT"}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328595289,"detail":{"shapeDatas":[{"t":2,"i":"2_16653285952891","x":0,"y":0,"w":0,"h":0,"z":1665328595290,"style":{"b":"#ff0000","a":"#000000","g":2},"status":{}}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595306,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":0,"h":0},{"i":"2_16653285952891","x":0,"y":0,"w":0,"h":0}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595348,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":1,"h":2},{"i":"2_16653285952891","x":52,"y":44,"w":0,"h":0}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595365,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":5,"h":8},{"i":"2_16653285952891","x":52,"y":44,"w":1,"h":2}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595400,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":13,"h":18},{"i":"2_16653285952891","x":52,"y":44,"w":5,"h":8}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595432,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":33,"h":32},{"i":"2_16653285952891","x":52,"y":44,"w":13,"h":18}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595466,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":47,"h":39},{"i":"2_16653285952891","x":52,"y":44,"w":33,"h":32}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595519,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":49,"h":40},{"i":"2_16653285952891","x":52,"y":44,"w":47,"h":39}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595552,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":52,"h":43},{"i":"2_16653285952891","x":52,"y":44,"w":49,"h":40}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595583,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":56,"h":45},{"i":"2_16653285952891","x":52,"y":44,"w":52,"h":43}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595608,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":63,"h":51},{"i":"2_16653285952891","x":52,"y":44,"w":56,"h":45}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595632,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":67,"h":54},{"i":"2_16653285952891","x":52,"y":44,"w":63,"h":51}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595650,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":74,"h":60},{"i":"2_16653285952891","x":52,"y":44,"w":67,"h":54}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595681,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":77,"h":63},{"i":"2_16653285952891","x":52,"y":44,"w":74,"h":60}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595698,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":80,"h":66},{"i":"2_16653285952891","x":52,"y":44,"w":77,"h":63}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595715,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":82,"h":68},{"i":"2_16653285952891","x":52,"y":44,"w":80,"h":66}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595733,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":87,"h":72},{"i":"2_16653285952891","x":52,"y":44,"w":82,"h":68}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595766,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":90,"h":74},{"i":"2_16653285952891","x":52,"y":44,"w":87,"h":72}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595784,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":97,"h":80},{"i":"2_16653285952891","x":52,"y":44,"w":90,"h":74}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595817,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":106,"h":86},{"i":"2_16653285952891","x":52,"y":44,"w":97,"h":80}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595850,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":114,"h":93},{"i":"2_16653285952891","x":52,"y":44,"w":106,"h":86}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595884,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":123,"h":99},{"i":"2_16653285952891","x":52,"y":44,"w":114,"h":93}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595917,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":132,"h":106},{"i":"2_16653285952891","x":52,"y":44,"w":123,"h":99}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595948,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":134,"h":109},{"i":"2_16653285952891","x":52,"y":44,"w":132,"h":106}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595965,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":136,"h":111},{"i":"2_16653285952891","x":52,"y":44,"w":134,"h":109}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328595982,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":137,"h":112},{"i":"2_16653285952891","x":52,"y":44,"w":136,"h":111}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328596000,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":139,"h":114},{"i":"2_16653285952891","x":52,"y":44,"w":137,"h":112}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328596034,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":141,"h":116},{"i":"2_16653285952891","x":52,"y":44,"w":139,"h":114}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328596083,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":142,"h":117},{"i":"2_16653285952891","x":52,"y":44,"w":141,"h":116}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328596388,"detail":{"shapeDatas":[[{"i":"2_16653285952891","x":52,"y":44,"w":142,"h":117},{"i":"2_16653285952891","x":52,"y":44,"w":142,"h":117}]]}},{"type":"TOOL_CHANGED","operator":"whiteboard","timeStamp":1665328598413,"detail":{"from":"TOOL_RECT","to":"TOOL_OVAL"}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328598860,"detail":{"shapeDatas":[{"t":3,"i":"3_16653285988602","x":0,"y":0,"w":0,"h":0,"z":1665328598862,"style":{"b":"#0000ff","a":"#000000","g":2},"status":{}}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328598876,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":0,"h":0},{"i":"3_16653285988602","x":0,"y":0,"w":0,"h":0}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328598920,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":7,"h":7},{"i":"3_16653285988602","x":282,"y":49,"w":0,"h":0}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328598952,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":15,"h":14},{"i":"3_16653285988602","x":282,"y":49,"w":7,"h":7}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328598969,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":27,"h":30},{"i":"3_16653285988602","x":282,"y":49,"w":15,"h":14}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599001,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":35,"h":38},{"i":"3_16653285988602","x":282,"y":49,"w":27,"h":30}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599019,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":52,"h":53},{"i":"3_16653285988602","x":282,"y":49,"w":35,"h":38}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599071,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":62,"h":63},{"i":"3_16653285988602","x":282,"y":49,"w":52,"h":53}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599104,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":69,"h":71},{"i":"3_16653285988602","x":282,"y":49,"w":62,"h":63}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599135,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":78,"h":80},{"i":"3_16653285988602","x":282,"y":49,"w":69,"h":71}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599154,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":86,"h":87},{"i":"3_16653285988602","x":282,"y":49,"w":78,"h":80}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599185,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":89,"h":89},{"i":"3_16653285988602","x":282,"y":49,"w":86,"h":87}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599205,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":96,"h":96},{"i":"3_16653285988602","x":282,"y":49,"w":89,"h":89}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599238,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":104,"h":101},{"i":"3_16653285988602","x":282,"y":49,"w":96,"h":96}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599268,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":107,"h":104},{"i":"3_16653285988602","x":282,"y":49,"w":104,"h":101}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599287,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":113,"h":109},{"i":"3_16653285988602","x":282,"y":49,"w":107,"h":104}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599320,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":118,"h":113},{"i":"3_16653285988602","x":282,"y":49,"w":113,"h":109}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599439,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":120,"h":114},{"i":"3_16653285988602","x":282,"y":49,"w":118,"h":113}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599469,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":122,"h":115},{"i":"3_16653285988602","x":282,"y":49,"w":120,"h":114}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599487,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":125,"h":117},{"i":"3_16653285988602","x":282,"y":49,"w":122,"h":115}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599504,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":129,"h":121},{"i":"3_16653285988602","x":282,"y":49,"w":125,"h":117}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599535,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":131,"h":122},{"i":"3_16653285988602","x":282,"y":49,"w":129,"h":121}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328599707,"detail":{"shapeDatas":[[{"i":"3_16653285988602","x":282,"y":49,"w":129,"h":120},{"i":"3_16653285988602","x":282,"y":49,"w":131,"h":122}]]}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328601336,"detail":{"shapeDatas":[{"t":3,"i":"3_16653286013363","x":0,"y":0,"w":0,"h":0,"z":1665328601339,"style":{"b":"#0000ff","a":"#000000","g":2},"status":{}}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601353,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":212,"y":327,"w":2,"h":0},{"i":"3_16653286013363","x":0,"y":0,"w":0,"h":0}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601374,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":202,"y":324,"w":12,"h":3},{"i":"3_16653286013363","x":212,"y":327,"w":2,"h":0}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601407,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":186,"y":314,"w":28,"h":13},{"i":"3_16653286013363","x":202,"y":324,"w":12,"h":3}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601438,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":172,"y":305,"w":42,"h":22},{"i":"3_16653286013363","x":186,"y":314,"w":28,"h":13}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601454,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":159,"y":295,"w":55,"h":32},{"i":"3_16653286013363","x":172,"y":305,"w":42,"h":22}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601472,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":132,"y":276,"w":82,"h":51},{"i":"3_16653286013363","x":159,"y":295,"w":55,"h":32}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601504,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":122,"y":270,"w":92,"h":57},{"i":"3_16653286013363","x":132,"y":276,"w":82,"h":51}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601522,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":106,"y":259,"w":108,"h":68},{"i":"3_16653286013363","x":122,"y":270,"w":92,"h":57}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601590,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":91,"y":246,"w":123,"h":81},{"i":"3_16653286013363","x":106,"y":259,"w":108,"h":68}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601624,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":80,"y":237,"w":134,"h":90},{"i":"3_16653286013363","x":91,"y":246,"w":123,"h":81}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601654,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":77,"y":235,"w":137,"h":92},{"i":"3_16653286013363","x":80,"y":237,"w":134,"h":90}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601672,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":76,"y":233,"w":138,"h":94},{"i":"3_16653286013363","x":77,"y":235,"w":137,"h":92}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601689,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":74,"y":232,"w":140,"h":95},{"i":"3_16653286013363","x":76,"y":233,"w":138,"h":94}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601707,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":73,"y":230,"w":141,"h":97},{"i":"3_16653286013363","x":74,"y":232,"w":140,"h":95}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601740,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":72,"y":229,"w":142,"h":98},{"i":"3_16653286013363","x":73,"y":230,"w":141,"h":97}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601771,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":71,"y":228,"w":143,"h":99},{"i":"3_16653286013363","x":72,"y":229,"w":142,"h":98}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601892,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":70,"y":226,"w":144,"h":101},{"i":"3_16653286013363","x":71,"y":228,"w":143,"h":99}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601921,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":69,"y":224,"w":145,"h":103},{"i":"3_16653286013363","x":70,"y":226,"w":144,"h":101}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601939,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":67,"y":219,"w":147,"h":108},{"i":"3_16653286013363","x":69,"y":224,"w":145,"h":103}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328601972,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":65,"y":213,"w":149,"h":114},{"i":"3_16653286013363","x":67,"y":219,"w":147,"h":108}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328602004,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":64,"y":211,"w":150,"h":116},{"i":"3_16653286013363","x":65,"y":213,"w":149,"h":114}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328602023,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":64,"y":208,"w":150,"h":119},{"i":"3_16653286013363","x":64,"y":211,"w":150,"h":116}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328602054,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":64,"y":207,"w":150,"h":120},{"i":"3_16653286013363","x":64,"y":208,"w":150,"h":119}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328602073,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":64,"y":204,"w":150,"h":123},{"i":"3_16653286013363","x":64,"y":207,"w":150,"h":120}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328602106,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":64,"y":201,"w":150,"h":126},{"i":"3_16653286013363","x":64,"y":204,"w":150,"h":123}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328602138,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":65,"y":199,"w":149,"h":128},{"i":"3_16653286013363","x":64,"y":201,"w":150,"h":126}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328602157,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":66,"y":197,"w":148,"h":130},{"i":"3_16653286013363","x":65,"y":199,"w":149,"h":128}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328602188,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":66,"y":196,"w":148,"h":131},{"i":"3_16653286013363","x":66,"y":197,"w":148,"h":130}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328602206,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":67,"y":194,"w":147,"h":133},{"i":"3_16653286013363","x":66,"y":196,"w":148,"h":131}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_OVAL","timeStamp":1665328602363,"detail":{"shapeDatas":[[{"i":"3_16653286013363","x":67,"y":194,"w":147,"h":133},{"i":"3_16653286013363","x":67,"y":194,"w":147,"h":133}]]}},{"type":"TOOL_CHANGED","operator":"whiteboard","timeStamp":1665328603214,"detail":{"from":"TOOL_OVAL","to":"TOOL_RECT"}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328603748,"detail":{"shapeDatas":[{"t":2,"i":"2_16653286037484","x":0,"y":0,"w":0,"h":0,"z":1665328603752,"style":{"b":"#ff0000","a":"#000000","g":2},"status":{}}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328603766,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":385,"y":303,"w":0,"h":0},{"i":"2_16653286037484","x":0,"y":0,"w":0,"h":0}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328603823,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":384,"y":303,"w":1,"h":0},{"i":"2_16653286037484","x":385,"y":303,"w":0,"h":0}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328603840,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":370,"y":288,"w":15,"h":15},{"i":"2_16653286037484","x":384,"y":303,"w":1,"h":0}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328603873,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":358,"y":276,"w":27,"h":27},{"i":"2_16653286037484","x":370,"y":288,"w":15,"h":15}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328603891,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":337,"y":257,"w":48,"h":46},{"i":"2_16653286037484","x":358,"y":276,"w":27,"h":27}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328603924,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":331,"y":252,"w":54,"h":51},{"i":"2_16653286037484","x":337,"y":257,"w":48,"h":46}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328603941,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":326,"y":248,"w":59,"h":55},{"i":"2_16653286037484","x":331,"y":252,"w":54,"h":51}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328603994,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":320,"y":245,"w":65,"h":58},{"i":"2_16653286037484","x":326,"y":248,"w":59,"h":55}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604021,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":313,"y":241,"w":72,"h":62},{"i":"2_16653286037484","x":320,"y":245,"w":65,"h":58}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604041,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":307,"y":236,"w":78,"h":67},{"i":"2_16653286037484","x":313,"y":241,"w":72,"h":62}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604058,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":296,"y":228,"w":89,"h":75},{"i":"2_16653286037484","x":307,"y":236,"w":78,"h":67}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604091,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":291,"y":224,"w":94,"h":79},{"i":"2_16653286037484","x":296,"y":228,"w":89,"h":75}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604108,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":283,"y":218,"w":102,"h":85},{"i":"2_16653286037484","x":291,"y":224,"w":94,"h":79}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604140,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":279,"y":215,"w":106,"h":88},{"i":"2_16653286037484","x":283,"y":218,"w":102,"h":85}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604159,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":273,"y":209,"w":112,"h":94},{"i":"2_16653286037484","x":279,"y":215,"w":106,"h":88}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604192,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":269,"y":206,"w":116,"h":97},{"i":"2_16653286037484","x":273,"y":209,"w":112,"h":94}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604226,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":267,"y":204,"w":118,"h":99},{"i":"2_16653286037484","x":269,"y":206,"w":116,"h":97}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604258,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":266,"y":203,"w":119,"h":100},{"i":"2_16653286037484","x":267,"y":204,"w":118,"h":99}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604275,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":264,"y":200,"w":121,"h":103},{"i":"2_16653286037484","x":266,"y":203,"w":119,"h":100}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604323,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":263,"y":199,"w":122,"h":104},{"i":"2_16653286037484","x":264,"y":200,"w":121,"h":103}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604371,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":262,"y":198,"w":123,"h":105},{"i":"2_16653286037484","x":263,"y":199,"w":122,"h":104}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328604469,"detail":{"shapeDatas":[[{"i":"2_16653286037484","x":262,"y":197,"w":123,"h":106},{"i":"2_16653286037484","x":262,"y":198,"w":123,"h":105}]]}},{"type":"SHAPES_ADDED","operator":"whiteboard","timeStamp":1665328605718,"detail":{"shapeDatas":[{"t":2,"i":"2_16653286057185","x":0,"y":0,"w":0,"h":0,"z":1665328605723,"style":{"b":"#ff0000","a":"rgba(85,51,51,1.00)","g":2},"status":{}}]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328605736,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":613,"y":268,"w":0,"h":0},{"i":"2_16653286057185","x":0,"y":0,"w":0,"h":0}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328605827,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":606,"y":262,"w":7,"h":6},{"i":"2_16653286057185","x":613,"y":268,"w":0,"h":0}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328605858,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":596,"y":253,"w":17,"h":15},{"i":"2_16653286057185","x":606,"y":262,"w":7,"h":6}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328605875,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":583,"y":241,"w":30,"h":27},{"i":"2_16653286057185","x":596,"y":253,"w":17,"h":15}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328605892,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":570,"y":229,"w":43,"h":39},{"i":"2_16653286057185","x":583,"y":241,"w":30,"h":27}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328605908,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":560,"y":220,"w":53,"h":48},{"i":"2_16653286057185","x":570,"y":229,"w":43,"h":39}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328605926,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":550,"y":211,"w":63,"h":57},{"i":"2_16653286057185","x":560,"y":220,"w":53,"h":48}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328605942,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":539,"y":200,"w":74,"h":68},{"i":"2_16653286057185","x":550,"y":211,"w":63,"h":57}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328605975,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":535,"y":196,"w":78,"h":72},{"i":"2_16653286057185","x":539,"y":200,"w":74,"h":68}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328605992,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":532,"y":191,"w":81,"h":77},{"i":"2_16653286057185","x":535,"y":196,"w":78,"h":72}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606011,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":529,"y":188,"w":84,"h":80},{"i":"2_16653286057185","x":532,"y":191,"w":81,"h":77}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606044,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":524,"y":181,"w":89,"h":87},{"i":"2_16653286057185","x":529,"y":188,"w":84,"h":80}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606109,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":517,"y":172,"w":96,"h":96},{"i":"2_16653286057185","x":524,"y":181,"w":89,"h":87}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606125,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":516,"y":170,"w":97,"h":98},{"i":"2_16653286057185","x":517,"y":172,"w":96,"h":96}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606142,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":515,"y":169,"w":98,"h":99},{"i":"2_16653286057185","x":516,"y":170,"w":97,"h":98}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606160,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":513,"y":167,"w":100,"h":101},{"i":"2_16653286057185","x":515,"y":169,"w":98,"h":99}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606193,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":511,"y":166,"w":102,"h":102},{"i":"2_16653286057185","x":513,"y":167,"w":100,"h":101}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606211,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":508,"y":163,"w":105,"h":105},{"i":"2_16653286057185","x":511,"y":166,"w":102,"h":102}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606242,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":507,"y":161,"w":106,"h":107},{"i":"2_16653286057185","x":508,"y":163,"w":105,"h":105}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606259,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":506,"y":161,"w":107,"h":107},{"i":"2_16653286057185","x":507,"y":161,"w":106,"h":107}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606276,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":506,"y":160,"w":107,"h":108},{"i":"2_16653286057185","x":506,"y":161,"w":107,"h":107}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606294,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":504,"y":158,"w":109,"h":110},{"i":"2_16653286057185","x":506,"y":160,"w":107,"h":108}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606326,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":502,"y":157,"w":111,"h":111},{"i":"2_16653286057185","x":504,"y":158,"w":109,"h":110}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606374,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":502,"y":156,"w":111,"h":112},{"i":"2_16653286057185","x":502,"y":157,"w":111,"h":111}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606443,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":501,"y":156,"w":112,"h":112},{"i":"2_16653286057185","x":502,"y":156,"w":111,"h":112}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606477,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":498,"y":156,"w":115,"h":112},{"i":"2_16653286057185","x":501,"y":156,"w":112,"h":112}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606510,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":497,"y":156,"w":116,"h":112},{"i":"2_16653286057185","x":498,"y":156,"w":115,"h":112}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606543,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":495,"y":156,"w":118,"h":112},{"i":"2_16653286057185","x":497,"y":156,"w":116,"h":112}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606577,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":493,"y":156,"w":120,"h":112},{"i":"2_16653286057185","x":495,"y":156,"w":118,"h":112}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606593,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":490,"y":157,"w":123,"h":111},{"i":"2_16653286057185","x":493,"y":156,"w":120,"h":112}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606627,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":487,"y":157,"w":126,"h":111},{"i":"2_16653286057185","x":490,"y":157,"w":123,"h":111}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606659,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":486,"y":158,"w":127,"h":110},{"i":"2_16653286057185","x":487,"y":157,"w":126,"h":111}]]}},{"type":"SHAPES_CHANGED","operator":"TOOL_RECT","timeStamp":1665328606794,"detail":{"shapeDatas":[[{"i":"2_16653286057185","x":486,"y":157,"w":127,"h":111},{"i":"2_16653286057185","x":486,"y":158,"w":127,"h":110}]]}}]}`;

},{}],36:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("../../dist");
const ColorView_1 = __importDefault(require("./ColorView"));
const Button_1 = require("./G/BaseView/Button");
const Canvas_1 = require("./G/BaseView/Canvas");
const View_1 = require("./G/BaseView/View");
const Menu_1 = require("./G/CompoundView/Menu");
const MergedSubwin_1 = require("./G/CompoundView/MergedSubwin");
const Subwin_1 = require("./G/CompoundView/Subwin");
const WorkspaceView_1 = require("./G/CompoundView/Workspace/WorkspaceView");
const LayersView_1 = require("./LayersView");
const ToolsView_1 = require("./ToolsView");
const demo_helloworld_1 = __importDefault(require("./demo_helloworld"));
const demo_rect_n_oval_1 = __importDefault(require("./demo_rect_n_oval"));
const factory = dist_1.FactoryMgr.createFactory(dist_1.FactoryEnum.Default);
let board;
const workspace = window.workspace = new WorkspaceView_1.WorkspaceView('body', {
    rect() {
        return {
            x: 0, y: 0,
            w: document.body.offsetWidth,
            h: document.body.offsetHeight
        };
    },
    zIndex: 1000,
});
const menu = new Menu_1.Menu(workspace, {
    items: [{
            key: 'tool_view',
            label: '工具',
            items: [{
                    key: dist_1.ToolEnum.Selector,
                    label: dist_1.ToolEnum.Selector,
                }, {
                    key: dist_1.ToolEnum.Pen,
                    label: dist_1.ToolEnum.Pen,
                }, {
                    key: dist_1.ToolEnum.Rect,
                    label: dist_1.ToolEnum.Rect,
                }, {
                    key: dist_1.ToolEnum.Oval,
                    label: dist_1.ToolEnum.Oval,
                }, {
                    key: dist_1.ToolEnum.Text,
                    label: dist_1.ToolEnum.Text,
                }]
        }, {
            key: 'menu_item_1',
            label: 'menu_item_1'
        }, {
            key: 'menu_item_2',
            divider: true
        }, {
            key: 'menu_item_3',
            label: 'menu_item_3',
            items: [{
                    key: 'menu_item_3_0',
                    label: 'menu_item_3_0'
                }, {
                    key: 'menu_item_3_1',
                    label: 'menu_item_3_1'
                }, {
                    key: 'menu_item_3_2',
                    divider: true
                }, {
                    key: 'menu_item_3_3',
                    label: 'menu_item_3_3',
                }]
        }]
});
menu.addEventListener(Menu_1.Menu.EventType.ItemClick, (e) => {
    console.log(e.detail.key);
    switch (e.detail.key) {
        case dist_1.ToolEnum.Rect:
        case dist_1.ToolEnum.Oval:
        case dist_1.ToolEnum.Pen:
        case dist_1.ToolEnum.Polygon:
        case dist_1.ToolEnum.Text:
        case dist_1.ToolEnum.Selector:
            board.setToolType(e.detail.key);
            break;
    }
});
const mergedSubwin2 = new MergedSubwin_1.MergedSubwin();
workspace.addChild(mergedSubwin2);
const mergedSubwin = new MergedSubwin_1.MergedSubwin();
workspace.addChild(mergedSubwin);
const layersView = new LayersView_1.LayersView();
workspace.addChild(layersView);
layersView.addEventListener(LayersView_1.LayersView.EventType.LayerAdded, () => {
    const layerItem = layersView.addLayer({
        name: '' + Date.now(),
        id: factory.newLayerId()
    });
    const canvas = addLayerCanvas();
    board.addLayer({ info: layerItem.state, onscreen: canvas.inner });
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
layersView.addLayer({
    name: '' + Date.now(),
    id: factory.newLayerId()
});
const toolsView = new ToolsView_1.ToolsView;
workspace.addChild(toolsView);
toolsView.styles.apply('normal', (v) => (Object.assign(Object.assign({}, v), { left: '150px', top: 5 })));
toolsView.onToolClick = (btn) => board.setToolType(btn.toolType);
const colorView = new ColorView_1.default;
workspace.addChild(colorView);
colorView.styles.apply('normal', (v) => (Object.assign(Object.assign({}, v), { left: '150px', top: '400px' })));
colorView.inner.addEventListener(ColorView_1.default.EventTypes.LineColorChange, (e) => {
    const rgba = e.detail;
    dist_1.FactoryMgr.listTools().forEach(toolType => {
        var _a;
        const shape = (_a = dist_1.FactoryMgr.toolInfo(toolType)) === null || _a === void 0 ? void 0 : _a.shape;
        if (!shape)
            return;
        const template = board.factory.shapeTemplate(shape);
        template.strokeStyle = '' + rgba.toHex();
    });
});
colorView.inner.addEventListener(ColorView_1.default.EventTypes.FillColorChange, (e) => {
    const rgba = e.detail;
    dist_1.FactoryMgr.listTools().forEach(toolType => {
        var _a;
        const shape = (_a = dist_1.FactoryMgr.toolInfo(toolType)) === null || _a === void 0 ? void 0 : _a.shape;
        if (!shape)
            return;
        const template = board.factory.shapeTemplate(shape);
        template.fillStyle = '' + rgba.toHex();
    });
});
const toyView = new Subwin_1.Subwin();
toyView.header.title = 'others';
workspace.addChild(toyView);
window.addEventListener('resize', () => workspace.clampAllSubwin());
toyView.content = new View_1.View('div');
toyView.content.styles.apply('', {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden'
});
toyView.content.addChild();
new Button_1.Button().init({
    content: 'select all'
}).addEventListener('click', () => board.selectAll());
toyView.content.addChild(new Button_1.Button().init({
    content: 'remove selected'
}).addEventListener('click', () => board.removeSelected()));
toyView.content.addChild(new Button_1.Button().init({
    content: 'remove all'
}).addEventListener('click', () => board.removeAll()));
function randomShapeItem(item) {
    const v255 = () => Math.floor(Math.random() * 255);
    item.geo(Math.floor(Math.random() * board.width), Math.floor(Math.random() * board.height), 50, 50);
    item.data.fillStyle = `rgb(${v255()},${v255()},${v255()})`;
    item.data.strokeStyle = `rgb(${v255()},${v255()},${v255()})`;
}
toyView.content.addChild(new Button_1.Button().init({
    content: 'random add 1000 rect'
}).addEventListener('click', () => {
    const items = [];
    for (let i = 0; i < 1000; ++i) {
        const item = board.factory.newShape(dist_1.ShapeEnum.Rect);
        item.data.layer = board.layer().id;
        randomShapeItem(item);
        items.push(item);
    }
    board.add(...items);
}));
toyView.content.addChild(new Button_1.Button().init({
    content: 'random add 1000 oval'
}).addEventListener('click', () => {
    const items = [];
    for (let i = 0; i < 1000; ++i) {
        const item = board.factory.newShape(dist_1.ShapeEnum.Oval);
        item.data.layer = board.layer().id;
        randomShapeItem(item);
        items.push(item);
    }
    board.add(...items);
}));
toyView.content.addChild(new Button_1.Button().init({
    content: 'random draw 1000 pen'
}).addEventListener('click', () => {
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
let _recorder;
let _player;
const jsonView = new Subwin_1.Subwin();
workspace.addChild(jsonView);
jsonView.header.title = 'json';
jsonView.content = new View_1.View('div');
jsonView.content.styles.apply('', { flex: 1, display: 'flex', flexDirection: 'column' });
const json_textarea = new View_1.View('textarea');
jsonView.content.addChild(new Button_1.Button().init({ content: 'JSON化' }).addEventListener('click', () => {
    json_textarea.inner.value = board.toJsonStr();
}));
jsonView.content.addChild(new Button_1.Button().init({ content: '反JSON化' }).addEventListener('click', () => {
    board.fromJsonStr(json_textarea.inner.value);
}));
jsonView.content.addChild(json_textarea);
const startRecord = () => {
    _recorder === null || _recorder === void 0 ? void 0 : _recorder.destory();
    _recorder = new dist_1.Recorder();
    _recorder.start(board);
};
const endRecord = () => {
    if (!_recorder_textarea || !_recorder)
        return;
    _recorder_textarea.inner.value = _recorder.toJsonStr();
    _recorder === null || _recorder === void 0 ? void 0 : _recorder.destory();
    _recorder = undefined;
};
const replay = (str) => {
    _player === null || _player === void 0 ? void 0 : _player.stop();
    _player = new dist_1.Player();
    _player.start(board, JSON.parse(str));
};
const recorderView = new Subwin_1.Subwin();
workspace.addChild(recorderView);
recorderView.header.title = 'recorder';
recorderView.content = new View_1.View('div');
recorderView.content.styles.apply('', { flex: 1, display: 'flex', flexDirection: 'column' });
const _recorder_textarea = new View_1.View('textarea');
recorderView.content.addChild(new Button_1.Button().init({ content: '开始录制' }).addEventListener('click', startRecord));
recorderView.content.addChild(new Button_1.Button().init({ content: '停止录制' }).addEventListener('click', endRecord));
recorderView.content.addChild(new Button_1.Button().init({ content: '回放' }).addEventListener('click', () => {
    endRecord();
    replay(_recorder_textarea.inner.value);
}));
recorderView.content.addChild(new Button_1.Button().init({ content: 'replay: write "hello world"' }).addEventListener('click', () => {
    endRecord();
    replay(demo_helloworld_1.default);
}));
recorderView.content.addChild(new Button_1.Button().init({ content: 'replay: rect & oval' }).addEventListener('click', () => {
    endRecord();
    replay(demo_rect_n_oval_1.default);
}));
recorderView.content.addChild(_recorder_textarea);
const rootView = new View_1.View('div');
rootView.styles.apply('', { pointerEvents: 'all' }).applyCls('root');
workspace.dockView.setContent(rootView);
const blackboard = new View_1.View('div');
blackboard.styles.applyCls('blackboard');
rootView.addChild(blackboard);
function addLayerCanvas() {
    const canvas = new Canvas_1.Canvas();
    canvas.styles.apply('', {
        position: 'absolute',
        touchAction: 'none',
        userSelect: 'none',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        transition: 'opacity 200ms'
    });
    canvas.inner.addEventListener('contextmenu', (e) => {
        menu.move(e.x, e.y).show();
    });
    canvas.draggable = false;
    blackboard.addChild(canvas);
    return canvas;
}
const layers = layersView.layers().map((layer, idx) => {
    const canvas = addLayerCanvas();
    return { info: layer.state, onscreen: canvas.inner };
});
board = factory.newWhiteBoard({ layers, width: 1024, height: 1024 });
window.board = board;

},{"../../dist":47,"./ColorView":1,"./G/BaseView/Button":2,"./G/BaseView/Canvas":3,"./G/BaseView/View":10,"./G/CompoundView/Menu":12,"./G/CompoundView/MergedSubwin":13,"./G/CompoundView/Subwin":14,"./G/CompoundView/Workspace/WorkspaceView":20,"./LayersView":30,"./ToolsView":31,"./demo_helloworld":34,"./demo_rect_n_oval":35}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = exports.LayerInfo = void 0;
class LayerInfo {
    get id() { return this._id; }
    get name() { return this._name; }
    ;
    constructor(inits) {
        this._id = inits.id;
        this._name = inits.name;
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
        this._info = new LayerInfo(inits.info);
        this._onscreen = inits.onscreen;
        this._ctx = this._onscreen.getContext('2d');
        this._offscreen = document.createElement('canvas');
        this._offscreen.width = inits.onscreen.width;
        this._offscreen.height = inits.onscreen.height;
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

},{}],38:[function(require,module,exports){
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
    addLayer(init) {
        if (this._layers.has(init.info.id)) {
            console.error(`[WhiteBoard] addLayer(): layerId already existed! id = ${init.info.id}`);
            return false;
        }
        const layer = new Layer_1.Layer(init);
        layer.width = this.width;
        layer.height = this.height;
        layer.onscreen.style.pointerEvents = 'none';
        this._layers.set(init.info.id, layer);
        layer.onscreen.addEventListener('pointerdown', this.pointerdown);
        layer.onscreen.addEventListener('pointermove', this.pointermove);
        layer.onscreen.addEventListener('pointerup', this.pointerup);
        layer.onscreen.addEventListener('contextmenu', e => { e.preventDefault(); e.stopPropagation(); });
        return true;
    }
    removeLayer(layerId) {
        if (this._layers.has(layerId)) {
            console.error(`[WhiteBoard] removeLayer(): layer not found! id = ${layerId}`);
            return false;
        }
        const layer = this._layers.get(layerId);
        layer.onscreen.removeEventListener('pointerdown', this.pointerdown);
        layer.onscreen.removeEventListener('pointermove', this.pointermove);
        layer.onscreen.removeEventListener('pointerup', this.pointerup);
        layer.onscreen.removeEventListener('contextmenu', e => { e.preventDefault(); e.stopPropagation(); });
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
    constructor(factory, options) {
        this._toolType = tools_1.ToolEnum.Pen;
        this._layers = new Map();
        this._mousedown = false;
        this._tools = {};
        this._selects = [];
        this._eventEmitter = document.createElement('div');
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
        options.width && (this._width = options.width);
        options.height && (this._height = options.height);
        options.toolType && (this._toolType = options.toolType);
        options.layers.forEach(v => this.addLayer(v));
        this.editLayer(options.layers[0].info.id);
        this._dirty = { x: 0, y: 0, w: this.onscreen().width, h: this.onscreen().height };
        this.render();
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
            w: this.width,
            h: this.height,
            shapes: this.shapes().map(v => v.data)
        };
    }
    toJsonStr() {
        return JSON.stringify(this.toJson());
    }
    fromJson(jobj) {
        this.removeAll();
        this._layers.forEach(layer => {
            layer.onscreen.width = jobj.w;
            layer.onscreen.height = jobj.h;
        });
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
    addEventListener(arg0, arg1, arg2) {
        return this._eventEmitter.addEventListener(arg0, arg1, arg2);
    }
    removeEventListener(arg0, arg1, arg2) {
        return this._eventEmitter.removeEventListener(arg0, arg1, arg2);
    }
    dispatchEvent(e) {
        return this._eventEmitter.dispatchEvent(e);
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
exports.WhiteBoard = WhiteBoard;

},{"../event":42,"../tools":85,"../utils":97,"./Layer":37}],39:[function(require,module,exports){
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
__exportStar(require("./WhiteBoard"), exports);

},{"./Layer":37,"./WhiteBoard":38}],40:[function(require,module,exports){
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
})(EventEnum = exports.EventEnum || (exports.EventEnum = {}));

},{}],41:[function(require,module,exports){
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

},{"./EventType":40}],42:[function(require,module,exports){
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

},{"./EventType":40,"./Events":41}],43:[function(require,module,exports){
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
            snapshot: screenplay.snapshot || {},
            events: screenplay.events || [],
        };
        this.startTime = Date.now();
        this.firstEventTime = 0;
        actor.fromJson(screenplay.snapshot);
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
        console.log('[Player] applyEvent(), e = ', e);
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

},{"../event":42}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = void 0;
const event_1 = require("../event");
class Recorder {
    constructor() {
        this.cancellers = [];
        this._screenplay = {
            startTime: Date.now(),
            snapshot: {},
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
            snapshot: actor.toJson(),
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

},{"../event":42}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],46:[function(require,module,exports){
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

},{"./Player":43,"./Recorder":44,"./Screenplay":45}],47:[function(require,module,exports){
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
// export * from './event'
__exportStar(require("./features"), exports);
__exportStar(require("./mgr"), exports);
__exportStar(require("./shape"), exports);
__exportStar(require("./tools"), exports);
__exportStar(require("./utils"), exports);

},{"./board":39,"./features":46,"./mgr":52,"./shape":58,"./tools":85,"./utils":97}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
const Data_1 = require("../shape/base/Data");
const ShapesMgr_1 = require("./ShapesMgr");
const Shape_1 = require("../shape/base/Shape");
const InvalidTool_1 = require("../tools/base/InvalidTool");
const FactoryEnum_1 = require("./FactoryEnum");
const FactoryMgr_1 = require("./FactoryMgr");
const board_1 = require("../board");
const Tag = '[Factory]';
class Factory {
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
        return new board_1.WhiteBoard(this, options);
    }
    newShapesMgr() {
        return new ShapesMgr_1.ShapesMgr();
    }
    newTool(toolType) {
        const create = FactoryMgr_1.FactoryMgr.tools[toolType];
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
        const create = FactoryMgr_1.FactoryMgr.shapeDatas[shapeType];
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
        const isNew = typeof v === 'string' || typeof v === 'number';
        const type = isNew ? v : v.t;
        const data = this.newShapeData(type);
        const template = isNew ? this.shapeTemplate(v) : v;
        data.copyFrom(template);
        if (isNew) {
            data.id = this.newId(data);
            data.z = this.newZ(data);
        }
        const create = FactoryMgr_1.FactoryMgr.shapes[type];
        return create ? create(data) : new Shape_1.Shape(data);
    }
    newLayerId() {
        return `layer_${Date.now()}_${++this._time}`;
    }
}
exports.Factory = Factory;
FactoryMgr_1.FactoryMgr.registerFactory(FactoryEnum_1.FactoryEnum.Default, () => new Factory(), { name: 'bulit-in Factory', desc: 'bulit-in Factory' });

},{"../board":39,"../shape/base/Data":54,"../shape/base/Shape":55,"../tools/base/InvalidTool":81,"./FactoryEnum":49,"./FactoryMgr":50,"./ShapesMgr":51}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryMgr = void 0;
const ToolEnum_1 = require("../tools/ToolEnum");
const ShapeEnum_1 = require("../shape/ShapeEnum");
const Tag = '[Factory]';
class FactoryMgr {
    static listFactories() {
        return Object.keys(this.factoryInfos);
    }
    static createFactory(type) {
        const create = this.factorys[type];
        if (!create) {
            const error = new Error(`${Tag}create("${type}"), ${type} is not registered`);
            throw error;
        }
        const ret = create();
        if (ret.type !== type) {
            console.warn(Tag, `create("${type}"), ${type} is not corrent! check member 'type' of your Factory!`);
        }
        return ret;
    }
    static registerFactory(type, creator, info) {
        this.factorys[type] = creator;
        this.factoryInfos[type] = info;
    }
    static listTools() {
        return Object.keys(this.tools);
    }
    static toolInfo(type) {
        return this.toolInfos[type];
    }
    static registerTool(type, creator, info) {
        this.tools[type] = creator;
        this.toolInfos[type] = Object.assign(Object.assign({}, info), { name: (info === null || info === void 0 ? void 0 : info.name) || (0, ToolEnum_1.getToolName)(type), desc: (info === null || info === void 0 ? void 0 : info.desc) || (0, ToolEnum_1.getToolName)(type) });
    }
    static listShapes() {
        return Object.keys(this.shapes);
    }
    static registerShape(type, dataCreator, shapeCreator, info) {
        this.shapeDatas[type] = dataCreator;
        this.shapes[type] = shapeCreator;
        this.shapeInfos[type] = {
            name: (info === null || info === void 0 ? void 0 : info.name) || (0, ShapeEnum_1.getShapeName)(type),
            desc: (info === null || info === void 0 ? void 0 : info.desc) || (0, ShapeEnum_1.getShapeName)(type),
            type
        };
    }
    static shapeInfo(type) {
        return this.shapeInfos[type];
    }
}
exports.FactoryMgr = FactoryMgr;
FactoryMgr.tools = {};
FactoryMgr.toolInfos = {};
FactoryMgr.shapeDatas = {};
FactoryMgr.shapes = {};
FactoryMgr.shapeInfos = {};
FactoryMgr.factorys = {};
FactoryMgr.factoryInfos = {};

},{"../shape/ShapeEnum":53,"../tools/ToolEnum":80}],51:[function(require,module,exports){
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

},{"../utils/Array":88,"../utils/Rect":94}],52:[function(require,module,exports){
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
__exportStar(require("./FactoryMgr"), exports);
__exportStar(require("./ShapesMgr"), exports);

},{"./Factory":48,"./FactoryEnum":49,"./FactoryMgr":50,"./ShapesMgr":51}],53:[function(require,module,exports){
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
})(ShapeEnum = exports.ShapeEnum || (exports.ShapeEnum = {}));
function getShapeName(type) {
    switch (type) {
        case ShapeEnum.Invalid: return 'ShapeEnum.Invalid';
        case ShapeEnum.Pen: return 'ShapeEnum.Pen';
        case ShapeEnum.Rect: return 'ShapeEnum.Rect';
        case ShapeEnum.Oval: return 'ShapeEnum.Oval';
        case ShapeEnum.Text: return 'ShapeEnum.Text';
        case ShapeEnum.Polygon: return 'ShapeEnum.Polygon';
        default: return type;
    }
}
exports.getShapeName = getShapeName;

},{}],54:[function(require,module,exports){
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

},{"../ShapeEnum":53}],55:[function(require,module,exports){
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
    markDirty(rect = this.boundingRect()) {
        var _a;
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

},{"../../utils/Rect":94}],56:[function(require,module,exports){
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

},{"./Shape":55}],57:[function(require,module,exports){
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

},{"./Data":54,"./Shape":55,"./ShapeNeedPath":56}],58:[function(require,module,exports){
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

},{"./ShapeEnum":53,"./base":57,"./oval":62,"./pen":66,"./polygon":70,"./rect":74,"./text":79}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvalData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class OvalData extends base_1.ShapeData {
    constructor() {
        super();
        this.type = ShapeEnum_1.ShapeEnum.Oval;
        this.fillStyle = '#0000ff';
        this.strokeStyle = '#000000';
        this.lineWidth = 2;
    }
    copy() {
        return new OvalData().copyFrom(this);
    }
}
exports.OvalData = OvalData;

},{"../ShapeEnum":53,"../base":57}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeOval = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
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
FactoryMgr_1.FactoryMgr.registerShape(ShapeEnum_1.ShapeEnum.Oval, () => new Data_1.OvalData, d => new ShapeOval(d));

},{"../../mgr/FactoryMgr":50,"../ShapeEnum":53,"../base/ShapeNeedPath":56,"./Data":59}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvalTool = void 0;
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
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
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Oval, () => new OvalTool(), { name: 'oval', desc: 'oval drawer', shape: ShapeEnum_1.ShapeEnum.Oval });

},{"../../mgr/FactoryMgr":50,"../../tools/ToolEnum":80,"../../tools/base/SimpleTool":82,"../ShapeEnum":53}],62:[function(require,module,exports){
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

},{"./Data":59,"./Shape":60,"./Tool":61}],63:[function(require,module,exports){
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
        this.strokeStyle = 'white';
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

},{"../ShapeEnum":53,"../base":57}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapePen = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
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
FactoryMgr_1.FactoryMgr.registerShape(ShapeEnum_1.ShapeEnum.Pen, () => new Data_1.PenData, d => new ShapePen(d));

},{"../../mgr/FactoryMgr":50,"../ShapeEnum":53,"../base":57,"./Data":63}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenTool = void 0;
const ToolEnum_1 = require("../../tools/ToolEnum");
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
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
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Pen, () => new PenTool(), { name: 'pen', desc: 'simple pen', shape: ShapeEnum_1.ShapeEnum.Pen });

},{"../../event":42,"../../mgr/FactoryMgr":50,"../../tools/ToolEnum":80,"../ShapeEnum":53,"./Data":63}],66:[function(require,module,exports){
arguments[4][62][0].apply(exports,arguments)
},{"./Data":63,"./Shape":64,"./Tool":65,"dup":62}],67:[function(require,module,exports){
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

},{"../ShapeEnum":53,"../base":57}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapePolygon = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
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
FactoryMgr_1.FactoryMgr.registerShape(ShapeEnum_1.ShapeEnum.Polygon, () => new Data_1.PolygonData, d => new ShapePolygon(d));

},{"../../mgr/FactoryMgr":50,"../ShapeEnum":53,"../base/ShapeNeedPath":56,"./Data":67}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonTool = void 0;
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "PolygonTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
const desc = {
    name: 'Polygon', desc: 'Polygon Drawer', shape: ShapeEnum_1.ShapeEnum.Polygon
};
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Polygon, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Polygon, ShapeEnum_1.ShapeEnum.Polygon), desc);

},{"../../mgr/FactoryMgr":50,"../../tools/ToolEnum":80,"../../tools/base/SimpleTool":82,"../ShapeEnum":53}],70:[function(require,module,exports){
arguments[4][62][0].apply(exports,arguments)
},{"./Data":67,"./Shape":68,"./Tool":69,"dup":62}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class RectData extends base_1.ShapeData {
    constructor() {
        super();
        this.type = ShapeEnum_1.ShapeEnum.Rect;
        this.fillStyle = '#ff0000';
        this.strokeStyle = '#000000';
        this.lineWidth = 2;
    }
    copy() {
        return new RectData().copyFrom(this);
    }
}
exports.RectData = RectData;

},{"../ShapeEnum":53,"../base":57}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeRect = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
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
FactoryMgr_1.FactoryMgr.registerShape(ShapeEnum_1.ShapeEnum.Rect, () => new Data_1.RectData, d => new ShapeRect(d));

},{"../../mgr/FactoryMgr":50,"../ShapeEnum":53,"../base/ShapeNeedPath":56,"./Data":71}],73:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectTool = void 0;
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "RectTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Rect, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Rect, ShapeEnum_1.ShapeEnum.Rect), { name: 'rect', desc: 'rect drawer', shape: ShapeEnum_1.ShapeEnum.Rect });

},{"../../mgr/FactoryMgr":50,"../../tools/ToolEnum":80,"../../tools/base/SimpleTool":82,"../ShapeEnum":53}],74:[function(require,module,exports){
arguments[4][62][0].apply(exports,arguments)
},{"./Data":71,"./Shape":72,"./Tool":73,"dup":62}],75:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextData = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const base_1 = require("../base");
class TextData extends base_1.ShapeData {
    constructor() {
        super();
        this.text = '';
        this.font = '24px Simsum';
        this.t_l = 3;
        this.t_r = 3;
        this.t_t = 3;
        this.t_b = 3;
        this.type = ShapeEnum_1.ShapeEnum.Text;
        this.fillStyle = 'white';
        this.strokeStyle = '';
        this.lineWidth = 0;
    }
    copyFrom(other) {
        super.copyFrom(other);
        if (typeof other.text === 'string')
            this.text = other.text;
        if (typeof other.font === 'string')
            this.font = other.font;
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

},{"../ShapeEnum":53,"../base":57}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeText = void 0;
const ShapeEnum_1 = require("../ShapeEnum");
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
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
FactoryMgr_1.FactoryMgr.registerShape(ShapeEnum_1.ShapeEnum.Text, () => new Data_1.TextData, d => new ShapeText(d));

},{"../../mgr/FactoryMgr":50,"../../utils/Rect":94,"../ShapeEnum":53,"../base":57,"./Data":75,"./TextSelection":77}],77:[function(require,module,exports){
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
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const event_1 = require("../../event");
const Tag = '[TextTool]';
class TextTool {
    constructor() {
        this._editor = document.createElement('textarea');
        this.setCurShape = (shape) => {
            const preShape = this._curShape;
            if (preShape === shape)
                return;
            preShape && (preShape.editing = false);
            this._curShape = shape;
            shape && (shape.editing = true);
            if (shape) {
                this._updateEditorStyle(shape);
                this._editor.style.display = 'block';
                this._editor.value = shape.text;
            }
            else {
                this._editor.style.display = 'gone';
            }
            if (preShape && !preShape.text) {
                const board = this.board;
                if (!board)
                    return;
                board.remove(preShape);
            }
        };
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
        this._editor.addEventListener('input', this._updateShapeText);
        document.addEventListener('selectionchange', this._updateShapeText);
    }
    end() {
        this._editor.removeEventListener('input', this._updateShapeText);
        document.removeEventListener('selectionchange', this._updateShapeText);
        this.setCurShape();
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
            return this.setCurShape();
        }
        else if (!shapeText) {
            const newShapeText = board.factory.newShape(ShapeEnum_1.ShapeEnum.Text);
            newShapeText.data.layer = board.layer().id;
            newShapeText.move(dot.x, dot.y);
            board.add(newShapeText);
            shapeText = newShapeText;
        }
        this.setCurShape(shapeText);
        setTimeout(() => this._editor.focus(), 10);
    }
    pointerDraw(dot) { }
    pointerUp(dot) { }
}
exports.TextTool = TextTool;
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Text, () => new TextTool, { name: 'text', desc: 'text drawer', shape: ShapeEnum_1.ShapeEnum.Text });

},{"../../event":42,"../../mgr/FactoryMgr":50,"../../tools/ToolEnum":80,"../ShapeEnum":53}],79:[function(require,module,exports){
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
exports.getToolName = exports.ToolEnum = void 0;
var ToolEnum;
(function (ToolEnum) {
    ToolEnum["Invalid"] = "";
    ToolEnum["Selector"] = "TOOL_SELECTOR";
    ToolEnum["Pen"] = "TOOL_PEN";
    ToolEnum["Rect"] = "TOOL_RECT";
    ToolEnum["Oval"] = "TOOL_OVAL";
    ToolEnum["Text"] = "TOOL_TEXT";
    ToolEnum["Polygon"] = "TOOL_Polygon";
})(ToolEnum = exports.ToolEnum || (exports.ToolEnum = {}));
function getToolName(type) {
    switch (type) {
        case ToolEnum.Invalid: return 'ToolEnum.Invalid';
        case ToolEnum.Pen: return 'ToolEnum.Pen';
        case ToolEnum.Rect: return 'ToolEnum.Rect';
        case ToolEnum.Oval: return 'ToolEnum.Oval';
        case ToolEnum.Text: return 'ToolEnum.Text';
        case ToolEnum.Polygon: return 'ToolEnum.Polygon';
        default: return type;
    }
}
exports.getToolName = getToolName;

},{}],81:[function(require,module,exports){
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

},{"../ToolEnum":80}],82:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTool = void 0;
const event_1 = require("../../event");
const RectHelper_1 = require("../../utils/RectHelper");
const Tag = '[SimpleTool]';
class SimpleTool {
    get type() { return this._type; }
    constructor(type, shapeType) {
        this._keys = {};
        this._rect = new RectHelper_1.RectHelper();
        this._type = type;
        this._shapeType = shapeType;
        window.addEventListener('keydown', e => this.keydown(e));
        window.addEventListener('keyup', e => this.keyup(e));
    }
    keydown(e) {
        switch (e.key) {
            case 'Control':
            case 'Alt':
            case 'Shift':
                if (!this._keys[e.key]) {
                    this._keys[e.key] = true;
                    this.applyRect();
                }
                return;
        }
    }
    keyup(e) {
        switch (e.key) {
            case 'Control':
            case 'Alt':
            case 'Shift':
                if (this._keys[e.key]) {
                    this._keys[e.key] = false;
                    this.applyRect();
                }
                return;
        }
    }
    holdingKey(...keys) {
        for (let i = 0; i < keys.length; ++i) {
            if (!keys[i]) {
                return false;
            }
        }
        return true;
    }
    start() {
    }
    end() {
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

},{"../../event":42,"../../utils/RectHelper":95}],83:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],84:[function(require,module,exports){
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

},{"./InvalidTool":81,"./SimpleTool":82,"./Tool":83}],85:[function(require,module,exports){
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

},{"./ToolEnum":80,"./base":84,"./selector":87}],86:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorTool = exports.SelectorStatus = void 0;
const RectHelper_1 = require("../../utils/RectHelper");
const Data_1 = require("../../shape/base/Data");
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
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
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Selector, () => new SelectorTool, {
    name: 'selector',
    desc: 'selector'
});

},{"../../event/Events":41,"../../mgr/FactoryMgr":50,"../../shape/base/Data":54,"../../shape/rect/Shape":72,"../../utils/RectHelper":95,"../ToolEnum":80}],87:[function(require,module,exports){
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

},{"./SelectorTool":86}],88:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIndex = void 0;
const findIndex = (arr, func) => {
    for (let i = 0; i < arr.length; ++i) {
        if (func(arr[i], i, arr))
            return i;
    }
    return -1;
};
exports.findIndex = findIndex;

},{}],89:[function(require,module,exports){
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
__exportStar(require("./Array"), exports);
__exportStar(require("./BinaryRange"), exports);
__exportStar(require("./BinaryTree"), exports);
__exportStar(require("./Dot"), exports);
__exportStar(require("./ITree"), exports);
__exportStar(require("./QuadTree"), exports);
__exportStar(require("./Rect"), exports);
__exportStar(require("./Vector"), exports);

},{"./Array":88,"./BinaryRange":89,"./BinaryTree":90,"./Dot":91,"./ITree":92,"./QuadTree":93,"./Rect":94,"./Vector":96}]},{},[36]);
