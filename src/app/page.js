"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import AppSlider from '../components/AppSlider';
import { Flame, Zap, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [apps, setApps] = useState([]);
  const [slides, setSlides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false });
      const { data: s } = await supabase.from('featured_slides').select('*');
      if (a) setApps(a);
      if (s) setSlides(s);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = apps.filter(app => app.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const trending = filtered.filter(a => a.category === 'App').slice(0, 8);
  const gaming = filtered.filter(a => a.category === 'Game').slice(0, 8);

  return (
    <div className="min-h-screen dark:bg-[#0a0a0a]">
      <Navbar onSearch={setSearchTerm} />
      
      <main className="pt-16">
        <HeroSlider slides={slides} />

        <div className="max-w-7xl mx-auto px-6 space-y-24 py-20 relative z-10">
          
          {/* SECTION: TRENDING */}
          <section>
            <div className="flex items-center justify-between mb-10 border-l-4 border-orange-500 pl-6">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-orange-500 leading-none">
                <Flame className="animate-pulse" /> Trending Now
              </h2>
              <Link href="/apps/all" className="text-[10px] font-bold uppercase text-gray-500 hover:text-orange-500 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-full transition-all">Show More</Link>
            </div>
            <AppSlider apps={trending} loading={loading} />
          </section>

          {/* SECTION: LATEST */}
          <section>
            <div className="flex items-center justify-between mb-10 border-l-4 border-[#2ea64d] pl-6 leading-none">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-[#2ea64d]">
                <Zap /> Latest Sync
              </h2>
            </div>
            <AppSlider apps={filtered.slice(0, 8)} loading={loading} />
          </section>

          {/* SECTION: GAMING */}
          <section>
            <div className="flex items-center justify-between mb-10 border-l-4 border-blue-500 pl-6 leading-none">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-blue-500">
                <Trophy /> Pro Gaming
              </h2>
              <Link href="/apps/all" className="text-[10px] font-bold uppercase text-gray-500 hover:text-blue-500 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-full transition-all">Show More</Link>
            </div>
            <AppSlider apps={gaming} loading={loading} />
          </section>

        </div>
      </main>
    </div>
  );
}