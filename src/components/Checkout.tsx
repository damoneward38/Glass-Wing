import { useState } from 'react';
import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShieldCheck, Copy, Download, ArrowLeft, CreditCard, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PlanType, BillingCycle, Order, License } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface CheckoutProps {
  initialPlan?: PlanType;
  initialBilling?: BillingCycle;
  onBack: () => void;
  onOpenPlayground: () => void;
}

const PLAN_DETAILS: Record<PlanType, { name: string; monthly: number; annualPerMonth: number; seats: number; desc: string }> = {
  starter: {
    name: 'Starter',
    monthly: 0,
    annualPerMonth: 0,
    seats: 1,
    desc: 'Community license for personal projects & experiments'
  },
  pro: {
    name: 'Pro',
    monthly: 41,
    annualPerMonth: 29,
    seats: 5,
    desc: 'Commercial license with full acrylic shader & spring physics engine'
  },
  enterprise: {
    name: 'Enterprise',
    monthly: 199,
    annualPerMonth: 149,
    seats: 50,
    desc: 'Multi-seat commercial license with 99.9% SLA & source code access'
  }
};

export function Checkout({ initialPlan = 'pro', initialBilling = 'annual', onBack, onOpenPlayground }: CheckoutProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initialBilling);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'invoice'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [completedLicense, setCompletedLicense] = useState<License | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Pricing calculations
  const planInfo = PLAN_DETAILS[selectedPlan];
  const isAnnual = billingCycle === 'annual';
  const rawTotal = selectedPlan === 'starter'
    ? 0
    : isAnnual
      ? planInfo.annualPerMonth * 12
      : planInfo.monthly;

  const total = Math.max(0, rawTotal - couponDiscount);

  const handleApplyCoupon = () => {
    setCouponError(null);
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'GLASS30') {
      const discount = Math.round(rawTotal * 0.3);
      setCouponDiscount(discount);
      setAppliedCoupon('GLASS30 (30% Discount Applied)');
    } else if (cleanCode === 'VIPADMIN') {
      setCouponDiscount(rawTotal);
      setAppliedCoupon('VIPADMIN (100% Complimentary Partner Access)');
    } else {
      setCouponError('Invalid coupon code. Try "GLASS30" for 30% off.');
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name or company representative name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid business email address.');
      return;
    }

    if (total > 0 && paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 15) {
        setErrorMessage('Please enter a valid 16-digit credit card number.');
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setErrorMessage('Please enter a valid card expiration date (MM/YY).');
        return;
      }
      if (!cardCvc || cardCvc.length < 3) {
        setErrorMessage('Please enter a valid 3-digit CVC code.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 1. Submit to Backend API
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          billingCycle,
          customerName: fullName.trim(),
          customerEmail: email.trim().toLowerCase(),
          company: company.trim(),
          paymentMethod,
          cardLast4: cardNumber ? cardNumber.replace(/\s/g, '').slice(-4) : '4242',
          couponCode: appliedCoupon ? couponCode.trim() : undefined,
          amount: total
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to process checkout transaction.');
      }

      const data = await res.json();
      const order: Order = data.order;
      const license: License = data.license;

      // 2. Sync to Firestore for real-time persistence
      try {
        await setDoc(doc(db, 'orders', order.orderId), {
          ...order,
          timestamp: new Date().toISOString()
        });
        await setDoc(doc(db, 'licenses', license.key), {
          ...license,
          timestamp: new Date().toISOString()
        });
      } catch (fsErr) {
        // If firestore rules or offline, log through standard error handler without blocking customer checkout
        console.warn('Firestore optional sync notice:', fsErr);
      }

      setCompletedOrder(order);
      setCompletedLicense(license);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLicenseToClipboard = () => {
    if (completedLicense) {
      navigator.clipboard.writeText(completedLicense.key);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  };

  const downloadStarterKit = () => {
    if (!completedLicense || !completedOrder) return;
    const configData = {
      project: 'Glass Wing Production License',
      licenseKey: completedLicense.key,
      plan: completedLicense.plan,
      customerEmail: completedLicense.customerEmail,
      seats: completedLicense.seats,
      acrylicOptions: {
        tintColor: '#00f5ff',
        opacity: 0.85,
        blurRadius: 24,
        noiseIntensity: 0.04,
        renderEngine: 'DirectComposition'
      },
      quickStart: `npm install @glass-wing/core\nimport { WindowManager } from '@glass-wing/core';\nconst wm = new WindowManager({ licenseKey: "${completedLicense.key}" });\nawait wm.launch();`
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glasswing-license-${completedOrder.orderId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto relative z-10">
      {/* Back button */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-cyan-vibrant hover:border-cyan-vibrant/30 transition-all text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>
        <div className="flex items-center gap-2 text-xs font-mono text-white/40">
          <ShieldCheck className="w-4 h-4 text-[#00ff9d]" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {completedOrder && completedLicense ? (
          /* Order Confirmation / Success View */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 md:p-12 rounded-3xl border border-cyan-vibrant/40 glass glow-cyan bg-dark-bg/90"
          >
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="w-16 h-16 rounded-full bg-cyan-vibrant/10 border border-cyan-vibrant flex items-center justify-center text-cyan-vibrant mx-auto mb-6 glow-cyan">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-cyan-vibrant">// Order Confirmed</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold mt-2 mb-4 tracking-tight">
                Welcome to <span className="bg-gradient-to-r from-cyan-vibrant to-purple-vibrant bg-clip-text text-transparent">Glass Wing</span>
              </h2>
              <p className="text-white/60 text-sm md:text-base leading-relaxed">
                Your license has been activated and registered to <strong className="text-white">{completedOrder.customerEmail}</strong>.
              </p>
            </div>

            {/* License Key Box */}
            <div className="max-w-xl mx-auto p-6 rounded-2xl bg-black/60 border border-white/10 mb-8">
              <div className="text-xs font-bold tracking-widest text-white/40 uppercase mb-2">Your Production License Key</div>
              <div className="flex items-center justify-between gap-4 p-3 bg-white/5 rounded-xl border border-white/10 font-mono text-sm md:text-base text-cyan-vibrant break-all">
                <span>{completedLicense.key}</span>
                <button
                  onClick={copyLicenseToClipboard}
                  className="px-3 py-1.5 rounded-lg bg-cyan-vibrant/20 border border-cyan-vibrant/40 text-cyan-vibrant text-xs font-bold shrink-0 hover:bg-cyan-vibrant hover:text-black transition-all flex items-center gap-1.5"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-white/40">
                <span>Entitlement: {completedLicense.plan.toUpperCase()} Tier ({completedLicense.seats} Developer Seats)</span>
                <span>Status: <span className="text-[#00ff9d] font-bold">Active</span></span>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="max-w-xl mx-auto p-6 rounded-2xl bg-white/[0.02] border border-white/5 mb-8 text-sm space-y-3">
              <div className="flex justify-between text-white/60">
                <span>Order Reference:</span>
                <span className="font-mono text-white">{completedOrder.orderId}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Billing Period:</span>
                <span className="capitalize text-white">{completedOrder.billingCycle}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Payment Method:</span>
                <span className="text-white">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Total Paid:</span>
                <span className="text-xl font-bold text-white">${completedOrder.amount} USD</span>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadStarterKit}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-vibrant to-blue-vibrant text-black font-bold text-sm tracking-wide shadow-lg glow-cyan hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download License & Config JSON
              </button>
              <button
                onClick={onOpenPlayground}
                className="flex-1 py-4 px-6 rounded-2xl bg-white/10 border border-white/20 hover:border-cyan-vibrant text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-vibrant" />
                Launch Live Playground
              </button>
            </div>
          </motion.div>
        ) : (
          /* Checkout Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-7 space-y-8">
              <div className="p-8 rounded-3xl border border-white/10 glass bg-dark-bg/60">
                <h1 className="text-3xl font-display font-extrabold tracking-tight mb-2">
                  Complete Your Order
                </h1>
                <p className="text-white/50 text-sm mb-8">
                  Get instant access to Glass Wing binaries, npm package token, and developer documentation.
                </p>

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-vibrant mb-4">// 1. Contact & Licensing Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Damon Ward"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-vibrant transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5">Work Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-vibrant transition-colors"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-white/70 mb-1.5">Company / Organization (Optional)</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Acme Corp or Indie Dev"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-vibrant transition-colors"
                      />
                    </div>
                  </div>

                  {/* Payment Details (Only for paid tiers) */}
                  {total > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-vibrant mb-4">// 2. Payment Method</h3>
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${paymentMethod === 'card' ? 'bg-cyan-vibrant/10 border-cyan-vibrant text-cyan-vibrant' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Credit Card</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('paypal')}
                          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${paymentMethod === 'paypal' ? 'bg-cyan-vibrant/10 border-cyan-vibrant text-cyan-vibrant' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                        >
                          <span>🅿️ PayPal</span>
                          <span>Express</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('invoice')}
                          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${paymentMethod === 'invoice' ? 'bg-cyan-vibrant/10 border-cyan-vibrant text-cyan-vibrant' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                        >
                          <span>📄 Wire / PO</span>
                          <span>Net-30 Invoice</span>
                        </button>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Card Number</label>
                            <div className="relative">
                              <input
                                type="text"
                                maxLength={19}
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="4242 4242 4242 4242"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono placeholder-white/30 text-sm focus:outline-none focus:border-cyan-vibrant transition-colors pr-12"
                              />
                              <CreditCard className="w-5 h-5 text-white/40 absolute right-4 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-white/70 mb-1.5">Expires (MM/YY)</label>
                              <input
                                type="text"
                                maxLength={5}
                                value={cardExpiry}
                                onChange={handleExpiryChange}
                                placeholder="12/28"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono placeholder-white/30 text-sm focus:outline-none focus:border-cyan-vibrant transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-white/70 mb-1.5">CVC / Security Code</label>
                              <input
                                type="password"
                                maxLength={4}
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                                placeholder="•••"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono placeholder-white/30 text-sm focus:outline-none focus:border-cyan-vibrant transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'paypal' && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 text-center">
                          You will be directed to PayPal authorization window upon clicking Complete Order.
                        </div>
                      )}

                      {paymentMethod === 'invoice' && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 text-center">
                          An enterprise Net-30 purchase order with bank remittance instructions will be emailed instantly.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Coupon Code Section */}
                  <div className="pt-4 border-t border-white/10">
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Coupon or Partner Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. GLASS30 or VIPADMIN"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono placeholder-white/30 text-sm focus:outline-none focus:border-cyan-vibrant uppercase transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold hover:border-cyan-vibrant hover:text-cyan-vibrant transition-all"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedCoupon && (
                      <p className="mt-2 text-xs text-[#00ff9d] flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        {appliedCoupon}
                      </p>
                    )}
                    {couponError && (
                      <p className="mt-2 text-xs text-red-400">{couponError}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-vibrant to-blue-vibrant text-black font-extrabold text-sm uppercase tracking-wider shadow-xl glow-cyan hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        {total === 0 ? 'Activate Free License Now' : `Authorize & Pay $${total} USD`}
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-white/40">
                    Instant automated license key delivery • 14-day 100% money-back guarantee • Cancel anytime
                  </p>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary & Plan Selector */}
            <div className="lg:col-span-5 space-y-6">
              {/* Plan Switcher Card */}
              <div className="p-6 rounded-3xl border border-white/10 glass bg-dark-bg/60">
                <div className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">Choose Your Edition</div>
                <div className="space-y-3">
                  {(['starter', 'pro', 'enterprise'] as PlanType[]).map((p) => {
                    const info = PLAN_DETAILS[p];
                    const active = selectedPlan === p;
                    const price = isAnnual ? info.annualPerMonth : info.monthly;
                    return (
                      <div
                        key={p}
                        onClick={() => setSelectedPlan(p)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${active ? 'bg-cyan-vibrant/10 border-cyan-vibrant/60 glow-cyan' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white capitalize">{info.name}</span>
                            {p === 'pro' && (
                              <span className="px-2 py-0.5 rounded-full bg-cyan-vibrant/20 text-cyan-vibrant text-[9px] font-bold uppercase">Popular</span>
                            )}
                          </div>
                          <div className="text-xs text-white/40 mt-0.5">{info.seats} Dev {info.seats === 1 ? 'Seat' : 'Seats'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            ${price}
                            <span className="text-xs font-normal text-white/40">/mo</span>
                          </div>
                          {isAnnual && price > 0 && (
                            <div className="text-[10px] text-[#00ff9d]">Save 30%</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Billing Cycle Switcher */}
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Annual Billing</div>
                    <div className="text-[11px] text-[#00ff9d]">Includes 2 months free (30% savings)</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBillingCycle(isAnnual ? 'monthly' : 'annual')}
                    className="w-12 h-6 rounded-full bg-cyan-vibrant/20 border border-cyan-vibrant/40 p-0.5 relative transition-all"
                  >
                    <motion.div
                      animate={{ x: isAnnual ? 24 : 0 }}
                      className="w-5 h-5 rounded-full bg-cyan-vibrant shadow-md glow-cyan"
                    />
                  </button>
                </div>
              </div>

              {/* Price Breakdown Card */}
              <div className="p-6 rounded-3xl border border-white/10 glass bg-dark-bg/60">
                <div className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">Pricing Breakdown</div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>{planInfo.name} Plan ({isAnnual ? '12 Months' : '1 Month'})</span>
                    <span className="text-white">${rawTotal}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-[#00ff9d]">
                      <span>Coupon Discount</span>
                      <span>-${couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/70">
                    <span>Estimated Sales Tax</span>
                    <span className="text-white">$0.00</span>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                    <span className="font-bold text-white">Total Due Today</span>
                    <div className="text-right">
                      <span className="text-3xl font-display font-black text-cyan-vibrant">${total}</span>
                      <span className="text-xs text-white/40 ml-1">USD</span>
                    </div>
                  </div>
                </div>

                {/* Included Features */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="text-xs font-bold text-white/60 mb-3 uppercase tracking-wider">Plan Highlights</div>
                  <ul className="space-y-2 text-xs text-white/70">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-vibrant" />
                      <span>{planInfo.seats} Developer Seats & Activations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-vibrant" />
                      <span>144 FPS GPU-Accelerated Acrylic Blur Engine</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-vibrant" />
                      <span>DirectComposition & Multi-Monitor API</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-vibrant" />
                      <span>Full TypeScript Definitions & Vite Integration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
