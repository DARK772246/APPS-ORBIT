"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import Navbar from '../../../components/Navbar';
import AppCard from '../../../components/AppCard';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

export default function AllAppsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

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

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-500 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4 border-l-4 border-[#2ea64d] pl-6">
           <div>
             <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none dark:text-white">Orbit <span className="text-[#2ea64d]">Catalog</span></h1>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 italic">Total programs: {totalCount}</p>
           </div>
           <div className="bg-gray-100 dark:bg-white/5 p-3 rounded-2xl flex items-center gap-2">
              <LayoutGrid size={18} className="text-[#2ea64d]"/>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Full Access Mode</span>
           </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
             {[...Array(10)].map((_, i) => (
               <div key={i} className="aspect-[4/5] bg-gray-200 dark:bg-white/5 rounded-[2.5rem] animate-pulse" />
             ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {apps.map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-6 pb-10">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-4 bg-gray-100 dark:bg-white/5 rounded-2xl disabled:opacity-20 hover:text-[#2ea64d] transition-all dark:text-white"
                >
                  <ChevronLeft size={24}/>
                </button>
                <span className="text-sm font-black uppercase tracking-widest italic text-gray-500">
                  Page <span className="text-[#2ea64d]">{page}</span> of {totalPages}
                </span>
                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-4 bg-gray-100 dark:bg-white/5 rounded-2xl disabled:opacity-20 hover:text-[#2ea64d] transition-all dark:text-white"
                >
                  <ChevronRight size={24}/>
                </button>
              </div>
            )}
          </>
        )}
      </main>
      {/* NO FOOTER HERE ANYMORE */}
    </div>
  );
}