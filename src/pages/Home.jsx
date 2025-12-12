import Card from '../components/Card'
import Button from '../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const navigate = useNavigate()
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || 'ar' } catch { return 'ar' }
  })
  const heroRef = useRef(null)
  const [par1, setPar1] = useState(0)
  const [par2, setPar2] = useState(0)
  const [mx, setMx] = useState(0)
  const [my, setMy] = useState(0)
  useEffect(() => {
    function onLang() { try { setLang(localStorage.getItem('lang') || 'ar') } catch {} }
    window.addEventListener('sam-lang', onLang)
    return () => window.removeEventListener('sam-lang', onLang)
  }, [])
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY || 0
      setPar1(y * 0.02)
      setPar2(y * 0.04)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    function onMove(e) {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) / r.width
      const y = (e.clientY - (r.top + r.height / 2)) / r.height
      setMx(x)
      setMy(y)
    }
    function onLeave() { setMx(0); setMy(0) }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave) }
  }, [])
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    const steps = Array.from(document.querySelectorAll('.step-anim'))
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.classList.add('in-view')
      }
    }, { threshold: 0.15 })
    els.forEach(el => obs.observe(el))
    steps.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  const logged = !!localStorage.getItem('chat_user')
  function start() { navigate(logged ? '/chat' : '/login') }
  return (
    <div className="grid">
      <div id="about" ref={heroRef} className="hero absher-hero hero-animated section-xl landing-hero reveal in-view" style={{ animationDelay: '0.02s', position: 'relative' }}>
        <div className="card hero-surface hero-panel">
          <div className="kicker badge-gold">{lang === 'ar' ? 'Absher Guide' : 'Absher Guide'}</div>
          <div className="hero-title-absher">{lang === 'ar' ? 'إجراءاتك في أبشر.. بنفسك وبأمان' : 'Your Absher procedures.. by yourself and safely'}</div>
          <div className="sub-absher">{lang === 'ar' ? 'لا تشارك كلمة المرور مع أحد. مساعدنا الذكي يرشدك خطوة بخطوة مجاناً.' : "Don't share your password. Our assistant guides you step-by-step for free."}</div>
          <div className="hero-badges">
          <span className="badge"><span className="nav-icon">{
            <svg className="feature-icon icon-draw" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 13l2.5 2.5L16 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          }</span>{lang === 'ar' ? 'موثوق' : 'Trusted'}</span>
          <span className="badge"><span className="nav-icon">{
            <svg className="feature-icon icon-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18v4H3V6Z" stroke="currentColor" strokeWidth="1.6"/><path d="M3 14h12v4H3v-4Z" stroke="currentColor" strokeWidth="1.6"/></svg>
          }</span>{lang === 'ar' ? 'موحّد' : 'Unified'}</span>
          <span className="badge"><span className="nav-icon">{
            <svg className="feature-icon icon-pulse" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M12 4a16 16 0 0 1 0 16" stroke="currentColor" strokeWidth="1.6"/></svg>
          }</span>{lang === 'ar' ? 'RTL' : 'RTL'}</span>
          </div>
          <div className="hero-actions">
            <Button variant="primary" className="btn-glow cta-large" onClick={start}>{lang === 'ar' ? 'ابدأ المحادثة الآن' : 'Start Chat Now'}</Button>
          </div>
          <div className="stats">
          <div className="stat-item card-glass reveal">
            <div className="stat-value">100%</div>
            <div className="hero-sub">{lang === 'ar' ? 'خصوصية كاملة' : 'Full Privacy'}</div>
          </div>
          <div className="stat-item card-glass reveal">
            <div className="stat-value">0</div>
            <div className="hero-sub">{lang === 'ar' ? 'تخزين كلمات المرور' : 'Password Storage'}</div>
          </div>
          <div className="stat-item card-glass reveal">
            <div className="stat-value">مجاني</div>
            <div className="hero-sub">{lang === 'ar' ? 'مساعد آلي متاح للجميع' : 'Free AI Assistant'}</div>
          </div>
          </div>
        </div>
        <div className="hero-figure card hero-surface" style={{ display: 'grid', gap: 10 }}>
          <div className="chat-box" style={{ width: 320 }}>
            <div className="chat-header"><div className="chat-title">{lang === 'ar' ? 'المحادثة' : 'Chat'}</div><div className="status"><span className="status-dot" />{lang === 'ar' ? 'المساعد متصل' : 'Assistant Online'}</div></div>
            <div className="chat-body">
              <div className="bubble bubble-assistant"><div className="bubble-title">{lang === 'ar' ? 'دليل أبشر' : 'Absher Guide'}</div>{lang === 'ar' ? 'أخبرني ما العملية التي تريد تنفيذها.' : 'Tell me what transaction you want to do.'}</div>
              <div className="bubble bubble-user">{lang === 'ar' ? 'أريد تغيير رقم الجوال في أبشر' : 'I want to change my Absher phone number'}</div>
              <div className="bubble bubble-assistant">{lang === 'ar' ? 'سأرشدك خطوة بخطوة، بدون أي بيانات حساسة.' : 'I will guide you step-by-step, no sensitive data.'}</div>
            </div>
            <div className="chat-footer"><Button variant="primary" className="btn-block">{lang === 'ar' ? 'ابدأ الآن' : 'Start Now'}</Button></div>
          </div>
        </div>
        
      </div>

      <div className="section-lg reveal">
        <Card title={lang === 'ar' ? 'عن المنصة' : 'About the Platform'}>
          <div className="grid">
            <div className="lead">{lang === 'ar'
              ? 'منصة "دليل أبشر" تحمي المواطنين من مكاتب الخدمات غير الموثوقة عبر مساعد آلي مجاني يرشدك خطوة بخطوة لتنفيذ معاملاتك بنفسك وبأمان على بوابة أبشر الرسمية.'
              : 'Absher Guide protects citizens from untrusted service offices by providing a free AI assistant that guides you step-by-step to safely complete your own transactions on the official Absher portal.'}</div>
            <div className="grid">
              <div className="card">
                <div className="card-title">{lang === 'ar' ? 'مبادئ أساسية' : 'Core Principles'}</div>
                <div className="hero-sub">{lang === 'ar' ? 'خصوصية 100% · لا نحفظ كلمات المرور · واجهة عربية RTL · تجربة مبسطة لكبار السن.' : '100% Privacy · We do not store passwords · Arabic RTL UI · Simplified for older users.'}</div>
              </div>
              <div className="card">
                <div className="card-title">{lang === 'ar' ? 'ماذا نفعل؟' : 'What We Do'}</div>
                <div className="hero-sub">{lang === 'ar' ? 'نحلّل طلبك ونقدّم خطوات رسمية واضحة قابلة للتنفيذ، مع تنبيهات الأمان، وروابط مباشرة للصفحات الصحيحة في أبشر.' : 'We analyze your request and provide clear, official steps you can execute, with security warnings and direct links to the correct Absher pages.'}</div>
              </div>
              <div className="card">
                <div className="card-title">{lang === 'ar' ? 'خدمات مدعومة' : 'Supported Services'}</div>
                <div className="hero-sub">{lang === 'ar' ? 'تجديد إقامة، تسديد مخالفة مرور، تحديث بيانات الأحوال، إصدار بدل فاقد، نقل خدمات، والمزيد.' : 'Residence renewal, traffic fine payment, civil affairs data update, replacement issuance, service transfer, and more.'}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="section-lg reveal">
        <Card title={lang === 'ar' ? 'المشكلة × الحل' : 'Problem × Solution'}>
          <div className="comparison">
            <div className="panel panel-danger">
              <div style={{ fontWeight: 800, color: 'var(--color-danger)' }}>{lang === 'ar' ? 'مكاتب الخدمات' : 'Service Offices'}</div>
              <div className="hero-sub">{lang === 'ar' ? 'خطر سرقة الهوية · رسوم · انعدام الخصوصية' : 'Identity theft risk · Fees · No privacy'}</div>
            </div>
            <div className="panel panel-safe">
              <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{lang === 'ar' ? 'موقعنا' : 'Our Website'}</div>
              <div className="hero-sub">{lang === 'ar' ? 'خصوصية 100% · مجاني · دقة مدعومة بالذكاء الاصطناعي' : '100% Private · Free · AI powered accuracy'}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="section-lg reveal">
        <Card title={lang === 'ar' ? 'الفوائد' : 'Benefits'}>
          <div className="benefits">
            <div className="benefit-item"><span className="nav-icon">{
              <svg className="feature-icon icon-draw" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 13l2.5 2.5L16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            }</span>{lang === 'ar' ? 'إرشاد دقيق وواضح' : 'Precise, clear guidance'}</div>
            <div className="benefit-item"><span className="nav-icon">{
              <svg className="feature-icon icon-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            }</span>{lang === 'ar' ? 'واجهة عربية رسمية' : 'Official Arabic UI'}</div>
            <div className="benefit-item"><span className="nav-icon">{
              <svg className="feature-icon icon-pulse" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4a16 16 0 0 1 0 16" stroke="currentColor" strokeWidth="1.8"/></svg>
            }</span>{lang === 'ar' ? 'جاهز للتكامل والحماية' : 'Ready for secure integration'}</div>
          </div>
        </Card>
      </div>

      <div className="section-lg reveal">
        <Card title={lang === 'ar' ? 'كيف يعمل؟' : 'How it works?'}>
          <div className="steps-compact">
            <div className="step-item step-anim"><div className="icon-circle">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4V6Z" stroke="currentColor" strokeWidth="1.6"/></svg>
            }</div><div>{lang === 'ar' ? 'أخبرنا ماذا تريد' : 'Tell us what you need'}</div></div>
            <div className="step-item step-anim"><div className="icon-circle">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4l6 4v8l-6 4-6-4V8l6-4Z" stroke="currentColor" strokeWidth="1.6"/></svg>
            }</div><div>{lang === 'ar' ? 'المساعد يجهز لك الخطوات' : 'Assistant prepares steps'}</div></div>
            <div className="step-item step-anim"><div className="icon-circle">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 13l2.5 2.5L16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            }</div><div>{lang === 'ar' ? 'نفّذ العملية بأمان' : 'Execute safely'}</div></div>
          </div>
        </Card>
      </div>

      <div className="section-lg reveal">
        <Card title={lang === 'ar' ? 'الخدمات' : 'Services'}>
          <div className="grid grid-3">
            <div className="card feature card-glass"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 7h12v10H6V7Z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 10h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</div><div>{lang === 'ar' ? 'تجديد إقامة' : 'Residence Renewal'}</div><div className="hero-sub">{lang === 'ar' ? 'تنسيق إجراءات التجديد حتى الإتمام.' : 'Coordinated renewal steps to completion.'}</div></div>
            <div className="card feature card-glass"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M8 8h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</div><div>{lang === 'ar' ? 'تسديد مخالفة' : 'Pay Violation'}</div><div className="hero-sub">{lang === 'ar' ? 'مراجعة المخالفات وتوجيه السداد.' : 'Review violations and guide payment.'}</div></div>
            <div className="card feature card-glass"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h12v12H6V6Z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 9l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</div><div>{lang === 'ar' ? 'تحديث بيانات' : 'Update Data'}</div><div className="hero-sub">{lang === 'ar' ? 'تصحيح البيانات الأساسية وإرسال الطلب.' : 'Correct core data and submit.'}</div></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <Button variant="primary" className="btn-glow" onClick={() => navigate('/pricing')}>{lang === 'ar' ? 'عرض جميع الخدمات والأسعار' : 'View all services and prices'}</Button>
          </div>
        </Card>
      </div>

      <div id="security" className="section-lg reveal">
        <Card title={lang === 'ar' ? 'شارات الثقة والأمان' : 'Trust & Security Badges'}>
          <div className="trust-note">
            <span className="shield">{
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l7 4v6c0 5-7 8-7 8s-7-3-7-8V7l7-4Z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 13l2.5 2.5L16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            }</span>
            <span style={{ fontWeight: 800, marginInlineStart: 10 }}>{lang === 'ar' ? 'Zero Data Storage' : 'Zero Data Storage'}</span>
            <div className="hero-sub" style={{ marginTop: 6 }}>{lang === 'ar' ? 'لا نحفظ كلمات المرور أو أي بيانات حساسة.' : "We don't save passwords or sensitive data."}</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
