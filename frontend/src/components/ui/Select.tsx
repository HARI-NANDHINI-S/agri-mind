import React, { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-neutral-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`px-3 py-2 border rounded-lg text-sm bg-white transition-colors duration-200 outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-neutral-300"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
