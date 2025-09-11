// 工具函数 - 遵循DRY原则

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  }) as T;
}

// 节流函数
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): T {
  let lastCall = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  }) as T;
}

// 深度克隆
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    Object.keys(obj).forEach(key => {
      (cloned as Record<string, unknown>)[key] = deepClone(
        (obj as Record<string, unknown>)[key]
      );
    });
    return cloned;
  }

  return obj;
}

// 深度比较
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a !== 'object') return false;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  if (Array.isArray(a) || Array.isArray(b)) return false;

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;

  const aKeys = Object.keys(aObj);
  const bKeys = Object.keys(bObj);

  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every(
    key => bKeys.includes(key) && deepEqual(aObj[key], bObj[key])
  );
}

// 获取嵌套对象的值
export function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  return path.split('.').reduce((current: any, key: string) => {
    return current && typeof current === 'object' && key in current
      ? current[key]
      : undefined;
  }, obj as any);
}

// 设置嵌套对象的值
export function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split('.');
  const result = deepClone(obj);

  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (
      !(key in current) ||
      typeof current[key] !== 'object' ||
      current[key] === null
    ) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

// 删除嵌套对象的值
export function deleteNestedValue(
  obj: Record<string, unknown>,
  path: string
): Record<string, unknown> {
  const keys = path.split('.');
  const result = deepClone(obj);

  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (
      !(key in current) ||
      typeof current[key] !== 'object' ||
      current[key] === null
    ) {
      return result; // 路径不存在，直接返回
    }
    current = current[key] as Record<string, unknown>;
  }

  delete current[keys[keys.length - 1]];
  return result;
}

// 扁平化对象
export function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
  separator = '.'
): Record<string, unknown> {
  const flattened: Record<string, unknown> = {};

  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}${separator}${key}` : key;

    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      Object.assign(
        flattened,
        flattenObject(value as Record<string, unknown>, newKey, separator)
      );
    } else {
      flattened[newKey] = value;
    }
  });

  return flattened;
}

// 反扁平化对象
export function unflattenObject(
  obj: Record<string, unknown>,
  separator = '.'
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const keys = key.split(separator);

    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = value;
  });

  return result;
}

// 类型守卫
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (isString(value)) return value.trim() === '';
  if (isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}

// 错误处理工具
export class FormError extends Error {
  public field?: string;
  public code?: string;

  constructor(message: string, field?: string, code?: string) {
    super(message);
    this.name = 'FormError';
    this.field = field;
    this.code = code;
  }
}

export function createFormError(
  message: string,
  field?: string,
  code?: string
): FormError {
  return new FormError(message, field, code);
}

// 异步工具
export function createCancelablePromise<T>(promise: Promise<T>): {
  promise: Promise<T>;
  cancel: () => void;
} {
  let isCanceled = false;

  const cancelablePromise = new Promise<T>((resolve, reject) => {
    promise
      .then(value => {
        if (!isCanceled) {
          resolve(value);
        }
      })
      .catch(error => {
        if (!isCanceled) {
          reject(error);
        }
      });
  });

  return {
    promise: cancelablePromise,
    cancel: () => {
      isCanceled = true;
    },
  };
}

// 重试工具
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts) {
        throw lastError;
      }

      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}

// 缓存工具
export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)!;
      // 移动到最后（最近使用）
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 删除最久未使用的项（第一个）
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}
