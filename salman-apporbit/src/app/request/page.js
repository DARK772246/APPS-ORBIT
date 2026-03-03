"use client"
import { useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'
import { Send, ArrowLeft, Zap, ShieldCheck } from 'lucide-react'
import Navbar from '../../components/Navbar'

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
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-20">
      <Navbar />

      <main className="max-w-xl mx-auto px-6 pt-32 lg:pt-40 text-center">
        <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">Request <span className="text-blue-500">Access</span></h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] italic">"We bring the target to the Orbit"</p>
        </div>

        {sent ? (
          <div className="glass-panel p-12 rounded-[4rem] border-blue-500/30 animate-in zoom-in duration-500 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
            <ShieldCheck className="mx-auto mb-6 text-blue-500" size={60} />
            <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tighter text-white">Transmission Successful</h3>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest italic">Salman is tracking your target...</p>
            <button onClick={() => setSent(false)} className="mt-10 text-[10px] font-black uppercase underline tracking-[0.3em] hover:text-white transition-colors">Initiate New Request</button>
          </div>
        ) : (
          <form onSubmit={handleRequest} className="glass-panel p-10 rounded-[3.5rem] text-left shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-2">User Identity</label>
                <input required className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all text-sm font-bold" placeholder="Your Name (e.g. Salman)" value={formData.user_name} onChange={(e) => setFormData({...formData, user_name: e.target.value})} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-2">Target App/Game Name</label>
                <input required className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all text-sm font-black uppercase italic" placeholder="e.g. GTA 6 MOD APK" value={formData.app_name} onChange={(e) => setFormData({...formData, app_name: e.target.value})} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-2">Mission Details (Optional)</label>
                <textarea rows="3" className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all text-sm italic" placeholder="Why do you need this targeting?" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[11px] transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 italic"
              >
                {loading ? 'Transmitting...' : 'Send To Orbit Control'} <Send size={16}/>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}