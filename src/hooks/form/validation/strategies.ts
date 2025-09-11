// 验证策略实现 - 策略模式
import type { IValidationStrategy, ValidationResult } from '../types';

// 基础验证策略抽象类
export abstract class BaseValidationStrategy implements IValidationStrategy {
  abstract execute(
    value: unknown
  ): ValidationResult | Promise<ValidationResult>;
}

// 必填验证策略
export class RequiredValidationStrategy extends BaseValidationStrategy {
  private message: string;

  constructor(message: string = '此字段为必填项') {
    super();
    this.message = message;
  }

  execute(value: unknown): ValidationResult {
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0);

    return {
      isValid: !isEmpty,
      message: isEmpty ? this.message : undefined,
    };
  }
}

// 最小长度验证策略
export class MinLengthValidationStrategy extends BaseValidationStrategy {
  private minLength: number;
  private message?: string;

  constructor(minLength: number, message?: string) {
    super();
    this.minLength = minLength;
    this.message = message;
  }

  execute(value: unknown): ValidationResult {
    const str = String(value || '');
    const isValid = str.length >= this.minLength;

    return {
      isValid,
      message: isValid
        ? undefined
        : this.message || `最少需要${this.minLength}个字符`,
    };
  }
}

// 最大长度验证策略
export class MaxLengthValidationStrategy extends BaseValidationStrategy {
  private maxLength: number;
  private message?: string;

  constructor(maxLength: number, message?: string) {
    super();
    this.maxLength = maxLength;
    this.message = message;
  }

  execute(value: unknown): ValidationResult {
    const str = String(value || '');
    const isValid = str.length <= this.maxLength;

    return {
      isValid,
      message: isValid
        ? undefined
        : this.message || `最多允许${this.maxLength}个字符`,
    };
  }
}

// 正则表达式验证策略
export class RegexValidationStrategy extends BaseValidationStrategy {
  private pattern: RegExp;
  private message: string;

  constructor(pattern: RegExp, message: string = '格式不正确') {
    super();
    this.pattern = pattern;
    this.message = message;
  }

  execute(value: unknown): ValidationResult {
    const str = String(value || '');
    const isValid = this.pattern.test(str);

    return {
      isValid,
      message: isValid ? undefined : this.message,
    };
  }
}

// 邮箱验证策略
export class EmailValidationStrategy extends RegexValidationStrategy {
  constructor(message: string = '请输入有效的邮箱地址') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    super(emailRegex, message);
  }
}

// 数字范围验证策略
export class NumberRangeValidationStrategy extends BaseValidationStrategy {
  private min?: number;
  private max?: number;
  private message?: string;

  constructor(min?: number, max?: number, message?: string) {
    super();
    this.min = min;
    this.max = max;
    this.message = message;
  }

  execute(value: unknown): ValidationResult {
    const num = Number(value);

    if (isNaN(num)) {
      return {
        isValid: false,
        message: '请输入有效数字',
      };
    }

    const minValid = this.min === undefined || num >= this.min;
    const maxValid = this.max === undefined || num <= this.max;
    const isValid = minValid && maxValid;

    let message: string | undefined;
    if (!isValid) {
      if (this.message) {
        message = this.message;
      } else if (this.min !== undefined && this.max !== undefined) {
        message = `数值应在${this.min}到${this.max}之间`;
      } else if (this.min !== undefined) {
        message = `数值不能小于${this.min}`;
      } else if (this.max !== undefined) {
        message = `数值不能大于${this.max}`;
      }
    }

    return { isValid, message };
  }
}

// 自定义异步验证策略
export class AsyncValidationStrategy extends BaseValidationStrategy {
  private validator: (value: unknown) => Promise<boolean>;
  private message: string;

  constructor(
    validator: (value: unknown) => Promise<boolean>,
    message: string = '验证失败'
  ) {
    super();
    this.validator = validator;
    this.message = message;
  }

  async execute(value: unknown): Promise<ValidationResult> {
    try {
      const isValid = await this.validator(value);
      return {
        isValid,
        message: isValid ? undefined : this.message,
      };
    } catch (error) {
      return {
        isValid: false,
        message: error instanceof Error ? error.message : this.message,
      };
    }
  }
}
