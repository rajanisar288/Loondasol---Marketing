'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    seats: '50-250',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-[8px] bg-white border border-[#367fa5]/30 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#edf4f7] text-[#367fa5] flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-[#263746]">Inquiry Received</h3>
        <p className="text-xs text-[#344653]/90 leading-relaxed max-w-sm mx-auto">
          Thank you for reaching out. An enterprise solutions specialist will contact you at <strong>{formData.email}</strong> within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-[8px] bg-white border border-[#dbe7ec] shadow-sm space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
          Full Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="David Vance"
          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
            Work Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="david@enterprise.com"
            className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
            Company Name
          </label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Vance Global Holdings"
            className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
          Estimated Workforce Size
        </label>
        <select
          value={formData.seats}
          onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
        >
          <option value="1-20">1 - 20 Employees</option>
          <option value="20-50">20 - 50 Employees</option>
          <option value="50-250">50 - 250 Employees</option>
          <option value="250-1000">250 - 1,000 Employees</option>
          <option value="1000+">1,000+ Global Employees</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#263746] uppercase tracking-wider mb-1">
          Inquiry Details
        </label>
        <textarea
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us about your multi-region requirements, payroll needs, or custom integrations..."
          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#dbe7ec] bg-white text-sm text-[#263746] focus:outline-none focus:ring-2 focus:ring-[#367fa5]/40"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        Send Inquiry to Sales
      </Button>
    </form>
  );
}
