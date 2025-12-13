import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Button from './Button'

export default function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const logged = !!localStorage.getItem('chat_user')
  const [user, setUser] = useState(null)
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
  useEffect(() => {
    try {
      const u = localStorage.getItem('chat_user')
      if (u) setUser(JSON.parse(u))
    } catch {}
  }, [])
  useEffect(() => {
    function onUser() {
      try {
        const u = localStorage.getItem('chat_user')
        if (u) setUser(JSON.parse(u))
      } catch {}
    }
    window.addEventListener('sam-user', onUser)
    return () => window.removeEventListener('sam-user', onUser)
  }, [])
  const [langOpen, setLangOpen] = useState(false)
  function setLanguage(next) {
    try {
      localStorage.setItem('lang', next)
      setLang(next)
      document.documentElement.setAttribute('lang', next)
      document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr')
      window.dispatchEvent(new Event('sam-lang'))
      setLangOpen(false)
    } catch {}
  }
  const [acctOpen, setAcctOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  function logout() {
    try { localStorage.removeItem('chat_user') } catch {}
    setAcctOpen(false)
    navigate('/login')
  }
  useEffect(() => { setMobileOpen(false) }, [pathname])
  return (
    <header className="header view">
      <div className="container header-inner">
        <div className="brand brand-wrap" onClick={() => navigate('/')}>{
          (() => {
            const base = import.meta.env.BASE_URL || '/'
            return (
              <>
                <div className="icon-circle" style={{ width: 28, height: 28 }}>{
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l7 4v6c0 5-7 8-7 8s-7-3-7-8V7l7-4Z" stroke="currentColor" strokeWidth="1.6"/></svg>
                }</div>
                <div className="brand-text">
                  <div className="brand-title">{lang === 'ar' ? 'سَم — لخدمات أبشر' : 'SAM — Absher Services'}</div>
                  <div className="brand-sub">{lang === 'ar' ? 'واجهة مبسطة تساعدك تنجز معاملتك بأمان' : 'Simplified interface to safely complete your service'}</div>
                </div>
              </>
            )
          })()
        }</div>
        <nav className="nav">
          <a href="#about" className="nav-link"><span className="nav-icon">{
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          }</span>{lang === 'ar' ? 'من نحن' : 'About Us'}</a>
          <a href="#security" className="nav-link"><span className="nav-icon">{
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l7 4v6c0 5-7 8-7 8s-7-3-7-8V7l7-4Z" stroke="currentColor" strokeWidth="1.6"/></svg>
          }</span>{lang === 'ar' ? 'الأمان' : 'Security'}</a>
          <Link to="/pricing" className="nav-link"><span className="nav-icon">{
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16" stroke="currentColor" strokeWidth="1.6"/><path d="M4 12h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          }</span>{lang === 'ar' ? 'الخدمات' : 'Services'}</Link>
          <Link to="/chat" className="nav-link"><span className="nav-icon">{
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4V6Z" stroke="currentColor" strokeWidth="1.6"/></svg>
          }</span>{lang === 'ar' ? 'المحادثة' : 'Chat'}</Link>
          <Link to="/orders" className="nav-link"><span className="nav-icon">{
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 5h12v14H6V5Z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 8h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          }</span>{lang === 'ar' ? 'طلباتي' : 'Orders'}</Link>
          <Link to="/login" className="nav-link"><span className="nav-icon">{
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.6"/><path d="M4.8 19a7.2 7.2 0 0 1 14.4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          }</span>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</Link>
        </nav>
        <div className="header-actions">
          <Button variant="primary" onClick={() => navigate(logged ? '/chat' : '/login')}>{lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}</Button>
        </div>
        <button className={`hamburger${mobileOpen ? ' is-open' : ''}`} aria-label={lang === 'ar' ? 'القائمة' : 'Menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(v => !v)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <a href="#about" className="mobile-item" onClick={() => setMobileOpen(false)}>{lang === 'ar' ? 'من نحن' : 'About Us'}</a>
        <a href="#security" className="mobile-item" onClick={() => setMobileOpen(false)}>{lang === 'ar' ? 'الأمان' : 'Security'}</a>
        <Link to="/pricing" className="mobile-item" onClick={() => setMobileOpen(false)}>{lang === 'ar' ? 'الخدمات' : 'Services'}</Link>
        <Link to="/chat" className="mobile-item" onClick={() => setMobileOpen(false)}>{lang === 'ar' ? 'المحادثة' : 'Chat'}</Link>
        <Link to="/orders" className="mobile-item" onClick={() => setMobileOpen(false)}>{lang === 'ar' ? 'طلباتي' : 'Orders'}</Link>
        <Link to={logged ? '/chat' : '/login'} className="mobile-item" onClick={() => setMobileOpen(false)}>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</Link>
        <div className="mobile-actions">
          <Button variant="primary" className="btn-block" onClick={() => { setMobileOpen(false); navigate(logged ? '/chat' : '/login') }}>{lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}</Button>
        </div>
      </div>
    </header>
  )
}
