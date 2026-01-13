"use client";
import { useState, useEffect } from 'react';
import { DownloadCloud, X } from 'lucide-react';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[95%] max-w-lg animate-in slide-in-from-bottom-10">
      <div className="bg-[#2ea64d] p-4 rounded-3xl shadow-[0_20px_50px_rgba(46,166,77,0.4)] flex items-center justify-between border border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
            <DownloadCloud size={24} />
          </div>
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-tighter">Get AppOrbit Mobile</h4>
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Install for faster access</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-[#2ea64d] px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase shadow-xl active:scale-95 transition-all">Install</button>
          <button onClick={() => setShow(false)} className="text-white/50 hover:text-white p-1"><X size={20}/></button>
        </div>
      </div>
    </div>
  );
}