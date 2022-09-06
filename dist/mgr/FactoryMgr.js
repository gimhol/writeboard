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
exports.FactoryMgr = void 0;
var ToolEnum_1 = require("../tools/ToolEnum");
var ShapeEnum_1 = require("../shape/ShapeEnum");
var Tag = '[Factory]';
var FactoryMgr = /** @class */ (function () {
    function FactoryMgr() {
    }
    FactoryMgr.listFactories = function () {
        return Object.keys(this.factoryInfos);
    };
    FactoryMgr.createFactory = function (type) {
        var create = this.factorys[type];
        if (!create) {
            var error = new Error("".concat(Tag, "create(\"").concat(type, "\"), ").concat(type, " is not registered"));
            throw error;
        }
        var ret = create();
        if (ret.type !== type) {
            console.warn(Tag, "create(\"".concat(type, "\"), ").concat(type, " is not corrent! check member 'type' of your Factory!"));
        }
        return ret;
    };
    FactoryMgr.registerFactory = function (type, creator, info) {
        this.factorys[type] = creator;
        this.factoryInfos[type] = info;
    };
    FactoryMgr.listTools = function () {
        return Object.keys(this.tools);
    };
    FactoryMgr.toolInfo = function (type) {
        return this.toolInfos[type];
    };
    FactoryMgr.registerTool = function (type, creator, info) {
        this.tools[type] = creator;
        this.toolInfos[type] = __assign(__assign({}, info), { name: (info === null || info === void 0 ? void 0 : info.name) || (0, ToolEnum_1.getToolName)(type), desc: (info === null || info === void 0 ? void 0 : info.desc) || (0, ToolEnum_1.getToolName)(type) });
    };
    FactoryMgr.listShapes = function () {
        return Object.keys(this.shapes);
    };
    FactoryMgr.registerShape = function (type, dataCreator, shapeCreator, info) {
        this.shapeDatas[type] = dataCreator;
        this.shapes[type] = shapeCreator;
        this.shapeInfos[type] = {
            name: (info === null || info === void 0 ? void 0 : info.name) || (0, ShapeEnum_1.getShapeName)(type),
            desc: (info === null || info === void 0 ? void 0 : info.desc) || (0, ShapeEnum_1.getShapeName)(type),
            type: type
        };
    };
    FactoryMgr.shapeInfo = function (type) {
        return this.shapeInfos[type];
    };
    FactoryMgr.tools = {};
    FactoryMgr.toolInfos = {};
    FactoryMgr.shapeDatas = {};
    FactoryMgr.shapes = {};
    FactoryMgr.shapeInfos = {};
    FactoryMgr.factorys = {};
    FactoryMgr.factoryInfos = {};
    return FactoryMgr;
}());
exports.FactoryMgr = FactoryMgr;
//# sourceMappingURL=FactoryMgr.js.map