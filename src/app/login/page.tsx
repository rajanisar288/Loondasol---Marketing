'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthSplitLayout } from '@/features/auth/auth-split-layout';
import { siteConfig, getWorkspaceUrl } from '@/config/site';
import { saveMarketingSession } from '@/hooks/use-auth-status';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch(`${siteConfig.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials. Please verify your email and password.');
      }

      const token = data.accessToken || data.token;
      const refreshToken = data.refreshToken;
      const user = data.user;

      if (token) {
        saveMarketingSession(token, refreshToken, user);

        const targetUrl = new URL(getWorkspaceUrl('/dashboard'));
        targetUrl.searchParams.set('token', token);
        if (refreshToken) {
          targetUrl.searchParams.set('refresh', refreshToken);
        }
        window.location.href = targetUrl.toString();
      } else {
        throw new Error('Authentication token not received.');
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Unable to sign in. Please verify your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Sign In"
      footerPrompt="Don't have a company account?"
      footerLinkText="Create workspace"
      footerLinkHref="/signup"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-fadeIn">
            {errorMessage}
          </div>
        )}

        {/* Corporate Email Field */}
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

        {/* Password Field with Eye Toggle */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-[#52636f]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border border-[#94a3b8] text-[#263746] focus:ring-0 cursor-pointer"
            />
            <span className="text-xs">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-[#2d404f] hover:text-[#1c2c3a] font-normal transition"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-[#263746] hover:bg-[#1c2c3a] active:scale-[0.99] text-white text-xs sm:text-sm font-medium transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In to Workspace'
            )}
          </button>
        </div>
      </form>
    </AuthSplitLayout>
  );
}