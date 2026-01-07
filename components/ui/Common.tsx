
import React from 'react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 shadow-lg shadow-primary/20 focus:ring-primary",
    secondary: "bg-secondary text-primary border border-secondary hover:bg-[#d4eee8] focus:ring-primary",
    danger: "bg-danger text-white hover:bg-opacity-90 focus:ring-danger shadow-lg shadow-danger/20",
    ghost: "bg-transparent text-neutralDark hover:bg-black/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 ${className} ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}`}>
    {children}
  </div>
);

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
}
export const Input: React.FC<InputProps> = ({ label, icon, className = '', multiline, ...props }) => {
  const inputStyles = `
    w-full px-4 py-2.5 
    bg-white text-neutralDark 
    placeholder:text-gray-400 
    border border-gray-300 
    rounded-lg 
    focus:ring-2 focus:ring-primary/20 focus:border-primary 
    focus:bg-white
    outline-none 
    transition-all duration-200 
    shadow-sm
    ${icon ? 'pl-11' : ''} 
    ${className}
  `;

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-neutralDark mb-1.5 ml-0.5">{label}</label>}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        {multiline ? (
          <textarea 
            className={inputStyles}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input 
            className={inputStyles}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)} 
          />
        )}
      </div>
    </div>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${className}`}>
    {children}
  </span>
);
