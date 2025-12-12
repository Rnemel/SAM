import Card from '../components/Card'
import Button from '../components/Button'
import { useState, useEffect } from 'react'
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
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || 'ar' } catch { return 'ar' }
  })
  useEffect(() => {
    function onLang() { try { setLang(localStorage.getItem('lang') || 'ar') } catch {} }
    window.addEventListener('sam-lang', onLang)
    return () => window.removeEventListener('sam-lang', onLang)
  }, [])

  function doLogin() {
    const idOk = /^\d{10}$/.test(idValue)
    if (!idOk || !dob || !password || password.length < 6) return
    try {
      const current = JSON.parse(localStorage.getItem('chat_user') || 'null') || {}
      localStorage.setItem('chat_user', JSON.stringify({ ...current, nationalId: idValue }))
    } catch {
      localStorage.setItem('chat_user', JSON.stringify({ nationalId: idValue }))
    }
    navigate('/orders')
  }

  function doRegister() {
    const idOk = /^\d{10}$/.test(regId)
    const passOk = regPassword && regPassword === regConfirm
    if (!fullName.trim() || !idOk || !regPhone.trim() || !passOk || regPassword.length < 6) return
    localStorage.setItem('chat_user', JSON.stringify({ nationalId: regId, name: fullName }))
    navigate('/orders')
  }

  return (
    <div className="grid view auth">
      {mode === 'login' && (
        <Card title={lang === 'ar' ? 'تسجيل الدخول' : 'Login'}>
          <div className="form-grid">
            <div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'رقم الهوية الوطنية / رقم الإقامة' : 'National ID / Iqama Number'}</div>
            <input
              className="card"
              placeholder={lang === 'ar' ? 'أدخل رقمًا مكوّنًا من 10 أرقام' : 'Enter a 10-digit number'}
              inputMode="numeric"
              pattern="\\d{10}"
              maxLength={10}
              value={idValue}
              onChange={e => setIdValue(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
            {!/^\d{10}$/.test(idValue) && idValue && <div className="hero-sub" style={{ color: 'crimson' }}>{lang === 'ar' ? 'يرجى إدخال 10 أرقام صحيحة' : 'Please enter exactly 10 digits'}</div>}
            <div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'}</div>
            <input
              className="card"
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
            />
            {!dob && <div className="hero-sub" style={{ color: 'crimson' }}>{lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required'}</div>}
            <div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</div>
            <input
              className="card"
              type="password"
              placeholder={lang === 'ar' ? 'ستة أحرف على الأقل' : 'At least 6 characters'}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {password && password.length < 6 && <div className="hero-sub" style={{ color: 'crimson' }}>{lang === 'ar' ? 'الحد الأدنى 6 أحرف' : 'Minimum 6 characters'}</div>}
            <Button variant="primary" className="btn-block" onClick={doLogin} disabled={!/^\d{10}$/.test(idValue) || !dob || !password || password.length < 6}>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</Button>
            <Button variant="secondary" className="btn-block">{lang === 'ar' ? 'تسجيل الدخول عبر نفاذ' : 'Login via NAFATH'}</Button>
            <div style={{ textAlign: 'center' }}>
              <button className="link" style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setMode('register')}>{lang === 'ar' ? 'إنشاء حساب جديد' : 'Create a new account'}</button>
            </div>
            <div className="card" style={{ borderStyle: 'dashed' }}>
              <div className="hero-sub">{lang === 'ar' ? 'يتم استخدام بياناتك لأغراض التحقق وإتمام المعاملات فقط وفق الضوابط النظامية.' : 'Your data is used for verification and completing transactions only, in compliance with regulations.'}</div>
            </div>
          </div>
        </Card>
      )}

      {mode === 'register' && (
        <Card title={lang === 'ar' ? 'إنشاء حساب' : 'Create Account'}>
          <div className="form-grid">
            <div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</div>
            <input className="card" placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} value={fullName} onChange={e => setFullName(e.target.value)} />
            {!fullName.trim() && <div className="hero-sub" style={{ color: 'crimson' }}>{lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required'}</div>}
            <div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'رقم الهوية / الإقامة' : 'National ID / Iqama Number'}</div>
            <input
              className="card"
              placeholder={lang === 'ar' ? 'أدخل رقمًا مكوّنًا من 10 أرقام' : 'Enter a 10-digit number'}
              inputMode="numeric"
              pattern="\\d{10}"
              maxLength={10}
              value={regId}
              onChange={e => setRegId(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
            {!/^\d{10}$/.test(regId) && regId && <div className="hero-sub" style={{ color: 'crimson' }}>{lang === 'ar' ? 'يرجى إدخال 10 أرقام صحيحة' : 'Please enter exactly 10 digits'}</div>}
            <div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'رقم الجوال' : 'Mobile Number'}</div>
            <input className="card" placeholder={lang === 'ar' ? 'رقم الجوال' : 'Mobile Number'} inputMode="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
            {!regPhone.trim() && <div className="hero-sub" style={{ color: 'crimson' }}>{lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required'}</div>}
            <div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</div>
            <input className="card" type="password" placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'} value={regPassword} onChange={e => setRegPassword(e.target.value)} />
            {regPassword && regPassword.length < 6 && <div className="hero-sub" style={{ color: 'crimson' }}>{lang === 'ar' ? 'الحد الأدنى 6 أحرف' : 'Minimum 6 characters'}</div>}
            <div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</div>
            <input className="card" type="password" placeholder={lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'} value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
            {regConfirm && regPassword !== regConfirm && <div className="hero-sub" style={{ color: 'crimson' }}>{lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'}</div>}
            <Button variant="primary" className="btn-block" onClick={doRegister} disabled={!fullName.trim() || !/^\d{10}$/.test(regId) || !regPhone.trim() || !regPassword || regPassword.length < 6 || regPassword !== regConfirm}>{lang === 'ar' ? 'إنشاء حساب' : 'Create Account'}</Button>
            <div style={{ textAlign: 'center' }}>
              <button className="link" style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setMode('login')}>{lang === 'ar' ? 'لديك حساب؟ تسجيل الدخول' : 'Have an account? Login'}</button>
            </div>
            <div className="card" style={{ borderStyle: 'dashed' }}>
              <div className="hero-sub">{lang === 'ar' ? 'إنشاؤك لحساب يتيح متابعة الطلبات وإتمام المعاملات وفق الضوابط المعتمدة.' : 'Creating an account enables tracking and completing requests per approved regulations.'}</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
