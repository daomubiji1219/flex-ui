// // src/components/Form/useForm.ts - 核心Hook (旧版本)
// // 注意: 这是旧版本的实现，已经重构为更好的版本
// // 新版本位于: src/hooks/form/useFormRefactored.ts
// // 新版本应用了多种设计原则和设计模式，提供更好的可维护性和扩展性

// import React, { useReducer, useCallback, useMemo, createContext } from 'react'

// // 验证规则类型定义
// interface ValidationRule {
//   validate: (value: unknown) => Promise<void> | void
// }

// type ValidationSchema<T> = Partial<Record<keyof T, ValidationRule>>

// interface FormState<T> {
//   values: T
//   errors: Partial<Record<keyof T, string>>
//   touched: Partial<Record<keyof T, boolean>>
//   isSubmitting: boolean
// }

// // 表单动作类型
// type FormAction<T> =
//   | { type: 'SET_FIELD_VALUE'; payload: { name: keyof T; value: unknown } }
//   | { type: 'SET_FIELD_ERROR'; payload: { name: keyof T; error: string } }
//   | { type: 'CLEAR_FIELD_ERROR'; payload: { name: keyof T } }
//   | { type: 'RESET_FORM'; payload: T }
//   | { type: 'SET_SUBMITTING'; payload: boolean }

// // 表单状态管理器
// function formReducer<T>(state: FormState<T>, action: FormAction<T>): FormState<T> {
//   switch (action.type) {
//     case 'SET_FIELD_VALUE':
//       return {
//         ...state,
//         values: { ...state.values, [action.payload.name]: action.payload.value },
//         touched: { ...state.touched, [action.payload.name]: true }
//       }
//     case 'SET_FIELD_ERROR':
//       return {
//         ...state,
//         errors: { ...state.errors, [action.payload.name]: action.payload.error }
//       }
//     case 'CLEAR_FIELD_ERROR': {
//       const newErrors = { ...state.errors }
//       delete newErrors[action.payload.name]
//       return { ...state, errors: newErrors }
//     }
//     case 'RESET_FORM':
//       return {
//         values: action.payload,
//         errors: {},
//         touched: {},
//         isSubmitting: false
//       }
//     case 'SET_SUBMITTING':
//       return { ...state, isSubmitting: action.payload }
//     default:
//       return state
//   }
// }

// // 简化的debounce函数，避免类型冲突
// function simpleDebounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
//   let timeout: NodeJS.Timeout | null = null
//   return ((...args: Parameters<T>) => {
//     if (timeout) clearTimeout(timeout)
//     timeout = setTimeout(() => func(...args), wait)
//   }) as T
// }

// export const useForm = <T extends Record<string, unknown>>(
//   initialValues: T,
//   validationSchema?: ValidationSchema<T>
// ) => {
//   const [state, setState] = useReducer(formReducer<T>, {
//     values: initialValues,
//     errors: {},
//     touched: {},
//     isSubmitting: false
//   })

//   // 字段验证 - 展示异步处理能力
//   const validateField = useCallback(async (
//     name: keyof T,
//     value: unknown
//   ): Promise<string | null> => {
//     if (!validationSchema?.[name]) return null

//     try {
//       await validationSchema[name]!.validate(value)
//       return null
//     } catch (error: unknown) {
//       return (error as Error).message || '验证失败'
//     }
//   }, [validationSchema])

//   // 防抖验证 - 性能优化展示
//   const debouncedValidate = useMemo(
//     () => simpleDebounce(validateField, 300),
//     [validateField]
//   )

//   const setFieldValue = useCallback(async (name: keyof T, value: unknown) => {
//     setState({ type: 'SET_FIELD_VALUE', payload: { name, value } })

//     // 实时验证
//     const error = await debouncedValidate(name, value)
//     if (error) {
//       setState({ type: 'SET_FIELD_ERROR', payload: { name, error: (error as any) instanceof Error ? (error as unknown as Error).message : String(error) } })
//     } else {
//       setState({ type: 'CLEAR_FIELD_ERROR', payload: { name } })
//     }
//   }, [debouncedValidate])

//   // 验证所有字段
//   const validateAllFields = useCallback(async (
//     values: T,
//     schema?: ValidationSchema<T>
//   ): Promise<Partial<Record<keyof T, string>>> => {
//     if (!schema) return {}

//     const errors: Partial<Record<keyof T, string>> = {}

//     for (const [key, rule] of Object.entries(schema) as [keyof T, ValidationRule][]) {
//       try {
//         await rule.validate(values[key])
//       } catch (error: unknown) {
//          errors[key] = (error as Error).message || '验证失败'
//       }
//     }

//     return errors
//   }, [])

//   return {
//     values: state.values,
//     errors: state.errors,
//     touched: state.touched,
//     isSubmitting: state.isSubmitting,
//     setFieldValue,
//     validateForm: () => validateAllFields(state.values, validationSchema),
//     resetForm: () => setState({ type: 'RESET_FORM', payload: initialValues })
//   }
// }

// // FormContext类型定义
// type FormContextValue<T extends Record<string, unknown> = Record<string, unknown>> = {
//   values: T
//   errors: Partial<Record<keyof T, string>>
//   touched: Partial<Record<keyof T, boolean>>
//   isSubmitting: boolean
//   setFieldValue: (name: keyof T, value: unknown) => Promise<void>
//   validateForm: () => Promise<Partial<Record<keyof T, string>>>
//   resetForm: () => void
// }

// // 创建FormContext
// export const FormContext = createContext<FormContextValue<Record<string, unknown>> | null>(null)

// // 表单组件
// export function Form<T extends Record<string, unknown>>({
//   initialValues,
//   validationSchema,
//   onSubmit,
//   children
// }: {
//   initialValues: T
//   validationSchema?: ValidationSchema<T>
//   onSubmit: (values: T) => Promise<void>
//   children: React.ReactNode
// }) {
//   const form = useForm(initialValues, validationSchema)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const errors = await form.validateForm()
//     if (Object.keys(errors).length === 0) {
//       await onSubmit(form.values)
//     }
//   }

//   return React.createElement(
//     FormContext.Provider,
//     { value: form as FormContextValue<Record<string, unknown>> },
//     React.createElement(
//       'form',
//       { onSubmit: handleSubmit },
//       children
//     )
//   )
// }
