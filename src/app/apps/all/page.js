"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import Navbar from '../../../components/Navbar';
import AppCard from '../../../components/AppCard';
import { ChevronLeft, ChevronRight, LayoutGrid, Loader2, Sparkles } from 'lucide-react';

export default function AllAppsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 24; 

  useEffect(() => {
    fetchData();
  }, [page]);

  async function fetchData() {
    setLoading(true);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      const { data, count } = await supabase
        .from('apps').select('*', { count: 'exact' })
        .order('created_at', { ascending: false }).range(from, to);

      if (data) setApps(data);
      if (count) setTotalCount(count);
    } catch (err) { console.error(err); }
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const filtered = apps.filter(app => app.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-32">
      <Navbar onSearch={setSearchTerm} />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 lg:pt-40">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-l-4 border-[#2ea64d] pl-6">
           <div>
             <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Orbit <span className="text-[#2ea64d]">Catalog</span></h1>
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2 italic flex items-center gap-2">
               <Sparkles size={12} className="text-[#2ea64d]"/> Total indexed programs: {totalCount}
             </p>
           </div>
           <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 border-white/10">
              <LayoutGrid size={16} className="text-[#2ea64d]"/>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Archive Mode Active</span>
           </div>
        </div>

        {/* TOP AD SLOT */}
        <div className="mb-12 glass-panel p-4 rounded-[2rem] border-dashed border-white/10 overflow-hidden">
            <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-6036065566084740" data-ad-slot="2723298738" data-ad-format="auto" data-full-width-responsive="true" />
            <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
        </div>

        {loading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-[#2ea64d]" size={40} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {filtered.map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-8">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-5 glass-panel rounded-2xl disabled:opacity-10 hover:border-[#2ea64d] transition-all"
                >
                  <ChevronLeft size={24}/>
                </button>
                
                <span className="text-xs font-black uppercase tracking-[0.3em] italic text-gray-500">
                  Sector <span className="text-[#2ea64d]">{page}</span> / {totalPages}
                </span>

                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-5 glass-panel rounded-2xl disabled:opacity-10 hover:border-[#2ea64d] transition-all"
                >
                  <ChevronRight size={24}/>
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}