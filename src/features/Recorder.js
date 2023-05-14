"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = void 0;
const event_1 = require("../event");
const EventDataVisitor_1 = require("../event/EventDataVisitor");
class Recorder {
    constructor() {
        this.cancellers = [];
        this._screenplay = {
            startTime: Date.now(),
            snapshot: {},
            events: []
        };
    }
    destory() {
        this.cancellers.forEach(v => v());
        this.cancellers = [];
    }
    start(actor) {
        this.cancellers.forEach(v => v());
        this.cancellers = [];
        const startTime = Date.now();
        this._screenplay = {
            startTime,
            snapshot: actor.toJson(),
            events: []
        };
        for (const key in event_1.EventEnum) {
            const v = event_1.EventEnum[key];
            const func = (e) => {
                const puree = e.pure();
                EventDataVisitor_1.EventDataVisitor.setTime(puree, v => v - startTime);
                this._screenplay.events.push(puree);
            };
            const canceller = actor.on(v, func);
            this.cancellers.push(canceller);
        }
    }
    toJson() {
        return this._screenplay;
    }
    toJsonStr() {
        return JSON.stringify(this.toJson());
    }
}
exports.Recorder = Recorder;
//# sourceMappingURL=Recorder.js.map