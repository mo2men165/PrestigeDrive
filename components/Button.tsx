import { ReactNode, MouseEvent } from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = ({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out cursor-pointer';

  const variantStyles =
    variant === 'primary'
      ? 'bg-primary text-white hover:bg-primary/90 border border-transparent'
      : 'border-2 border-primary text-primary hover:bg-primary hover:text-white';

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick as (event: MouseEvent<HTMLAnchorElement>) => void}
        className={`${baseStyles} ${variantStyles} ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick as (event: MouseEvent<HTMLButtonElement>) => void}
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
