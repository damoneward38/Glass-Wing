import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { PlanType, BillingCycle } from '../types';

interface PricingProps {
  onOpenCheckout: (plan: PlanType, billingCycle: BillingCycle) => void;
}

export function Pricing({ onOpenCheckout }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="px-4 md:px-12 py-28 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <div className="text-xs font-bold tracking-[0.4em] text-cyan-vibrant uppercase mb-3">// Pricing & Licensing</div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight mb-6">
          Transparent Pricing, <br />
          <span className="bg-gradient-to-r from-cyan-vibrant to-purple-vibrant bg-clip-text text-transparent">
            Like Our Windows
          </span>
        </h2>
        <p className="max-w-xl mx-auto text-white/50 text-sm md:text-base mb-8">
          All tiers include instant binary access, full TypeScript declarations, and 144 FPS GPU compositing.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-white/5 border border-white/10 glass">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isAnnual ? 'bg-cyan-vibrant text-black shadow-md glow-cyan' : 'text-white/60 hover:text-white'}`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${isAnnual ? 'bg-cyan-vibrant text-black shadow-md glow-cyan' : 'text-white/60 hover:text-white'}`}
          >
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-[#00ff9d] text-black text-[9px] font-black uppercase">
              Save 30%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Starter Plan */}
        <PricingCard
          name="Starter"
          price={0}
          billingCycle={isAnnual ? 'annual' : 'monthly'}
          desc="Perfect for indie developers, students, and non-commercial open source projects."
          features={[
            "Up to 3 concurrent glass windows",
            "Real-time Gaussian blur + opacity engine",
            "Single monitor primary display support",
            "Community Discord & GitHub Discussions",
            "DirectComposition & Metal compositor"
          ]}
          inactiveFeatures={[
            "Commercial software distribution",
            "Acrylic shader & sub-pixel noise",
            "Multi-monitor DPI scaling",
            "Priority support SLA"
          ]}
          ctaText="Start Free Trial"
          onClick={() => onOpenCheckout('starter', isAnnual ? 'annual' : 'monthly')}
        />

        {/* Pro Plan */}
        <PricingCard
          featured
          name="Pro"
          price={isAnnual ? 29 : 41}
          billingCycle={isAnnual ? 'annual' : 'monthly'}
          annualTotal={isAnnual ? 348 : undefined}
          desc="For professional engineers and teams shipping commercial desktop software."
          features={[
            "Unlimited concurrent glass windows",
            "Full acrylic shader + noise overlay engine",
            "Dynamic multi-monitor DPI auto-scaling",
            "Physics-based spring animation system",
            "Config JSON hot-reload support",
            "5 developer seats included",
            "Priority developer email support"
          ]}
          inactiveFeatures={[
            "Dedicated support engineer"
          ]}
          ctaText="Start 14-Day Free Trial"
          onClick={() => onOpenCheckout('pro', isAnnual ? 'annual' : 'monthly')}
        />

        {/* Enterprise Plan */}
        <PricingCard
          name="Enterprise"
          price={isAnnual ? 149 : 199}
          billingCycle={isAnnual ? 'annual' : 'monthly'}
          annualTotal={isAnnual ? 1788 : undefined}
          desc="For organizations requiring source code access, volume seat licensing, and formal SLAs."
          features={[
            "Unlimited windows & global commercial license",
            "Full C++ & Rust core source code access",
            "50 developer seats included (custom available)",
            "99.9% uptime SLA & emergency escalation",
            "Dedicated solutions engineer",
            "Private npm & Artifactory mirror registry",
            "Custom legal and procurement pack"
          ]}
          ctaText="Get Enterprise License"
          onClick={() => onOpenCheckout('enterprise', isAnnual ? 'annual' : 'monthly')}
        />
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  billingCycle,
  annualTotal,
  desc,
  features,
  inactiveFeatures = [],
  featured = false,
  ctaText,
  onClick
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-3xl border transition-all flex flex-col justify-between ${
        featured
          ? 'border-cyan-vibrant/60 bg-gradient-to-b from-cyan-vibrant/10 to-purple-vibrant/10 glow-cyan md:-translate-y-2 z-10'
          : 'border-white/10 glass hover:border-white/20'
      }`}
    >
      {featured && (
        <div className="absolute top-0 right-6 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-vibrant to-purple-vibrant text-black text-[10px] font-black tracking-widest uppercase shadow-lg">
          Most Popular
        </div>
      )}

      <div>
        <div className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3">{name} Edition</div>
        
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            ${price}
          </span>
          <span className="text-sm font-medium text-white/40">/month</span>
        </div>

        <div className="text-xs text-white/40 mb-6">
          {price === 0
            ? 'Free forever for personal use'
            : annualTotal
              ? `Billed annually at $${annualTotal}/yr (save 30%)`
              : 'Billed monthly, cancel anytime'}
        </div>

        <p className="text-xs text-white/60 leading-relaxed mb-6 pb-6 border-b border-white/10">
          {desc}
        </p>

        <ul className="space-y-3 mb-8">
          {features.map((f: string, i: number) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-white/80">
              <Check className="w-4 h-4 text-cyan-vibrant shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
          {inactiveFeatures.map((f: string, i: number) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-white/30">
              <span className="w-4 text-center shrink-0 text-white/20">—</span>
              <span className="line-through">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onClick}
        className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
          featured
            ? 'bg-gradient-to-r from-cyan-vibrant to-blue-vibrant text-black shadow-lg glow-cyan hover:scale-[1.02]'
            : 'bg-white/5 border border-white/15 text-white hover:border-cyan-vibrant hover:text-cyan-vibrant hover:bg-white/10'
        }`}
      >
        <span>{ctaText}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
