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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ele_1 = require("./ui/ele");
var dist_1 = require("../../dist");
var ColorPalette_1 = require("./colorPalette/ColorPalette");
var demo_helloworld_1 = __importDefault(require("./demo_helloworld"));
var demo_rect_n_oval_1 = __importDefault(require("./demo_rect_n_oval"));
var whiteBoard;
var factory = dist_1.FactoryMgr.createFactory(dist_1.FactoryEnum.Default);
var _recorder;
var _player;
var initState = {
    count: 1,
    width: 2048,
    height: 2048,
};
window.ui = new ele_1.UI(document.body, initState, function (ui) {
    var toolBtn = function (toolType) {
        var _a = (dist_1.FactoryMgr.toolInfo(toolType) || {}).name, name = _a === void 0 ? toolType : _a;
        ui.dynamic('button', {
            className: 'tool_button',
            innerText: name,
            disabled: (whiteBoard === null || whiteBoard === void 0 ? void 0 : whiteBoard.toolType) === toolType,
            onclick: function () { return whiteBoard === null || whiteBoard === void 0 ? void 0 : whiteBoard.setToolType(toolType); }
        });
    };
    ui.dynamic('div', {
        className: 'root'
    }, function (div) {
        ui.dynamic('div', {
            className: 'tool_bar'
        }, function (div) {
            toolBtn(dist_1.ToolEnum.Selector);
            toolBtn(dist_1.ToolEnum.Pen);
            toolBtn(dist_1.ToolEnum.Rect);
            toolBtn(dist_1.ToolEnum.Oval);
            toolBtn(dist_1.ToolEnum.Text);
            ui.static('br');
            ui.dynamic('button', { className: 'tool_button', innerText: 'select all', onclick: function () { return whiteBoard.selectAll(); } });
            ui.dynamic('button', { className: 'tool_button', innerText: 'remove selected', onclick: function () { return whiteBoard.removeSelected(); } });
            ui.dynamic('button', { className: 'tool_button', innerText: 'remove all', onclick: function () { return whiteBoard.removeAll(); } });
            ui.dynamic('br');
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '?????????1000?????????', onclick: function () {
                    var items = [];
                    for (var i = 0; i < 1000; ++i) {
                        var item = whiteBoard.factory.newShape(dist_1.ShapeEnum.Rect);
                        item.geo(Math.floor(Math.random() * ui.state.width), Math.floor(Math.random() * ui.state.height), 50, 50);
                        var r = Math.floor(Math.random() * 255);
                        var g = Math.floor(Math.random() * 255);
                        var b = Math.floor(Math.random() * 255);
                        item.data.fillStyle = "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
                        items.push(item);
                    }
                    whiteBoard.add.apply(whiteBoard, items);
                }
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '?????????1000??????',
                onclick: function () {
                    var items = [];
                    for (var i = 0; i < 1000; ++i) {
                        var item = whiteBoard.factory.newShape(dist_1.ShapeEnum.Oval);
                        item.geo(Math.floor(Math.random() * ui.state.width), Math.floor(Math.random() * ui.state.height), 50, 50);
                        var r = Math.floor(Math.random() * 255);
                        var g = Math.floor(Math.random() * 255);
                        var b = Math.floor(Math.random() * 255);
                        item.data.fillStyle = "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
                        items.push(item);
                    }
                    whiteBoard.add.apply(whiteBoard, items);
                }
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '?????????1000???', onclick: function () {
                    var items = [];
                    for (var i = 0; i < 1000; ++i) {
                        var item = whiteBoard.factory.newShape(dist_1.ShapeEnum.Pen);
                        var x = Math.floor(Math.random() * ui.state.width);
                        var y = Math.floor(Math.random() * ui.state.height);
                        var lenth = Math.floor(Math.random() * 100);
                        for (var j = 0; j < lenth; ++j) {
                            x += Math.floor(Math.random() * 5);
                            y += Math.floor(Math.random() * 5);
                            item.appendDot({ x: x, y: y, p: 0.5 });
                        }
                        var r = Math.floor(Math.random() * 255);
                        var g = Math.floor(Math.random() * 255);
                        var b = Math.floor(Math.random() * 255);
                        item.data.strokeStyle = "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
                        items.push(item);
                    }
                    whiteBoard.add.apply(whiteBoard, items);
                }
            });
            ui.dynamic('br');
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: 'JSON???', onclick: function () {
                    _json_textarea.value = whiteBoard.toJsonStr();
                }
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '???JSON???', onclick: function () {
                    whiteBoard.fromJsonStr(_json_textarea.value);
                }
            });
            var _json_textarea = ui.dynamic('textarea');
            var startRecord = function () {
                _recorder === null || _recorder === void 0 ? void 0 : _recorder.destory();
                _recorder = new dist_1.Recorder();
                _recorder.start(whiteBoard);
            };
            var endRecord = function () {
                if (!_recorder_textarea || !_recorder)
                    return;
                _recorder_textarea.value = _recorder.toJsonStr();
                _recorder === null || _recorder === void 0 ? void 0 : _recorder.destory();
                _recorder = undefined;
            };
            var replay = function (str) {
                _player === null || _player === void 0 ? void 0 : _player.stop();
                _player = new dist_1.Player();
                whiteBoard && _player.start(whiteBoard, JSON.parse(str));
            };
            ui.dynamic('br');
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '????????????', onclick: startRecord
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '????????????', onclick: endRecord
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '??????', onclick: function () {
                    endRecord();
                    replay(_recorder_textarea.value);
                }
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: "replay: write \"hello world\"", onclick: function () {
                    endRecord();
                    replay(demo_helloworld_1.default);
                }
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: "replay: rect & oval", onclick: function () {
                    endRecord();
                    replay(demo_rect_n_oval_1.default);
                }
            });
            var _recorder_textarea = ui.dynamic('textarea');
            ui.static('canvas', function (canvas) {
                canvas.width = 180;
                canvas.height = 100;
                canvas.style.minWidth = canvas.width + 'px';
                canvas.style.minHeight = canvas.height + 'px';
                canvas.style.maxWidth = canvas.width + 'px';
                canvas.style.maxHeight = canvas.height + 'px';
                var a = new ColorPalette_1.ColorPalette(canvas);
                a._onChanged = function (v) {
                    var _a;
                    var shape = (_a = dist_1.FactoryMgr.toolInfo(whiteBoard.toolType)) === null || _a === void 0 ? void 0 : _a.shape;
                    if (!shape)
                        return;
                    var template = whiteBoard.factory.shapeTemplate(shape);
                    template.strokeStyle = '' + v;
                };
            });
        });
        ui.dynamic('div', {
            className: 'blackboard'
        }, function (div) {
            ui.static('canvas', function (onscreen) {
                onscreen.style.position = 'relative';
                onscreen.style.touchAction = 'none';
                whiteBoard = factory.newWhiteBoard(__assign({ onscreen: onscreen }, ui.state));
                whiteBoard.on(dist_1.EventEnum.ToolChanged, function () { return ui.refresh(); });
            });
        });
    });
});
//# sourceMappingURL=index.js.map