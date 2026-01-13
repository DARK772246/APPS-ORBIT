"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Download } from 'lucide-react';

export default function AppCard({ app }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="min-w-[180px] md:min-w-[220px] group relative"
    >
      <Link href={`/apps/${app.id}`}>
        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-white/5 shadow-xl relative group">
          {/* Image */}
          <img src={app.icon_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" alt="" />
          
          {/* Overlay Info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform">
            <h3 className="text-white font-black uppercase italic tracking-tighter text-lg leading-none mb-2">{app.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-[#2ea64d] text-[#2ea64d]" />
                <span className="text-[10px] font-bold text-white">4.9</span>
              </div>
              <span className="text-[10px] font-black text-[#2ea64d]">{app.price === "FREE" ? "MOD" : app.price}</span>
            </div>
          </div>

          {/* Quick Download Button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 bg-[#2ea64d] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Download size={18} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}