import React from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function TextField({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  ...props
}: TextFieldProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-[40px] rounded-[3px] border border-kbt-textfield-border 
                  px-3 py-2 text-[10px] text-kbt-hint-text ${className}`}
      {...props}
    />
  );
}
