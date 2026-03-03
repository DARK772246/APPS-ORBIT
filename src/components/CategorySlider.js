"use client";
import { Gamepad2, Smartphone, LayoutGrid, Zap, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

const cats = [
  { n: 'All Orbit', i: <LayoutGrid size={16} /> },
  { n: 'Gaming', i: <Gamepad2 size={16} /> },
  { n: 'Apps', i: <Smartphone size={16} /> },
  { n: 'Tools', i: <Zap size={16} /> },
  { n: 'Premium', i: <PenTool size={16} /> },
];

export default function CategorySlider() {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar py-6 px-2">
      {cats.map((c) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          key={c.n}
          className="flex items-center gap-2 bg-white/5 border border-white/5 hover:border-[#2ea64d]/50 px-6 py-3 rounded-full shadow-sm transition-all whitespace-nowrap"
        >
          <span className="text-[#2ea64d]">{c.i}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{c.n}</span>
        </motion.button>
      ))}
    </div>
  );
}