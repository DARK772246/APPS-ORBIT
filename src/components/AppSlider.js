"use client";
import { motion } from 'framer-motion';
import AppCard from './AppCard';

export default function AppSlider({ apps, loading }) {
  if (loading) {
    return (
      <div className="flex gap-6 overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="min-w-[200px] h-[250px] bg-gray-100 dark:bg-white/5 rounded-[2.5rem] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      drag="x" 
      dragConstraints={{ left: -1000, right: 0 }}
      className="flex gap-6 cursor-grab active:cursor-grabbing pb-4 no-scrollbar overflow-x-auto"
    >
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </motion.div>
  );
}