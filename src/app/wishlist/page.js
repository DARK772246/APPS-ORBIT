"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'

export default function Wishlist() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlistApps()
  }, [])

  async function fetchWishlistApps() {
    setLoading(true)
    // LocalStorage se IDs uthana
    const favorites = JSON.parse(localStorage.getItem('wishlist') || '[]')
    
    if (favorites.length > 0) {
      // Supabase se sirf wahi apps mangwana jin ki IDs list mein hain
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .in('id', favorites)
      
      if (data) setApps(data)
    }
    setLoading(false)
  }

  const removeFromWishlist = (id) => {
    let favorites = JSON.parse(localStorage.getItem('wishlist') || '[]')
    favorites = favorites.filter(favId => favId !== id.toString())
    localStorage.setItem('wishlist', JSON.stringify(favorites))
    setApps(apps.filter(app => app.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans">
      <nav className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-xl font-black italic tracking-tighter uppercase">
          Salman <span className="text-blue-500 underline">AppOrbit</span>
        </Link>
        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition">← Back to Store</Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">My <span className="text-blue-500">Wishlist</span></h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Your personal collection of premium apps</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-600 animate-pulse font-black uppercase tracking-widest">Accessing Saved Data...</div>
        ) : apps.length === 0 ? (
          <div className="text-center py-32 bg-slate-900/20 rounded-[4rem] border border-dashed border-white/10">
            <p className="text-4xl mb-6">💔</p>
            <p className="text-slate-500 font-bold uppercase tracking-widest mb-8 text-sm">Your wishlist is empty</p>
            <Link href="/">
              <button className="bg-blue-600 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Explore Apps</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {apps.map((app) => (
              <div key={app.id} className="group bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-red-500/30 transition-all relative overflow-hidden backdrop-blur-sm">
                
                {/* Remove Button */}
                <button 
                  onClick={() => removeFromWishlist(app.id)}
                  className="absolute top-6 right-6 text-slate-600 hover:text-red-500 transition-colors text-xl"
                  title="Remove from wishlist"
                >
                  ✕
                </button>

                <div className="flex justify-between items-start mb-6 font-sans">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl border border-white/5">
                    {app.category === 'Game' ? '🎮' : '📱'}
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{app.title}</h3>
                <p className="text-slate-500 text-xs mb-8 italic line-clamp-2 leading-relaxed">"{app.description}"</p>
                
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <div>
                    <div className="text-blue-500 font-black text-2xl">{app.price}</div>
                  </div>
                  <Link href={`/apps/${app.id}`}>
                    <button className="bg-white text-black font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}