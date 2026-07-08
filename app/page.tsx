'use client'
import { useState } from 'react'

export default function Home() {
  const [msgs, setMsgs] = useState([{ role: 'ai', content: 'Namaste bhai! Main Bakchod AI hoon!' }])
  const [inp, setInp] = useState('')

  async function send() {
    if (!inp.trim()) return
    const userMsg = inp
    setMsgs(prev => [...prev, { role: 'user', content: userMsg }])
    setInp('')
    
    // TEST: Pehle bina API ke reply dekh
    setTimeout(() => {
    
    }, 500)

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ content: userMsg }] })
      })
      const d = await r.json()
      console.log("API REPLY:", d) // F12 me dikhega
      setMsgs(prev => [...prev, { role: 'ai', content: d.reply }])
    } catch (e: any) {
      setMsgs(prev => [...prev, { role: 'ai', content: 'API Error: ' + e.message + ' | route.ts check kar!' }])
    }
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#00ff88' }}>Bakchod AI - ONLINE</h2>
        {msgs.map((m, i) => (
          <div key={i} style={{ background: '#1e1e1e', padding: '12px', marginTop: '10px', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
            <b>{m.role === 'user' ? 'Tu: ' : 'AI: '}</b>{m.content}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} style={{ flex: 1, padding: '10px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px' }} placeholder="Yaha likh..." />
          <button onClick={send} style={{ background: '#00ff88', padding: '10px 15px', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Bhej</button>
        </div>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>F12 dabaa ke Console khol, waha error dikhega</p>
      </div>
    </div>
  )
}