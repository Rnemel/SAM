import Card from '../components/Card'
import Button from '../components/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [idValue, setIdValue] = useState('')
  const [dob, setDob] = useState('')
  const [password, setPassword] = useState('')

  const [fullName, setFullName] = useState('')
  const [regId, setRegId] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')

  const navigate = useNavigate()

  function doLogin() {
    const idOk = /^\d{10}$/.test(idValue)
    if (!idOk || !dob || !password) return
    localStorage.setItem('chat_user', JSON.stringify({ nationalId: idValue }))
    navigate('/chat')
  }

  function doRegister() {
    const idOk = /^\d{10}$/.test(regId)
    const passOk = regPassword && regPassword === regConfirm
    if (!fullName.trim() || !idOk || !regPhone.trim() || !passOk) return
    localStorage.setItem('chat_user', JSON.stringify({ nationalId: regId, name: fullName }))
    navigate('/chat')
  }

  return (
    <div className="grid view" style={{ maxWidth: 520, margin: '60px auto' }}>
      {mode === 'login' && (
        <Card title="تسجيل الدخول">
          <div className="grid">
            <input
              className="card"
              placeholder="رقم الهوية الوطنية / رقم الإقامة"
              inputMode="numeric"
              pattern="\\d{10}"
              maxLength={10}
              value={idValue}
              onChange={e => setIdValue(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
            <input
              className="card"
              type="date"
              placeholder="تاريخ الميلاد"
              value={dob}
              onChange={e => setDob(e.target.value)}
            />
            <input
              className="card"
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button variant="primary" onClick={doLogin}>تسجيل الدخول</Button>
            <Button variant="secondary">تسجيل الدخول عبر نفاذ</Button>
            <div style={{ textAlign: 'center' }}>
              <button className="link" style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setMode('register')}>إنشاء حساب جديد</button>
            </div>
          </div>
        </Card>
      )}

      {mode === 'register' && (
        <Card title="إنشاء حساب">
          <div className="grid">
            <input className="card" placeholder="الاسم الكامل" value={fullName} onChange={e => setFullName(e.target.value)} />
            <input
              className="card"
              placeholder="رقم الهوية / الإقامة"
              inputMode="numeric"
              pattern="\\d{10}"
              maxLength={10}
              value={regId}
              onChange={e => setRegId(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
            <input className="card" placeholder="رقم الجوال" inputMode="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
            <input className="card" type="password" placeholder="كلمة المرور" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
            <input className="card" type="password" placeholder="تأكيد كلمة المرور" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
            <Button variant="primary" onClick={doRegister}>إنشاء حساب</Button>
            <div style={{ textAlign: 'center' }}>
              <button className="link" style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setMode('login')}>لديك حساب؟ تسجيل الدخول</button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
