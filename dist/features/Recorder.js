"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = void 0;
var event_1 = require("../event");
var EventDataVisitor_1 = require("../event/EventDataVisitor");
var Recorder = /** @class */ (function () {
    function Recorder() {
        this.cancellers = [];
        this._screenplay = {
            startTime: Date.now(),
            snapshot: {},
            events: []
        };
    }
    Recorder.prototype.destory = function () {
        this.cancellers.forEach(function (v) { return v(); });
        this.cancellers = [];
    };
    Recorder.prototype.start = function (actor) {
        var _this = this;
        this.cancellers.forEach(function (v) { return v(); });
        this.cancellers = [];
        var startTime = Date.now();
        this._screenplay = {
            startTime: startTime,
            snapshot: actor.toJson(),
            events: []
        };
        for (var key in event_1.EventEnum) {
            var v = event_1.EventEnum[key];
            var func = function (e) {
                var puree = e.pure();
                EventDataVisitor_1.EventDataVisitor.setTime(puree, function (v) { return v - startTime; });
                _this._screenplay.events.push(puree);
            };
            var canceller = actor.on(v, func);
            this.cancellers.push(canceller);
        }
    };
    Recorder.prototype.toJson = function () {
        return this._screenplay;
    };
    Recorder.prototype.toJsonStr = function () {
        return JSON.stringify(this.toJson());
    };
    return Recorder;
}());
exports.Recorder = Recorder;
//# sourceMappingURL=Recorder.js.map