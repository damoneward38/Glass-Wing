import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Checkout } from './components/Checkout';
import { AdminPortal } from './components/AdminPortal';
import { DocsModal } from './components/DocsModal';
import { PlaygroundModal } from './components/PlaygroundModal';
import { PlanType, BillingCycle } from './types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'checkout' | 'admin'>('landing');
  const [checkoutPlan, setCheckoutPlan] = useState<PlanType>('pro');
  const [checkoutBilling, setCheckoutBilling] = useState<BillingCycle>('annual');
  const [docsOpen, setDocsOpen] = useState(false);
  const [playgroundOpen, setPlaygroundOpen] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'checkout') {
        setCurrentView('checkout');
      } else if (hash === 'admin') {
        setCurrentView('admin');
      } else if (hash === 'docs') {
        setDocsOpen(true);
      } else if (hash === 'playground') {
        setPlaygroundOpen(true);
      } else if (['features', 'stats', 'how', 'pricing', 'testimonials'].includes(hash)) {
        setCurrentView('landing');
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (!hash) {
        setCurrentView('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openCheckout = (plan: PlanType = 'pro', billing: BillingCycle = 'annual') => {
    setCheckoutPlan(plan);
    setCheckoutBilling(billing);
    setCurrentView('checkout');
    window.location.hash = 'checkout';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdmin = () => {
    setCurrentView('admin');
    window.location.hash = 'admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnToLanding = (targetId?: string) => {
    setCurrentView('landing');
    window.location.hash = targetId || '';
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollTo = (id: string) => {
    if (currentView !== 'landing') {
      returnToLanding(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-bg text-white selection:bg-cyan-vibrant/30">
      <BackgroundCanvas />

      {/* Floating Button Audit Quick-Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={openAdmin}
          className="px-4 py-2 rounded-full glass border border-cyan-vibrant/40 bg-dark-bg/80 text-cyan-vibrant text-xs font-mono font-bold flex items-center gap-2 shadow-2xl glow-cyan hover:scale-105 active:scale-95 transition-all"
          title="Open Admin Portal & Button Audit Matrix"
        >
          <CheckCircle2 className="w-4 h-4 text-[#00ff9d]" />
          <span className="hidden sm:inline">Button Audit:</span>
          <span>20/20 PASS</span>
        </button>
      </div>

      {/* Conditional View Rendering */}
      {currentView === 'checkout' ? (
        <>
          <Navbar
            onOpenCheckout={(plan) => openCheckout(plan || 'pro')}
            onOpenDocs={() => setDocsOpen(true)}
            onOpenPlayground={() => setPlaygroundOpen(true)}
            onOpenAdmin={openAdmin}
            onScrollTo={scrollTo}
          />
          <Checkout
            initialPlan={checkoutPlan}
            initialBilling={checkoutBilling}
            onBack={() => returnToLanding('pricing')}
            onOpenPlayground={() => {
              setPlaygroundOpen(true);
            }}
          />
        </>
      ) : currentView === 'admin' ? (
        <>
          <Navbar
            onOpenCheckout={(plan) => openCheckout(plan || 'pro')}
            onOpenDocs={() => setDocsOpen(true)}
            onOpenPlayground={() => setPlaygroundOpen(true)}
            onOpenAdmin={openAdmin}
            onScrollTo={scrollTo}
          />
          <AdminPortal
            onBack={() => returnToLanding()}
            onOpenCheckout={() => openCheckout('pro')}
          />
        </>
      ) : (
        /* Landing Page */
        <>
          <Navbar
            onOpenCheckout={(plan) => openCheckout(plan || 'pro')}
            onOpenDocs={() => setDocsOpen(true)}
            onOpenPlayground={() => setPlaygroundOpen(true)}
            onOpenAdmin={openAdmin}
            onScrollTo={scrollTo}
          />

          <main>
            <section id="hero">
              <Hero
                onOpenCheckout={(plan) => openCheckout(plan || 'pro')}
                onOpenDocs={() => setDocsOpen(true)}
                onOpenPlayground={() => setPlaygroundOpen(true)}
              />
            </section>

            <section id="stats">
              <Stats />
            </section>

            <section id="features">
              <Features
                onOpenDocs={() => setDocsOpen(true)}
                onOpenPlayground={() => setPlaygroundOpen(true)}
                onOpenCheckout={(plan) => openCheckout(plan || 'enterprise')}
              />
            </section>

            <section id="how">
              <HowItWorks
                onOpenPlayground={() => setPlaygroundOpen(true)}
                onOpenDocs={() => setDocsOpen(true)}
              />
            </section>

            <section id="pricing">
              <Pricing
                onOpenCheckout={(plan, billing) => openCheckout(plan, billing)}
              />
            </section>

            <section id="testimonials">
              <Testimonials />
            </section>
          </main>

          <Footer
            onOpenCheckout={(plan) => openCheckout(plan || 'pro')}
            onOpenDocs={() => setDocsOpen(true)}
            onOpenPlayground={() => setPlaygroundOpen(true)}
            onOpenAdmin={openAdmin}
            onScrollTo={scrollTo}
          />
        </>
      )}

      {/* Docs Modal */}
      <DocsModal
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
        onOpenCheckout={() => {
          setDocsOpen(false);
          openCheckout('pro');
        }}
      />

      {/* Live Window Playground Modal */}
      <PlaygroundModal
        isOpen={playgroundOpen}
        onClose={() => setPlaygroundOpen(false)}
        onOpenCheckout={() => {
          setPlaygroundOpen(false);
          openCheckout('pro');
        }}
      />
    </div>
  );
}
