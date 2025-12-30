"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'
import { Upload, Trash2, Edit, Package, Settings, Layout, PlusCircle, Monitor } from 'lucide-react'

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState('apps') 
  const [password, setPassword] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [apps, setApps] = useState([])
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(false)

  // App Form State
  const [isFree, setIsFree] = useState(false)
  const [formData, setFormData] = useState({ id: null, title: '', description: '', category: 'App', price: '', original_price: '', download_url: '', icon_url: '', version: '1.0.0', size: '', min_android: '8.0+', whats_new: '' })
  
  // Slider Form State
  const [slideData, setSlideData] = useState({ title: '', description: '', image_url: '', button_link: '', bg_color: 'bg-[#2ea64d]' })

  useEffect(() => { fetchAuth() }, [])
  useEffect(() => { if (isLoggedIn) fetchData() }, [isLoggedIn])

  async function fetchAuth() {
    const { data } = await supabase.from('admin_settings').select('setting_value').eq('setting_key', 'admin_password').single()
    setDbPassword(data?.setting_value || 'salman786')
  }

  async function fetchData() {
    const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
    const { data: s } = await supabase.from('featured_slides').select('*').order('id', { ascending: false })
    if (a) setApps(a); if (s) setSlides(s);
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
      if (mode === 'slide') setSlideData({...slideData, image_url: data.publicUrl})
      alert("Asset Sync Complete! ✅")
    }
    setLoading(false)
  }

  const saveApp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { id, ...insertData } = formData
    const finalData = { ...insertData, price: isFree ? 'FREE' : formData.price, is_free: isFree }
    const res = formData.id ? await supabase.from('apps').update(finalData).eq('id', formData.id) : await supabase.from('apps').insert([finalData])
    if (!res.error) { alert("Published!"); resetAppForm(); fetchData(); }
    setLoading(false)
  }

  const saveSlide = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('featured_slides').insert([slideData])
    if (!error) { alert("Slide Added!"); setSlideData({ title: '', description: '', image_url: '', button_link: '', bg_color: 'bg-[#2ea64d]' }); fetchData(); }
    setLoading(false)
  }

  const resetAppForm = () => setFormData({ id: null, title: '', description: '', category: 'App', price: '', original_price: '', download_url: '', icon_url: '', version: '1.0.0', size: '', min_android: '8.0+', whats_new: '' })

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 w-full max-w-sm text-center shadow-2xl">
        <h2 className="text-white font-black text-xl mb-8 uppercase italic tracking-widest text-[#24cd77]">SAO Admin</h2>
        <input type="password" placeholder="Key..." className="w-full bg-black border border-white/10 p-4 rounded-xl mb-4 text-white text-center outline-none focus:border-[#24cd77]" onChange={e => setPassword(e.target.value)} />
        <button onClick={() => password === dbPassword ? setIsLoggedIn(true) : alert("No!")} className="w-full bg-[#24cd77] text-white font-black py-4 rounded-xl uppercase text-[10px]">Access Dashboard</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-10 border-b dark:border-white/5 pb-6">
          <button onClick={() => setView('apps')} className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest ${view === 'apps' ? 'bg-[#2ea64d] text-white shadow-lg shadow-green-500/20' : 'bg-gray-100 dark:bg-white/5'}`}>Manage Apps</button>
          <button onClick={() => setView('slider')} className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest ${view === 'slider' ? 'bg-[#2ea64d] text-white shadow-lg shadow-green-500/20' : 'bg-gray-100 dark:bg-white/5'}`}>Hero Slider</button>
          <Link href="/" className="ml-auto text-[10px] font-black py-2 uppercase text-gray-400 hover:text-red-500 transition-colors">Exit Orbit</Link>
        </div>

        {view === 'apps' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <form onSubmit={saveApp} className="bg-gray-50 dark:bg-[#111] p-8 rounded-[2rem] border dark:border-white/5 h-fit space-y-4 shadow-sm">
              <h3 className="text-[10px] font-black uppercase text-[#2ea64d] mb-4">Launch Application</h3>
              <div className="h-28 border-2 border-dashed dark:border-white/10 rounded-2xl flex items-center justify-center relative bg-white dark:bg-black overflow-hidden">
                {formData.icon_url ? <img src={formData.icon_url} className="w-full h-full object-cover" /> : <Upload className="text-gray-400" />}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'icon')} />
              </div>
              <input required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="App Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                 <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="Size (MB)" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
                 <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="Version" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} />
              </div>
              <div className="flex items-center justify-between p-3 border dark:border-white/10 rounded-xl bg-white dark:bg-black text-[10px] font-bold text-gray-500 uppercase">
                <span>Free Version?</span>
                <input type="checkbox" checked={isFree} onChange={() => setIsFree(!isFree)} className="w-4 h-4 accent-[#2ea64d]" />
              </div>
              {!isFree && <input required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none font-bold text-[#2ea64d]" placeholder="Price (500 PKR)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />}
              <textarea required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none italic" placeholder="Description" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <textarea className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none text-blue-500 italic" placeholder="Whats New?" rows="2" value={formData.whats_new} onChange={e => setFormData({...formData, whats_new: e.target.value})} />
              <div className="space-y-2">
                 <div className="flex items-center justify-center p-3 border border-dashed dark:border-white/10 rounded-xl relative bg-white dark:bg-black hover:border-[#2ea64d]">
                    <Upload size={14} className="mr-2 text-[#2ea64d]"/><span className="text-[10px] font-bold uppercase text-gray-500">{formData.download_url.includes('supabase') ? 'Sync Ready ✅' : 'Drop APK'}</span>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'apks', 'apk')} />
                 </div>
                 <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-[10px] outline-none" placeholder="...or Manual Link" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} />
              </div>
              <button disabled={loading} className="w-full bg-[#2ea64d] text-white font-black py-4 rounded-xl uppercase text-[10px] hover:bg-[#268a40] transition-all">Synchronize App</button>
            </form>

            <div className="lg:col-span-2 space-y-4">
              {apps.map(app => (
                <div key={app.id} className="bg-gray-50 dark:bg-[#111] p-4 rounded-2xl flex justify-between items-center border dark:border-white/5 shadow-sm group">
                  <div className="flex items-center gap-4">
                    <img src={app.icon_url} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                    <div><h4 className="font-bold text-sm uppercase">{app.title}</h4><p className="text-[10px] font-black text-[#2ea64d] uppercase">{app.price} • v{app.version}</p></div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => {setFormData(app); setIsFree(app.is_free); window.scrollTo({top:0, behavior:'smooth'})}} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><Edit size={16}/></button>
                    <button onClick={async () => { if(confirm("Delete?")){ await supabase.from('apps').delete().eq('id',app.id); fetchData(); }}} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* SLIDER MANAGEMENT */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <form onSubmit={saveSlide} className="bg-gray-50 dark:bg-[#111] p-8 rounded-[2rem] border dark:border-white/5 space-y-4 h-fit shadow-sm">
                <h3 className="text-[10px] font-black uppercase text-[#2ea64d] mb-4">Create Featured Slide</h3>
                <input required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" placeholder="Slide Title (Main Heading)" value={slideData.title} onChange={e => setSlideData({...slideData, title: e.target.value})} />
                <textarea required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" placeholder="Brief Description" value={slideData.description} onChange={e => setSlideData({...slideData, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-3">
                   <select className="dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" value={slideData.bg_color} onChange={e => setSlideData({...slideData, bg_color: e.target.value})}>
                      <option value="bg-[#2ea64d]">Green (AN1)</option><option value="bg-[#ff7a45]">Orange (MOD)</option><option value="bg-[#3b82f6]">Blue Sky</option><option value="bg-[#9333ea]">Purple Rain</option>
                   </select>
                   <div className="relative border border-dashed dark:border-white/10 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase text-gray-500 bg-white dark:bg-black overflow-hidden">
                      {slideData.image_url ? 'Image Ready' : 'Upload Image'}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'slide')} />
                   </div>
                </div>
                <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" placeholder="Button Redirect URL" value={slideData.button_link} onChange={e => setSlideData({...slideData, button_link: e.target.value})} />
                <button className="w-full bg-[#2ea64d] text-white font-black py-4 rounded-xl uppercase text-[10px] shadow-lg">Publish Slide</button>
             </form>
             <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Live Slides ({slides.length})</h3>
                {slides.map(s => (
                  <div key={s.id} className="p-4 bg-gray-50 dark:bg-[#111] rounded-2xl flex justify-between items-center border dark:border-white/5 shadow-sm group">
                    <div className="flex items-center gap-4">
                       <div className={`w-3 h-3 rounded-full ${s.bg_color}`}></div>
                       <h4 className="font-bold text-xs uppercase">{s.title}</h4>
                    </div>
                    <button onClick={async () => { if(confirm("Remove slide?")){ await supabase.from('featured_slides').delete().eq('id', s.id); fetchData(); }}} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16}/></button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  )
}