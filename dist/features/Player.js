"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var event_1 = require("../event");
var Player = /** @class */ (function () {
    function Player() {
        this.eventIdx = 0;
        this.firstEventTime = 0;
        this.startTime = 0;
        this.timer = 0;
    }
    Player.prototype.start = function (actor, screenplay) {
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
    };
    Player.prototype.stop = function () {
        clearTimeout(this.timer);
    };
    Player.prototype.tick = function () {
        var _this = this;
        var screenplay = this.screenplay;
        if (!screenplay)
            return this.stop();
        var event = screenplay.events[this.eventIdx];
        if (!event)
            return this.stop();
        var timeStamp = event_1.EventDataVisitor.getTime(event);
        if (!this.firstEventTime && timeStamp)
            this.firstEventTime = timeStamp;
        this.applyEvent(event);
        ++this.eventIdx;
        var next = screenplay.events[this.eventIdx];
        if (!next)
            return this.stop();
        timeStamp = event_1.EventDataVisitor.getTime(next);
        var diff = Math.max(1, (timeStamp - screenplay.startTime) - (this.firstEventTime - screenplay.startTime) - (Date.now() - this.startTime));
        this.timer = setTimeout(function () { return _this.tick(); }, diff);
    };
    Player.prototype.applyEvent = function (e) {
        var actor = this.actor;
        if (!actor)
            return;
        var type = event_1.EventDataVisitor.getType(e);
        switch (type) {
            case event_1.EventEnum.ShapesAdded: {
                var event_2 = e;
                var shapes = event_1.EventDataVisitor.getDetail(event_2).shapeDatas.map(function (v) { return actor.factory.newShape(v); });
                actor.add.apply(actor, shapes);
                break;
            }
            case event_1.EventEnum.ShapesChanged: {
                var event_3 = e;
                event_1.EventDataVisitor.getDetail(event_3).shapeDatas.forEach(function (_a) {
                    var _b;
                    var curr = _a[0], prev = _a[1];
                    var id = curr.i;
                    id && ((_b = actor.find(id)) === null || _b === void 0 ? void 0 : _b.merge(curr));
                });
                break;
            }
            case event_1.EventEnum.ShapesRemoved: {
                var event_4 = e;
                var shapes = event_1.EventDataVisitor.getDetail(event_4).shapeDatas.map(function (data) { return actor.find(data.i); }).filter(function (v) { return v; });
                actor.remove.apply(actor, shapes);
                break;
            }
        }
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=Player.js.map