import Card from '../components/Card'
import Button from '../components/Button'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { from: 'assistant', text: 'مرحبًا بك في سَم. اكتب طلبك الحكومي أو مشكلتك لنرشدك.', time: new Date().toLocaleTimeString('ar-SA') }
  ])
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('')
  const [typing, setTyping] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('chat_user')
    if (!u) navigate('/login')
    try { setUser(JSON.parse(u)) } catch {}
    try {
      const hist = JSON.parse(localStorage.getItem('chat_history') || 'null')
      if (hist && Array.isArray(hist) && hist.length > 0) setMessages(hist)
      const la = JSON.parse(localStorage.getItem('last_analysis') || 'null')
      if (la) setResult(la)
      const lm = localStorage.getItem('last_message') || ''
      if (lm) setInput(lm)
    } catch {}
  }, [navigate])

  function analyze(text) {
    const t = text || ''
    let category = 'أحوال مدنية — تحديث بيانات'
    let fees = []
    if (/[إ|ا]قامة|جواز|الجوازات/.test(t)) {
      category = 'الجوازات — تجديد إقامة'
      fees = [
        { type: 'تأخير تجديد إقامة', authority: 'الجوازات', amount: 100 },
      ]
    } else if (/مخالفة|المرور|مرور/.test(t)) {
      category = 'المرور — تسديد مخالفة'
      fees = [
        { type: 'مخالفة سرعة', authority: 'المرور', amount: 300 },
      ]
    } else {
      fees = [
        { type: 'تحديث بيانات', authority: 'أحوال مدنية', amount: 0 },
      ]
    }
    const samFee = 23
    const total = fees.reduce((s, f) => s + f.amount, 0) + samFee
    return { category, fees, samFee, total }
  }

  function send(custom) {
    const txt = (custom ?? input).trim()
    if (!txt || typing) return
    const newMsgs = [...messages, { from: 'user', text: txt, time: new Date().toLocaleTimeString('ar-SA') }]
    setMessages(newMsgs)
    try { localStorage.setItem('chat_history', JSON.stringify(newMsgs)) } catch {}
    setInput('')
    setStatus('')
    setTyping(true)
    setTimeout(() => {
      const r = analyze(txt)
      setResult(r)
      try { localStorage.setItem('last_message', txt) } catch {}
      try { localStorage.setItem('last_analysis', JSON.stringify(r)) } catch {}
      const icon = r.category.includes('المرور') ? '🚘' : r.category.includes('الجوازات') ? '🛂' : '🏛️'
      const summary = `${icon} تم التحليل: ${r.category}. الإجمالي: ${r.total} ر.س`
      const withAssistant = [...newMsgs, { from: 'assistant', text: summary, time: new Date().toLocaleTimeString('ar-SA') }]
      setMessages(withAssistant)
      try { localStorage.setItem('chat_history', JSON.stringify(withAssistant)) } catch {}
      setTyping(false)
    }, 500)
  }

  function quick(text) { send(text) }

  function clearChat() {
    const initial = [{ from: 'assistant', text: 'مرحبًا بك في سَم. اكتب طلبك الحكومي أو مشكلتك لنرشدك.', time: new Date().toLocaleTimeString('ar-SA') }]
    setMessages(initial)
    setResult(null)
    setStatus('')
    setInput('')
    setTyping(false)
    try {
      localStorage.removeItem('chat_history')
      localStorage.removeItem('last_message')
      localStorage.removeItem('last_analysis')
    } catch {}
  }

  function logout() {
    try { localStorage.removeItem('chat_user') } catch {}
    navigate('/login')
  }

  function pay() {
    navigate('/pay')
  }

  return (
    <div className="grid">
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e6f3ea', color: 'var(--color-primary)', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
          {(user?.name || String(user?.nationalId || '')).slice(0, 1) || 'م'}
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>{user?.name || 'مستخدم'}</div>
          <div className="hero-sub">{user?.nationalId || ''}</div>
        </div>
        <Button variant="ghost" onClick={logout}>تسجيل الخروج</Button>
      </div>
      <Card title="الشات الذكي">
        <div className="grid">
          <div className="chat">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.from === 'user' ? 'bubble-user' : 'bubble-assistant'} section`} style={{ animationDelay: `${0.05 * i}s` }}>
                <div>{m.text}</div>
                {m.time && <div className="hero-sub" style={{ marginTop: 4 }}>{m.time}</div>}
              </div>
            ))}
            {typing && (
              <div className="bubble bubble-assistant section" style={{ animationDelay: '0.05s' }}>
                <div>جاري التحليل...</div>
              </div>
            )}
          </div>
          <div className="chat-input">
            <input className="card" placeholder="اكتب طلبك أو مشكلتك هنا" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send() }} />
            <Button variant="primary" onClick={() => send()}>إرسال</Button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => quick('أرغب في تجديد الإقامة')}>تجديد إقامة</Button>
            <Button variant="secondary" onClick={() => quick('لدي مخالفة مرورية وأريد السداد')}>تسديد مخالفة</Button>
            <Button variant="secondary" onClick={() => quick('أحتاج تحديث بيانات الأحوال')}>تحديث بيانات</Button>
            <Button variant="ghost" onClick={clearChat}>مسح المحادثة</Button>
          </div>
        </div>
      </Card>

      {result && (
        <Card title="تحليل الطلب والرسوم">
          <div className="grid">
            <div className="card">
              <div className="hero-sub">نتيجة التحليل</div>
              <div style={{ fontWeight: 700 }}>
                <span style={{ marginInlineEnd: 6 }}>
                  {result.category.includes('المرور') ? '🚘' : result.category.includes('الجوازات') ? '🛂' : '🏛️'}
                </span>
                {result.category}
              </div>
            </div>
            <div className="card">
              <div className="hero-sub">الرسوم الحكومية المرتبطة</div>
              <div className="grid">
                {result.fees.map((f, idx) => (
                  <div key={idx} className="grid" style={{ gridTemplateColumns: '1fr auto auto', alignItems: 'center' }}>
                    <div>{f.type}</div>
                    <div className="hero-sub">{f.authority}</div>
                    <div style={{ fontWeight: 700 }}>{f.amount} ر.س</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
              <div className="hero-sub">سعر خدمة سَم</div>
              <div style={{ fontWeight: 700 }}>{result.samFee} ر.س</div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
              <div>الإجمالي</div>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{result.total} ر.س</div>
            </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={pay}>الدفع الآن</Button>
            <Button variant="secondary" onClick={() => navigate('/fees')}>عرض الرسوم</Button>
          </div>
          {status && (
            <div className="card" style={{ borderStyle: 'dashed' }}>{status}</div>
          )}
        </div>
      </Card>
      )}
    </div>
  )
}
