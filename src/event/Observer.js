"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
const Emitter_1 = require("./Emitter");
;
;
;
;
;
class Observer {
    constructor() {
        this._listeners = [];
    }
    listenTo(target, type, callback) {
        if (target instanceof Emitter_1.Emitter) {
            const listener = target.addEventListener(type, callback);
            this._listeners.push(listener);
            return listener.canceller;
        }
        else {
            const canceller = () => target.removeEventListener(type, callback);
            target.addEventListener(type, callback, undefined);
            const listener = {
                times: -1,
                target,
                type,
                callback: callback,
                canceller
            };
            this._listeners.push(listener);
            return canceller;
        }
    }
    destory() {
        this._listeners.forEach(v => v.canceller());
    }
}
exports.Observer = Observer;
//# sourceMappingURL=Observer.js.map