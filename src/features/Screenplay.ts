import type { ISnapshot } from "../board/ISnapshot";

export interface PureCustomEvent<T = any> {
  readonly timestamp: number;
  readonly type: string;
  readonly detail: T;
}
export interface Screenplay {
  readonly startTime: number,
  readonly snapshot?: ISnapshot;
  readonly events: PureCustomEvent<any>[];
}
