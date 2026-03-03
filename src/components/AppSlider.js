"use client";
import { motion } from 'framer-motion';
import AppCard from './AppCard';

export default function AppSlider({ apps, loading }) {
  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden px-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="min-w-[160px] h-[220px] bg-gray-200 dark:bg-white/5 rounded-[2rem] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Scrollable Container with Snap points for Mobile */}
      <div 
        className="flex gap-5 overflow-x-auto pb-8 px-6 no-scrollbar snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {apps.map((app) => (
          <div key={app.id} className="snap-start flex-shrink-0">
            <AppCard app={app} />
          </div>
        ))}
      </div>
    </div>
  );
}