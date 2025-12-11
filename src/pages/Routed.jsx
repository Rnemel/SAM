import Card from '../components/Card'
import Button from '../components/Button'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function detectAuthority(msg, category) {
  const t = msg || ''
  if (/إقامة|خروج وعودة|مكفول|الجوازات/.test(t)) return { name: 'الجوازات', icon: '🛂' }
  if (/رخصة|حادث|مخالفة|مرور/.test(t)) return { name: 'المرور', icon: '🚘' }
  if (/هوية|بطاقة|أحوال|تجديد بطاقة/.test(t)) return { name: 'أحوال مدنية', icon: '🏛️' }
  if ((category || '').includes('الجوازات')) return { name: 'الجوازات', icon: '🛂' }
  if ((category || '').includes('المرور')) return { name: 'المرور', icon: '🚘' }
  return { name: 'أحوال مدنية', icon: '🏛️' }
}

export default function Routed() {
  const navigate = useNavigate()
  const [info, setInfo] = useState(null)
  const [meta, setMeta] = useState({ id: '', time: '' })

  useEffect(() => {
    const u = localStorage.getItem('chat_user')
    if (!u) navigate('/login')
    let analysis = null, message = ''
    try { analysis = JSON.parse(localStorage.getItem('last_analysis') || 'null') } catch {}
    try { message = localStorage.getItem('last_message') || '' } catch {}
    const auth = detectAuthority(message, analysis?.category)
    setInfo({ message, analysis, authority: auth })
    const now = new Date()
    const id = `SAM-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${now.getTime()}`
    const time = `${now.toLocaleDateString('ar-SA')} ${now.toLocaleTimeString('ar-SA')}`
    setMeta({ id, time })
  }, [navigate])

  if (!info) return null

  return (
    <div className="grid view">
      <Card title="تأكيد توجيه الطلب">
        <div className="grid">
          <div className="card section" style={{ animationDelay: '0.02s' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>تم استلام طلبك بنجاح</div>
            <div className="hero-sub">رقم الطلب غير مطلوب هنا (واجهة فقط).</div>
          </div>
          <div className="card section" style={{ animationDelay: '0.08s', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <div className="hero-sub">رقم الطلب</div>
              <div style={{ fontWeight: 700 }}>{meta.id}</div>
            </div>
            <div>
              <div className="hero-sub">وقت الاستلام</div>
              <div style={{ fontWeight: 700 }}>{meta.time}</div>
            </div>
          </div>
          <div className="card section" style={{ animationDelay: '0.12s' }}>
            <div style={{ fontWeight: 700 }}>تم تحليل محتوى الرسالة وتصنيفها</div>
            <div className="hero-sub">{info.analysis?.category || 'تصنيف عام — سيتم التدقيق لاحقًا'}</div>
          </div>
          <div className="card section" style={{ animationDelay: '0.22s', display: 'grid', gridTemplateColumns: 'auto 1fr' }}>
            <div style={{ fontSize: 28 }}>{info.authority.icon}</div>
            <div>
              <div style={{ fontWeight: 700 }}>تم توجيه طلبك إلى القسم المختص</div>
              <div className="hero-sub">{info.authority.name}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={() => navigate('/')}>رجوع إلى الصفحة الرئيسية</Button>
            <Button variant="secondary" onClick={() => navigate('/chat')}>العودة إلى الشات</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
