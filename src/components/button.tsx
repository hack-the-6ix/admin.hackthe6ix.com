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
    primary: 'text-white bg-primary hover:bg-primary-dark',
    secondary: 'text-black bg-slate-100 hover:bg-slate-300',
  };

  return (
    <button
      {...props}
      onClick={onClick}
      disabled={disabled}
      className={`font-bold px-5 rounded-lg inline-flex items-center ${className} ${buttonStyles[buttonType]}`}
    >
      {children}
    </button>
  );
};

export default Button;
