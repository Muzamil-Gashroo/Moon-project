/**
 * Advanced form handling hook with validation
 * Demonstrates custom validation logic without external libraries
 */

import { useState, useCallback, useMemo } from 'react';

interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

interface FieldConfig<T> {
  initialValue: T;
  rules?: ValidationRule<T>[];
}

interface FormConfig<T extends Record<string, any>> {
  fields: { [K in keyof T]: FieldConfig<T[K]> };
  onSubmit: (values: T) => Promise<void> | void;
}

interface FieldError {
  message: string;
  touched: boolean;
}

export function useForm<T extends Record<string, any>>(config: FormConfig<T>) {
  // Initialize form values
  const [values, setValues] = useState<T>(() => {
    const initialValues = {} as T;
    Object.keys(config.fields).forEach(key => {
      initialValues[key as keyof T] = config.fields[key as keyof T].initialValue;
    });
    return initialValues;
  });

  const [errors, setErrors] = useState<Partial<Record<keyof T, FieldError>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validate a single field
  const validateField = useCallback(
    (fieldName: keyof T, value: T[keyof T]): string | null => {
      const fieldConfig = config.fields[fieldName];
      if (!fieldConfig.rules) return null;

      for (const rule of fieldConfig.rules) {
        if (!rule.validate(value)) {
          return rule.message;
        }
      }
      return null;
    },
    [config.fields]
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, FieldError>> = {};
    let isValid = true;

    Object.keys(values).forEach(key => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = { message: error, touched: true };
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  // Handle field change
  const handleChange = useCallback(
    (fieldName: keyof T) => (value: T[keyof T]) => {
      setValues(prev => ({ ...prev, [fieldName]: value }));
      
      // Clear submit error when user starts typing
      if (submitError) setSubmitError(null);
      
      // Validate field if it was touched
      if (errors[fieldName]?.touched) {
        const error = validateField(fieldName, value);
        setErrors(prev => ({
          ...prev,
          [fieldName]: error ? { message: error, touched: true } : undefined,
        }));
      }
    },
    [errors, submitError, validateField]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (fieldName: keyof T) => () => {
      const error = validateField(fieldName, values[fieldName]);
      setErrors(prev => ({
        ...prev,
        [fieldName]: { message: error || '', touched: true },
      }));
    },
    [values, validateField]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      
      if (isSubmitting) return;
      
      setSubmitError(null);
      
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await config.onSubmit(values);
        // Reset form on successful submit
        setValues(() => {
          const initialValues = {} as T;
          Object.keys(config.fields).forEach(key => {
            initialValues[key as keyof T] = config.fields[key as keyof T].initialValue;
          });
          return initialValues;
        });
        setErrors({});
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Submission failed');
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, config, isSubmitting]
  );

  // Reset form
  const reset = useCallback(() => {
    const initialValues = {} as T;
    Object.keys(config.fields).forEach(key => {
      initialValues[key as keyof T] = config.fields[key as keyof T].initialValue;
    });
    setValues(initialValues);
    setErrors({});
    setSubmitError(null);
  }, [config.fields]);

  // Check if form has errors
  const hasErrors = useMemo(() => {
    return Object.values(errors).some(error => error?.message);
  }, [errors]);

  return {
    values,
    errors,
    isSubmitting,
    submitError,
    hasErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}

// Common validation rules
export const validationRules = {
  required: <T>(message = 'This field is required'): ValidationRule<T> => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value != null && value !== '';
    },
    message,
  }),
  
  email: (message = 'Invalid email address'): ValidationRule<string> => ({
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),
  
  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),
  
  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length <= max,
    message: message || `Must be at most ${max} characters`,
  }),
  
  phone: (message = 'Invalid phone number'): ValidationRule<string> => ({
    validate: (value) => {
      const phoneRegex = /^[6-9]\d{9}$/;
      return phoneRegex.test(value.replace(/\s/g, ''));
    },
    message,
  }),
};
