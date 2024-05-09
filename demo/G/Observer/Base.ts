export interface IObserver {
  destory(): void;
  get disabled(): boolean;
  set disabled(v: boolean);
}