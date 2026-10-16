
/**
 * 节流后的函数：调用签名与节流前一致，并多挂一个 enforce 可以直接调到原函数
 *
 * A throttled function: it keeps the call signature of the original one and carries an
 * extra enforce that calls the original directly.
 */
export interface ThrottleCallback<F extends (...args: any[]) => any> {
  /**
   * 节流调用：间隔内的重复调用不执行 cb，直接返回上一次的结果
   *
   * The throttled call: repeated calls within the interval skip cb and return the previous
   * result.
   *
   * @param {...any} args 透传给原函数的参数 / Arguments forwarded to the original function
   * @return {ReturnType<F>} 本次（或上一次）调用的结果 / The result of this (or the previous) call
   */
  (...args: Parameters<F>): ReturnType<F>;
  /**
   * 原函数本身：绕过节流，直接执行
   *
   * The original function itself: it bypasses the throttle and runs directly.
   */
  enforce: F;
}

/**
 * 把函数包成节流版：interval 毫秒内只真正执行一次，重复调用直接返回上次的结果
 *
 * Wraps a function into a throttled one: it really runs once per interval in milliseconds
 * and repeated calls just get the previous result back.
 *
 * @param {number} interval 节流间隔（毫秒） / The throttle interval in milliseconds
 * @param {F} cb 原函数 / The original function
 * @return {ThrottleCallback<F>} 节流后的函数（带 enforce） / The throttled function (with enforce)
 */
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