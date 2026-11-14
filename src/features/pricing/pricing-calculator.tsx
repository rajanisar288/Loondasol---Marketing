'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PricingCalculator() {
  const [teamSize, setTeamSize] = useState<number>(15);
  const [selectedPlan, setSelectedPlan] = useState<'STARTER' | 'PRO' | 'ENTERPRISE'>('PRO');

  const plans = [
    {
      id: 'STARTER' as const,
      name: 'Starter Tier',
      price: 3,
      aiQuota: '1,000 requests/mo',
      description: 'Ideal for small startups and boutique teams needing core attendance and basic payroll.',
      features: [
        'Time & Attendance clock-in/out',
        'Basic Payroll generation',
        'Direct Employee Invitations',
        '1,000 AI Co-Pilot Requests / month',
        'Community & Email Support',
      ],
    },
    {
      id: 'PRO' as const,
      name: 'Growth Pro',
      price: 5,
      popular: true,
      aiQuota: '5,000 requests/mo',
      description: 'The standard choice for scaling businesses requiring advanced roles and automated workflows.',
      features: [
        'Everything in Starter',
        '5,000 AI Co-Pilot Requests / month',
        'Role-Based Custom Permissions',
        'Custom Onboarding Form Designer',
        'Automated Tax & Allowance Rules',
        'Priority Technical Support',
      ],
    },
    {
      id: 'ENTERPRISE' as const,
      name: 'Enterprise Cloud',
      price: 8,
      aiQuota: 'Unlimited requests',
      description: 'High-volume international enterprises requiring sovereign database sharding and 24/7 SLA.',
      features: [
        'Everything in Growth Pro',
        'Unlimited AI Co-Pilot Requests',
        'Dedicated Regional Database Shards',
        'Kafka Enterprise Event Bus Integration',
        'Custom SSO & IP Whitelisting',
        'Dedicated Solutions Architect',
      ],
    },
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlan)!;
  const monthlyTotal = currentPlan.price * teamSize;

  return (
    <div className="space-y-16">
      {/* Dynamic Team Size Slider */}
      <div className="max-w-2xl mx-auto p-8 rounded-[8px] bg-white border border-[#dbe7ec] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#263746]">
              Estimate Your Workforce Investment
            </h3>
            <p className="text-xs text-[#344653]/80">
              Per-seat billing model: Only pay for the active team members you invite.
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-[#367fa5]">
              {teamSize}
            </span>
            <span className="text-xs text-[#344653]/80 ml-1">Team Seats</span>
          </div>
        </div>

        <input
          type="range"
          min="1"
          max="250"
          value={teamSize}
          onChange={(e) => setTeamSize(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-[#edf4f7] rounded-lg appearance-none cursor-pointer accent-[#367fa5]"
        />

        <div className="flex justify-between text-xs text-[#344653]/60 font-medium">
          <span>1 Member</span>
          <span>50 Members</span>
          <span>100 Members</span>
          <span>250+ Members</span>
        </div>

        <div className="p-4 rounded-[8px] bg-[#edf4f7] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#263746] block uppercase tracking-wider">
              Selected: {currentPlan.name} (${currentPlan.price} / user)
            </span>
            <span className="text-xs text-[#344653]/80">
              AI Limit: {currentPlan.aiQuota}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#263746]">${monthlyTotal}</span>
            <span className="text-xs text-[#344653]/80 block">/ month</span>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`p-8 rounded-[8px] flex flex-col justify-between transition-all bg-white border ${
                plan.popular
                  ? 'border-[#367fa5] ring-2 ring-[#367fa5]/20 shadow-md relative'
                  : 'border-[#dbe7ec] shadow-sm'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#367fa5] text-white">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#263746]">{plan.name}</h3>
                  <p className="text-xs text-[#344653]/80 mt-1 min-h-[36px]">
                    {plan.description}
                  </p>
                </div>

                <div className="py-4 border-y border-[#dbe7ec]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[#263746]">
                      ${plan.price}
                    </span>
                    <span className="text-xs text-[#344653]/80">
                      / user / month
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#367fa5] block mt-1">
                    🤖 {plan.aiQuota}
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs text-[#263746]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="text-[#367fa5] font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  onClick={() => setSelectedPlan(plan.id)}
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="md"
                  className="w-full"
                >
                  {isSelected ? 'Current Selection' : `Select ${plan.name}`}
                </Button>
                <div className="text-center mt-3">
                  <Link
                    href={`/signup?plan=${plan.id}&seats=${teamSize}`}
                    className="text-xs text-[#367fa5] hover:underline font-semibold"
                  >
                    Deploy with {teamSize} seats (${plan.price * teamSize}/mo) →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
