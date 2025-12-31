"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../supabase'
import Link from 'next/link'
import { ShieldCheck, Share2, Info, Star, Smartphone, AlertTriangle, Scale, CheckCircle, Copy, Bell, ArrowLeft } from 'lucide-react'
import ThemeToggle from '../../../components/ThemeToggle'

export default function AppDetail({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const id = params.id
  const [app, setApp] = useState(null)
  const [relatedApps, setRelatedApps] = useState([])
  const [reviews, setReviews] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [scanning, setScanning] = useState(true)
  const [newReview, setNewReview] = useState({ user_name: '', rating: 5, comment: '' })

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setScanning(false), 2000)
    return () => clearTimeout(timer)
  }, [id])

  async function fetchData() {
    try {
      const { data: appData } = await supabase.from('apps').select('*').eq('id', id).single()
      if (appData) {
        setApp(appData)
        document.title = `${appData.title} Premium Download - Salman AppOrbit`
        
        // --- NAYA FEATURE: RELATED APPS ---
        const { data: related } = await supabase
          .from('apps')
          .select('*')
          .eq('category', appData.category)
          .neq('id', id)
          .limit(4)
        setRelatedApps(related || [])
      }
      const { data: revData } = await supabase.from('reviews').select('*').eq('app_id', id).order('created_at', { ascending: false })
      if (revData) setReviews(revData)
    } catch (err) { console.error(err) }
  }

  if (!app) return <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[#2ea64d] font-black animate-pulse uppercase tracking-[0.5em]">Establishing Orbit...</div>

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 font-sans pb-20">
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-50 px-6">
        <Link href="/" className="text-[10px] font-black uppercase text-gray-500 hover:text-[#2ea64d] flex items-center gap-2">
          <ArrowLeft size={14}/> Back to Store
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link Copied!"); }} className="text-gray-400 hover:text-blue-500"><Copy size={18}/></button>
          <button onClick={() => window.open(`https://wa.me/?text=Download ${app.title}: ${window.location.href}`)} className="text-gray-400 hover:text-[#2ea64d]"><Share2 size={18}/></button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-16 border-b border-gray-100 dark:border-white/5 pb-12 text-center md:text-left">
          <div className="w-44 h-44 bg-gray-100 dark:bg-[#121212] rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex items-center justify-center">
            {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" /> : <span className="text-7xl">📱</span>}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 italic leading-none">{app.title}</h1>
            <p className="text-[#24cd77] font-bold text-xs uppercase tracking-[0.3em] mb-8">{app.category} • v{app.version}</p>
            <div className="flex flex-col md:flex-row gap-4">
               <button onClick={() => app.is_free ? window.location.href=`/apps/${id}/download` : setShowPayment(true)} className="bg-[#24cd77] text-white font-black px-12 py-5 rounded-2xl uppercase text-[11px] shadow-xl active:scale-95 transition-all">
                {app.is_free ? 'Secure Download' : `Unlock Access (${app.price})`}
               </button>
            </div>
          </div>
        </div>

        {/* TECHNICAL SPECS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[{i:Scale, l:'Size', v:app.size}, {i:Smartphone, l:'Android', v:app.min_android}, {i:ShieldCheck, l:'Security', v:'Verified'}, {i:CheckCircle, l:'Status', v:'Working'}].map((x,i) => (
            <div key={i} className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl text-center border border-gray-100 dark:border-white/5 shadow-sm">
               <x.i size={20} className="mx-auto mb-2 text-[#24cd77]"/><p className="text-[8px] font-black text-gray-400 uppercase">{x.l}</p><p className="text-xs font-black uppercase">{x.v || 'Varies'}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h3 className="text-sm font-black uppercase mb-6 text-gray-400 tracking-widest italic">Product Overview</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm font-serif italic whitespace-pre-wrap border-l-2 border-[#2ea64d] pl-6">"{app.description}"</p>
              
              {/* --- NAYA SECTION: RELATED APPS --- */}
              {relatedApps.length > 0 && (
                <div className="mt-20">
                  <h3 className="text-sm font-black uppercase mb-8 text-[#2ea64d] tracking-widest italic border-b border-gray-100 dark:border-white/5 pb-2">Similar in Orbit</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relatedApps.map(rel => (
                      <Link key={rel.id} href={`/apps/${rel.id}`} className="bg-gray-50 dark:bg-[#111] p-4 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-[#2ea64d] transition-all group">
                        <img src={rel.icon_url} className="w-12 h-12 rounded-xl mb-3 object-cover shadow-sm group-hover:scale-110 transition-transform" />
                        <h4 className="text-[10px] font-black uppercase truncate dark:text-white">{rel.title}</h4>
                        <p className="text-[8px] text-[#2ea64d] font-bold mt-1 uppercase">Free Mod</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-8">
              <div className="bg-gray-50 dark:bg-[#121212] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                <h3 className="text-[10px] font-black uppercase mb-6 text-[#24cd77]">Submit Feedback</h3>
                <form onSubmit={async (e) => { e.preventDefault(); await supabase.from('reviews').insert([{...newReview, app_id:id}]); setNewReview({user_name:'',rating:5,comment:''}); fetchData(); }} className="space-y-3">
                  <input required className="w-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="Name" value={newReview.user_name} onChange={e => setNewReview({...newReview, user_name:e.target.value})} />
                  <textarea required className="w-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 p-3 rounded-xl text-xs outline-none italic" rows="2" placeholder="Experience..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment:e.target.value})} />
                  <button className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-3 rounded-xl text-[10px] uppercase">Post Review</button>
                </form>
              </div>
            </div>
        </div>

        {/* PAYMENT MODAL CODE REMAINS SAME (FOR BREVITY) */}
      </main>
    </div>
  )
}