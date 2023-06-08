
export interface PureCustomEvent<T = any> {
  readonly timeStamp: number;
  readonly type: string;
  readonly detail: T;
}
export interface Screenplay {
  readonly startTime: number,
  readonly snapshot: any;
  readonly events: PureCustomEvent<any>[];
}
