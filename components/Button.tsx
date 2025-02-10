import { ReactNode, MouseEvent } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string; // Optional href for link buttons
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void; // Optional onClick handler
  variant?: 'primary' | 'secondary' | 'gold'; // Button variant
  className?: string; // Optional custom class names
  type?: 'button' | 'submit' | 'reset'; // Optional button type (only for button elements)
}

const Button = ({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
}: ButtonProps) => {
  const baseStyles =
    'px-4 py-2 rounded-lg text-center transition-all duration-300 ease-in-out hover:no-underline';

  const variantStyles =
    variant === 'primary'
      ? 'bg-primary text-white hover:bg-white hover:text-primary hover:border-primary border border-transparent'
      : variant === 'secondary'
      ? 'bg-white text-primary border border-primary hover:bg-primary hover:text-white hover:border-transparent'
      : variant === 'gold'
      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
      : 'bg-gray-600 text-white hover:bg-gray-700';

  // If href is provided, render an anchor tag
  if (href) {
    return (
      <a
        href={href}
        onClick={onClick as (event: MouseEvent<HTMLAnchorElement>) => void}
        className={`${baseStyles} ${variantStyles} ${className}`}
      >
        {children}
      </a>
    );
  }

  // Otherwise, render a button
  return (
    <button
      type={type}
      onClick={onClick as (event: MouseEvent<HTMLButtonElement>) => void}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;