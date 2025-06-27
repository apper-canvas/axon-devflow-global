import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No items found",
  description = "Get started by creating your first item",
  icon = "Package",
  actionLabel = "Create New",
  onAction,
  showAction = true,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center min-h-[400px] p-6 ${className}`}
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
            <ApperIcon 
              name={icon} 
              size={40} 
              className="text-slate-400"
            />
          </div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold text-slate-800 mb-2"
        >
          {title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 mb-8"
        >
          {description}
        </motion.p>

        {showAction && onAction && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="primary"
              onClick={onAction}
              icon="Plus"
              size="lg"
              className="shadow-lg hover:shadow-xl"
            >
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;