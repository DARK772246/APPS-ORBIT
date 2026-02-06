"use client";
import { useEffect, useState, use } from 'react';
import { supabase } from '../../../supabase';
import Navbar from '../../../components/Navbar';
import AppSlider from '../../../components/AppSlider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Star, Smartphone, Download, 
  CheckCircle, Info, Share2, Zap, ArrowLeft, Copy, Send, Trash2
} from 'lucide-react';
import Link from 'next/link';

// --- SEO METADATA REMOVED FROM HERE AS THIS IS A CLIENT COMPONENT ---

// --- NEW COMPONENT: Comments Form & List ---
function CommentsSection({ appId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchComments();
  }, [appId]);

  async function fetchComments() {
    setLoading(true);
    // Fetch only approved comments
    const { data } = await supabase.from('comments').select('*').eq('app_id', appId).eq('approved', true).order('created_at', { ascending: false });
    if (data) setComments(data);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    if (!commentText.trim()) return;

    const finalName = userName.trim() || 'Orbit User';
    
    const { error } = await supabase.from('comments').insert([{
      app_id: appId,
      user_name: finalName,
      comment_text: commentText,
      rating: rating,
      approved: false 
    }]);

    if (!error) {
      setCommentText('');
      setMessage('Review sent! Will be visible after admin approval. Thank you!');
    } else {
      console.error(error);
      setMessage('Error submitting review.');
    }
  }

  const renderStars = (count) => {
    return Array(5).fill(null).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={`transition-colors cursor-pointer ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600 dark:text-gray-700'}`}
        onClick={() => setRating(i + 1)}
      />
    ));
  };
  
  const averageRating = comments.length > 0 ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1) : 4.9;

  return (
    <div className="mt-20">
      <h3 className="text-xl font-black uppercase italic mb-8 border-l-4 border-yellow-500 pl-4 dark:text-white text-gray-800 flex items-center gap-4">
          User Reviews <span className="text-sm italic font-bold text-yellow-500 flex items-center gap-1">{averageRating} <Star size={16} className="fill-yellow-500 text-yellow-500"/></span>
      </h3>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111] p-6 rounded-[2.5rem] border dark:border-white/5 shadow-inner mb-10">
        <h4 className="text-sm font-black uppercase mb-4 text-[#2ea64d]">Drop Your Orbit Review</h4>
        <div className="flex gap-1 mb-4">{renderStars(rating)}</div>
        <input 
          type="text" 
          placeholder="Your Name (Optional)" 
          className="w-full bg-gray-50 dark:bg-black/40 p-3 rounded-xl text-xs mb-3 outline-none border border-gray-100 dark:border-white/5 focus:ring-1 ring-blue-500" 
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <textarea 
          required
          rows="3"
          placeholder="Your review/feedback..." 
          className="w-full bg-gray-50 dark:bg-black/40 p-3 rounded-xl text-xs mb-3 outline-none border border-gray-100 dark:border-white/5 focus:ring-1 ring-blue-500 italic" 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white font-black py-3 rounded-xl uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors">
            <Send size={14}/> Submit Review
        </button>
        {message && <p className={`mt-3 text-center text-xs font-bold ${message.includes('Error') ? 'text-red-500' : 'text-[#2ea64d]'}`}>{message}</p>}
      </form>
      
      <div className="space-y-4">
        {loading && <p className="text-center text-gray-500 italic">Fetching comments...</p>}
        {comments.map((comment) => (
          <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#111] p-5 rounded-[2rem] border dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-[#2ea64d]/10 text-[#2ea64d] rounded-full flex items-center justify-center font-bold text-xs">{comment.user_name[0]}</div>
                 <h5 className="font-bold text-sm uppercase tracking-tighter dark:text-white text-gray-800">{comment.user_name}</h5>
              </div>
              <div className="flex gap-1">{renderStars(comment.rating)}</div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm italic ml-11">{comment.comment_text}</p>
          </motion.div>
        ))}
        {comments.length === 0 && !loading && <p className="text-center text-gray-500 italic py-10">Be the first to review this app!</p>}
      </div>
    </div>
  );
}
// --- END NEW COMPONENT ---


"use client" 
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
  
  // FIX: Interstitial Ad logic removed from here. Only Modal handling.
  const handleDownloadClick = () => {
    setShowDownloadModal(true);
    setTimer(5);
    setIsReady(false);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#2ea64d] animate-pulse font-black uppercase tracking-[0.5em]">Syncing Orbit...</div>;
  if (!app) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold">App Not Found</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-500 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-48 h-48 rounded-[3rem] bg-white dark:bg-[#111] overflow-hidden shadow-2xl border-4 border-white dark:border-[#1a1a1a]">
            {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-7xl">📱</div>}
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 dark:text-white text-gray-800">{app.title}</h1>
            <p className="text-[#2ea64d] font-bold text-sm mb-8 tracking-[0.2em] uppercase">{app.category} • Verified Safe</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
              <button onClick={handleDownloadClick} className="bg-[#2ea64d] hover:bg-[#268a40] text-white font-black px-12 py-5 rounded-2xl uppercase text-[11px] shadow-xl shadow-green-500/20 active:scale-95 transition-all flex items-center gap-3">
                <Download size={18} /> Get Secure Link
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Orbit Link Copied!"); }} className="bg-white dark:bg-white/5 p-5 rounded-2xl hover:text-[#2ea64d] transition-all dark:text-white border border-gray-100 dark:border-white/5 shadow-sm"><Copy size={20}/></button>
            </div>
          </div>
        </section>

        {/* Technical Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
           {[ { l: 'Rating', v: '4.9 ⭐' }, { l: 'Size', v: app.size || 'Varies' }, { l: 'Version', v: app.version }, { l: 'Status', v: 'Working' } ].map((s, i) => (
             <div key={i} className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 text-center shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">{s.l}</p>
                <p className="text-lg font-black dark:text-white text-gray-800">{s.v}</p>
             </div>
           ))}
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto mb-20 bg-white dark:bg-[#111] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-xl font-black uppercase italic mb-6 border-l-4 border-blue-500 pl-4 dark:text-white text-gray-800">Mission Overview</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-serif italic text-lg whitespace-pre-wrap">"{app.description}"</p>
        </div>
        
        {/* COMMENTS SECTION */}
        <CommentsSection appId={app.id} /> 

        {/* Related Apps */}
        <section className="mt-32">
          <h2 className="text-2xl font-black uppercase italic mb-10 border-l-4 border-orange-500 pl-6 dark:text-white text-gray-800 leading-none">Similar in <span className="text-orange-500">Orbit</span></h2>
          <AppSlider apps={related} loading={false} />
        </section>
      </main>

      {/* DOWNLOAD MODAL */}
      <AnimatePresence>
        {showDownloadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-[#111] p-10 rounded-[3rem] max-w-sm w-full text-center relative border border-white/10 shadow-2xl">
              <button onClick={() => { setShowDownloadModal(false); setTimer(5); setIsReady(false); }} className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors">✕</button>
              <Zap className="mx-auto mb-6 text-[#2ea64d] animate-pulse" size={40} />
              <h3 className="text-xl font-black uppercase mb-2 dark:text-white text-gray-800">Generating Link</h3>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-8 italic">Securing Connection...</p>
              
              <div className="bg-gray-100 dark:bg-black/40 p-10 rounded-[2.5rem] mb-8 shadow-inner">
                {!isReady ? (
                  <div className="space-y-4">
                    <p className="text-5xl font-black text-[#2ea64d] tracking-tighter">{timer}s</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Scanning for Viruses...</p>
                  </div>
                ) : (
                  <div className="animate-in zoom-in duration-500">
                    <ShieldCheck className="mx-auto mb-4 text-blue-500" size={32} />
                    {/* FIX: Changed <Link> to <a> tag to directly trigger file download */}
                    <a href={app.download_url} target="_blank" rel="noopener noreferrer" className="block bg-[#2ea64d] hover:bg-[#268a40] text-white font-black py-4 rounded-xl uppercase text-[11px] shadow-lg active:scale-95 transition-all">Download APK Now</a>
                  </div>
                )}
              </div>
              <p className="text-[9px] text-gray-500 dark:text-gray-400">Files are verified by Salman AppOrbit for 100% stability.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
