"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { 
  Upload, Trash2, Edit, Package, Activity, Lock, Settings, BarChart3, 
  Star, PenTool, Image as ImageIcon, LogOut, Layout, AlertTriangle, 
  PlusCircle, X, MessageSquareText, ShieldAlert, Cpu, CheckCircle2, Globe, Send,
  FileCode, Layers, Zap
} from 'lucide-react'

// --- GITHUB CONFIG (IMPORTANT: Set Key in Netlify) ---
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN; 
const GITHUB_REPO = "DARK772246/APPS-ORBIT";

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState('dashboard') 
  const [passwordInput, setPasswordInput] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [adminSearch, setAdminSearch] = useState('')
  
  // Data States
  const [apps, setApps] = useState([])
  const [slides, setSlides] = useState([])
  const [articles, setArticles] = useState([])
  const [reports, setReports] = useState([])
  const [pendingComments, setPendingComments] = useState([])
  const [userRequests, setUserRequests] = useState([])
  const [stats, setStats] = useState({ apps: 0, requests: 0, reports: 0, comments: 0 })
  const [message, setMessage] = useState({ text: '', type: '' })

  // Form States
  const [formData, setFormData] = useState({ 
    id: null, title: '', description: '', category: 'App', developer: 'Salman Khan', 
    price: 'FREE', original_price: '0', download_url: '', icon_url: '', version: '1.0.0', 
    size: '', min_android: '8.0+', whats_new: '', screenshots: [], 
    file_type: 'APK', is_trending: false, is_latest: true, is_pro_gaming: false 
  })

  const [slideData, setSlideData] = useState({ id: null, title: '', description: '', image_url: '', button_link: '', bg_color: 'bg-[#2ea64d]' })
  const [artData, setArtData] = useState({ id: null, title: '', content: '', author: 'Salman Khan', image_url: '' })

  useEffect(() => { 
    fetchAuth();
    if (sessionStorage.getItem('admin_token') === 'SALMAN_ORBIT_ADMIN') setIsLoggedIn(true);
  }, [])

  useEffect(() => { if (isLoggedIn) fetchData() }, [isLoggedIn])

  async function fetchAuth() {
    try {
      const { data } = await supabase.from('admin_settings').select('setting_value').eq('setting_key', 'admin_password').single()
      if (data) setDbPassword(data.setting_value)
      else setDbPassword('772246')
    } catch (e) { setDbPassword('772246') }
  }

  async function fetchData() {
    setLoading(true)
    try {
      const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
      const { data: s } = await supabase.from('featured_slides').select('*').order('id', { ascending: false })
      const { data: r } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
      const { data: rep } = await supabase.from('reports').select('*').order('created_at', { ascending: false })
      const { data: comm } = await supabase.from('comments').select('*').eq('approved', false).order('created_at', { ascending: false })
      const { data: reqs } = await supabase.from('requests').select('*').order('created_at', { ascending: false })
      
      if (a) setApps(a); if (s) setSlides(s); if (r) setArticles(r); if (rep) setReports(rep);
      if (comm) setPendingComments(comm); if (reqs) setUserRequests(reqs);

      setStats({ apps: a?.length || 0, requests: reqs?.length || 0, reports: rep?.length || 0, comments: comm?.length || 0 })
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  // --- LOGIC: GITHUB FAST UPLOAD ---
  const uploadToGitHub = async (file) => {
    if (!GITHUB_TOKEN) { alert("Missing NEXT_PUBLIC_GITHUB_TOKEN in Env Variables!"); return null; }
    setUploadProgress(10);
    const tagName = `v${Date.now()}`;
    const fileName = file.name.replace(/\s/g, '_');
    try {
        const releaseRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag_name: tagName, name: `Release ${tagName}` })
        });
        const releaseData = await releaseRes.json();
        const uploadUrl = releaseData.upload_url.split('{')[0] + `?name=${fileName}`;
        setUploadProgress(40);
        const fileUploadRes = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/octet-stream' },
            body: file
        });
        const fileData = await fileUploadRes.json();
        setUploadProgress(100);
        return fileData.browser_download_url;
    } catch (error) { setUploadProgress(0); return null; }
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
    setLoading(false); setUploadProgress(0);
  }

  // --- SAVE ACTIONS ---
  const handleSaveApp = async (e) => {
    e.preventDefault(); setLoading(true)
    const { id, ...dataToInsert } = formData
    const finalData = { ...dataToInsert, is_free: true }
    const res = id ? await supabase.from('apps').update(finalData).eq('id', id) : await supabase.from('apps').insert([finalData])
    if (!res.error) { setMessage({text:'Orbit Synchronized', type:'success'}); resetAppForm(); fetchData(); }
    setLoading(false)
  }

  const handleSaveSlide = async (e) => {
    e.preventDefault(); setLoading(true)
    const { id, ...data } = slideData
    const res = id ? await supabase.from('featured_slides').update(data).eq('id', id) : await supabase.from('featured_slides').insert([data])
    if (!res.error) { fetchData(); setSlideData({id:null, title:'', description:'', image_url:'', button_link:'', bg_color:'bg-[#2ea64d]'}); }
    setLoading(false)
  }

  const handleSaveArticle = async (e) => {
    e.preventDefault(); setLoading(true)
    const slug = artData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    const { id, ...data } = artData
    const res = id ? await supabase.from('articles').update(data).eq('id', id) : await supabase.from('articles').insert([{ ...data, slug }])
    if (!res.error) { fetchData(); setArtData({id:null, title:'', content:'', author:'Salman Khan', image_url:''}); }
    setLoading(false)
  }

  const handleCommentAction = async (id, action) => {
    setLoading(true);
    if (action === 'approve') await supabase.from('comments').update({ approved: true }).eq('id', id);
    else await supabase.from('comments').delete().eq('id', id);
    fetchData(); setLoading(false);
  }

  const resetAppForm = () => {
    setFormData({ id: null, title: '', description: '', category: 'App', developer: 'Salman Khan', price: 'FREE', original_price: '0', download_url: '', icon_url: '', version: '1.0.0', size: '', min_android: '8.0+', whats_new: '', screenshots: [], file_type: 'APK', is_trending: false, is_latest: true, is_pro_gaming: false })
  }

  // --- UI COMPONENTS ---
  const renderStars = (count) => Array(5).fill(0).map((_, i) => <Star key={i} size={10} className={i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'} />);

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white font-sans">
      <div className="glass-panel p-12 rounded-[4rem] w-full max-w-sm text-center shadow-2xl border-white/5">
        <div className="w-20 h-20 bg-[#2ea64d] squircle flex items-center justify-center mx-auto mb-8 font-black text-4xl shadow-xl text-white">S</div>
        <h2 className="font-black text-2xl mb-8 uppercase italic tracking-tighter">Orbit <span className="text-[#2ea64d]">Control</span></h2>
        <input type="password" placeholder="ACCESS PIN" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 text-center outline-none focus:border-[#2ea64d] tracking-[0.5em] text-white" onChange={e => setPasswordInput(e.target.value)} />
        <button onClick={() => { if(passwordInput === dbPassword || passwordInput === '772246') { setIsLoggedIn(true); sessionStorage.setItem('admin_token', 'SALMAN_ORBIT_ADMIN'); } else alert("Invalid Pin"); }} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-[#2ea64d] hover:text-white transition-all">Verify Access</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto pb-32">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white/5 p-8 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-600 squircle flex items-center justify-center font-black text-xl italic">C</div>
             <div>
               <h1 className="text-2xl font-black uppercase italic tracking-tighter">Command <span className="text-blue-500">Center</span></h1>
               <p className="text-[9px] font-bold text-gray-500 uppercase">Operator: Salman Khan</p>
             </div>
          </div>
          <button onClick={() => { setIsLoggedIn(false); sessionStorage.removeItem('admin_token'); }} className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"><LogOut size={20}/></button>
        </header>

        {/* NAVIGATION TABS */}
        <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-2">
          {[ 
            {id:'dashboard', l:'Status', i:BarChart3, c:'bg-blue-600'}, 
            {id:'apps', l:'Programs', i:Package, c:'bg-[#2ea64d]'}, 
            {id:'slider', l:'Hero', i:Layout, c:'bg-purple-600'}, 
            {id:'blog', l:'Insights', i:PenTool, c:'bg-orange-500'},
            {id:'reviews', l:'Logs', i:MessageSquareText, c:'bg-yellow-600'},
            {id:'requests', l:'Targeting', i:Globe, c:'bg-cyan-600'}
          ].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} className={`px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all border border-white/5 ${view === t.id ? `${t.c} text-white shadow-xl scale-105` : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
              <t.i size={16}/> {t.l}
            </button>
          ))}
        </div>

        {/* --- VIEW CONTENT --- */}

        {view === 'dashboard' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in">
             {[ {l:'Programs', v:stats.apps, i:Package, c:'text-[#2ea64d]'}, {l:'User Requests', v:stats.requests, i:Globe, c:'text-cyan-500'}, {l:'Pending Logs', v:stats.comments, i:MessageSquareText, c:'text-yellow-500'}, {l:'Security Risk', v:stats.reports, i:ShieldAlert, c:'text-red-500'} ].map(s => (
                <div key={s.l} className="glass-panel p-10 rounded-[3rem] text-center border-white/5 group">
                  <s.i className={`mx-auto mb-4 ${s.c}`} size={32}/><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.l}</p><p className="text-5xl font-black mt-2 italic text-white">{s.v}</p>
                </div>
             ))}
          </div>
        )}

        {view === 'apps' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <form onSubmit={handleSaveApp} className="glass-panel p-8 rounded-[3rem] space-y-6 border-white/5 shadow-2xl h-fit">
                <div className="h-24 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center relative bg-black/40 overflow-hidden">
                   {formData.icon_url ? <img src={formData.icon_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-600" />}
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'icon')} />
                </div>
                <input required className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-white" placeholder="App Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <div className="flex gap-2">
                   <select className="flex-1 bg-black border border-white/5 p-3 rounded-xl text-[10px] font-black uppercase text-gray-300" value={formData.file_type} onChange={e => setFormData({...formData, file_type: e.target.value})}><option value="APK">APK</option><option value="XAPK">XAPK</option><option value="ZIP">ZIP</option></select>
                   <div className="flex-1 p-3 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center"><span className="text-[8px] font-black uppercase text-gray-500 italic">Pro Gaming?</span><input type="checkbox" checked={formData.is_pro_gaming} onChange={e => setFormData({...formData, is_pro_gaming: e.target.checked})} className="accent-[#2ea64d]" /></div>
                </div>
                <div className="p-4 border border-dashed border-white/10 rounded-2xl bg-black/20 text-center relative cursor-pointer">
                   <Upload size={16} className="mx-auto mb-2 text-[#2ea64d]"/><span className="text-[9px] font-black uppercase text-gray-400">{uploadProgress > 0 ? `SYNCING ${Math.round(uploadProgress)}%` : 'DROP APK (GITHUB)'}</span>
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'apks', 'apk')} />
                </div>
                <button className="w-full bg-[#2ea64d] text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg">SYNC MISSION</button>
                <button type="button" onClick={resetAppForm} className="w-full text-gray-600 text-[8px] font-black uppercase tracking-widest">Reset Module</button>
             </form>
             <div className="lg:col-span-2 space-y-4">
                {apps.map(a => (
                  <div key={a.id} className="glass-panel p-4 rounded-[2rem] flex items-center justify-between border-white/5 hover:border-[#2ea64d] transition-all">
                    <div className="flex items-center gap-4"><img src={a.icon_url} className="w-12 h-12 squircle object-cover" /><div><h4 className="font-black text-sm uppercase italic text-white">{a.title}</h4><p className="text-[9px] text-gray-500 font-bold uppercase">{a.file_type} Sync</p></div></div>
                    <div className="flex gap-2"><button onClick={() => setFormData(a)} className="p-3 bg-white/5 rounded-xl text-blue-400"><Edit size={16}/></button><button onClick={async () => { if(confirm("Purge Data?")) { await supabase.from('apps').delete().eq('id', a.id); fetchData(); } }} className="p-3 bg-white/5 rounded-xl text-red-500"><Trash2 size={16}/></button></div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'slider' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <form onSubmit={handleSaveSlide} className="glass-panel p-8 rounded-[3rem] space-y-4 border-white/5 h-fit">
                <div className="h-24 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center relative bg-black/40 overflow-hidden">{slideData.image_url ? <img src={slideData.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-600" />}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'slide')} /></div>
                <input required className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-white" placeholder="Hero Title" value={slideData.title} onChange={e => setSlideData({...slideData, title: e.target.value})} />
                <input className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-white" placeholder="Link" value={slideData.button_link} onChange={e => setSlideData({...slideData, button_link: e.target.value})} />
                <button className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl uppercase text-[10px]">Deploy Hero</button>
             </form>
             <div className="lg:col-span-2 space-y-4">{slides.map(s => (<div key={s.id} className="glass-panel p-4 rounded-[2rem] flex justify-between items-center border-white/5"><h4 className="font-black text-xs uppercase italic text-white">{s.title}</h4><button onClick={async () => {await supabase.from('featured_slides').delete().eq('id', s.id); fetchData();}} className="text-red-500 p-2"><Trash2 size={18}/></button></div>))}</div>
          </div>
        )}

        {view === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <form onSubmit={handleSaveArticle} className="glass-panel p-8 rounded-[3rem] space-y-4 border-white/5 h-fit">
                <div className="h-24 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center relative bg-black/40 overflow-hidden">{artData.image_url ? <img src={artData.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-600" />}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'blog')} /></div>
                <input required className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-white" placeholder="Insight Title" value={artData.title} onChange={e => setArtData({...artData, title: e.target.value})} />
                <textarea required className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-white h-40" placeholder="Content..." value={artData.content} onChange={e => setArtData({...artData, content: e.target.value})} />
                <button className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl uppercase text-[10px]">Broadcast Insight</button>
             </form>
             <div className="lg:col-span-2 space-y-4">{articles.map(art => (<div key={art.id} className="glass-panel p-4 rounded-[2rem] flex justify-between items-center border-white/5"><h4 className="font-black text-xs uppercase italic text-white">{art.title}</h4><button onClick={async () => {await supabase.from('articles').delete().eq('id', art.id); fetchData();}} className="text-red-500 p-2"><Trash2 size={18}/></button></div>))}</div>
          </div>
        )}

        {view === 'reviews' && (
          <div className="space-y-4 animate-in slide-in-from-right-4">
             <h3 className="text-xl font-black uppercase text-yellow-500 italic mb-8 border-l-4 border-yellow-600 pl-6">Transmission Logs ({pendingComments.length})</h3>
             {pendingComments.map(comm => (
               <div key={comm.id} className="glass-panel p-6 rounded-[2.5rem] border border-yellow-500/10 flex flex-col md:flex-row justify-between items-center">
                  <div className="flex-1 min-w-0"><p className="font-black text-gray-500 text-[10px] mb-1">Source: {comm.user_name}</p><h4 className="font-bold text-sm italic text-white">"{comm.comment_text}"</h4><p className="mt-2">{renderStars(comm.rating)}</p></div>
                  <div className="flex gap-2 mt-4 md:mt-0"><button onClick={() => handleCommentAction(comm.id, 'approve')} className="px-6 py-3 bg-green-500/10 text-green-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">Approve</button><button onClick={() => handleCommentAction(comm.id, 'delete')} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button></div>
               </div>
             ))}
             {pendingComments.length === 0 && <p className="text-center py-20 text-gray-600 italic font-black uppercase text-xs tracking-widest opacity-30">No pending logs.</p>}
          </div>
        )}

        {view === 'requests' && (
          <div className="space-y-4 animate-in slide-in-from-left-4">
             <h3 className="text-xl font-black uppercase text-cyan-500 italic mb-8 border-l-4 border-cyan-600 pl-6">Tracking Targets ({userRequests.length})</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userRequests.map(req => (
                  <div key={req.id} className="glass-panel p-6 rounded-[2.5rem] border border-cyan-500/10 flex justify-between items-center">
                    <div><h4 className="font-black uppercase italic text-sm text-white">{req.app_name}</h4><p className="text-[9px] text-cyan-500 font-bold uppercase tracking-widest mt-1">Requested by: {req.user_name}</p><p className="text-xs text-gray-500 italic mt-2">"{req.description || 'No intel provided.'}"</p></div>
                    <button onClick={async () => {await supabase.from('requests').delete().eq('id', req.id); fetchData();}} className="p-3 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                  </div>
                ))}
             </div>
             {userRequests.length === 0 && <p className="text-center py-20 text-gray-600 italic font-black uppercase text-xs tracking-widest opacity-30">No active targets.</p>}
          </div>
        )}

      </div>
    </div>
  )
}