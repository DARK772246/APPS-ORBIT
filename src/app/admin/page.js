"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'
import { 
  Upload, Trash2, Edit, Package, Activity, Lock, Settings, 
  Link as LinkIcon, Search, Layout, BarChart3, 
  Smartphone, CheckCircle2, AlertTriangle, LogOut, Star, PenTool, Image as ImageIcon 
} from 'lucide-react'

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState('dashboard') 
  const [passwordInput, setPasswordInput] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [apps, setApps] = useState([])
  const [slides, setSlides] = useState([])
  const [articles, setArticles] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ apps: 0, requests: 0, reports: 0 })
  const [message, setMessage] = useState({ text: '', type: '' })

  // Form States
  const [isFree, setIsFree] = useState(false)
  const [formData, setFormData] = useState({ 
    id: null, title: '', description: '', category: 'App', price: '', 
    original_price: '', download_url: '', icon_url: '', version: '1.0.0',
    size: '', min_android: '8.0+', whats_new: '' 
  })
  const [slideData, setSlideData] = useState({ id: null, title: '', description: '', image_url: '', button_link: '', bg_color: 'bg-[#2ea64d]' })
  const [artData, setArtData] = useState({ id: null, title: '', content: '', author: 'Salman Khan', writer: 'Salman AppOrbit', image_url: '' })

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
      const { data: r } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
      const { data: rep } = await supabase.from('reports').select('*').order('created_at', { ascending: false })
      const { count: reqCount } = await supabase.from('requests').select('*', { count: 'exact', head: true })
      
      if (a) setApps(a); if (s) setSlides(s); if (r) setArticles(r); if (rep) setReports(rep);
      setStats({ apps: a?.length || 0, requests: reqCount || 0, reports: rep?.length || 0 })
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleFileUpload = async (e, bucket, mode) => {
    const file = e.target.files[0]; if (!file) return;
    setLoading(true)
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
    const { error } = await supabase.storage.from(bucket).upload(fileName, file)
    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      const url = data.publicUrl
      if (mode === 'icon') setFormData(prev => ({...prev, icon_url: url}))
      if (mode === 'apk') setFormData(prev => ({...prev, download_url: url}))
      if (mode === 'slide') setSlideData(prev => ({...prev, image_url: url}))
      if (mode === 'blog') setArtData(prev => ({...prev, image_url: url}))
      alert("File Synced! ✅")
    }
    setLoading(false)
  }

  const saveApp = async (e) => {
    e.preventDefault(); setLoading(true)
    const { id, ...dataToInsert } = formData
    const finalData = { ...dataToInsert, price: isFree ? 'FREE' : formData.price, is_free: isFree, original_price: isFree ? '0' : formData.original_price }
    const res = formData.id ? await supabase.from('apps').update(finalData).eq('id', id) : await supabase.from('apps').insert([finalData])
    if (!res.error) { setMessage({text:'App Published!', type:'success'}); resetAppForm(); fetchData(); }
    setLoading(false)
  }

  const saveSlide = async (e) => {
    e.preventDefault(); setLoading(true)
    const { id, ...data } = slideData
    const res = slideData.id ? await supabase.from('featured_slides').update(data).eq('id', id) : await supabase.from('featured_slides').insert([data])
    if (!res.error) { setMessage({text:'Slide Active!', type:'success'}); setSlideData({id:null, title:'', description:'', image_url:'', button_link:'', bg_color:'bg-[#2ea64d]'}); fetchData(); }
    setLoading(false)
  }

  const saveArticle = async (e) => {
    e.preventDefault(); setLoading(true)
    const slug = artData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    const { id, ...data } = artData
    const res = artData.id ? await supabase.from('articles').update(data).eq('id', id) : await supabase.from('articles').insert([{ ...data, slug }])
    if (!res.error) { setMessage({text:'Article Live!', type:'success'}); setArtData({id:null, title:'', content:'', author:'Salman Khan', writer:'Salman AppOrbit', image_url:''}); fetchData(); }
    setLoading(false)
  }

  const resetAppForm = () => {
    setFormData({ id: null, title: '', description: '', category: 'App', price: '', original_price: '', download_url: '', icon_url: '', version: '1.0.0', size: '', min_android: '8.0+', whats_new: '' })
    setIsFree(false)
  }

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 w-full max-w-sm text-center shadow-2xl">
        <div className="w-16 h-16 bg-[#2ea64d] rounded-2xl flex items-center justify-center mx-auto mb-6 italic font-black text-2xl text-white shadow-lg">S</div>
        <h2 className="text-white font-black text-xl mb-8 uppercase italic tracking-widest text-[#2ea64d]">Orbit Control</h2>
        <input type="password" placeholder="Key..." className="w-full bg-black border border-white/10 p-4 rounded-xl mb-4 text-white text-center outline-none focus:border-[#2ea64d] tracking-[0.5em]" onChange={e => setPasswordInput(e.target.value)} />
        <button onClick={() => passwordInput === dbPassword ? setIsLoggedIn(true) : alert("Invalid Code!")} className="w-full bg-[#2ea64d] text-white font-bold py-4 rounded-xl uppercase text-[10px]">Unlock System</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-6 font-sans transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar border-b dark:border-white/5">
          {[ {id:'dashboard', l:'Stats', i:BarChart3, c:'bg-blue-600'}, {id:'apps', l:'Apps', i:Package, c:'bg-[#2ea64d]'}, {id:'slider', l:'Slider', i:Layout, c:'bg-purple-600'}, {id:'blog', l:'Blog', i:PenTool, c:'bg-orange-500'}, {id:'reports', l:'Reports', i:AlertTriangle, c:'bg-red-600'} ].map(t => (
            <button key={t.id} onClick={() => {setView(t.id); setMessage({text:'',type:''})}} className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${view === t.id ? `${t.c} text-white shadow-lg` : 'bg-gray-100 dark:bg-white/5'}`}>
              <t.i size={14}/> {t.l}
            </button>
          ))}
          <Link href="/" className="ml-auto text-[10px] font-black py-2 text-gray-400 uppercase">Exit</Link>
        </div>

        {message.text && <div className={`mb-6 p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-[#2ea64d]/10 text-[#2ea64d]' : 'bg-red-500/10 text-red-500'}`}>{message.text}</div>}

        {view === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in">
             {[ {l:'Apps', v:stats.apps, i:Package, c:'text-[#2ea64d]'}, {l:'Requests', v:stats.requests, i:Activity, c:'text-blue-500'}, {l:'Articles', v:articles.length, i:PenTool, c:'text-orange-500'}, {l:'Reports', v:stats.reports, i:AlertTriangle, c:'text-red-500'} ].map(s => (
                <div key={s.l} className="bg-gray-50 dark:bg-[#111] p-10 rounded-[3rem] border dark:border-white/5 text-center shadow-sm">
                  <s.i className={`mx-auto mb-4 ${s.c}`} size={32}/><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.l}</p><p className="text-4xl font-black mt-1">{s.v}</p>
                </div>
             ))}
          </div>
        )}

        {view === 'apps' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
             <form onSubmit={saveApp} className="bg-gray-50 dark:bg-[#111] p-8 rounded-[2rem] border dark:border-white/5 space-y-4 shadow-sm h-fit">
                <div className="h-28 border-2 border-dashed dark:border-white/10 rounded-2xl flex items-center justify-center relative bg-white dark:bg-black overflow-hidden cursor-pointer">
                  {formData.icon_url ? <img src={formData.icon_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'icon')} />
                </div>
                <input required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none focus:ring-1 ring-[#2ea64d]" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-3">
                   <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="Size" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
                   <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="v1.0.0" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} />
                </div>
                <div className="flex items-center justify-between p-3 border dark:border-white/10 rounded-xl bg-white dark:bg-black text-[10px] font-bold text-gray-500 uppercase"><span>Free App?</span><input type="checkbox" checked={isFree} onChange={() => setIsFree(!isFree)} className="w-4 h-4 accent-[#2ea64d]" /></div>
                {!isFree && <input required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none font-bold text-[#2ea64d]" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />}
                <textarea required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="Description" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <div className="space-y-2">
                   <div className="flex items-center justify-center p-3 border border-dashed dark:border-white/10 rounded-xl relative hover:border-[#2ea64d] transition-all">
                      <Upload size={14} className="mr-2 text-[#2ea64d]"/><span className="text-[10px] font-bold uppercase text-gray-500">{formData.download_url && formData.download_url.includes('supabase') ? 'Attached ✅' : 'Drop APK'}</span>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'apks', 'apk')} />
                   </div>
                   <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-[10px] outline-none" placeholder="Manual Link" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} />
                </div>
                <button disabled={loading} className="w-full bg-[#2ea64d] text-white font-black py-4 rounded-xl uppercase text-[10px]">Launch App</button>
             </form>
             <div className="lg:col-span-2 space-y-4">
                {apps.map(app => (
                  <div key={app.id} className="bg-gray-50 dark:bg-[#111] p-4 rounded-2xl flex justify-between items-center border dark:border-white/5 group hover:border-[#2ea64d] transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <img src={app.icon_url} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                      <div><h4 className="font-bold text-sm uppercase italic">{app.title}</h4><p className="text-[10px] font-black text-[#2ea64d] uppercase tracking-widest">{app.price}</p></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {setFormData(app); setIsFree(app.is_free); window.scrollTo({top:0, behavior:'smooth'})}} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg transition-all"><Edit size={16}/></button>
                      <button onClick={async () => { if(confirm("Delete?")){ await supabase.from('apps').delete().eq('id',app.id); fetchData(); }}} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'slider' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
             <form onSubmit={saveSlide} className="bg-gray-50 dark:bg-[#111] p-8 rounded-[2rem] border dark:border-white/5 space-y-4 h-fit">
                <div className="h-28 border-2 border-dashed dark:border-white/10 rounded-2xl flex items-center justify-center relative bg-white dark:bg-black overflow-hidden cursor-pointer">
                  {slideData.image_url ? <img src={slideData.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'slide')} />
                </div>
                <input required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" placeholder="Slide Title" value={slideData.title} onChange={e => setSlideData({...slideData, title: e.target.value})} />
                <textarea required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" placeholder="Description" value={slideData.description} onChange={e => setSlideData({...slideData, description: e.target.value})} />
                <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" placeholder="Link / App ID" value={slideData.button_link} onChange={e => setSlideData({...slideData, button_link: e.target.value})} />
                <select className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" value={slideData.bg_color} onChange={e => setSlideData({...slideData, bg_color: e.target.value})}>
                   <option value="bg-[#2ea64d]">Green</option><option value="bg-[#ff7a45]">Orange</option><option value="bg-[#3b82f6]">Blue</option>
                </select>
                <button className="w-full bg-purple-600 text-white font-black py-4 rounded-xl uppercase text-[10px]">Add Slide</button>
             </form>
             <div className="lg:col-span-2 space-y-4">
                {slides.map(s => (<div key={s.id} className="p-4 bg-gray-50 dark:bg-[#111] rounded-xl flex justify-between items-center border dark:border-white/5 group">
                   <h4 className="font-bold text-xs uppercase italic">{s.title}</h4>
                   <div className="flex gap-2">
                     <button onClick={() => {setSlideData(s); window.scrollTo({top:0, behavior:'smooth'})}} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit size={16}/></button>
                     <button onClick={async () => { if(confirm("Delete?")){ await supabase.from('featured_slides').delete().eq('id', s.id); fetchData(); }}} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16}/></button>
                   </div>
                </div>))}
             </div>
          </div>
        )}

        {view === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
             <form onSubmit={saveArticle} className="bg-gray-50 dark:bg-[#111] p-8 rounded-[2rem] border dark:border-white/5 space-y-4 h-fit shadow-sm">
                <div className="h-28 border-2 border-dashed dark:border-white/10 rounded-2xl flex items-center justify-center relative bg-white dark:bg-black overflow-hidden cursor-pointer shadow-inner">
                  {artData.image_url ? <img src={artData.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'blog')} />
                </div>
                <input required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" placeholder="Article Title" value={artData.title} onChange={e => setArtData({...artData, title: e.target.value})} />
                <textarea required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs h-40" placeholder="Content..." value={artData.content} onChange={e => setArtData({...artData, content: e.target.value})} />
                <button className="w-full bg-orange-500 text-white font-black py-4 rounded-xl uppercase text-[10px]">Publish Insight</button>
             </form>
             <div className="lg:col-span-2 space-y-4">
                {articles.map(art => (<div key={art.id} className="p-4 bg-gray-50 dark:bg-[#111] rounded-xl flex justify-between items-center border dark:border-white/5 group shadow-sm">
                   <h4 className="font-bold text-xs uppercase truncate">{art.title}</h4>
                   <div className="flex gap-2">
                     <button onClick={() => {setArtData(art); window.scrollTo({top:0, behavior:'smooth'})}} className="p-2 hover:text-blue-500"><Edit size={16}/></button>
                     <button onClick={async () => { if(confirm("Delete?")){ await supabase.from('articles').delete().eq('id', art.id); fetchData(); }}} className="p-2 hover:text-red-500"><Trash2 size={16}/></button>
                   </div>
                </div>))}
             </div>
          </div>
        )}

        {view === 'reports' && (
          <div className="space-y-4 animate-in fade-in">
             <h3 className="text-xl font-black uppercase text-red-500 italic mb-6 border-l-4 border-red-500 pl-4">Security Reports</h3>
             {reports.map(r => (
               <div key={r.id} className="bg-white dark:bg-[#111] p-6 rounded-[2.5rem] border border-red-500/10 flex justify-between items-center group shadow-sm">
                  <div>
                    <h4 className="font-black text-[#2ea64d] uppercase text-sm">{r.app_name}</h4>
                    <p className="text-xs text-red-500 font-bold uppercase mt-1 italic">Report: "{r.issue_type}"</p>
                  </div>
                  <button onClick={async () => { await supabase.from('reports').delete().eq('id', r.id); fetchData(); }} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
               </div>
             ))}
             {reports.length === 0 && <p className="text-gray-500 text-center italic py-20 font-bold uppercase text-[10px] tracking-widest opacity-20">No orbit incidents.</p>}
          </div>
        )}

      </div>
    </div>
  )
}