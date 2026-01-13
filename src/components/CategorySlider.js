"use client";
import { Gamepad2, Smartphone, LayoutGrid, Zap, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

const cats = [
  { n: 'All', i: <LayoutGrid size={18} /> },
  { n: 'Gaming', i: <Gamepad2 size={18} /> },
  { n: 'Apps', i: <Smartphone size={18} /> },
  { n: 'Tools', i: <Zap size={18} /> },
  { n: 'Mods', i: <PenTool size={18} /> },
];

export default function CategorySlider() {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar py-4">
      {cats.map((c) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          key={c.n}
          className="flex items-center gap-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 px-8 py-4 rounded-[1.5rem] shadow-sm hover:border-[#2ea64d] transition-all"
        >
          <span className="text-[#2ea64d]">{c.i}</span>
          <span className="text-xs font-black uppercase tracking-widest">{c.n}</span>
        </motion.button>
      ))}
    </div>
  );
}