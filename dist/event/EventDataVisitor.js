"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDataVisitor = void 0;
var utils_1 = require("../utils");
var EventType_1 = require("./EventType");
var EventDataVisitor = /** @class */ (function () {
    function EventDataVisitor() {
    }
    EventDataVisitor.create = function (options) {
        return {
            a: options.type,
            b: options.operator,
            c: options.timeStamp,
            d: options.detail
        };
    };
    EventDataVisitor.getType = function (e) {
        return e.a || e.type || EventType_1.EventEnum.Invalid;
    };
    EventDataVisitor.setType = function (e, v) {
        e.a = (0, utils_1.getValue)(v, this.getType(e));
        return this;
    };
    EventDataVisitor.getOperator = function (e) {
        return e.b || e.operator || EventType_1.EventEnum.Invalid;
    };
    EventDataVisitor.setOperator = function (e, v) {
        e.b = (0, utils_1.getValue)(v, this.getOperator(e));
        return this;
    };
    EventDataVisitor.getTime = function (e) {
        return e.c || e.timeStamp || 0;
    };
    EventDataVisitor.setTime = function (e, v) {
        e.c = (0, utils_1.getValue)(v, this.getTime(e));
        return this;
    };
    EventDataVisitor.getDetail = function (e) {
        return e.d || e.detail;
    };
    EventDataVisitor.setDetail = function (e, v) {
        e.d = (0, utils_1.getValue)(v, this.getDetail(e));
        return this;
    };
    return EventDataVisitor;
}());
exports.EventDataVisitor = EventDataVisitor;
//# sourceMappingURL=EventDataVisitor.js.map