import Card from '../components/Card'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

export default function Pricing() {
  const navigate = useNavigate()
  function getSamFee() {
    let v = 0
    try { v = Number(localStorage.getItem('sam_fee') || '0') } catch {}
    if (v === 5.99) return v
    v = 5.99
    try { localStorage.setItem('sam_fee', String(v)) } catch {}
    return v
  }
  const fee = getSamFee()
  const services = [
    { name: 'تجديد إقامة', desc: 'تنسيق إجراءات التجديد وإرشاد دقيق حتى الإتمام.' },
    { name: 'تسديد مخالفة مرور', desc: 'مراجعة المخالفات وتوجيه السداد بشكل رسمي.' },
    { name: 'تحديث بيانات الأحوال', desc: 'تصحيح البيانات الأساسية وإرسال الطلب باعتماد رسمي.' },
    { name: 'إصدار بدل فاقد', desc: 'متابعة استخراج بدل فاقد وفق المتطلبات النظامية.' },
    { name: 'نقل خدمات', desc: 'تجهيز الطلب ومتابعة حالة النقل لدى الجهة المختصة.' },
  ]
  return (
    <div className="grid view">
      <Card title="الخدمات الأكثر طلبًا">
        <div className="grid">
          {services.map((s, i) => (
            <div key={s.name} className="grid card section" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center', animationDelay: `${0.05 * i}s` }}>
              <div>
                <div style={{ fontWeight: 700 }}>{s.name}</div>
                <div className="hero-sub">{s.desc}</div>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{fee} ر.س</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="primary" onClick={() => navigate('/')}>ابدأ الآن</Button>
      </div>
    </div>
  )
}
