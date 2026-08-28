import React, { ReactNode } from 'react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  children,
  className = '',
  onClick
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-medium gap-1.5'
  };

  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-[#EAE8E1] text-[#4A4A4A] border border-[#DDD9CE]',
    primary: 'bg-[#6C5CE7]/10 text-[#6C5CE7] border border-[#6C5CE7]/20',
    secondary: 'bg-[#A78BFA]/15 text-[#5D46BE] border border-[#A78BFA]/30',
    accent: 'bg-[#F59EBD]/20 text-[#BE185D] border border-[#F59EBD]/40',
    success: 'bg-[#22C55E]/10 text-[#15803D] border border-[#22C55E]/20',
    warning: 'bg-[#F59E0B]/10 text-[#B45309] border border-[#F59E0B]/25',
    danger: 'bg-[#EF4444]/10 text-[#B91C1C] border border-[#EF4444]/20',
    outline: 'bg-transparent text-[#737373] border border-[#DDD9CE]'
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full tracking-normal whitespace-nowrap select-none transition-colors ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
