// components/Button.tsx
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'gold';
  className?: string;
}

const Button = ({ children, href, variant = 'primary', className }: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-lg text-center transition-all duration-300 ease-in-out';
  
  const variantStyles =
    variant === 'primary'
      ? 'bg-purple-950 text-white hover:bg-white hover:text-purple-950 hover:border-purple-950 border border-transparent'
      : variant === 'secondary'
      ? 'bg-white text-purple-950 border border-purple-950 hover:bg-purple-950 hover:text-white hover:border-transparent'
      : variant === 'gold'
      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
      : 'bg-gray-600 text-white hover:bg-gray-700';

  return (
    <a href={href} className={`${baseStyles} ${variantStyles} ${className} hover:no-underline`}>
      {children}
    </a>
  );
};

export default Button;