"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ele_1 = require("./ui/ele");
var dist_1 = require("../../dist");
var ColorPalette_1 = require("./colorPalette/ColorPalette");
var demo_helloworld_1 = __importDefault(require("./demo_helloworld"));
var demo_rect_n_oval_1 = __importDefault(require("./demo_rect_n_oval"));
var utils_1 = require("../../dist/utils");
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
                innerText: '随机加1000个矩形', onclick: function () {
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
                innerText: '随机加1000个圆', onclick: function () {
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
                innerText: '随机画1000笔', onclick: function () {
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
                innerText: 'JSON化', onclick: function () {
                    _json_textarea.value = whiteBoard.toJsonStr();
                }
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '反JSON化', onclick: function () {
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
                innerText: '开始录制', onclick: startRecord
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '停止录制', onclick: endRecord
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '回放', onclick: function () {
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
            var offscreen = ui.static('canvas', {
                width: ui.state.width,
                height: ui.state.height,
                offscreen: true
            });
            ui.static('canvas', function (onscreen) {
                onscreen.width = offscreen.width;
                onscreen.height = offscreen.height;
                onscreen.style.position = 'relative';
                onscreen.style.touchAction = 'none';
                whiteBoard = factory.newWhiteBoard({ onscreen: onscreen, offscreen: offscreen });
                whiteBoard.on(dist_1.EventEnum.ToolChanged, function () { return ui.refresh(); });
                var _loop_1 = function (key) {
                    var v = dist_1.EventEnum[key];
                    whiteBoard.on(v, function (e) { return console.log(v, e); });
                };
                for (var key in dist_1.EventEnum) {
                    _loop_1(key);
                }
                var pickRect = new utils_1.Rect(Math.ceil(Math.random() * (onscreen.width - 20) / 2), Math.ceil(Math.random() * (onscreen.height - 20) / 2), Math.ceil(Math.random() * (onscreen.width) / 2), Math.ceil(Math.random() * (onscreen.height) / 2));
                var pickRange = { from: pickRect.top, to: pickRect.bottom };
                var ctx = onscreen.getContext('2d');
                // class RectInTree extends Rect {
                //   tree: BinaryTree<RectInTree> | undefined
                // }
                // const tree = new BinaryTree<RectInTree>({
                //   range: new BinaryRange(0, onscreen.height),
                //   getItemRange: v => new BinaryRange(v.top, v.bottom),
                //   onTreeChanged(item, from, to) {
                //     item.tree = to
                //   },
                //   getTree: v => v.tree
                // })
                // const drawTreeNode = (tree: BinaryTree<RectInTree>) => {
                //   if (!ctx) return
                //   ctx.lineWidth = 1
                //   if (tree.range.hit(pickRange))
                //     ctx.strokeStyle = 'yellow'
                //   else
                //     ctx.strokeStyle = 'white'
                //   ctx.strokeRect(
                //     0,
                //     tree.range.from - .5,
                //     onscreen.width,
                //     tree.range.to - tree.range.from)
                //   if (tree.range.hit(pickRange)) {
                //     ctx.strokeStyle = 'green'
                //     ctx.fillStyle = 'red'
                //     tree.items.forEach(v => {
                //       if (v.hit(pickRect))
                //         ctx.fillRect(v.x, v.y, v.w, v.h)
                //       else
                //         ctx.strokeRect(v.x, v.y, v.w, v.h)
                //     })
                //   } else {
                //     ctx.strokeStyle = 'gray'
                //     tree.items.forEach(v => ctx.strokeRect(v.x - 0.5, v.y - 0.5, v.w, v.h))
                //   }
                //   tree.child0 && drawTreeNode(tree.child0)
                //   tree.child1 && drawTreeNode(tree.child1)
                // }
                // class RectInTree extends Rect {
                //   tree: QuadTree<RectInTree> | undefined
                // }
                // const tree = new QuadTree<RectInTree>({
                //   rect: new Rect(0, 0, onscreen.width, onscreen.height),
                //   getItemRect: v => v,
                //   onTreeChanged(item, from, to) {
                //     item.tree = to
                //   },
                //   getTree: v => v.tree
                // })
                // const drawTreeNode = (tree: QuadTree<RectInTree>) => {
                //   if (!ctx) return
                //   ctx.lineWidth = 1
                //   if (tree.rect.hit(pickRect))
                //     ctx.strokeStyle = 'yellow'
                //   else
                //     ctx.strokeStyle = 'white'
                //   ctx.strokeRect(tree.rect.x - .5, tree.rect.y - .5, tree.rect.w, tree.rect.h)
                //   if (tree.rect.hit(pickRect)) {
                //     ctx.strokeStyle = 'green'
                //     ctx.fillStyle = 'red'
                //     tree.items.forEach(v => {
                //       if (v.hit(pickRect))
                //         ctx.fillRect(v.x, v.y, v.w, v.h)
                //       else
                //         ctx.strokeRect(v.x - 0.5, v.y - 0.5, v.w, v.h)
                //     })
                //   } else {
                //     ctx.strokeStyle = 'gray'
                //     tree.items.forEach(v => ctx.strokeRect(v.x - 0.5, v.y - 0.5, v.w, v.h))
                //   }
                //   tree.child0 && drawTreeNode(tree.child0)
                //   tree.child1 && drawTreeNode(tree.child1)
                //   tree.child2 && drawTreeNode(tree.child2)
                //   tree.child3 && drawTreeNode(tree.child3)
                // }
                // drawTreeNode(tree)
                // const rects: RectInTree[] = []
                // const ttt = setInterval(() => {
                //   for (let i = 0; i < 1; ++i) {
                //     const rect = new RectInTree(
                //       Math.ceil(Math.random() * (onscreen.width - 50)),
                //       Math.ceil(Math.random() * (onscreen.height - 50)),
                //       Math.ceil(5 + Math.random() * 50),
                //       Math.ceil(5 + Math.random() * 50)
                //     )
                //     rects.push(rect)
                //     rect.tree = tree.insert(rect)
                //     if (rect.tree.items.indexOf(rect) < 0) {
                //       alert('!')
                //     }
                //   }
                //   ctx?.clearRect(0, 0, onscreen.width, onscreen.height)
                //   console.log(tree.itemCount)
                //   drawTreeNode(tree)
                //   if (ctx) {
                //     ctx.lineWidth = 1
                //     ctx.strokeStyle = 'blue'
                //     ctx.strokeRect(pickRect.x - 0.5, pickRect.y - 0.5, pickRect.w, pickRect.h)
                //   }
                //   if (tree.itemCount > 9999) {
                //     clearInterval(ttt)
                //   }
                // }, 1)
            });
        });
    });
});
//# sourceMappingURL=index.js.map