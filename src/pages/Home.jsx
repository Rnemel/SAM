import Card from '../components/Card'
import Button from '../components/Button'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  function start() { navigate('/login') }
  return (
    <div className="grid">
      <div className="hero hero-animated section" style={{ animationDelay: '0.02s' }}>
        <div className="hero-title"><img src="/sam-logo.png" alt="شعار" className="inline-logo" /> — وكيلك الذكي لإنجاز الخدمات الحكومية بسهولة</div>
        <div className="hero-sub">تجربة حكومية موحدة، آمنة، باللغة العربية، تدعم RTL بالكامل.</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button variant="primary" onClick={start}>ابدأ الآن — ادخل إلى الشات الذكي</Button>
          <Link to="/pricing" className="link">أسعار الخدمات</Link>
        </div>
      </div>

      <div className="section" style={{ animationDelay: '0.12s' }}>
        <Card title="لماذا سَم؟">
        <div className="grid">
          <div>أبشر يخدم أكثر من 28 مليون مستخدم.</div>
          <div>أكثر من 42 مليون عملية تُنفّذ شهرياً.</div>
          <div>نسبة كبيرة من المستخدمين يواجهون صعوبة في استخدام الخدمات، مما يضطرهم للجوء لمكاتب غير رسمية تعرض بياناتهم للخطر.</div>
        </div>
        </Card>
      </div>

      <div className="section" style={{ animationDelay: '0.22s' }}>
        <Card title="كيف يعمل النظام">
          <div className="grid grid-2">
            <div className="card"><div>تسجيل الدخول</div><div className="hero-sub">تحقق بسيط وآمن.</div></div>
            <div className="card"><div>اختيار الخدمة</div><div className="hero-sub">واجهات واضحة ورسوم شفافة.</div></div>
            <div className="card"><div>الشات الذكي</div><div className="hero-sub">إرشاد خطوة بخطوة.</div></div>
            <div className="card"><div>المتابعة والدفع</div><div className="hero-sub">إشعارات ومتابعة حالة الطلب.</div></div>
          </div>
        </Card>
      </div>
    </div>
  )
}
