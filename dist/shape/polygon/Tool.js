"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonTool = void 0;
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var ShapeEnum_1 = require("../ShapeEnum");
var ToolEnum_1 = require("../../tools/ToolEnum");
var SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "PolygonTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
var desc = {
    name: 'Polygon', desc: 'Polygon Drawer', shape: ShapeEnum_1.ShapeEnum.Polygon
};
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Polygon, function () { return new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Polygon, ShapeEnum_1.ShapeEnum.Polygon); }, desc);
//# sourceMappingURL=Tool.js.map