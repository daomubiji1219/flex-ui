# 重构后的表单系统

这是一个基于现代设计原则和设计模式重构的React表单管理系统，提供了强大、灵活且易于扩展的表单解决方案。

## 🎯 设计原则

### 1. 单一职责原则 (SRP)
- **验证器**: 每个验证策略只负责一种验证逻辑
- **观察者**: 每个观察者只处理特定类型的事件
- **状态管理**: 状态管理器只负责状态转换逻辑
- **命令**: 每个命令只执行一个特定操作

### 2. 开闭原则 (OCP)
- 通过接口定义扩展点，无需修改现有代码即可添加新功能
- 验证策略可以轻松扩展新的验证规则
- 观察者可以添加新的事件处理逻辑

### 3. 依赖倒置原则 (DIP)
- 高层模块不依赖低层模块，都依赖于抽象
- 使用接口定义契约，具体实现可以替换

### 4. 接口隔离原则 (ISP)
- 定义了细粒度的接口，客户端只依赖它们需要的接口
- `IValidator`、`IFormObserver`、`IValidationStrategy` 等接口职责明确

### 5. 里氏替换原则 (LSP)
- 所有实现类都可以替换其基类而不影响程序正确性
- 验证策略、观察者等都可以无缝替换

### 6. 最少知识原则 (LoD)
- 组件只与直接朋友通信，减少耦合
- 使用外观模式隐藏复杂的内部实现

### 7. 组合/聚合复用原则
- 优先使用组合而非继承
- 组合验证器、装饰器模式等都体现了这一原则

### 8. KISS原则 (Keep It Simple, Stupid)
- API设计简洁明了
- 复杂逻辑被封装在内部，对外提供简单接口

### 9. YAGNI原则 (You Aren't Gonna Need It)
- 只实现当前需要的功能
- 避免过度设计和不必要的复杂性

### 10. DRY原则 (Don't Repeat Yourself)
- 提取公共工具函数
- 使用模板方法模式避免重复代码

## 🏗️ 设计模式

### 创建型模式

#### 1. 工厂模式 (Factory Pattern)
```typescript
// ValidatorFactory 提供创建验证器的工厂方法
const validator = ValidatorFactory.createEmail('请输入有效邮箱')
```

#### 2. 建造者模式 (Builder Pattern)
```typescript
// 使用建造者模式创建复杂的验证器
const validator = validators.string()
  .required('必填')
  .minLength(3, '至少3个字符')
  .email('邮箱格式错误')
  .withCache(5000)
  .build()
```

#### 3. 单例模式 (Singleton Pattern)
```typescript
// FormFacade 在 useForm 中作为单例使用
if (!facadeRef.current) {
  facadeRef.current = new FormFacade(config)
}
```

### 结构型模式

#### 1. 外观模式 (Facade Pattern)
```typescript
// FormFacade 为复杂的表单操作提供简单接口
export class FormFacade<T> {
  async setFieldValue(fieldName: keyof T, value: unknown): Promise<void>
  async validateForm(): Promise<Record<keyof T, ValidationResult>>
  // ... 其他简化的API
}
```

#### 2. 装饰器模式 (Decorator Pattern)
```typescript
// 为验证器添加缓存、日志等功能
const cachedValidator = new CacheValidatorDecorator(validator, 5000)
const loggedValidator = new LogValidatorDecorator(validator, 'fieldName')
```

#### 3. 组合模式 (Composite Pattern)
```typescript
// CompositeValidator 可以组合多个验证策略
const validator = new CompositeValidator([
  new RequiredValidationStrategy(),
  new EmailValidationStrategy()
])
```

#### 4. 适配器模式 (Adapter Pattern)
```typescript
// 将旧的验证函数适配到新的验证接口
class LegacyValidatorAdapter implements IValidator {
  constructor(private legacyValidator: (value: any) => boolean) {}
  
  validate(value: unknown): ValidationResult {
    const isValid = this.legacyValidator(value)
    return { isValid, message: isValid ? undefined : '验证失败' }
  }
}
```

### 行为型模式

#### 1. 观察者模式 (Observer Pattern)
```typescript
// 表单状态变化时通知所有观察者
const unsubscribe = form.subscribe(new LoggingObserver())
```

#### 2. 策略模式 (Strategy Pattern)
```typescript
// 不同的验证策略可以互换
interface IValidationStrategy {
  execute(value: unknown): ValidationResult
}
```

#### 3. 命令模式 (Command Pattern)
```typescript
// 表单操作封装为命令，支持撤销/重做
const command = new SetFieldValueCommand(context, 'email', 'test@example.com')
await commandInvoker.execute(command)
```

#### 4. 状态模式 (State Pattern)
```typescript
// 表单在不同状态下有不同的行为
class IdleFormState implements IFormState {
  handle(context: FormStateContext, action: FormAction): FormState
}
```

#### 5. 模板方法模式 (Template Method Pattern)
```typescript
// 验证器装饰器提供模板方法
export abstract class ValidatorDecorator implements IValidator {
  async validate(value: unknown): Promise<ValidationResult> {
    // 模板方法，子类可以重写具体步骤
    return this.validator.validate(value)
  }
}
```

## 📁 项目结构

```
src/hooks/form/
├── types.ts                    # 类型定义
├── validation/
│   ├── strategies.ts           # 验证策略实现
│   └── validators.ts           # 验证器和工厂
├── observers/
│   └── FormObserver.ts         # 观察者实现
├── state/
│   └── FormStateManager.ts     # 状态管理
├── utils/
│   └── index.ts               # 工具函数
├── useFormRefactored.ts        # 主要Hook
├── index.ts                   # 导出文件
└── README.md                  # 文档
```

## 🚀 快速开始

### 1. 基本使用

```typescript
import { useFormRefactored, validators } from './hooks/form'

const formConfig = {
  initialValues: {
    email: '',
    password: ''
  },
  validationSchema: {
    email: validators.string()
      .required('邮箱不能为空')
      .email('请输入有效邮箱')
      .build(),
    password: validators.string()
      .required('密码不能为空')
      .minLength(8, '密码至少8位')
      .build()
  }
}

function LoginForm() {
  const form = useFormRefactored(formConfig)
  
  const handleSubmit = async (values) => {
    console.log('提交:', values)
  }
  
  return (
    <FormRefactored config={formConfig} onSubmit={handleSubmit}>
      {/* 表单内容 */}
    </FormRefactored>
  )
}
```

### 2. 自定义验证器

```typescript
// 创建自定义验证策略
class CustomValidationStrategy extends BaseValidationStrategy {
  execute(value: unknown): ValidationResult {
    // 自定义验证逻辑
    return { isValid: true }
  }
}

// 使用建造者模式
const validator = validators.string()
  .custom(new CustomValidationStrategy())
  .build()
```

### 3. 添加观察者

```typescript
// 添加日志观察者
const unsubscribe = form.subscribe(new LoggingObserver('[MyForm]'))

// 添加持久化观察者
form.subscribe(new PersistenceObserver('form-data'))

// 自定义观察者
class CustomObserver implements IFormObserver {
  onFieldChange(fieldName: string, value: unknown): void {
    console.log(`字段 ${fieldName} 变更为:`, value)
  }
  
  onFieldError(fieldName: string, error: string): void {
    console.log(`字段 ${fieldName} 错误:`, error)
  }
  
  onFormSubmit(values: Record<string, unknown>): void {
    console.log('表单提交:', values)
  }
}
```

### 4. 命令模式操作

```typescript
// 撤销/重做操作
if (form.canUndo()) {
  await form.undo()
}

if (form.canRedo()) {
  await form.redo()
}

// 批量设置值
await form.batchSetFieldValues({
  email: 'test@example.com',
  password: 'newpassword'
})
```

## 🔧 高级功能

### 1. 缓存验证结果

```typescript
const validator = validators.string()
  .email()
  .withCache(5000) // 缓存5秒
  .build()
```

### 2. 验证日志

```typescript
const validator = validators.string()
  .email()
  .withLogging('email-field')
  .build()
```

### 3. 异步验证

```typescript
const asyncValidator = validators.async(
  async (value) => {
    const response = await fetch(`/api/check-username/${value}`)
    return response.ok
  },
  '用户名已存在'
).build()
```

### 4. 表单统计

```typescript
const stats = form.getFormStats()
console.log('完成率:', stats.completionRate)
console.log('错误率:', stats.errorRate)
```

## 🎨 样式定制

系统提供了完整的CSS样式，支持:
- 响应式设计
- 深色模式
- 动画效果
- 自定义主题

```css
/* 自定义主题色 */
:root {
  --primary-color: #3b82f6;
  --error-color: #ef4444;
  --success-color: #10b981;
}
```

## 🧪 测试

```typescript
// 单元测试示例
describe('FormFacade', () => {
  it('should validate field correctly', async () => {
    const facade = new FormFacade(config)
    const result = await facade.validateField('email')
    expect(result.isValid).toBe(true)
  })
})
```

## 📈 性能优化

1. **防抖验证**: 避免频繁验证
2. **结果缓存**: 缓存验证结果
3. **懒加载**: 按需加载验证器
4. **虚拟化**: 大表单的虚拟滚动

## 🔒 类型安全

完全使用TypeScript编写，提供:
- 强类型检查
- 智能代码提示
- 编译时错误检测
- 泛型支持

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有贡献者和开源社区的支持！