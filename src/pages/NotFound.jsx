import Card from '../components/Card'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="grid view" style={{ maxWidth: 600, margin: '40px auto' }}>
      <Card title="الصفحة غير موجودة">
        <div className="grid">
          <div className="hero-sub">تأكد من الرابط أو ارجع إلى الصفحة الرئيسية.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={() => navigate('/')}>العودة للرئيسية</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
