// 验证器实现 - 工厂模式和组合模式
import type { IValidator, IValidationStrategy, ValidationResult } from '../types'
import {
  RequiredValidationStrategy,
  MinLengthValidationStrategy,
  MaxLengthValidationStrategy,
  RegexValidationStrategy,
  EmailValidationStrategy,
  NumberRangeValidationStrategy,
  AsyncValidationStrategy
} from './strategies'

// 组合验证器 - 组合模式
export class CompositeValidator implements IValidator {
  private strategies: IValidationStrategy[] = []

  constructor(strategies: IValidationStrategy[] = []) {
    this.strategies = strategies
  }

  addStrategy(strategy: IValidationStrategy): this {
    this.strategies.push(strategy)
    return this
  }

  removeStrategy(strategy: IValidationStrategy): this {
    const index = this.strategies.indexOf(strategy)
    if (index > -1) {
      this.strategies.splice(index, 1)
    }
    return this
  }

  async validate(value: unknown): Promise<ValidationResult> {
    for (const strategy of this.strategies) {
      const result = await strategy.execute(value)
      if (!result.isValid) {
        return result
      }
    }
    return { isValid: true }
  }
}

// 验证器装饰器 - 装饰器模式
export class ValidatorDecorator implements IValidator {
  protected validator: IValidator
  
  constructor(validator: IValidator) {
    this.validator = validator
  }

  async validate(value: unknown): Promise<ValidationResult> {
    return this.validator.validate(value)
  }
}

// 缓存装饰器
export class CacheValidatorDecorator extends ValidatorDecorator {
  private cache = new Map<unknown, ValidationResult>()
  private cacheTimeout: number

  constructor(validator: IValidator, cacheTimeout: number = 5000) {
    super(validator)
    this.cacheTimeout = cacheTimeout
  }

  async validate(value: unknown): Promise<ValidationResult> {
    const cacheKey = JSON.stringify(value)
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const result = await super.validate(value)
    this.cache.set(cacheKey, result)

    // 设置缓存过期
    setTimeout(() => {
      this.cache.delete(cacheKey)
    }, this.cacheTimeout)

    return result
  }
}

// 日志装饰器
export class LogValidatorDecorator extends ValidatorDecorator {
  private fieldName?: string
  
  constructor(validator: IValidator, fieldName?: string) {
    super(validator)
    this.fieldName = fieldName
  }

  async validate(value: unknown): Promise<ValidationResult> {
    const startTime = Date.now()
    console.log(`[Validation] Starting validation for field: ${this.fieldName || 'unknown'}`, { value })
    
    try {
      const result = await super.validate(value)
      const duration = Date.now() - startTime
      console.log(`[Validation] Completed validation for field: ${this.fieldName || 'unknown'}`, { 
        result, 
        duration: `${duration}ms` 
      })
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`[Validation] Failed validation for field: ${this.fieldName || 'unknown'}`, { 
        error, 
        duration: `${duration}ms` 
      })
      throw error
    }
  }
}

// 验证器工厂 - 工厂模式
export class ValidatorFactory {
  static createRequired(message?: string): CompositeValidator {
    return new CompositeValidator([new RequiredValidationStrategy(message)])
  }

  static createMinLength(length: number, message?: string): CompositeValidator {
    return new CompositeValidator([new MinLengthValidationStrategy(length, message)])
  }

  static createMaxLength(length: number, message?: string): CompositeValidator {
    return new CompositeValidator([new MaxLengthValidationStrategy(length, message)])
  }

  static createEmail(message?: string): CompositeValidator {
    return new CompositeValidator([new EmailValidationStrategy(message)])
  }

  static createRegex(pattern: RegExp, message?: string): CompositeValidator {
    return new CompositeValidator([new RegexValidationStrategy(pattern, message)])
  }

  static createNumberRange(min?: number, max?: number, message?: string): CompositeValidator {
    return new CompositeValidator([new NumberRangeValidationStrategy(min, max, message)])
  }

  static createAsync(
    validator: (value: unknown) => Promise<boolean>, 
    message?: string
  ): CompositeValidator {
    return new CompositeValidator([new AsyncValidationStrategy(validator, message)])
  }

  static createString(): StringValidatorBuilder {
    return new StringValidatorBuilder()
  }

  static createNumber(): NumberValidatorBuilder {
    return new NumberValidatorBuilder()
  }
}

// 建造者模式 - 字符串验证器建造者
export class StringValidatorBuilder {
  private validator = new CompositeValidator()

  required(message?: string): this {
    this.validator.addStrategy(new RequiredValidationStrategy(message))
    return this
  }

  minLength(length: number, message?: string): this {
    this.validator.addStrategy(new MinLengthValidationStrategy(length, message))
    return this
  }

  maxLength(length: number, message?: string): this {
    this.validator.addStrategy(new MaxLengthValidationStrategy(length, message))
    return this
  }

  email(message?: string): this {
    this.validator.addStrategy(new EmailValidationStrategy(message))
    return this
  }

  regex(pattern: RegExp, message?: string): this {
    this.validator.addStrategy(new RegexValidationStrategy(pattern, message))
    return this
  }

  custom(strategy: IValidationStrategy): this {
    this.validator.addStrategy(strategy)
    return this
  }

  withCache(timeout?: number): this {
    this.validator = new CacheValidatorDecorator(this.validator, timeout) as unknown as CompositeValidator
    return this
  }

  withLogging(fieldName?: string): this {
    this.validator = new LogValidatorDecorator(this.validator, fieldName) as unknown as CompositeValidator
    return this
  }

  build(): IValidator {
    return this.validator
  }
}

// 建造者模式 - 数字验证器建造者
export class NumberValidatorBuilder {
  private validator = new CompositeValidator()

  required(message?: string): this {
    this.validator.addStrategy(new RequiredValidationStrategy(message))
    return this
  }

  min(min: number, message?: string): this {
    this.validator.addStrategy(new NumberRangeValidationStrategy(min, undefined, message))
    return this
  }

  max(max: number, message?: string): this {
    this.validator.addStrategy(new NumberRangeValidationStrategy(undefined, max, message))
    return this
  }

  range(min: number, max: number, message?: string): this {
    this.validator.addStrategy(new NumberRangeValidationStrategy(min, max, message))
    return this
  }

  custom(strategy: IValidationStrategy): this {
    this.validator.addStrategy(strategy)
    return this
  }

  withCache(timeout?: number): this {
    this.validator = new CacheValidatorDecorator(this.validator, timeout) as unknown as CompositeValidator
    return this
  }

  withLogging(fieldName?: string): this {
    this.validator = new LogValidatorDecorator(this.validator, fieldName) as unknown as CompositeValidator
    return this
  }

  build(): IValidator {
    return this.validator
  }
}