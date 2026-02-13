"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'
import { 
  Upload, Trash2, Edit, Package, Activity, Lock, Settings, BarChart3, 
  Star, PenTool, Image as ImageIcon, LogOut, Layout, AlertTriangle, 
  Smartphone, CheckCircle2, Search, PlusCircle, X, Link as LinkIcon, MessageSquareText
} from 'lucide-react'

// --- GITHUB CONFIGURATION (SECURED) ---
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN; 
const GITHUB_REPO = "DARK772246/APPS-ORBIT";
// ---------------------------------------------

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState('dashboard') 
  const [passwordInput, setPasswordInput] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [adminSearch, setAdminSearch] = useState('')
  
  const [apps, setApps] = useState([])
  const [slides, setSlides] = useState([])
  const [articles, setArticles] = useState([])
  const [reports, setReports] = useState([])
  const [pendingComments, setPendingComments] = useState([])
  const [stats, setStats] = useState({ apps: 0, requests: 0, reports: 0, comments: 0 })
  const [message, setMessage] = useState({ text: '', type: '' })

  const [showSettings, setShowSettings] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const [isFree, setIsFree] = useState(false)
  const [formData, setFormData] = useState({ 
    id: null, title: '', description: '', category: 'App', developer: 'Salman Khan', 
    price: '', original_price: '', download_url: '', icon_url: '', version: '1.0.0', 
    size: '', min_android: '8.0+', whats_new: '', screenshots: [], 
    file_type: 'APK', is_trending: false, is_latest: true, is_pro_gaming: false 
  })

  const [slideData, setSlideData] = useState({ id: null, title: '', description: '', image_url: '', button_link: '', bg_color: 'bg-[#2ea64d]' })
  const [artData, setArtData] = useState({ id: null, title: '', content: '', author: 'Salman Khan', writer: 'Salman AppOrbit', image_url: '' })

  useEffect(() => { 
    fetchAuth();
    if (sessionStorage.getItem('admin_token') === 'SALMAN_ORBIT_ADMIN') setIsLoggedIn(true);
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
        sessionStorage.setItem('admin_token', 'SALMAN_ORBIT_ADMIN');
    } else {
        alert("Invalid Code!")
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_token');
    setView('dashboard');
  }

  async function fetchData() {
    setLoading(true)
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

  const uploadToGitHub = async (file) => {
    if (!GITHUB_TOKEN) {
        alert("Admin: GitHub Token is missing in Netlify/Local Env!");
        return null;
    }
    setUploadProgress(10);
    const tagName = `v${Date.now()}`;
    const fileName = file.name.replace(/\s/g, '_');
    try {
        const releaseRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
            method: 'POST',
            headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag_name: tagName, name: `Release ${tagName}` })
        });
        const releaseData = await releaseRes.json();
        const uploadUrl = releaseData.upload_url.split('{')[0];
        setUploadProgress(40);
        const fileUploadRes = await fetch(`${uploadUrl}?name=${fileName}`, {
            method: 'POST',
            headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': file.type || 'application/octet-stream' },
            body: file
        });
        const fileData = await fileUploadRes.json();
        setUploadProgress(100);
        return fileData.browser_download_url;
    } catch (error) {
        alert("GitHub Upload Error. Check Console.");
        setUploadProgress(0);
        return null;
    }
  };

  const handleFileUpload = async (e, bucket, mode) => {
    const file = e.target.files[0]; if (!file) return;
    setLoading(true);
    if (mode === 'apk') {
        const githubUrl = await uploadToGitHub(file);
        if (githubUrl) setFormData(prev => ({...prev, download_url: githubUrl}));
    } else {
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const { error } = await supabase.storage.from(bucket).upload(fileName, file);
        if (!error) {
            const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
            if (mode === 'icon') setFormData(prev => ({...prev, icon_url: data.publicUrl}));
            if (mode === 'slide') setSlideData(prev => ({...prev, image_url: data.publicUrl}));
            if (mode === 'blog') setArtData(prev => ({...prev, image_url: data.publicUrl}));
            if (mode === 'screenshot') setFormData(prev => ({...prev, screenshots: [...(prev.screenshots || []), data.publicUrl]}));
        }
    }
    setLoading(false);
    setUploadProgress(0);
  }

  const handleSaveApp = async (e) => {
    e.preventDefault(); setLoading(true)
    const { id, ...dataToInsert } = formData
    const finalData = { ...dataToInsert, price: isFree ? 'FREE' : formData.price, is_free: isFree, original_price: isFree ? '0' : formData.original_price }
    const res = formData.id ? await supabase.from('apps').update(finalData).eq('id', id) : await supabase.from('apps').insert([finalData])
    if (!res.error) { setMessage({text:'App Published!', type:'success'}); resetAppForm(); fetchData(); }
    setLoading(false)
  }

  const handleSaveSlide = async (e) => {
    e.preventDefault(); setLoading(true)
    const { id, ...data } = slideData
    const res = slideData.id ? await supabase.from('featured_slides').update(data).eq('id', id) : await supabase.from('featured_slides').insert([data])
    if (!res.error) { fetchData(); setSlideData({id:null, title:'', description:'', image_url:'', button_link:'', bg_color:'bg-[#2ea64d]'}); }
    setLoading(false)
  }

  const handleSaveArticle = async (e) => {
    e.preventDefault(); setLoading(true)
    const slug = artData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    const { id, ...data } = artData
    const res = artData.id ? await supabase.from('articles').update(data).eq('id', id) : await supabase.from('articles').insert([{ ...data, slug }])
    if (!res.error) { fetchData(); setArtData({id:null, title:'', content:'', author:'Salman Khan', writer:'Salman AppOrbit', image_url:''}); }
    setLoading(false)
  }

  const resetAppForm = () => {
    setFormData({ id: null, title: '', description: '', category: 'App', developer: 'Salman Khan', price: '', original_price: '', download_url: '', icon_url: '', version: '1.0.0', size: '', min_android: '8.0+', whats_new: '', screenshots: [], file_type: 'APK', is_trending: false, is_latest: true, is_pro_gaming: false })
    setIsFree(false)
  }

  const renderStars = (count) => {
    return Array(5).fill(null).map((_, i) => (
      <Star key={i} size={10} className={`inline ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
    ));
  };

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 w-full max-w-sm text-center shadow-2xl">
        <div className="w-16 h-16 bg-[#2ea64d] rounded-2xl flex items-center justify-center mx-auto mb-6 italic font-black text-2xl shadow-lg text-white">S</div>
        <h2 className="font-black text-xl mb-8 uppercase italic tracking-widest text-[#2ea64d]">Orbit Control</h2>
        <input type="password" placeholder="Key..." className="w-full bg-black border border-white/10 p-4 rounded-xl mb-4 text-center outline-none focus:border-[#2ea64d] tracking-[0.5em] text-white" onChange={e => setPasswordInput(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-[#2ea64d] text-white font-bold py-4 rounded-xl uppercase text-[10px]">Access Dashboard</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter italic">Command <span className="text-[#2ea64d]">Center</span></h1>
          <div className="flex gap-4">
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-white/5 rounded-xl border border-white/5 hover:text-[#2ea64d] transition-all"><Settings size={20}/></button>
            <button onClick={handleLogout} className="p-2 bg-white/5 rounded-xl border border-white/5 hover:text-red-500 transition-all"><LogOut size={20}/></button>
          </div>
        </header>

        {showSettings && (
          <div className="mb-10 p-8 bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem]">
            <h3 className="text-xs font-black uppercase mb-4 flex items-center gap-2"><Lock size={16}/> Security Update</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" className="flex-1 bg-black border border-white/10 p-4 rounded-xl text-sm outline-none" placeholder="New Secret Key" onChange={(e) => setNewPassword(e.target.value)} />
              <button onClick={async () => { await supabase.from('admin_settings').update({setting_value: newPassword}).eq('setting_key','admin_password'); setDbPassword(newPassword); setShowSettings(false); alert("Key Changed!"); }} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">Update Orbit Key</button>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 border-b border-white/5">
          {[ 
            {id:'dashboard', l:'Stats', i:BarChart3, c:'bg-blue-600'}, 
            {id:'apps', l:'Apps', i:Package, c:'bg-[#2ea64d]'}, 
            {id:'slider', l:'Slider', i:Layout, c:'bg-purple-600'}, 
            {id:'blog', l:'Blog', i:PenTool, c:'bg-orange-500'}, 
            {id:'reviews', l:'Reviews', i:MessageSquareText, c:'bg-yellow-600'}, 
            {id:'reports', l:'Incidents', i:AlertTriangle, c:'bg-red-600'} 
          ].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${view === t.id ? `${t.c} text-white shadow-lg` : 'bg-white/5'}`}>
              <t.i size={14}/> {t.l} {t.id === 'reviews' && pendingComments.length > 0 && <span className="w-5 h-5 bg-white text-yellow-600 rounded-full flex items-center justify-center -mr-1">{pendingComments.length}</span>}
            </button>
          ))}
        </div>

        {message.text && <div className={`mb-6 p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-[#2ea64d]/10 text-[#2ea64d]' : 'bg-red-500/10 text-red-500'}`}>{message.text}</div>}

        {view === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 animate-in fade-in">
             {[ 
               {l:'Orbit Apps', v:stats.apps, i:Package, c:'text-[#2ea64d]'}, 
               {l:'User Requests', v:stats.requests, i:Activity, c:'text-blue-500'}, 
               {l:'Pending Reviews', v:stats.comments, i:MessageSquareText, c:'text-yellow-500'},
               {l:'Orbit Blogs', v:articles.length, i:PenTool, c:'text-orange-500'}, 
               {l:'Bug Reports', v:stats.reports, i:AlertTriangle, c:'text-red-500'} 
             ].map(s => (
                <div key={s.l} className="bg-[#111] p-10 rounded-[3rem] border border-white/5 text-center shadow-sm">
                  <s.i className={`mx-auto mb-4 ${s.c}`} size={32}/><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.l}</p><p className="text-4xl font-black mt-1">{s.v}</p>
                </div>
             ))}
          </div>
        )}

        {view === 'apps' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <form onSubmit={handleSaveApp} className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 space-y-4 shadow-sm h-fit font-sans">
                <h3 className="text-[10px] font-black uppercase text-[#2ea64d] mb-4">Application Config</h3>
                
                <div className="h-28 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center relative bg-black overflow-hidden">
                  {formData.icon_url ? <img src={formData.icon_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'icon')} />
                </div>

                <input required className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs outline-none focus:ring-1 ring-[#2ea64d] text-white" placeholder="App Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-3">
                   <input className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs outline-none text-white" placeholder="Size (MB)" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
                   <input className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs outline-none text-white" placeholder="Developer" value={formData.developer} onChange={e => setFormData({...formData, developer: e.target.value})} />
                </div>

                <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-black text-[10px] font-bold text-gray-500 uppercase italic">
                  <span>Free Application?</span>
                  <input type="checkbox" checked={isFree} onChange={() => setIsFree(!isFree)} className="w-4 h-4 accent-[#2ea64d]" />
                </div>

                {!isFree && <input required className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs outline-none font-bold text-[#2ea64d]" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />}
                
                <textarea required className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs outline-none italic text-white" placeholder="Description" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                
                <select className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs text-white" value={formData.file_type || 'APK'} onChange={e => setFormData({...formData, file_type: e.target.value})}>
                   <option value="APK">APK (Standard)</option><option value="XAPK">XAPK (Split/OBB)</option><option value="ZIP">ZIP (Archive)</option>
                </select>

                <div className="flex gap-2">
                  <div className="flex-1 p-3 border border-white/10 rounded-xl bg-black text-[10px] font-bold text-gray-500 uppercase italic flex justify-between items-center">
                    <span>Trending?</span>
                    <input type="checkbox" checked={formData.is_trending || false} onChange={(e) => setFormData({...formData, is_trending: e.target.checked})} className="w-4 h-4 accent-[#2ea64d]" />
                  </div>
                  <div className="flex-1 p-3 border border-white/10 rounded-xl bg-black text-[10px] font-bold text-gray-500 uppercase italic flex justify-between items-center">
                    <span>Pro Gaming?</span>
                    <input type="checkbox" checked={formData.is_pro_gaming || false} onChange={(e) => setFormData({...formData, is_pro_gaming: e.target.checked})} className="w-4 h-4 accent-[#2ea64d]" />
                  </div>
                </div>

                <div className="p-3 border border-dashed border-white/10 rounded-xl bg-black">
                   <p className="text-[8px] font-black uppercase text-gray-500 mb-2">Gallery ({formData.screenshots?.length || 0}/4)</p>
                   <div className="flex gap-2 overflow-x-auto pb-1">
                      <div className="w-10 h-10 bg-[#111] border border-white/10 rounded-lg flex items-center justify-center relative cursor-pointer"><PlusCircle size={14}/><input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'screenshot')} /></div>
                      {formData.screenshots?.map((s_img, s_idx) => (
                        <div key={s_idx} className="relative flex-shrink-0"><img src={s_img} className="w-10 h-10 rounded-lg object-cover" /><button type="button" onClick={() => setFormData(prev => ({...prev, screenshots: prev.screenshots.filter((_, idx) => idx !== s_idx)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"><X size={8}/></button></div>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex items-center justify-center p-3 border border-dashed border-white/10 rounded-xl relative hover:border-[#2ea64d] transition-all cursor-pointer">
                      <Upload size={14} className="mr-2 text-[#2ea64d]"/><span className="text-[9px] font-black uppercase text-gray-500">{uploadProgress > 0 ? `GitHub Syncing ${Math.round(uploadProgress)}%` : (formData.download_url && formData.download_url.includes('github') ? 'GitHub Ready ✅' : 'Drop APK (Fast)')}</span>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'apks', 'apk')} />
                   </div>
                   <input className="w-full bg-black border border-white/10 p-3 rounded-xl text-[10px] text-white" placeholder="Manual URL" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} />
                </div>
                <button disabled={loading} className="w-full bg-[#2ea64d] text-white font-black py-4 rounded-xl uppercase text-[10px] shadow-lg active:scale-95 transition-all">Synchronize</button>
             </form>

             <div className="lg:col-span-2 space-y-4">
                <div className="relative mb-4">
                   <Search size={14} className="absolute left-3 top-3 text-gray-500" />
                   <input type="text" placeholder="Search inventory..." className="w-full bg-[#111] p-3 pl-10 rounded-xl border border-white/5 text-xs outline-none focus:border-[#2ea64d] text-white" onChange={e => setAdminSearch(e.target.value)} />
                </div>
                {apps.filter(item => item.title.toLowerCase().includes(adminSearch.toLowerCase())).map(app_item => (
                  <div key={app_item.id} className="bg-[#111] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-[#2ea64d] transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <img src={app_item.icon_url || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                      <div><h4 className="font-bold text-sm uppercase italic">{app_item.title}</h4><p className="text-[10px] font-black text-[#2ea64d] uppercase tracking-widest">{app_item.price}</p></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setFormData(app_item); setIsFree(app_item.is_free); window.scrollTo({top:0, behavior:'smooth'}) }} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Edit size={16}/></button>
                      <button onClick={async () => { if(confirm("Delete?")){ await supabase.from('apps').delete().eq('id', app_item.id); fetchData(); } }} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
        
        {/* Slider, Blog, Reviews, Reports logic (skipped for length, keep your existing ones) */}
        {view === 'reviews' && (
          <div className="space-y-4 animate-in fade-in">
             <h3 className="text-xl font-black uppercase text-yellow-500 italic mb-6 border-l-4 border-yellow-600 pl-4 tracking-tighter">Pending Reviews ({pendingComments.length})</h3>
             {pendingComments.map(comm => (
               <div key={comm.id} className="bg-[#111] p-6 rounded-[2.5rem] border border-yellow-500/10 flex flex-col md:flex-row justify-between items-center group shadow-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-500 uppercase text-[10px] mb-1">User: {comm.user_name}</p>
                    <h4 className="font-bold text-sm italic mb-2 line-clamp-2">"{comm.comment_text}"</h4>
                    <p className="text-xs text-yellow-500 flex gap-1">{renderStars(comm.rating)}</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button onClick={() => handleCommentAction(comm.id, 'approve')} className="p-3 bg-green-500/10 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Approve</button>
                    <button onClick={() => handleCommentAction(comm.id, 'delete')} className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Trash2 size={20}/></button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  )
}