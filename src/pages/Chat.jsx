import Card from '../components/Card'
import Button from '../components/Button'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Chat() {
  const navigate = useNavigate()
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || 'ar' } catch { return 'ar' }
  })
  const [messages, setMessages] = useState([
    { from: 'assistant', text: 'مرحبًا بك في سَم، المساعد الرقمي الرسمي. صِف معاملتك الحكومية لنوجّهك بدقة خطوة بخطوة.', time: new Date().toLocaleTimeString('ar-SA') }
  ])
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('')
  const [typing, setTyping] = useState(false)
  const [user, setUser] = useState(null)
  const [debugOpen, setDebugOpen] = useState(false)
  const [connStatus, setConnStatus] = useState('')
  const [connError, setConnError] = useState('')
  const bodyRef = useRef(null)
  const recRef = useRef(null)
  const [recording, setRecording] = useState(false)
  const [recError, setRecError] = useState('')
  const recTimerRef = useRef(null)
  const [recSeconds, setRecSeconds] = useState(0)
  const [recInterim, setRecInterim] = useState('')
  const recStartGuardRef = useRef(false)
  const mediaRecRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const mediaChunksRef = useRef([])
  

  function getSamFee() {
    let v = 0
    try { v = Number(localStorage.getItem('sam_fee') || '0') } catch {}
    if (v === 5.99) return v
    v = 5.99
    try { localStorage.setItem('sam_fee', String(v)) } catch {}
    return v
  }

  useEffect(() => {
    let cancelled = false
    async function initEmbed() {
      try {
        const mod = await import('https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js')
        const Chatbot = mod.default || mod.Chatbot || window.Chatbot
        if (!cancelled && Chatbot && !window.__flowise_inited) {
          const container = document.getElementById('flowise-chatbot')
          Chatbot.init({
            chatflowid: '6d898019-f1bb-4c57-b28b-4f52ca40530e',
            apiHost: 'https://cloud.flowiseai.com',
            container,
            theme: {
              button: {
                backgroundColor: 'transparent',
                iconColor: 'transparent',
                size: 'small',
                right: -1000,
                bottom: -1000
              },
              chatWindow: {
                showTitle: false
              }
            }
          })
          window.__flowise_inited = true
        }
      } catch {}
    }
    initEmbed()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const u = localStorage.getItem('chat_user')
    if (!u) navigate('/login')
    try { setUser(JSON.parse(u)) } catch {}
    try {
      const hist = JSON.parse(localStorage.getItem('chat_history') || 'null')
      if (hist && Array.isArray(hist) && hist.length > 0) setMessages(hist)
      const la = JSON.parse(localStorage.getItem('last_analysis') || 'null')
      if (la) setResult(la)
      const lm = localStorage.getItem('last_message') || ''
      if (lm) setInput(lm)
    } catch {}
    function onLang() { try { setLang(localStorage.getItem('lang') || 'ar') } catch {} }
    window.addEventListener('sam-lang', onLang)
    return () => window.removeEventListener('sam-lang', onLang)
  }, [navigate])

  function analyze(text) {
    const t = text || ''
    let category = 'أحوال مدنية — تحديث بيانات'
    let fees = []
    if (/[إ|ا]قامة|جواز|الجوازات/.test(t)) {
      category = 'الجوازات — تجديد إقامة'
      fees = [
        { type: 'تأخير تجديد إقامة', authority: 'الجوازات', amount: 100 },
      ]
    } else if (/مخالفة|المرور|مرور/.test(t)) {
      category = 'المرور — تسديد مخالفة'
      fees = [
        { type: 'مخالفة سرعة', authority: 'المرور', amount: 300 },
      ]
    } else {
      fees = [
        { type: 'تحديث بيانات', authority: 'أحوال مدنية', amount: 0 },
      ]
    }
    const samFee = getSamFee()
    const total = fees.reduce((s, f) => s + f.amount, 0) + samFee
    return { category, fees, samFee, total }
  }

  async function send(custom) {
    const txt = (custom ?? input).trim()
    if (!txt || typing) return
    const newMsgs = [...messages, { from: 'user', text: txt, time: new Date().toLocaleTimeString('ar-SA') }]
    setMessages(newMsgs)
    try { localStorage.setItem('chat_history', JSON.stringify(newMsgs)) } catch {}
    setInput('')
    setStatus('')
    setTyping(true)
    const r = analyze(txt)
    setResult(r)
    try { localStorage.setItem('last_message', txt) } catch {}
    try { localStorage.setItem('last_analysis', JSON.stringify(r)) } catch {}
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push({ id: Date.now(), text: txt, time: new Date().toLocaleTimeString('ar-SA'), category: r.category, fees: r.fees, samFee: r.samFee, total: r.total, stage: 0 })
      localStorage.setItem('orders', JSON.stringify(orders))
    } catch {}
    try {
      const history = newMsgs.map(m => ({ role: m.from === 'user' ? 'userMessage' : 'apiMessage', content: m.text }))
      const res = await fetch('/api/flowise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: txt, history, streaming: false })
      })
      if (res.ok) {
        const data = await res.json()
        const reply = data?.text || data?.response || data?.message || ''
        if (reply) {
          const withAssistant = [...newMsgs, { from: 'assistant', text: reply, time: new Date().toLocaleTimeString('ar-SA') }]
          setMessages(withAssistant)
          try { localStorage.setItem('chat_history', JSON.stringify(withAssistant)) } catch {}
          setTyping(false)
          return
        }
      }
      setConnError(`HTTP ${res.status}`)
    } catch (e) {
      setConnError(String(e?.message || 'Network Error'))
    }
    setTimeout(() => {
      const icon = r.category.includes('المرور') ? '🚘' : r.category.includes('الجوازات') ? '🛂' : '🏛️'
      const summary = `${icon} تم التحليل: ${r.category}. الإجمالي: ${r.total} ر.س`
      const withAssistant = [...newMsgs, { from: 'assistant', text: summary, time: new Date().toLocaleTimeString('ar-SA') }]
      setMessages(withAssistant)
      try { localStorage.setItem('chat_history', JSON.stringify(withAssistant)) } catch {}
      setTyping(false)
    }, 500)
  }

  useEffect(() => {
    try {
      const el = bodyRef.current
      if (el) el.scrollTop = el.scrollHeight
    } catch {}
  }, [messages, typing])

  function quick(text) { send(text) }

  function clearChat() {
    const initial = [{ from: 'assistant', text: 'مرحبًا بك في سَم. اكتب طلبك الحكومي أو مشكلتك لنرشدك.', time: new Date().toLocaleTimeString('ar-SA') }]
    setMessages(initial)
    setResult(null)
    setStatus('')
    setInput('')
    setTyping(false)
    try {
      localStorage.removeItem('chat_history')
      localStorage.removeItem('last_message')
      localStorage.removeItem('last_analysis')
    } catch {}
  }

  function logout() {
    try { localStorage.removeItem('chat_user') } catch {}
    navigate('/login')
  }

  function pay() {
    navigate('/pay')
  }

  

  async function toggleMic() {
    setRecError('')
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      const secureOK = (window.isSecureContext || location.hostname === 'localhost')
      if (!secureOK) {
        setRecError(lang === 'ar' ? 'لا يعمل الميكروفون إلا عبر https أو localhost' : 'Microphone requires https or localhost')
        return
      }
      const hasSR = !!SR
      const hasMR = typeof MediaRecorder !== 'undefined'
      if (!recording) {
        if (!hasSR && !hasMR) {
          setRecError(lang === 'ar' ? 'لا يدعم المتصفح تحويل الصوت أو تسجيله' : 'Browser does not support speech or recording')
          return
        }
        if (!hasSR && hasMR) {
          await startMediaRecorder()
          return
        }
        try {
          const s = await (navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({ audio: true }) : Promise.reject(new Error('no-media')))
          try { s.getTracks().forEach(t => t.stop()) } catch {}
        } catch (err) {
          const msg = String(err && err.name ? err.name : err && err.message ? err.message : 'Mic permission error')
          if (/Permission|NotAllowedError|not-allowed/i.test(msg)) {
            setRecError(lang === 'ar' ? 'تم رفض إذن الميكروفون. رجاءً اسمح له من إعدادات الموقع.' : 'Microphone permission denied. Allow it in site settings.')
          } else if (/NotFoundError|DevicesNotFound/i.test(msg)) {
            setRecError(lang === 'ar' ? 'لم يتم العثور على جهاز صوت.' : 'No audio input device found.')
          } else {
            setRecError(msg)
          }
          return
        }
        const recog = new SR()
        recRef.current = recog
        try { recog.lang = lang === 'ar' ? 'ar-SA' : 'en-US' } catch {}
        try { recog.interimResults = true } catch {}
        try { recog.maxAlternatives = 1 } catch {}
        try { recog.continuous = true } catch {}
        setRecSeconds(0)
        try { clearInterval(recTimerRef.current) } catch {}
        recTimerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000)
        recStartGuardRef.current = true
        try { recog.onstart = () => { recStartGuardRef.current = false } } catch {}
        recog.onresult = (e) => {
          try {
            const res = e.results || []
            let finalText = ''
            for (let i = e.resultIndex || 0; i < res.length; i++) {
              const r = res[i]
              const t = (r && r[0] && r[0].transcript) || ''
              if (!t) continue
              if (r.isFinal) finalText += t + ' '
              else setRecInterim(t)
            }
            if (finalText) {
              setInput(v => (v ? v + ' ' : '') + finalText.trim())
              setRecInterim('')
            }
          } catch {}
        }
        recog.onerror = (e) => {
          const code = e && e.error ? e.error : ''
          if (code === 'aborted' && recording && !recStartGuardRef.current) {
            setTimeout(() => { try { recog.start() } catch {} }, 200)
            return
          }
          if (code === 'not-allowed') {
            setRecError(lang === 'ar' ? 'تم رفض إذن الميكروفون. فعّل الإذن ثم أعد المحاولة.' : 'Microphone permission denied. Enable it and retry.')
          } else if (code === 'no-speech') {
            setRecError(lang === 'ar' ? 'لم يتم التقاط صوت. تكلّم بوضوح قريبًا من الميكروفون.' : 'No speech detected. Speak clearly near the mic.')
          } else {
            setRecError(String(code || 'Speech error'))
          }
          setRecording(false)
          try { clearInterval(recTimerRef.current) } catch {}
          setRecInterim('')
        }
        recog.onend = () => {
          if (recording) {
            setTimeout(() => { try { recog.start() } catch {} }, 200)
            return
          }
          setRecording(false)
          try { clearInterval(recTimerRef.current) } catch {}
          setRecInterim('')
        }
        try {
          recog.start()
          setRecording(true)
        } catch (err) {
          setRecError(String(err && err.message ? err.message : 'Mic error'))
          setRecording(false)
          try { clearInterval(recTimerRef.current) } catch {}
          setRecInterim('')
        }
      } else {
        if (!hasSR && hasMR) {
          await stopMediaRecorder()
          return
        }
        try { recRef.current && recRef.current.stop() } catch {}
        setRecording(false)
        try { clearInterval(recTimerRef.current) } catch {}
        setRecInterim('')
        setRecSeconds(0)
      }
    } catch (e) {
      setRecError(String(e && e.message ? e.message : 'Mic error'))
      setRecording(false)
    }
  }

  async function blobToBase64(blob) {
    const buffer = await blob.arrayBuffer()
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i])
    return btoa(binary)
  }

  async function startMediaRecorder() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      const rec = new MediaRecorder(stream)
      mediaRecRef.current = rec
      mediaChunksRef.current = []
      setRecSeconds(0)
      try { clearInterval(recTimerRef.current) } catch {}
      recTimerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000)
      rec.ondataavailable = (e) => { try { if (e.data && e.data.size > 0) mediaChunksRef.current.push(e.data) } catch {} }
      rec.onerror = (e) => { setRecError(String(e?.name || e?.message || 'Recorder error')) }
      rec.onstop = async () => {
        try { clearInterval(recTimerRef.current) } catch {}
        setRecording(false)
        setRecInterim('')
        try {
          const blob = new Blob(mediaChunksRef.current, { type: 'audio/webm' })
          mediaChunksRef.current = []
          const b64 = await blobToBase64(blob)
          const res = await fetch('/api/stt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ audio: b64, mime: blob.type }) })
          if (res.ok) {
            const j = await res.json()
            const tr = j && j.text || ''
            if (tr) { setInput(tr); send(tr) }
          } else {
            const errText = await res.text().catch(() => '')
            setRecError(errText || 'STT error')
          }
        } catch (err) {
          setRecError(String(err && err.message ? err.message : 'STT error'))
        }
        try { mediaStreamRef.current && mediaStreamRef.current.getTracks().forEach(t => t.stop()) } catch {}
        mediaStreamRef.current = null
        mediaRecRef.current = null
      }
      rec.start(250)
      setRecording(true)
    } catch (err) {
      setRecError(String(err && err.message ? err.message : 'Mic error'))
      setRecording(false)
    }
  }

  async function stopMediaRecorder() {
    try { mediaRecRef.current && mediaRecRef.current.stop() } catch {}
  }

  async function testConnection() {
    setConnStatus('جاري الاختبار...')
    setConnError('')
    try {
      const res = await fetch('/api/flowise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'ping', history: [], streaming: false })
      })
      if (res.ok) {
        const data = await res.json()
        const preview = (data?.text || data?.response || data?.message || '').slice(0, 120)
        setConnStatus(preview ? `متصل — ${preview}…` : 'متصل')
      } else {
        setConnError(`HTTP ${res.status}`)
        setConnStatus('فشل الاتصال')
      }
    } catch (e) {
      setConnError(String(e?.message || 'Network Error'))
      setConnStatus('فشل الاتصال')
    }
  }

  return (
    <div className="grid">
      <Card title={lang === 'ar' ? 'الشات الذكي' : 'Smart Chat'}>
        <div className="chat-box">
          <div className="chat-header">
            <div className="avatar avatar-sam">{lang === 'ar' ? 'س' : 'S'}</div>
            <div>
              <div className="chat-title">{lang === 'ar' ? 'المساعد سَم' : 'SAM Assistant'}</div>
              <div className="hero-sub">{lang === 'ar' ? 'أكتب طلبك وسَنرشدك خطوة بخطوة.' : 'Describe your request and we will guide you.'}</div>
              <div className="hero-sub" style={{ fontWeight: 700 }}>{(lang === 'ar' ? 'سَم — ' : 'SAM — ') + (user?.name || (lang === 'ar' ? 'مستخدم' : 'User'))}</div>
            </div>
            <div className="status">{(lang === 'ar' ? 'سَم — ' : 'SAM — ') + (user?.name || (lang === 'ar' ? 'مستخدم' : 'User'))}</div>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              m.from === 'assistant' ? (
                <div key={i} className="bubble-row section" style={{ animationDelay: `${0.05 * i}s` }}>
                  <div className="avatar avatar-sam">{lang === 'ar' ? 'س' : 'S'}</div>
                  <div className="bubble bubble-assistant">
                    <div className="bubble-title">{lang === 'ar' ? 'سَم' : 'SAM'}</div>
                    <div>{m.text}</div>
                    {m.time && <div className="hero-sub" style={{ marginTop: 4 }}>{m.time}</div>}
                  </div>
                </div>
              ) : (
                <div key={i} className="bubble-row section" style={{ animationDelay: `${0.05 * i}s` }}>
                  <div className="avatar avatar-user">{(user?.name || String(user?.nationalId || '')).slice(0, 1) || (lang === 'ar' ? 'م' : 'U')}</div>
                  <div className="bubble bubble-user">
                    <div>{m.text}</div>
                    {m.time && <div className="hero-sub" style={{ marginTop: 4 }}>{m.time}</div>}
                  </div>
                </div>
              )
            ))}
            {typing && (
              <div className="bubble-row section" style={{ animationDelay: '0.05s' }}>
                <div className="avatar avatar-sam">{lang === 'ar' ? 'س' : 'S'}</div>
                <div className="bubble bubble-assistant">
                  <div className="bubble-title">{lang === 'ar' ? 'سَم' : 'SAM'}</div>
                  <div>{lang === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}</div>
                </div>
              </div>
            )}
          </div>
          <div className="chat-footer">
          <div className="compose">
              <input className="compose-input" placeholder="اكتب طلبك أو مشكلتك هنا" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send() }} />
              <Button variant="primary" onClick={() => send()}>{lang === 'ar' ? 'إرسال' : 'Send'}</Button>
          </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={() => quick('أرغب في تجديد الإقامة')}>{lang === 'ar' ? 'تجديد إقامة' : 'Residence Renewal'}</Button>
              <Button variant="secondary" onClick={() => quick('لدي مخالفة مرورية وأريد السداد')}>{lang === 'ar' ? 'تسديد مخالفة' : 'Pay Violation'}</Button>
              <Button variant="secondary" onClick={() => quick('أحتاج تحديث بيانات الأحوال')}>{lang === 'ar' ? 'تحديث بيانات' : 'Update Data'}</Button>
              <Button variant="ghost" onClick={clearChat}>{lang === 'ar' ? 'مسح المحادثة' : 'Clear Chat'}</Button>
            </div>
            <div id="flowise-chatbot" style={{ marginTop: 10 }} />
          </div>
        </div>
      </Card>

      {result && (
        <Card title="تحليل الطلب والرسوم">
          <div className="grid">
            <div className="card">
              <div className="hero-sub">نتيجة التحليل</div>
              <div style={{ fontWeight: 700 }}>
                <span style={{ marginInlineEnd: 6 }}>
                  {result.category.includes('المرور') ? '🚘' : result.category.includes('الجوازات') ? '🛂' : '🏛️'}
                </span>
                {result.category}
              </div>
            </div>
            <div className="card">
              <div className="hero-sub">الرسوم الحكومية المرتبطة</div>
              <div className="grid">
                {result.fees.map((f, idx) => (
                  <div key={idx} className="grid" style={{ gridTemplateColumns: '1fr auto auto', alignItems: 'center' }}>
                    <div>{f.type}</div>
                    <div className="hero-sub">{f.authority}</div>
                    <div style={{ fontWeight: 700 }}>{f.amount} ر.س</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
              <div className="hero-sub">سعر خدمة سَم</div>
              <div style={{ fontWeight: 700 }}>{result.samFee} ر.س</div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
              <div>الإجمالي</div>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{result.total} ر.س</div>
            </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={pay}>الدفع الآن</Button>
            <Button variant="secondary" onClick={() => navigate('/fees')}>عرض الرسوم</Button>
          </div>
          {status && (
            <div className="card" style={{ borderStyle: 'dashed' }}>{status}</div>
          )}
        </div>
      </Card>
      )}
    </div>
  )
}
