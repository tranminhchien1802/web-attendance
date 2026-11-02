import type { InputHTMLAttributes } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function AuthField({ label, id, name, className = "", ...props }: AuthFieldProps) {
  const inputId = id ?? name;

  return (
    <div className="auth-field">
      <input
        id={inputId}
        name={name}
        placeholder=" "
        className={`h-14 w-full rounded-[4px] border border-[#c5cdd6] bg-white px-3.5 pt-4 text-[15px] text-[#1f2a37] outline-none transition focus:border-[#00558d] focus:ring-1 focus:ring-[#00558d] ${className}`}
        {...props}
      />
      <label htmlFor={inputId} className="auth-field-label">
        {label}
      </label>
    </div>
  );
}
