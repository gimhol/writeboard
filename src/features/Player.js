"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const event_1 = require("../event");
class Player {
    constructor() {
        this.eventIdx = 0;
        this.firstEventTime = 0;
        this.startTime = 0;
        this.timer = 0;
    }
    start(actor, screenplay) {
        this.actor = actor;
        this.screenplay = {
            startTime: screenplay.startTime || 0,
            snapshot: screenplay.snapshot || {},
            events: screenplay.events || [],
        };
        this.startTime = Date.now();
        this.firstEventTime = 0;
        actor.fromJson(screenplay.snapshot);
        this.tick();
    }
    stop() {
        clearTimeout(this.timer);
    }
    tick() {
        const screenplay = this.screenplay;
        if (!screenplay)
            return this.stop();
        const event = screenplay.events[this.eventIdx];
        if (!event)
            return this.stop();
        let timeStamp = event_1.EventDataVisitor.getTime(event);
        if (!this.firstEventTime && timeStamp)
            this.firstEventTime = timeStamp;
        this.applyEvent(event);
        ++this.eventIdx;
        const next = screenplay.events[this.eventIdx];
        if (!next)
            return this.stop();
        timeStamp = event_1.EventDataVisitor.getTime(next);
        const diff = Math.max(1, (timeStamp - screenplay.startTime) - (this.firstEventTime - screenplay.startTime) - (Date.now() - this.startTime));
        this.timer = setTimeout(() => this.tick(), diff);
    }
    applyEvent(e) {
        const actor = this.actor;
        if (!actor)
            return;
        const type = event_1.EventDataVisitor.getType(e);
        switch (type) {
            case event_1.EventEnum.ShapesAdded: {
                const event = e;
                const shapes = event_1.EventDataVisitor.getDetail(event).shapeDatas.map(v => actor.factory.newShape(v));
                actor.add(...shapes);
                break;
            }
            case event_1.EventEnum.ShapesChanged: {
                const event = e;
                event_1.EventDataVisitor.getDetail(event).shapeDatas.forEach(([curr, prev]) => {
                    var _a;
                    const id = curr.i;
                    id && ((_a = actor.find(id)) === null || _a === void 0 ? void 0 : _a.merge(curr));
                });
                break;
            }
            case event_1.EventEnum.ShapesRemoved: {
                const event = e;
                const shapes = event_1.EventDataVisitor.getDetail(event).shapeDatas.map(data => actor.find(data.i)).filter(v => v);
                actor.remove(...shapes);
                break;
            }
        }
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map