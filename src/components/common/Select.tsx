import type { SelectHTMLAttributes } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: SelectOption[];
};

export function Select({ id, label, options, className = "", ...props }: SelectProps) {
  return (
    <div className={`c-field ${className}`.trim()}>
      <label className="c-field__label" htmlFor={id}>
        {label}
      </label>
      <select className="c-field__input c-field__input--select" id={id} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
