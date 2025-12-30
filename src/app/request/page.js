"use client"
import { useState } from 'react'
import { supabase } from '../../supabase' // Sahi Path: Do folders peeche
import Link from 'next/link'

export default function RequestApp() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({ user_name: '', app_name: '', description: '' })

  const handleRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.from('requests').insert([formData])
    
    if (!error) {
      setSent(true)
      setFormData({ user_name: '', app_name: '', description: '' })
    } else {
      console.error(error)
      alert("Error: " + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      <nav className="max-w-4xl mx-auto flex justify-between items-center py-8">
        <Link href="/" className="text-xl font-black italic tracking-tighter uppercase">
          Salman <span className="text-blue-500 underline">AppOrbit</span>
        </Link>
        <Link href="/" className="text-xs font-bold text-slate-400 uppercase tracking-widest">← Back</Link>
      </nav>

      <main className="max-w-lg mx-auto py-10 text-center text-slate-200">
        <h2 className="text-4xl font-black uppercase mb-4 tracking-tight">Request an <span className="text-blue-500 font-black italic">App</span></h2>
        <p className="text-slate-500 text-xs mb-12 uppercase tracking-[0.2em] font-bold">"We bring what you desire to the Orbit"</p>

        {sent ? (
          <div className="bg-blue-600/10 border border-blue-500/30 p-10 rounded-[3rem]">
            <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">Request Received! 🛰️</h3>
            <p className="text-sm text-blue-400 font-medium italic">I'll check it and add it to the store soon.</p>
            <button onClick={() => setSent(false)} className="mt-8 text-[10px] font-black uppercase underline tracking-[0.2em]">Send Another</button>
          </div>
        ) : (
          <form onSubmit={handleRequest} className="bg-slate-900/30 border border-white/5 p-8 rounded-[3rem] text-left backdrop-blur-md">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">Your Identity</label>
                <input 
                  required
                  className="w-full bg-slate-950 border border-white/5 p-4 rounded-2xl focus:border-blue-500/50 outline-none transition text-sm"
                  placeholder="Your Name (e.g. Irfan)"
                  value={formData.user_name}
                  onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">Target App Name</label>
                <input 
                  required
                  className="w-full bg-slate-950 border border-white/5 p-4 rounded-2xl focus:border-blue-500/50 outline-none transition text-sm font-bold"
                  placeholder="e.g. Photoshop Express Mod"
                  value={formData.app_name}
                  onChange={(e) => setFormData({...formData, app_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">Mission Details (Optional)</label>
                <textarea 
                  rows="3"
                  className="w-full bg-slate-950 border border-white/5 p-4 rounded-2xl focus:border-blue-500/50 outline-none transition text-sm italic"
                  placeholder="Why do you need this app?"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[10px] transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Transmitting Data...' : 'Send Request to Salman'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}