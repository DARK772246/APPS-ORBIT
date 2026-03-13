"use client"
import { useEffect, useState, use } from 'react';
import { supabase } from '../../../supabase';
import Navbar from '../../../components/Navbar';
import AppSlider from '../../../components/AppSlider';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Star, Download, Zap, ArrowLeft, Copy, Send, Trash2 } from 'lucide-react';

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
      try {
        const { data: appData } = await supabase.from('apps').select('*').eq('id', id).single();
        if (appData) {
          setApp(appData);
          document.title = `${appData.title} | Salman AppOrbit`;
          const { data: relData } = await supabase.from('apps').select('*').eq('category', appData.category).neq('id', id).limit(6);
          setRelated(relData || []);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    fetchData();
  }, [id]);

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

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-[#2ea64d] font-black animate-pulse uppercase tracking-[0.5em] italic">Syncing Orbit...</div>;
  if (!app) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black italic">TARGET NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-20">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-32 lg:pt-40">
        <section className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-16 text-center md:text-left">
          <div className="w-44 h-44 md:w-52 md:h-52 glass-panel squircle overflow-hidden border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
            {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-7xl">📱</div>}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 leading-none">{app.title}</h1>
            <p className="text-[#2ea64d] font-black text-xs mb-10 tracking-[0.4em] uppercase italic opacity-80">{app.category} • Verified Sync</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button onClick={() => { setShowDownloadModal(true); setTimer(5); setIsReady(false); }} className="bg-[#2ea64d] text-white font-black px-12 py-5 rounded-2xl uppercase text-[11px] shadow-xl active:scale-95 transition-all flex items-center gap-3 italic tracking-widest">
                <Download size={18} /> Access Link
              </button>
            </div>
          </div>
        </section>

        {/* ... (Mission Overview and Comments skipped for brevity, keep yours) ... */}

      </main>

      <AnimatePresence>
        {showDownloadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-panel p-10 md:p-12 rounded-[4rem] max-w-sm w-full text-center relative border-white/10 shadow-2xl">
              <button onClick={() => setShowDownloadModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-red-500">✕</button>
              <Zap className="mx-auto mb-6 text-[#2ea64d] animate-pulse" size={50} />
              <h3 className="text-xl font-black uppercase mb-2 italic">Generating Link</h3>
              
              <div className="bg-white/5 p-12 rounded-[3.5rem] mb-8 shadow-inner border border-white/5">
                {!isReady ? (
                  <div className="space-y-4">
                    <p className="text-6xl font-black text-[#2ea64d] tracking-tighter">{timer}s</p>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-bounce italic">Scanning Data...</p>
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="animate-in fade-in zoom-in">
                    <ShieldCheck className="mx-auto mb-6 text-blue-500" size={40} />
                    {/* HARD TRIGGER: standard <a> tag with direct download policy */}
                    <a 
                      href={app.download_url} 
                      target="_self" 
                      rel="noreferrer" 
                      referrerPolicy="no-referrer"
                      download
                      className="block w-full bg-[#2ea64d] hover:bg-[#268a40] text-white font-black py-4 rounded-xl uppercase text-[12px] shadow-2xl shadow-green-500/40 active:scale-95 transition-all text-center italic tracking-widest"
                    >
                      Download APK Now
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}