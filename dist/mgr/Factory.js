"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
var Data_1 = require("../shape/base/Data");
var ShapesMgr_1 = require("./ShapesMgr");
var Shape_1 = require("../shape/base/Shape");
var InvalidTool_1 = require("../tools/base/InvalidTool");
var FactoryEnum_1 = require("./FactoryEnum");
var FactoryMgr_1 = require("./FactoryMgr");
var board_1 = require("../board");
var Tag = '[Factory]';
var Factory = /** @class */ (function () {
    function Factory() {
        this._z = 0;
        this._time = 0;
        this._shapeTemplates = {};
    }
    Object.defineProperty(Factory.prototype, "type", {
        get: function () {
            return FactoryEnum_1.FactoryEnum.Default;
        },
        enumerable: false,
        configurable: true
    });
    Factory.prototype.shapeTemplate = function (type) {
        var ret = this._shapeTemplates[type] || this.newShapeData(type);
        this._shapeTemplates[type] = ret;
        return ret;
    };
    Factory.prototype.setShapeTemplate = function (type, template) {
        this._shapeTemplates[type] = template;
    };
    Factory.prototype.newWhiteBoard = function (options) {
        return new board_1.WhiteBoard(this, options);
    };
    Factory.prototype.newShapesMgr = function () {
        return new ShapesMgr_1.ShapesMgr();
    };
    Factory.prototype.newTool = function (toolType) {
        var create = FactoryMgr_1.FactoryMgr.tools[toolType];
        if (!create) {
            console.warn(Tag, "newTool(\"".concat(toolType, "\"), ").concat(toolType, " is not registered"));
            return new InvalidTool_1.InvalidTool;
        }
        var ret = create();
        if (ret.type !== toolType) {
            console.warn(Tag, "newTool(\"".concat(toolType, "\"), ").concat(toolType, " is not corrent! check member 'type' of your Tool!"));
        }
        return ret;
    };
    Factory.prototype.newShapeData = function (shapeType) {
        var create = FactoryMgr_1.FactoryMgr.shapeDatas[shapeType];
        if (!create) {
            console.warn(Tag, "newShapeData(\"".concat(shapeType, "\"), ").concat(shapeType, " is not registered"));
            return new Data_1.ShapeData;
        }
        var ret = create();
        if (ret.type !== shapeType) {
            console.warn(Tag, "newShapeData(\"".concat(shapeType, "\"), ").concat(shapeType, " is not corrent! check member 'type' of your ShapeData!"));
        }
        return ret;
    };
    Factory.prototype.newId = function (data) {
        return data.t + '_' + Date.now() + (++this._time);
    };
    Factory.prototype.newZ = function (data) {
        return Date.now() + (++this._z);
    };
    Factory.prototype.newShape = function (v) {
        var isNew = typeof v === 'string' || typeof v === 'number';
        var type = isNew ? v : v.t;
        var data = this.newShapeData(type);
        var template = isNew ? this.shapeTemplate(v) : v;
        data.copyFrom(template);
        if (isNew) {
            data.id = this.newId(data);
            data.z = this.newZ(data);
        }
        var create = FactoryMgr_1.FactoryMgr.shapes[type];
        return create ? create(data) : new Shape_1.Shape(data);
    };
    return Factory;
}());
exports.Factory = Factory;
FactoryMgr_1.FactoryMgr.registerFactory(FactoryEnum_1.FactoryEnum.Default, function () { return new Factory(); }, { name: 'bulit-in Factory', desc: 'bulit-in Factory' });
//# sourceMappingURL=Factory.js.map