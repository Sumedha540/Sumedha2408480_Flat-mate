import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

export function PaymentVerifyPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [txnId,  setTxnId]  = useState('')

  useEffect(() => {
    const pidx          = searchParams.get('pidx')
    const khaltiStatus  = searchParams.get('status')    // 'Completed' | 'User canceled' etc.
    const transactionId = searchParams.get('transaction_id')

    // If Khalti reports failure before we even verify
    if (!pidx || khaltiStatus !== 'Completed') {
      setStatus('failed')
      return
    }

    // Verify with your backend
    fetch('/api/payment/khalti/verify', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ pidx }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setTxnId(data.transactionId || transactionId || '')
          setStatus('success')
        } else {
          setStatus('failed')
        }
      })
      .catch(() => setStatus('failed'))
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying your Khalti payment...</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Payment Confirmed!</h1>
          <p className="text-gray-600 mb-2">You are now a Flat-Mate Premium member.</p>
          {txnId && <p className="text-xs text-gray-400 mb-6">Transaction ID: <code className="font-mono">{txnId}</code></p>}
          <Link to="/" className="px-6 py-3 bg-button-primary text-white font-bold rounded-full hover:bg-button-primary/90 transition-all">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">❌</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">The payment was cancelled or could not be verified.</p>
        <Link to="/" className="px-6 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all">
          Go Back
        </Link>
      </div>
    </div>
  )
}