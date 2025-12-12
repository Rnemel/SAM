import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

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
  function logout() {
    try { localStorage.removeItem('chat_user') } catch {}
    setAcctOpen(false)
    navigate('/login')
  }
  return (
    <header className="header view">
      <div className="container header-inner">
        <div className="brand" onClick={() => navigate('/')}><img src="/sam-logo.png" alt="شعار" className="brand-logo" /></div>
        <nav className="nav">
          <Link to="/" className="nav-link"><span className="nav-icon">{
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-5H10v5H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          }</span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <Link to="/pricing" className="nav-link"><span className="nav-icon">{
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7a2 2 0 0 1 2-2h8.5a2 2 0 0 1 1.4.6l3.5 3.5a2 2 0 0 1 .6 1.4V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          }</span>{lang === 'ar' ? 'أسعار الخدمات' : 'Pricing'}</Link>
          {logged && pathname !== '/' && (
            <Link to="/fees" className="nav-link"><span className="nav-icon">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-5 9 5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 17v-4h6v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</span>{lang === 'ar' ? 'الرسوم الحكومية' : 'Government Fees'}</Link>
          )}
          {logged && (
            <Link to="/orders" className="nav-link"><span className="nav-icon">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 5h12a2 2 0 0 1 2 2v11H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6"/><path d="M6 5v2m0 0h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</span>{lang === 'ar' ? 'طلباتي' : 'My Requests'}</Link>
          )}
          {logged ? (
            <Link to="/chat" className="nav-link"><span className="nav-icon">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4V6Z" stroke="currentColor" strokeWidth="1.6"/></svg>
            }</span>{lang === 'ar' ? 'الشات' : 'Chat'}</Link>
          ) : (
            <Link to="/login" className="nav-link"><span className="nav-icon">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.6"/><path d="M4.8 19a7.2 7.2 0 0 1 14.4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</span>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</Link>
          )}
          <div className="lang">
            <button className="lang-toggle" onClick={() => setLangOpen(v => !v)}>
              <span className="nav-icon">{
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" stroke="currentColor" strokeWidth="1.6"/><path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M12 4a16 16 0 0 1 0 16" stroke="currentColor" strokeWidth="1.6"/></svg>
              }</span>
              <span>{lang === 'ar' ? 'اللغة' : 'Language'}</span>
              <span className="lang-code">{lang === 'ar' ? 'AR' : 'EN'}</span>
              <span className="lang-caret">{
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }</span>
            </button>
            {langOpen && (
              <div className="card lang-menu">
                <div className="lang-item" onClick={() => setLanguage('ar')}>
                  <span>{'العربية'}</span>
                  <span className="lang-code">AR</span>
                </div>
                <div className="lang-item" onClick={() => setLanguage('en')}>
                  <span>{'English'}</span>
                  <span className="lang-code">EN</span>
                </div>
              </div>
            )}
          </div>
          {logged && (
            <div className="account">
              <button className="account-toggle" onClick={() => setAcctOpen(v => !v)}>
                <span className="icon-circle" style={{ width: 28, height: 28 }}>
                  {(user?.name || String(user?.nationalId || '')).slice(0, 1) || (lang === 'ar' ? 'م' : 'U')}
                </span>
                <span style={{ fontWeight: 700 }}>{user?.name || (lang === 'ar' ? 'مستخدم' : 'User')}</span>
                <span className="lang-caret">{
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                }</span>
              </button>
              {acctOpen && (
                <div className="card account-menu">
                  <div className="account-item" onClick={logout}>
                    <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
