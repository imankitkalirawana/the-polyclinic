'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function BlurIn({ children }: { children: React.ReactNode }) {
  const variants1 = {
    hidden: { filter: 'blur(10px)', opacity: 0 },
    visible: { filter: 'blur(0px)', opacity: 1 },
  };
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      transition={{ duration: 1 }}
      variants={variants1}
      className="font-display drop-shadow-xs md:leading-20 text-center text-4xl font-bold tracking-[-0.02em] md:text-7xl"
    >
      {children}
    </motion.h1>
  );
}
