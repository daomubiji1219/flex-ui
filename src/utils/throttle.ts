// A small, dependency-free throttle utility compatible with both ESM and CJS builds
// - Defaults align with lodash's throttle: leading: true, trailing: true
// - Provides cancel() and flush() methods

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export type ThrottledFunction<TArgs extends unknown[]> = ((
  ...args: TArgs
) => void) & {
  cancel: () => void;
  flush: () => void;
};

export function throttle<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  wait: number,
  options: ThrottleOptions = {}
): ThrottledFunction<TArgs> {
  const leading = options.leading !== undefined ? options.leading : true;
  const trailing = options.trailing !== undefined ? options.trailing : true;

  let lastCallTime: number | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: TArgs | undefined;
  let lastThis: unknown;

  const invoke = () => {
    if (lastArgs) {
      fn.apply(lastThis as unknown as object, lastArgs);
      lastArgs = undefined;
      lastThis = undefined as unknown;
    }
  };

  const startTimer = (ms: number) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      // When timer fires, it's considered the end of the interval
      lastCallTime = leading === false ? null : Date.now();
      if (trailing && lastArgs) {
        invoke();
      }
    }, ms);
  };

  const throttled = function (this: unknown, ...args: TArgs) {
    const now = Date.now();

    if (lastCallTime === null) {
      // First call
      if (leading) {
        lastCallTime = now;
        fn.apply(this as unknown as object, args);
        return;
      }
      // If leading is false, defer the first call
      lastCallTime = now;
      lastArgs = args as TArgs;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      lastThis = this;
      if (trailing && !timer) {
        startTimer(wait);
      }
      return;
    }

    const remaining = wait - (now - lastCallTime);
    lastArgs = args as TArgs;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    if (remaining <= 0 || remaining > wait) {
      // Time window passed, invoke immediately
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallTime = now;
      fn.apply(lastThis as unknown as object, lastArgs);
      lastArgs = undefined;
      lastThis = undefined as unknown;
    } else if (trailing && !timer) {
      // Schedule a trailing call
      startTimer(remaining);
    }
  } as ThrottledFunction<TArgs>;

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = undefined;
    lastThis = undefined as unknown;
    lastCallTime = null;
  };

  throttled.flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      lastCallTime = leading === false ? null : Date.now();
      if (trailing && lastArgs) {
        invoke();
      }
    }
  };

  return throttled;
}

export default throttle;
