'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { siteConfig, getWorkspaceUrl } from '@/config/site';
import { saveMarketingSession } from '@/hooks/use-auth-status';
import { apiFetch } from '@/lib/api';

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea' | 'file';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

interface InvitationDetails {
  valid: boolean;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName: string;
  designation?: string;
  departmentName?: string;
  branchName?: string;
  region?: string;
  companyId?: string;
  customFieldsTemplate?: CustomField[];
  onboardingConfig?: {
    requireCnic?: boolean;
    requireAddress?: boolean;
    requireBankDetails?: boolean;
  };
}

export function InvitationOnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';
  const regionParam = searchParams.get('region') || '';

  const [isLoadingInvitation, setIsLoadingInvitation] = useState(true);
  const [invitationError, setInvitationError] = useState<string | null>(null);
  const [details, setDetails] = useState<InvitationDetails | null>(null);

  // Form State
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');

  // Bank Details
  const [bankName, setBankName] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');

  // Custom Fields
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [uploadedDocuments, setUploadedDocuments] = useState<
    Array<{ name: string; url: string; fieldKey: string; fileType?: string }>
  >([]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load and validate invitation token on mount
  useEffect(() => {
    if (!token) {
      setInvitationError('No invitation token was provided in the link. Please check your invitation email.');
      setIsLoadingInvitation(false);
      return;
    }

    const validateToken = async () => {
      setIsLoadingInvitation(true);
      setInvitationError(null);

      try {
        const query = new URLSearchParams({
          token,
          email: emailParam,
          ...(regionParam ? { region: regionParam } : {}),
        });

        const response = await apiFetch(`${siteConfig.apiUrl}/auth/invitation?${query.toString()}`);
        const data = await response.json();

        if (!response.ok || !data.valid) {
          throw new Error(data.message || 'This invitation link is invalid or has expired.');
        }

        setDetails(data);
        if (data.firstName) setFirstName(data.firstName);
        if (data.lastName) setLastName(data.lastName);
      } catch (err: unknown) {
        setInvitationError((err as Error).message || 'Unable to verify invitation link.');
      } finally {
        setIsLoadingInvitation(false);
      }
    };

    validateToken();
  }, [token, emailParam, regionParam]);

  const hasCustomFields = !!(details?.customFieldsTemplate && details.customFieldsTemplate.length > 0);

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFields((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleCustomFileChange = async (fieldId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiFetch(`${siteConfig.apiUrl}/upload/attachment`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && (data.url || data.path)) {
        const url = data.url || data.path;
        setUploadedDocuments((prev) => [
          ...prev.filter((d) => d.fieldKey !== fieldId),
          { name: file.name, url, fieldKey: fieldId, fileType: file.type },
        ]);
        handleCustomFieldChange(fieldId, url);
      }
    } catch {
      // Ignore or log error
    }
  };

  const canProceedToStep2 = () => {
    if (!firstName.trim() || !lastName.trim()) return false;
    if (!password || password.length < 8) return false;
    if (password !== confirmPassword) return false;

    const config = details?.onboardingConfig;
    if (config?.requireCnic && !cnic.trim()) return false;
    if (config?.requireAddress && !address.trim()) return false;
    if (config?.requireBankDetails && (!bankName.trim() || !accountNumber.trim())) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    const config = details?.onboardingConfig;
    if (config?.requireCnic && !cnic.trim()) {
      setFormError('National ID / CNIC is required by your organization.');
      return;
    }
    if (config?.requireAddress && !address.trim()) {
      setFormError('Residential address is required by your organization.');
      return;
    }
    if (config?.requireBankDetails && (!bankName.trim() || !accountNumber.trim())) {
      setFormError('Bank details (Bank Name & Account Number) are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, any> = {
        type: 'employee',
        invitationToken: token,
        email: details?.email || emailParam,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        companyRegion: details?.region || regionParam,
        dateOfBirth: dateOfBirth || undefined,
        cnic: cnic.trim() || undefined,
        address: address.trim() || undefined,
      };

      if (config?.requireBankDetails || bankName.trim()) {
        payload.bankDetails = {
          bankName: bankName.trim(),
          accountTitle: accountTitle.trim() || `${firstName.trim()} ${lastName.trim()}`,
          accountNumber: accountNumber.trim(),
          iban: iban.trim() || undefined,
        };
      }

      if (Object.keys(customFields).length > 0) {
        payload.customFields = customFields;
      }
      if (uploadedDocuments.length > 0) {
        payload.documents = uploadedDocuments.map((doc) => ({
          name: doc.name,
          url: doc.url,
          fileType: doc.fileType,
          uploadedAt: new Date(),
        }));
      }

      const response = await apiFetch(`${siteConfig.apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete employee activation.');
      }

      const authToken = data.accessToken || data.token;
      const refreshToken = data.refreshToken;
      const user = data.user;

      if (authToken) {
        saveMarketingSession(authToken, refreshToken, user);

        const targetUrl = new URL(getWorkspaceUrl('/dashboard'));
        targetUrl.searchParams.set('token', authToken);
        if (refreshToken) {
          targetUrl.searchParams.set('refresh', refreshToken);
        }
        window.location.href = targetUrl.toString();
      } else {
        router.push('/login');
      }
    } catch (err: unknown) {
      setFormError((err as Error).message || 'An error occurred during account activation.');
      setIsSubmitting(false);
    }
  };

  // 1. Loading State
  if (isLoadingInvitation) {
    return (
      <div className="py-16 text-center space-y-3">
        <svg className="animate-spin w-8 h-8 text-[#367fa5] mx-auto" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-sm text-slate-600 font-medium">
          Verifying your workspace invitation...
        </p>
      </div>
    );
  }

  // 2. Error State (Invalid / Expired token)
  if (invitationError || !details) {
    return (
      <div className="py-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <h3 className="text-lg font-bold text-[#1c2c3a]">
          Invalid or Expired Invitation
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          {invitationError ||
            'This invitation link is no longer valid or has already been used. Please contact your company administrator to request a new invitation.'}
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-[#263746] text-white text-xs font-semibold hover:bg-[#1a2632] transition"
          >
            Go to Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
          >
            Create New Company
          </Link>
        </div>
      </div>
    );
  }

  // 3. Active Valid Invitation Form
  return (
    <div className="w-full">
      {/* Workspace Invitation Metadata Banner */}
      <div className="mb-6 p-4 rounded-xl bg-[#edf4f7] border border-[#dbe7ec] flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="text-[11px] font-semibold text-[#82b8ce] uppercase tracking-wider">
            Workspace Invitation
          </div>
          <div className="text-base font-bold text-[#1c2c3a]">
            {details.companyName}
          </div>
          <div className="text-xs text-[#52636f]">
            Joining as <span className="font-semibold text-slate-800">{details.designation || 'Team Member'}</span>
            {details.departmentName && ` • ${details.departmentName}`}
            {details.branchName && ` (${details.branchName})`}
          </div>
        </div>
        <div className="px-3 py-1 rounded-lg bg-[#367fa5]/10 text-[#367fa5] text-xs font-bold">
          Verified
        </div>
      </div>

      {/* Stepper Tabs if custom fields exist */}
      {hasCustomFields && (
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`font-semibold pb-1.5 transition ${
              step === 1
                ? 'text-[#367fa5] border-b-2 border-[#367fa5]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            1. Account & Personal Info
          </button>
          <button
            type="button"
            onClick={() => {
              if (canProceedToStep2()) setStep(2);
            }}
            className={`font-semibold pb-1.5 transition ${
              step === 2
                ? 'text-[#367fa5] border-b-2 border-[#367fa5]'
                : canProceedToStep2()
                ? 'text-slate-600 hover:text-slate-800'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            2. Company Onboarding Checklist
          </button>
        </div>
      )}

      {formError && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-fadeIn">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#263746] mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#263746] mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                />
              </div>
            </div>

            {/* Email Field (Readonly) */}
            <div>
              <label className="block text-xs font-semibold text-[#263746] mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                disabled
                value={details.email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-semibold text-[#263746] mb-1">
                  Set Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#263746] mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-[#263746] mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
              />
            </div>

            {/* CNIC / National ID (if enabled by company) */}
            {details.onboardingConfig?.requireCnic && (
              <div>
                <label className="block text-xs font-semibold text-[#263746] mb-1">
                  National ID / CNIC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  placeholder="e.g. 42101-1234567-1"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                />
              </div>
            )}

            {/* Address (if enabled by company) */}
            {details.onboardingConfig?.requireAddress && (
              <div>
                <label className="block text-xs font-semibold text-[#263746] mb-1">
                  Residential Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, Postal code"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                />
              </div>
            )}

            {/* Bank Details (if enabled by company) */}
            {details.onboardingConfig?.requireBankDetails && (
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#367fa5]">
                  Payroll & Bank Details (Required)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#263746] mb-1">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Standard Chartered / Chase"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#263746] mb-1">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 0123456789"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#263746] mb-1">
                      Account Title
                    </label>
                    <input
                      type="text"
                      value={accountTitle}
                      onChange={(e) => setAccountTitle(e.target.value)}
                      placeholder="Name on account"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#263746] mb-1">
                      IBAN (Optional)
                    </label>
                    <input
                      type="text"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      placeholder="PK00..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 2: Custom Checklist & Document Uploads */}
        {step === 2 && hasCustomFields && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
              Please complete the additional onboarding requirements requested by {details.companyName}.
            </div>

            {details.customFieldsTemplate!.map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="block text-xs font-semibold text-[#263746]">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === 'file' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      required={field.required && !customFields[field.id]}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCustomFileChange(field.id, file);
                      }}
                      className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#263746] file:text-white hover:file:bg-[#1a2632]"
                    />
                    {customFields[field.id] && (
                      <span className="text-xs text-emerald-600 font-semibold">✓ Uploaded</span>
                    )}
                  </div>
                ) : field.type === 'select' ? (
                  <select
                    required={field.required}
                    value={customFields[field.id] || ''}
                    onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                  >
                    <option value="">Select option</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    required={field.required}
                    rows={3}
                    value={customFields[field.id] || ''}
                    onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                  />
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                    required={field.required}
                    value={customFields[field.id] || ''}
                    onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#edf4f7] text-sm text-[#1c2c3a] focus:outline-none focus:ring-1 focus:ring-[#367fa5]"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-between gap-3">
          {hasCustomFields && step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-3 px-5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Back
            </button>
          ) : hasCustomFields && step === 1 ? (
            <button
              type="button"
              disabled={!canProceedToStep2()}
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-[#263746] hover:bg-[#1a2632] text-white text-xs sm:text-sm font-semibold transition disabled:opacity-50"
            >
              Next: Company Checklist →
            </button>
          ) : null}

          {(!hasCustomFields || step === 2) && (
            <button
              type="submit"
              disabled={isSubmitting || (step === 1 && !canProceedToStep2())}
              className="w-full py-3 rounded-xl bg-[#263746] hover:bg-[#1a2632] text-white text-xs sm:text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Activating Workspace Profile...</span>
                </>
              ) : (
                'Activate Account & Enter Workspace'
              )}
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 pt-5 border-t border-[#dbe7ec] text-center">
        <p className="text-xs text-[#52636f]">
          Already activated?{' '}
          <Link href="/login" className="font-semibold text-[#263746] hover:text-[#367fa5] transition">
            Sign In to Workspace
          </Link>
        </p>
      </div>
    </div>
  );
}