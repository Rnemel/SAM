import Card from '../components/Card'
import Button from '../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Home() {
  const navigate = useNavigate()
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || 'ar' } catch { return 'ar' }
  })
  useEffect(() => {
    function onLang() { try { setLang(localStorage.getItem('lang') || 'ar') } catch {} }
    window.addEventListener('sam-lang', onLang)
    return () => window.removeEventListener('sam-lang', onLang)
  }, [])
  function start() { navigate('/login') }
  return (
    <div className="grid">
      <div className="hero hero-animated section-xl" style={{ animationDelay: '0.02s' }}>
        <div className="kicker">{lang === 'ar' ? 'نموذج MVP جاهز' : 'MVP Model Ready'}</div>
        <div className="hero-title"><img src="/sam-logo.png" alt="شعار" className="inline-logo" /> — {lang === 'ar' ? 'مساعد رقمي موثوق لإتمام معاملاتك الحكومية بكفاءة' : 'A trusted digital assistant to complete your government tasks'}</div>
        <div className="lead">{lang === 'ar' ? 'واجهة عربية رسمية، موحّدة وآمنة، تدعم الاتجاه من اليمين إلى اليسار بالكامل.' : 'Official Arabic interface with full RTL support, unified and secure.'}</div>
        <div className="hero-badges">
          <span className="badge"><span className="nav-icon">{
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 13l2.5 2.5L16 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          }</span>{lang === 'ar' ? 'موثوق' : 'Trusted'}</span>
          <span className="badge"><span className="nav-icon">{
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18v4H3V6Z" stroke="currentColor" strokeWidth="1.6"/><path d="M3 14h12v4H3v-4Z" stroke="currentColor" strokeWidth="1.6"/></svg>
          }</span>{lang === 'ar' ? 'موحّد' : 'Unified'}</span>
          <span className="badge"><span className="nav-icon">{
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M12 4a16 16 0 0 1 0 16" stroke="currentColor" strokeWidth="1.6"/></svg>
          }</span>{lang === 'ar' ? 'RTL' : 'RTL'}</span>
        </div>
        <div className="hero-actions">
          <Button variant="primary" className="btn-glow" onClick={start}>{lang === 'ar' ? 'ابدأ الآن — انتقل إلى المساعد الذكي' : 'Start Now — Go to Smart Assistant'}</Button>
          <Link to="/pricing" className="link">{lang === 'ar' ? 'أسعار الخدمات' : 'Pricing'}</Link>
        </div>
        <div className="stats">
          <div className="stat-item">
            <div className="stat-value">28M+</div>
            <div className="hero-sub">{lang === 'ar' ? 'مستخدم في المنصات الحكومية' : 'Users across government platforms'}</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">42M+</div>
            <div className="hero-sub">{lang === 'ar' ? 'عملية شهرية' : 'Monthly transactions'}</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">RTL</div>
            <div className="hero-sub">{lang === 'ar' ? 'واجهة عربية رسمية مع دعم RTL' : 'Official Arabic interface with RTL support'}</div>
          </div>
        </div>
      </div>

      <div className="section-lg">
        <Card title={lang === 'ar' ? 'لماذا سَم؟' : 'Why SAM?'}>
          <div className="grid grid-3">
            <div className="card feature"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 13l2.5 2.5L16 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</div><div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'اعتمادية رسمية' : 'Official Reliability'}</div><div className="hero-sub">{lang === 'ar' ? 'تجربة موثوقة وفق معايير الجهات الحكومية.' : 'Reliable experience aligned with government standards.'}</div></div>
            <div className="card feature"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18v4H3V6Z" stroke="currentColor" strokeWidth="1.6"/><path d="M3 14h12v4H3v-4Z" stroke="currentColor" strokeWidth="1.6"/></svg>
            }</div><div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'وضوح الإجراءات' : 'Process Clarity'}</div><div className="hero-sub">{lang === 'ar' ? 'إرشاد واضح خطوة بخطوة وتقليل الأخطاء.' : 'Clear step-by-step guidance with fewer errors.'}</div></div>
            <div className="card feature"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5l6 4v6l-6 4-6-4V9l6-4Z" stroke="currentColor" strokeWidth="1.6"/></svg>
            }</div><div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'واجهة عربية RTL' : 'Arabic RTL UI'}</div><div className="hero-sub">{lang === 'ar' ? 'دعم لغوي كامل واتجاه نص عربي أصيل.' : 'Full language support with native RTL direction.'}</div></div>
          </div>
        </Card>
      </div>

      <div className="section-lg">
        <Card title={lang === 'ar' ? 'كيف يعمل النظام' : 'How It Works'}>
          <div className="grid grid-3">
            <div className="card feature"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.6"/><path d="M4.8 19a7.2 7.2 0 0 1 14.4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</div><div>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</div><div className="hero-sub">{lang === 'ar' ? 'تحقق آمن ومبسّط.' : 'Secure and simple verification.'}</div></div>
            <div className="card feature"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</div><div>{lang === 'ar' ? 'اختيار الخدمة' : 'Choose Service'}</div><div className="hero-sub">{lang === 'ar' ? 'قوائم واضحة ورسوم شفافة.' : 'Clear menus and transparent fees.'}</div></div>
            <div className="card feature"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4V6Z" stroke="currentColor" strokeWidth="1.6"/></svg>
            }</div><div>{lang === 'ar' ? 'الشات الذكي' : 'Smart Chat'}</div><div className="hero-sub">{lang === 'ar' ? 'إرشاد دقيق حتى إتمام الطلب.' : 'Accurate guidance until completion.'}</div></div>
          </div>
        </Card>
      </div>

      <div className="section-lg">
        <Card title={lang === 'ar' ? 'الخدمات' : 'Services'}>
          <div className="grid grid-3">
            <div className="card feature"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 7h12v10H6V7Z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 10h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</div><div>{lang === 'ar' ? 'تجديد إقامة' : 'Residence Renewal'}</div><div className="hero-sub">{lang === 'ar' ? 'تنسيق إجراءات التجديد حتى الإتمام.' : 'Coordinated renewal steps to completion.'}</div></div>
            <div className="card feature"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M8 8h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</div><div>{lang === 'ar' ? 'تسديد مخالفة' : 'Pay Violation'}</div><div className="hero-sub">{lang === 'ar' ? 'مراجعة المخالفات وتوجيه السداد.' : 'Review violations and guide payment.'}</div></div>
            <div className="card feature"><div className="icon-circle icon-float">{
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h12v12H6V6Z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 9l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            }</div><div>{lang === 'ar' ? 'تحديث بيانات' : 'Update Data'}</div><div className="hero-sub">{lang === 'ar' ? 'تصحيح البيانات الأساسية وإرسال الطلب.' : 'Correct core data and submit.'}</div></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <Button variant="primary" className="btn-glow" onClick={() => navigate('/pricing')}>{lang === 'ar' ? 'عرض جميع الخدمات والأسعار' : 'View all services and prices'}</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
