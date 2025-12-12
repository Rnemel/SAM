import { useState, useEffect } from 'react'

export default function Footer() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || 'ar' } catch { return 'ar' }
  })
  useEffect(() => {
    function onLang() {
      try { setLang(localStorage.getItem('lang') || 'ar') } catch {}
    }
    window.addEventListener('sam-lang', onLang)
    return () => window.removeEventListener('sam-lang', onLang)
  }, [])
  return (
    <footer className="footer view">
      <div className="container footer-inner">
        <div className="footer-title">{
          (() => {
            const base = import.meta.env.BASE_URL || '/'
            return (
              <img src={`${base}logo.png`} alt={lang === 'ar' ? 'شعار' : 'Logo'} className="footer-logo" onError={(e) => { e.currentTarget.src = `${base}logo.svg` }} />
            )
          })()
        }</div>
        <div className="footer-text">{lang === 'ar' ? 'مصمم لمسابقة هاكاثون أبشر — Absher Hackathon' : 'Made for Absher Hackathon'}</div>
      </div>
    </footer>
  )
}
