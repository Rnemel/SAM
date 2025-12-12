import Card from '../components/Card'
import Button from '../components/Button'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Orders() {
  const navigate = useNavigate()
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || 'ar' } catch { return 'ar' }
  })
  const [items, setItems] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('chat_user')
    if (!u) navigate('/login')
    try { setUser(JSON.parse(u)) } catch {}
    try {
      const saved = JSON.parse(localStorage.getItem('orders') || '[]')
      setItems(saved.reverse())
    } catch {}
    function onLang() { try { setLang(localStorage.getItem('lang') || 'ar') } catch {} }
    window.addEventListener('sam-lang', onLang)
    return () => window.removeEventListener('sam-lang', onLang)
  }, [navigate])

  function goChat() { navigate('/chat') }
  const statuses = lang === 'ar' ? ['تم الإرسال', 'يتم المراجعة', 'طلبك تحت التنفيذ', 'تم إتمام طلبك'] : ['Submitted', 'Under Review', 'In Progress', 'Completed']

  return (
    <div className="grid view">
      <Card title={lang === 'ar' ? 'طلباتي' : 'My Requests'}>
        <div className="grid">
          <div className="grid" style={{ gridTemplateColumns: 'auto 1fr', alignItems: 'center' }}>
            <div className="icon-circle">{lang === 'ar' ? 'س' : 'S'}</div>
            <div>
              <div style={{ fontWeight: 700 }}>{user?.name || (lang === 'ar' ? 'مستخدم' : 'User')}</div>
              <div className="hero-sub">{lang === 'ar' ? 'آخر الطلبات المرسلة عبر الشات' : 'Recent chat requests'}</div>
            </div>
          </div>
          {items.length === 0 && (
            <div className="card" style={{ borderStyle: 'dashed' }}>{lang === 'ar' ? 'لا توجد طلبات بعد' : 'No requests yet'}</div>
          )}
          {items.map((it, i) => (
            <div key={it.id ?? i} className="grid card section" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center', animationDelay: `${0.05 * i}s` }}>
              <div>
                <div style={{ fontWeight: 700 }}>{it.text}</div>
                <div className="hero-sub" style={{ marginTop: 4 }}>{it.time}</div>
                <div className="steps" style={{ marginTop: 8 }}>
                  {statuses.map((label, idx) => (
                    <div key={label} className={`step ${idx === (it.stage ?? 0) ? 'step-active' : idx < (it.stage ?? 0) ? 'step-done' : ''}`}>
                      <div className="step-index">{idx + 1}</div>
                      <div className="step-label">{label}</div>
                      {idx < statuses.length - 1 && <div className="step-divider" />}
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="secondary" onClick={goChat}>{lang === 'ar' ? 'متابعة بالشات' : 'Continue in Chat'}</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
