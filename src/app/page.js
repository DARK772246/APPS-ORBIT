"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import AppSlider from '../components/AppSlider';
import { motion } from 'framer-motion';
import { 
  Flame, Zap, Trophy, PenTool, ImageIcon, 
  ShieldCheck, Star, Activity, BellRing 
} from 'lucide-react';

export default function Home() {
  const [apps, setApps] = useState([]);
  const [slides, setSlides] = useState([]);
  const [articles, setArticles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false });
      const { data: s } = await supabase.from('featured_slides').select('*');
      const { data: art } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(6);
      const { data: req } = await supabase.from('requests').select('*').order('created_at', { ascending: false }).limit(6);
      
      if (a) setApps(a);
      if (s) setSlides(s);
      if (art) setArticles(art);
      if (req) setRequests(req);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Search Logic
  const filtered = apps.filter(app => 
    app.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dynamic Section Filtering
  const trending = filtered.filter(a => (a.category === 'App' || a.category === 'Programs')).slice(0, 8);
  const gaming = filtered.filter(a => a.category === 'Game').slice(0, 8);
  const latestSync = filtered.slice(0, 8);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-500 font-sans">
      
      {/* 1. NAVBAR (Search is now connected) */}
      <Navbar onSearch={setSearchTerm} />
      
      <main className="pt-16">
        {/* 2. DYNAMIC HERO SLIDER */}
        <HeroSlider slides={slides} />

        <div className="max-w-7xl mx-auto px-6 space-y-24 py-20 relative z-10">
          
          {/* SECTION: TRENDING NOW (Apps Only) */}
          <section id="apps">
            <div className="flex items-center justify-between mb-10 border-l-4 border-orange-500 pl-6">
              <div>
                <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-orange-500 leading-none">
                  <Flame className="animate-pulse" /> Trending <span className="text-orange-500">Now</span>
                </h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Most downloaded programs this week</p>
              </div>
              <Link href="/apps/all">
                <button className="text-[10px] font-black uppercase text-orange-500 border border-orange-500/20 px-6 py-2.5 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95 italic tracking-widest">
                  Show All Orbit
                </button>
              </Link>
            </div>
            <AppSlider apps={trending} loading={loading} />
          </section>

          {/* SECTION: LATEST UPDATES (Everything) */}
          <section>
            <div className="flex items-center justify-between mb-10 border-l-4 border-[#2ea64d] pl-6">
              <div>
                <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-[#2ea64d] leading-none">
                  <Zap /> Latest <span className="text-[#2ea64d]">Orbit Sync</span>
                </h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Directly added from Salman's server</p>
              </div>
            </div>
            <AppSlider apps={latestSync} loading={loading} />
          </section>

          {/* SECTION: PRO GAMING (Games Only) */}
          <section id="games">
            <div className="flex items-center justify-between mb-10 border-l-4 border-blue-500 pl-6">
              <div>
                <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-blue-500 leading-none">
                  <Trophy /> Pro <span className="text-blue-500">Gaming</span>
                </h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">High-performance gaming modifications</p>
              </div>
              <Link href="/apps/all">
                <button className="text-[10px] font-black uppercase text-blue-500 border border-blue-500/20 px-6 py-2.5 rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95 italic tracking-widest">
                  View All Games
                </button>
              </Link>
            </div>
            <AppSlider apps={gaming} loading={loading} />
          </section>

          {/* COMMUNITY REQUEST TRACKER */}
          <section className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm">
             <h2 className="text-xl font-black uppercase italic tracking-tighter mb-10 border-l-4 border-blue-500 pl-4 dark:text-white leading-none">Community Request Tracker</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {requests.map((r, i) => (
                  <div key={i} className="p-6 bg-gray-50 dark:bg-black/30 rounded-3xl border border-gray-100 dark:border-white/5 flex justify-between items-center transition-all hover:bg-white dark:hover:bg-black/50 shadow-sm group">
                     <div>
                        <p className="text-[12px] font-black uppercase dark:text-white truncate max-w-[150px] italic tracking-tight">{r.app_name}</p>
                        <p className="text-[9px] text-gray-400 uppercase font-bold mt-1 tracking-widest italic">By: {r.user_name}</p>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${r.status === 'Added ✅' ? 'bg-[#2ea64d]/10 text-[#2ea64d]' : 'bg-blue-500/10 text-blue-500'}`}>
                          {r.status || 'Searching'}
                        </span>
                        <div className={`w-2 h-2 rounded-full mt-2 ${r.status === 'Added ✅' ? 'bg-[#2ea64d]' : 'bg-blue-500 animate-pulse'}`} />
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* BLOG SECTION (6 ARTICLES GRID) */}
          <section>
            <div className="flex justify-between items-center mb-12 border-l-4 border-orange-500 pl-4">
               <div>
                 <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter dark:text-white text-gray-800 leading-none">Orbit Tech Insights</h2>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Learn, Optimize & Scale</p>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {articles.map(art => (
                <Link key={art.id} href={`/blog/${art.slug}`} className="group bg-white dark:bg-[#111] p-4 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all flex flex-col">
                  <div className="w-full aspect-video rounded-3xl overflow-hidden mb-6 relative bg-gray-100 dark:bg-black/20 border dark:border-white/5 flex items-center justify-center">
                    {art.image_url ? (
                      <img src={art.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={art.title} loading="lazy" />
                    ) : (
                      <ImageIcon className="opacity-10 text-gray-400" size={40} />
                    )}
                    <div className="absolute bottom-4 left-4 bg-orange-500 text-white text-[8px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest italic">Read Insight</div>
                  </div>
                  <div className="px-2 pb-2">
                    <p className="text-[9px] font-black text-orange-500 uppercase mb-2 flex items-center gap-1"><PenTool size={10}/> {art.author}</p>
                    <h3 className="text-[17px] font-black leading-tight uppercase group-hover:text-[#2ea64d] transition-colors line-clamp-2 italic dark:text-white text-gray-800 tracking-tighter">{art.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic line-clamp-2 leading-relaxed font-serif">"{art.content.substring(0, 120)}..."</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ & SECURITY MISSION */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 border-t border-gray-200 dark:border-white/5 pt-20">
              <div className="space-y-6">
                <h3 className="text-2xl font-black uppercase italic text-[#2ea64d] tracking-widest italic leading-none mb-10">Verified Intelligence FAQ</h3>
                {[ 
                  {q: "Is Salman AppOrbit safe for Android?", a: "Every pro utility on our platform is manually verified and scanned through physical devices by Salman Khan to ensure zero-threat security."}, 
                  {q: "How do I get the latest pro updates?", a: "Stay tuned to our 'Latest Orbit Sync' section on the home screen for direct access to new optimized versions."} 
                ].map((f,i)=>(
                  <div key={i} className="p-8 bg-gray-50 dark:bg-[#111] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                    <h4 className="font-black text-sm text-[#2ea64d] uppercase italic tracking-tighter mb-2">Q: {f.q}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic font-medium">"{f.a}"</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#2ea64d]/5 p-12 rounded-[4rem] border border-[#2ea64d]/10 text-center flex flex-col justify-center shadow-inner relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ea64d]/5 blur-3xl rounded-full"></div>
                <ShieldCheck className="mx-auto mb-6 text-[#2ea64d]" size={60}/>
                <h3 className="font-black uppercase italic mb-4 text-3xl tracking-tighter dark:text-white text-gray-800">Verified Security</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-loose uppercase font-bold tracking-[0.2em] italic">Providing Pakistan with a secure ecosystem for premium Android software. Your digital safety is our priority. Verified by Salman Khan.</p>
              </div>
          </section>

        </div>
      </main>
    </div>
  );
}