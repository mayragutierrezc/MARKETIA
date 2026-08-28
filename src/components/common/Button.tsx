import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-4 py-2 gap-1.5 font-medium',
    md: 'text-sm px-6 py-2.5 gap-2 font-medium',
    lg: 'text-base px-8 py-3.5 gap-2.5 font-semibold shadow-md',
    icon: 'p-2.5 w-10 h-10 rounded-full'
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white shadow-lg shadow-[#6C5CE7]/25 hover:opacity-95 active:scale-95 focus:ring-[#6C5CE7]/40',
    secondary:
      'bg-[#F59EBD]/15 hover:bg-[#F59EBD]/25 text-[#BE185D] border border-[#F59EBD]/30 active:scale-95 focus:ring-[#F59EBD]/40',
    outline:
      'border border-[#E5E5E1] bg-white hover:bg-gray-50 text-[#171717] hover:border-[#D0D0CA] active:scale-95 focus:ring-[#6C5CE7]/20 shadow-xs',
    ghost:
      'text-[#737373] hover:text-[#171717] hover:bg-black/5 active:scale-95 focus:ring-black/10',
    soft:
      'bg-[#F8F7F4] text-[#171717] hover:bg-[#EFECE6] border border-[#E5E5E1] active:scale-95 focus:ring-[#6C5CE7]/30',
    danger:
      'bg-[#EF4444] hover:bg-[#DC2626] text-white active:scale-95 focus:ring-[#EF4444]/40 shadow-sm',
    accent:
      'bg-[#F59EBD] hover:bg-[#F381A8] text-[#171717] font-semibold active:scale-95 focus:ring-[#F59EBD]/50 shadow-sm'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
