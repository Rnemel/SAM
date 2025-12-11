import Card from '../components/Card'
import Button from '../components/Button'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Pay() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('chat_user')
    if (!u) navigate('/login')
    let analysis = null
    try { analysis = JSON.parse(localStorage.getItem('last_analysis') || 'null') } catch {}
    if (analysis) {
      setData(analysis)
      return
    }
    const fees = [
      { type: 'مخالفة سرعة', authority: 'المرور', amount: 300 },
      { type: 'تأخير تجديد إقامة', authority: 'الجوازات', amount: 100 },
    ]
    const samFee = 23
    const total = fees.reduce((s, f) => s + f.amount, 0) + samFee
    setData({ category: 'ملخص دفع', fees, samFee, total })
  }, [navigate])

  function confirm() {
    setStatus('تم استلام طلبك — جاري تحويله إلى القسم المختص')
    try { localStorage.setItem('payment_status', 'confirmed') } catch {}
    try { window.dispatchEvent(new CustomEvent('sam-payment-confirmed')) } catch {}
    navigate('/routed')
  }

  if (!data) return null

  return (
    <div className="grid view">
      <Card title="تأكيد الدفع">
        <div className="grid">
          <div className="card">
            <div className="hero-sub">الخدمة</div>
            <div style={{ fontWeight: 700 }}>{data.category}</div>
          </div>
          <div className="card">
            <div className="hero-sub">الرسوم الحكومية</div>
            <div className="grid">
              {data.fees.map((f, i) => (
                <div key={i} className="grid" style={{ gridTemplateColumns: '1fr auto auto', alignItems: 'center' }}>
                  <div>{f.type}</div>
                  <div className="hero-sub">{f.authority}</div>
                  <div style={{ fontWeight: 700 }}>{f.amount} ر.س</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
            <div className="hero-sub">سعر خدمة سَم</div>
            <div style={{ fontWeight: 700 }}>{data.samFee} ر.س</div>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
            <div>الإجمالي</div>
            <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{data.total} ر.س</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={confirm}>تأكيد الدفع</Button>
            <Button variant="secondary" onClick={() => navigate('/fees')}>رجوع</Button>
          </div>
          {status && (
            <div className="card" style={{ borderStyle: 'dashed' }}>{status}</div>
          )}
        </div>
      </Card>
    </div>
  )
}
