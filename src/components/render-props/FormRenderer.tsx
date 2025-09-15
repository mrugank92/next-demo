"use client";

import { useState, FormEvent, ReactNode } from "react";

interface FormFieldError {
  [key: string]: string | undefined;
}

interface FormState<T> {
  values: T;
  errors: FormFieldError;
  touched: { [K in keyof T]?: boolean };
  isSubmitting: boolean;
  isDirty: boolean;
}

interface FormActions<T> {
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: (field: keyof T, error: string) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  resetForm: () => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e: FormEvent) => Promise<void>;
}

interface FormRendererProps<T> {
  initialValues: T;
  validate?: (values: T) => FormFieldError;
  children: (state: FormState<T>, actions: FormActions<T>) => ReactNode;
}

export function FormRenderer<T extends Record<string, unknown>>({
  initialValues,
  validate,
  children,
}: FormRendererProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormFieldError>({});
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const setValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: undefined }));
    }
  };

  const setError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field as string]: error }));
  };

  const setTouchedField = (field: keyof T, touchedValue: boolean) => {
    setTouched(prev => ({ ...prev, [field]: touchedValue }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsDirty(false);
  };

  const handleSubmit = (onSubmit: (values: T) => Promise<void> | void) => 
    async (e: FormEvent) => {
      e.preventDefault();
      
      // Validate all fields
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }

      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

  const state: FormState<T> = {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
  };

  const actions: FormActions<T> = {
    setValue,
    setError,
    setTouched: setTouchedField,
    setFieldValue: setValue,
    resetForm,
    handleSubmit,
  };

  return <>{children(state, actions)}</>;
}