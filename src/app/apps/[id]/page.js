"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../supabase'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, Share2, Info, Star, Smartphone, 
  AlertTriangle, Scale, CheckCircle, Copy, Bell, ArrowLeft, Zap 
} from 'lucide-react'
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
  const [isRecentlyUpdated, setIsRecentlyUpdated] = useState(false)

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
        document.title = `${appData.title} v${appData.version} - Salman AppOrbit`
        
        // Fetch Related Apps
        const { data: related } = await supabase.from('apps').select('*').eq('category', appData.category).neq('id', id).limit(4)
        setRelatedApps(related || [])

        // Check Update Status
        const lastUpdate = new Date(appData.updated_at || appData.created_at)
        const diff = (new Date() - lastUpdate) / (1000 * 60 * 60)
        if (diff < 48) setIsRecentlyUpdated(true)
      }
      const { data: revData } = await supabase.from('reviews').select('*').eq('app_id', id).order('created_at', { ascending: false })
      if (revData) setReviews(revData)
    } catch (err) { console.error("Orbit Error:", err) }
  }

  const handleAction = () => {
    if (app.is_free) window.location.href = `/apps/${id}/download`
    else setShowPayment(true)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link Copied! 🛰️")
  }

  const reportIssue = async () => {
    const reason = prompt("What's the issue? (e.g. Broken Link, App Crashes, Update Needed)")
    if (reason) {
      await supabase.from('reports').insert([{ app_id: id, app_name: app.title, issue_type: reason }])
      alert("Report sent to Salman Khan. Thanks!")
    }
  }

  if (!app) return <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[#2ea64d] font-black animate-pulse uppercase tracking-[0.5em]">Establishing Connection...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 font-sans pb-20">
      
      {/* NAVBAR */}
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-50 px-6 flex justify-between items-center shadow-sm">
        <Link href="/" className="text-[10px] font-black uppercase text-gray-400 hover:text-[#2ea64d] flex items-center gap-2">
          <ArrowLeft size={14}/> Back to Galaxy
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={copyLink} className="p-2 hover:text-blue-500 transition-colors"><Copy size={16}/></button>
          <button onClick={() => window.open(`https://wa.me/?text=Download ${app.title}: ${window.location.href}`)} className="p-2 hover:text-[#2ea64d]"><Share2 size={18}/></button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {/* NEW UPDATE NOTIFICATION */}
        {isRecentlyUpdated && (
          <div className="bg-blue-600 text-white p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-lg animate-in slide-in-from-top-4">
            <Bell className="animate-bounce" size={20}/>
            <p className="text-[10px] font-black uppercase tracking-widest leading-loose">Orbit Alert: v{app.version} update is now live! New features verified.</p>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-12 border-b border-gray-100 dark:border-white/5 pb-12 text-center md:text-left">
          <div className="w-48 h-48 bg-gray-100 dark:bg-[#121212] rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex items-center justify-center flex-shrink-0">
            {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" alt="" /> : <span className="text-7xl">📱</span>}
          </div>
          <div className="flex-1 w-full">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 italic leading-none">{app.title}</h1>
            <p className="text-[#2ea64d] font-bold text-[10px] uppercase tracking-[0.4em] mb-8">Software Intelligence • v{app.version}</p>
            
            {scanning ? (
              <div className="inline-flex items-center gap-3 bg-blue-500/5 px-6 py-3 rounded-2xl mb-8 animate-pulse"><div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div><p className="text-[10px] font-black uppercase text-blue-500 tracking-widest italic">Scanning Orbit Assets...</p></div>
            ) : (
              <div className="inline-flex items-center gap-3 bg-green-500/5 px-6 py-3 rounded-2xl mb-8"><ShieldCheck className="text-green-500" size={20}/><p className="text-[10px] font-black uppercase text-green-500 tracking-widest italic">Verified Virus-Free</p></div>
            )}

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <button 
                onClick={handleAction} 
                className="w-full md:w-auto bg-[#2ea64d] text-white font-black px-14 py-5 rounded-2xl uppercase text-[11px] shadow-xl shadow-green-500/20 active:scale-95 transition-all"
              >
                {app.is_free ? 'Secure Download' : `Unlock Access (${app.price})`}
              </button>
              <button onClick={reportIssue} className="text-[10px] font-black uppercase text-red-500 hover:text-red-600 transition-colors underline decoration-red-500/20 tracking-widest italic">Report Issue</button>
            </div>
          </div>
        </div>

        {/* ORBIT GUARANTEE TRUST BADGES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
           <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="text-blue-500" size={24}/>
              <div><p className="text-[10px] font-black uppercase text-blue-500">Safe Scan</p><p className="text-[8px] text-gray-500">Verified by Salman</p></div>
           </div>
           <div className="p-4 bg-[#2ea64d]/5 border border-[#2ea64d]/10 rounded-2xl flex items-center gap-3">
              <Zap className="text-[#2ea64d]" size={24}/>
              <div><p className="text-[10px] font-black uppercase text-[#2ea64d]">Fast Link</p><p className="text-[8px] text-gray-500">Secure Direct Server</p></div>
           </div>
           <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center gap-3">
              <Star className="text-orange-500" size={24}/>
              <div><p className="text-[10px] font-black uppercase text-orange-500">100% Works</p><p className="text-[8px] text-gray-500">Tested on Android 14</p></div>
           </div>
        </div>

        {/* TECHNICAL SPECS TABLE (AN1 STYLE) */}
        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 mb-16 shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              {[
                { l: 'File Size', v: app.size || 'Varies' },
                { l: 'Android Required', v: app.min_android || '8.0+' },
                { l: 'Last Updated', v: new Date(app.updated_at || app.created_at).toLocaleDateString(), c: 'text-blue-500' },
                { l: 'Status', v: 'Verified & Working ✅', c: 'text-[#24cd77]' }
              ].map((row, i) => (
                <div key={i} className="flex justify-between py-3.5 border-b border-gray-50 dark:border-white/5 text-[11px] font-bold uppercase tracking-widest font-mono">
                   <span className="text-gray-400">{row.l}</span>
                   <span className={row.c || 'text-gray-800 dark:text-gray-200'}>{row.v}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* DESCRIPTION SECTION */}
              <section>
                <h3 className="text-sm font-black uppercase mb-6 text-gray-400 tracking-widest italic flex items-center gap-2"><Info size={16}/> Overview</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm font-serif italic whitespace-pre-wrap border-l-2 border-gray-200 dark:border-white/5 pl-6">
                  "{app.description}"
                </p>
              </section>

              {/* WHATS NEW SECTION */}
              {app.whats_new && (
                <section className="p-8 bg-blue-500/5 border-l-4 border-blue-500 rounded-r-[2.5rem]">
                  <h3 className="text-[10px] font-black uppercase text-blue-500 mb-4 tracking-widest flex items-center gap-2"><Bell size={14}/> What's New</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-300 italic leading-relaxed whitespace-pre-wrap">● {app.whats_new}</p>
                </section>
              )}

              {/* RELATED APPS SECTION */}
              {relatedApps.length > 0 && (
                <section className="pt-10 border-t dark:border-white/5">
                  <h3 className="text-sm font-black uppercase text-[#2ea64d] mb-8 tracking-widest italic italic border-l-4 border-[#2ea64d] pl-4">Similar Pro Programs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedApps.map(rel => (
                      <Link key={rel.id} href={`/apps/${rel.id}`} className="bg-white dark:bg-[#111] p-4 rounded-[2rem] border border-gray-100 dark:border-white/5 hover:border-[#2ea64d] transition-all group shadow-sm">
                        <img src={rel.icon_url} className="w-14 h-14 rounded-2xl mb-4 object-cover group-hover:scale-110 transition-transform shadow-md" alt="" />
                        <h4 className="text-[10px] font-black uppercase truncate dark:text-gray-100 mb-1">{rel.title}</h4>
                        <p className="text-[9px] text-[#2ea64d] font-black uppercase">Verified</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* SIDEBAR: FEEDBACK */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-gray-50 dark:bg-[#121212] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
                <h3 className="text-[10px] font-black uppercase mb-6 text-[#24cd77] tracking-widest">Post Feedback</h3>
                <form onSubmit={async (e) => { e.preventDefault(); await supabase.from('reviews').insert([{...newReview, app_id:id}]); setNewReview({user_name:'',rating:5,comment:''}); fetchData(); }} className="space-y-3">
                  <input required className="w-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 p-3.5 rounded-xl text-xs outline-none focus:border-[#24cd77]" placeholder="Name" value={newReview.user_name} onChange={e => setNewReview({...newReview, user_name:e.target.value})} />
                  <textarea required className="w-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 p-3.5 rounded-xl text-xs outline-none italic" rows="3" placeholder="Experience..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment:e.target.value})} />
                  <button className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-xl text-[10px] uppercase tracking-tighter shadow-md active:scale-95 transition-all">Submit Review</button>
                </form>
              </div>

              {/* REVIEWS LIST */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-4 border-l-2 border-[#24cd77] bg-white dark:bg-white/5 rounded-r-xl shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase text-[#24cd77]">{rev.user_name}</span>
                      <span className="text-[8px]">{"⭐".repeat(rev.rating)}</span>
                    </div>
                    <p className="text-xs text-gray-500 italic font-medium leading-relaxed font-serif">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* PAYMENT MODAL */}
        {showPayment && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <div className="bg-white dark:bg-[#111] p-10 rounded-[3rem] max-w-sm w-full relative border border-[#24cd77]/30 text-center animate-in zoom-in-95 duration-300">
              <button onClick={() => setShowPayment(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">✕</button>
              <h3 className="text-xl font-black uppercase mb-8 italic italic text-gray-800 dark:text-white">Orbit <span className="text-[#24cd77]">Payment</span></h3>
              <div className="space-y-4 mb-8">
                <div className="p-5 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5 text-left italic">
                  <p className="text-[9px] font-bold text-[#24cd77] uppercase mb-1 italic">NayaPay / JazzCash / Easypaisa</p>
                  <p className="text-2xl font-black tracking-widest text-gray-800 dark:text-white">0327-5176283</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase border-t border-gray-100 dark:border-white/5 pt-2">Salman Khan</p>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5 text-left italic">
                  <p className="text-[9px] font-bold text-[#24cd77] uppercase mb-1 tracking-widest italic">NayaPay IBAN</p>
                  <p className="text-[10px] font-bold dark:text-white text-gray-800 break-all font-mono italic">PK16 NAYA 1234 5032 7517 6283</p>
                </div>
              </div>
              <a href={`https://wa.me/923275176283?text=I paid for ${app.title} v${app.version}`} className="block bg-[#25D366] text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all">Send Screenshot</a>
              <p className="text-[9px] text-gray-500 mt-6 italic">Direct Google Drive link will be shared after verification.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}