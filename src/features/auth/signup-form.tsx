'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { siteConfig, getWorkspaceUrl } from '@/config/site';
import { saveMarketingSession } from '@/hooks/use-auth-status';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';

export function SignupForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    region: 'USA',
    subscriptionPlan: 'PRO',
    purchasedSeats: 10,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pricePerSeat = formData.subscriptionPlan === 'STARTER' ? 3 : formData.subscriptionPlan === 'PRO' ? 5 : 8;
  const estimatedCost = pricePerSeat * formData.purchasedSeats;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'purchasedSeats' ? Math.max(1, parseInt(value, 10) || 1) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch(`${siteConfig.apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'company',
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          region: formData.region,
          subscriptionPlan: formData.subscriptionPlan,
          purchasedSeats: formData.purchasedSeats,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please check your inputs.');
      }

      // Automatically store session if token is provided
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
        // If email verification or redirect is requested
        window.location.href = getWorkspaceUrl('/auth/login');
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Registration request failed.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-[8px] bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
          Company Name
        </label>
        <input
          type="text"
          required
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Acme Global Corporation"
          className="w-full px-3.5 py-2 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
            First Name
          </label>
          <input
            type="text"
            required
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Sarah"
            className="w-full px-3.5 py-2 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
            Last Name
          </label>
          <input
            type="text"
            required
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Jenkins"
            className="w-full px-3.5 py-2 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
          Corporate Email
        </label>
        <input
          type="email"
          required
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="sarah@acme.com"
          className="w-full px-3.5 py-2 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
          Password
        </label>
        <input
          type="password"
          required
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Minimum 8 characters"
          className="w-full px-3.5 py-2 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
            Residency Shard
          </label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-[8px] border border-[#dbe7ec] bg-white text-xs text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
          >
            <option value="USA">Americas (USA)</option>
            <option value="EU">Europe (EU)</option>
            <option value="UAE">Middle East (UAE)</option>
            <option value="PK">Pakistan (PK)</option>
            <option value="IND">India (IND)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
            Subscription Plan
          </label>
          <select
            name="subscriptionPlan"
            value={formData.subscriptionPlan}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-[8px] border border-[#dbe7ec] bg-white text-xs text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
          >
            <option value="STARTER">Starter ($3 / seat)</option>
            <option value="PRO">Growth Pro ($5 / seat)</option>
            <option value="ENTERPRISE">Enterprise ($8 / seat)</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider">
            Employee Seats Allocation
          </label>
          <span className="text-xs font-bold text-[#367fa5]">
            ${estimatedCost}/month ({formData.purchasedSeats} users)
          </span>
        </div>
        <input
          type="number"
          min="1"
          max="10000"
          name="purchasedSeats"
          value={formData.purchasedSeats}
          onChange={handleChange}
          className="w-full px-3.5 py-2 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
        />
        <p className="text-[11px] text-[#344653]/70 mt-1">
          Includes 1 company owner account and {Math.max(0, formData.purchasedSeats - 1)} staff invitations.
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-3"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Workspace...' : 'Launch Company Workspace'}
      </Button>

      <div className="text-center pt-2">
        <span className="text-xs text-[#344653]/80">
          Already registered?{' '}
          <Link href="/login" className="text-[#367fa5] font-semibold hover:underline">
            Sign in here
          </Link>
        </span>
      </div>
    </form>
  );
}
