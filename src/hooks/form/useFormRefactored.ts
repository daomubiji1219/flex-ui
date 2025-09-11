// 重构后的useForm Hook - 整合所有设计模式和原则
import React, {
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  createContext,
} from 'react';
import type {
  FormState,
  FormConfig,
  IFormContext,
  IValidator,
  ValidationResult,
  IFormObserver,
} from './types';

import {
  FormStateContext,
  IdleFormState,
  FormCommandInvoker,
  SetFieldValueCommand,
  BatchSetFieldValuesCommand,
} from './state/FormStateManager';
import { FormObserverManager } from './observers/FormObserver';
import { debounce, deepClone, LRUCache } from './utils';

// 外观模式 - 简化复杂的表单操作接口
export class FormFacade<T extends Record<string, unknown>> {
  private stateContext: FormStateContext;
  private observerManager: FormObserverManager;
  private commandInvoker: FormCommandInvoker;
  private validationCache: LRUCache<string, ValidationResult>;
  private config: FormConfig<T>;
  private debouncedValidators = new Map<
    keyof T,
    (value: unknown) => Promise<void>
  >();

  constructor(config: FormConfig<T>) {
    this.config = config;
    this.observerManager = new FormObserverManager();
    this.commandInvoker = new FormCommandInvoker();
    this.validationCache = new LRUCache<string, ValidationResult>(100);

    const initialState: FormState<T> = {
      values: deepClone(config.initialValues),
      errors: {},
      touched: {},
      isSubmitting: false,
      isDirty: false,
    };

    this.stateContext = new FormStateContext(initialState, new IdleFormState());
    this.setupDebouncedValidators();
  }

  private setupDebouncedValidators(): void {
    if (!this.config.validationSchema) return;

    Object.keys(this.config.validationSchema).forEach(fieldName => {
      const validator = this.config.validationSchema![fieldName as keyof T];
      if (validator) {
        const debouncedValidator = debounce(async (value: unknown) => {
          await this.validateFieldInternal(
            fieldName as keyof T,
            value,
            validator
          );
        }, this.config.debounceMs || 300);

        this.debouncedValidators.set(fieldName as keyof T, debouncedValidator);
      }
    });
  }

  private async validateFieldInternal(
    fieldName: keyof T,
    value: unknown,
    validator: IValidator
  ): Promise<void> {
    try {
      const cacheKey = `${String(fieldName)}_${JSON.stringify(value)}`;

      // 检查缓存
      let result = this.validationCache.get(cacheKey);
      if (!result) {
        result = await validator.validate(value);
        this.validationCache.set(cacheKey, result);
      }

      if (result.isValid) {
        this.clearFieldError(fieldName);
      } else {
        this.setFieldError(fieldName, result.message || '验证失败');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '验证失败';
      this.setFieldError(fieldName, message);
    }
  }

  // 公共API方法
  async setFieldValue(fieldName: keyof T, value: unknown): Promise<void> {
    const command = new SetFieldValueCommand(
      this.stateContext,
      String(fieldName),
      value
    );

    await this.commandInvoker.execute(command);

    // 通知观察者
    this.observerManager.notifyFieldChange(String(fieldName), value);

    // 触发验证（如果启用）
    if (this.config.validateOnChange !== false) {
      const debouncedValidator = this.debouncedValidators.get(fieldName);
      if (debouncedValidator) {
        await debouncedValidator(value);
      }
    }
  }

  setFieldError(fieldName: keyof T, error: string): void {
    this.stateContext.dispatch({
      type: 'SET_FIELD_ERROR',
      payload: { name: String(fieldName), error },
    });

    this.observerManager.notifyFieldError(String(fieldName), error);
  }

  clearFieldError(fieldName: keyof T): void {
    this.stateContext.dispatch({
      type: 'CLEAR_FIELD_ERROR',
      payload: { name: String(fieldName) },
    });
  }

  async validateField(fieldName: keyof T): Promise<ValidationResult> {
    const validator = this.config.validationSchema?.[fieldName];
    if (!validator) {
      return { isValid: true };
    }

    const value = this.stateContext.getState().values[fieldName as string];
    const cacheKey = `${String(fieldName)}_${JSON.stringify(value)}`;

    let result = this.validationCache.get(cacheKey);
    if (!result) {
      result = await validator.validate(value);
      this.validationCache.set(cacheKey, result);
    }

    if (!result.isValid && result.message) {
      this.setFieldError(fieldName, result.message);
    } else {
      this.clearFieldError(fieldName);
    }

    return result;
  }

  async validateForm(): Promise<Record<keyof T, ValidationResult>> {
    const results: Record<keyof T, ValidationResult> = {} as Record<
      keyof T,
      ValidationResult
    >;
    const state = this.stateContext.getState();

    if (!this.config.validationSchema) {
      return results;
    }

    const validationPromises = Object.keys(this.config.validationSchema).map(
      async fieldName => {
        const validator = this.config.validationSchema![fieldName as keyof T];
        const value = state.values[fieldName as string];

        try {
          const result = await validator.validate(value);
          results[fieldName as keyof T] = result;

          if (!result.isValid && result.message) {
            this.setFieldError(fieldName as keyof T, result.message);
          } else {
            this.clearFieldError(fieldName as keyof T);
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : '验证失败';
          results[fieldName as keyof T] = { isValid: false, message };
          this.setFieldError(fieldName as keyof T, message);
        }
      }
    );

    await Promise.all(validationPromises);
    return results;
  }

  async batchSetFieldValues(values: Partial<T>): Promise<void> {
    const command = new BatchSetFieldValuesCommand(
      this.stateContext,
      values as Record<string, unknown>
    );

    await this.commandInvoker.execute(command);

    // 通知观察者
    Object.entries(values).forEach(([fieldName, value]) => {
      this.observerManager.notifyFieldChange(fieldName, value);
    });

    // 触发验证
    if (this.config.validateOnChange !== false) {
      const validationPromises = Object.entries(values).map(
        async ([fieldName, value]) => {
          const debouncedValidator = this.debouncedValidators.get(
            fieldName as keyof T
          );
          if (debouncedValidator) {
            await debouncedValidator(value);
          }
        }
      );

      await Promise.all(validationPromises);
    }
  }

  resetForm(): void {
    this.stateContext.dispatch({
      type: 'RESET_FORM',
      payload: deepClone(this.config.initialValues),
    });

    this.commandInvoker.clear();
    this.validationCache.clear();
  }

  setSubmitting(isSubmitting: boolean): void {
    this.stateContext.dispatch({
      type: 'SET_SUBMITTING',
      payload: isSubmitting,
    });
  }

  subscribe(observer: IFormObserver): () => void {
    return this.observerManager.subscribe(observer);
  }

  // 命令模式相关方法
  async undo(): Promise<void> {
    await this.commandInvoker.undo();
  }

  async redo(): Promise<void> {
    await this.commandInvoker.redo();
  }

  canUndo(): boolean {
    return this.commandInvoker.canUndo();
  }

  canRedo(): boolean {
    return this.commandInvoker.canRedo();
  }

  getState(): FormState<T> {
    return this.stateContext.getState() as FormState<T>;
  }

  // 获取表单统计信息
  getFormStats() {
    const state = this.stateContext.getState();
    const totalFields = Object.keys(this.config.initialValues).length;
    const touchedFields = Object.keys(state.touched).length;
    const errorFields = Object.keys(state.errors).length;
    const filledFields = Object.values(state.values).filter(
      value => value !== null && value !== undefined && value !== ''
    ).length;

    return {
      totalFields,
      touchedFields,
      errorFields,
      filledFields,
      completionRate: totalFields > 0 ? (filledFields / totalFields) * 100 : 0,
      errorRate: totalFields > 0 ? (errorFields / totalFields) * 100 : 0,
    };
  }
}

// 重构后的useForm Hook
export function useFormRefactored<T extends Record<string, unknown>>(
  config: FormConfig<T>
) {
  const facadeRef = useRef<FormFacade<T> | null>(null);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  // 单例模式 - 确保FormFacade只创建一次
  if (!facadeRef.current) {
    facadeRef.current = new FormFacade(config);
  }

  const facade = facadeRef.current;

  // 订阅状态变化以触发重新渲染
  useEffect(() => {
    const unsubscribe = facade.subscribe({
      onFieldChange: () => forceUpdate(),
      onFieldError: () => forceUpdate(),
      onFormSubmit: () => forceUpdate(),
    });

    return unsubscribe;
  }, [facade]);

  // 返回稳定的API
  const api = useMemo(() => {
    const state = facade.getState();
    return {
      // 状态
      values: state.values,
      errors: state.errors,
      touched: state.touched,
      isSubmitting: state.isSubmitting,
      isDirty: state.isDirty,

      // 方法
      setFieldValue: facade.setFieldValue.bind(facade),
      setFieldError: facade.setFieldError.bind(facade),
      clearFieldError: facade.clearFieldError.bind(facade),
      validateField: facade.validateField.bind(facade),
      validateForm: facade.validateForm.bind(facade),
      batchSetFieldValues: facade.batchSetFieldValues.bind(facade),
      resetForm: facade.resetForm.bind(facade),
      setSubmitting: facade.setSubmitting.bind(facade),
      subscribe: facade.subscribe.bind(facade),

      // 命令模式方法
      undo: facade.undo.bind(facade),
      redo: facade.redo.bind(facade),
      canUndo: facade.canUndo.bind(facade),
      canRedo: facade.canRedo.bind(facade),

      // 统计信息
      getFormStats: facade.getFormStats.bind(facade),
    };
  }, [facade]);

  return api;
}

// Context实现
export const FormContextRefactored = createContext<IFormContext | null>(null);

// 重构后的Form组件
export function FormRefactored<T extends Record<string, unknown>>({
  config,
  onSubmit,
  children,
  className,
  ...props
}: {
  config: FormConfig<T>;
  onSubmit: (values: T) => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>) {
  const form = useFormRefactored(config);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      form.setSubmitting(true);

      try {
        const validationResults = await form.validateForm();
        const hasErrors = Object.values(validationResults).some(
          result => !result.isValid
        );

        if (!hasErrors) {
          await onSubmit(form.values);
          // 通知观察者表单提交
          form.subscribe({
            onFieldChange: () => {},
            onFieldError: () => {},
            onFormSubmit: values => console.log('Form submitted:', values),
          });
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        form.setSubmitting(false);
      }
    },
    [form, onSubmit]
  );

  const contextValue: IFormContext<T> = useMemo(
    () => ({
      state: {
        values: form.values,
        errors: form.errors,
        touched: form.touched,
        isSubmitting: form.isSubmitting,
        isDirty: form.isDirty,
      },
      setFieldValue: form.setFieldValue,
      setFieldError: form.setFieldError,
      clearFieldError: form.clearFieldError,
      validateField: form.validateField,
      validateForm: form.validateForm,
      resetForm: form.resetForm,
      subscribe: form.subscribe,
      undo: form.undo,
      redo: form.redo,
      canUndo: form.canUndo,
      canRedo: form.canRedo,
      getFormStats: form.getFormStats,
    }),
    [form]
  );

  return React.createElement(
    FormContextRefactored.Provider,
    { value: contextValue },
    React.createElement(
      'form',
      {
        onSubmit: handleSubmit,
        className,
        ...props,
      },
      children
    )
  );
}

// Hook for accessing form context
export function useFormContext<
  T extends Record<string, unknown>,
>(): IFormContext<T> {
  const context = React.useContext(FormContextRefactored);
  if (!context) {
    throw new Error(
      'useFormContext must be used within a FormRefactored component'
    );
  }
  return context as IFormContext<T>;
}
