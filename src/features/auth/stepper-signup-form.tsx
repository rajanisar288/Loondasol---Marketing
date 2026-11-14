'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { siteConfig, getWorkspaceUrl } from '@/config/site';
import { saveMarketingSession } from '@/hooks/use-auth-status';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';

export function StepperSignupForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Email verification state
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [verificationEmail, setVerificationEmail] = useState<string>('');

  // Payment mock state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'invoice' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Logo upload state
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);

  // Comprehensive Form State
  const [formData, setFormData] = useState({
    // Step 1: Organization & Admin Account
    companyName: '',
    logoUrl: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    // Step 2: Location & Address
    country: 'US',
    city: '',
    postalCode: '',
    address: '',
    region: 'USA',
    // Step 3: Localization & Fiscal
    timezone: 'UTC',
    currency: 'USD',
    // Step 4: Plan & Seats Selection
    subscriptionPlan: 'PRO' as 'STARTER' | 'PRO' | 'ENTERPRISE',
    purchasedSeats: 10,
  });

  const getPlanPricePerSeat = (plan: 'STARTER' | 'PRO' | 'ENTERPRISE'): number => {
    switch (plan) {
      case 'STARTER':
        return 3;
      case 'ENTERPRISE':
        return 8;
      case 'PRO':
      default:
        return 5;
    }
  };

  const getAiQuotaLabel = (plan: 'STARTER' | 'PRO' | 'ENTERPRISE'): string => {
    switch (plan) {
      case 'STARTER':
        return '1,000 requests/month';
      case 'ENTERPRISE':
        return 'Unlimited requests';
      case 'PRO':
      default:
        return '5,000 requests/month';
    }
  };

  const totalMonthlyCost = formData.purchasedSeats * getPlanPricePerSeat(formData.subscriptionPlan);
  const progressPercent = Math.round((currentStep / 5) * 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'purchasedSeats' ? Math.max(1, parseInt(value, 10) || 1) : value,
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setLogoUploadError('Logo file size must not exceed 5MB.');
      return;
    }

    setIsUploadingLogo(true);
    setLogoUploadError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('logo', file);

      const response = await apiFetch(`${siteConfig.apiUrl}/upload/logo`, {
        method: 'POST',
        body: uploadData,
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.message || 'Failed to upload logo image.');
      }

      const url = resJson.url;
      setUploadedLogoUrl(url);
      setFormData((prev) => ({ ...prev, logoUrl: url }));
    } catch (err: unknown) {
      setLogoUploadError((err as Error).message || 'Logo upload failed.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.companyName.trim() &&
          formData.firstName.trim() &&
          formData.lastName.trim() &&
          formData.email.trim() &&
          formData.password.length >= 8
        );
      case 2:
        return !!formData.country && !!formData.region;
      case 3:
        return !!formData.timezone && !!formData.currency;
      case 4:
        return formData.purchasedSeats >= 1;
      case 5:
        if (paymentMethod === 'card') {
          return cardNumber.replace(/\s/g, '').length >= 15 && cardExpiry.length >= 4 && cardCvc.length >= 3;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep)) {
      setErrorMessage(null);
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch(`${siteConfig.apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'company',
          companyName: formData.companyName,
          logoUrl: formData.logoUrl || uploadedLogoUrl || undefined,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          city: formData.city,
          postalCode: formData.postalCode,
          address: formData.address,
          region: formData.region,
          timezone: formData.timezone,
          currency: formData.currency,
          subscriptionPlan: formData.subscriptionPlan,
          purchasedSeats: formData.purchasedSeats,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please check your inputs.');
      }

      // Transition to OTP verification step
      setIsLoading(false);
      setVerificationEmail(formData.email);
      setIsVerifying(true);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to submit registration.');
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim().length !== 6) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch(`${siteConfig.apiUrl}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: verificationEmail,
          code: verificationCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid 6-digit verification code.');
      }

      const token = data.accessToken || data.token;
      const refreshToken = data.refreshToken;
      const user = data.user;

      if (token) {
        saveMarketingSession(token, refreshToken, user);

        // Instant seamless handoff into workspace
        const targetUrl = new URL(getWorkspaceUrl('/dashboard'));
        targetUrl.searchParams.set('token', token);
        if (refreshToken) {
          targetUrl.searchParams.set('refresh', refreshToken);
        }
        window.location.href = targetUrl.toString();
      } else {
        window.location.href = getWorkspaceUrl('/dashboard');
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Verification failed.');
      setIsLoading(false);
    }
  };

  // STEP 6: VERIFICATION VIEW (Post-Submission)
  if (isVerifying) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#edf4f7] text-[#367fa5] flex items-center justify-center mx-auto text-2xl shadow-sm">
          ✉️
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#263746]">
            Verify Your Corporate Email
          </h2>
          <p className="text-xs text-[#344653]/80 mt-1 max-w-sm mx-auto">
            A 6-digit confirmation code has been dispatched to <strong>{verificationEmail}</strong>.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-[8px] bg-red-50 border border-red-200 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleVerifySubmit} className="space-y-4 max-w-xs mx-auto">
          <input
            type="text"
            maxLength={6}
            required
            autoFocus
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full text-center text-3xl font-extrabold tracking-widest px-4 py-3 rounded-[8px] border-2 border-[#dbe7ec] text-[#263746] focus:border-[#367fa5] focus:outline-none"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Confirm & Enter Workspace →'}
          </Button>
        </form>
      </div>
    );
  }

  // 5-STEP MULTI-STEPPER VIEW
  return (
    <div className="space-y-6">
      {/* Visual Stepper Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#367fa5] uppercase tracking-wider">
            Step {currentStep} of 5
          </span>
          <span className="text-xs text-[#344653]/70 font-semibold">{progressPercent}% Completed</span>
        </div>
        <div className="w-full bg-[#edf4f7] rounded-full h-2 overflow-hidden border border-[#dbe7ec]">
          <div
            className="bg-[#367fa5] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Indicator Badges */}
        <div className="hidden sm:grid grid-cols-5 gap-2 mt-4 text-center select-none">
          {[
            { num: 1, label: 'Identity' },
            { num: 2, label: 'Location' },
            { num: 3, label: 'Fiscal' },
            { num: 4, label: 'Plan & Seats' },
            { num: 5, label: 'Payment' },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-2 rounded-[8px] border text-xs font-semibold transition ${
                currentStep === s.num
                  ? 'border-[#367fa5] bg-white text-[#367fa5] shadow-xs'
                  : currentStep > s.num
                  ? 'border-[#dbe7ec] bg-[#edf4f7] text-[#263746]'
                  : 'border-transparent text-[#344653]/50'
              }`}
            >
              <span>{currentStep > s.num ? '✓ ' : `${s.num}. `}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-[8px] bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {/* STEP 1: IDENTITY & ROOT ADMIN */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="border-b border-[#dbe7ec] pb-2">
            <h3 className="text-base font-bold text-[#263746]">
              Organization &amp; Administrator Account
            </h3>
            <p className="text-xs text-[#344653]/80">
              Configure your workspace organization name, corporate branding logo, and root credentials.
            </p>
          </div>

          {/* Logo Upload Card Component */}
          <div className="flex items-center space-x-4 p-4 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec]">
            <div className="w-16 h-16 rounded-[8px] bg-white border border-[#dbe7ec] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
              {uploadedLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={uploadedLogoUrl}
                  alt="Company Logo Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">🏢</span>
              )}
            </div>

            <div className="flex-1 text-xs">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center px-3 py-1.5 rounded-[8px] text-xs font-semibold text-white bg-[#367fa5] hover:bg-[#2b6585] shadow-xs transition">
                  {isUploadingLogo ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    <span>{uploadedLogoUrl ? 'Change Workspace Logo' : 'Upload Workspace Logo'}</span>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    disabled={isUploadingLogo}
                    className="hidden"
                  />
                </label>
                {uploadedLogoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedLogoUrl(null);
                      setFormData((prev) => ({ ...prev, logoUrl: '' }));
                    }}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[#344653]/70 mt-1">
                Optional. PNG, SVG, or JPG (max 5MB). Displays in your team workspace navbar.
              </p>
              {logoUploadError && (
                <p className="text-red-600 font-semibold text-[11px] mt-1">
                  {logoUploadError}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
              Company Legal Name *
            </label>
            <input
              type="text"
              required
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Loondasol Technologies Corp"
              className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
                Admin First Name *
              </label>
              <input
                type="text"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Marcus"
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
                Admin Last Name *
              </label>
              <input
                type="text"
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Vance"
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
              Corporate Email *
            </label>
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="marcus@company.com"
              className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
              Root Password *
            </label>
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
            />
          </div>
        </div>
      )}

      {/* STEP 2: LOCATION & SOVEREIGN SHARD */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="border-b border-[#dbe7ec] pb-2">
            <h3 className="text-base font-bold text-[#263746]">
              Physical Location &amp; Data Residency Shard
            </h3>
            <p className="text-xs text-[#344653]/80">
              Select sovereign data residency for compliance with GDPR, US CLOUD, or GCC laws.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
              Regional Database Residency Shard *
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
            >
              <option value="USA">Americas Region (USA Shard 2 — US-East / West)</option>
              <option value="EU">European Union (EU Shard 2 — Frankfurt / Dublin GDPR)</option>
              <option value="UAE">Middle East (UAE Shard 1 — Dubai / Gulf Sovereign)</option>
              <option value="PK">South Asia (PK Shard 1 — Karachi / Islamabad)</option>
              <option value="IND">India (IND Shard 1 — Mumbai / Bengaluru)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
              Headquarters Country *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
            >
              <option value="US">United States (US)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="AE">United Arab Emirates (AE)</option>
              <option value="SA">Saudi Arabia (SA)</option>
              <option value="DE">Germany (DE)</option>
              <option value="FR">France (FR)</option>
              <option value="CA">Canada (CA)</option>
              <option value="PK">Pakistan (PK)</option>
              <option value="IN">India (IND)</option>
              <option value="SG">Singapore (SG)</option>
              <option value="OTHER">Other / Worldwide</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="San Francisco"
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="94105"
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="100 Innovation Way, Suite 400"
              className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
            />
          </div>
        </div>
      )}

      {/* STEP 3: FISCAL & LOCALIZATION */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="border-b border-[#dbe7ec] pb-2">
            <h3 className="text-base font-bold text-[#263746]">
              Preferences &amp; Localization
            </h3>
            <p className="text-xs text-[#344653]/80">
              Configure attendance timezone calculation and fiscal ledger baseline currency.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
              Timezone Baseline *
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
            >
              <option value="UTC">UTC (Universal Coordinated Time)</option>
              <option value="America/New_York">America/New_York (EST / EDT)</option>
              <option value="America/Chicago">America/Chicago (CST / CDT)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST / PDT)</option>
              <option value="Europe/London">Europe/London (GMT / BST)</option>
              <option value="Europe/Berlin">Europe/Berlin (CET / CEST)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
              <option value="Asia/Karachi">Asia/Karachi (PKT, UTC+5)</option>
              <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT, UTC+8)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
              Default Ledger Currency *
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
            >
              <option value="USD">USD ($) — US Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
              <option value="AED">AED (د.إ) — UAE Dirham</option>
              <option value="PKR">PKR (₨) — Pakistani Rupee</option>
              <option value="INR">INR (₹) — Indian Rupee</option>
              <option value="CAD">CAD (C$) — Canadian Dollar</option>
            </select>
          </div>
        </div>
      )}

      {/* STEP 4: SUBSCRIPTION PLAN & EMPLOYEE SEATS */}
      {currentStep === 4 && (
        <div className="space-y-5">
          <div className="border-b border-[#dbe7ec] pb-2">
            <h3 className="text-base font-bold text-[#263746]">
              Select Subscription Plan &amp; Employee Seats
            </h3>
            <p className="text-xs text-[#344653]/80">
              Only pay for the team members you add. Flexible per-seat pricing with AI quotas.
            </p>
          </div>

          {/* Three Tier Plan Select Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'STARTER' as const,
                title: 'Starter',
                price: 3,
                ai: '1,000 AI/mo',
                desc: 'Core Attendance, Directory & Tasks',
              },
              {
                id: 'PRO' as const,
                title: 'Growth Pro',
                price: 5,
                popular: true,
                ai: '5,000 AI/mo',
                desc: 'Automated Payroll & Custom Roles',
              },
              {
                id: 'ENTERPRISE' as const,
                title: 'Enterprise',
                price: 8,
                ai: 'Unlimited AI',
                desc: 'Priority Sharding & Dedicated Queues',
              },
            ].map((p) => {
              const isSelected = formData.subscriptionPlan === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setFormData({ ...formData, subscriptionPlan: p.id })}
                  className={`p-4 rounded-[8px] border-2 cursor-pointer transition flex flex-col justify-between relative bg-white ${
                    isSelected
                      ? 'border-[#367fa5] bg-[#edf4f7]/40 shadow-xs'
                      : 'border-[#dbe7ec] hover:border-[#82b8ce]'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#367fa5] text-white">
                      Popular
                    </span>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#263746]">{p.title}</span>
                      {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#367fa5]" />}
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-extrabold text-[#263746]">${p.price}</span>
                      <span className="text-[10px] text-[#344653]/70 ml-1">/ user / mo</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#367fa5] block mt-1">
                      🤖 {p.ai}
                    </span>
                    <p className="text-[11px] text-[#344653]/80 mt-2">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stepper Seat Counter */}
          <div className="p-4 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-[#263746]">Total Workforce Seats</h5>
                <p className="text-[11px] text-[#344653]/80">
                  Includes 1 company owner + {Math.max(0, formData.purchasedSeats - 1)} staff invitations
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, purchasedSeats: Math.max(1, formData.purchasedSeats - 1) })}
                  disabled={formData.purchasedSeats <= 1}
                  className="w-8 h-8 rounded-[8px] bg-white border border-[#dbe7ec] text-[#263746] font-bold flex items-center justify-center hover:bg-[#edf4f7] disabled:opacity-40"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  name="purchasedSeats"
                  value={formData.purchasedSeats}
                  onChange={handleChange}
                  className="w-16 px-2 py-1.5 text-center font-bold text-sm rounded-[8px] border border-[#dbe7ec] bg-white text-[#263746]"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, purchasedSeats: formData.purchasedSeats + 1 })}
                  className="w-8 h-8 rounded-[8px] bg-white border border-[#dbe7ec] text-[#263746] font-bold flex items-center justify-center hover:bg-[#edf4f7]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#dbe7ec] flex justify-between items-center text-xs">
              <span className="text-[#344653]">Total Monthly Subscription:</span>
              <span className="text-base font-extrabold text-[#367fa5]">
                ${totalMonthlyCost} / month
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: PAYMENT METHOD & REVIEW CONFIRMATION */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <div className="border-b border-[#dbe7ec] pb-2">
            <h3 className="text-base font-bold text-[#263746]">
              Payment Method &amp; Order Review
            </h3>
            <p className="text-xs text-[#344653]/80">
              Provide corporate billing details and verify workspace deployment specifications.
            </p>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card' as const, label: 'Credit Card', icon: '💳' },
                { id: 'invoice' as const, label: 'Net-30 Invoice', icon: '📄' },
                { id: 'crypto' as const, label: 'Stripe Pay', icon: '⚡' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3 rounded-[8px] border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                    paymentMethod === m.id
                      ? 'border-[#367fa5] bg-white text-[#367fa5] shadow-xs ring-1 ring-[#367fa5]'
                      : 'border-[#dbe7ec] bg-[#edf4f7] text-[#344653]'
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Inputs */}
          {paymentMethod === 'card' && (
            <div className="p-4 rounded-[8px] bg-white border border-[#dbe7ec] space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
                    Expiration (MM/YY) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
                    Security Code (CVC) *
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="•••"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'invoice' && (
            <div className="p-4 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec] text-xs text-[#344653]/90 leading-relaxed">
              Your company will be verified for Net-30 invoice terms. We will issue your monthly invoice to <strong>{formData.email}</strong>.
            </div>
          )}

          {paymentMethod === 'crypto' && (
            <div className="p-4 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec] text-xs text-[#344653]/90 leading-relaxed">
              Direct checkout link will be generated via Stripe Connect checkout session upon activation.
            </div>
          )}

          {/* Order Summary Box */}
          <div className="p-4 rounded-[8px] bg-[#edf4f7] border border-[#dbe7ec] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#344653]">Company:</span>
              <span className="font-bold text-[#263746]">{formData.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#344653]">Data Shard:</span>
              <span className="font-bold text-[#367fa5]">{formData.region} Sovereign Shard</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#344653]">Plan &amp; Seats:</span>
              <span className="font-bold text-[#263746]">
                {formData.subscriptionPlan} Tier ({formData.purchasedSeats} users)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#344653]">AI Co-Pilot Allowance:</span>
              <span className="font-bold text-emerald-600">{getAiQuotaLabel(formData.subscriptionPlan)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#dbe7ec] text-sm">
              <span className="font-bold text-[#263746]">Total Due:</span>
              <span className="font-extrabold text-[#367fa5]">${totalMonthlyCost} / month</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#dbe7ec]">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 text-xs font-semibold text-[#263746] hover:underline"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            variant="primary"
          >
            <span>
              {currentStep === 1
                ? 'Next: Location & Shard →'
                : currentStep === 2
                ? 'Next: Fiscal & Timezone →'
                : currentStep === 3
                ? 'Next: Plan & Seats →'
                : 'Next: Payment & Review →'}
            </span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleRegisterSubmit}
            disabled={isLoading || !isStepValid(5)}
            variant="primary"
          >
            {isLoading ? 'Deploying Workspace...' : 'Launch Enterprise Workspace →'}
          </Button>
        )}
      </div>

      <div className="text-center pt-2">
        <span className="text-xs text-[#344653]/80">
          Already registered?{' '}
          <Link href="/login" className="text-[#367fa5] font-semibold hover:underline">
            Sign in to existing workspace
          </Link>
        </span>
      </div>
    </div>
  );
}
