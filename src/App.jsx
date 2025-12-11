import Router from './router'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  const { pathname } = useLocation()
  const [confirmed, setConfirmed] = useState(false)
  useEffect(() => {
    try { setConfirmed(localStorage.getItem('payment_status') === 'confirmed') } catch {}
    function onConfirmed() { setConfirmed(true) }
    window.addEventListener('sam-payment-confirmed', onConfirmed)
    return () => window.removeEventListener('sam-payment-confirmed', onConfirmed)
  }, [])

  const showSteps = ['/chat', '/fees', '/pay', '/routed'].includes(pathname)
  const steps = ['التحليل', 'الرسوم', 'الدفع', 'تأكيد']
  const pathToIndex = { '/chat': 0, '/fees': 1, '/pay': confirmed ? 3 : 2, '/routed': 3 }
  const current = pathToIndex[pathname] ?? 0

  return (
    <div className="app-shell">
      <Header />
      <div className="notice">
        <div className="container notice-inner">واجهة UI فقط — جاهزة للربط الرسمي لاحقًا</div>
      </div>
      <main className="container">
        {showSteps && (
          <div className="steps view" style={{ margin: '20px 0 8px' }}>
            {steps.map((label, i) => (
              <div key={label} className={`step ${i === current ? 'step-active' : i < current ? 'step-done' : ''}`}>
                <div className="step-index">{i + 1}</div>
                <div className="step-label">{label}</div>
                {i < steps.length - 1 && <div className="step-divider" />}
              </div>
            ))}
            <div className="progress" style={{ width: '100%', marginTop: 8 }}>
              <div className="progress-fill" style={{ width: `${(current / (steps.length - 1)) * 100}%` }} />
            </div>
          </div>
        )}
        <Router />
      </main>
      <Footer />
    </div>
  )
}
