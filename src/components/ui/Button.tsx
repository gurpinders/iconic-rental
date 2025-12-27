import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline';
}

export default function Button({ 
  children, 
  variant = 'primary',
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "px-6 py-3 font-semibold tracking-wide transition-all duration-300 rounded-xl cursor-pointer";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    outline: "border-2 border-white text-white hover:bg-white hover:text-black"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}