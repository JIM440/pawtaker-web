'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type AppButtonVariant = 'primary' | 'secondary' | 'outlined';
type AppButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<AppButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary/90 shadow-lg shadow-primary/20',
  secondary:
    'bg-surface-container text-on-surface hover:bg-surface-container-high',
  outlined:
    'border border-outline/40 bg-transparent text-on-surface hover:bg-surface-container-low',
};

const sizeClasses: Record<AppButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function AppButton({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  ...props
}: AppButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 cursor-pointer rounded-full font-semibold transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        fullWidth ? 'w-full' : '',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}
