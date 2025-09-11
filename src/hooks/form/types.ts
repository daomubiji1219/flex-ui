// 表单相关类型定义
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface IValidator {
  validate(value: unknown): Promise<ValidationResult> | ValidationResult;
}

export interface IValidationStrategy {
  execute(value: unknown): Promise<ValidationResult> | ValidationResult;
}

export interface IFormObserver {
  onFieldChange(fieldName: string, value: unknown): void;
  onFieldError(fieldName: string, error: string): void;
  onFormSubmit(values: Record<string, unknown>): void;
}

export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

export type FormAction<T = Record<string, unknown>> =
  | { type: 'SET_FIELD_VALUE'; payload: { name: keyof T; value: unknown } }
  | { type: 'SET_FIELD_ERROR'; payload: { name: keyof T; error: string } }
  | { type: 'CLEAR_FIELD_ERROR'; payload: { name: keyof T } }
  | { type: 'RESET_FORM'; payload: T }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_DIRTY'; payload: boolean };

export interface FormConfig<T = Record<string, unknown>> {
  initialValues: T;
  validationSchema?: Record<keyof T, IValidator>;
  debounceMs?: number;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface IFormContext<T = Record<string, unknown>> {
  state: FormState<T>;
  setFieldValue: (name: keyof T, value: unknown) => Promise<void>;
  setFieldError: (name: keyof T, error: string) => void;
  clearFieldError: (name: keyof T) => void;
  validateField: (name: keyof T) => Promise<ValidationResult>;
  validateForm: () => Promise<Record<keyof T, ValidationResult>>;
  resetForm: () => void;
  subscribe: (observer: IFormObserver) => () => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  canUndo: () => boolean;
  canRedo: () => boolean;
  getFormStats?(): {
    totalFields: number;
    touchedFields: number;
    errorFields: number;
    filledFields: number;
    completionRate: number;
    errorRate: number;
  };
}
