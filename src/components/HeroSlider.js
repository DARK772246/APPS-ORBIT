"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadCloud, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HeroSlider({ slides }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return (
    <div className="h-[400px] bg-gray-900 animate-pulse flex items-center justify-center">
      <p className="text-gray-500 font-black uppercase tracking-widest italic text-xs">Orbiting Featured Assets...</p>
    </div>
  );

  const activeSlide = slides[current];

  return (
    <div className="relative h-[450px] md:h-[550px] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Fix: Render image only if URL is not empty */}
          <div className="absolute inset-0 z-0">
            {activeSlide.image_url ? (
              <img src={activeSlide.image_url} className="w-full h-full object-cover opacity-60" alt="" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-10 flex flex-col justify-center z-10">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-[#2ea64d]/20 backdrop-blur-md border border-[#2ea64d]/30 p-2 px-4 rounded-full mb-6 inline-flex items-center gap-2 w-fit">
              <Zap size={12} className="text-[#2ea64d] fill-[#2ea64d]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#2ea64d]">Featured Selection</span>
            </motion.div>

            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6">
              {activeSlide.title}
            </motion.h1>

            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="max-w-xl text-gray-400 text-sm md:text-lg mb-10 italic">
              {activeSlide.description}
            </motion.p>

            <Link href={activeSlide.button_link || "#"}>
              <button className="bg-[#2ea64d] hover:bg-[#268a40] text-white font-black px-12 py-5 rounded-2xl uppercase text-[10px] shadow-xl shadow-green-500/20 active:scale-95 transition-all flex items-center gap-2 w-fit italic">
                <DownloadCloud size={16}/> Access Now
              </button>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 right-10 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-1 rounded-full transition-all ${current === i ? 'w-10 bg-[#2ea64d]' : 'w-4 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
}