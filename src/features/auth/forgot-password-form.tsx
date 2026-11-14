'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { apiFetch } from '@/lib/api';

interface ForgotPasswordFormProps {
  initialStep?: 1 | 2 | 3;
}

export function ForgotPasswordForm({ initialStep = 1 }: ForgotPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const otpParam = searchParams.get('otp');
    if (emailParam) {
      setEmail(emailParam);
    }
    if (otpParam) {
      setOtp(otpParam);
      setStep(3);
    }
  }, [searchParams]);

  // Step 1: Send OTP to email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await apiFetch(`${siteConfig.apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send password reset code. Please verify your email.');
      }

      setSuccessMessage('A 6-digit verification code has been dispatched to your corporate email.');
      setStep(2);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to dispatch verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch(`${siteConfig.apiUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });

      const data = await response.json();

      if (!response.ok || data.valid === false) {
        throw new Error(data.message || 'Invalid or expired verification code. Please check and try again.');
      }

      setSuccessMessage('Verification code confirmed. Please set your new secure password.');
      setStep(3);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to verify code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch(`${siteConfig.apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to reset password. Please request a new OTP.');
      }

      setSuccessMessage('Password successfully updated! Redirecting you to sign in...');
      setTimeout(() => {
        router.push('/login');
      }, 1800);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Progress Indicators */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#dbe7ec]">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= 1 ? 'bg-[#263746] text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            1
          </div>
          <span className={`text-xs font-medium ${step >= 1 ? 'text-[#263746]' : 'text-slate-400'}`}>
            Request OTP
          </span>
        </div>
        <div className="flex-1 h-0.5 mx-2 bg-slate-200">
          <div
            className="h-full bg-[#263746] transition-all"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= 2 ? 'bg-[#263746] text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            2
          </div>
          <span className={`text-xs font-medium ${step >= 2 ? 'text-[#263746]' : 'text-slate-400'}`}>
            Verify OTP
          </span>
        </div>
        <div className="flex-1 h-0.5 mx-2 bg-slate-200">
          <div
            className="h-full bg-[#263746] transition-all"
            style={{ width: step === 3 ? '100%' : '0%' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step === 3 ? 'bg-[#263746] text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            3
          </div>
          <span className={`text-xs font-medium ${step === 3 ? 'text-[#263746]' : 'text-slate-400'}`}>
            New Password
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-fadeIn">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 animate-fadeIn">
          {successMessage}
        </div>
      )}

      {/* Step 1: Email Form */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#263746] mb-1.5">
              Corporate Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. employee@company.com"
              className="w-full px-4 py-3 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
            />
            <p className="mt-1.5 text-[11px] text-[#52636f]">
              We will send a one-time 6-digit verification code to this address.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#263746] hover:bg-[#1c2c3a] text-white text-sm font-medium transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Dispatching Code...</span>
                </>
              ) : (
                'Send Verification Code'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: OTP Verification Form */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#263746]">
                6-Digit Verification Code
              </label>
              <button
                type="button"
                onClick={handleRequestOtp}
                className="text-[11px] text-[#367fa5] hover:underline"
              >
                Resend Code
              </button>
            </div>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full text-center tracking-[0.5em] text-lg font-bold px-4 py-3 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-[#1c2c3a] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
            />
            <p className="mt-1.5 text-[11px] text-[#52636f]">
              Sent to: <span className="font-semibold text-slate-700">{email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-2/3 py-3 rounded-xl bg-[#263746] hover:bg-[#1c2c3a] text-white text-sm font-medium transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying Code...' : 'Verify Code'}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: New Password Form */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-semibold text-[#263746] mb-1.5">
              New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-3 pr-11 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-9 text-[#70828f] hover:text-[#1c2c3a] focus:outline-none p-1 transition"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263746] mb-1.5">
              Confirm New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              className="w-full px-4 py-3 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !newPassword || newPassword !== confirmPassword}
              className="w-full py-3 rounded-xl bg-[#263746] hover:bg-[#1c2c3a] text-white text-sm font-medium transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Updating Password...' : 'Save New Password & Sign In'}
            </button>
          </div>
        </form>
      )}

      {/* Footer Navigation */}
      <div className="mt-8 pt-5 border-t border-[#dbe7ec] text-center">
        <p className="text-xs text-[#52636f]">
          Remember your credentials?{' '}
          <Link href="/login" className="font-semibold text-[#263746] hover:text-[#367fa5] transition">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}