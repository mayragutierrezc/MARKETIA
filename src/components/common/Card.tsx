import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  id
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-[32px] border border-[#E5E5E1] shadow-xs p-6 md:p-8 transition-all duration-200 ${
        hoverable ? 'hover:border-[#D0D0CA] hover:shadow-md cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  badge?: ReactNode;
  icon?: ReactNode;
  className?: string;
}> = ({ title, subtitle, action, badge, icon, className = '' }) => {
  return (
    <div className={`flex items-start justify-between gap-3 mb-4 ${className}`}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="p-2 rounded-xl bg-[#6C5CE7]/8 text-[#6C5CE7] shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base md:text-lg font-bold text-[#171717] tracking-tight truncate">
              {title}
            </h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs md:text-sm text-[#737373] mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
