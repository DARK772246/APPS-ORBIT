"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Download } from 'lucide-react';

export default function AppCard({ app }) {
  
  // 1. SKELETON LOADING STATE ADDED
  if (!app) {
    return (
      <div className="w-[170px] md:w-[220px] flex-shrink-0 animate-pulse">
        <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-900 border border-white/10 shadow-lg relative">
           <div className="w-full h-full bg-gray-800 flex items-center justify-center text-4xl text-gray-700">
             ⏳
           </div>
           <div className="absolute inset-x-0 bottom-0 p-5">
             <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
             <div className="flex justify-between">
                <div className="h-2 w-1/4 bg-gray-700 rounded"></div>
                <div className="h-2 w-1/5 bg-gray-700 rounded"></div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // 2. NORMAL CARD RENDER (No Change)
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="w-[170px] md:w-[220px] flex-shrink-0"
    >
      <Link href={`/apps/${app.id}`}>
        <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-lg relative group">
          
          {/* App Icon / Poster */}
          {app.icon_url ? (
            <img 
              src={app.icon_url} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt={app.title} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-100 dark:bg-black/20">📱</div>
          )}
          
          {/* Premium Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#2ea64d] text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-widest">
              {app.is_free ? 'Free' : 'Pro'}
            </span>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 flex flex-col justify-end">
            <h3 className="text-white font-bold text-sm truncate uppercase leading-tight mb-1">{app.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-[#2ea64d] text-[#2ea64d]" />
                <span className="text-[10px] font-bold text-white/80">4.9</span>
              </div>
              <span className="text-[10px] font-black text-[#2ea64d] tracking-tighter">{app.price === "FREE" ? "MOD" : app.price}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}