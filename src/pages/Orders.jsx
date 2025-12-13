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
      let saved = JSON.parse(localStorage.getItem('orders') || '[]')
      if (!Array.isArray(saved)) saved = []
      if (saved.length === 0) {
        try {
          const last = JSON.parse(localStorage.getItem('last_analysis') || 'null')
          const msg = localStorage.getItem('last_message') || ''
          if (last && msg) {
            const order = { id: Date.now(), text: msg, time: new Date().toLocaleTimeString('ar-SA'), category: last.category, fees: last.fees || [], samFee: last.samFee, total: last.total, stage: 0 }
            saved = [order]
            localStorage.setItem('orders', JSON.stringify(saved))
          }
        } catch {}
      }
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
                <div className="grid" style={{ marginTop: 8 }}>
                  <div className="card">
                    <div className="hero-sub">{lang === 'ar' ? 'الرسوم الحكومية' : 'Government Fees'}</div>
                    <div className="grid">
                      {(it.fees || []).map((f, idx) => (
                        <div key={idx} className="grid" style={{ gridTemplateColumns: '1fr auto auto', alignItems: 'center' }}>
                          <div>{f.type}</div>
                          <div className="hero-sub">{f.authority}</div>
                          <div style={{ fontWeight: 700 }}>{f.amount} ر.س</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
                    <div className="hero-sub">{lang === 'ar' ? 'سعر خدمة سَم' : 'SAM Service Fee'}</div>
                    <div style={{ fontWeight: 700 }}>{it.samFee} ر.س</div>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
                    <div>{lang === 'ar' ? 'الإجمالي' : 'Total'}</div>
                    <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{it.total} ر.س</div>
                  </div>
                </div>
                <div className="steps" style={{ marginTop: 8 }}>
                  {statuses.map((label, idx) => (
                    <div key={label} className={`step ${idx === (it.stage ?? 0) ? 'step-active' : idx < (it.stage ?? 0) ? 'step-done' : ''}`}>
                      <div className="step-index">{idx + 1}</div>
                      <div className="step-label">{label}</div>
                      {idx < statuses.length - 1 && <div className="step-divider" />}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button variant="primary" onClick={() => {
                    try {
                      const data = { category: it.category, fees: it.fees || [], samFee: it.samFee, total: it.total }
                      localStorage.setItem('last_analysis', JSON.stringify(data))
                      localStorage.setItem('last_message', it.text || '')
                    } catch {}
                    navigate('/pay')
                  }}>{lang === 'ar' ? 'الدفع الآن' : 'Pay Now'}</Button>
                  <Button variant="secondary" onClick={goChat}>{lang === 'ar' ? 'متابعة بالشات' : 'Continue in Chat'}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
