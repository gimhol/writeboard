import type { ISnapshot } from "../board/ISnapshot";
import type { Events } from "../event/Events";

export interface IScreenplay {
  startTime: number,
  endTime: number,
  snapshot?: ISnapshot;
  events: Events.IBaseDetail[];
}
