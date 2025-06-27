import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-slate-100 text-slate-800",
    dev: "bg-blue-100 text-blue-800 border border-blue-200",
    tester: "bg-amber-100 text-amber-800 border border-amber-200",
    pm: "bg-purple-100 text-purple-800 border border-purple-200",
    priority: {
      high: "bg-red-100 text-red-800 border border-red-200",
      medium: "bg-amber-100 text-amber-800 border border-amber-200",
      low: "bg-slate-100 text-slate-600 border border-slate-200",
    },
    status: {
      todo: "bg-slate-100 text-slate-800 border border-slate-200",
      inprogress: "bg-blue-100 text-blue-800 border border-blue-200",
      inreview: "bg-amber-100 text-amber-800 border border-amber-200",
      done: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    },
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const getVariantClass = () => {
    if (typeof variants[variant] === 'string') {
      return variants[variant];
    }
    return variants.default;
  };

  return (
    <span
      className={`${baseClasses} ${getVariantClass()} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;