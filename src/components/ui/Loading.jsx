import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'cards', count = 6 }) => {
  const shimmer = {
    initial: { backgroundPosition: '-200px 0' },
    animate: { 
      backgroundPosition: 'calc(200px + 100%) 0',
      transition: {
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity,
      }
    }
  };

  const shimmerClass = `
    bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 
    bg-[length:200px_100%] animate-pulse
  `;

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className={`w-3 h-3 rounded-full ${shimmerClass}`}
                  {...shimmer}
                />
                <motion.div 
                  className={`h-6 w-16 rounded-full ${shimmerClass}`}
                  {...shimmer}
                />
              </div>
              <motion.div 
                className={`h-5 w-12 rounded-full ${shimmerClass}`}
                {...shimmer}
              />
            </div>

            {/* Title */}
            <motion.div 
              className={`h-6 w-3/4 rounded mb-3 ${shimmerClass}`}
              {...shimmer}
            />

            {/* Description */}
            <motion.div 
              className={`h-4 w-full rounded mb-2 ${shimmerClass}`}
              {...shimmer}
            />
            <motion.div 
              className={`h-4 w-2/3 rounded mb-4 ${shimmerClass}`}
              {...shimmer}
            />

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.div 
                  className={`w-8 h-8 rounded-full ${shimmerClass}`}
                  {...shimmer}
                />
                <motion.div 
                  className={`h-4 w-12 rounded ${shimmerClass}`}
                  {...shimmer}
                />
              </div>
              <motion.div 
                className={`h-4 w-16 rounded ${shimmerClass}`}
                {...shimmer}
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'kanban') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['To Do', 'In Progress', 'In Review', 'Done'].map((column, columnIndex) => (
          <div key={column} className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                className={`h-6 w-20 rounded ${shimmerClass}`}
                {...shimmer}
              />
              <motion.div 
                className={`h-6 w-6 rounded ${shimmerClass}`}
                {...shimmer}
              />
            </div>
            <div className="space-y-3">
              {Array.from({ length: Math.floor(Math.random() * 4) + 2 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (columnIndex * 0.1) + (index * 0.05) }}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <motion.div 
                      className={`h-4 w-12 rounded-full ${shimmerClass}`}
                      {...shimmer}
                    />
                    <motion.div 
                      className={`h-4 w-16 rounded-full ${shimmerClass}`}
                      {...shimmer}
                    />
                  </div>
                  <motion.div 
                    className={`h-5 w-full rounded mb-2 ${shimmerClass}`}
                    {...shimmer}
                  />
                  <motion.div 
                    className={`h-4 w-3/4 rounded mb-3 ${shimmerClass}`}
                    {...shimmer}
                  />
                  <div className="flex items-center justify-between">
                    <motion.div 
                      className={`w-6 h-6 rounded-full ${shimmerClass}`}
                      {...shimmer}
                    />
                    <motion.div 
                      className={`h-3 w-12 rounded ${shimmerClass}`}
                      {...shimmer}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <motion.div 
            className={`h-6 w-32 rounded ${shimmerClass}`}
            {...shimmer}
          />
        </div>
        <div className="divide-y divide-slate-200">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 flex items-center space-x-4"
            >
              <motion.div 
                className={`w-10 h-10 rounded-full ${shimmerClass}`}
                {...shimmer}
              />
              <div className="flex-1 space-y-2">
                <motion.div 
                  className={`h-5 w-1/3 rounded ${shimmerClass}`}
                  {...shimmer}
                />
                <motion.div 
                  className={`h-4 w-1/4 rounded ${shimmerClass}`}
                  {...shimmer}
                />
              </div>
              <motion.div 
                className={`h-6 w-16 rounded-full ${shimmerClass}`}
                {...shimmer}
              />
              <motion.div 
                className={`h-6 w-20 rounded-full ${shimmerClass}`}
                {...shimmer}
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Default spinner
  return (
    <div className="flex items-center justify-center p-12">
      <motion.div
        className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;