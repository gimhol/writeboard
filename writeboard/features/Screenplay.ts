import type { ISnapshot } from "../board/ISnapshot";

export interface IPureCustomEvent<T = any> {
  readonly timestamp: number;
  readonly type: string;
  readonly detail: T;
}
export interface IScreenplay {
  startTime: number,
  endTime: number,
  snapshot?: ISnapshot;
  events: IPureCustomEvent<any>[];
}
