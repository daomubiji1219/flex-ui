// 重构后的表单系统入口文件

// 核心类型
export * from './types';

// 验证相关
export * from './validation/strategies';
export * from './validation/validators';

// 观察者模式
export * from './observers/FormObserver';

// 状态管理
export * from './state/FormStateManager';

// 工具函数
export * from './utils';

// 主要Hook和组件
export * from './useFormRefactored';

// 便捷的验证器创建函数
import { ValidatorFactory } from './validation/validators';

export const validators = {
  required: ValidatorFactory.createRequired,
  minLength: ValidatorFactory.createMinLength,
  maxLength: ValidatorFactory.createMaxLength,
  email: ValidatorFactory.createEmail,
  regex: ValidatorFactory.createRegex,
  numberRange: ValidatorFactory.createNumberRange,
  async: ValidatorFactory.createAsync,
  string: ValidatorFactory.createString,
  number: ValidatorFactory.createNumber,
};

// 预定义的观察者
export {
  LoggingObserver,
  AnalyticsObserver,
  PersistenceObserver,
  ValidationObserver,
} from './observers/FormObserver';
