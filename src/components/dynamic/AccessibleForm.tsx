/**
 * AccessibleForm - Production-Ready Accessible Form Component
 *
 * Features:
 * - WCAG 2.1 AA compliant
 * - Keyboard navigation
 * - Screen reader support
 * - Error handling with clear messages
 * - Focus management
 * - Color contrast compliance
 * - Touch-friendly targets
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { type FormEvent, useState, useRef, useEffect } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: string) => string | null;
  description?: string;
  autoComplete?: string;
}

export interface AccessibleFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  submitLabel?: string;
  className?: string;
}

/**
 * AccessibleForm - Accessible form with validation
 */
export function AccessibleForm({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  className = '',
}: AccessibleFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const firstErrorRef = useRef<HTMLElement | null>(null);

  // Focus first error on validation failure
  useEffect(() => {
    if (firstErrorRef.current) {
      firstErrorRef.current.focus();
    }
  }, [errors]);

  // Validate field
  const validateField = (field: FormField, value: unknown): string | null => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }

    if (field.type === 'tel' && value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
      return 'Please enter a valid phone number';
    }

    if (field.validation) {
      return field.validation(value);
    }

    return null;
  };

  // Handle input change
  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle blur for validation
  const handleBlur = (field: FormField, value: unknown) => {
    const error = validateField(field, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [field.name]: error }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');

    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Focus first error field
      const firstErrorField = document.getElementById(`field-${Object.keys(newErrors)[0]}`);
      firstErrorRef.current = firstErrorField;

      return;
    }

    // Submit form
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setSubmitStatus('success');
      setSubmitMessage('Form submitted successfully!');
      formRef.current?.reset();
      setFormData({});

      // Focus submit button after success
      setTimeout(() => {
        const submitButton = formRef.current?.querySelector('button[type="submit"]');
        (submitButton as HTMLElement)?.focus();
      }, 100);
    } catch (error: unknown) {
      setSubmitStatus('error');
      const message = error instanceof Error ? error.message : 'Failed to submit form. Please try again.';
      setSubmitMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      noValidate
      aria-label="Contact form"
    >
      {/* Success/Error Message */}
      <AnimatePresence>
        {submitStatus !== 'idle' && submitMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="alert"
            aria-live="assertive"
            className={`flex items-start gap-3 p-4 rounded-xl ${
              submitStatus === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
            }`}
          >
            {submitStatus === 'success' ? (
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <p
              className={`text-sm font-medium ${
                submitStatus === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}
            >
              {submitMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Fields */}
      {fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          value={formData[field.name] || ''}
          error={errors[field.name]}
          onChange={(value) => handleChange(field.name, value)}
          onBlur={(value) => handleBlur(field, value)}
        />
      ))}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full py-4 px-6
          bg-gradient-to-r from-blue-600 to-purple-600
          text-white font-bold rounded-2xl
          shadow-lg hover:shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed
          transform hover:-translate-y-1
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-4
          focus-visible:ring-blue-500 focus-visible:ring-offset-2
          min-h-[56px] min-w-[120px]
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={isSubmitting ? 'Submitting form' : submitLabel}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>Submitting...</span>
          </span>
        ) : (
          submitLabel
        )}
      </motion.button>
    </form>
  );
}

/**
 * Individual Form Field Component
 */
interface FormFieldProps {
  field: FormField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  onBlur: (value: unknown) => void;
}

function FormField({ field, value, error, onChange, onBlur }: FormFieldProps) {
  const fieldId = `field-${field.name}`;
  const errorId = `error-${field.name}`;
  const descriptionId = `description-${field.name}`;
  const isRequired = field.required;

  const commonInputClasses = `
    w-full px-4 py-3
    bg-white dark:bg-gray-800
    border-2 rounded-xl
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
    transition-all duration-200
    focus-visible:outline-none focus-visible:ring-4
    min-h-[48px]
    ${
      error
        ? 'border-red-500 dark:border-red-400 focus-visible:ring-red-500'
        : 'border-gray-300 dark:border-gray-600 focus-visible:ring-blue-500'
    }
  `;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label
        htmlFor={fieldId}
        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {field.label}
        {isRequired && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Description */}
      {field.description && (
        <p
          id={descriptionId}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {field.description}
        </p>
      )}

      {/* Input Field */}
      {field.type === 'textarea' ? (
        <textarea
          id={fieldId}
          name={field.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          placeholder={field.placeholder}
          required={isRequired}
          rows={4}
          className={commonInputClasses}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${field.description ? descriptionId : ''}`}
          autoComplete={field.autoComplete}
        />
      ) : field.type === 'select' ? (
        <select
          id={fieldId}
          name={field.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          required={isRequired}
          className={commonInputClasses}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${field.description ? descriptionId : ''}`}
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={fieldId}
          name={field.name}
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          placeholder={field.placeholder}
          required={isRequired}
          className={commonInputClasses}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${field.description ? descriptionId : ''}`}
          autoComplete={field.autoComplete}
        />
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span id={errorId} role="alert">
            {error}
          </span>
        </motion.div>
      )}
    </div>
  );
}

export default AccessibleForm;
