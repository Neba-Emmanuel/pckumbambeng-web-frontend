
import React, { memo } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = memo(({ children, className = '', onClick }) => {
  const cardClasses = `bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
    onClick ? 'cursor-pointer' : ''
  } ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
