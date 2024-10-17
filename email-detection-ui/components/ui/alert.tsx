// src/components/ui/alert.tsx
import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, className }) => {
  return <div className={`p-4 rounded-lg ${className}`}>{children}</div>;
};

export const AlertTitle: React.FC<AlertProps> = ({ children }) => {
  return <h3 className="font-bold">{children}</h3>;
};

export const AlertDescription: React.FC<AlertProps> = ({ children }) => {
  return <p>{children}</p>;
};
