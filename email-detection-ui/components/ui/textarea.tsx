// src/components/ui/textarea.tsx
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
}

const Textarea: React.FC<TextareaProps> = ({ placeholder, className, ...props }) => {
  return (
    <textarea
      placeholder={placeholder}
      className={`border border-gray-300 rounded p-2 resize-none ${className}`}
      {...props}
    />
  );
};

export default Textarea;
