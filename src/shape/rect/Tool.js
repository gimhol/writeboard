"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectTool = void 0;
const FactoryMgr_1 = require("../../mgr/FactoryMgr");
const ShapeEnum_1 = require("../ShapeEnum");
const ToolEnum_1 = require("../../tools/ToolEnum");
const SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "RectTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Rect, () => new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Rect, ShapeEnum_1.ShapeEnum.Rect), { name: 'rect', desc: 'rect drawer', shape: ShapeEnum_1.ShapeEnum.Rect });
//# sourceMappingURL=Tool.js.map