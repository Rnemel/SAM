import Card from '../components/Card'
import Button from '../components/Button'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Fees() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('chat_user')
    if (!u) navigate('/login')
    let analysis = null
    try { analysis = JSON.parse(localStorage.getItem('last_analysis') || 'null') } catch {}
    if (analysis && analysis.fees) {
      const fees = analysis.fees.map(f => ({ ...f, reason: 'مستخلص من طلب الشات' }))
      const samFee = analysis.samFee
      const total = analysis.total
      setData({ fees, samFee, total })
      return
    }
    const fees = [
      { type: 'مخالفة سرعة', authority: 'المرور', reason: 'مخالفة لم تُسدَّد', amount: 300 },
      { type: 'تأخير تجديد إقامة', authority: 'الجوازات', reason: 'انتهت الإقامة ويجب التجديد', amount: 100 },
      { type: 'تحديث بيانات', authority: 'أحوال مدنية', reason: 'تصحيح بيانات أساسية', amount: 0 },
    ]
    const samFee = 23
    const totalFees = fees.reduce((s, f) => s + f.amount, 0)
    const total = totalFees + samFee
    setData({ fees, samFee, total })
  }, [navigate])

  function proceed() {
    navigate('/pay')
  }

  if (!data) return null

  return (
    <div className="grid view">
      <Card title="الرسوم الحكومية المرتبطة بالمستخدم">
        <div className="grid">
          {data.fees.map((f, i) => (
            <div key={i} className="grid card section" style={{ gridTemplateColumns: '1fr auto auto', alignItems: 'center', animationDelay: `${0.05 * i}s` }}>
              <div>
                <div style={{ fontWeight: 700 }}>{f.type}</div>
                <div className="hero-sub">{f.reason}</div>
              </div>
              <div className="hero-sub">
                <span style={{ marginInlineEnd: 6 }}>
                  {f.authority === 'المرور' ? '🚘' : f.authority === 'الجوازات' ? '🛂' : '🏛️'}
                </span>
                {f.authority}
              </div>
              <div style={{ fontWeight: 700 }}>{f.amount} ر.س</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="ملخص الدفع">
        <div className="grid">
          <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
            <div className="hero-sub">سعر خدمة سَم</div>
            <div style={{ fontWeight: 700 }}>{data.samFee} ر.س</div>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
            <div>الإجمالي</div>
            <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{data.total} ر.س</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={proceed}>متابعة إلى الدفع</Button>
          </div>
          {status && (
            <div className="card" style={{ borderStyle: 'dashed' }}>{status}</div>
          )}
        </div>
      </Card>
    </div>
  )
}
