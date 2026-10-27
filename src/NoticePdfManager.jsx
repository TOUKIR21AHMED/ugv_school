import {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
const API='/api/school'
async function call(url,opts={}) {const r=await fetch(API+url,{credentials:'include',...opts});const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.message||'অনুরোধ ব্যর্থ হয়েছে');return j}
export default function NoticePdfManager(){
 const [items,setItems]=useState([]),[title,setTitle]=useState(''),[description,setDescription]=useState(''),[pdf,setPdf]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[published,setPublished]=useState(true)
 const reload=async()=>{const j=await call('/admin/documents');setItems((j.items||[]).filter(x=>x.type==='notice'))}
 useEffect(()=>{reload().catch(e=>setMessage(e.message))},[])
 async function save(e){e.preventDefault();setBusy(true);setMessage('');try{
  if(!pdf||pdf.type!=='application/pdf')throw Error('PDF ফাইল নির্বাচন করুন')
  const data=new FormData();data.append('file',pdf)
  const uploaded=await call('/admin/file',{method:'POST',body:data})
  await call('/admin/documents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'notice',title,description,fileUrl:uploaded.url,grade:'',group:'',term:'',board:'',published})})
  setTitle('');setDescription('');setPdf(null);e.target.reset();setMessage('PDF নোটিশ সফলভাবে সংরক্ষিত হয়েছে।');await reload()
 }catch(err){setMessage(err.message)}finally{setBusy(false)}}
 async function remove(id){if(!confirm('এই PDF নোটিশটি মুছবেন?'))return;try{await call('/admin/documents/'+id,{method:'DELETE'});await reload()}catch(err){setMessage(err.message)}}
 return <section className="admin-panel school-admin-module" id="notice-pdf-manager"><h2>নোটিশ বোর্ড — PDF Upload</h2><p>এখানে যোগ করা প্রকাশিত নোটিশই হোমপেজের marquee ও তালিকায় দেখা যাবে।</p>
 <form className="school-admin-form" onSubmit={save}>
 <label>নোটিশের শিরোনাম<input required maxLength={180} value={title} onChange={e=>setTitle(e.target.value)}/></label>
 <label>বিবরণ<textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)}/></label>
 <label>নোটিশ PDF (সর্বোচ্চ ৮ MB)<input key={title==='__reset__'?'reset':'file'} required type="file" accept="application/pdf,.pdf" onChange={e=>setPdf(e.target.files?.[0]||null)}/></label>
 <label className="check-row"><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/> ওয়েবসাইটে প্রকাশ করুন</label>
 <button className="primary-btn" disabled={busy}>{busy?'আপলোড হচ্ছে...':'PDF নোটিশ প্রকাশ করুন'}</button></form>
 {message&&<p role="status" className="school-admin-msg">{message}</p>}
 <div className="school-admin-list"><h3>PDF নোটিশের তালিকা</h3>{items.map(x=><article key={x._id}><div><strong>{x.title}</strong><p>{x.published?'প্রকাশিত':'ড্রাফট'} · {x.description}</p></div><div><Link to={'/pdf/'+x._id}>দেখুন</Link> <a href={x.fileUrl} target="_blank" rel="noreferrer">PDF</a> <button onClick={()=>remove(x._id)}>মুছুন</button></div></article>)}{!items.length&&<p>এখনো PDF নোটিশ নেই।</p>}</div></section>
}
