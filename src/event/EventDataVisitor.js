"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDataVisitor = void 0;
const utils_1 = require("../utils");
const EventType_1 = require("./EventType");
class EventDataVisitor {
    static create(options) {
        return {
            a: options.type,
            b: options.operator,
            c: options.timeStamp,
            d: options.detail
        };
    }
    static getType(e) {
        return e.a || e.type || EventType_1.EventEnum.Invalid;
    }
    static setType(e, v) {
        e.a = (0, utils_1.getValue)(v, this.getType(e));
        return this;
    }
    static getOperator(e) {
        return e.b || e.operator || EventType_1.EventEnum.Invalid;
    }
    static setOperator(e, v) {
        e.b = (0, utils_1.getValue)(v, this.getOperator(e));
        return this;
    }
    static getTime(e) {
        return e.c || e.timeStamp || 0;
    }
    static setTime(e, v) {
        e.c = (0, utils_1.getValue)(v, this.getTime(e));
        return this;
    }
    static getDetail(e) {
        return e.d || e.detail;
    }
    static setDetail(e, v) {
        e.d = (0, utils_1.getValue)(v, this.getDetail(e));
        return this;
    }
}
exports.EventDataVisitor = EventDataVisitor;
//# sourceMappingURL=EventDataVisitor.js.map