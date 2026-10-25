import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  {
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    error = "",
    hint = "",
    required = false,
    disabled = false,
    className = "",
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = props.id || name || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const describedBy =
    [error ? errorId : "", hint ? hintId : "", props["aria-describedby"] || ""]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`block w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
        } ${className}`}
        {...props}
      />

      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
