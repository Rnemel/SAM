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
        <div className="footer-block">
          <div className="footer-title"><img src="/sam-logo.png" alt="شعار" className="footer-logo" /></div>
          <div className="footer-text">{lang === 'ar' ? 'مساعد رقمي موثوق لإتمام معاملاتك الحكومية بواجهة عربية رسمية.' : 'A trusted digital assistant for completing government transactions.'}</div>
        </div>
        <div className="footer-block">
          <div className="footer-title">{lang === 'ar' ? 'روابط' : 'Links'}</div>
          <div className="footer-text">{lang === 'ar' ? 'الرئيسية · أسعار الخدمات · الرسوم · الشات' : 'Home · Pricing · Fees · Chat'}</div>
        </div>
        <div className="footer-block">
          <div className="footer-title">{lang === 'ar' ? 'تنبيه' : 'Notice'}</div>
          <div className="footer-text">{lang === 'ar' ? 'واجهة تجريبية (UI) معدّة للتكامل والربط لاحقًا.' : 'Experimental UI, prepared for official integration later.'}</div>
        </div>
      </div>
    </footer>
  )
} 
