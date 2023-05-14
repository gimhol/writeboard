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
//# sourceMappingURL=FactoryMgr.js.map