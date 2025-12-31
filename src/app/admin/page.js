"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'
import { 
  Upload, Trash2, Edit, Package, Activity, Lock, Settings, 
  Link as LinkIcon, Search, PlusCircle, Layout, BarChart3, 
  Smartphone, CheckCircle2, AlertCircle, LogOut 
} from 'lucide-react'

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState('dashboard') // 'dashboard', 'apps', 'slider'
  const [passwordInput, setPasswordInput] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [apps, setApps] = useState([])
  const [slides, setSlides] = useState([])
  const [stats, setStats] = useState({ totalApps: 0, totalRequests: 0, totalReviews: 0 })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  
  // App Form States
  const [isFree, setIsFree] = useState(false)
  const [formData, setFormData] = useState({ 
    id: null, title: '', description: '', category: 'App', price: '', 
    original_price: '', download_url: '', icon_url: '', version: '1.0.0',
    size: '', min_android: '8.0+', whats_new: '' 
  })

  useEffect(() => { fetchAuth() }, [])
  useEffect(() => { if (isLoggedIn) fetchData() }, [isLoggedIn])

  async function fetchAuth() {
    try {
      const { data } = await supabase.from('admin_settings').select('setting_value').eq('setting_key', 'admin_password').single()
      if (data) setDbPassword(data.setting_value)
      else setDbPassword('salman786')
    } catch (e) { setDbPassword('salman786') }
  }

  async function fetchData() {
    setLoading(true)
    try {
      const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
      const { data: s } = await supabase.from('featured_slides').select('*').order('id', { ascending: false })
      const { count: r } = await supabase.from('requests').select('*', { count: 'exact', head: true })
      const { count: rv } = await supabase.from('reviews').select('*', { count: 'exact', head: true })
      
      if (a) setApps(a)
      if (s) setSlides(s)
      setStats({ totalApps: a?.length || 0, totalRequests: r || 0, totalReviews: rv || 0 })
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleFileUpload = async (e, bucket, mode) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
    const { error } = await supabase.storage.from(bucket).upload(fileName, file)
    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      if (mode === 'icon') setFormData({...formData, icon_url: data.publicUrl})
      if (mode === 'apk') setFormData({...formData, download_url: data.publicUrl})
      alert("File Synced to Orbit! ✅")
    } else { alert(error.message) }
    setLoading(false)
  }

  const saveApp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { id, ...insertData } = formData
    const finalData = { ...insertData, price: isFree ? 'FREE' : formData.price, is_free: isFree }
    
    let res;
    if (formData.id) {
      res = await supabase.from('apps').update(finalData).eq('id', formData.id)
    } else {
      res = await supabase.from('apps').insert([insertData])
    }

    if (!res.error) {
      setMessage({ text: "🚀 Orbit Updated!", type: 'success' })
      setFormData({ id: null, title: '', description: '', category: 'App', price: '', original_price: '', download_url: '', icon_url: '', version: '1.0.0', size: '', min_android: '8.0+', whats_new: '' })
      setIsFree(false)
      fetchData()
    } else { setMessage({ text: res.error.message, type: 'error' }) }
    setLoading(false)
  }

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 w-full max-w-sm text-center shadow-2xl">
        <div className="w-16 h-16 bg-[#2ea64d] rounded-2xl flex items-center justify-center mx-auto mb-6 italic font-black text-2xl text-white">S</div>
        <h2 className="text-white font-black text-xl mb-8 uppercase italic tracking-tighter">Orbit Command</h2>
        <input type="password" placeholder="••••••••" className="w-full bg-black border border-white/10 p-4 rounded-xl mb-4 text-white text-center outline-none focus:border-[#2ea64d] tracking-[0.5em]" onChange={e => setPasswordInput(e.target.value)} />
        <button onClick={() => passwordInput === dbPassword ? setIsLoggedIn(true) : alert("Invalid Key!")} className="w-full bg-[#2ea64d] text-white font-bold py-4 rounded-xl uppercase text-[10px] tracking-widest active:scale-95 transition-all">Authorize Access</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10 pb-6 border-b dark:border-white/5">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Command <span className="text-[#2ea64d]">Center</span></h1>
          <div className="flex gap-4">
            <button onClick={() => setIsLoggedIn(false)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><LogOut size={20}/></button>
            <Link href="/" className="bg-[#2ea64d] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">Store Orbit</Link>
          </div>
        </header>

        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
          <button onClick={() => setView('dashboard')} className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${view === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 dark:bg-white/5'}`}>Analytics</button>
          <button onClick={() => setView('apps')} className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${view === 'apps' ? 'bg-[#2ea64d] text-white shadow-lg shadow-green-500/20' : 'bg-gray-100 dark:bg-white/5'}`}>App Manager</button>
          <Link href="/admin/requests" className="px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest whitespace-nowrap bg-gray-100 dark:bg-white/5 hover:text-blue-500 transition-all">User Requests</Link>
        </div>

        {view === 'dashboard' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               <div className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border dark:border-white/5 text-center shadow-sm">
                  <Package className="mx-auto mb-4 text-[#2ea64d]" size={32}/>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Apps</p>
                  <p className="text-4xl font-black mt-1">{stats.totalApps}</p>
               </div>
               <div className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border dark:border-white/5 text-center shadow-sm">
                  <Activity className="mx-auto mb-4 text-blue-500" size={32}/>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Requests</p>
                  <p className="text-4xl font-black mt-1">{stats.totalRequests}</p>
               </div>
               <div className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border dark:border-white/5 text-center shadow-sm">
                  <Star className="mx-auto mb-4 text-orange-400" size={32}/>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reviews</p>
                  <p className="text-4xl font-black mt-1">{stats.totalReviews}</p>
               </div>
            </div>
            <div className="bg-white dark:bg-[#111] p-8 rounded-[3rem] border dark:border-white/5 shadow-sm">
               <h3 className="text-sm font-black uppercase mb-8 flex items-center gap-2 italic tracking-widest text-gray-400"><BarChart3 size={18}/> Recently Sync'd</h3>
               <div className="grid grid-cols-1 gap-4">
                  {apps.slice(0, 5).map(app => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-2xl">
                       <div className="flex items-center gap-4">
                          <img src={app.icon_url} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <p className="font-bold text-xs uppercase">{app.title}</p>
                       </div>
                       <span className="text-[8px] font-black uppercase px-3 py-1 bg-[#2ea64d]/10 text-[#2ea64d] rounded-full border border-[#2ea64d]/20">Verified</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* APP FORM */}
            <div className="lg:col-span-1">
               <form onSubmit={saveApp} className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border dark:border-white/5 shadow-xl sticky top-4 space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-[#2ea64d] mb-4 border-b dark:border-white/5 pb-2">{formData.id ? 'Modify Mode' : 'New Launch'}</h3>
                  
                  <div className="h-28 border-2 border-dashed dark:border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-black">
                    {formData.icon_url ? <img src={formData.icon_url} className="w-full h-full object-cover" alt="" /> : <Upload className="text-gray-400" size={20}/>}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={e => handleFileUpload(e, 'icons', 'icon')} />
                  </div>

                  <input required className="w-full bg-gray-50 dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  
                  <div className="grid grid-cols-2 gap-3">
                     <input className="w-full bg-gray-50 dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="Size (MB)" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
                     <input className="w-full bg-gray-50 dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="v1.0.0" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} />
                  </div>

                  <div className="flex items-center justify-between p-3 border dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black text-[9px] font-bold text-gray-500 uppercase">
                    <span>Free App?</span>
                    <input type="checkbox" checked={isFree} onChange={() => setIsFree(!isFree)} className="w-4 h-4 accent-[#2ea64d]" />
                  </div>

                  {!isFree && <input required className="w-full bg-gray-50 dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none font-bold text-[#2ea64d]" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />}
                  
                  <textarea required className="w-full bg-gray-50 dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none italic" placeholder="Description" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  
                  <div className="space-y-2">
                     <div className="flex items-center justify-center p-3 border border-dashed dark:border-white/10 rounded-xl relative hover:border-[#2ea64d] transition-all">
                        <Upload size={14} className="mr-2 text-[#2ea64d]"/><span className="text-[9px] font-black uppercase text-gray-500">{formData.download_url.includes('supabase') ? 'Sync Ready ✅' : 'Drop APK'}</span>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'apks', 'apk')} />
                     </div>
                     <input className="w-full bg-gray-50 dark:bg-black border dark:border-white/10 p-3 rounded-xl text-[10px] outline-none" placeholder="External Link..." value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} />
                  </div>

                  <button disabled={loading} className="w-full bg-[#2ea64d] text-white font-black py-4 rounded-xl uppercase text-[10px] hover:scale-[1.02] transition-all">
                    {loading ? 'Processing...' : 'Synchronize App'}
                  </button>
                  {message.text && <p className={`text-[9px] font-bold uppercase text-center ${message.type === 'error' ? 'text-red-500' : 'text-[#2ea64d]'}`}>{message.text}</p>}
               </form>
            </div>

            {/* APP LIST */}
            <div className="lg:col-span-2 space-y-4">
              {apps.map(app => (
                <div key={app.id} className="bg-white dark:bg-[#111] p-4 rounded-2xl border dark:border-white/5 flex items-center justify-between group hover:border-[#2ea64d] transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={app.icon_url || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div>
                      <h4 className="font-bold text-xs uppercase">{app.title}</h4>
                      <p className="text-[9px] font-black text-[#2ea64d] uppercase">{app.price} • v{app.version}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setFormData(app); setIsFree(app.is_free); window.scrollTo({top:0, behavior:'smooth'}) }} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><Edit size={16}/></button>
                    <button onClick={async () => { if(confirm("Delete App?")){ await supabase.from('apps').delete().eq('id', app.id); fetchData(); } }} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}