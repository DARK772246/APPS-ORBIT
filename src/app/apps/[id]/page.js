"use client";
import { useEffect, useState, use } from 'react';
import { supabase } from '../../../supabase';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import AppSlider from '../../../components/AppSlider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Star, Smartphone, Scale, 
  Download, CheckCircle, Info, ChevronRight, 
  ArrowLeft, Share2, ShieldAlert, Zap
} from 'lucide-react';
import Link from 'next/link';

export default function AppDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const id = params.id;

  const [app, setApp] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [timer, setTimer] = useState(5);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: appData } = await supabase.from('apps').select('*').eq('id', id).single();
      if (appData) {
        setApp(appData);
        const { data: relData } = await supabase.from('apps').select('*').eq('category', appData.category).neq('id', id).limit(6);
        setRelated(relData || []);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  // Timer Logic for Download
  useEffect(() => {
    let interval;
    if (showDownloadModal && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setIsReady(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showDownloadModal, timer]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#2ea64d] animate-pulse font-black uppercase tracking-[0.5em]">Establishing Connection...</div>;
  if (!app) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold uppercase">Orbit Lost - App Not Found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-500 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32">
        {/* 1. Header Section */}
        <section className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-48 h-48 rounded-[3rem] bg-gray-100 dark:bg-[#111] overflow-hidden shadow-2xl border-4 border-white dark:border-[#1a1a1a]">
            <img src={app.icon_url} className="w-full h-full object-cover" alt="" />
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">{app.title}</h1>
            <p className="text-[#2ea64d] font-bold text-sm mb-8 tracking-[0.2em] uppercase">{app.category} • Official Pro Edition</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
              <button onClick={() => setShowDownloadModal(true)} className="bg-[#2ea64d] hover:bg-[#268a40] text-white font-black px-12 py-5 rounded-2xl uppercase text-[11px] shadow-xl shadow-green-500/20 active:scale-95 transition-all flex items-center gap-3">
                <Download size={18} /> Get Secure Link
              </button>
              <button className="bg-gray-100 dark:bg-white/5 p-5 rounded-2xl hover:text-[#2ea64d] transition-all"><Share2 size={20}/></button>
            </div>
          </div>
        </section>

        {/* 2. Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
           {[
             { label: 'Rating', val: '4.9 ⭐', sub: 'Elite Choice' },
             { label: 'Size', val: app.size || 'Varies', sub: 'Optimized' },
             { label: 'Version', val: app.version, sub: 'Latest' },
             { label: 'Security', val: 'Verified', sub: 'Safe Orbit' },
           ].map((s, i) => (
             <div key={i} className="bg-gray-50 dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-lg font-black dark:text-white text-gray-800">{s.val}</p>
                <p className="text-[8px] font-bold text-[#2ea64d] uppercase mt-1">{s.sub}</p>
             </div>
           ))}
        </div>

        {/* 3. Description & Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-xl font-black uppercase italic mb-6 border-l-4 border-blue-500 pl-4 tracking-widest">About this Program</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-serif italic text-lg whitespace-pre-wrap">"{app.description}"</p>
            </section>

            {/* Screenshots Gallery */}
            {app.screenshots && (
              <section>
                <h3 className="text-xl font-black uppercase italic mb-6">Gallery View</h3>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                  {app.screenshots.map((img, i) => (
                    <img key={i} src={img} className="h-80 md:h-[500px] rounded-[2.5rem] shadow-2xl border border-white/10" alt="" />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* 4. Installation Stepper (Sidebar) */}
          <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
              <h3 className="text-sm font-black uppercase mb-8 tracking-widest text-[#2ea64d]">Installation Guide</h3>
              {[
                { s: '01', t: 'Download File', d: 'Get the latest APK from our secure server.' },
                { s: '02', t: 'Enable Settings', d: 'Enable "Unknown Sources" in your device settings.' },
                { s: '03', t: 'Install & Play', d: 'Open the file and launch into the Orbit.' },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 mb-6 last:mb-0">
                  <span className="text-blue-500 font-black italic">{step.s}</span>
                  <div>
                    <h4 className="font-bold text-[11px] uppercase tracking-widest dark:text-white">{step.t}</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed mt-1">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Ad Placeholder for Sidebar */}
            <div className="h-64 bg-gray-100 dark:bg-white/5 rounded-[2rem] border border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Advertisement Zone
            </div>
          </div>
        </div>

        {/* 5. Related Orbit Section */}
        <section className="mt-32">
          <h2 className="text-2xl font-black uppercase italic mb-10 border-l-4 border-orange-500 pl-6">Similar in <span className="text-orange-500">Orbit</span></h2>
          <AppSlider apps={related} loading={false} />
        </section>
      </main>

      {/* --- DOWNLOAD MODAL (The Engine) --- */}
      <AnimatePresence>
        {showDownloadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-[#111] p-10 rounded-[3rem] max-w-sm w-full text-center relative border border-white/10">
              <button onClick={() => { setShowDownloadModal(false); setTimer(5); setIsReady(false); }} className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors">✕</button>
              <Zap className="mx-auto mb-6 text-[#2ea64d] animate-pulse" size={40} />
              <h3 className="text-xl font-black uppercase mb-2">Preparing Secure Link</h3>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-8 italic italic">Orbiting Salman's Private Cloud</p>
              
              <div className="bg-gray-100 dark:bg-black/40 p-10 rounded-[2.5rem] mb-8 shadow-inner">
                {!isReady ? (
                  <div className="space-y-4">
                    <p className="text-5xl font-black text-[#2ea64d] tracking-tighter">{timer}s</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Establishing Secure Tunnel...</p>
                  </div>
                ) : (
                  <div className="animate-in zoom-in duration-500">
                    <ShieldCheck className="mx-auto mb-4 text-blue-500" size={32} />
                    <p className="text-xs font-black uppercase text-blue-500 tracking-widest mb-6">File Verified & Ready</p>
                    <a href={app.download_url} target="_blank" className="block bg-blue-600 text-white font-black py-4 rounded-xl uppercase text-[11px] shadow-lg active:scale-95 transition-all">Start Download Now</a>
                  </div>
                )}
              </div>
              <p className="text-[9px] text-gray-500 leading-relaxed">By downloading, you agree to our Terms. Salman App Orbit ensures all files are manually tested.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}