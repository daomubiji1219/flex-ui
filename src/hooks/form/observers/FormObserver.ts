// 观察者模式实现
import type { IFormObserver } from '../types';

// 表单观察者管理器
export class FormObserverManager {
  private observers: Set<IFormObserver> = new Set();

  subscribe(observer: IFormObserver): () => void {
    this.observers.add(observer);

    // 返回取消订阅函数
    return () => {
      this.observers.delete(observer);
    };
  }

  unsubscribe(observer: IFormObserver): void {
    this.observers.delete(observer);
  }

  notifyFieldChange(fieldName: string, value: unknown): void {
    this.observers.forEach(observer => {
      try {
        observer.onFieldChange(fieldName, value);
      } catch (error) {
        console.error('Error in form observer onFieldChange:', error);
      }
    });
  }

  notifyFieldError(fieldName: string, error: string): void {
    this.observers.forEach(observer => {
      try {
        observer.onFieldError(fieldName, error);
      } catch (error) {
        console.error('Error in form observer onFieldError:', error);
      }
    });
  }

  notifyFormSubmit(values: Record<string, unknown>): void {
    this.observers.forEach(observer => {
      try {
        observer.onFormSubmit(values);
      } catch (error) {
        console.error('Error in form observer onFormSubmit:', error);
      }
    });
  }

  clear(): void {
    this.observers.clear();
  }

  get observerCount(): number {
    return this.observers.size;
  }
}

// 预定义的观察者实现

// 日志观察者
export class LoggingObserver implements IFormObserver {
  private prefix: string;

  constructor(prefix: string = '[Form]') {
    this.prefix = prefix;
  }

  onFieldChange(fieldName: string, value: unknown): void {
    console.log(`${this.prefix} Field changed:`, { fieldName, value });
  }

  onFieldError(fieldName: string, error: string): void {
    console.warn(`${this.prefix} Field error:`, { fieldName, error });
  }

  onFormSubmit(values: Record<string, unknown>): void {
    console.log(`${this.prefix} Form submitted:`, values);
  }
}

// 分析观察者
export class AnalyticsObserver implements IFormObserver {
  private analyticsService?: {
    track: (event: string, data: Record<string, unknown>) => void;
  };

  constructor(analyticsService?: {
    track: (event: string, data: Record<string, unknown>) => void;
  }) {
    this.analyticsService = analyticsService;
  }

  onFieldChange(fieldName: string, value: unknown): void {
    this.analyticsService?.track('form_field_change', {
      fieldName,
      valueType: typeof value,
      hasValue: value !== null && value !== undefined && value !== '',
    });
  }

  onFieldError(fieldName: string, error: string): void {
    this.analyticsService?.track('form_field_error', {
      fieldName,
      error,
    });
  }

  onFormSubmit(values: Record<string, unknown>): void {
    this.analyticsService?.track('form_submit', {
      fieldCount: Object.keys(values).length,
      filledFields: Object.values(values).filter(
        v => v !== null && v !== undefined && v !== ''
      ).length,
    });
  }
}

// 持久化观察者
export class PersistenceObserver implements IFormObserver {
  private storageKey: string;
  private storage: Storage;

  constructor(storageKey: string, storage: Storage = localStorage) {
    this.storageKey = storageKey;
    this.storage = storage;
  }

  onFieldChange(fieldName: string, value: unknown): void {
    try {
      const stored = this.getStoredData();
      stored[fieldName] = value;
      this.storage.setItem(this.storageKey, JSON.stringify(stored));
    } catch (error) {
      console.error('Failed to persist form data:', error);
    }
  }

  onFieldError(_fieldName: string, _error: string): void {
    // 可以选择性地持久化错误信息
  }

  onFormSubmit(_values: Record<string, unknown>): void {
    // 提交成功后清除持久化数据
    try {
      this.storage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear persisted form data:', error);
    }
  }

  getStoredData(): Record<string, unknown> {
    try {
      const stored = this.storage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to retrieve persisted form data:', error);
      return {};
    }
  }

  clearStoredData(): void {
    try {
      this.storage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear persisted form data:', error);
    }
  }
}

// 验证观察者 - 自动触发验证
export class ValidationObserver implements IFormObserver {
  private validateField: (fieldName: string, value: unknown) => Promise<void>;
  private debounceMs: number;

  constructor(
    validateField: (fieldName: string, value: unknown) => Promise<void>,
    debounceMs: number = 300
  ) {
    this.validateField = validateField;
    this.debounceMs = debounceMs;
  }

  private debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

  onFieldChange(fieldName: string, value: unknown): void {
    // 清除之前的定时器
    const existingTimer = this.debounceTimers.get(fieldName);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // 设置新的防抖验证
    const timer = setTimeout(async () => {
      try {
        await this.validateField(fieldName, value);
      } catch (error) {
        console.error(`Validation failed for field ${fieldName}:`, error);
      }
      this.debounceTimers.delete(fieldName);
    }, this.debounceMs);

    this.debounceTimers.set(fieldName, timer);
  }

  onFieldError(_fieldName: string, _error: string): void {
    // 可以在这里处理错误相关的逻辑
  }

  onFormSubmit(_values: Record<string, unknown>): void {
    // 清除所有防抖定时器
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
  }

  cleanup(): void {
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
  }
}
