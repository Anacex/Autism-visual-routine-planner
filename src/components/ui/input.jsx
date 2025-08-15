import * as React from "react";

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-4 py-3 text-base border border-gray-300 rounded-lg 
      bg-white shadow-sm placeholder-gray-400 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      transition-colors duration-200
      ${className || ""}`}
    {...props}
  />
));

Input.displayName = "Input";
