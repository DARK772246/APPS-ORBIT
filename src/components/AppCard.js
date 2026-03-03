"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function AppCard({ app }) {
  // Skeleton state
  if (!app) return <div className="w-[160px] md:w-[200px] aspect-[4/5] glass-panel rounded-[2rem] animate-pulse" />;

  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className="w-[165px] md:w-[210px] flex-shrink-0 py-4"
    >
      <Link href={`/apps/${app.id}`}>
        <div className="glass-panel rounded-[2.5rem] overflow-hidden group shadow-xl border-white/5 hover:border-[#2ea64d]/30 transition-all duration-500">
          
          {/* Bigger Icon Container */}
          <div className="aspect-square p-3">
            {app.icon_url ? (
              <img 
                src={app.icon_url} 
                className="w-full h-full object-cover squircle shadow-2xl group-hover:rotate-2 transition-transform duration-700" 
                alt={app.title} 
              />
            ) : (
              <div className="w-full h-full bg-white/5 squircle flex items-center justify-center text-4xl">📱</div>
            )}
          </div>
          
          {/* Clean Info Section */}
          <div className="px-5 pb-5">
            <h3 className="text-white font-black text-[13px] uppercase truncate tracking-tight mb-1 group-hover:text-[#2ea64d] transition-colors leading-none">
              {app.title}
            </h3>
            <div className="flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
               <span className="text-[9px] font-black text-[#2ea64d] uppercase tracking-widest">
                 {app.price === "FREE" ? "MOD" : app.price}
               </span>
               <div className="flex items-center gap-1">
                 <Star size={10} className="fill-yellow-400 text-yellow-400" />
                 <span className="text-[10px] font-black text-white/80">4.9</span>
               </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}