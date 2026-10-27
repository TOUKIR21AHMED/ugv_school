import NoticePdfManager from './NoticePdfManager.jsx'
import AdminModules from './AdminModules.jsx'
import {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {LogOut,Plus,Trash2,Pencil,Save,ArrowLeft,LayoutDashboard} from 'lucide-react'

const API=import.meta.env.VITE_API_URL||'/api'
async function request(path,opts={}) {
  const res=await fetch(`${API}${path}`,{credentials:'include',...opts,headers:{'Content-Type':'application/json',...(opts.headers||{})}})
  const body=await res.json().catch(()=>({}))
  if(!res.ok) throw new Error(body.message||'Request failed')
  return body
}
const empty={title:'',description:'',category:'সাধারণ',published:true}
export default function AdminPage(){
  const [user,setUser]=useState(null)
  const [checked,setChecked]=useState(false)
  const [form,setForm]=useState(empty)
  const [login,setLogin]=useState({email:'',password:''})
  const [items,setItems]=useState([])
  const [editing,setEditing]=useState(null)
  const [error,setError]=useState('')
  const [working,setWorking]=useState(false)
  const [notice,setNotice]=useState('')
  const [heroImage,setHeroImage]=useState(null)
  const [heroFile,setHeroFile]=useState(null)
  const [heroBusy,setHeroBusy]=useState(false)
  const [heroMessage,setHeroMessage]=useState('')
  const [heroError,setHeroError]=useState('')
  const loadHero=async()=>{try{const r=await request('/site-settings');setHeroImage(r.heroImage)}catch{}}
  const uploadHero=async(e)=>{
    e.preventDefault();if(!heroFile)return
    const formElement=e.currentTarget
    setHeroBusy(true);setHeroError('');setHeroMessage('')
    try{
      const fd=new FormData();fd.append('image',heroFile)
      const res=await fetch(`${API}/admin/hero-image`,{method:'POST',credentials:'include',body:fd})
      const data=await res.json().catch(()=>({}))
      if(!res.ok)throw Error(data.message||'Image upload failed')
      setHeroImage(data.heroImage);setHeroFile(null)
      formElement.reset()
      setHeroMessage('নতুন Hero Image সফলভাবে আপলোড হয়েছে।')
    }catch(err){setHeroError(err.message)}finally{setHeroBusy(false)}
  }
  const load=async()=>{const result=await request('/admin/notices');setItems(result.notices)}
  useEffect(()=>{request('/auth/me').then(data=>{setUser(data.user);return request('/admin/notices')}).then(data=>{setItems(data.notices);loadHero()}).catch(()=>{}).finally(()=>setChecked(true))},[])
  const submitLogin=async(e)=>{e.preventDefault();setError('');setWorking(true);try{const data=await request('/auth/login',{method:'POST',body:JSON.stringify(login)});setUser(data.user);setLogin({email:'',password:''});await load();await loadHero()}catch(e){setError(e.message)}finally{setWorking(false)}}
  const submitNotice=async(e)=>{e.preventDefault();setError('');setNotice('');setWorking(true);try{await request(editing?`/admin/notices/${editing}`:'/admin/notices',{method:editing?'PUT':'POST',body:JSON.stringify(form)});await load();setForm(empty);setEditing(null);setNotice('নোটিশ সফলভাবে সংরক্ষিত হয়েছে।')}catch(e){setError(e.message)}finally{setWorking(false)}}
  const edit=x=>{setEditing(x._id);setForm({title:x.title,description:x.description||'',category:x.category,published:x.published});window.scrollTo({top:0,behavior:'smooth'})}
  const remove=async(x)=>{if(!window.confirm(`“${x.title}” মুছে ফেলতে চান?`))return;setError('');try{await request(`/admin/notices/${x._id}`,{method:'DELETE'});await load()}catch(e){setError(e.message)}}
  const logout=async()=>{try{await request('/auth/logout',{method:'POST'})}catch{}setUser(null);setItems([])}
  if(!checked)return <main className="admin-loading">Admin যাচাই হচ্ছে...</main>
  if(!user)return <main className="admin-login-bg"><form onSubmit={submitLogin} className="admin-login-card"><Link to="/" className="back-link"><ArrowLeft size={16}/> স্কুল ওয়েবসাইট</Link><div className="admin-badge"><LayoutDashboard size={22}/></div><h1>স্কুল অ্যাডমিন</h1><p>অ্যাডমিন একাউন্ট দিয়ে লগইন করুন</p><label>ইমেইল<input type="email" required value={login.email} onChange={e=>setLogin({...login,email:e.target.value})} autoComplete="username" /></label><label>পাসওয়ার্ড<input type="password" required value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} autoComplete="current-password" /></label>{error&&<p className="admin-error" role="alert">{error}</p>}<button disabled={working} className="primary-btn">{working?'অপেক্ষা করুন':'লগইন করুন'}</button></form></main>
  return <main className="admin-shell"><aside className="admin-sidebar"><h2>United School</h2><p>Content Management</p><div className="admin-current"><LayoutDashboard size={18}/> নোটিশ ম্যানেজমেন্ট</div><Link to="/"><ArrowLeft size={17}/> ওয়েবসাইট দেখুন</Link><button onClick={logout}><LogOut size={17}/> লগআউট</button></aside><div className="admin-content"><header className="admin-head"><div><span>Dashboard</span><h1>নোটিশ ম্যানেজমেন্ট</h1><p>এক জায়গা থেকে নোটিশ তৈরি ও পরিচালনা করুন</p></div><b>{user.name}</b></header><section className="admin-panel hero-uploader">
    <h2>Homepage Hero Image</h2><p>এখান থেকে হোমপেজের বড় ছবিটি পরিবর্তন করুন।</p>
    {heroImage&&<img src={heroImage} alt="বর্তমান হিরো ছবি" />}
    <form onSubmit={uploadHero}>
      <label>নতুন ছবি নির্বাচন (JPG / PNG / WebP, সর্বোচ্চ ৫ MB)
        <input type="file" accept="image/jpeg,image/png,image/webp" required onChange={e=>setHeroFile(e.target.files?.[0]||null)} />
      </label>
      {heroError&&<p className="admin-error" role="alert">{heroError}</p>}
      {heroMessage&&<p className="admin-success">{heroMessage}</p>}
      <button className="primary-btn" disabled={!heroFile||heroBusy}>{heroBusy?'আপলোড হচ্ছে...':'Hero Image আপলোড করুন'}</button>
    </form>
  </section><NoticePdfManager/><AdminModules/></div></main>
}
