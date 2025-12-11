import Card from '../components/Card'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

export default function Pricing() {
  const navigate = useNavigate()
  const services = [
    { name: 'تجديد إقامة', price: 23, desc: 'تنسيق خطوات التجديد وإرشادك حتى الإتمام.' },
    { name: 'تسديد مخالفة مرور', price: 23, desc: 'مراجعة المخالفات وتوجيهك لخطوات السداد.' },
    { name: 'تحديث بيانات الأحوال', price: 23, desc: 'تصحيح البيانات الأساسية وتأكيد الطلب.' },
    { name: 'إصدار بدل فاقد', price: 23, desc: 'متابعة استخراج بدل فاقد للهوية أو الإقامة.' },
    { name: 'نقل خدمات', price: 23, desc: 'تجهيز الطلب ومتابعة حالة النقل لدى الجهة.' },
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
              <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{s.price} ر.س</div>
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
