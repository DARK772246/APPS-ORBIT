"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import Navbar from '../../../components/Navbar';
import AppCard from '../../../components/AppCard';
import { ChevronLeft, ChevronRight, LayoutGrid, Loader2 } from 'lucide-react';

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
        .from('apps')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (data) setApps(data);
      if (count) setTotalCount(count);
    } catch (err) { console.error(err); }
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const filtered = apps.filter(app => app.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-500 pb-20 font-sans">
      <Navbar onSearch={setSearchTerm} />
      
      <main className="max-w-7xl mx-auto px-4 pt-24 md:pt-32">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-l-4 border-[#2ea64d] pl-6">
           <div>
             <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter dark:text-white text-gray-800">Orbit <span className="text-[#2ea64d]">Catalog</span></h1>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 italic">Total programs: {totalCount}</p>
           </div>
           <div className="hidden md:flex bg-gray-100 dark:bg-white/5 p-3 rounded-2xl items-center gap-2">
              <LayoutGrid size={18} className="text-[#2ea64d]"/>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Access Mode</span>
           </div>
        </div>

        {/* --- MANUAL AD UNIT: Orbit_All_Apps_Ad (ID: 2723298738) --- */}
        <div className="w-full my-8 flex justify-center overflow-hidden">
             <div className="min-h-[100px] w-full max-w-[728px] bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                 <ins 
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%' }}
                    data-ad-client="ca-pub-6036065566084740" 
                    data-ad-slot="2723298738" 
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  />
                 <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
             </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-[#2ea64d]" size={40} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {filtered.map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-6">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-4 bg-white dark:bg-[#111] rounded-2xl disabled:opacity-20 shadow-sm border dark:border-white/5 transition-all"><ChevronLeft size={20}/></button>
                <span className="text-xs font-black uppercase tracking-widest italic text-gray-500">Page <span className="text-[#2ea64d]">{page}</span> of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-4 bg-white dark:bg-[#111] rounded-2xl disabled:opacity-20 shadow-sm border dark:border-white/5 transition-all"><ChevronRight size={20}/></button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}