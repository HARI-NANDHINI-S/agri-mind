import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`px-3 py-2 border rounded-lg text-sm transition-colors duration-200 outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-neutral-300"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
