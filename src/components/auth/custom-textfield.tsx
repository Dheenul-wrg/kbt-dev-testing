import React from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function TextField({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  label,
  ...props
}: TextFieldProps) {
  return (
    <>
      {label && (
        <label  className="sr-only">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-[40px] rounded-[3px] border border-kbt-textfield-border 
                    px-3 py-2 text-sm text-kbt-hint-text ${className}`}
        {...props}
      />
    </>
  );
}
