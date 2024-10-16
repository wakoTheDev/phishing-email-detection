// src/components/ui/card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children }) => {
  return <div className="border-b pb-2 mb-2">{children}</div>;
};

export const CardContent: React.FC<CardProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const CardTitle: React.FC<CardProps> = ({ children }) => {
  return <h2 className="text-xl font-bold">{children}</h2>;
};
