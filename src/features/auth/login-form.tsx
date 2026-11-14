'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { siteConfig, getWorkspaceUrl } from '@/config/site';
import { saveMarketingSession } from '@/hooks/use-auth-status';
import { apiFetch } from '@/lib/api';

export function LoginForm() {
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

        const targetUrl = new URL(getWorkspaceUrl('/'));
        targetUrl.searchParams.set('token', token);
        if (refreshToken) {
          targetUrl.searchParams.set('refresh', refreshToken);
        }
        window.location.href = targetUrl.toString();
      } else {
        throw new Error('No authentication token received.');
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Unable to connect to login services.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      <div>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Corporate Email"
          className="w-full px-4 py-3.5 rounded-xl border border-slate-300/80 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#367fa5]/30 focus:border-[#367fa5] transition shadow-sm"
        />
      </div>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3.5 pr-11 rounded-xl border border-slate-300/80 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#367fa5]/30 focus:border-[#367fa5] transition shadow-sm"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
        <label className="flex items-center gap-2.5 cursor-pointer select-none text-slate-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[#263746] focus:ring-[#367fa5]/30 cursor-pointer"
          />
          <span>Remember me</span>
        </label>
        <span className="text-slate-700 hover:text-slate-900 font-medium cursor-pointer">
          Forgot password?
        </span>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-7 py-3 rounded-xl bg-[#263746] hover:bg-[#1d2a36] active:scale-[0.99] text-white text-sm font-medium transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? 'Signing In...' : 'Sign In to Workspace'}
        </button>
      </div>

      <div className="pt-6">
        <div className="border-t border-slate-200/90 w-full mb-6" />
        <p className="text-center text-xs sm:text-sm text-slate-600">
          Don&apos;t have a company account?{' '}
          <Link href="/signup" className="font-semibold text-slate-900 hover:text-[#367fa5] transition">
            Create workspace
          </Link>
        </p>
      </div>
    </form>
  );
}