'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthSplitLayout } from '@/features/auth/auth-split-layout';
import { siteConfig } from '@/config/site';
import { apiFetch } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      const otpParam = params.get('otp');
      if (emailParam) {
        setEmail(emailParam);
      }
      if (otpParam) {
        setOtp(otpParam);
        setStep(3);
      }
    }
  }, []);

  // Step 1: Request OTP
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

      setSuccessMessage('Password successfully updated! Redirecting to sign in...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  const pageTitle = step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password';
  const pageSubtitle =
    step === 1
      ? 'Enter your corporate email address to receive a secure 6-digit recovery code.'
      : step === 2
      ? `Enter the 6-digit verification code sent to ${email}.`
      : 'Create a new secure password for your workspace account.';

  return (
    <AuthSplitLayout
      title={pageTitle}
      subtitle={pageSubtitle}
      footerPrompt="Remember your credentials?"
      footerLinkText="Back to Sign In"
      footerLinkHref="/login"
    >
      <div className="space-y-4">
        {/* Status Indicators */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-[#263746]' : 'bg-slate-300'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#263746]' : 'bg-slate-300'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-[#263746]' : 'bg-slate-300'}`} />
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-fadeIn">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 animate-fadeIn">
            {successMessage}
          </div>
        )}

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Corporate Email"
                className="w-full px-4 py-3.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#263746] hover:bg-[#1c2c3a] active:scale-[0.99] text-white text-xs sm:text-sm font-medium transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Sending Code...</span>
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-Digit Verification Code"
                className="w-full px-4 py-3.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm font-semibold tracking-widest text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition text-center"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[#52636f] hover:text-[#1c2c3a] transition"
              >
                ← Change Email
              </button>
              <button
                type="button"
                onClick={handleRequestOtp}
                className="text-[#367fa5] font-semibold hover:underline"
              >
                Resend Code
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="px-6 py-2.5 rounded-xl bg-[#263746] hover:bg-[#1c2c3a] active:scale-[0.99] text-white text-xs sm:text-sm font-medium transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Verifying Code...' : 'Verify Code'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password (min 8 characters)"
                className="w-full px-4 py-3.5 pr-11 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#70828f] hover:text-[#1c2c3a] focus:outline-none p-1 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full px-4 py-3.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !newPassword || newPassword !== confirmPassword}
                className="px-6 py-2.5 rounded-xl bg-[#263746] hover:bg-[#1c2c3a] active:scale-[0.99] text-white text-xs sm:text-sm font-medium transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Updating Password...' : 'Save New Password & Sign In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthSplitLayout>
  );
}