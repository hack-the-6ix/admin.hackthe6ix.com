import { FC, ReactNode } from 'react';

interface ButtonProps {
  buttonType?: 'primary' | 'secondary';
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  buttonType = 'primary',
  children,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const buttonStyles = {
    primary:
      'text-white bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed',
    secondary:
      'text-black bg-slate-100 hover:bg-slate-300 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:text-black/50',
  };

  return (
    <button
      {...props}
      onClick={onClick}
      disabled={disabled}
      className={`font-bold px-5 rounded-lg inline-flex items-center transition-colors ${className} ${buttonStyles[buttonType]}`}
    >
      {children}
    </button>
  );
};

export default Button;
