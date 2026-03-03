"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Flame, Zap, Trophy, PenTool, ArrowUp, LayoutGrid, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import HeroSlider from '../components/HeroSlider'
import AppSlider from '../components/AppSlider'
import CategorySlider from '../components/CategorySlider'

export default function Home() {
  const [apps, setApps] = useState([])
  const [slides, setSlides] = useState([])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
      const { data: s } = await supabase.from('featured_slides').select('*')
      const { data: art } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(6)
      if (a) setApps(a);
      if (s) setSlides(s);
      if (art) setArticles(art);
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const filteredApps = apps.filter(app => app.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const trending = filteredApps.filter(a => a.is_trending === true);
  const gaming = filteredApps.filter(a => a.is_pro_gaming === true);

  return (
    <div className="min-h-screen font-sans pb-32 overflow-hidden">
      <Navbar onSearch={setSearchTerm} />
      
      <main className="pt-24 lg:pt-32">
        {/* 1. HERO SECTION */}
        <div className="px-4">
           <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
              <HeroSlider slides={slides} />
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-10">
          
          {/* 2. QUICK NAVIGATION CHIPS */}
          <CategorySlider />

          {/* 3. TRENDING SECTION */}
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8 border-l-4 border-orange-500 pl-6">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic text-white flex items-center gap-3 tracking-tighter">
                <Flame className="text-orange-500 animate-pulse" /> Trending <span className="text-orange-500">Orbit</span>
              </h2>
              <Link href="/apps/all" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">See All</Link>
            </div>
            <AppSlider apps={trending.length > 0 ? trending : filteredApps.slice(0,8)} loading={loading} />
          </section>

          {/* 4. ADS SLOT 1 (INTEGRATED) */}
          <div className="my-16 px-4">
            <div className="w-full glass-panel min-h-[120px] rounded-[2rem] flex flex-col items-center justify-center p-4 border-dashed border-white/10">
               <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Space Advertisement</span>
               <ins className="adsbygoogle" style={{ display: 'block', width: '100%' }} data-ad-client="ca-pub-6036065566084740" data-ad-slot="7999676146" data-ad-format="auto" data-full-width-responsive="true" />
               <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
            </div>
          </div>

          {/* 5. LATEST SYNC SECTION */}
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8 border-l-4 border-[#2ea64d] pl-6">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic text-white flex items-center gap-3 tracking-tighter">
                <Sparkles className="text-[#2ea64d]" /> Latest <span className="text-[#2ea64d]">Syncs</span>
              </h2>
            </div>
            <AppSlider apps={filteredApps.slice(0, 10)} loading={loading} />
          </section>

          {/* 6. PRO GAMING SECTION (FIXED) */}
          <section className="mt-24">
            <div className="flex items-center justify-between mb-10 border-l-4 border-blue-500 pl-6 leading-none">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic text-white flex items-center gap-3 tracking-tighter">
                <Trophy className="text-blue-500" /> Pro <span className="text-blue-500">Gaming</span>
              </h2>
            </div>
            {gaming.length > 0 ? (
              <AppSlider apps={gaming} loading={loading} />
            ) : (
              <div className="glass-panel p-20 text-center text-gray-500 font-bold uppercase tracking-[0.3em] italic rounded-[3rem] border-white/5">
                Connecting To Game Servers...
              </div>
            )}
          </section>

          {/* 7. TECH BLOG FEED */}
          <section className="mt-32">
            <h2 className="text-2xl font-black uppercase italic mb-12 border-l-4 border-orange-500 pl-6 text-white leading-none tracking-tighter">Help <span className="text-orange-500">& Insights</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map(art => (
                <Link key={art.id} href={`/blog/${art.slug}`} className="glass-panel p-3 flex flex-col group rounded-[2.5rem] hover:border-orange-500/30 transition-all duration-500">
                  <div className="w-full aspect-video rounded-[2rem] overflow-hidden mb-4 relative bg-white/5">
                    {art.image_url && <img src={art.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={art.title} />}
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] font-black text-[#2ea64d] uppercase mb-2">Help Log</p>
                    <h3 className="text-[16px] font-black leading-tight uppercase group-hover:text-[#2ea64d] transition-colors line-clamp-2 italic">{art.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* 8. BACK TO TOP SCROLL */}
      <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="fixed bottom-8 right-8 glass-panel p-4 rounded-full text-[#2ea64d] hover:scale-110 transition-all z-50 shadow-2xl border-white/10"><ArrowUp size={20}/></button>
    </div>
  )
}