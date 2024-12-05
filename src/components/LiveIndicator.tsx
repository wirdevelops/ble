'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LiveIndicator() {
  return (
    <Link href="/live" className="relative flex items-center gap-1.5 p-2 rounded-full hover:bg-surface transition-colors">
      <motion.div
        className="h-2 w-2 bg-red-500 rounded-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1
        }}
      />
      <span className="text-xs font-medium text-text/60 hover:text-text transition-colors">Live</span>
    </Link>
  );
}
