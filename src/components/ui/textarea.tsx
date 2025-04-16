import React from 'react';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={`border rounded-md p-2 ${className}`}
    {...props}
  />
));
Textarea.displayName = 'Textarea';