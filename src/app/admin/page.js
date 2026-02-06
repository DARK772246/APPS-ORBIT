"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'
import { 
  Upload, Trash2, Edit, Package, Activity, Lock, Settings, BarChart3, 
  Star, PenTool, Image as ImageIcon, LogOut, Layout, AlertTriangle, 
  Smartphone, CheckCircle2, Search, PlusCircle, X, Link as LinkIcon, MessageSquareText
} from 'lucide-react'

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState('dashboard') 
  const [passwordInput, setPasswordInput] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [adminSearch, setAdminSearch] = useState('')
  
  // Data States
  const [apps, setApps] = useState([])
  const [slides, setSlides] = useState([])
  const [articles, setArticles] = useState([])
  const [reports, setReports] = useState([])
  const [pendingComments, setPendingComments] = useState([])
  const [stats, setStats] = useState({ apps: 0, requests: 0, reports: 0, comments: 0 })
  const [message, setMessage] = useState({ text: '', type: '' })

  // Security Settings State
  const [showSettings, setShowSettings] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  // App Form State (Developer Field Added back)
  const [isFree, setIsFree] = useState(false)
  const [formData, setFormData] = useState({ 
    id: null, title: '', description: '', category: 'App', developer: 'Salman Khan', 
    price: '', original_price: '', download_url: '', icon_url: '', version: '1.0.0', 
    size: '', min_android: '8.0+', whats_new: '', screenshots: [] 
  })

  // Slider & Blog States
  const [slideData, setSlideData] = useState({ id: null, title: '', description: '', image_url: '', button_link: '', bg_color: 'bg-[#2ea64d]' })
  const [artData, setArtData] = useState({ id: null, title: '', content: '', author: 'Salman Khan', writer: 'Salman AppOrbit', image_url: '' })

  useEffect(() => { 
    fetchAuth();
    // NEW: Check if already logged in via session
    if (sessionStorage.getItem('admin_token') === 'SALMAN_ORBIT_ADMIN') {
        setIsLoggedIn(true);
    }
  }, [])
  useEffect(() => { if (isLoggedIn) fetchData() }, [isLoggedIn])

  async function fetchAuth() {
    try {
      const { data } = await supabase.from('admin_settings').select('setting_value').eq('setting_key', 'admin_password').single()
      if (data) setDbPassword(data.setting_value)
      else setDbPassword('salman786')
    } catch (e) { setDbPassword('salman786') }
  }

  async function handleLogin() {
    if (passwordInput === dbPassword) {
        setIsLoggedIn(true);
        sessionStorage.setItem('admin_token', 'SALMAN_ORBIT_ADMIN'); // NEW: Save token to session
    } else {
        alert("Invalid Code!");
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_token'); // NEW: Remove token on logout
    setView('dashboard');
  }

  async function fetchData() {
    setLoading(true)
    // ... (rest of fetchData logic remains the same)
    try {
      const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
      const { data: s } = await supabase.from('featured_slides').select('*').order('id', { ascending: false })
      const { data: r } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
      const { data: rep } = await supabase.from('reports').select('*').order('created_at', { ascending: false })
      const { data: comm } = await supabase.from('comments').select('*').eq('approved', false).order('created_at', { ascending: false })
      const { count: reqCount } = await supabase.from('requests').select('*', { count: 'exact', head: true })
      
      if (a) setApps(a); if (s) setSlides(s); if (r) setArticles(r); if (rep) setReports(rep);
      if (comm) setPendingComments(comm);
      setStats({ apps: a?.length || 0, requests: reqCount || 0, reports: rep?.length || 0, comments: comm?.length || 0 })
    } catch (err) { console.error("Sync Error:", err) }
    setLoading(false)
  }

  const handleCommentAction = async (id, action) => {
    setLoading(true);
    let res;
    if (action === 'approve') {
      res = await supabase.from('comments').update({ approved: true }).eq('id', id);
    } else if (action === 'delete') {
      res = await supabase.from('comments').delete().eq('id', id);
    }
    
    if (!res?.error) { 
      setMessage({text: `Comment ${action === 'approve' ? 'Approved' : 'Deleted'}!`, type:'success'}); 
      fetchData(); 
    } else {
      setMessage({text: `Error ${action === 'approve' ? 'Approving' : 'Deleting'} Comment.`, type:'error'});
    }
    setLoading(false);
  }

  const handleFileUpload = async (e, bucket, mode) => {
    // ... (existing handleFileUpload logic)
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
      if (mode === 'screenshot') setFormData(prev => ({...prev, screenshots: [...(prev.screenshots || []), url]}))
      alert("Asset Synced! ✅")
    } else { alert(error.message) }
    setLoading(false)
  }

  const handleSaveApp = async (e) => {
    // ... (existing handleSaveApp logic)
    e.preventDefault(); setLoading(true)
    const { id, ...dataToInsert } = formData
    const finalData = { ...dataToInsert, price: isFree ? 'FREE' : formData.price, is_free: isFree, original_price: isFree ? '0' : formData.original_price }
    const res = formData.id ? await supabase.from('apps').update(finalData).eq('id', id) : await supabase.from('apps').insert([finalData])
    if (!res.error) { setMessage({text:'App Published!', type:'success'}); resetAppForm(); fetchData(); }
    setLoading(false)
  }

  const handleSaveSlide = async (e) => {
    // ... (existing handleSaveSlide logic)
    e.preventDefault(); setLoading(true)
    const { id, ...data } = slideData
    const res = slideData.id ? await supabase.from('featured_slides').update(data).eq('id', id) : await supabase.from('featured_slides').insert([data])
    if (!res.error) { alert("Slide Saved!"); setSlideData({id:null, title:'', description:'', image_url:'', button_link:'', bg_color:'bg-[#2ea64d]'}); fetchData(); }
    setLoading(false)
  }

  const handleSaveArticle = async (e) => {
    // ... (existing handleSaveArticle logic)
    e.preventDefault(); setLoading(true)
    const slug = artData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    const { id, ...data } = artData
    const res = artData.id ? await supabase.from('articles').update(data).eq('id', id) : await supabase.from('articles').insert([{ ...data, slug }])
    if (!res.error) { alert("Article Published!"); setArtData({id:null, title:'', content:'', author:'Salman Khan', writer:'Salman AppOrbit', image_url:''}); fetchData(); }
    setLoading(false)
  }

  const resetAppForm = () => {
    // ... (existing resetAppForm logic)
    setFormData({ id: null, title: '', description: '', category: 'App', developer: 'Salman Khan', price: '', original_price: '', download_url: '', icon_url: '', version: '1.0.0', size: '', min_android: '8.0+', whats_new: '', screenshots: [] })
    setIsFree(false)
  }

  const filteredAppsList = apps.filter(item => item.title.toLowerCase().includes(adminSearch.toLowerCase()))
  
  const renderStars = (count) => {
    return Array(5).fill(null).map((_, i) => (
      <Star key={i} size={10} className={`inline transition-colors ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
    ));
  };


  if (!isLoggedIn) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 w-full max-w-sm text-center shadow-2xl transition-all">
        <div className="w-16 h-16 bg-[#2ea64d] rounded-2xl flex items-center justify-center mx-auto mb-6 italic font-black text-2xl text-white shadow-lg">S</div>
        <h2 className="text-white font-black text-xl mb-8 uppercase italic tracking-widest text-[#2ea64d]">Orbit Control</h2>
        <input type="password" placeholder="Key..." className="w-full bg-black border border-white/10 p-4 rounded-xl mb-4 text-white text-center outline-none focus:border-[#2ea64d] tracking-[0.5em]" onChange={e => setPasswordInput(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-[#2ea64d] text-white font-bold py-4 rounded-xl uppercase text-[10px]">Access Dashboard</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP NAVBAR */}
        <header className="flex justify-between items-center mb-10 pb-6 border-b dark:border-white/5">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter italic">Command <span className="text-[#2ea64d]">Center</span></h1>
          <div className="flex gap-4">
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl border dark:border-white/5 hover:text-[#2ea64d] transition-all"><Settings size={20}/></button>
            <button onClick={handleLogout} className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl border dark:border-white/5 hover:text-red-500 transition-all"><LogOut size={20}/></button>
          </div>
        </header>

        {/* SECURITY SETTINGS */}
        {showSettings && (
          <div className="mb-10 p-8 bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] animate-in slide-in-from-top-4">
            <h3 className="text-xs font-black uppercase mb-4 flex items-center gap-2"><Lock size={16}/> Security Update</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" className="flex-1 bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-4 rounded-xl text-sm outline-none" placeholder="New Secret Key" onChange={(e) => setNewPassword(e.target.value)} />
              <button onClick={async () => { await supabase.from('admin_settings').update({setting_value: newPassword}).eq('setting_key','admin_password'); setDbPassword(newPassword); setShowSettings(false); alert("Key Changed!"); }} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">Update Orbit Key</button>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar border-b dark:border-white/5">
          {[ 
            {id:'dashboard', l:'Stats', i:BarChart3, c:'bg-blue-600'}, 
            {id:'apps', l:'Apps', i:Package, c:'bg-[#2ea64d]'}, 
            {id:'slider', l:'Slider', i:Layout, c:'bg-purple-600'}, 
            {id:'blog', l:'Blog', i:PenTool, c:'bg-orange-500'}, 
            {id:'reviews', l:'Reviews', i:MessageSquareText, c:'bg-yellow-600'}, // NEW TAB
            {id:'reports', l:'Incidents', i:AlertTriangle, c:'bg-red-600'} // UPDATED LABEL
          ].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${view === t.id ? `${t.c} text-white shadow-lg` : 'bg-gray-100 dark:bg-white/5'}`}>
              <t.i size={14}/> {t.l} {t.id === 'reviews' && pendingComments.length > 0 && <span className="w-5 h-5 bg-white text-yellow-600 rounded-full flex items-center justify-center -mr-1">{pendingComments.length}</span>}
            </button>
          ))}
        </div>

        {message.text && <div className={`mb-6 p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-[#2ea64d]/10 text-[#2ea64d]' : 'bg-red-500/10 text-red-500'}`}>{message.text}</div>}

        {/* --- VIEWS --- */}
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 animate-in fade-in">
             {[ 
               {l:'Orbit Apps', v:stats.apps, i:Package, c:'text-[#2ea64d]'}, 
               {l:'User Requests', v:stats.requests, i:Activity, c:'text-blue-500'}, 
               {l:'Pending Reviews', v:stats.comments, i:MessageSquareText, c:'text-yellow-500'},
               {l:'Orbit Blogs', v:articles.length, i:PenTool, c:'text-orange-500'}, 
               {l:'Bug Reports', v:stats.reports, i:AlertTriangle, c:'text-red-500'} 
             ].map(s => (
                <div key={s.l} className="bg-gray-50 dark:bg-[#111] p-10 rounded-[3rem] border dark:border-white/5 text-center shadow-sm">
                  <s.i className={`mx-auto mb-4 ${s.c}`} size={32}/><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.l}</p><p className="text-4xl font-black mt-1">{s.v}</p>
                </div>
             ))}
          </div>
        )}

        {view === 'apps' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <form onSubmit={handleSaveApp} className="bg-gray-50 dark:bg-[#111] p-8 rounded-[2.5rem] border dark:border-white/5 space-y-4 shadow-sm h-fit">
                <h3 className="text-[10px] font-black uppercase text-[#2ea64d] mb-4">Application Config</h3>
                
                {/* ICON UPLOAD */}
                <div className="h-28 border-2 border-dashed dark:border-white/10 rounded-2xl flex items-center justify-center relative bg-white dark:bg-black overflow-hidden cursor-pointer">
                  {formData.icon_url ? <img src={formData.icon_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'icon')} />
                </div>

                <input required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none focus:ring-1 ring-[#2ea64d]" placeholder="App Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-3">
                   <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="Size (MB)" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
                   <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="Developer" value={formData.developer} onChange={e => setFormData({...formData, developer: e.target.value})} />
                </div>

                <div className="flex items-center justify-between p-3 border dark:border-white/10 rounded-xl bg-white dark:bg-black text-[10px] font-bold text-gray-500 uppercase italic">
                  <span>Free Application?</span>
                  <input type="checkbox" checked={isFree} onChange={() => setIsFree(!isFree)} className="w-4 h-4 accent-[#2ea64d]" />
                </div>

                {!isFree && <input required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none font-bold text-[#2ea64d]" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />}
                
                <textarea required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none italic" placeholder="Description" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                
                {/* SCREENSHOTS */}
                <div className="p-3 border border-dashed dark:border-white/10 rounded-xl bg-white dark:bg-black">
                   <p className="text-[8px] font-black uppercase text-gray-500 mb-2">Gallery ({formData.screenshots?.length || 0}/4)</p>
                   <div className="flex gap-2 overflow-x-auto pb-1">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-black border dark:border-white/10 rounded-lg flex items-center justify-center relative cursor-pointer">
                         <PlusCircle size={14}/>
                         <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'screenshot')} />
                      </div>
                      {formData.screenshots?.map((s_img, s_idx) => (
                        <div key={s_idx} className="relative flex-shrink-0">
                          <img src={s_img} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <button type="button" onClick={() => setFormData(prev => ({...prev, screenshots: prev.screenshots.filter((_, idx) => idx !== s_idx)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white"><X size={8}/></button>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex items-center justify-center p-3 border border-dashed dark:border-white/10 rounded-xl relative hover:border-[#2ea64d] transition-all cursor-pointer">
                      <Upload size={14} className="mr-2 text-[#2ea64d]"/><span className="text-[9px] font-black uppercase text-gray-500">{formData.download_url && formData.download_url.includes('supabase') ? 'Sync Ready ✅' : 'Drop APK'}</span>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'apks', 'apk')} />
                   </div>
                   <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-[10px] outline-none" placeholder="...or Manual URL" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} />
                </div>
                <button disabled={loading} className="w-full bg-[#2ea64d] text-white font-black py-4 rounded-xl uppercase text-[10px] shadow-lg active:scale-95 transition-all">Synchronize</button>
             </form>

             {/* APP LIST */}
             <div className="lg:col-span-2 space-y-4">
                <div className="relative mb-4">
                   <Search size={14} className="absolute left-3 top-3 text-gray-500" />
                   <input type="text" placeholder="Search inventory..." className="w-full bg-gray-50 dark:bg-[#111] p-3 pl-10 rounded-xl border dark:border-white/5 text-xs outline-none focus:border-[#2ea64d]" onChange={e => setAdminSearch(e.target.value)} />
                </div>
                {filteredAppsList.map(app_item => (
                  <div key={app_item.id} className="bg-white dark:bg-[#111] p-4 rounded-2xl border dark:border-white/5 flex items-center justify-between group hover:border-[#2ea64d] transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <img src={app_item.icon_url || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                      <div><h4 className="font-bold text-sm uppercase italic">{app_item.title}</h4><p className="text-[10px] font-black text-[#2ea64d] uppercase tracking-widest">{app_item.price}</p></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setFormData(app_item); setIsFree(app_item.is_free); window.scrollTo({top:0, behavior:'smooth'}) }} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg transition-all"><Edit size={16}/></button>
                      <button onClick={async () => { if(confirm("Delete?")){ await supabase.from('apps').delete().eq('id', app_item.id); fetchData(); } }} className="p-2 bg-red-500/10 text-red-500 rounded-lg transition-all"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'slider' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
             <form onSubmit={handleSaveSlide} className="bg-gray-50 dark:bg-[#111] p-8 rounded-[2rem] border dark:border-white/5 space-y-4 h-fit shadow-sm">
                <div className="h-28 border-2 border-dashed dark:border-white/10 rounded-2xl flex items-center justify-center relative bg-white dark:bg-black overflow-hidden cursor-pointer">
                  {slideData.image_url ? <img src={slideData.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'slide')} />
                </div>
                <input required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" placeholder="Slide Title" value={slideData.title} onChange={e => setSlideData({...slideData, title: e.target.value})} />
                <textarea required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" placeholder="Description" value={slideData.description} onChange={e => setSlideData({...slideData, description: e.target.value})} />
                <input className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" placeholder="Redirect Link" value={slideData.button_link} onChange={e => setSlideData({...slideData, button_link: e.target.value})} />
                <select className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs" value={slideData.bg_color} onChange={e => setSlideData({...slideData, bg_color: e.target.value})}>
                   <option value="bg-[#2ea64d]">Green (AN1)</option><option value="bg-[#ff7a45]">Orange (Special)</option><option value="bg-[#3b82f6]">Blue Sky</option>
                </select>
                <button className="w-full bg-purple-600 text-white font-black py-4 rounded-xl uppercase text-[10px]">Update Slider</button>
             </form>
             <div className="lg:col-span-2 space-y-4">
                {slides.map(s_item => (<div key={s_item.id} className="p-4 bg-white dark:bg-[#111] rounded-[2rem] flex justify-between items-center border dark:border-white/5 group shadow-sm">
                   <h4 className="font-bold text-xs uppercase italic tracking-tighter">{s_item.title}</h4>
                   <div className="flex gap-2">
                     <button onClick={() => {setSlideData(s_item); window.scrollTo({top:0, behavior:'smooth'})}} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit size={16}/></button>
                     <button onClick={async () => { if(confirm("Delete?")){ await supabase.from('featured_slides').delete().eq('id', s_item.id); fetchData(); }}} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16}/></button>
                   </div>
                </div>))}
             </div>
          </div>
        )}

        {view === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
             <form onSubmit={handleSaveArticle} className="bg-gray-50 dark:bg-[#111] p-8 rounded-[2rem] border dark:border-white/5 space-y-4 h-fit shadow-sm">
                <div className="h-28 border-2 border-dashed dark:border-white/10 rounded-2xl flex items-center justify-center relative bg-white dark:bg-black overflow-hidden cursor-pointer shadow-inner">
                  {artData.image_url ? <img src={artData.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'blog')} />
                </div>
                <input required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="Article Title" value={artData.title} onChange={e => setArtData({...artData, title: e.target.value})} />
                <textarea required className="w-full dark:bg-black border dark:border-white/10 p-3 rounded-xl text-xs h-40" placeholder="Insight content..." value={artData.content} onChange={e => setArtData({...artData, content: e.target.value})} />
                <button className="w-full bg-orange-500 text-white font-black py-4 rounded-xl uppercase text-[10px]">Publish to Orbit</button>
             </form>
             <div className="lg:col-span-2 space-y-4">
                {articles.map(art_item => (<div key={art_item.id} className="p-4 bg-white dark:bg-[#111] rounded-[2rem] flex justify-between items-center border dark:border-white/5 group shadow-sm transition-all hover:border-orange-500">
                   <h4 className="font-bold text-xs uppercase truncate italic">{art_item.title}</h4>
                   <div className="flex gap-2">
                     <button onClick={() => {setArtData(art_item); window.scrollTo({top:0, behavior:'smooth'})}} className="p-2 hover:text-blue-500"><Edit size={16}/></button>
                     <button onClick={async () => { if(confirm("Delete?")){ await supabase.from('articles').delete().eq('id', art_item.id); fetchData(); }}} className="p-2 hover:text-red-500"><Trash2 size={16}/></button>
                   </div>
                </div>))}
             </div>
          </div>
        )}
        
        {/* PENDING REVIEWS */}
        {view === 'reviews' && (
          <div className="space-y-4 animate-in fade-in">
             <h3 className="text-xl font-black uppercase text-yellow-500 italic mb-6 border-l-4 border-yellow-600 pl-4 tracking-tighter">Pending Orbit Reviews ({pendingComments.length})</h3>
             {pendingComments.map(comm => (
               <div key={comm.id} className="bg-white dark:bg-[#111] p-6 rounded-[2.5rem] border border-yellow-500/10 flex flex-col md:flex-row justify-between items-center group shadow-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-500 uppercase text-[10px] mb-1">By: {comm.user_name} on App ID: {comm.app_id}</p>
                    <h4 className="font-bold text-sm italic tracking-tight mb-2 line-clamp-2">"{comm.comment_text}"</h4>
                    <p className="text-xs text-yellow-500 font-bold uppercase mt-1 italic tracking-widest flex items-center gap-1">Rating: {renderStars(comm.rating)}</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0 flex-shrink-0">
                    <button onClick={() => handleCommentAction(comm.id, 'approve')} className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">Approve</button>
                    <button onClick={() => handleCommentAction(comm.id, 'delete')} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                  </div>
               </div>
             ))}
             {pendingComments.length === 0 && <p className="text-gray-500 text-center italic py-20 font-bold uppercase text-[10px] tracking-widest opacity-20 italic">All reviews approved. Orbit is clean.</p>}
          </div>
        )}

        {view === 'reports' && (
          <div className="space-y-4 animate-in fade-in">
             <h3 className="text-xl font-black uppercase text-red-500 italic mb-6 border-l-4 border-red-600 pl-4 tracking-tighter">Incident Control</h3>
             {reports.map(rep_log => (
               <div key={rep_log.id} className="bg-white dark:bg-[#111] p-6 rounded-[2.5rem] border border-red-500/10 flex justify-between items-center group shadow-sm">
                  <div>
                    <h4 className="font-black text-[#2ea64d] uppercase text-sm">{rep_log.app_name}</h4>
                    <p className="text-xs text-red-500 font-bold uppercase mt-1 italic tracking-widest">Reported: "{rep_log.issue_type}"</p>
                  </div>
                  <button onClick={async () => { await supabase.from('reports').delete().eq('id', rep_log.id); fetchData(); }} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
               </div>
             ))}
             {reports.length === 0 && <p className="text-gray-500 text-center italic py-20 font-bold uppercase text-[10px] tracking-widest opacity-20 italic">No incidents in orbit.</p>}
          </div>
        )}

      </div>
    </div>
  )
}