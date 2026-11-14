'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { siteConfig, getWorkspaceUrl } from '@/config/site';
import { saveMarketingSession } from '@/hooks/use-auth-status';
import { BrandLogo } from '@/components/ui/brand-logo';
import { apiFetch } from '@/lib/api';
import { detectCountry, setCountryCode } from '@/lib/country';

interface StepInfo {
  number: number;
  label: string;
  title: string;
  subtitle: string;
  rightSubtitle: string;
}

const STEPS: StepInfo[] = [
  {
    number: 1,
    label: 'Create Account',
    title: 'Organization & Administrator Account',
    subtitle: 'Configure your company identity and root owner credentials.',
    rightSubtitle: 'Enter your organization and administrator details to get started.',
  },
  {
    number: 2,
    label: 'Business Address',
    title: 'Address',
    subtitle: 'Corporate location and registration details.',
    rightSubtitle: 'Provide your business address and location details.',
  },
  {
    number: 3,
    label: 'Preferences & Localization',
    title: 'Preferences & Localization',
    subtitle: 'Timezone and fiscal currency baseline.',
    rightSubtitle: 'Set your preferred language, time zone, and regional preferences.',
  },
  {
    number: 4,
    label: 'Select Workplace Plan',
    title: 'Select Workplace Plan',
    subtitle: 'Employee seats and AI co-pilot capabilities.',
    rightSubtitle: 'Choose your employee seat allocation and workspace billing tier.',
  },
  {
    number: 5,
    label: 'Review & Confirm',
    title: 'Review & Confirm',
    subtitle: 'Review your organization workspace setup and launch your cluster.',
    rightSubtitle: 'Review your organization workspace setup and launch your cluster.',
  },
];

const COUNTRY_OPTIONS = [
  { code: 'US', name: 'United States', region: 'USA' },
  { code: 'GB', name: 'United Kingdom', region: 'EU' },
  { code: 'DE', name: 'Germany', region: 'EU' },
  { code: 'FR', name: 'France', region: 'EU' },
  { code: 'AE', name: 'United Arab Emirates', region: 'UAE' },
  { code: 'SA', name: 'Saudi Arabia', region: 'UAE' },
  { code: 'PK', name: 'Pakistan', region: 'PK' },
  { code: 'IN', name: 'India', region: 'IND' },
  { code: 'CA', name: 'Canada', region: 'USA' },
  { code: 'AU', name: 'Australia', region: 'USA' },
];

const TIMEZONE_OPTIONS = [
  'UTC',
  'America/New_York (EST)',
  'America/Chicago (CST)',
  'America/Denver (MST)',
  'America/Los_Angeles (PST)',
  'Europe/London (GMT)',
  'Europe/Paris (CET)',
  'Europe/Berlin (CET)',
  'Asia/Dubai (GST)',
  'Asia/Karachi (PKT)',
  'Asia/Kolkata (IST)',
  'Asia/Singapore (SGT)',
  'Asia/Tokyo (JST)',
  'Australia/Sydney (AEST)',
];

const CURRENCY_OPTIONS = [
  { code: 'USD', name: 'USD ($) - US Dollar' },
  { code: 'EUR', name: 'EUR (€) - Euro' },
  { code: 'GBP', name: 'GBP (£) - British Pound' },
  { code: 'AED', name: 'AED (د.إ) - UAE Dirham' },
  { code: 'SAR', name: 'SAR (﷼) - Saudi Riyal' },
  { code: 'PKR', name: 'PKR (₨) - Pakistani Rupee' },
  { code: 'INR', name: 'INR (₹) - Indian Rupee' },
  { code: 'CAD', name: 'CAD ($) - Canadian Dollar' },
  { code: 'AUD', name: 'AUD ($) - Australian Dollar' },
];

export function SignupSplitStepper() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    detectCountry().then((detected) => {
      if (detected && !country) {
        setCountry(detected);
      }
    });
  }, []);

  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 Address
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');

  // Step 3 Localization
  const [timezone, setTimezone] = useState('');
  const [currency, setCurrency] = useState('');

  // Step 4 Plan & Seats
  const [subscriptionPlan, setSubscriptionPlan] = useState<'STARTER' | 'PRO' | 'ENTERPRISE'>('PRO');
  const [purchasedSeats, setPurchasedSeats] = useState<number>(10);

  // Step 5 Payment
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'invoice' | 'bank'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const currentStepInfo = STEPS[currentStep - 1];

  const getPricePerSeat = (plan: 'STARTER' | 'PRO' | 'ENTERPRISE'): number => {
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

  const getAiQuota = (plan: 'STARTER' | 'PRO' | 'ENTERPRISE'): string => {
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

  const monthlyTotal = purchasedSeats * getPricePerSeat(subscriptionPlan);

  // Logo upload handler
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setLogoError('Logo file size must not exceed 5MB.');
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setIsUploadingLogo(true);
    setLogoError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('logo', file);

      const response = await apiFetch(`${siteConfig.apiUrl}/upload/logo`, {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload logo.');
      }

      setLogoUrl(data.url || data.path || '');
    } catch (err: unknown) {
      setLogoError((err as Error).message || 'Failed to upload logo.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const validateStep1 = () => {
    if (!companyName.trim()) {
      setErrorMessage('Company Name is required.');
      return false;
    }
    if (!firstName.trim()) {
      setErrorMessage('First Name is required.');
      return false;
    }
    if (!lastName.trim()) {
      setErrorMessage('Last Name is required.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('A valid Corporate Email is required.');
      return false;
    }
    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!city.trim()) {
      setErrorMessage('City is required.');
      return false;
    }
    if (!address.trim()) {
      setErrorMessage('Address is required.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!validateStep1()) return;
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const finalCountry = country || 'US';
      const finalTimezone = timezone || 'UTC';
      const finalCurrency = currency || 'USD';
      const selectedCountryObj = COUNTRY_OPTIONS.find((c) => c.code === finalCountry);
      const region = selectedCountryObj?.region || 'USA';

      const payload = {
        type: 'company',
        companyName: companyName.trim(),
        logoUrl: logoUrl || undefined,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        country: finalCountry,
        city: city.trim(),
        postalCode: postalCode.trim(),
        address: address.trim(),
        region,
        timezone: finalTimezone,
        currency: finalCurrency,
        subscriptionPlan,
        purchasedSeats,
        paymentMethod,
      };

      setCountryCode(finalCountry);

      const response = await apiFetch(`${siteConfig.apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please verify your details.');
      }

      const token = data.accessToken || data.token;
      const refreshToken = data.refreshToken;
      const user = data.user;

      if (token) {
        saveMarketingSession(token, refreshToken, user);

        // If card payment was chosen and a plan selected, redirect to Stripe Checkout
        if (paymentMethod === 'card' && subscriptionPlan) {
          try {
            const checkoutRes = await apiFetch(`${siteConfig.apiUrl}/subscriptions/checkout`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                plan: subscriptionPlan,
              }),
            });
            const checkoutData = await checkoutRes.json();
            if (checkoutRes.ok && checkoutData.url && !checkoutData.isSandbox) {
              window.location.href = checkoutData.url;
              return;
            }
          } catch {
            // fallback to direct workspace handoff
          }
        }

        const targetUrl = new URL(getWorkspaceUrl('/dashboard'));
        targetUrl.searchParams.set('token', token);
        if (refreshToken) {
          targetUrl.searchParams.set('refresh', refreshToken);
        }
        window.location.href = targetUrl.toString();
      } else {
        router.push('/login');
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'An error occurred during workspace creation.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-b from-[#243444] via-[#2d4052] to-[#40586f] text-[#344653] font-sans antialiased overflow-x-hidden">
      {/* Left Form Panel (~65% width) */}
      <div className="w-full lg:w-[65%] bg-[#edf4f7] lg:rounded-r-[48px] shadow-2xl z-10 flex flex-col justify-between px-8 sm:px-12 md:px-16 lg:px-20 py-10 lg:py-14 min-h-screen">
        <div className="w-full max-w-[480px] mx-auto my-auto py-4">
          {/* Top Brand Logo */}
          <BrandLogo size="lg" />

          {/* Heading */}
          <div className="mt-8 mb-6">
            <h1 className="text-xl sm:text-[22px] font-bold tracking-tight text-[#1c2c3a]">
              {currentStepInfo.title}
            </h1>
            <p className="mt-1 text-xs text-[#52636f]">
              {currentStepInfo.subtitle}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-fadeIn">
              {errorMessage}
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* STEP 1: Organization & Admin Account */}
            {currentStep === 1 && (
              <>
                {/* Upload Workspace Logo Box */}
                <div>
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer block border border-[#cbd5e1] bg-[#edf4f7] rounded-xl p-3 hover:border-[#367fa5] transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg border border-[#cbd5e1] bg-white flex items-center justify-center text-slate-400 overflow-hidden flex-shrink-0">
                        {logoPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-[#1c2c3a] flex items-center gap-2">
                          <span>{logoFile ? logoFile.name : 'Upload Workspace Logo'}</span>
                          {isUploadingLogo && <span className="text-[10px] text-[#367fa5]">Uploading...</span>}
                          {logoUrl && <span className="text-[10px] text-emerald-600">✓ Uploaded</span>}
                        </div>
                        <div className="text-[11px] text-[#8c9ba5]">
                          PNG, SVG, or JPG max 5MB
                        </div>
                      </div>
                    </div>
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  {logoError && <p className="text-[11px] text-red-600 mt-1">{logoError}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company Name"
                    className="w-full px-4 py-3 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
                  />
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full px-4 py-3 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full px-4 py-3 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
                  />
                </div>

                {/* Password with Eye Toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
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

                {/* Step 1 Actions: Right-aligned Next */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 rounded-lg bg-[#263746] hover:bg-[#1c2c3a] text-white text-xs font-semibold shadow-sm transition"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: Address */}
            {currentStep === 2 && (
              <>
                {/* Country Dropdown */}
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setCountryCode(e.target.value);
                    }}
                    className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
                  >
                    <option value="" disabled>
                      Country
                    </option>
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postal Code"
                      className="w-full px-4 py-3 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    className="w-full px-4 py-3 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
                  />
                </div>

                {/* Step 2 Actions: Back & Next */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-xs font-semibold text-[#1c2c3a] hover:underline transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 rounded-lg bg-[#263746] hover:bg-[#1c2c3a] text-white text-xs font-semibold shadow-sm transition"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: Preferences & Localization */}
            {currentStep === 3 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Timezone */}
                  <div className="relative">
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
                    >
                      <option value="" disabled>
                        Timezone
                      </option>
                      {TIMEZONE_OPTIONS.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5] focus:border-[#367fa5] transition"
                    >
                      <option value="" disabled>
                        Currency
                      </option>
                      {CURRENCY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Step 3 Actions: Back & Next */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-xs font-semibold text-[#1c2c3a] hover:underline transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 rounded-lg bg-[#263746] hover:bg-[#1c2c3a] text-white text-xs font-semibold shadow-sm transition"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* STEP 4: Select Workplace Plan */}
            {currentStep === 4 && (
              <>
                {/* Plan Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSubscriptionPlan('STARTER')}
                    className={`p-3 rounded-xl border text-left transition ${
                      subscriptionPlan === 'STARTER'
                        ? 'border-[#367fa5] bg-white ring-2 ring-[#367fa5]/20 shadow-sm'
                        : 'border-[#cbd5e1] bg-[#edf4f7] hover:border-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#1c2c3a]">Standard</div>
                    <div className="text-base font-extrabold text-[#263746] mt-0.5">$3<span className="text-[10px] font-normal text-slate-500">/user</span></div>
                    <div className="text-[10px] text-slate-500 mt-1">1,000 AI req/mo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubscriptionPlan('PRO')}
                    className={`p-3 rounded-xl border text-left transition relative ${
                      subscriptionPlan === 'PRO'
                        ? 'border-[#367fa5] bg-white ring-2 ring-[#367fa5]/20 shadow-sm'
                        : 'border-[#cbd5e1] bg-[#edf4f7] hover:border-slate-400'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full bg-[#367fa5] text-[9px] font-bold text-white uppercase tracking-wider">
                      Popular
                    </span>
                    <div className="text-xs font-bold text-[#1c2c3a]">Pro Plan</div>
                    <div className="text-base font-extrabold text-[#263746] mt-0.5">$5<span className="text-[10px] font-normal text-slate-500">/user</span></div>
                    <div className="text-[10px] text-slate-500 mt-1">5,000 AI req/mo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubscriptionPlan('ENTERPRISE')}
                    className={`p-3 rounded-xl border text-left transition ${
                      subscriptionPlan === 'ENTERPRISE'
                        ? 'border-[#367fa5] bg-white ring-2 ring-[#367fa5]/20 shadow-sm'
                        : 'border-[#cbd5e1] bg-[#edf4f7] hover:border-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#1c2c3a]">Enterprise</div>
                    <div className="text-base font-extrabold text-[#263746] mt-0.5">$8<span className="text-[10px] font-normal text-slate-500">/user</span></div>
                    <div className="text-[10px] text-slate-500 mt-1">Unlimited AI</div>
                  </button>
                </div>

                {/* Seat Count Input */}
                <div className="p-3.5 rounded-xl border border-[#cbd5e1] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1c2c3a]">Total Employees / Seats</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPurchasedSeats((p) => Math.max(1, p - 1))}
                        className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-[#263746] w-8 text-center">{purchasedSeats}</span>
                      <button
                        type="button"
                        onClick={() => setPurchasedSeats((p) => p + 1)}
                        className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-600">
                    <span>Monthly Billed Amount:</span>
                    <span className="font-bold text-base text-[#263746]">${monthlyTotal}.00</span>
                  </div>
                </div>

                {/* Step 4 Actions: Back & Next */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-xs font-semibold text-[#1c2c3a] hover:underline transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 rounded-lg bg-[#263746] hover:bg-[#1c2c3a] text-white text-xs font-semibold shadow-sm transition"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* STEP 5: Review & Confirm */}
            {currentStep === 5 && (
              <>
                {/* Summary Box */}
                <div className="p-3.5 rounded-xl border border-[#cbd5e1] bg-white space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Organization:</span>
                    <span className="font-semibold text-slate-800">{companyName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Administrator:</span>
                    <span className="font-semibold text-slate-800">{firstName} {lastName} ({email})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Plan & Seats:</span>
                    <span className="font-semibold text-slate-800">{subscriptionPlan} ({purchasedSeats} Seats)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">AI Co-Pilot Allowance:</span>
                    <span className="font-semibold text-[#367fa5]">{getAiQuota(subscriptionPlan)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold text-slate-700">Total Due Today:</span>
                    <span className="font-extrabold text-base text-[#263746]">${monthlyTotal}.00 / month</span>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#1c2c3a]">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition ${
                        paymentMethod === 'card'
                          ? 'border-[#367fa5] bg-white text-[#367fa5] font-bold shadow-sm'
                          : 'border-slate-300 bg-[#edf4f7] text-slate-600'
                      }`}
                    >
                      Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('invoice')}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition ${
                        paymentMethod === 'invoice'
                          ? 'border-[#367fa5] bg-white text-[#367fa5] font-bold shadow-sm'
                          : 'border-slate-300 bg-[#edf4f7] text-slate-600'
                      }`}
                    >
                      Invoicing
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition ${
                        paymentMethod === 'bank'
                          ? 'border-[#367fa5] bg-white text-[#367fa5] font-bold shadow-sm'
                          : 'border-slate-300 bg-[#edf4f7] text-slate-600'
                      }`}
                    >
                      Bank Transfer
                    </button>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-2.5 pt-1">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number (4242 •••• •••• 4242)"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-xs text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-xs text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                      />
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-xs text-[#1c2c3a] placeholder-[#8c9ba5] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                      />
                    </div>
                  </div>
                )}

                {/* Step 5 Actions: Back & Submit */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-xs font-semibold text-[#1c2c3a] hover:underline transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-lg bg-[#263746] hover:bg-[#1c2c3a] text-white text-xs font-semibold shadow-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Deploying Workspace...</span>
                      </>
                    ) : (
                      'Deploy Workspace'
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Divider and Sign In Link */}
            <div className="pt-6">
              <div className="border-t border-[#cbd5e1]/80 w-full mb-5" />
              <p className="text-center text-xs text-[#52636f]">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-[#1c2c3a] hover:text-[#367fa5] transition">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#788894]">
          <span>© 2026 Loondasol Inc. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <Link href="/privacy-policy" className="hover:text-[#1c2c3a] transition">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-[#1c2c3a] transition">
              Terms of Service
            </Link>
            <span>|</span>
            <Link href="/why-choose-us" className="hover:text-[#1c2c3a] transition">
              Security
            </Link>
          </div>
        </div>
      </div>

      {/* Right Stepper Timeline Panel (~35% width) */}
      <div className="w-full lg:w-[35%] flex flex-col justify-center px-8 sm:px-12 lg:px-12 xl:px-16 py-10 lg:py-14 min-h-screen">
        <div className="my-auto py-6">
          {/* Step Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Step {currentStep}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-xs">
              {currentStepInfo.rightSubtitle}
            </p>
          </div>

          {/* Vertical Stepper Timeline */}
          <div className="mt-10 relative">
            {/* Continuous Vertical Connecting Line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-[1.5px] bg-white/20" />

            {/* 5 Step Nodes */}
            <div className="space-y-7 relative">
              {STEPS.map((step) => {
                const isActive = step.number === currentStep;
                const isCompleted = step.number < currentStep;

                return (
                  <div key={step.number} className="flex items-center gap-4">
                    {/* Circle Node */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all z-10 flex-shrink-0 ${
                        isActive
                          ? 'bg-white shadow-md'
                          : isCompleted
                          ? 'bg-white text-[#263746]'
                          : 'bg-white/20'
                      }`}
                    >
                      {isCompleted && (
                        <svg className="w-3.5 h-3.5 text-[#263746]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`text-sm transition-colors ${
                        isActive
                          ? 'font-semibold text-white'
                          : isCompleted
                          ? 'font-medium text-slate-200'
                          : 'font-normal text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}