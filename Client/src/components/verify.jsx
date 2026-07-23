import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const hasCalled = useRef(false)

  const API = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (hasCalled.current) return
    hasCalled.current = true

    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('No verification token found')
      return
    }

    const verifyToken = async () => {
      try {
        const response = await axios.get(`${API}/api/Auth/verify-email?token=${token}`)
        if (response.data.success) {
          setStatus('success')
          setMessage(response.data.message)
        } else {
          setStatus('error')
          setMessage(response.data.message)
        }
      } catch (error) {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    }

    verifyToken()
  }, [searchParams, API])

  const handleResend = async (e) => {
    e.preventDefault()
    if (!resendEmail || !resendEmail.includes('@')) return

    setIsResending(true)
    setResendSuccess(false)
    try {
      const response = await axios.post(`${API}/api/Auth/resend-verification`, { email: resendEmail })
      if (response.data.success) {
        setResendSuccess(true)
        setMessage('')
        setStatus('resent')
      } else {
        setMessage(response.data.message)
      }
    } catch (error) {
      setMessage('Failed to resend email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] relative overflow-hidden px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 shadow-lg transition-transform duration-300 hover:scale-110 ${
            status === 'success' || status === 'resent'
              ? 'bg-gradient-to-br from-green-500 to-emerald-400 shadow-green-500/30'
              : status === 'error'
              ? 'bg-gradient-to-br from-red-500 to-orange-400 shadow-red-500/30'
              : 'bg-gradient-to-br from-blue-500 to-cyan-400 shadow-blue-500/30'
          }`}>
            {status === 'loading' && (
              <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {status === 'success' && (
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
            {(status === 'error' || status === 'resent') && (
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {status === 'loading' && 'Verifying your email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'resent' && 'Email Sent!'}
            {status === 'error' && 'Verification Failed'}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {status === 'loading' && 'Please wait while we verify your account'}
            {status === 'success' && 'Your account is now verified'}
            {status === 'resent' && 'Check your inbox for the new link'}
            {status === 'error' && 'There was a problem verifying your email'}
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-8 shadow-2xl shadow-black/40">
          {status === 'loading' && (
            <div className="flex justify-center py-4">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <p className="text-green-400 text-sm">{message}</p>
              <Link
                to="/Login"
                className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                Continue to Login
              </Link>
            </div>
          )}

          {(status === 'error' || status === 'resent') && (
            <div className="space-y-4">
              {message && (
                <p className="text-red-400 text-sm text-center">{message}</p>
              )}
              {resendSuccess && (
                <p className="text-green-400 text-sm text-center">Verification email sent! Check your inbox.</p>
              )}

              <div className="border-t border-slate-700/40 pt-4">
                <p className="text-slate-400 text-sm text-center mb-3">Didn't receive the email?</p>
                <form onSubmit={handleResend} className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 focus:bg-slate-800/70"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isResending || !resendEmail}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isResending ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </button>
                </form>
              </div>

              <div className="text-center pt-2">
                <Link to="/Login" className="text-slate-400 text-sm hover:text-slate-300 transition-colors duration-200">
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Verify