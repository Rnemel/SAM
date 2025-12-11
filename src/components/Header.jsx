import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const logged = !!localStorage.getItem('chat_user')
  return (
    <header className="header view">
      <div className="container header-inner">
        <div className="brand" onClick={() => navigate('/')}><img src="/sam-logo.png" alt="شعار" className="brand-logo" /></div>
        <nav className="nav">
          <Link to="/" className="nav-link">الرئيسية</Link>
          <Link to="/pricing" className="nav-link">أسعار الخدمات</Link>
          <Link to="/fees" className="nav-link">الرسوم الحكومية</Link>
          {logged ? (
            <Link to="/chat" className="nav-link">الشات</Link>
          ) : (
            <Link to="/login" className="nav-link">تسجيل الدخول</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
