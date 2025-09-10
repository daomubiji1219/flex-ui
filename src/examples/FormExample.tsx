// 重构后表单系统的使用示例
import React from 'react'
import {
  useFormRefactored,
  FormRefactored,
  useFormContext,
  validators,
  ValidatorFactory,
  LoggingObserver,
  PersistenceObserver,
  AnalyticsObserver
} from '../hooks/form'
import type { FormConfig } from '../hooks/form'

// 表单数据类型
interface UserFormData extends Record<string, unknown> {
  username: string
  email: string
  password: string
  confirmPassword: string
  age: number
  bio: string
}

// 表单配置
const formConfig: FormConfig<UserFormData> = {
  initialValues: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: 0,
    bio: ''
  },
  validationSchema: {
    username: validators.string()
      .required('用户名不能为空')
      .minLength(3, '用户名至少3个字符')
      .maxLength(20, '用户名最多20个字符')
      .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线')
      .withCache(5000)
      .build(),
    
    email: validators.string()
      .required('邮箱不能为空')
      .email('请输入有效的邮箱地址')
      .withLogging('email')
      .build(),
    
    password: validators.string()
      .required('密码不能为空')
      .minLength(8, '密码至少8个字符')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字')
      .build(),
    
    confirmPassword: ValidatorFactory.createAsync(
      async (value: unknown) => {
        // 模拟异步验证
        await new Promise(resolve => setTimeout(resolve, 100))
        return value === formConfig.initialValues.password
      },
      '密码确认不匹配'
    ),
    
    age: validators.number()
      .required('年龄不能为空')
      .range(18, 100, '年龄必须在18-100之间')
      .build(),
    
    bio: validators.string()
      .maxLength(500, '个人简介最多500个字符')
      .build()
  },
  debounceMs: 300,
  validateOnChange: true,
  validateOnBlur: true
}

// 输入组件
function FormInput({
  name,
  label,
  type = 'text',
  placeholder,
  ...props
}: {
  name: keyof UserFormData
  label: string
  type?: string
  placeholder?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const form = useFormContext<UserFormData>()
  const value = form.state.values[name]
  const error = form.state.errors[name]
  const touched = form.state.touched[name]
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value
    await form.setFieldValue(name, newValue)
  }
  
  const handleBlur = async () => {
    if (formConfig.validateOnBlur) {
      await form.validateField(name)
    }
  }
  
  return (
    <div className="form-field">
      <label htmlFor={String(name)} className="form-label">
        {label}
      </label>
      <input
        id={String(name)}
        type={type}
        value={String(value || '')}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`form-input ${error && touched ? 'error' : ''}`}
        {...props}
      />
      {error && touched && (
        <span className="form-error">{error}</span>
      )}
    </div>
  )
}

// 文本域组件
function FormTextarea({
  name,
  label,
  placeholder,
  ...props
}: {
  name: keyof UserFormData
  label: string
  placeholder?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const form = useFormContext<UserFormData>()
  const value = form.state.values[name]
  const error = form.state.errors[name]
  const touched = form.state.touched[name]
  
  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    await form.setFieldValue(name, e.target.value)
  }
  
  return (
    <div className="form-field">
      <label htmlFor={String(name)} className="form-label">
        {label}
      </label>
      <textarea
        id={String(name)}
        value={String(value || '')}
        onChange={handleChange}
        placeholder={placeholder}
        className={`form-textarea ${error && touched ? 'error' : ''}`}
        {...props}
      />
      {error && touched && (
        <span className="form-error">{error}</span>
      )}
    </div>
  )
}

// 表单统计组件
function FormStats() {
  const form = useFormContext<UserFormData>()
  const stats = form.getFormStats ? form.getFormStats() : null
  
  if (!stats) return null
  
  return (
    <div className="form-stats">
      <h3>表单统计</h3>
      <p>总字段数: {stats.totalFields}</p>
      <p>已填写字段: {stats.filledFields}</p>
      <p>已触摸字段: {stats.touchedFields}</p>
      <p>错误字段: {stats.errorFields}</p>
      <p>完成率: {stats.completionRate.toFixed(1)}%</p>
      <p>错误率: {stats.errorRate.toFixed(1)}%</p>
    </div>
  )
}

// 主表单组件
export function UserRegistrationForm() {
  const handleSubmit = async (values: UserFormData) => {
    console.log('提交表单数据:', values)
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('注册成功！')
  }
  
  return (
    <div className="form-container">
      <h2>用户注册表单</h2>
      
      <FormRefactored
        config={formConfig}
        onSubmit={handleSubmit}
        className="registration-form"
      >
        <FormInput
          name="username"
          label="用户名"
          placeholder="请输入用户名"
        />
        
        <FormInput
          name="email"
          label="邮箱"
          type="email"
          placeholder="请输入邮箱地址"
        />
        
        <FormInput
          name="password"
          label="密码"
          type="password"
          placeholder="请输入密码"
        />
        
        <FormInput
          name="confirmPassword"
          label="确认密码"
          type="password"
          placeholder="请再次输入密码"
        />
        
        <FormInput
          name="age"
          label="年龄"
          type="number"
          placeholder="请输入年龄"
        />
        
        <FormTextarea
          name="bio"
          label="个人简介"
          placeholder="请输入个人简介（可选）"
          rows={4}
        />
        
        <FormActions />
        <FormStats />
      </FormRefactored>
    </div>
  )
}

// 表单操作组件
function FormActions() {
  const form = useFormContext<UserFormData>()
  
  const handleReset = () => {
    form.resetForm()
  }
  
  const handleUndo = async () => {
    if (form.canUndo && form.canUndo()) {
      await form.undo()
    }
  }
  
  const handleRedo = async () => {
    if (form.canRedo && form.canRedo()) {
      await form.redo()
    }
  }
  
  const handleValidateAll = async () => {
    const results = await form.validateForm()
    console.log('验证结果:', results)
  }
  
  return (
    <div className="form-actions">
      <button
        type="submit"
        disabled={form.state.isSubmitting}
        className="btn btn-primary"
      >
        {form.state.isSubmitting ? '提交中...' : '注册'}
      </button>
      
      <button
        type="button"
        onClick={handleReset}
        className="btn btn-secondary"
      >
        重置
      </button>
      
      <button
        type="button"
        onClick={handleUndo}
        disabled={!form.canUndo()}
        className="btn btn-outline"
      >
        撤销
      </button>
      
      <button
        type="button"
        onClick={handleRedo}
        disabled={!form.canRedo()}
        className="btn btn-outline"
      >
        重做
      </button>
      
      <button
        type="button"
        onClick={handleValidateAll}
        className="btn btn-outline"
      >
        验证所有字段
      </button>
    </div>
  )
}

// 带观察者的表单示例
export function FormWithObservers() {
  const form = useFormRefactored(formConfig)
  
  React.useEffect(() => {
    // 添加日志观察者
    const unsubscribeLogging = form.subscribe(new LoggingObserver('[UserForm]'))
    
    // 添加持久化观察者
    const unsubscribePersistence = form.subscribe(
      new PersistenceObserver('user-form-data')
    )
    
    // 添加分析观察者
    const unsubscribeAnalytics = form.subscribe(
      new AnalyticsObserver({
        track: (event, data) => {
          console.log('Analytics:', event, data)
        }
      })
    )
    
    return () => {
      unsubscribeLogging()
      unsubscribePersistence()
      unsubscribeAnalytics()
    }
  }, [form])
  
  return (
    <div>
      <h2>带观察者的表单</h2>
      <p>此表单会自动记录日志、持久化数据和发送分析事件</p>
      {/* 表单内容 */}
    </div>
  )
}