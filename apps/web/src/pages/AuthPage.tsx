import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth';

export default function AuthPage() {
  const nav = useNavigate()
  const { refresh } = useAuth();
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<1|2>(1)

  const request = useMutation({
    mutationFn: () => api.requestOtp({ email, name }),
    onSuccess: () => setStep(2)
  })

  const verify = useMutation({
    mutationFn: () => api.verifyOtp({ email, code }),
    onSuccess: async () => { await refresh(); nav('/'); }

  })

  async function showDevInbox() {
    // const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/auth/dev/inbox`)
    const res = await fetch(`${'http://localhost:4000'}/auth/dev/inbox`)
    const data = await res.json()
    alert(JSON.stringify(data.latest.filter((x: any) => x.email === email)[0] || data.latest[0] || {}, null, 2))
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">{step === 1 ? 'Login / Sign up' : 'Enter Code'}</h1>
      <div className="card p-4 space-y-3">
        {step === 1 ? (
          <>
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input" placeholder="Name (new users)" value={name} onChange={e => setName(e.target.value)} />
            <button className="btn btn-primary" onClick={() => request.mutate()} disabled={request.isPending}>Send Code</button>
            <button className="btn" onClick={showDevInbox}>Show Dev Inbox</button>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-600">We sent a 6-digit code to <span className="font-medium">{email}</span></div>
            <input className="input" placeholder="6-digit code" value={code} onChange={e => setCode(e.target.value)} />
            <div className="flex gap-2">
              <button className="btn" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" onClick={() => verify.mutate()} disabled={verify.isPending}>Verify</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
