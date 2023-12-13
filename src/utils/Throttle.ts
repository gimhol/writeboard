
export interface ThrottleCallback<F extends (...args: any[]) => any> {
  (...args: Parameters<F>): ReturnType<F>;
  enforce: F;
}

export function throttle<F extends (...args: any[]) => any>(interval: number, cb: F): ThrottleCallback<F> {
  let _waiting = false;
  let _result: ReturnType<F> | undefined = void 0;
  let ret = function (...args: Parameters<F>) {
    if (_waiting) return _result!;
    _waiting = true;
    _result = cb(...args);
    setTimeout(() => _waiting = false, interval);
    return _result!
  }
  return Object.assign(ret, { enforce: cb });
}