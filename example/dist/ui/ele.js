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
exports.UI = void 0;
var UI = /** @class */ (function () {
    function UI(container, initState, render) {
        this.eleStack = [];
        this.eles = {};
        this.eleStack = [container];
        this.render = render;
        this.state = (typeof initState !== 'function') ? initState : initState();
        this.render(this);
    }
    UI.prototype.setState = function (state) {
        this.state = (typeof state !== 'function') ? state : state(this.state);
        this.render(this);
    };
    UI.prototype.refresh = function () {
        this.render(this);
    };
    UI.prototype.null = function () {
        var parent = this.eleStack[this.eleStack.length - 1];
        var child = document.createElement('div');
        child.style.display = 'none';
        this.appendChild(parent, child);
    };
    UI.prototype.applyOptions = function (ele, options) {
        if (!ele || !options)
            return;
        for (var key in options) {
            if (key === 'style' || key === 'attributes')
                continue;
            ele[key] = options[key];
        }
        for (var key in options === null || options === void 0 ? void 0 : options.style)
            ele.style[key] = (options === null || options === void 0 ? void 0 : options.style)[key];
        for (var key in options === null || options === void 0 ? void 0 : options.attrs)
            ele.setAttribute(key, options.attrs[key]);
    };
    UI.prototype.appendChild = function (parent, child, options) {
        if (parent === this.eleStack[0]) {
            if (!(options === null || options === void 0 ? void 0 : options.offscreen))
                this.root ? parent.replaceChild(child, this.root) : parent.appendChild(child);
            this.root = child;
        }
        else {
            !(options === null || options === void 0 ? void 0 : options.offscreen) && parent.appendChild(child);
        }
    };
    UI.prototype.dynamic = function (tagName, arg2, arg3) {
        var updater = typeof arg2 === 'function' ? arg2 : arg3;
        var options = typeof arg2 === 'function' ? undefined : __assign({}, arg2);
        var endIdx = this.eleStack.length - 1;
        var parent = this.eleStack[endIdx];
        var key = "".concat(tagName, "_").concat(endIdx, "_").concat(parent.childNodes.length, "_").concat(!!(options === null || options === void 0 ? void 0 : options.offscreen));
        var prev = this.eles[key];
        var child = document.createElement(tagName);
        this.eleStack.push(child);
        this.eles[key] = child;
        this.applyOptions(child, options);
        updater && updater(child, prev);
        this.appendChild(parent, child, options);
        this.eleStack.pop();
        return child;
    };
    UI.prototype.static = function (tagName, arg2, arg3, arg4) {
        var options = typeof arg2 !== 'function' ? arg2 : undefined;
        var init = typeof arg2 === 'function' ? arg2 : arg3;
        var updater = typeof arg2 === 'function' ? arg3 : arg4;
        var endIdx = this.eleStack.length - 1;
        var parent = this.eleStack[endIdx];
        var key = "".concat(tagName, "_").concat(endIdx, "_").concat(parent.childNodes.length, "_").concat(!!(options === null || options === void 0 ? void 0 : options.offscreen));
        var child = this.eles[key] || document.createElement(tagName);
        this.applyOptions(child, options);
        if (key in this.eles) {
            this.eleStack.push(child);
            updater && updater(child);
        }
        else {
            this.eles[key] = child;
            this.eleStack.push(child);
            init && init(child);
        }
        this.appendChild(parent, child, options);
        this.eleStack.pop();
        return child;
    };
    return UI;
}());
exports.UI = UI;
//# sourceMappingURL=ele.js.map