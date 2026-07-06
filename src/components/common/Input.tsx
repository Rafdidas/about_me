import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  helpText?: string;
};

export function Input({ id, label, error, helpText, className = "", ...props }: InputProps) {
  const describedBy = error ? `${id}-error` : helpText ? `${id}-help` : undefined;

  return (
    <div className={`c-field ${className}`.trim()}>
      <label className="c-field__label" htmlFor={id}>
        {label}
      </label>
      <input className="c-field__input" id={id} aria-invalid={Boolean(error)} aria-describedby={describedBy} {...props} />
      {helpText ? (
        <p className="c-field__help" id={`${id}-help`}>
          {helpText}
        </p>
      ) : null}
      {error ? (
        <p className="c-field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
