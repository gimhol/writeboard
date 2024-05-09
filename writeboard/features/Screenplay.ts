import type { ISnapshot } from "../board/ISnapshot";

export interface IPureCustomEvent<T = any> {
  readonly timestamp: number;
  readonly type: string;
  readonly detail: T;
}
export interface IScreenplay {
  readonly startTime: number,
  readonly snapshot?: ISnapshot;
  readonly events: IPureCustomEvent<any>[];
}
