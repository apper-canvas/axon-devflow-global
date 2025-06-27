import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  showRetry = true,
  icon = "AlertTriangle",
  type = "error"
}) => {
  const getErrorConfig = () => {
    const configs = {
      error: {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-500',
        titleColor: 'text-red-800',
        textColor: 'text-red-700',
        buttonVariant: 'danger',
      },
      warning: {
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        iconColor: 'text-amber-500',
        titleColor: 'text-amber-800',
        textColor: 'text-amber-700',
        buttonVariant: 'secondary',
      },
      info: {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-500',
        titleColor: 'text-blue-800',
        textColor: 'text-blue-700',
        buttonVariant: 'primary',
      },
    };
    return configs[type] || configs.error;
  };

  const config = getErrorConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px] p-6"
    >
      <div className={`
        max-w-md w-full p-8 rounded-xl border-2 text-center
        ${config.bgColor} ${config.borderColor}
      `}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4"
        >
          <div className={`
            w-16 h-16 mx-auto rounded-full flex items-center justify-center
            ${config.bgColor} border-2 ${config.borderColor}
          `}>
            <ApperIcon 
              name={icon} 
              size={32} 
              className={config.iconColor}
            />
          </div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-xl font-bold mb-2 ${config.titleColor}`}
        >
          Oops! Something went wrong
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mb-6 ${config.textColor}`}
        >
          {message}
        </motion.p>

        {showRetry && onRetry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant={config.buttonVariant}
              onClick={onRetry}
              icon="RefreshCw"
              className="mb-3"
            >
              Try Again
            </Button>
            <p className="text-sm text-slate-500">
              Or refresh the page if the problem persists
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Error;