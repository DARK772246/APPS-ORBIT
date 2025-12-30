"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../supabase' // FIXED PATH: 3 steps back
import Link from 'next/link'
import { Star, Download, ShieldCheck, Share2, Info, CheckCircle, Smartphone, Scale, Copy } from 'lucide-react'
import ThemeToggle from '../../../components/ThemeToggle'

export default function AppDetail({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const id = params.id
  
  const [app, setApp] = useState(null)
  const [reviews, setReviews] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [newReview, setNewReview] = useState({ user_name: '', rating: 5, comment: '' })

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    const { data: appData } = await supabase.from('apps').select('*').eq('id', id).single()
    const { data: revData } = await supabase.from('reviews').select('*').eq('app_id', id).order('created_at', { ascending: false })
    if (appData) setApp(appData)
    if (revData) setReviews(revData)
  }

  const handleAction = () => {
    if (app.is_free) window.location.href = `/apps/${id}/download`
    else setShowPayment(true)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied!")
  }

  if (!app) return <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex items-center justify-center text-[#2ea64d] font-bold animate-pulse uppercase tracking-widest">Scanning Orbit...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] text-gray-900 dark:text-white font-sans transition-colors">
      
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-white/5 sticky top-0 z-50 px-4 h-14 flex items-center shadow-sm">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="text-[10px] font-black uppercase text-gray-400 hover:text-[#2ea64d] transition-colors">← Back to Store</Link>
          <div className="flex items-center gap-4">
             <ThemeToggle />
             <button onClick={copyLink} className="text-gray-400 hover:text-blue-500"><Copy size={16}/></button>
             <button onClick={() => window.open(`https://wa.me/?text=Check this mod: ${window.location.href}`)} className="text-gray-400 hover:text-[#2ea64d]"><Share2 size={16}/></button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* AN1 STYLE INFO BOX */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-10 items-start mb-8">
          
          {/* APP ICON */}
          <div className="w-44 h-44 mx-auto md:mx-0 bg-gray-50 dark:bg-black/20 rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-white/5 flex-shrink-0">
             {app.icon_url ? (
               <img src={app.icon_url} alt={app.title} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-7xl">{app.category === 'Game' ? '🎮' : '📱'}</div>
             )}
          </div>

          {/* APP STATS TABLE (AN1 SIGNATURE) */}
          <div className="flex-1 w-full">
            <h1 className="text-3xl font-black mb-6 uppercase tracking-tighter italic">{app.title}</h1>
            
            <div className="space-y-0.5 border-t border-gray-100 dark:border-white/5 mb-8">
              {[
                { label: 'Developer', value: 'Salman Khan', color: 'text-blue-500' },
                { label: 'Category', value: app.category },
                { label: 'Version', value: app.version },
                { label: 'Price', value: app.is_free ? 'FREE MOD' : app.price, color: 'text-[#2ea64d]' },
                { label: 'Size', value: app.size || 'Varies' },
                { label: 'Android', value: app.min_android || '8.0+' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between py-2.5 border-b border-gray-100 dark:border-white/5 text-[13px]">
                  <span className="text-gray-400 font-bold uppercase tracking-widest">{row.label}</span>
                  <span className={`font-black uppercase ${row.color || 'dark:text-white text-gray-700'}`}>{row.value}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleAction} 
              className="w-full bg-[#2ea64d] hover:bg-[#268a40] text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download size={16}/> {app.is_free ? 'Download Now (Free)' : `Buy Access Now`}
            </button>
          </div>
        </div>

        {/* DESCRIPTION & WHATS NEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-8">
              <section className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <h3 className="text-sm font-black uppercase text-[#2ea64d] mb-6 border-b border-gray-100 dark:border-white/5 pb-2 italic">Description</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic whitespace-pre-wrap font-serif">"{app.description}"</p>
              </section>

              {app.whats_new && (
                <section className="bg-blue-500/5 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                  <h3 className="text-[10px] font-black uppercase text-blue-500 mb-2">What's New in v{app.version}</h3>
                  <p className="text-xs text-gray-500 dark:text-blue-300 italic">● {app.whats_new}</p>
                </section>
              )}
           </div>

           {/* REVIEWS SIDEBAR */}
           <div className="md:col-span-1 space-y-6">
              <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <h3 className="text-xs font-black uppercase mb-4 text-[#2ea64d]">Orbit Feedback</h3>
                <form onSubmit={async (e) => { e.preventDefault(); await supabase.from('reviews').insert([{...newReview, app_id:id}]); setNewReview({user_name:'',rating:5,comment:''}); fetchData(); }} className="space-y-3">
                   <input required className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 p-3 rounded-lg text-xs outline-none" placeholder="Name" value={newReview.user_name} onChange={e => setNewReview({...newReview, user_name:e.target.value})} />
                   <textarea required className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 p-3 rounded-lg text-xs outline-none italic" rows="2" placeholder="How's the mod?" value={newReview.comment} onChange={e => setNewReview({...newReview, comment:e.target.value})} />
                   <button className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-2.5 rounded-lg text-[10px] uppercase tracking-tighter shadow-md">Post Review</button>
                </form>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {reviews.map(rev => (
                   <div key={rev.id} className="p-4 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-black/10 rounded-xl">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-black uppercase text-[#2ea64d]">{rev.user_name}</span>
                        <span className="text-[8px]">{"⭐".repeat(rev.rating)}</span>
                     </div>
                     <p className="text-[11px] text-gray-500 italic leading-relaxed">"{rev.comment}"</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* PAYMENT MODAL (SALMAN'S ACTUAL DETAILS) */}
        {showPayment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[2.5rem] max-w-sm w-full relative border border-[#2ea64d]/30 text-center animate-in zoom-in-95">
              <button onClick={() => setShowPayment(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">✕</button>
              <h3 className="text-xl font-black uppercase mb-8 italic tracking-tighter">Secure <span className="text-[#2ea64d]">Payment</span></h3>
              
              <div className="space-y-4 mb-8">
                <div className="p-5 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5 text-left italic">
                  <p className="text-[9px] font-bold text-[#2ea64d] uppercase mb-1 italic">NayaPay / JazzCash</p>
                  <p className="text-2xl font-black tracking-widest text-gray-800 dark:text-white italic">0327-5176283</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase border-t border-gray-100 dark:border-white/5 pt-2">Salman Khan</p>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5 text-left italic">
                   <p className="text-[9px] font-bold text-[#2ea64d] uppercase mb-1 italic tracking-widest">NayaPay IBAN</p>
                   <p className="text-[10px] font-bold break-all font-mono">PK16 NAYA 1234 5032 7517 6283</p>
                </div>
              </div>

              <a href={`https://wa.me/923275176283?text=I paid for ${app.title}`} target="_blank" className="block bg-[#25D366] text-white font-black py-4 rounded-xl uppercase text-[11px] tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all">Send Screenshot</a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}