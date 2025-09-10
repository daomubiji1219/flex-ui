// 状态管理器 - 状态模式和命令模式
import type { FormState, FormAction } from '../types'

// 状态模式 - 表单状态接口
export interface IFormState {
  handle(context: FormStateContext, action: FormAction): FormState
}

// 状态上下文
export class FormStateContext {
  private state: IFormState
  private currentFormState: FormState

  constructor(initialState: FormState, state: IFormState) {
    this.currentFormState = initialState
    this.state = state
  }

  setState(state: IFormState): void {
    this.state = state
  }

  getState(): FormState {
    return this.currentFormState
  }

  dispatch(action: FormAction): FormState {
    this.currentFormState = this.state.handle(this, action)
    return this.currentFormState
  }
}

// 具体状态实现

// 空闲状态
export class IdleFormState implements IFormState {
  handle(context: FormStateContext, action: FormAction): FormState {
    const currentState = context.getState()
    
    switch (action.type) {
      case 'SET_FIELD_VALUE':
        context.setState(new EditingFormState())
        return {
          ...currentState,
          values: { ...currentState.values, [action.payload.name]: action.payload.value },
          touched: { ...currentState.touched, [action.payload.name]: true },
          isDirty: true
        }
      
      case 'SET_SUBMITTING':
        if (action.payload) {
          context.setState(new SubmittingFormState())
        }
        return { ...currentState, isSubmitting: action.payload }
      
      case 'RESET_FORM':
        return {
          values: action.payload,
          errors: {},
          touched: {},
          isSubmitting: false,
          isDirty: false
        }
      
      default:
        return this.handleCommonActions(currentState, action)
    }
  }

  private handleCommonActions(state: FormState, action: FormAction): FormState {
    switch (action.type) {
      case 'SET_FIELD_ERROR':
        return {
          ...state,
          errors: { ...state.errors, [action.payload.name]: action.payload.error }
        }
      
      case 'CLEAR_FIELD_ERROR': {
        const newErrors = { ...state.errors }
        delete newErrors[action.payload.name]
        return { ...state, errors: newErrors }
      }
      
      case 'SET_DIRTY':
        return { ...state, isDirty: action.payload }
      
      default:
        return state
    }
  }
}

// 编辑状态
export class EditingFormState implements IFormState {
  handle(context: FormStateContext, action: FormAction): FormState {
    const currentState = context.getState()
    
    switch (action.type) {
      case 'SET_FIELD_VALUE':
        return {
          ...currentState,
          values: { ...currentState.values, [action.payload.name]: action.payload.value },
          touched: { ...currentState.touched, [action.payload.name]: true },
          isDirty: true
        }
      
      case 'SET_SUBMITTING':
        if (action.payload) {
          context.setState(new SubmittingFormState())
        } else {
          context.setState(new IdleFormState())
        }
        return { ...currentState, isSubmitting: action.payload }
      
      case 'RESET_FORM':
        context.setState(new IdleFormState())
        return {
          values: action.payload,
          errors: {},
          touched: {},
          isSubmitting: false,
          isDirty: false
        }
      
      default:
        return this.handleCommonActions(currentState, action)
    }
  }

  private handleCommonActions(state: FormState, action: FormAction): FormState {
    switch (action.type) {
      case 'SET_FIELD_ERROR':
        return {
          ...state,
          errors: { ...state.errors, [action.payload.name]: action.payload.error }
        }
      
      case 'CLEAR_FIELD_ERROR': {
        const newErrors = { ...state.errors }
        delete newErrors[action.payload.name]
        return { ...state, errors: newErrors }
      }
      
      case 'SET_DIRTY':
        return { ...state, isDirty: action.payload }
      
      default:
        return state
    }
  }
}

// 提交状态
export class SubmittingFormState implements IFormState {
  handle(context: FormStateContext, action: FormAction): FormState {
    const currentState = context.getState()
    
    switch (action.type) {
      case 'SET_SUBMITTING':
        if (!action.payload) {
          context.setState(new IdleFormState())
        }
        return { ...currentState, isSubmitting: action.payload }
      
      case 'RESET_FORM':
        context.setState(new IdleFormState())
        return {
          values: action.payload,
          errors: {},
          touched: {},
          isSubmitting: false,
          isDirty: false
        }
      
      // 在提交状态下，忽略字段值变更
      case 'SET_FIELD_VALUE':
        return currentState
      
      default:
        return this.handleCommonActions(currentState, action)
    }
  }

  private handleCommonActions(state: FormState, action: FormAction): FormState {
    switch (action.type) {
      case 'SET_FIELD_ERROR':
        return {
          ...state,
          errors: { ...state.errors, [action.payload.name]: action.payload.error }
        }
      
      case 'CLEAR_FIELD_ERROR': {
        const newErrors = { ...state.errors }
        delete newErrors[action.payload.name]
        return { ...state, errors: newErrors }
      }
      
      case 'SET_DIRTY':
        return { ...state, isDirty: action.payload }
      
      default:
        return state
    }
  }
}

// 命令模式 - 表单命令接口
export interface IFormCommand {
  execute(): void | Promise<void>
  undo?(): void | Promise<void>
  canExecute?(): boolean
}

// 命令调用者
export class FormCommandInvoker {
  private history: IFormCommand[] = []
  private currentIndex = -1
  private maxHistorySize: number

  constructor(maxHistorySize: number = 50) {
    this.maxHistorySize = maxHistorySize
  }

  async execute(command: IFormCommand): Promise<void> {
    if (command.canExecute && !command.canExecute()) {
      return
    }

    await command.execute()
    
    // 清除当前位置之后的历史记录
    this.history = this.history.slice(0, this.currentIndex + 1)
    
    // 添加新命令
    this.history.push(command)
    this.currentIndex++
    
    // 限制历史记录大小
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
      this.currentIndex--
    }
  }

  async undo(): Promise<void> {
    if (this.canUndo()) {
      const command = this.history[this.currentIndex]
      if (command.undo) {
        await command.undo()
        this.currentIndex--
      }
    }
  }

  async redo(): Promise<void> {
    if (this.canRedo()) {
      this.currentIndex++
      const command = this.history[this.currentIndex]
      await command.execute()
    }
  }

  canUndo(): boolean {
    return this.currentIndex >= 0 && 
           this.history[this.currentIndex]?.undo !== undefined
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  clear(): void {
    this.history = []
    this.currentIndex = -1
  }

  getHistorySize(): number {
    return this.history.length
  }
}

// 具体命令实现

// 设置字段值命令
export class SetFieldValueCommand implements IFormCommand {
  private previousValue: unknown
  private context: FormStateContext
  private fieldName: string
  private newValue: unknown

  constructor(
    context: FormStateContext,
    fieldName: string,
    newValue: unknown
  ) {
    this.context = context
    this.fieldName = fieldName
    this.newValue = newValue
    this.previousValue = context.getState().values[fieldName]
  }

  execute(): void {
    this.context.dispatch({
      type: 'SET_FIELD_VALUE',
      payload: { name: this.fieldName, value: this.newValue }
    })
  }

  undo(): void {
    this.context.dispatch({
      type: 'SET_FIELD_VALUE',
      payload: { name: this.fieldName, value: this.previousValue }
    })
  }
}

// 批量设置字段值命令
export class BatchSetFieldValuesCommand implements IFormCommand {
  private previousValues: Record<string, unknown>
  private context: FormStateContext
  private newValues: Record<string, unknown>

  constructor(
    context: FormStateContext,
    newValues: Record<string, unknown>
  ) {
    this.context = context
    this.newValues = newValues
    const currentState = context.getState()
    this.previousValues = { ...currentState.values }
  }

  execute(): void {
    Object.entries(this.newValues).forEach(([fieldName, value]) => {
      this.context.dispatch({
        type: 'SET_FIELD_VALUE',
        payload: { name: fieldName, value }
      })
    })
  }

  undo(): void {
    Object.entries(this.previousValues).forEach(([fieldName, value]) => {
      this.context.dispatch({
        type: 'SET_FIELD_VALUE',
        payload: { name: fieldName, value }
      })
    })
  }
}