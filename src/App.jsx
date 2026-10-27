import { Documents, People, Contact, Apply, NoticePage, SchoolNav, PdfViewer } from './SchoolPortal.jsx'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import AdminPage from './AdminPage.jsx'
import { ArrowRight, Bell, BookOpen, ClipboardList } from 'lucide-react'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // New route: scroll to its top. About anchor: scroll to the section.
    // Two animation frames let React render the destination before scrolling.
    let secondFrame
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (hash) {
          const target = document.getElementById(decodeURIComponent(hash.slice(1)))
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return
          }
        }
        window.scrollTo({ top: 0, behavior: 'instant' })
      })
    })
    return () => {
      cancelAnimationFrame(firstFrame)
      if (secondFrame) cancelAnimationFrame(secondFrame)
    }
  }, [pathname, hash])

  return null
}

function App() {
  const [heroImage, setHeroImage] = useState(null)
  const [content, setContent] = useState([])
  const [documents, setDocuments] = useState([])
  const [gallery, setGallery] = useState([])
  const [legacyNotices, setLegacyNotices] = useState([])

  useEffect(() => {
    const get = (path, cb) => fetch('/api/school/public/' + path)
      .then(r => r.ok ? r.json() : {})
      .then(j => cb(j.items || []))
      .catch(() => {})
    fetch('/api/site-settings').then(r => r.json()).then(j => setHeroImage(j.heroImage)).catch(() => {})
    get('content', setContent)
    get('documents', setDocuments)
    get('gallery', setGallery)
    fetch('/api/notices').then(r => r.ok ? r.json() : { notices: [] })
      .then(j => setLegacyNotices(j.notices || [])).catch(() => {})
  }, [])

  const about = content.find(x => x.key === 'about')
  const head = content.find(x => x.key === 'headteacher')
  const bg = content.find(x => x.key === 'gallery-background')
  const pdfNotices = documents.filter(d => d.type === 'notice' && d.published !== false).map(d => ({ ...d, isPdf: true }))
  const notices = [
    ...pdfNotices,
    ...legacyNotices.filter(n => n.published !== false).map(n => ({ ...n, isPdf: false }))
  ].sort((x, y) => new Date(y.createdAt || 0) - new Date(x.createdAt || 0)).slice(0, 5)

  return <>
    <SchoolNav />
    <main className="refresh-home">
      <section className="refresh-hero">
        <div className="refresh-container refresh-split">
          <div className="refresh-hero-copy">
            <div className="refresh-eyebrow">প্রতিষ্ঠিত ১৯৭০ · কাশিপুর, বরিশাল</div>
            <h1>ইউনাইটেড মাধ্যমিক বিদ্যালয়</h1>
            <p>শিক্ষা, শৃঙ্খলা ও মানবিক মূল্যবোধে সমৃদ্ধ আগামী প্রজন্ম গড়ার অঙ্গীকার।</p>
            <div className="refresh-actions">
              <Link className="refresh-btn" to="/admission/apply">অনলাইনে ভর্তি আবেদন <ArrowRight size={18} /></Link>
              <Link className="refresh-btn refresh-outline" to="/documents/syllabus">একাডেমিক তথ্য</Link>
            </div>
          </div>
          <div className="refresh-hero-pic"><img src={heroImage || '/united-campus.png'} alt="ইউনাইটেড মাধ্যমিক বিদ্যালয়ের ক্যাম্পাস" /></div>
        </div>
      </section>

      <section id="about" className="refresh-about">
        <div className="refresh-container refresh-split refresh-about-left-image">
          <div className="refresh-about-image">
            <img src={about?.photoUrl || '/united-campus.png'}
              onError={e => { if (!e.currentTarget.src.endsWith('/united-campus.png')) e.currentTarget.src = '/united-campus.png' }}
              alt="ইউনাইটেড মাধ্যমিক বিদ্যালয়ের পূর্ণ ক্যাম্পাস ছবি" />
          </div>
          <div className="refresh-about-copy">
            <div className="refresh-eyebrow">আমাদের পরিচিতি</div>
            <h2>আমাদের বিদ্যালয়</h2>
            <p>{about?.text || 'দিয়াপাড়া, ২৮ নং ওয়ার্ড, বরিশাল সিটি কর্পোরেশনের কাশিপুরে অবস্থিত ইউনাইটেড মাধ্যমিক বিদ্যালয় ১৯৭০ সালে প্রতিষ্ঠিত। বিদ্যালয়ের বিস্তারিত পরিচিতি কর্তৃপক্ষ শীঘ্রই এখানে প্রকাশ করবে।'}</p>
            <Link className="refresh-text-link" to="/documents/syllabus">একাডেমিক কার্যক্রম দেখুন <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="refresh-info">
        <div className="refresh-container refresh-info-grid">
          <article className="refresh-principal">
            <div className="refresh-eyebrow">প্রাতিষ্ঠানিক বার্তা</div>
            <h2>প্রধান শিক্ষকের বাণী</h2>
            {head?.photoUrl ? <img className="refresh-principal-photo" src={head.photoUrl} alt="প্রধান শিক্ষক" /> : <div className="refresh-principal-placeholder">প্রধান শিক্ষকের ছবি</div>}
            <h3>{head?.title || 'প্রধান শিক্ষক'}</h3>
            <p>{head?.text || 'প্রধান শিক্ষকের বক্তব্য বিদ্যালয় কর্তৃপক্ষ প্রকাশ করবেন।'}</p>
          </article>
          <article id="notices" className="refresh-notice">
            <div className="refresh-notice-heading"><div><div className="refresh-eyebrow">সর্বশেষ আপডেট</div><h2>নোটিশ বোর্ড</h2></div><Bell size={26} /></div>
            <div className="refresh-ticker"><span className="refresh-ticker-label">সর্বশেষ সংবাদ</span><div className="refresh-ticker-window"><div className="refresh-ticker-text">{notices.length ? notices.map(n => n.title).join('　 ✦　 ') : 'এখনো কোনো নতুন নোটিশ প্রকাশিত হয়নি'}</div></div></div>
            <div className="refresh-notice-list">
              {notices.map(n => n.isPdf
                ? <Link className="refresh-notice-item" key={'pdf-' + n._id} to={'/pdf/' + n._id}><FileTextIcon /><span><strong>{n.title}</strong>{n.description && <small>{n.description}</small>}</span><span className="refresh-pdf-tag">PDF</span></Link>
                : <article className="refresh-notice-item" key={'old-' + n._id}><Bell size={21} /><span><strong>{n.title}</strong>{n.description && <small>{n.description}</small>}</span><span className="refresh-pdf-tag refresh-text-only-tag">নোটিশ</span></article>)}
              {!notices.length && <p className="refresh-empty">কর্তৃপক্ষ নোটিশ PDF আপলোড করলে এখানে দেখাবে।</p>}
            </div>
            <Link className="refresh-btn refresh-notice-more" to="/notices">সকল নোটিশ দেখুন <ArrowRight size={17} /></Link>
          </article>
        </div>
      </section>

      <section className="refresh-quick"><div className="refresh-container refresh-quick-grid">
        {[
          ['পাঠ্যক্রম ও সিলেবাস', '/documents/syllabus'],
          ['ক্লাস ও পরীক্ষার রুটিন', '/documents/routines'],
          ['শিক্ষকমণ্ডলী', '/people/teacher'],
          ['পরীক্ষার ফলাফল', '/documents/internal-result']
        ].map(([title, url]) => <Link key={url} to={url}><BookOpen size={25} /><b>{title}</b><ArrowRight size={18} /></Link>)}
      </div></section>

      <section className="refresh-gallery" style={{ backgroundImage: `linear-gradient(90deg,rgba(5,26,48,.91),rgba(5,26,48,.75)),url('${bg?.photoUrl || '/united-campus.png'}')` }}>
        <div className="refresh-container">
          <div className="refresh-eyebrow">ক্যাম্পাসের মুহূর্ত</div>
          <h2>আমাদের ছবি গ্যালারি</h2>
          <div className="refresh-gallery-grid">
            {gallery.slice(0, 8).map(x => <figure key={x._id}><img src={x.imageUrl} alt={x.title || 'বিদ্যালয়ের ছবি'} /><figcaption>{x.title}</figcaption></figure>)}
            {!gallery.length && <p>ছবি গ্যালারি থেকে নতুন ছবি প্রকাশ করা হবে।</p>}
          </div>
        </div>
      </section>
    </main>
    <footer className="refresh-footer"><div className="refresh-container"><strong>ইউনাইটেড মাধ্যমিক বিদ্যালয়</strong><p>দিয়াপাড়া, ২৮ নং ওয়ার্ড, বরিশাল সিটি কর্পোরেশন, কাশিপুর, বরিশাল।</p><p>© {new Date().getFullYear()} United Madhyamik Bidyalaya</p></div></footer>
  </>
}

function FileTextIcon() { return <ClipboardList size={21} /> }

export default function RootApp() {
  return <BrowserRouter>
    <ScrollManager />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/documents/:kind" element={<Documents />} />
      <Route path="/people/:type" element={<People />} />
      <Route path="/admission/apply" element={<Apply />} />
      <Route path="/notices" element={<NoticePage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pdf/:id" element={<PdfViewer />} />
      <Route path="*" element={<main className="not-found"><h2>পেজ পাওয়া যায়নি</h2><Link to="/">হোমে ফিরুন</Link></main>} />
    </Routes>
  </BrowserRouter>
}
