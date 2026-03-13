"use client"
import { useEffect, useState, use } from 'react';
import { supabase } from '../../../supabase';
import Navbar from '../../../components/Navbar';
import AppSlider from '../../../components/AppSlider';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Star, Download, Zap, ArrowLeft, Copy, Send, Trash2, Clock, Database } from 'lucide-react';
import Link from 'next/link';

// --- COMMENTS COMPONENT ---
function CommentsSection({ appId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchComments(); }, [appId]);
  async function fetchComments() {
    setLoading(true);
    const { data } = await supabase.from('comments').select('*').eq('app_id', appId).eq('approved', true).order('created_at', { ascending: false });
    if (data) setComments(data);
    setLoading(false);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { error } = await supabase.from('comments').insert([{ app_id: appId, user_name: userName || 'Orbit User', comment_text: commentText, rating: rating, approved: false }]);
    if (!error) { setCommentText(''); setMessage('Log Transmitted for Verification'); }
  }
  return (
    <div className="mt-20">
      <h3 className="text-xl font-black uppercase italic mb-8 border-l-4 border-yellow-500 pl-4 text-white">Transmission Logs</h3>
      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-[3rem] border border-white/5 mb-10 shadow-2xl">
        <input type="text" placeholder="Identity Name" className="w-full bg-black/40 p-4 rounded-2xl text-xs mb-4 outline-none border border-white/5 text-white font-bold" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <textarea required rows="3" placeholder="Data log (Experience)..." className="w-full bg-black/40 p-4 rounded-2xl text-xs mb-4 outline-none border border-white/5 text-white italic" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest active:scale-95 transition-all">Transmit Data</button>
        {message && <p className="mt-4 text-center text-[10px] text-[#2ea64d] font-bold uppercase italic">{message}</p>}
      </form>
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="glass-panel p-5 rounded-2xl border border-white/5 italic">
            <span className="font-black text-xs text-white uppercase italic">{c.user_name}</span>
            <p className="text-gray-400 text-sm mt-2">"{c.comment_text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN DETAIL PAGE ---
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
  if (!app) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black italic uppercase">Target Not Found</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-20">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-32 lg:pt-40">
        <section className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-16 text-center md:text-left">
          <div className="w-44 h-44 md:w-52 md:h-52 glass-panel squircle overflow-hidden border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-7xl">📱</div>}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 leading-none">{app.title}</h1>
            <p className="text-[#2ea64d] font-black text-xs mb-10 tracking-[0.4em] uppercase italic opacity-80">{app.category} • Orbit Verified</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button onClick={() => { setShowDownloadModal(true); setTimer(5); setIsReady(false); }} className="bg-[#2ea64d] text-white font-black px-12 py-5 rounded-2xl uppercase text-[11px] shadow-xl active:scale-95 transition-all flex items-center gap-3 italic tracking-widest">
                <Download size={18} /> Access Link
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Copied!"); }} className="glass-panel p-5 rounded-2xl border-white/5 hover:text-[#2ea64d] transition-all"><Copy size={20}/></button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
           {[ { l: 'Rating', v: '4.9 ⭐' }, { l: 'Size', v: app.size || '75MB' }, { l: 'Version', v: app.version }, { l: 'Status', v: 'Working' } ].map((s, i) => (
             <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center shadow-sm italic transition-all hover:bg-white/10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.l}</p>
                <p className="text-lg font-black text-white italic">{s.v}</p>
             </div>
           ))}
        </div>

        <div className="max-w-4xl mx-auto bg-white/5 p-10 rounded-[3rem] border border-white/5 shadow-inner mb-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h3 className="text-xl font-black uppercase italic mb-6 border-l-4 border-blue-500 pl-4 text-blue-500 tracking-tighter">Mission Overview</h3>
            <p className="text-gray-400 leading-relaxed font-medium italic text-lg whitespace-pre-wrap leading-tight">"{app.description}"</p>
        </div>

        <CommentsSection appId={app.id} />

        <section className="mt-32">
          <h2 className="text-2xl font-black uppercase italic mb-10 border-l-4 border-orange-500 pl-6 text-white leading-none tracking-tighter">Similar <span className="text-orange-500">Inventory</span></h2>
          <AppSlider apps={related} loading={false} />
        </section>
      </main>

      <AnimatePresence>
        {showDownloadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-panel p-10 md:p-12 rounded-[4rem] max-w-sm w-full text-center relative border border-white/10 shadow-2xl">
              <button onClick={() => setShowDownloadModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-red-500">✕</button>
              <Zap className="mx-auto mb-6 text-[#2ea64d] animate-pulse" size={50} />
              <h3 className="text-xl font-black uppercase mb-2 italic tracking-tight">Generating Link</h3>
              
              <div className="bg-white/5 p-12 rounded-[3.5rem] mb-8 shadow-inner border border-white/5">
                {!isReady ? (
                  <div className="space-y-4">
                    <p className="text-6xl font-black text-[#2ea64d] tracking-tighter">{timer}s</p>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-bounce italic">Scanning Data...</p>
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="animate-in fade-in zoom-in">
                    <ShieldCheck className="mx-auto mb-6 text-blue-500" size={40} />
                    {/* CRITICAL FIXED DOWNLOAD LINK */}
                    <button 
                      onClick={() => window.open(app.download_url, '_self')}
                      className="w-full bg-[#2ea64d] hover:bg-[#268a40] text-white font-black py-5 rounded-2xl uppercase text-[12px] shadow-2xl shadow-green-500/40 active:scale-95 transition-all text-center italic tracking-widest"
                    >
                      Download APK Now
                    </button>
                  </motion.div>
                )}
              </div>
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest italic text-center">Orbit Control Verified Files</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}