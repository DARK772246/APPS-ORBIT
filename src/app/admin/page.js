"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { 
  Upload, Trash2, Edit, Package, Activity, LogOut, ImageIcon, PlusCircle, X, Globe, MessageSquareText, ShieldAlert, Cpu, Zap
} from 'lucide-react'

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
  
  const [apps, setApps] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [stats, setStats] = useState({ apps: 0, requests: 0, reports: 0, comments: 0 });

  const [formData, setFormData] = useState({ 
    id: null, title: '', description: '', category: 'App', developer: 'Salman Khan', 
    price: 'FREE', download_url: '', icon_url: '', version: '1.0.0', 
    size: '', file_type: 'APK', is_trending: false, is_latest: true, is_pro_gaming: false 
  });

  useEffect(() => { 
    fetchAuth();
    if (sessionStorage.getItem('admin_token') === 'SALMAN_ORBIT_ADMIN') setIsLoggedIn(true);
  }, [])

  useEffect(() => { if (isLoggedIn) fetchData() }, [isLoggedIn])

  async function fetchAuth() {
    try {
      const { data } = await supabase.from('admin_settings').select('setting_value').eq('setting_key', 'admin_password').single()
      setDbPassword(data?.setting_value || '772246')
    } catch (e) { setDbPassword('772246') }
  }

  async function fetchData() {
    setLoading(true)
    const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false });
    const { data: comm } = await supabase.from('comments').select('*').eq('approved', false);
    const { data: reqs } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
    setApps(a || []); setPendingComments(comm || []); setUserRequests(reqs || []);
    setStats({ apps: a?.length || 0, requests: reqs?.length || 0, reports: 0, comments: comm?.length || 0 });
    setLoading(false);
  }

  const uploadToGitHub = async (file) => {
    if (!GITHUB_TOKEN) { alert("Token missing!"); return null; }
    setUploadProgress(10);
    const tagName = `v${Date.now()}`;
    const fileName = file.name.replace(/\s/g, '_');
    try {
      const relRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
        method: 'POST',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_name: tagName, name: `Release ${tagName}`, draft: false, prerelease: false })
      });
      const releaseData = await relRes.json();
      const uploadUrl = releaseData.upload_url.split('{')[0] + `?name=${fileName}`;
      setUploadProgress(40);
      const fileUploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/octet-stream' },
        body: file
      });
      const assetData = await fileUploadRes.json();
      setUploadProgress(100);
      return assetData.browser_download_url;
    } catch (error) { setUploadProgress(0); return null; }
  };

  const handleFileUpload = async (e, mode) => {
    const file = e.target.files[0]; if (!file) return;
    setLoading(true);
    if (mode === 'apk') {
      const url = await uploadToGitHub(file);
      if (url) setFormData(prev => ({...prev, download_url: url}));
    } else {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('icons').upload(fileName, file);
      if (!error) {
        const { data } = supabase.storage.from('icons').getPublicUrl(fileName);
        setFormData(prev => ({...prev, icon_url: data.publicUrl}));
      }
    }
    setLoading(false); setUploadProgress(0);
  }

  const handleSaveApp = async (e) => {
    e.preventDefault(); setLoading(true);
    const { id, ...data } = formData;
    const res = id ? await supabase.from('apps').update(data).eq('id', id) : await supabase.from('apps').insert([data]);
    if (!res.error) { resetAppForm(); fetchData(); alert("Success!"); }
    setLoading(false);
  }

  const resetAppForm = () => setFormData({ id: null, title: '', description: '', category: 'App', developer: 'Salman Khan', price: 'FREE', download_url: '', icon_url: '', version: '1.0.0', size: '', file_type: 'APK', is_trending: false, is_latest: true, is_pro_gaming: false });

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white font-sans">
      <div className="glass-panel p-10 rounded-[3rem] w-full max-w-sm text-center shadow-2xl">
        <div className="w-16 h-16 bg-[#2ea64d] squircle flex items-center justify-center mx-auto mb-6 font-black text-3xl">S</div>
        <input type="password" placeholder="PIN" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl mb-4 text-center text-white" onChange={e => setPasswordInput(e.target.value)} />
        <button onClick={() => { if(passwordInput === dbPassword || passwordInput === '772246') { setIsLoggedIn(true); sessionStorage.setItem('admin_token', 'SALMAN_ORBIT_ADMIN'); } else alert("Denied"); }} className="w-full bg-[#2ea64d] text-white font-black py-4 rounded-xl uppercase text-[10px]">Access Center</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto pb-32">
        <header className="flex justify-between items-center mb-8 bg-white/5 p-6 rounded-[2rem] border border-white/5 shadow-xl">
          <h1 className="text-xl font-black uppercase italic text-white">Orbit <span className="text-blue-500">Command</span></h1>
          <button onClick={() => { setIsLoggedIn(false); sessionStorage.removeItem('admin_token'); }} className="p-3 bg-red-500/10 text-red-500 rounded-xl"><LogOut size={18}/></button>
        </header>

        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {[{id:'dashboard', l:'Status', i:Activity, c:'bg-blue-600'}, {id:'apps', l:'Programs', i:Package, c:'bg-[#2ea64d]'}, {id:'reviews', l:'Logs', i:MessageSquareText, c:'bg-yellow-600'}, {id:'requests', l:'Targets', i:Globe, c:'bg-cyan-600'}].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} className={`px-6 py-3 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${view === t.id ? `${t.c} text-white` : 'bg-white/5 text-gray-500'}`}>{t.l}</button>
          ))}
        </div>

        {view === 'dashboard' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in">
             {[{l:'Programs', v:stats.apps, i:Package, c:'text-[#2ea64d]'}, {l:'Requests', v:stats.requests, i:Globe, c:'text-cyan-500'}, {l:'Pending Logs', v:stats.comments, i:MessageSquareText, c:'text-yellow-500'}, {l:'Status', v:'Online', i:Cpu, c:'text-red-500'}].map(s => (
                <div key={s.l} className="glass-panel p-8 rounded-[2rem] text-center border-white/5"><s.i className="mx-auto mb-3" color="white" size={24}/><p className="text-[9px] font-black uppercase text-gray-500">{s.l}</p><p className="text-3xl font-black text-white">{s.v}</p></div>
             ))}
          </div>
        )}

        {view === 'apps' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-2">
             <form onSubmit={handleSaveApp} className="glass-panel p-8 rounded-[2.5rem] space-y-4 border-white/5 h-fit shadow-2xl">
                <div className="h-20 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center relative bg-black/40 overflow-hidden">
                   {formData.icon_url ? <img src={formData.icon_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-600" />}
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icon')} />
                </div>
                <input required className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-white" placeholder="App Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <div className="flex gap-2">
                   <select className="flex-1 bg-black border border-white/5 p-3 rounded-xl text-[9px] font-black text-gray-300" value={formData.file_type} onChange={e => setFormData({...formData, file_type: e.target.value})}><option value="APK">APK</option><option value="XAPK">XAPK</option><option value="ZIP">ZIP</option></select>
                   <div className="flex-1 p-3 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center"><span className="text-[8px] font-black text-gray-500 uppercase">Gaming?</span><input type="checkbox" checked={formData.is_pro_gaming} onChange={e => setFormData({...formData, is_pro_gaming: e.target.checked})} className="accent-[#2ea64d]" /></div>
                </div>
                <div className="p-4 border border-dashed border-white/10 rounded-2xl bg-black/20 text-center relative cursor-pointer">
                   <Upload size={14} className="mx-auto mb-1 text-[#2ea64d]"/><span className="text-[8px] font-black text-gray-400 uppercase">{uploadProgress > 0 ? `SYNCING ${Math.round(uploadProgress)}%` : 'DROP APK (GITHUB)'}</span>
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'apk')} />
                </div>
                <button className="w-full bg-[#2ea64d] text-white font-black py-4 rounded-xl uppercase text-[9px] tracking-widest shadow-lg">SYNC TO ORBIT</button>
                <button type="button" onClick={resetAppForm} className="w-full text-gray-500 text-[8px] font-black uppercase text-center underline">Reset Form</button>
             </form>
             <div className="lg:col-span-2 space-y-3">
                {apps.map(a => (
                  <div key={a.id} className="glass-panel p-4 rounded-[1.5rem] flex items-center justify-between border-white/5 hover:border-[#2ea64d] transition-all">
                    <div className="flex items-center gap-4"><img src={a.icon_url} className="w-10 h-10 squircle object-cover" /><div><h4 className="font-black text-xs uppercase italic text-white">{a.title}</h4><p className="text-[8px] text-gray-500 font-bold uppercase">{a.file_type} Sync</p></div></div>
                    <div className="flex gap-2"><button onClick={() => setFormData(a)} className="p-2 text-blue-400"><Edit size={14}/></button><button onClick={async () => { if(confirm("Purge?")) { await supabase.from('apps').delete().eq('id', a.id); fetchData(); } }} className="p-2 text-red-500"><Trash2 size={14}/></button></div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  )
}