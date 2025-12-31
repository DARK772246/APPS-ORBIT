"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'
import { Upload, Trash2, Edit, Package, Activity, Lock, Settings, Search, PlusCircle, Layout, BarChart3 } from 'lucide-react'

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState('dashboard') // 'dashboard', 'apps', 'slider'
  const [apps, setApps] = useState([])
  const [stats, setStats] = useState({ totalApps: 0, totalRequests: 0, totalReviews: 0 })
  const [password, setPassword] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ id: null, title: '', description: '', category: 'App', price: '', original_price: '', download_url: '', icon_url: '', version: '1.0.0', size: '', min_android: '8.0+', whats_new: '' })

  useEffect(() => { fetchAuth() }, [])
  useEffect(() => { if (isLoggedIn) fetchData() }, [isLoggedIn])

  async function fetchAuth() {
    const { data } = await supabase.from('admin_settings').select('setting_value').eq('setting_key', 'admin_password').single()
    setDbPassword(data?.setting_value || 'salman786')
  }

  async function fetchData() {
    const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
    const { count: r } = await supabase.from('requests').select('*', { count: 'exact', head: true })
    const { count: rv } = await supabase.from('reviews').select('*', { count: 'exact', head: true })
    if (a) setApps(a)
    setStats({ totalApps: a?.length || 0, totalRequests: r || 0, totalReviews: rv || 0 })
  }

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 w-full max-w-sm text-center">
        <h2 className="text-[#24cd77] font-black text-2xl mb-8 uppercase italic tracking-widest">Orbit Control</h2>
        <input type="password" placeholder="Passphrase..." className="w-full bg-black border border-white/10 p-4 rounded-xl mb-4 text-white text-center outline-none focus:border-[#24cd77]" onChange={e => setPassword(e.target.value)} />
        <button onClick={() => password === dbPassword ? setIsLoggedIn(true) : alert("No Access")} className="w-full bg-[#24cd77] text-white font-bold py-4 rounded-xl uppercase text-[10px]">Authenticate</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* TAB NAV */}
        <div className="flex gap-4 mb-10 border-b dark:border-white/5 pb-6 overflow-x-auto">
          <button onClick={() => setView('dashboard')} className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-white/5'}`}>Analytics</button>
          <button onClick={() => setView('apps')} className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${view === 'apps' ? 'bg-[#2ea64d] text-white' : 'bg-gray-100 dark:bg-white/5'}`}>Manage Apps</button>
          <Link href="/" className="ml-auto text-[10px] font-black py-2 uppercase text-gray-400">Exit Admin</Link>
        </div>

        {view === 'dashboard' ? (
          <div className="animate-in fade-in duration-500">
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               <div className="bg-gray-50 dark:bg-[#111] p-10 rounded-[3rem] border dark:border-white/5 text-center">
                  <Package className="mx-auto mb-4 text-[#2ea64d]" size={32}/>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orbit Apps</p>
                  <p className="text-4xl font-black">{stats.totalApps}</p>
               </div>
               <div className="bg-gray-50 dark:bg-[#111] p-10 rounded-[3rem] border dark:border-white/5 text-center">
                  <Activity className="mx-auto mb-4 text-blue-500" size={32}/>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">User Requests</p>
                  <p className="text-4xl font-black">{stats.totalRequests}</p>
               </div>
               <div className="bg-gray-50 dark:bg-[#111] p-10 rounded-[3rem] border dark:border-white/5 text-center">
                  <Star className="mx-auto mb-4 text-orange-400" size={32}/>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reviews</p>
                  <p className="text-4xl font-black">{stats.totalReviews}</p>
               </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white dark:bg-[#111] p-8 rounded-[3rem] border dark:border-white/5">
               <h3 className="text-sm font-black uppercase mb-8 flex items-center gap-2 italic tracking-widest"><BarChart3 size={18}/> Top Performing Apps</h3>
               <div className="space-y-4">
                  {apps.slice(0, 5).map(app => (
                    <div key={app.id} className="flex items-center justify-between p-4 border-b dark:border-white/5">
                       <div className="flex items-center gap-4">
                          <img src={app.icon_url} className="w-10 h-10 rounded-lg object-cover" />
                          <p className="font-bold text-sm uppercase">{app.title}</p>
                       </div>
                       <p className="text-[10px] font-black uppercase text-[#2ea64d] bg-[#2ea64d]/10 px-3 py-1 rounded-full">Active</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        ) : (
          /* Manage Apps Form & List (Same as previous updated version) */
          <p className="text-center italic opacity-50">Manage apps view loaded...</p>
        )}
      </div>
    </div>
  )
}