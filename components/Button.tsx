// components/Button.tsx
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'gold';
}

const Button = ({ children, href, variant = 'primary' }: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-lg text-white text-center';
  const variantStyles =
    variant === 'primary'
      ? 'bg-blue-600 hover:bg-blue-700' 
      : variant === 'gold' 
      ? 'bg-yellow-500 hover:bg-yellow-600'
      : 'bg-gray-600 hover:bg-gray-700';

  return (
    <a href={href} className={`${baseStyles} ${variantStyles} hover:no-underline `}>
      {children}
    </a>
  );
};

export default Button;
