// ── useForm ────────────────────────────────────────────
// Generic form state manager. Handles values, errors,
// change events, and submission with validation.
//
// Parameters:
//   initialValues  — object with field keys and default values
//   validate       — (values) => errors object  (use validators.js helpers)
//   onSubmit       — async (values) => void      called only when valid
//
// Returns:
//   values         — current field values
//   errors         — validation error messages keyed by field name
//   submitting     — true while onSubmit promise is in-flight
//   handleChange   — onChange handler for <input> / <select> elements
//   handleSubmit   — onSubmit handler for <form> elements
//   setFieldValue  — (name, value) => void  for controlled programmatic updates
//   reset          — () => void  restores initialValues and clears errors
//
// Usage:
//   const { values, errors, submitting, handleChange, handleSubmit } = useForm({
//     initialValues: { email: '', password: '' },
//     validate: validateLogin,
//     onSubmit: async (values) => { await login(values.email, values.password) },
//   });

import { useState, useCallback } from "react";

export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ── handleChange ──────────────────────────────────────
  // Supports <input>, <select>, and <textarea>.
  // Clears the field's error as soon as the user starts typing.
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const next = type === "checkbox" ? checked : value;

    setValues((prev) => ({ ...prev, [name]: next }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  }, []);

  // ── setFieldValue ─────────────────────────────────────
  // For programmatic updates (e.g. date pickers, custom selects).
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  }, []);

  // ── handleSubmit ──────────────────────────────────────
  // 1. Prevents default form submission
  // 2. Runs validate() — aborts if any errors are returned
  // 3. Calls onSubmit(values) and manages the submitting flag
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Run validation if a validate fn was provided
      if (validate) {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }

      setSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    },
    [values, validate, onSubmit],
  );

  // ── reset ─────────────────────────────────────────────
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    reset,
  };
}
